import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { PHOTO_WIDTH, PHOTO_HEIGHT } from "./constants/camera";
import { QR_MESSAGES } from "./constants/qrMessages";

// App only orchestrates; the camera hardware and QR-decoding loop are
// already covered by useCamera.test.js / useQrScanner.test.js, so both
// hooks are mocked here to isolate App's own wiring logic.
const mockUseCamera = vi.fn(() => ({
  videoRef: { current: "fake-video-el" },
  error: null,
}));
vi.mock("./hooks/useCamera", () => ({
  useCamera: () => mockUseCamera(),
}));

const mockUseQrScanner = vi.fn();
vi.mock("./hooks/useQrScanner", () => ({
  useQrScanner: (args) => mockUseQrScanner(args),
}));

function mockCanvasContext() {
  const ctx = { drawImage: vi.fn(), clearRect: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);
  return ctx;
}

function latestOnDetected() {
  return mockUseQrScanner.mock.calls.at(-1)[0].onDetected;
}

describe("App - photo snapshot", () => {
  let ctx;

  beforeEach(() => {
    ctx = mockCanvasContext();
    mockUseQrScanner.mockClear();
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

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 300, 150);
    expect(document.querySelector(".result")).not.toHaveClass("hasPhoto");
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

describe("App - camera error", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockUseCamera.mockReturnValue({
      videoRef: { current: "fake-video-el" },
      error: null,
    });
  });

  it("surfaces the camera error message to the user", () => {
    mockCanvasContext();
    mockUseQrScanner.mockClear();
    mockUseCamera.mockReturnValueOnce({
      videoRef: { current: null },
      error: "Permission denied",
    });

    render(<App />);
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
  });
});

describe("App - QR scanning", () => {
  beforeEach(() => {
    mockCanvasContext();
    mockUseQrScanner.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("enables QR scanning by default, with no photo and no popup showing", () => {
    render(<App />);
    expect(mockUseQrScanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    );
  });

  it("disables QR scanning while the photo preview is open", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /snap/i }));
    expect(mockUseQrScanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it("shows the resolved predefined text in a popup once a known QR code is detected", () => {
    render(<App />);

    act(() => latestOnDetected()("ASSET-001"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(QR_MESSAGES.get("ASSET-001"))).toBeInTheDocument();
  });

  it("shows the unknown-code fallback for an unrecognized QR value", () => {
    render(<App />);

    act(() => latestOnDetected()("NOT-A-REAL-CODE"));

    expect(screen.getByText(/unrecognized qr code/i)).toBeInTheDocument();
  });

  it("pauses QR scanning while the popup is open, and resumes after it is closed", async () => {
    const user = userEvent.setup();
    render(<App />);

    act(() => latestOnDetected()("ASSET-001"));
    expect(mockUseQrScanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false }),
    );

    await user.click(screen.getByRole("button", { name: /ok/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockUseQrScanner).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    );
  });

  it("lets a new detection replace the currently shown message", () => {
    render(<App />);

    act(() => latestOnDetected()("ASSET-001"));
    expect(screen.getByText(QR_MESSAGES.get("ASSET-001"))).toBeInTheDocument();

    act(() => latestOnDetected()("ASSET-002"));
    expect(screen.getByText(QR_MESSAGES.get("ASSET-002"))).toBeInTheDocument();
    expect(
      screen.queryByText(QR_MESSAGES.get("ASSET-001")),
    ).not.toBeInTheDocument();
  });
});
