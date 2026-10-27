# Screen Documentation Pipeline

Generates a printable documentation of every screen in the app with all three language versions (English, Bahasa Indonesia, 中文).

Output is a single self-contained HTML file (screenshots base64-embedded) that opens anywhere and prints to PDF, plus an auto-generated PDF if Playwright can produce one.

## One-time setup

```powershell
npm install
npx playwright install chromium
```

The `npx playwright install chromium` command downloads the Chromium binary (~150 MB) to your local cache. Only needs to run once.

## Generating the documentation

### 1. Start the dev server (in one terminal)

```powershell
npm run dev
```

### 2. Capture screenshots (in a second terminal)

```powershell
npm run docs:capture
```

This uses Playwright headless Chromium with fake camera flags to capture 11 screens × 3 languages = **33 screenshots** into `documentation/screenshots/` as JPEG (quality 92, 2x device pixel ratio).

### 3. Generate HTML + PDF

```powershell
npm run docs:generate
```

Writes:

- `documentation/index.html` — single self-contained file (~10 MB with embedded screenshots), prints to **A4 portrait**
- `documentation/storytelling-mirror.pdf` — auto-generated PDF (if Playwright PDF succeeds)

### 4. Optional — one-shot

```powershell
npm run docs
```

Runs capture + generate in sequence. **Still requires `npm run dev` running in another terminal.**

## Reading the output

Open `documentation/index.html` in any browser. The document has:

- **Cover page** — title + generation date
- **Table of Contents** — grouped by section (Core Flow, Quiz, Admin), clickable
- **One page per screen** — title, three phone-sized screenshots side by side (EN, ID, ZH), then an "About this screen" description block below
- **Print-optimized** — A4 portrait, `page-break-after` on each screen section, so printing from any browser produces a clean paginated PDF

## Adding a new screen

Append an entry to `documentation/screens-content.mjs`:

```js
{
  id: 'my-screen',
  section: 'Core Flow',
  title: 'My Screen',
  description: 'What this screen does...',
  navigate: async (page, baseUrl) => {
    await page.goto(baseUrl + '/path')
    await page.waitForSelector('.my-screen')
  },
  waitMs: 800, // optional, default 800
}
```

Re-run `npm run docs:capture && npm run docs:generate`. The new screen appears in the TOC and gets a page in the document.

## Troubleshooting

### "Cannot reach http://localhost:5173"

The capture script needs the dev server running. Start `npm run dev` in a separate terminal and re-run the capture.

### Screenshots are blank or broken

- The **scanner** and **twibbon** screens need the Chromium fake camera flags. If they render as black, verify `--use-fake-device-for-media-stream` is in the launch args of `capture-screens.mjs`.
- The **admin screens** only work when the dev server is running (the dev trigger is behind `import.meta.env.DEV`).

### PDF generation fails

Auto-PDF uses Playwright headless Chromium. If it fails (rare), open `documentation/index.html` in your browser and use **Ctrl+P → Save as PDF** with portrait orientation and background graphics enabled.

## Files

```
documentation/
  README.md            ← this file
  screens-content.mjs  ← screen definitions (title, description, navigation)
  screenshots/         ← generated JPEGs (gitignored)
  index.html           ← generated HTML (gitignored)
  storytelling-mirror.pdf ← generated PDF (gitignored)

scripts/documentation/
  capture-screens.mjs  ← Playwright capture script
  generate-html.mjs    ← HTML + PDF generator
  check-docs.mjs       ← structural self-check
```
