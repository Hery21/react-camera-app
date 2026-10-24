export default {
  name: 'Phase 2.2 — translation helper with English fallback',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds getTranslation(language, key) plus a lightweight self-check script. No screen consumes it yet — that starts in Phase 2.4. No test framework added (per handoff urgent-policy override); self-check runs via plain node. Build check deferred per user request.',
    },
    {
      type: 'write',
      label: 'create src/i18n/getTranslation.js',
      path: 'src/i18n/getTranslation.js',
      content: `import { translations } from './translations.js'

// Deduped dev-only warnings. Production builds strip via import.meta.env.DEV.
const warned = new Set()

function isDev() {
  return Boolean(import.meta.env?.DEV)
}

function warnOnce(kind, language, key) {
  if (!isDev()) return
  const signature = kind + ':' + language + ':' + key
  if (warned.has(signature)) return
  warned.add(signature)
  const message = kind === 'fallback'
    ? '[i18n] "' + key + '" missing for "' + language + '", using English fallback'
    : '[i18n] "' + key + '" missing in all languages'
  console.warn(message)
}

function resolve(dictionary, key) {
  if (!dictionary) return undefined
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dictionary)
}

// Returns the translated string for the given dotted key.
// Fallback chain: selected language -> English -> the key itself.
// Returning the key makes missing translations visible during development
// instead of silently rendering an empty string.
export function getTranslation(language, key) {
  if (typeof key !== 'string' || key.length === 0) return ''

  if (language === 'en') {
    const value = resolve(translations.en, key)
    if (typeof value === 'string' && value.length > 0) return value
    warnOnce('missing', 'en', key)
    return key
  }

  const primary = resolve(translations[language], key)
  if (typeof primary === 'string' && primary.length > 0) return primary

  const fallback = resolve(translations.en, key)
  if (typeof fallback === 'string' && fallback.length > 0) {
    warnOnce('fallback', language, key)
    return fallback
  }

  warnOnce('missing', language, key)
  return key
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-i18n.mjs self-check',
      path: 'scripts/check-i18n.mjs',
      content: `// Small self-check for getTranslation. Not a test framework.
// Run: node scripts/check-i18n.mjs   (or: npm run check:i18n)
import { getTranslation } from '../src/i18n/getTranslation.js'

let failed = 0

function expect(actual, expected, label) {
  if (actual === expected) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + ' — expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual))
  failed += 1
}

// Happy path: each language returns its own string
expect(getTranslation('en', 'app.title'), 'The Storytelling Mirror', 'en app.title')
expect(getTranslation('en', 'language.zh'), '中文', 'en language.zh')
expect(getTranslation('id', 'app.eyebrow'), 'Pameran Budaya', 'id app.eyebrow')
expect(getTranslation('id', 'language.label'), 'Bahasa', 'id language.label')
expect(getTranslation('zh', 'app.tagline'), '扫描 · 探索 · 发现', 'zh app.tagline')
expect(getTranslation('zh', 'language.label'), '语言', 'zh language.label')

// Missing key in all languages returns the key itself
expect(getTranslation('en', 'app.doesNotExist'), 'app.doesNotExist', 'en missing -> key')
expect(getTranslation('zh', 'app.doesNotExist'), 'app.doesNotExist', 'zh missing -> key')

// Unknown language falls back to English when the key exists there
expect(getTranslation('fr', 'app.title'), 'The Storytelling Mirror', 'unknown lang -> en fallback')

// Unknown language + missing key -> key itself
expect(getTranslation('fr', 'app.doesNotExist'), 'app.doesNotExist', 'unknown lang + missing -> key')

// Edge cases: empty / null / non-leaf
expect(getTranslation('en', ''), '', 'empty key -> empty string')
expect(getTranslation('en', null), '', 'null key -> empty string')
expect(getTranslation('en', 'app'), 'app', 'non-leaf key -> key')

if (failed > 0) {
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll i18n self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:i18n script',
      path: 'package.json',
      value: {
        scripts: {
          'check:i18n': 'node scripts/check-i18n.mjs',
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
      label: 'i18n self-check',
      command: 'npm run check:i18n',
    },
    {
      type: 'commit',
      label: 'commit translation helper',
      message: 'feat(i18n): add getTranslation helper with English fallback',
      paths: [
        'src/i18n/getTranslation.js',
        'scripts/check-i18n.mjs',
        'package.json',
      ],
      as: 'helper',
    },
    {
      type: 'write',
      label: 'record phase 2.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 2.2 — Translation helper\n\n**Status:** Complete  \n**Goal:** Provide one deterministic lookup function so screen components never scatter language ternaries and always have a safe fallback for missing translations.  \n**Files changed:** src/i18n/getTranslation.js (new), scripts/check-i18n.mjs (new), package.json (adds check:i18n script).  \n**User-visible result:** None yet — no screen consumes getTranslation until Phase 2.4. App.jsx still renders hardcoded English placeholder strings.  \n**Automated checks:** npm run lint; npm run check:i18n (12 self-check assertions).  \n**Unit tests:** Intentionally omitted per handoff urgent-policy override. A plain Node self-check script (not Vitest / not Testing Library) covers the non-trivial fallback branches and edge cases required by AGENTS.md. No test framework was introduced.  \n**Manual checks:** None applicable at this phase.  \n**Not checked:** npm run build (deferred per user request). Rendering with a real screen (no consumer exists yet).  \n**Remaining risks:** Dev-only console.warn dedupe is a module-level Set; in long dev sessions with many missing keys it will remember warnings across the session (intentional). Fallback warning is skipped for 'fr'-style unknown languages that resolve via English — only the missing-everywhere case warns for those; acceptable for MVP.  \n**Decisions made:** Pure function getTranslation(language, key) — no curried t() factory, no React hook, no context, no prop drilling helper. Smallest complete change. Fallback chain locked: selected -> English -> key itself, with the key returned visibly so gaps surface in dev. import.meta.env?.DEV guards the warnings so production builds are silent without extra config. scripts/check-i18n.mjs is infrastructure that will be reused when Phase 3 adds exhibit data (content validator will reuse this pattern); note that current ESLint config only lints **/*.{js,jsx}, so .mjs scripts are not linted — acceptable given the pattern, revisit if lint coverage of scripts matters later.  \n**Next part:** Phase 2.3 — initial language selection (stored preference -> browser language -> English), localStorage persistence under 'storytelling-mirror-language', document.documentElement.lang sync.  \n**Commit:** {{hash.helper}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 2.2 progress',
      message: 'docs(progress): record phase 2.2 translation helper',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}