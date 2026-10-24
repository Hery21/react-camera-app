export default {
  name: 'Phase 6.2 — welcome screen deep vermilion treatment',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Applies Path B of the design match: whole app goes deep vermilion, mirror becomes a large centerpiece, all welcome text switches to cream/ivory/antique-gold. Text stays BELOW the mirror (not inside it) because the current mirror PNG has a dark reflective center. Adding text inside the mirror requires regenerating the mirror asset with a light center — that is a follow-up decision, not this phase. CTA switches from vermilion to antique gold with rosewood text so it does not blend with the vermilion background.',
    },
    {
      type: 'write',
      label: 'extend AppShell to receive and apply screen-based theme class',
      path: 'src/components/AppShell.jsx',
      content: `import { LanguageToggle } from './LanguageToggle.jsx'

// Top-level layout wrapper shared by every screen.
// screen is used purely for theming (app--welcome vs app--spike today;
// more variants will be added as more screens are extracted in Phase 7+).
// The header centers the toggle today; Phase 7 adds a Back button and
// will need a grid-based header layout. That change is deliberately
// deferred until the button exists (YAGNI).
export function AppShell({ language, onLanguageChange, screen, children }) {
  return (
    <div className={'app app--' + screen}>
      <header className="app-header">
        <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
`,
    },
    {
      type: 'write',
      label: 'pass screen prop from App.jsx',
      path: 'src/App.jsx',
      content: `import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'
import { createQrScanner } from './lib/qrScanner.js'
import { parseQrPayload } from './lib/qrPayload.js'
import { getExhibitById } from './lib/exhibitLookup.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')
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

  function handleStartExploring() {
    setScreen('spike')
  }

  function handleBackToWelcome() {
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
    setScreen('welcome')
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
    <AppShell
      language={language}
      onLanguageChange={handleLanguageChange}
      screen={screen}
    >
      {screen === 'welcome' ? (
        <WelcomeScreen language={language} onStart={handleStartExploring} />
      ) : (
        <section className="spike-view" aria-label="Camera spike preview">
          {/* shortcut: Phase 7 replaces this whole spike view with a proper ScannerScreen; remove this temporary back link then */}
          <button type="button" className="spike-back" onClick={handleBackToWelcome}>
            {'\\u2190 Return to Welcome'}
          </button>

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
        </section>
      )}
    </AppShell>
  )
}

export default App
`,
    },
    {
      type: 'write',
      label: 'rewrite App.css with deep vermilion welcome treatment',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

/* Per-screen theme wrappers. Each value of screen sets its own bg/fg.
   Phase 7 will add app--scanner, app--result, app--exhibit following
   the same pattern. */
.app--welcome {
  background: var(--color-vermilion-dark);
  color: var(--color-surface);
}

.app--spike {
  background: var(--color-warm-ivory);
  color: var(--color-text);
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

/* Welcome screen — Phase 6.1/6.2, deep-vermilion treatment */
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

/* Spike — Phase 4.2/4.3 only, light theme. Replaced by the production
   scanner in Phase 7 which will adopt the app--scanner dark treatment. */
.spike-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  max-width: var(--max-width-content);
}

.spike-back {
  align-self: flex-start;
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-rosewood);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-rosewood);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.spike-back:hover {
  background: var(--color-warm-ivory);
}

.spike-back:focus-visible {
  outline: 2px solid var(--color-rosewood);
  outline-offset: 2px;
}

.spike {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}

.spike-state {
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-rosewood);
  opacity: 0.6;
  margin: 0;
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
  padding: var(--space-4);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: 360px;
}

.spike-result-title {
  margin: 0;
  font-size: 1.25rem;
  font-family: var(--font-family-display);
  color: var(--color-rosewood);
}

