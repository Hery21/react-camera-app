import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-reader-controls.css', 'utf8')
const checks = [
  ['single integrated navigation footer', screen.includes('exhibit-navigation')],
  ['Previous action exists', screen.includes('exhibit-nav-previous')],
  ['Next only appears before final page', screen.includes('page < pages.length - 1')],
  ['Scan Next action removed', !screen.includes('onScanNext')],
  [
    'Previous and Next share vermilion treatment',
    styles.includes('.exhibit-nav-previous') &&
      styles.includes('.exhibit-nav-next') &&
      styles.includes('background: var(--color-vermilion)'),
  ],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('All integrated article navigation checks passed')
