// Self-check for the utility buttons.
// All checks use String.prototype.includes — NO regular expressions,
// because regex literals inside phase-runner plan templates have their
// backslashes eaten by template-literal escaping (this caused 4 false
// failures in an earlier version of this file).
import { readFileSync } from 'node:fs'

let failed = 0

function check(label, condition, detail) {
  if (condition) {
    console.log('OK  ' + label)
    return
  }
  failed += 1
  console.error('FAIL ' + label + (detail ? ' — ' + detail : ''))
}

function read(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

const css = read('src/styles/utility-buttons.css')
const shell = read('src/components/AppShell.jsx')
const fullscreen = read('src/components/FullscreenToggle.jsx')
const github = read('src/components/GitHubLink.jsx')
const appCss = read('src/App.css')

// Component and file existence
check('utility-buttons.css exists', css.length > 0)
check('FullscreenToggle.jsx exists', fullscreen.length > 0)
check('GitHubLink.jsx exists', github.length > 0)
check('App.css imports utility-buttons.css', appCss.includes('utility-buttons.css'))

// AppShell wiring
check('AppShell imports FullscreenToggle', shell.includes("from './FullscreenToggle.jsx'"))
check('AppShell imports GitHubLink', shell.includes("from './GitHubLink.jsx'"))
check('AppShell renders FullscreenToggle', shell.includes('<FullscreenToggle'))
check('AppShell renders GitHubLink', shell.includes('<GitHubLink'))

// CSS structure
check('CSS has .utility-btn rule', css.includes('.utility-btn {'))
check('CSS has fixed positioning', css.includes('position: fixed'))
check('CSS has safe-area-inset-bottom fallback', css.includes('env(safe-area-inset-bottom'))
check('CSS has static bottom fallback (4px)', css.includes('bottom: 4px'))

// Both buttons share base styling — both white, both 36px
check('CSS utility-btn icon is white', css.includes('color: #ffffff'))
check('CSS utility-btn is 36px wide', css.includes('width: 36px'))
check('CSS utility-btn is 36px tall', css.includes('height: 36px'))
check('CSS utility-btn svg is 18px', css.includes('width: 18px'))

// GitHub-specific styling
check('CSS has .github-link rule', css.includes('.github-link {'))
check('CSS GitHub is semi-transparent (opacity 0.72)', css.includes('opacity: 0.72'))
check('CSS GitHub hovers to full opacity', css.includes('opacity: 1'))
check('CSS GitHub positioned bottom-left with safe area', css.includes('env(safe-area-inset-left'))

// Fullscreen-specific styling
check('CSS has .fullscreen-toggle rule', css.includes('.fullscreen-toggle {'))
check('CSS fullscreen positioned bottom-right with safe area', css.includes('env(safe-area-inset-right'))

// Critical regression guards
check(
  'CSS does NOT hide fullscreen on Welcome',
  !css.includes('.app--welcome .fullscreen-toggle'),
  'This rule previously hid the button on Welcome which was the reported bug',
)
check('FullscreenToggle feature-detects document.fullscreenEnabled', fullscreen.includes('fullscreenEnabled'))
check('FullscreenToggle returns null when unsupported', fullscreen.includes('if (!supported) return null'))

// GitHub link correctness
check('GitHubLink opens the correct URL', github.includes('https://github.com/Hery21'))
check('GitHubLink opens in new tab', github.includes('target="_blank"'))
check('GitHubLink has noopener noreferrer', github.includes('noopener noreferrer'))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll utility button self-checks passed')
