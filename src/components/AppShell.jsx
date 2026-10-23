import { LanguageToggle } from './LanguageToggle.jsx'

// Top-level layout wrapper shared by every screen.
// Structure:
//   <div className="app">
//     <header className="app-header"> ... language toggle ...
//     <main className="app-main"> {children} </main>
//
// The header currently centers the toggle. When Phase 7 adds a Back
// button, the header layout will need a left slot — that is a Phase 7
// concern, deliberately not built speculatively here (YAGNI).
//
// One <main> per page (rendered here) keeps the document outline correct
// as Phase 6/7/8/9 mount different screen components as children.
export function AppShell({ language, onLanguageChange, children }) {
  return (
    <div className="app">
      <header className="app-header">
        <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
