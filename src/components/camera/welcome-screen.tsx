import { useMemo } from 'react';
import { View, Animated } from 'react-native';
import { useBlink } from '@/hooks/use-blink';
import { APP_NAME, APP_TAGLINE } from '@/constants/branding';
import PixelText from './pixel-text';
import { createWelcomeScreenStyles } from './styles/welcome-screen.styles';

export interface WelcomeScreenProps {
  appName?: string;
  tagline?: string;
  unit: number;
}

export default function WelcomeScreen({
  appName = APP_NAME,
  tagline = APP_TAGLINE,
  unit,
}: WelcomeScreenProps) {
  const styles = useMemo(() => createWelcomeScreenStyles(unit), [unit]);
  const blink = useBlink();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <PixelText style={styles.badgeGlyph}>★</PixelText>
      </View>

      <PixelText style={styles.appName}>{appName}</PixelText>
      <PixelText style={styles.tagline}>{tagline}</PixelText>

      <Animated.Text allowFontScaling={false} style={[styles.prompt, { opacity: blink }]}>
        PRESS START
      </Animated.Text>
    </View>
  );
}
