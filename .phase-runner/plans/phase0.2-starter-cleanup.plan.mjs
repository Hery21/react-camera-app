export default {
  name: 'Phase 0.2 — remove Vite starter demo content',
  steps: [
    {
      type: 'write',
      label: 'replace App with minimal Storytelling Mirror placeholder',
      path: 'src/App.jsx',
      content: `import './App.css'\n\nfunction App() {\n  return (\n    <main className="app">\n      <section className="placeholder" aria-labelledby="app-title">\n        <p className="eyebrow">Cultural Expo</p>\n        <h1 id="app-title">The Storytelling Mirror</h1>\n        <p>Scan · Explore · Discover</p>\n      </section>\n    </main>\n  )\n}\n\nexport default App\n`,
    },
    {
      type: 'write',
      label: 'replace starter App styles',
      path: 'src/App.css',
      content: `.app {\n  min-height: 100dvh;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n}\n\n.placeholder {\n  width: min(100%, 32rem);\n  text-align: center;\n}\n\n.placeholder h1 {\n  margin: 0.5rem 0;\n}\n\n.placeholder p {\n  margin: 0;\n}\n\n.eyebrow {\n  font-size: 0.875rem;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n}\n`,
    },
    {
      type: 'write',
      label: 'replace starter global styles',
      path: 'src/index.css',
      content: `* {\n  box-sizing: border-box;\n}\n\nhtml {\n  color-scheme: light;\n  font-family: Arial, Helvetica, sans-serif;\n  background: #f7ead9;\n  color: #2a211d;\n}\n\nbody {\n  margin: 0;\n  min-width: 320px;\n  min-height: 100dvh;\n}\n\nbutton,\ninput,\ntextarea,\nselect {\n  font: inherit;\n}\n`,
    },
    {
      type: 'check',
      label: 'lint cleaned starter',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'build cleaned starter',
      command: 'npm run build',
    },
    {
      type: 'commit',
      label: 'commit starter cleanup',
      message: 'chore(project): remove Vite starter demo content',
      paths: ['src/App.jsx', 'src/App.css', 'src/index.css'],
      as: 'cleanup',
    },
    {
      type: 'write',
      label: 'record phase 0.2 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 0.2 — Remove starter demo content\n\n**Status:** Complete  \n**Goal:** Remove the Vite/React demo UI and leave a minimal Storytelling Mirror baseline.  \n**Files changed:** src/App.jsx, src/App.css, src/index.css.  \n**User-visible result:** A minimal mobile-safe Storytelling Mirror placeholder replaces the Vite starter demo.  \n**Automated checks:** npm run lint; npm run build.  \n**Unit tests:** Intentionally omitted for this urgent project.  \n**Manual checks:** Open the development site and confirm the title and tagline render without console errors.  \n**Not checked:** Camera, QR scanning, localization, final visual design, and real mobile devices.  \n**Remaining risks:** Product functionality is intentionally not implemented yet.  \n**Decisions made:** Keep this phase visually minimal; final theme work remains in Phase 5.  \n**Next part:** Phase 0.3 — project documents and HTML metadata.  \n**Commit:** {{hash.cleanup}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 0.2 progress',
      message: 'docs(progress): record phase 0.2 starter cleanup',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}
