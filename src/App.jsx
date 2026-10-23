import { useEffect, useRef, useState } from 'react'
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
