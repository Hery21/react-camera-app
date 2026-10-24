export default {
  name: 'Phase 1.1 — add unified verify script (build deferred)',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Covers intent of MASTER-PHASE-PLAN Phase 1.1 and 1.3. Phase 1.2 (Vitest) is intentionally skipped per handoff urgent-policy override. Adds npm run verify to package.json but does not execute build in this plan; user requested build deferral.',
    },
    {
      type: 'jsonMerge',
      label: 'add verify script to package.json',
      path: 'package.json',
      value: {
        scripts: {
          verify: 'npm run lint && npm run build',
        },
      },
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'commit',
      label: 'commit verify script',
      message: 'chore(scripts): add unified verify script',
      paths: ['package.json'],
      as: 'scripts',
      allowEmpty: true,
    },
    {
      type: 'write',
      label: 'record phase 1.1 progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `\n## Phase 1.1 — Unified verify script\n\n**Status:** Complete  \n**Goal:** Provide a single \`npm run verify\` entry point that chains \`npm run lint\` and \`npm run build\` for later phases. This plan covers the intent of MASTER-PHASE-PLAN Phase 1.1 and 1.3.  \n**Files changed:** package.json.  \n**User-visible result:** None; developer tooling only.  \n**Automated checks:** npm run lint.  \n**Unit tests:** Intentionally omitted for this urgent project (per handoff override of MASTER-PHASE-PLAN.md Phase 1.2). No Vitest, Testing Library, jsdom, or test setup was added.  \n**Manual checks:** None.  \n**Not checked:** npm run build and npm run verify have not been executed yet. The production build baseline remains unconfirmed since the starter was created.  \n**Remaining risks:** If the production build has a latent failure, it will surface the first time verify runs. Confirm at the start of the next phase that executes build, or run npm run build manually before Phase 2.  \n**Decisions made:** Add the verify script now so it is runnable later; defer executing build per current user request. Prettier not added (optional per master plan).  \n**Next part:** Phase 2.1 — translation resources for en and id.  \n**Commit:** {{hash.scripts}}\n`,
    },
    {
      type: 'commit',
      label: 'commit phase 1.1 progress',
      message: 'docs(progress): record phase 1.1 verify script',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}