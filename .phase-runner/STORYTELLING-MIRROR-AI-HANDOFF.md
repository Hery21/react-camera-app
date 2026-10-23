# Handoff Prompt — The Storytelling Mirror

> **Purpose:** Paste this entire document as the first instruction to the replacement coding assistant. Attach the repository files listed in **Required inputs** at the same time. This document is intentionally detailed so the project can continue without access to the earlier Microsoft 365 Copilot conversation.

---

# START OF PROMPT FOR THE NEXT AI

You are taking over an existing software project called **The Storytelling Mirror**. Act as the implementation partner for the repository, not as a high-level adviser. The project already has a phase plan and an automated phase runner. Your job is to continue the existing plan carefully, one small verified part at a time, while preserving decisions already made.

## 1. First response protocol

Before proposing or generating the next implementation:

1. Read every attached project file completely.
2. Treat `AGENTS.md` as the coding rules.
3. Treat `MASTER-PHASE-PLAN.md` as the implementation roadmap and architecture source of truth.
4. Treat `plan.md` as product/design context. If it conflicts with a newer explicit decision in this handoff or `MASTER-PHASE-PLAN.md`, use the newer decision.
5. Treat `PROGRESS.md` as the authority for what has actually been completed.
6. Inspect every attached `.phase-runner` file, especially `run.mjs` and all existing `*.plan.mjs` files, before creating another plan.
7. Do **not** assume a phase is complete just because its plan file exists. `PROGRESS.md`, Git state/output, and the user's latest terminal output determine completion.
8. If repository files are available directly, inspect the files touched by the next phase before editing them.
9. Identify the **next incomplete part** from `PROGRESS.md` + `MASTER-PHASE-PLAN.md`.
10. Continue that part. Do not restart the architecture discussion unless repository evidence requires it.

In your first response, give me only:

- your concise understanding of the current project;
- the last confirmed completed phase/part;
- the next part to execute;
- any inconsistency you found between the attached files;
- the exact plan file you propose to create or run next.

If you have direct filesystem/terminal access, proceed to inspect and implement the next part after that analysis. If you only have chat/file-upload access, generate the next `.plan.mjs` as a downloadable/full file rather than asking me to manually make many edits.

---

## 2. Product definition

**The Storytelling Mirror** is a mobile-first cultural expo web experience. Visitors use their own phone browser, open the website, choose a language, allow camera access after an explicit action, scan an exhibit QR code, see the recognized exhibit, explore the exhibit's story/symbolism/gallery, and scan another exhibit.

The core journey is:

```text
Welcome
  -> Start Exploring
  -> Camera / QR Scanner
  -> QR validation + exhibit lookup
  -> Scan Result
  -> Exhibit Details
     -> Story
     -> Symbolism (when available)
     -> Gallery (when available)
  -> Scan Next Exhibit
  -> new Scanner session
```

The app is intended to run primarily on **mobile browsers**, especially:

- iOS Safari
- Android Chrome

It is a web application. There is no native-app installation requirement for expo visitors.

---

## 3. Architecture decision — DO NOT reopen without concrete evidence

The chosen production architecture is:

- **React**
- **Vite**
- **JavaScript + JSX**, not TypeScript
- **plain CSS**
- browser camera APIs
- local exhibit/content data for MVP
- static HTTPS deployment
- no backend for the first release
- no authentication
- no database
- no global-state library initially
- no UI component framework initially
- no React Router initially unless deep linking/browser-history requirements later justify it
- no PWA/service worker initially

### Why React web instead of React Native

The earlier version was an Expo/React Native camera project styled like a Game Boy. The end users were unhappy with the Game Boy design, and this rebuild is explicitly browser-first. Visitors will access the application through mobile browsers, so React + Vite is the direct deployment model.

Do **not** migrate this project back to React Native or Expo unless the user explicitly changes the distribution requirement.

---

## 4. Previous camera project knowledge that should be preserved

The old project was an Expo/React Native camera application and used:

- Expo
- React Native
- `expo-camera`
- `CameraView`
- Expo camera barcode/QR handling
- autofocus behavior from the camera implementation

The new Vite app cannot simply reuse the native `expo-camera` component. Reuse the **behavioral lessons**, not the native components or the old visual shell.

Preserve these behaviors:

