export default {
  name: 'Scan Result visual refactor',
  steps: [
    {
      type: 'note',
      label: 'scope reminder',
      message: 'Refactors ONLY the Scan Result screen. Removes top texts and "Item detected", enlarges the image, adds a glowing halo effect, and applies the paper background and crown/bottom floral assets. Does not touch Welcome, Scanner, or Exhibit screens.',
    },
    {
      type: 'write',
      label: 'update ScanResultScreen.jsx',
      path: 'src/screens/ScanResultScreen.jsx',
      content: `import { getTranslation } from '../i18n/getTranslation.js'

export function ScanResultScreen({ language, exhibit, onViewDetails, onScanAgain }) {
  const content = exhibit.content[language] || exhibit.content.en

  return (
    <section className="scan-result-screen">
      <div className="scan-result-image-wrapper">
        <img src={exhibit.coverImage} alt={content.coverAlt} className="scan-result-image" />
      </div>

      <div className="scan-result-card">
        <h2 className="scan-result-title">{content.title}</h2>
        {content.period && <p className="scan-result-period">{content.period}</p>}
      </div>

      <div className="scan-result-actions">
        <button type="button" className="btn-primary" onClick={onViewDetails}>
          {getTranslation(language, 'scanner.viewDetails') || 'View Details'}
        </button>
        <button type="button" className="btn-secondary" onClick={onScanAgain}>
          {getTranslation(language, 'scanner.scanAnother')}
        </button>
      </div>
    </section>
  )
}
`,
    },
    {
      type: 'write',
      label: 'update scan-result.css',
      path: 'src/styles/scan-result.css',
      content: `.app--scan-result {
  background-color: var(--color-warm-ivory);
  background-image: url('/paper-bg.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.scan-result-screen {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
  padding: 120px 20px 140px;
  text-align: center;
}

/* Top Crown Frame */
.scan-result-screen::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-image: url('/article-crown.webp');
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  z-index: 10;
  pointer-events: none;
}

/* Bottom Floral Frame */
.scan-result-screen::after {
  content: '';
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-image: url('/article-floral-bottom.webp');
  background-size: contain;
  background-position: bottom center;
  background-repeat: no-repeat;
  z-index: 10;
  pointer-events: none;
}

.scan-result-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

/* Glowing halo effect behind the image */
.scan-result-image-wrapper::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, rgba(212, 175, 55, 0) 70%);
  z-index: 0;
  border-radius: 50%;
  animation: pulseGlow 3s infinite alternate ease-in-out;
}

@keyframes pulseGlow {
  from { transform: scale(0.95); opacity: 0.7; }
  to { transform: scale(1.05); opacity: 1; }
}

.scan-result-image {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 15px 25px rgba(74, 46, 38, 0.4));
}

.scan-result-card {
  position: relative;
  z-index: 20;
  background-color: var(--color-surface);
  padding: 16px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(74, 46, 38, 0.15);
  width: 90%;
  max-width: 320px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.scan-result-title {
  font-family: var(--font-family-display);
  color: var(--color-rosewood);
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.scan-result-period {
  color: var(--color-rosewood);
  opacity: 0.8;
  font-size: 0.95rem;
  margin: 6px 0 0;
}

.scan-result-actions {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin-top: 32px;
}

.btn-primary {
  background-color: var(--color-vermilion);
  color: var(--color-surface);
  border: 1px solid var(--color-vermilion-dark);
  padding: 14px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(179, 34, 34, 0.3);
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: var(--color-vermilion-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-rosewood);
  border: 1.5px solid var(--color-rosewood);
  padding: 14px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: rgba(74, 46, 38, 0.05);
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid var(--color-antique-gold);
  outline-offset: 3px;
}
`,
    },
    {
      type: 'check',
      label: 'lint',
      command: 'npm run lint',
    },
    {
      type: 'check',
      label: 'css diagnostic',
      command: 'node scripts/diagnose-css.mjs',
    },
    {
      type: 'commit',
      label: 'commit scan result refactor',
      message: 'style(scan-result): paper bg, glow effect, bigger image, frame assets',
      paths: [
        'src/screens/ScanResultScreen.jsx',
        'src/styles/scan-result.css',
      ],
      as: 'scan-result',
    },
    {
      type: 'write',
      label: 'record progress',
      path: 'PROGRESS.md',
      mode: 'append',
      content: `
## Scan Result visual refactor

**Status:** Code complete; visual check pending user report  
**Goal:** Refactor the Scan Result screen to match the proposal. Remove top texts and "Item detected", enlarge the image, add a pulsing glow, and apply the paper/crown/floral background assets.
**Files changed:** src/screens/ScanResultScreen.jsx (removed texts, cleaned up layout), src/styles/scan-result.css (new layout, paper bg, fixed frame assets, glow animation).
**User-visible result:** The Scan Result screen now has the paper texture background, the ornate crown fixed at the top, and the floral banner fixed at the bottom. The exhibit image is larger, sits in a soft pulsing gold halo, and the title/period are inside a rounded cream card. The "Item detected!" text and top branding are gone.
**Automated checks:** npm run lint; node scripts/diagnose-css.mjs.
**Unit tests:** Intentionally omitted per urgent-policy override.
**Manual checks:** Pending. Required: (1) npm run dev; (2) scan an exhibit; (3) verify the top texts and "Item detected!" are gone; (4) verify the image is significantly larger; (5) verify the glow pulses gently behind the image; (6) verify the crown is at the top of the screen and the floral banner is at the bottom; (7) verify the title card and buttons look elegant and match the proposal.
**Not checked:** npm run build (deferred per user request).
**Remaining risks:** The image uses \`object-fit: contain\` inside an \`aspect-ratio: 1\` container. If the exhibit image is very tall, it will leave empty space on the sides. The fixed crown and bottom floral assets take up screen real estate, so \`padding-top\` and \`padding-bottom\` on the screen are used to prevent overlap with content.
**Decisions made:** Used CSS pseudo-elements on \`.scan-result-screen\` for the crown and bottom frame, and set them to \`position: fixed\` so they frame the viewport regardless of scrolling. Used a CSS \`radial-gradient\` with a \`@keyframes\` animation for the glow effect to keep the DOM clean. Removed the "Item detected" badge and the two top text lines as requested, letting the artifact and its title be the focus. 
**Next part:** User visual verification. Once approved, we can apply the same asset-driven polish to the Exhibit screen.
**Commit:** {{hash.scan-result}}
`,
    },
    {
      type: 'commit',
      label: 'commit progress',
      message: 'docs(progress): record scan result refactor',
      paths: ['PROGRESS.md'],
      as: 'docs',
    },
  ],
}