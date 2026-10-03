import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export interface UseBlinkOptions {
  durationMs?: number;
}

/**
 * Shared "hard on/off" blink animation - extracted here because, as of
 * the welcome screen, TWO components now need the exact same blinking-
 * prompt behavior (qr-popup.tsx's scroll/close indicator, and
 * welcome-screen.tsx's "PRESS START" prompt). Duplicating it a second
 * time would violate DRY for no benefit; a single shared hook is the
 * right move now that there's a genuine second caller (YAGNI doesn't
 * apply in reverse - this is exactly the point where extracting shared
 * logic earns its cost).
 */
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
