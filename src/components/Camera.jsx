// Dumb component: just renders what it's given, no logic of its own.
export default function Camera({ videoRef, onSnap, error }) {
  return (
    <div className="camera">
      <video ref={videoRef} />
      {error && <p className="camera-error">{error}</p>}
      <button onClick={onSnap}>SNAP!</button>
    </div>
  );
}
