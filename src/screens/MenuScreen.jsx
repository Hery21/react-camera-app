import { getTranslation } from '../i18n/getTranslation.js'

export function MenuScreen({ language, onSelectTour }) {
  return (
    <section className="menu-screen" aria-labelledby="menu-title">
      <h1 id="menu-title" className="menu-title">
        {getTranslation(language, 'menu.title')}
      </h1>

      <div className="menu-cards">
        <button type="button" className="menu-card menu-card-active" onClick={onSelectTour}>
          <span className="menu-card-title">{getTranslation(language, 'menu.tour')}</span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.tourDesc')}</span>
        </button>

        <button type="button" className="menu-card menu-card-disabled" disabled>
          <span className="menu-card-title">{getTranslation(language, 'menu.info')}</span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.infoDesc')}</span>
          <span className="menu-card-badge">{getTranslation(language, 'menu.comingSoon')}</span>
        </button>

        <button type="button" className="menu-card menu-card-disabled" disabled>
          <span className="menu-card-title">{getTranslation(language, 'menu.quiz')}</span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.quizDesc')}</span>
          <span className="menu-card-badge">{getTranslation(language, 'menu.comingSoon')}</span>
        </button>

        <button type="button" className="menu-card menu-card-disabled" disabled>
          <span className="menu-card-title">{getTranslation(language, 'menu.collage')}</span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.collageDesc')}</span>
          <span className="menu-card-badge">{getTranslation(language, 'menu.comingSoon')}</span>
        </button>
      </div>
    </section>
  )
}
