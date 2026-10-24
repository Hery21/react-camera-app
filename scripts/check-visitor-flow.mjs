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
  ['Scan Next returns to scanner', app.includes('handleScanNext') && app.includes("setScreen('scanner')")],
  ['Scanner reports accepted exhibit upward', scanner.includes('onExhibitDetected')],
  ['Scanner auto-start is scheduled', scanner.includes('queueMicrotask') && scanner.includes('handleStart')],
  ['Scanner cleanup still stops adapter', scanner.includes('scannerRef.current.stop()')],
  ['Result exposes View Details', result.includes('onViewDetails')],
  ['Result exposes Scan Again', result.includes('onScanAgain')],
  ['Article exposes Scan Next', exhibit.includes('onScanNext')],
  ['Article exposes Back to Result', exhibit.includes('onBackToResult')],
  ['Article supports Gallery', exhibit.includes("id: 'gallery'")],
  ['Gallery images are lazy-loaded', exhibit.includes('loading="lazy"')],
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
