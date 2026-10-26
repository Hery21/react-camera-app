import { exhibits } from '../src/data/exhibits.js'

let failed = 0

const ids = ['PSBIKT-001', 'PSBIKT-002', 'PSBIKT-003', 'PSBIKT-004', 'PSBIKT-005', 'PSBIKT-006', 'PSBIKT-007', 'PSBIKT-008']

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
}

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll cover images mapped correctly')
