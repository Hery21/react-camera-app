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
expect(DEFAULT_LANGUAGE, 'id', 'default language is Bahasa Indonesia')
expect(STORAGE_KEY, 'storytelling-mirror-language', 'storage key')

// Browser language mapping (pure)
// Recognized browsers map to themselves; unrecognized fall back to DEFAULT_LANGUAGE (id).
expect(mapBrowserLanguage('en-US'), 'en', 'browser en-US -> en')
expect(mapBrowserLanguage('en'), 'en', 'browser en -> en')
expect(mapBrowserLanguage('id-ID'), 'id', 'browser id-ID -> id')
expect(mapBrowserLanguage('id'), 'id', 'browser id -> id')
expect(mapBrowserLanguage('zh-CN'), 'zh', 'browser zh-CN -> zh')
expect(mapBrowserLanguage('zh-Hant-TW'), 'zh', 'browser zh-Hant-TW -> zh')
expect(mapBrowserLanguage('ZH'), 'zh', 'browser ZH uppercase -> zh')
expect(mapBrowserLanguage('fr-FR'), 'id', 'browser fr-FR -> default id')
expect(mapBrowserLanguage('de-DE'), 'id', 'browser de-DE -> default id')
expect(mapBrowserLanguage(''), 'id', 'browser empty -> default id')
expect(mapBrowserLanguage(null), 'id', 'browser null -> default id')
expect(mapBrowserLanguage(undefined), 'id', 'browser undefined -> default id')

// Initial language resolution (pure)
expect(pickInitialLanguage('zh', 'en-US'), 'zh', 'stored zh wins over en-US browser')
expect(pickInitialLanguage('id', 'zh-CN'), 'id', 'stored id wins over zh-CN browser')
expect(pickInitialLanguage('en', 'zh-CN'), 'en', 'stored en wins over zh-CN browser')
expect(pickInitialLanguage(null, 'id-ID'), 'id', 'no stored -> id browser')
expect(pickInitialLanguage(null, 'zh-TW'), 'zh', 'no stored -> zh browser')
expect(pickInitialLanguage(null, 'en-US'), 'en', 'no stored -> en browser')
expect(pickInitialLanguage('bogus', 'id-ID'), 'id', 'invalid stored -> browser id')
expect(pickInitialLanguage('', 'en-US'), 'en', 'empty stored -> browser en')
expect(pickInitialLanguage(undefined, 'en-US'), 'en', 'undefined stored -> browser en')
expect(pickInitialLanguage(null, undefined), 'id', 'nothing -> default id')
expect(pickInitialLanguage(null, 'fr-FR'), 'id', 'no stored, unsupported browser -> default id')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll language self-checks passed')
