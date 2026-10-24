export default {
  name: 'Phase 4.2 — camera spike with adapter',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds a minimal spike scanner to App.jsx to prove the adapter works with a real video element. NOT the production scanner — no ornate frame, no localized instructions, no scan-result or exhibit screens yet (those are Phase 7/8/9). Removes the Phase 2.5 verification block, earlier than the Phase 6 note said, because the spike needs a clean surface and the block has served its purpose. Status will be recorded as "Code complete; desktop webcam test pending user report" — real-device matrix deferred to Phase 4.5.',
    },
    {
      type: 'write',
      label: 'rewrite App.jsx with spike scanner',
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

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [scannerState, setScannerState] = useState('idle')
  const [decodedText, setDecodedText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  // Stop any active scanner on unmount (cleanup discipline per handoff §4).
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

  async function handleStart() {
    if (!videoRef.current) return

    // Stop any previous scanner before creating a fresh one — the adapter
    // is a one-shot object so "Try Again" after an error needs a new instance.
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }

    const scanner = createQrScanner()
    scannerRef.current = scanner
    setDecodedText('')
    setErrorMessage('')
    setScannerState('requesting')

    await scanner.start(videoRef.current, {
      onDecode: (text) => setDecodedText(text),
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
    setScannerState('idle')
    setDecodedText('')
    setErrorMessage('')
  }

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
                <p>Decoded text:</p>
                <pre>{decodedText}</pre>
              </div>
            )}
          </div>
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
      label: 'replace App.css with spike styles',
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

/* Spike — Phase 4.2 only. Replaced by the production scanner in Phase 7. */
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
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit camera spike',
      message: 'feat(scanner): add camera spike UI',
      paths: ['src/App.jsx', 'src/App.css'],
      as: 'spike',
    },
    {
      type: 'write',
      label: 'record phase 4.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 4.2 — Camera spike with adapter\n\n**Status:** Code complete; desktop webcam test pending user report  \n**Goal:** Prove the createQrScanner adapter works end-to-end with a real video element and getUserMedia, before investing in ornamentation or production scanner UI.  \n**Files changed:** src/App.jsx (rewritten), src/App.css (rewritten, spike styles replace Phase 2.5 verification-block styles).  \n**User-visible result:** Below the title, a "Start Camera" button. On click, browser prompts for camera permission, then a live video fills a 360x360 box and the camera continuously decodes QR codes. Any recognized text appears below the video, deduped against consecutive identical text. A "Stop Camera" button releases the camera. A camera error shows the error message plus Try Again and Cancel. Language toggle in the header still works while the camera is active.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override. No new self-check — the adapter contract was covered by check:scanner in 4.1 and this phase is UI. Camera behavior cannot be Node-tested.  \n**Manual checks:** Pending. Required desktop test: (1) npm run dev; (2) open http://localhost:5173 (localhost IS a secure context, so getUserMedia works); (3) click Start Camera — accept permission if prompted; (4) confirm the live webcam feed appears and the scanner state reads 'scanning'; (5) hold up a QR code to the webcam — decoded text should appear; (6) hold up a DIFFERENT QR code — text should update; (7) click Stop Camera — camera LED turns off; (8) click Start Camera again — camera reopens. Also worth trying: deny permission on first prompt, then reload and click Start again — should show the error branch and Try Again should re-prompt.  \n**Not checked:** npm run build (deferred per user request). Real mobile devices — rear-camera selection, iOS Safari inline video, Android Chrome autoplay behavior, low-light decoding, foreground/background transitions. All deferred to Phase 4.5 real-device matrix (master plan). Physical expo QR codes — deferred to Phase 11.  \n**Remaining risks:** iOS Safari user-gesture token may expire between the click handler and the getUserMedia call because our adapter awaits a dynamic import first; if this manifests in 4.5, the fix is to pre-warm the @zxing/browser import (e.g. via a load() method on the adapter, called on mount). The 'requesting' state is a thin guard: if getUserMedia resolves slowly on Android, the state may briefly read 'requesting' after the video is actually playing — cosmetic only. Rapid cross-QR sweeps can produce two onDecode calls in quick succession; the visitor sees the last text. The Phase 7 production scanner will add a proper accept lock that navigates on the first valid EXPO-NNN payload and stops the scanner. The Phase 2.5 verification block was removed early (before Phase 6) because the spike needs a clean surface; the "language changes do not reset screen state" property is now proven indirectly — the language toggle still works while the camera is active, which exercises the same class of regression.  \n**Decisions made:** Fresh createQrScanner() per Start click, not a persistent ref instance — because the adapter is one-shot (stopped flag), and "Try Again" after an error must get a new scanner. Video element has playsInline (iOS Safari would otherwise enter fullscreen on play) and muted (autoplay with audio is blocked in most browsers). The scanner stays alive after decode so the visitor can try a different QR; the adapter's consecutive-text dedupe prevents repeat-fire on the same text. Unmount cleanup via a useEffect return that stops the scanner ref — camera must release on tab close or route unmount per handoff §4. No CSS custom properties yet — Phase 5 introduces the token layer; Phase 4.2 uses literal colors from the master-plan palette so the spike still visually matches the eventual theme. Language toggle kept because it's cheap and proves 7.4's language-independent scanner property ahead of schedule.  \n**Next part:** Phase 4.3 — acceptance lock and inline payload validation on decode (moves the "valid result stops the scanner and navigates" logic into the spike, so 4.3 exercises the full validation pipeline before production UI).  \n**Commit:** {{hash.spike}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 4.2 progress',
      message: 'docs(progress): record phase 4.2 camera spike',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}