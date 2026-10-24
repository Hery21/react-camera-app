import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit.css', 'utf8')
const viewportStyles = readFileSync('src/styles/exhibit-viewport.css', 'utf8')
const app = readFileSync('src/App.jsx', 'utf8')

const checks = [
  ['ResizeObserver pagination exists', screen.includes('ResizeObserver')],
  ['Previous action exists', screen.includes('exhibit-nav-previous') && screen.includes('Math.max(0, current - 1)')],
  ['Next action exists', screen.includes('exhibit-nav-next') && screen.includes('Math.min(pageCount - 1, current + 1)')],
  ['Page status is announced', screen.includes('aria-live="polite"')],
  ['Section change resets page', screen.includes('setPage(0)')],
  ['Language change remounts article', app.includes("key={selectedExhibit.id + '-' + language}")],
  [
    'Article viewport exists and clips overflow',
    styles.includes('.exhibit-page-viewport') &&
      viewportStyles.includes('.exhibit-page-viewport') &&
      viewportStyles.includes('overflow: hidden'),
  ],
  ['Article uses column pagination', styles.includes('column-fill: auto')],
  ['Final page has no Scan Next action', !screen.includes('onScanNext')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) {
  console.error('Article pagination self-check failed')
  process.exit(1)
}

console.log('All article pagination checks passed')
