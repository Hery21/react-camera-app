import { useMemo } from "react";
import { View } from "react-native";
import PixelText from "./pixel-text";
import { createStartMenuStyles } from "./styles/start-menu.styles";

export interface StartMenuOption {
  value: string;
  label: string;
}

export interface StartMenuProps {
  options: readonly StartMenuOption[];
  selectedIndex: number;
  unit: number;
}

export default function StartMenu({
  options,
  selectedIndex,
  unit,
}: StartMenuProps) {
  const styles = useMemo(() => createStartMenuStyles(unit), [unit]);

  return (
    <View style={styles.container}>
      <PixelText style={styles.title}>
        WHAT WOULD{"\n"}YOU LIKE TO DO?
      </PixelText>

      <View style={styles.optionList}>
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View key={option.value} style={styles.optionRow}>
              <PixelText
                style={[styles.cursor, !isSelected && styles.cursorHidden]}
              >
                ▶
              </PixelText>
              <PixelText
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </PixelText>
            </View>
          );
        })}
      </View>

      <PixelText style={styles.hint}>▲▼ Choose Ⓨ Select</PixelText>
    </View>
  );
}
