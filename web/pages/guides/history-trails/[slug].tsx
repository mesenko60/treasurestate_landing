import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import MarkerInscription from '../../../components/MarkerInscription';
import AppInstallCTA from '../../../components/AppInstallCTA';
import { HISTORIC_MARKER_MAP_POPUP_SCROLL } from '../../../lib/historicMarkerMapPopup';
import { MARKER_DEEP_READS } from '../../../lib/markerDeepReads';

const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.default), { ssr: false });
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

const HIGHLIGHT_STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'from', 'into', 'trail', 'historic', 'national', 'crossing',
]);

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getHighlightTerms(highlight: string) {
  const primary = highlight.split('-')[0] || highlight;
  return normalizeForMatch(primary)
    .split(/\s+/)
    .filter((term) => term.length > 2 && !HIGHLIGHT_STOP_WORDS.has(term));
}

function hasStrictHighlightMatch(marker: MarkerData, terms: string[]) {
  const title = normalizeForMatch(marker.title);
  const town = normalizeForMatch(marker.town || '');
  const county = normalizeForMatch(marker.county);

  if (terms.length === 0) return false;
  const allTermsInTitle = terms.every((term) => title.includes(term));
  const allTermsInTown = Boolean(town) && terms.every((term) => town.includes(term));
  const allTermsAcrossPlace = terms.every((term) => town.includes(term) || county.includes(term));

  return allTermsInTitle || allTermsInTown || allTermsAcrossPlace;
}

