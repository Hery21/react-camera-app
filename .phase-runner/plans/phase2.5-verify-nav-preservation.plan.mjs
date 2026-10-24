export default {
  name: 'Phase 2.5 — verify language change preserves navigation',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Uses a CSS class (not JSX double-brace inline styles) so the runner does not misread style objects as template placeholders. Temporary verification block will be removed in Phase 6.',
    },
    {
      type: 'write',
      label: 'add screen state and verification toggle to App.jsx',
      path: 'src/App.jsx',
      content: `import { useEffect, useState } from 'react'
import './App.css'
import { getTranslation } from './i18n/getTranslation.js'
import {
  SUPPORTED_LANGUAGES,
  applyDocumentLanguage,
  getInitialLanguage,
  persistLanguage,
} from './i18n/language.js'

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [screen, setScreen] = useState('welcome')

  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  function handleLanguageChange(next) {
    if (!SUPPORTED_LANGUAGES.includes(next) || next === language) return
    setLanguage(next)
    persistLanguage(next)
  }

  return (
    <main className="app">
      <header className="app-header">
        <div
          className="language-toggle"
          role="group"
          aria-label={getTranslation(language, 'language.label')}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              className="language-toggle-button"
              aria-pressed={language === code}
              aria-label={getTranslation(language, 'language.' + code + 'FullName')}
              onClick={() => handleLanguageChange(code)}
            >
              {getTranslation(language, 'language.' + code)}
            </button>
          ))}
        </div>
      </header>
      <section className="app-main">
        <div className="placeholder" aria-labelledby="app-title">
          <p className="eyebrow">{getTranslation(language, 'app.eyebrow')}</p>
          <h1 id="app-title">{getTranslation(language, 'app.title')}</h1>
          <p>{getTranslation(language, 'app.tagline')}</p>

          <div className="verification-block">
            <p>Current Screen: {screen}</p>
            <button
              type="button"
              onClick={() => setScreen((prev) => (prev === 'welcome' ? 'scanner' : 'welcome'))}
            >
              Switch Screen
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
`,
    },
    {
      type: 'write',
      label: 'add verification-block styles to App.css',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.placeholder {
  width: min(100%, 32rem);
  text-align: center;
}

.placeholder h1 {
  margin: 0.5rem 0;
}

.placeholder p {
  margin: 0;
}

.eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.language-toggle {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #fffaf0;
  border: 1px solid #d4af37;
  border-radius: 999px;
}

.language-toggle-button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #4a2e26;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.language-toggle-button:hover {
  background: #f7ead9;
}

.language-toggle-button[aria-pressed="true"] {
  background: #b32222;
  color: #fffaf0;
}

.language-toggle-button:focus-visible {
  outline: 2px solid #4a2e26;
  outline-offset: 2px;
}

/* Temporary — Phase 2.5 verification block, removed in Phase 6 */
.verification-block {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px dashed #ccc;
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit nav verification',
      message: 'test(i18n): prove language toggle preserves screen state',
      paths: ['src/App.jsx', 'src/App.css'],
      as: 'navtest',
    },
    {
      type: 'write',
      label: 'record phase 2.5 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 2.5 — Verify language change preserves navigation\n\n**Status:** Complete  \n**Goal:** Prove that switching languages does not reset the current screen or app state.  \n**Files changed:** src/App.jsx, src/App.css.  \n**User-visible result:** A temporary "Switch Screen" block appears below the title. Clicking it toggles between 'welcome' and 'scanner'. Changing the language does not reset this state.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override.  \n**Manual checks:** Recommended: open the dev site, click "Switch Screen" (label reads 'Current Screen: scanner'), then click a different language. The screen state must remain 'scanner'.  \n**Not checked:** npm run build (deferred per user request).  \n**Remaining risks:** The verification block is temporary and unstyled except for a dashed border; it will be removed in Phase 6 when real screens are implemented.  \n**Decisions made:** Used a CSS class instead of a JSX double-brace inline style for the temporary block, because inline styles contain the sequence that the phase-runner misreads as a template placeholder. This is a durable constraint on all future plan files: no literal double-brace pairs anywhere in plan content, notes, or embedded documentation.  \n**Next part:** Phase 3.1 — QR contract, parser, and trilingual fixture data.  \n**Commit:** {{hash.navtest}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 2.5 progress',
      message: 'docs(progress): record phase 2.5 nav preservation',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}