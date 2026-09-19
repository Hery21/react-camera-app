import "./styles/PhotoPreview.css";

// Pure screen content: just the captured-photo canvas. The B button that
// closes this view now lives in Controls, outside the LCD.
export default function PhotoPreview({ photoRef, hasPhoto }) {
  return (
    <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>
      <canvas ref={photoRef} />
    </div>
  );
}
