import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'
import frameTl from '../assets/frame-tl.png'
import frameTr from '../assets/frame-tr.png'
import frameBl from '../assets/frame-bl.png'
import frameBr from '../assets/frame-br.png'

export function ScanResultScreen({ language, exhibit, onViewDetails, onScanAgain }) {
  const { content } = resolveExhibitContent(exhibit, language)

  return (
    <section className="scan-result-screen" aria-labelledby="scan-result-title">
      <div className="scan-result-frame" aria-hidden="true">
        <img src={frameTl} alt="" className="scan-result-frame-corner scan-result-frame-tl" />
        <img src={frameTr} alt="" className="scan-result-frame-corner scan-result-frame-tr" />
        <img src={frameBl} alt="" className="scan-result-frame-corner scan-result-frame-bl" />
        <img src={frameBr} alt="" className="scan-result-frame-corner scan-result-frame-br" />
      </div>

      <div className="scan-result-content">
        <div className="scan-result-brand">
          <span>{getTranslation(language, 'app.eyebrow')}</span>
          <strong>{getTranslation(language, 'app.title')}</strong>
        </div>

        {exhibit.coverImage && (
          <div className="scan-result-image-wrap">
            <img className="scan-result-image" src={exhibit.coverImage} alt={content.coverAlt || ''} />
          </div>
        )}

        <div className="scan-result-copy">
          <h1 id="scan-result-title" className="scan-result-title">
            {content.title}
          </h1>
          {content.period && <p className="scan-result-period">{content.period}</p>}
          <p className="scan-result-detected">
            <span className="scan-result-check" aria-hidden="true">
              ✓
            </span>
            {getTranslation(language, 'result.detected')}
          </p>
        </div>

        <div className="scan-result-actions">
          <button type="button" className="scan-result-primary" onClick={onViewDetails}>
            {getTranslation(language, 'result.viewDetails')}
          </button>
          <button type="button" className="scan-result-secondary" onClick={onScanAgain}>
            {getTranslation(language, 'result.scanAgain')}
          </button>
        </div>
      </div>
    </section>
  )
}
