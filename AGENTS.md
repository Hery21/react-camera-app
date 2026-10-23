# Project Rules — The Storytelling Mirror

These rules apply to every coding task in this repository. They adapt the [Ponytail](https://github.com/dietrichgebert/ponytail) approach: the smallest complete change, never code golf or negligence.

## Before editing

- Read the files that the task touches and trace their callers, related UI, tests, and configuration.
- State the user-visible goal and likely regressions before making a broad change.
- Do not rewrite neighboring code just because you are already editing a file.

## Make the smallest complete change

1. Implement only the behavior the task needs; follow YAGNI.
2. Reuse existing components, browser APIs, and installed dependencies before adding anything.
3. Avoid speculative abstractions, wrapper layers, custom hooks, global state, config, and dependency additions.
4. A small, readable solution is better than a clever one-liner. Do not sacrifice clarity to reduce lines.
5. Complete the whole requested flow, including loading/error states and any callers the change affects.
6. Preserve existing validation and cleanup when moving or merging code.
7. Add a small test or self-check for non-trivial branches, loops, parsers, QR validation, or data lookup.
8. If a deliberate shortcut has a known limitation, leave a brief comment in this form: `shortcut: <the limit>, <when to upgrade>`.
9. Comments explain why a decision is needed; they do not narrate obvious code.

## Never cut

- Validation of QR content before using it to choose an exhibit or destination.
- Error handling that prevents a broken flow or loss of visitor-created images.
- Camera cleanup when leaving the scanner or after a successful scan.
- Keyboard accessibility, useful labels, visible focus, adequate contrast, or the user's explicit requirements.
- Tests/checks for non-trivial logic just to save time.

## JavaScript and React conventions

- Use JavaScript and JSX, not TypeScript.
- Use function components and hooks.
- Component files and component names use `PascalCase`; other JS variables/functions use `camelCase`.
- CSS classes use `kebab-case`; theme tokens use descriptive CSS custom properties.
- Use two-space indentation, single quotes, no semicolons, and a preferred maximum line width of 140 characters.
- Prefer `const`; use `let` only when reassignment is required; never use `var`.
- Keep state local until it genuinely needs to be shared across components/screens.
- Keep QR parsing and exhibit lookup logic out of decorative UI markup.
- Extract a component or helper only when it clarifies a distinct responsibility, is used more than once, or materially improves testing.
- Do not add barrel exports or create empty folders in anticipation of future work.
- Prefer plain CSS and native browser features; add a library only when the requirement justifies it.
- Do not disable lint rules or ignore failed tests merely to make a check pass.

## Review before finishing

- Run the available lint, tests, and production build.
- Check the affected flow on a narrow mobile viewport and using the keyboard.
- When touching scanning, check permission denied, no camera, success, invalid/unknown QR, duplicate detections, and camera teardown.
- Report what changed, what you checked, what you did not check, and any material remaining risk.
