import { useMemo } from 'react';
import { View, Animated } from 'react-native';
import { useBlink } from '@/hooks/use-blink';
import PixelText from './pixel-text';
import { createQrPopupStyles } from './styles/qr-popup.styles';

const MAX_MESSAGE_LINES = 5;

function splitMessageIntoLines(value: string | null | undefined): string[] {
  return String(value ?? '')
    .replace(/\r?\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

export interface QrPopupProps {
  message: string | null;
  scrollOffset?: number;
  unit: number;
}

export default function QrPopup({ message, scrollOffset = 0, unit }: QrPopupProps) {
  const styles = useMemo(() => createQrPopupStyles(unit), [unit]);
  const lines = useMemo(() => splitMessageIntoLines(message), [message]);
  const visibleLines = lines.slice(scrollOffset, scrollOffset + MAX_MESSAGE_LINES);
  const hasMoreBelow = scrollOffset + MAX_MESSAGE_LINES < lines.length;
  const blink = useBlink();

  if (!message) return null;

  return (
    <View style={[styles.overlay, styles.overlayNoPointerEvents]}>
      <View style={styles.popup} accessible accessibilityRole="alert">
        <View>
          {visibleLines.map((line, index) => (
            <PixelText key={`${line}-${index}`} style={styles.line}>
              {line}
            </PixelText>
          ))}
        </View>

        {/* Animated.Text (not PixelText) here - Reanimated/RN's Animated
            API only knows how to drive its own Animated.Text, but it
            still accepts `allowFontScaling` directly like any Text. */}
        <Animated.Text
          allowFontScaling={false}
          style={[styles.indicator, { opacity: blink }]}
          accessibilityLabel={hasMoreBelow ? 'More text below, scroll down' : 'Press A to close'}>
          {hasMoreBelow ? '▼' : 'Ⓐ'}
        </Animated.Text>
      </View>
    </View>
  );
}
