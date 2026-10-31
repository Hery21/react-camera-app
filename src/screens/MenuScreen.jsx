import { getTranslation } from '../i18n/getTranslation.js'
import { decorativeAssets } from '../data/decorativeAssets.js'
import frameTl from '../assets/frame-tl.webp'
import frameTr from '../assets/frame-tr.webp'
import frameBl from '../assets/frame-bl.webp'
import frameBr from '../assets/frame-br.webp'

export function MenuScreen({ language, onSelectTour, onSelectPhoto, onSelectMahjong }) {
  return (
    <section className="menu-screen" aria-labelledby="menu-title">
      <div className="menu-frame" aria-hidden="true">
        <img src={frameTl} alt="" className="menu-frame-corner menu-frame-corner-tl" />
        <img src={frameTr} alt="" className="menu-frame-corner menu-frame-corner-tr" />
        <img src={frameBl} alt="" className="menu-frame-corner menu-frame-corner-bl" />
        <img src={frameBr} alt="" className="menu-frame-corner menu-frame-corner-br" />
      </div>

      <img src={decorativeAssets.article.crown} alt="" className="menu-crown" aria-hidden="true" />

      <h1 id="menu-title" className="menu-title">
        {getTranslation(language, 'menu.title')}
      </h1>

      <img src={decorativeAssets.article.divider} alt="" className="menu-divider" aria-hidden="true" />

      <div className="menu-cards">
        <button type="button" className="menu-card menu-card-active" onClick={onSelectTour}>
          <span className="menu-card-head">
            <span className="menu-card-title">{getTranslation(language, 'menu.tour')}</span>
          </span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.tourDesc')}</span>
        </button>

        <button type="button" className="menu-card menu-card-active" onClick={onSelectPhoto}>
          <span className="menu-card-head">
            <span className="menu-card-title">{getTranslation(language, 'menu.collage')}</span>
          </span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.collageDesc')}</span>
        </button>

        <button type="button" className="menu-card menu-card-active" onClick={onSelectMahjong}>
          <span className="menu-card-head">
            <span className="menu-card-title">{getTranslation(language, 'menu.mahjong')}</span>
          </span>
          <span className="menu-card-desc">{getTranslation(language, 'menu.mahjongDesc')}</span>
        </button>
      </div>
    </section>
  )
}
