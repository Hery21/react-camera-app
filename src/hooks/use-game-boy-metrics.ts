import { useWindowDimensions } from "react-native";

/**
 * RN equivalent of the web app's `--gb-w` / `--gb-unit` CSS custom
 * properties. Uses the same "contain" formula: bounded by BOTH available
 * width AND height at once (via useWindowDimensions - RN's reactive,
 * rotation-aware substitute for CSS vw/vh), so the console's shape can
 * never be violated no matter the device or orientation.
 *
 * `unit` is 1% of the resolved console width - every size in the
 * feature should be `unit * N`, mirroring `calc(var(--gb-unit) * N)`.
 */
const ASPECT_RATIO = 0.62;

export interface GameBoyMetrics {
  width: number;
  height: number;
  unit: number;
}

export function useGameBoyMetrics(): GameBoyMetrics {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const width = Math.min(screenW * 0.92, screenH * 0.92 * ASPECT_RATIO);
  const height = width / ASPECT_RATIO;
  const unit = width / 100;

  return { width, height, unit };
}
