import { View, Text, Animated, StyleSheet } from 'react-native';
import { useBlink } from '@/hooks/use-blink';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';
import { APP_NAME, APP_TAGLINE } from '@/constants/branding';

export interface WelcomeScreenProps {
  appName?: string;
  tagline?: string;
}

/**
 * The console's title/branding screen - the very first thing shown on
 * open, before the start menu. Matches the classic "title screen, then
 * press START" flow of real cartridge games, rather than dropping the
 * visitor straight into a menu with no sense of what app they're in.
 *
 * Dismissed by pressing the physical START button (now wired in
 * camera.tsx instead of being purely decorative) - Y also works, as a
 * fallback for anyone who doesn't intuit that START is interactive here.
 */
export default function WelcomeScreen({ appName = APP_NAME, tagline = APP_TAGLINE }: WelcomeScreenProps) {
  const blink = useBlink();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeGlyph}>★</Text>
      </View>

      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.tagline}>{tagline}</Text>

      <Animated.Text style={[styles.prompt, { opacity: blink }]}>PRESS START</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GAME_BOY_COLORS.screenText,
    marginBottom: 6,
  },
  badgeGlyph: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 16,
    color: GAME_BOY_COLORS.screenTop,
  },
  appName: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
    color: GAME_BOY_COLORS.screenText,
  },
  tagline: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 8,
    textAlign: 'center',
    color: GAME_BOY_COLORS.screenText,
    opacity: 0.75,
  },
  prompt: {
    position: 'absolute',
    bottom: 14,
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 9,
    letterSpacing: 1,
    color: GAME_BOY_COLORS.screenText,
  },
});
