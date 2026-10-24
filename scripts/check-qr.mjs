import { parseQrPayload } from '../src/lib/qrPayload.js'
import { exhibits } from '../src/data/exhibits.js'

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

expect(parseQrPayload('PSBIKT-001'), { ok: true, exhibitId: 'PSBIKT-001' }, 'valid exact')
expect(parseQrPayload('  PSBIKT-001  '), { ok: true, exhibitId: 'PSBIKT-001' }, 'valid with whitespace')
expect(parseQrPayload('psbikt-001'), { ok: true, exhibitId: 'PSBIKT-001' }, 'valid case-insensitive')
expect(parseQrPayload('PSBIKT-008'), { ok: true, exhibitId: 'PSBIKT-008' }, 'valid different id')
expect(parseQrPayload(''), { ok: false, reason: 'empty' }, 'empty string')
expect(parseQrPayload('   '), { ok: false, reason: 'empty' }, 'whitespace only')
expect(parseQrPayload(null), { ok: false, reason: 'empty' }, 'null input')
expect(parseQrPayload('https://example.com/PSBIKT-001'), { ok: false, reason: 'unsupported-format' }, 'url rejected')
expect(parseQrPayload('PSBIKT-01'), { ok: false, reason: 'unsupported-format' }, 'too short')
expect(parseQrPayload('PSBIKT-0001'), { ok: false, reason: 'unsupported-format' }, 'too long')
expect(parseQrPayload('PSBIKT-ABC'), { ok: false, reason: 'unsupported-format' }, 'letters instead of digits')
expect(parseQrPayload('PSBIKT-001' + String.fromCharCode(10)), { ok: true, exhibitId: 'PSBIKT-001' }, 'trailing newline')
expect(parseQrPayload('X'.repeat(300)), { ok: false, reason: 'unsupported-format' }, 'length guard')

expect(exhibits.length, 8, 'has 8 supplied exhibits')
expect(exhibits[0].id, 'PSBIKT-001', 'first exhibit id')
expect(exhibits[0].content.id.title, 'Lukisan 8 Kuda', 'first Indonesian title')
expect(exhibits[5].id, 'PSBIKT-006', 'Catur Cina id')
expect(exhibits[5].content.id.title, 'Catur Cina', 'Catur Cina Indonesian title')
expect(exhibits[5].coverImage, '/images/exhibits/PSBIKT-006/cover.jpg', 'Catur Cina public cover path')
expect(exhibits[7].id, 'PSBIKT-008', 'last exhibit id')
expect(exhibits[7].content.id.title, 'Altar', 'last Indonesian title')

if (process.exitCode) {
  console.error('QR parser self-check failed')
} else {
  console.log('All QR parser self-checks passed')
}
