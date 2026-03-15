import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import React, { useState, useRef, useMemo } from 'react';
import Map, { Source, Layer, Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import TableOfContents from '../../components/TableOfContents';
import StaysCTA from '../../components/StaysCTA';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

type POI = {
  name: string;
  type: string;
  category: string;
  lat: number;
  lng: number;
  distFromRoute: number;
  rating: number | null;
  reviews: number | null;
};

type Corridor = {
  id: string;
  name: string;
  description: string;
  highways: string[];
  distanceMiles: number;
  elevationRange: [number, number];
  season: string;
  difficulty: string;
  color: string;
  startTown: string;
  endTown: string;
  throughTowns: string[];
  connections: string[];
  geometry: { type: 'LineString'; coordinates: number[][] };
  pois: POI[];
};

type TownData = {
  name: string;
  lat: number;
  lng: number;
  elevation: number;
  county: string;
  population: number;
};

type TownCoord = { name: string; lat: number; lng: number };

type ConnectedCorridor = {
  id: string;
  name: string;
  description: string;
  highways: string[];
  distanceMiles: number;
  difficulty: string;
  color: string;
  season: string;
};

type Props = {
  corridor: Corridor;
  connectedCorridors: ConnectedCorridor[];
  towns: Record<string, TownData>;
  townCoords: Record<string, TownCoord>;
};

const CATEGORY_COLORS: Record<string, string> = {
  hotspring: '#e74c3c',
  campground: '#27ae60',
  hiking: '#8e44ad',
  recreation: '#3b6978',
};
const CATEGORY_LABELS: Record<string, string> = {
  hotspring: 'Hot Springs',
  campground: 'Campgrounds',
  hiking: 'Hiking Trails',
  recreation: 'Recreation & Culture',
};
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#27ae60',
  moderate: '#f39c12',
  challenging: '#c0392b',
};

const TOWN_DESCRIPTIONS: Record<string, string> = {
  missoula: "University town and western Montana's cultural hub at the valley's north end.",
  stevensville: 'Montana\'s oldest town, founded as a Jesuit mission in 1841.',
  hamilton: "The valley's commercial center, gateway to the Bitterroot National Forest.",
  darby: "Small ranching community at the valley's south end, near Lake Como.",
};

const VALLEY_TOWNS = ['missoula', 'stevensville', 'hamilton', 'darby'] as const;

function starRating(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (half) stars.push('½');
  return stars.join('');
}

function googleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

