import { readFileSync } from 'node:fs'

const styles = readFileSync('src/styles/exhibit.css', 'utf8')
const checks = [
  ['pagination has reserved height', styles.includes('min-height: 3.5rem')],
  ['actions have reserved height', styles.includes('min-height: 3.75rem')],
  ['pagination buttons are constrained', styles.includes('.exhibit-pagination button') && styles.includes('width: 100%')],
  ['actions remain separate from pagination', styles.includes('.exhibit-actions') && styles.includes('z-index: 1')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('All article control-layout checks passed')
