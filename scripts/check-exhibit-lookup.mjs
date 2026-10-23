// Small self-check for getExhibitById and the parse -> lookup pipeline.
// Run: node scripts/check-exhibit-lookup.mjs   (or: npm run check:exhibit)
import { getExhibitById } from '../src/lib/exhibitLookup.js'
import { parseQrPayload } from '../src/lib/qrPayload.js'
import { exhibits } from '../src/data/exhibits.js'

let failed = 0

function expect(actual, expected, label) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  if (actualStr === expectedStr) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + ' — expected ' + expectedStr + ', got ' + actualStr)
  failed += 1
}

// Direct lookup: hits
const found1 = getExhibitById('EXPO-001')
expect(found1.ok, true, 'EXPO-001 ok flag')
expect(found1.exhibit.id, 'EXPO-001', 'EXPO-001 returns correct record')
expect(found1.exhibit.content.en.title, 'Peranakan Vase', 'EXPO-001 EN title preserved')
expect(found1.exhibit.content.zh.title, '娘惹花瓶', 'EXPO-001 ZH title preserved')

const found2 = getExhibitById('EXPO-002')
expect(found2.ok, true, 'EXPO-002 ok flag')
expect(found2.exhibit.id, 'EXPO-002', 'EXPO-002 returns correct record')

// Direct lookup: misses
expect(getExhibitById('EXPO-999'), { ok: false, reason: 'unknown-exhibit' }, 'EXPO-999 format-valid unknown')
expect(getExhibitById('expo-001'), { ok: false, reason: 'unknown-exhibit' }, 'lowercase expo-001 rejected (case-sensitive)')
expect(getExhibitById(''), { ok: false, reason: 'unknown-exhibit' }, 'empty string')
expect(getExhibitById(null), { ok: false, reason: 'unknown-exhibit' }, 'null input')
expect(getExhibitById(undefined), { ok: false, reason: 'unknown-exhibit' }, 'undefined input')
expect(getExhibitById(123), { ok: false, reason: 'unknown-exhibit' }, 'number input')

// Pipeline integration: parse -> lookup
function pipeline(raw) {
  const parsed = parseQrPayload(raw)
  if (!parsed.ok) return parsed
  return getExhibitById(parsed.exhibitId)
}

expect(pipeline('EXPO-001').ok, true, 'pipeline: EXPO-001 resolves')
expect(pipeline('  expo-002  ').ok, true, 'pipeline: whitespace + lowercase EXPO-002 resolves')
expect(pipeline('EXPO-999'), { ok: false, reason: 'unknown-exhibit' }, 'pipeline: EXPO-999 unknown-exhibit')
expect(pipeline('https://evil.example/EXPO-001'), { ok: false, reason: 'unsupported-format' }, 'pipeline: URL rejected at parse stage')
expect(pipeline(''), { ok: false, reason: 'empty' }, 'pipeline: empty rejected at parse stage')

// Sanity: exhibits array still has 2 items (nothing was mutated)
expect(exhibits.length, 2, 'exhibits array unchanged')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll exhibit lookup self-checks passed')
