// Small self-check for src/i18n/language.js. Not a test framework.
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
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll language self-checks passed')