1. Request camera permission only after a deliberate user action.
2. Prefer the rear/environment-facing camera.
3. Scan continuously while the scanner screen is active.
4. Lock result handling synchronously after the first accepted result so one QR held in the camera does not cause duplicate transitions.
5. Validate scanned content before selecting an exhibit or destination.
6. Never automatically navigate to arbitrary content/URLs from a QR code.
7. Stop the decoder and all media tracks after a successful accepted scan.
8. Stop the camera when leaving the scanner.
9. Stop the camera on component unmount.
10. Cleanup must be idempotent so repeated cleanup calls are safe.
11. A visitor must be able to start a new scanner session without refreshing the page.
12. Camera-permission denied, no-camera, scanner failure, invalid QR, and unknown exhibit must have understandable recovery paths.
13. Camera behavior and QR recognition must ultimately be tested on real iOS Safari and Android Chrome devices.

### Browser QR decoder decision

The current recommendation is to start with **`@zxing/browser`**, but isolate it behind:

```text
src/lib/qrScanner.js
```

Screens should depend on our small scanner adapter rather than ZXing-specific result types. This keeps replacement possible later.

Do not make browser `BarcodeDetector` the only MVP decoder unless target-browser compatibility has been proven on the actual supported devices.

Do not install the scanner dependency until the phase plan reaches the camera/scanner spike.

---

## 5. Visual direction — critical project history

The previous application used a **Game Boy-style design**. The user explicitly does **not** want that design carried forward.

The new creative direction is an ornate cultural **hand mirror** experience, described as **The Storytelling Mirror**.

The concept uses a Peranakan-inspired visual vocabulary:

- ornate handheld mirror as the central metaphor;
- visible mirror handle and tassel where layout allows;
- warm ivory/paper-like backgrounds;
- vermilion primary actions;
- rosewood structural tones;
- antique-gold details;
- Peranakan teal accents;
- blush pink accents;
- floral/porcelain-inspired ornaments;
- elegant display-serif headings;
- clean, readable sans-serif UI/body copy;
- decorative motifs mainly at edges rather than behind important content;
- camera/scanning area should remain large, clear, and functional.

Starting palette from project planning:

```css
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
```

Do not recreate:

- Game Boy/device shell;
- pixel typography;
- fake console buttons;
- faux handheld-console controls;
- camera-inside-a-small-console-screen layout;
- visual ornament so dense that it reduces scanner usability.

The final decorative camera frame should have a genuinely transparent center. Tassels, flowers, instructions, and controls must remain outside the primary QR target region.

Do not invent factual artifact imagery and present it as a real exhibit photograph. Actual exhibit images and cultural content must come from approved assets/content.

---

## 6. Localization is MVP, not a later enhancement

The application is bilingual from the architecture level.

Supported language codes:

```text
en = English
id = Bahasa Indonesia
```

Use an accessible textual language control such as:

```text
EN | ID
```

Do not use national flags to represent languages.

### Language behavior

1. A valid stored language preference wins.
2. Otherwise, if the browser language begins with `id`, initialize Indonesian.
3. Otherwise, initialize English.
4. Store the visitor selection in `localStorage` under a stable project-specific key such as:

```text
storytelling-mirror-language
```

5. Synchronize `document.documentElement.lang`.
6. The toggle remains accessible throughout the journey.
7. Changing language must **not**:
   - reset the current screen;
   - lose the selected exhibit;
   - require the QR to be rescanned;
   - restart an active camera session;
   - duplicate scanner initialization.
8. Scanner lifecycle must not use `language` as a camera-start effect dependency.
9. UI text should come from translation resources, not scattered ternaries such as:

```js
language === "en" ? "Back" : "Kembali";
```

10. During development, missing content may fall back to English when the plan says so.
11. Before production, required launch content must exist in both languages.
12. Exhibit image alt text and gallery captions are localized too.

Initial suggested structure:

```text
src/i18n/
  translations.js
  language.js
```

Use application-owned translation objects initially. Do not add `react-i18next` unless requirements grow enough to justify it.

### Exhibit data rule

Technical data is language-neutral; localized fields sit underneath `content`.

Example shape:

