# The Storytelling Mirror — Build Plan

> **Project:** Mobile-first web app for a Peranakan cultural expo  
> **Stack:** React + Vite + JavaScript + CSS  
> **Design direction:** Playful antique Chinese storytelling mirror with red lacquer, carved dark rosewood, antique gold, floral Peranakan details, and hanging silk tassels.

## 1. Product goal

Build a mobile-friendly web app visitors open in their phone browser. They start from an ornate mirror-inspired welcome screen, scan an exhibit's QR code using the phone camera, read the exhibit's cultural story, and optionally make a photo collage as a keepsake.

The interface should feel traditional, warm, playful, and welcoming—not like a modern game console or a generic camera utility. The decoration must never compromise scanning, readability, or touch interaction.

## 2. Scope

### MVP — required

- [ ] Responsive welcome screen.
- [ ] Camera tour screen that requests camera permission and scans QR codes.
- [ ] Exhibit information screen for a recognized QR code.
- [ ] Curated exhibit data stored locally in JavaScript at first.
- [ ] Navigation to scan another exhibit and return to the welcome screen.
- [ ] Loading, permission-denied, no-camera, invalid-code, and unknown-exhibit states.
- [ ] Mobile-first layout, keyboard-accessible controls, visible focus states, and readable contrast.
- [ ] Deploy over HTTPS and test on real iOS Safari and Android Chrome devices.

### Optional — after the MVP works

- [ ] Collage screen using exhibit photos collected during the visit.
- [ ] Take or select an image, arrange/remove images, choose a simple layout, and export/share the result where supported.
- [ ] Optional visitor selfie capture only if the expo explicitly wants it.

### Out of scope unless requested later

- User accounts or login.
- Backend, database, CMS, admin dashboard, or analytics.
- Uploading visitors' images to a server.
- Social feed, likes, comments, gamification, or points.
- Internationalization beyond the language the expo needs at launch.
- Global state libraries, elaborate design systems, or a general-purpose component framework.

**YAGNI rule:** Keep exhibit data local until a real content-management or multi-device update requirement justifies a backend. Build the collage only after the scan-to-information journey works end to end.

## 3. Visitor journey and screen requirements

### Screen 1 — Welcome

**Purpose:** Explain the experience and invite the visitor to begin.

Content and behavior:
- Title: **The Storytelling Mirror**.
- Short explanation: “Scan an exhibit to uncover its story.”
- Main action: **Start Exploring**.
- Ornate mirror visual with hanging tassels as the key brand element.
- Brief camera-use explanation before requesting permission; do not request camera permission on initial page load.

Acceptance criteria:
- A first-time visitor can tell what to do without assistance.
- Start Exploring opens the camera tour.
- Decorative imagery does not push the main action below an unreasonable amount of scrolling on a phone.

### Screen 2 — Camera tour

**Purpose:** Scan the QR code beside an exhibit.

Content and behavior:
- Live rear-camera view, with an ornate but restrained scanning frame.
- Instructions: “Point your camera at the exhibit QR code.”
- Back/close control and a clear retry path.
- Optional flashlight toggle only if supported by the selected scanner and device.
- Stop the camera stream when leaving the screen or after a successful scan.
- Lock scanning after a successful result so the same code cannot trigger repeated navigation.
- Validate the decoded payload before using it to look up exhibit data.

Error states:
- Camera permission denied.
- Camera unavailable or browser does not support camera access.
- Camera starts but no QR code is recognized yet.
- QR content has an unsupported format.
- QR is validly formatted but does not match a known exhibit.

Acceptance criteria:
- The live camera remains visible and the QR target is not covered by ornaments.
- A successful scan leads to the correct exhibit information.
- A failed scan gives an understandable next action rather than a blank screen.
- Camera resources are released when scanning ends.

### Screen 3 — Exhibit information

**Purpose:** Reveal the story behind the scanned artifact.

