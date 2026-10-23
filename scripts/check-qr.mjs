// Small self-check for parseQrPayload and exhibit data integrity.
// Run: node scripts/check-qr.mjs   (or: npm run check:qr)
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

// QR Parser checks
expect(parseQrPayload('EXPO-001'), { ok: true, exhibitId: 'EXPO-001' }, 'valid exact')
expect(parseQrPayload('  EXPO-001  '), { ok: true, exhibitId: 'EXPO-001' }, 'valid with whitespace')
expect(parseQrPayload('expo-001'), { ok: true, exhibitId: 'EXPO-001' }, 'valid case-insensitive')
expect(parseQrPayload('EXPO-123'), { ok: true, exhibitId: 'EXPO-123' }, 'valid different id')
expect(parseQrPayload(''), { ok: false, reason: 'empty' }, 'empty string')
expect(parseQrPayload('   '), { ok: false, reason: 'empty' }, 'whitespace only')
expect(parseQrPayload(null), { ok: false, reason: 'empty' }, 'null input')
expect(parseQrPayload('https://expo.com/EXPO-001'), { ok: false, reason: 'unsupported-format' }, 'url rejected')
expect(parseQrPayload('EXPO-1'), { ok: false, reason: 'unsupported-format' }, 'too short')
expect(parseQrPayload('EXPO-0001'), { ok: false, reason: 'unsupported-format' }, 'too long')
expect(parseQrPayload('EXPO-ABC'), { ok: false, reason: 'unsupported-format' }, 'letters instead of digits')
expect(parseQrPayload('EXPO-001\n'), { ok: true, exhibitId: 'EXPO-001' }, 'trailing newline')
expect(parseQrPayload('A'.repeat(201)), { ok: false, reason: 'unsupported-format' }, 'length guard')

// Exhibit data integrity
expect(exhibits.length, 2, 'has 2 fixtures')
expect(exhibits[0].id, 'EXPO-001', 'first fixture id')
expect(exhibits[0].content.en.title, 'Peranakan Vase', 'first fixture EN title')
expect(exhibits[0].content.zh.title, '娘惹花瓶', 'first fixture ZH title')

// Optional field check (EXPO-002 has no symbolism)
expect('symbolism' in exhibits[1].content.en, false, 'EXPO-002 has no symbolism')
expect('symbolism' in exhibits[1].content.zh, false, 'EXPO-002 has no symbolism in zh')

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR and data self-checks passed')
