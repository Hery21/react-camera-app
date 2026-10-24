export default {
  name: 'Phase 4.3 — inline validation and acceptance lock',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Moves the spike from "shows any decoded text" to "validates inline and transitions exactly once on a valid exhibit". Synchronous lock via useRef (not useState) so two rapid onDecode calls cannot both transition. Invalid and unknown payloads show an inline error and keep the scanner alive. Result view is text-only (images come in Phase 8). Language toggle updates the result title, proving trilingual plumbing via UI.',
    },
    {
      type: 'write',
      label: 'rewrite App.jsx with acceptance lock and inline validation',
      path: 'src/App.jsx',
      content: `import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getTranslation } from './i18n/getTranslation.js'
import {
  SUPPORTED_LANGUAGES,
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'
import { createQrScanner } from './lib/qrScanner.js'
import { parseQrPayload } from './lib/qrPayload.js'
import { getExhibitById } from './lib/exhibitLookup.js'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [scannerState, setScannerState] = useState('idle')
  const [decodedText, setDecodedText] = useState('')
  const [inlineError, setInlineError] = useState(null)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const acceptedRef = useRef(false)

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current = null
      }
    }
  }, [])

  function handleLanguageChange(next) {
    if (!SUPPORTED_LANGUAGES.includes(next) || next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  function handleDecode(text) {
    // Synchronous lock: refs update before the next line runs, so two rapid
    // onDecode calls cannot both pass this guard. useState would race here.
    if (acceptedRef.current) return
    setDecodedText(text)

    const parsed = parseQrPayload(text)
    if (!parsed.ok) {
      setInlineError({ kind: parsed.reason, detail: '' })
      return
    }

    const lookup = getExhibitById(parsed.exhibitId)
    if (!lookup.ok) {
      setInlineError({ kind: lookup.reason, detail: parsed.exhibitId })
      return
    }

    acceptedRef.current = true
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }
    setInlineError(null)
    setResult({ exhibit: lookup.exhibit, parsedId: parsed.exhibitId })
  }

  async function handleStart() {
    if (!videoRef.current) return
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }

    const scanner = createQrScanner()
    scannerRef.current = scanner
    acceptedRef.current = false
    setDecodedText('')
    setErrorMessage('')
    setInlineError(null)
    setResult(null)
    setScannerState('requesting')

    await scanner.start(videoRef.current, {
      onDecode: handleDecode,
      onError: (err) => {
        setErrorMessage(err?.message || String(err))
        setScannerState('error')
      },
    })

    setScannerState((s) => (s === 'requesting' ? 'scanning' : s))
  }

  function handleStop() {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }
    acceptedRef.current = false
    setScannerState('idle')
    setDecodedText('')
    setErrorMessage('')
    setInlineError(null)
    setResult(null)
  }

  function handleScanAnother() {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }
    acceptedRef.current = false
    setResult(null)
    setInlineError(null)
    setDecodedText('')
    setScannerState('idle')
  }

  const resultContent = result
    ? result.exhibit.content[language] || result.exhibit.content.en
    : null

  return (
    <main className="app">
      <header className="app-header">
        <div
          className="language-toggle"
          role="group"
          aria-label={getTranslation(language, 'language.label')}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              className="language-toggle-button"
              aria-pressed={language === code}
              aria-label={getTranslation(language, 'language.' + code + 'FullName')}
              onClick={() => handleLanguageChange(code)}
            >
              {getTranslation(language, 'language.' + code)}
            </button>
          ))}
        </div>
      </header>

      <section className="app-main">
        <div className="placeholder" aria-labelledby="app-title">
          <p className="eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
          <h1 id="app-title">{getTranslation(language, 'app.title')}</h1>
          <p>{getTranslation(language, 'app.tagline')}</p>

          {result && resultContent ? (
            <div className="spike-result" aria-live="polite">
              <p className="spike-state">Matched: {result.parsedId}</p>
              <h2 className="spike-result-title">{resultContent.title}</h2>
              {resultContent.period && (
                <p className="spike-result-period">{resultContent.period}</p>
              )}
              <p className="spike-result-summary">{resultContent.summary}</p>
              <button type="button" className="spike-button" onClick={handleScanAnother}>
                Scan Another
              </button>
            </div>
          ) : (
            <div className="spike">
              <p className="spike-state">Scanner state: {scannerState}</p>

              <div className="spike-video-wrapper">
                <video
                  ref={videoRef}
                  className="spike-video"
                  playsInline
                  muted
                />
                {scannerState === 'idle' && (
                  <p className="spike-placeholder">Camera off</p>
                )}
                {scannerState === 'requesting' && (
                  <p className="spike-placeholder">Requesting camera…</p>
                )}
              </div>

              {scannerState === 'idle' && (
                <button type="button" className="spike-button" onClick={handleStart}>
                  Start Camera
                </button>
              )}
              {scannerState === 'requesting' && (
                <button type="button" className="spike-button" disabled>
                  Starting…
                </button>
              )}
              {scannerState === 'scanning' && (
                <button type="button" className="spike-button" onClick={handleStop}>
                  Stop Camera
                </button>
              )}
              {scannerState === 'error' && (
                <div className="spike-error">
                  <p>Camera error: {errorMessage}</p>
                  <button type="button" className="spike-button" onClick={handleStart}>
                    Try Again
                  </button>
                  <button type="button" className="spike-button" onClick={handleStop}>
                    Cancel
                  </button>
                </div>
              )}

              {decodedText && (
                <div className="spike-decoded">
                  <p>Last decoded:</p>
                  <pre>{decodedText}</pre>
                </div>
              )}

              {inlineError && (
                <p className="spike-inline-error" role="status">
                  {inlineError.kind === 'unknown-exhibit'
                    ? 'Unknown exhibit: ' + inlineError.detail + ' — keep scanning'
                    : 'Invalid code (' + inlineError.kind + ') — keep scanning'}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
`,
    },
    {
      type: 'write',
      label: 'extend App.css with spike result and inline-error styles',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.placeholder {
  width: min(100%, 32rem);
  text-align: center;
}

.placeholder h1 {
  margin: 0.5rem 0;
}

.placeholder p {
  margin: 0;
}

.eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.language-toggle {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #fffaf0;
  border: 1px solid #d4af37;
  border-radius: 999px;
}

.language-toggle-button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #4a2e26;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.language-toggle-button:hover {
  background: #f7ead9;
}

