import { useMemo, useRef } from 'react';
import { View, Pressable, Animated, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_BOY_COLORS } from '@/constants/game-boy-theme';
import PixelText from './pixel-text';
import { createControlsStyles } from './styles/controls.styles';

const NOOP = () => {};

export interface ControlsProps {
  onUp?: () => void;
  onDown?: () => void;
  canScrollUp?: boolean;
  canScrollDown?: boolean;
  onA: () => void;
  onB?: () => void;
  aLabel?: string;
  bLabel?: string;
  unit: number;
}

export default function Controls({
  onUp,
  onDown,
  canScrollUp = false,
  canScrollDown = false,
  onA,
  onB,
  aLabel = 'Snap',
  bLabel = 'Close',
  unit,
}: ControlsProps) {
  const styles = useMemo(() => createControlsStyles(unit), [unit]);
  const tilt = useRef(new Animated.Value(0)).current;

  const animateTilt = (toValue: number) => {
    Animated.spring(tilt, { toValue, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
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
          outputRange: ['-1.5deg', '0deg', '1.5deg'],
        }),
      },
    ],
  };

  const padSize = unit * 34;

  // "Rocker" effect: the three arms OTHER than whichever is pressed
  // shrink and shift TOWARD the pressed direction, like the whole cross
  // pivoting on its center pin (press one edge down, the opposite/side
  // edges lift and recede). All four derive from the same `tilt` value
  // already used for the whole-pad tilt above, so everything stays in
  // sync automatically - no separate state needed.
  //
  // tilt: -1 = up pressed, 0 = rest, 1 = down pressed.
  const armShrink = unit * 0.9;

  // Up is the pressed arm when tilt<0, so it only shrinks/shifts (toward
  // down) when tilt>0 - i.e. when DOWN is the one being pressed.
  const upArmAnim = {
    transform: [
      { scale: tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: [1, 1, 0.82] }) },
      { translateY: tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 0, armShrink] }) },
    ],
  };
  // Mirror of the above: down only shrinks/shifts (toward up) when up is
  // the one being pressed (tilt<0).
  const downArmAnim = {
    transform: [
      { scale: tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.82, 1, 1] }) },
      { translateY: tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: [-armShrink, 0, 0] }) },
    ],
  };
  // Left/right are never the pressed arm, so they shrink and shift
  // toward whichever direction (up OR down) is currently active.
  const sideArmAnim = {
    transform: [
      { scale: tilt.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.82, 1, 0.82] }) },
      {
        translateY: tilt.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-armShrink, 0, armShrink],
        }),
      },
    ],
  };

  return (
    <View style={styles.row}>
      <Animated.View style={[{ width: padSize, height: padSize }, padTilt]}>
        <View style={styles.padWrap}>
          <View style={[styles.padBar, styles.padBarHorizontal]} />
          <View style={[styles.padBar, styles.padBarVertical]} />
          <View style={styles.padCenter} />

          <Animated.View style={[styles.armSlot, styles.armUp, upArmAnim]}>
            <Pressable
              disabled={!canScrollUp}
              onPress={onUp}
              onPressIn={() => canScrollUp && animateTilt(-1)}
              onPressOut={() => animateTilt(0)}
              accessibilityRole="button"
              accessibilityLabel="Scroll up"
              hitSlop={8}>
              {/* Always full-strength, even when canScrollUp is false -
                  the button stays visually identical whether or not it
                  currently does anything; `disabled` below still safely
                  no-ops the press itself. */}
              <PixelText style={styles.glyph}>▲</PixelText>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.armSlot, styles.armDown, downArmAnim]}>
            <Pressable
              disabled={!canScrollDown}
              onPress={onDown}
              onPressIn={() => canScrollDown && animateTilt(1)}
              onPressOut={() => animateTilt(0)}
              accessibilityRole="button"
              accessibilityLabel="Scroll down"
              hitSlop={8}>
              <PixelText style={styles.glyph}>▼</PixelText>
            </Pressable>
          </Animated.View>

          {/* Left/right stay non-interactive (no onPress - there's no
              left/right action in this app yet), but they're no longer
              dimmed - same full-strength glyph style as up/down, and
              they now join the same rocker animation as every other
              arm. */}
          <Animated.View style={[styles.armSlot, styles.armLeft, sideArmAnim]} pointerEvents="none">
            <PixelText style={styles.glyph}>◀</PixelText>
          </Animated.View>
          <Animated.View style={[styles.armSlot, styles.armRight, sideArmAnim]} pointerEvents="none">
            <PixelText style={styles.glyph}>▶</PixelText>
          </Animated.View>
        </View>
      </Animated.View>

      <View style={{ width: unit * 42, height: unit * 26 }}>
        {/* X is now ALWAYS rendered - previously it was removed from the
            tree entirely whenever onB was undefined (Welcome/Menu
            screens), which is exactly why it appeared to vanish. It
            stays at full visual strength the whole time; `disabled`
            just means pressing it safely does nothing on those screens. */}
        <RoundButton
          label="X"
          unit={unit}
          colors={GAME_BOY_COLORS.xBtn}
          onPress={onB ?? NOOP}
          disabled={!onB}
          accessibilityLabel={bLabel}
          style={{ left: 0, top: '36%' }}
          styles={styles}
        />
        <RoundButton
          label="Y"
          unit={unit}
          colors={GAME_BOY_COLORS.yBtn}
          onPress={onA}
          accessibilityLabel={aLabel}
          style={{ right: 0, top: '4%' }}
          styles={styles}
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
  disabled?: boolean;
  accessibilityLabel: string;
  style: ViewStyle;
  styles: ReturnType<typeof createControlsStyles>;
}

function RoundButton({
  label,
  unit,
  colors,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  styles,
}: RoundButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (toValue: number) =>
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 8 }).start();

  const size = unit * 14;

  return (
    // Always rendered at full visual strength, whether or not `disabled`
    // is true - no dimmed/greyed-out appearance. `disabled` only governs
    // whether a press actually does anything (and skips the press-in
    // tilt animation below), never how the button looks.
    <Animated.View
      style={[styles.roundBtnWrap, style, { width: size, height: size, transform: [{ scale }] }]}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => !disabled && press(0.92)}
        onPressOut={() => !disabled && press(1)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        style={styles.roundBtnPressable}>
        <LinearGradient
          colors={colors}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.roundBtnGradient}>
          <PixelText style={styles.roundBtnLabel}>{label}</PixelText>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
