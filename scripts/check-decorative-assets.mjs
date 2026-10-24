import { existsSync, readFileSync } from 'node:fs'
import { decorativeAssets } from '../src/data/decorativeAssets.js'

let failed = false
const seen = new Set()

function visit(value, owner) {
  if (typeof value === 'string') {
    if (seen.has(value)) return
    seen.add(value)

    const diskPath = 'public' + value
    if (existsSync(diskPath)) {
      console.log('OK  ' + owner + ' -> ' + value)
    } else {
      console.error('FAIL ' + owner + ' -> missing ' + diskPath)
      failed = true
    }
    return
  }

  for (const [key, child] of Object.entries(value)) {
    visit(child, owner + '.' + key)
  }
}

visit(decorativeAssets, 'decorativeAssets')

const iconsPath = 'public/icons.svg'
if (existsSync(iconsPath)) {
  const icons = readFileSync(iconsPath, 'utf8')
  const ids = [...icons.matchAll(/<symbol[^>]+id=["']([^"']+)["']/g)].map((match) => match[1])
  if (ids.length) console.log('INFO icons.svg symbol IDs: ' + ids.join(', '))
  else console.log('INFO icons.svg contains no symbol IDs; inspect before treating it as a sprite')
}

if (failed) {
  console.error('Decorative asset self-check failed')
  process.exit(1)
}

console.log('Decorative asset self-check passed for ' + seen.size + ' unique public assets')
