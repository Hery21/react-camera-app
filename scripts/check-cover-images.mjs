import { exhibits } from '../src/data/exhibits.js'

let failed = 0

const ids = [
  'PSBIKT-001',
  'PSBIKT-002',
  'PSBIKT-003',
  'PSBIKT-004',
  'PSBIKT-005',
  'PSBIKT-006',
  'PSBIKT-007',
  'PSBIKT-008',
  'PSBIKT-009',
  'PSBIKT-010',
]

for (const id of ids) {
  const exhibit = exhibits.find((e) => e.id === id)
  if (!exhibit) {
    console.error('FAIL ' + id + ' not found in exhibits')
    failed += 1
    continue
  }
  const expected = '/images/exhibits/' + id + '/cover.webp'
  if (exhibit.coverImage !== expected) {
    console.error('FAIL ' + id + ' coverImage = ' + JSON.stringify(exhibit.coverImage) + ' (expected ' + expected + ')')
    failed += 1
  } else {
    console.log('OK  ' + id + ' -> ' + expected)
  }
  if (!exhibit.content) {
    console.error('FAIL ' + id + ' has no content')
    failed += 1
    continue
  }
  for (const lang of ['id', 'en', 'zh']) {
    const block = exhibit.content[lang]
    if (!block) {
      console.error('FAIL ' + id + ' missing ' + lang + ' content')
      failed += 1
      continue
    }
    if (!block.title || block.title.length === 0) {
      console.error('FAIL ' + id + ' missing ' + lang + '.title')
      failed += 1
    }
  }
}

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll 10 exhibits mapped correctly with trilingual content')
