// Parses QR payloads in two forms:
//   1. Plain text: PSBIKT-NNN (case-insensitive)
//   2. URL with ?exhibit=PSBIKT-NNN query param (any host)
//
// Host is deliberately not whitelisted. The app never navigates to the scanned
// URL — it only extracts the exhibit ID and validates against local data via
// getExhibitById (which returns unknown-exhibit for non-existent IDs). So a QR
// pointing at any host with a valid ?exhibit= param shows the same exhibit the
// in-app scanner would show for plain text PSBIKT-NNN.

const MAX_INPUT_LENGTH = 256
const PSBIKT_PATTERN = /^PSBIKT-\d{3}$/i

function extractFromUrl(text) {
  let url
  try {
    url = new URL(text)
  } catch {
    return null
  }
  const param = url.searchParams.get('exhibit')
  if (!param) return null
  const trimmed = param.trim()
  if (!PSBIKT_PATTERN.test(trimmed)) return null
  return trimmed.toUpperCase()
}

export function parseQrPayload(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return { ok: false, reason: 'empty' }
  }
  const normalized = value.trim()
  if (normalized.length > MAX_INPUT_LENGTH) {
    return { ok: false, reason: 'unsupported-format' }
  }
  if (PSBIKT_PATTERN.test(normalized)) {
    return { ok: true, exhibitId: normalized.toUpperCase() }
  }
  const fromUrl = extractFromUrl(normalized)
  if (fromUrl) {
    return { ok: true, exhibitId: fromUrl }
  }
  return { ok: false, reason: 'unsupported-format' }
}
