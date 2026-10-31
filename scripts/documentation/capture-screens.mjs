// Captures screenshots of every screen in every language using Playwright.
//
// Prerequisites:
//   1. npm install (installs playwright via devDependencies)
//   2. npx playwright install chromium (downloads Chromium, ~150MB)
//   3. npm run dev (running in another terminal on localhost:5173)
//
// Usage:
//   npm run docs:capture
//
// Output:
//   documentation/screenshots/{screen-id}-{lang}.jpg  (or -failed.jpg for misses)
//
// Resilience:
//   Individual screen failures do NOT exit 1. Missing screens are reported
//   with an actionable hint about which feature plan might be missing from
//   the current branch. The pipeline continues to docs:generate so the HTML
//   is always produced with placeholders for whatever was missed.

import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'node:fs'
import { screensContent } from '../../documentation/screens-content.mjs'

const BASE_URL = process.env.DOCS_BASE_URL || 'https://mahjong-web-neon.vercel.app'
const OUTPUT_DIR = 'documentation/screenshots'
const LANGUAGES = [
  { code: 'en', locale: 'en-US' },
  { code: 'id', locale: 'id-ID' },
  { code: 'zh', locale: 'zh-CN' },
]
const VIEWPORT = { width: 390, height: 844 }
const DEVICE_SCALE_FACTOR = 2
const LANG_STORAGE_KEY = 'storytelling-mirror-language'

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function checkServer() {
  try {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('HTTP ' + res.status)
  } catch (err) {
    console.error('')
    console.error('Cannot reach ' + BASE_URL)
    console.error('Start the dev server first, in another terminal:')
    console.error('  npm run dev')
    console.error('')
    console.error('Underlying error: ' + err.message)
    process.exit(1)
  }
}

// Probes optional features before the run so the user gets actionable
// feedback up front instead of deducing from capture failures.
async function probeFeature(probePage) {
  const probe = { deepLink: false, adminQR: false }

  try {
    await probePage.goto(BASE_URL + '/?exhibit=PSBIKT-006', { timeout: 10000 })
    await probePage.waitForSelector('.scan-result-screen', { timeout: 3000 })
    probe.deepLink = true
  } catch {
    probe.deepLink = false
  }

  try {
    await probePage.goto(BASE_URL + '/', { timeout: 10000 })
    await probePage.waitForSelector('.dev-admin-trigger', { timeout: 3000 })
    await probePage.locator('.dev-admin-trigger').click()
    await probePage.waitForSelector('.admin-list', { timeout: 3000 })
    await probePage.locator('button:has-text("QR Codes")').waitFor({ timeout: 3000 })
    probe.adminQR = true
  } catch {
    probe.adminQR = false
  }

  return probe
}

console.log(
  'Capturing ' +
    screensContent.length +
    ' screens x ' +
    LANGUAGES.length +
    ' languages = ' +
    screensContent.length * LANGUAGES.length +
    ' screenshots',
)
console.log('Base URL: ' + BASE_URL)
console.log('Viewport: ' + VIEWPORT.width + 'x' + VIEWPORT.height + ' at ' + DEVICE_SCALE_FACTOR + 'x DPI')
console.log('Output: ' + OUTPUT_DIR + '/*.jpg')
console.log('')

await checkServer()

const browser = await chromium.launch({
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
})

// ---- Prerequisite probe ----
console.log('=== Prerequisite check ===')
const probeContext = await browser.newContext({ viewport: VIEWPORT, permissions: ['camera'] })
const probePage = await probeContext.newPage()
probePage.setDefaultTimeout(5000)
const probe = await probeFeature(probePage)
await probeContext.close()

