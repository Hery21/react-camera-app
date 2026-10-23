// Runs the content validator against the real exhibit fixtures.
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
