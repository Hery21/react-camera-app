import { readFileSync } from 'node:fs'

const app = readFileSync('src/App.jsx', 'utf8')
const shell = readFileSync('src/components/AppShell.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-controls.css', 'utf8')
const checks = [
  ['exhibit passes dedicated Back to Info label', app.includes("getTranslation(language, 'exhibit.backToInfo')")],
  ['AppShell accepts backLabel', shell.includes('backLabel')],
  ['labeled header back control exists', shell.includes('app-header-back-labeled')],
  ['Previous uses vermilion background', styles.includes('.exhibit-nav-previous') && styles.includes('background: var(--color-vermilion)')],
  ['first-page Previous remains hidden', styles.includes('visibility: hidden')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}
if (failed) process.exit(1)
console.log('All article control-treatment checks passed')
