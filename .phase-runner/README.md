# Storytelling Mirror phase runner

Run plans from the repository root.

```powershell
node .phase-runner/run.mjs .phase-runner/plans/phase0.1-baseline-inspection.plan.mjs --dry-run
node .phase-runner/run.mjs .phase-runner/plans/phase0.1-baseline-inspection.plan.mjs
```

Use `--allow-dirty` only when you deliberately want a plan to run with pre-existing changes. The default is to stop on a dirty working tree so an automated commit does not accidentally include unrelated work.

## Step types

- `write`: create/overwrite a UTF-8 text file. Add `mode: 'append'` to append.
- `replace`: exact text replacement. By default the match must occur exactly once.
- `jsonMerge`: shallow merge of JSON plus a dedicated merge for `scripts`.
- `command`: run a shell command.
- `check`: run a command and stop on a non-zero exit code.
- `commit`: stage explicit `paths` and commit them. `as` stores the resulting short hash for `{{hash.name}}` placeholders.
- `note`: print informational text.

The runner writes logs to `.phase-runner/logs/` and JSON reports to `.phase-runner/reports/`.

## Project verification policy

For this urgent project, unit tests are deliberately omitted from the default runner. Plans should still run the available static/build gates, normally:

```powershell
npm run lint
npm run build
```

Camera, QR decoding, cleanup, and mobile behavior require explicit manual/live checks before their phase is considered complete. Do not automatically commit a camera phase that has only passed a desktop build.
