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

    const requestRearCamera = async () => {
      const rearFacing = {
        ...VIDEO_CONSTRAINTS,
        facingMode: { ideal: "environment" },
      };

      try {
        return await navigator.mediaDevices.getUserMedia({ video: rearFacing });
      } catch {
        return await navigator.mediaDevices.getUserMedia({
          video: VIDEO_CONSTRAINTS,
        });
      }
    };

    requestRearCamera()
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;

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
