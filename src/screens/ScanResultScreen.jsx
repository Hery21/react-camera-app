import { decorativeAssets } from '../data/decorativeAssets.js'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'

export function ScanResultScreen({ language, exhibit, onViewDetails, onScanAgain }) {
  const { content, sourceLanguage, isFallback } = resolveExhibitContent(exhibit, language)

  return (
    <section className="scan-result-screen" aria-labelledby="scan-result-title">
      <img src={decorativeAssets.result.floralCorner} alt="" className="scan-result-floral-corner" aria-hidden="true" />

      <div className="scan-result-card">
        <div className="scan-result-artifact-area">
          <img src={decorativeAssets.result.medallion} alt="" className="scan-result-medallion" aria-hidden="true" />

          {exhibit.coverImage ? (
            <img className="scan-result-image" src={exhibit.coverImage} alt={content?.coverAlt || ''} />
          ) : (
            <div className="scan-result-placeholder" aria-hidden="true">
              <span>{exhibit.id}</span>
            </div>
          )}

          <img src={decorativeAssets.result.pedestal} alt="" className="scan-result-pedestal" aria-hidden="true" />
        </div>

        <div className="scan-result-copy">
          <p className="scan-result-kicker">{getTranslation(language, 'result.detected')}</p>
          <h1 id="scan-result-title" className="scan-result-title">
            {content?.title}
          </h1>
          {content?.period && <p className="scan-result-period">{content.period}</p>}
          {content?.summary && <p className="scan-result-summary">{content.summary}</p>}
        </div>

        {isFallback && (
          <p className="content-language-notice" role="status">
            {getTranslation(language, 'exhibit.translationUnavailable')}{' '}
            {getTranslation(language, 'language.' + sourceLanguage + 'FullName')}.
          </p>
        )}

        <img src={decorativeAssets.result.divider} alt="" className="scan-result-divider" aria-hidden="true" />

        <div className="scan-result-actions">
          <div className="scan-result-primary-wrap">
            <img src={decorativeAssets.result.buttonFlourish} alt="" className="scan-result-button-flourish" aria-hidden="true" />
            <button type="button" className="scan-result-primary" onClick={onViewDetails}>
              {getTranslation(language, 'result.viewDetails')}
            </button>
          </div>

          <button type="button" className="scan-result-secondary" onClick={onScanAgain}>
            {getTranslation(language, 'result.scanAgain')}
          </button>
        </div>
      </div>
    </section>
  )
}
