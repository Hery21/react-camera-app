import { GAME_BOY_FONT_FAMILY } from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    padding: 16,
    zIndex: 20,
  },
  popup: {
    width: "100%",
    minHeight: "46%",
    padding: 16,
    backgroundColor: "#f4f4e6",
    borderWidth: 3,
    borderColor: "#1c1c14",
    borderRadius: 4,
  },
  line: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 10,
    lineHeight: 18,
    minHeight: 18,
    color: "#1c1c14",
  },
  indicator: {
    position: "absolute",
    right: 16,
    bottom: 12,
    fontSize: 14,
    color: "#7a1030",
  },
});
