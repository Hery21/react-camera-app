export default {
  name: 'Phase 5.1 — theme tokens and font loading',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Creates src/styles/theme.css with palette and font-family tokens only. Spacing/radius/shadow tokens deferred to Phase 5.2 when used. Loads Playfair Display + Inter via Google Fonts link in index.html (simple-font decision). Applies tokens minimally in index.css to prove they load. No App.css refactor yet — that is Phase 5.2/5.3.',
    },
    {
      type: 'write',
      label: 'create src/styles/theme.css',
      path: 'src/styles/theme.css',
      content: `// Theme tokens for The Storytelling Mirror.
// Palette is the master-plan starting palette.
// Font-family tokens match the design reference (Playfair Display + Inter via Google Fonts).
// Spacing, radius, shadow tokens are intentionally absent in Phase 5.1 —
// they will be introduced in Phase 5.2 alongside their first real use.
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
}
`,
    },
    {
      type: 'write',
      label: 'rewrite src/index.css to import theme and apply tokens',
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
`,
    },
    {
      type: 'write',
      label: 'add Google Fonts link to index.html',
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f7ead9" />
    <meta
      name="description"
      content="The Storytelling Mirror is a trilingual cultural expo experience. Scan an exhibit QR code to explore its story, symbolism, and gallery."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <title>The Storytelling Mirror — Cultural Expo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit theme tokens and fonts',
      message: 'feat(theme): add palette and font tokens with Google Fonts',
      paths: [
        'src/styles/theme.css',
        'src/index.css',
        'index.html',
      ],
      as: 'theme',
    },
    {
      type: 'write',
      label: 'record phase 5.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 5.1 — Theme tokens and font loading\n\n**Status:** Code complete; manual browser check pending user report  \n**Goal:** Establish the CSS custom-property foundation (palette + font families) and load Playfair Display + Inter via Google Fonts so Phase 5.2 can style the foundation against real tokens instead of hardcoded hex.  \n**Files changed:** src/styles/theme.css (new), src/index.css (rewritten — adds @import theme.css and applies tokens to html/body), index.html (adds preconnect + Google Fonts stylesheet link).  \n**User-visible result:** The page now renders in Inter (body) instead of system Arial, and the warm-ivory background plus dark-text foreground come from tokens. No layout changes. No new UI elements.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted per urgent-policy override. Token definitions are declarative and cannot meaningfully fail in a Node test — they either load or they do not, and that is a browser concern.  \n**Manual checks:** Pending. Required browser check: (1) npm run dev; (2) open http://localhost:5173; (3) DevTools → Elements → :root → confirm --color-vermilion, --color-rosewood, --font-family-display, --font-family-body are all listed; (4) DevTools → Network → confirm request to fonts.googleapis.com/css2?family=Inter... returns 200; (5) DevTools → Computed → confirm html font-family resolves to Inter (or the fallback stack if Inter is still downloading); (6) no console errors about failed font loading.  \n**Not checked:** npm run build (deferred per user request). Font rendering on real iOS Safari / Android Chrome — deferred to Phase 5.4 and Phase 11 device matrix. Deployed Vercel site — needs a redeploy to pick up the font link, not done automatically by this commit.  \n**Remaining risks:** Google Fonts is an external dependency at runtime; if expo devices have restricted network access or a corporate proxy blocks fonts.googleapis.com, the page falls back to Georgia + system sans-serif. That is graceful but changes the visual identity. If this becomes a real risk, self-hosting the .woff2 files in public/fonts/ and swapping the index.html link for an @font-face block is the escape hatch — roughly 30-minute change. Preconnect hints mitigate the DNS/TLS latency. Font loading is async via display=swap, so text renders in the fallback stack immediately and swaps when fonts arrive — this is intentional and prevents FOIT (flash of invisible text).  \n**Decisions made:** Simple-font option locked in — Google Fonts <link> in index.html rather than self-hosted .woff2 files. Rationale: no repo weight, no build step, easy to revert if font licensing ever changes; the master plan already anticipated this decision. Tokens live in src/styles/theme.css rather than at the top of src/index.css so future phases can add components/ or screens/ CSS files that @import theme.css without duplicating. Vite inlines the @import at build time, so there is no runtime request for theme.css. Only palette and font-family tokens are in 5.1 — spacing, radius, shadow, focus, and safe-area tokens are deliberately deferred to Phase 5.2 so each token has a real consumer before it is defined (matches the master plan's \"add tokens only when used\" rule). App.css is NOT refactored to use var(--color-*) references in this phase — that rewrite belongs to Phase 5.2/5.3 when the spike UI is replaced by the production visual foundation. The theme-color meta tag was updated to match --color-warm-ivory's value for consistency.  \n**Next part:** Phase 5.2 — global mobile foundation (box-sizing already done, safe-area insets, base line-height, :focus-visible ring, reduced-motion handling, readable content width on wide screens, spacing tokens introduced when used).  \n**Commit:** {{hash.theme}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 5.1 progress',
      message: 'docs(progress): record phase 5.1 theme tokens',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}