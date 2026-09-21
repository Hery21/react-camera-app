import { CameraView, type BarcodeScanningResult } from "expo-camera";
import { forwardRef } from "react";
import { Text, View } from "react-native";

import { styles } from "./styles/viewfinder";

export interface ViewfinderProps {
  error?: string | null;
  scanningEnabled: boolean;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
}

/**
 * Pure screen content - same responsibility as the web version, but the
 * underlying mechanism is completely different:
 *
 *  - `<video ref>` + getUserMedia  -->  <CameraView ref>. expo-camera
 *    owns the native camera session; there's no MediaStream to attach or
 *    tear down manually.
 *
 *  - `autofocus="on"` keeps continuous autofocus running for the whole
 *    time the camera is mounted (as opposed to "off", which locks focus
 *    after the initial pass). This matters here specifically because QR
 *    codes need to be sharp at varying distances to decode reliably -
 *    without continuous AF, moving the phone closer/farther from a code
 *    (or from a subject before a photo) can leave the image soft.
 *
 *  - `barcodeScannerSettings` + `onBarcodeScanned` is expo-camera's
 *    built-in, hardware-accelerated QR detection - no custom canvas/jsQR
 *    polling loop needed. Setting `onBarcodeScanned` to `undefined` is
 *    expo-camera's documented way to pause scanning (used here while a
 *    photo or the QR popup is showing, so an in-frame code can't
 *    re-trigger itself).
 */
const Viewfinder = forwardRef<CameraView, ViewfinderProps>(function Viewfinder(
  { error, scanningEnabled, onBarcodeScanned },
  ref,
) {
  if (error) {
    return (
      <View style={styles.camera}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <CameraView
      ref={ref}
      style={styles.camera}
      facing="back"
      autofocus="on"
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={scanningEnabled ? onBarcodeScanned : undefined}
    />
  );
});

export default Viewfinder;
