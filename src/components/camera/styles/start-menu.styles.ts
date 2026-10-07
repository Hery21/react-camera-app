import {
  GAME_BOY_COLORS,
  GAME_BOY_FONT_FAMILY,
} from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

export function createStartMenuStyles(unit: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: unit * 6.9,
      paddingHorizontal: unit * 4.6,
    },
    title: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 3.1,
      lineHeight: unit * 5.7,
      textAlign: "center",
      color: GAME_BOY_COLORS.screenText,
    },
    optionList: {
      alignSelf: "stretch",
      gap: unit * 4.0,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: unit * 2.3,
    },
    cursor: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 3.4,
      color: GAME_BOY_COLORS.screenText,
    },
    cursorHidden: {
      opacity: 0,
    },
    optionLabel: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 3.1,
      color: GAME_BOY_COLORS.screenText,
      opacity: 0.6,
    },
    optionLabelSelected: {
      opacity: 1,
      textDecorationLine: "underline",
    },
    hint: {
      position: "absolute",
      bottom: unit * 2.9,
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.0,
      color: GAME_BOY_COLORS.screenText,
      opacity: 0.7,
    },
    pointer: {
      width: unit * 3.4,
    },
  });
}
