export default {
  name: 'Phase 2.1 — add en/id/zh translation resources',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Scope extension: handoff §6 listed only en/id; user extended to en/id/zh. Three per-language files under src/i18n/locales/, combined by src/i18n/translations.js. No consumer yet — 2.2 (helper) and 2.4 (toggle) wire it up. Build check deferred per user request; lint check only.',
    },
    {
      type: 'write',
      label: 'create src/i18n/locales/en.js',
      path: 'src/i18n/locales/en.js',
      content: `// English UI strings. Exhibit content lives in src/data/exhibits.js, not here.
export const en = {
  app: {
    eyebrow: 'Cultural Expo',
    title: 'The Storytelling Mirror',
    tagline: 'Scan · Explore · Discover'
  },
  language: {
    label: 'Language',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Mandarin Chinese'
  },
  welcome: {},
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'create src/i18n/locales/id.js',
      path: 'src/i18n/locales/id.js',
      content: `// Bahasa Indonesia UI strings. Exhibit content lives in src/data/exhibits.js, not here.
// Values marked with (provisional) are pending expo team approval.
export const id = {
  app: {
    eyebrow: 'Pameran Budaya',
    title: 'The Storytelling Mirror',
    tagline: 'Pindai · Jelajahi · Temukan'
  },
  language: {
    label: 'Bahasa',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: 'Bahasa Mandarin'
  },
  welcome: {},
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'create src/i18n/locales/zh.js',
      path: 'src/i18n/locales/zh.js',
      content: `// Mandarin Chinese (Simplified) UI strings. Exhibit content lives in src/data/exhibits.js, not here.
// All values here are provisional pending native-speaker review and expo team approval.
// Brand name intentionally kept in English until an approved Chinese name is supplied.
export const zh = {
  app: {
    eyebrow: '文化展览',
    title: 'The Storytelling Mirror',
    tagline: '扫描 · 探索 · 发现'
  },
  language: {
    label: '语言',
    en: 'EN',
    id: 'ID',
    zh: '中文',
    enFullName: 'English',
    idFullName: 'Bahasa Indonesia',
    zhFullName: '中文'
  },
  welcome: {},
  scanner: {},
  result: {},
  exhibit: {},
  errors: {},
  accessibility: {}
}
`,
    },
    {
      type: 'write',
      label: 'create src/i18n/translations.js combiner',
      path: 'src/i18n/translations.js',
      content: `import { en } from './locales/en.js'
import { id } from './locales/id.js'
import { zh } from './locales/zh.js'

// Single import point for screens. Edit each language in src/i18n/locales/*.js.
export const translations = { en, id, zh }
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit translation resources',
      message: 'feat(i18n): add en/id/zh translation resources',
      paths: [
        'src/i18n/locales/en.js',
        'src/i18n/locales/id.js',
        'src/i18n/locales/zh.js',
        'src/i18n/translations.js',
      ],
      as: 'i18n',
    },
    {
      type: 'write',
      label: 'record phase 2.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 2.1 — Bilingual-plus translation resources (en, id, zh)\n\n**Status:** Complete  \n**Goal:** Create centralized, per-language translation resources so every later screen uses one source of truth instead of scattered language ternaries. Extends the original two-language plan to include Mandarin Chinese per user instruction (supersedes handoff §6).  \n**Files changed:** src/i18n/locales/en.js (new), src/i18n/locales/id.js (new), src/i18n/locales/zh.js (new), src/i18n/translations.js (new).  \n**User-visible result:** None yet — screens do not import these yet. App.jsx still renders hardcoded English placeholder strings. Consumption starts in Phase 2.2 (helper) and Phase 2.4 (toggle).  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted for this urgent project.  \n**Manual checks:** None applicable at this phase.  \n**Not checked:** npm run build (deferred per user request). No screen renders these strings yet, so no layout/overflow check has occurred.  \n**Remaining risks:** All Indonesian and Chinese strings are provisional pending expo team approval. The brand name "The Storytelling Mirror" is intentionally kept untranslated in id.js and zh.js; an approved local name should replace it later if one exists. MASTER-PHASE-PLAN.md and the handoff still describe only en/id; they need a docs pass to align with the three-language decision. Phase 3 exhibit data will need a zh block under each exhibit's content.  \n**Decisions made:** Split translations into per-language files (src/i18n/locales/*.js) combined by src/i18n/translations.js, rather than a single multi-language file, so each language is easy to edit in isolation. This is a deliberate supersession of the MASTER-PHASE-PLAN's single-file layout. Not a barrel export: translations.js constructs the combined object, it does not merely re-export named bindings. Generic zh tag used (Simplified assumed); upgrade to zh-Hans/zh-Hant split later only if content approval requires it.  \n**Next part:** Phase 2.2 — translation helper (getTranslation) with selected-language → English → visible-key fallback.  \n**Commit:** {{hash.i18n}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 2.1 progress',
      message: 'docs(progress): record phase 2.1 translations',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}