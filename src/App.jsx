import { useCallback, useRef, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { useQrScanner } from "./hooks/useQrScanner";
import { resolveQrMessage } from "./utils/resolveQrMessage";
import { QR_MESSAGES } from "./constants/qrMessages";
import { PHOTO_WIDTH, PHOTO_HEIGHT } from "./constants/camera";
import Camera from "./components/Camera";
import PhotoPreview from "./components/PhotoPreview";
import QrPopup from "./components/QrPopup";

export default function App() {
  const { videoRef, error } = useCamera();
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [qrMessage, setQrMessage] = useState(null);

  const handleDetected = useCallback(
    (rawValue) => setQrMessage(resolveQrMessage(rawValue, QR_MESSAGES)),
    [],
  );

  // Paused while a photo or the result popup is showing, so the same
  // code held in front of the camera can't re-trigger itself.
  useQrScanner({
    videoRef,
    enabled: !hasPhoto && !qrMessage,
    onDetected: handleDetected,
  });

  const takePhoto = () => {
    const photo = photoRef.current;
    photo.width = PHOTO_WIDTH;
    photo.height = PHOTO_HEIGHT;
    photo
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    const photo = photoRef.current;
    photo.getContext("2d").clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  const closeQrPopup = () => setQrMessage(null);

  return (
    <div className="App">
      <Camera videoRef={videoRef} onSnap={takePhoto} error={error} />
      <PhotoPreview
        photoRef={photoRef}
        hasPhoto={hasPhoto}
        onClose={closePhoto}
      />
      <QrPopup message={qrMessage} onClose={closeQrPopup} />
    </div>
  );
}
