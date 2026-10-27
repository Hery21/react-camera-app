// Composites a QR code image (SVG data URL) onto the frame image and
// returns a JPG-encoded canvas. Used by the admin QR Codes view for the
// "Download JPG" button. Display of the composite in the admin grid uses
// CSS overlay (no JS) — this file is only for on-demand downloads.
//
// The QR is sized to QR_SIZE_RATIO of the frame's SMALLER dimension, then
// centered. This matches the CSS display math (max-width/max-height on the
// overlay image) so what you see in the browser matches what you download.
//
// If printed QRs are not scanning reliably, bump QR_SIZE_RATIO to 0.35 or
// 0.4. Anything above 0.5 starts to overpower the frame art.

export const QR_FRAME_SRC = '/QR/QR-cover.webp'
export const QR_SIZE_RATIO = 0.25

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image: ' + src))
    img.src = src
  })
}

export async function composeCompositeCanvas(qrDataUrl, frameSrc = QR_FRAME_SRC) {
  const [frame, qr] = await Promise.all([loadImage(frameSrc), loadImage(qrDataUrl)])
  const frameW = frame.naturalWidth || frame.width
  const frameH = frame.naturalHeight || frame.height
  if (!frameW || !frameH) throw new Error('Frame image has zero dimensions')

  const qrSize = Math.round(Math.min(frameW, frameH) * QR_SIZE_RATIO)
  const qrX = Math.round((frameW - qrSize) / 2)
  const qrY = Math.round((frameH - qrSize) / 2)

  const canvas = document.createElement('canvas')
  canvas.width = frameW
  canvas.height = frameH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2d context')

  // White base — JPG has no alpha; without this, transparent frame regions
  // become black in the exported image.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, frameW, frameH)

  ctx.drawImage(frame, 0, 0, frameW, frameH)

  // White plate behind the QR — ensures the QR is always scannable
  // regardless of what's behind it in the frame art.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(qrX, qrY, qrSize, qrSize)

  ctx.drawImage(qr, qrX, qrY, qrSize, qrSize)

  return canvas
}

export async function downloadCompositeJPG(qrDataUrl, filename, frameSrc = QR_FRAME_SRC) {
  const canvas = await composeCompositeCanvas(qrDataUrl, frameSrc)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob returned null'))
          return
        }
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename + '.jpg'
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
        resolve()
      },
      'image/jpeg',
      0.92,
    )
  })
}
