// Diagnostic tool for CSS variable resolution.
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

console.log('=== CSS Diagnostic ===\n')

// theme.css
const themePath = 'src/styles/theme.css'
check('theme.css exists', existsSync(themePath), themePath)

if (existsSync(themePath)) {
  const theme = readFileSync(themePath, 'utf8')
  const themeLines = theme.split('\n')
  const badComments = themeLines
    .map((raw, i) => ({ raw, n: i + 1 }))
    .filter(({ raw }) => raw.trim().startsWith('//'))
  check(
    'theme.css has no // comments (only /* */ is valid CSS)',
    badComments.length === 0,
    badComments.length > 0 ? badComments.length + ' line(s): ' + badComments.map((b) => b.n).join(', ') : ''
  )
  check('theme.css has :root block', /:root\s*\{/.test(theme))
  check('theme.css defines --color-warm-ivory', /--color-warm-ivory\s*:/.test(theme))
  check('theme.css defines --font-family-body', /--font-family-body\s*:/.test(theme))
  console.log('\n--- theme.css first 5 lines (raw) ---')
  themeLines.slice(0, 5).forEach((l, i) => console.log((i + 1) + ': ' + JSON.stringify(l)))
}

// index.css
console.log('\n--- index.css ---')
const index = readFileSync('src/index.css', 'utf8')
const indexLines = index.split('\n')
const firstNonEmpty = indexLines.findIndex((l) => l.trim().length > 0)
check(
  'index.css @import is first non-empty line',
  firstNonEmpty >= 0 && indexLines[firstNonEmpty].trim().startsWith('@import'),
  firstNonEmpty >= 0 ? JSON.stringify(indexLines[firstNonEmpty]) : 'empty file'
)
const indexBadComments = indexLines.filter((l) => l.trim().startsWith('//'))
check('index.css has no // comments', indexBadComments.length === 0)

// App.css
console.log('\n--- App.css ---')
const app = readFileSync('src/App.css', 'utf8')
const appLines = app.split('\n')
const appBadComments = appLines.filter((l) => l.trim().startsWith('//'))
check('App.css has no // comments', appBadComments.length === 0)
info('App.css var(--color-warm-ivory) refs', (app.match(/var\(--color-warm-ivory\)/g) || []).length)
info('App.css var(--color-surface) refs', (app.match(/var\(--color-surface\)/g) || []).length)
info('App.css var(--font-family-body) refs', (app.match(/var\(--font-family-body\)/g) || []).length)

// main.jsx
console.log('\n--- main.jsx ---')
const main = readFileSync('src/main.jsx', 'utf8')
check('main.jsx imports ./index.css', main.includes("import './index.css'"))
check('main.jsx does not import theme.css directly', !main.includes('theme.css'))

console.log('\n=== ' + (failures === 0 ? 'All checks passed' : failures + ' failure(s) detected') + ' ===')
// Always exit 0 — report, not gate.
