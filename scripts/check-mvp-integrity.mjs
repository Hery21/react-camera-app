import { readFileSync } from 'node:fs'

const files = [
  'src/App.jsx',
  'src/screens/ScannerScreen.jsx',
  'src/screens/ScanResultScreen.jsx',
  'src/screens/ExhibitScreen.jsx',
  'src/lib/qrPayload.js',
  'src/data/exhibits.js',
]
let failed = false

function check(condition, message) {
  console.log((condition ? 'OK  ' : 'FAIL') + message)
  if (!condition) failed = true
}

const contents = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]))
for (const [file, content] of contents) check(!content.includes('EXPO-'), file + ' has no obsolete EXPO identifier')

const app = contents.get('src/App.jsx')
const scanner = contents.get('src/screens/ScannerScreen.jsx')
const result = contents.get('src/screens/ScanResultScreen.jsx')
const exhibit = contents.get('src/screens/ExhibitScreen.jsx')

check(
  app.includes("setScreen('scanner')") && app.includes("setScreen('scan-result')") && app.includes("setScreen('exhibit')"),
  'App contains scanner result and exhibit transitions',
)
check(scanner.includes('onExhibitDetected') && scanner.includes('scannerRef.current.stop()'), 'Scanner reports success and retains cleanup')
check(result.includes('onViewDetails') && result.includes('onScanAgain'), 'Scan Result retains both actions')
check(exhibit.includes("id: 'gallery'") && exhibit.includes('exhibit-font-controls'), 'Exhibit retains Gallery and reader controls')
check(!exhibit.includes('onScanNext'), 'Exhibit no longer exposes Scan Next')

if (failed) process.exit(1)
console.log('All MVP integrity self-checks passed')
