import { GAME_BOY_FONT_FAMILY } from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  errorText: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    padding: 12,
    fontSize: 10,
    fontFamily: GAME_BOY_FONT_FAMILY,
    color: "#1c2417",
    backgroundColor: "rgba(244, 244, 230, 0.9)",
  },
});
