import { useMemo } from 'react'
import qrcode from 'qrcode-generator'
import { exhibits } from '../data/exhibits.js'
import { QR_BASE_URL } from '../config/qrConfig.js'

function buildQRDataUrl(url) {
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()
  const svg = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true })
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

function downloadQR(url, filename) {
  const dataUrl = buildQRDataUrl(url)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename + '.svg'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function AdminQRCodes({ onBack }) {
  const items = useMemo(
    () =>
      exhibits.map((exhibit) => {
        const url = QR_BASE_URL + '/?exhibit=' + exhibit.id
        const title =
          (exhibit.content && exhibit.content.id && exhibit.content.id.title) ||
          (exhibit.content && exhibit.content.en && exhibit.content.en.title) ||
          exhibit.id
        return { id: exhibit.id, title, url, dataUrl: buildQRDataUrl(url) }
      }),
    [],
  )

  return (
    <section className="admin-screen admin-qr-view">
      <header className="admin-header">
        <h1>QR Codes</h1>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn-primary" onClick={() => window.print()}>
            Print All
          </button>
          <button type="button" className="admin-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </header>

      <p className="admin-qr-help">
        Base URL: <strong>{QR_BASE_URL}</strong> — each QR opens the Scan Result screen for its exhibit when
        scanned with a phone camera. Print this page (browser Print → Save as PDF) to make physical labels.
      </p>

      <div className="admin-qr-grid">
        {items.map((item) => (
          <div key={item.id} className="admin-qr-card">
            <img src={item.dataUrl} alt={'QR code for ' + item.title} className="admin-qr-image" />
            <p className="admin-qr-id">{item.id}</p>
            <p className="admin-qr-title">{item.title}</p>
            <button
              type="button"
              className="admin-btn-secondary admin-btn-small admin-qr-download"
              onClick={() => downloadQR(item.url, item.id)}
            >
              Download SVG
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
