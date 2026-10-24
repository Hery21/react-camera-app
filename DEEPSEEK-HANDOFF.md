# DeepSeek Handoff: The Storytelling Mirror

Use this as the primary continuation prompt. Also attach the live files listed near the end. Do not restart or redesign the project.

## Project

- React + Vite + JavaScript mobile web app.
- Target: portrait mobile browsers, deployed through Vercel.
- Languages: English (`en`), Bahasa Indonesia (`id`), Simplified Chinese (`zh`).
- QR namespace: `PSBIKT-NNN`.
- Real exhibits: `PSBIKT-001` through `PSBIKT-008`.
- `PSBIKT-006` is Catur Cina and currently has the only real cover image.

## Mandatory phase-runner workflow

The project uses `.phase-runner/run.mjs` and `.phase-runner/plans/*.plan.mjs`.

Every implementation plan must:

1. Create/modify source files itself.
2. Run `npm run format`.
3. Run `npm run format:check`.
4. Run all relevant self-checks.
5. Run `npm run lint`.
6. Run `node scripts/diagnose-css.mjs` when CSS changes.
7. Commit the intended files itself.
8. Never run `npm run build` unless the user explicitly changes this rule.
9. Never ask the user to manually format, lint, or commit generated work.
10. Inspect exact current source before using brittle `replace` targets.
11. After a failed plan, preserve the dirty tree, inspect `git status`, `git diff`, and current files, then create one evidence-based recovery plan. Use `--allow-dirty` only for intentional partial phase output.

Normal command:

```powershell
node .phase-runner/run.mjs .phase-runner/plans/<plan>.plan.mjs
```

Recovery command:

```powershell
node .phase-runner/run.mjs .phase-runner/plans/<recovery>.plan.mjs --allow-dirty
```

## Current application states and behavior

`src/App.jsx` currently owns:

```text
welcome
scanner
scan-result
exhibit
```

It also owns language, selected exhibit, and session scan progress.

Current visitor flow:

```text
Welcome -> Scanner -> Scan Result -> Exhibit Article -> Scanner
```

Intended Back behavior:

```text
Scanner Back -> Welcome
Scan Result Back -> Scanner, camera auto-starts
Exhibit top Back -> Scan Result
Exhibit Back to Result -> Scan Result
Exhibit Scan Next -> Scanner, camera auto-starts
```

### Scanner

- Camera auto-starts when ScannerScreen mounts.
- Invalid QR and unknown valid-format PSBIKT QR remain recoverable.
- Valid known exhibit stops camera/scanner before navigation.
- Language changes must not restart camera.
- Camera tracks must stop on exit and accepted scan.
- Scanner is camera-first; decorations must not obstruct QR target.

### Scan Result

- One continuous paper background from top to bottom.
- Language selector is one segmented pill switch.
- Header/content geometry is independent so language changes do not move image vertically.
- Back returns to Scanner.
- Do not reintroduce artifact medallion/pedestal.
- Large exhibit image with warm gold glow.
- Missing image uses intentional exhibit-ID placeholder.
- View Details and Scan Again remain visible in portrait.

### Exhibit Article

- Paged reader, not scrolling article text.
- Uses `ResizeObserver`, `segmentArticleText`, Previous/Next page controls.
- Uses `arrow-left.webp` and `arrow-right.webp`.
- Three font sizes; changing size repaginates.
- Font controls are top-right.
- Language switch is true horizontal center.
- Top Back is arrow-only.
- Story, optional Symbolism, and Gallery tabs.
- Decorative corners must not overlap text.
- Scan Next and Back to Result remain available.

## Content

```text
PSBIKT-001  Lukisan 8 Kuda
PSBIKT-002  Lukisan 9 Koi
PSBIKT-003  Huruf 福 Terbalik
PSBIKT-004  Kalender China
PSBIKT-005  Barongsai
PSBIKT-006  Catur Cina
PSBIKT-007  Mahjong
PSBIKT-008  Altar
```

All eight contain EN/ID/ZH title, summary, and story. English/Chinese should receive human review before final release.

Catur Cina cover:

```text
/images/exhibits/PSBIKT-006/cover.jpg
```

