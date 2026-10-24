export default {
  name: 'Phase 5.3 — shared app shell and language toggle extraction',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Extracts LanguageToggle and AppShell into src/components/ (per master-plan source layout). No behavior change — the toggle stays centered in the header, the spike UI remains as children of AppShell. Semantic improvement: AppShell now renders div.app > header + main.app-main, giving exactly one <main> per page. Hero image integration is Phase 5.4, immediately after this. Back/Home button in the header is Phase 7.',
    },
    {
      type: 'write',
      label: 'create src/components/LanguageToggle.jsx',
      path: 'src/components/LanguageToggle.jsx',
      content: `import { SUPPORTED_LANGUAGES } from '../i18n/language.js'
import { getTranslation } from '../i18n/getTranslation.js'

// Three-way EN / ID / 中文 toggle.
// aria-pressed inside role="group" chosen over radiogroup/radio per
// handoff §8's explicit sanction of aria-pressed. Each button carries
// lang={code} so screen readers pronounce 中文 correctly even in an
// English UI.
export function LanguageToggle({ language, onLanguageChange }) {
  return (
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
          onClick={() => onLanguageChange(code)}
        >
          {getTranslation(language, 'language.' + code)}
        </button>
      ))}
    </div>
  )
}
`,
    },
    {
      type: 'write',
      label: 'create src/components/AppShell.jsx',
      path: 'src/components/AppShell.jsx',
      content: `import { LanguageToggle } from './LanguageToggle.jsx'

// Top-level layout wrapper shared by every screen.
// Structure:
//   <div className="app">
//     <header className="app-header"> ... language toggle ...
//     <main className="app-main"> {children} </main>
//
// The header currently centers the toggle. When Phase 7 adds a Back
// button, the header layout will need a left slot — that is a Phase 7
// concern, deliberately not built speculatively here (YAGNI).
//
// One <main> per page (rendered here) keeps the document outline correct
// as Phase 6/7/8/9 mount different screen components as children.
export function AppShell({ language, onLanguageChange, children }) {
  return (
    <div className="app">
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
      label: 'rewrite App.jsx to use AppShell',
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
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit app shell extraction',
      message: 'refactor(ui): extract AppShell and LanguageToggle components',
      paths: [
        'src/components/LanguageToggle.jsx',
        'src/components/AppShell.jsx',
        'src/App.jsx',
      ],
      as: 'shell',
    },
    {
      type: 'write',
      label: 'record phase 5.3 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 5.3 — Shared app shell and language toggle extraction\n\n**Status:** Code complete; no manual check required (no behavior change)  \n**Goal:** Establish the reusable screen shell and extract the language toggle into a named component, per the master-plan source layout. This unblocks Phase 6/7/8/9 from each reimplementing the header.  \n**Files changed:** src/components/LanguageToggle.jsx (new), src/components/AppShell.jsx (new), src/App.jsx (refactored to render AppShell with the existing placeholder + spike as children).  \n**User-visible result:** None — the toggle stays centered in the header, the placeholder copy is unchanged, the spike UI is unchanged. Behavior identical to Phase 5.2.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override. This is a structural extraction with no new logic.  \n**Manual checks:** Optional — verify the toggle still works (click ID, click 中文, click EN) and the spike camera flow is unchanged. If anything looks different from 5.2, something regressed.  \n**Not checked:** npm run build (deferred per user request). Hero image display — deferred to Phase 5.4. Back/Home header button — deferred to Phase 7 (production scanner).  \n**Remaining risks:** The AppShell header is centered-toggle-only; when Phase 7 adds a Back button, the header CSS will need a small refactor (probably grid with three slots). Documented as a Phase 7 concern, not pre-built speculatively. The LanguageToggle component's SUPPORTED_LANGUAGES import was moved from App.jsx to LanguageToggle.jsx — no other consumer of that constant exists yet.  \n**Decisions made:** Master-plan source layout followed exactly (src/components/AppShell.jsx, src/components/LanguageToggle.jsx). Semantic improvement: AppShell renders div.app > header + main.app-main, so the page has exactly one <main> element. Previously the outer <main className=\"app\"> wrapped header+content, which was imprecise (header is not main content). No per-component CSS files introduced — styles stay in App.css for now; if a future phase needs component-scoped CSS we will add it then. Back/Home button deliberately not stubbed — YAGNI; Phase 7 will add it with the actual production scanner's requirements in view.  \n**Next part:** Phase 5.4 — hero image integration. Import src/assets/mirror-hero.png into App.jsx, render it above the placeholder text with width/height attributes to prevent layout shift, with appropriate alt text (empty alt since it is decorative in the spike, real alt in Phase 6 when the Welcome screen gives it semantic meaning). This proves the asset pipeline works end-to-end before Phase 6 commits the Welcome composition to its final layout.  \n**Commit:** {{hash.shell}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 5.3 progress',
      message: 'docs(progress): record phase 5.3 app shell',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}