export default function HistoryTrailPage({ trail, markers, prevTrail, nextTrail }: Props) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [openMarkerIds, setOpenMarkerIds] = useState<string[]>([]);
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

  const mustSeeByMarkerId = useMemo(() => {
    const assignments = new globalThis.Map<string, string>();
    const usedMarkerIds = new Set<string>();

    trail.highlights.forEach((highlight) => {
      const terms = getHighlightTerms(highlight);
      if (terms.length === 0) return;

      for (const marker of markers) {
        if (usedMarkerIds.has(marker.id)) continue;
        if (hasStrictHighlightMatch(marker, terms)) {
          assignments.set(marker.id, highlight);
          usedMarkerIds.add(marker.id);
          break;
        }
      }
    });

    return assignments;
  }, [markers, trail.highlights]);

  const focusMarker = (marker: MarkerData, zoom = 10) => {
    setSelectedMarker(marker);
    setOpenMarkerIds((current) => current.includes(marker.id) ? current : [...current, marker.id]);
    setViewState((current) => ({ ...current, latitude: marker.lat, longitude: marker.lng, zoom }));
  };

  const updateMarkerPane = (marker: MarkerData, isOpen: boolean) => {
    setOpenMarkerIds((current) => {
      if (isOpen) return current.includes(marker.id) ? current : [...current, marker.id];
      return current.filter((id) => id !== marker.id);
    });

    if (isOpen) {
      setSelectedMarker(marker);
      setViewState((current) => ({ ...current, latitude: marker.lat, longitude: marker.lng, zoom: 10 }));
    } else if (selectedMarker?.id === marker.id) {
      setSelectedMarker(null);
    }
  };

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
      </Head>
      <Header />
      <Hero title={trail.name} subtitle={`${trail.markerCount} Historic Markers`} image="/images/hero-image.jpg" alt={trail.name} small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .trail-page { max-width: 1080px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .trail-header { margin-bottom: 1rem; }
        .trail-header h1 { font-size: clamp(1.65rem, 3vw, 2.25rem); color: #204051; margin: 0 0 0.5rem; }
        .trail-header p { font-size: 1.02rem; color: #555; line-height: 1.65; max-width: 840px; }
        .trail-route-notice {
          margin: 1.25rem 0; padding: 1rem 1.15rem;
          background: #fff8ea; border: 1px solid #efd9a7; border-radius: 10px;
          font-size: 0.94rem; color: #4d4331; line-height: 1.6;
        }
        .trail-route-notice strong { color: #204051; }
        .trail-route-notice a { color: #3b6978; font-weight: 700; }
        .trail-cta-row { display: flex; gap: 0.85rem 1rem; flex-wrap: wrap; align-items: center; margin-top: 1rem; }
        .trail-primary-cta {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.78rem 1.15rem; border-radius: 8px; background: #2f6f7b;
          color: #fff !important; font-weight: 800; text-decoration: none;
          border: 1px solid rgba(32, 64, 81, 0.2); box-shadow: 0 2px 8px rgba(32,64,81,0.16);
        }
        .trail-primary-cta:hover { background: #204051; color: #fff !important; }
        .trail-app-cta { min-width: 0; }
        .trail-app-cta .app-install-inline {
          margin: 0; padding: 0; border-left: 0; background: transparent; align-items: center;
          color: #4d4331; gap: 0.45rem; font-size: 0.84rem;
        }
        .trail-app-cta .app-install-inline-icon { display: none; }
        .trail-app-cta .app-install-inline-body { display: block; flex: 0 1 auto; line-height: 1.35; }
        .trail-app-cta .app-install-inline-body strong { font-size: 0.84rem; color: #204051; margin-right: 0.25rem; }
        .trail-app-cta .app-install-inline-body span { display: inline; font-size: 0.82rem; color: #6c5d46; }
        .trail-app-cta .app-install-inline-btn {
          margin-top: 0; border-radius: 999px; padding: 0.34rem 0.7rem; font-size: 0.74rem;
          background: transparent; color: #2f6f7b; border: 1px solid rgba(47,111,123,0.38);
        }
        .trail-app-cta .app-install-inline-btn:hover { background: rgba(47,111,123,0.08); }
        .trail-meta-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin: 1.1rem 0; }
        .trail-meta-item { font-size: 0.9rem; color: #666; padding: 0.85rem; background: #f8faf8; border: 1px solid #e8ede8; border-radius: 10px; }
        .trail-meta-item strong { color: #204051; }
        .trail-guide-layout {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 44%);
          gap: 1.25rem; align-items: start; margin: 1.5rem 0;
        }
        @media (max-width: 900px) { .trail-guide-layout { grid-template-columns: 1fr; } }
        .trail-map-card {
          background: #fff; border: 1px solid #e8ede8; border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04); overflow: hidden;
        }
        .trail-map-card { position: sticky; top: 1rem; }
        @media (max-width: 900px) { .trail-map-card { position: static; order: -1; } }
        .trail-map-heading { padding: 0.85rem 1rem; border-bottom: 1px solid #e8ede8; }
        .trail-map-heading h2 { font-size: 1rem; color: #204051; margin: 0 0 0.25rem; }
        .trail-map-heading p { font-size: 0.84rem; color: #666; margin: 0; line-height: 1.45; }
        .trail-map-container { height: min(68vh, 620px); min-height: 420px; overflow: hidden; background: #eef3f0; }
        .trail-map-fallback { height: 100%; min-height: 420px; display: flex; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; color: #666; }
        .trail-markers-list { display: grid; gap: 0.75rem; margin-top: 1rem; }
        .marker-item {
          border: 1px solid #e1e8e4; border-radius: 10px; background: #fff;
          transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
          overflow: hidden;
        }
        .marker-item[open], .marker-item.active { border-color: #3b6978; box-shadow: 0 2px 10px rgba(59,105,120,0.1); }
        .marker-item summary {
          list-style: none; cursor: pointer; padding: 0.9rem 1rem;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
        }
        .marker-item summary::-webkit-details-marker { display: none; }
        .marker-summary-main { min-width: 0; }
        .marker-summary-title { display: block; font-size: 0.95rem; color: #204051; font-weight: 800; line-height: 1.35; }
        .marker-item .marker-loc { font-size: 0.8rem; color: #888; }
        .marker-pane-body { border-top: 1px solid #e8ede8; padding: 0.95rem 1rem 1rem; }
        .marker-item .marker-excerpt { font-size: 0.88rem; color: #555; line-height: 1.5; }
        .marker-pane-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.85rem; }
        .marker-pane-actions a, .marker-pane-actions button {
          font-size: 0.82rem; font-weight: 800; color: #3b6978; background: none; border: none;
          padding: 0; cursor: pointer; text-decoration: none;
        }
        .marker-pane-actions a:hover, .marker-pane-actions button:hover { text-decoration: underline; }
        .popular-badge {
          flex-shrink: 0; border-radius: 999px; padding: 0.22rem 0.55rem;
          background: #fff4d8; color: #7c4d00; border: 1px solid #efd08b;
          font-size: 0.72rem; font-weight: 800;
        }
        .marker-popular-note {
          margin-bottom: 0.8rem; padding: 0.72rem 0.8rem; border-radius: 8px;
          background: #fff8ea; border: 1px solid #efd9a7; color: #4d4331; font-size: 0.84rem; line-height: 1.45;
        }
        .trail-stops-section { margin: 0; }
        .trail-stops-section h2 { font-size: 1.2rem; color: #204051; margin: 0 0 0.35rem; }
        .trail-stops-section > p { color: #666; line-height: 1.55; margin: 0 0 1rem; }
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
        .map-marker.must-see { background: #b7791f; }
      `}} />

      <main className="trail-page">
        <section className="trail-header">
          <h1>{trail.name}</h1>
          <p>{trail.description}</p>
          <div className="trail-meta-row">
            <div className="trail-meta-item"><strong>{trail.estimatedDays}</strong><br />days if used as a road trip seed</div>
            <div className="trail-meta-item"><strong>{trail.totalMiles}</strong><br />approximate statewide span</div>
            <div className="trail-meta-item"><strong>{markers.length}</strong><br />historic marker references</div>
            <div className="trail-meta-item"><strong>Regions</strong><br />{trail.regions.join(', ')}</div>
          </div>
        </section>

        <aside className="trail-route-notice" role="note">
          <strong>This is a thematic history collection, not a fixed driving route.</strong> The stops below are
          historic markers grouped for reading and research. Some are close together; others only reference the
          topic briefly or sit far from the next related marker.
          <div className="trail-cta-row">
            <Link href={`/planners/backroads-planner/?mode=history&trail=${trail.id}`} className="trail-primary-cta">
              Open This Itinerary in the Backroads Planner
            </Link>
            <span className="trail-app-cta">
              <AppInstallCTA
                variant="inline"
                forceShow
                headline="Never miss a stop."
                body="Get alerts as historic markers come up along your route."
                buttonLabel="Get the app"
              />
            </span>
          </div>
        </aside>

        <div className="trail-guide-layout">
          <section className="trail-stops-section">
            <h2>Historic Marker Stops</h2>
            <p>
              Open each pane to read the marker text. Popular stops are called out from the trail highlights.
              Use the planner when you want to remove stops, reorder them, and calculate a road-following route.
            </p>
            <div className="trail-markers-list">
              {markers.map((m, idx) => {
                const mustSee = mustSeeByMarkerId.get(m.id);
                const isOpen = openMarkerIds.includes(m.id);

                return (
                  <details
                    key={m.id}
                    className={`marker-item ${selectedMarker?.id === m.id ? 'active' : ''}`}
                    open={isOpen}
                    onToggle={(event) => updateMarkerPane(m, event.currentTarget.open)}
                  >
                    <summary>
                      <span className="marker-summary-main">
                        <span className="marker-summary-title">{idx + 1}. {m.title}</span>
                        <span className="marker-loc">
                          {m.town || m.county}{m.town && m.county ? `, ${m.county} County` : ''}
                        </span>
                      </span>
                      {mustSee && <span className="popular-badge">Popular</span>}
                    </summary>
                    <div className="marker-pane-body">
                      {mustSee && (
                        <div className="marker-popular-note">
                          <strong>Popular:</strong> {mustSee}
                        </div>
                      )}
                      <div className="marker-excerpt">
                        <MarkerInscription text={m.inscription} variant="compact" />
                      </div>
                      <div className="marker-pane-actions">
                        <button type="button" onClick={() => focusMarker(m)}>
                          Show on map
                        </button>
                        {MARKER_DEEP_READS[m.slug] && (
                          <Link href={MARKER_DEEP_READS[m.slug].href}>
                            {MARKER_DEEP_READS[m.slug].title}
                          </Link>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <aside className="trail-map-card" aria-label="Marker overview map">
            <div className="trail-map-heading">
              <h2>Marker Overview</h2>
              <p>Markers are shown without connector lines so the map does not imply a prescribed road route.</p>
            </div>
            <div className="trail-map-container">
              {MAPBOX_TOKEN ? (
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
                  {markers.map((m, idx) => (
                    <Marker key={m.id} latitude={m.lat} longitude={m.lng} anchor="center">
                      <button
                        type="button"
                        className={`map-marker ${selectedMarker?.id === m.id ? 'selected' : ''} ${mustSeeByMarkerId.has(m.id) ? 'must-see' : ''}`}
                        onClick={() => focusMarker(m, Math.max(viewState.zoom, 8))}
                        aria-label={`Show ${m.title}`}
                      >
                        {idx + 1}
                      </button>
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
                              {MARKER_DEEP_READS[selectedMarker.slug].title} &rarr;
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
              ) : (
                <div className="trail-map-fallback">
                  Add `NEXT_PUBLIC_MAPBOX_TOKEN` to enable the marker overview map.
                </div>
              )}
            </div>
          </aside>
        </div>

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
