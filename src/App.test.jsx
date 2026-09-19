import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { PHOTO_WIDTH, PHOTO_HEIGHT } from "./constants/camera";

// App only orchestrates; the camera hardware itself is already covered
// by useCamera.test.js, so it's mocked here to isolate the snap/close logic.
const mockUseCamera = vi.fn(() => ({
  videoRef: { current: "fake-video-el" },
  error: null,
}));
vi.mock("./hooks/useCamera", () => ({
  useCamera: () => mockUseCamera(),
}));

function mockCanvasContext() {
  const ctx = { drawImage: vi.fn(), clearRect: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);
  return ctx;
}

describe("App", () => {
  let ctx;

  beforeEach(() => {
    ctx = mockCanvasContext();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not show the photo result before SNAP is clicked", () => {
    render(<App />);
    expect(document.querySelector(".result")).not.toHaveClass("hasPhoto");
  });

  it("sizes the canvas and draws the video frame when SNAP is clicked", async () => {
    const user = userEvent.setup();
    const video = document.createElement("video");
    mockUseCamera.mockReturnValueOnce({
      videoRef: { current: video },
      error: null,
    });
    render(<App />);

    await user.click(screen.getByRole("button", { name: /snap/i }));

    const canvas = document.querySelector("canvas");
    expect(canvas.width).toBe(PHOTO_WIDTH);
    // canvas.height is an IDL `unsigned long`: the browser (and jsdom)
    // truncates our fractional 232.875 down to 232 on assignment.
    expect(canvas.height).toBe(Math.trunc(PHOTO_HEIGHT));
    expect(ctx.drawImage).toHaveBeenCalledWith(
      video,
      0,
      0,
      PHOTO_WIDTH,
      PHOTO_HEIGHT,
    );
    expect(document.querySelector(".result")).toHaveClass("hasPhoto");
  });

  it("clears the canvas and resets state when CLOSE is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /snap/i }));
    await user.click(screen.getByRole("button", { name: /close/i }));

    // clearRect reads back photo.width/height (the truncated canvas values),
    // not the original float constants.
    expect(ctx.clearRect).toHaveBeenCalledWith(
      0,
      0,
      PHOTO_WIDTH,
      Math.trunc(PHOTO_HEIGHT),
    );
    expect(document.querySelector(".result")).not.toHaveClass("hasPhoto");
  });

  it("handles CLOSE being clicked with no photo ever taken (edge case)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /close/i }));

    // Default HTMLCanvasElement dimensions in jsdom, since takePhoto never ran.
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 300, 150);
    expect(document.querySelector(".result")).not.toHaveClass("hasPhoto");
  });

  it("supports taking multiple photos in a row without accumulating state", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /snap/i }));
    await user.click(screen.getByRole("button", { name: /snap/i }));

    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    expect(document.querySelector(".result")).toHaveClass("hasPhoto");
  });

  it("supports a full snap -> close -> snap cycle", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /snap/i }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    await user.click(screen.getByRole("button", { name: /snap/i }));

    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".result")).toHaveClass("hasPhoto");
  });
});

describe("App with a camera error", () => {
  it("surfaces the camera error message to the user", () => {
    mockCanvasContext();
    mockUseCamera.mockReturnValueOnce({
      videoRef: { current: null },
      error: "Permission denied",
    });

    render(<App />);
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
  });
});
