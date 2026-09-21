import {
  PressStart2P_400Regular,
  useFonts,
} from "@expo-google-fonts/press-start-2p";
import {
  type BarcodeScanningResult,
  type CameraView as CameraViewType,
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Controls from "@/components/camera/controls";
import PhotoPreview from "@/components/camera/photo-preview";
import QrPopup from "@/components/camera/qr-popup";
import Viewfinder from "@/components/camera/viewfinder";
import {
  GAME_BOY_COLORS,
  GAME_BOY_FONT_FAMILY,
} from "@/constants/game-boy-theme";
import { QR_MESSAGES } from "@/constants/qr-messages";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useCameraPermission } from "@/hooks/use-camera-permission";
import { useGameBoyMetrics } from "@/hooks/use-game-boy-metrics";
import { resolveQrMessage } from "@/utils/resolve-qr-message";

const MAX_MESSAGE_LINES = 5;

function splitMessageIntoLines(value: string | null): string[] {
  return String(value ?? "")
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

/**
 * Route: /camera (this file's path). Registered as a tab in
 * app-tabs.tsx / app-tabs.web.tsx - see MIGRATION.md.
 *
 * Deliberately does NOT use ThemedView/ThemedText - this screen is a
 * fully custom, immersive "device" UI (fixed red/pink palette, pixel
 * font) unrelated to the app's light/dark theme system, same reasoning
 * as keeping game-boy-theme.ts separate from constants/theme.ts.
 *
 * `BottomTabInset` IS reused from the shared theme, though - it's a
 * layout concern (avoid the tab bar overlapping content), not a color/
 * typography one, so it applies here the same way it does on the other
 * two screens.
 */
export default function CameraScreen() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const { isGranted, isLoading, requestPermission } = useCameraPermission();
  const { width, height, unit } = useGameBoyMetrics();
  const cameraRef = useRef<CameraViewType>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [qrMessage, setQrMessage] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const messageLines = useMemo(
    () => (qrMessage ? splitMessageIntoLines(qrMessage) : []),
    [qrMessage],
  );
  const maxScroll = Math.max(0, messageLines.length - MAX_MESSAGE_LINES);
  const canScrollUp = Boolean(qrMessage) && scrollOffset > 0;
  const canScrollDown = Boolean(qrMessage) && scrollOffset < maxScroll;

  const handleBarcodeScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      setQrMessage(resolveQrMessage(data, QR_MESSAGES));
      setScrollOffset(0);
    },
    [],
  );

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (!photo) return;
    setPhotoUri(photo.uri);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    setHasPhoto(false);
    setPhotoUri(null);
  };

  const closeQrPopup = () => {
    setQrMessage(null);
    setScrollOffset(0);
  };

  const handleScrollUp = () =>
    setScrollOffset((current) => Math.max(0, current - 1));
  const handleScrollDown = () =>
    setScrollOffset((current) => Math.min(maxScroll, current + 1));

  const handleY = qrMessage ? closeQrPopup : takePhoto;
  const handleX = qrMessage ? closeQrPopup : closePhoto;
  const yLabel = qrMessage ? "OK" : "Snap";

  if (!fontsLoaded || isLoading) {
    return <View style={styles.shell} />;
  }

  if (!isGranted) {
    return (
      <SafeAreaView style={styles.shell}>
        <Text style={styles.permissionText} onPress={requestPermission}>
          Tap to allow camera access
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.shell} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={[
          GAME_BOY_COLORS.shellA,
          GAME_BOY_COLORS.shellB,
          GAME_BOY_COLORS.shellC,
        ]}
        style={[styles.gameboy, { width, height }]}
      >
        <View style={styles.screenBezel}>
          <View style={styles.powerRow}>
            <View style={styles.powerLed} />
            <Text style={styles.powerLabel}>POWER</Text>
          </View>

          <View style={styles.screen}>
            <Viewfinder
              ref={cameraRef}
              scanningEnabled={!hasPhoto && !qrMessage}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <PhotoPreview photoUri={photoUri} hasPhoto={hasPhoto} />
            <QrPopup message={qrMessage} scrollOffset={scrollOffset} />
          </View>

          {/* Logo template slot - swap for your own <Image source={require(...)} />. */}
          <View style={styles.logoSlot}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>YOUR LOGO</Text>
            </View>
          </View>
        </View>

        <Controls
          unit={unit}
          onUp={handleScrollUp}
          onDown={handleScrollDown}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
          onA={handleY}
          onB={handleX}
          aLabel={yLabel}
          bLabel="Close"
        />

        <View style={styles.startSelectRow}>
          <Text style={styles.pillBtn}>SELECT</Text>
          <Text style={styles.pillBtn}>START</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#20242c",
    paddingBottom: BottomTabInset,
  },
  permissionText: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    padding: Spacing.four,
  },
  gameboy: {
    borderRadius: 24,
    padding: "3%",
    boxShadow: "0px 14px 24px rgba(90, 10, 10, 0.5)",
    elevation: 16,
  },
  screenBezel: {
    flex: 1,
    backgroundColor: GAME_BOY_COLORS.bezel,
    borderRadius: 18,
    padding: "3%",
  },
  powerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
  },
  powerLed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff2b1f",
  },
  powerLabel: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 8,
    color: "#fff5e6",
    letterSpacing: 1,
  },
  screen: {
    flex: 1,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: GAME_BOY_COLORS.screenBottom,
  },
  logoSlot: { alignItems: "center", paddingVertical: 10 },
  logoPlaceholder: {
    width: "100%",
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
    alignItems: "center",
  },
  logoText: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
  },
  startSelectRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 10,
  },
  pillBtn: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 8,
    color: "#fff",
    backgroundColor: GAME_BOY_COLORS.shellC,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
});
