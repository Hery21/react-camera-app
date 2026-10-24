import { readFileSync } from 'node:fs'

const progress = readFileSync('src/styles/scan-progress.css', 'utf8')
const welcome = readFileSync('src/styles/welcome.css', 'utf8')
const scanner = readFileSync('src/styles/scanner.css', 'utf8')
const result = readFileSync('src/styles/scan-result.css', 'utf8')
const exhibit = readFileSync('src/styles/exhibit.css', 'utf8')

const checks = [
  ['progress dock defines reserved height', progress.includes('--progress-dock-height')],
  ['progress dock is bottom-centered', progress.includes('.scan-progress-dock') && progress.includes('place-items: center')],
  ['Welcome reserves progress dock', welcome.includes('padding: 0 0 var(--progress-dock-height)')],
  ['Scanner controls clear progress dock', scanner.includes('bottom: var(--progress-dock-height)')],
  ['Scanner decorative lower corners clear dock', scanner.includes('6.5rem + var(--progress-dock-height)')],
  ['Scan Result ends above progress dock', result.includes('var(--result-header-height) 0 var(--progress-dock-height)')],
  ['Exhibit ends above progress dock', exhibit.includes('var(--exhibit-header-height) 0 var(--progress-dock-height)')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) {
  console.error('Progress layout self-check failed')
  process.exit(1)
}

console.log('All progress layout self-checks passed')
