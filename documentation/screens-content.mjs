// Screen definitions for the documentation pipeline.
// Each entry drives capture-screens.mjs (how to navigate to the screen)
// and generate-html.mjs (title + description displayed above the screenshots).
//
// Adding a new screen: append an entry, re-run "npm run docs".

export const screensContent = [
  {
    id: 'welcome',
    section: 'Core Flow',
    title: 'Welcome Screen',
    description:
      'The first screen visitors see when opening the web app. Shows the ornate hand mirror hero, the event eyebrow ("Ikatan Keluarga Tionghoa"), the title ("Pekan Seni Budaya 2026"), the tagline, and a prominent "Start Exploring" CTA. The language toggle is visible at the top of the screen on every language. Camera permission is not requested on this screen.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-screen', { timeout: 10000 })
    },
  },
  {
    id: 'menu',
    section: 'Core Flow',
    title: 'Menu Screen',
    description:
      'The hub of the experience. Three active cards — Tour (opens the QR scanner), Quiz (opens the trilingual "Kuis Day 1"), and Take a Photo (opens the twibbon camera). Decorated with floral corners, a crown banner, and a gold divider. Language toggle in the header, fullscreen and GitHub utility buttons at the bottom.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-cta', { timeout: 10000 })
      await page.click('.welcome-cta')
      await page.waitForSelector('.menu-screen', { timeout: 10000 })
    },
  },
  {
    id: 'scanner',
    section: 'Core Flow',
    title: 'QR Scanner',
    description:
      'Live rear-camera feed with ornate gold corner brackets framing the QR target and a camera-flip toggle in the top-right corner. Instructions appear below the frame. The scanner auto-starts on mount, so the camera state is running when this screen is shown. Stop and Back controls sit in the bottom panel.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-cta', { timeout: 10000 })
      await page.click('.welcome-cta')
      await page.waitForSelector('.menu-screen', { timeout: 10000 })
      await page.locator('.menu-card-active').nth(0).click()
      await page.waitForSelector('.scanner-screen', { timeout: 10000 })
    },
    waitMs: 2500,
  },
  {
    id: 'scan-result',
    section: 'Core Flow',
    title: 'Scan Result',
    description:
      'Confirmation screen after a successful scan. Shows the exhibit cover image inside a warm gold halo, the localized title and period, the summary, and two actions: View Details and Scan Again. Can also be reached via deep link — when a visitor scans a physical QR with their phone camera, the app opens directly to this screen for that exhibit.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/?exhibit=PSBIKT-006', { timeout: 15000 })
      await page.waitForSelector('.scan-result-screen', { timeout: 10000 })
    },
  },
  {
    id: 'exhibit',
    section: 'Core Flow',
    title: 'Exhibit Article',
    description:
      'Article reader for the scanned exhibit. The cover image appears on page 1 only, below the Story heading. Paginated story text with justified typography, large ornate prev/next arrows, and text-size controls (A- / A+) in the top-right. The Story tab is currently the only tab — no exhibit in the data has Symbolism or Gallery content yet.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/?exhibit=PSBIKT-006', { timeout: 15000 })
      await page.waitForSelector('.scan-result-screen', { timeout: 10000 })
      await page.locator('.scan-result-primary').click()
      await page.waitForSelector('.exhibit-screen', { timeout: 10000 })
    },
  },
  {
    id: 'twibbon',
    section: 'Core Flow',
    title: 'Twibbon Photo',
    description:
      'Front/back camera for taking a keepsake photo inside an ornate frame. Two twibbon frames are available in the picker below the camera; the selected one shows a vermilion border. A camera-flip toggle sits in the top-right. After taking a photo the actions become Share, Save, and Retake, plus a reminder to tag IKT @iktriaukompleks on Instagram.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-cta', { timeout: 10000 })
      await page.click('.welcome-cta')
      await page.waitForSelector('.menu-screen', { timeout: 10000 })
      await page.locator('.menu-card-active').nth(2).click()
      await page.waitForSelector('.twibbon-screen', { timeout: 10000 })
    },
    waitMs: 2500,
  },
  {
    id: 'quiz-identity',
    section: 'Quiz',
    title: 'Kuis Day 1 — Identity Form',
    description:
      'First step of the trilingual "Kuis Day 1". Collects Nama Asli, WD/SAP/Magang/Sekolah, and Username IG before allowing the visitor to start. Empty fields block the Start Quiz button with an inline error. Identity data is stored locally and included in the submission payload to Google Sheets.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-cta', { timeout: 10000 })
      await page.click('.welcome-cta')
      await page.waitForSelector('.menu-screen', { timeout: 10000 })
      await page.locator('.menu-card-active').nth(1).click()
      await page.waitForSelector('.quiz-screen-identity', { timeout: 10000 })
    },
  },
  {
    id: 'quiz-question',
    section: 'Quiz',
    title: 'Kuis Day 1 — Question Screen',
    description:
      'One question at a time with 4 multiple-choice options (A / B / C / D). Progress label shows the current position. Prev/Next buttons navigate between questions; Submit only appears on the final question and stays disabled until all questions are answered. Question 4 displays the San Tai Zi image above the question text.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.welcome-cta', { timeout: 10000 })
      await page.click('.welcome-cta')
      await page.waitForSelector('.menu-screen', { timeout: 10000 })
      await page.locator('.menu-card-active').nth(1).click()
      await page.waitForSelector('.quiz-screen-identity', { timeout: 10000 })
      const inputs = page.locator('.quiz-identity-field input')
      await inputs.nth(0).fill('Test User')
      await inputs.nth(1).fill('WD')
      await inputs.nth(2).fill('@test')
      await page.locator('button[type="submit"]').click()
      await page.waitForSelector('.quiz-question-text', { timeout: 10000 })
    },
  },
  {
    id: 'admin-dashboard',
    section: 'Admin (dev only)',
    title: 'Admin Dashboard',
    description:
      'Developer-only content dashboard. Accessible from the Welcome screen "Open Admin" trigger (visible only when running locally — gated by import.meta.env.DEV). Lists all exhibits with their trilingual titles and a per-exhibit Edit button. Header provides Add New Exhibit and QR Codes shortcuts plus Exit Admin.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.dev-admin-trigger', { timeout: 10000 })
      await page.locator('.dev-admin-trigger').click()
      await page.waitForSelector('.admin-list', { timeout: 10000 })
    },
  },
  {
    id: 'admin-qr',
    section: 'Admin (dev only)',
    title: 'Admin QR Codes',
    description:
      'Generates scannable QR codes for all exhibits with the decorative frame from /QR/QR-cover.webp composited around each. Print All opens the browser print dialog for physical label printing. Download JPG saves individual composite cards. Base URL is configured in src/config/qrConfig.js.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.dev-admin-trigger', { timeout: 10000 })
      await page.locator('.dev-admin-trigger').click()
      await page.waitForSelector('.admin-list', { timeout: 10000 })
      await page.locator('button:has-text("QR Codes")').click()
      await page.waitForSelector('.admin-qr-view', { timeout: 10000 })
    },
  },
  {
    id: 'admin-edit',
    section: 'Admin (dev only)',
    title: 'Admin Edit Form',
    description:
      'Per-language editor for an exhibit title, period, summary, and paginated content. Each page can have a text block and/or an image. Save persists to source via the dev-only Vite API endpoint /api/admin/save. Language tabs at the top switch between EN, ID, and ZH content for the same exhibit.',
    navigate: async (page, baseUrl) => {
      await page.goto(baseUrl + '/', { timeout: 15000 })
      await page.waitForSelector('.dev-admin-trigger', { timeout: 10000 })
      await page.locator('.dev-admin-trigger').click()
      await page.waitForSelector('.admin-list', { timeout: 10000 })
      await page.locator('.admin-card .admin-btn-primary').first().click()
      await page.waitForSelector('.admin-form', { timeout: 10000 })
    },
  },
]
