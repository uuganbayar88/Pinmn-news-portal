import { describe, expect, it } from "vitest";
import { formatWhen } from "./format";
import { getFeatured } from "./content/accessors";

describe("formatWhen", () => {
  it("pins to Asia/Ulaanbaatar regardless of the host timezone", () => {
    const featured = getFeatured();
    expect(formatWhen(featured.publishedAt, featured.readMinutes)).toBe("2026.08.01 · 09:40 · 5 мин унших");
  });

  it("formats an explicit ISO timestamp with zero-padded date/time parts", () => {
    expect(formatWhen("2026-08-01T09:40:00+08:00", 5)).toBe("2026.08.01 · 09:40 · 5 мин унших");
  });
});
