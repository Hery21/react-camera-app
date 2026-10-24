export default {
  name: 'Phase 7.2 — integrate scanner frame overlay',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Imports the 4 frame corner images into ScannerScreen.jsx and positions them absolutely over the video feed using percentages so they scale gracefully on phones, tablets, and desktops. No camera logic changed. No new dependencies.',
    },
    {
      type: 'write',
      label: 'update ScannerScreen with frame overlay',
      path: 'src/screens/ScannerScreen.jsx',
      content: `import { useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { createQrScanner } from '../lib/qrScanner.js'
import { parseQrPayload } from '../lib/qrPayload.js'
import { getExhibitById } from '../lib/exhibitLookup.js'
import frameTl from '../assets/frame-tl.png'
import frameTr from '../assets/frame-tr.png'
import frameBl from '../assets/frame-bl.png'
import frameBr from '../assets/frame-br.png'

// Production scanner screen. Camera lifecycle, state handling, and cleanup
// are self-contained here so App.jsx stays a thin router.
export function ScannerScreen({ language }) {
  const [scannerState, setScannerState] = useState('idle')
  const [inlineError, setInlineError] = useState(null)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const acceptedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current = null
      }
    }
  }, [])

  function stopScanner() {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current = null
    }
    acceptedRef.current = false
  }

  function handleDecode(text) {
    if (acceptedRef.current) return

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
    stopScanner()
    setInlineError(null)
    setResult({ exhibit: lookup.exhibit, parsedId: parsed.exhibitId })
  }

  async function handleStart() {
    if (!videoRef.current) return
    stopScanner()

    const scanner = createQrScanner()
    scannerRef.current = scanner
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
    stopScanner()
    setScannerState('idle')
    setErrorMessage('')
    setInlineError(null)
    setResult(null)
  }

  function handleScanAnother() {
    stopScanner()
    setResult(null)
    setInlineError(null)
    setScannerState('idle')
  }

  const resultContent = result
    ? result.exhibit.content[language] || result.exhibit.content.en
    : null

  if (result && resultContent) {
    return (
      <section className="scanner-result" aria-live="polite">
        <p className="scanner-result-meta">
          {getTranslation(language, 'scanner.matched')}: {result.parsedId}
        </p>
        <h2 className="scanner-result-title">{resultContent.title}</h2>
        {resultContent.period && (
          <p className="scanner-result-period">{resultContent.period}</p>
        )}
        <p className="scanner-result-summary">{resultContent.summary}</p>
        <button type="button" className="scanner-button" onClick={handleScanAnother}>
          {getTranslation(language, 'scanner.scanAnother')}
        </button>
      </section>
    )
  }

  return (
    <section className="scanner-screen" aria-label="QR scanner">
      <div className="scanner-video-wrapper">
        <video
          ref={videoRef}
          className="scanner-video"
          playsInline
          muted
        />
        
        <div className="scanner-frame-overlay" aria-hidden="true">
          <img src={frameTl} alt="" className="scan-frame-corner frame-tl" />
          <img src={frameTr} alt="" className="scan-frame-corner frame-tr" />
          <img src={frameBl} alt="" className="scan-frame-corner frame-bl" />
          <img src={frameBr} alt="" className="scan-frame-corner frame-br" />
        </div>

        {scannerState === 'idle' && (
          <p className="scanner-overlay-text">
            {getTranslation(language, 'scanner.cameraOff')}
          </p>
        )}
        {scannerState === 'requesting' && (
          <p className="scanner-overlay-text">
            {getTranslation(language, 'scanner.requesting')}
          </p>
        )}
      </div>

      {scannerState === 'scanning' && (
        <p className="scanner-instructions" role="status">
          {getTranslation(language, 'scanner.instructions')}
        </p>
      )}

      <div className="scanner-controls">
        {scannerState === 'idle' && (
          <button type="button" className="scanner-button" onClick={handleStart}>
            {getTranslation(language, 'scanner.start')}
          </button>
        )}
        {scannerState === 'requesting' && (
          <button type="button" className="scanner-button" disabled>
            {getTranslation(language, 'scanner.starting')}
          </button>
        )}
        {scannerState === 'scanning' && (
          <button type="button" className="scanner-button" onClick={handleStop}>
            {getTranslation(language, 'scanner.stop')}
          </button>
        )}
        {scannerState === 'error' && (
          <div className="scanner-error">
            <p className="scanner-error-message">
              {getTranslation(language, 'scanner.error')}: {errorMessage}
            </p>
            <button type="button" className="scanner-button" onClick={handleStart}>
              {getTranslation(language, 'scanner.tryAgain')}
            </button>
            <button
              type="button"
              className="scanner-button scanner-button-secondary"
              onClick={handleStop}
            >
              {getTranslation(language, 'scanner.cancel')}
            </button>
          </div>
        )}

        {inlineError && (
          <p className="scanner-inline-error" role="status">
            {inlineError.kind === 'unknown-exhibit'
              ? getTranslation(language, 'scanner.unknownExhibit') + ': ' + inlineError.detail + ' \\u2014 ' + getTranslation(language, 'scanner.keepScanning')
              : getTranslation(language, 'scanner.invalidCode') + ' (' + inlineError.kind + ') \\u2014 ' + getTranslation(language, 'scanner.keepScanning')}
          </p>
        )}
      </div>
    </section>
  )
}
`,
    },
    {
      type: 'write',
      label: 'add frame overlay CSS to App.css',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.app--welcome {
  background: var(--color-vermilion-dark);
  color: var(--color-surface);
}

.app--scanner {
  background: var(--color-scanner-bg);
  color: var(--color-surface);
}

.app-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
}

