import { describe, it, expect } from "vitest";
import { VIDEO_CONSTRAINTS, PHOTO_WIDTH, PHOTO_HEIGHT } from "../camera";

describe("camera constants", () => {
  it("requests a 1920x1080 stream", () => {
    expect(VIDEO_CONSTRAINTS).toEqual({ width: 1920, height: 1080 });
  });

  it("derives PHOTO_HEIGHT from PHOTO_WIDTH at a 16:9 ratio", () => {
    expect(PHOTO_WIDTH).toBe(414);
    expect(PHOTO_HEIGHT).toBeCloseTo(232.875, 3);
  });
});
