import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

/**
 * There is no getUserMedia/MediaStream concept in RN - expo-camera's
 * <CameraView> owns the actual camera hardware lifecycle internally
 * (including releasing it on unmount), so this hook's only job is
 * permissions.
 */
export interface CameraPermissionState {
  isGranted: boolean;
  isLoading: boolean;
  canAskAgain: boolean;
  requestPermission: () => void;
}

export function useCameraPermission(): CameraPermissionState {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  return {
    isGranted: permission?.granted ?? false,
    isLoading: permission === null,
    canAskAgain: permission?.canAskAgain ?? true,
    requestPermission,
  };
}
