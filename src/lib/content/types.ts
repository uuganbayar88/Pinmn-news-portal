export interface Category {
  slug: string;
  name: string;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  initials: string;
  role?: string;
}

export interface SponsoredMeta {
  partner: string;
  disclosure: string;
}

export interface Photo {
  src: string;    // path under /public
  alt: string;
  credit: string; // photographer + license, rendered in captions
}

export type BodyBlock =
  | { type: "whatHappened"; label: string; paragraphs: string[]; bullets?: string[] }
  | { type: "whyItMatters"; label: string; paragraphs: string[] }
  | { type: "quote"; text: string; attribution: string }
  | { type: "video"; label: string; title: string; duration: string; caption: string }
  | { type: "whatsNext"; label: string; paragraphs: string[] };

export interface Article {
  slug: string;
  title: string;
  socialTitle?: string;      // ≤60 chars (architecture doc §4.5)
  socialDescription?: string; // ≤110 chars
  lead: string;
  dek?: string;                // feature card standfirst line
  videoChip?: { label: string; duration: string }; // feature card video overlay
  heroCaption?: string;
  image?: Photo;
  whyItMatters: string;
  keyPoints: string[];        // 2–4 items, ≤110 chars each (doc §4.4)
  body: BodyBlock[];
  category: Category;
  author: Author;
  publishedAt: string;        // ISO 8601
  modifiedAt?: string;
  readMinutes: number;
  listenDuration?: string;    // "m:ss"
  sponsored?: SponsoredMeta;
  tags: string[];
}

// Article without `body`: the shape sent to client-rendered home page cards
// (FeatureCard, PinCard) so the full article body isn't serialized into the
// client bundle for content it never renders.
export type ArticleCard = Omit<Article, "body">;

export interface DigestPin {
  article: Article;
  lead?: boolean;
}

export interface DigestPinCard {
  article: ArticleCard;
  lead?: boolean;
}

export interface DailyDigest {
  date: string;        // "2026-08-07"
  dateLabel: string;   // "08.07"
  weekdayLabel: string; // "ПҮРЭВ"
  pins: DigestPin[];
  storyCount: number;
  totalMinutes: number;
  pinListMinutes: number; // "N мэдээ · pinListMinutes минут" in the SectionBar meta
  updatedAtLabel: string; // "7:30-д шинэчлэв"
}

export interface EventItem {
  day: string;        // "04"
  monthLabel: string; // "8 САР"
  title: string;
  venue: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  meta: string;
  size: "big" | "small";
  palette: 0 | 1 | 2 | 3 | 4;
  image?: Photo;
  delay: 0 | 1 | 2;
}

export interface SearchEntry {
  category: string;
  title: string;
  date: string; // "08.07"
  slug?: string;
}
