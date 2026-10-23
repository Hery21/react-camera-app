// Contract self-check for createQrScanner. Not a test framework, and does
// NOT open a camera. Real camera behavior is verified on physical devices in
// Phase 4.2 and Phase 4.5.
// Run: node scripts/check-qr-scanner.mjs   (or: npm run check:scanner)
import { createQrScanner } from '../src/lib/qrScanner.js'

let failed = 0

function expect(actual, expected, label) {
  if (actual === expected) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + ' — expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual))
  failed += 1
}

const scanner = createQrScanner()
expect(typeof scanner, 'object', 'factory returns object')
expect(typeof scanner.start, 'function', 'scanner.start is function')
expect(typeof scanner.stop, 'function', 'scanner.stop is function')
expect(typeof scanner.isStopped, 'function', 'scanner.isStopped is function')
expect(scanner.isStopped(), false, 'new scanner is not stopped')

scanner.stop()
expect(scanner.isStopped(), true, 'isStopped true after stop')
scanner.stop()
expect(scanner.isStopped(), true, 'second stop() is safe (idempotent)')

const startResult = scanner.start({}, { onDecode: () => {}, onError: () => {} })
expect(typeof startResult, 'object', 'start() returns a promise-like object')
expect(typeof startResult.then, 'function', 'start() returns a thenable')

const a = createQrScanner()
const b = createQrScanner()
a.stop()
expect(a.isStopped(), true, 'scanner a stopped')
expect(b.isStopped(), false, 'scanner b unaffected by stopping scanner a')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR scanner contract self-checks passed')
