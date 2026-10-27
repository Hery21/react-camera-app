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

const config = read('src/config/qrConfig.js')
const adminQRCodes = read('src/screens/AdminQRCodes.jsx')
const adminScreen = read('src/screens/AdminScreen.jsx')
const printScript = read('scripts/print-qr-urls.mjs')
const adminCss = read('src/styles/admin.css')

check('qrConfig.js exists', config.length > 0)
check('qrConfig exports QR_BASE_URL', config.includes('QR_BASE_URL'))
check('QR_BASE_URL is a string constant', /export\s+const\s+QR_BASE_URL\s*=\s*['"]/.test(config))

check('AdminQRCodes.jsx exists', adminQRCodes.length > 0)
check('AdminQRCodes imports qrcode-generator', adminQRCodes.includes("from 'qrcode-generator'"))
check('AdminQRCodes imports QR_BASE_URL', adminQRCodes.includes('QR_BASE_URL'))
check('AdminQRCodes uses createSvgTag', adminQRCodes.includes('createSvgTag'))
check('AdminQRCodes builds ?exhibit= URLs', adminQRCodes.includes("'/?exhibit='"))

check('AdminScreen imports AdminQRCodes', adminScreen.includes('AdminQRCodes'))
check('AdminScreen has showQRCodes state', adminScreen.includes('showQRCodes'))
check('AdminScreen renders AdminQRCodes when showQRCodes', adminScreen.includes('<AdminQRCodes'))
check('AdminScreen has QR Codes button', adminScreen.includes('QR Codes'))

check('print-qr-urls.mjs imports QR_BASE_URL', printScript.includes("from '../src/config/qrConfig.js'"))
check('print-qr-urls.mjs uses QR_BASE_URL', printScript.includes('QR_BASE_URL'))

check('admin.css has QR grid styles', adminCss.includes('.admin-qr-grid'))
check('admin.css has print media query', adminCss.includes('@media print'))
check('admin.css print hides admin-header', adminCss.includes('.admin-header'))
check('admin.css print sets 2-column QR grid', /@media print[\s\S]*grid-template-columns:\s*repeat\(2/.test(adminCss))

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR code generator self-checks passed')
