import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useState, useCallback, useRef, useMemo } from 'react';
import Map, { Source, Layer, Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import TableOfContents from '../../../components/TableOfContents';
import StaysCTA from '../../../components/StaysCTA';

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

type TownCoords = Record<string, { name: string; lat: number; lng: number }>;

type ConnectedCorridor = {
  id: string;
  name: string;
  highways: string[];
  distanceMiles: number;
  difficulty: string;
  color: string;
};

const CATEGORY_COLORS: Record<string, string> = { hotspring: '#e74c3c', campground: '#27ae60', hiking: '#8e44ad', recreation: '#3b6978' };
const CATEGORY_LABELS: Record<string, string> = { hotspring: 'Hot Springs', campground: 'Campgrounds', hiking: 'Hiking Trails', recreation: 'Recreation' };
const CATEGORY_ICONS: Record<string, string> = { hotspring: '♨️', campground: '⛺', hiking: '🥾', recreation: '🏔️' };
const DIFFICULTY_COLORS: Record<string, string> = { easy: '#27ae60', moderate: '#f39c12', challenging: '#c0392b' };

function slugToName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function starRating(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (half) stars.push('½');
  return stars.join('');
}

function googleMapsUrl(lat: number, lng: number, name: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
}

function CorridorMap({ corridor }: { corridor: Corridor }) {
  const mapRef = useRef<MapRef>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  const bounds = useMemo(() => {
    const coords = corridor.geometry.coordinates;
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    coords.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    corridor.pois.forEach(p => {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
    });
    return [[minLng - 0.15, minLat - 0.1], [maxLng + 0.15, maxLat + 0.1]] as [[number, number], [number, number]];
  }, [corridor]);

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
    paint: {
      'line-color': corridor.color,
      'line-width': 4,
      'line-opacity': 0.85,
    },
    layout: {
      'line-cap': 'round' as const,
      'line-join': 'round' as const,
    },
  };

  const casingLayerStyle = {
    id: 'corridor-route-casing',
    type: 'line' as const,
    paint: {
      'line-color': '#fff',
      'line-width': 7,
      'line-opacity': 0.6,
    },
    layout: {
      'line-cap': 'round' as const,
      'line-join': 'round' as const,
    },
  };

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          bounds,
          fitBoundsOptions: { padding: { top: 50, bottom: 50, left: 50, right: 50 } },
        }}
        style={{ width: '100%', height: '450px' }}
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

        {corridor.pois.map((poi, i) => (
          <Marker
            key={`${poi.name}-${i}`}
            longitude={poi.lng}
            latitude={poi.lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedPoi(poi); }}
          >
            <div style={{
              width: 12,
              height: 12,
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
                  {starRating(selectedPoi.rating)} <span style={{ color: '#999', fontSize: '0.78rem' }}>({selectedPoi.reviews} reviews)</span>
                </div>
              )}
              {selectedPoi.distFromRoute > 0 && (
                <div style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0' }}>
                  {selectedPoi.distFromRoute} mi from route
                </div>
              )}
              <a
                href={googleMapsUrl(selectedPoi.lat, selectedPoi.lng, selectedPoi.name)}
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

export default function CorridorDetailPage({
  corridor,
  townCoords,
  connectedCorridors,
}: {
  corridor: Corridor;
  townCoords: TownCoords;
  connectedCorridors: ConnectedCorridor[];
}) {
  const pageTitle = `${corridor.name} Scenic Drive — Montana Backroads | Treasure State`;
  const pageDescription = `Drive the ${corridor.name} (${corridor.highways.join(', ')}): ${corridor.distanceMiles} miles through Montana from ${slugToName(corridor.startTown)} to ${slugToName(corridor.endTown)}. ${corridor.description}`;
  const canonicalUrl = `https://treasurestate.com/planners/corridors/${corridor.id}/`;
  const ogImage = `https://treasurestate.com/images/corridors/${corridor.id}.png`;

  const centerCoord = corridor.geometry.coordinates[Math.floor(corridor.geometry.coordinates.length / 2)];

  const poisByCategory = useMemo(() => {
    const grouped: Record<string, POI[]> = {};
    corridor.pois.forEach(poi => {
      if (!grouped[poi.category]) grouped[poi.category] = [];
      grouped[poi.category].push(poi);
    });
    Object.values(grouped).forEach(arr => arr.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
    return grouped;
  }, [corridor.pois]);

  const allTownSlugs = [corridor.startTown, corridor.endTown, ...corridor.throughTowns];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: `${corridor.name} Scenic Drive`,
    description: corridor.description,
    url: canonicalUrl,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: centerCoord[1],
      longitude: centerCoord[0],
    },
    touristType: 'Scenic Drive',
    isAccessibleForFree: true,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'MT',
      addressCountry: 'US',
    },
  };

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
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Header />
      <Hero
        title={corridor.name}
        subtitle={corridor.highways.join(' · ')}
        image="/images/hero-image.jpg"
        alt={`${corridor.name} scenic drive through Montana`}
        small
      />
      <main style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .toc-desktop { display: none; }
          @media (min-width: 1024px) {
            .toc-desktop { display: block; width: 300px; flex-shrink: 0; }
          }
          .corridor-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin: 1.25rem 0;
          }
          .corridor-stat-card {
            background: #f8faf8;
            border-radius: 10px;
            padding: 14px 16px;
            text-align: center;
          }
          .corridor-stat-label {
            font-size: 0.78rem;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 4px;
          }
          .corridor-stat-value {
            font-size: 1.1rem;
            font-weight: 700;
            color: #204051;
          }
          .poi-card {
            background: #f8faf8;
            border-radius: 10px;
            padding: 14px 18px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .connecting-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 16px;
            margin: 1rem 0;
          }
          .connecting-card {
            background: #f8faf8;
            border-radius: 12px;
            padding: 18px 20px;
            border-left: 4px solid #ccc;
            text-decoration: none;
            color: inherit;
            transition: box-shadow 0.2s;
          }
          .connecting-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          }
          .town-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 1rem 0;
          }
          .town-chip {
            display: inline-block;
            padding: 8px 16px;
            background: #f8faf8;
            border-radius: 20px;
            color: #3b6978;
            font-weight: 600;
            font-size: 0.92rem;
            text-decoration: none;
            transition: background 0.2s;
          }
          .town-chip:hover {
            background: #e0ece8;
          }
        `}} />

        <div className="toc-desktop">
          <TableOfContents contentSelector=".content-section" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Route Overview */}
          <section className="content-section">
            <h2>Route Overview</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333' }}>{corridor.description}</p>

            <div className="corridor-stats-grid">
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">Distance</div>
                <div className="corridor-stat-value">{corridor.distanceMiles} mi</div>
              </div>
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">Elevation Range</div>
                <div className="corridor-stat-value">
                  {corridor.elevationRange[0].toLocaleString()}–{corridor.elevationRange[1].toLocaleString()} ft
                </div>
              </div>
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">Difficulty</div>
                <div className="corridor-stat-value">
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 14px',
                    borderRadius: '14px',
                    background: DIFFICULTY_COLORS[corridor.difficulty] || '#999',
                    color: '#fff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                  }}>
                    {corridor.difficulty}
                  </span>
                </div>
              </div>
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">Season</div>
                <div className="corridor-stat-value" style={{ fontSize: '0.95rem' }}>{corridor.season}</div>
              </div>
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">Start</div>
                <div className="corridor-stat-value" style={{ fontSize: '0.95rem' }}>
                  <Link href={`/montana-towns/${corridor.startTown}/`} style={{ color: '#3b6978', textDecoration: 'none' }}>
                    {townCoords[corridor.startTown]?.name || slugToName(corridor.startTown)}
                  </Link>
                </div>
              </div>
              <div className="corridor-stat-card">
                <div className="corridor-stat-label">End</div>
                <div className="corridor-stat-value" style={{ fontSize: '0.95rem' }}>
                  <Link href={`/montana-towns/${corridor.endTown}/`} style={{ color: '#3b6978', textDecoration: 'none' }}>
                    {townCoords[corridor.endTown]?.name || slugToName(corridor.endTown)}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Map */}
          <section className="content-section">
            <h2>Interactive Map</h2>
            <CorridorMap corridor={corridor} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <span key={cat} style={{ fontSize: '0.82rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
              <span style={{ fontSize: '0.82rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 18, height: 3, background: corridor.color, display: 'inline-block', borderRadius: 2 }} />
                Route
              </span>
            </div>
          </section>

          {/* Points of Interest */}
          <section className="content-section">
            <h2>Points of Interest</h2>
            <p style={{ color: '#666', marginBottom: '1.25rem' }}>
              {corridor.pois.length} points of interest along the {corridor.name} corridor.
            </p>
            {(['hotspring', 'campground', 'hiking', 'recreation'] as const).map(cat => {
              const pois = poisByCategory[cat];
              if (!pois || pois.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: '1.5rem' }}>
                  <h3>{CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({pois.length})</h3>
                  {pois.map((poi, i) => (
                    <div key={`${poi.name}-${i}`} className="poi-card">
                      <div>
                        <strong style={{ color: '#204051', fontSize: '0.95rem' }}>{poi.name}</strong>
                        {poi.rating && (
                          <div style={{ color: '#d8973c', fontSize: '0.88rem', marginTop: '2px' }}>
                            {starRating(poi.rating)}{' '}
                            <span style={{ color: '#999', fontSize: '0.8rem' }}>
                              {poi.rating.toFixed(1)} ({poi.reviews} reviews)
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
                        href={googleMapsUrl(poi.lat, poi.lng, poi.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.82rem',
                          color: '#3b6978',
                          fontWeight: 600,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Directions →
                      </a>
                    </div>
                  ))}
                </div>
              );
            })}
          </section>

          {/* Connecting Routes */}
          {connectedCorridors.length > 0 && (
            <section className="content-section">
              <h2>Connecting Routes</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Routes that connect to the {corridor.name} for extended road trip planning.
              </p>
              <div className="connecting-grid">
                {connectedCorridors.map(cc => (
                  <Link
                    key={cc.id}
                    href={`/planners/corridors/${cc.id}/`}
                    className="connecting-card"
                    style={{ borderLeftColor: cc.color }}
                  >
                    <div style={{ fontWeight: 700, color: '#204051', marginBottom: '4px', fontSize: '1rem' }}>
                      {cc.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {cc.highways.join(', ')} · {cc.distanceMiles} mi
                    </div>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '6px',
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
          )}

          {/* Nearby Towns */}
          <section className="content-section">
            <h2>Nearby Towns</h2>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Towns along or near the {corridor.name} route.
            </p>
            <div className="town-chips">
              {allTownSlugs.map(slug => (
                <Link
                  key={slug}
                  href={`/montana-towns/${slug}/`}
                  className="town-chip"
                >
                  {townCoords[slug]?.name || slugToName(slug)}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="content-section">
            <div style={{
              background: 'linear-gradient(135deg, #1a1e2e, #2d3348)',
              padding: '24px 28px',
              borderRadius: '12px',
              marginBottom: '2rem',
            }}>
              <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.15rem', borderBottom: 'none', padding: 0 }}>
                Plan a Multi-Route Trip
              </h3>
              <p style={{ color: '#a0a8b8', margin: '0 0 14px', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Combine the {corridor.name} with connecting corridors to build an epic Montana road trip. Our interactive planner covers 13 scenic corridors and 850+ points of interest.
              </p>
              <Link href="/planners/backroads-planner" style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
                Plan a multi-route trip with our interactive Backroads Travel Planner →
              </Link>
            </div>
          </section>

          <StaysCTA townName={townCoords[corridor.startTown]?.name} slug={corridor.startTown} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const corridors: Corridor[] = require('../../../data/corridors.json');
  const paths = corridors.map(c => ({ params: { slug: c.id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const corridors: Corridor[] = require('../../../data/corridors.json');
  const townCoords: TownCoords = require('../../../data/town-coordinates.json');
  const slug = params?.slug as string;

  const corridor = corridors.find(c => c.id === slug);
  if (!corridor) return { notFound: true };

  const connectedCorridors = corridor.connections
    .map(connId => corridors.find(c => c.id === connId))
    .filter((c): c is Corridor => !!c)
    .map(c => ({
      id: c.id,
      name: c.name,
      highways: c.highways,
      distanceMiles: c.distanceMiles,
      difficulty: c.difficulty,
      color: c.color,
    }));

  return {
    props: {
      corridor,
      townCoords,
      connectedCorridors,
    },
  };
};
