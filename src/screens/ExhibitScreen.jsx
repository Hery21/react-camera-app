import { useMemo, useState } from 'react'
import { getTranslation } from '../i18n/getTranslation.js'

export function ExhibitScreen({ language, exhibit, onBackToResult, onScanNext }) {
  const content = exhibit.content[language] || exhibit.content.en
  const sections = useMemo(() => {
    const available = [{ id: 'story', label: getTranslation(language, 'exhibit.story') }]
    if (content.symbolism) {
      available.push({ id: 'symbolism', label: getTranslation(language, 'exhibit.symbolism') })
    }
    return available
  }, [content.symbolism, language])
  const [activeSection, setActiveSection] = useState('story')
  const selectedSection = sections.some((section) => section.id === activeSection) ? activeSection : sections[0].id

  return (
    <article className="exhibit-screen" aria-labelledby="exhibit-title">
      <header className="exhibit-hero">
        {exhibit.coverImage && (
          <div className="exhibit-cover-wrap">
            <img className="exhibit-cover" src={exhibit.coverImage} alt={content.coverAlt || ''} />
          </div>
        )}
        <div className="exhibit-heading">
          <p className="exhibit-eyebrow">{getTranslation(language, 'exhibit.articleLabel')}</p>
          <h1 id="exhibit-title">{content.title}</h1>
          {content.period && <p className="exhibit-period">{content.period}</p>}
          {content.summary && <p className="exhibit-summary">{content.summary}</p>}
        </div>
      </header>

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

      <section className="exhibit-article-copy">
        <h2>{sections.find((section) => section.id === selectedSection)?.label}</h2>
        <p>{selectedSection === 'symbolism' ? content.symbolism : content.story}</p>
      </section>

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
