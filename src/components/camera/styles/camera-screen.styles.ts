import { StyleSheet } from 'react-native';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';

export function createCameraScreenStyles(unit: number) {
  return StyleSheet.create({
    shell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#20242c',
      paddingBottom: BottomTabInset,
    },
    permissionText: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      color: '#fff',
      fontSize: unit * 3.4,
      textAlign: 'center',
      padding: Spacing.four,
    },
    gameboy: {
      borderRadius: unit * 6.9,
      // Was `padding: '3%'`. CSS (what renders this on web, e.g. Expo
      // web / localhost:8081) resolves ALL padding percentages -
      // including top/bottom - against the container's WIDTH, never
      // its height. Yoga (native iOS/Android) resolves vertical padding
      // against height instead. Same style object, two different
      // results - and since this box's width changes independently of
      // its height as the browser window resizes, the vertical inset
      // visibly skewed relative to the rest of the console the wider
      // the window got. Explicit unit-based numbers render identically
      // on every platform, so this can no longer diverge.
      paddingHorizontal: unit * 3,
      paddingVertical: unit * 3,
      shadowColor: '#5a0a0a',
      shadowOffset: { width: 0, height: unit * 4.0 },
      shadowOpacity: 0.5,
      shadowRadius: unit * 6.9,
      elevation: 16,
    },
    screenBezel: {
      flex: 1,
      backgroundColor: GAME_BOY_COLORS.bezel,
      borderRadius: unit * 5.1,
      paddingHorizontal: unit * 3, // same web/native percentage-padding fix as `gameboy` above
      paddingVertical: unit * 3,
    },
    powerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: unit * 1.7,
      paddingBottom: unit * 2.3,
    },
    powerLed: {
      width: unit * 2.3,
      height: unit * 2.3,
      borderRadius: unit * 1.1,
      backgroundColor: '#ff2b1f',
    },
    powerLabel: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.3,
      color: '#fff5e6',
      // Was a bare literal `1` - the one property in this whole file
      // that wasn't unit-scaled. Font size scales with the console via
      // `unit`, but this stayed fixed, so the ratio between glyph width
      // and letter-spacing visibly drifted whenever the console's
      // computed size changed (different device, different window
      // shape) - exactly the "spacing still affected by zoom/shape"
      // symptom, isolated to just these two text styles.
      letterSpacing: unit * 0.3,
    },
    screen: {
      flex: 1,
      borderRadius: unit * 1.7,
      overflow: 'hidden',
      backgroundColor: GAME_BOY_COLORS.screenBottom,
    },
    logoSlot: {
      alignItems: 'center',
      paddingVertical: unit * 2.9,
    },
    logoPlaceholder: {
      width: '100%',
      paddingVertical: unit * 2.9,
      borderWidth: unit * 0.3,
      borderStyle: 'dashed',
      borderColor: 'rgba(255,255,255,0.5)',
      borderRadius: unit * 2.3,
      alignItems: 'center',
    },
    logoText: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.9,
      color: 'rgba(255,255,255,0.85)',
      letterSpacing: unit * 0.3, // same fix as powerLabel above
    },
    startSelectRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: unit * 4.6,
      paddingTop: unit * 2.9,
    },
    pillBtn: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.3,
      color: '#fff',
      backgroundColor: GAME_BOY_COLORS.shellC,
      paddingHorizontal: unit * 2.9,
      paddingVertical: unit * 1.7,
      borderRadius: unit * 2.3,
      overflow: 'hidden',
    },
  });
}
