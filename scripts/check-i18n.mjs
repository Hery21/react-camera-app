// Small self-check for getTranslation. Not a test framework.
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
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll i18n self-checks passed')
