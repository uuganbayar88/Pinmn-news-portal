import type { Article, ArticleCard, DailyDigest, EventItem, SearchEntry, VideoItem } from "./types";
import { articles } from "./mock/articles";
import { dayChips, digests, events, mostPinned, relatedPins, searchIndex, videos } from "./mock/site";

const TODAY = "2026-08-07";

// Strips `body` so client card components (FeatureCard, PinCard) never
// serialize the full article body into the client bundle.
export function toCard(article: Article): ArticleCard {
  const { body, ...card } = article;
  void body;
  return card;
}

export function getDigest(date: string = TODAY): DailyDigest {
  const digest = digests.find((d) => d.date === date);
  if (!digest) throw new Error(`no digest for ${date}`);
  return digest;
}

export function getDigestDayChips(): { label: string; date: string; active: boolean; toast?: string }[] {
  return dayChips;
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeatured(): Article {
  const featured = getArticle("tatvaryn-shinechlel");
  if (!featured) throw new Error("featured article missing");
  return featured;
}

export function getEvents(): EventItem[] {
  return events;
}

export function getVideos(): VideoItem[] {
  return videos;
}

export function getMostPinned(): string[] {
  return mostPinned;
}

export function getSearchIndex(): SearchEntry[] {
  return searchIndex;
}

export function getRelatedPins(): { title: string; meta: string }[] {
  return relatedPins;
}
