import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import PixelText from './pixel-text';
import { createViewfinderStyles } from './styles/viewfinder.styles';

export interface ViewfinderProps {
  error?: string | null;
  scanningEnabled: boolean;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
  unit: number;
}

const Viewfinder = forwardRef<CameraView, ViewfinderProps>(function Viewfinder(
  { error, scanningEnabled, onBarcodeScanned, unit },
  ref,
) {
  const styles = useMemo(() => createViewfinderStyles(unit), [unit]);

  if (error) {
    return (
      <View style={styles.camera}>
        <PixelText style={styles.errorText}>{error}</PixelText>
      </View>
    );
  }

  return (
    <CameraView
      ref={ref}
      style={styles.camera}
      facing="back"
      autofocus="on"
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      onBarcodeScanned={scanningEnabled ? onBarcodeScanned : undefined}
    />
  );
});

export default Viewfinder;
