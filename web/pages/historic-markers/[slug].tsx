import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.default), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false });

type MarkerData = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  lat: number;
  lng: number;
  town: string | null;
  townSlug: string | null;
  county: string;
  inscription: string;
  topics: string[];
  yearErected: string | null;
  erectedBy: string | null;
  hmdbLink: string | null;
  nearbyMarkers: string[];
};

type Trail = {
  id: string;
  name: string;
  markerIds: string[];
};

type Props = {
  marker: MarkerData;
  nearbyMarkers: MarkerData[];
  trails: { id: string; name: string }[];
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const TOPIC_LABELS: Record<string, string> = {
  'architecture': 'Architecture',
  'industry': 'Industry & Commerce',
  'exploration': 'Exploration',
  'native-american': 'Native American Heritage',
  'settlements': 'Settlements & Settlers',
  'military': 'Military & Wars',
  'nature': 'Nature & Wildlife',
  'transportation': 'Transportation',
  'disasters': 'Disasters',
  'culture': 'Culture & Entertainment',
  'railroads': 'Railroads',
  'mining': 'Mining History',
  'people': 'Notable People',
  'landmarks': 'Landmarks',
  'cemeteries': 'Cemeteries',
  'parks': 'Parks & Recreation',
};

export default function HistoricMarkerPage({ marker, nearbyMarkers, trails }: Props) {
  const url = `https://treasurestate.com/historic-markers/${marker.slug}/`;
  const title = marker.title;
  const desc = marker.inscription.substring(0, 160).replace(/\n/g, ' ') + '...';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Historic Markers', url: '/historic-markers/' },
    { name: marker.title.length > 40 ? marker.title.substring(0, 40) + '...' : marker.title, url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LandmarksOrHistoricalBuildings',
    name: marker.title,
    description: desc,
    url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: marker.lat,
      longitude: marker.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: marker.town || undefined,
      addressRegion: 'Montana',
      addressCountry: 'US',
    },
    isAccessibleForFree: true,
  };

  const paragraphs = marker.inscription.split(/\n\n+/).filter(p => p.trim());

  return (
    <>
      <Head>
        <title>{`${title} — Montana Historic Marker | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${title} — Montana Historic Marker`} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <Header />
      <Hero title={marker.title} subtitle={marker.subtitle || 'Historic Marker'} image="/images/hero-image.jpg" alt={marker.title} small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .marker-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .marker-header { margin-bottom: 1.5rem; }
        .marker-header h1 { font-size: 1.6rem; color: #204051; margin-bottom: 0.3rem; }
        .marker-header .subtitle { font-size: 1rem; color: #666; font-style: italic; }
        .marker-location { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1rem 0; font-size: 0.9rem; color: #555; }
        .marker-location a { color: #3b6978; }
        .marker-topics { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }
        .topic-badge { font-size: 0.8rem; padding: 0.3rem 0.7rem; background: #e8f4f8; border-radius: 4px; color: #3b6978; }
        .marker-content { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        @media (max-width: 768px) { .marker-content { grid-template-columns: 1fr; } }
        .marker-inscription { line-height: 1.8; color: #333; }
        .marker-inscription p { margin-bottom: 1rem; }
        .marker-sidebar {}
        .marker-map { height: 250px; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0; margin-bottom: 1rem; }
        .marker-actions { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .marker-actions a {
          display: block; padding: 0.6rem 1rem; background: #f8faf8;
          border: 1px solid #e8ede8; border-radius: 6px; text-decoration: none;
          font-size: 0.9rem; color: #204051; text-align: center;
        }
        .marker-actions a:hover { background: #e8f4f8; }
        .marker-meta { font-size: 0.85rem; color: #666; }
        .marker-meta dt { font-weight: 600; color: #204051; margin-top: 0.75rem; }
        .marker-meta dd { margin: 0.2rem 0 0 0; }
        .nearby-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e8ede8; }
        .nearby-section h2 { font-size: 1.1rem; color: #204051; margin-bottom: 1rem; }
        .nearby-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .nearby-card {
          padding: 0.75rem; background: #f8faf8; border-radius: 6px;
          border: 1px solid #e8ede8; text-decoration: none;
        }
        .nearby-card h3 { font-size: 0.9rem; color: #204051; margin: 0 0 0.2rem; }
        .nearby-card span { font-size: 0.8rem; color: #888; }
        .trails-section { margin-top: 1.5rem; }
        .trails-section h3 { font-size: 0.95rem; color: #204051; margin-bottom: 0.5rem; }
        .trail-link { display: inline-block; margin-right: 1rem; font-size: 0.9rem; color: #3b6978; }
        .map-marker-icon {
          width: 20px; height: 20px; background: #c0392b; border: 2px solid #fff;
          border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}} />

      <main className="marker-page">
        <article>
          <header className="marker-header">
            <h1>{marker.title}</h1>
            {marker.subtitle && <div className="subtitle">{marker.subtitle}</div>}
          </header>

          <div className="marker-location">
            <span>
              📍 {marker.town && marker.townSlug ? (
                <Link href={`/montana-towns/${marker.townSlug}/`}>{marker.town}</Link>
              ) : marker.town || 'Unknown location'}
              {marker.county && `, ${marker.county} County`}
            </span>
            <span>
              🧭 {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
            </span>
          </div>

          {marker.topics.length > 0 && (
            <div className="marker-topics">
              {marker.topics.map(t => (
                <span key={t} className="topic-badge">{TOPIC_LABELS[t] || t}</span>
              ))}
            </div>
          )}

          <div className="marker-content">
            <div className="marker-inscription">
              <h2 style={{ fontSize: '1.1rem', color: '#204051', marginBottom: '1rem' }}>Marker Inscription</h2>
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <aside className="marker-sidebar">
              <div className="marker-map">
                {MAPBOX_TOKEN && (
                  <Map
                    initialViewState={{
                      latitude: marker.lat,
                      longitude: marker.lng,
                      zoom: 12,
                    }}
                    mapStyle="mapbox://styles/mapbox/outdoors-v12"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                    interactive={false}
                  >
                    <Marker latitude={marker.lat} longitude={marker.lng} anchor="center">
                      <div className="map-marker-icon" />
                    </Marker>
                  </Map>
                )}
              </div>

              <div className="marker-actions">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </div>

              <dl className="marker-meta">
                {marker.yearErected && (
                  <>
                    <dt>Year Erected</dt>
                    <dd>{marker.yearErected}</dd>
                  </>
                )}
                {marker.erectedBy && (
                  <>
                    <dt>Erected By</dt>
                    <dd>{marker.erectedBy}</dd>
                  </>
                )}
              </dl>

              {trails.length > 0 && (
                <div className="trails-section">
                  <h3>Part of These Trails</h3>
                  {trails.map(t => (
                    <Link key={t.id} href={`/guides/history-trails/${t.id}/`} className="trail-link">
                      {t.name}
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </article>

        {nearbyMarkers.length > 0 && (
          <section className="nearby-section">
            <h2>Nearby Markers</h2>
            <div className="nearby-grid">
              {nearbyMarkers.map(m => (
                <Link key={m.id} href={`/historic-markers/${m.slug}/`} className="nearby-card">
                  <h3>{m.title.length > 35 ? m.title.substring(0, 35) + '...' : m.title}</h3>
                  <span>{m.town || m.county}</span>
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

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const curatedPath = path.join(process.cwd(), 'data', 'historic-markers-curated.json');
  const curated: MarkerData[] = fs.existsSync(curatedPath)
    ? JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
    : [];

  return {
    paths: curated.map(m => ({ params: { slug: m.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  const curatedPath = path.join(process.cwd(), 'data', 'historic-markers-curated.json');
  const allMarkersPath = path.join(process.cwd(), 'data', 'historic-markers.json');
  const trailsPath = path.join(process.cwd(), 'data', 'history-trails.json');

  const curated: MarkerData[] = fs.existsSync(curatedPath)
    ? JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
    : [];

  const allMarkers: MarkerData[] = fs.existsSync(allMarkersPath)
    ? JSON.parse(fs.readFileSync(allMarkersPath, 'utf8'))
    : [];

  const allTrails: Trail[] = fs.existsSync(trailsPath)
    ? JSON.parse(fs.readFileSync(trailsPath, 'utf8'))
    : [];

  const marker = curated.find(m => m.slug === slug);

  if (!marker) {
    return { notFound: true };
  }

  const curatedSet = new Set(curated.map(m => m.slug));
  const nearbyMarkers = allMarkers
    .filter(m => m.id !== marker.id && curatedSet.has(m.slug))
    .map(m => ({
      ...m,
      distance: haversineDistance(marker.lat, marker.lng, m.lat, m.lng),
    }))
    .filter(m => m.distance < 50)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  const trails = allTrails
    .filter(t => t.markerIds.includes(marker.id))
    .map(t => ({ id: t.id, name: t.name }));

  return {
    props: {
      marker,
      nearbyMarkers,
      trails,
    },
  };
};
