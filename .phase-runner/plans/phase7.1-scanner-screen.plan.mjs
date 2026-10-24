export default {
  name: 'Phase 7.1 — extract ScannerScreen with dark theme',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Extracts camera logic into ScannerScreen.jsx. Renames screen value spike to scanner. Adds dark scanner theme, back button in AppShell header, and i18n scanner strings across en/id/zh. Does NOT include the mirror-scan-frame.png overlay yet — that is Phase 7.2 once transparency is confirmed. Does NOT include full error-message i18n — that is Phase 7.3. Result display stays inline inside ScannerScreen; Phase 8 extracts ScanResultScreen.',
    },
    {
      type: 'write',
      label: 'add scanner-bg color token to theme.css',
      path: 'src/styles/theme.css',
      content: `/* Theme tokens for The Storytelling Mirror.
   Palette is the master-plan starting palette.
   Font-family tokens match the design reference (Playfair Display + Inter via Google Fonts).
   Spacing, radius, and shadow tokens are introduced alongside their first real use. */
:root {
  /* Palette — from MASTER-PHASE-PLAN.md Phase 5.1 */
  --color-vermilion: #b32222;
  --color-vermilion-dark: #861818;
  --color-rosewood: #4a2e26;
  --color-antique-gold: #d4af37;
  --color-warm-ivory: #f7ead9;
  --color-peranakan-teal: #2c9c8d;
  --color-blush-pink: #e7a7b3;
  --color-text: #2a211d;
  --color-surface: #fffaf0;
  --color-error: #9f1f1f;
  --color-success: #187154;

  /* Screen-specific surface colors */
  --color-scanner-bg: #1a1210;

  /* Typography family stacks — loaded via Google Fonts in index.html */
  --font-family-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-family-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(42, 33, 29, 0.1);

  /* Layout constraints */
  --max-width-content: 32rem;
}
`,
    },
    {
      type: 'write',
      label: 'add scanner strings to en.js',
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
  scanner: {
    back: 'Back to welcome',
    instructions: 'Point your camera at the exhibit QR code.',
    start: 'Start Camera',
    stop: 'Stop Camera',
    starting: 'Starting…',
    requesting: 'Requesting camera…',
    cameraOff: 'Camera off',
    error: 'Camera error',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    scanAnother: 'Scan Another',
    matched: 'Matched',
    invalidCode: 'Invalid code',
    unknownExhibit: 'Unknown exhibit',
    keepScanning: 'keep scanning'
  },
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'add scanner strings to id.js (provisional)',
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
  scanner: {
    back: 'Kembali ke beranda',
    instructions: 'Arahkan kamera Anda ke kode QR pameran.',
    start: 'Nyalakan Kamera',
    stop: 'Matikan Kamera',
    starting: 'Memulai…',
    requesting: 'Meminta izin kamera…',
    cameraOff: 'Kamera mati',
    error: 'Kesalahan kamera',
    tryAgain: 'Coba Lagi',
    cancel: 'Batal',
    scanAnother: 'Pindai Lagi',
    matched: 'Cocok',
    invalidCode: 'Kode tidak valid',
    unknownExhibit: 'Pameran tidak dikenal',
    keepScanning: 'terus pindai'
  },
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'add scanner strings to zh.js (provisional)',
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
  scanner: {
    back: '返回首页',
    instructions: '将相机对准展品二维码。',
    start: '开启相机',
    stop: '关闭相机',
    starting: '启动中…',
    requesting: '正在请求相机权限…',
    cameraOff: '相机已关闭',
    error: '相机错误',
    tryAgain: '重试',
    cancel: '取消',
    scanAnother: '再次扫描',
    matched: '已匹配',
    invalidCode: '无效代码',
    unknownExhibit: '未知展品',
    keepScanning: '继续扫描'
  },
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'update AppShell with onBack and three-column header',
      path: 'src/components/AppShell.jsx',
      content: `import { LanguageToggle } from './LanguageToggle.jsx'
import { getTranslation } from '../i18n/getTranslation.js'

// Top-level layout wrapper shared by every screen.
// The header is a 3-column grid: [back] [toggle] [spacer].
// When onBack is undefined (e.g. on Welcome), the back slot is empty and
// the toggle stays visually centered.
// The screen prop drives the theme class (app--welcome / app--scanner);
// Phase 8 will add app--scan-result and app--exhibit.
export function AppShell({ language, onLanguageChange, screen, onBack, children }) {
  return (
    <div className={'app app--' + screen}>
      <header className="app-header">
        <div className="app-header-left">
          {onBack && (
            <button
              type="button"
              className="app-header-back"
              onClick={onBack}
              aria-label={getTranslation(language, 'scanner.back')}
            >
              {'\\u2190'}
            </button>
          )}
        </div>
        <div className="app-header-center">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
        </div>
        <div className="app-header-right" aria-hidden="true" />
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
`,
    },
    {
      type: 'write',
      label: 'create src/screens/ScannerScreen.jsx',
      path: 'src/screens/ScannerScreen.jsx',
      content: `import { useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { createQrScanner } from '../lib/qrScanner.js'
import { parseQrPayload } from '../lib/qrPayload.js'
import { getExhibitById } from '../lib/exhibitLookup.js'

// Production scanner screen (still inline result view; Phase 8 extracts
// ScanResultScreen as its own screen). Camera lifecycle, state handling,
// and cleanup are self-contained here so App.jsx stays a thin router.
// The mirror-scan-frame.png overlay lands in Phase 7.2 once its
// transparency is confirmed.
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
      label: 'rewrite App.jsx to delegate to ScannerScreen',
      path: 'src/App.jsx',
      content: `import { useEffect, useState } from 'react'
import './App.css'
import {
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'
import { AppShell } from './components/AppShell.jsx'
import { WelcomeScreen } from './screens/WelcomeScreen.jsx'
import { ScannerScreen } from './screens/ScannerScreen.jsx'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  function handleLanguageChange(next) {
    if (next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  function handleStartExploring() {
    setScreen('scanner')
  }

  function handleBackToWelcome() {
    setScreen('welcome')
  }

  return (
    <AppShell
      language={language}
      onLanguageChange={handleLanguageChange}
      screen={screen}
      onBack={screen === 'scanner' ? handleBackToWelcome : undefined}
    >
      {screen === 'welcome' ? (
        <WelcomeScreen language={language} onStart={handleStartExploring} />
      ) : (
        <ScannerScreen language={language} />
      )}
    </AppShell>
  )
}

export default App
`,
    },
    {
      type: 'write',
      label: 'rewrite App.css with scanner dark theme',
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
  /* spacer to keep the toggle visually centered */
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

/* Welcome screen — Phase 6.1/6.2 */
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

/* Scanner screen — Phase 7.1. Frame overlay lands in 7.2. */
.scanner-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: min(100vw, calc(100dvh * 9 / 16));
}

.scanner-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
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

.scanner-overlay-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--color-surface);
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.55);
}

.scanner-instructions {
  width: 100%;
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
      type: 'check',
      label: 'phase3 regression',
      command: 'npm run check:phase3',
    },
    {
      type: 'commit',
      label: 'commit ScannerScreen extraction',
      message: 'feat(scanner): extract ScannerScreen with dark theme',
      paths: [
        'src/styles/theme.css',
        'src/i18n/locales/en.js',
        'src/i18n/locales/id.js',
        'src/i18n/locales/zh.js',
        'src/components/AppShell.jsx',
        'src/screens/ScannerScreen.jsx',
        'src/App.jsx',
        'src/App.css',
      ],
      as: 'scanner',
    },
    {
      type: 'write',
      label: 'record phase 7.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 7.1 — Extract ScannerScreen with dark theme\\n\\n**Status:** Code complete; manual visual and multilingual check pending user report  \\n**Goal:** Transition from the Phase 4 spike to a proper ScannerScreen component: dark rosewood-tinted background, back button in header, i18n-ready strings, and camera logic fully encapsulated so App.jsx becomes a thin router. Frame overlay and full error-message i18n are deferred to 7.2 and 7.3.  \\n**Files changed:** src/styles/theme.css (adds --color-scanner-bg), src/i18n/locales/en.js + id.js + zh.js (add scanner namespace, ~14 strings each), src/components/AppShell.jsx (accepts onBack prop, header becomes 3-column grid [back][toggle][spacer]), src/screens/ScannerScreen.jsx (new, self-contained camera logic + states + inline result), src/App.jsx (rewritten as thin router — camera state removed), src/App.css (rewritten scanner styles, .app--spike renamed .app--scanner, header 3-column grid).  \\n**User-visible result:** On Start Exploring, the app now opens a proper ScannerScreen with deep near-black background, camera video (when started) filling a 9:16 portrait frame, translated instruction text on scanning, translated buttons for Start/Stop/Try Again/Cancel/Scan Another, and a back arrow button in the header that returns to Welcome. The debug Scanner state: idle text is removed. Result display stays inline for now (Phase 8 extracts ScanResultScreen).  \\n**Automated checks:** npm run lint; node scripts/diagnose-css.mjs (tokens still resolve, no // comments reintroduced); npm run check:phase3 (7 exit-gate assertions).  \\n**Unit tests:** Intentionally omitted per urgent-policy override.  \\n**Manual checks:** Pending. Required: (1) npm run dev; (2) Welcome screen → click 中文 → all welcome copy in Chinese; click ID → Indonesian; click EN → English — this retires the Phase 6 ID/ZH check that was deferred; (3) click Start Exploring → ScannerScreen loads with back arrow at top-left of header, language toggle centered, dark background; (4) click Start Camera → camera permission prompt on desktop webcam, then video fills the frame; (5) scanning instructions appear below video in current language; (6) scan a valid QR (EXPO-001) → inline result view; (7) Scan Another → back to idle scanner; (8) click back arrow → returns to Welcome, camera releases; (9) switch language on scanner screen → instructions and buttons re-render in new language without restarting the camera; (10) resize to 320px → video frame scales, back button remains 44px, CTA remains tappable.  \\n**Not checked:** npm run build (deferred per user request). Frame overlay (mirror-scan-frame.png) — Phase 7.2. Full error-message i18n — Phase 7.3. ScanResultScreen as separate screen — Phase 8. Exhibit details, gallery — Phase 9. Real mobile device scanner layout — deferred to Phase 11, though the responsive design should already work on iPhone given the max-width and 9:16 constraints.  \\n**Remaining risks:** App.jsx no longer owns camera state, so it cannot forcibly stop the scanner on any external event (e.g. if App.jsx later adds a global navigation gesture). For now, back navigation and unmount cleanup handle everything; if a future phase adds a persistent nav element, review the cleanup path. The back button currently shows on scanner screen only — no other screen uses it yet, but Phase 8/9 will need to decide whether back on scan-result returns to scanner or welcome. Not yet decided. The scanner's dark near-black (#1a1210) is warmer than the mockup's Screen 2 reference (which shows a brighter camera preview); this is a preference decision — verify against the design proposal after 7.2 adds the frame overlay. i18n scanner strings are provisional pending expo team approval.  \\n**Decisions made:** Screen value spike renamed scanner to align with master plan screen naming. Back button lives in AppShell header (not inline in ScannerScreen) — this satisfies handoff §6.7's requirement that the language toggle remains accessible throughout the journey while keeping the two controls visually paired, and deviates slightly from the design proposal's '×' inside the frame for a better accessibility story. Header becomes 3-column grid with an empty right spacer so the toggle stays centered whether or not the back button is present. Camera state fully extracted into ScannerScreen, making App.jsx a thin router; Phase 8 will add a fourth screen (scan-result) and App.jsx gains a corresponding branch. Result display stays inline (temporary Phase 4 carry-over) until Phase 8 extracts it as its own screen — noted clearly in ScannerScreen comment. Debug 'Scanner state: idle' text removed from the UI — was developer noise, not product. --color-scanner-bg added as a proper token so future screens can reuse it. Full error message i18n (e.g. translating 'Invalid code (unsupported-format)') deferred to 7.3 where it will be reviewed as a whole with proper UI presentation.  \\n**Next part:** Phase 7.2 — add the mirror-scan-frame.png overlay on top of the scanner video. BLOCKED pending confirmation that mirror-scan-frame.png has been chroma-keyed to transparent (the user's original asset showed a white background; without chroma-key the overlay will show a white square instead of the live video).  \\n**Commit:** {{hash.scanner}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 7.1 progress',
      message: 'docs(progress): record phase 7.1 ScannerScreen extraction',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}