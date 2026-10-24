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

function fail(message) {
  console.error('FAIL ' + message)
  failed = true
}

function pass(message) {
  console.log('OK  ' + message)
}

const contents = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]))

for (const [file, content] of contents) {
  if (content.includes('EXPO-')) fail(file + ' still contains obsolete EXPO identifier')
  else pass(file + ' has no obsolete EXPO identifier')
}

const app = contents.get('src/App.jsx')
const scanner = contents.get('src/screens/ScannerScreen.jsx')
const result = contents.get('src/screens/ScanResultScreen.jsx')
const exhibit = contents.get('src/screens/ExhibitScreen.jsx')

if (app.includes("setScreen('scanner')") && app.includes("setScreen('scan-result')") && app.includes("setScreen('exhibit')")) {
  pass('App contains scanner result and exhibit transitions')
} else {
  fail('App is missing an MVP screen transition')
}

if (scanner.includes('onExhibitDetected') && scanner.includes('scannerRef.current.stop()')) {
  pass('Scanner reports success and retains cleanup')
} else {
  fail('Scanner success or cleanup contract missing')
}

if (result.includes('onViewDetails') && result.includes('onScanAgain')) {
  pass('Scan Result retains both actions')
} else {
  fail('Scan Result action contract missing')
}

if (
  exhibit.includes("id: 'gallery'") &&
  exhibit.includes('exhibit-reader') &&
  exhibit.includes('exhibit-page-viewport') &&
  exhibit.includes('exhibit-page-navigation')
) {
  pass('Exhibit retains Gallery and paged reader controls')
} else {
  fail('Exhibit Gallery or paged reader contract missing')
}

if (exhibit.includes('decorativeAssets.gallery.previous') && exhibit.includes('decorativeAssets.gallery.next')) {
  pass('Exhibit paged reader uses decorative arrow assets')
} else {
  fail('Exhibit paged reader arrow assets missing')
}

if (exhibit.includes('onScanNext') && exhibit.includes('onBackToResult')) {
  pass('Exhibit retains Scan Next and Back to Result actions')
} else {
  fail('Exhibit action contract incomplete')
}

if (failed) {
  console.error('MVP integrity self-check failed')
  process.exit(1)
}

console.log('All MVP integrity self-checks passed')
