import type { Metadata } from "next";
import type { Article } from "./content/types";

const SITE = "https://pin.mn";
const PLACEHOLDER_OG = `${SITE}/og-placeholder.png`; // replaced by the Satori card engine in a later milestone

export function buildArticleMetadata(article: Article): Metadata {
  const title = article.socialTitle ?? article.title;
  const description = article.socialDescription ?? article.lead;
  const url = `${SITE}/${article.slug}`;
  return {
    title: `${article.title} — PIN`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "PIN",
      locale: "mn_MN",
      title,
      description,
      url,
      images: [{ url: PLACEHOLDER_OG, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt ?? article.publishedAt,
      section: article.category.name,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [PLACEHOLDER_OG],
    },
  };
}

export function buildNewsArticleJsonLd(article: Article): object {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: "PIN",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    image: [PLACEHOLDER_OG],
    mainEntityOfPage: `${SITE}/${article.slug}`,
  };
}
