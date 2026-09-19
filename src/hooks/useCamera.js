import { useEffect, useRef, useState } from "react";
import { VIDEO_CONSTRAINTS } from "../constants/camera";

// Owns the getUserMedia lifecycle: attach stream to a <video>, surface
// errors, and stop the tracks on unmount so the camera light turns off.
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const timer = setTimeout(() => {
        setError("Camera not supported in this browser.");
      }, 0);

      return () => clearTimeout(timer);
    }

    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: VIDEO_CONSTRAINTS })
      .then((stream) => {
        if (cancelled) {
          // Unmounted while the permission prompt was still pending -
          // don't leave the camera light on for a component that's gone.
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          const playPromise = videoRef.current.play?.();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, error };
}
