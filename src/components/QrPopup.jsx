import { useMemo } from "react";
import "./styles/QrPopup.css";

const MAX_MESSAGE_LINES = 5;

function splitMessageIntoLines(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

/**
 * Pokemon-style dialogue box: anchored to the bottom of the LCD, on top
 * of whatever's behind it. Shows only a slice of `MAX_MESSAGE_LINES` at a
 * time (App controls `scrollOffset` via the D-pad). Rather than sentence
 * hints, it shows a single blinking indicator glyph: a "more text below"
 * arrow while there's content left to scroll to, or a "press A to close"
 * badge once the end has been reached - exactly one indicator at a time.
 */
export default function QrPopup({ message, scrollOffset = 0 }) {
  const lines = useMemo(() => splitMessageIntoLines(message), [message]);
  const visibleLines = lines.slice(
    scrollOffset,
    scrollOffset + MAX_MESSAGE_LINES,
  );
  const hasMoreBelow = scrollOffset + MAX_MESSAGE_LINES < lines.length;

  if (!message) return null;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup" role="dialog" aria-modal="true">
        <div className="qr-popup-message" aria-live="polite">
          {visibleLines.map((line, index) => (
            <div key={`${line}-${index}`} className="qr-popup-line">
              {line}
            </div>
          ))}
        </div>

        {hasMoreBelow ? (
          <span
            className="qr-popup-indicator qr-popup-more"
            aria-label="More text below, scroll down"
          >
            ▼
          </span>
        ) : (
          <span
            className="qr-popup-indicator qr-popup-close"
            aria-label="Press A to close"
          >
            Ⓐ
          </span>
        )}
      </div>
    </div>
  );
}