QR parser is case-insensitive and canonicalizes uppercase. `PSBIKT-999` is valid format but unknown.

## Assets

Public assets:

```text
arrow-left.webp
arrow-right.webp
article-crown.webp
article-floral-bottom.webp
button-flourish.webp
divider-gold.webp
floral-corner.webp
mirror.webp
motif-cloud.webp
motif-knot.webp
motif-lattice.webp
motif.webp
paper-bg.webp
red-brocade-bg.webp
images/IKT-icon.gif
images/exhibits/PSBIKT-006/cover.jpg
```

Reader frame assets:

```text
src/assets/frame-tl.webp
src/assets/frame-tr.webp
src/assets/frame-bl.webp
src/assets/frame-br.webp
```

Visual ownership:

```text
Welcome: brocade + mirror + IKT GIF
Scanner: camera + existing scanner corners + QR brackets
Result: paper + floral corner + divider + flourish + image glow
Article: paper + crown + floral bottom + subtle cloud + reader corners
Paged reader: left/right arrows
Gallery: lattice motif
```

## Current scan progress feature

Commit:

```text
d8089c1 feat(progress): track scanned exhibits for the page session
```

- Uses `sessionStorage`.
- Stores only unique known exhibit IDs.
- Duplicate scans do not increase count.
- Invalid/unknown scans do not count.
- Survives same-tab reloads; clears when page session ends.
- Intended visual is bottom-center QR icon plus `n/8`.

### Critical current dirty-state warning

The user ran `phase10.3a-reserve-progress-dock-across-screens.plan.mjs`.

Steps 2–4 succeeded, then step 5 failed because the plan assumed the Welcome CTA still had `top: 72%`.

Likely already modified and uncommitted:

```text
src/components/ScanProgress.jsx
src/styles/scan-progress.css
src/styles/welcome.css
```

A recovery plan exists:

```text
phase10.3b-recover-progress-dock-current-css.plan.mjs
```

It may or may not have been run. First action must be:

```powershell
git status --short
git diff
git log --oneline -15
```

Do not assume the recovery completed. Do not rerun 10.3A blindly.

Intended recovery:

- Preserve manually tuned Welcome mirror and CTA geometry.
- Keep already-applied Welcome reservation for progress dock.
- Move scanner bottom panel/lower corners above progress dock.
- End Scan Result content above progress dock.
- End Exhibit content above progress dock.
- Existing article ResizeObserver should repaginate for reduced space.
- Add/check `npm run check:progress-layout`.
- Format, checks, lint, CSS diagnostic, commit.
- No build.

Expected commit:

```text
fix(layout): reserve scan progress dock across screens
```

## Recent commits at handoff

```text
d8089c1 feat(progress): track scanned exhibits for the page session
f0dcd4c fix(article): move font controls to header and inset reader text
7faa883 report
0543c00 fix(article): restore font controls and reader spacing
de7f964 feat(article): soften paged reader frame and typography
```

Inspect actual current Git history because this may change after handoff.

## Important checks

```text
npm run format
npm run format:check
npm run lint
npm run check:assets
npm run check:mvp
npm run check:flow
npm run check:scanner
npm run check:qr
npm run check:i18n
npm run check:exhibit-content
npm run check:exhibit-languages
npm run check:content-readiness
npm run check:scan-progress
node scripts/check-exhibit-lookup.mjs
node scripts/diagnose-css.mjs
```

Do not trust source-string checks blindly after refactors. Determine whether behavior is broken or the check expects obsolete class/handler names.

# Future roadmap

## Phase 10.3B: finish progress-dock recovery

Only if still pending. Stabilize and commit before new features.

## Phase 10.4: Gallery styling

- Preserve Gallery as Exhibit tab.
- Use `motif-lattice.webp` sparingly.
- Keep localized alt/captions.
- Do not disturb paged Story/Symbolism reader.
- Do not add carousel until a real lightbox exists.

## Phase 10.5: responsive/accessibility acceptance

Test:

```text
320x568
360x640
390x844
430x932
portrait primary
landscape safe
focus styles
touch targets
camera cleanup
all three reader font sizes
language changes without layout jumps
progress dock without overlap
```

