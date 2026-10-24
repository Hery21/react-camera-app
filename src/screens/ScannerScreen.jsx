import { useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { createQrScanner } from '../lib/qrScanner.js'
import { parseQrPayload } from '../lib/qrPayload.js'
import { getExhibitById } from '../lib/exhibitLookup.js'
import frameTl from '../assets/frame-tl.png'
import frameTr from '../assets/frame-tr.png'
import frameBl from '../assets/frame-bl.png'
import frameBr from '../assets/frame-br.png'

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
    setScannerState((state) => (state === 'requesting' ? 'scanning' : state))
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
        <video ref={videoRef} className="scanner-video" playsInline muted />
        <div className="scanner-frame-overlay" aria-hidden="true">
          <img src={frameTl} alt="" className="scan-frame-corner frame-tl" />
          <img src={frameTr} alt="" className="scan-frame-corner frame-tr" />
          <img src={frameBl} alt="" className="scan-frame-corner frame-bl" />
          <img src={frameBr} alt="" className="scan-frame-corner frame-br" />
        </div>
        <div className="scanner-scan-target" aria-hidden="true">
          <span className="scanner-target-corner scanner-target-tl" />
          <span className="scanner-target-corner scanner-target-tr" />
          <span className="scanner-target-corner scanner-target-bl" />
          <span className="scanner-target-corner scanner-target-br" />
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
      <div className="scanner-bottom-panel">
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
              <button type="button" className="scanner-button scanner-button-secondary" onClick={handleStop}>
                {getTranslation(language, 'scanner.cancel')}
              </button>
            </div>
          )}
          {inlineError && (
            <p className="scanner-inline-error" role="status">
              {inlineError.kind === 'unknown-exhibit'
                ? getTranslation(language, 'scanner.unknownExhibit') + ': ' + inlineError.detail + ' — ' + getTranslation(language, 'scanner.keepScanning')
                : getTranslation(language, 'scanner.invalidCode') + ' (' + inlineError.kind + ') — ' + getTranslation(language, 'scanner.keepScanning')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
