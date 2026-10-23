# The Storytelling Mirror — Master Phase Plan

**Project type:** Mobile-first web application for a cultural expo  
**Chosen stack:** React + Vite + JavaScript/JSX + plain CSS  
**Primary devices:** Mobile browsers, especially iOS Safari and Android Chrome  
**Languages:** English (`en`) and Bahasa Indonesia (`id`)  
**Core experience:** Welcome → Scan QR → Confirm exhibit → Read story → Scan another exhibit  
**Design direction:** An ornate Peranakan-inspired storytelling hand mirror, not a Game Boy, console, or generic camera utility  
**Document role:** This is the durable implementation source of truth. Complete one part at a time, verify it, record the result, and only then advance.

---

## 1. Architecture decision

### 1.1 Decision: use React for the web, not React Native

Use the existing **React + Vite JavaScript project**.

The finished product will be opened from a URL in mobile browsers. React with browser APIs is therefore the most direct implementation:

- one web deployment instead of native application builds;
- no App Store or Play Store release process;
- expo visitors can open the experience from a link or QR code;
- normal HTML and CSS provide responsive layout and accessibility;
- `navigator.mediaDevices.getUserMedia()` provides camera access on HTTPS;
- a browser QR decoder can process the live camera feed;
- local exhibit data and language resources can ship with the site;
- updates can be deployed without rebuilding and redistributing a native application.

React Native with Expo was appropriate for the earlier Game Boy camera application, which used `expo-camera` and `CameraView`. It is not the preferred foundation for this browser-first rebuild. Reuse behavioral lessons from that project, but do not port its native components or visual shell.

### 1.2 Reuse from the previous project

Reuse these proven behaviors:

- request camera permission only after a deliberate visitor action;
- prefer the rear-facing camera;
- keep scanning active while the scanner screen is mounted;
- accept one valid result and synchronously lock duplicate callbacks;
- validate scanned content before using it;
- stop scanner controls and all media tracks after success, Back, error cleanup, or unmount;
- allow a fresh scanner session without refreshing the page;
- provide explicit denied-permission and unavailable-camera recovery;
- verify camera focus and QR recognition on physical devices.

Do not reuse:

- the Game Boy/device shell;
- pixel typography or simulated console controls;
- React Native layout components;
- Expo Router or native-navigation assumptions;
- `expo-camera` in the Vite application;
- a screen-within-a-screen layout that makes the camera target too small.

### 1.3 QR scanner decision

Use `@zxing/browser` as the initial QR-decoding candidate, isolated behind `src/lib/qrScanner.js`.

This is not a permanent coupling. Application screens must communicate with a small scanner adapter rather than importing ZXing directly. If testing reveals a better decoder later, only that adapter should need replacement.

Do not rely exclusively on the browser `BarcodeDetector` API for the MVP because support is not dependable enough across all target iPhone and Android browsers. It may be evaluated later as an optimization or optional fast path.

### 1.4 Other deliberate constraints

- JavaScript and JSX only, no TypeScript.
- Plain CSS and CSS custom properties.
- No UI framework unless a concrete requirement justifies one.
- No global-state library.
- No backend, database, login, CMS, or analytics for the initial MVP.
- No router initially. Add React Router only if deep links, browser-history behavior, or shareable exhibit URLs become required.
- No PWA/service worker unless offline or installation is explicitly approved.
- No collage until the scan-to-story MVP is stable.

---

## 2. Product scope

### 2.1 MVP

The MVP includes:

1. A bilingual Welcome screen.
2. A bilingual camera scanner screen.
3. Strict QR payload validation.
4. A bilingual scan-result confirmation screen.
5. Bilingual exhibit Story, Symbolism, and Gallery content when present.
6. A language toggle available throughout the journey.
7. A path to scan another exhibit without refreshing.
8. Permission-denied, camera-unavailable, invalid-code, unknown-exhibit, and general scanner-error states.
9. Camera cleanup whenever scanning ends.
10. Responsive and accessible behavior on small phones.
11. HTTPS deployment and real-device acceptance tests.

### 2.2 Optional after MVP

- Exhibit-image collage.
- Native share or downloaded image fallback.
- Visitor photo/selfie only if explicitly approved.
- Manual exhibit-code fallback.
- Torch control if reliable on target devices.
- Shareable exhibit URLs and routing.
- PWA/offline support.
- Backend or CMS when content maintenance genuinely requires one.

### 2.3 Out of scope for the first release

