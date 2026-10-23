// Parses scanned QR payloads. Never navigates to arbitrary URLs.
// Contract: "EXPO-" followed by exactly 3 digits. Case-insensitive input, always returns uppercase ID.
export function parseQrPayload(raw) {
  if (typeof raw !== 'string') return { ok: false, reason: 'empty' }
  
  const text = raw.trim()
  if (!text) return { ok: false, reason: 'empty' }
  if (text.length > 200) return { ok: false, reason: 'unsupported-format' }

  const match = text.match(/^EXPO-\d{3}$/i)
  if (!match) return { ok: false, reason: 'unsupported-format' }

  return { ok: true, exhibitId: text.toUpperCase() }
}
