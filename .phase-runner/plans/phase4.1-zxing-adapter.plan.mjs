export default {
  name: 'Phase 4.1 — install @zxing/browser and create scanner adapter',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Installs @zxing/browser as a runtime dependency and creates src/lib/qrScanner.js as an isolated adapter. No consumer yet — App.jsx untouched. Dynamic import inside start() keeps the adapter Node-safe for the self-check and lets Vite code-split ZXing out of the initial bundle.',
    },
    {
      type: 'check',
      label: 'install @zxing/browser',
      command: 'npm install @zxing/browser',
    },
    {
      type: 'write',
      label: 'create src/lib/qrScanner.js',
      path: 'src/lib/qrScanner.js',
      content: `// Isolated adapter around @zxing/browser.
// Screens depend on this module, not on ZXing directly.
//
// Contract:
//   const scanner = createQrScanner()
//   await scanner.start(videoElement, { onDecode, onError })
//   scanner.stop()
//   scanner.isStopped()
//
// - stop() is idempotent; releases the camera and stops the decoder.
// - onDecode fires at most once per distinct decoded text (deduped against
//   the previous text) so a held QR does not fire 60 times per second.
// - The adapter does NOT auto-stop after decode; the screen decides when to
//   accept a result and calls stop(). Rejecting an invalid payload keeps the
//   scanner alive so the visitor can try a different exhibit.
// - Dynamic import of @zxing/browser keeps this module Node-safe (for the
//   self-check) and lets Vite split the ~150 KB decoder out of the initial
//   bundle.

export function createQrScanner() {
  let controls = null
  let stopped = false
  let lastText = null

  async function start(videoElement, callbacks) {
    if (stopped || controls) return
    const { onDecode, onError } = callbacks || {}

    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser')
      if (stopped) return
      const reader = new BrowserQRCodeReader()

      controls = await reader.decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoElement,
        (result) => {
          if (stopped) return
          if (!result) return
          const text = result.getText()
          if (typeof text !== 'string' || text.length === 0) return
          if (text === lastText) return
          lastText = text
          if (onDecode) onDecode(text)
        }
      )
    } catch (err) {
      if (stopped) return
      if (onError) onError(err)
    }
  }

  function stop() {
    if (stopped) return
    stopped = true
    if (controls) {
      try {
        controls.stop()
      } catch {
        // controls.stop() may throw if the stream already ended; ignore.
      }
      controls = null
    }
  }

  function isStopped() {
    return stopped
  }

  return { start, stop, isStopped }
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-qr-scanner.mjs self-check',
      path: 'scripts/check-qr-scanner.mjs',
      content: `// Contract self-check for createQrScanner. Not a test framework, and does
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
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll QR scanner contract self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:scanner script',
      path: 'package.json',
      value: {
        scripts: {
          'check:scanner': 'node scripts/check-qr-scanner.mjs',
        },
      },
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'qr scanner contract self-check',
      command: 'npm run check:scanner',
    },
    {
      type: 'commit',
      label: 'commit zxing adapter',
      message: 'feat(scanner): add isolated @zxing/browser adapter',
      paths: [
        'src/lib/qrScanner.js',
        'scripts/check-qr-scanner.mjs',
        'package.json',
        'package-lock.json',
      ],
      as: 'adapter',
    },
    {
      type: 'write',
      label: 'record phase 4.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 4.1 — Install @zxing/browser and create scanner adapter\n\n**Status:** Complete (adapter contract only; no camera behavior verified yet)  \n**Goal:** Install the decoder dependency and isolate it behind src/lib/qrScanner.js so screen components depend on our adapter, not on ZXing.  \n**Files changed:** src/lib/qrScanner.js (new), scripts/check-qr-scanner.mjs (new), package.json (adds @zxing/browser dependency and check:scanner script), package-lock.json.  \n**User-visible result:** None — no screen consumes the adapter until Phase 4.2. App.jsx untouched.  \n**Automated checks:** npm run lint; npm run check:scanner (11 contract assertions).  \n**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check verifies the adapter contract but deliberately does NOT test camera behavior — that requires a real browser.  \n**Manual checks:** None at this phase.  \n**Not checked:** npm run build (deferred per user request). Real camera start, rear-camera selection, decode reliability, cleanup-after-success — all deferred to Phase 4.2/4.5 device testing.  \n**Remaining risks:** @zxing/browser bundle is roughly 150 KB gzipped; dynamic import means Vite code-splits it, so the welcome screen does not pay for it but the scanner screen pays it on first mount. Phase 10 performance review should confirm slow expo Wi-Fi is acceptable; a modulepreload hint is the fallback if not. decodeFromConstraints with facingMode 'environment' prefers the rear camera; some older Android browsers may still surface a chooser, which is acceptable. No cross-different-QR lock is implemented — if a visitor rapidly sweeps across two valid exhibits, both onDecode calls fire. The dedupe key is consecutive text only. Phase 7 will add the screen-level accept lock that resolves this.  \n**Decisions made:** Dynamic import inside start() rather than static top-level import so the adapter module is Node-safe (for the self-check) and Vite code-splits ZXing out of the initial bundle. createQrScanner() factory rather than class — matches AGENTS.md JavaScript + hooks preference. Adapter does NOT auto-stop on decode; the screen decides when to accept. This is intentional: an invalid QR payload (URL, random text) decodes successfully and must NOT terminate the scanner, because the visitor still needs to find the right exhibit. facingMode: 'environment' chosen over decodeFromVideoDevice (which picks the first camera and may default to the selfie cam on iOS).  \n**Next part:** Phase 4.2 — first spike UI wired to the adapter for real-device camera verification. This is the first phase that requires physical iOS Safari and Android Chrome testing; do not mark 4.2 as accepted without actual device results.  \n**Commit:** {{hash.adapter}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 4.1 progress',
      message: 'docs(progress): record phase 4.1 scanner adapter',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}