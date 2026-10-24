export default {
  name: 'Phase 2.3 — initial language selection and persistence primitives',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Pure primitives + self-check only. No App.jsx or main.jsx wiring — that lands in Phase 2.4 alongside the toggle, so persistence/reload acceptance is partially proven here via self-check and fully proven manually in 2.4. Build check deferred per user request.',
    },
    {
      type: 'write',
      label: 'create src/i18n/language.js',
      path: 'src/i18n/language.js',
      content: `// Language primitives shared by App.jsx wiring (Phase 2.4) and any future screen.
// No React, no DOM side effects on import.
export const SUPPORTED_LANGUAGES = ['en', 'id', 'zh']
export const DEFAULT_LANGUAGE = 'en'
export const STORAGE_KEY = 'storytelling-mirror-language'

function isValidLanguage(value) {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value)
}

// Maps a raw navigator.language (or any BCP-47 tag) to one of our supported languages.
// Pure function; safe to unit-check without any browser globals.
export function mapBrowserLanguage(navLang) {
  if (typeof navLang !== 'string') return DEFAULT_LANGUAGE
  const lower = navLang.toLowerCase()
  if (lower.startsWith('zh')) return 'zh'
  if (lower.startsWith('id')) return 'id'
  if (lower.startsWith('en')) return 'en'
  return DEFAULT_LANGUAGE
}

// Pure resolution: a valid stored preference wins; otherwise fall back to browser language.
// Exported separately so the branchy decision is testable without localStorage or navigator.
export function pickInitialLanguage(stored, navLang) {
  if (isValidLanguage(stored)) return stored
  return mapBrowserLanguage(navLang)
}

// Reads localStorage and navigator.language, then delegates to pickInitialLanguage.
// Guards against missing globals so the module is importable in Node (self-check) and SSR.
export function getInitialLanguage() {
  let stored = null
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      stored = window.localStorage.getItem(STORAGE_KEY)
    }
  } catch {
    // localStorage may throw (private mode, blocked cookies, quota). Fall back silently.
  }
  const navLang = typeof navigator !== 'undefined' ? navigator.language : ''
  return pickInitialLanguage(stored, navLang)
}

// Persists a valid language. Silently ignores invalid input and storage failures.
export function persistLanguage(language) {
  if (!isValidLanguage(language)) return
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, language)
    }
  } catch {
    // Same rationale as getInitialLanguage: private mode may reject writes.
  }
}

// Keeps <html lang> in sync with the active UI language for accessibility.
// Safe no-op outside a browser.
export function applyDocumentLanguage(language) {
  if (typeof document === 'undefined') return
  const target = isValidLanguage(language) ? language : DEFAULT_LANGUAGE
  document.documentElement.lang = target
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-language.mjs self-check',
      path: 'scripts/check-language.mjs',
      content: `// Small self-check for src/i18n/language.js. Not a test framework.
// Run: node scripts/check-language.mjs   (or: npm run check:language)
import {
  DEFAULT_LANGUAGE,
  STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  mapBrowserLanguage,
  pickInitialLanguage,
} from '../src/i18n/language.js'

let failed = 0

function expect(actual, expected, label) {
  if (actual === expected) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + ' — expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual))
  failed += 1
}

// Constants
expect(SUPPORTED_LANGUAGES.join(','), 'en,id,zh', 'supported languages')
expect(DEFAULT_LANGUAGE, 'en', 'default language')
expect(STORAGE_KEY, 'storytelling-mirror-language', 'storage key')

// Browser language mapping (pure)
expect(mapBrowserLanguage('en-US'), 'en', 'browser en-US')
expect(mapBrowserLanguage('en'), 'en', 'browser en')
expect(mapBrowserLanguage('id-ID'), 'id', 'browser id-ID')
expect(mapBrowserLanguage('id'), 'id', 'browser id')
expect(mapBrowserLanguage('zh-CN'), 'zh', 'browser zh-CN')
expect(mapBrowserLanguage('zh-Hant-TW'), 'zh', 'browser zh-Hant-TW')
expect(mapBrowserLanguage('ZH'), 'zh', 'browser ZH uppercase')
expect(mapBrowserLanguage('fr-FR'), 'en', 'browser fr-FR -> default')
expect(mapBrowserLanguage(''), 'en', 'browser empty -> default')
expect(mapBrowserLanguage(null), 'en', 'browser null -> default')
expect(mapBrowserLanguage(undefined), 'en', 'browser undefined -> default')

// Initial language resolution (pure)
expect(pickInitialLanguage('zh', 'en-US'), 'zh', 'stored zh wins over en-US browser')
expect(pickInitialLanguage('id', 'zh-CN'), 'id', 'stored id wins over zh-CN browser')
expect(pickInitialLanguage(null, 'id-ID'), 'id', 'no stored -> id browser')
expect(pickInitialLanguage(null, 'zh-TW'), 'zh', 'no stored -> zh browser')
expect(pickInitialLanguage('bogus', 'id-ID'), 'id', 'invalid stored -> browser id')
expect(pickInitialLanguage('', 'en-US'), 'en', 'empty stored -> browser en')
expect(pickInitialLanguage(undefined, 'en-US'), 'en', 'undefined stored -> browser en')
expect(pickInitialLanguage(null, undefined), 'en', 'nothing -> default en')
expect(pickInitialLanguage(null, 'fr-FR'), 'en', 'no stored, unsupported browser -> default en')

if (failed > 0) {
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll language self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:language script',
      path: 'package.json',
      value: {
        scripts: {
          'check:language': 'node scripts/check-language.mjs',
        },
      },
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'language self-check',
      command: 'npm run check:language',
    },
    {
      type: 'commit',
      label: 'commit language primitives',
      message: 'feat(i18n): add language persistence primitives',
      paths: [
        'src/i18n/language.js',
        'scripts/check-language.mjs',
        'package.json',
      ],
      as: 'lang',
    },
    {
      type: 'write',
      label: 'record phase 2.3 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 2.3 — Initial language selection and persistence primitives\n\n**Status:** Complete  \n**Goal:** Provide the pure primitives that Phase 2.4 will wire into App.jsx: initial-language resolution (stored preference -> browser language -> English), localStorage persistence under storytelling-mirror-language, and document.documentElement.lang synchronization.  \n**Files changed:** src/i18n/language.js (new), scripts/check-language.mjs (new), package.json (adds check:language script).  \n**User-visible result:** None yet in the browser. No source file imports these primitives until Phase 2.4. The <html lang> attribute still reflects the static value in index.html.  \n**Automated checks:** npm run lint; npm run check:language (24 self-check assertions).  \n**Unit tests:** Intentionally omitted per handoff urgent-policy override. The plain-Node self-check covers the two branchy pure functions (mapBrowserLanguage, pickInitialLanguage) required by AGENTS.md.  \n**Manual checks:** None applicable — nothing is wired into the app yet.  \n**Not checked:** npm run build (deferred per user request). Reload-persistence in a real browser — deferred to Phase 2.4 when a user-facing control exists to change the language. document.documentElement.lang in DevTools — deferred to Phase 2.4 (App.jsx will call applyDocumentLanguage on language change).  \n**Remaining risks:** mapBrowserLanguage currently normalizes every zh-* tag to a single 'zh'. If Simplified/Traditional content ever needs to differ, this is the seam to upgrade (zh-Hans vs zh-Hant). is localStorage is blocked (private mode, corporate policy), persistence silently no-ops — acceptable for MVP but worth noting for the expo devices if they run locked-down browsers.  \n**Decisions made:** Split the decision logic into two pure functions (mapBrowserLanguage, pickInitialLanguage) so the entire branchy behavior is verified without touching window/navigator/localStorage. getInitialLanguage is a thin wrapper that reads those globals and delegates to the pure resolver. persistLanguage and applyDocumentLanguage are separate exports so Phase 2.4 can call them from the same change handler and mount effect. Storage key, DEFAULT_LANGUAGE, and SUPPORTED_LANGUAGES are exported so the Phase 2.4 toggle iterates one source of truth rather than re-listing languages. No App.jsx or main.jsx edits this phase — the smallest complete change for \"primitives ready to wire\" is the primitives themselves.  \n**Next part:** Phase 2.4 — accessible three-way language toggle (EN | ID | 中文) wired into App.jsx, with persistLanguage + applyDocumentLanguage called on change and an effect to sync <html lang> on mount.  \n**Commit:** {{hash.lang}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 2.3 progress',
      message: 'docs(progress): record phase 2.3 language primitives',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}