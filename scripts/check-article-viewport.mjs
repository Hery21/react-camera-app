import { readFileSync } from 'node:fs'

const screen = readFileSync('src/screens/ExhibitScreen.jsx', 'utf8')
const styles = readFileSync('src/styles/exhibit-viewport.css', 'utf8')
const appStyles = readFileSync('src/App.css', 'utf8')

const checks = [
  ['redundant exhibit eyebrow removed', !screen.includes('exhibit-eyebrow')],
  ['screen reserves navigation row', styles.includes('grid-template-rows: auto auto minmax(0, 1fr) auto')],
  ['reader is the flexible row', styles.includes('.exhibit-reader') && styles.includes('minmax(0, 1fr)')],
  ['navigation has reserved minimum height', styles.includes('.exhibit-navigation') && styles.includes('min-height: 4rem')],
  ['article viewport clips overflow', styles.includes('.exhibit-page-viewport') && styles.includes('overflow: hidden')],
  ['viewport overrides are imported last', appStyles.includes("@import './styles/exhibit-viewport.css';")],
]

let failed = false
for (const [label, ok] of checks) {
  console.log((ok ? 'OK  ' : 'FAIL') + label)
  if (!ok) failed = true
}

if (failed) process.exit(1)
console.log('All article viewport-reservation checks passed')
