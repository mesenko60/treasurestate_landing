import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { GetStaticProps, GetStaticPaths } from 'next';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {
  getAllRailroadArticleSlugs,
  getRailroadArticle,
  getRelatedRailroadArticles,
  getRailroadHistoryData,
  type RailroadArticle,
  type RailroadArticleMeta,
  type RailroadPoint,
  type RailroadRoute,
} from '../../../lib/railroadArticles';

const RailroadMap = dynamic(() => import('../../../components/RailroadMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 350, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#888' }}>Loading map...</span>
    </div>
  ),
});

type Props = {
  article: RailroadArticle;
  relatedArticles: RailroadArticleMeta[];
  subtypeLabels: Record<string, string>;
  statusLabels: Record<string, string>;
};

export default function RailroadArticlePage({ article, relatedArticles, subtypeLabels, statusLabels }: Props) {
  const url = `https://treasurestate.com/guides/montana-railroad-history/${article.slug}/`;
  const title = article.title;
  const desc = article.excerpt;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides/' },
    { name: 'Railroad History', url: '/guides/montana-railroad-history/' },
    { name: title, url },
  ];

  const readingTime = Math.ceil(article.wordCount / 200);

  const hasGeo = article.points.length > 0 || article.routes.length > 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    datePublished: '2025-01-01',
    author: {
      '@type': 'Organization',
      name: 'Treasure State',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Treasure State',
      logo: {
        '@type': 'ImageObject',
        url: 'https://treasurestate.com/images/logo.png',
      },
    },
    ...(hasGeo && {
      spatialCoverage: {
        '@type': 'Place',
        name: 'Montana, USA',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: article.points[0]?.lat || 47,
          longitude: article.points[0]?.lng || -110,
        },
      },
    }),
  };

  return (
    <>
      <Head>
        <title>{`${title} | Montana Railroad History | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .railroad-article-page { max-width: 900px; margin: 0 auto; padding: 2rem 1rem 3rem; }
        .article-header { margin-bottom: 2rem; }
        .article-header h1 { font-size: 2rem; color: #204051; margin: 0 0 0.5rem; line-height: 1.25; }
        .article-meta { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; font-size: 0.9rem; color: #666; }
        .article-meta .voice { font-style: italic; }
        .article-meta .badge {
          padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;
        }
        .article-map-section { margin: 2rem 0; border-radius: 12px; overflow: hidden; border: 1px solid #e8ede8; }
        .article-map-header {
          background: #1a1a2e; color: #fff; padding: 0.75rem 1rem;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.9rem;
        }
        .article-map-header h2 { margin: 0; font-size: 1rem; }
        .article-map-header .count { color: #aaa; }
        .article-content {
          font-size: 1.05rem; line-height: 1.75; color: #333;
        }
        .article-content h2 { font-size: 1.4rem; color: #204051; margin: 2rem 0 1rem; }
        .article-content p { margin: 0 0 1.25rem; }
        .article-content a { color: #3b6978; }
        .article-content ul, .article-content ol { margin: 0 0 1.25rem; padding-left: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content blockquote {
          margin: 1.5rem 0; padding: 1rem 1.25rem; background: #f8faf8;
          border-left: 4px solid #204051; font-style: italic; color: #555;
        }
        .locations-list { margin: 2rem 0; }
        .locations-list h3 { font-size: 1.1rem; color: #204051; margin-bottom: 1rem; }
        .location-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .location-card {
          background: #f8faf8; border-radius: 8px; padding: 1rem;
          border: 1px solid #e8ede8;
        }
        .location-card h4 { font-size: 0.95rem; color: #204051; margin: 0 0 0.25rem; }
        .location-card .type { font-size: 0.8rem; color: #888; margin-bottom: 0.5rem; }
        .location-card p { font-size: 0.85rem; color: #555; line-height: 1.5; margin: 0; }
        .related-articles { margin-top: 3rem; padding: 1.5rem; background: #f8faf8; border-radius: 10px; }
        .related-articles h3 { font-size: 1.1rem; color: #204051; margin: 0 0 1rem; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
        .related-card {
          background: #fff; border-radius: 8px; padding: 1rem; text-decoration: none;
          border: 1px solid #e8ede8; transition: box-shadow 0.2s;
        }
        .related-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .related-card h4 { font-size: 0.95rem; color: #204051; margin: 0 0 0.25rem; }
        .related-card .meta { font-size: 0.8rem; color: #888; }
        .back-link {
          display: inline-block; margin-bottom: 1.5rem;
          font-size: 0.9rem; color: #3b6978; text-decoration: none;
        }
        .back-link:hover { text-decoration: underline; }
      `}} />

      <main className="railroad-article-page">
        <Link href="/guides/montana-railroad-history/" className="back-link">
          ← Back to Railroad History
        </Link>

        <header className="article-header">
          <h1>{title}</h1>
          <div className="article-meta">
            <span className="voice">Written in the voice of {article.voice}</span>
            <span>·</span>
            <span>{article.wordCount.toLocaleString()} words</span>
            <span>·</span>
            <span>{readingTime} min read</span>
            <span
              className="badge"
              style={{ background: article.color, color: '#fff' }}
            >
              {article.region}
            </span>
          </div>
        </header>

        {hasGeo && (
          <section className="article-map-section">
            <div className="article-map-header">
              <h2>Locations in This Article</h2>
              <span className="count">
                {article.points.length} sites · {article.routes.length} routes
              </span>
            </div>
            <RailroadMap
              points={article.points}
              routes={article.routes}
              highlightedArticle={article.slug}
              subtypeLabels={subtypeLabels}
              statusLabels={statusLabels}
              height={350}
            />
          </section>
        )}

        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {article.points.length > 0 && (
          <section className="locations-list">
            <h3>Historic Locations</h3>
            <div className="location-grid">
              {article.points.map(point => (
                <div key={point.id} className="location-card">
                  <h4>{point.name}</h4>
                  <div className="type">
                    {subtypeLabels[point.subtype] || point.subtype} · {point.year}
                  </div>
                  <p>{point.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section className="related-articles">
            <h3>Related Articles</h3>
            <div className="related-grid">
              {relatedArticles.map(related => (
                <Link
                  key={related.slug}
                  href={`/guides/montana-railroad-history/${related.slug}/`}
                  className="related-card"
                >
                  <h4>{related.title}</h4>
                  <div className="meta">{related.region} · {related.year}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllRailroadArticleSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = await getRailroadArticle(slug);

  if (!article) {
    return { notFound: true };
  }

  const relatedArticles = getRelatedRailroadArticles(slug, 3);
  const data = getRailroadHistoryData();

  return {
    props: {
      article,
      relatedArticles,
      subtypeLabels: data.subtypeLabels,
      statusLabels: data.statusLabels,
    },
  };
};
