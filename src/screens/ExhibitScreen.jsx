import { useCallback, useMemo, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'

const MIN_TEXT_SIZE = 0
const MAX_TEXT_SIZE = 2

export function ExhibitScreen({ language, exhibit }) {
  const { content, sourceLanguage, isFallback } = resolveExhibitContent(exhibit, language)
  const sections = useMemo(() => {
    const available = [{ id: 'story', label: getTranslation(language, 'exhibit.story') }]
    if (content.symbolism) available.push({ id: 'symbolism', label: getTranslation(language, 'exhibit.symbolism') })
    if (exhibit.gallery?.length) available.push({ id: 'gallery', label: getTranslation(language, 'exhibit.gallery') })
    return available
  }, [content.symbolism, exhibit.gallery, language])

  const [activeSection, setActiveSection] = useState('story')
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [textSize, setTextSize] = useState(1)
  const viewportRef = useRef(null)
  const textRef = useRef(null)
  const cleanupRef = useRef(null)
  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id
  const isGallery = selectedSection === 'gallery'
  const articleText = selectedSection === 'symbolism' ? content.symbolism : content.story
  const pageStyle = { '--exhibit-page': page }
  const screenClassName = 'exhibit-screen exhibit-text-size-' + textSize

  const measurePages = useCallback(() => {
    const viewport = viewportRef.current
    const text = textRef.current
    if (!viewport || !text || isGallery) return undefined

    const update = () => {
      const width = viewport.clientWidth
      if (!width) return
      const nextCount = Math.max(1, Math.ceil(text.scrollWidth / width))
      setPageCount(nextCount)
      setPage((current) => Math.min(current, nextCount - 1))
    }

    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    observer.observe(text)
    requestAnimationFrame(update)
    return () => observer.disconnect()
  }, [isGallery])

  const setViewportRef = useCallback(
    (node) => {
      if (cleanupRef.current) cleanupRef.current()
      cleanupRef.current = null
      viewportRef.current = node
      if (node) cleanupRef.current = measurePages()
    },
    [measurePages],
  )

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    setPage(0)
    setPageCount(1)
  }

  function handleTextSizeChange(nextSize) {
    setTextSize(nextSize)
    setPage(0)
    setPageCount(1)
  }

  return (
    <article className={screenClassName} aria-labelledby="exhibit-title">
      <header className="exhibit-hero">
        {exhibit.coverImage && (
          <div className="exhibit-cover-wrap">
            <img className="exhibit-cover" src={exhibit.coverImage} alt={content.coverAlt || ''} />
          </div>
        )}
        <div className="exhibit-heading">
          <h1 id="exhibit-title">{content.title}</h1>
          {content.period && <p className="exhibit-period">{content.period}</p>}
        </div>
      </header>

      {isFallback && (
        <p className="content-language-notice exhibit-language-notice" role="status">
          {getTranslation(language, 'exhibit.translationUnavailable')} {getTranslation(language, 'language.' + sourceLanguage + 'FullName')}
          .
        </p>
      )}

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
        <div className="exhibit-reader-heading">
          <h2 id="exhibit-section-title">{sections.find((section) => section.id === selectedSection)?.label}</h2>
          {!isGallery && (
            <div className="exhibit-font-controls" role="group" aria-label={getTranslation(language, 'exhibit.textSize')}>
              <button
                type="button"
                onClick={() => handleTextSizeChange(Math.max(MIN_TEXT_SIZE, textSize - 1))}
                disabled={textSize === MIN_TEXT_SIZE}
                aria-label={getTranslation(language, 'exhibit.decreaseText')}
              >
                A−
              </button>
              <button
                type="button"
                onClick={() => handleTextSizeChange(Math.min(MAX_TEXT_SIZE, textSize + 1))}
                disabled={textSize === MAX_TEXT_SIZE}
                aria-label={getTranslation(language, 'exhibit.increaseText')}
              >
                A+
              </button>
            </div>
          )}
        </div>

        {isGallery ? (
          <div className="exhibit-gallery">
            {exhibit.gallery.map((image) => {
              const imageContent = image.content?.[language] || image.content?.en || {}
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
            <div className="exhibit-page-track" ref={textRef} style={pageStyle}>
              {articleText}
            </div>
          </div>
        )}
      </section>

      {!isGallery && (
        <footer className="exhibit-navigation">
          <button
            type="button"
            className="exhibit-nav-previous"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
          >
            <span aria-hidden="true">←</span>
            {getTranslation(language, 'exhibit.previous')}
          </button>

          <p className="exhibit-page-status" aria-live="polite">
            {page + 1} / {pageCount}
          </p>

          {page < pageCount - 1 && (
            <button type="button" className="exhibit-nav-next" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>
              {getTranslation(language, 'exhibit.next')}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </footer>
      )}
    </article>
  )
}
