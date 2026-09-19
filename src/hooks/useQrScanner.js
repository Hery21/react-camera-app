import { useEffect, useRef } from "react";
import { decodeQrCode } from "../utils/decodeQrCode";

const DEFAULT_INTERVAL_MS = 300;

/**
 * Polls the given video ref at a fixed interval, decodes each frame for a
 * QR code, and reports any match via onDetected. Scanning is fully paused
 * whenever `enabled` is false (e.g. while a photo or the result popup is
 * on screen), so it costs nothing and can't re-trigger the same code.
 */
export function useQrScanner({
  videoRef,
  enabled,
  onDetected,
  intervalMs = DEFAULT_INTERVAL_MS,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const scan = () => {
      const video = videoRef.current;
      if (!video || !video.videoWidth || !video.videoHeight) return;

      if (!canvasRef.current)
        canvasRef.current = document.createElement("canvas");
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const value = decodeQrCode(imageData);
      if (value) onDetected(value);
    };

    const timer = setInterval(scan, intervalMs);
    return () => clearInterval(timer);
  }, [videoRef, enabled, onDetected, intervalMs]);
}
