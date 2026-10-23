// Pure validator: no I/O, no side effects, no mutation of the exhibits array.
// Returns { ok: true } on success, or { ok: false, errors: [...] } on failure.
// Each error is { exhibitId, field, message } so the CLI can print an actionable list.
// Optional fields (period, symbolism, gallery) may be absent by design.
// EXPO-NNN id format matches the Phase 3.1 parser contract; tighten together if
// the real expo QR format deviates.

const REQUIRED_LANGUAGES = ['en', 'id', 'zh']
const REQUIRED_CONTENT_FIELDS = ['title', 'summary', 'story', 'coverAlt']
const ID_PATTERN = /^EXPO-\d{3}$/

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
