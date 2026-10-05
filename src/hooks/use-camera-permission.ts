// UNCHANGED - no sizing here, included for completeness only.
import { useEffect } from 'react';
import { useCameraPermissions } from 'expo-camera';

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
