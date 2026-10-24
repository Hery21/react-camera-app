import { useState, useMemo } from 'react'
import { decorativeAssets } from '../data/decorativeAssets.js'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'
import frameTl from '../assets/frame-tl.webp'
import frameTr from '../assets/frame-tr.webp'
import frameBl from '../assets/frame-bl.webp'
import frameBr from '../assets/frame-br.webp'

export function ExhibitScreen({ language, exhibit, onBackToResult }) {
  const { content, sourceLanguage, isFallback } = resolveExhibitContent(exhibit, language)

  const sections = useMemo(() => {
    const available = [{ id: 'story', label: getTranslation(language, 'exhibit.story') }]
    if (content?.symbolism) available.push({ id: 'symbolism', label: getTranslation(language, 'exhibit.symbolism') })
    if (exhibit.gallery?.length) available.push({ id: 'gallery', label: getTranslation(language, 'exhibit.gallery') })
    return available
  }, [content?.symbolism, exhibit.gallery, language])

  const [activeSection, setActiveSection] = useState('story')
  const [page, setPage] = useState(0)
  const [textSize, setTextSize] = useState(0)

  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id
  const selectedLabel = sections.find((section) => section.id === selectedSection)?.label
  const isGallery = selectedSection === 'gallery'

  const pages = useMemo(() => {
    if (selectedSection === 'symbolism') {
      return [{ text: content?.symbolism || '' }]
    }
    if (content?.pages?.length) {
      return content.pages
    }
    return [{ text: content?.story || '' }]
  }, [content, selectedSection])

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setPage(0)
  }

  function handleTextSizeChange(nextSize) {
    setTextSize(nextSize)
  }

  const currentPage = pages[page] || {}
  const paragraphs = currentPage.text ? currentPage.text.split('\n') : []

  return (
    <article className={'exhibit-screen exhibit-text-size-' + textSize} aria-labelledby="exhibit-title">
      <div className="exhibit-top-font-controls" role="group" aria-label={getTranslation(language, 'exhibit.textSize')}>
        <button type="button" onClick={() => handleTextSizeChange(Math.max(0, textSize - 1))} disabled={textSize === 0} aria-label={getTranslation(language, 'exhibit.decreaseText')}>A−</button>
        <button type="button" onClick={() => handleTextSizeChange(Math.min(2, textSize + 1))} disabled={textSize === 2} aria-label={getTranslation(language, 'exhibit.increaseText')}>A+</button>
      </div>
      <img src={decorativeAssets.article.crown} alt="" className="exhibit-crown" aria-hidden="true" />
      <img src={decorativeAssets.article.cloud} alt="" className="exhibit-cloud" aria-hidden="true" />

      <header className="exhibit-hero">
        {exhibit.coverImage && (
          <div className="exhibit-cover-wrap">
            <img className="exhibit-cover" src={exhibit.coverImage} alt={content?.coverAlt || ''} />
          </div>
        )}
        <div className="exhibit-heading">
          <h1 id="exhibit-title">{content?.title}</h1>
          {content?.period && <p className="exhibit-period">{content.period}</p>}
          {content?.summary && <p className="exhibit-summary">{content.summary}</p>}
        </div>
      </header>

      {isFallback && (
        <p className="content-language-notice exhibit-language-notice" role="status">
          {getTranslation(language, 'exhibit.translationUnavailable')} {getTranslation(language, 'language.' + sourceLanguage + 'FullName')}.
        </p>
      )}

      <img src={decorativeAssets.article.divider} alt="" className="exhibit-divider" aria-hidden="true" />

      {sections.length > 1 && (
        <nav className="exhibit-tabs" aria-label={getTranslation(language, 'exhibit.sections')}>
          {sections.map((section) => (
            <button key={section.id} type="button" className="exhibit-tab" aria-pressed={selectedSection === section.id} onClick={() => handleSectionChange(section.id)}>
              {section.label}
            </button>
          ))}
        </nav>
      )}

      <section className="exhibit-reader" aria-labelledby="exhibit-section-title">
        <div className="exhibit-reader-frame" aria-hidden="true">
          <img src={frameTl} alt="" className="exhibit-reader-corner exhibit-reader-corner-tl" />
          <img src={frameTr} alt="" className="exhibit-reader-corner exhibit-reader-corner-tr" />
          <img src={frameBl} alt="" className="exhibit-reader-corner exhibit-reader-corner-bl" />
          <img src={frameBr} alt="" className="exhibit-reader-corner exhibit-reader-corner-br" />
        </div>
        <div className="exhibit-section-heading">
          <h2 id="exhibit-section-title">{selectedLabel}</h2>
        </div>

        {isGallery ? (
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
          <div className="exhibit-page-viewport">
            <div className="exhibit-page-scroll-area">
              {currentPage.image?.src && (
                <img className="exhibit-page-image" src={currentPage.image.src} alt={currentPage.image.alt || ''} />
              )}
              {paragraphs.length > 0 && (
                <div className="exhibit-page-text">
                  {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {!isGallery && (
        <nav className="exhibit-page-navigation" aria-label={getTranslation(language, 'exhibit.sections')}>
          <button type="button" className="exhibit-page-arrow" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} aria-label={getTranslation(language, 'exhibit.previous')}>
            <img src={decorativeAssets.gallery.previous} alt="" />
          </button>
          <p className="exhibit-page-status" aria-live="polite">{page + 1} / {pages.length}</p>
          <button type="button" className="exhibit-page-arrow" onClick={() => setPage((current) => Math.min(pages.length - 1, current + 1))} disabled={page === pages.length - 1} aria-label={getTranslation(language, 'exhibit.next')}>
            <img src={decorativeAssets.gallery.next} alt="" />
          </button>
        </nav>
      )}

      <img src={decorativeAssets.article.floralBottom} alt="" className="exhibit-floral-bottom" aria-hidden="true" />

      <footer className="exhibit-actions">
        <button type="button" className="exhibit-secondary" onClick={onBackToResult}>{getTranslation(language, 'exhibit.backToResult')}</button>
      </footer>
    </article>
  )
}
