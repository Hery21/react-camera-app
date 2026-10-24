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
check(
  'handleExhibitDetected is memoized with useCallback',
  /const handleExhibitDetected = useCallback\(/.test(app),
  'expected useCallback around handleExhibitDetected in App.jsx',
)

// 2. ScannerScreen uses latest-ref pattern and empty-deps auto-start effect.
check('ScannerScreen uses handleStartRef', scanner.includes('handleStartRef'))
check(
  'Auto-start effect has empty deps',
  /\}, \[\]\)\s*$/m.test(scanner.split('// Auto-start once on mount')[1] || ''),
)

// 3. ScannerScreen explicitly releases tracks on unmount.
check(
  'ScannerScreen cleanup releases tracks and srcObject',
  scanner.includes('releaseCamera') &&
    (scanner.includes('srcObject = null') || scanner.includes('srcObject=null')),
  'expected releaseCamera helper with srcObject nulling',
)

check(
  'releaseCamera stops every media track',
  scanner.includes('getTracks') && scanner.includes('track.stop'),
)

// 4. Adapter releases pending controls if stopped mid-init.
check(
  'qrScanner releases pending controls if stopped mid-init',
  adapter.includes('pendingControls') && adapter.includes('if (stopped)'),
)

// 5. Adapter nulls srcObject in the pendingControls race path.
check(
  'qrScanner nulls srcObject in race path',
  adapter.includes('srcObject = null'),
)

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll scanner stability checks passed')
