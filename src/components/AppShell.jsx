import { LanguageToggle } from './LanguageToggle.jsx'

// Top-level layout wrapper shared by every screen.
// screen is used purely for theming (app--welcome vs app--spike today;
// more variants will be added as more screens are extracted in Phase 7+).
// The header centers the toggle today; Phase 7 adds a Back button and
// will need a grid-based header layout. That change is deliberately
// deferred until the button exists (YAGNI).
export function AppShell({ language, onLanguageChange, screen, children }) {
  return (
    <div className={'app app--' + screen}>
      <header className="app-header">
        <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
