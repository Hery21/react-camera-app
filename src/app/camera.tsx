import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { type CameraView as CameraViewType, type BarcodeScanningResult } from 'expo-camera';

import Viewfinder from '@/components/camera/viewfinder';
import PhotoPreview from '@/components/camera/photo-preview';
import QrPopup from '@/components/camera/qr-popup';
import Controls from '@/components/camera/controls';
import StartMenu, { type StartMenuOption } from '@/components/camera/start-menu';
import WelcomeScreen from '@/components/camera/welcome-screen';
import { useCameraPermission } from '@/hooks/use-camera-permission';
import { useGameBoyMetrics } from '@/hooks/use-game-boy-metrics';
import { resolveQrMessage } from '@/utils/resolve-qr-message';
import { QR_MESSAGES } from '@/constants/qr-messages';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';

const MAX_MESSAGE_LINES = 5;

/**
 * The four screens this route can show, inside the LCD:
 *  - "welcome" - title/branding screen, shown first (like a cartridge's
 *                title screen before you press Start)
 *  - "menu"    - start/mode-select screen (StartMenu)
 *  - "tour"    - QR scanning ON (walk around, scan object plaques)
 *  - "photo"   - QR scanning OFF (so framing a photo of an outfit
 *                display is never interrupted by an accidental scan)
 */
type Mode = 'welcome' | 'menu' | 'tour' | 'photo';

const MENU_OPTIONS: readonly StartMenuOption[] = [
  { value: 'tour', label: 'Start Tour' },
  { value: 'photo', label: 'Take Photos' },
];

