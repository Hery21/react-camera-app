import { getExhibitById } from '../src/lib/exhibitLookup.js'

function expect(actual, expected, label) {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson) {
    console.error('FAIL ' + label + ' — expected ' + expectedJson + ', got ' + actualJson)
    process.exitCode = 1
    return
  }
  console.log('OK  ' + label)
}

const first = getExhibitById('PSBIKT-001')
expect(first.ok, true, 'finds first exhibit')
expect(first.ok ? first.exhibit.content.id.title : null, 'Lukisan 8 Kuda', 'first exhibit title')

const catur = getExhibitById('PSBIKT-006')
expect(catur.ok, true, 'finds Catur Cina')
expect(catur.ok ? catur.exhibit.coverImage : null, '/images/exhibits/PSBIKT-006/cover.jpg', 'Catur Cina cover')

const last = getExhibitById('PSBIKT-008')
expect(last.ok, true, 'finds last exhibit')
expect(last.ok ? last.exhibit.content.id.title : null, 'Altar', 'last exhibit title')

expect(getExhibitById('PSBIKT-999'), { ok: false, reason: 'unknown-exhibit' }, 'unknown exhibit')
expect(getExhibitById(''), { ok: false, reason: 'unknown-exhibit' }, 'empty id')

if (process.exitCode) {
  console.error('Exhibit lookup self-check failed')
} else {
  console.log('All exhibit lookup self-checks passed')
}