```js
{
  id: 'EXPO-001',
  coverImage: '/images/exhibits/expo-001/cover.webp',
  content: {
    en: {
      title: 'Peranakan Vase',
      period: '19th Century',
      summary: '...',
      story: '...',
      symbolism: '...',
      coverAlt: '...'
    },
    id: {
      title: 'Vas Peranakan',
      period: 'Abad ke-19',
      summary: '...',
      story: '...',
      symbolism: '...',
      coverAlt: '...'
    }
  },
  gallery: [
    {
      src: '/images/exhibits/expo-001/gallery-01.webp',
      content: {
        en: { alt: '...', caption: '...' },
        id: { alt: '...', caption: '...' }
      }
    }
  ]
}
```

Do not duplicate the whole record per language.

---

## 7. QR/data safety contract

Preferred simple QR payload where new labels can be controlled:

```text
EXPO-001
EXPO-002
```

But **do not finalize this by assumption**. Real printed expo QR payloads must be inspected before production parsing is locked down.

If existing QR codes contain URLs, only an explicitly approved hostname/path structure should be accepted. Extract the stable exhibit ID from the recognized pattern. Never automatically open an arbitrary scanned URL.

Suggested parser return shape:

```js
{ ok: true, exhibitId: 'EXPO-001' }
```

or:

```js
{ ok: false, reason: 'unsupported-format' }
```

Likely parser failure reasons:

```text
empty
unsupported-format
unknown-exhibit
```

Keep camera/permission errors separate from QR parsing.

The QR itself is **language-neutral**. Language changes only which localized exhibit content is displayed.

---

## 8. State-management direction

Start with local state in `App.jsx`. Do not introduce Redux, Zustand, React Context, or another state library merely in anticipation of complexity.

Conceptual state:

```js
const [screen, setScreen] = useState("welcome");
const [language, setLanguage] = useState(getInitialLanguage);
const [selectedExhibitId, setSelectedExhibitId] = useState(null);
const [scanResult, setScanResult] = useState(null);
const [scannerSessionId, setScannerSessionId] = useState(0);
```

Potential screens:

```text
welcome
scanner
scan-result
exhibit
```

A new `scannerSessionId` can explicitly mean "start a new camera session". Language changes should not increment it.

Keep state local until sharing it genuinely becomes awkward.

---

## 9. Coding style and engineering preferences

The attached `AGENTS.md` is authoritative. In addition, preserve these known preferences:

- JavaScript + JSX, not TypeScript.
- React function components and hooks.
- PascalCase component names/files.
- camelCase JS variables/functions.
- kebab-case CSS classes.
- two-space indentation.
- single quotes.
- no semicolons.
- prefer `const`, use `let` only for reassignment, never `var`.
- plain CSS/native browser features before adding dependencies.
- choose the **smallest complete change**.
- YAGNI. Do not create speculative abstractions or unused folders.
- do not create barrel exports.
- do not refactor neighboring code simply because it is nearby.
- comments explain reasons/tradeoffs, not obvious syntax.
- separate QR parsing/exhibit lookup from decorative React markup.
- preserve cleanup, accessibility, and validation even under schedule pressure.
- do not disable lint rules merely to pass a check.
- do not hide errors.

The user likes implementation-focused progress and exact verification. When repository reality conflicts with a plan assumption, stop that assumption and use the real repository as evidence.

---

## 10. Testing policy for this urgent project

**Important override:** unit testing has intentionally been removed from the immediate project workflow because the project is urgent.

Do **not** add Vitest, Testing Library, jsdom, or a new unit-test setup unless the user later reverses this decision.

Default automated gates are:

```powershell
npm run lint
npm run build
```

If an existing plan/document still says unit tests are required, interpret that as superseded by this handoff unless the repository already contains meaningful tests that must be preserved.

Skipping unit tests does **not** mean skipping verification.

Manual/live verification is especially important for:

- camera permission accepted;
- camera permission denied;
- previously denied permission;
- rear-camera selection;
- scan success;
- duplicate scan callbacks;
- invalid QR;
- unknown exhibit;
- scanner Back action;
- camera cleanup after success;
- cleanup on unmount;
- second scanner session without reload;
- language switch while scanner is active;
- iOS Safari;
- Android Chrome;
- small viewport/layout;
- 200% zoom;
- keyboard/focus where applicable.

Do not claim camera behavior is verified merely because `npm run build` succeeds.

---

## 11. The `.phase-runner` workflow is central

This project uses an automated, Git-aware phase runner inspired by another successful resource-page project.

Expected structure:

```text
.phase-runner/
  run.mjs
  README.md
  plan-template.mjs
  plans/
    phase0.1-baseline-inspection.plan.mjs
    phase0.2-starter-cleanup.plan.mjs
    ...
  logs/
  reports/
```

