import { StyleSheet } from 'react-native';
import { GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

export function createViewfinderStyles(unit: number) {
  return StyleSheet.create({
    camera: { flex: 1 },
    errorText: {
      flex: 1,
      textAlignVertical: 'center',
      textAlign: 'center',
      padding: unit * 3.4,
      fontSize: unit * 2.9,
      fontFamily: GAME_BOY_FONT_FAMILY,
      color: '#1c2417',
      backgroundColor: 'rgba(244, 244, 230, 0.9)',
    },
  });
}
