#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const RUNNER_VERSION = '1.0'
const args = process.argv.slice(2)
const flags = new Set(args.filter((arg) => arg.startsWith('--')))
const planArg = args.find((arg) => !arg.startsWith('--'))

if (!planArg) {
  console.error('Usage: node .phase-runner/run.mjs <plan.mjs> [--dry-run] [--allow-dirty] [--keep]')
  process.exit(1)
}

const root = process.cwd()
const planPath = resolve(root, planArg)
const dryRun = flags.has('--dry-run')
const allowDirty = flags.has('--allow-dirty')
const keep = flags.has('--keep')
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const stem = basename(planPath).replace(/\.mjs$/, '')
const logDir = resolve(root, '.phase-runner/logs')
const reportDir = resolve(root, '.phase-runner/reports')
const logPath = resolve(logDir, `${stem}-${stamp}${dryRun ? '-dry' : ''}.log`)
const reportPath = resolve(reportDir, `${stem}-${stamp}${dryRun ? '-dry' : ''}.json`)
mkdirSync(logDir, { recursive: true })
mkdirSync(reportDir, { recursive: true })

function log(message = '') {
  console.log(message)
  appendFileSync(logPath, `${message}\n`)
}

function shell(command, { allowFailure = false, capture = false } = {}) {
  const result = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  })
  if (!allowFailure && result.status !== 0) throw new Error(`Command failed (${result.status}): ${command}`)
  return result
}

function gitOutput(command) {
  const result = shell(command, { capture: true })
  return (result.stdout || '').trim()
}

function ensureParent(path) {
  mkdirSync(dirname(resolve(root, path)), { recursive: true })
}

function interpolate(value, context) {
  if (typeof value !== 'string') return value
  return value.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const result = key.trim().split('.').reduce((current, part) => current?.[part], context)
    if (result === undefined) throw new Error(`Unresolved placeholder {{${key}}}`)
    return String(result)
  })
}

const imported = await import(pathToFileURL(planPath).href)
const plan = imported.default
if (!plan?.name || !Array.isArray(plan.steps)) throw new Error('Plan must export default { name, steps }')

log(`▶ ${plan.name}${dryRun ? ' (DRY RUN)' : ''}`)
log(`phase-runner v${RUNNER_VERSION}`)
log(`log: ${logPath.replace(root + '/', '')}`)

const status = gitOutput('git status --porcelain')
if (status && !allowDirty) {
  throw new Error('Working tree is dirty. Commit/stash changes or rerun with --allow-dirty.')
}

const context = {
  startedAt: new Date().toISOString(),
  startHead: gitOutput('git rev-parse --short HEAD'),
  hash: {},
  values: {},
}
log(`starting at HEAD ${context.startHead}`)

function applyWrite(step) {
  const target = interpolate(step.path, context)
  const content = interpolate(step.content, context)
  ensureParent(target)
  if (step.mode === 'append') appendFileSync(resolve(root, target), content)
  else writeFileSync(resolve(root, target), content)
}

function applyReplace(step) {
  const target = resolve(root, interpolate(step.path, context))
  const before = readFileSync(target, 'utf8')
  const find = interpolate(step.find, context)
  const replace = interpolate(step.replace, context)
  if (!before.includes(find)) throw new Error(`Replace target not found in ${step.path}`)
  const occurrences = before.split(find).length - 1
  if (step.once !== false && occurrences !== 1) throw new Error(`Expected exactly one match in ${step.path}, found ${occurrences}`)
  writeFileSync(target, step.once === false ? before.split(find).join(replace) : before.replace(find, replace))
}

function applyJsonMerge(step) {
  const target = resolve(root, interpolate(step.path, context))
  const parsed = JSON.parse(readFileSync(target, 'utf8'))
  const merged = { ...parsed, ...step.value }
  if (step.value?.scripts) merged.scripts = { ...(parsed.scripts || {}), ...step.value.scripts }
  writeFileSync(target, `${JSON.stringify(merged, null, 2)}\n`)
}

function modifiedFiles() {
  const text = gitOutput('git status --porcelain')
  return text ? text.split(/\r?\n/).map((line) => line.slice(3)).filter(Boolean) : []
}

function commitStep(step) {
  const message = interpolate(step.message, context)
  const paths = step.paths?.map((p) => interpolate(p, context)) || []
  const addCommand = paths.length
    ? `git add -- ${paths.map((p) => JSON.stringify(p)).join(' ')}`
    : 'git add -A'
  shell(addCommand)
  const staged = shell('git diff --cached --quiet', { allowFailure: true })
  if (staged.status === 0) {
    if (step.allowEmpty) {
      shell(`git commit --allow-empty -m ${JSON.stringify(message)}`)
    } else {
      log('   ↷ nothing to commit')
      return
    }
  } else {
    shell(`git commit -m ${JSON.stringify(message)}`)
  }
  const hash = gitOutput('git rev-parse --short HEAD')
  if (step.as) context.hash[step.as] = hash
  log(`   committed ${hash}`)
}

const results = []
try {
  for (let index = 0; index < plan.steps.length; index += 1) {
    const step = plan.steps[index]
    const label = step.label || step.type
    const n = index + 1
    if (dryRun && !['check', 'note'].includes(step.type)) {
      log(`${n}. ↷ ${label} DRY-RUN`)
      results.push({ step: n, label, status: 'dry-run' })
      continue
    }

    log(`${n}. … ${label}`)
    switch (step.type) {
      case 'write': applyWrite(step); break
      case 'replace': applyReplace(step); break
      case 'jsonMerge': applyJsonMerge(step); break
      case 'command': shell(interpolate(step.command, context)); break
      case 'check': shell(interpolate(step.command, context)); break
      case 'commit': commitStep(step); break
      case 'note': log(`   ${interpolate(step.message, context)}`); break
      default: throw new Error(`Unknown step type: ${step.type}`)
    }
    log(`${n}. ✔ ${label}`)
    results.push({ step: n, label, status: 'ok' })
  }

  context.finishedAt = new Date().toISOString()
  const report = { plan: plan.name, version: RUNNER_VERSION, dryRun, context, results, files: modifiedFiles() }
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  log('✔ Plan complete')
  log(`report: ${reportPath.replace(root + '/', '')}`)
} catch (error) {
  context.finishedAt = new Date().toISOString()
  writeFileSync(reportPath, `${JSON.stringify({ plan: plan.name, version: RUNNER_VERSION, dryRun, context, results, error: error.message }, null, 2)}\n`)
  log(`✘ STOP: ${error.message}`)
  log(`report: ${reportPath.replace(root + '/', '')}`)
  if (!keep && !dryRun) log('Working changes were kept for inspection. The runner never hard-resets your repository.')
  process.exit(1)
}
