import {
  GAME_BOY_COLORS,
  GAME_BOY_FONT_FAMILY,
} from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    paddingTop: "5%",
  },
  padWrap: { flex: 1, position: "relative" },
  padBar: {
    position: "absolute",
    backgroundColor: "#241210",
    borderRadius: 6,
    boxShadow: "0px 4px 6px rgba(30, 10, 10, 0.5)",
    elevation: 6,
  },
  padBarHorizontal: { top: "32%", bottom: "32%", left: 0, right: 0 },
  padBarVertical: { left: "32%", right: "32%", top: 0, bottom: 0 },
  padCenter: {
    position: "absolute",
    top: "38%",
    left: "38%",
    width: "24%",
    height: "24%",
    borderRadius: 999,
    backgroundColor: "#170b0a",
  },
  armSlot: {
    position: "absolute",
    width: "36%",
    height: "36%",
    alignItems: "center",
    justifyContent: "center",
  },
  armUp: { top: 0, left: "32%" },
  armDown: { bottom: 0, left: "32%" },
  armLeft: { left: 0, top: "32%" },
  armRight: { right: 0, top: "32%" },
  glyph: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 16,
    color: GAME_BOY_COLORS.accent,
  },
  glyphDim: { opacity: 0.5 },
  glyphDisabled: { opacity: 0.3 },
  roundBtnWrap: {
    position: "absolute",
    borderRadius: 999,
    boxShadow: "0px 5px 6px rgba(60, 10, 21, 0.5)",
    elevation: 6,
  },
  roundBtnPressable: {
    ...StyleSheet.absoluteFill,
  },
  roundBtnGradient: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
  },
  roundBtnLabel: {
    fontFamily: GAME_BOY_FONT_FAMILY,
    fontSize: 16,
    color: "#fff",
  },
});
