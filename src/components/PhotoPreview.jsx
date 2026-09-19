import "./styles/PhotoPreview.css";

export default function PhotoPreview({ photoRef, hasPhoto, onClose }) {
  return (
    <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>
      <canvas ref={photoRef} />
      <button className="btn" onClick={onClose}>
        CLOSE!
      </button>
    </div>
  );
}
