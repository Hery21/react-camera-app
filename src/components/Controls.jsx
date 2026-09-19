import "./styles/Controls.css";

/**
 * Owns every physical button on the console body: the D-pad and the A/B
 * cluster. Deliberately dumb (props in, clicks out) so it can sit outside
 * the screen bezel in App - Camera/PhotoPreview never render buttons
 * themselves, matching how a real Game Boy is built.
 *
 * Only Up/Down are wired to anything (scrolling long QR messages); Left/
 * Right/the center hub are rendered as plain, non-interactive elements so
 * the D-pad reads as a complete cross shape without adding dead buttons
 * that do nothing when pressed.
 */
export default function Controls({
  onUp,
  onDown,
  canScrollUp = false,
  canScrollDown = false,
  onA,
  onB,
  aLabel = 'Snap',
  bLabel = 'Close',
}) {
  return (
    <div className="gameboy-controls-row">
      <div className="dpad" aria-label="direction pad">
        <div className="dpad-arm dpad-left" aria-hidden="true" />
        <button
          type="button"
          className="dpad-arm dpad-up"
          onClick={onUp}
          disabled={!canScrollUp}
          aria-label="Scroll up"
        >
          ▲
        </button>
        <div className="dpad-arm dpad-right" aria-hidden="true" />
        <button
          type="button"
          className="dpad-arm dpad-down"
          onClick={onDown}
          disabled={!canScrollDown}
          aria-label="Scroll down"
        >
          ▼
        </button>
        <div className="dpad-center" aria-hidden="true" />
      </div>

      <div className="ab-cluster">
        <button type="button" className="round-btn b-btn" onClick={onB} aria-label={bLabel}>
          B
        </button>
        <button type="button" className="round-btn a-btn" onClick={onA} aria-label={aLabel}>
          A
        </button>
      </div>
    </div>
  );
}