function ValleyMap({ corridor, townCoords }: { corridor: Corridor; townCoords: Record<string, TownCoord> }) {
  const mapRef = useRef<MapRef>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  const geojsonData = useMemo(() => ({
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: corridor.geometry.coordinates,
    },
  }), [corridor]);

  const lineLayerStyle = {
    id: 'corridor-route',
    type: 'line' as const,
    paint: { 'line-color': corridor.color, 'line-width': 4, 'line-opacity': 0.85 },
    layout: { 'line-cap': 'round' as const, 'line-join': 'round' as const },
  };

  const casingLayerStyle = {
    id: 'corridor-route-casing',
    type: 'line' as const,
    paint: { 'line-color': '#fff', 'line-width': 7, 'line-opacity': 0.6 },
    layout: { 'line-cap': 'round' as const, 'line-join': 'round' as const },
  };

  const townEntries = VALLEY_TOWNS
    .map(slug => townCoords[slug] ? { slug, ...townCoords[slug] } : null)
    .filter(Boolean) as Array<{ slug: string; name: string; lat: number; lng: number }>;

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
      <Map
        ref={mapRef}
        initialViewState={{ latitude: 46.3, longitude: -114.1, zoom: 8.5 }}
        style={{ width: '100%', height: '500px' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        cooperativeGestures={true}
        onClick={() => setSelectedPoi(null)}
      >
        <NavigationControl position="top-right" />

        <Source id="corridor-line" type="geojson" data={geojsonData}>
          <Layer {...casingLayerStyle} />
          <Layer {...lineLayerStyle} />
        </Source>

        {townEntries.map(t => (
          <Marker key={t.slug} longitude={t.lng} latitude={t.lat} anchor="bottom">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{
                background: '#204051',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                whiteSpace: 'nowrap',
                marginBottom: '2px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              }}>{t.name}</span>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#204051',
                border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
          </Marker>
        ))}

        {corridor.pois.map((poi, i) => (
          <Marker
            key={`${poi.name}-${i}`}
            longitude={poi.lng}
            latitude={poi.lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedPoi(poi); }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: CATEGORY_COLORS[poi.category] || '#3b6978',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              cursor: 'pointer',
            }} />
          </Marker>
        ))}

        {selectedPoi && (
          <Popup
            longitude={selectedPoi.lng}
            latitude={selectedPoi.lat}
            anchor="bottom"
            offset={12}
            onClose={() => setSelectedPoi(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="260px"
          >
            <div style={{ padding: '4px 2px', fontFamily: 'inherit' }}>
              <strong style={{ fontSize: '0.95rem', color: '#204051' }}>{selectedPoi.name}</strong>
              <div style={{ fontSize: '0.82rem', color: '#666', margin: '4px 0 2px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  background: CATEGORY_COLORS[selectedPoi.category] || '#3b6978',
                  color: '#fff',
                  fontSize: '0.75rem',
                  marginRight: '6px',
                }}>
                  {CATEGORY_LABELS[selectedPoi.category] || selectedPoi.category}
                </span>
              </div>
              {selectedPoi.rating && (
                <div style={{ fontSize: '0.85rem', color: '#d8973c', margin: '4px 0' }}>
                  {starRating(selectedPoi.rating)}{' '}
                  <span style={{ color: '#999', fontSize: '0.78rem' }}>
                    {selectedPoi.rating.toFixed(1)}{selectedPoi.reviews ? ` (${selectedPoi.reviews} reviews)` : ''}
                  </span>
                </div>
              )}
              {selectedPoi.distFromRoute > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0' }}>
                  {selectedPoi.distFromRoute} mi from route
                </div>
              )}
              <a
                href={googleMapsUrl(selectedPoi.lat, selectedPoi.lng)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}
              >
                Get Directions →
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default function BitterrootValleyPlanner({ corridor, connectedCorridors, towns, townCoords }: Props) {
  const canonicalUrl = 'https://treasurestate.com/guides/bitterroot-valley/';
  const pageTitle = 'Bitterroot Valley Travel Planner — Montana\'s Premier Valley | Treasure State';
  const pageDescription = 'Plan your trip to Montana\'s Bitterroot Valley. Explore 75 miles of scenic US-93 from Missoula through Stevensville, Hamilton, and Darby with an interactive map, recreation highlights, scenic routes, and travel tips.';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners' },
    { name: 'Bitterroot Valley', url: canonicalUrl },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: '2026-01-15T00:00:00-07:00',
    dateModified: '2026-03-14T00:00:00-07:00',
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Bitterroot Valley',
    description: pageDescription,
    url: canonicalUrl,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.3,
      longitude: -114.1,
    },
    touristType: ['Hiking', 'Fly Fishing', 'Scenic Drives', 'Small-Town Exploration'],
    isAccessibleForFree: true,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Montana',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'MT',
        addressCountry: 'US',
      },
    },
  };

  const poisByCategory = useMemo(() => {
    const grouped: Record<string, POI[]> = {};
    corridor.pois.forEach(poi => {
      if (!grouped[poi.category]) grouped[poi.category] = [];
      grouped[poi.category].push(poi);
    });
    Object.values(grouped).forEach(arr =>
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    );
    return grouped;
  }, [corridor.pois]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />
      </Head>
      <Header />
      <Hero
        title="Bitterroot Valley Travel Planner"
        subtitle="Montana's Most Scenic Valley"
        image="/images/hero-image.jpg"
        alt="Bitterroot Valley in Montana with mountain views"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .bv-main { display: flex; gap: 40px; max-width: 1200px; margin: 0 auto; padding: 0 20px 3rem; position: relative; }
        .bv-toc { display: none; }
        @media (min-width: 1024px) { .bv-toc { display: block; width: 300px; flex-shrink: 0; } }
        .bv-content { flex: 1; min-width: 0; }
        .bv-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .bv-town-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin: 1rem 0; }
        .bv-town-card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .bv-town-card h3 { margin: 0 0 0.5rem; font-size: 1.1rem; }
        .bv-town-card h3 a { color: #3b6978; text-decoration: none; }
        .bv-town-card h3 a:hover { text-decoration: underline; }
        .bv-town-meta { font-size: 0.82rem; color: #888; margin-bottom: 0.5rem; }
        .bv-town-desc { font-size: 0.9rem; color: #555; line-height: 1.6; margin: 0; }
        .bv-route-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin: 1rem 0; }
        .bv-route-card { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid #ccc; text-decoration: none; color: inherit; transition: box-shadow 0.2s; }
        .bv-route-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .bv-poi-card { background: #f8faf8; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .bv-tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin: 1rem 0; }
        .bv-tip-card { background: #f8faf8; border-radius: 12px; padding: 1.25rem; }
        .bv-tip-card h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #204051; border-bottom: none; padding: 0; }
        .bv-tip-card p { margin: 0; font-size: 0.9rem; color: #555; line-height: 1.6; }
        .bv-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 1.5rem; }
        .bv-legend-item { font-size: 0.82rem; color: #666; display: flex; align-items: center; gap: 5px; }
        .bv-legend-dot { width: 10; height: 10; border-radius: 50%; display: inline-block; }
        .bv-legend-line { width: 18px; height: 3px; display: inline-block; border-radius: 2px; }
        .bv-explore-card { background: linear-gradient(135deg, #1a1e2e, #2d3348); padding: 24px 28px; border-radius: 12px; margin: 2rem 0; }
        .bv-explore-card h3 { color: #fff; margin: 0 0 8px; font-size: 1.15rem; border-bottom: none; padding: 0; }
        .bv-explore-card p { color: #a0a8b8; margin: 0 0 14px; font-size: 0.92rem; line-height: 1.6; }
      `}} />

      <main className="bv-main">
        <div className="bv-toc">
          <TableOfContents contentSelector=".content-section" />
        </div>

        <div className="bv-content">
          {/* Valley Overview */}
          <section className="content-section">
            <h2 className="bv-section-title">Valley Overview</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333' }}>
              The Bitterroot Valley stretches 75 miles south from Missoula along US-93, passing through
              Stevensville, Hamilton, and Darby before reaching the rugged backcountry of the Selway-Bitterroot
              Wilderness. Flanked by the dramatic Bitterroot Range to the west and the gentler Sapphire Mountains
              to the east, the valley is fed by the <Link href="/guides/fly-fishing-rivers#bitterroot-river" style={{ color: '#3b6978' }}>Bitterroot River</Link> — one of Montana&#39;s premier fly-fishing
              streams. Known for its small-town charm, world-class hiking, and a climate milder than much of
              the state, the Bitterroot is a year-round destination that rewards slow exploration.
            </p>
          </section>

          {/* Interactive Map */}
          <section className="content-section">
            <h2 className="bv-section-title">Interactive Map</h2>
            <ValleyMap corridor={corridor} townCoords={townCoords} />
            <div className="bv-legend">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <span key={cat} className="bv-legend-item">
                  <span className="bv-legend-dot" style={{ background: color }} />
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
              <span className="bv-legend-item">
                <span className="bv-legend-line" style={{ background: corridor.color }} />
                US-93 Route
              </span>
              <span className="bv-legend-item">
                <span className="bv-legend-dot" style={{ background: '#204051' }} />
                Towns
              </span>
            </div>
          </section>

          {/* Towns Along the Valley */}
          <section className="content-section">
            <h2 className="bv-section-title">Towns Along the Valley</h2>
            <div className="bv-town-grid">
              {VALLEY_TOWNS.map(slug => {
                const town = towns[slug];
                if (!town) return null;
                return (
                  <div key={slug} className="bv-town-card">
                    <h3>
                      <Link href={`/montana-towns/${slug}/`}>{town.name}</Link>
                    </h3>
                    <div className="bv-town-meta">
                      Pop. {town.population.toLocaleString()} · Elev. {town.elevation.toLocaleString()} ft · {town.county}
                    </div>
                    <p className="bv-town-desc">{TOWN_DESCRIPTIONS[slug]}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Scenic Routes */}
          <section className="content-section">
            <h2 className="bv-section-title">Scenic Routes</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Explore the Bitterroot corridor and connecting scenic drives that branch from the valley.
            </p>
            <div className="bv-route-grid">
              <Link
                href={`/planners/corridors/${corridor.id}/`}
                className="bv-route-card"
                style={{ borderLeftColor: corridor.color }}
              >
                <div style={{ fontWeight: 700, color: '#204051', marginBottom: '4px', fontSize: '1rem' }}>
                  {corridor.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '6px' }}>
                  {corridor.highways.join(', ')} · {corridor.distanceMiles} mi · {corridor.season}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5, margin: '0 0 6px' }}>
                  {corridor.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '10px',
                  background: DIFFICULTY_COLORS[corridor.difficulty] || '#999',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}>
                  {corridor.difficulty}
                </span>
              </Link>
              {connectedCorridors.map(cc => (
                <Link
                  key={cc.id}
                  href={`/planners/corridors/${cc.id}/`}
                  className="bv-route-card"
                  style={{ borderLeftColor: cc.color }}
                >
                  <div style={{ fontWeight: 700, color: '#204051', marginBottom: '4px', fontSize: '1rem' }}>
                    {cc.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '6px' }}>
                    {cc.highways.join(', ')} · {cc.distanceMiles} mi · {cc.season}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5, margin: '0 0 6px' }}>
                    {cc.description}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    background: DIFFICULTY_COLORS[cc.difficulty] || '#999',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}>
                    {cc.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Outdoor Recreation */}
          <section className="content-section">
            <h2 className="bv-section-title">Outdoor Recreation</h2>
            <p style={{ color: '#666', marginBottom: '1.25rem' }}>
              Top recreation highlights along the Bitterroot Valley corridor, grouped by category.
            </p>
            {(['campground', 'hiking', 'recreation'] as const).map(cat => {
              const pois = poisByCategory[cat];
              if (!pois || pois.length === 0) return null;
              const topPois = pois.slice(0, 8);
              return (
                <div key={cat} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: '#204051' }}>{CATEGORY_LABELS[cat]} ({pois.length})</h3>
                  {topPois.map((poi, i) => (
                    <div key={`${poi.name}-${i}`} className="bv-poi-card">
                      <div>
                        <strong style={{ color: '#204051', fontSize: '0.95rem' }}>{poi.name}</strong>
                        {poi.rating != null && (
                          <div style={{ color: '#d8973c', fontSize: '0.88rem', marginTop: '2px' }}>
                            {starRating(poi.rating)}{' '}
                            <span style={{ color: '#999', fontSize: '0.8rem' }}>
                              {poi.rating.toFixed(1)}{poi.reviews ? ` (${poi.reviews} reviews)` : ''}
                            </span>
                          </div>
                        )}
                        {poi.distFromRoute > 0 && (
                          <div style={{ color: '#888', fontSize: '0.82rem', marginTop: '2px' }}>
                            {poi.distFromRoute} mi from route
                          </div>
                        )}
                      </div>
                      <a
                        href={googleMapsUrl(poi.lat, poi.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        Directions →
                      </a>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>

          {/* Planning Your Visit */}
          <section className="content-section">
            <h2 className="bv-section-title">Planning Your Visit</h2>
            <div className="bv-tips-grid">
              <div className="bv-tip-card">
                <h3>Best Time to Visit</h3>
                <p>
                  June through September for hiking, fishing, and backcountry access. Towns are
                  lively year-round, with cross-country skiing and snowshoeing in winter.
                </p>
              </div>
              <div className="bv-tip-card">
                <h3>Getting There</h3>
                <p>
                  Fly into Missoula International Airport (MSO), then head south on US-93. Hamilton
                  is about 50 miles south, and Darby is 65 miles.
                </p>
              </div>
              <div className="bv-tip-card">
                <h3>Where to Stay</h3>
                <p>
                  Options range from guest ranches and riverside cabins to motels in Hamilton and
                  Stevensville. Book early for July and August.
                </p>
              </div>
              <div className="bv-tip-card">
                <h3>What to Pack</h3>
                <p>
                  Layers for variable mountain weather, bear spray for backcountry trails, waders
                  for fly fishing, and sun protection at elevation.
                </p>
              </div>
            </div>

            <StaysCTA townName="Hamilton" slug="hamilton" />
          </section>

          {/* Explore All Corridors */}
          <section className="content-section">
            <div className="bv-explore-card">
              <h3>Explore All 13 Corridors</h3>
              <p>
                The Bitterroot Valley is one of 13 scenic corridors in our Montana Backroads
                Travel Planner. Combine it with the Skalkaho Highway or Seeley-Swan Corridor
                for an extended road trip through western Montana.
              </p>
              <Link
                href="/planners/backroads-planner?focus=bitterroot"
                style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}
              >
                Open the interactive Backroads Planner →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');

  const corridors: Corridor[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'corridors.json'), 'utf8')
  );
  const allTownData: Record<string, TownData> = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'town-data.json'), 'utf8')
  );
  const allTownCoords: Record<string, TownCoord> = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8')
  );

  const corridor = corridors.find(c => c.id === 'bitterroot');
  if (!corridor) throw new Error('Bitterroot corridor not found');

  const connectedIds = ['skalkaho', 'seeley_swan', 'hwy200'];
  const connectedCorridors: ConnectedCorridor[] = connectedIds
    .map(id => corridors.find(c => c.id === id))
    .filter((c): c is Corridor => !!c)
    .map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      highways: c.highways,
      distanceMiles: c.distanceMiles,
      difficulty: c.difficulty,
      color: c.color,
      season: c.season,
    }));

  const towns: Record<string, TownData> = {};
  for (const slug of VALLEY_TOWNS) {
    if (allTownData[slug]) towns[slug] = allTownData[slug];
  }

  const townCoords: Record<string, TownCoord> = {};
  for (const slug of VALLEY_TOWNS) {
    if (allTownCoords[slug]) townCoords[slug] = allTownCoords[slug];
  }

  return {
    props: {
      corridor: {
        ...corridor,
        geometry: {
          ...corridor.geometry,
          type: 'LineString' as const,
        },
      },
      connectedCorridors,
      towns,
      townCoords,
    },
  };
};
