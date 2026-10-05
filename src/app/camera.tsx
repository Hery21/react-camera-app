import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Pressable } from 'react-native';
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
import PixelText from '@/components/camera/pixel-text';
import { useCameraPermission } from '@/hooks/use-camera-permission';
import { useGameBoyMetrics } from '@/hooks/use-game-boy-metrics';
import { resolveQrMessage } from '@/utils/resolve-qr-message';
import { QR_MESSAGES } from '@/constants/qr-messages';
import { GAME_BOY_COLORS } from '@/constants/game-boy-theme';
import { createCameraScreenStyles } from '@/components/camera/styles/camera-screen.styles';

const MAX_MESSAGE_LINES = 5;

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
  const styles = useMemo(() => createCameraScreenStyles(unit), [unit]);
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
        <PixelText style={styles.permissionText} onPress={requestPermission}>
          Tap to allow camera access
        </PixelText>
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
            <PixelText style={styles.powerLabel}>POWER</PixelText>
          </View>

          <View style={styles.screen}>
            {inWelcome ? (
              <WelcomeScreen unit={unit} />
            ) : inMenu ? (
              <StartMenu options={MENU_OPTIONS} selectedIndex={menuIndex} unit={unit} />
            ) : (
              <>
                <Viewfinder
                  ref={cameraRef}
                  unit={unit}
                  scanningEnabled={scanningEnabled}
                  onBarcodeScanned={handleBarcodeScanned}
                />
                <PhotoPreview photoUri={photoUri} hasPhoto={hasPhoto} />
                {mode === 'tour' && (
                  <QrPopup message={qrMessage} scrollOffset={scrollOffset} unit={unit} />
                )}
              </>
            )}
          </View>

          <View style={styles.logoSlot}>
            <View style={styles.logoPlaceholder}>
              <PixelText style={styles.logoText}>YOUR LOGO</PixelText>
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
          <PixelText style={styles.pillBtn}>SELECT</PixelText>
          <Pressable onPress={inWelcome ? enterMenu : undefined} accessibilityRole="button" accessibilityLabel="Start" hitSlop={8}>
            <PixelText style={styles.pillBtn}>START</PixelText>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