Before changing `run.mjs`, read it in full. Preserve its existing contract unless a real blocker requires adjustment.

### Known runner behavior

The initial runner supports plan steps conceptually including:

```text
write
replace
jsonMerge
command
check
commit
note
```

Important behavior:

- default working tree protection stops when the repository is dirty;
- `--allow-dirty` exists but should be exceptional;
- plan failures stop subsequent steps;
- the runner does **not** hard-reset the repo after a failure;
- failed-plan changes intentionally remain for inspection;
- logs go under `.phase-runner/logs/`;
- reports go under `.phase-runner/reports/`;
- commits can be assigned aliases such as `as: 'feat'`;
- later plan text can use placeholders such as `{{hash.feat}}`;
- commits should stage explicit paths whenever practical so unrelated work cannot be swept in.

### Known dry-run issue

The first `run.mjs` implementation has a known semantic issue: `--dry-run` skips mutating/command steps but still executes `check` steps. An earlier dry-run therefore actually executed `npm run lint`.

Do not be surprised by this behavior. Either:

1. run normal plans once the working tree/dependencies are ready, or
2. improve dry-run deliberately in a small runner-focused change so **all executable steps** are skipped while the plan is still validated/described.

Do not silently make an unrelated runner rewrite during an application phase.

### Dependency-install lesson

An earlier Phase 0.1 dry run failed with:

```text
'eslint' is not recognized as an internal or external command
```

The attached `package.json` at that time already declared ESLint as a dev dependency. The issue was that local dependencies had not yet been installed. The correct baseline action was `npm install`, not a global ESLint installation.

If dependency commands fail on a corporate machine with a self-signed certificate/certificate-chain error, diagnose the corporate proxy/CA situation rather than weakening TLS blindly. A previous Expo project encountered corporate TLS interception. Do not assume that problem exists on the new computer unless the error actually occurs.

---

## 12. How to create phase plans

Prefer small part-level plans, not giant phase scripts.

Examples:

```text
phase0.1-baseline-inspection.plan.mjs
phase0.2-starter-cleanup.plan.mjs
phase0.3-project-docs.plan.mjs
phase1.1-verification.plan.mjs
phase2.1-translations.plan.mjs
phase2.2-translation-helper.plan.mjs
phase2.3-language-persistence.plan.mjs
phase2.4-language-toggle.plan.mjs
phase3.1-exhibit-data.plan.mjs
phase3.2-qr-parser.plan.mjs
phase3.3-exhibit-lookup.plan.mjs
phase3.4-content-validation.plan.mjs
phase4.1-zxing-adapter.plan.mjs
phase4.2-camera-spike.plan.mjs
phase4.3-scan-lock.plan.mjs
phase4.4-camera-cleanup.plan.mjs
```

The actual attached master plan and progress file decide the next filename. Do not create all future plans at once; later plans should be based on the repository produced by earlier phases.

### A normal application plan should broadly do this

```text
inspect/assume exact current repository state
-> smallest code/content changes
-> npm run lint
-> npm run build
-> commit implementation
-> append PROGRESS.md with the implementation hash
-> commit progress documentation
```

### Do not automatically commit live-camera phases too early

For a phase whose actual acceptance requires physical device behavior, distinguish between:

```text
code complete / lint+build complete
```

and:

```text
manual mobile acceptance complete
```

Do not record a real-device acceptance as complete until the user provides the actual result or the coding platform can truly run that device check.

---

## 13. Progress discipline

After each completed part, `PROGRESS.md` should contain a durable record similar to:

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

Use the real commit hash from the runner when available.

Do not write claims such as "tested on iPhone" unless that was actually done.

---

## 14. Phase order

The current intended project order is:

```text
Phase 0   Baseline and repository normalization
Phase 1   Quality gates / verification baseline
Phase 2   Localization foundation
Phase 3   QR and multilingual content contract
Phase 4   Camera and QR scanner spike
Phase 5   Visual foundation
Phase 6   Welcome screen
Phase 7   Production scanner
Phase 8   Scan-result confirmation
Phase 9   Exhibit details and gallery
Phase 10  MVP stabilization
Phase 11  HTTPS deployment and expo acceptance
Phase 12  Optional collage keepsake
```

Again: `PROGRESS.md` determines how far the repository has actually progressed.

