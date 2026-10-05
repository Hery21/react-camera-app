import { useWindowDimensions } from 'react-native';

/**
 * UNCHANGED from before - this hook was already correct. `width`/`height`
 * are bounded by BOTH available width and height at once, so the
 * console's 0.62 shape can never be violated no matter the device or
 * zoom level.
 *
 * `unit` is 1% of that already-correct width. This is the ONE number
 * every other size in the app must be built from - see the files in
 * components/camera/styles/ for how.
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
