// Isolated adapter around @zxing/browser.
// Screens depend on this module, not on ZXing directly.
//
// Contract:
//   const scanner = createQrScanner()
//   await scanner.start(videoElement, { onDecode, onError })
//   scanner.stop()
//   scanner.isStopped()
//
// - stop() is idempotent; releases the camera and stops the decoder.
// - onDecode fires at most once per distinct decoded text (deduped against
//   the previous text) so a held QR does not fire 60 times per second.
// - The adapter does NOT auto-stop after decode; the screen decides when to
//   accept a result and calls stop().
// - Dynamic import of @zxing/browser keeps this module Node-safe (for the
//   self-check) and lets Vite split the ~150 KB decoder out of the initial
//   bundle.
// - Race guard: if stop() is called while the dynamic import or
//   decodeFromConstraints is still pending, the pending controls are
//   released as soon as they resolve. Without this guard the media stream
//   would be assigned to a stopped scanner and never released, leaving the
//   camera LED on after the user leaves the scanner screen.

export function createQrScanner() {
  let controls = null
  let stopped = false
  let lastText = null

  async function start(videoElement, callbacks) {
    if (stopped || controls) return
    const { onDecode, onError } = callbacks || {}

    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser')
      if (stopped) return
      const reader = new BrowserQRCodeReader()

      const pendingControls = await reader.decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoElement,
        (result) => {
          if (stopped) return
          if (!result) return
          const text = result.getText()
          if (typeof text !== 'string' || text.length === 0) return
          if (text === lastText) return
          lastText = text
          if (onDecode) onDecode(text)
        },
      )

      // If stop() was called while the stream was initializing, immediately
      // release the pending controls. Also detach the video element's
      // srcObject so the browser fully releases the camera LED indicator.
      if (stopped) {
        try {
          pendingControls.stop()
        } catch {
          // ignore — stream may already be gone
        }
        try {
          if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject
            if (stream && typeof stream.getTracks === 'function') {
              stream.getTracks().forEach((track) => {
                try {
                  track.stop()
                } catch {
                  // ignore
                }
              })
            }
            videoElement.srcObject = null
          }
        } catch {
          // ignore
        }
        return
      }

      controls = pendingControls
    } catch (err) {
      if (stopped) return
      if (onError) onError(err)
    }
  }

  function stop() {
    if (stopped) return
    stopped = true
    if (controls) {
      try {
        controls.stop()
      } catch {
        // controls.stop() may throw if the stream already ended; ignore.
      }
      controls = null
    }
  }

  function isStopped() {
    return stopped
  }

  return { start, stop, isStopped }
}
