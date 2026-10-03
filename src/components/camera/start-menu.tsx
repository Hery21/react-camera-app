import { View, Text, StyleSheet } from 'react-native';
import { GAME_BOY_COLORS, GAME_BOY_FONT_FAMILY } from '@/constants/game-boy-theme';

export interface StartMenuOption {
  value: string;
  label: string;
}

export interface StartMenuProps {
  options: readonly StartMenuOption[];
  selectedIndex: number;
}

/**
 * The console's actual title/mode-select screen - rendered directly on
 * the green LCD, same as a real Game Boy game's menu. Deliberately NOT
 * built as touch buttons: navigation/selection happens entirely through
 * the existing D-pad (▲▼) and Y button, reusing the physical controls
 * instead of introducing a second, inconsistent input paradigm just for
 * this one screen. See camera.tsx for the actual up/down/confirm wiring.
 */
export default function StartMenu({ options, selectedIndex }: StartMenuProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WHAT WOULD{'\n'}YOU LIKE TO DO?</Text>

      <View style={styles.optionList}>
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View key={option.value} style={styles.optionRow}>
              <Text style={[styles.cursor, !isSelected && styles.cursorHidden]}>▶</Text>
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.hint}>▲▼ Choose   Ⓨ Select</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 11,
    lineHeight: 20,
    textAlign: 'center',
    color: GAME_BOY_COLORS.screenText,
  },
  optionList: {
    alignSelf: 'stretch',
    gap: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cursor: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 12,
    color: GAME_BOY_COLORS.screenText,
  },
  cursorHidden: {
    opacity: 0,
  },
  optionLabel: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 11,
    color: GAME_BOY_COLORS.screenText,
    opacity: 0.6,
  },
  optionLabelSelected: {
    opacity: 1,
    textDecorationLine: 'underline',
  },
  hint: {
    position: 'absolute',
    bottom: 10,
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 7,
    color: GAME_BOY_COLORS.screenText,
    opacity: 0.7,
  },
});