### Important adjustment to older planning text

If `MASTER-PHASE-PLAN.md` still contains a Phase 1 test-framework setup (Vitest/Testing Library), **do not implement it**. Adapt Phase 1 to the urgent verification policy:

```text
lint
build
runner reliability
manual/live checks where behavior requires them
```

Document the explicit decision that unit tests are intentionally omitted for this urgent project.

Do not delete existing tests if the repository unexpectedly already contains useful project tests. The instruction is not to add a new testing system, not to destroy existing verification.

---

## 15. Phase-specific implementation anchors

### Phase 0 — baseline

- verify Node/npm and package install;
- clean Vite demo;
- establish project docs and metadata;
- make no unnecessary production feature changes.

A previously generated Phase 0.2 plan replaced starter UI with a deliberately minimal placeholder:

```text
Cultural Expo
The Storytelling Mirror
Scan · Explore · Discover
```

with basic mobile-safe styling only. This was intentionally **not** the final visual design; full visual foundation belongs later.

Determine from `PROGRESS.md` whether Phase 0.2 actually ran. Do not assume it did merely because the plan file exists.

### Phase 1 — quality gates

For this urgent version:

- `npm run lint`;
- `npm run build`;
- optionally a project `verify` script that chains those two;
- no new unit-test dependencies.

### Phase 2 — localization

Build locale data/helper/persistence/toggle before production UI screens so localization is not retrofitted.

### Phase 3 — content contract

Confirm real QR inputs before production parser lock-in. Build representative bilingual exhibit records and safe lookup behavior. Required launch translations eventually need validation.

### Phase 4 — scanner spike

Install `@zxing/browser` only here. Initially keep the spike visually simple. The objective is camera lifecycle and QR recognition, not ornament.

Use real mobile checks. Camera access on deployed web must use a secure context/HTTPS; localhost is suitable for local development, but do not assume a random plain HTTP LAN URL will behave like production camera access.

### Phase 5 — visual foundation

Add theme tokens, safe areas, typography, spacing, accessible focus treatment, responsive width behavior, reduced motion, and the first approved decorative assets.

Target narrow phone widths, particularly around 320, 360, 390, and 430 CSS pixels. Do not implement rigid text boxes that fail when Indonesian strings are longer.

### Phase 6 — Welcome

- ornate hand-mirror hero;
- Title: The Storytelling Mirror / approved localized equivalent;
- Scan · Explore · Discover concept;
- clear explanation;
- language toggle;
- Start Exploring;
- no camera permission before the action.

### Phase 7 — production scanner

Likely UI states:

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

Not every state needs its own component.

Screen layering concept:

```text
camera/video
-> restrained transparent mirror overlay
-> scan brackets/target
-> top navigation/language controls
-> opaque instruction/status/error panel outside target
```

Language changes must not reinitialize the scanner.

### Phase 8 — scan result

Show localized exhibit image/title/metadata, detected confirmation, View Details, and Scan Again. Camera should already be stopped. Do not auto-advance on a timer.

### Phase 9 — exhibit details

Sections:

```text
Story
Symbolism (only if present)
Gallery (only if present)
```

If only one content section exists, avoid unnecessary tab chrome. Use normal document scrolling, not a small fixed-height text area with its own scrollbar. A simple image grid is preferable to adding a carousel dependency.

### Phase 10 — stabilization

Run full English and Indonesian journeys, mid-flow language switching, scanner lifecycle/error cases, accessibility/manual responsive checks, and performance review.

### Phase 11 — deployment

Static HTTPS deployment; verify real deployed camera permission and all physical expo QR codes on actual target devices. Confirm content/image/translation approvals.

### Phase 12 — collage, optional

Do not start before MVP acceptance. Prefer exhibit-image collage first. Visitor photographs introduce privacy, orientation, image-memory, and browser-canvas concerns and need an explicit product decision.

---

## 16. Accessibility requirements that must not be cut

Even though unit tests are skipped for urgency, do not cut:

- semantic interactive HTML;
- keyboard accessibility where applicable;
- useful accessible names;
- visible focus;
- adequate contrast;
- touch targets appropriate for phones (use approximately 44 × 44 CSS px as the design target);
- semantic heading order;
- error/status announcements where appropriate;
- reduced-motion handling for nonessential animation;
- readable content at narrow width and zoom;
- localized image alt text;
- opaque/readable instruction panels over live camera areas.

