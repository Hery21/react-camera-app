# The Storytelling Mirror — Asset Inventory & Checklist

> **Purpose:** Track the visual and content assets needed for the React + Vite web app.
> **Design direction:** Playful antique Chinese storytelling mirror with hanging red tassels, carved rosewood, antique gold, vermilion lacquer, warm ivory, and Peranakan floral details.
>
> **Important:** This inventory is intentionally prioritized. Do not create every item before development. Build the MVP with the smallest set of assets, then add polish when it solves a visible need.

## 1. Asset priorities at a glance

### MVP — needed for the first complete visitor journey

- [ ] Main ornate mirror illustration for the welcome screen.
- [ ] Transparent mirror-frame overlay for the live camera screen.
- [ ] Small brand mark / wordmark, unless the title is rendered as HTML text.
- [ ] One restrained floral ornament or corner decoration.
- [ ] Display image for every real exhibit supported by the app.
- [ ] Optional gallery images for exhibits that have a gallery.
- [ ] Font choices for headings and body text.
- [ ] App favicon.
- [ ] Functional interface icons (use an icon library rather than custom illustrations).
- [ ] QR/exhibit content list supplied or approved by the expo team.

### Later — add only when the core scanner and exhibit screens work

- [ ] Paper / parchment background texture.
- [ ] Additional floral ornaments and decorative dividers.
- [ ] Collage stickers, photo borders, and stamp/seal decorations.
- [ ] Social sharing / exported-collage branding.
- [ ] Empty-state or error illustrations, if plain text and existing ornaments are not enough.
- [ ] Installable web app icons and metadata, if PWA installation is desired.

## 2. Brand and signature illustration assets

| ID  | Asset                           | Priority     | Suggested format                                                     | Notes / acceptance criteria                                                                                                                                                                                                                                  |
| --- | ------------------------------- | ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| B01 | **Hero ornate hand mirror**     | MVP          | Transparent PNG or WebP                                              | Front-facing mirror with lacquer-red accents, dark carved rosewood, antique-gold filigree, colorful floral inlay, and one clearly visible hanging red silk tassel. Isolated from its background so it can sit on ivory or red surfaces.                      |
| B02 | **Camera mirror frame overlay** | MVP          | Transparent PNG/WebP, or SVG if cleanly vectorized                   | A frame with a large transparent opening for the live camera. Decorative details sit at the edges; tassels must not cover the QR targeting area. Keep the center fully transparent. This may be a simplified version of B01, not necessarily the same image. |
| B03 | **Small mirror emblem**         | MVP          | SVG or transparent PNG                                               | Simplified recognizable mirror-and-tassel mark for compact placements. Could be derived from B01 if it remains legible at small sizes.                                                                                                                       |
| B04 | Wordmark / app title lockup     | Nice to have | HTML text + CSS preferred; SVG only if custom lettering is essential | Prefer rendering “The Storytelling Mirror” as accessible HTML text, not baking essential text into an image.                                                                                                                                                 |
| B05 | Isolated tassel ornament        | Later        | Transparent PNG/WebP or SVG                                          | Reusable hanging tassel for small accents or transitions. Skip if the hero/frame already includes one and duplication looks excessive.                                                                                                                       |

### Visual direction for the mirror

- It should read clearly as a **hand mirror with hanging tassels**, not a wall mirror, Game Boy, phone, or generic ornate picture frame.
- Show the handle and tassel wherever the layout gives enough space.
- Keep the visual playful and welcoming rather than dark, spooky, or overly luxurious.
- Use Peranakan-inspired floral inlay as a distinct detail; avoid relying exclusively on generic dragons/clouds/lanterns.
- Keep essential interface text as real text for accessibility and responsive layouts.

## 3. Decorative surfaces and ornaments