# Dev-only admin/content authoring

The user wants an Admin page protected by PIN `6767` for development authoring.

Important: a client-side PIN is not real security. Gate the entire feature with:

```js
import.meta.env.DEV
```

Optionally also require:

```text
VITE_ENABLE_CONTENT_ADMIN=true
```

Never expose the admin page in a normal Vercel production build.

The static browser app cannot safely write source JS/JSX in production. Recommended workflow:

```text
Admin form
-> validates data
-> exports versioned JSON
-> local Node import script reads JSON
-> deterministically updates data source files
-> phase runner formats/checks/lints/commits
```

Prefer this over pretending the browser can save source files.

### Phase 11.1: canonical content schema

Extract reusable pure validation/model code for:

```text
ID / QR
cover path
gallery
EN/ID/ZH title
summary
story
optional symbolism
localized alt/captions
```

Preserve current runtime data shape.

### Phase 11.2: dev-only Admin route + PIN

- `/admin` or admin app state.
- Only rendered when dev gate is enabled.
- PIN `6767`.
- Keep unlocked state in `sessionStorage`.
- Add Lock/Logout.
- Production route/link absent.

### Phase 11.3: Admin exhibit dashboard

- List PSBIKT exhibits.
- Language completeness.
- Cover/gallery status.
- Edit and Add Exhibit.
- Duplicate-ID detection.

### Phase 11.4: Admin edit/add form

- Tabs for EN/ID/ZH.
- title, summary, story, optional symbolism.
- cover/gallery metadata and alt/captions.
- PSBIKT-NNN validation.
- Live preview using current Result/Article components when possible.

### Phase 11.5: export

Export `psbikt-content-export.json` with schema version and validated canonical records.

### Phase 11.6: Node import script

Create `scripts/import-admin-content.mjs`:

- read export path;
- validate;
- reject duplicates;
- preserve ordering;
- update source deterministically;
- avoid unrelated rewrites;
- integrate with phase-runner verification/commit.

### Phase 11.7: Admin acceptance

- Wrong PIN rejected.
- Unlock is session-scoped.
- Production gate verified.
- Add/edit/export/import round-trip.
- Visitor experience unaffected.

# Selection Menu / hub

Welcome CTA should become `Start`, then navigate to a menu:

```text
Tour
Extra Information
Quiz
Photo & Collage
```

### Phase 12.1: state/navigation foundation

- Change localized CTA to Start.
- Add `menu` state.
- Welcome Start -> Menu.
- Menu Back -> Welcome.
- Preserve progress dock.

### Phase 12.2: menu design

- Four semantic touch-friendly cards.
- Trilingual.
- One portrait screen.
- No progress overlap.
- Tour active first; other modules may show Coming Soon temporarily.

### Phase 12.3: Tour integration

- Tour enters current Scanner.
- Preserve existing QR flow.
- Scanner Back during Tour should return to Menu, not Welcome.
- Preserve session scan progress.

# Extra Information module

For cultural material not tied to QR exhibits. Keep separate data schema; do not force it into PSBIKT IDs.

### Phase 13.1: schema

```text
id
slug
category
sort order
en/id/zh title
summary
article blocks
optional cover/gallery
```

### Phase 13.2: index

- Category/list view.
- Paper visual style.
- Trilingual.
- Back to Menu.

### Phase 13.3: reader

- Reuse paged-reader utilities.
- Previous/Next arrows.
- A-/A+ with repagination.
- Centered language switch.
- No QR-specific controls.

### Phase 13.4: Admin support

Add/edit/export/import Extra Information with its own schema/output.

# Quiz module

### Phase 14.1: schema

```text
id
category
en/id/zh question
en/id/zh options with stable option IDs
correct option ID
optional explanation
optional related exhibit/article
```

### Phase 14.2: lobby

Start Quiz, optional category, question count, Back to Menu.

### Phase 14.3: gameplay

- One question per screen.
- Large touch targets.
- Lock selected answer.
- Localized explanation.
- Separate quiz progress.
- Do not reveal correct answer before selection.

### Phase 14.4: results

Score, review, retry, return to Menu. Use sessionStorage unless requirements change.