- Accounts and authentication.
- Social feed, likes, comments, points, or gamification.
- Uploading visitor photographs.
- Arbitrary navigation to URLs contained in scanned QR codes.
- An elaborate reusable design system.
- Speculative wrappers, hooks, folders, and abstractions.

---

## 3. Visitor journey

```text
Welcome
  ├─ Change language EN/ID
  └─ Start Exploring
       ↓
Scanner
  ├─ Change language without restarting camera
  ├─ Back → Welcome
  ├─ Recover from camera or QR errors
  └─ Valid recognized QR
       ↓ camera stops
Scan Result
  ├─ Change language without rescanning
  ├─ Scan Again → new Scanner session
  └─ View Details
       ↓
Exhibit Details
  ├─ Story
  ├─ Symbolism, only when available
  ├─ Gallery, only when available
  ├─ Change language while preserving exhibit
  ├─ Home → Welcome
  └─ Scan Next Exhibit → new Scanner session
```

The QR payload is language-neutral. One printed code identifies one exhibit, while the selected application language determines which content is displayed.

---

## 4. State and data architecture

### 4.1 Initial application state

Keep state in `App.jsx` until real complexity justifies another approach.

```js
const [screen, setScreen] = useState('welcome')
const [language, setLanguage] = useState(getInitialLanguage)
const [selectedExhibitId, setSelectedExhibitId] = useState(null)
const [scanResult, setScanResult] = useState(null)
const [scannerSessionId, setScannerSessionId] = useState(0)
```

Suggested screen values:

```text
welcome
scanner
scan-result
exhibit
```

Use a new `scannerSessionId` when intentionally starting another scanner session. Language must not be a scanner-lifecycle dependency.

### 4.2 Language rules

- Supported languages: `en` and `id`.
- First preference: valid stored selection.
- Second preference: browser language beginning with `id`.
- Fallback: English.
- Store preference as `storytelling-mirror-language` in `localStorage`.
- Update `document.documentElement.lang` whenever language changes.
- Use `EN` and `ID` text buttons, not flags.
- All essential UI strings come from translation resources.
- Changing language must not reset the current screen, exhibit, active scanner, or successful scan.
- During development, missing selected-language content may fall back to English and warn.
- Production content validation must fail when required launch translations are missing.

### 4.3 Translation structure

```text
src/
  i18n/
    translations.js
    language.js
```

`translations.js` contains interface strings grouped by function:

```js
export const translations = {
  en: {
    app: {},
    language: {},
    welcome: {},
    scanner: {},
    result: {},
    exhibit: {},
    errors: {},
    accessibility: {}
  },
  id: {
    app: {},
    language: {},
    welcome: {},
    scanner: {},
    result: {},
    exhibit: {},
    errors: {},
    accessibility: {}
  }
}
```

Do not scatter expressions such as `language === 'en' ? ... : ...` across screen components.

### 4.4 Exhibit data structure

Keep technical and asset fields language-neutral. Keep translatable content under `content`.

```js
{
  id: 'EXPO-001',
  coverImage: '/images/exhibits/expo-001/cover.webp',
  content: {
    en: {
      title: 'Peranakan Vase',
      period: '19th Century',
      summary: 'Approved English summary.',
      story: 'Approved English story.',
      symbolism: 'Approved English symbolism.',
      coverAlt: 'Objective English image description'
    },
    id: {
      title: 'Vas Peranakan',
      period: 'Abad ke-19',
      summary: 'Ringkasan Bahasa Indonesia yang disetujui.',
      story: 'Cerita Bahasa Indonesia yang disetujui.',
      symbolism: 'Simbolisme Bahasa Indonesia yang disetujui.',
      coverAlt: 'Deskripsi objektif gambar dalam Bahasa Indonesia'
    }
  },
  gallery: [
    {
      src: '/images/exhibits/expo-001/gallery-01.webp',
      content: {
        en: { alt: 'English description', caption: 'English caption' },
        id: { alt: 'Deskripsi Bahasa Indonesia', caption: 'Keterangan Bahasa Indonesia' }
      }
    }
  ]
}
```

### 4.5 QR contract

Preferred first contract:

```text
EXPO-001
```

The parser returns structured results:

```js
{ ok: true, exhibitId: 'EXPO-001' }
```

or:

```js
{ ok: false, reason: 'unsupported-format' }
```

Expected failure reasons:

```text
empty
unsupported-format
unknown-exhibit
```

Camera and permission errors remain scanner errors, not QR parser results.

