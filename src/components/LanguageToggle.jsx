import { SUPPORTED_LANGUAGES } from '../i18n/language.js'
import { getTranslation } from '../i18n/getTranslation.js'

// Three-way EN / ID / 中文 toggle.
// aria-pressed inside role="group" chosen over radiogroup/radio per
// handoff §8's explicit sanction of aria-pressed. Each button carries
// lang={code} so screen readers pronounce 中文 correctly even in an
// English UI.
export function LanguageToggle({ language, onLanguageChange }) {
  return (
    <div
      className="language-toggle"
      role="group"
      aria-label={getTranslation(language, 'language.label')}
    >
      {SUPPORTED_LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className="language-toggle-button"
          aria-pressed={language === code}
          aria-label={getTranslation(language, 'language.' + code + 'FullName')}
          onClick={() => onLanguageChange(code)}
        >
          {getTranslation(language, 'language.' + code)}
        </button>
      ))}
    </div>
  )
}
