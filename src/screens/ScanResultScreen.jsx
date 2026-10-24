import { getTranslation } from '../i18n/getTranslation.js'
import { getExhibitContent } from '../lib/getExhibitContent.js'

export function ScanResultScreen({ language, exhibit, onViewDetails, onScanAgain }) {
  const content = getExhibitContent(exhibit, language)

  return (
    <section className="scan-result-screen" aria-labelledby="scan-result-title">
      <div className="scan-result-ornament" aria-hidden="true" />
      <div className="scan-result-card">
        {exhibit.coverImage && (
          <div className="scan-result-image-wrap">
            <img className="scan-result-image" src={exhibit.coverImage} alt={content.coverAlt || ''} />
          </div>
        )}

        <div className="scan-result-copy">
          <p className="scan-result-kicker">{getTranslation(language, 'result.detected')}</p>
          <h1 id="scan-result-title" className="scan-result-title">
            {content.title}
          </h1>
          {content.period && <p className="scan-result-period">{content.period}</p>}
          {content.summary && <p className="scan-result-summary">{content.summary}</p>}
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
