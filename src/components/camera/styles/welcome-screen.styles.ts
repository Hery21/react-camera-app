import { StyleSheet } from 'react-native';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

export function createWelcomeScreenStyles(unit: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: unit * 4.0,
      paddingHorizontal: unit * 4.6,
    },
    badge: {
      width: unit * 10.3,
      height: unit * 10.3,
      borderRadius: unit * 5.1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: GAME_BOY_COLORS.screenText,
      marginBottom: unit * 1.7,
    },
    badgeGlyph: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 4.6,
      color: GAME_BOY_COLORS.screenTop,
    },
    appName: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 4.0,
      letterSpacing: unit * 0.6,
      textAlign: 'center',
      color: GAME_BOY_COLORS.screenText,
    },
    tagline: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.3,
      textAlign: 'center',
      color: GAME_BOY_COLORS.screenText,
      opacity: 0.75,
    },
    prompt: {
      position: 'absolute',
      bottom: unit * 4.0,
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.6,
      letterSpacing: unit * 0.3,
      color: GAME_BOY_COLORS.screenText,
    },
  });
}
