import { useCallback, useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { decorativeAssets } from '../data/decorativeAssets.js'

const TWIBBONS = [
  { id: 'default', src: '/twibbon.png' },
  { id: 'alt', src: '/twibbon-2.webp' },
]
const MAX_OUTPUT = 1440

function classifyCameraError(error) {
  const name = error?.name || error?.cause?.name || ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'permission-denied'
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'camera-unavailable'
  return 'error'
}

export function TwibbonPhotoScreen({ language }) {
  const [cameraState, setCameraState] = useState('requesting')
  const [errorKind, setErrorKind] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)
  const [facingMode, setFacingMode] = useState('environment')
  const [selectedTwibbonId, setSelectedTwibbonId] = useState('default')
  const videoRef = useRef(null)
  const twibbonRefs = useRef({})
  const streamRef = useRef(null)
  const previewUrlRef = useRef(null)
  const previewBlobRef = useRef(null)

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop() } catch { /* ignore */ }
      })
      streamRef.current = null
    }
    if (videoRef.current && videoRef.current.srcObject) {
      try { videoRef.current.srcObject = null } catch { /* ignore */ }
    }
  }

  const startStream = useCallback(async () => {
    if (!videoRef.current) return
    stopStream()
    setErrorKind(null)
    setStatusMessage(null)
    setCameraState('requesting')

    try {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false })
      } catch (err) {
        if (err?.name === 'OverconstrainedError' || err?.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } else {
          throw err
        }
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        try { await videoRef.current.play() } catch { /* ignore */ }
      }
      setCameraState('live')
    } catch (err) {
      stopStream()
      setErrorKind(classifyCameraError(err))
      setCameraState('error')
    }
  }, [facingMode])

  const startStreamRef = useRef(startStream)
  useEffect(() => {
    startStreamRef.current = startStream
  }, [startStream])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) void startStreamRef.current()
    })
    return () => {
      cancelled = true
      stopStream()
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [sessionKey])

  function showStatus(message) {
    setStatusMessage(message)
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current))
    }, 2500)
  }

  function handleCapture() {
    const video = videoRef.current
    const twibbon = twibbonRefs.current[selectedTwibbonId]
    if (!video || !twibbon || !twibbon.naturalWidth) return

    const naturalW = twibbon.naturalWidth
    const naturalH = twibbon.naturalHeight
    const scale = Math.min(1, MAX_OUTPUT / Math.max(naturalW, naturalH))
    const outW = Math.max(1, Math.round(naturalW * scale))
    const outH = Math.max(1, Math.round(naturalH * scale))

    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const videoW = video.videoWidth
    const videoH = video.videoHeight
    const videoAspect = videoW / videoH
    const outAspect = outW / outH

    let sx = 0, sy = 0, sw = videoW, sh = videoH
    if (videoAspect > outAspect) {
      sw = videoH * outAspect
      sx = (videoW - sw) / 2
    } else {
      sh = videoW / outAspect
      sy = (videoH - sh) / 2
    }

    if (facingMode === 'user') {
      ctx.save()
      ctx.translate(outW, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH)
      ctx.restore()
    } else {
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH)
    }

    ctx.drawImage(twibbon, 0, 0, outW, outH)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showStatus(getTranslation(language, 'scanner.scannerErrorMessage'))
          return
        }
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
        const url = URL.createObjectURL(blob)
        previewUrlRef.current = url
        previewBlobRef.current = blob
        setPreviewUrl(url)
        stopStream()
        setCameraState('preview')
      },
      'image/png',
      0.95,
    )
  }

  function handleRetake() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    previewBlobRef.current = null
    setPreviewUrl(null)
    setStatusMessage(null)
    setErrorKind(null)
    setCameraState('requesting')
    setSessionKey((k) => k + 1)
  }

  function handleToggleCamera() {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
    setSessionKey((k) => k + 1)
  }

  function handleSelectTwibbon(id) {
    if (id === selectedTwibbonId) return
    setSelectedTwibbonId(id)
  }

  function handleSave() {
    if (!previewUrl) return
    try {
      const anchor = document.createElement('a')
      anchor.href = previewUrl
      anchor.download = 'twibbon-' + Date.now() + '.png'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      showStatus(getTranslation(language, 'twibbon.saved'))
    } catch {
      showStatus(getTranslation(language, 'scanner.scannerErrorMessage'))
    }
  }

  async function handleShare() {
    const blob = previewBlobRef.current
    if (!blob) return
    const file = new File([blob], 'twibbon.png', { type: 'image/png' })
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: getTranslation(language, 'twibbon.title') })
        return
      } catch { /* fall through to save */ }
    }
    handleSave()
  }

  function getErrorContent() {
    if (errorKind === 'permission-denied') {
      return {
        title: getTranslation(language, 'scanner.permissionDeniedTitle'),
        body: getTranslation(language, 'scanner.permissionDeniedMessage'),
      }
    }
    if (errorKind === 'camera-unavailable') {
      return {
        title: getTranslation(language, 'scanner.cameraUnavailableTitle'),
        body: getTranslation(language, 'scanner.cameraUnavailableMessage'),
      }
    }
    return {
      title: getTranslation(language, 'scanner.scannerErrorTitle'),
      body: getTranslation(language, 'scanner.scannerErrorMessage'),
    }
  }

  const errorContent = getErrorContent()
  const showStage = cameraState !== 'error'
  const isFront = facingMode === 'user'

  return (
    <section className="twibbon-screen" aria-label={getTranslation(language, 'twibbon.title')}>
      {showStage && cameraState !== 'preview' && (
        <div className="twibbon-stage">
          <video
            ref={videoRef}
            className={'twibbon-video' + (isFront ? ' twibbon-video--mirrored' : '')}
            playsInline
            muted
            autoPlay
          />
          {TWIBBONS.map((tw) => (
            <img
              key={tw.id}
              ref={(node) => { twibbonRefs.current[tw.id] = node }}
              src={tw.src}
              alt=""
              className={'twibbon-overlay' + (tw.id === selectedTwibbonId ? '' : ' twibbon-overlay-hidden')}
            />
          ))}
          {cameraState === 'live' && (
            <button
              type="button"
              className="twibbon-toggle-camera"
              onClick={handleToggleCamera}
              aria-label={getTranslation(language, 'twibbon.switchCamera')}
              title={getTranslation(language, 'twibbon.switchCamera')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.64-.79 3.09-2 4h2.42c1.09-1.38 1.58-3.09 1.58-4 0-3.87-3.13-7-7-7zm-5 7c0-1.64.79-3.09 2-4H6.58C5.49 10.38 5 12.09 5 13c0 3.87 3.13 7 7 7v3l4-4-4-4v3c-2.76 0-5-2.24-5-5z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {showStage && cameraState === 'preview' && previewUrl && (
        <div className="twibbon-stage">
          <img src={previewUrl} alt={getTranslation(language, 'twibbon.title')} className="twibbon-preview" />
        </div>
      )}

      {cameraState === 'live' && (
        <div className="twibbon-picker" role="group" aria-label={getTranslation(language, 'twibbon.selectFrame')}>
          {TWIBBONS.map((tw, index) => (
            <button
              key={tw.id}
              type="button"
              className={'twibbon-picker-button' + (tw.id === selectedTwibbonId ? ' twibbon-picker-button-active' : '')}
              onClick={() => handleSelectTwibbon(tw.id)}
              aria-pressed={tw.id === selectedTwibbonId}
              aria-label={getTranslation(language, 'twibbon.selectFrame') + ' ' + (index + 1)}
              title={getTranslation(language, 'twibbon.selectFrame') + ' ' + (index + 1)}
            >
              <img src={tw.src} alt="" className="twibbon-picker-thumb" />
            </button>
          ))}
        </div>
      )}

      {cameraState === 'requesting' && (
        <p className="twibbon-status" role="status">
          {getTranslation(language, 'twibbon.requesting')}
        </p>
      )}

      {cameraState === 'error' && (
        <div className="twibbon-error" role="status">
          <h2>{errorContent.title}</h2>
          <p>{errorContent.body}</p>
          <button type="button" className="twibbon-button twibbon-button-primary" onClick={startStream}>
            {getTranslation(language, 'scanner.tryAgain')}
          </button>
        </div>
      )}

      <div className="twibbon-controls">
        {cameraState === 'live' && (
          <button
            type="button"
            className="twibbon-button twibbon-button-primary twibbon-button-shutter"
            onClick={handleCapture}
          >
            {getTranslation(language, 'twibbon.takePhoto')}
          </button>
        )}

        {cameraState === 'preview' && (
          <>
            <p className="twibbon-share-reminder">{getTranslation(language, 'twibbon.shareReminder')}</p>
            <div className="twibbon-button-primary-wrap">
              <img
                src={decorativeAssets.result.buttonFlourish}
                alt=""
                className="twibbon-button-flourish"
                aria-hidden="true"
              />
              <button type="button" className="twibbon-button twibbon-button-primary" onClick={handleShare}>
                {getTranslation(language, 'twibbon.share')}
              </button>
            </div>
            <div className="twibbon-controls-row">
              <button type="button" className="twibbon-button" onClick={handleSave}>
                {getTranslation(language, 'twibbon.save')}
              </button>
              <button type="button" className="twibbon-button twibbon-button-secondary" onClick={handleRetake}>
                {getTranslation(language, 'twibbon.retake')}
              </button>
            </div>
          </>
        )}
      </div>

      {statusMessage && (
        <p className="twibbon-toast" role="status">
          {statusMessage}
        </p>
      )}
    </section>
  )
}
