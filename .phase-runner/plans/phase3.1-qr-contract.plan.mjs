export default {
  name: 'Phase 3.1 — QR contract, parser, and trilingual fixtures',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Creates strict QR parser (EXPO-XXX) and representative trilingual exhibit data (EN/ID/ZH) as per master plan. No UI changes yet.',
    },
    {
      type: 'write',
      label: 'create src/lib/qrPayload.js',
      path: 'src/lib/qrPayload.js',
      content: `// Parses scanned QR payloads. Never navigates to arbitrary URLs.
// Contract: "EXPO-" followed by exactly 3 digits. Case-insensitive input, always returns uppercase ID.
export function parseQrPayload(raw) {
  if (typeof raw !== 'string') return { ok: false, reason: 'empty' }
  
  const text = raw.trim()
  if (!text) return { ok: false, reason: 'empty' }
  if (text.length > 200) return { ok: false, reason: 'unsupported-format' }

  const match = text.match(/^EXPO-\\d{3}$/i)
  if (!match) return { ok: false, reason: 'unsupported-format' }

  return { ok: true, exhibitId: text.toUpperCase() }
}
`,
    },
    {
      type: 'write',
      label: 'create src/data/exhibits.js fixture data',
      path: 'src/data/exhibits.js',
      content: `// Representative trilingual exhibit records.
// Real content must come from the expo team; these are provisional fixtures.
export const exhibits = [
  {
    id: 'EXPO-001',
    coverImage: '/images/exhibits/expo-001/cover.webp',
    content: {
      en: {
        title: 'Peranakan Vase',
        period: '19th Century',
        summary: 'A beautifully crafted porcelain vase featuring vibrant floral motifs.',
        story: 'The Peranakan vase represents a blend of Chinese and Malay cultural influences, often used in ceremonial settings.',
        symbolism: 'The peony motif symbolizes prosperity and honor, while the phoenix represents renewal.',
        coverAlt: 'A vibrant green and pink Peranakan vase with floral motifs.'
      },
      id: {
        title: 'Vas Peranakan',
        period: 'Abad ke-19',
        summary: 'Vas porselen yang dibuat dengan indah menampilkan motif bunga yang semarak.',
        story: 'Vas Peranakan mewakili perpaduan pengaruh budaya Tionghoa dan Melayu, sering digunakan dalam upacara adat.',
        symbolism: 'Motif peony melambangkan kemakmuran dan kehormatan, sedangkan phoenix melambangkan pembaruan.',
        coverAlt: 'Vas Peranakan hijau dan merah muda cerah dengan motif bunga.'
      },
      zh: {
        title: '娘惹花瓶',
        period: '19世纪',
        summary: '一件精美的瓷瓶，饰有充满活力的花卉图案。',
        story: '娘惹花瓶代表了中华文化和马来文化影响的融合，常用于仪式场合。',
        symbolism: '牡丹图案象征繁荣和尊荣，而凤凰则代表重生。',
        coverAlt: '一个鲜艳的绿色和粉红色娘惹花瓶，带有花卉图案。'
      }
    }
  },
  {
    id: 'EXPO-002',
    coverImage: '/images/exhibits/expo-002/cover.webp',
    content: {
      en: {
        title: 'Beaded Slippers',
        period: 'Early 20th Century',
        summary: 'Intricately beaded slippers worn by Peranakan women.',
        story: 'These slippers, known as kasut manek, required months of painstaking beadwork.',
        coverAlt: 'Colorful beaded slippers with floral patterns.'
      },
      id: {
        title: 'Sandal Berhias Manik',
        period: 'Awal Abad ke-20',
        summary: 'Sandal berhias manik yang dikenakan oleh wanita Peranakan.',
        story: 'Sandal ini, yang dikenal sebagai kasut manek, membutuhkan waktu berbulan-bulan untuk dibuat.',
        coverAlt: 'Sandal berhias manik warna-warni dengan pola bunga.'
      },
      zh: {
        title: '珠绣拖鞋',
        period: '20世纪初',
        summary: '娘惹妇女穿着的精美珠绣拖鞋。',
        story: '这种被称为kasut manek的拖鞋，需要数月艰苦的串珠工作。',
        coverAlt: '带有花卉图案的色彩鲜艳的珠绣拖鞋。'
      }
    }
  }
]
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-qr.mjs self-check',
      path: 'scripts/check-qr.mjs',
      content: `// Small self-check for parseQrPayload and exhibit data integrity.
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
expect(parseQrPayload('EXPO-001\\n'), { ok: true, exhibitId: 'EXPO-001' }, 'trailing newline')
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
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll QR and data self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:qr script',
      path: 'package.json',
      value: {
        scripts: {
          'check:qr': 'node scripts/check-qr.mjs',
        },
      },
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'qr self-check',
      command: 'npm run check:qr',
    },
    {
      type: 'commit',
      label: 'commit qr parser and fixtures',
      message: 'feat(qr): add strict payload parser and trilingual fixtures',
      paths: [
        'src/lib/qrPayload.js',
        'src/data/exhibits.js',
        'scripts/check-qr.mjs',
        'package.json',
      ],
      as: 'qr',
    },
    {
      type: 'write',
      label: 'record phase 3.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 3.1 — QR contract, parser, and trilingual fixtures\n\n**Status:** Complete  \n**Goal:** Establish a strict, safe QR payload contract and provide representative trilingual (EN/ID/ZH) exhibit data for subsequent phases.  \n**Files changed:** src/lib/qrPayload.js (new), src/data/exhibits.js (new), scripts/check-qr.mjs (new), package.json (adds check:qr script).  \n**User-visible result:** None yet; the parser and fixtures are not wired into the UI.  \n**Automated checks:** npm run lint; npm run check:qr (17 self-check assertions).  \n**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers parsing branches and data integrity.  \n**Manual checks:** None applicable.  \n**Not checked:** Real physical QR codes. The contract (EXPO-XXX) is a provisional fixture per the master plan; real payloads must be inspected before production.  \n**Remaining risks:** If the real expo QR codes contain URLs or different prefixes, the parser will reject them as unsupported. This is intentional until real payloads are confirmed. The fixture data uses placeholder images (/images/exhibits/...) which will result in broken image links if rendered until assets are added in Phase 5.  \n**Decisions made:** Strict regex /^EXPO-\\d{3}$/i with length guard. Never parses URLs. Case-insensitive input but always returns uppercase ID. Fixtures include two exhibits to test optional fields (EXPO-002 lacks symbolism). All three languages (en, id, zh) are populated in the fixtures as required by the extended scope.  \n**Next part:** Phase 3.2 — exhibit lookup helper (mapping parsed IDs to fixture records).  \n**Commit:** {{hash.qr}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 3.1 progress',
      message: 'docs(progress): record phase 3.1 qr contract',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}