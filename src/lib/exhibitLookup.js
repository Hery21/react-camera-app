// Resolves a parsed exhibit ID to its exhibit record.
// Pure function, no side effects on import beyond module-local data reference.
// shortcut: linear find() over the fixture array; switch to a Map built once
// at module load when the exhibit count exceeds ~20 or duplicate lookups
// become a measured cost.
import { exhibits } from '../data/exhibits.js'

export function getExhibitById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return { ok: false, reason: 'unknown-exhibit' }
  }
  const exhibit = exhibits.find((entry) => entry.id === id)
  if (!exhibit) {
    return { ok: false, reason: 'unknown-exhibit' }
  }
  return { ok: true, exhibit }
}
