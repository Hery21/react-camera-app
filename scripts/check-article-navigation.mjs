import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-navigation.css', 'utf8')
const checks = [
  ['single integrated navigation footer', screen.includes('exhibit-navigation')],
  ['old formal pagination footer removed', !screen.includes('exhibit-pagination')],
  ['bottom Back to Result button removed', !screen.includes('onBackToResult')],
  ['Previous is available after page one', screen.includes('handlePrevious')],
  ['Next uses vermilion integrated control', styles.includes('.exhibit-nav-next') && styles.includes('var(--color-vermilion)')],
  ['last page becomes Scan Next Exhibit', screen.includes("getTranslation(language, 'exhibit.scanNext')")],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('All integrated article navigation checks passed')