Never automatically open arbitrary URLs found in a QR code. If existing printed codes contain URLs, accept only an explicitly approved hostname and path pattern and extract a known exhibit identifier.

---

## 5. Proposed source layout

Create files only when their phase needs them.

```text
storytelling-mirror/
├── AGENTS.md
├── MASTER-PHASE-PLAN.md
├── assets-checklist.md
├── PROGRESS.md
├── README.md
├── index.html
├── package.json
├── public/
│   └── images/
│       ├── brand/
│       └── exhibits/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── AppShell.jsx
    │   ├── LanguageToggle.jsx
    │   └── StatusMessage.jsx
    ├── data/
    │   └── exhibits.js
    ├── i18n/
    │   ├── language.js
    │   └── translations.js
    ├── lib/
    │   ├── exhibitLookup.js
    │   ├── qrPayload.js
    │   └── qrScanner.js
    ├── screens/
    │   ├── WelcomeScreen.jsx
    │   ├── ScannerScreen.jsx
    │   ├── ScanResultScreen.jsx
    │   └── ExhibitScreen.jsx
    └── styles/
        ├── global.css
        ├── screens.css
        └── theme.css
```

Do not create `CollageScreen.jsx`, collage assets, generic hooks, services, barrel exports, or empty folders until the corresponding phase begins.

---

# 6. Phase execution protocol

Every phase follows the same gates.

## Before implementation

1. Read this master plan, `AGENTS.md`, `PROGRESS.md`, and the files touched by the part.
2. State the exact visitor-visible change.
3. List likely regressions.
4. Identify camera lifecycle, validation, localization, accessibility, and data-loss concerns.
5. Implement only the current part.

## Verification

Run the checks that exist at that point:

```powershell
npm run lint
npm run test
npm run build
```

When `verify` exists:

```powershell
npm run verify
```

Also perform the part-specific manual checks.

## Completion record

Append this block to `PROGRESS.md` after every completed part:

```md
## Phase X.Y — Part name

**Status:** Complete  
**Goal:**  
**Files changed:**  
**User-visible result:**  
**Automated checks:**  
**Manual checks:**  
**Not checked:**  
**Remaining risks:**  
**Decisions made:**  
**Next part:**  
**Commit:**
```

## Stop rules

Stop the current part when:

- a required real QR payload is unknown;
- approved translations or exhibit facts are required but unavailable;
- camera behavior fails on a target browser;
- a check fails for a reason introduced by the part;
- the proposed implementation would weaken validation, cleanup, or accessibility;
- an unapproved dependency or scope expansion becomes necessary.

Do not hide a failure by disabling lint rules, deleting tests, weakening QR validation, or omitting camera cleanup.

---

# 7. Detailed phase plan

## Phase 0 — Baseline and repository normalization

### Goal

Turn the existing Vite JSX starter into a clean, reproducible baseline.

### Part 0.1 — Inspect the starter

Tasks:

- Record `node --version` and `npm --version`.
- Read `package.json`, `src/main.jsx`, `src/App.jsx`, current CSS, and ESLint configuration.
- Run `npm install`, `npm run dev`, and `npm run build`.
- Record existing warnings and failures before editing.

Acceptance:

- Starter launches.
- Production build completes, or the existing blocker is documented accurately.

### Part 0.2 — Remove demo content

Tasks:

- Remove Vite/React logos, counter example, demo styles, and unused starter assets.
- Leave a minimal Storytelling Mirror placeholder.
- Keep the existing project structure unless a move materially clarifies it.

Acceptance:

- No starter demo remains.
- Console has no warnings introduced by cleanup.

### Part 0.3 — Add project documents and metadata

Tasks:

- Add `AGENTS.md`, this plan, asset checklist, `README.md`, and `PROGRESS.md`.
- Update `index.html` title, description, viewport, and theme color.
- Document HTTPS camera requirements in the README.

Acceptance:

- Repository contains one clear source of truth for rules, phases, assets, and progress.
- Build still passes.

### Phase 0 exit gate

- Clean JavaScript/JSX starter.
- No unused demo assets.
- Development server and build pass.
- Baseline captured in `PROGRESS.md`.

---

## Phase 1 — Quality gates

### Goal

Prevent the phased implementation from accumulating hidden regressions.

### Part 1.1 — Lint and formatting conventions

Tasks:

- Preserve the Vite ESLint setup where practical.
- Enforce project conventions without disabling legitimate rules.
- Add Prettier only if automated formatting is desired; it is not required for application behavior.
- Add `format` and `format:check` only when Prettier is installed.

