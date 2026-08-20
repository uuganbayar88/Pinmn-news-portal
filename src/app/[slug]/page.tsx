import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./article.module.css";
import { getAllArticles, getArticle, getDigest, getRelatedPins } from "@/lib/content/accessors";
import { buildArticleMetadata, buildNewsArticleJsonLd } from "@/lib/metadata";
import { formatWhen } from "@/lib/format";
import ProgressBar from "@/components/article/ProgressBar";
import ShareRail from "@/components/article/ShareRail";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ListenButton from "@/components/article/ListenButton";
import Footer from "@/components/chrome/Footer";
import Header from "@/components/chrome/Header";
import TabBar from "@/components/chrome/TabBar";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const digest = getDigest();

  return (
    <div className={styles.articleRoot}>
      <ProgressBar />
      <Header dateLabel={`${digest.dateLabel} · ${digest.weekdayLabel}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildNewsArticleJsonLd(article)).replace(/</g, "\\u003c") }}
      />
      <div className={styles.articleGrid}>
        <ShareRail />
        <main>
          <div className={styles.crumb}>Нүүр / {article.category.name} / <b>Онцлох</b></div>
          <span className={styles.tag}>{article.category.name} · Тайлбар</span>
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.lead}>{article.lead}</p>
          <div className={styles.byline}>
            <div className={styles.avatar} />
            <div>
              <div className={styles.who}>{article.author.name}{article.author.role ? ` · ${article.author.role}` : ""}</div>
              <div className={styles.when}>{formatWhen(article.publishedAt, article.readMinutes)}</div>
            </div>
            {article.listenDuration && <ListenButton title={article.title} duration={article.listenDuration} />}
          </div>
          <div className={styles.heroImg} />
          {article.heroCaption && <p className={styles.caption}>{article.heroCaption}</p>}
          <ArticleBody article={article} />
        </main>
        <ArticleSidebar relatedPins={getRelatedPins()} />
      </div>
      <Footer />
      <TabBar />
    </div>
  );
}
