// Contract self-check for createQrScanner. Not a test framework, and does
// NOT open a camera. Real camera behavior is verified on physical devices in
// Phase 4.5.
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

// --- Contract shape ---
const scanner = createQrScanner()
expect(typeof scanner, 'object', 'factory returns object')
expect(typeof scanner.start, 'function', 'scanner.start is function')
expect(typeof scanner.stop, 'function', 'scanner.stop is function')
expect(typeof scanner.isStopped, 'function', 'scanner.isStopped is function')
expect(scanner.isStopped(), false, 'new scanner is not stopped')

// --- Idempotent stop ---
scanner.stop()
expect(scanner.isStopped(), true, 'isStopped true after stop')
scanner.stop()
expect(scanner.isStopped(), true, 'second stop() is safe (idempotent)')

// --- start() after stop() is a no-op that still returns a thenable ---
const startResult = scanner.start({}, { onDecode: () => {}, onError: () => {} })
expect(typeof startResult, 'object', 'start() returns a promise-like object')
expect(typeof startResult.then, 'function', 'start() returns a thenable')

// --- Multi-scanner independence ---
const a = createQrScanner()
const b = createQrScanner()
a.stop()
expect(a.isStopped(), true, 'scanner a stopped')
expect(b.isStopped(), false, 'scanner b unaffected by stopping scanner a')

// --- Cleanup safety (Phase 4.4 additions) ---

// start() then immediate stop() during the dynamic import resolves cleanly.
const s2 = createQrScanner()
const pending = s2.start({}, { onDecode: () => {}, onError: () => {} })
s2.stop()
await pending
expect(s2.isStopped(), true, 'start-then-immediate-stop leaves scanner stopped')

// stop() after a failed start() does not throw.
// In Node, @zxing/browser imports successfully but navigator.mediaDevices
// is unavailable, so start() lands in the onError branch. The scanner must
// still be in a safe state for a subsequent stop().
const s3 = createQrScanner()
await s3.start({}, { onDecode: () => {}, onError: () => {} })
s3.stop()
expect(s3.isStopped(), true, 'stop after failed start is safe')

// Repeated stop() on an already-stopped scanner is safe.
for (let i = 0; i < 5; i += 1) s3.stop()
expect(s3.isStopped(), true, '5x repeated stop is safe')

// A stopped scanner can be discarded and replaced without leaking state.
const s4 = createQrScanner()
s4.stop()
const s5 = createQrScanner()
expect(s4.isStopped(), true, 'replaced scanner s4 remains stopped')
expect(s5.isStopped(), false, 'replacement scanner s5 starts fresh')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR scanner contract self-checks passed')