.app-header-left {
  display: flex;
  justify-content: flex-start;
}

.app-header-center {
  display: flex;
  justify-content: center;
}

.app-header-right {
}

.app-header-back {
  min-width: 44px;
  min-height: 44px;
  padding: 0 var(--space-3);
  background: var(--color-surface);
  color: var(--color-rosewood);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.app-header-back:hover {
  background: var(--color-warm-ivory);
}

.app-header-back:focus-visible {
  outline: 2px solid var(--color-antique-gold);
  outline-offset: 2px;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: var(--space-4);
}

.app--scanner .app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.language-toggle {
  display: inline-flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
}

.language-toggle-button {
  min-width: 44px;
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-rosewood);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.language-toggle-button:hover {
  background: var(--color-warm-ivory);
}

.language-toggle-button[aria-pressed="true"] {
  background: var(--color-vermilion);
  color: var(--color-surface);
}

.language-toggle-button:focus-visible {
  outline: 2px solid var(--color-antique-gold);
  outline-offset: 2px;
}

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  width: 100%;
  max-width: var(--max-width-content);
  text-align: center;
}

.welcome-hero {
  width: 100%;
  max-width: min(85vw, 380px);
  height: auto;
  display: block;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35));
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  max-width: 28rem;
}

.eyebrow {
  font-size: 0.8125rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-antique-gold);
  margin: 0;
}

.welcome-title {
  font-family: var(--font-family-display);
  font-size: clamp(2rem, 6vw + 0.5rem, 3rem);
  line-height: 1.1;
  margin: 0;
  color: var(--color-surface);
  font-weight: 700;
}

.welcome-tagline {
  font-size: 1rem;
  color: var(--color-surface);
  margin: 0;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.9;
}

.welcome-subtagline {
  font-family: var(--font-family-display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-antique-gold);
  margin: 0;
  padding-top: var(--space-1);
}

.welcome-explanation {
  font-size: 1rem;
  color: var(--color-surface);
  margin: 0;
  padding-top: var(--space-2);
  line-height: 1.5;
  opacity: 0.92;
}

.welcome-camera-notice {
  font-size: 0.8rem;
  color: var(--color-surface);
  opacity: 0.65;
  margin: 0;
  line-height: 1.4;
}

.welcome-cta {
  min-height: 48px;
  padding: var(--space-3) var(--space-8);
  margin-top: var(--space-3);
  background: var(--color-antique-gold);
  color: var(--color-rosewood);
  border: 2px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.welcome-cta:hover {
  background: #b5952f;
  border-color: #b5952f;
}

.welcome-cta:focus-visible {
  outline: 2px solid var(--color-surface);
  outline-offset: 3px;
}

.scanner-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: min(100%, 32rem);
  flex: 1 1 auto;
  min-height: 0;
}

@media (min-width: 640px) {
  .scanner-screen {
    max-width: min(100%, 44rem);
  }
}

.scanner-video-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Frame overlay */
.scanner-frame-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.scan-frame-corner {
  position: absolute;
  width: 20%;
  height: auto;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.frame-tl { top: 0; left: 0; }
.frame-tr { top: 0; right: 0; }
.frame-bl { bottom: 0; left: 0; }
.frame-br { bottom: 0; right: 0; }

.scanner-overlay-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--color-surface);
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.55);
  z-index: 20;
}

