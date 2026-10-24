const STORAGE_KEY = 'storytelling-mirror.scanned-exhibit-ids.v1'

function getStorage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function loadScannedExhibitIds(validIds) {
  const valid = new Set(validIds)
  const storage = getStorage()
  if (!storage) return []

  try {
    const stored = JSON.parse(storage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return [...new Set(stored.filter((id) => typeof id === 'string' && valid.has(id)))]
  } catch {
    return []
  }
}

export function saveScannedExhibitIds(ids) {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]))
  } catch {
    // Progress is non-essential. The visitor flow must keep working when storage is unavailable.
  }
}

export function addScannedExhibitId(ids, exhibitId) {
  if (!exhibitId || ids.includes(exhibitId)) return ids
  return [...ids, exhibitId]
}