.language-toggle-button[aria-pressed="true"] {
  background: #b32222;
  color: #fffaf0;
}

.language-toggle-button:focus-visible {
  outline: 2px solid #4a2e26;
  outline-offset: 2px;
}

/* Spike — Phase 4.2/4.3 only. Replaced by the production scanner in Phase 7. */
.spike {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.spike-state {
  font-size: 0.75rem;
  font-family: monospace;
  color: #666;
}

.spike-video-wrapper {
  position: relative;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1 / 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.spike-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.spike-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: #fff;
  font-size: 0.875rem;
  background: rgba(0, 0, 0, 0.5);
}

.spike-button {
  min-height: 44px;
  padding: 0.5rem 1rem;
  border: 1px solid #4a2e26;
  border-radius: 6px;
  background: #4a2e26;
  color: #fffaf0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.spike-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spike-button:focus-visible {
  outline: 2px solid #b32222;
  outline-offset: 2px;
}

.spike-error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #9f1f1f;
  border-radius: 6px;
  background: #fdeaea;
  color: #4a2e26;
  max-width: 360px;
}

.spike-decoded {
  width: 100%;
  max-width: 360px;
  padding: 0.75rem;
  background: #fffaf0;
  border: 1px solid #d4af37;
  border-radius: 6px;
  text-align: left;
  word-break: break-all;
}

.spike-decoded pre {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  white-space: pre-wrap;
}

.spike-inline-error {
  width: 100%;
  max-width: 360px;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d4af37;
  border-radius: 6px;
  background: #fff4d6;
  color: #4a2e26;
  font-size: 0.875rem;
  text-align: left;
}

.spike-result {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #d4af37;
  border-radius: 6px;
  background: #fffaf0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spike-result-title {
  margin: 0;
  font-size: 1.25rem;
  color: #4a2e26;
}