console.log('  Deep-link (?exhibit=) resolves to Scan Result:', probe.deepLink ? 'YES' : 'NO')
if (!probe.deepLink) {
  console.log('    -> scan-result and exhibit screenshots will fail to capture')
  console.log('    -> apply qr-deep-link-final.plan.mjs on this branch to enable deep linking')
}
console.log('  Admin QR Codes button present:', probe.adminQR ? 'YES' : 'NO')
if (!probe.adminQR) {
  console.log('    -> admin-qr screenshots will fail to capture')
  console.log('    -> apply admin-qr-codes.plan.mjs or admin-qr-frame.plan.mjs on this branch')
}
console.log('')

// ---- Capture loop ----
const failures = []

for (const lang of LANGUAGES) {
  console.log('=== ' + lang.code.toUpperCase() + ' (' + lang.locale + ') ===')

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    permissions: ['camera'],
    locale: lang.locale,
  })

  await context.addInitScript(
    (args) => {
      try {
        window.localStorage.setItem(args.key, args.value)
      } catch {
        // ignore — private mode may block localStorage
      }
    },
    { key: LANG_STORAGE_KEY, value: lang.code },
  )

  const page = await context.newPage()
  page.setDefaultTimeout(8000)

  for (const screen of screensContent) {
    const filename = screen.id + '-' + lang.code + '.jpg'
    const outputPath = OUTPUT_DIR + '/' + filename
    process.stdout.write('  ' + screen.id + ' -> ' + filename + ' ... ')

    try {
      await screen.navigate(page, BASE_URL)
      const waitMs = screen.waitMs || 800
      await page.waitForTimeout(waitMs)
      await page.screenshot({
        path: outputPath,
        type: 'jpeg',
        quality: 92,
        fullPage: false,
      })
      console.log('OK')
    } catch (err) {
      console.log('FAIL')
      failures.push({ lang: lang.code, screen: screen.id, message: err.message })
      try {
        await page.screenshot({
          path: OUTPUT_DIR + '/' + screen.id + '-' + lang.code + '-failed.jpg',
          type: 'jpeg',
          quality: 80,
          fullPage: false,
        })
      } catch {
        // if even that fails, nothing to do
      }
    }
  }

  await context.close()
}

await browser.close()

// ---- Summary ----
console.log('')
console.log('================')
console.log('Capture summary')
console.log('================')
const total = screensContent.length * LANGUAGES.length
const successCount = total - failures.length
console.log('Captured: ' + successCount + ' / ' + total + ' (' + Math.round((successCount / total) * 100) + '%)')

if (failures.length === 0) {
  console.log('All screenshots captured successfully.')
  process.exit(0)
}

console.log('')
console.log('Failed captures:')
const byFeature = { deepLink: [], adminQR: [], other: [] }
for (const f of failures) {
  if (f.screen === 'scan-result' || f.screen === 'exhibit') {
    byFeature.deepLink.push(f)
  } else if (f.screen === 'admin-qr') {
    byFeature.adminQR.push(f)
  } else {
    byFeature.other.push(f)
  }
}

if (byFeature.deepLink.length > 0) {
  console.log('  scan-result / exhibit (' + byFeature.deepLink.length + ' failures)')
  console.log('    These screens require deep-link support from App.jsx.')
  console.log('    Fix: run qr-deep-link-final.plan.mjs on this branch, then re-capture.')
}

if (byFeature.adminQR.length > 0) {
  console.log('  admin-qr (' + byFeature.adminQR.length + ' failures)')
  console.log('    The Admin dashboard lacks the QR Codes button.')
  console.log('    Fix: run admin-qr-codes.plan.mjs or admin-qr-frame.plan.mjs, then re-capture.')
}

if (byFeature.other.length > 0) {
  console.log('  Other (' + byFeature.other.length + ' failures):')
  for (const f of byFeature.other) {
    console.log('    ' + f.lang + '/' + f.screen + ': ' + f.message)
  }
}

console.log('')
console.log('Continuing to docs:generate anyway — HTML will have placeholders for missing screens.')
console.log('Re-run "npm run docs:capture" after fixing the above to fill them in.')
process.exit(0)
