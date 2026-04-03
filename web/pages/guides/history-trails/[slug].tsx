import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import MarkerInscription from '../../../components/MarkerInscription';
import { HISTORIC_MARKER_MAP_POPUP_SCROLL } from '../../../lib/historicMarkerMapPopup';
import { MARKER_DEEP_READS } from '../../../lib/markerDeepReads';

const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.default), { ssr: false });
const Source = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Layer), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Popup), { ssr: false });

type MarkerData = {
  id: string;
  slug: string;
  title: string;
  lat: number;
  lng: number;
  town: string | null;
  townSlug: string | null;
  county: string;
  inscription: string;
  topics: string[];
};

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
  markerIds: string[];
};

type Props = {
  trail: Trail;
  markers: MarkerData[];
  prevTrail: { id: string; name: string } | null;
  nextTrail: { id: string; name: string } | null;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function HistoryTrailPage({ trail, markers, prevTrail, nextTrail }: Props) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 46.8,
    longitude: -110.5,
    zoom: 5.5,
  });

  const url = `https://treasurestate.com/guides/history-trails/${trail.id}/`;
  const title = `${trail.name} | Montana History Trail`;
  const desc = trail.description;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides/' },
    { name: 'History Trails', url: '/guides/history-trails/' },
    { name: trail.name, url },
  ];

  const bounds = useMemo(() => {
    if (markers.length === 0) return null;
    const lngs = markers.map(m => m.lng);
    const lats = markers.map(m => m.lat);
    return {
      minLng: Math.min(...lngs) - 0.5,
      maxLng: Math.max(...lngs) + 0.5,
      minLat: Math.min(...lats) - 0.3,
      maxLat: Math.max(...lats) + 0.3,
    };
  }, [markers]);

  const lineGeoJson = useMemo(() => ({
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: markers.map(m => [m.lng, m.lat]),
    },
  }), [markers]);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trail.name,
    description: desc,
    url,
    touristType: 'History enthusiasts',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: markers.length,
      itemListElement: markers.slice(0, 20).map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: m.title,
          geo: { '@type': 'GeoCoordinates', latitude: m.lat, longitude: m.lng },
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
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <Header />
      <Hero title={trail.name} subtitle={`${trail.markerCount} Historic Markers`} image="/images/hero-image.jpg" alt={trail.name} small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .trail-page { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .trail-header { margin-bottom: 1.5rem; }
        .trail-header h1 { font-size: 1.6rem; color: #204051; margin-bottom: 0.5rem; }
        .trail-header p { font-size: 1rem; color: #555; line-height: 1.6; }
        .trail-meta-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1rem 0; }
        .trail-meta-item { font-size: 0.9rem; color: #666; }
        .trail-meta-item strong { color: #204051; }
        .trail-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; }
        @media (max-width: 900px) { .trail-layout { grid-template-columns: 1fr; } }
        .trail-map-container { height: 500px; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
        .trail-markers-list { max-height: 500px; overflow-y: auto; }
        .marker-item {
          padding: 1rem; border-bottom: 1px solid #f0f0f0;
          cursor: pointer; transition: background 0.15s;
        }
        .marker-item:hover { background: #f8faf8; }
        .marker-item.active { background: #e8f4f8; border-left: 3px solid #3b6978; }
        .marker-item h3 { font-size: 0.95rem; color: #204051; margin: 0 0 0.3rem; }
        .marker-item .marker-loc { font-size: 0.8rem; color: #888; }
        .marker-item .marker-excerpt { font-size: 0.85rem; color: #555; margin-top: 0.4rem; line-height: 1.4; }
        .trail-highlights { margin-top: 2rem; }
        .trail-highlights h2 { font-size: 1.2rem; color: #204051; margin-bottom: 1rem; }
        .highlights-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
        .highlight-item { padding: 1rem; background: #f8faf8; border-radius: 8px; border: 1px solid #e8ede8; }
        .highlight-item span { font-size: 0.9rem; color: #204051; }
        .trail-nav { display: flex; justify-content: space-between; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e8ede8; }
        .trail-nav a { font-size: 0.9rem; color: #3b6978; text-decoration: none; }
        .trail-nav a:hover { text-decoration: underline; }
        .map-marker {
          width: 24px; height: 24px; background: #c0392b; border: 2px solid #fff;
          border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: #fff; font-weight: 700;
        }
        .map-marker.selected { background: #27ae60; transform: scale(1.2); }
      `}} />

      <main className="trail-page">
        <section className="trail-header">
          <h1>{trail.name}</h1>
          <p>{trail.description}</p>
          <div className="trail-meta-row">
            <div className="trail-meta-item"><strong>{trail.estimatedDays}</strong> days suggested</div>
            <div className="trail-meta-item"><strong>{trail.totalMiles}</strong> miles</div>
            <div className="trail-meta-item"><strong>{markers.length}</strong> historic markers</div>
            <div className="trail-meta-item">Regions: {trail.regions.join(', ')}</div>
          </div>
        </section>

        <div className="trail-layout">
          <div className="trail-map-container">
            {MAPBOX_TOKEN && (
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
                initialViewState={bounds ? {
                  bounds: [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]],
                  fitBoundsOptions: { padding: 40 },
                } : undefined}
              >
                <Source id="trail-line" type="geojson" data={lineGeoJson}>
                  <Layer
                    id="trail-line-layer"
                    type="line"
                    paint={{
                      'line-color': '#c0392b',
                      'line-width': 3,
                      'line-opacity': 0.6,
                      'line-dasharray': [2, 2],
                    }}
                  />
                </Source>
                {markers.map((m, idx) => (
                  <Marker key={m.id} latitude={m.lat} longitude={m.lng} anchor="center">
                    <div
                      className={`map-marker ${selectedMarker?.id === m.id ? 'selected' : ''}`}
                      onClick={() => setSelectedMarker(m)}
                    >
                      {idx + 1}
                    </div>
                  </Marker>
                ))}
                {selectedMarker && (
                  <Popup
                    latitude={selectedMarker.lat}
                    longitude={selectedMarker.lng}
                    onClose={() => setSelectedMarker(null)}
                    closeButton
                    closeOnClick={false}
                    anchor="bottom"
                    offset={15}
                  >
                    <div
                      style={{
                        maxWidth: 420,
                        maxHeight: 'min(78vh, 560px)',
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                      }}
                    >
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', color: '#204051', flexShrink: 0 }}>
                        {selectedMarker.title}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#888', margin: '0 0 0.4rem', flexShrink: 0 }}>
                        {selectedMarker.town || selectedMarker.county}
                      </p>
                      <div style={{ ...HISTORIC_MARKER_MAP_POPUP_SCROLL, flex: 1, minHeight: 0, marginBottom: '0.45rem' }}>
                        <MarkerInscription text={selectedMarker.inscription} variant="popup" />
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
                        {MARKER_DEEP_READS[selectedMarker.slug] && (
                          <Link
                            href={MARKER_DEEP_READS[selectedMarker.slug].href}
                            style={{ fontSize: '0.78rem', color: '#925f14', fontWeight: 600 }}
                          >
                            {MARKER_DEEP_READS[selectedMarker.slug].title} →
                          </Link>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.78rem', color: '#3b6978' }}
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>
            )}
          </div>

          <div className="trail-markers-list">
            <h2 style={{ fontSize: '1rem', color: '#204051', margin: '0 0 0.75rem', padding: '0 1rem' }}>
              Trail Stops
            </h2>
            {markers.map((m, idx) => (
              <div
                key={m.id}
                className={`marker-item ${selectedMarker?.id === m.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMarker(m);
                  setViewState({ ...viewState, latitude: m.lat, longitude: m.lng, zoom: 10 });
                }}
              >
                <h3>{idx + 1}. {m.title}</h3>
                <div className="marker-loc">
                  {m.town || m.county}{m.town && m.county ? `, ${m.county} County` : ''}
                </div>
                <div className="marker-excerpt">
                  <MarkerInscription text={m.inscription} variant="compact" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="trail-highlights">
          <h2>Trail Highlights</h2>
          <div className="highlights-grid">
            {trail.highlights.map((h, i) => (
              <div key={i} className="highlight-item">
                <span>{h}</span>
              </div>
            ))}
          </div>
        </section>

        <nav className="trail-nav">
          {prevTrail ? (
            <Link href={`/guides/history-trails/${prevTrail.id}/`}>&larr; {prevTrail.name}</Link>
          ) : <span />}
          {nextTrail ? (
            <Link href={`/guides/history-trails/${nextTrail.id}/`}>{nextTrail.name} &rarr;</Link>
          ) : <span />}
        </nav>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const trailsPath = path.join(process.cwd(), 'data', 'history-trails.json');
  const trails: Trail[] = fs.existsSync(trailsPath)
    ? JSON.parse(fs.readFileSync(trailsPath, 'utf8'))
    : [];

  return {
    paths: trails.map(t => ({ params: { slug: t.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  const trailsPath = path.join(process.cwd(), 'data', 'history-trails.json');
  const markersPath = path.join(process.cwd(), 'data', 'historic-markers.json');

  const trails: Trail[] = fs.existsSync(trailsPath)
    ? JSON.parse(fs.readFileSync(trailsPath, 'utf8'))
    : [];

  const allMarkers: MarkerData[] = fs.existsSync(markersPath)
    ? JSON.parse(fs.readFileSync(markersPath, 'utf8'))
    : [];

  const trailIndex = trails.findIndex(t => t.id === slug);
  const trail = trails[trailIndex];

  if (!trail) {
    return { notFound: true };
  }

  const markerLookup = new globalThis.Map(allMarkers.map(m => [m.id, m]));
  const markers = trail.markerIds
    .map(id => markerLookup.get(id))
    .filter((m): m is MarkerData => m !== undefined);

  const prevTrail = trailIndex > 0 ? { id: trails[trailIndex - 1].id, name: trails[trailIndex - 1].name } : null;
  const nextTrail = trailIndex < trails.length - 1 ? { id: trails[trailIndex + 1].id, name: trails[trailIndex + 1].name } : null;

  return {
    props: {
      trail,
      markers,
      prevTrail,
      nextTrail,
    },
  };
};
