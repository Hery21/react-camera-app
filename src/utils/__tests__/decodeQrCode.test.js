import { describe, it, expect, vi, beforeEach } from "vitest";
import jsQR from "jsqr";
import { decodeQrCode } from "../decodeQrCode";

vi.mock("jsqr", () => ({ default: vi.fn() }));

describe("decodeQrCode", () => {
  beforeEach(() => {
    jsQR.mockReset();
  });

  it("returns null without calling jsQR when imageData is missing", () => {
    expect(decodeQrCode(null)).toBeNull();
    expect(decodeQrCode(undefined)).toBeNull();
    expect(jsQR).not.toHaveBeenCalled();
  });

  it("passes the raw pixel data, width and height straight through to jsQR", () => {
    jsQR.mockReturnValue(null);
    const imageData = {
      data: new Uint8ClampedArray([1, 2, 3, 4]),
      width: 10,
      height: 20,
    };

    decodeQrCode(imageData);

    expect(jsQR).toHaveBeenCalledWith(imageData.data, 10, 20);
  });

  it("returns the decoded string when jsQR finds a code", () => {
    jsQR.mockReturnValue({ data: "ASSET-001", location: {} });
    const imageData = { data: new Uint8ClampedArray(), width: 1, height: 1 };

    expect(decodeQrCode(imageData)).toBe("ASSET-001");
  });

  it("returns null when jsQR finds nothing in the frame", () => {
    jsQR.mockReturnValue(null);
    const imageData = { data: new Uint8ClampedArray(), width: 1, height: 1 };

    expect(decodeQrCode(imageData)).toBeNull();
  });

  it("returns null (not an empty string) if jsQR ever resolves an empty data string", () => {
    jsQR.mockReturnValue({ data: "" });
    const imageData = { data: new Uint8ClampedArray(), width: 1, height: 1 };

    expect(decodeQrCode(imageData)).toBeNull();
  });
});
