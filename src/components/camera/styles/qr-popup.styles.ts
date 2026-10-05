import { StyleSheet } from 'react-native';
import { GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

export function createQrPopupStyles(unit: number) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'flex-end',
      padding: unit * 4.6,
      zIndex: 20,
    },
    overlayNoPointerEvents: {
      pointerEvents: 'none',
    },
    popup: {
      width: '100%',
      minHeight: '46%',
      padding: unit * 4.6,
      backgroundColor: '#f4f4e6',
      borderWidth: unit * 0.9,
      borderColor: '#1c1c14',
      borderRadius: unit * 1.1,
    },
    line: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.9,
      lineHeight: unit * 5.1,
      minHeight: unit * 5.1,
      color: '#1c1c14',
    },
    indicator: {
      position: 'absolute',
      right: unit * 4.6,
      bottom: unit * 3.4,
      fontSize: unit * 4.0,
      color: '#7a1030',
    },
  });
}
