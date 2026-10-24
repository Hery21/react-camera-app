import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.css'])
const OBSOLETE_ASSETS = [
  { path: 'src/assets/react.svg', references: ['assets/react.svg', './assets/react.svg', '../assets/react.svg'] },
  { path: 'src/assets/vite.svg', references: ['assets/vite.svg', './assets/vite.svg', '../assets/vite.svg'] },
  { path: 'src/assets/hero.png', references: ['assets/hero.png', './assets/hero.png', '../assets/hero.png'] },
]
const DEBUG_CALLS = ['console.log(', 'console.debug(']
let failed = false

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

const sourceFiles = walk('src').filter((file) => SOURCE_EXTENSIONS.has(extname(file)))

for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8')

  for (const asset of OBSOLETE_ASSETS) {
    for (const reference of asset.references) {
      if (content.includes(reference)) {
        console.error('FAIL ' + file + ' still references obsolete asset path ' + reference)
        failed = true
      }
    }
  }

  for (const debugCall of DEBUG_CALLS) {
    if (content.includes(debugCall)) {
      console.error('FAIL ' + file + ' contains debug console output: ' + debugCall)
      failed = true
    }
  }
}

for (const asset of OBSOLETE_ASSETS) {
  if (existsSync(asset.path)) {
    console.error('FAIL obsolete asset still exists: ' + asset.path)
    failed = true
  } else {
    console.log('OK  obsolete asset absent: ' + asset.path)
  }
}

if (failed) {
  console.error('Runtime cleanup self-check failed')
  process.exit(1)
}

console.log('Runtime cleanup self-check passed')
