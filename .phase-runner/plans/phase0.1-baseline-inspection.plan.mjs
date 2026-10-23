export default {
  name: 'Phase 0.1 — inspect the Vite starter baseline',
  steps: [
    { type: 'command', label: 'record node version', command: 'node --version' },
    { type: 'command', label: 'record npm version', command: 'npm --version' },
    { type: 'check', label: 'lint starter', command: 'npm run lint' },
    { type: 'check', label: 'build starter', command: 'npm run build' },
    {
      type: 'write',
      label: 'create progress log if missing',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 0.1 — Inspect the starter\n\n**Status:** Complete  \n**Goal:** Establish the existing React + Vite JavaScript baseline before product changes.  \n**User-visible result:** No product behavior changed.  \n**Automated checks:** npm run lint; npm run build.  \n**Unit tests:** Intentionally omitted for this urgent project.  \n**Remaining risks:** Camera, QR decoding, real-device behavior, localization, visual implementation, and real exhibit data are not yet implemented.  \n**Decisions made:** Continue with React + Vite JavaScript and phase-runner automation.  \n**Next part:** Phase 0.2 — remove starter demo content.\n`,
    },
    {
      type: 'commit',
      label: 'commit baseline progress',
      message: 'docs(progress): record phase 0.1 baseline',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}
