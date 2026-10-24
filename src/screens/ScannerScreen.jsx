import { useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { createQrScanner } from '../lib/qrScanner.js'
import { parseQrPayload } from '../lib/qrPayload.js'
import { getExhibitById } from '../lib/exhibitLookup.js'
import frameTl from '../assets/frame-tl.png'
import frameTr from '../assets/frame-tr.png'
import frameBl from '../assets/frame-bl.png'
import frameBr from '../assets/frame-br.png'

function classifyCameraError(error) {
  const name = error?.name || error?.cause?.name || ''

  if (name === 'NotAllowedError' || name === 'SecurityError') return 'permission-denied'
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'camera-unavailable'
  return 'scanner-error'
}

function formatTranslation(language, key, replacements = {}) {
  let value = getTranslation(language, key)
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replace('{' + name + '}', replacement)
  })
  return value
}

export function ScannerScreen({ language, onReturnHome, onExhibitDetected }) {
  const [scannerState, setScannerState] = useState('idle')
  const [inlineError, setInlineError] = useState(null)
  const [cameraErrorKind, setCameraErrorKind] = useState(null)
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
      setInlineError({ kind: 'invalid-code', detail: '' })
      return
    }

    const lookup = getExhibitById(parsed.exhibitId)
    if (!lookup.ok) {
      setInlineError({ kind: 'unknown-exhibit', detail: parsed.exhibitId })
      return
    }

    acceptedRef.current = true
    stopScanner()
    setInlineError(null)
    onExhibitDetected(lookup.exhibit)
  }

  async function handleStart() {
    if (!videoRef.current) return

    stopScanner()
    const scanner = createQrScanner()
    scannerRef.current = scanner
    setCameraErrorKind(null)
    setInlineError(null)
    setScannerState('requesting')

    try {
      await scanner.start(videoRef.current, {
        onDecode: handleDecode,
        onError: (error) => {
          stopScanner()
          setCameraErrorKind(classifyCameraError(error))
          setScannerState('error')
        },
      })
      setScannerState((state) => (state === 'requesting' ? 'scanning' : state))
    } catch (error) {
      stopScanner()
      setCameraErrorKind(classifyCameraError(error))
      setScannerState('error')
    }
  }

  function handleStop() {
    stopScanner()
    setScannerState('idle')
    setCameraErrorKind(null)
    setInlineError(null)
  }

  function handleReturnHome() {
    stopScanner()
    onReturnHome()
  }

  function getCameraErrorContent() {
    if (cameraErrorKind === 'permission-denied') {
      return {
        title: getTranslation(language, 'scanner.permissionDeniedTitle'),
        message: getTranslation(language, 'scanner.permissionDeniedMessage'),
      }
    }

    if (cameraErrorKind === 'camera-unavailable') {
      return {
        title: getTranslation(language, 'scanner.cameraUnavailableTitle'),
        message: getTranslation(language, 'scanner.cameraUnavailableMessage'),
      }
    }

    return {
      title: getTranslation(language, 'scanner.scannerErrorTitle'),
      message: getTranslation(language, 'scanner.scannerErrorMessage'),
    }
  }

  const cameraError = getCameraErrorContent()

  return (
    <section className="scanner-screen" aria-label={getTranslation(language, 'scanner.label')}>
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
        {scannerState === 'idle' && <p className="scanner-overlay-text">{getTranslation(language, 'scanner.cameraOff')}</p>}
        {scannerState === 'requesting' && (
          <p className="scanner-overlay-text" role="status">
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
            <div className="scanner-error" role="status">
              <h2 className="scanner-error-title">{cameraError.title}</h2>
              <p className="scanner-error-message">{cameraError.message}</p>
              {cameraErrorKind !== 'camera-unavailable' && (
                <button type="button" className="scanner-button" onClick={handleStart}>
                  {getTranslation(language, 'scanner.tryAgain')}
                </button>
              )}
              <button type="button" className="scanner-button scanner-button-secondary" onClick={handleReturnHome}>
                {getTranslation(language, 'scanner.returnHome')}
              </button>
            </div>
          )}

          {inlineError && (
            <div className="scanner-inline-error" role="status">
              <strong>
                {getTranslation(
                  language,
                  inlineError.kind === 'unknown-exhibit' ? 'scanner.unknownExhibitTitle' : 'scanner.invalidCodeTitle',
                )}
              </strong>
              <span>
                {inlineError.kind === 'unknown-exhibit'
                  ? formatTranslation(language, 'scanner.unknownExhibitMessage', { id: inlineError.detail })
                  : getTranslation(language, 'scanner.invalidCodeMessage')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
