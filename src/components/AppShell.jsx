import { LanguageToggle } from './LanguageToggle.jsx'
import { getTranslation } from '../i18n/getTranslation.js'

export function AppShell({ language, onLanguageChange, screen, onBack, backLabel, children }) {
  return (
    <div className={'app app--' + screen}>
      <header className="app-header">
        <div className="app-header-left">
          {onBack && (
            <button
              type="button"
              className={backLabel ? 'app-header-back app-header-back-labeled' : 'app-header-back'}
              onClick={onBack}
              aria-label={backLabel || getTranslation(language, 'scanner.back')}
            >
              <span aria-hidden="true">←</span>
              {backLabel && <span>{backLabel}</span>}
            </button>
          )}
        </div>
        <div className="app-header-center">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
        </div>
        <div className="app-header-right" aria-hidden="true" />
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
