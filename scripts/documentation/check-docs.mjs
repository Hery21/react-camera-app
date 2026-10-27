// Structural self-check for the documentation pipeline.
// All checks use .includes() — no regex, because template-literal escaping
// strips backslashes when phase-runner writes plan files.

import { existsSync, readFileSync } from 'node:fs'

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

check('documentation/screens-content.mjs exists', existsSync('documentation/screens-content.mjs'))
check('documentation/README.md exists', existsSync('documentation/README.md'))
check('scripts/documentation/capture-screens.mjs exists', existsSync('scripts/documentation/capture-screens.mjs'))
check('scripts/documentation/generate-html.mjs exists', existsSync('scripts/documentation/generate-html.mjs'))
check('scripts/documentation/check-docs.mjs exists', existsSync('scripts/documentation/check-docs.mjs'))

const screens = read('documentation/screens-content.mjs')
check('screens-content exports screensContent array', screens.includes('export const screensContent'))
check('screens-content has at least 10 screens', (screens.match(/id:\s*'/g) || []).length >= 10)
check('screens have navigate functions', screens.includes('navigate: async'))
check('welcome screen defined', screens.includes("id: 'welcome'"))
check('menu screen defined', screens.includes("id: 'menu'"))
check('scanner screen defined', screens.includes("id: 'scanner'"))
check('scan-result screen defined', screens.includes("id: 'scan-result'"))
check('exhibit screen defined', screens.includes("id: 'exhibit'"))
check('twibbon screen defined', screens.includes("id: 'twibbon'"))
check('quiz-identity screen defined', screens.includes("id: 'quiz-identity'"))
check('quiz-question screen defined', screens.includes("id: 'quiz-question'"))
check('admin-dashboard screen defined', screens.includes("id: 'admin-dashboard'"))
check('admin-qr screen defined', screens.includes("id: 'admin-qr'"))
check('admin-edit screen defined', screens.includes("id: 'admin-edit'"))

const capture = read('scripts/documentation/capture-screens.mjs')
check('capture imports playwright', capture.includes("from 'playwright'"))
check('capture uses fake camera flags', capture.includes('--use-fake-device-for-media-stream'))
check('capture uses fake UI flags', capture.includes('--use-fake-ui-for-media-stream'))
check('capture sets language via init script', capture.includes('addInitScript'))
check('capture saves to screenshots dir', capture.includes('documentation/screenshots'))
check('capture uses deviceScaleFactor (via constant)', capture.includes('DEVICE_SCALE_FACTOR') && capture.includes('deviceScaleFactor:'))
check('capture saves as JPEG', capture.includes("type: 'jpeg'"))
check('capture JPEG quality 92', capture.includes('quality: 92'))
check('capture filenames use .jpg', capture.includes("'.jpg'"))
check('capture checks dev server availability', capture.includes('checkServer'))
check('capture has prerequisite probe', capture.includes('probeFeature'))
check('capture exits 0 on partial success', capture.includes('process.exit(0)'))
check('capture has failure summary', capture.includes('Capture summary'))

const generate = read('scripts/documentation/generate-html.mjs')
check('generate imports screensContent', generate.includes('screens-content.mjs'))
check('generate embeds base64 images', generate.includes('base64'))
check('generate reads JPEG images', generate.includes('data:image/jpeg'))
check('generate looks for .jpg files', generate.includes("'.jpg'"))
check('generate writes documentation/index.html', generate.includes('documentation/index.html'))
check('generate attempts PDF generation', generate.includes('.pdf(') && generate.includes('pdfPage.pdf'))
check('generate uses A4 portrait', generate.includes('A4 portrait'))
check('generate PDF is portrait (landscape false)', generate.includes('landscape: false'))
check('generate has description below screenshots', generate.indexOf('description-block') > generate.indexOf('lang-grid'))
check('generate labels the description "About this screen"', generate.includes('About this screen'))
check('generate shows viewport metadata', generate.includes('Viewport:'))
check('generate uses 3 screenshot columns on portrait A4', generate.includes('repeat(3, 1fr)'))

const pkg = JSON.parse(read('package.json') || '{}')
check('package.json has docs:capture', Boolean(pkg.scripts && pkg.scripts['docs:capture']))
check('package.json has docs:generate', Boolean(pkg.scripts && pkg.scripts['docs:generate']))
check('package.json has docs:check', Boolean(pkg.scripts && pkg.scripts['docs:check']))
check('package.json has docs script', Boolean(pkg.scripts && pkg.scripts.docs))
check('package.json has playwright devDependency', Boolean(pkg.devDependencies && pkg.devDependencies.playwright))

const gitignore = read('.gitignore')
check('.gitignore excludes documentation/screenshots/', gitignore.includes('documentation/screenshots'))
check('.gitignore excludes documentation/index.html', gitignore.includes('documentation/index.html'))
check('.gitignore excludes documentation/storytelling-mirror.pdf', gitignore.includes('documentation/storytelling-mirror.pdf'))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll documentation self-checks passed')
