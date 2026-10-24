import { translations } from './translations.js'

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
  const message =
    kind === 'fallback'
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
