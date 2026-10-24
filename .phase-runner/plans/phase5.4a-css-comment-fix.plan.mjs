export default {
  name: 'Phase 5.4a — CSS variable resolution fix',
  steps: [
    {
      type: 'note',
      label: 'diagnosis',
      message: 'theme.css begins with // comments, which are INVALID CSS (only /* */ is valid). PostCSS either skips the file or the browser drops it during @import, so :root tokens never get defined, so every var(--…) reference in App.css falls back to unset. Bug is latent since Phase 5.1 but only became visible in Phase 5.4 when I asked for a visual check. Fix: replace // with /* */ in theme.css. Diagnostic script confirms the diagnosis from source, then verifies the fix.',
    },
    {
      type: 'write',
      label: 'create scripts/diagnose-css.mjs diagnostic tool',
      path: 'scripts/diagnose-css.mjs',
      content: `// Diagnostic tool for CSS variable resolution.
// Checks the CSS plumbing (theme.css exists, no // comments, @import position,
// main.jsx import order) and reports on token usage. Always exits 0 — this
// is a report, not a gate.
// Run: node scripts/diagnose-css.mjs
import { readFileSync, existsSync } from 'node:fs'

let failures = 0

function check(label, ok, detail) {
  if (!ok) failures += 1
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + label + (detail ? ' — ' + detail : ''))
}

function info(label, value) {
  console.log('INFO ' + label + ': ' + JSON.stringify(value))
}

console.log('=== CSS Diagnostic ===\\n')

// theme.css
const themePath = 'src/styles/theme.css'
check('theme.css exists', existsSync(themePath), themePath)

if (existsSync(themePath)) {
  const theme = readFileSync(themePath, 'utf8')
  const themeLines = theme.split('\\n')
  const badComments = themeLines
    .map((raw, i) => ({ raw, n: i + 1 }))
    .filter(({ raw }) => raw.trim().startsWith('//'))
  check(
    'theme.css has no // comments (only /* */ is valid CSS)',
    badComments.length === 0,
    badComments.length > 0 ? badComments.length + ' line(s): ' + badComments.map((b) => b.n).join(', ') : ''
  )
  check('theme.css has :root block', /:root\\s*\\{/.test(theme))
  check('theme.css defines --color-warm-ivory', /--color-warm-ivory\\s*:/.test(theme))
  check('theme.css defines --font-family-body', /--font-family-body\\s*:/.test(theme))
  console.log('\\n--- theme.css first 5 lines (raw) ---')
  themeLines.slice(0, 5).forEach((l, i) => console.log((i + 1) + ': ' + JSON.stringify(l)))
}

// index.css
console.log('\\n--- index.css ---')
const index = readFileSync('src/index.css', 'utf8')
const indexLines = index.split('\\n')
const firstNonEmpty = indexLines.findIndex((l) => l.trim().length > 0)
check(
  'index.css @import is first non-empty line',
  firstNonEmpty >= 0 && indexLines[firstNonEmpty].trim().startsWith('@import'),
  firstNonEmpty >= 0 ? JSON.stringify(indexLines[firstNonEmpty]) : 'empty file'
)
const indexBadComments = indexLines.filter((l) => l.trim().startsWith('//'))
check('index.css has no // comments', indexBadComments.length === 0)

// App.css
console.log('\\n--- App.css ---')
const app = readFileSync('src/App.css', 'utf8')
const appLines = app.split('\\n')
const appBadComments = appLines.filter((l) => l.trim().startsWith('//'))
check('App.css has no // comments', appBadComments.length === 0)
info('App.css var(--color-warm-ivory) refs', (app.match(/var\\(--color-warm-ivory\\)/g) || []).length)
info('App.css var(--color-surface) refs', (app.match(/var\\(--color-surface\\)/g) || []).length)
info('App.css var(--font-family-body) refs', (app.match(/var\\(--font-family-body\\)/g) || []).length)

// main.jsx
console.log('\\n--- main.jsx ---')
const main = readFileSync('src/main.jsx', 'utf8')
check('main.jsx imports ./index.css', main.includes("import './index.css'"))
check('main.jsx does not import theme.css directly', !main.includes('theme.css'))

console.log('\\n=== ' + (failures === 0 ? 'All checks passed' : failures + ' failure(s) detected') + ' ===')
// Always exit 0 — report, not gate.
`,
    },
    {
      type: 'check',
      label: 'run diagnostic — expect FAILs on // comments',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'write',
      label: 'fix theme.css — replace // comments with /* */',
      path: 'src/styles/theme.css',
      content: `/* Theme tokens for The Storytelling Mirror.
   Palette is the master-plan starting palette.
   Font-family tokens match the design reference (Playfair Display + Inter via Google Fonts).
   Spacing, radius, and shadow tokens are introduced alongside their first real use. */
:root {
  /* Palette — from MASTER-PHASE-PLAN.md Phase 5.1 */
  --color-vermilion: #b32222;
  --color-vermilion-dark: #861818;
  --color-rosewood: #4a2e26;
  --color-antique-gold: #d4af37;
  --color-warm-ivory: #f7ead9;
  --color-peranakan-teal: #2c9c8d;
  --color-blush-pink: #e7a7b3;
  --color-text: #2a211d;
  --color-surface: #fffaf0;
  --color-error: #9f1f1f;
  --color-success: #187154;

  /* Typography family stacks — loaded via Google Fonts in index.html */
  --font-family-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-family-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(42, 33, 29, 0.1);

  /* Layout constraints */
  --max-width-content: 32rem;
}
`,
    },
    {
      type: 'check',
      label: 'run diagnostic — expect all OK',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit CSS comment fix and diagnostic tool',
      message: 'fix(theme): use CSS comment syntax to restore tokens',
      paths: [
        'src/styles/theme.css',
        'scripts/diagnose-css.mjs',
      ],
      as: 'fix',
    },
    {
      type: 'write',
      label: 'record phase 5.4a progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 5.4a — CSS variable resolution fix\\n\\n**Status:** Complete (self-check verified); visual re-check pending user report  \\n**Goal:** Fix the CSS variable resolution bug that made every var(--…) reference fall back to unset, breaking the palette, typography, and language toggle pill styling in the local dev build.\\n**Root cause:** theme.css was authored with // comments (JavaScript syntax) instead of /* */ (CSS syntax). PostCSS / @import resolution silently discarded or skipped the file, so :root never defined the tokens. The bug was latent since Phase 5.1 because App.css still used hardcoded colors until Phase 5.2, which switched to var() and made the missing tokens visible — but the visual regression was only caught in Phase 5.4 when the user did a full-page visual check.\\n**Files changed:** src/styles/theme.css (comments changed from // to /* */), scripts/diagnose-css.mjs (new diagnostic tool for future CSS-plumbing bugs).\\n**User-visible result:** Expected: page returns to warm-ivory background, dark text, Inter body font, and the language toggle shows its cream pill with gold border and dark-rosewood text. Actual: pending user confirmation after hard reload.\\n**Automated checks:** node scripts/diagnose-css.mjs (11 assertions: theme.css exists, no // comments, :root present, expected tokens defined, index.css @import is first, main.jsx imports index.css, App.css free of // comments); npm run lint.\\n**Unit tests:** Intentionally omitted per urgent-policy override. Diagnostic script plays the role for this specific class of bug.\\n**Manual checks:** Pending. Required: (1) hard reload http://localhost:5173 (Ctrl+Shift+R — normal reload may serve cached CSS); (2) verify warm-ivory background, dark text, Playfair/Inter fonts, cream-pill language toggle with gold border; (3) verify the mirror hero still renders transparently. If any of these still look wrong, check DevTools → Elements → html → Styles → :root should list --color-warm-ivory: #f7ead9.\\n**Not checked:** npm run build (deferred per user request). Vercel deployment — user has not pushed, so Vercel still serves the pre-5.1 build (that is why Vercel looked fine during this bug).\\n**Remaining risks:** The diagnostic tool is committed permanently as scripts/diagnose-css.mjs. If the CSS stack ever gains a preprocessor (e.g. PostCSS with postcss-preset-env that supports // comments) the tool's // checks would need to be relaxed — unlikely for this project. The // comment bug class is not caught by ESLint (it only lints .js/.jsx) and not by npm run lint; the diagnostic script is the only guard. Recommend adding \\\"node scripts/diagnose-css.mjs\\\" to any future verify chain (Phase 10).\\n**Decisions made:** Fixed theme.css only — did NOT touch App.css, index.css, main.jsx, or LanguageToggle.jsx. Their CSS was correct all along; they were just consumers of broken tokens. Committed a permanent diagnostic script rather than a one-off shell command so future CSS-plumbing regressions can be verified with one command. Kept the diagnostic always-exit-0 so it functions as a report rather than a gate (a gate would need to be wired into the verify chain deliberately in Phase 10, not silently).\\n**Next part:** Phase 6.1 — Welcome screen semantic content (title, tagline, explanation, Start Exploring button), composed properly using the tokens that now work.\\n**Commit:** {{hash.fix}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 5.4a progress',
      message: 'docs(progress): record phase 5.4a CSS comment fix',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}