import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { GetStaticProps } from 'next';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {
  getRailroadHistoryData,
  type RailroadArticleMeta,
  type RailroadPoint,
  type RailroadRoute,
} from '../../../lib/railroadArticles';

const RailroadMap = dynamic(() => import('../../../components/RailroadMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 500, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#888' }}>Loading map...</span>
    </div>
  ),
});

type Props = {
  articles: RailroadArticleMeta[];
  points: RailroadPoint[];
  routes: RailroadRoute[];
  subtypeLabels: Record<string, string>;
  statusLabels: Record<string, string>;
};

const regionColors: Record<string, string> = {
  'Southern Montana': '#c0392b',
  'Eastern Montana': '#2980b9',
  'Central Montana': '#27ae60',
  'Southwest Montana': '#8e44ad',
  'Northwest Montana': '#16a085',
  'Western Montana': '#d35400',
  'Northern Montana': '#2c3e50',
  'Statewide': '#7f8c8d',
};

export default function MontanaRailroadHistory({ articles, points, routes, subtypeLabels, statusLabels }: Props) {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);

  const url = 'https://treasurestate.com/guides/montana-railroad-history/';
  const title = 'Montana Railroad History — Interactive Map & Articles';
  const desc = `Explore ${articles.length} articles and ${points.length + routes.length} mapped locations covering Montana's railroad heritage from the 1880s golden spike to the abandoned Milwaukee Road.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides/' },
    { name: 'Railroad History', url },
  ];

  const regions = useMemo(() => {
    const set = new Set(articles.map(a => a.region));
    return Array.from(set).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let list = articles;
    if (filterRegion) {
      list = list.filter(a => a.region === filterRegion);
    }
    return list;
  }, [articles, filterRegion]);

  const filteredPoints = useMemo(() => {
    if (!filterRegion) return points;
    const slugs = new Set(filteredArticles.map(a => a.slug));
    return points.filter(p => slugs.has(p.articleSlug));
  }, [points, filteredArticles, filterRegion]);

  const filteredRoutes = useMemo(() => {
    if (!filterRegion) return routes;
    const slugs = new Set(filteredArticles.map(a => a.slug));
    return routes.filter(r => slugs.has(r.articleSlug));
  }, [routes, filteredArticles, filterRegion]);

  const handleArticleHover = (slug: string | null) => {
    setSelectedArticle(slug);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Article',
          name: a.title,
          description: a.excerpt,
          url: `${url}${a.slug}/`,
        },
      })),
    },
  };

  return (
    <>
      <Head>
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero
        title="Montana Railroad History"
        subtitle="The iron horse that built the state"
        image="/images/hero-image.jpg"
        alt="Historic railroad in Montana"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .railroad-page { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .railroad-intro { margin-bottom: 1.5rem; }
        .railroad-intro h1 { font-size: 1.5rem; color: #204051; margin-bottom: 0.5rem; }
        .railroad-intro p { font-size: 1rem; color: #555; line-height: 1.6; max-width: 800px; }
        .railroad-stats { display: flex; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; }
        .railroad-stats .stat { text-align: center; }
        .railroad-stats .stat-value { font-size: 2rem; font-weight: 700; color: #204051; }
        .railroad-stats .stat-label { font-size: 0.85rem; color: #666; }
        .railroad-map-container {
          margin: 2rem 0; border-radius: 12px; overflow: hidden;
          border: 1px solid #e8ede8; box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .railroad-map-header {
          background: #1a1a2e; color: #fff; padding: 1rem 1.25rem;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .railroad-map-header h2 { font-size: 1.1rem; margin: 0; }
        .railroad-map-legend { display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.8rem; }
        .railroad-map-legend .legend-item { display: flex; align-items: center; gap: 0.4rem; }
        .railroad-map-legend .legend-line { width: 24px; height: 3px; border-radius: 2px; }
        .railroad-map-legend .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        .filter-bar { margin-bottom: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
        .filter-bar label { font-size: 0.9rem; color: #555; font-weight: 600; }
        .filter-btn {
          padding: 0.4rem 0.9rem; border-radius: 20px; border: 1px solid #ddd;
          background: #fff; cursor: pointer; font-size: 0.85rem; color: #555;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: #204051; color: #204051; }
        .filter-btn.active { background: #204051; color: #fff; border-color: #204051; }
        .articles-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;
          margin-top: 2rem;
        }
        .article-card {
          background: #fff; border-radius: 12px; border: 1px solid #e8ede8;
          padding: 1.5rem; text-decoration: none; display: block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .article-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .article-card.highlighted { border-color: #204051; box-shadow: 0 4px 16px rgba(32,64,81,0.2); }
        .article-card-header { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; align-items: flex-start; }
        .article-color { width: 4px; height: 100%; min-height: 50px; border-radius: 2px; flex-shrink: 0; }
        .article-card h2 { font-size: 1.1rem; color: #204051; margin: 0 0 0.25rem; line-height: 1.3; }
        .article-meta { font-size: 0.8rem; color: #888; }
        .article-card p { font-size: 0.9rem; color: #555; line-height: 1.5; margin: 0.75rem 0; }
        .article-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
        .article-badge {
          font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 4px;
          background: #f0f4f0; color: #555;
        }
        .article-badge.region { font-weight: 600; }
        .article-cta { font-size: 0.85rem; color: #3b6978; font-weight: 600; margin-top: 1rem; }
        .related-section {
          margin-top: 3rem; padding: 1.5rem; background: #f8faf8;
          border-radius: 10px; border: 1px solid #e8ede8;
        }
        .related-section h3 { font-size: 1.1rem; color: #204051; margin: 0 0 0.75rem; }
        .related-section p { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
        .related-links { display: flex; gap: 1rem; flex-wrap: wrap; }
        .related-links a {
          display: inline-block; padding: 0.6rem 1.2rem; background: #204051;
          color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;
        }
        .related-links a.secondary { background: #fff; color: #204051; border: 1px solid #204051; }
      `}} />

      <main className="railroad-page">
        <section className="railroad-intro">
          <h1>The Railroads That Built Montana</h1>
          <p>
            From the Northern Pacific&apos;s golden spike at Gold Creek in 1883 to the Milwaukee Road&apos;s
            electrified crossing of the Rockies, Montana&apos;s railroad history shaped the towns, economies,
            and cultures of the state. Explore {articles.length} articles covering depots, disasters, labor
            struggles, and the abandoned corridors that still mark the landscape.
          </p>
          <div className="railroad-stats">
            <div className="stat">
              <div className="stat-value">{articles.length}</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat">
              <div className="stat-value">{points.length}</div>
              <div className="stat-label">Mapped Locations</div>
            </div>
            <div className="stat">
              <div className="stat-value">{routes.length}</div>
              <div className="stat-label">Railroad Routes</div>
            </div>
          </div>
        </section>

        <section className="railroad-map-container">
          <div className="railroad-map-header">
            <h2>Interactive Railroad Map</h2>
            <div className="railroad-map-legend">
              <div className="legend-item">
                <span className="legend-line" style={{ background: '#27ae60' }} />
                <span>Active</span>
              </div>
              <div className="legend-item">
                <span className="legend-line" style={{ background: '#8B6914', borderStyle: 'dashed' }} />
                <span>Active (BNSF)</span>
              </div>
              <div className="legend-item">
                <span className="legend-line" style={{ background: '#888', opacity: 0.6 }} />
                <span>Abandoned</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#204051' }} />
                <span>Historic Site</span>
              </div>
            </div>
          </div>
          <RailroadMap
            points={filteredPoints}
            routes={filteredRoutes}
            highlightedArticle={selectedArticle}
            subtypeLabels={subtypeLabels}
            statusLabels={statusLabels}
          />
        </section>

        <div className="filter-bar">
          <label>Filter by region:</label>
          <button
            type="button"
            className={`filter-btn ${!filterRegion ? 'active' : ''}`}
            onClick={() => setFilterRegion(null)}
          >
            All
          </button>
          {regions.map(region => (
            <button
              key={region}
              type="button"
              className={`filter-btn ${filterRegion === region ? 'active' : ''}`}
              onClick={() => setFilterRegion(region)}
              style={filterRegion === region ? { background: regionColors[region] || '#204051' } : {}}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="articles-grid">
          {filteredArticles.map(article => (
            <Link
              key={article.slug}
              href={`/guides/montana-railroad-history/${article.slug}/`}
              className={`article-card ${selectedArticle === article.slug ? 'highlighted' : ''}`}
              onMouseEnter={() => handleArticleHover(article.slug)}
              onMouseLeave={() => handleArticleHover(null)}
            >
              <div className="article-card-header">
                <div className="article-color" style={{ background: article.color }} />
                <div>
                  <h2>{article.title}</h2>
                  <div className="article-meta">{article.year} · {article.voice}</div>
                </div>
              </div>
              <p>{article.excerpt}</p>
              <div className="article-badges">
                <span
                  className="article-badge region"
                  style={{ background: regionColors[article.region] || '#666', color: '#fff' }}
                >
                  {article.region}
                </span>
              </div>
              <div className="article-cta">Read Article →</div>
            </Link>
          ))}
        </div>

        <section className="related-section">
          <h3>Continue Exploring Montana History</h3>
          <p>
            Discover more about Montana&apos;s past through our historic markers, themed trails, and the
            Backroads Planner for driving routes along scenic highways.
          </p>
          <div className="related-links">
            <Link href="/guides/history-trails/railroad-heritage/">Railroad Heritage Trail</Link>
            <Link href="/historic-markers/" className="secondary">Historic Marker Explorer</Link>
            <Link href="/planners/backroads-planner/" className="secondary">Backroads Planner</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = getRailroadHistoryData();

  return {
    props: {
      articles: data.articles,
      points: data.points,
      routes: data.routes,
      subtypeLabels: data.subtypeLabels,
      statusLabels: data.statusLabels,
    },
  };
};
