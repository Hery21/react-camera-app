const MAX_QR_PAYLOAD_LENGTH = 64
const PSBIKT_PATTERN = /^PSBIKT-\d{3}$/i

export function parseQrPayload(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return { ok: false, reason: 'empty' }
  }

  const normalized = value.trim()
  if (normalized.length > MAX_QR_PAYLOAD_LENGTH || !PSBIKT_PATTERN.test(normalized)) {
    return { ok: false, reason: 'unsupported-format' }
  }

  return { ok: true, exhibitId: normalized.toUpperCase() }
}
