import "./styles/Controls.css";

/**
 * Owns every physical button on the console body: the D-pad and the A/B
 * cluster. Deliberately dumb (props in, clicks out) so it can sit outside
 * the screen bezel in App - Camera/PhotoPreview never render buttons
 * themselves, matching how a real Game Boy is built.
 *
 * Only Up/Down are wired to anything (scrolling long QR messages). Left/
 * Right render their arrow glyphs too - for visual symmetry, so the pad
 * reads as one complete, real D-pad rather than "two working arrows and
 * two blank stubs" - but stay non-interactive plain <div>s since the app
 * has no left/right action to wire them to yet.
 */
export default function Controls({
  onUp,
  onDown,
  canScrollUp = false,
  canScrollDown = false,
  onA,
  onB,
  aLabel = "Snap",
  bLabel = "Close",
}) {
  return (
    <div className="gameboy-controls-row">
      <div className="dpad" aria-label="direction pad">
        <div className="dpad-arm dpad-left" aria-hidden="true">
          <span className="dpad-glyph">◀</span>
        </div>
        <button
          type="button"
          className="dpad-arm dpad-up"
          onClick={onUp}
          disabled={!canScrollUp}
          aria-label="Scroll up"
        >
          <span className="dpad-glyph">▲</span>
        </button>
        <div className="dpad-arm dpad-right" aria-hidden="true">
          <span className="dpad-glyph">▶</span>
        </div>
        <button
          type="button"
          className="dpad-arm dpad-down"
          onClick={onDown}
          disabled={!canScrollDown}
          aria-label="Scroll down"
        >
          <span className="dpad-glyph">▼</span>
        </button>
        <div className="dpad-center" aria-hidden="true" />
      </div>

      <div className="ab-cluster" aria-label="action buttons">
        <button
          type="button"
          className="round-btn x-btn"
          onClick={onB}
          aria-label={bLabel}
        >
          X
        </button>
        <button
          type="button"
          className="round-btn y-btn"
          onClick={onA}
          aria-label={aLabel}
        >
          Y
        </button>
      </div>
    </div>
  );
}
