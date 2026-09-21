import { useEffect, useMemo, useState } from "react";
import { Animated, Text, View } from "react-native";

import { styles } from "./styles/qr-popup";

const MAX_MESSAGE_LINES = 5;

function splitMessageIntoLines(value: string | null | undefined): string[] {
  return String(value ?? "")
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());
}

/**
 * CSS `@keyframes qr-blink { steps(1, end) infinite }` has no RN
 * equivalent - reproduced here with Animated.loop + Animated.sequence.
 */
function useBlink(): Animated.Value {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return opacity;
}

export interface QrPopupProps {
  message: string | null;
  scrollOffset?: number;
}

/**
 * Pokemon-style dialogue box, anchored to the bottom of the screen. A
 * blinking "more text below" arrow shows while there's content left to
 * scroll to; a "press Y to close" badge shows once the end is reached.
 */
export default function QrPopup({ message, scrollOffset = 0 }: QrPopupProps) {
  const lines = useMemo(() => splitMessageIntoLines(message), [message]);
  const visibleLines = lines.slice(
    scrollOffset,
    scrollOffset + MAX_MESSAGE_LINES,
  );
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
          accessibilityLabel={
            hasMoreBelow ? "More text below, scroll down" : "Press Y to close"
          }
        >
          {hasMoreBelow ? "▼" : "Y"}
        </Animated.Text>
      </View>
    </View>
  );
}
