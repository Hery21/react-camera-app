import { useMemo, useState } from 'react'
import qrcode from 'qrcode-generator'
import { exhibits } from '../data/exhibits.js'
import { QR_BASE_URL } from '../config/qrConfig.js'
import { QR_FRAME_SRC, downloadCompositeJPG } from '../lib/qrComposite.js'

function buildQRDataUrl(url) {
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()
  const svg = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true })
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export function AdminQRCodes({ onBack }) {
  const [statusById, setStatusById] = useState({})
  const [busyId, setBusyId] = useState(null)

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

  async function handleDownloadJPG(item) {
    setBusyId(item.id)
    setStatusById((prev) => ({ ...prev, [item.id]: null }))
    try {
      await downloadCompositeJPG(item.dataUrl, item.id)
      setStatusById((prev) => ({ ...prev, [item.id]: 'ok' }))
    } catch (err) {
      setStatusById((prev) => ({ ...prev, [item.id]: 'error: ' + String(err) }))
    } finally {
      setBusyId(null)
    }
  }

  async function handleDownloadAll() {
    for (const item of items) {
      await handleDownloadJPG(item)
    }
  }

  return (
    <section className="admin-screen admin-qr-view">
      <header className="admin-header">
        <h1>QR Codes</h1>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn-primary" onClick={() => window.print()}>
            Print All
          </button>
          <button type="button" className="admin-btn-secondary" onClick={handleDownloadAll}>
            Download All JPG
          </button>
          <button type="button" className="admin-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </header>

      <p className="admin-qr-help">
        Base URL: <strong>{QR_BASE_URL}</strong> — each QR opens the Scan Result screen for its exhibit when
        scanned with a phone camera. The QR is sized to 25% of the frame and centered. Use "Print All" to print
        the composite layout, or "Download JPG" to save individual composites.
      </p>

      <div className="admin-qr-grid">
        {items.map((item) => {
          const status = statusById[item.id]
          return (
            <div key={item.id} className="admin-qr-card">
              <div className="admin-qr-frame-wrap">
                <img src={QR_FRAME_SRC} alt="" className="admin-qr-frame-img" aria-hidden="true" />
                <img src={item.dataUrl} alt={'QR code for ' + item.title} className="admin-qr-overlay" />
              </div>
              {/* <p className="admin-qr-id">{item.id}</p> */}
              <p className="admin-qr-title">{item.title}</p>
              <button
                type="button"
                className="admin-btn-primary admin-btn-small admin-qr-download"
                onClick={() => handleDownloadJPG(item)}
                disabled={busyId === item.id}
              >
                {busyId === item.id ? 'Downloading…' : 'Download JPG'}
              </button>
              {status === 'ok' && <p className="admin-qr-status admin-qr-status-ok">Downloaded</p>}
              {status && status !== 'ok' && <p className="admin-qr-status admin-qr-status-err">{status}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
