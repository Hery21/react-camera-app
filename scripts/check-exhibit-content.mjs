import { exhibits } from '../src/data/exhibits.js'
import { getExhibitContent, resolveExhibitContent } from '../src/lib/getExhibitContent.js'

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
expect(resolveExhibitContent(first, 'id').sourceLanguage, 'id', 'Indonesian source is id')
expect(resolveExhibitContent(first, 'id').isFallback, false, 'Indonesian is not fallback')

expect(getExhibitContent(first, 'en')?.title, 'Painting of Eight Horses', 'English uses English translation')
expect(resolveExhibitContent(first, 'en').sourceLanguage, 'en', 'English source is en')
expect(resolveExhibitContent(first, 'en').isFallback, false, 'English is not fallback')

expect(getExhibitContent(first, 'zh')?.title, '八骏图', 'Chinese uses Chinese translation')
expect(resolveExhibitContent(first, 'zh').sourceLanguage, 'zh', 'Chinese source is zh')
expect(resolveExhibitContent(first, 'zh').isFallback, false, 'Chinese is not fallback')

expect(getExhibitContent(catur, 'en')?.title, 'Chinese Chess (Xiangqi)', 'Catur Cina English translation works')
expect(getExhibitContent(catur, 'zh')?.title, '中国象棋', 'Catur Cina Chinese translation works')

expect(
  resolveExhibitContent({ content: { id: { title: 'Indonesian only' } } }, 'en').sourceLanguage,
  'id',
  'Indonesian remains first fallback',
)
expect(
  resolveExhibitContent({ content: { en: { title: 'English only' } } }, 'zh').sourceLanguage,
  'en',
  'English remains secondary fallback',
)
expect(getExhibitContent({ content: {} }, 'en'), null, 'empty content returns null')
expect(getExhibitContent(null, 'en'), null, 'missing exhibit returns null')

if (process.exitCode) {
  console.error('Exhibit content self-check failed')
  process.exit(1)
}

console.log('All exhibit content self-checks passed')
