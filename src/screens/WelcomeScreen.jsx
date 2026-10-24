import { getTranslation } from '../i18n/getTranslation.js'

export function WelcomeScreen({ language, onStart, onStartAdmin }) {
  return (
    <section className="welcome-screen" aria-labelledby="welcome-title">
      <div className="welcome-mirror-stage">
        <img src="/mirror.webp" alt="" className="welcome-hero" />

        <div className="welcome-glass-copy">
          <h1 id="welcome-title" className="welcome-title">
            {getTranslation(language, 'app.title')}
          </h1>
          <p className="welcome-eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
          <img src="/images/IKT-icon.gif" alt="" className="welcome-ikt-icon" />
        </div>

        <button type="button" className="welcome-cta" onClick={onStart}>
          {getTranslation(language, 'welcome.cta')}
        </button>

        {import.meta.env.DEV && onStartAdmin && (
          <button type="button" className="dev-admin-trigger" onClick={onStartAdmin}>
            Open Admin
          </button>
        )}
      </div>

      <p className="sr-only">{getTranslation(language, 'welcome.cameraNotice')}</p>
    </section>
  )
}
