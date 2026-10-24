import { LanguageToggle } from './LanguageToggle.jsx'
import { getTranslation } from '../i18n/getTranslation.js'

// Top-level layout wrapper shared by every screen.
// The header is a 3-column grid: [back] [toggle] [spacer].
// When onBack is undefined (e.g. on Welcome), the back slot is empty and
// the toggle stays visually centered.
// The screen prop drives the theme class (app--welcome / app--scanner);
// Phase 8 will add app--scan-result and app--exhibit.
export function AppShell({ language, onLanguageChange, screen, onBack, children }) {
  return (
    <div className={'app app--' + screen}>
      <header className="app-header">
        <div className="app-header-left">
          {onBack && (
            <button type="button" className="app-header-back" onClick={onBack} aria-label={getTranslation(language, 'scanner.back')}>
              {'\u2190'}
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
