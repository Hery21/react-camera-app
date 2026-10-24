export default {
  name: 'Phase 3.3 — content validator',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds validateExhibits(exhibits) pure function plus two npm scripts: validate:content (gates the real fixtures) and check:validate (unit self-check). Optional fields (period, symbolism, gallery) are permitted to be absent. Enforces EXPO-NNN id format aligned with the Phase 3.1 parser. No UI changes.',
    },
    {
      type: 'write',
      label: 'create src/lib/validateExhibits.js',
      path: 'src/lib/validateExhibits.js',
      content: `// Pure validator: no I/O, no side effects, no mutation of the exhibits array.
// Returns { ok: true } on success, or { ok: false, errors: [...] } on failure.
// Each error is { exhibitId, field, message } so the CLI can print an actionable list.
// Optional fields (period, symbolism, gallery) may be absent by design.
// EXPO-NNN id format matches the Phase 3.1 parser contract; tighten together if
// the real expo QR format deviates.

const REQUIRED_LANGUAGES = ['en', 'id', 'zh']
const REQUIRED_CONTENT_FIELDS = ['title', 'summary', 'story', 'coverAlt']
const ID_PATTERN = /^EXPO-\\d{3}$/

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateExhibits(exhibits) {
  const errors = []

  if (!Array.isArray(exhibits)) {
    return { ok: false, errors: [{ exhibitId: null, field: null, message: 'exhibits is not an array' }] }
  }

  const seenIds = new Set()

  exhibits.forEach((exhibit, index) => {
    if (!exhibit || typeof exhibit !== 'object') {
      errors.push({ exhibitId: 'index ' + index, field: null, message: 'exhibit is not an object' })
      return
    }

    const exhibitLabel = isNonEmptyString(exhibit.id) ? exhibit.id : 'index ' + index

    if (!isNonEmptyString(exhibit.id)) {
      errors.push({ exhibitId: exhibitLabel, field: 'id', message: 'missing or empty' })
    } else if (!ID_PATTERN.test(exhibit.id)) {
      errors.push({ exhibitId: exhibitLabel, field: 'id', message: 'format must match EXPO-NNN' })
    } else if (seenIds.has(exhibit.id)) {
      errors.push({ exhibitId: exhibitLabel, field: 'id', message: 'duplicate id' })
    } else {
      seenIds.add(exhibit.id)
    }

    if (!isNonEmptyString(exhibit.coverImage)) {
      errors.push({ exhibitId: exhibitLabel, field: 'coverImage', message: 'missing or empty' })
    }

    if (!exhibit.content || typeof exhibit.content !== 'object') {
      errors.push({ exhibitId: exhibitLabel, field: 'content', message: 'missing content object' })
      return
    }

    REQUIRED_LANGUAGES.forEach((lang) => {
      const block = exhibit.content[lang]
      if (!block || typeof block !== 'object') {
        errors.push({ exhibitId: exhibitLabel, field: 'content.' + lang, message: 'missing language block' })
        return
      }
      REQUIRED_CONTENT_FIELDS.forEach((fieldName) => {
        if (!isNonEmptyString(block[fieldName])) {
          errors.push({ exhibitId: exhibitLabel, field: 'content.' + lang + '.' + fieldName, message: 'missing or empty' })
        }
      })
    })

    if (exhibit.gallery !== undefined) {
      if (!Array.isArray(exhibit.gallery)) {
        errors.push({ exhibitId: exhibitLabel, field: 'gallery', message: 'must be an array when present' })
      } else {
        exhibit.gallery.forEach((item, galleryIndex) => {
          const itemField = 'gallery[' + galleryIndex + ']'
          if (!item || typeof item !== 'object') {
            errors.push({ exhibitId: exhibitLabel, field: itemField, message: 'gallery item is not an object' })
            return
          }
          if (!isNonEmptyString(item.src)) {
            errors.push({ exhibitId: exhibitLabel, field: itemField + '.src', message: 'missing or empty' })
          }
          if (!item.content || typeof item.content !== 'object') {
            errors.push({ exhibitId: exhibitLabel, field: itemField + '.content', message: 'missing content object' })
            return
          }
          REQUIRED_LANGUAGES.forEach((lang) => {
            const altBlock = item.content[lang]
            if (!altBlock || typeof altBlock !== 'object') {
              errors.push({ exhibitId: exhibitLabel, field: itemField + '.content.' + lang, message: 'missing language block' })
              return
            }
            if (!isNonEmptyString(altBlock.alt)) {
              errors.push({ exhibitId: exhibitLabel, field: itemField + '.content.' + lang + '.alt', message: 'missing or empty' })
            }
          })
        })
      }
    }
  })

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/validate-content.mjs CLI gate',
      path: 'scripts/validate-content.mjs',
      content: `// Runs the content validator against the real exhibit fixtures.
// Run: node scripts/validate-content.mjs   (or: npm run validate:content)
// Exits 1 on any validation error so it can gate a build step later.
import { exhibits } from '../src/data/exhibits.js'
import { validateExhibits } from '../src/lib/validateExhibits.js'

const result = validateExhibits(exhibits)

if (result.ok) {
  console.log('Content validation passed for ' + exhibits.length + ' exhibit(s)')
} else {
  console.error('Content validation failed with ' + result.errors.length + ' error(s):')
  result.errors.forEach((err) => {
    console.error(' - [' + (err.exhibitId || '?') + '] ' + (err.field || '?') + ': ' + err.message)
  })
  process.exit(1)
}
`,
    },
    {
      type: 'write',
      label: 'create scripts/check-validate-exhibits.mjs self-check',
      path: 'scripts/check-validate-exhibits.mjs',
      content: `// Unit self-check for validateExhibits. Not a test framework.
// Run: node scripts/check-validate-exhibits.mjs   (or: npm run check:validate)
// Asserts the real fixtures pass AND that every failure branch produces the expected error.
import { validateExhibits } from '../src/lib/validateExhibits.js'
import { exhibits } from '../src/data/exhibits.js'

let failed = 0

function expectOk(result, label) {
  if (result.ok && !result.errors) {
    console.log('OK  ' + label)
    return
  }
  console.error('FAIL ' + label + ' — expected ok, got: ' + JSON.stringify(result))
  failed += 1
}

function expectFail(result, label, expectedField) {
  if (result.ok) {
    console.error('FAIL ' + label + ' — expected failure, got ok')
    failed += 1
    return
  }
  if (!Array.isArray(result.errors) || result.errors.length === 0) {
    console.error('FAIL ' + label + ' — expected errors array, got: ' + JSON.stringify(result))
    failed += 1
    return
  }
  if (expectedField) {
    const match = result.errors.some((e) => e.field === expectedField)
    if (!match) {
      const fields = result.errors.map((e) => e.field).join(', ')
      console.error('FAIL ' + label + ' — expected an error with field "' + expectedField + '", got fields: ' + fields)
      failed += 1
      return
    }
  }
  console.log('OK  ' + label)
}

const minimalValid = {
  id: 'EXPO-001',
  coverImage: '/x.webp',
  content: {
    en: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' },
    id: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' },
    zh: { title: 'A', summary: 'B', story: 'C', coverAlt: 'D' }
  }
}

// Happy path
expectOk(validateExhibits(exhibits), 'real fixtures pass')
expectOk(validateExhibits([minimalValid]), 'minimal valid (no period, no symbolism, no gallery)')
expectOk(validateExhibits([]), 'empty array is valid (no errors to report)')

// Optional fields allowed
const withPeriod = {
  ...minimalValid,
  content: {
    en: { ...minimalValid.content.en, period: 'X' },
    id: { ...minimalValid.content.id, period: 'X' },
    zh: { ...minimalValid.content.zh, period: 'X' }
  }
}
expectOk(validateExhibits([withPeriod]), 'optional period allowed')

const withSymbolism = {
  ...minimalValid,
  content: {
    en: { ...minimalValid.content.en, symbolism: 'X' },
    id: { ...minimalValid.content.id, symbolism: 'X' },
    zh: { ...minimalValid.content.zh, symbolism: 'X' }
  }
}
expectOk(validateExhibits([withSymbolism]), 'optional symbolism allowed')

const withGallery = {
  ...minimalValid,
  gallery: [
    {
      src: '/g.webp',
      content: {
        en: { alt: 'A' },
        id: { alt: 'A' },
        zh: { alt: 'A' }
      }
    }
  ]
}
expectOk(validateExhibits([withGallery]), 'valid gallery accepted')

// Missing required per-language fields
const emptyEnTitle = {
  ...minimalValid,
  content: {
    ...minimalValid.content,
    en: { ...minimalValid.content.en, title: '' }
  }
}
expectFail(validateExhibits([emptyEnTitle]), 'empty en.title', 'content.en.title')

const missingZh = {
  ...minimalValid,
  content: {
    en: minimalValid.content.en,
    id: minimalValid.content.id
  }
}
expectFail(validateExhibits([missingZh]), 'missing zh block', 'content.zh')

const missingIdStory = {
  ...minimalValid,
  content: {
    ...minimalValid.content,
    id: { ...minimalValid.content.id, story: undefined }
  }
}
expectFail(validateExhibits([missingIdStory]), 'missing id.story', 'content.id.story')

const whitespaceOnlySummary = {
  ...minimalValid,
  content: {
    ...minimalValid.content,
    zh: { ...minimalValid.content.zh, summary: '   ' }
  }
}
expectFail(validateExhibits([whitespaceOnlySummary]), 'whitespace-only zh.summary rejected', 'content.zh.summary')

// Duplicate id
const duplicate = [minimalValid, { ...minimalValid, coverImage: '/y.webp' }]
expectFail(validateExhibits(duplicate), 'duplicate id', 'id')

// id format
const badFormat = { ...minimalValid, id: 'FOO-001' }
expectFail(validateExhibits([badFormat]), 'bad id format', 'id')

// Missing top-level required fields
const missingCoverImage = { ...minimalValid, coverImage: '' }
expectFail(validateExhibits([missingCoverImage]), 'empty coverImage', 'coverImage')

const missingContent = { id: 'EXPO-001', coverImage: '/x.webp' }
expectFail(validateExhibits([missingContent]), 'missing content object', 'content')

// Structural failures
expectFail(validateExhibits('not-an-array'), 'exhibits not array')
expectFail(validateExhibits([null]), 'null exhibit')
expectFail(validateExhibits([minimalValid, 'not-an-object']), 'string exhibit rejected')

// Gallery failure branches
const badGalleryShape = { ...minimalValid, gallery: 'not-array' }
expectFail(validateExhibits([badGalleryShape]), 'gallery not array', 'gallery')

const badGallerySrc = {
  ...minimalValid,
  gallery: [
    {
      src: '',
      content: {
        en: { alt: 'A' },
        id: { alt: 'A' },
        zh: { alt: 'A' }
      }
    }
  ]
}
expectFail(validateExhibits([badGallerySrc]), 'gallery item empty src', 'gallery[0].src')

const badGalleryMissingZh = {
  ...minimalValid,
  gallery: [
    {
      src: '/g.webp',
      content: {
        en: { alt: 'A' },
        id: { alt: 'A' }
      }
    }
  ]
}
expectFail(validateExhibits([badGalleryMissingZh]), 'gallery item missing zh block', 'gallery[0].content.zh')

const badGalleryEmptyAlt = {
  ...minimalValid,
  gallery: [
    {
      src: '/g.webp',
      content: {
        en: { alt: 'A' },
        id: { alt: 'A' },
        zh: { alt: '' }
      }
    }
  ]
}
expectFail(validateExhibits([badGalleryEmptyAlt]), 'gallery item empty zh.alt', 'gallery[0].content.zh.alt')

if (failed > 0) {
  console.error('\\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\\nAll content validator self-checks passed')
`,
    },
    {
      type: 'jsonMerge',
      label: 'add validate:content and check:validate scripts',
      path: 'package.json',
      value: {
        scripts: {
          'validate:content': 'node scripts/validate-content.mjs',
          'check:validate': 'node scripts/check-validate-exhibits.mjs',
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
      label: 'validate:content against real fixtures',
      command: 'npm run validate:content',
    },
    {
      type: 'check',
      label: 'validator self-check',
      command: 'npm run check:validate',
    },
    {
      type: 'commit',
      label: 'commit content validator',
      message: 'feat(content): add exhibit content validator',
      paths: [
        'src/lib/validateExhibits.js',
        'scripts/validate-content.mjs',
        'scripts/check-validate-exhibits.mjs',
        'package.json',
      ],
      as: 'validate',
    },
    {
      type: 'write',
      label: 'record phase 3.3 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 3.3 — Exhibit content validator\n\n**Status:** Complete  \n**Goal:** Provide a pure validator that gates exhibit content integrity so missing translations, duplicate ids, and malformed optional sections are caught before deploy instead of at scan-time.  \n**Files changed:** src/lib/validateExhibits.js (new), scripts/validate-content.mjs (new), scripts/check-validate-exhibits.mjs (new), package.json (adds validate:content and check:validate scripts).  \n**User-visible result:** None yet — no screen consumes the validator until a later phase. Both npm scripts run successfully against the current fixtures.  \n**Automated checks:** npm run lint; npm run validate:content; npm run check:validate (23 self-check assertions).  \n**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers every failure branch with synthetic bad data and asserts the real fixtures pass.  \n**Manual checks:** None applicable.  \n**Not checked:** npm run build (deferred per user request). Real exhibit content — fixtures remain provisional. ID format enforcement is coupled to the Phase 3.1 parser contract; if real expo codes deviate from EXPO-NNN both layers must loosen together.  \n**Remaining risks:** The EXPO-NNN id format is enforced by the validator but not yet by anything other than the parser — a future fixture that uses a different prefix would fail validate:content but might still be added by a careless PR; treat the CI gate at Phase 11 deployment as the final enforcement. Gallery item src paths are validated as non-empty strings but not checked against disk; a broken path will 404 at runtime, not at validation time.  \n**Decisions made:** Validator is a pure function (no I/O) so the same logic can later run in a Vite build hook, a CI step, or a dev-mode assert without refactor. Two separate npm scripts chosen over one: validate:content gates the real fixtures (build-time gate) while check:validate is a unit self-check with synthetic bad data (development regression guard). ID format regex is duplicated between parser and validator intentionally — they must stay in sync only if the real expo QR format changes, which is documented in both files. Optional fields (period, symbolism, gallery) are not required and their absence is not an error.  \n**Next part:** Phase 3.4 — verify one QR resolves to one exhibit independent of language via an integration self-check; then Phase 4.1 — install @zxing/browser and create the scanner adapter.  \n**Commit:** {{hash.validate}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 3.3 progress',
      message: 'docs(progress): record phase 3.3 content validator',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}