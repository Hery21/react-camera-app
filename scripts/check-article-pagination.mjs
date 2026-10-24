import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const sentenceStyles = readFileSync('src/styles/exhibit-sentence-pagination.css', 'utf8')
const viewportStyles = readFileSync('src/styles/exhibit-viewport.css', 'utf8')
const app = readFileSync('src/App.jsx', 'utf8')

const checks = [
  ['ResizeObserver pagination exists', screen.includes('ResizeObserver')],
  ['Previous action exists', screen.includes('exhibit-nav-previous') && screen.includes('Math.max(0, current - 1)')],
  [
    'Next action exists while another page remains',
    screen.includes('exhibit-nav-next') &&
      screen.includes('page < pages.length - 1') &&
      screen.includes('Math.min(pages.length - 1, current + 1)'),
  ],
  ['Page status is announced', screen.includes('aria-live="polite"')],
  ['Section change resets reader', screen.includes('handleSectionChange') && screen.includes('resetReader()')],
  ['Language change remounts article', app.includes("key={selectedExhibit.id + '-' + language}")],
  ['Article viewport clips overflow', viewportStyles.includes('.exhibit-page-viewport') && viewportStyles.includes('overflow: hidden')],
  ['Sentence page is rendered as one measured text block', screen.includes('pages[page]') && sentenceStyles.includes('.exhibit-page-text')],
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
