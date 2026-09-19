export default function PhotoPreview({ photoRef, hasPhoto, onClose }) {
  return (
    <div className={`result ${hasPhoto ? "hasPhoto" : ""}`}>
      <canvas ref={photoRef} />
      <button onClick={onClose}>CLOSE!</button>
    </div>
  );
}
