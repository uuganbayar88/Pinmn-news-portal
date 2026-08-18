import { describe, expect, it } from "vitest";
import {
  getAllArticles, getArticle, getDigest, getDigestDayChips,
  getEvents, getFeatured, getMostPinned, getSearchIndex, getVideos,
} from "./accessors";

describe("accessors", () => {
  it("returns today's digest by default with the lead pin first", () => {
    const d = getDigest();
    expect(d.date).toBe("2026-08-07");
    expect(d.pins).toHaveLength(5);
    expect(d.pins[0].lead).toBe(true);
    expect(d.pins[0].article.slug).toBe("tov-bank-bodlogyn-huu");
    expect(d.storyCount).toBe(8);
    expect(d.totalMinutes).toBe(7);
  });

  it("exposes day chips with today active first", () => {
    const chips = getDigestDayChips();
    expect(chips[0]).toEqual({ label: "Өнөөдөр · 08.07", date: "2026-08-07", active: true });
    expect(chips).toHaveLength(4);
  });

  it("finds an article by slug and returns undefined for unknown slugs", () => {
    expect(getArticle("tatvaryn-shinechlel")?.title).toContain("Татварын шинэчлэл");
    expect(getArticle("no-such-slug")).toBeUndefined();
  });

  it("featured article has full body blocks and key points", () => {
    const f = getFeatured();
    expect(f.slug).toBe("tatvaryn-shinechlel");
    expect(f.body.length).toBeGreaterThanOrEqual(4);
    expect(f.keyPoints.length).toBeGreaterThanOrEqual(2);
    f.keyPoints.forEach((k) => expect(k.length).toBeLessThanOrEqual(110));
  });

  it("returns sidebar and band data", () => {
    expect(getEvents()).toHaveLength(3);
    expect(getVideos()).toHaveLength(5);
    expect(getVideos().filter((v) => v.size === "big")).toHaveLength(1);
    expect(getMostPinned()).toHaveLength(4);
    expect(getSearchIndex()).toHaveLength(8);
    expect(getAllArticles().length).toBeGreaterThanOrEqual(6);
  });
});
