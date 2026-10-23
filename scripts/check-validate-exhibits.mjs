// Unit self-check for validateExhibits. Not a test framework.
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
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll content validator self-checks passed')
