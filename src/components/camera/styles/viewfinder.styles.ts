import {
  GAME_BOY_COLORS,
  GAME_BOY_FONT_FAMILY,
} from "@/constants/game-boy-theme";
import { StyleSheet } from "react-native";

/**
 * Game-like camera overlay, refactored from the previous realistic
 * "camera scanner" look (translucent mint-green rounded border + a full
 * crosshair spanning the frame) into something that actually belongs to
 * the same retro console as the rest of the app:
 *
 *  - Color switched from an unrelated mint green to GAME_BOY_COLORS.accent
 *    - the exact yellow already used for the D-pad glyphs - so the
 *      overlay reads as part of the same console, not a bolted-on
 *      generic scanner UI.
 *  - No border-radius anywhere (sharp, pixel-art corners - real pixel
 *    art never anti-aliases its edges).
 *  - Corner brackets are drawn as TWO layers per corner (a dark
 *    "screenText"-colored copy behind, offset down-right, plus the
 *    accent-colored bracket on top) - the same hard-edge pixel-bevel
 *    trick retro game HUDs use (e.g. a health bar's outlined border),
 *    instead of a single soft/translucent line.
 *  - The old full-width crosshair (which read more like a sniper scope
 *    than a game HUD) is replaced by a small reticle + a scanning sweep
 *    line, both animated in viewfinder.tsx.
 */
export function createViewfinderStyles(unit: number) {
  return StyleSheet.create({
    cameraContainer: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      position: "relative",
    },
    camera: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      margin: unit * 1.2,
    },

    // --- Corner brackets -------------------------------------------------
    corner: {
      position: "absolute",
      width: unit * 4.6,
      height: unit * 4.6,
      borderWidth: unit * 0.9,
      backgroundColor: "transparent",
    },
    cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    // Rendered first (behind), same position as the bracket above it,
    // just shifted down-right via transform - a classic hard-edge pixel
    // drop-shadow duplicate, not a soft/blurred shadow.
    cornerShadow: {
      borderColor: GAME_BOY_COLORS.screenText,
      transform: [{ translateX: unit * 0.5 }, { translateY: unit * 0.5 }],
    },
    cornerAccent: {
      borderColor: GAME_BOY_COLORS.accent,
    },

    // --- Center reticle ----------------------------------------------
    reticle: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: unit * 5.2,
      height: unit * 5.2,
      marginLeft: -unit * 2.6,
      marginTop: -unit * 2.6,
      borderWidth: unit * 0.6,
      borderColor: GAME_BOY_COLORS.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    reticleDot: {
      width: unit * 1.1,
      height: unit * 1.1,
      borderRadius: 999, // the one allowed "round" shape - a dot, not a frame edge
      backgroundColor: GAME_BOY_COLORS.accent,
    },

    // --- Scanning sweep line -----------------------------------------
    scanLine: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: unit * 0.6,
      backgroundColor: GAME_BOY_COLORS.accent,
      shadowColor: GAME_BOY_COLORS.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: unit * 1.5,
      elevation: 4,
    },

    // --- HUD label -----------------------------------------------------
    scanLabel: {
      position: "absolute",
      top: unit * 1,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: GAME_BOY_FONT_FAMILY,
      fontSize: unit * 2.3,
      letterSpacing: unit * 0.3,
      color: GAME_BOY_COLORS.accent,
    },

    errorText: {
      flex: 1,
      textAlignVertical: "center",
      textAlign: "center",
      padding: unit * 3.4,
      fontSize: unit * 2.9,
      fontFamily: GAME_BOY_FONT_FAMILY,
      color: "#1c2417",
      backgroundColor: "rgba(244, 244, 230, 0.9)",
    },
  });
}
