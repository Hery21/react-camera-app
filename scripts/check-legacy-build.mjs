import { existsSync, readdirSync, readFileSync } from 'node:fs'

if (!existsSync('dist')) {
  console.error('dist does not exist — run npm run build first')
  process.exit(1)
}

const assetsDir = existsSync('dist/assets') ? 'dist/assets' : 'dist'
const files = readdirSync(assetsDir)
const legacyJS = files.filter((f) => f.includes('-legacy-') && f.endsWith('.js'))
const legacyPolyfills = files.filter((f) => f.startsWith('polyfills-legacy'))

if (legacyJS.length === 0) {
  console.error('No legacy JS chunks found in ' + assetsDir)
  process.exit(1)
}

const html = readFileSync('dist/index.html', 'utf8')
if (!html.includes('nomodule')) {
  console.error('No nomodule script tag found in dist/index.html — legacy bundle will not be loaded by old browsers')
  process.exit(1)
}

console.log('OK  legacy JS chunks: ' + legacyJS.join(', '))
console.log('OK  legacy polyfills: ' + (legacyPolyfills.length > 0 ? legacyPolyfills.join(', ') : 'none'))
console.log('OK  nomodule script present in dist/index.html')
console.log('Legacy build verified')
