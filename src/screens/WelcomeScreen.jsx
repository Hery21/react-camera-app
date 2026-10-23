import { getTranslation } from '../i18n/getTranslation.js'
import heroMirror from '../assets/mirror-hero.png'

// Welcome screen — the app's home / default view.
// Camera permission is deliberately NOT requested here; it happens only
// when the visitor activates the CTA and the scanner screen loads.
// The hero mirror uses empty alt because the <h1> below provides the
// semantic content; the image is decorative.
export function WelcomeScreen({ language, onStart }) {
  return (
    <section className="welcome-screen" aria-labelledby="welcome-title">
      <img src={heroMirror} alt="" className="welcome-hero" />
      <div className="welcome-copy">
        <p className="eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
        <h1 id="welcome-title" className="welcome-title">
          {getTranslation(language, 'app.title')}
        </h1>
        <p className="welcome-tagline">{getTranslation(language, 'app.tagline')}</p>
        <p className="welcome-subtagline">{getTranslation(language, 'welcome.subTagline')}</p>
        <p className="welcome-explanation">{getTranslation(language, 'welcome.explanation')}</p>
        <p className="welcome-camera-notice">{getTranslation(language, 'welcome.cameraNotice')}</p>
        <button type="button" className="welcome-cta" onClick={onStart}>
          {getTranslation(language, 'welcome.cta')}
        </button>
      </div>
    </section>
  )
}
