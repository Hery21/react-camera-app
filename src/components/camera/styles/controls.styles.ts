import { StyleSheet } from 'react-native';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

export function createControlsStyles(unit: number) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // Were '2%'/'5%' strings - same web-vs-native percentage-padding
      // divergence as camera-screen.styles.ts (CSS resolves vertical
      // padding against width, Yoga against height). Converted to
      // unit-based numbers so this row's spacing is identical on every
      // platform, regardless of window width.
      paddingHorizontal: unit * 2,
      paddingTop: unit * 5,
    },
    padWrap: { flex: 1, position: 'relative' },
    padBar: {
      position: 'absolute',
      backgroundColor: '#241210',
      borderRadius: unit * 1.7,
      shadowColor: '#1b0908',
      shadowOffset: { width: 0, height: unit * 1.1 },
      shadowOpacity: 0.5,
      shadowRadius: unit * 1.7,
      elevation: 6,
    },
    padBarHorizontal: { top: '32%', bottom: '32%', left: 0, right: 0 },
    padBarVertical: { left: '32%', right: '32%', top: 0, bottom: 0 },
    padCenter: {
      position: 'absolute',
      top: '38%',
      left: '38%',
      width: '24%',
      height: '24%',
      borderRadius: 999,
      backgroundColor: '#170b0a',
    },
    armSlot: {
      position: 'absolute',
      width: '36%',
      height: '36%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    armUp: { top: 0, left: '32%' },
    armDown: { bottom: 0, left: '32%' },
    armLeft: { left: 0, top: '32%' },
    armRight: { right: 0, top: '32%' },
    glyph: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 4.6,
      color: GAME_BOY_COLORS.accent,
    },
    roundBtnWrap: {
      position: 'absolute',
      borderRadius: 999,
      shadowColor: '#3c0a15',
      shadowOffset: { width: 0, height: unit * 1.4 },
      shadowOpacity: 0.5,
      shadowRadius: unit * 1.7,
      elevation: 6,
    },
    roundBtnPressable: {
      ...StyleSheet.absoluteFill,
    },
    roundBtnGradient: {
      flex: 1,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: unit * 0.9,
      borderColor: 'rgba(255,255,255,0.35)',
    },
    roundBtnLabel: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 4.6,
      color: '#fff',
    },
  });
}
