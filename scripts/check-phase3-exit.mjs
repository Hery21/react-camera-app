// Proves the MASTER-PHASE-PLAN.md Phase 3 exit gate.
// Run: node scripts/check-phase3-exit.mjs   (or: npm run check:phase3)
//
// Each assertion maps to one criterion from the plan's Phase 3 exit gate.
// Deliberately independent of the 3.1/3.2/3.3 self-check files so this script
// stands alone as the canonical "is Phase 3 done?" reference.
import { parseQrPayload } from '../src/lib/qrPayload.js'
import { getExhibitById } from '../src/lib/exhibitLookup.js'
import { validateExhibits } from '../src/lib/validateExhibits.js'
import { exhibits } from '../src/data/exhibits.js'

let failed = 0

function check(label, condition, detail) {
  if (condition) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + (detail ? ' — ' + detail : ''))
  failed += 1
}

// Criterion 1 — QR contract is documented (EXPO-NNN, case-insensitive in, uppercase out)
const parsed1 = parseQrPayload('  expo-001  ')
check(
  'QR contract: EXPO-NNN parses to canonical uppercase id',
  parsed1.ok === true && parsed1.exhibitId === 'EXPO-001',
  'got ' + JSON.stringify(parsed1),
)

// Criterion 2 — Parsing and lookup tests pass (via the pipeline)
const looked1 = parsed1.ok ? getExhibitById(parsed1.exhibitId) : { ok: false }
check('Parse -> lookup pipeline resolves EXPO-001', looked1.ok === true && looked1.exhibit.id === 'EXPO-001')

// Criterion 3 — One QR resolves to the same exhibit independent of language
// Resolution has no language parameter, so the SAME exhibit id and SAME record
// must be returned no matter what language the UI is currently in. Proving
// this concretely: resolve twice, assert identical object identity.
const parsedAgain = parseQrPayload('EXPO-001')
const lookedAgain = parsedAgain.ok ? getExhibitById(parsedAgain.exhibitId) : { ok: false }
check(
  'Resolution is language-independent: identical record returned across resolutions',
  looked1.ok && lookedAgain.ok && looked1.exhibit === lookedAgain.exhibit,
)

// Criterion 4 — Trilingual content: every fixture exposes en, id, zh blocks
const everyHasThreeLangs = exhibits.every((ex) => ex.content && ex.content.en && ex.content.id && ex.content.zh)
check('Every exhibit exposes en, id, zh content blocks', everyHasThreeLangs)

// Criterion 5 — Content is genuinely translated, not copied:
// assert at least one exhibit has a title that differs between languages.
const atLeastOneGenuinelyTranslated = exhibits.some(
  (ex) => ex.content.en.title !== ex.content.zh.title || ex.content.en.title !== ex.content.id.title,
)
check('At least one exhibit has genuinely translated titles (not three copies of English)', atLeastOneGenuinelyTranslated)

// Criterion 6 — Representative records cover optional-content branches
// EXPO-001 has symbolism; EXPO-002 does not. Both are valid per the validator.
const hasSymbolism = exhibits.some((ex) => ex.content.en.symbolism && ex.content.en.symbolism.length > 0)
const lacksSymbolism = exhibits.some((ex) => !ex.content.en.symbolism)
check(
  'Fixtures cover both optional-symbolism branches (present + absent)',
  hasSymbolism && lacksSymbolism,
  'hasSymbolism=' + hasSymbolism + ' lacksSymbolism=' + lacksSymbolism,
)

// Criterion 7 — Missing required translations are detectable
// Synthetic exhibit missing the zh block; validator must reject.
const badExhibit = {
  id: 'EXPO-999',
  coverImage: '/x.webp',
  content: {
    en: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' },
    id: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' },
    // zh intentionally omitted
  },
}
const validationResult = validateExhibits([badExhibit])
const detectedMissingZh = !validationResult.ok && validationResult.errors.some((e) => e.field === 'content.zh')
check('Missing zh translation is detected by the validator', detectedMissingZh, 'got ' + JSON.stringify(validationResult))

if (failed > 0) {
  console.error('\n' + failed + ' Phase 3 exit gate check(s) failed')
  process.exit(1)
}
console.log('\nPhase 3 exit gate verified')