Content:
- Exhibit name, image, and optional period/origin/category.
- Short summary, followed by the full story.
- Optional **Story**, **Symbolism**, and **Gallery** tabs/sections when content exists.
- **Scan Next Exhibit** as the primary next action.
- **Add to Collage** only when the optional collage feature has been implemented.
- Back action returns to the scanner without requiring a full restart.

Acceptance criteria:
- Unknown exhibit IDs show a friendly not-found state.
- Missing optional copy/images do not break the layout.
- Long text remains readable on small screens.
- The visitor can scan the next exhibit without returning to Welcome.

### Screen 4 — Optional collage

**Purpose:** Let visitors make a personal keepsake from exhibit images.

Smallest useful version:
- Add exhibit images from scanned items; optionally capture or select a photo if approved for the event.
- Display them in one or two predefined collage layouts.
- Remove an image and change the order.
- Export as an image or invoke the native share sheet where the browser supports it.
- Keep processing local in the browser; do not upload photos.
- Show a clear fallback when export/share is unsupported.

Acceptance criteria:
- The collage works with a small, defined maximum number of images.
- The user can remove an image and recover from an export failure.
- The user knows whether the image was saved, shared, or could not be exported.

## 4. Main interaction flow

```text
Welcome
  └── Start Exploring → Camera Tour
        └── QR recognized and validated → Exhibit Information
              ├── Scan Next Exhibit → Camera Tour
              ├── Back → Camera Tour
              └── Add to Collage → Collage (optional)
                    ├── Back to exhibit
                    └── Save / Share
```

Keep navigation simple. Start with local React state for the four-screen flow unless deep links, browser-history behavior, or shareable exhibit URLs become a real requirement. Add a router only when those requirements justify it.

## 5. QR data contract

Use a predictable, documented QR payload format. For the first version, QR values should resolve to a known exhibit identifier (for example, `EXPO-001`), not arbitrary URLs. Validate the scanned value and look it up in the exhibit dataset; never automatically navigate to an arbitrary address found in a QR code.

Example local data record:

```js
{
  id: 'EXPO-001',
  title: 'Peranakan Beaded Slippers',
  period: '19th century',
  summary: 'A short introduction to the exhibit.',
  story: 'Curated historical and cultural information.',
  symbolism: 'The meaning of relevant decorative elements.',
  images: ['/images/beaded-slippers-1.jpg']
}
```

The example content is illustrative. Use approved facts and images supplied by the expo team. Keep optional fields optional, and make missing content safe to render.

If the expo already has printed QR codes, inspect a few real payloads before deciding the final data contract. Do not print new codes until that contract is confirmed.

## 6. Technology decisions

- **React + Vite + JavaScript:** no TypeScript for this project.
- **Styling:** plain CSS with CSS custom properties for shared design tokens. Avoid a UI framework unless a concrete requirement appears.
- **QR scanner:** evaluate `@zxing/browser` as the initial candidate; isolate scanner start/stop and result handling so implementation details do not spread through UI components. Confirm browser support on target phones with a small camera proof-of-concept before building the styled scanner.
- **QR camera requirements:** camera access requires a secure context (HTTPS in deployment; localhost during development) and user permission. Test on actual iOS Safari and Android Chrome.
- **Routing:** no router for the initial single-flow prototype. Add one only if direct links or reliable URL-based navigation is needed.
- **Data:** local JavaScript file first; no backend until required.
- **Tests:** add small tests for QR payload validation, exhibit lookup, and important navigation/error behavior. Test scanner lifecycle on physical devices; automated unit tests cannot fully replace real-camera checks.