Decoration is optional. Usability is not.

---

## 17. Asset strategy

Use the attached asset checklist as the operational authority.

General priorities:

### Batch A — needed for core polished UI

- ornate hand-mirror hero;
- transparent scanner mirror frame;
- limited floral decoration;
- representative exhibit covers;
- approved/localizable font choice/licensing;
- favicon/emblem.

### Batch B — required before launch content acceptance

- actual launch exhibit covers;
- galleries where needed;
- bilingual alt text/captions;
- approved English and Indonesian cultural content;
- credits and usage rights;
- real QR mapping.

### Batch C — polish

- paper texture;
- extra borders/dividers;
- decorative porcelain motifs;
- additional tassels;
- sharing/social assets;
- collage decoration.

Do not block functional scanner work on decorative assets.

---

## 18. Dependency philosophy

Prefer the browser platform and existing dependencies.

Do not add libraries merely because a library exists for the problem.

Known justified candidate:

```text
@zxing/browser
```

for cross-browser QR decoding in the Vite app, introduced at the scanner spike.

Known intentionally unnecessary at the start:

```text
Redux / Zustand
MUI
Tailwind
react-i18next
React Router
Vitest
Testing Library
jsdom
carousel libraries
animation frameworks
```

A future requirement may justify one of these, but make the requirement explicit first.

---

## 19. Git/commit philosophy

Use small commits tied to completed plan parts.

Existing/future commit style examples:

```text
chore(project): remove Vite starter demo content
docs(progress): record phase 0.2 starter cleanup
feat(i18n): add bilingual translation resources
feat(scanner): add browser QR scanner adapter
feat(welcome): build storytelling mirror welcome screen
feat(exhibit): add bilingual exhibit details
chore(release): prepare expo deployment
```

Do not bundle unrelated changes into a phase commit.

If the runner says nothing is staged, treat that as a condition to understand, not a reason to invent a change just to make a commit.

---

## 20. Known user working style

Work with these preferences:

1. **Exactness over invention.** Verify actual repo files and actual backend/QR/device behavior rather than inventing contracts.
2. **Small phases and stop gates.** The user prefers incremental work, clear status, and explicit next steps.
3. **Minimal dependencies.** Choose native/browser features and the smallest viable dependency set.
4. **Legacy behavior can be useful, legacy styling is not authoritative.** The old camera behavior is useful; the Game Boy design was rejected.
5. **Do not over-refactor.** Make the smallest complete change.
6. **Real-device truth matters.** Distinguish frontend code defects from browser/device/platform limitations.
7. **Generate runnable artifacts.** Prefer full `.plan.mjs` files/scripts that can be placed in the repo over long lists of manual edits.
8. **No TypeScript for this project.** Do not migrate it.
9. **No new image/mockup generation unless explicitly requested.** The current concept image is the visual reference; focus on implementation unless asked for generated assets.
10. **When requirements are genuinely unknowable from repo/content, stop at the appropriate gate instead of fabricating data.** But do not ask unnecessary questions when the next phase is fully determined by the attached files.

---

## 21. Required inputs I am attaching

Read all provided files before continuing. I intend to attach at minimum:

```text
AGENTS.md                         (if available on this computer)
run.mjs
plan-template.mjs                (if present)
all current .phase-runner/plans/*.plan.mjs
PROGRESS.md
MASTER-PHASE-PLAN.md
plan.md
assets-checklist.md              (if available)
package.json                     (strongly recommended)
```

If I do not attach `package.json` or the current source files, do not guess exact dependency versions or exact source text. Generate the next plan only when it can safely operate from the known repository state; otherwise tell me the **specific file** needed to make the plan safe.

When I provide terminal output, treat it as stronger evidence about the current run than assumptions from an older plan.

---

## 22. Current historical checkpoint known from the previous conversation

The following happened before this handoff:

1. The Vite React JavaScript starter had already been created.
2. The project was committed; one observed HEAD during an earlier dry run was `9192b81`. Do not assume that is still current.
3. Phase 0.1 dry-run initially failed because local dependencies had not been installed and `eslint` could not be found.
4. `package.json` at that time already declared React, React DOM, Vite, ESLint, and the React ESLint plugins.
5. The advised fix was `npm install`, then `npm run lint`, `npm run build`, then rerun Phase 0.1 normally.
6. A **Phase 0.2 starter-cleanup plan** was generated. It removes Vite demo UI and leaves a minimal Storytelling Mirror placeholder, runs lint/build, commits implementation, appends `PROGRESS.md`, and commits progress.
7. The last Microsoft 365 Copilot instruction was to run:

