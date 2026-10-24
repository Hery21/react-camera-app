export default {
  name: 'Phase 7.1a — scanner screen responsive layout fix',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Pure CSS fix for the scanner-screen overflow. .scanner-screen and .scanner-video-wrapper switch from aspect-ratio driven to flex-fill driven, so the video area takes whatever vertical space remains after header + instructions + controls. The Start Camera / Stop Camera / Try Again / Cancel buttons are always on screen without scrolling at any viewport size. No JSX changes. No new dependencies.',
    },
    {
      type: 'write',
      label: 'rewrite App.css with responsive scanner layout',
      path: 'src/App.css',
      content: `.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.app--welcome {
  background: var(--color-vermilion-dark);
  color: var(--color-surface);
}

.app--scanner {
  background: var(--color-scanner-bg);
  color: var(--color-surface);
}

.app-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
}

.app-header-left {
  display: flex;
  justify-content: flex-start;
}

.app-header-center {
  display: flex;
  justify-content: center;
}

.app-header-right {
  /* spacer keeps the toggle visually centered whether or not the back button is present */
}

.app-header-back {
  min-width: 44px;
  min-height: 44px;
  padding: 0 var(--space-3);
  background: var(--color-surface);
  color: var(--color-rosewood);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.app-header-back:hover {
  background: var(--color-warm-ivory);
}

.app-header-back:focus-visible {
  outline: 2px solid var(--color-antique-gold);
  outline-offset: 2px;
}

.app-main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: var(--space-4);
}

/* Scanner screen overrides the default centered grid: it must fill the
   remaining height so the controls stay on screen. See Phase 7.1a. */
.app--scanner .app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
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
  outline: 2px solid var(--color-antique-gold);
  outline-offset: 2px;
}

/* Welcome screen — Phase 6.1/6.2 */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  width: 100%;
  max-width: var(--max-width-content);
  text-align: center;
}

.welcome-hero {
  width: 100%;
  max-width: min(85vw, 380px);
  height: auto;
  display: block;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.35));
}

.welcome-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  max-width: 28rem;
}

.eyebrow {
  font-size: 0.8125rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-antique-gold);
  margin: 0;
}

.welcome-title {
  font-family: var(--font-family-display);
  font-size: clamp(2rem, 6vw + 0.5rem, 3rem);
  line-height: 1.1;
  margin: 0;
  color: var(--color-surface);
  font-weight: 700;
}

.welcome-tagline {
  font-size: 1rem;
  color: var(--color-surface);
  margin: 0;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.9;
}

.welcome-subtagline {
  font-family: var(--font-family-display);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-antique-gold);
  margin: 0;
  padding-top: var(--space-1);
}

.welcome-explanation {
  font-size: 1rem;
  color: var(--color-surface);
  margin: 0;
  padding-top: var(--space-2);
  line-height: 1.5;
  opacity: 0.92;
}

.welcome-camera-notice {
  font-size: 0.8rem;
  color: var(--color-surface);
  opacity: 0.65;
  margin: 0;
  line-height: 1.4;
}

.welcome-cta {
  min-height: 48px;
  padding: var(--space-3) var(--space-8);
  margin-top: var(--space-3);
  background: var(--color-antique-gold);
  color: var(--color-rosewood);
  border: 2px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.welcome-cta:hover {
  background: #b5952f;
  border-color: #b5952f;
}

.welcome-cta:focus-visible {
  outline: 2px solid var(--color-surface);
  outline-offset: 3px;
}

/* Scanner screen — Phase 7.1a.
   The screen fills available height (flex: 1 1 auto + min-height: 0) so
   the video area shrinks or grows to fit, and the controls below it are
   always visible without scrolling. The video wrapper has no fixed
   aspect-ratio — it takes whatever height remains. object-fit: cover
   on the <video> handles the arbitrary shape gracefully. */
.scanner-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  max-width: 28rem;
  flex: 1 1 auto;
  min-height: 0;
}

.scanner-video-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scanner-overlay-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--color-surface);
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.55);
}

.scanner-instructions {
  width: 100%;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: rgba(26, 18, 16, 0.9);
  color: var(--color-surface);
  font-size: 0.95rem;
  text-align: center;
}

.scanner-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  flex: 0 0 auto;
}

.scanner-button {
  min-height: 44px;
  padding: var(--space-2) var(--space-6);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-pill);
  background: var(--color-antique-gold);
  color: var(--color-rosewood);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.scanner-button:hover {
  background: #b5952f;
  border-color: #b5952f;
}

.scanner-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.scanner-button:focus-visible {
  outline: 2px solid var(--color-surface);
  outline-offset: 3px;
}

.scanner-button-secondary {
  background: transparent;
  color: var(--color-surface);
  border-color: var(--color-surface);
}

.scanner-button-secondary:hover {
  background: rgba(255, 250, 240, 0.1);
  border-color: var(--color-surface);
}

.scanner-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  background: rgba(159, 31, 31, 0.15);
  max-width: 28rem;
}

.scanner-error-message {
  margin: 0;
  color: var(--color-surface);
  font-size: 0.9rem;
  text-align: center;
}

.scanner-inline-error {
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-sm);
  background: rgba(212, 175, 55, 0.15);
  color: var(--color-antique-gold);
  font-size: 0.875rem;
  text-align: center;
}

/* Result card (temporary inline view; Phase 8 extracts ScanResultScreen).
   margin: auto 0 vertically centers safely — collapses to 0 when the
   card exceeds available height so the parent's overflow-y: auto can
   still scroll it. */
.scanner-result {
  margin: auto 0;
  padding: var(--space-4);
  border: 1px solid var(--color-antique-gold);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: 28rem;
}

.scanner-result-meta {
  margin: 0;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-rosewood);
  opacity: 0.6;
}

.scanner-result-title {
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-family-display);
  color: var(--color-rosewood);
}

.scanner-result-period {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-rosewood);
  opacity: 0.7;
}

.scanner-result-summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'css diagnostic',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'commit',
      label: 'commit scanner responsive layout fix',
      message: 'fix(scanner): make layout fill viewport so controls stay visible',
      paths: ['src/App.css'],
      as: 'layout',
    },
    {
      type: 'write',
      label: 'record phase 7.1a progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\\n## Phase 7.1a — Scanner screen responsive layout fix\\n\\n**Status:** Code complete; visual re-check pending user report  \\n**Goal:** Fix the scanner screen overflow where the Start Camera button was pushed below the fold on typical mobile viewports because the video wrapper's aspect-ratio 9/16 combined with a viewport-wide max-width produced a video taller than the available height.  \\n**Files changed:** src/App.css only.  \\n**User-visible result:** On the scanner screen, the video area now fills whatever vertical space remains after the header and controls, so the Start Camera / Stop Camera / Try Again / Cancel buttons are always visible without scrolling at any viewport size or orientation. The video feed keeps covering its container via object-fit: cover, so camera framing still looks correct even though the visible window is not exactly 9:16.  \\n**Automated checks:** npm run lint; node scripts/diagnose-css.mjs.  \\n**Unit tests:** Intentionally omitted per urgent-policy override.  \\n**Manual checks:** Pending. Required: (1) npm run dev; (2) open Welcome, click Start Exploring, confirm the scanner screen shows the video frame and the Start Camera button is visible without scrolling; (3) DevTools responsive mode at 320x568 (iPhone SE), 375x667 (iPhone 8), 390x844 (iPhone 14), 430x932 (iPhone Max) — button must always be visible; (4) DevTools landscape at 812x375 — button still visible, video shrinks but stays readable; (5) click Start Camera → video plays, instructions appear below, Stop Camera button is still visible; (6) 200% zoom at 375px — button still visible; (7) scan a valid QR (EXPO-001) → result card is centered, all content readable; (8) scan an invalid QR → inline error message visible without scrolling.  \\n**Not checked:** npm run build (deferred per user request). Real mobile device layout — deferred to Phase 11. Ornate scanner frame overlay — Phase 7.2.  \\n**Remaining risks:** Because the video wrapper is now arbitrarily shaped (whatever remains after controls), on very short landscape viewports (e.g. 320px tall) the video area may become small. object-fit: cover keeps the camera feed filling the box, but the effective visible camera region shrinks. This is an unavoidable constraint when the button must always be visible — acceptable tradeoff vs. scrolling. The result card uses margin: auto 0 for safe vertical centering; this collapses to zero when content exceeds the viewport so parent overflow-y: auto can still scroll. This is a documented pattern, not a hack.  \\n**Decisions made:** Switched from aspect-ratio-driven layout to flex-fill-driven layout. Aspect-ratio alone cannot respect both a max-width (needed for wide screens) AND a max-height (needed for short screens) simultaneously — one always wins and overflow results. Flex layout with min-height: 0 on the flex children is the smallest complete fix. object-fit: cover was already on the video element, so no video behavior change. Kept the 28rem max-width on .scanner-screen so on desktop the scanner stays mobile-shaped instead of stretching to fill the whole window. Kept the .scanner-result margin: auto 0 pattern for safe vertical centering (as opposed to justify-content: center on the parent, which clips content when it overflows). No new tokens, no new classes beyond what already existed — pure CSS rules update.  \\n**Next part:** Phase 7.2 — add the mirror-scan-frame.png overlay on top of the scanner video. BLOCKED pending confirmation that mirror-scan-frame.png has been chroma-keyed to transparent.  \\n**Commit:** {{hash.layout}}\\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 7.1a progress',
      message: 'docs(progress): record phase 7.1a scanner layout fix',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}