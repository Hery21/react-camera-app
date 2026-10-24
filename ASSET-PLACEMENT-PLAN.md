# The Storytelling Mirror — Asset Placement Plan

**Purpose:** Lock down where each existing visual asset belongs before the Phase 10 styling refactor. This document defines ownership, layering, responsive intent, and reuse rules so later screen styling does not become ad hoc.

## 1. Visual system by screen

### Welcome

Primary visual identity: immersive red brocade + large wall mirror.

Layer order:

1. `red-brocade-bg.webp` — full viewport background.
2. `mirror.webp` — dominant wall-mirror composition, reaching or slightly exceeding the smaller viewport dimension.
3. HTML title/copy positioned inside the mirror opening.
4. `/images/IKT-icon.gif` — below the Welcome title inside the mirror opening.
5. Start Scanning CTA positioned in the lower mirror composition.
6. Language toggle floating above the composition.

Do not add the other decorative assets here unless the final mirror composition has an obvious empty region. The mirror already carries substantial ornament.

### Scanner

Primary visual identity: live camera with restrained ornamental guidance.

Keep the already accepted scanner-corner frame assets for the camera overlay. Do not replace the functional QR brackets with decorative assets.

Optional additions only if they do not obstruct camera content:

- `floral-corner.webp` — not recommended by default because the scanner already has four dedicated frame-corner assets.
- `motif-cloud.webp` — do not use by default.
- `motif-knot.webp` — do not use by default.

Scanner priority remains camera visibility and QR recognition.

### Scan Result

Primary visual identity: compact recognition/confirmation card.

Recommended assets:

- `paper-bg.webp` — page/card surface texture.
- `artifact-medallion.webp` — circular decorative surround for the recognized exhibit image when a cover image exists.
- `artifact-pedestal.webp` — beneath the exhibit/medallion to make the recognized object presentation feel intentional.
- `divider-gold.webp` — between detected status/title and action area when spacing permits.
- `button-flourish.webp` — optional decoration behind/around primary `View Details`, not a replacement for the semantic button.
- `floral-corner.webp` — one restrained corner decoration, preferably top-right or bottom-left, with mirrored CSS transform for the opposite corner only if needed.

Avoid:

- `article-crown.webp` here. Reserve it for the article.
- `article-floral-bottom.webp` here. Reserve it for the article ending.

### Exhibit Article

Primary visual identity: readable antique-paper article with decorative top/bottom framing.

Recommended layer order:

1. `paper-bg.webp` — repeating/cover article background texture behind the content surface.
2. `article-crown.webp` — article header ornament above/behind exhibit heading.
3. Exhibit cover image — content asset, not decorative.
4. `divider-gold.webp` — between header metadata and section navigation; may also separate long article blocks sparingly.
5. HTML section navigation — Story / Symbolism / Gallery.
6. Article HTML content.
7. `article-floral-bottom.webp` — decorative ending immediately before the final action region.
8. Scan Next Exhibit / Back to Result buttons.

Secondary motifs:

- `motif-cloud.webp` — small low-opacity decorative accent near Story section headings or article margins.
- `motif-knot.webp` — small symbolic accent near an article metadata/divider area, used once rather than repeated heavily.
- `motif-lattice.webp` — subtle repeat/border treatment for tab/navigation or gallery framing, not behind body text.
- `motif.webp` — generic fallback ornament only when a specific motif does not fit. Avoid using it merely because it exists.
- `floral-corner.webp` — optional article-card corner ornament on wide/tablet layouts; suppress on narrow phones if it crowds text.

### Gallery

Gallery remains part of `ExhibitScreen`, not a new route.

Recommended assets:

- `paper-bg.webp` — inherited from article surface.
- `motif-lattice.webp` — preferred ornamental treatment around gallery tiles or gallery-section boundary.
- `divider-gold.webp` — section separator above Gallery if needed.
- `arrow-left.webp` and `arrow-right.webp` — reserve for a future image lightbox/gallery navigation only. Do not show arrows in the initial grid when there is nothing to paginate.
- `floral-corner.webp` — optional single decorative accent around the gallery section, not on every tile.

### Article/gallery lightbox — only if added

- `arrow-left.webp` — previous image control.
- `arrow-right.webp` — next image control.
- `icons.svg` — use only after inspecting the actual sprite contents and mapping named symbols. Do not guess symbol IDs.

## 2. Asset-by-asset ownership

| Asset                        | Primary owner                            | Secondary use                                           | Do not use for                                           |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `mirror.webp`                | Welcome                                  | None                                                    | Scanner/result/article frame                             |
| `red-brocade-bg.webp`        | Welcome                                  | Potential scanner error background only if ever needed  | Article reading surface                                  |
| `paper-bg.webp`              | Result + Exhibit                         | Gallery inherited surface                               | Camera screen                                            |
| `artifact-medallion.webp`    | Scan Result                              | Potential exhibit article hero frame                    | Welcome                                                  |
| `artifact-pedestal.webp`     | Scan Result                              | Optional article hero decoration on wide layouts        | Scanner                                                  |
| `article-crown.webp`         | Exhibit header                           | None by default                                         | Welcome/Scanner                                          |
| `article-floral-bottom.webp` | Exhibit ending                           | Gallery ending only if article and gallery share ending | Scanner                                                  |
| `divider-gold.webp`          | Exhibit                                  | Scan Result                                             | Repeated after every paragraph                           |
| `floral-corner.webp`         | Result/Article accent                    | Gallery                                                 | Repeated on all four corners of every component          |
| `motif-cloud.webp`           | Article accent                           | Small empty states                                      | Large backgrounds                                        |
| `motif-knot.webp`            | Article metadata/accent                  | Result accent                                           | Repeated pattern                                         |
| `motif-lattice.webp`         | Gallery/tab framing                      | Article edge pattern                                    | Body-text background at normal opacity                   |
| `motif.webp`                 | Generic fallback decoration              | Small section accent                                    | Automatic use when another asset already serves the role |
| `button-flourish.webp`       | Result/Article primary action decoration | Welcome only if later explicitly requested              | Click target by itself                                   |
| `arrow-left.webp`            | Gallery lightbox previous                | Future carousel                                         | App-shell Back button unless intentionally redesigned    |
| `arrow-right.webp`           | Gallery lightbox next                    | Future carousel                                         | App-shell navigation                                     |
| `icons.svg`                  | Shared icon sprite after inspection      | Buttons/status                                          | Guessing undocumented sprite IDs                         |
| `favicon.svg`                | Browser favicon                          | None                                                    | In-page decorative emblem                                |

