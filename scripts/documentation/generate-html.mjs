// Generates a single self-contained HTML document from captured
// screenshots. All screenshots are base64-embedded (JPEG) so the HTML file
// has no external dependencies — opens anywhere and prints cleanly.
//
// Layout per screen (A4 portrait):
//   Title
//   3 phone-sized screenshots in a row (English / Bahasa Indonesia / 中文)
//   Description of the page below the screenshots
//   Metadata line (screen id, viewport dimensions)
//
// Also attempts to auto-generate a PDF via Playwright headless Chromium.
// If PDF fails, the HTML remains for manual Ctrl+P.
//
// Usage:
//   node scripts/documentation/generate-html.mjs

import { chromium } from 'playwright'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { screensContent } from '../../documentation/screens-content.mjs'

const SCREENSHOTS_DIR = 'documentation/screenshots'
const HTML_PATH = 'documentation/index.html'
const PDF_PATH = 'documentation/storytelling-mirror.pdf'
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'zh', label: '中文' },
]
const VIEWPORT_LABEL = '390 × 844 (iPhone 14)'

function imgDataUri(screenId, langCode) {
  const path = SCREENSHOTS_DIR + '/' + screenId + '-' + langCode + '.jpg'
  if (!existsSync(path)) return null
  try {
    const buf = readFileSync(path)
    return 'data:image/jpeg;base64,' + buf.toString('base64')
  } catch {
    return null
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildScreenSection(screen) {
  const figures = LANGUAGES.map((lang) => {
    const uri = imgDataUri(screen.id, lang.code)
    const inner = uri
      ? '<img src="' + uri + '" alt="' + escapeHtml(screen.title + ' in ' + lang.label) + '">'
      : '<div class="missing">Screenshot not captured</div>'
    return '<figure>' + inner + '<figcaption>' + escapeHtml(lang.label) + '</figcaption></figure>'
  }).join('')

  return (
    '<section id="screen-' + screen.id + '" class="screen-section">' +
    '<h2>' + escapeHtml(screen.title) + '</h2>' +
    '<div class="lang-grid">' + figures + '</div>' +
    '<div class="description-block">' +
    '<p class="description-label">About this screen</p>' +
    '<p class="description">' + escapeHtml(screen.description) + '</p>' +
    '<p class="metadata">Screen ID: <code>' + escapeHtml(screen.id) + '</code> · Viewport: ' + VIEWPORT_LABEL + '</p>' +
    '</div>' +
    '</section>'
  )
}

const sectionsByGroup = {}
for (const screen of screensContent) {
  const group = screen.section || 'Other'
  if (!sectionsByGroup[group]) sectionsByGroup[group] = []
  sectionsByGroup[group].push(screen)
}

const tocHtml = Object.keys(sectionsByGroup)
  .map((group) => {
    const items = sectionsByGroup[group]
      .map((s) => '<li><a href="#screen-' + s.id + '">' + escapeHtml(s.title) + '</a></li>')
      .join('')
    return '<li class="toc-group"><strong>' + escapeHtml(group) + '</strong><ol>' + items + '</ol></li>'
  })
  .join('')

const screensHtml = screensContent.map(buildScreenSection).join('')
const generatedAt = new Date().toISOString().slice(0, 10)

const html =
  '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
  '<meta charset="UTF-8">' +
  '<title>The Storytelling Mirror — Screen Documentation</title>' +
  '<style>' +
  /* A4 PORTRAIT. 210x297mm with 12mm margins gives 186x273mm usable.
     3 screenshot columns at ~56mm each fit width; phone aspect (390:844)
     means each is ~121mm tall. Description below gets the remaining room. */
  '@page { size: A4 portrait; margin: 12mm; }' +
  'html, body { margin: 0; padding: 0; }' +
  'body { font-family: Georgia, "Times New Roman", serif; color: #2a211d; background: #fffaf0; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
  /* Cover */
  '.cover { min-height: 260mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; page-break-after: always; }' +
  '.cover h1 { font-size: 40pt; margin: 0 0 8mm; color: #861818; line-height: 1.1; }' +
  '.cover .subtitle { font-size: 18pt; color: #4a2e26; margin: 0 0 12mm; }' +
  '.cover .meta { font-size: 11pt; color: #666; }' +
  /* TOC */
  '.toc-page { page-break-after: always; }' +
  '.toc-page h2 { font-size: 22pt; color: #861818; border-bottom: 2px solid #d4af37; padding-bottom: 4mm; margin: 0 0 8mm; }' +
  '.toc-page ol { list-style: none; padding: 0; margin: 0; }' +
  '.toc-page .toc-group { margin-bottom: 6mm; }' +
  '.toc-page .toc-group strong { display: block; font-size: 13pt; color: #b32222; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3mm; }' +
  '.toc-page .toc-group ol { padding-left: 8mm; list-style: decimal; }' +
  '.toc-page .toc-group li { font-size: 12pt; margin: 2mm 0; color: #2a211d; }' +
  '.toc-page a { color: inherit; text-decoration: none; }' +
  /* Screen section — phone-sized screenshots + description below */
  '.screen-section { page-break-after: always; display: flex; flex-direction: column; gap: 6mm; }' +
  '.screen-section h2 { font-size: 18pt; color: #861818; margin: 0; line-height: 1.15; }' +
  '.lang-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; }' +
  '.lang-grid figure { margin: 0; display: flex; flex-direction: column; gap: 2mm; }' +
  '.lang-grid img { display: block; width: 100%; height: auto; border: 1px solid #d4af37; border-radius: 3mm; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }' +
  '.lang-grid figcaption { font-size: 10pt; text-align: center; color: #4a2e26; font-weight: 600; letter-spacing: 0.03em; }' +
  '.missing { display: flex; align-items: center; justify-content: center; aspect-ratio: 390 / 844; border: 1px dashed #999; color: #999; font-size: 10pt; background: #f7ead9; border-radius: 3mm; }' +
  /* Description block below the screenshots */
  '.description-block { background: #f7ead9; border-left: 4px solid #d4af37; border-radius: 3mm; padding: 5mm 6mm; }' +
  '.description-label { margin: 0 0 2mm; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.1em; color: #b32222; font-weight: 700; }' +
  '.description { margin: 0 0 3mm; font-size: 11pt; line-height: 1.6; color: #2a211d; }' +
  '.metadata { margin: 0; font-size: 9pt; color: #666; }' +
  '.metadata code { background: #fff; padding: 1mm 2mm; border-radius: 1mm; font-size: 9pt; color: #4a2e26; }' +
  /* Print adjustments */
  '@media print { body { background: #fff; } .cover, .toc-page, .screen-section { margin: 0; } }' +
  /* Small screen viewing (when HTML opened on a phone) */
  '@media screen and (max-width: 800px) { .lang-grid { grid-template-columns: 1fr; } .cover h1 { font-size: 24pt; } }' +
  '</style>' +
  '</head>' +
  '<body>' +
  /* Cover */
  '<section class="cover">' +
  '<h1>The Storytelling Mirror</h1>' +
  '<p class="subtitle">Pekan Seni Budaya 2026</p>' +
  '<p class="subtitle">Screen Documentation</p>' +
  '<p class="meta">Generated ' + generatedAt + ' · ' + screensContent.length + ' screens × ' + LANGUAGES.length + ' languages</p>' +
  '</section>' +
  /* TOC */
  '<section class="toc-page">' +
  '<h2>Table of Contents</h2>' +
  '<ol>' + tocHtml + '</ol>' +
  '</section>' +
  /* Screens */
  screensHtml +
  '</body>' +
  '</html>'

writeFileSync(HTML_PATH, html)
const sizeKb = Math.round(Buffer.byteLength(html, 'utf8') / 1024)
console.log('HTML written: ' + HTML_PATH + ' (' + sizeKb + ' KB)')

try {
  const browser = await chromium.launch()
  const pdfPage = await browser.newPage()
  await pdfPage.goto(pathToFileURL(resolve(HTML_PATH)).href, { waitUntil: 'networkidle' })
  await pdfPage.pdf({
    path: PDF_PATH,
    format: 'A4',
    landscape: false,
    printBackground: true,
    margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
  })
  await browser.close()
  console.log('PDF written: ' + PDF_PATH)
} catch (err) {
  console.warn('Auto-PDF failed: ' + err.message)
  console.warn('Open ' + HTML_PATH + ' in a browser and press Ctrl+P → Save as PDF (portrait).')
}
