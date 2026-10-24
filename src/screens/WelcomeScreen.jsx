import { getTranslation } from '../i18n/getTranslation.js'
import heroMirror from '../assets/mirror-hero.png'

export function WelcomeScreen({ language, onStart }) {
  return (
    <section className="welcome-screen" aria-labelledby="welcome-title">
      <div className="welcome-mirror-stage">
        <img src={heroMirror} alt="" className="welcome-hero" />
        <div className="welcome-mirror-copy">
          <p className="welcome-eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
          <h1 id="welcome-title" className="welcome-title">
            {getTranslation(language, 'app.title')}
          </h1>
          <p className="welcome-tagline">{getTranslation(language, 'app.tagline')}</p>
        </div>
      </div>

      <div className="welcome-supporting-copy">
        <p className="welcome-subtagline">{getTranslation(language, 'welcome.subTagline')}</p>
        <p className="welcome-explanation">{getTranslation(language, 'welcome.explanation')}</p>
        <p className="welcome-camera-notice">{getTranslation(language, 'welcome.cameraNotice')}</p>
      </div>

      <div className="welcome-action-dock">
        <button type="button" className="welcome-cta" onClick={onStart}>
          {getTranslation(language, 'welcome.cta')}
        </button>
      </div>
    </section>
  )
}
