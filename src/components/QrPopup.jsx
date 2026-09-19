// Dumb component: shows the resolved QR text, or nothing at all.
export default function QrPopup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="qr-popup" role="dialog" aria-modal="true">
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>
  );
}