.spike-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-rosewood);
  opacity: 0.7;
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
      type: 'check',
      label: 'css diagnostic — tokens still resolve',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'check',
      label: 'phase3 regression',
      command: 'npm run check:phase3',
    },
    {
      type: 'commit',
      label: 'commit deep vermilion welcome treatment',
      message: 'feat(welcome): apply deep vermilion composition',
      paths: [
        'src/components/AppShell.jsx',
        'src/App.jsx',
        'src/App.css',
      ],
      as: 'vermilion',
    },
    {
      type: 'write',
      label: 'record phase 6.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 6.2 — Welcome screen deep vermilion treatment\\n\\n**Status:** Code complete; visual comparison against design proposal pending user report  \\n**Goal:** Close the visual gap between the current Welcome screen and the design proposal's Screen 1 mockup by switching the app to a deep vermilion treatment, making the ornate mirror a large centerpiece, and inverting text colors to cream/ivory/antique-gold. Text stays below the mirror (not inside it) as documented below.  \\n**Files changed:** src/components/AppShell.jsx (accepts screen prop, applies app--{screen} class), src/App.jsx (passes screen to AppShell), src/App.css (adds .app--welcome / .app--spike theme wrappers; welcome hero max-width increased to min(85vw, 380px); welcome title/tagline/explanation switched to cream; eyebrow and subtagline switched to antique gold; CTA switched from vermilion to antique gold with rosewood text).  \\n**User-visible result:** Welcome screen now has a deep vermilion background with cream text and an antique-gold CTA. The mirror is roughly twice as large and casts a soft drop shadow. The eyebrow and italic sub-tagline glow in antique gold. Language toggle on the header remains a cream pill (high contrast against the vermilion bg). Spike view stays on the light ivory theme.  \\n**Automated checks:** npm run lint; node scripts/diagnose-css.mjs (tokens still resolve); npm run check:phase3 (7 exit-gate assertions).  \\n**Unit tests:** Intentionally omitted per urgent-policy override.  \\n**Manual checks:** Pending. Required: (1) npm run dev; (2) screenshot the Welcome screen and compare side-by-side with the design proposal's Screen 1 mockup; (3) verify deep vermilion bg with cream text; (4) verify mirror is visibly larger and does not look lost; (5) verify gold CTA has good contrast against the vermilion bg; (6) verify the language toggle (cream pill) stands out against vermilion; (7) click Start Exploring — spike view loads on light ivory theme, contrast should feel intentional rather than accidental; (8) click Return to Welcome — back to vermilion welcome; (9) language toggle on welcome — verify ID and 中文 render cream text correctly on vermilion bg (some Indonesian strings are longer; verify no overflow); (10) resize to 320px — mirror shrinks gracefully, text wraps, CTA stays tappable.  \\n**Not checked:** npm run build (deferred per user request). Text INSIDE the mirror's reflective face — impossible with the current mirror-hero.png (dark center) without a CSS hack that would look artificial. Regenerating the mirror asset with a light/ivory reflective center and overlaying text inside it is a separate follow-up decision. Real mobile device layout — deferred to Phase 11.  \\n**Remaining risks:** The current mirror PNG has a dark reflective center. On the deep vermilion background, the mirror's interior may visually blend with the bg (gold frame pops; center blends). This could read as elegant (mirror reflecting the room) or as a hole in the layout; needs visual judgement from the user's screenshot. If the user finds it jarring, the fix is regenerating the mirror with a cream/ivory reflective center. The antique-gold CTA on vermilion is warm but may feel lower-contrast than the current vermilion-on-ivory; if the user finds it muted, alternatives are cream CTA with vermilion text or keeping vermilion CTA with a cream border. The subtagline color (antique gold on vermilion) has borderline contrast — verify at 200% zoom. The screen-based theme (app--{screen}) is a lightweight pattern that will scale to app--scanner, app--result, app--exhibit in Phase 7+, but has not yet been tested with more than two values.  \\n**Decisions made:** Path B chosen over Path A (regenerate mirror) because it delivers most of the visual upgrade immediately without blocking on a new asset. Whole-app theme is switched via .app--{screen} class rather than per-screen CSS overrides, keeping the pattern explicit and extensible. CTA switched from vermilion to antique gold to ensure contrast against the vermilion bg; the mockup's vermilion CTA works there because it sits on the mirror's white face, not on the bg, and we do not have a white face to sit on. Sub-tagline kept (design canvas shows it, mockup omits it) but reduced in prominence (smaller font, gold color, tight spacing) so it complements the composition rather than dominating it. Hero drop-shadow added so the ornate gold frame reads as a distinct object even if the interior blends with the bg. Spike view deliberately stays on the light ivory theme (app--spike) — it is a temporary Phase 4 bridge and will be replaced by ScannerScreen in Phase 7 with its own dark treatment for camera contrast.  \\n**Next part:** Phase 6.3 — Welcome screen accessibility and keyboard verification (focus order, contrast at 200% zoom, prefers-reduced-motion on the drop shadow, screen-reader announcement of language changes). Then Phase 7.1 — production ScannerScreen using mirror-scan-frame.png and the app--scanner dark theme.  \\n**Commit:** {{hash.vermilion}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 6.2 progress',
      message: 'docs(progress): record phase 6.2 vermilion treatment',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}