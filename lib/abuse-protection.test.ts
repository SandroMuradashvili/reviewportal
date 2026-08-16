import { describe, expect, it } from "vitest";
import { validVisitToken } from "./abuse-protection";

describe("visit-token validation", () => {
  it("accepts a SHA-256 hex token", () => {
    expect(validVisitToken("a".repeat(64))).toBe(true);
  });

  it("rejects short, uppercase, and non-hex values", () => {
    expect(validVisitToken("a".repeat(63))).toBe(false);
    expect(validVisitToken("A".repeat(64))).toBe(false);
    expect(validVisitToken("z".repeat(64))).toBe(false);
  });
});
