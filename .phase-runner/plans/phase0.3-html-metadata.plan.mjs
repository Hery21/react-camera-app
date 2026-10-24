export default {
  name: 'Phase 0.3 — update HTML metadata',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Docs (AGENTS.md, MASTER-PHASE-PLAN.md, README.md, PROGRESS.md, plan.md, assets-checklist.md) already present; only index.html metadata is missing. npm run build intentionally deferred by user request.',
    },
    {
      type: 'write',
      label: 'update index.html title, description and theme-color',
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
      content="The Storytelling Mirror is a bilingual cultural expo experience. Scan an exhibit QR code to explore its story, symbolism, and gallery."
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
      label: 'commit HTML metadata update',
      message: 'docs(project): update HTML metadata',
      paths: ['index.html'],
      as: 'metadata',
      allowEmpty: true,
    },
    {
      type: 'write',
      label: 'record phase 0.3 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 0.3 — Project documents and HTML metadata\n\n**Status:** Complete  \n**Goal:** Ensure the project documentation source-of-truth files exist and the HTML metadata matches the product identity.  \n**Files changed:** index.html.  \n**User-visible result:** The browser tab title, theme color, and page description now identify The Storytelling Mirror instead of the Vite starter placeholder name.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted for this urgent project.  \n**Manual checks:** Reload the dev site and confirm the tab shows the new title, theme color, and description.  \n**Not checked:** npm run build was deliberately deferred by user request. Camera, QR scanning, localization, and final visual design are not implemented yet.  \n**Remaining risks:** README.md still does not document the HTTPS camera requirement. AGENTS.md, MASTER-PHASE-PLAN.md, plan.md, assets-checklist.md, and this PROGRESS.md were already present and were not rewritten.  \n**Decisions made:** Keep the Phase 0.3 change surface minimal — write only index.html. Defer the HTTPS camera README note to a later phase or explicit request. Defer npm run build. Keep the metadata commit idempotent via allowEmpty so the progress record can reference a real hash even if the file was already correct.  \n**Next part:** Phase 1.1 — confirm lint/formatting conventions without adding a new unit-test framework (per urgent policy override).  \n**Commit:** {{hash.metadata}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 0.3 progress',
      message: 'docs(progress): record phase 0.3 html metadata',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}