Acceptance:

- `npm run lint` passes.

### Part 1.2 — Test environment

Suggested development dependencies:

```powershell
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Tasks:

- Configure Vitest with jsdom.
- Add test setup for `@testing-library/jest-dom`.
- Add one application render test.
- Add one button interaction test.

Acceptance:

- `npm run test` passes reliably.

### Part 1.3 — Unified verification

Add scripts similar to:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "verify": "npm run lint && npm run test && npm run build"
}
```

Acceptance:

- `npm run verify` passes from a new terminal.

### Phase 1 exit gate

- Lint, tests, and build are repeatable.
- No scanner or visual production work has begun.

---

## Phase 2 — Localization foundation

### Goal

Make bilingual behavior structural rather than retrofitted into completed screens.

### Part 2.1 — Translation resources

Tasks:

- Create `translations.js` with `en` and `id` sections.
- Include application, language, welcome, scanner, result, exhibit, error, and accessibility strings.
- Use approved official names where supplied.
- Mark provisional cultural translations clearly in content records or the content checklist.

Acceptance:

- Every current interface string has an English and Indonesian value.

### Part 2.2 — Translation helper

Tasks:

- Implement nested-key lookup.
- Fall back to English.
- Return or report a visible development-safe key when both values are missing.
- Add tests for selected value, fallback, and missing key.

Acceptance:

- Translation logic is deterministic and tested.

### Part 2.3 — Initial language and persistence

Tasks:

- Read a valid stored preference first.
- Otherwise map browser language beginning with `id` to Indonesian.
- Otherwise use English.
- Store language changes in `localStorage`.
- Synchronize the HTML `lang` attribute.

Acceptance:

- Reload preserves the chosen language.
- Invalid stored values safely fall back.

### Part 2.4 — Accessible language toggle

Tasks:

- Build a two-button EN/ID control.
- Use `aria-pressed` or an equivalent explicit selected state.
- Provide localized accessible labeling.
- Make touch targets at least 44 by 44 CSS pixels.
- Test keyboard operation.

Acceptance:

- Selection is visually and programmatically clear.
- No national flags are used.

### Part 2.5 — Prove language does not reset navigation

Tasks:

- Add temporary screen state if needed for the test.
- Verify changing language leaves the current screen and selected data unchanged.
- Add a focused test.

### Phase 2 exit gate

- EN/ID switching works.
- Preference survives reload.
- HTML language updates.
- Missing keys have safe behavior.
- Language changes do not reset application state.

---

## Phase 3 — QR and multilingual content contract

### Goal

Define trusted input and exhibit content before connecting a real camera.

### Part 3.1 — Confirm real QR inputs

Tasks:

- Scan or inspect several existing expo QR codes.
- Record exact representative payloads without guessing.
- Confirm whether new QR labels may be printed.
- Choose strict accepted syntax.

Stop condition:

- If existing printed payloads are not available, implement against clearly marked fixtures but do not finalize production parsing.

### Part 3.2 — QR parser

Tasks:

- Create `qrPayload.js`.
- Trim only if the contract permits it.
- Impose a reasonable input-length guard.
- Parse only the approved ID or URL pattern.
- Return structured success/failure objects.
- Never execute or navigate to scanned content.

Tests:

- known ID;
- valid format but unknown ID;
- empty input;
- whitespace behavior;
- wrong case;
- arbitrary URL;
- malicious-looking text;
- excessively long input.

### Part 3.3 — Exhibit lookup

Tasks:

- Create `exhibitLookup.js`.
- Resolve exact stable IDs.
- Keep duplicate API/data records unchanged only if that is an explicit future contract; local MVP IDs should otherwise be unique.
- Return a predictable not-found result.

### Part 3.4 — Representative multilingual records

Create at least:

1. A complete exhibit with Story, Symbolism, and Gallery.
2. An exhibit without Gallery.
3. An exhibit without Symbolism or another optional field.

Each record needs approved or clearly provisional EN/ID content, image paths, alt text, and captions where applicable.

### Part 3.5 — Content validator

Tasks:

- Add a small script or tested validation function.
- Detect duplicate IDs.
- Detect missing required EN or ID fields.
- Detect missing translated alt text for content images.
- Allow optional sections to be absent deliberately.
- Plan a `validate:content` npm script.

### Phase 3 exit gate

