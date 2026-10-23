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
//   accept a result and calls stop(). Rejecting an invalid payload keeps the
//   scanner alive so the visitor can try a different exhibit.
// - Dynamic import of @zxing/browser keeps this module Node-safe (for the
//   self-check) and lets Vite split the ~150 KB decoder out of the initial
//   bundle.

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

      controls = await reader.decodeFromConstraints(
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
        }
      )
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
