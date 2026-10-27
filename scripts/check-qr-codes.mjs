import { readFileSync, existsSync } from 'node:fs'

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

const config = read('src/config/qrConfig.js')
const qrComposite = read('src/lib/qrComposite.js')
const adminQRCodes = read('src/screens/AdminQRCodes.jsx')
const adminScreen = read('src/screens/AdminScreen.jsx')
const printScript = read('scripts/print-qr-urls.mjs')
const adminCss = read('src/styles/admin.css')

check('qrConfig.js exists', config.length > 0)
check('qrConfig exports QR_BASE_URL', config.includes('QR_BASE_URL'))
check('QR_BASE_URL is a string constant', /export\s+const\s+QR_BASE_URL\s*=\s*['"]/.test(config))

check('qrComposite.js exists', qrComposite.length > 0)
check('qrComposite exports QR_FRAME_SRC pointing at /QR/QR-cover.webp', /export\s+const\s+QR_FRAME_SRC\s*=\s*['"]\/QR\/QR-cover\.webp['"]/.test(qrComposite))
check('qrComposite exports QR_SIZE_RATIO', qrComposite.includes('QR_SIZE_RATIO'))
check('qrComposite exports downloadCompositeJPG', qrComposite.includes('downloadCompositeJPG'))
check('qrComposite exports composeCompositeCanvas', qrComposite.includes('composeCompositeCanvas'))
check('qrComposite uses canvas.toBlob with image/jpeg', qrComposite.includes('image/jpeg'))

const frameAsset = 'public/QR/QR-cover.webp'
check('Frame asset exists at ' + frameAsset, existsSync(frameAsset))

check('AdminQRCodes.jsx exists', adminQRCodes.length > 0)
check('AdminQRCodes imports qrcode-generator', adminQRCodes.includes("from 'qrcode-generator'"))
check('AdminQRCodes imports QR_BASE_URL', adminQRCodes.includes('QR_BASE_URL'))
check('AdminQRCodes imports downloadCompositeJPG', adminQRCodes.includes('downloadCompositeJPG'))
check('AdminQRCodes imports QR_FRAME_SRC', adminQRCodes.includes('QR_FRAME_SRC'))
check('AdminQRCodes builds ?exhibit= URLs', adminQRCodes.includes("'/?exhibit='"))
check('AdminQRCodes does NOT include old Download SVG button', !adminQRCodes.includes('Download SVG'))
check('AdminQRCodes includes Download JPG button', adminQRCodes.includes('Download JPG'))

check('AdminScreen imports AdminQRCodes', adminScreen.includes('AdminQRCodes'))
check('AdminScreen has showQRCodes state', adminScreen.includes('showQRCodes'))
check('AdminScreen renders AdminQRCodes when showQRCodes', adminScreen.includes('<AdminQRCodes'))
check('AdminScreen has QR Codes button', adminScreen.includes('QR Codes'))

check('print-qr-urls.mjs imports QR_BASE_URL', printScript.includes("from '../src/config/qrConfig.js'"))
check('print-qr-urls.mjs uses QR_BASE_URL', printScript.includes('QR_BASE_URL'))

check('admin.css has QR grid styles', adminCss.includes('.admin-qr-grid'))
check('admin.css has frame wrap styles', adminCss.includes('.admin-qr-frame-wrap'))
check('admin.css has QR overlay styles', adminCss.includes('.admin-qr-overlay'))
check('admin.css overlay uses max-width 25%', /admin-qr-overlay[\s\S]{0,200}max-width:\s*25%/.test(adminCss))
check('admin.css overlay uses aspect-ratio 1', /admin-qr-overlay[\s\S]{0,200}aspect-ratio:\s*1/.test(adminCss))
check('admin.css has print media query', adminCss.includes('@media print'))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR code generator self-checks passed')
