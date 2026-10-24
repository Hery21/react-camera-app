import { useMemo, useState } from 'react'
import { decorativeAssets } from '../data/decorativeAssets.js'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'

export function ExhibitScreen({ language, exhibit, onBackToResult, onScanNext }) {
  const { content, sourceLanguage, isFallback } = resolveExhibitContent(exhibit, language)
  const sections = useMemo(() => {
    const available = [{ id: 'story', label: getTranslation(language, 'exhibit.story') }]
    if (content?.symbolism) {
      available.push({ id: 'symbolism', label: getTranslation(language, 'exhibit.symbolism') })
    }
    if (exhibit.gallery?.length) {
      available.push({ id: 'gallery', label: getTranslation(language, 'exhibit.gallery') })
    }
    return available
  }, [content?.symbolism, exhibit.gallery, language])
  const [activeSection, setActiveSection] = useState('story')
  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id
  const selectedLabel = sections.find((section) => section.id === selectedSection)?.label

  return (
    <article className="exhibit-screen" aria-labelledby="exhibit-title">
      <img src={decorativeAssets.article.crown} alt="" className="exhibit-crown" aria-hidden="true" />
      <img src={decorativeAssets.article.cloud} alt="" className="exhibit-cloud" aria-hidden="true" />

      <header className="exhibit-hero">
        {exhibit.coverImage && (
          <div className="exhibit-cover-wrap">
            <img className="exhibit-cover" src={exhibit.coverImage} alt={content?.coverAlt || ''} />
          </div>
        )}
        <div className="exhibit-heading">
          <p className="exhibit-eyebrow">{getTranslation(language, 'exhibit.articleLabel')}</p>
          <h1 id="exhibit-title">{content?.title}</h1>
          {content?.period && <p className="exhibit-period">{content.period}</p>}
          {content?.summary && <p className="exhibit-summary">{content.summary}</p>}
        </div>
      </header>

      {isFallback && (
        <p className="content-language-notice exhibit-language-notice" role="status">
          {getTranslation(language, 'exhibit.translationUnavailable')} {getTranslation(language, 'language.' + sourceLanguage + 'FullName')}
          .
        </p>
      )}

      <img src={decorativeAssets.article.divider} alt="" className="exhibit-divider" aria-hidden="true" />

      {sections.length > 1 && (
        <nav className="exhibit-tabs" aria-label={getTranslation(language, 'exhibit.sections')}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="exhibit-tab"
              aria-pressed={selectedSection === section.id}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      )}

      <section className="exhibit-reading-panel" aria-labelledby="exhibit-section-title">
        <div className="exhibit-section-heading">
          <img src={decorativeAssets.article.knot} alt="" className="exhibit-section-knot" aria-hidden="true" />
          <h2 id="exhibit-section-title">{selectedLabel}</h2>
        </div>

        <div className="exhibit-reading-scroll">
          {selectedSection === 'gallery' ? (
            <div className="exhibit-gallery">
              {exhibit.gallery.map((image) => {
                const imageContent = image.content?.[language] || image.content?.id || image.content?.en || {}
                return (
                  <figure className="exhibit-gallery-item" key={image.src}>
                    <img className="exhibit-gallery-image" src={image.src} alt={imageContent.alt || ''} loading="lazy" />
                    {imageContent.caption && <figcaption>{imageContent.caption}</figcaption>}
                  </figure>
                )
              })}
            </div>
          ) : (
            <p className="exhibit-article-text">{selectedSection === 'symbolism' ? content?.symbolism : content?.story}</p>
          )}
        </div>
      </section>

      <img src={decorativeAssets.article.floralBottom} alt="" className="exhibit-floral-bottom" aria-hidden="true" />

      <footer className="exhibit-actions">
        <button type="button" className="exhibit-primary" onClick={onScanNext}>
          {getTranslation(language, 'exhibit.scanNext')}
        </button>
        <button type="button" className="exhibit-secondary" onClick={onBackToResult}>
          {getTranslation(language, 'exhibit.backToResult')}
        </button>
      </footer>
    </article>
  )
}
