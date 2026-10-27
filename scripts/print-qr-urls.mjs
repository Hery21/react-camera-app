import { exhibits } from '../src/data/exhibits.js'

const BASE_URL = 'https://psb-2026-ikt.vercel.app'

console.log('QR payload URLs to reprint (one per physical exhibit label):')
console.log('')
for (const exhibit of exhibits) {
  console.log(BASE_URL + '/?exhibit=' + exhibit.id)
}
console.log('')
console.log('Use these exact URLs when generating new QR labels.')
