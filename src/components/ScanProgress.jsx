import { getTranslation } from '../i18n/getTranslation.js'

export function ScanProgress({ language, scanned, total }) {
  return (
    <div className="scan-progress" role="status" aria-live="polite">
      <svg className="scan-progress-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm9-2h3v3h-3v-3Zm4 0h3v7h-3v-3h-2v3h-5v-3h3v-2h4v-2Zm-7-3h3v3h-3v-3Z" />
      </svg>
      <span className="scan-progress-label">{getTranslation(language, 'progress.scanned')}</span>
      <strong className="scan-progress-count">
        {scanned}/{total}
      </strong>
    </div>
  )
}