- QR contract is documented.
- Parsing and lookup tests pass.
- One QR resolves to the same exhibit independent of language.
- Representative records cover optional-content branches.
- Missing required translations are detectable.

---

## Phase 4 — Camera and QR scanner spike

### Goal

Prove camera reliability before building decorative scanner UI.

### Part 4.1 — Install and isolate decoder

```powershell
npm install @zxing/browser
```

Tasks:

- Create `qrScanner.js` only now.
- Expose a small start/stop contract.
- Do not let screen components depend on ZXing-specific result types.
- Restrict decoding to QR where supported by the selected API.

### Part 4.2 — Camera start

Tasks:

- Start only after a user action.
- Request the environment-facing camera.
- Connect the stream to a `<video>` element.
- Show requesting, active, and startup-failure states.
- Do not promise an unsupported manual autofocus control.

Acceptance:

- Rear camera is selected where available.
- The preview fills a useful portrait region.

### Part 4.3 — Scan and duplicate lock

Tasks:

- Decode continuously.
- Ignore normal no-result frames without rerendering React continuously.
- Lock accepted handling synchronously with a ref.
- Forward one decoded string to application validation.
- Stop scanning after an accepted valid result.

Acceptance:

- Holding one QR in frame causes one transition.

### Part 4.4 — Idempotent cleanup

Cleanup must work after:

- success;
- Back;
- initialization failure;
- component unmount;
- repeated cleanup in React development behavior.

Stop decoder controls, stop every media track, clear references, and detach `srcObject` when appropriate.

Acceptance:

- Browser camera indicator turns off after leaving.
- Entering scanner again works without reload.

### Part 4.5 — Real-device matrix

Test:

- Android Chrome;
- iOS Safari;
- allow permission;
- deny permission;
- previously denied permission;
- scan near and far;
- lower light;
- leave before result;
- successful result;
- start a second session;
- rotate or background/foreground the browser.

Record devices, OS versions, browser versions, and results in `PROGRESS.md`.

### Phase 4 exit gate

- Camera starts after explicit action.
- QR decoding succeeds on target devices.
- Duplicate scans are blocked.
- Cleanup is verified physically.
- A second scanner session works.

Do not proceed if iOS Safari or Android Chrome fails the core scanner lifecycle.

---

## Phase 5 — Visual foundation

### Goal

Translate the concept into reusable tokens and mobile layout without allowing ornamentation to obstruct function.

### Part 5.1 — Theme tokens

Define the starting palette:

```css
:root {
  --color-vermilion: #b32222;
  --color-vermilion-dark: #861818;
  --color-rosewood: #4a2e26;
  --color-antique-gold: #d4af37;
  --color-warm-ivory: #f7ead9;
  --color-peranakan-teal: #2c9c8d;
  --color-blush-pink: #e7a7b3;
  --color-text: #2a211d;
  --color-surface: #fffaf0;
  --color-error: #9f1f1f;
  --color-success: #187154;
}
```

Add spacing, radius, shadow, and typography tokens only when used.

### Part 5.2 — Global mobile foundation

Tasks:

- Reset box sizing and default margins.
- Use `100dvh` with safe-area padding.
- Add readable base line height.
- Add visible `:focus-visible` styling.
- Add reduced-motion handling.
- Constrain reading content on wide screens.
- Verify 320, 360, 390, and 430 CSS-pixel widths.

### Part 5.3 — Shared shell

Tasks:

- Add `AppShell` only if multiple screens need it.
- Establish safe top placement for Back/Home and Language controls.
- Ensure longer Indonesian labels wrap or size gracefully.
- Avoid fixed heights around translated content.

### Part 5.4 — Assets batch A

Prepare only:

- hero hand mirror;
- transparent camera-frame overlay;
- one floral corner ornament;
- favicon or temporary emblem;
- representative exhibit images;
- licensed heading and body font decision.

Do not add textures, many ornaments, or collage graphics yet.

### Phase 5 exit gate

- Theme primitives work in both languages.
- No clipping at 320 px or 200% zoom.
- Touch targets and focus states are usable.
- Decoration can be removed without breaking layout.

---

## Phase 6 — Welcome screen

### Goal

Explain the experience clearly and establish the new non-Game-Boy identity.

### Part 6.1 — Semantic content

Build:

- expo/brand label;
- title;
- Scan · Explore · Discover tagline;
- short explanation;
- camera-use notice;
- Start Exploring button;
- language toggle.

Essential text remains HTML, not baked into artwork.

### Part 6.2 — Hero and responsive composition

