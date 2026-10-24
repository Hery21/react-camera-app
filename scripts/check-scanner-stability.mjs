import { readFileSync } from 'node:fs'

const app = readFileSync('src/App.jsx', 'utf8')
const scanner = readFileSync('src/screens/ScannerScreen.jsx', 'utf8')
const adapter = readFileSync('src/lib/qrScanner.js', 'utf8')

let failed = 0

function check(label, condition, detail) {
  if (condition) {
    console.log('OK  ' + label)
    return
  }
  failed += 1
  console.error('FAIL ' + label + (detail ? ' — ' + detail : ''))
}

// 1. handleExhibitDetected must be wrapped in useCallback in App.jsx.
//    Without this, every parent render (e.g. language change) recreates
//    the handler, cascading through ScannerScreen's useCallback chain and
//    re-triggering the auto-start effect, restarting the camera.
check(
  'handleExhibitDetected is memoized with useCallback',
  /const handleExhibitDetected = useCallback\(/.test(app),
  'expected useCallback around handleExhibitDetected in App.jsx',
)

// 2. ScannerScreen uses the latest-ref pattern for auto-start so language
//    changes cannot restart the camera.
check(
  'ScannerScreen uses handleStartRef',
  scanner.includes('handleStartRef'),
  'expected handleStartRef latest-ref pattern in ScannerScreen',
)

check(
  'Auto-start effect has empty deps',
  /\}, \[\]\)\s*$/m.test(scanner.split('// Auto-start once on mount')[1] || ''),
  'expected auto-start effect to end with "}, [])"',
)

// 3. Adapter guards against the stop-during-start race.
check(
  'qrScanner releases pending controls if stopped mid-init',
  adapter.includes('pendingControls') && adapter.includes('if (stopped)'),
  'expected pendingControls handling in qrScanner.start()',
)

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll scanner stability checks passed')
