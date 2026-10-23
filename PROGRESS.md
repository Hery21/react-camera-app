
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
