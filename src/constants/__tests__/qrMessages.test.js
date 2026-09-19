import { describe, it, expect } from "vitest";
import { QR_MESSAGES } from "../qrMessages";

describe("QR_MESSAGES", () => {
  it("is a Map of identifier -> predefined text", () => {
    expect(QR_MESSAGES).toBeInstanceOf(Map);
  });

  it("every entry has a non-empty identifier and a non-empty message", () => {
    expect(QR_MESSAGES.size).toBeGreaterThan(0);
    for (const [id, message] of QR_MESSAGES) {
      expect(id.trim().length).toBeGreaterThan(0);
      expect(message.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate identifiers", () => {
    const ids = [...QR_MESSAGES.keys()];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
