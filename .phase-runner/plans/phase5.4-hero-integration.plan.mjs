export default {
  name: 'Phase 5.4 — hero mirror image integration',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Imports src/assets/mirror-hero.png via Vite asset import and renders it above the placeholder text at max-width 200px. Proves the asset pipeline works end-to-end. Phase 6 will compose the Welcome screen hero properly at full size. Camera frame (mirror-scan-frame.png) NOT imported yet — that is Phase 7 with the production scanner. Starter asset cleanup (react.svg, vite.svg, possibly hero.png) noted for a future phase, not done here.',
    },
    {
      type: 'write',
      label: 'add hero mirror import and img element to App.jsx',
      path: 'src/App.jsx',
      content: `import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getTranslation } from './i18n/getTranslation.js'
import {
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'
import { createQrScanner } from './lib/qrScanner.js'
import { parseQrPayload } from './lib/qrPayload.js'
import { getExhibitById } from './lib/exhibitLookup.js'
import { AppShell } from './components/AppShell.jsx'
import heroMirror from './assets/mirror-hero.png'

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
    if (next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  function handleDecode(text) {
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
    <AppShell language={language} onLanguageChange={handleLanguageChange}>
      <div className="placeholder" aria-labelledby="app-title">
        <img src={heroMirror} alt="" className="hero-mirror" />
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
    </AppShell>
  )
}

export default App
`,
    },
    {
      type: 'write',
      label: 'add hero-mirror class to App.css',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.app-header {
  padding: var(--space-4);
  display: flex;
  justify-content: center;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: var(--space-4);
}

.placeholder {
  width: min(100%, var(--max-width-content));
  text-align: center;
}

.hero-mirror {
  display: block;
  width: 100%;
  max-width: 200px;
  height: auto;
  margin: 0 auto var(--space-4);
}

.placeholder h1 {
  margin: var(--space-2) 0;
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
  outline: 2px solid var(--color-rosewood);
  outline-offset: 2px;
}

/* Spike — Phase 4.2/4.3 only. Replaced by the production scanner in Phase 7. */
.spike {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
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
  border-radius: var(--radius-md);
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
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-rosewood);
  border-radius: var(--radius-sm);
  background: var(--color-rosewood);
  color: var(--color-surface);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.spike-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spike-button:focus-visible {
  outline: 2px solid var(--color-vermilion);
  outline-offset: 2px;
}

.spike-error {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-3);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  background: #fdeaea;
  color: var(--color-rosewood);
  max-width: 360px;
}

.spike-decoded {
  width: 100%;
  max-width: 360px;
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  text-align: left;
  word-break: break-all;
}

.spike-decoded pre {
  margin: var(--space-1) 0 0;
  font-size: 0.75rem;
  white-space: pre-wrap;
}

.spike-inline-error {
  width: 100%;
  max-width: 360px;
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: #fff4d6;
  color: var(--color-rosewood);
  font-size: 0.875rem;
  text-align: left;
}

.spike-result {
  margin-top: var(--space-8);
  padding: var(--space-4);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.spike-result-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-rosewood);
}

.spike-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.spike-result-summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
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
      label: 'commit hero mirror integration',
      message: 'feat(welcome): integrate hero mirror image',
      paths: ['src/App.jsx', 'src/App.css'],
      as: 'hero',
    },
    {
      type: 'write',
      label: 'record phase 5.4 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 5.4 — Hero mirror image integration\n\n**Status:** Code complete; manual asset-load check pending user report  \n**Goal:** Prove the Vite asset import pipeline works end-to-end with the actual generated hero mirror PNG, before Phase 6 composes the Welcome screen at full size.  \n**Files changed:** src/App.jsx (adds import heroMirror from './assets/mirror-hero.png' and one <img> above the placeholder text), src/App.css (adds .hero-mirror class with max-width 200px).  \n**User-visible result:** The ornate hand mirror PNG now renders above the "Cultural Expo / The Storytelling Mirror / Scan · Explore · Discover" placeholder. Sized small (max 200px wide) on purpose — Phase 6 will compose it at proper hero scale in the Welcome screen.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override.  \n**Manual checks:** Pending. Required: (1) npm run dev; (2) open http://localhost:5173; (3) hero mirror image should appear above the text, scaled to about 200px wide on desktop, preserving aspect ratio; (4) DevTools → Network → confirm mirror-hero.png (or a Vite-hashed variant in dev) returns 200; (5) DevTools → Elements → confirm the <img> has alt=\"\" (empty, decorative) and resolves to a data: URL or /src/assets/mirror-hero.png in dev; (6) no console errors.  \n**Not checked:** npm run build (deferred per user request). Camera frame (mirror-scan-frame.png) integration — deferred to Phase 7 production scanner. Chroma-key verification of mirror-scan-frame.png — the user must confirm it is already transparent in the center, otherwise Phase 7 will show a white box instead of a live feed. Starter asset cleanup (react.svg, vite.svg, possibly hero.png which may be an older attempt superseded by mirror-hero.png) — noted as a follow-up, not done here.  \n**Remaining risks:** The hero at 200px max width will not show off the intricate floral detail; Phase 6's full-size composition is when visual quality is evaluated. PNG format at 193 KB is acceptable but Phase 10 perf review may convert to WebP for size (target ~60-80 KB). The placeholder composition (hero + text + spike scanner) is not the final layout — Phase 6 restructures it into the Welcome screen, and Phase 7 replaces the spike scanner with the production scanner. Empty alt text is correct for the current spike context but Phase 6 may add semantic alt once the hero functions as the primary visual anchor.  \n**Decisions made:** Import via Vite asset import (import heroMirror from './assets/mirror-hero.png') rather than public/ path reference — Vite hashes and optimizes the asset, and the import catches missing-file errors at build time instead of runtime 404. max-width 200px chosen deliberately small — Phase 6 will scale up in the final composition; 5.4 just needs to prove the pipeline. No width/height attributes yet because the exact aspect ratio is not known to the plan author; Phase 6 will add explicit dimensions once the composition is settled, satisfying the master-plan CLS-prevention requirement at the point where it actually matters. Empty alt is correct for a decorative image; Phase 6 will decide whether the Welcome hero needs semantic alt.  \n**Next part:** Phase 6.1 — Welcome screen semantic content (title, tagline, explanation, Start Exploring button) using localized strings from translations.js. This is where the app starts to look like the proposal's Screen 1.  \n**Commit:** {{hash.hero}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 5.4 progress',
      message: 'docs(progress): record phase 5.4 hero integration',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}