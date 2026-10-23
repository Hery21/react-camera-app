import { useEffect, useRef, useState } from 'react'
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
            {'\u2190 Return to Welcome'}
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
