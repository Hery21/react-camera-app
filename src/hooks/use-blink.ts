import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// UNCHANGED - a pure opacity blink has nothing to scale (opacity is
// unitless, 0-1 regardless of device size), so this needed no changes.
export interface UseBlinkOptions {
  durationMs?: number;
}

export function useBlink({ durationMs = 400 }: UseBlinkOptions = {}): Animated.Value {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: durationMs, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: durationMs, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, durationMs]);

  return opacity;
}
