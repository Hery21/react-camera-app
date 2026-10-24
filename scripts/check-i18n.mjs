import { getTranslation } from '../src/i18n/getTranslation.js'

let failures = 0

function check(label, actual, expected) {
  if (actual === expected) {
    console.log('OK  ' + label)
    return
  }

  failures += 1
  console.error('FAIL ' + label + ' — expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual))
}

for (const language of ['en', 'id', 'zh']) {
  check(language + ' contextual identity', getTranslation(language, 'app.eyebrow'), 'Ikatan Keluarga Tionghoa')
  check(language + ' main title', getTranslation(language, 'app.title'), 'Pekan Seni Budaya 2026')
  check(language + ' tagline key removed', getTranslation(language, 'app.tagline'), 'app.tagline')
}

check('en language.zh', getTranslation('en', 'language.zh'), '中文')
check('id language.label', getTranslation('id', 'language.label'), 'Bahasa')
check('zh language.label', getTranslation('zh', 'language.label'), '语言')
check('en missing -> key', getTranslation('en', 'missing.key'), 'missing.key')
check('zh missing -> key', getTranslation('zh', 'missing.key'), 'missing.key')
check('unknown lang -> English title', getTranslation('xx', 'app.title'), 'Pekan Seni Budaya 2026')
check('unknown lang + missing -> key', getTranslation('xx', 'missing.key'), 'missing.key')
check('empty key -> empty string', getTranslation('en', ''), '')
check('null key -> empty string', getTranslation('en', null), '')
check('non-leaf key -> key', getTranslation('en', 'app'), 'app')

if (failures > 0) {
  console.error(failures + ' check(s) failed')
  process.exit(1)
}

console.log('All i18n self-checks passed')
