import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const layout = readFileSync('src/styles/exhibit-layout.css', 'utf8')
const appStyles = readFileSync('src/App.css', 'utf8')

const layoutImport = "@import './styles/exhibit-layout.css';"
const sentenceImport = "@import './styles/exhibit-sentence-pagination.css';"
const controlsImport = "@import './styles/exhibit-reader-controls.css';"
const viewportImport = "@import './styles/exhibit-viewport.css';"
const layoutIndex = appStyles.indexOf(layoutImport)

const checks = [
  ['article renders text before pagination finishes', screen.includes('useState(() => [content.story])')],
  ['unusable page heights are ignored', screen.includes('pageHeight < MIN_USABLE_PAGE_HEIGHT')],
  ['screen is a flex column', layout.includes('.app--exhibit .exhibit-screen') && layout.includes('flex-direction: column')],
  ['reader takes the remaining height', layout.includes('.app--exhibit .exhibit-reader') && layout.includes('flex: 1 1 0')],
  ['page text cannot collapse the viewport', layout.includes('position: absolute') && layout.includes('inset: 0')],
  ['grid row placement is cleared', layout.includes('grid-row: auto')],
  ['layout stylesheet is imported', layoutIndex >= 0],
  [
    'layout fix loads after earlier exhibit reader styles',
    layoutIndex > appStyles.indexOf(viewportImport) &&
      layoutIndex > appStyles.indexOf(controlsImport) &&
      layoutIndex > appStyles.indexOf(sentenceImport),
  ],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) {
  console.error('Article layout self-check failed')
  process.exit(1)
}

console.log('All article layout checks passed')
