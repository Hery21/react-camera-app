// Language primitives shared by App.jsx wiring (Phase 2.4) and any future screen.
// No React, no DOM side effects on import.
export const SUPPORTED_LANGUAGES = ['en', 'id', 'zh']
export const DEFAULT_LANGUAGE = 'id'
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
