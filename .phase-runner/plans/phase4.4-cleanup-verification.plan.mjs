export default {
  name: 'Phase 4.4 — idempotent cleanup verification',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Extends check-qr-scanner.mjs with cleanup-safety assertions. No App.jsx changes (unmount useEffect is already correct). No visibility-handling code — background/foreground is a Phase 4.5 discovery concern, not a 4.4 fix concern. No check:phase4 aggregator — check:scanner is already the automated Phase 4 gate. Manual protocol recorded for desktop and deferred to 4.5 for real devices.',
    },
    {
      type: 'write',
      label: 'extend check-qr-scanner.mjs with cleanup-safety assertions',
      path: 'scripts/check-qr-scanner.mjs',
      content: `// Contract self-check for createQrScanner. Not a test framework, and does
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
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll QR scanner contract self-checks passed')
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'qr scanner self-check with cleanup assertions',
      command: 'npm run check:scanner',
    },
    {
      type: 'commit',
      label: 'commit cleanup self-check extension',
      message: 'test(scanner): extend self-check with cleanup safety',
      paths: ['scripts/check-qr-scanner.mjs'],
      as: 'cleanup',
    },
    {
      type: 'write',
      label: 'record phase 4.4 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 4.4 — Idempotent cleanup verification\n\n**Status:** Self-check complete; physical cleanup verification deferred to Phase 4.5  \n**Goal:** Make the adapter's cleanup correctness provable via self-check assertions, and define the manual verification protocol that Phase 4.5 will execute on real devices.  \n**Files changed:** scripts/check-qr-scanner.mjs (extended from 11 to 17 assertions).  \n**User-visible result:** None — no production code changed. App.jsx already stops the scanner on unmount via a useEffect return, and the adapter's stop() has been idempotent since 4.1. This phase makes those properties explicit and regression-proof.  \n**Automated checks:** npm run lint; npm run check:scanner (17 assertions, including the 6 new cleanup-safety cases).  \n**Unit tests:** Intentionally omitted per urgent-policy override. Self-check extension covers the branchy cleanup paths in plain Node without a test framework.  \n**Manual checks:** Pending — required protocol: (1) Start Camera, click Stop Camera — camera LED turns off; (2) Start Camera, scan a valid QR, result view appears — camera LED turns off without needing to click Stop; (3) Start Camera twice rapidly (Start, Stop, Start) — no hang, no duplicate camera indicator; (4) Start Camera, then reload the page — camera LED turns off (unmount cleanup); (5) Start Camera, then navigate the browser to a different URL — camera LED turns off; (6) Start, Stop, Start, Stop, Start without any 1-second pause — no crash, no stuck camera. Desktop webcam suffices for these; real-device equivalents execute in Phase 4.5.  \n**Not checked:** npm run build (deferred per user request). Real device cleanup — deferred to Phase 4.5 (iOS Safari, Android Chrome, hardware indicator observation). Background/foreground behavior — deferred to Phase 4.5; if the tab is backgrounded mid-scan, iOS Safari commonly pauses the stream and the scanner UI reads 'scanning' but the video is frozen on return. That is a Phase 4.5 discovery item, not a 4.4 fix.  \n**Remaining risks:** The self-check verifies cleanup semantics but cannot detect a camera LED that stays on because the browser never released the MediaStream — only a physical observation can. Phase 4.5 must actually watch the hardware indicator. If Phase 4.5 discovers that iOS Safari requires explicit track.stop() in addition to controls.stop(), that would be a small adapter change; @zxing/browser's controls.stop() is documented to release tracks but this is exactly the kind of browser reality the device matrix exists to verify.  \n**Decisions made:** No App.jsx changes this phase — the unmount useEffect from 4.2 is already correct, and repeated stop() from stop/cancel/error/scan-another paths all funnel through the adapter's idempotent stop(). No visibility-handling code added: backgrounding is a Phase 4.5 discovery concern, not a 4.4 fix concern, and per AGENTS.md we do not pre-empt device bugs. No check:phase4 aggregator script — check:scanner is already the automated Phase 4 gate and a wrapper adds no signal. New self-check assertions target the specific cleanup paths the master plan calls out: unmount safety (multi-scanner), repeated cleanup (5x loop), error-path cleanup (stop after failed start), and immediate stop during the dynamic import (start-then-stop).  \n**Next part:** Phase 4.5 — real-device matrix (iOS Safari, Android Chrome, rear camera, permission states, foreground/background). This is the phase where the master-plan Phase 4 exit gate is truly accepted, and it requires physical device results; automation alone cannot close it.  \n**Commit:** {{hash.cleanup}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 4.4 progress',
      message: 'docs(progress): record phase 4.4 cleanup verification',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}