### Phase 14.5: Admin authoring

Localized question editor, answer validation, export/import.

# Photo and Instagram collage module

Keep photos local by default; no upload unless explicitly requested.

### Phase 15.1: capture

- Separate camera implementation from QR scanner.
- Front/rear selection where supported.
- Capture still image to canvas.
- Retake.
- Stop camera tracks on exit.

### Phase 15.2: template model

```text
id
canvas aspect ratio
photo slots x/y/width/height
frame overlay asset
decorative assets
branding area
```

Output sizes:

```text
1080x1080
1080x1350
```

### Phase 15.3: collage editor

- Captured photos.
- Template choice.
- Pan/zoom/crop within slots.
- Approved decorations.
- Exact-aspect preview.

### Phase 15.4: export/share

- Canvas render.
- PNG/JPEG download.
- Web Share API when supported.
- Download fallback.
- Do not promise universal direct Instagram posting.

### Phase 15.5: privacy/cleanup

- Photos stay in memory.
- Do not store photo blobs in localStorage/sessionStorage.
- Clear/revoke object URLs.
- Stop camera tracks.

### Phase 15.6: optional dev template admin

Export/import frame-template JSON and validate slot bounds/assets.

# State strategy

```text
Language: existing persistence
Tour scanned IDs: sessionStorage
Admin unlocked: sessionStorage, dev-only
Quiz session: sessionStorage
Photos: memory only
Secrets: never client storage
```

Suggested versioned keys:

```text
storytelling-mirror.scanned-exhibit-ids.v1
storytelling-mirror.admin-unlocked.v1
storytelling-mirror.quiz-session.v1
```

# Quality rules

- Preserve accepted behavior unless explicitly changing it.
- Screen-specific CSS stays in its own file.
- `App.css` remains import manifest.
- Decorative images have empty alt text and `pointer-events: none`.
- Content images have localized alt text.
- Buttons remain semantic.
- No decorations overlap article text.
- Portrait actions remain visible.
- Long article text remains paginated.
- Font-size changes repaginate.
- Language changes do not move independent regions.
- Camera streams stop reliably.
- Never fabricate cultural facts or exhibit images.
- PIN 6767 is dev convenience, not real security.
- Never run `npm run build` unless explicitly authorized.

# Attachments DeepSeek should receive

Do not attach only `PROGRESS.md`; live source is essential.

```text
PROGRESS.md
MASTER-PHASE-PLAN.md
AGENTS.md
package.json
.phase-runner/run.mjs
README-phase-runner.md
recent successful phase plan
latest failed and recovery plan

src/App.jsx
src/App.css
src/components/AppShell.jsx
src/components/LanguageToggle.jsx
src/components/ScanProgress.jsx
src/screens/WelcomeScreen.jsx
src/screens/ScannerScreen.jsx
src/screens/ScanResultScreen.jsx
src/screens/ExhibitScreen.jsx
src/styles/app-shell.css
src/styles/welcome.css
src/styles/scanner.css
src/styles/scan-result.css
src/styles/exhibit.css
src/styles/scan-progress.css
src/styles/theme.css
src/data/exhibits.js
src/data/exhibitTranslations.js
src/data/decorativeAssets.js
src/lib/qrPayload.js
src/lib/qrScanner.js
src/lib/getExhibitContent.js
src/lib/scanProgress.js
src/lib/segmentArticleText.js
scripts/check-mvp-integrity.mjs
scripts/check-visitor-flow.mjs
scripts/check-scan-progress.mjs
scripts/diagnose-css.mjs
```

Also provide:

```powershell
git status --short
git diff
git log --oneline -15
```

and screenshots of Welcome, Scanner, Result, and Article in portrait.

# DeepSeek's first task

1. Inspect current Git status and diff.
2. Determine whether 10.3A is partially applied or 10.3B finished.
3. Do not regenerate already-applied files.
4. Finish and commit progress-dock recovery from exact current source.
5. Run format, format check, relevant checks, lint, CSS diagnostics, commit.
6. Do not build.
7. Only after the tree is clean, update `PROGRESS.md` and the master plan with this roadmap.
8. Do not begin Admin/Menu features until progress dock is stable.
