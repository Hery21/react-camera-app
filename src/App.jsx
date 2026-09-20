import { useCallback, useMemo, useRef, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { useQrScanner } from "./hooks/useQrScanner";
import { resolveQrMessage } from "./utils/resolveQrMessage";
import { QR_MESSAGES } from "./constants/qrMessages";
import { PHOTO_WIDTH, PHOTO_HEIGHT } from "./constants/camera";
import Camera from "./components/Camera";
import PhotoPreview from "./components/PhotoPreview";
import QrPopup from "./components/QrPopup";
import Controls from "./components/Controls";
import "./App.css";

const MAX_MESSAGE_LINES = 5;

function splitMessageIntoLines(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

export default function App() {
  const { videoRef, error } = useCamera();
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [qrMessage, setQrMessage] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const messageLines = useMemo(
    () => (qrMessage ? splitMessageIntoLines(qrMessage) : []),
    [qrMessage],
  );
  const maxScroll = Math.max(0, messageLines.length - MAX_MESSAGE_LINES);
  const canScrollUp = Boolean(qrMessage) && scrollOffset > 0;
  const canScrollDown = Boolean(qrMessage) && scrollOffset < maxScroll;

  const handleDetected = useCallback((rawValue) => {
    setQrMessage(resolveQrMessage(rawValue, QR_MESSAGES));
    setScrollOffset(0);
  }, []);

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

  const closeQrPopup = () => {
    setQrMessage(null);
    setScrollOffset(0);
  };

  const handleScrollUp = () =>
    setScrollOffset((current) => Math.max(0, current - 1));
  const handleScrollDown = () =>
    setScrollOffset((current) => Math.min(maxScroll, current + 1));

  const handleA = qrMessage ? closeQrPopup : takePhoto;
  const handleB = qrMessage ? closeQrPopup : closePhoto;
  const aLabel = qrMessage ? "OK" : "Snap";

  return (
    <div className="gameboy-shell">
      <div className="gameboy">
        <div className="screen-bezel">
          <div className="power-row">
            <span className="power-led" aria-hidden="true" />
            <span className="power-label">POWER</span>
          </div>

          <div className="screen">
            <Camera videoRef={videoRef} error={error} />
            <PhotoPreview photoRef={photoRef} hasPhoto={hasPhoto} />
            <QrPopup message={qrMessage} scrollOffset={scrollOffset} />
          </div>

          <div className="logo-slot">
            <div className="logo-placeholder">YOUR LOGO</div>
          </div>
        </div>

        <Controls
          onUp={handleScrollUp}
          onDown={handleScrollDown}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
          onA={handleA}
          onB={handleB}
          aLabel={aLabel}
          bLabel="Close"
        />

        <div className="gameboy-startselect-row" aria-hidden="true">
          <span className="pill-btn">SELECT</span>
          <span className="pill-btn">START</span>
        </div>

        <div className="gameboy-speaker" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
