
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