| ID  | Asset                            | Priority | Suggested format                                       | Usage                                                                                                                 |
| --- | -------------------------------- | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| D01 | Light parchment / paper texture  | Later    | Small seamless WebP or CSS gradient                    | Background for reading panels or the collage canvas. A plain ivory CSS background is enough for the MVP.              |
| D02 | Dark rosewood texture            | Later    | Small seamless WebP                                    | Use sparingly on the mirror frame or selected header surfaces. A CSS color and shadow may be sufficient.              |
| D03 | Red lacquer texture              | Later    | Small seamless WebP                                    | Accent panel or decorative background, not behind long text.                                                          |
| D04 | Peranakan floral corner ornament | MVP      | SVG if simple; transparent PNG/WebP if painted/complex | One or two reusable corner decorations for welcome and information panels.                                            |
| D05 | Floral divider / separator       | Later    | SVG or CSS                                             | Separates content sections without adding large images. Can be a CSS line with a small floral emblem.                 |
| D06 | Gold filigree border/corner      | Later    | SVG or CSS                                             | Fine decorative corners and thin borders. Keep borders subtle around text and away from the camera's scanning region. |
| D07 | Porcelain floral pattern         | Later    | SVG or seamless WebP                                   | Small accent used in information screens or collage, not a mandatory full-screen background.                          |
| D08 | Paper edge / torn-paper effect   | Optional | CSS or SVG                                             | Only for the collage scrapbook style if it improves the result. Not needed for the initial screens.                   |

**Recommendation:** Start with flat colors and CSS borders/shadows. Add texture only after the layout works; large or repeated textures increase file size and can make text harder to read.

## 4. Functional UI icons

Use a consistent icon library (for example, Lucide) rather than commissioning a separate image for each icon. Decorative frames and colors can make the controls match the theme.

- [ ] Camera / start scanning
- [ ] QR scan target (if needed; the target itself can be drawn with CSS)
- [ ] Back / close
- [ ] Retry / rescan
- [ ] Flashlight toggle, only if scanner support is reliable on target devices
- [ ] Story / book
- [ ] Symbolism / flower or sparkles
- [ ] Gallery / images
- [ ] Add to collage
- [ ] Remove photo
- [ ] Move/reorder photo, if reordering is implemented
- [ ] Save / download
- [ ] Share
- [ ] Camera permission / help
- [ ] Error / information status

Functional icons should remain legible at small sizes. Do not turn an icon-only control into the only way to convey an important action unless it has an accessible label and a sufficiently large touch target.

## 5. Exhibit content assets (provided or approved by the expo team)

This is the largest asset category because every exhibit can need its own photography and written content. Confirm the number of exhibits before collecting or generating images.

### Per-exhibit content checklist

- [ ] Unique exhibit ID used by the QR code.
- [ ] Exhibit title.
- [ ] Main / cover photograph.
- [ ] Short summary for the first result view.
- [ ] Full story / historical context.
- [ ] Symbolism / cultural significance, when known and approved.
- [ ] Period, origin, maker, collection, or category, where relevant and verified.
- [ ] Gallery images (zero or more; do not require a gallery for every exhibit).
- [ ] Image alt text for accessibility.
- [ ] Captions and photo credits, where required.
- [ ] Confirmation that images and text may be used in the expo app.
- [ ] Known QR payload mapped to the correct exhibit ID.

### Suggested content folder convention

```text
public/
  images/
    brand/
      mirror-hero.webp
      mirror-scan-frame.webp
      mirror-mark.svg
      floral-corner.svg
    exhibits/
      expo-001/
        cover.webp
        gallery-01.webp
        gallery-02.webp
      expo-002/
        cover.webp
    collage/
      floral-sticker.svg          # optional
      stamp-sticker.svg            # optional
```

These are suggested names, not files that already exist. Adjust them to the actual number of exhibits and the final asset formats.

### Image preparation guidelines

- Use original expo photography when available; it is usually more accurate and trustworthy than generated images for specific cultural artifacts.
- Make a consistent crop for cover images, while keeping the original image ratio available for galleries when useful.
- Compress images for mobile data usage. Prefer WebP for photographs when supported by the build/deployment path; use SVG for simple vector ornaments and PNG/WebP for transparency.
- Keep high-resolution source files outside the production assets folder if they are only needed for editing.
- Do not use AI-generated images as though they were photographs of actual exhibits or accurate historical objects. If generated decorative art is used, treat it as decoration and review cultural accuracy.

## 6. Optional camera collage assets

The first collage version can be implemented mostly with CSS and the visitor's selected exhibit images. Avoid commissioning many one-off stickers before the interaction is tested.

- [ ] One background style: warm ivory or parchment.
- [ ] One simple photo frame style (CSS border/shadow is enough).
- [ ] Optional floral sticker or corner ornament.
- [ ] Optional small heritage stamp/seal.
- [ ] Optional title/footer lockup for exported collages.
- [ ] A small number of predefined layouts implemented in HTML/CSS, not exported as static template images.
- [ ] Empty collage state using text and an existing mirror/floral ornament.
- [ ] Exported-image branding that stays readable and does not cover the visitor's photos.

