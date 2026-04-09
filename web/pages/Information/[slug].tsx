import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import TableOfContents from '../../components/TableOfContents';
import ShopCTA from '../../components/ShopCTA';
import StaysCTA from '../../components/StaysCTA';
import RelatedContent from '../../components/RelatedContent';
import { isEnabled } from '../../lib/feature-flags';
import {
  getArticleSlugs,
  getArticle,
  getRelatedArticles,
  type Article,
  type ArticleSummary,
} from '../../lib/articles';

/* ─── Hardcoded page slugs (handled by their own .tsx files) ─── */
const HARDCODED_SLUGS = [
  'montana-facts',
  'why-treasure-state',
  'mining-history-of-montana',
  'geology-of-western-montana',
  'story-of-montana-vigilantes',
];

type Props = {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    metaDescription: string;
    heroImage: string;
    heroAlt: string;
    contentHtml: string;
    shopCtaLabel: string;
    shopCtaUrl: string;
    datePublished: string;
    dateModified: string;
    noindex: boolean;
    tags: string[];
  };
  related: ArticleSummary[];
};

export default function InformationArticle({ article, related }: Props) {
  const url = `https://treasurestate.com/information/${article.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Montana Facts', url: '/information/montana-facts/' },
    { name: article.title, url },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    ...(article.datePublished && { datePublished: `${article.datePublished}T00:00:00-07:00` }),
    ...(article.dateModified && { dateModified: `${article.dateModified}T00:00:00-07:00` }),
    image: `https://treasurestate.com${article.heroImage}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('/') ? `https://treasurestate.com${b.url}` : b.url,
    })),
  };

  const hasCompleteSchema = article.title && article.metaDescription && article.datePublished;

  return (
    <>
      <Head>
        <title>{`${article.title} | Treasure State`}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={url} />
        {article.noindex && <meta name="robots" content="noindex" />}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://treasurestate.com${article.heroImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.metaDescription} />
        <meta name="twitter:image" content={`https://treasurestate.com${article.heroImage}`} />
        {hasCompleteSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <Header />
      <Hero title={article.title} subtitle={article.excerpt} image={article.heroImage} alt={article.heroAlt} small />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ display: 'flex', gap: '40px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px 3rem', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .toc-desktop { display: none; }
          @media (min-width: 1024px) { .toc-desktop { display: block; width: 280px; flex-shrink: 0; } }
          .article-body h2 { color: #204051; font-size: 1.3rem; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 2px solid #e8ede8; }
          .article-body h3 { color: #3b6978; font-size: 1.05rem; margin: 1.5rem 0 0.5rem; }
          .article-body p { color: #333; line-height: 1.7; margin: 0.6rem 0; }
          .article-body ul, .article-body ol { color: #444; line-height: 1.7; padding-left: 1.5rem; }
          .article-body li { margin: 0.3rem 0; }
          .article-body a[href^="/"] { color: #925f14; }
          .article-body blockquote.field-note { margin: 1.5rem 0; padding: 1rem 1.25rem; border-left: 3px solid #3b6978; background: #f5f8fa; border-radius: 0 6px 6px 0; font-style: italic; }
          .article-body blockquote.field-note--pullquote { border-left: 4px solid #d8973c; background: #fdf9f3; padding: 1.5rem 2rem; font-size: 1.15rem; color: #3b3020; }
          .article-body .field-note--header { border-bottom: 2px solid #e8dcc8; padding: 1rem 0; color: #5a4a36; }
        `}} />

        <div className="toc-desktop">
          <TableOfContents contentSelector=".article-body" />
        </div>

        <div className="article-body content-section" style={{ flex: 1, minWidth: 0 }}>
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

          {article.shopCtaLabel && article.shopCtaUrl && (
            <ShopCTA label={article.shopCtaLabel} url={article.shopCtaUrl} articleSlug={article.slug} />
          )}

          {!article.noindex && <StaysCTA />}

          {related.length > 0 && <RelatedContent articles={related} />}
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─── Static Generation ──────────────────────────────────── */

export const getStaticPaths: GetStaticPaths = async () => {
  if (!isEnabled('content_hub_enabled')) {
    return { paths: [], fallback: false };
  }

  const slugs = getArticleSlugs('montana-facts')
    .filter(s => !HARDCODED_SLUGS.includes(s));

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const articleData = await getArticle(slug, 'montana-facts');

  if (!articleData) return { notFound: true };

  const related = getRelatedArticles({
    tags: articleData.frontmatter.tags,
    excludeSlug: slug,
    limit: 3,
  });

  return {
    props: {
      article: {
        title: articleData.frontmatter.title,
        slug: articleData.frontmatter.slug,
        excerpt: articleData.frontmatter.excerpt,
        metaDescription: articleData.frontmatter.meta_description,
        heroImage: articleData.frontmatter.hero_image,
        heroAlt: articleData.frontmatter.hero_alt,
        contentHtml: articleData.contentHtml,
        shopCtaLabel: articleData.frontmatter.shop_cta_label,
        shopCtaUrl: articleData.frontmatter.shop_cta_url,
        datePublished: articleData.frontmatter.date_published,
        dateModified: articleData.frontmatter.date_modified,
        noindex: articleData.noindex,
        tags: articleData.frontmatter.tags,
      },
      related,
    },
  };
};
