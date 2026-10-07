import {
  GAME_BOY_COLORS,
  GAME_BOY_FONT_FAMILY,
} from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

export function createStartMenuStyles(unit: number) {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    backgroundImage: {
      resizeMode: "cover",
    },
    greenOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(107, 199, 132, 0.7)",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: unit * 6.9,
      paddingHorizontal: unit * 4.6,
    },
    title: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 3.7,
      lineHeight: unit * 6.6,
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
      fontSize: unit * 4.0,
      color: GAME_BOY_COLORS.screenText,
    },
    cursorHidden: {
      opacity: 0,
    },
    optionLabel: {
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 3.6,
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
      fontSize: unit * 2.4,
      fontWeight: "bold",
      color: GAME_BOY_COLORS.screenText,
      opacity: 0.7,
    },
    pointer: {
      width: unit * 4.0,
    },
  });
}
