import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit.css', 'utf8')
const app = readFileSync('src/App.jsx', 'utf8')
const checks = [
  ['ResizeObserver pagination exists', screen.includes('ResizeObserver')],
  ['Previous action exists', screen.includes('handlePrevious')],
  ['Next action exists', screen.includes('handleNext')],
  ['Page status is announced', screen.includes('aria-live="polite"')],
  ['Section change resets page', screen.includes('setPage(0)')],
  ['Language change remounts article', app.includes("key={selectedExhibit.id + '-' + language}")],
  ['Article viewport exists', styles.includes('.exhibit-page-viewport')],
  ['Article uses columns', styles.includes('column-fill: auto')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('All article pagination checks passed')
