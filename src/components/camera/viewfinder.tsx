import { useBlink } from "@/hooks/use-blink";
import { CameraView, type BarcodeScanningResult } from "expo-camera";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View, type LayoutChangeEvent } from "react-native";
import PixelText from "./pixel-text";
import { createViewfinderStyles } from "./styles/viewfinder.styles";

export interface ViewfinderProps {
  error?: string | null;
  scanningEnabled: boolean;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
  unit: number;
}

const CORNER_POSITIONS = [
  "cornerTL",
  "cornerTR",
  "cornerBL",
  "cornerBR",
] as const;

const Viewfinder = forwardRef<CameraView, ViewfinderProps>(function Viewfinder(
  { error, scanningEnabled, onBarcodeScanned, unit },
  ref,
) {
  const styles = useMemo(() => createViewfinderStyles(unit), [unit]);

  // Reticle and label blink independently (different durations) so they
  // don't pulse in lockstep - a small "alive HUD" touch. Both reuse the
  // existing useBlink hook rather than duplicating the animation logic
  // already shared with qr-popup.tsx/welcome-screen.tsx.
  const reticleBlink = useBlink();
  const labelBlink = useBlink({ durationMs: 650 });

  // The sweep line animates via `transform: translateY` (native-driver
  // compatible, consistent with every other animation in this app) over
  // a pixel range - which means we need the overlay's actual measured
  // height, not just `unit` math, since the overlay's size is itself
  // determined by flex layout (how much vertical space the screen gets),
  // not a fixed multiple of `unit`.
  const [frameHeight, setFrameHeight] = useState(0);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!frameHeight) return undefined;
    // Animated.loop resets the value to its start before each iteration
    // by default, so a single one-directional timing animation here
    // produces a continuous top-to-bottom sweep (not a ping-pong).
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [frameHeight, sweep]);

  const handleOverlayLayout = (event: LayoutChangeEvent) => {
    setFrameHeight(event.nativeEvent.layout.height);
  };

  const sweepTranslateY = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(frameHeight - unit * 0.6, 0)],
  });

  if (error) {
    return (
      <View style={styles.camera}>
        <PixelText style={styles.errorText}>{error}</PixelText>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={ref}
        style={styles.camera}
        facing="back"
        autofocus="on"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanningEnabled ? onBarcodeScanned : undefined}
      />

      <View
        testID="camera-overlay"
        style={styles.overlay}
        pointerEvents="none"
        onLayout={handleOverlayLayout}
      >
        {CORNER_POSITIONS.flatMap((position) => [
          <View
            key={`${position}-shadow`}
            style={[styles.corner, styles[position], styles.cornerShadow]}
          />,
          <View
            key={`${position}-accent`}
            style={[styles.corner, styles[position], styles.cornerAccent]}
          />,
        ])}

        <Animated.View style={[styles.reticle, { opacity: reticleBlink }]}>
          <View style={styles.reticleDot} />
        </Animated.View>
      </View>
    </View>
  );
});

export default Viewfinder;
