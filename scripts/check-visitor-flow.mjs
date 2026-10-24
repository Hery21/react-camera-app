import { readFileSync } from 'node:fs'

const app = readFileSync('src/App.jsx', 'utf8')
const scanner = readFileSync('src/screens/ScannerScreen.jsx', 'utf8')
const result = readFileSync('src/screens/ScanResultScreen.jsx', 'utf8')
const exhibit = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')

const checks = [
  ['App owns selected exhibit', app.includes('selectedExhibit')],
  ['App has scan-result state', app.includes("setScreen('scan-result')")],
  ['App has exhibit state', app.includes("setScreen('exhibit')")],
  ['Scan Again returns to scanner', app.includes('handleScanAgain') && app.includes("setScreen('scanner')")],

  ['App wires article Back to Result', app.includes('onBackToResult={handleBackToResult}')],
  ['Scanner reports accepted exhibit upward', scanner.includes('onExhibitDetected')],
  ['Scanner auto-start is scheduled', scanner.includes('queueMicrotask') && scanner.includes('handleStart')],
  ['Scanner cleanup still stops adapter', scanner.includes('releaseCamera') && scanner.includes('scannerRef.current = null')],
  ['Result exposes View Details', result.includes('onViewDetails')],
  ['Result exposes Scan Again', result.includes('onScanAgain')],
  ['Article top Back returns to Result', app.includes("screen === 'exhibit'") && app.includes('handleBackToResult')],
  ['Article uses paged reader viewport', exhibit.includes('exhibit-reader') && exhibit.includes('exhibit-page-viewport')],
  ['Article exposes page navigation', exhibit.includes('exhibit-page-navigation') && exhibit.includes('exhibit-page-status')],
  ['Article uses Previous arrow asset', exhibit.includes('decorativeAssets.gallery.previous')],
  ['Article uses Next arrow asset', exhibit.includes('decorativeAssets.gallery.next')],
  ['Article supports Gallery', exhibit.includes("id: 'gallery'")],
  ['Gallery images are lazy-loaded', exhibit.includes('loading="lazy"')],

  ['Article exposes Back to Result action', exhibit.includes('onBackToResult')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) {
  console.error('Visitor flow self-check failed')
  process.exit(1)
}

console.log('All visitor flow self-checks passed')