Tasks:

- Use the ornate hand mirror with visible handle and tassel.
- Keep the main action reachable on short screens.
- Use restrained floral decoration at edges.
- Provide useful image dimensions to prevent layout shift.
- Treat decorative art with empty alt text; use meaningful alt only when content-bearing.

### Part 6.3 — Behavior and tests

Tests:

- title and main action render;
- Start Exploring opens scanner;
- camera permission is not requested on initial render;
- language changes copy without navigation reset;
- button is keyboard accessible.

### Phase 6 exit gate

- A first-time visitor understands the activity.
- English and Indonesian layouts work.
- No camera request occurs before Start Exploring.
- Design reads as an ornate storytelling mirror, not a handheld console.

---

## Phase 7 — Production scanner screen

### Goal

Convert the camera spike into a reliable themed scanner.

### Part 7.1 — Scanner states

Support:

```text
idle
requesting-permission
scanning
decoded
permission-denied
camera-unavailable
scanner-error
invalid-code
unknown-exhibit
```

Not every state needs a separate component.

### Part 7.2 — Screen composition

Build layers:

1. camera backdrop;
2. live video;
3. top Back and language controls;
4. transparent mirror-frame overlay;
5. CSS scan brackets;
6. opaque instruction panel;
7. conditional status/error actions.

Keep tassels, flowers, and text outside the target area.

### Part 7.3 — Validation flow

```text
decoded text
→ QR parser
→ exhibit lookup
→ accepted result or recoverable error
```

An unsupported QR remains on the scanner with Scan Again. A formatted but missing exhibit shows Unknown Exhibit. Neither case navigates to an arbitrary destination.

### Part 7.4 — Language independence

- Language switching changes visible instructions and errors.
- Language is not included in scanner-start effect dependencies.
- Switching language does not stop, restart, or duplicate the camera.
- The selected language persists after success.

### Part 7.5 — Error recovery

Each state must provide a clear next action:

- Permission denied: instructions, Try Again, Return Home.
- Camera unavailable: explanation and Return Home.
- Scanner error: Try Again and Return Home.
- Invalid QR: Scan Again.
- Unknown exhibit: Scan Again and Return Home.

Use an alert or appropriate live region for newly displayed errors.

### Part 7.6 — Scanner manual regression

Repeat the Phase 4 lifecycle checks with the production overlay and both languages. Confirm the transparent opening remains large enough for scanning.

### Phase 7 exit gate

- Production scanner works in EN and ID.
- Language changes do not restart camera.
- Errors are recoverable.
- Camera stops on success, Back, and unmount.
- Decoration does not reduce scan reliability.

---

## Phase 8 — Scan-result confirmation

### Goal

Give visitors a controlled confirmation before long exhibit content.

### Part 8.1 — Result content

Show:

- exhibit cover image;
- localized title;
- localized period/subtitle when present;
- localized Item Detected status;
- View Details;
- Scan Again.

Do not auto-advance on a timer.

### Part 8.2 — State behavior

- Camera is stopped before this screen renders.
- Language change updates content without rescanning.
- Scan Again creates a fresh scanner session.
- Missing optional metadata does not leave an empty region.

### Part 8.3 — Tests

- correct exhibit appears;
- EN/ID changes content;
- Scan Again starts the intended transition;
- View Details opens the same selected exhibit;
- long titles wrap safely.

### Phase 8 exit gate

- Confirmation is clear in both languages.
- Camera remains off.
- Visitor can accept or rescan.

---

## Phase 9 — Exhibit details and gallery

### Goal

Present cultural information readably while retaining the mirror identity.

### Part 9.1 — Information header

Build:

- exhibit image;
- localized title;
- optional localized period/origin/category;
- localized summary;
- Back/Home behavior as approved.

### Part 9.2 — Conditional sections

Possible sections:

- Story;
- Symbolism;
- Gallery.

Rules:

- Omit unavailable sections.
- If only one section exists, omit unnecessary tab UI.
- Keep active section during language changes when that section exists.
- Otherwise select the first available section.

### Part 9.3 — Long-form readability

- Use normal document scrolling.
- Do not use a fixed-height article with an internal scrollbar.
- Keep paragraphs left aligned with comfortable line height.
- Keep decoration away from text.
- Test short and long EN/ID content.

### Part 9.4 — Gallery

- Use a simple responsive grid.
- Load gallery images lazily.
- Show localized alt text and caption.
- Use a native `<dialog>` lightbox only if enlargement is required.
- Do not add a carousel dependency for the initial gallery.
- Handle image failures without collapsing the page.

