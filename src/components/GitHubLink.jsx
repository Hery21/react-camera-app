const GITHUB_URL = 'https://github.com/Hery21'

// Fixed bottom-left icon link to the project author's GitHub profile.
// Opens in a new tab; rel=noopener noreferrer is set so the target cannot
// access window.opener. English aria-label because it is accessibility-only
// text, not visible UI — avoids adding three locale keys for a proper noun.
export function GitHubLink() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="utility-btn github-link"
      aria-label="GitHub profile"
      title="GitHub"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.97 0 0 .94-.3 3.09 1.15a10.7 10.7 0 0 1 2.81-.38c.95 0 1.91.13 2.81.38 2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.69.11 2.97.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.28-5.15 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.47-1.5 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5z" />
      </svg>
    </a>
  )
}
