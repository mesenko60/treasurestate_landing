import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';

type Trail = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  estimatedDays: string;
  totalMiles: number;
  markerCount: number;
  regions: string[];
  highlights: string[];
};

type Props = {
  trails: Trail[];
  totalMarkers: number;
};

const difficultyColors: Record<string, string> = {
  'easy': '#27ae60',
  'moderate': '#f39c12',
  'multi-day': '#8e44ad',
};

export default function HistoryTrailsIndex({ trails, totalMarkers }: Props) {
  const url = 'https://treasurestate.com/guides/history-trails/';
  const title = 'Montana History Trails — Thematic Historic Marker Collections';
  const desc = `${trails.length} themed collections of Montana historic markers (Lewis & Clark, mining, battlefields, and more). Markers are grouped by topic for reading—not aligned to a single highway. For real roadway routes along US and state highways, use the Backroads Planner.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides/' },
    { name: 'History Trails', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: trails.length,
      itemListElement: trails.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristTrip',
          name: t.name,
          description: t.description,
          url: `${url}${t.id}/`,
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
        title="Montana History Trails"
        subtitle="Thematic marker collections by topic — not highway-by-highway routes"
        image="/images/hero-image.jpg"
        alt="Historic marker in Montana"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .history-trails-page { max-width: 1000px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .trails-intro { margin-bottom: 2rem; }
        .trails-intro h1 { font-size: 1.5rem; color: #204051; margin-bottom: 0.5rem; }
        .trails-intro p { font-size: 1rem; color: #555; line-height: 1.6; }
        .trails-stats { display: flex; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap; }
        .trails-stats .stat { text-align: center; }
        .trails-stats .stat-value { font-size: 2rem; font-weight: 700; color: #204051; }
        .trails-stats .stat-label { font-size: 0.85rem; color: #666; }
        .trails-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .trail-card {
          background: #fff; border-radius: 12px; border: 1px solid #e8ede8;
          padding: 1.5rem; text-decoration: none; display: block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .trail-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .trail-card h2 { font-size: 1.15rem; color: #204051; margin: 0 0 0.5rem; }
        .trail-card p { font-size: 0.9rem; color: #555; line-height: 1.5; margin: 0 0 1rem; }
        .trail-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .trail-badge {
          font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px;
          background: #f0f4f0; color: #555;
        }
        .trail-badge.difficulty { color: #fff; }
        .trail-highlights { font-size: 0.82rem; color: #666; margin-top: 0.75rem; }
        .trail-highlights strong { color: #204051; }
        .trail-cta { font-size: 0.85rem; color: #3b6978; font-weight: 600; margin-top: 1rem; }
        .explore-all {
          margin-top: 2.5rem; padding: 1.5rem; background: #f8faf8;
          border-radius: 10px; border: 1px solid #e8ede8; text-align: center;
        }
        .explore-all h3 { font-size: 1.1rem; color: #204051; margin: 0 0 0.5rem; }
        .explore-all p { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
        .explore-all a {
          display: inline-block; padding: 0.7rem 1.5rem; background: #204051;
          color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600;
        }
        .highway-callout {
          margin-bottom: 2rem; padding: 1.25rem 1.35rem;
          background: linear-gradient(135deg, #e8f4f8 0%, #f0f7fa 100%);
          border: 1px solid #c5dde6; border-radius: 10px;
        }
        .highway-callout h2 { font-size: 1.1rem; color: #204051; margin: 0 0 0.5rem; }
        .highway-callout p { font-size: 0.95rem; color: #444; line-height: 1.55; margin: 0 0 0.85rem; }
        .highway-callout .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .highway-callout a.primary {
          display: inline-block; padding: 0.55rem 1.1rem; background: #204051;
          color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.9rem;
        }
        .highway-callout a.secondary {
          font-size: 0.88rem; color: #3b6978; font-weight: 600;
        }
      `}} />

      <main className="history-trails-page">
        <section className="trails-intro">
          <h1>Discover Montana&apos;s History by Theme</h1>
          <p>
            Montana has thousands of roadside markers. We group them into {trails.length} <strong>thematic
            collections</strong> (Lewis &amp; Clark, mining, railroads, and more) so you can explore related
            stories. <strong>These lists are not a single driveable highway route:</strong> markers were placed
            where topics happened, and many only mention the theme in passing. The map line connects stops for
            browsing—it does not follow one road.
          </p>
          <div className="trails-stats">
            <div className="stat">
              <div className="stat-value">{trails.length}</div>
              <div className="stat-label">History Trails</div>
            </div>
            <div className="stat">
              <div className="stat-value">{totalMarkers.toLocaleString()}+</div>
              <div className="stat-label">Historic Markers</div>
            </div>
            <div className="stat">
              <div className="stat-value">{trails.reduce((sum, t) => sum + t.markerCount, 0)}</div>
              <div className="stat-label">Trail Markers</div>
            </div>
          </div>
        </section>

        <aside className="highway-callout" aria-label="Highway-based scenic routes">
          <h2>Want actual highway driving routes?</h2>
          <p>
            Our <strong>Backroads Planner</strong> uses real corridors—US and state highways with mapped road
            geometry, distances, towns, and services. Examples include the Beartooth (US-212), Paradise Valley
            (US-89), Skalkaho, and Montana Highway 200. Those routes are independent of marker themes.
          </p>
          <div className="actions">
            <Link href="/planners/backroads-planner/" className="primary">Open Backroads Planner</Link>
            <Link href="/guides/montana-backroads/" className="secondary">Montana backroads &amp; byways guide →</Link>
          </div>
        </aside>

        <div className="trails-grid">
          {trails.map(trail => (
            <Link key={trail.id} href={`/guides/history-trails/${trail.id}/`} className="trail-card">
              <div className="trail-meta">
                <span
                  className="trail-badge difficulty"
                  style={{ background: difficultyColors[trail.difficulty] || '#666' }}
                >
                  {trail.estimatedDays} days
                </span>
                <span className="trail-badge">{trail.markerCount} markers</span>
                <span className="trail-badge">{trail.totalMiles} mi</span>
              </div>
              <h2>{trail.name}</h2>
              <p>{trail.description}</p>
              <div className="trail-highlights">
                <strong>Highlights:</strong> {trail.highlights.slice(0, 2).join(' • ')}
              </div>
              <div className="trail-cta">View Trail &rarr;</div>
            </Link>
          ))}
        </div>

        <aside className="highway-callout" aria-label="Railroad History" style={{ marginTop: '2rem' }}>
          <h2>Montana Railroad History</h2>
          <p>
            Explore the iron horse that built Montana. Our <strong>interactive railroad map</strong> covers
            18 articles and 42 locations from the 1883 golden spike to the abandoned Milwaukee Road, with
            depots, disasters, and historic routes mapped across the state.
          </p>
          <div className="actions">
            <Link href="/guides/montana-railroad-history/" className="primary">Explore Railroad History</Link>
          </div>
        </aside>

        <div className="explore-all">
          <h3>Explore All Historic Markers</h3>
          <p>
            Browse our interactive map of {totalMarkers.toLocaleString()}+ historic markers across Montana.
            Filter by topic, region, or find markers near any town.
          </p>
          <Link href="/historic-markers/">Open Marker Explorer</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const trailsPath = path.join(process.cwd(), 'data', 'history-trails.json');
  const markersPath = path.join(process.cwd(), 'data', 'historic-markers.json');

  const trails: Trail[] = fs.existsSync(trailsPath)
    ? JSON.parse(fs.readFileSync(trailsPath, 'utf8'))
    : [];

  const markers = fs.existsSync(markersPath)
    ? JSON.parse(fs.readFileSync(markersPath, 'utf8'))
    : [];

  return {
    props: {
      trails,
      totalMarkers: markers.length,
    },
  };
};
