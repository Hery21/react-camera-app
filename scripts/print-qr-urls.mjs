import { exhibits } from '../src/data/exhibits.js'
import { QR_BASE_URL } from '../src/config/qrConfig.js'

console.log('QR payload URLs to reprint (one per physical exhibit label):')
console.log('')
for (const exhibit of exhibits) {
  console.log(QR_BASE_URL + '/?exhibit=' + exhibit.id)
}
console.log('')
console.log('Generate QR codes for these URLs with any QR tool, or open Admin -> QR Codes in the app.')