.scanner-instructions {
  width: 100%;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: rgba(26, 18, 16, 0.9);
  color: var(--color-surface);
  font-size: 0.95rem;
  text-align: center;
}

.scanner-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  flex: 0 0 auto;
}

.scanner-button {
  min-height: 44px;
  padding: var(--space-2) var(--space-6);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  background: var(--color-antique-gold);
  color: var(--color-rosewood);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.scanner-button:hover {
  background: #b5952f;
  border-color: #b5952f;
}

.scanner-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.scanner-button:focus-visible {
  outline: 2px solid var(--color-surface);
  outline-offset: 3px;
}

.scanner-button-secondary {
  background: transparent;
  color: var(--color-surface);
  border-color: var(--color-surface);
}

.scanner-button-secondary:hover {
  background: rgba(255, 250, 240, 0.1);
  border-color: var(--color-surface);
}

.scanner-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  background: rgba(159, 31, 31, 0.15);
  max-width: 28rem;
}

.scanner-error-message {
  margin: 0;
  color: var(--color-surface);
  font-size: 0.9rem;
  text-align: center;
}

.scanner-inline-error {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: rgba(212, 175, 55, 0.15);
  color: var(--color-antique-gold);
  font-size: 0.875rem;
  text-align: center;
}

.scanner-result {
  margin: auto 0;
  padding: var(--space-4);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: 28rem;
}

.scanner-result-meta {
  margin: 0;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-rosewood);
  opacity: 0.6;
}

.scanner-result-title {
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-family-display);
  color: var(--color-rosewood);
}

.scanner-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-rosewood);
  opacity: 0.7;
}

.scanner-result-summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'css diagnostic',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'commit',
      label: 'commit frame overlay integration',
      message: 'feat(scanner): integrate responsive frame overlays',
      paths: [
        'src/screens/ScannerScreen.jsx',
        'src/App.css',
      ],
      as: 'frame',
    },
    {
      type: 'write',
      label: 'record phase 7.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 7.2 — Integrate scanner frame overlay\\n\\n**Status:** Code complete; visual check pending user report  \\n**Goal:** Wrap the live camera feed in the ornate Peranakan frame by layering four corner images over the video element, scaled responsively via percentages so they never distort across devices.  \\n**Files changed:** src/screens/ScannerScreen.jsx (imports 4 frame PNGs, renders them in a .scanner-frame-overlay div), src/App.css (adds .scanner-frame-overlay, .scan-frame-corner and corner positioning classes; bumps .scanner-overlay-text z-index).  \\n**User-visible result:** The scanner screen now displays the ornate gold floral corners wrapping the camera feed. The corners stay pinned to the edges of the video container regardless of viewport shape or size (because they use position: absolute and width: 20%).\\n**Automated checks:** npm run lint; node scripts/diagnose-css.mjs.  \\n**Unit tests:** Intentionally omitted per urgent-policy override.  \\n**Manual checks:** Pending. Required: (1) npm run dev; (2) Start Exploring -> Start Camera; (3) verify the 4 frame corners are visible on top of the video feed; (4) verify the center of the video is completely clear (the frame does not block the QR code); (5) resize to 320px and 768px to confirm the frames scale gracefully and do not overlap in the center; (6) verify idle state (camera off) still looks correct with the frame and overlay text.  \\n**Not checked:** npm run build (deferred per user request). Real mobile device hardware rendering.  \\n**Remaining risks:** The images are cropped to 4 squares and scaled at 20% width. On extremely narrow viewports (e.g., 320px), the corners might crowd the center. If this is observed, the percentage can drop to 15% or we can add a media query. The tassel on the bottom-right corner might extend beyond the 20% box (depending on how the user cropped it), which could look awkward. If observed, we may need to adjust the bottom-right image scaling.  \\n**Decisions made:** Splitting the frame into 4 corner images was necessary because scaling a single rectangular image across a responsive flex container either distorts the artwork or leaves huge gaps. Absolute positioning with width: 20% ensures the frames wrap the video perfectly without aspect-ratio constraints. The overlay wrapper has pointer-events: none so camera interactions and overlay text remain clickable. z-index is set to 10 for the frames and 20 for the overlay text so text is always readable.  \\n**Next part:** Phase 7.3 — Error recovery flow (i18n for all scanner errors, handling permission denied, camera not found, scanner errors) using the new scanner strings.  \\n**Commit:** {{hash.frame}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 7.2 progress',
      message: 'docs(progress): record phase 7.2 scanner frame overlay',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}