## 3. Asset hierarchy rules

1. Functional content wins over decoration.
2. Decorative WebP assets use empty alt text when rendered as images.
3. Exhibit photographs use localized meaningful alt text.
4. Decorative assets must use `pointer-events: none` unless the asset itself is inside a semantic interactive control.
5. Buttons remain real HTML buttons. Decorative button artwork sits behind/inside them and never becomes the only click target.
6. Decorative assets should not contain essential text.
7. Do not place texture or motifs at opacity that reduces article readability.
8. Do not add all assets to every screen. Each screen gets a small visual vocabulary.
9. Reuse by CSS transform is acceptable for symmetric decorative corners/arrows only when the artwork still looks intentional.
10. Keep decorative layers out of the scanner QR target.

## 4. Proposed CSS ownership after refactor

```text
src/styles/
  theme.css              tokens only
  app-shell.css          global screen shell/header/language toggle
  welcome.css            mirror + brocade + Welcome-only composition
  scanner.css            camera + QR target + scanner overlays
  scan-result.css        paper + medallion + pedestal + detected result
  exhibit.css            article + crown + dividers + motifs + bottom flourish
  gallery.css            gallery grid + future lightbox + arrow controls
```

`App.css` should remain only an import manifest.

## 5. Public asset organization recommendation

Before the refactor, reorganize decorative assets by purpose while preserving public-root URLs:

```text
public/
  brand/
    favicon.svg
    icons.svg
  backgrounds/
    red-brocade-bg.webp
    paper-bg.webp
  welcome/
    mirror.webp
  ornament/
    floral-corner.webp
    divider-gold.webp
    motif-cloud.webp
    motif-knot.webp
    motif-lattice.webp
    motif.webp
    button-flourish.webp
  article/
    article-crown.webp
    article-floral-bottom.webp
    artifact-medallion.webp
    artifact-pedestal.webp
  controls/
    arrow-left.webp
    arrow-right.webp
  images/
    IKT-icon.gif
    exhibits/
      PSBIKT-006/
        cover.jpg
```

If moving public files creates unnecessary churn this late, keep the current flat public paths for the MVP and treat the folder structure above as post-release cleanup. Do not move assets and restyle screens in the same phase unless every URL reference is updated and checked together.

## 6. Refactor phases

### Phase 10.2A — Asset inventory and path contract

- Verify every listed file exists.
- Inspect `icons.svg` to learn actual symbol IDs before using it.
- Decide whether to keep public paths flat for MVP or reorganize.
- Add a lightweight script that verifies all decorative paths referenced by CSS/JS exist.
- No visible styling change.

### Phase 10.2B — Scan Result visual refactor

- Apply `paper-bg.webp`.
- Add `artifact-medallion.webp` around/behind real exhibit covers.
- Add `artifact-pedestal.webp` beneath the artifact area.
- Add `divider-gold.webp` and restrained `button-flourish.webp` as appropriate.
- Ensure missing-cover exhibits still look intentional without an empty/broken frame.
- Preserve all result actions and language behavior.

### Phase 10.2C — Exhibit Article visual refactor

- Apply paper texture.
- Add `article-crown.webp` to heading area.
- Use `divider-gold.webp` sparingly.
- Add low-density cloud/knot motifs.
- Add `article-floral-bottom.webp` before actions.
- Maintain a clean readable text column.

### Phase 10.2D — Gallery visual refactor

- Move Gallery-specific CSS to `gallery.css`.
- Add lattice treatment around the gallery region/tiles.
- Keep the initial gallery as a simple responsive grid.
- Do not add arrow assets until an actual lightbox/carousel interaction exists.

### Phase 10.2E — Shared responsive/accessibility polish

- Check ornament collisions at 320, 360, 390, and 430 CSS px widths.
- Check landscape.
- Check 200% article zoom.
- Verify decorative assets do not become focusable or announced.
- Verify action controls retain at least the project touch-target size.
- Run format, format check, project self-checks, lint, and CSS diagnostics. No build unless explicitly re-enabled.

## 7. Final screen vocabulary

```text
WELCOME
red brocade + wall mirror + localized HTML copy + IKT icon

SCANNER
live camera + existing scanner corners + functional gold QR brackets

SCAN RESULT
paper + medallion + artifact + pedestal + gold divider + action flourish

EXHIBIT
paper + article crown + localized content + sparse motifs + floral bottom

GALLERY
article paper surface + lattice framing + real exhibit images
```

This is the visual contract to preserve during the styling refactor.
