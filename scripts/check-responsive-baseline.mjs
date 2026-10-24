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

console.log('=== Responsive & Accessibility Baseline ===\n')

// 1. Key stylesheets exist
const appShell = read('src/styles/app-shell.css')
const exhibitCss = read('src/styles/exhibit.css')
const scannerCss = read('src/styles/scanner.css')
const menuCss = read('src/styles/menu.css')
const scanProgressCss = read('src/styles/scan-progress.css')

check('app-shell.css exists', appShell.length > 0)
check('exhibit.css exists', exhibitCss.length > 0)
check('scanner.css exists', scannerCss.length > 0)
check('menu.css exists', menuCss.length > 0)
check('scan-progress.css exists', scanProgressCss.length > 0)

// 2. Responsive rules exist somewhere
check('app-shell.css has a media query', appShell.includes('@media'))
check('exhibit.css has a media query', exhibitCss.includes('@media'))
check('scanner.css has a media query', scannerCss.includes('@media'))
check(
  'menu.css is width-constrained for large screens',
  menuCss.includes('max-width') || menuCss.includes('@media'),
  'expected max-width or media query so pills do not stretch to full desktop width'
)

// 3. Touch target sizes
const allCss = appShell + exhibitCss + scannerCss + menuCss
check(
  'Touch targets meet 44px minimum',
  (allCss.match(/min-height:\s*(44px|2\.75rem|48px|3rem)/g) || []).length >= 3,
  'expected at least 3 rules with min-height 44px or larger'
)

// 4. Font size controls exist in ExhibitScreen
const exhibitJsx = read('src/screens/ExhibitScreen.jsx')
check('ExhibitScreen has text size decrease control', exhibitJsx.includes('textSize - 1') || exhibitJsx.includes('decreaseText'))
check('ExhibitScreen has text size increase control', exhibitJsx.includes('textSize + 1') || exhibitJsx.includes('increaseText'))

// 5. Reader text is justified
check('Reader text is justified', exhibitCss.includes('text-align: justify'))

// 6. Language toggle carries lang attribute
const langToggle = read('src/components/LanguageToggle.jsx')
check('LanguageToggle sets lang attribute per button', langToggle.includes('lang={code}'))

// 7. Progress dock height variable is defined
check(
  'Progress dock height variable is defined',
  scanProgressCss.includes('--progress-dock-height'),
  'expected --progress-dock-height in scan-progress.css'
)
check(
  'Progress dock height variable is used for spacing',
  appShell.includes('--progress-dock-height') ||
    exhibitCss.includes('--progress-dock-height') ||
    scannerCss.includes('--progress-dock-height'),
  'expected --progress-dock-height to appear in at least one screen CSS file'
)

// 8. Scanner auto-start cleanup exists
const scannerJsx = read('src/screens/ScannerScreen.jsx')
check('Scanner stops camera on unmount', scannerJsx.includes('scannerRef.current.stop()'))

// 9. No inline styles in key screens
const adminJsx = read('src/screens/AdminScreen.jsx')
const menuJsx = read('src/screens/MenuScreen.jsx')
check('MenuScreen uses CSS classes, not inline styles', !menuJsx.includes('style={{'))
check('AdminScreen uses CSS classes, not inline styles', !adminJsx.includes('style={{'))

// 10. Reduced motion is globally respected
const indexCss = read('src/index.css')
check('Reduced motion is globally respected', indexCss.includes('prefers-reduced-motion'))

// 11. Focus-visible styles exist
check('Focus-visible styles exist', indexCss.includes(':focus-visible'))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll responsive and accessibility baseline checks passed')
