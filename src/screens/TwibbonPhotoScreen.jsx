import { useCallback, useEffect, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'

const TWIBBON_SRC = '/twibbon.png'
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
  const videoRef = useRef(null)
  const twibbonImgRef = useRef(null)
  const streamRef = useRef(null)
  const previewUrlRef = useRef(null)
  const previewBlobRef = useRef(null)

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch {
          // ignore
        }
      })
      streamRef.current = null
    }
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        videoRef.current.srcObject = null
      } catch {
        // ignore
      }
    }
  }

  const startStream = useCallback(async () => {
    if (!videoRef.current) return
    stopStream()
    setErrorKind(null)
    setStatusMessage(null)
    setCameraState('requesting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        try {
          await videoRef.current.play()
        } catch {
          // Some browsers reject play() without a further gesture; the muted attribute usually allows it
        }
      }
      setCameraState('live')
    } catch (err) {
      stopStream()
      setErrorKind(classifyCameraError(err))
      setCameraState('error')
    }
  }, [])

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
  }, [])

  function showStatus(message) {
    setStatusMessage(message)
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current))
    }, 2500)
  }

  function handleCapture() {
    const video = videoRef.current
    const twibbon = twibbonImgRef.current
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

    let sx = 0
    let sy = 0
    let sw = videoW
    let sh = videoH
    if (videoAspect > outAspect) {
      sw = videoH * outAspect
      sx = (videoW - sw) / 2
    } else {
      sh = videoW / outAspect
      sy = (videoH - sh) / 2
    }

    ctx.save()
    ctx.translate(outW, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH)
    ctx.restore()

    ctx.drawImage(twibbon, 0, 0, outW, outH)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showStatus(getTranslation(language, 'scanner.scannerErrorMessage'))
          return
        }
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current)
        }
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
    void startStream()
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
      } catch {
        // User cancelled or share failed silently; fall through to save
      }
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

  return (
    <section className="twibbon-screen" aria-label={getTranslation(language, 'twibbon.title')}>
      {cameraState !== 'preview' && cameraState !== 'error' && (
        <div className="twibbon-stage">
          <video ref={videoRef} className="twibbon-video" playsInline muted autoPlay />
          <img ref={twibbonImgRef} src={TWIBBON_SRC} alt="" className="twibbon-overlay" />
        </div>
      )}

      {cameraState === 'preview' && previewUrl && (
        <div className="twibbon-stage">
          <img src={previewUrl} alt={getTranslation(language, 'twibbon.title')} className="twibbon-preview" />
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
          <button type="button" className="twibbon-button" onClick={startStream}>
            {getTranslation(language, 'scanner.tryAgain')}
          </button>
        </div>
      )}

      <div className="twibbon-controls">
        {cameraState === 'live' && (
          <button type="button" className="twibbon-button twibbon-button-primary" onClick={handleCapture}>
            {getTranslation(language, 'twibbon.takePhoto')}
          </button>
        )}
        {cameraState === 'preview' && (
          <>
            <button type="button" className="twibbon-button twibbon-button-primary" onClick={handleShare}>
              {getTranslation(language, 'twibbon.share')}
            </button>
            <button type="button" className="twibbon-button" onClick={handleSave}>
              {getTranslation(language, 'twibbon.save')}
            </button>
            <button type="button" className="twibbon-button twibbon-button-secondary" onClick={handleRetake}>
              {getTranslation(language, 'twibbon.retake')}
            </button>
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
