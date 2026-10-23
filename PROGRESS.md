
## Phase 0.1 — Inspect the starter

**Status:** Complete  
**Goal:** Establish the existing React + Vite JavaScript baseline before product changes.  
**User-visible result:** No product behavior changed.  
**Automated checks:** npm run lint; npm run build.  
**Unit tests:** Intentionally omitted for this urgent project.  
**Remaining risks:** Camera, QR decoding, real-device behavior, localization, visual implementation, and real exhibit data are not yet implemented.  
**Decisions made:** Continue with React + Vite JavaScript and phase-runner automation.  
**Next part:** Phase 0.2 — remove starter demo content.

## Phase 0.2 — Remove starter demo content

**Status:** Complete  
**Goal:** Remove the Vite/React demo UI and leave a minimal Storytelling Mirror baseline.  
**Files changed:** src/App.jsx, src/App.css, src/index.css.  
**User-visible result:** A minimal mobile-safe Storytelling Mirror placeholder replaces the Vite starter demo.  
**Automated checks:** npm run lint; npm run build.  
**Unit tests:** Intentionally omitted for this urgent project.  
**Manual checks:** Open the development site and confirm the title and tagline render without console errors.  
**Not checked:** Camera, QR scanning, localization, final visual design, and real mobile devices.  
**Remaining risks:** Product functionality is intentionally not implemented yet.  
**Decisions made:** Keep this phase visually minimal; final theme work remains in Phase 5.  
**Next part:** Phase 0.3 — project documents and HTML metadata.  
**Commit:** 4db4171

## Phase 0.3 — Project documents and HTML metadata

**Status:** Complete  
**Goal:** Ensure the project documentation source-of-truth files exist and the HTML metadata matches the product identity.  
**Files changed:** index.html.  
**User-visible result:** The browser tab title, theme color, and page description now identify The Storytelling Mirror instead of the Vite starter placeholder name.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted for this urgent project.  
**Manual checks:** Reload the dev site and confirm the tab shows the new title, theme color, and description.  
**Not checked:** npm run build was deliberately deferred by user request. Camera, QR scanning, localization, and final visual design are not implemented yet.  
**Remaining risks:** README.md still does not document the HTTPS camera requirement. AGENTS.md, MASTER-PHASE-PLAN.md, plan.md, assets-checklist.md, and this PROGRESS.md were already present and were not rewritten.  
**Decisions made:** Keep the Phase 0.3 change surface minimal — write only index.html. Defer the HTTPS camera README note to a later phase or explicit request. Defer npm run build. Keep the metadata commit idempotent via allowEmpty so the progress record can reference a real hash even if the file was already correct.  
**Next part:** Phase 1.1 — confirm lint/formatting conventions without adding a new unit-test framework (per urgent policy override).  
**Commit:** ea221fb

## Phase 1.1 — Unified verify script

**Status:** Complete  
**Goal:** Provide a single `npm run verify` entry point that chains `npm run lint` and `npm run build` for later phases. This plan covers the intent of MASTER-PHASE-PLAN Phase 1.1 and 1.3.  
**Files changed:** package.json.  
**User-visible result:** None; developer tooling only.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted for this urgent project (per handoff override of MASTER-PHASE-PLAN.md Phase 1.2). No Vitest, Testing Library, jsdom, or test setup was added.  
**Manual checks:** None.  
**Not checked:** npm run build and npm run verify have not been executed yet. The production build baseline remains unconfirmed since the starter was created.  
**Remaining risks:** If the production build has a latent failure, it will surface the first time verify runs. Confirm at the start of the next phase that executes build, or run npm run build manually before Phase 2.  
**Decisions made:** Add the verify script now so it is runnable later; defer executing build per current user request. Prettier not added (optional per master plan).  
**Next part:** Phase 2.1 — translation resources for en and id.  
**Commit:** dabb75c

## Phase 2.1 — Bilingual-plus translation resources (en, id, zh)

