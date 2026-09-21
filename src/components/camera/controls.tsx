import { GAME_BOY_COLORS } from "@/constants/game-boy-theme";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { styles } from "./styles/controls";

export interface ControlsProps {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  canScrollUp?: boolean;
  canScrollDown?: boolean;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  onA: () => void;
  onB: () => void;
  aLabel?: string;
  bLabel?: string;
  unit: number;
}

/**
 * D-pad + X/Y button cluster. Three CSS techniques from the original web
 * version had no direct RN equivalent and needed real substitutes:
 *
 *  1. `clip-path: polygon(...)` (the plus silhouette)
 *     --> two overlapping <View>s of the SAME fill color (one wide
 *     horizontal bar, one tall vertical bar) - the overlap reads as one
 *     seamless plus. Trade-off: rounded-corner cross, not the original's
 *     pixel-perfect faceted polygon - `react-native-svg`'s <Path> can
 *     recover that exactly later if wanted.
 *
 *  2. `.dpad:has(.dpad-up:active)` (whole pad tilts as one piece)
 *     --> an Animated.Value driven by onPressIn/onPressOut, applied as a
 *     transform on the shared wrapper - same seesaw effect.
 *
 *  3. `:hover` / `:active` / `background: linear-gradient(...)`
 *     --> Pressable press events + Animated.spring, and
 *     expo-linear-gradient for the X/Y button gradients.
 */
export default function Controls({
  onUp,
  onDown,
  onLeft,
  onRight,
  canScrollUp = false,
  canScrollDown = false,
  canScrollLeft = false,
  canScrollRight = false,
  onA,
  onB,
  aLabel = "Snap",
  bLabel = "Close",
  unit,
}: ControlsProps) {
  const [tilt] = useState(() => new Animated.Value(0)); // -1 = up, 0 = rest, 1 = down

  const animateTilt = (toValue: number) => {
    Animated.spring(tilt, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const padTilt = {
    transform: [
      {
        translateY: tilt.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-unit * 0.4, 0, unit * 0.4],
        }),
      },
      {
        rotate: tilt.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ["-1.5deg", "0deg", "1.5deg"],
        }),
      },
    ],
  };

  const padSize = unit * 34;

  return (
    <View style={styles.row}>
      <Animated.View style={[{ width: padSize, height: padSize }, padTilt]}>
        <View style={styles.padWrap}>
          <View style={[styles.padBar, styles.padBarHorizontal]} />
          <View style={[styles.padBar, styles.padBarVertical]} />
          <View style={styles.padCenter} />

          <View style={[styles.armSlot, styles.armUp]}>
            <Pressable
              disabled={!canScrollUp}
              onPress={onUp}
              onPressIn={() => canScrollUp && animateTilt(-1)}
              onPressOut={() => animateTilt(0)}
              accessibilityRole="button"
              accessibilityLabel="Scroll up"
              hitSlop={8}
            >
              <Text
                style={[styles.glyph, !canScrollUp && styles.glyphDisabled]}
              >
                ▲
              </Text>
            </Pressable>
          </View>

          <View style={[styles.armSlot, styles.armDown]}>
            <Pressable
              disabled={!canScrollDown}
              onPress={onDown}
              onPressIn={() => canScrollDown && animateTilt(1)}
              onPressOut={() => animateTilt(0)}
              accessibilityRole="button"
              accessibilityLabel="Scroll down"
              hitSlop={8}
            >
              <Text
                style={[styles.glyph, !canScrollDown && styles.glyphDisabled]}
              >
                ▼
              </Text>
            </Pressable>
          </View>

          <View style={[styles.armSlot, styles.armLeft]}>
            <Pressable
              disabled={!canScrollLeft}
              onPress={onLeft}
              accessibilityRole="button"
              accessibilityLabel="Scroll left"
              hitSlop={8}
            >
              <Text
                style={[
                  styles.glyph,
                  !canScrollLeft && styles.glyphDisabled,
                  styles.glyphDim,
                ]}
              >
                ◀
              </Text>
            </Pressable>
          </View>
          <View style={[styles.armSlot, styles.armRight]}>
            <Pressable
              disabled={!canScrollRight}
              onPress={onRight}
              accessibilityRole="button"
              accessibilityLabel="Scroll right"
              hitSlop={8}
            >
              <Text
                style={[
                  styles.glyph,
                  !canScrollRight && styles.glyphDisabled,
                  styles.glyphDim,
                ]}
              >
                ▶
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <View style={{ width: unit * 42, height: unit * 26 }}>
        <RoundButton
          label="X"
          unit={unit}
          colors={GAME_BOY_COLORS.xBtn}
          onPress={onB}
          accessibilityLabel={bLabel}
          style={{ left: 0, top: "36%" }}
        />
        <RoundButton
          label="Y"
          unit={unit}
          colors={GAME_BOY_COLORS.yBtn}
          onPress={onA}
          accessibilityLabel={aLabel}
          style={{ right: 0, top: "4%" }}
        />
      </View>
    </View>
  );
}

interface RoundButtonProps {
  label: string;
  unit: number;
  colors: readonly [string, string, string];
  onPress: () => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

function RoundButton({
  label,
  unit,
  colors,
  onPress,
  accessibilityLabel,
  style,
}: RoundButtonProps) {
  const [scale] = useState(() => new Animated.Value(1));
  const press = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();

  const size = unit * 14;

  return (
    <Animated.View
      style={[
        styles.roundBtnWrap,
        style,
        { width: size, height: size, transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => press(0.92)}
        onPressOut={() => press(1)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={styles.roundBtnPressable}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.roundBtnGradient}
        >
          <Text style={styles.roundBtnLabel}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
