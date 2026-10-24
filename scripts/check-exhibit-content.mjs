import { exhibits } from '../src/data/exhibits.js'
import { getExhibitContent } from '../src/lib/getExhibitContent.js'

function expect(actual, expected, label) {
  if (actual !== expected) {
    console.error('FAIL ' + label + ' — expected ' + expected + ', got ' + actual)
    process.exitCode = 1
    return
  }
  console.log('OK  ' + label)
}

const first = exhibits.find((exhibit) => exhibit.id === 'PSBIKT-001')
const catur = exhibits.find((exhibit) => exhibit.id === 'PSBIKT-006')

expect(getExhibitContent(first, 'id')?.title, 'Lukisan 8 Kuda', 'Indonesian uses Indonesian content')
expect(getExhibitContent(first, 'en')?.title, 'Lukisan 8 Kuda', 'English temporarily falls back to Indonesian')
expect(getExhibitContent(first, 'zh')?.title, 'Lukisan 8 Kuda', 'Chinese temporarily falls back to Indonesian')
expect(getExhibitContent(catur, 'en')?.title, 'Catur Cina', 'Catur Cina fallback works')
expect(getExhibitContent({ content: { en: { title: 'English only' } } }, 'zh')?.title, 'English only', 'English remains secondary fallback')
expect(getExhibitContent({ content: {} }, 'en'), null, 'empty content returns null')
expect(getExhibitContent(null, 'en'), null, 'missing exhibit returns null')

if (process.exitCode) {
  console.error('Exhibit content fallback self-check failed')
} else {
  console.log('All exhibit content fallback self-checks passed')
}
