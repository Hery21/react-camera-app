import "./styles/QrPopup.css";

// Dumb component: shows the resolved QR text in a centered modal card,
// or renders nothing at all when there's no message to show.
export default function QrPopup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup" role="dialog" aria-modal="true">
        <p>{message}</p>
        <button className="btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
