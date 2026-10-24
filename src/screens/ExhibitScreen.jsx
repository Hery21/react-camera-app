import { useCallback, useMemo, useRef, useState } from 'react'
import { decorativeAssets } from '../data/decorativeAssets.js'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'
import { joinSentenceUnits, segmentArticleText } from '../lib/segmentArticleText.js'

const MIN_USABLE_PAGE_HEIGHT = 48

export function ExhibitScreen({ language, exhibit, onBackToResult, onScanNext }) {
  const { content, sourceLanguage, isFallback } = resolveExhibitContent(exhibit, language)
  const sections = useMemo(() => {
    const available = [{ id: 'story', label: getTranslation(language, 'exhibit.story') }]
    if (content?.symbolism) available.push({ id: 'symbolism', label: getTranslation(language, 'exhibit.symbolism') })
    if (exhibit.gallery?.length) available.push({ id: 'gallery', label: getTranslation(language, 'exhibit.gallery') })
    return available
  }, [content?.symbolism, exhibit.gallery, language])

  const [activeSection, setActiveSection] = useState('story')
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(() => [content?.story || ''])
  const viewportRef = useRef(null)
  const measureRef = useRef(null)
  const cleanupRef = useRef(null)
  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id
  const selectedLabel = sections.find((section) => section.id === selectedSection)?.label
  const isGallery = selectedSection === 'gallery'
  const articleText = selectedSection === 'symbolism' ? content?.symbolism || '' : content?.story || ''

  const buildEmergencyPages = useCallback(
    (unit, measure, pageHeight) => {
      const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(language, { granularity: 'word' }) : null
      const parts = segmenter ? Array.from(segmenter.segment(unit.text), (entry) => entry.segment) : Array.from(unit.text)
      const emergencyPages = []
      let candidate = ''

      for (const part of parts) {
        const next = candidate + part
        measure.textContent = next
        if (candidate && measure.scrollHeight > pageHeight) {
          emergencyPages.push(candidate.trim())
          candidate = part
        } else {
          candidate = next
        }
      }

      if (candidate.trim()) emergencyPages.push(candidate.trim())
      return emergencyPages
    },
    [language],
  )

  const repaginate = useCallback(() => {
    const viewport = viewportRef.current
    const measure = measureRef.current
    if (!viewport || !measure || isGallery) return

    const pageWidth = viewport.clientWidth
    const pageHeight = viewport.clientHeight
    if (!pageWidth || pageHeight < MIN_USABLE_PAGE_HEIGHT) return

    measure.style.width = pageWidth + 'px'
    const units = segmentArticleText(articleText, language)
    const nextPages = []
    let currentUnits = []

    for (const unit of units) {
      const candidateUnits = [...currentUnits, unit]
      measure.textContent = joinSentenceUnits(candidateUnits)
      if (measure.scrollHeight <= pageHeight) {
        currentUnits = candidateUnits
        continue
      }

      if (currentUnits.length) nextPages.push(joinSentenceUnits(currentUnits))
      measure.textContent = unit.text
      if (measure.scrollHeight <= pageHeight) {
        currentUnits = [unit]
      } else {
        nextPages.push(...buildEmergencyPages(unit, measure, pageHeight))
        currentUnits = []
      }
    }

    if (currentUnits.length) nextPages.push(joinSentenceUnits(currentUnits))
    if (!nextPages.length) nextPages.push(articleText)
    setPages(nextPages)
    setPage((current) => Math.min(current, nextPages.length - 1))
  }, [articleText, buildEmergencyPages, isGallery, language])

  const setViewportRef = useCallback(
    (node) => {
      if (cleanupRef.current) cleanupRef.current()
      cleanupRef.current = null
      viewportRef.current = node
      if (!node || isGallery) return

      const observer = new ResizeObserver(() => requestAnimationFrame(repaginate))
      observer.observe(node)
      cleanupRef.current = () => observer.disconnect()
      requestAnimationFrame(repaginate)
    },
    [isGallery, repaginate],
  )

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setPage(0)
    setPages([sectionId === 'symbolism' ? content?.symbolism || '' : content?.story || ''])
  }

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
              onClick={() => handleSectionChange(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      )}

      <section className="exhibit-reader" aria-labelledby="exhibit-section-title">
        <div className="exhibit-reader-frame" aria-hidden="true">
          <img src="/src/assets/frame-tl.webp" alt="" className="exhibit-reader-corner exhibit-reader-corner-tl" />
          <img src="/src/assets/frame-tr.webp" alt="" className="exhibit-reader-corner exhibit-reader-corner-tr" />
          <img src="/src/assets/frame-bl.webp" alt="" className="exhibit-reader-corner exhibit-reader-corner-bl" />
          <img src="/src/assets/frame-br.webp" alt="" className="exhibit-reader-corner exhibit-reader-corner-br" />
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
          <div className="exhibit-page-viewport" ref={setViewportRef}>
            <p className="exhibit-page-text">{pages[page]}</p>
            <div className="exhibit-page-measure" ref={measureRef} aria-hidden="true" />
          </div>
        )}
      </section>

      {!isGallery && (
        <nav className="exhibit-page-navigation" aria-label={getTranslation(language, 'exhibit.sections')}>
          <button
            type="button"
            className="exhibit-page-arrow"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
            aria-label={getTranslation(language, 'exhibit.previous')}
          >
            <img src={decorativeAssets.gallery.previous} alt="" />
          </button>
          <p className="exhibit-page-status" aria-live="polite">
            {page + 1} / {pages.length}
          </p>
          <button
            type="button"
            className="exhibit-page-arrow"
            onClick={() => setPage((current) => Math.min(pages.length - 1, current + 1))}
            disabled={page === pages.length - 1}
            aria-label={getTranslation(language, 'exhibit.next')}
          >
            <img src={decorativeAssets.gallery.next} alt="" />
          </button>
        </nav>
      )}

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
