import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQrScanner } from "../useQrScanner";
import { decodeQrCode } from "../../utils/decodeQrCode";

vi.mock("../../utils/decodeQrCode", () => ({ decodeQrCode: vi.fn() }));

function fakeVideo({ width = 640, height = 480 } = {}) {
  return { videoWidth: width, videoHeight: height };
}

function mockCanvasContext() {
  const ctx = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: [], width: 1, height: 1 })),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);
  return ctx;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  decodeQrCode.mockReset();
});

describe("useQrScanner", () => {
  it("does not schedule any scanning while disabled", () => {
    mockCanvasContext();
    const videoRef = { current: fakeVideo() };
    renderHook(() =>
      useQrScanner({ videoRef, enabled: false, onDetected: vi.fn() }),
    );

    vi.advanceTimersByTime(5000);
    expect(decodeQrCode).not.toHaveBeenCalled();
  });

  it("decodes a frame every intervalMs while enabled", () => {
    mockCanvasContext();
    decodeQrCode.mockReturnValue(null);
    const videoRef = { current: fakeVideo() };
    renderHook(() =>
      useQrScanner({
        videoRef,
        enabled: true,
        onDetected: vi.fn(),
        intervalMs: 300,
      }),
    );

    vi.advanceTimersByTime(900);
    expect(decodeQrCode).toHaveBeenCalledTimes(3);
  });

  it("calls onDetected with the decoded value when a code is found", () => {
    mockCanvasContext();
    decodeQrCode.mockReturnValue("ASSET-001");
    const onDetected = vi.fn();
    const videoRef = { current: fakeVideo() };
    renderHook(() =>
      useQrScanner({ videoRef, enabled: true, onDetected, intervalMs: 300 }),
    );

    vi.advanceTimersByTime(300);
    expect(onDetected).toHaveBeenCalledWith("ASSET-001");
  });

  it("does not call onDetected when no code is decoded from the frame", () => {
    mockCanvasContext();
    decodeQrCode.mockReturnValue(null);
    const onDetected = vi.fn();
    const videoRef = { current: fakeVideo() };
    renderHook(() =>
      useQrScanner({ videoRef, enabled: true, onDetected, intervalMs: 300 }),
    );

    vi.advanceTimersByTime(300);
    expect(onDetected).not.toHaveBeenCalled();
  });

  it("skips scanning safely when the video has no dimensions yet", () => {
    mockCanvasContext();
    const videoRef = { current: fakeVideo({ width: 0, height: 0 }) };
    renderHook(() =>
      useQrScanner({
        videoRef,
        enabled: true,
        onDetected: vi.fn(),
        intervalMs: 300,
      }),
    );

    vi.advanceTimersByTime(300);
    expect(decodeQrCode).not.toHaveBeenCalled();
  });

  it("skips scanning safely when the video element is not mounted yet", () => {
    mockCanvasContext();
    const videoRef = { current: null };
    renderHook(() =>
      useQrScanner({
        videoRef,
        enabled: true,
        onDetected: vi.fn(),
        intervalMs: 300,
      }),
    );

    vi.advanceTimersByTime(300);
    expect(decodeQrCode).not.toHaveBeenCalled();
  });

  it("stops scanning after unmount", () => {
    mockCanvasContext();
    decodeQrCode.mockReturnValue(null);
    const videoRef = { current: fakeVideo() };
    const { unmount } = renderHook(() =>
      useQrScanner({
        videoRef,
        enabled: true,
        onDetected: vi.fn(),
        intervalMs: 300,
      }),
    );

    unmount();
    vi.advanceTimersByTime(3000);
    expect(decodeQrCode).not.toHaveBeenCalled();
  });

  it("stops scanning when enabled flips from true to false", () => {
    mockCanvasContext();
    decodeQrCode.mockReturnValue(null);
    const videoRef = { current: fakeVideo() };
    const { rerender } = renderHook(
      ({ enabled }) =>
        useQrScanner({
          videoRef,
          enabled,
          onDetected: vi.fn(),
          intervalMs: 300,
        }),
      { initialProps: { enabled: true } },
    );

    vi.advanceTimersByTime(300);
    expect(decodeQrCode).toHaveBeenCalledTimes(1);

    rerender({ enabled: false });
    vi.advanceTimersByTime(900);
    expect(decodeQrCode).toHaveBeenCalledTimes(1);
  });

  it("resizes the canvas to match the current video dimensions on each tick", () => {
    const ctx = mockCanvasContext();
    decodeQrCode.mockReturnValue(null);
    const videoRef = { current: fakeVideo({ width: 320, height: 240 }) };
    renderHook(() =>
      useQrScanner({
        videoRef,
        enabled: true,
        onDetected: vi.fn(),
        intervalMs: 300,
      }),
    );

    vi.advanceTimersByTime(300);
    expect(ctx.drawImage).toHaveBeenCalledWith(
      videoRef.current,
      0,
      0,
      320,
      240,
    );
  });
});