### Part 9.5 — Continue journey

- Scan Next Exhibit starts a fresh scanner session.
- Home returns to Welcome and leaves camera off.
- Optional Add to Collage remains absent until the collage phase.

### Part 9.6 — Tests

Cover:

- complete exhibit;
- missing Gallery;
- missing Symbolism;
- missing optional metadata;
- unknown ID;
- long title and story;
- language change;
- gallery image failure;
- Scan Next Exhibit.

### Phase 9 exit gate

- Long content is readable at 320 px and 200% zoom.
- Optional sections never create blank tabs.
- Both languages work without mixed-language UI.
- Scanning can continue without refresh.

---

## Phase 10 — MVP stabilization

### Goal

Verify the complete journey as one coherent product.

### Part 10.1 — Automated coverage

At minimum test:

- translations and fallback;
- stored and browser-derived initial language;
- HTML `lang` synchronization;
- QR parsing;
- exhibit lookup;
- content validation;
- Welcome to Scanner;
- valid result;
- invalid and unknown QR recovery;
- Scan Result to Details;
- conditional sections;
- language switching on every screen;
- Scan Next Exhibit;
- duplicate-result guard where practical outside the library.

Do not over-mock the internals of ZXing. Test the application boundary and verify real camera behavior manually.

### Part 10.2 — English complete flow

```text
Welcome → Scanner → Result → Story → Gallery → Scan Next
```

### Part 10.3 — Indonesian complete flow

Run the same journey in Indonesian.

### Part 10.4 — Mid-flow language changes

Switch language on:

- Welcome;
- active Scanner;
- camera error;
- Scan Result;
- Story;
- Symbolism;
- Gallery.

Confirm no unexpected screen reset, rescan, camera restart, or lost exhibit.

### Part 10.5 — Lifecycle and error matrix

Test:

- denied and previously denied permission;
- no usable camera where reproducible;
- invalid code;
- unknown exhibit;
- same QR held in frame;
- leave scanner before success;
- successful scan cleanup;
- repeated scanner entry;
- browser background/foreground;
- phone lock/unlock where practical;
- portrait and rotation behavior.

### Part 10.6 — Accessibility

Check:

- keyboard traversal;
- visible focus;
- 44 × 44 targets;
- semantic headings;
- icon labels;
- alert announcements;
- contrast;
- reduced motion;
- 200% zoom;
- image alt text in selected language.

### Part 10.7 — Performance

Check:

- optimized hero and exhibit images;
- no eager loading of all galleries;
- no per-frame React state update;
- scanner package lazy loading if bundle analysis justifies it;
- layout-shift reduction through image dimensions/aspect ratios;
- no production debug logging.

### Phase 10 exit gate

- `npm run verify` passes.
- Both complete language flows pass.
- Scanner lifecycle passes on real iOS Safari and Android Chrome.
- No known release-blocking mixed-language, cleanup, or validation defect remains.

---

## Phase 11 — HTTPS deployment and expo acceptance

### Goal

Prove the real deployed origin, real QR codes, and approved content.

### Part 11.1 — Choose static hosting

Use an organization-approved HTTPS host such as Azure Static Web Apps, Netlify, Vercel, Cloudflare Pages, or existing corporate hosting. No backend is needed for the local-data MVP.

Record:

- build command;
- output directory;
- base path;
- environment values, if any;
- cache behavior;
- rollback process.

### Part 11.2 — Deploy production build

Verify:

- HTTPS;
- direct URL loads;
- static assets resolve;
- browser camera permission is available;
- no iframe or permissions-policy restriction blocks camera;
- reload does not break the app.

### Part 11.3 — Validate real QR inventory

For every launch QR:

- scan the physical label;
- record raw payload;
- confirm mapped exhibit ID;
- confirm correct EN and ID content;
- confirm correct cover/gallery images;
- confirm error behavior for unsupported labels.

### Part 11.4 — Content and rights acceptance

Confirm:

- exhibit facts approved;
- English and Indonesian copy approved;
- cultural terminology reviewed;
- images approved for use;
- credits present where needed;
- font licenses permit web deployment;
- AI decorative art is not represented as a factual artifact photograph.

### Part 11.5 — Production device matrix

At minimum:

- one recent iPhone with Safari;
- one recent Android phone with Chrome;
- one older or lower-powered supported phone;
- a device with previously denied permission;
- expo Wi-Fi;
- mobile data where relevant.

