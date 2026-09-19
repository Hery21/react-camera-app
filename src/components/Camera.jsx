import "./styles/Camera.css";

// Pure screen content: just the live video feed and an optional error
// message. All physical buttons now live in Controls, outside the LCD.
export default function Camera({ videoRef, error }) {
  return (
    <div className="camera">
      <video ref={videoRef} />
      {error && <p className="camera-error">{error}</p>}
    </div>
  );
}
