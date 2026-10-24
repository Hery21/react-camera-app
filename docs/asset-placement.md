# Styling Asset Contract

This is the implementation-facing summary for the Phase 10 styling refactor. Keep the current flat public paths through MVP stabilization.

## Welcome

- /red-brocade-bg.webp — page background.
- /mirror.webp — dominant wall mirror.
- /images/IKT-icon.gif — branding detail inside the mirror composition.

Do not add unrelated motifs to Welcome during automated styling phases.

## Scanner

Keep the existing scanner frame-corner assets and CSS QR target. The decorative asset collection is not added to the camera target.

## Scan Result

- /paper-bg.webp — surface.
- /artifact-medallion.webp — exhibit image presentation.
- /artifact-pedestal.webp — lower artifact presentation.
- /divider-gold.webp — restrained separator.
- /button-flourish.webp — optional primary-action ornament.
- /floral-corner-tr.webp — optional single corner accent.

## Exhibit Article

- /paper-bg.webp — reading surface.
- /article-crown.webp — article heading ornament.
- /divider-gold.webp — section separator.
- /motif-cloud.webp and /motif-knot.webp — sparse secondary accents.
- /article-floral-bottom.webp — article ending before actions.
- /motif-lattice.webp — gallery/section framing where appropriate.

## Gallery

- /motif-lattice.webp — gallery framing.
- /arrow-left.webp and /arrow-right.webp — reserved for a real lightbox/carousel only.

## Rules

- Functional content wins over decoration.
- Decorative images use empty alt text when rendered in HTML.
- Decorative layers use pointer-events: none.
- Buttons stay semantic HTML controls.
- Do not place ornamental assets over the scanner QR target.
- Do not reorganize public paths during the styling refactor.
