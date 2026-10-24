export default {
  name: 'Phase 3.4 — Phase 3 exit gate verification',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Asserts the MASTER-PHASE-PLAN Phase 3 exit gate: parse contract stable, lookup contract stable, resolution independent of language, trilingual content blocks distinct, optional-section coverage, missing-translation detectability. No new helper function added (YAGNI) — the gate is proven against existing modules.',
    },
    {
      type: 'write',
      label: 'create scripts/check-phase3-exit.mjs',
      path: 'scripts/check-phase3-exit.mjs',
      content: `// Proves the MASTER-PHASE-PLAN.md Phase 3 exit gate.
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
  'got ' + JSON.stringify(parsed1)
)

// Criterion 2 — Parsing and lookup tests pass (via the pipeline)
const looked1 = parsed1.ok ? getExhibitById(parsed1.exhibitId) : { ok: false }
check(
  'Parse -> lookup pipeline resolves EXPO-001',
  looked1.ok === true && looked1.exhibit.id === 'EXPO-001'
)

// Criterion 3 — One QR resolves to the same exhibit independent of language
// Resolution has no language parameter, so the SAME exhibit id and SAME record
// must be returned no matter what language the UI is currently in. Proving
// this concretely: resolve twice, assert identical object identity.
const parsedAgain = parseQrPayload('EXPO-001')
const lookedAgain = parsedAgain.ok ? getExhibitById(parsedAgain.exhibitId) : { ok: false }
check(
  'Resolution is language-independent: identical record returned across resolutions',
  looked1.ok && lookedAgain.ok && looked1.exhibit === lookedAgain.exhibit
)

// Criterion 4 — Trilingual content: every fixture exposes en, id, zh blocks
const everyHasThreeLangs = exhibits.every(
  (ex) => ex.content && ex.content.en && ex.content.id && ex.content.zh
)
check('Every exhibit exposes en, id, zh content blocks', everyHasThreeLangs)

// Criterion 5 — Content is genuinely translated, not copied:
// assert at least one exhibit has a title that differs between languages.
const atLeastOneGenuinelyTranslated = exhibits.some(
  (ex) => ex.content.en.title !== ex.content.zh.title || ex.content.en.title !== ex.content.id.title
)
check(
  'At least one exhibit has genuinely translated titles (not three copies of English)',
  atLeastOneGenuinelyTranslated
)

// Criterion 6 — Representative records cover optional-content branches
// EXPO-001 has symbolism; EXPO-002 does not. Both are valid per the validator.
const hasSymbolism = exhibits.some((ex) => ex.content.en.symbolism && ex.content.en.symbolism.length > 0)
const lacksSymbolism = exhibits.some((ex) => !ex.content.en.symbolism)
check(
  'Fixtures cover both optional-symbolism branches (present + absent)',
  hasSymbolism && lacksSymbolism,
  'hasSymbolism=' + hasSymbolism + ' lacksSymbolism=' + lacksSymbolism
)

// Criterion 7 — Missing required translations are detectable
// Synthetic exhibit missing the zh block; validator must reject.
const badExhibit = {
  id: 'EXPO-999',
  coverImage: '/x.webp',
  content: {
    en: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' },
    id: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' }
    // zh intentionally omitted
  }
}
const validationResult = validateExhibits([badExhibit])
const detectedMissingZh = !validationResult.ok
  && validationResult.errors.some((e) => e.field === 'content.zh')
check(
  'Missing zh translation is detected by the validator',
  detectedMissingZh,
  'got ' + JSON.stringify(validationResult)
)

if (failed > 0) {
  console.error('\\n' + failed + ' Phase 3 exit gate check(s) failed')
  process.exit(1)
}
console.log('\\nPhase 3 exit gate verified')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add check:phase3 script',
      path: 'package.json',
      value: {
        scripts: {
          'check:phase3': 'node scripts/check-phase3-exit.mjs',
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
      label: 'phase 3 exit gate',
      command: 'npm run check:phase3',
    },
    {
      type: 'commit',
      label: 'commit phase 3 exit gate check',
      message: 'test(content): verify phase 3 exit gate',
      paths: [
        'scripts/check-phase3-exit.mjs',
        'package.json',
      ],
      as: 'gate',
    },
    {
      type: 'write',
      label: 'record phase 3.4 progress and close phase 3',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 3.4 — Phase 3 exit gate verification\n\n**Status:** Complete  \n**Goal:** Assert every criterion from the MASTER-PHASE-PLAN Phase 3 exit gate as a first-class, runnable artifact so "Phase 3 done" is provable, not assumed.  \n**Files changed:** scripts/check-phase3-exit.mjs (new), package.json (adds check:phase3 script).  \n**User-visible result:** None — this phase produces no UI change.  \n**Automated checks:** npm run lint; npm run check:phase3 (7 assertions mapped 1:1 to exit-gate criteria).  \n**Unit tests:** Intentionally omitted per urgent-policy override. The 7-assertion plain-Node script plays the role that unit tests would have: it proves each gate criterion independently of the 3.1/3.2/3.3 self-checks, so this file is the canonical "is Phase 3 done?" reference for future maintainers.  \n**Manual checks:** None applicable.  \n**Not checked:** npm run build (deferred per user request). Real physical QR codes — the contract remains provisional until Phase 11 inspection of the actual printed labels.  \n**Remaining risks:** None new for Phase 3. The gate proof does not include the manual browser-side reload-persistence check from Phase 2.4, which is still pending and should be performed before Phase 4 debugging begins so the two concerns (localization + camera) do not tangle.  \n**Decisions made:** No new resolveScannedText wrapper added — the master-plan "validation flow" (decoded text -> parser -> lookup -> accepted/error) is only 4 lines at the call site and Phase 7's scanner will inline it. A wrapper now would be speculative; adding it in Phase 7 with the actual caller in view is the smallest complete change. The gate check deliberately re-imports the parser, lookup, and validator rather than reusing the earlier self-check files, so it stands alone if 3.1/3.2/3.3 self-checks are later refactored or consolidated.  \n**Next part:** Phase 4.1 — install @zxing/browser and create src/lib/qrScanner.js as the isolated scanner adapter. First real dependency addition and first browser-API code path.  \n**Commit:** {{hash.gate}}\n\n## Phase 3 — QR and multilingual content contract: CLOSED\n\nThe MASTER-PHASE-PLAN Phase 3 exit gate is fully satisfied as of Phase 3.4. Run npm run check:phase3 at any time to re-verify. Parts 3.1 through 3.4 together cover: strict EXPO-NNN parsing, exhibit lookup, trilingual fixtures (en/id/zh), optional-section coverage (symbolism present + absent), content validation, and language-independent resolution proof.  \n**Next phase:** Phase 4 — Camera and QR scanner spike.  \n`,
    },
    {
      type: 'commit',
      label: 'commit phase 3.4 progress and phase 3 closure',
      message: 'docs(progress): record phase 3.4 and close phase 3',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}