References:
- [Ponytail repository and principles](https://github.com/dietrichgebert/ponytail)
- [Ponytail compact project rules (`AGENTS.md`)](https://github.com/DietrichGebert/ponytail/blob/main/AGENTS.md)
- [`@zxing/browser` package and browser scanning examples](https://www.npmjs.com/package/@zxing/browser)

## 7. Design system

### Visual character

- **Mood:** playful, approachable, cultural, warm, tactile, slightly magical.
- **Hero object:** ornate hand mirror with red lacquer, dark carved wood, gold filigree, floral inlays, and a hanging red silk tassel.
- **Peranakan influence:** colorful floral porcelain/beadwork details as accents; avoid making the design look like generic red-and-gold Chinese New Year artwork.
- **Surfaces:** warm ivory or parchment for reading; dark rosewood/red lacquer for frames and emphasis.
- **Motion:** short, subtle transitions; no continuous decorative animation that distracts from scanning or reading. Respect reduced-motion preferences.

### Starting palette

| Token | Hex | Intended use |
|---|---|---|
| `--color-vermilion` | `#B32222` | Main actions and lacquer-red accents |
| `--color-rosewood` | `#4A2E26` | Frame, dark text, deep surfaces |
| `--color-antique-gold` | `#D4AF37` | Fine borders and ornamental detail |
| `--color-warm-ivory` | `#F7EAD9` | Main reading background |
| `--color-peranakan-teal` | `#2C9C8D` | Small floral accents and secondary highlights |
| `--color-blush-pink` | `#E7A7B3` | Floral accent only |
| `--color-text` | `#2A211D` | Body text on light surfaces |

These are starting tokens, not a requirement to use every color on every screen. Prioritize contrast and keep the camera viewport visually quiet.

### Typography

- Use a display serif for page titles and exhibit names.
- Use a highly readable sans-serif for instructions, buttons, and body copy.
- Avoid using decorative calligraphy for essential controls or long paragraphs.
- Load only the font weights/styles actually used.

### Touch and accessibility rules

- Aim for controls at least 44 × 44 CSS pixels.
- Provide visible focus indicators and semantic buttons/labels.
- Never communicate status with color alone.
- Keep text contrast readable over imagery; use solid or sufficiently opaque surfaces behind instructions.
- Respect safe areas on notched phones and keep primary actions away from screen edges.
- Provide accessible labels for icon-only controls.

## 8. Proposed source layout

Start small; do not create empty folders in anticipation of future features.

```text
storytelling-mirror/
├── AGENTS.md
├── plan.md
├── index.html
├── package.json
├── public/
│   └── images/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── exhibits.js
    ├── components/
    │   └── MirrorFrame.jsx       # Only if it is reused by multiple screens
    ├── screens/
    │   ├── WelcomeScreen.jsx
    │   ├── CameraTourScreen.jsx
    │   ├── ExhibitInfoScreen.jsx
    │   └── CollageScreen.jsx     # Add when implementing the optional feature
    ├── lib/
    │   └── qrScanner.js          # Small wrapper around the selected scanner if useful
    └── styles/
        ├── theme.css
        └── global.css
```

The layout is a starting point, not a mandate. Keep a file where it is if moving it would add structure without making the code clearer. Do not create generic `utils`, `hooks`, `services`, or `constants` folders until actual code gives them a purpose.

## 9. Code conventions

- JavaScript and JSX only.
- React function components and hooks; no class components.
- Components: `PascalCase.jsx` and `PascalCase` component names.
- Functions and variables: `camelCase`; use names that describe their purpose.
- CSS classes: `kebab-case`; CSS variables: `--color-...`, `--space-...`, etc.
- Two-space indentation, single quotes, no semicolons, maximum line width around 140 characters.
- Prefer `const`; use `let` only when reassignment is needed. Avoid `var`.
- Keep state near the components that use it. Lift state only when multiple screens genuinely need the same data.
- Keep scan parsing/validation separate from display text and rendering.
- Avoid giant components; split a piece out when it has a distinct responsibility, is reused, or can be tested more clearly.
- Do not add barrel files, wrapper components, custom hooks, context providers, or utility functions just for theoretical reuse.
- Comments explain why something non-obvious is necessary, not what the next line does.
- Do not silence lint rules to make a warning disappear; fix the cause or document the justified exception.

## 10. Ponytail, YAGNI, and review rules

Apply the project `AGENTS.md` on every change.

Before coding:
1. Define the exact user-visible behavior being changed.
2. Read the files and existing callers that the change touches.
3. Identify likely regressions, data-loss risks, security boundaries, and accessibility needs.

While coding:
1. Prefer the smallest complete implementation.
2. Reuse existing code and browser capabilities before adding dependencies.
3. Do not implement speculative flexibility or features that are not in scope.
4. Preserve validation, error handling, cleanup, and accessibility.
5. Add a small test or self-check for non-trivial logic such as QR parsing, branching, and data lookup.
6. If a deliberate shortcut has a known limit, mark it with `shortcut: <the limit>, <when to upgrade>`.

After coding:
1. Run the available lint, test, and production-build commands.
2. Manually check the affected flow at phone width and with keyboard navigation.
3. For scanner changes, test camera permission denial, successful scan, invalid payload, duplicate scan prevention, and stopping the camera after navigation.
4. Summarize what changed, what was tested, what was not checked, and any risk that remains.

Never remove validation at trust boundaries, error handling needed to avoid data loss, security, accessibility, or a requirement explicitly asked for.

## 11. Development milestones

### Milestone 0 — Confirm inputs
- [ ] Confirm the expo's real QR payload format (inspect existing printed codes if available).
- [ ] Collect approved exhibit content and image assets.
- [ ] Define target devices/browsers and whether selfies are allowed in the collage.

### Milestone 1 — Create the Vite project
- [ ] Create a React + JavaScript Vite app.
- [ ] Keep the starter setup unless a concrete need requires changing it.
- [ ] Add project `AGENTS.md` and keep this `plan.md` at the root.
- [ ] Run the starter app and production build.

### Milestone 2 — Camera scanner proof-of-concept
- [ ] Install and try the selected scanner library.
- [ ] Test camera access on iOS Safari and Android Chrome via HTTPS.
- [ ] Confirm rear-camera selection, cleanup, and duplicate-scan behavior.
- [ ] Do not begin detailed scanner ornamentation until this works.

### Milestone 3 — Visual foundation and Welcome
- [ ] Add palette/typography CSS variables and responsive global styles.
- [ ] Implement the mirror/tassel hero visual and welcome call to action.
- [ ] Check narrow and large phone widths.

### Milestone 4 — Camera Tour
- [ ] Implement real camera preview and scan frame.
- [ ] Add permission, unavailable-camera, invalid-code, retry, and stop states.
- [ ] Test on physical devices.

### Milestone 5 — Exhibit Information
- [ ] Create a small sample `exhibits.js` dataset from approved content.
- [ ] Validate QR value and resolve it to an exhibit.
- [ ] Implement the information layout and Scan Next Exhibit path.
- [ ] Test missing and unknown exhibit data.

### Milestone 6 — Stabilize the MVP
- [ ] Check all required flows and error states.
- [ ] Add small automated tests for validation and data lookup.
- [ ] Run lint, tests, and production build.
- [ ] Deploy to HTTPS and test the deployed site.

### Milestone 7 — Optional collage
- [ ] Confirm exact allowed inputs (exhibit images only or visitor photos too).
- [ ] Implement collection, remove/reorder, and a small number of layouts.
- [ ] Export/share and fallback behavior.
- [ ] Test memory use and image output on phones.

## 12. Definition of done

The MVP is ready for expo testing when a visitor can open the HTTPS site on a supported phone, start the camera, scan a real expo QR code, see the correct exhibit information, and scan another exhibit without refreshing. Permission failures, unsupported codes, and unknown exhibits must recover gracefully. The design must remain readable and tappable on small screens, and the camera must stop when it is no longer needed.

The collage is a separate follow-up milestone and is not a blocker for the first working MVP.