.spike-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.spike-result-summary {
  margin: 0;
  font-size: 0.95rem;
  color: #2a211d;
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit acceptance lock',
      message: 'feat(scanner): add inline validation and acceptance lock',
      paths: ['src/App.jsx', 'src/App.css'],
      as: 'accept',
    },
    {
      type: 'write',
      label: 'record phase 4.3 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 4.3 — Inline validation and acceptance lock\n\n**Status:** Code complete; manual spike test pending user report  \n**Goal:** Move the spike from "shows any decoded text" to "validates inline and transitions exactly once on a valid exhibit". Satisfies the master-plan Phase 4.3 acceptance: holding one QR causes one transition, and rapid cross-QR sweeps cannot both accept.  \n**Files changed:** src/App.jsx (rewritten), src/App.css (extended with spike-result and spike-inline-error styles).  \n**User-visible result:** On decode, the scanned text now passes through parseQrPayload -> getExhibitById. A valid EXPO-NNN that maps to a fixture stops the scanner and shows the exhibit title, period, and summary in the current UI language. An invalid payload (empty / unsupported-format) or a valid-format-but-unknown id shows an inline warning and keeps scanning alive. Clicking Scan Another resets to idle. Language toggle re-renders the exhibit title in the selected language.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override. The parse/lookup pipeline was fully covered by check:qr, check:exhibit, check:validate, and check:phase3 in Phase 3. Phase 4.3's new code is state wiring, which Node cannot verify without mocking the scanner — manual spike test is the appropriate gate.  \n**Manual checks:** Pending. Required: (1) npm run dev; (2) generate QR codes for EXPO-001, EXPO-002, EXPO-999, and a URL such as https://example.com/qr-test; (3) scan EXPO-001 — result shows Peranakan Vase, scanner state goes to idle, camera LED off; (4) click Scan Another, scan EXPO-002 — result shows Beaded Slippers; (5) scan EXPO-999 — inline error Unknown exhibit: EXPO-999, scanner keeps running, camera LED still on; (6) scan https://example.com/qr-test — inline error Invalid code (unsupported-format), scanner keeps running; (7) with result visible, click 中文 — title becomes 娘惹花瓶; click ID — title becomes Vas Peranakan; (8) hold EXPO-001 in frame and do not move the phone — exactly one transition (to the result view), no flicker or duplicate.  \n**Not checked:** npm run build (deferred per user request). Real mobile devices — deferred to Phase 4.5. Physical expo QR codes — deferred to Phase 11. Result images — fixtures reference /images/exhibits/... which do not exist yet, so the spike's result view is text-only by design (images land in Phase 8). Story, Symbolism, and Gallery display — Phase 9.  \n**Remaining risks:** The synchronous ref lock is proven correct in reasoning but not automated; the manual test step (8) is the acceptance proof. If two different valid QRs are flashed in the same frame burst, only the first is accepted — this is intentional per handoff §4, but a frustrated visitor could in theory be looking at the "wrong" exhibit; in practice a visitor is scanning one exhibit at a time. The spike result view shares the .spike-* class namespace with the scanner view and will be discarded in Phase 8 rather than migrated, so naming collision is a non-issue. The acceptedRef lock does NOT reset between Start clicks without going through handleStart/handleStop/handleScanAnother — all three reset it, so no path leaves it stuck.  \n**Decisions made:** Synchronous useRef lock rather than useState — React state updates are async, so two rapid onDecode calls could both read stale accepted state; a ref's .current updates before the next line runs, so the second call sees the lock immediately. Two distinct inline-error branches (invalid-code from parser, unknown-exhibit from lookup) match the master-plan canonical reason set. Text-only result view in this phase — no images, no story, no symbolism, no gallery yet; those belong to Phase 8/9 production screens. The result view is not a separate component because it is only used here and the master plan will replace it with ScanResultScreen.jsx in Phase 8, so extracting now would be speculative. Camera is stopped synchronously in handleDecode (before setResult) so the LED turns off before React re-renders. Language toggle kept in the result view so trilingual plumbing is exercised via UI, not just via self-check. role=\"status\" on the inline error gives a screen-reader live-region announcement for newly displayed errors (satisfies master-plan Phase 7.5 accessibility requirement ahead of schedule).  \n**Next part:** Phase 4.4 — idempotent cleanup verification (unmount, repeated cleanup, second session) — code already handles it, but 4.4 formalises the acceptance with an explicit self-check of the adapter's repeated-cleanup safety plus a manual report from the spike.  \n**Commit:** {{hash.accept}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 4.3 progress',
      message: 'docs(progress): record phase 4.3 acceptance lock',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}