function splitMessageIntoLines(value: string | null): string[] {
  return String(value ?? '')
    .replace(/\r?\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

export default function CameraScreen() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const { isGranted, isLoading, requestPermission } = useCameraPermission();
  const { width, height, unit } = useGameBoyMetrics();
  const cameraRef = useRef<CameraViewType>(null);

  const [mode, setMode] = useState<Mode>('welcome');
  const [menuIndex, setMenuIndex] = useState(0);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [qrMessage, setQrMessage] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const inWelcome = mode === 'welcome';
  const inMenu = mode === 'menu';
  const scanningEnabled = mode === 'tour' && !hasPhoto && !qrMessage;

  const messageLines = useMemo(
    () => (qrMessage ? splitMessageIntoLines(qrMessage) : []),
    [qrMessage],
  );
  const maxScroll = Math.max(0, messageLines.length - MAX_MESSAGE_LINES);

  // D-pad is disabled entirely on the welcome screen (nothing to
  // navigate yet), repurposed for menu-option selection in "menu", and
  // repurposed again for scrolling a long QR message in "tour"/"photo" -
  // same two physical buttons, three different meanings depending on
  // which screen is showing.
  const canScrollUp = inWelcome ? false : inMenu ? menuIndex > 0 : Boolean(qrMessage) && scrollOffset > 0;
  const canScrollDown = inWelcome
    ? false
    : inMenu
      ? menuIndex < MENU_OPTIONS.length - 1
      : Boolean(qrMessage) && scrollOffset < maxScroll;

  const handleBarcodeScanned = useCallback(({ data }: BarcodeScanningResult) => {
    setQrMessage(resolveQrMessage(data, QR_MESSAGES));
    setScrollOffset(0);
  }, []);

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

  const enterMenu = () => setMode('menu');

  const handleUp = () => {
    if (inMenu) {
      setMenuIndex((current) => Math.max(0, current - 1));
      return;
    }
    setScrollOffset((current) => Math.max(0, current - 1));
  };

  const handleDown = () => {
    if (inMenu) {
      setMenuIndex((current) => Math.min(MENU_OPTIONS.length - 1, current + 1));
      return;
    }
    setScrollOffset((current) => Math.min(maxScroll, current + 1));
  };

  // Y button: confirms whatever's currently in front - leaves the
  // welcome screen, confirms the highlighted menu option, closes the QR
  // popup, or takes a photo. Exactly one of these is ever active, so
  // there's no ambiguity about what a press does.
  const handleConfirm = () => {
    if (inWelcome) {
      enterMenu();
      return;
    }
    if (inMenu) {
      setMode(MENU_OPTIONS[menuIndex].value as Mode);
      return;
    }
    if (qrMessage) {
      closeQrPopup();
      return;
    }
    takePhoto();
  };

  // X button: a single, consistent "go back one step" action. Hidden
  // entirely on the welcome/menu screens (nothing to back out of yet).
  const handleBack = () => {
    if (qrMessage) {
      closeQrPopup();
      return;
    }
    if (hasPhoto) {
      closePhoto();
      return;
    }
    setMode('menu');
  };

  const aLabel = inWelcome ? 'Start' : inMenu ? 'Select' : qrMessage ? 'OK' : 'Snap';

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
    <SafeAreaView style={styles.shell} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[GAME_BOY_COLORS.shellA, GAME_BOY_COLORS.shellB, GAME_BOY_COLORS.shellC]}
        style={[styles.gameboy, { width, height }]}>
        <View style={styles.screenBezel}>
          <View style={styles.powerRow}>
            <View style={styles.powerLed} />
            <Text style={styles.powerLabel}>POWER</Text>
          </View>

          <View style={styles.screen}>
            {inWelcome ? (
              <WelcomeScreen />
            ) : inMenu ? (
              <StartMenu options={MENU_OPTIONS} selectedIndex={menuIndex} />
            ) : (
              <>
                <Viewfinder
                  ref={cameraRef}
                  scanningEnabled={scanningEnabled}
                  onBarcodeScanned={handleBarcodeScanned}
                />
                <PhotoPreview photoUri={photoUri} hasPhoto={hasPhoto} />
                {mode === 'tour' && <QrPopup message={qrMessage} scrollOffset={scrollOffset} />}
              </>
            )}
          </View>

          <View style={styles.logoSlot}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>YOUR LOGO</Text>
            </View>
          </View>
        </View>

        <Controls
          unit={unit}
          onUp={handleUp}
          onDown={handleDown}
          canScrollUp={canScrollUp}
          canScrollDown={canScrollDown}
          onA={handleConfirm}
          onB={inWelcome || inMenu ? undefined : handleBack}
          aLabel={aLabel}
          bLabel="Back"
        />

        <View style={styles.startSelectRow}>
          <Text style={styles.pillBtn}>SELECT</Text>
          {/* START is now a real control, not decorative text: on the
              welcome screen it advances to the menu, same as pressing Y
              - matching the classic "press START" title-screen prompt.
              Everywhere else it's intentionally a no-op, same as SELECT
              always has been. */}
          <Pressable onPress={inWelcome ? enterMenu : undefined} accessibilityRole="button" accessibilityLabel="Start" hitSlop={8}>
            <Text style={styles.pillBtn}>START</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#20242c', paddingBottom: BottomTabInset },
  permissionText: { fontFamily: GAME_BOY_FONT_FAMILY, color: '#fff', fontSize: 12, textAlign: 'center', padding: Spacing.four },
  gameboy: {
    borderRadius: 24,
    padding: '3%',
    shadowColor: '#5a0a0a',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  screenBezel: { flex: 1, backgroundColor: GAME_BOY_COLORS.bezel, borderRadius: 18, padding: '3%' },
  powerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 8 },
  powerLed: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff2b1f' },
  powerLabel: { fontFamily: GAME_BOY_FONT_FAMILY, fontSize: 8, color: '#fff5e6', letterSpacing: 1 },
  screen: { flex: 1, borderRadius: 6, overflow: 'hidden', backgroundColor: GAME_BOY_COLORS.screenBottom },
  logoSlot: { alignItems: 'center', paddingVertical: 10 },
  logoPlaceholder: {
    width: '100%',
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoText: { fontFamily: GAME_BOY_FONT_FAMILY, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  startSelectRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 10 },
  pillBtn: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 8,
    color: '#fff',
    backgroundColor: GAME_BOY_COLORS.shellC,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