### Part 11.6 — Staff recovery note

Prepare a brief operational guide covering:

- how to allow camera permission on iOS Safari and Android Chrome;
- how to reload after a deployment;
- what Unknown Exhibit means;
- fallback URL or manual code process, if approved;
- escalation contact and deployment rollback owner.

### Phase 11 exit gate

The MVP is release-ready when a visitor can open the deployed HTTPS site, select either language, scan a real expo QR code, see the correct localized exhibit, and scan another exhibit without a refresh. All failure states recover clearly, and the camera stops whenever it is no longer needed.

---

## Phase 12 — Optional collage keepsake

Do not begin until Phase 11 is accepted.

### Part 12.1 — Confirm scope

Recommended first version: exhibit-image collage only.

Decide:

- exhibit images only or visitor photo too;
- maximum image count, recommended four;
- one or two predefined layouts;
- required exported branding;
- whether sharing or download is the primary action.

### Part 12.2 — Data model

Store exhibit IDs and selected image references, not already translated text. Render labels in the language active at export time.

### Part 12.3 — Editing

Support:

- add supported exhibit image;
- remove;
- simple move-left/move-right reorder;
- choose predefined layout;
- clear recovery from invalid state.

Avoid drag-and-drop for the first version unless testing proves it necessary.

### Part 12.4 — Export and share

- Build export with local same-origin assets.
- Bound canvas dimensions for mobile memory safety.
- Wait for images and fonts before export.
- Attempt native share only when supported.
- Provide download fallback.
- Show success and failure states in EN and ID.

### Part 12.5 — Visitor photo, only if approved

Additional requirements:

- explicit local-processing explanation;
- image downscaling;
- orientation correction;
- memory testing on iOS Safari;
- no upload or retention;
- permission/privacy review.

### Phase 12 exit gate

- Defined maximum items work.
- Remove and reorder work.
- Export succeeds on target devices or has a clear fallback.
- No visitor image leaves the browser.
- All controls and status messages are bilingual and accessible.

---

# 8. Asset gates

## Batch A — Needed before polished Welcome/Scanner

- Hero ornate hand mirror.
- Transparent scanner mirror frame.
- One floral corner ornament.
- Representative exhibit cover images.
- Font decision and license confirmation.
- Favicon or temporary emblem.

## Batch B — Needed before launch content acceptance

- Every launch exhibit cover.
- Optional gallery images.
- EN and ID alt text.
- EN and ID captions.
- Credits and permissions.
- Approved EN and ID Story and Symbolism.
- Verified QR mapping.

## Batch C — Polish only

- Paper texture.
- Extra floral dividers.
- Gold corner details.
- Porcelain patterns.
- Additional tassels.
- Social preview.
- Collage decorations.

The camera frame must have a genuinely transparent center and must not obscure the QR target. The hero must read as a hand mirror with a handle and tassel, not a phone, wall mirror, picture frame, or Game Boy.

---

# 9. Definition of done

## MVP definition of done

- React + Vite JavaScript application builds successfully.
- Deployed over HTTPS.
- Works on supported iOS Safari and Android Chrome devices.
- English and Indonesian can be selected on every screen.
- Preference survives reload.
- Language changes do not restart camera or lose exhibit state.
- A real QR is parsed and validated before lookup.
- Arbitrary QR URLs are never opened.
- Correct exhibit information appears in both languages.
- Optional sections do not produce blank tabs.
- Duplicate scans do not duplicate navigation.
- Camera stops after success, Back, unmount, and handled initialization failure.
- Visitors can scan another exhibit without refreshing.
- Failure states have understandable recovery actions.
- UI remains readable at 320 px and 200% zoom.
- Keyboard, focus, labels, live errors, contrast, and reduced motion are checked.
- Launch content, translations, images, credits, and rights are approved.
- `npm run verify` passes.

## Non-blocking follow-up

The collage is not an MVP blocker.

---

# 10. Current project position and next action

Current known state:

- The React + Vite JavaScript starter has already been created.
- The new visual concept has been chosen.
- Previous project behavior provides camera lifecycle lessons.
- English/Indonesian language switching is now an MVP architectural requirement.
- Real QR payloads and approved bilingual exhibit content still need confirmation.

Start with **Phase 0.1**. Do not install the scanner package or build the ornamented screens until the baseline and quality gates are complete. After Phase 1, implement localization before QR content and camera work so every subsequent screen is bilingual by construction.
