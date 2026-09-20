import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import React from "react";
import { useCamera } from "../useCamera";

function CameraHarness() {
  const { videoRef, error } = useCamera();
  return React.createElement(
    "div",
    null,
    React.createElement("video", { ref: videoRef, "data-testid": "video" }),
    error
      ? React.createElement("span", { "data-testid": "error" }, error)
      : null,
  );
}

function makeStream(tracks = [{ stop: vi.fn() }]) {
  return { getTracks: () => tracks, tracks };
}

const realMediaDevices = navigator.mediaDevices;

beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn() },
  });
});

afterEach(() => {
  cleanup();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: realMediaDevices,
  });
  vi.restoreAllMocks();
});

describe("useCamera", () => {
  it("requests the camera with the expected constraints", async () => {
    navigator.mediaDevices.getUserMedia.mockResolvedValue(makeStream());
    render(React.createElement(CameraHarness));

    await waitFor(() =>
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: expect.objectContaining({
          width: 1920,
          height: 1080,
          facingMode: { ideal: "environment" },
        }),
      }),
    );
  });

  it("attaches the resolved stream to the video element and plays it", async () => {
    const stream = makeStream();
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play");
    navigator.mediaDevices.getUserMedia.mockResolvedValue(stream);

    render(React.createElement(CameraHarness));

    await waitFor(() =>
      expect(screen.getByTestId("video").srcObject).toBe(stream),
    );
    expect(playSpy).toHaveBeenCalled();
  });

  it("exposes no error on the happy path", async () => {
    navigator.mediaDevices.getUserMedia.mockResolvedValue(makeStream());
    render(React.createElement(CameraHarness));

    await waitFor(() =>
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled(),
    );
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });

  it("surfaces the error message when getUserMedia is rejected (e.g. permission denied)", async () => {
    navigator.mediaDevices.getUserMedia.mockRejectedValue(
      new Error("Permission denied"),
    );

    render(React.createElement(CameraHarness));

    expect(await screen.findByTestId("error")).toHaveTextContent(
      "Permission denied",
    );
  });

  it("sets a graceful error when the browser has no mediaDevices support at all", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });

    render(React.createElement(CameraHarness));

    expect(await screen.findByTestId("error")).toHaveTextContent(
      "Camera not supported in this browser.",
    );
  });

  it("stops every track on unmount so the camera light turns off", async () => {
    const trackA = { stop: vi.fn() };
    const trackB = { stop: vi.fn() };
    navigator.mediaDevices.getUserMedia.mockResolvedValue(
      makeStream([trackA, trackB]),
    );

    const { unmount } = render(React.createElement(CameraHarness));
    await waitFor(() =>
      expect(screen.getByTestId("video").srcObject).toBeTruthy(),
    );

    unmount();

    expect(trackA.stop).toHaveBeenCalledOnce();
    expect(trackB.stop).toHaveBeenCalledOnce();
  });

  it("does not throw if the component unmounts before getUserMedia resolves", async () => {
    let resolveStream;
    navigator.mediaDevices.getUserMedia.mockReturnValue(
      new Promise((resolve) => {
        resolveStream = resolve;
      }),
    );

    const { unmount } = render(React.createElement(CameraHarness));
    unmount();

    // Resolving after unmount must not try to touch a detached video ref,
    // and the stream's tracks should still be cleaned up.
    const stream = makeStream();
    expect(() => resolveStream(stream)).not.toThrow();
    await waitFor(() => expect(stream.tracks[0].stop).toHaveBeenCalledOnce());
  });

  it("never calls stop() if getUserMedia rejects (there is no stream to clean up)", async () => {
    navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error("nope"));
    const { unmount } = render(React.createElement(CameraHarness));

    await screen.findByTestId("error");
    expect(() => unmount()).not.toThrow();
  });
});
