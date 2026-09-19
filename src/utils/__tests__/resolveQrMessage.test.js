import { describe, it, expect } from "vitest";
import { resolveQrMessage, UNKNOWN_QR_MESSAGE } from "../resolveQrMessage";

const MESSAGES = new Map([
  ["ASSET-001", "Server Rack A - Data Center Floor 2"],
  ["ASSET-002", "Fire Extinguisher - East Wing Hallway"],
]);

describe("resolveQrMessage", () => {
  it("returns the predefined text for a known identifier", () => {
    expect(resolveQrMessage("ASSET-001", MESSAGES)).toBe(
      "Server Rack A - Data Center Floor 2",
    );
  });

  it("falls back to the unknown message for an unrecognized identifier", () => {
    expect(resolveQrMessage("ASSET-999", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("trims surrounding whitespace before matching", () => {
    expect(resolveQrMessage("  ASSET-001  ", MESSAGES)).toBe(
      "Server Rack A - Data Center Floor 2",
    );
  });

  it("is case-sensitive, since identifiers are unique by exact value", () => {
    expect(resolveQrMessage("asset-001", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("falls back for an empty string", () => {
    expect(resolveQrMessage("", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("falls back for whitespace-only input", () => {
    expect(resolveQrMessage("   ", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("falls back for null or undefined input without throwing", () => {
    expect(resolveQrMessage(null, MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
    expect(resolveQrMessage(undefined, MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("falls back safely when the message map itself is empty", () => {
    expect(resolveQrMessage("ASSET-001", new Map())).toBe(UNKNOWN_QR_MESSAGE);
  });

  it("does not accidentally resolve inherited Object.prototype names like toString/constructor", () => {
    expect(resolveQrMessage("toString", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
    expect(resolveQrMessage("constructor", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
    expect(resolveQrMessage("__proto__", MESSAGES)).toBe(UNKNOWN_QR_MESSAGE);
  });
});
