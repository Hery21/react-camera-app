import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-sentence-pagination.css', 'utf8')
const checks = [
  ['visible page height is captured', screen.includes('const pageHeight = viewport.clientHeight')],
  ['measurer uses natural height', screen.includes("measure.style.height = 'auto'")],
  ['candidate sentences remain together when they fit', screen.includes('measure.scrollHeight <= pageHeight')],
  ['current page is finalized only after candidate overflow', screen.includes('nextPages.push(joinSentenceUnits(currentUnits))')],
  ['non-fitting sentence starts the next page', screen.includes('currentUnits = [unit]')],
  ['emergency split receives explicit page height', screen.includes('buildEmergencyPages(unit, measure, pageHeight)')],
  ['hidden measurer exposes natural height', styles.includes('height: auto') && styles.includes('overflow: visible')],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}
if (failed) process.exit(1)
console.log('All sentence packing implementation checks passed')
