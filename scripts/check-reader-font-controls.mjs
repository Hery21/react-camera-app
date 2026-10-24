import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-reader-controls.css', 'utf8')

const checks = [
  [
    'three text size levels exist',
    styles.includes('exhibit-text-size-0') && styles.includes('exhibit-text-size-1') && styles.includes('exhibit-text-size-2'),
  ],
  ['smaller and larger controls exist', screen.includes('A−') && screen.includes('A+')],
  [
    'font change resets sentence pages',
    screen.includes('handleTextSizeChange') && screen.includes('setTextSize(nextSize)') && screen.includes('resetReader()'),
  ],
  ['font size is reflected in reader class', screen.includes("'exhibit-screen exhibit-text-size-' + textSize")],
  ['font change schedules sentence repagination', screen.includes('requestAnimationFrame(repaginate)')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) {
  console.error('Reader font-control self-check failed')
  process.exit(1)
}

console.log('All reader font-control checks passed')
