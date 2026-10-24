// Small self-check for getTranslation. Not a test framework.
// Run: node scripts/check-i18n.mjs   (or: npm run check:i18n)
//
// Asserts the helper function's behavior (fallback chain, edge cases,
// namespace resolution), NOT the specific translation content. Content
// changes should not break this file — only a real regression in
// getTranslation should.
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

function expectResolved(actual, key, label) {
  if (typeof actual !== 'string') {
    console.error('FAIL ' + label + ' — expected string, got ' + typeof actual)
    failed += 1
    return
  }
  if (actual.length === 0) {
    console.error('FAIL ' + label + ' — expected non-empty string')
    failed += 1
    return
  }
  if (actual === key) {
    console.error('FAIL ' + label + ' — returned the key itself, meaning missing translation: ' + key)
    failed += 1
    return
  }
  console.log('OK  ' + label)
}

// Helper resolves core keys for every language
expectResolved(getTranslation('en', 'app.title'), 'app.title', 'en app.title resolves')
expectResolved(getTranslation('id', 'app.title'), 'app.title', 'id app.title resolves')
expectResolved(getTranslation('zh', 'app.title'), 'app.title', 'zh app.title resolves')
expectResolved(getTranslation('en', 'app.eyebrow'), 'app.eyebrow', 'en app.eyebrow resolves')
expectResolved(getTranslation('id', 'app.eyebrow'), 'app.eyebrow', 'id app.eyebrow resolves')
expectResolved(getTranslation('zh', 'app.eyebrow'), 'app.eyebrow', 'zh app.eyebrow resolves')
expectResolved(getTranslation('en', 'language.zh'), 'language.zh', 'en language.zh resolves')
expectResolved(getTranslation('id', 'language.label'), 'language.label', 'id language.label resolves')
expectResolved(getTranslation('zh', 'language.label'), 'language.label', 'zh language.label resolves')

// Result namespace (added by the result-i18n fix)
expectResolved(getTranslation('en', 'result.viewDetails'), 'result.viewDetails', 'en result.viewDetails resolves')
expectResolved(getTranslation('id', 'result.viewDetails'), 'result.viewDetails', 'id result.viewDetails resolves')
expectResolved(getTranslation('zh', 'result.viewDetails'), 'result.viewDetails', 'zh result.viewDetails resolves')
expectResolved(getTranslation('en', 'result.scanAgain'), 'result.scanAgain', 'en result.scanAgain resolves')
expectResolved(getTranslation('id', 'result.scanAgain'), 'result.scanAgain', 'id result.scanAgain resolves')
expectResolved(getTranslation('zh', 'result.scanAgain'), 'result.scanAgain', 'zh result.scanAgain resolves')

// Missing key returns the key itself
expect(getTranslation('en', 'app.doesNotExist'), 'app.doesNotExist', 'en missing -> key')
expect(getTranslation('zh', 'app.doesNotExist'), 'app.doesNotExist', 'zh missing -> key')

// Unknown language falls back to English when the key exists there
expectResolved(getTranslation('fr', 'app.title'), 'app.title', 'unknown lang -> English fallback')

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
