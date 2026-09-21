/**
 * Design tokens for the Game Boy camera feature specifically.
 *
 * Deliberately kept SEPARATE from `src/constants/theme.ts` (your app's
 * shared design system - semantic light/dark tokens, spacing, fonts used
 * by themed-text/themed-view etc). This palette is decorative and
 * feature-specific (a saturated red plastic shell, a pink/green button
 * cluster) - it has nothing to do with the app's light/dark mode
 * semantics, so merging it into the shared theme would pollute a file
 * every other screen depends on. Same reasoning as keeping component
 * styles co-located instead of centralizing everything into one giant
 * stylesheet.
 */
export const GAME_BOY_COLORS = {
  shellA: "#ff7b6e",
  shellB: "#e8483f",
  shellC: "#b8241f",
  accent: "#ffd400",
  ink: "#4a0f0c",
  screenTop: "#9fe0a8",
  screenBottom: "#6bc784",
  bezel: "#1b1a1a",
  xBtn: ["#ffb3c7", "#ff7f9d", "#ea3d63"] as const,
  yBtn: ["#aafca7", "#6ee36d", "#4bab51"] as const,
} as const;

// Loaded via @expo-google-fonts/press-start-2p in the camera route - see
// MIGRATION.md for the useFonts() setup.
export const GAME_BOY_FONT_FAMILY = "PressStart2P_400Regular";
