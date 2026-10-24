import { getTranslation } from '../i18n/getTranslation.js'
import heroMirror from '../../public/mirror.webp'

export function WelcomeScreen({ language, onStart }) {
  return (
    <section className="welcome-screen" aria-labelledby="welcome-title">
      <div className="welcome-mirror-stage">
        <img src={heroMirror} alt="" className="welcome-hero" />
        <div className="welcome-glass-copy">
          <p className="welcome-eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
          <h1 id="welcome-title" className="welcome-title">
            {getTranslation(language, 'app.title')}
          </h1>
        </div>
        <button type="button" className="welcome-cta" onClick={onStart}>
          {getTranslation(language, 'welcome.cta')}
        </button>
      </div>
      <p className="sr-only">{getTranslation(language, 'welcome.cameraNotice')}</p>
    </section>
  )
}
