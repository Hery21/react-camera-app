export default {
  name: 'Phase 2.4 — wire three-way language toggle into App',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Wires getTranslation + getInitialLanguage + persistLanguage + applyDocumentLanguage into App.jsx, and proves the placeholder renders in en/id/zh. Toggle kept inline; extraction deferred until a second screen needs it. Build check deferred per user request.',
    },
    {
      type: 'write',
      label: 'rewrite App.jsx with toggle and localized placeholder',
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

  // Sync <html lang> on mount and on every change so assistive tech
  // pronounces the active language correctly.
  useEffect(() => {
    applyDocumentLanguage(language)
  }, [language])

  function handleLanguageChange(next) {
    if (!SUPPORTED_LANGUAGES.includes(next) || next === language) return
    setLanguage(next)
    // Persist only on explicit selection so first-visit browser
    // auto-detection does not freeze the visitor's language choice.
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
      label: 'extend App.css with layout and toggle styles',
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
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit App wiring',
      message: 'feat(i18n): wire language toggle into App',
      paths: ['src/App.jsx', 'src/App.css'],
      as: 'wire',
    },
    {
      type: 'write',
      label: 'record phase 2.4 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 2.4 — Three-way language toggle wired into App\n\n**Status:** Complete (automated); manual browser verification pending  \n**Goal:** Prove the language foundation end-to-end: render the placeholder in en/id/zh, let the visitor switch languages, persist explicit selections, and keep <html lang> in sync.  \n**Files changed:** src/App.jsx (rewritten), src/App.css (extended).  \n**User-visible result:** App header shows a three-way toggle (EN | ID | 中文). Selecting a language updates the eyebrow, title, and tagline on the placeholder using getTranslation. Pressed state is shown with aria-pressed and a vermilion background.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per handoff urgent-policy override.  \n**Manual checks:** Pending. Recommended verification: (1) open the dev site, press EN/ID/中文 and confirm the placeholder text changes; (2) reload and confirm the last explicitly chosen language is restored; (3) open DevTools and confirm <html lang> matches the active language; (4) Tab through the toggle and confirm visible focus + Enter/Space activation; (5) resize to 320px and confirm the three buttons stay 44px tall and don't wrap awkwardly.  \n**Not checked:** npm run build (deferred per user request). Real-browser reload persistence — automation cannot prove it; needs a device check. Screen-reader pronunciation of lang-tagged buttons — best verified on a real device.  \n**Remaining risks:** Brief flash of <html lang=\"en\"> on first paint in id/zh browsers before the effect runs — negligible for accessibility but real. If localStorage is blocked, explicit selections silently fail to persist across reloads — acceptable for MVP but worth noting for locked-down expo devices. Chinese font rendering on iOS/Android depends on the OS CJK font — no custom webfont is loaded, which is fine for the toggle labels.  \n**Decisions made:** Toggle kept inline in App.jsx rather than extracted to components/LanguageToggle.jsx — AGENTS.md's \"used more than once\" criterion is not yet met; extract when Phase 6/7 adds a second screen and the required props are evidenced. aria-pressed on buttons inside role=\"group\" chosen over radiogroup/radio (handoff §8 explicitly sanctions aria-pressed). Each button carries lang={code} so screen readers pronounce 中文 correctly even in an English UI. persistLanguage is called from the change handler (not the effect) so first-visit browser auto-detection does not seed localStorage; only deliberate visitor selections are persisted. applyDocumentLanguage stays in the effect for a single side-effect location. Colors in App.css reuse the Phase 0.2 palette literally (no theme tokens yet) — Phase 5 will introduce CSS custom properties and the App.css values will be migrated then.  \n**Next part:** Phase 2.5 — verify language changes do not reset navigation state; then Phase 3.1 — confirm real QR payload format before parser lock-in.  \n**Commit:** {{hash.wire}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 2.4 progress',
      message: 'docs(progress): record phase 2.4 language toggle',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}