Do not make save/share buttons into baked images; they must remain real interactive controls.

## 7. Web/app metadata assets

- [ ] Favicon (SVG or PNG) derived from the mirror emblem.
- [ ] Browser title and description in `index.html`.
- [ ] Open Graph/social preview image, if links will be shared and the expo wants branded previews.
- [ ] Apple touch icon and standard web app icons only if installation/PWA support is a requirement.
- [ ] Optional `manifest.webmanifest` only if PWA installation is deliberately included in scope.

A manifest, service worker, offline cache, push notifications, and install flow are **not** required simply because the site is mobile-friendly. Treat those as a separate decision.

## 8. Typography assets

- [ ] Heading/display font with an elegant, heritage-inspired serif feel.
- [ ] Body/UI font chosen for small-screen readability.
- [ ] Confirm web-use license and permitted deployment method.
- [ ] Load only necessary styles/weights; avoid downloading many weights for decoration.
- [ ] Check fallback fonts and line wrapping on iOS Safari and Android Chrome.

Keep Chinese calligraphy or decorative type as an accent only if the expo content requires it. Essential instructions, exhibit details, and buttons should remain easy to read.

## 9. Things that are not image assets

These are built in code or sourced from exhibit data, so do not create them as static images:

- The live camera feed.
- QR scanning target/corner brackets, if simple CSS is adequate.
- Buttons, tabs, cards, modal panels, and navigation.
- The camera permission dialog (browser-owned; the app can only explain it).
- Loading indicators, retry behavior, and error messages.
- Collage layouts and photo placement.
- QR codes themselves, unless the expo asks us to generate printable QR labels. The existing QR payload format must be confirmed before generating any labels.

## 10. Suggested source-of-truth structure

Keep an inventory in source control so the team can see what exists and what is still needed:

```text
public/images/
  brand/
  exhibits/
  collage/            # add only if optional collage visuals are used
```

Maintain a content record for each exhibit in `src/data/exhibits.js` (or a later data source) with the matching ID and image paths. Store credits and usage notes with the content record or in a companion document if the expo requires them.

## 11. Asset creation order

1. **Confirm exhibit content and QR payloads.** Find out how many QR codes already exist and what each code contains.
2. **Create the two key mirror assets:** welcome hero and transparent camera overlay. These determine how the visual design fits the actual screens.
3. **Collect/approve exhibit cover photos and copy** for a small representative set, then for the full exhibit list.
4. **Choose fonts and build the palette with CSS variables.** Do not bake text or color into illustrations if it should adapt to layout/theme.
5. **Add one or two floral ornaments and a favicon.** Use reusable assets rather than screen-specific images.
6. **Test the scanner with the camera overlay on real phones.** Adjust the transparent opening and ornament placement before creating more decorative art.
7. **Add texture, extra motifs, and collage stickers only after the core flow is usable.**

## 12. Open questions to resolve before final asset production

- [ ] How many exhibits/QR codes are there?
- [ ] Are the QR codes already printed? If yes, inspect actual payload examples before deciding mapping.
- [ ] Will the expo team provide official photographs and approved descriptions?
- [ ] Does each exhibit have multiple gallery images, or only one photo?
- [ ] Which language(s) must the content support?
- [ ] Is the collage definitely in scope for launch, and should it include only exhibit images or visitor selfies too?
- [ ] Is the mirror illustration expected to be a highly detailed photographic render or a stylized illustration?
- [ ] Are there brand guidelines or cultural motifs the expo requires or prohibits?

## 13. MVP exit criteria for assets

Before declaring assets ready for the first release:

- [ ] The welcome mirror image looks like a hand mirror with a visible handle and hanging tassel.
- [ ] The camera frame has a truly transparent central opening and does not obscure QR codes.
- [ ] All launch exhibits have accurate IDs and approved content.
- [ ] Every content image has an appropriate path and useful alt text.
- [ ] Decorative images are optimized for mobile and do not cause slow initial loading.
- [ ] Licenses/permissions for fonts, photographs, and third-party visual assets have been checked.
- [ ] Essential UI text and controls are HTML/CSS, not trapped inside screenshots or background images.
