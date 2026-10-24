export default {
  name: 'Phase 3.2 — exhibit lookup helper',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds getExhibitById(id) with structured ok/reason result. Reason label matches master-plan canonical set (unknown-exhibit). Uses find() for the 2-fixture MVP; upgrade to Map when the exhibit count grows. No UI changes; consumption begins in Phase 7.',
    },
    {
      type: 'write',
      label: 'create src/lib/exhibitLookup.js',
      path: 'src/lib/exhibitLookup.js',
      content: `// Resolves a parsed exhibit ID to its exhibit record.
// Pure function, no side effects on import beyond module-local data reference.
// shortcut: linear find() over the fixture array; switch to a Map built once
// at module load when the exhibit count exceeds ~20 or duplicate lookups
// become a measured cost.
import { exhibits } from '../data/exhibits.js'

export function getExhibitById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return { ok: false, reason: 'unknown-exhibit' }
  }
  const exhibit = exhibits.find((entry) => entry.id === id)
  if (!exhibit) {
    return { ok: false, reason: 'unknown-exhibit' }
  }
  return { ok: true, exhibit }
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-exhibit-lookup.mjs self-check',
      path: 'scripts/check-exhibit-lookup.mjs',
      content: `// Small self-check for getExhibitById and the parse -> lookup pipeline.
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
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll exhibit lookup self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:exhibit script',
      path: 'package.json',
      value: {
        scripts: {
          'check:exhibit': 'node scripts/check-exhibit-lookup.mjs',
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
      label: 'exhibit lookup self-check',
      command: 'npm run check:exhibit',
    },
    {
      type: 'commit',
      label: 'commit exhibit lookup',
      message: 'feat(exhibit): add exhibit lookup helper',
      paths: [
        'src/lib/exhibitLookup.js',
        'scripts/check-exhibit-lookup.mjs',
        'package.json',
      ],
      as: 'lookup',
    },
    {
      type: 'write',
      label: 'record phase 3.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 3.2 — Exhibit lookup helper\n\n**Status:** Complete  \n**Goal:** Provide a pure, structured lookup from a parsed exhibit ID to its exhibit record, and prove the parse-to-lookup pipeline composes cleanly before the camera phase.  \n**Files changed:** src/lib/exhibitLookup.js (new), scripts/check-exhibit-lookup.mjs (new), package.json (adds check:exhibit script).  \n**User-visible result:** None yet — no screen consumes getExhibitById until Phase 7.  \n**Automated checks:** npm run lint; npm run check:exhibit (20 self-check assertions including 5 pipeline integration cases).  \n**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers the branchy lookup and the composed pipeline.  \n**Manual checks:** None applicable.  \n**Not checked:** npm run build (deferred per user request). Real exhibit content — fixtures remain provisional.  \n**Remaining risks:** getExhibitById is case-sensitive by design (the parser always uppercases), so a caller that bypasses parseQrPayload and passes raw scanned text directly could produce spurious unknown-exhibit results. Enforce parse-then-lookup at the scanner layer in Phase 7. Fixture exhibits remain provisional pending expo team content.  \n**Decisions made:** Return shape { ok: true, exhibit } / { ok: false, reason: 'unknown-exhibit' } matches the parser's ok/reason pattern so callers pattern-match once. Failure reason reuses the master-plan canonical label unknown-exhibit rather than a new label such as not-found, so error messaging can be driven off the reason string. find() chosen over a Map built at module load for the 2-item MVP (documented as a shortcut to revisit when exhibit count grows). No localized content helper added at this layer — content[language] || content.en is trivial and will live in the screen that consumes it.  \n**Next part:** Phase 3.3 — content validator (duplicate IDs, required EN/ID/ZH fields, optional section integrity) and a validate:content npm script.  \n**Commit:** {{hash.lookup}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 3.2 progress',
      message: 'docs(progress): record phase 3.2 exhibit lookup',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}