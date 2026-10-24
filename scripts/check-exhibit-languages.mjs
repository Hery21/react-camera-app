import { exhibits } from '../src/data/exhibits.js'

const requiredLanguages = ['en', 'id', 'zh']
let failed = false

for (const exhibit of exhibits) {
  for (const language of requiredLanguages) {
    const content = exhibit.content[language]
    const ok = Boolean(content?.title && content?.summary && content?.story)
    console.log((ok ? 'OK  ' : 'FAIL') + exhibit.id + ' ' + language)
    if (!ok) failed = true
  }
}

if (failed) {
  console.error('Exhibit language completeness check failed')
  process.exit(1)
}

console.log('All eight PSBIKT exhibits contain EN, ID, and ZH title, summary, and story content')
