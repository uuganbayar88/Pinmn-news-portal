import { describe, expect, it } from "vitest";
import { buildArticleMetadata, buildNewsArticleJsonLd } from "./metadata";
import { getArticle } from "./content/accessors";

const article = getArticle("tatvaryn-shinechlel")!;

describe("buildArticleMetadata", () => {
  it("emits the §4.5 tag set", () => {
    const m = buildArticleMetadata(article);
    expect(m.title).toBe("Намрын чуулган: Татварын шинэчлэл юуг өөрчлөх вэ? — PIN");
    expect(m.alternates?.canonical).toBe("https://pin.mn/tatvaryn-shinechlel");
    const og = m.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
    expect(og.siteName).toBe("PIN");
    expect(og.locale).toBe("mn_MN");
    expect(og.url).toBe("https://pin.mn/tatvaryn-shinechlel");
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("falls back to title/lead when social fields are absent", () => {
    const a = getArticle("shine-avtobusny-chiglel")!;
    const m = buildArticleMetadata(a);
    const og = m.openGraph as Record<string, unknown>;
    expect(og.title).toBe(a.title);
    expect(og.description).toBe(a.lead);
  });
});

describe("buildNewsArticleJsonLd", () => {
  it("emits a NewsArticle with publisher PIN", () => {
    const ld = buildNewsArticleJsonLd(article) as Record<string, unknown>;
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe(article.title);
    expect((ld.publisher as Record<string, unknown>).name).toBe("PIN");
    expect(ld.datePublished).toBe(article.publishedAt);
  });
});
