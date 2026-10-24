export default {
  name: 'Phase 6.1 — welcome screen content and composition',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Introduces WelcomeScreen.jsx and a screen state in App.jsx with two views: welcome (default) and spike (temporary Phase 4 bridge, replaced by Phase 7). Adds welcome strings to all three locale files. CTA navigates Welcome -> Spike temporarily. No getTranslation import in App.jsx — all Welcome copy lives in WelcomeScreen, and spike-view strings are hardcoded English until Phase 7 replaces the spike.',
    },
    {
      type: 'write',
      label: 'extend en.js with welcome block',
      path: 'src/i18n/locales/en.js',
      content: `// English UI strings. Exhibit content lives in src/data/exhibits.js, not here.
export const en = {
  app: {
    eyebrow: 'Cultural Expo',
    title: 'The Storytelling Mirror',
    tagline: 'Scan · Explore · Discover'
  },
  language: {
    label: 'Language',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Mandarin Chinese'
  },
  welcome: {
    explanation: 'Scan the QR code beside any exhibit to uncover its story.',
    cameraNotice: 'This experience uses your camera. You will be asked for permission when you start.',
    subTagline: 'More than just a scan, it is a journey through heritage.',
    cta: 'Start Exploring'
  },
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'extend id.js with welcome block (provisional)',
      path: 'src/i18n/locales/id.js',
      content: `// Bahasa Indonesia UI strings. Exhibit content lives in src/data/exhibits.js, not here.
// Values marked with (provisional) are pending expo team approval.
export const id = {
  app: {
    eyebrow: 'Pameran Budaya',
    title: 'The Storytelling Mirror',
    tagline: 'Pindai · Jelajahi · Temukan'
  },
  language: {
    label: 'Bahasa',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Bahasa Mandarin'
  },
  welcome: {
    explanation: 'Pindai kode QR di samping setiap pameran untuk mengungkap ceritanya.',
    cameraNotice: 'Pengalaman ini menggunakan kamera Anda. Anda akan diminta izin saat memulai.',
    subTagline: 'Lebih dari sekadar pindai, ini adalah perjalanan melalui warisan budaya.',
    cta: 'Mulai Menjelajah'
  },
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'extend zh.js with welcome block (provisional)',
      path: 'src/i18n/locales/zh.js',
      content: `// Mandarin Chinese (Simplified) UI strings. Exhibit content lives in src/data/exhibits.js, not here.
// All values here are provisional pending native-speaker review and expo team approval.
// Brand name intentionally kept in English until an approved Chinese name is supplied.
export const zh = {
  app: {
    eyebrow: '文化展览',
    title: 'The Storytelling Mirror',
    tagline: '扫描 · 探索 · 发现'
  },
  language: {
    label: '语言',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: '中文'
  },
  welcome: {
    explanation: '扫描任何展品旁边的二维码，揭开它的故事。',
    cameraNotice: '此体验需要使用您的相机。开始时系统会请求您的许可。',
    subTagline: '不只是扫描，更是一段穿越文化传承的旅程。',
    cta: '开始探索'
  },
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'create src/screens/WelcomeScreen.jsx',
      path: 'src/screens/WelcomeScreen.jsx',
      content: `import { getTranslation } from '../i18n/getTranslation.js'
import heroMirror from '../assets/mirror-hero.png'

// Welcome screen — the app's home / default view.
// Camera permission is deliberately NOT requested here; it happens only
// when the visitor activates the CTA and the scanner screen loads.
// The hero mirror uses empty alt because the <h1> below provides the
// semantic content; the image is decorative.
export function WelcomeScreen({ language, onStart }) {
  return (
    <section className="welcome-screen" aria-labelledby="welcome-title">
      <img src={heroMirror} alt="" className="welcome-hero" />
      <div className="welcome-copy">
        <p className="eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
        <h1 id="welcome-title" className="welcome-title">
          {getTranslation(language, 'app.title')}
        </h1>
        <p className="welcome-tagline">{getTranslation(language, 'app.tagline')}</p>
        <p className="welcome-subtagline">{getTranslation(language, 'welcome.subTagline')}</p>
        <p className="welcome-explanation">{getTranslation(language, 'welcome.explanation')}</p>
        <p className="welcome-camera-notice">{getTranslation(language, 'welcome.cameraNotice')}</p>
        <button type="button" className="welcome-cta" onClick={onStart}>
          {getTranslation(language, 'welcome.cta')}
        </button>
      </div>
    </section>
  )
}
`,
    },
    {
      type: 'write',
      label: 'rewrite App.jsx with Welcome/Spike screen state',
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
    <AppShell language={language} onLanguageChange={handleLanguageChange}>
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
      label: 'extend App.css with welcome screen styles',
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

.eyebrow {
  font-size: 0.8125rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-rosewood);
  margin: 0;
}

/* Welcome screen — Phase 6.1 onwards */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-4) 0;
  width: 100%;
  max-width: var(--max-width-content);
  text-align: center;
}

.welcome-hero {
  width: 100%;
  max-width: 260px;
  height: auto;
  display: block;
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: 28rem;
}

.welcome-title {
  font-family: var(--font-family-display);
  font-size: clamp(1.75rem, 5vw + 0.75rem, 2.5rem);
  line-height: 1.15;
  margin: 0;
  color: var(--color-rosewood);
}

.welcome-tagline {
  font-size: 1rem;
  color: var(--color-rosewood);
  margin: 0;
  letter-spacing: 0.04em;
}

.welcome-subtagline {
  font-family: var(--font-family-display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-vermilion);
  margin: 0;
}

.welcome-explanation {
  font-size: 1rem;
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
}

.welcome-camera-notice {
  font-size: 0.85rem;
  color: var(--color-rosewood);
  opacity: 0.75;
  margin: 0;
  line-height: 1.4;
}

.welcome-cta {
  min-height: 48px;
  padding: var(--space-3) var(--space-6);
  margin-top: var(--space-2);
  background: var(--color-vermilion);
  color: var(--color-surface);
  border: 2px solid var(--color-vermilion-dark);
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.welcome-cta:hover {
  background: var(--color-vermilion-dark);
}

.welcome-cta:focus-visible {
  outline: 2px solid var(--color-rosewood);
  outline-offset: 2px;
}

/* Spike — Phase 4.2/4.3 only. Replaced by the production scanner in Phase 7. */
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
      label: 'phase3 regression',
      command: 'npm run check:phase3',
    },
    {
      type: 'commit',
      label: 'commit welcome screen',
      message: 'feat(welcome): add welcome screen with hero, copy, and CTA',
      paths: [
        'src/i18n/locales/en.js',
        'src/i18n/locales/id.js',
        'src/i18n/locales/zh.js',
        'src/screens/WelcomeScreen.jsx',
        'src/App.jsx',
        'src/App.css',
      ],
      as: 'welcome',
    },
    {
      type: 'write',
      label: 'record phase 6.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 6.1 — Welcome screen content and composition\\n\\n**Status:** Code complete; manual visual and multilingual check pending user report  \\n**Goal:** Replace the placeholder composition with a proper Welcome screen matching the design proposal's Screen 1: hero mirror, eyebrow, title, tagline, sub-tagline, explanation, camera notice, Start Exploring CTA. Add all welcome strings to the three locale files. Introduce a screen state so the app has two views: welcome (default) and spike (temporary Phase 4 bridge, removed in Phase 7).  \\n**Files changed:** src/i18n/locales/en.js (welcome block), src/i18n/locales/id.js (welcome block, provisional translations), src/i18n/locales/zh.js (welcome block, provisional translations), src/screens/WelcomeScreen.jsx (new), src/App.jsx (rewritten with screen state and spike view extracted into a conditional render), src/App.css (welcome screen styles added; .hero-mirror removed as unused; .placeholder removed as no longer rendered; spike styles preserved).  \\n**User-visible result:** Opening the site now shows a proper Welcome screen: hero mirror at proper scale (~260px), eyebrow Cultural Expo, Playfair Display title The Storytelling Mirror, tagline Scan · Explore · Discover, italic vermilion sub-tagline, explanation paragraph, camera notice, and a prominent vermilion Start Exploring pill CTA. Clicking CTA navigates to the spike view (temporary). A left-arrow Return to Welcome link lets you get back. Language toggle re-renders all welcome copy in EN/ID/ZH without resetting the screen.  \\n**Automated checks:** npm run lint; npm run check:phase3 (7 exit-gate assertions still pass — exhibit stack unaffected by welcome-string additions).  \\n**Unit tests:** Intentionally omitted per urgent-policy override. Welcome screen has no branchy logic to test in Node.  \\n**Manual checks:** Pending. Required: (1) npm run dev; (2) open http://localhost:5173 — Welcome screen should render with the hero mirror centered, all copy visible in the proper fonts (Playfair Display title, Inter body), vermilion CTA visible; (3) click Start Exploring — spike view loads with Return to Welcome link at top; (4) click Return to Welcome — back to Welcome screen; (5) click ID — all welcome copy switches to Indonesian; (6) click 中文 — all welcome copy switches to Chinese; (7) click EN — back to English; (8) verify the language toggle still works while on spike view (should not reset the view); (9) resize to 320px — copy wraps cleanly, CTA stays tappable; (10) 200% zoom — readable; (11) Tab through — visible focus ring on the toggle, CTA, and back link; (12) camera is NOT requested on Welcome screen load — only when Start Camera is clicked on the spike view.  \\n**Not checked:** npm run build (deferred per user request). Real mobile device Welcome-screen layout — deferred to Phase 11 production acceptance (though the design should already work on iPhone given the responsive max-widths).  \\n**Remaining risks:** The Welcome CTA currently navigates to the spike view, not the real scanner. This is intentional (temporary bridge for development). Phase 7 will repoint the CTA at the production ScannerScreen. The Return to Welcome link is hardcoded English with a shortcut comment; it will be removed or translated when Phase 7 extracts ScannerScreen. Copy strings for Indonesian and Chinese remain provisional pending expo team approval. The Welcome screen layout has not been visually compared against the design proposal at full mobile width — Phase 6.2 will do that comparison and may adjust hero size or spacing.  \\n**Decisions made:** WelcomeScreen.jsx extracted into src/screens/ (per master plan source layout). screen state values welcome and spike introduced; Phase 7 will add scanner, result, exhibit and rename spike to scanner. Camera permission NOT requested on Welcome load — only on explicit Start Camera click inside the spike view (matches handoff §4 item 1). Hero alt kept as empty string (decorative; the h1 provides the semantic content). Sub-tagline from the design proposal included as italic Playfair Display in vermilion to match the reference. Dead .hero-mirror and .placeholder classes removed from App.css since their consumers no longer exist. The spike view keeps all its Phase 4 behavior intact — no camera logic changed, only structure moved. App.jsx does NOT import getTranslation — all Welcome copy lives in WelcomeScreen, and spike-view strings are hardcoded English until Phase 7 replaces the spike. This is the fix for the initial 6.1 attempt which failed lint on an unused-import.  \\n**Next part:** Phase 6.2 — Welcome screen responsive composition (hero sizing, spacing, layout against the design proposal at 320/360/390/430px widths); then Phase 6.3 — accessibility + keyboard verification. Phase 7 follows, replacing the spike view with the production ScannerScreen using the mirror-scan-frame.png overlay.  \\n**Commit:** {{hash.welcome}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 6.1 progress',
      message: 'docs(progress): record phase 6.1 welcome screen',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}