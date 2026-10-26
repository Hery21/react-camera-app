import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const EXHIBITS_JS = 'src/data/exhibits.js'
const EXHIBITS_JSON = 'src/data/exhibits.json'

const ids = ['PSBIKT-001', 'PSBIKT-002', 'PSBIKT-003', 'PSBIKT-004', 'PSBIKT-005', 'PSBIKT-006', 'PSBIKT-007', 'PSBIKT-008']

function coverImageFor(id) {
  return '/images/exhibits/' + id + '/cover.webp'
}

const touched = []

if (existsSync(EXHIBITS_JSON)) {
  const data = JSON.parse(readFileSync(EXHIBITS_JSON, 'utf8'))
  let count = 0
  for (const exhibit of data) {
    if (ids.includes(exhibit.id) && !exhibit.coverImage) {
      exhibit.coverImage = coverImageFor(exhibit.id)
      count++
    }
  }
  writeFileSync(EXHIBITS_JSON, JSON.stringify(data, null, 2) + '\n')
  touched.push('exhibits.json (' + count + ' updated)')
}

if (existsSync(EXHIBITS_JS)) {
  let content = readFileSync(EXHIBITS_JS, 'utf8')
  if (content.includes('const baseExhibits')) {
    let count = 0
    for (const id of ids) {
      const pattern = new RegExp("(id: '" + id + "',)\n(    content:)", 'g')
      const before = content
      content = content.replace(pattern, "$1\n    coverImage: '" + coverImageFor(id) + "',\n$2")
      if (content !== before) count++
    }
    writeFileSync(EXHIBITS_JS, content)
    touched.push('exhibits.js (' + count + ' updated)')
  }
}

if (touched.length === 0) {
  console.error('Neither exhibits.js (with baseExhibits) nor exhibits.json found')
  process.exit(1)
}

console.log('Cover images mapped:')
touched.forEach((t) => console.log('  - ' + t))
