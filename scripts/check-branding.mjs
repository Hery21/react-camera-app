import { readFileSync } from 'node:fs'
import { getTranslation } from '../src/i18n/getTranslation.js'

const languages = ['en', 'id', 'zh']
let failed = false

function check(condition, message) {
  if (condition) {
    console.log('OK  ' + message)
    return
  }

  console.error('FAIL ' + message)
  failed = true
}

for (const language of languages) {
  check(getTranslation(language, 'app.eyebrow') === 'Ikatan Keluarga Tionghoa', language + ' contextual identity')
  check(getTranslation(language, 'app.title') === 'Pekan Seni Budaya 2026', language + ' main title')
  check(getTranslation(language, 'app.tagline') === 'app.tagline', language + ' obsolete tagline key removed')
  check(getTranslation(language, 'app.stand') === 'app.stand', language + ' redundant stand key removed')
}

const welcome = readFileSync('src/screens/WelcomeScreen.jsx', 'utf8')
const result = readFileSync('src/screens/ScanResultScreen.jsx', 'utf8')
const index = readFileSync('index.html', 'utf8')

check(!welcome.includes('app.stand') && !welcome.includes('app.tagline'), 'Welcome renders only eyebrow and title identity keys')
check(
  result.includes('app.eyebrow') && result.includes('app.title') && !result.includes('app.stand') && !result.includes('app.tagline'),
  'Scan Result uses approved identity keys',
)
check(index.includes('Pekan Seni Budaya 2026') && index.includes('Ikatan Keluarga Tionghoa'), 'document metadata uses approved identity')
check(!index.includes('The Storytelling Mirror'), 'document metadata removes obsolete title')

if (failed) {
  console.error('Branding consistency check failed')
  process.exit(1)
}

console.log('All branding consistency checks passed')
