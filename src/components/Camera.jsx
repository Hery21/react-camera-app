import "./styles/Camera.css";

export default function Camera({ videoRef, onSnap, error }) {
  return (
    <div className="camera">
      <video ref={videoRef} />
      {error && <p className="camera-error">{error}</p>}
      <button className="btn" onClick={onSnap}>
        SNAP!
      </button>
    </div>
  );
}
