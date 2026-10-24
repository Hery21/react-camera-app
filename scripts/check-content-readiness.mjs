import { existsSync } from 'node:fs'
import { exhibits } from '../src/data/exhibits.js'

const REQUIRED_IDS = Array.from({ length: 8 }, (_, index) => 'PSBIKT-' + String(index + 1).padStart(3, '0'))
const REQUIRED_LANGUAGES = ['en', 'id', 'zh']
let failed = false
let warnings = 0

function pass(message) {
  console.log('OK  ' + message)
}

function fail(message) {
  console.error('FAIL ' + message)
  failed = true
}

function warn(message) {
  console.warn('WARN ' + message)
  warnings += 1
}

const ids = exhibits.map((exhibit) => exhibit.id)
const uniqueIds = new Set(ids)

if (exhibits.length === REQUIRED_IDS.length) pass('inventory contains 8 exhibits')
else fail('inventory expected 8 exhibits, found ' + exhibits.length)

if (uniqueIds.size === ids.length) pass('all exhibit IDs are unique')
else fail('duplicate exhibit IDs found')

for (const expectedId of REQUIRED_IDS) {
  if (uniqueIds.has(expectedId)) pass(expectedId + ' exists')
  else fail(expectedId + ' is missing')
}

for (const exhibit of exhibits) {
  for (const language of REQUIRED_LANGUAGES) {
    const content = exhibit.content?.[language]
    if (!content?.title?.trim()) fail(exhibit.id + ' ' + language + ' title missing')
    if (!content?.summary?.trim()) fail(exhibit.id + ' ' + language + ' summary missing')
    if (!content?.story?.trim()) fail(exhibit.id + ' ' + language + ' story missing')
  }

  if (exhibit.coverImage) {
    if (!exhibit.coverImage.startsWith('/images/exhibits/')) {
      fail(exhibit.id + ' coverImage must use /images/exhibits/...')
    } else {
      const diskPath = 'public' + exhibit.coverImage
      if (existsSync(diskPath)) pass(exhibit.id + ' cover image exists')
      else fail(exhibit.id + ' cover image path does not exist: ' + diskPath)
    }

    for (const language of REQUIRED_LANGUAGES) {
      if (!exhibit.content?.[language]?.coverAlt?.trim()) {
        warn(exhibit.id + ' ' + language + ' cover alt text missing')
      }
    }
  } else {
    warn(exhibit.id + ' has no cover image yet')
  }

  if (exhibit.gallery?.length) {
    for (const [index, image] of exhibit.gallery.entries()) {
      if (!image.src?.startsWith('/images/exhibits/')) fail(exhibit.id + ' gallery item ' + (index + 1) + ' has invalid src')
      for (const language of REQUIRED_LANGUAGES) {
        const localized = image.content?.[language]
        if (!localized?.alt?.trim()) warn(exhibit.id + ' gallery item ' + (index + 1) + ' ' + language + ' alt text missing')
      }
    }
  }
}

console.log('Content readiness warnings: ' + warnings)

if (failed) {
  console.error('PSBIKT content release-readiness check failed')
  process.exit(1)
}

console.log('PSBIKT content release-readiness blocking checks passed')
