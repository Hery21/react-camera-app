// Scans src/**/*.{jsx,js} for /src/assets/ literals which 404 in
// production builds. Vite bundles src/assets/* to hashed /assets/*
// URLs at build time; the raw /src/assets/ path is dev-only.
// The correct pattern is: import x from '../assets/x.webp'.
// Run: node scripts/check-vite-assets.mjs   (or: npm run check:vite-assets)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(jsx?|mjs)$/.test(entry.name)) out.push(full)
  }
  return out
}

const files = walk('src')
const offenders = []

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  if (/\/src\/assets\//.test(content)) {
    const matches = content.match(/\/src\/assets\/[^"'\s)]+/g) || []
    offenders.push({ file, matches: [...new Set(matches)] })
  }
}

if (offenders.length === 0) {
  console.log('OK  No /src/assets/ literals in src/')
  console.log('\nAll vite asset checks passed')
  process.exit(0)
}

console.error('FAIL Found /src/assets/ literal references that break production builds:')
for (const { file, matches } of offenders) {
  console.error(' - ' + file)
  for (const m of matches) console.error('    ' + m)
}
console.error('\nUse: import x from \'../assets/x.webp\' and reference {x} in JSX.')
process.exit(1)
