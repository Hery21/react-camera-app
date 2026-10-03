import { useMemo } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useBlink } from '@/hooks/use-blink';
import { GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

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
}

export default function QrPopup({ message, scrollOffset = 0 }: QrPopupProps) {
  const lines = useMemo(() => splitMessageIntoLines(message), [message]);
  const visibleLines = lines.slice(scrollOffset, scrollOffset + MAX_MESSAGE_LINES);
  const hasMoreBelow = scrollOffset + MAX_MESSAGE_LINES < lines.length;
  const blink = useBlink();

  if (!message) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.popup} accessible accessibilityRole="alert">
        <View>
          {visibleLines.map((line, index) => (
            <Text key={`${line}-${index}`} style={styles.line}>
              {line}
            </Text>
          ))}
        </View>

        <Animated.Text
          style={[styles.indicator, { opacity: blink }]}
          accessibilityLabel={hasMoreBelow ? 'More text below, scroll down' : 'Press Y to close'}
        >
          {hasMoreBelow ? '▼' : 'Ⓨ'}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 16, zIndex: 20 },
  popup: {
    width: '100%',
    minHeight: '46%',
    padding: 16,
    backgroundColor: '#f4f4e6',
    borderWidth: 3,
    borderColor: '#1c1c14',
    borderRadius: 4,
  },
  line: { fontFamily: GAME_BOY_FONT_FAMILY, fontSize: 10, lineHeight: 18, minHeight: 18, color: '#1c1c14' },
  indicator: { position: 'absolute', right: 16, bottom: 12, fontSize: 14, color: '#7a1030' },
});