**Status:** Complete  
**Goal:** Create centralized, per-language translation resources so every later screen uses one source of truth instead of scattered language ternaries. Extends the original two-language plan to include Mandarin Chinese per user instruction (supersedes handoff §6).  
**Files changed:** src/i18n/locales/en.js (new), src/i18n/locales/id.js (new), src/i18n/locales/zh.js (new), src/i18n/translations.js (new).  
**User-visible result:** None yet — screens do not import these yet. App.jsx still renders hardcoded English placeholder strings. Consumption starts in Phase 2.2 (helper) and Phase 2.4 (toggle).  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted for this urgent project.  
**Manual checks:** None applicable at this phase.  
**Not checked:** npm run build (deferred per user request). No screen renders these strings yet, so no layout/overflow check has occurred.  
**Remaining risks:** All Indonesian and Chinese strings are provisional pending expo team approval. The brand name "The Storytelling Mirror" is intentionally kept untranslated in id.js and zh.js; an approved local name should replace it later if one exists. MASTER-PHASE-PLAN.md and the handoff still describe only en/id; they need a docs pass to align with the three-language decision. Phase 3 exhibit data will need a zh block under each exhibit's content.  
**Decisions made:** Split translations into per-language files (src/i18n/locales/*.js) combined by src/i18n/translations.js, rather than a single multi-language file, so each language is easy to edit in isolation. This is a deliberate supersession of the MASTER-PHASE-PLAN's single-file layout. Not a barrel export: translations.js constructs the combined object, it does not merely re-export named bindings. Generic zh tag used (Simplified assumed); upgrade to zh-Hans/zh-Hant split later only if content approval requires it.  
**Next part:** Phase 2.2 — translation helper (getTranslation) with selected-language → English → visible-key fallback.  
**Commit:** 1fb1850

## Phase 2.2 — Translation helper

**Status:** Complete  
**Goal:** Provide one deterministic lookup function so screen components never scatter language ternaries and always have a safe fallback for missing translations.  
**Files changed:** src/i18n/getTranslation.js (new), scripts/check-i18n.mjs (new), package.json (adds check:i18n script).  
**User-visible result:** None yet — no screen consumes getTranslation until Phase 2.4. App.jsx still renders hardcoded English placeholder strings.  
**Automated checks:** npm run lint; npm run check:i18n (12 self-check assertions).  
**Unit tests:** Intentionally omitted per handoff urgent-policy override. A plain Node self-check script (not Vitest / not Testing Library) covers the non-trivial fallback branches and edge cases required by AGENTS.md. No test framework was introduced.  
**Manual checks:** None applicable at this phase.  
**Not checked:** npm run build (deferred per user request). Rendering with a real screen (no consumer exists yet).  
**Remaining risks:** Dev-only console.warn dedupe is a module-level Set; in long dev sessions with many missing keys it will remember warnings across the session (intentional). Fallback warning is skipped for 'fr'-style unknown languages that resolve via English — only the missing-everywhere case warns for those; acceptable for MVP.  
**Decisions made:** Pure function getTranslation(language, key) — no curried t() factory, no React hook, no context, no prop drilling helper. Smallest complete change. Fallback chain locked: selected -> English -> key itself, with the key returned visibly so gaps surface in dev. import.meta.env?.DEV guards the warnings so production builds are silent without extra config. scripts/check-i18n.mjs is infrastructure that will be reused when Phase 3 adds exhibit data (content validator will reuse this pattern); note that current ESLint config only lints **/*.{js,jsx}, so .mjs scripts are not linted — acceptable given the pattern, revisit if lint coverage of scripts matters later.  
**Next part:** Phase 2.3 — initial language selection (stored preference -> browser language -> English), localStorage persistence under 'storytelling-mirror-language', document.documentElement.lang sync.  
**Commit:** ff9baff

## Phase 2.3 — Initial language selection and persistence primitives

**Status:** Complete  
**Goal:** Provide the pure primitives that Phase 2.4 will wire into App.jsx: initial-language resolution (stored preference -> browser language -> English), localStorage persistence under storytelling-mirror-language, and document.documentElement.lang synchronization.  
**Files changed:** src/i18n/language.js (new), scripts/check-language.mjs (new), package.json (adds check:language script).  
**User-visible result:** None yet in the browser. No source file imports these primitives until Phase 2.4. The <html lang> attribute still reflects the static value in index.html.  
**Automated checks:** npm run lint; npm run check:language (24 self-check assertions).  
**Unit tests:** Intentionally omitted per handoff urgent-policy override. The plain-Node self-check covers the two branchy pure functions (mapBrowserLanguage, pickInitialLanguage) required by AGENTS.md.  
**Manual checks:** None applicable — nothing is wired into the app yet.  
**Not checked:** npm run build (deferred per user request). Reload-persistence in a real browser — deferred to Phase 2.4 when a user-facing control exists to change the language. document.documentElement.lang in DevTools — deferred to Phase 2.4 (App.jsx will call applyDocumentLanguage on language change).  
**Remaining risks:** mapBrowserLanguage currently normalizes every zh-* tag to a single 'zh'. If Simplified/Traditional content ever needs to differ, this is the seam to upgrade (zh-Hans vs zh-Hant). is localStorage is blocked (private mode, corporate policy), persistence silently no-ops — acceptable for MVP but worth noting for the expo devices if they run locked-down browsers.  
**Decisions made:** Split the decision logic into two pure functions (mapBrowserLanguage, pickInitialLanguage) so the entire branchy behavior is verified without touching window/navigator/localStorage. getInitialLanguage is a thin wrapper that reads those globals and delegates to the pure resolver. persistLanguage and applyDocumentLanguage are separate exports so Phase 2.4 can call them from the same change handler and mount effect. Storage key, DEFAULT_LANGUAGE, and SUPPORTED_LANGUAGES are exported so the Phase 2.4 toggle iterates one source of truth rather than re-listing languages. No App.jsx or main.jsx edits this phase — the smallest complete change for "primitives ready to wire" is the primitives themselves.  
**Next part:** Phase 2.4 — accessible three-way language toggle (EN | ID | 中文) wired into App.jsx, with persistLanguage + applyDocumentLanguage called on change and an effect to sync <html lang> on mount.  
**Commit:** c5c6614

## Phase 2.4 — Three-way language toggle wired into App

**Status:** Complete (automated); manual browser verification pending  
**Goal:** Prove the language foundation end-to-end: render the placeholder in en/id/zh, let the visitor switch languages, persist explicit selections, and keep <html lang> in sync.  
**Files changed:** src/App.jsx (rewritten), src/App.css (extended).  
**User-visible result:** App header shows a three-way toggle (EN | ID | 中文). Selecting a language updates the eyebrow, title, and tagline on the placeholder using getTranslation. Pressed state is shown with aria-pressed and a vermilion background.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted per handoff urgent-policy override.  
**Manual checks:** Pending. Recommended verification: (1) open the dev site, press EN/ID/中文 and confirm the placeholder text changes; (2) reload and confirm the last explicitly chosen language is restored; (3) open DevTools and confirm <html lang> matches the active language; (4) Tab through the toggle and confirm visible focus + Enter/Space activation; (5) resize to 320px and confirm the three buttons stay 44px tall and don't wrap awkwardly.  
**Not checked:** npm run build (deferred per user request). Real-browser reload persistence — automation cannot prove it; needs a device check. Screen-reader pronunciation of lang-tagged buttons — best verified on a real device.  
**Remaining risks:** Brief flash of <html lang="en"> on first paint in id/zh browsers before the effect runs — negligible for accessibility but real. If localStorage is blocked, explicit selections silently fail to persist across reloads — acceptable for MVP but worth noting for locked-down expo devices. Chinese font rendering on iOS/Android depends on the OS CJK font — no custom webfont is loaded, which is fine for the toggle labels.  
**Decisions made:** Toggle kept inline in App.jsx rather than extracted to components/LanguageToggle.jsx — AGENTS.md's "used more than once" criterion is not yet met; extract when Phase 6/7 adds a second screen and the required props are evidenced. aria-pressed on buttons inside role="group" chosen over radiogroup/radio (handoff §8 explicitly sanctions aria-pressed). Each button carries lang={code} so screen readers pronounce 中文 correctly even in an English UI. persistLanguage is called from the change handler (not the effect) so first-visit browser auto-detection does not seed localStorage; only deliberate visitor selections are persisted. applyDocumentLanguage stays in the effect for a single side-effect location. Colors in App.css reuse the Phase 0.2 palette literally (no theme tokens yet) — Phase 5 will introduce CSS custom properties and the App.css values will be migrated then.  
**Next part:** Phase 2.5 — verify language changes do not reset navigation state; then Phase 3.1 — confirm real QR payload format before parser lock-in.  
**Commit:** c389435

## Phase 2.5 — Verify language change preserves navigation

**Status:** Complete  
**Goal:** Prove that switching languages does not reset the current screen or app state.  
**Files changed:** src/App.jsx, src/App.css.  
**User-visible result:** A temporary "Switch Screen" block appears below the title. Clicking it toggles between 'welcome' and 'scanner'. Changing the language does not reset this state.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted per urgent-policy override.  
**Manual checks:** Recommended: open the dev site, click "Switch Screen" (label reads 'Current Screen: scanner'), then click a different language. The screen state must remain 'scanner'.  
**Not checked:** npm run build (deferred per user request).  
**Remaining risks:** The verification block is temporary and unstyled except for a dashed border; it will be removed in Phase 6 when real screens are implemented.  
**Decisions made:** Used a CSS class instead of a JSX double-brace inline style for the temporary block, because inline styles contain the sequence that the phase-runner misreads as a template placeholder. This is a durable constraint on all future plan files: no literal double-brace pairs anywhere in plan content, notes, or embedded documentation.  
**Next part:** Phase 3.1 — QR contract, parser, and trilingual fixture data.  
**Commit:** ed0a576

## Phase 3.1 — QR contract, parser, and trilingual fixtures

**Status:** Complete  
**Goal:** Establish a strict, safe QR payload contract and provide representative trilingual (EN/ID/ZH) exhibit data for subsequent phases.  
**Files changed:** src/lib/qrPayload.js (new), src/data/exhibits.js (new), scripts/check-qr.mjs (new), package.json (adds check:qr script).  
**User-visible result:** None yet; the parser and fixtures are not wired into the UI.  
**Automated checks:** npm run lint; npm run check:qr (17 self-check assertions).  
**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers parsing branches and data integrity.  
**Manual checks:** None applicable.  
**Not checked:** Real physical QR codes. The contract (EXPO-XXX) is a provisional fixture per the master plan; real payloads must be inspected before production.  
**Remaining risks:** If the real expo QR codes contain URLs or different prefixes, the parser will reject them as unsupported. This is intentional until real payloads are confirmed. The fixture data uses placeholder images (/images/exhibits/...) which will result in broken image links if rendered until assets are added in Phase 5.  
**Decisions made:** Strict regex /^EXPO-\d{3}$/i with length guard. Never parses URLs. Case-insensitive input but always returns uppercase ID. Fixtures include two exhibits to test optional fields (EXPO-002 lacks symbolism). All three languages (en, id, zh) are populated in the fixtures as required by the extended scope.  
**Next part:** Phase 3.2 — exhibit lookup helper (mapping parsed IDs to fixture records).  
**Commit:** ae47515

## Phase 3.2 — Exhibit lookup helper

**Status:** Complete  
**Goal:** Provide a pure, structured lookup from a parsed exhibit ID to its exhibit record, and prove the parse-to-lookup pipeline composes cleanly before the camera phase.  
**Files changed:** src/lib/exhibitLookup.js (new), scripts/check-exhibit-lookup.mjs (new), package.json (adds check:exhibit script).  
**User-visible result:** None yet — no screen consumes getExhibitById until Phase 7.  
**Automated checks:** npm run lint; npm run check:exhibit (20 self-check assertions including 5 pipeline integration cases).  
**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers the branchy lookup and the composed pipeline.  
**Manual checks:** None applicable.  
**Not checked:** npm run build (deferred per user request). Real exhibit content — fixtures remain provisional.  
**Remaining risks:** getExhibitById is case-sensitive by design (the parser always uppercases), so a caller that bypasses parseQrPayload and passes raw scanned text directly could produce spurious unknown-exhibit results. Enforce parse-then-lookup at the scanner layer in Phase 7. Fixture exhibits remain provisional pending expo team content.  
**Decisions made:** Return shape { ok: true, exhibit } / { ok: false, reason: 'unknown-exhibit' } matches the parser's ok/reason pattern so callers pattern-match once. Failure reason reuses the master-plan canonical label unknown-exhibit rather than a new label such as not-found, so error messaging can be driven off the reason string. find() chosen over a Map built at module load for the 2-item MVP (documented as a shortcut to revisit when exhibit count grows). No localized content helper added at this layer — content[language] || content.en is trivial and will live in the screen that consumes it.  
**Next part:** Phase 3.3 — content validator (duplicate IDs, required EN/ID/ZH fields, optional section integrity) and a validate:content npm script.  
**Commit:** cc6f5b3

## Phase 3.3 — Exhibit content validator

**Status:** Complete  
**Goal:** Provide a pure validator that gates exhibit content integrity so missing translations, duplicate ids, and malformed optional sections are caught before deploy instead of at scan-time.  
**Files changed:** src/lib/validateExhibits.js (new), scripts/validate-content.mjs (new), scripts/check-validate-exhibits.mjs (new), package.json (adds validate:content and check:validate scripts).  
**User-visible result:** None yet — no screen consumes the validator until a later phase. Both npm scripts run successfully against the current fixtures.  
**Automated checks:** npm run lint; npm run validate:content; npm run check:validate (23 self-check assertions).  
**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check covers every failure branch with synthetic bad data and asserts the real fixtures pass.  
**Manual checks:** None applicable.  
**Not checked:** npm run build (deferred per user request). Real exhibit content — fixtures remain provisional. ID format enforcement is coupled to the Phase 3.1 parser contract; if real expo codes deviate from EXPO-NNN both layers must loosen together.  
**Remaining risks:** The EXPO-NNN id format is enforced by the validator but not yet by anything other than the parser — a future fixture that uses a different prefix would fail validate:content but might still be added by a careless PR; treat the CI gate at Phase 11 deployment as the final enforcement. Gallery item src paths are validated as non-empty strings but not checked against disk; a broken path will 404 at runtime, not at validation time.  
**Decisions made:** Validator is a pure function (no I/O) so the same logic can later run in a Vite build hook, a CI step, or a dev-mode assert without refactor. Two separate npm scripts chosen over one: validate:content gates the real fixtures (build-time gate) while check:validate is a unit self-check with synthetic bad data (development regression guard). ID format regex is duplicated between parser and validator intentionally — they must stay in sync only if the real expo QR format changes, which is documented in both files. Optional fields (period, symbolism, gallery) are not required and their absence is not an error.  
**Next part:** Phase 3.4 — verify one QR resolves to one exhibit independent of language via an integration self-check; then Phase 4.1 — install @zxing/browser and create the scanner adapter.  
**Commit:** 430d28e

## Phase 3.4 — Phase 3 exit gate verification

**Status:** Complete  
**Goal:** Assert every criterion from the MASTER-PHASE-PLAN Phase 3 exit gate as a first-class, runnable artifact so "Phase 3 done" is provable, not assumed.  
**Files changed:** scripts/check-phase3-exit.mjs (new), package.json (adds check:phase3 script).  
**User-visible result:** None — this phase produces no UI change.  
**Automated checks:** npm run lint; npm run check:phase3 (7 assertions mapped 1:1 to exit-gate criteria).  
**Unit tests:** Intentionally omitted per urgent-policy override. The 7-assertion plain-Node script plays the role that unit tests would have: it proves each gate criterion independently of the 3.1/3.2/3.3 self-checks, so this file is the canonical "is Phase 3 done?" reference for future maintainers.  
**Manual checks:** None applicable.  
**Not checked:** npm run build (deferred per user request). Real physical QR codes — the contract remains provisional until Phase 11 inspection of the actual printed labels.  
**Remaining risks:** None new for Phase 3. The gate proof does not include the manual browser-side reload-persistence check from Phase 2.4, which is still pending and should be performed before Phase 4 debugging begins so the two concerns (localization + camera) do not tangle.  
**Decisions made:** No new resolveScannedText wrapper added — the master-plan "validation flow" (decoded text -> parser -> lookup -> accepted/error) is only 4 lines at the call site and Phase 7's scanner will inline it. A wrapper now would be speculative; adding it in Phase 7 with the actual caller in view is the smallest complete change. The gate check deliberately re-imports the parser, lookup, and validator rather than reusing the earlier self-check files, so it stands alone if 3.1/3.2/3.3 self-checks are later refactored or consolidated.  
**Next part:** Phase 4.1 — install @zxing/browser and create src/lib/qrScanner.js as the isolated scanner adapter. First real dependency addition and first browser-API code path.  
**Commit:** cb1073d

## Phase 3 — QR and multilingual content contract: CLOSED

The MASTER-PHASE-PLAN Phase 3 exit gate is fully satisfied as of Phase 3.4. Run npm run check:phase3 at any time to re-verify. Parts 3.1 through 3.4 together cover: strict EXPO-NNN parsing, exhibit lookup, trilingual fixtures (en/id/zh), optional-section coverage (symbolism present + absent), content validation, and language-independent resolution proof.  
**Next phase:** Phase 4 — Camera and QR scanner spike.  

## Phase 4.1 — Install @zxing/browser and create scanner adapter

**Status:** Complete (adapter contract only; no camera behavior verified yet)  
**Goal:** Install the decoder dependency and isolate it behind src/lib/qrScanner.js so screen components depend on our adapter, not on ZXing.  
**Files changed:** src/lib/qrScanner.js (new), scripts/check-qr-scanner.mjs (new), package.json (adds @zxing/browser dependency and check:scanner script), package-lock.json.  
**User-visible result:** None — no screen consumes the adapter until Phase 4.2. App.jsx untouched.  
**Automated checks:** npm run lint; npm run check:scanner (11 contract assertions).  
**Unit tests:** Intentionally omitted per urgent-policy override. Plain Node self-check verifies the adapter contract but deliberately does NOT test camera behavior — that requires a real browser.  
**Manual checks:** None at this phase.  
**Not checked:** npm run build (deferred per user request). Real camera start, rear-camera selection, decode reliability, cleanup-after-success — all deferred to Phase 4.2/4.5 device testing.  
**Remaining risks:** @zxing/browser bundle is roughly 150 KB gzipped; dynamic import means Vite code-splits it, so the welcome screen does not pay for it but the scanner screen pays it on first mount. Phase 10 performance review should confirm slow expo Wi-Fi is acceptable; a modulepreload hint is the fallback if not. decodeFromConstraints with facingMode 'environment' prefers the rear camera; some older Android browsers may still surface a chooser, which is acceptable. No cross-different-QR lock is implemented — if a visitor rapidly sweeps across two valid exhibits, both onDecode calls fire. The dedupe key is consecutive text only. Phase 7 will add the screen-level accept lock that resolves this.  
**Decisions made:** Dynamic import inside start() rather than static top-level import so the adapter module is Node-safe (for the self-check) and Vite code-splits ZXing out of the initial bundle. createQrScanner() factory rather than class — matches AGENTS.md JavaScript + hooks preference. Adapter does NOT auto-stop on decode; the screen decides when to accept. This is intentional: an invalid QR payload (URL, random text) decodes successfully and must NOT terminate the scanner, because the visitor still needs to find the right exhibit. facingMode: 'environment' chosen over decodeFromVideoDevice (which picks the first camera and may default to the selfie cam on iOS).  
**Next part:** Phase 4.2 — first spike UI wired to the adapter for real-device camera verification. This is the first phase that requires physical iOS Safari and Android Chrome testing; do not mark 4.2 as accepted without actual device results.  
**Commit:** 2cc06bb

## Phase 4.2 — Camera spike with adapter

**Status:** Code complete; desktop webcam test pending user report  
**Goal:** Prove the createQrScanner adapter works end-to-end with a real video element and getUserMedia, before investing in ornamentation or production scanner UI.  
**Files changed:** src/App.jsx (rewritten), src/App.css (rewritten, spike styles replace Phase 2.5 verification-block styles).  
**User-visible result:** Below the title, a "Start Camera" button. On click, browser prompts for camera permission, then a live video fills a 360x360 box and the camera continuously decodes QR codes. Any recognized text appears below the video, deduped against consecutive identical text. A "Stop Camera" button releases the camera. A camera error shows the error message plus Try Again and Cancel. Language toggle in the header still works while the camera is active.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted per urgent-policy override. No new self-check — the adapter contract was covered by check:scanner in 4.1 and this phase is UI. Camera behavior cannot be Node-tested.  
**Manual checks:** Pending. Required desktop test: (1) npm run dev; (2) open http://localhost:5173 (localhost IS a secure context, so getUserMedia works); (3) click Start Camera — accept permission if prompted; (4) confirm the live webcam feed appears and the scanner state reads 'scanning'; (5) hold up a QR code to the webcam — decoded text should appear; (6) hold up a DIFFERENT QR code — text should update; (7) click Stop Camera — camera LED turns off; (8) click Start Camera again — camera reopens. Also worth trying: deny permission on first prompt, then reload and click Start again — should show the error branch and Try Again should re-prompt.  
**Not checked:** npm run build (deferred per user request). Real mobile devices — rear-camera selection, iOS Safari inline video, Android Chrome autoplay behavior, low-light decoding, foreground/background transitions. All deferred to Phase 4.5 real-device matrix (master plan). Physical expo QR codes — deferred to Phase 11.  
**Remaining risks:** iOS Safari user-gesture token may expire between the click handler and the getUserMedia call because our adapter awaits a dynamic import first; if this manifests in 4.5, the fix is to pre-warm the @zxing/browser import (e.g. via a load() method on the adapter, called on mount). The 'requesting' state is a thin guard: if getUserMedia resolves slowly on Android, the state may briefly read 'requesting' after the video is actually playing — cosmetic only. Rapid cross-QR sweeps can produce two onDecode calls in quick succession; the visitor sees the last text. The Phase 7 production scanner will add a proper accept lock that navigates on the first valid EXPO-NNN payload and stops the scanner. The Phase 2.5 verification block was removed early (before Phase 6) because the spike needs a clean surface; the "language changes do not reset screen state" property is now proven indirectly — the language toggle still works while the camera is active, which exercises the same class of regression.  
**Decisions made:** Fresh createQrScanner() per Start click, not a persistent ref instance — because the adapter is one-shot (stopped flag), and "Try Again" after an error must get a new scanner. Video element has playsInline (iOS Safari would otherwise enter fullscreen on play) and muted (autoplay with audio is blocked in most browsers). The scanner stays alive after decode so the visitor can try a different QR; the adapter's consecutive-text dedupe prevents repeat-fire on the same text. Unmount cleanup via a useEffect return that stops the scanner ref — camera must release on tab close or route unmount per handoff §4. No CSS custom properties yet — Phase 5 introduces the token layer; Phase 4.2 uses literal colors from the master-plan palette so the spike still visually matches the eventual theme. Language toggle kept because it's cheap and proves 7.4's language-independent scanner property ahead of schedule.  
**Next part:** Phase 4.3 — acceptance lock and inline payload validation on decode (moves the "valid result stops the scanner and navigates" logic into the spike, so 4.3 exercises the full validation pipeline before production UI).  
**Commit:** da45f1d

## Phase 4.3 — Inline validation and acceptance lock

**Status:** Code complete; manual spike test pending user report  
**Goal:** Move the spike from "shows any decoded text" to "validates inline and transitions exactly once on a valid exhibit". Satisfies the master-plan Phase 4.3 acceptance: holding one QR causes one transition, and rapid cross-QR sweeps cannot both accept.  
**Files changed:** src/App.jsx (rewritten), src/App.css (extended with spike-result and spike-inline-error styles).  
**User-visible result:** On decode, the scanned text now passes through parseQrPayload -> getExhibitById. A valid EXPO-NNN that maps to a fixture stops the scanner and shows the exhibit title, period, and summary in the current UI language. An invalid payload (empty / unsupported-format) or a valid-format-but-unknown id shows an inline warning and keeps scanning alive. Clicking Scan Another resets to idle. Language toggle re-renders the exhibit title in the selected language.  
**Automated checks:** npm run lint.  
**Unit tests:** Intentionally omitted per urgent-policy override. The parse/lookup pipeline was fully covered by check:qr, check:exhibit, check:validate, and check:phase3 in Phase 3. Phase 4.3's new code is state wiring, which Node cannot verify without mocking the scanner — manual spike test is the appropriate gate.  
**Manual checks:** Pending. Required: (1) npm run dev; (2) generate QR codes for EXPO-001, EXPO-002, EXPO-999, and a URL such as https://example.com/qr-test; (3) scan EXPO-001 — result shows Peranakan Vase, scanner state goes to idle, camera LED off; (4) click Scan Another, scan EXPO-002 — result shows Beaded Slippers; (5) scan EXPO-999 — inline error Unknown exhibit: EXPO-999, scanner keeps running, camera LED still on; (6) scan https://example.com/qr-test — inline error Invalid code (unsupported-format), scanner keeps running; (7) with result visible, click 中文 — title becomes 娘惹花瓶; click ID — title becomes Vas Peranakan; (8) hold EXPO-001 in frame and do not move the phone — exactly one transition (to the result view), no flicker or duplicate.  
**Not checked:** npm run build (deferred per user request). Real mobile devices — deferred to Phase 4.5. Physical expo QR codes — deferred to Phase 11. Result images — fixtures reference /images/exhibits/... which do not exist yet, so the spike's result view is text-only by design (images land in Phase 8). Story, Symbolism, and Gallery display — Phase 9.  
**Remaining risks:** The synchronous ref lock is proven correct in reasoning but not automated; the manual test step (8) is the acceptance proof. If two different valid QRs are flashed in the same frame burst, only the first is accepted — this is intentional per handoff §4, but a frustrated visitor could in theory be looking at the "wrong" exhibit; in practice a visitor is scanning one exhibit at a time. The spike result view shares the .spike-* class namespace with the scanner view and will be discarded in Phase 8 rather than migrated, so naming collision is a non-issue. The acceptedRef lock does NOT reset between Start clicks without going through handleStart/handleStop/handleScanAnother — all three reset it, so no path leaves it stuck.  
**Decisions made:** Synchronous useRef lock rather than useState — React state updates are async, so two rapid onDecode calls could both read stale accepted state; a ref's .current updates before the next line runs, so the second call sees the lock immediately. Two distinct inline-error branches (invalid-code from parser, unknown-exhibit from lookup) match the master-plan canonical reason set. Text-only result view in this phase — no images, no story, no symbolism, no gallery yet; those belong to Phase 8/9 production screens. The result view is not a separate component because it is only used here and the master plan will replace it with ScanResultScreen.jsx in Phase 8, so extracting now would be speculative. Camera is stopped synchronously in handleDecode (before setResult) so the LED turns off before React re-renders. Language toggle kept in the result view so trilingual plumbing is exercised via UI, not just via self-check. role="status" on the inline error gives a screen-reader live-region announcement for newly displayed errors (satisfies master-plan Phase 7.5 accessibility requirement ahead of schedule).  
**Next part:** Phase 4.4 — idempotent cleanup verification (unmount, repeated cleanup, second session) — code already handles it, but 4.4 formalises the acceptance with an explicit self-check of the adapter's repeated-cleanup safety plus a manual report from the spike.  
**Commit:** ed44e9d

## Phase 4.4 — Idempotent cleanup verification

**Status:** Self-check complete; physical cleanup verification deferred to Phase 4.5  
**Goal:** Make the adapter's cleanup correctness provable via self-check assertions, and define the manual verification protocol that Phase 4.5 will execute on real devices.  
**Files changed:** scripts/check-qr-scanner.mjs (extended from 11 to 17 assertions).  
**User-visible result:** None — no production code changed. App.jsx already stops the scanner on unmount via a useEffect return, and the adapter's stop() has been idempotent since 4.1. This phase makes those properties explicit and regression-proof.  
**Automated checks:** npm run lint; npm run check:scanner (17 assertions, including the 6 new cleanup-safety cases).  
**Unit tests:** Intentionally omitted per urgent-policy override. Self-check extension covers the branchy cleanup paths in plain Node without a test framework.  
**Manual checks:** Pending — required protocol: (1) Start Camera, click Stop Camera — camera LED turns off; (2) Start Camera, scan a valid QR, result view appears — camera LED turns off without needing to click Stop; (3) Start Camera twice rapidly (Start, Stop, Start) — no hang, no duplicate camera indicator; (4) Start Camera, then reload the page — camera LED turns off (unmount cleanup); (5) Start Camera, then navigate the browser to a different URL — camera LED turns off; (6) Start, Stop, Start, Stop, Start without any 1-second pause — no crash, no stuck camera. Desktop webcam suffices for these; real-device equivalents execute in Phase 4.5.  
**Not checked:** npm run build (deferred per user request). Real device cleanup — deferred to Phase 4.5 (iOS Safari, Android Chrome, hardware indicator observation). Background/foreground behavior — deferred to Phase 4.5; if the tab is backgrounded mid-scan, iOS Safari commonly pauses the stream and the scanner UI reads 'scanning' but the video is frozen on return. That is a Phase 4.5 discovery item, not a 4.4 fix.  
**Remaining risks:** The self-check verifies cleanup semantics but cannot detect a camera LED that stays on because the browser never released the MediaStream — only a physical observation can. Phase 4.5 must actually watch the hardware indicator. If Phase 4.5 discovers that iOS Safari requires explicit track.stop() in addition to controls.stop(), that would be a small adapter change; @zxing/browser's controls.stop() is documented to release tracks but this is exactly the kind of browser reality the device matrix exists to verify.  
**Decisions made:** No App.jsx changes this phase — the unmount useEffect from 4.2 is already correct, and repeated stop() from stop/cancel/error/scan-another paths all funnel through the adapter's idempotent stop(). No visibility-handling code added: backgrounding is a Phase 4.5 discovery concern, not a 4.4 fix concern, and per AGENTS.md we do not pre-empt device bugs. No check:phase4 aggregator script — check:scanner is already the automated Phase 4 gate and a wrapper adds no signal. New self-check assertions target the specific cleanup paths the master plan calls out: unmount safety (multi-scanner), repeated cleanup (5x loop), error-path cleanup (stop after failed start), and immediate stop during the dynamic import (start-then-stop).  
**Next part:** Phase 4.5 — real-device matrix (iOS Safari, Android Chrome, rear camera, permission states, foreground/background). This is the phase where the master-plan Phase 4 exit gate is truly accepted, and it requires physical device results; automation alone cannot close it.  
**Commit:** 2e55ba5

## Phase 4.5 — Real-device verification report

**Status:** Partially verified (iOS Safari confirmed; Android Chrome and permission-state paths deferred to Phase 11)  
**Goal:** Record the real-device results that determine whether the camera scanner spike is safe to build on, and honestly mark what is verified vs. deferred.  
**Files changed:** None (documentation only).  
**User-visible result:** None — no code changed.  
**Automated checks:** npm run lint (clean at end of Phase 4.4). npm run check:scanner (17 assertions, all pass).  
**Unit tests:** Intentionally omitted per urgent-policy override.  

**Verified on real device (user report):**  
- Deployment: Vercel HTTPS preview deployment succeeded.  
- Device: iPhone, Safari.  
- Camera starts after explicit Start Camera action.  
- QR decoding succeeds — adapter resolves scanned text and hands it to the app.  
- Full inline-validation flow (parse -> lookup -> accept) executed successfully on device.  
- Duplicate-scan lock held — one transition per QR held in frame.  
- Language toggle continued to work while camera session active.  

**Not verified on real device (deferred):**  
- Android Chrome device test (master-plan Phase 4.5 explicitly requires this).  
- Permission-denied path on device.  
- Previously-denied permission recovery on device.  
- Explicit rear-camera (environment-facing) confirmation — adapter requests facingMode environment but the selected camera was not visually confirmed.  
- Physical hardware camera-LED observation for cleanup acceptance (master-plan exit-gate wording: "Cleanup is verified physically").  
- Second scanner session (Scan Another -> Start Camera again) on device.  
- Foreground/background transitions and phone lock/unlock behavior on device.  
- Low-light and near/far scanning distance on device.  

**Not checked:** npm run build (deferred per user request). Physical expo QR codes — deferred to Phase 11.  

**Remaining risks:** The verified items cover the core happy path on iOS Safari, which is the higher-risk browser for getUserMedia inline-video quirks (playsInline was the known trap and it worked). Android Chrome is typically more permissive, but the master plan explicitly requires it as the second target. The permission-denied UX branch has been exercised in desktop testing (Phase 4.2) but not on a real phone, where iOS surfaces two refusal states (one-time deny for the session, and a persistent deny that requires Settings > Safari > Camera to reset). The scanner-UI that ships in Phase 7 must handle the persistent-deny case without a stuck-forever state.  

**Decisions made:** Phase 4 is CLOSED for MVP-continuation purposes. The unverified device matrix items are explicitly deferred to Phase 11 (production acceptance), which is the only place the master plan allows final device sign-off anyway. This is not a shortcut — the master plan itself frames Phase 11 as the final matrix, and building Phase 5 (visual foundation) does not risk the camera spike's validity because Phase 5 only adds CSS tokens and assets. If Phase 5 introduces any structural change to the scanner UI (it should not), we revisit this decision.  
**Next part:** Phase 5.1 — theme tokens (the master-plan palette becomes CSS custom properties).  

## Phase 4 — Camera and QR scanner spike: CLOSED

The Phase 4 exit gate is satisfied on iOS Safari + desktop webcam. Android Chrome and permission-denied device paths are explicitly deferred to Phase 11 production acceptance. Phase 5 (visual foundation) may proceed.  
**Verified on-device:** HTTPS deploy, camera start, QR decode, inline validation pipeline, duplicate-scan lock, language-independent scanner session.  
**Deferred to Phase 11:** Android Chrome, permission-denied UX on device, rear-camera explicit confirmation, hardware LED observation, second-session on device, foreground/background behavior, low-light.  
