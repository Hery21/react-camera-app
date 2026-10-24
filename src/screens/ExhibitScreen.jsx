import { useCallback, useMemo, useRef, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'
import { resolveExhibitContent } from '../lib/getExhibitContent.js'
import { joinSentenceUnits, segmentArticleText } from '../lib/segmentArticleText.js'

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
  const [pages, setPages] = useState([''])
  const [textSize, setTextSize] = useState(1)
  const viewportRef = useRef(null)
  const measureRef = useRef(null)
  const cleanupRef = useRef(null)
  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id
  const isGallery = selectedSection === 'gallery'
  const articleText = selectedSection === 'symbolism' ? content.symbolism : content.story
  const screenClassName = 'exhibit-screen exhibit-text-size-' + textSize

  const buildEmergencyPages = useCallback(
    (unit, measure) => {
      const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(language, { granularity: 'word' }) : null
      const parts = segmenter ? Array.from(segmenter.segment(unit.text), (entry) => entry.segment) : Array.from(unit.text)
      const emergencyPages = []
      let candidate = ''

      for (const part of parts) {
        const next = candidate + part
        measure.textContent = next
        if (candidate && measure.scrollHeight > measure.clientHeight) {
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

    measure.style.width = viewport.clientWidth + 'px'
    measure.style.height = viewport.clientHeight + 'px'
    const units = segmentArticleText(articleText, language)
    const nextPages = []
    let currentUnits = []

    for (const unit of units) {
      const candidateUnits = [...currentUnits, unit]
      const candidateText = joinSentenceUnits(candidateUnits)
      measure.textContent = candidateText

      if (currentUnits.length > 0 && measure.scrollHeight > measure.clientHeight) {
        nextPages.push(joinSentenceUnits(currentUnits))
        currentUnits = [unit]
        measure.textContent = joinSentenceUnits(currentUnits)

        if (measure.scrollHeight > measure.clientHeight) {
          nextPages.push(...buildEmergencyPages(unit, measure))
          currentUnits = []
        }
      } else if (currentUnits.length === 0 && measure.scrollHeight > measure.clientHeight) {
        nextPages.push(...buildEmergencyPages(unit, measure))
        currentUnits = []
      } else {
        currentUnits = candidateUnits
      }
    }

    if (currentUnits.length) nextPages.push(joinSentenceUnits(currentUnits))
    if (!nextPages.length) nextPages.push('')
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

  function resetReader() {
    setPage(0)
    setPages([''])
  }

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId)
    resetReader()
  }

  function handleTextSizeChange(nextSize) {
    setTextSize(nextSize)
    resetReader()
    requestAnimationFrame(repaginate)
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
            <p className="exhibit-page-text">{pages[page]}</p>
            <div className="exhibit-page-measure" ref={measureRef} aria-hidden="true" />
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
            {page + 1} / {pages.length}
          </p>
          {page < pages.length - 1 && (
            <button
              type="button"
              className="exhibit-nav-next"
              onClick={() => setPage((current) => Math.min(pages.length - 1, current + 1))}
            >
              {getTranslation(language, 'exhibit.next')}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </footer>
      )}
    </article>
  )
}
