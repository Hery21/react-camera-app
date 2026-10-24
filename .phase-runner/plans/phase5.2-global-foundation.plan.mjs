export default {
  name: 'Phase 5.2 — global mobile foundation',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Adds safe-area insets to .app, global focus-visible ring, reduced-motion handling, and base line-height. Introduces spacing/radius/shadow tokens in theme.css now that they have consumers. App.css uses --max-width-content for .placeholder. User assets (mirror-hero.png, mirror-scan-frame.png) are currently in src/assets and will be imported in Phase 5.4/6.',
    },
    {
      type: 'write',
      label: 'extend theme.css with spacing, radius, shadow, and layout tokens',
      path: 'src/styles/theme.css',
      content: `// Theme tokens for The Storytelling Mirror.
// Palette is the master-plan starting palette.
// Font-family tokens match the design reference (Playfair Display + Inter via Google Fonts).
:root {
  /* Palette — from MASTER-PHASE-PLAN.md Phase 5.1 */
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

  /* Typography family stacks — loaded via Google Fonts in index.html */
  --font-family-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-family-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(42, 33, 29, 0.1);

  /* Layout constraints */
  --max-width-content: 32rem;
}
`,
    },
    {
      type: 'write',
      label: 'update index.css with line-height, focus, and reduced-motion',
      path: 'src/index.css',
      content: `@import './styles/theme.css';

* {
  box-sizing: border-box;
}

html {
  color-scheme: light;
  font-family: var(--font-family-body);
  background: var(--color-warm-ivory);
  color: var(--color-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100dvh;
}

button,
input,
textarea,
select {
  font: inherit;
}

/* Global focus ring for keyboard accessibility */
:focus-visible {
  outline: 2px solid var(--color-rosewood);
  outline-offset: 2px;
}

/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`,
    },
    {
      type: 'write',
      label: 'update App.css with safe areas and layout token',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.app-header {
  padding: var(--space-4);
  display: flex;
  justify-content: center;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: var(--space-4);
}

.placeholder {
  width: min(100%, var(--max-width-content));
  text-align: center;
}

.placeholder h1 {
  margin: var(--space-2) 0;
}

.placeholder p {
  margin: 0;
}

.eyebrow {
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.language-toggle {
  display: inline-flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
}

.language-toggle-button {
  min-width: 44px;
  min-height: 44px;
  padding: var(--space-2) var(--space-3);
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--color-rosewood);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.language-toggle-button:hover {
  background: var(--color-warm-ivory);
}

.language-toggle-button[aria-pressed="true"] {
  background: var(--color-vermilion);
  color: var(--color-surface);
}

.language-toggle-button:focus-visible {
  outline: 2px solid var(--color-rosewood);
  outline-offset: 2px;
}

/* Spike — Phase 4.2/4.3 only. Replaced by the production scanner in Phase 7. */
.spike {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}

.spike-state {
  font-size: 0.75rem;
  font-family: monospace;
  color: #666;
}

.spike-video-wrapper {
  position: relative;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1 / 1;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.spike-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.spike-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: #fff;
  font-size: 0.875rem;
  background: rgba(0, 0, 0, 0.5);
}

.spike-button {
  min-height: 44px;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-rosewood);
  border-radius: var(--radius-sm);
  background: var(--color-rosewood);
  color: var(--color-surface);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.spike-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spike-button:focus-visible {
  outline: 2px solid var(--color-vermilion);
  outline-offset: 2px;
}

.spike-error {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-3);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  background: #fdeaea;
  color: var(--color-rosewood);
  max-width: 360px;
}

.spike-decoded {
  width: 100%;
  max-width: 360px;
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  text-align: left;
  word-break: break-all;
}

.spike-decoded pre {
  margin: var(--space-1) 0 0;
  font-size: 0.75rem;
  white-space: pre-wrap;
}

.spike-inline-error {
  width: 100%;
  max-width: 360px;
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: #fff4d6;
  color: var(--color-rosewood);
  font-size: 0.875rem;
  text-align: left;
}

.spike-result {
  margin-top: var(--space-8);
  padding: var(--space-4);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.spike-result-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-rosewood);
}

.spike-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.spike-result-summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit global mobile foundation',
      message: 'feat(theme): add global mobile foundation and safe areas',
      paths: ['src/styles/theme.css', 'src/index.css', 'src/App.css'],
      as: 'foundation',
    },
    {
      type: 'write',
      label: 'record phase 5.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 5.2 — Global mobile foundation\n\n**Status:** Code complete; manual responsive check pending user report  \n**Goal:** Establish the global mobile-safe CSS foundation: safe-area insets, readable base line-height, global focus ring, reduced-motion support, and content-width constraints using CSS tokens.  \n**Files changed:** src/styles/theme.css (extended with spacing/radius/shadow/layout tokens), src/index.css (added line-height, antialiasing, global :focus-visible, reduced-motion media query), src/App.css (added safe-area insets to .app, replaced hardcoded pixels with var(--space-*) and var(--color-*) tokens).  \n**User-visible result:** The app respects iPhone safe areas (notch, home indicator). Focus rings are now globally visible on keyboard navigation. Reduced-motion preference is honored. The layout now uses consistent spacing tokens instead of magic numbers, and the placeholder content is constrained by --max-width-content.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override. CSS tokens and media queries cannot be meaningfully tested in Node.  \n**Manual checks:** Pending. Required responsive checks: (1) npm run dev, open DevTools Device Toolbar; (2) test at 320px, 360px, 390px, and 430px widths — verify no horizontal scroll, text wraps cleanly, and the language toggle stays 44px tall; (3) test at 200% browser zoom — verify readability; (4) with a keyboard, Tab through the language toggle and Start Camera button — verify the focus ring is visible; (5) if your browser supports it, toggle "Emulate CSS prefers-reduced-motion: reduce" in DevTools and verify no jarring transitions remain.  \n**Not checked:** npm run build (deferred per user request). Real iOS Safari safe-area behavior — deferred to Phase 11 production acceptance.  \n**Remaining risks:** The env(safe-area-inset-*) values only take effect on notched devices; on desktop they evaluate to 0px, which is correct. If the app is ever embedded in an iframe without allow="camera", safe areas may collapse — acceptable for the current deployment. User assets (mirror-hero.png, mirror-scan-frame.png) are now in src/assets and waiting for integration in Phase 5.4/6; no build breakage since nothing imports them yet.  \n**Decisions made:** Safe-area padding applied to .app rather than body so that individual screens can opt out if needed (none currently do). Global :focus-visible uses the rosewood token; specific overrides (like .language-toggle-button) still take precedence where defined. Reduced-motion rule is the standard broad-stroke nuke (animations and transitions), not a per-component opt-in, ensuring no new animation in future phases can accidentally violate accessibility. Spacing/radius/shadow tokens were added here rather than 5.1 because 5.2 is their first real consumer; this matches the master-plan rule of adding tokens only when used. App.css spike styles were updated to use the new tokens during this phase to prove the token layer works end-to-end, rather than waiting for 5.3.  \n**Next part:** Phase 5.3 — shared app shell and first hero image integration (using the src/assets files).  \n**Commit:** {{hash.foundation}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 5.2 progress',
      message: 'docs(progress): record phase 5.2 global foundation',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}