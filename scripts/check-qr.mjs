import { parseQrPayload } from '../src/lib/qrPayload.js'

let failed = 0

function check(label, actual, expected) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  if (actualStr === expectedStr) {
    console.log('OK  ' + label)
    return
  }
  failed += 1
  console.error('FAIL ' + label + ' — expected ' + expectedStr + ', got ' + actualStr)
}

// Plain text format
check('plain PSBIKT-001', parseQrPayload('PSBIKT-001'), { ok: true, exhibitId: 'PSBIKT-001' })
check('plain lowercase', parseQrPayload('psbikt-001'), { ok: true, exhibitId: 'PSBIKT-001' })
check('plain with whitespace', parseQrPayload('  PSBIKT-002  '), { ok: true, exhibitId: 'PSBIKT-002' })
check('plain bad format', parseQrPayload('PSBIKT-1'), { ok: false, reason: 'unsupported-format' })
check('plain letters only', parseQrPayload('PSBIKT-ABC'), { ok: false, reason: 'unsupported-format' })

// URL format
check('url with exhibit param', parseQrPayload('https://psb-2026-ikt.vercel.app/?exhibit=PSBIKT-001'), { ok: true, exhibitId: 'PSBIKT-001' })
check('url lowercase id', parseQrPayload('https://psb-2026-ikt.vercel.app/?exhibit=psbikt-002'), { ok: true, exhibitId: 'PSBIKT-002' })
check('url extra params ok', parseQrPayload('https://psb-2026-ikt.vercel.app/?other=x&exhibit=PSBIKT-003'), { ok: true, exhibitId: 'PSBIKT-003' })
check('url localhost ok', parseQrPayload('http://localhost:5173/?exhibit=PSBIKT-004'), { ok: true, exhibitId: 'PSBIKT-004' })
check('url preview host ok', parseQrPayload('https://psb-2026-ikt-git-main.vercel.app/?exhibit=PSBIKT-005'), { ok: true, exhibitId: 'PSBIKT-005' })
check('url arbitrary host accepted', parseQrPayload('https://example.com/?exhibit=PSBIKT-001'), { ok: true, exhibitId: 'PSBIKT-001' })
check('url missing exhibit param', parseQrPayload('https://psb-2026-ikt.vercel.app/?other=PSBIKT-001'), { ok: false, reason: 'unsupported-format' })
check('url empty exhibit param', parseQrPayload('https://psb-2026-ikt.vercel.app/?exhibit='), { ok: false, reason: 'unsupported-format' })
check('url invalid exhibit value', parseQrPayload('https://psb-2026-ikt.vercel.app/?exhibit=BAD'), { ok: false, reason: 'unsupported-format' })

// Edge cases
check('empty string', parseQrPayload(''), { ok: false, reason: 'empty' })
check('whitespace only', parseQrPayload('   '), { ok: false, reason: 'empty' })
check('null', parseQrPayload(null), { ok: false, reason: 'empty' })
check('undefined', parseQrPayload(undefined), { ok: false, reason: 'empty' })
check('number input', parseQrPayload(123), { ok: false, reason: 'empty' })
check('too long', parseQrPayload('A'.repeat(500)), { ok: false, reason: 'unsupported-format' })
check('arbitrary text', parseQrPayload('hello world'), { ok: false, reason: 'unsupported-format' })
check('url-like garbage', parseQrPayload('not-a-url-with-PSBIKT-001'), { ok: false, reason: 'unsupported-format' })

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll QR self-checks passed')