```powershell
node .phase-runner/run.mjs .phase-runner/plans/phase0.2-starter-cleanup.plan.mjs
```

8. It is **unknown to this handoff whether Phase 0.2 has actually been executed successfully**. Determine that from the attached `PROGRESS.md`, Git history/status, and current repository. Do not assume completion from the presence of the plan file.

This section is historical context only. The attached current files take precedence.

---

## 23. If you have terminal/repository access

Use this execution discipline:

1. `git status --short`
2. inspect `PROGRESS.md`
3. inspect `git log --oneline` for recent phase commits
4. inspect the next plan if it already exists
5. inspect files the plan will modify
6. run the plan from the repository root
7. if it fails, diagnose the exact failure without repeating unchanged commands unnecessarily
8. preserve failed changes for inspection unless the user explicitly decides to revert them
9. run/confirm the required checks
10. ask for manual browser/device confirmation only when the phase actually requires something you cannot observe
11. ensure `PROGRESS.md` accurately distinguishes automated checks from manual checks

Do not run destructive Git commands such as `git reset --hard`, `git clean -fd`, forced checkout, or history rewrites unless the user explicitly asks and understands the consequences.

---

## 24. If you only have chat + attachments

You cannot honestly claim to have run commands. Instead:

1. inspect attached files;
2. determine the next incomplete part;
3. generate the complete next `.plan.mjs` file;
4. give the exact destination path;
5. give one exact PowerShell command needed to run it;
6. wait for my terminal output on the next message;
7. diagnose from that concrete output;
8. never tell me a check passed unless I supplied successful output or you really executed it.

Prefer giving a whole plan file over telling me to manually edit numerous source files.

---

## 25. PowerShell / Windows context

Development is on Windows and commands are normally run from PowerShell, for example:

```powershell
PS D:\Hery\experiment\react-camera-app-chinese-mirror>
```

Write runnable commands accordingly. Avoid giving Bash-only command chains as the primary instructions when a PowerShell-compatible equivalent is simple.

The runner itself is Node ESM (`.mjs`).

---

## 26. Definition of MVP done

MVP is not done until all of these are true:

- React + Vite JavaScript production build succeeds.
- Site is deployed over HTTPS.
- Supported iOS Safari and Android Chrome devices can use the experience.
- EN and ID can be selected throughout the journey.
- Language preference survives reload.
- Language switching does not unnecessarily restart camera or lose exhibit state.
- QR payload is parsed/validated before exhibit lookup.
- Arbitrary scanned URLs are never automatically opened.
- Real expo QR mappings resolve correctly.
- Correct bilingual exhibit content displays.
- Optional content sections do not produce blank tabs.
- Duplicate scans do not duplicate transitions.
- Camera stops after accepted success, Back, unmount, and handled initialization failures.
- A new scanner session works without refreshing.
- Failure states have clear recovery.
- Narrow mobile layouts remain usable.
- accessibility essentials remain intact.
- launch translations/content/images/credits/rights are approved.
- lint and production build pass.
- required manual real-device checks have actually been performed and recorded.

The optional collage is not an MVP blocker.

---

## 27. Final instruction

Do not redesign the plan from scratch. Continue the existing project.

The hierarchy for resolving uncertainty is:

```text
1. My newest explicit instruction
2. Current repository reality / terminal output
3. AGENTS.md coding rules
4. PROGRESS.md completed-state record
5. MASTER-PHASE-PLAN.md roadmap
6. This handoff context
7. plan.md / older planning material
8. Your own default preferences
```

If two sources conflict, identify the conflict briefly and follow the higher-priority source.

Your goal is to move the project forward **one safe, complete, verifiable phase-part at a time**, preferably through `.phase-runner` plans, with minimal dependencies, clean commits, accurate progress records, and no lost project context.

# END OF PROMPT FOR THE NEXT AI

Read STORYTELLING-MIRROR-AI-HANDOFF.md completely first.

All other attached files are the project sources referenced by that
handoff. Follow the "First response protocol" in the handoff exactly.

Do not begin by redesigning the architecture or phase plan.
Determine the current phase from PROGRESS.md and the existing plans,
then continue from there.
