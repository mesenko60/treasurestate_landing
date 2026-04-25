import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import { formatTownNameFromSlug } from '../../lib/townHistoricMarkers';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import MarkerInscription from '../../components/MarkerInscription';
import AppInstallCTA from '../../components/AppInstallCTA';
import { HISTORIC_MARKER_MAP_POPUP_SCROLL } from '../../lib/historicMarkerMapPopup';
import { MARKER_DEEP_READS } from '../../lib/markerDeepReads';
import { MARKER_TOPIC_LABELS } from '../../lib/markerTopicLabels';
import type { MapRef } from 'react-map-gl/mapbox';
const Map = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.default), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Popup), { ssr: false });
const NavigationControl = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.NavigationControl), { ssr: false });

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

type Props = {
  markers: MarkerData[];
  curatedSlugs: string[];
  topicCounts: Record<string, number>;
  countyCounts: Record<string, number>;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
type MarkerPopupMode = 'full' | 'title';

export default function HistoricMarkersExplorer({ markers, curatedSlugs, topicCounts, countyCounts }: Props) {
  const router = useRouter();
  const mapRef = useRef<MapRef | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [selectedMarkerPopupMode, setSelectedMarkerPopupMode] = useState<MarkerPopupMode>('full');
  const [expandedMarkerId, setExpandedMarkerId] = useState<string | null>(null);
  const popupDeepRead = selectedMarker ? MARKER_DEEP_READS[selectedMarker.slug] : undefined;
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [countyFilter, setCountyFilter] = useState<string>('');
  const [townSlugFilter, setTownSlugFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState({
    latitude: 46.8,
    longitude: -110.5,
    zoom: 5.5,
  });

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    const t = q.town;
    const c = q.county;
    if (typeof t === 'string' && t.trim()) setTownSlugFilter(t.trim());
    if (typeof c === 'string' && c.trim()) setCountyFilter(c.trim());
  }, [router.isReady, router.query.town, router.query.county]);

  const filteredTownName = townSlugFilter ? formatTownNameFromSlug(townSlugFilter) : '';

  /** When arriving from a town page (?town=), fit the map to those markers (tight zoom). */
  useEffect(() => {
    if (!townSlugFilter || markers.length === 0) return;
    const subset = markers.filter((m) => m.townSlug === townSlugFilter);
    if (subset.length === 0) return;

    const fit = () => {
      const ref = mapRef.current;
      if (!ref) return;
      let minLat = 90;
      let maxLat = -90;
      let minLng = 180;
      let maxLng = -180;
      subset.forEach((m) => {
        minLat = Math.min(minLat, m.lat);
        maxLat = Math.max(maxLat, m.lat);
        minLng = Math.min(minLng, m.lng);
        maxLng = Math.max(maxLng, m.lng);
      });
      const eps = 0.004;
      if (maxLng - minLng < eps) {
        minLng -= eps;
        maxLng += eps;
      }
      if (maxLat - minLat < eps) {
        minLat -= eps;
        maxLat += eps;
      }
      try {
        ref.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 72, maxZoom: 14, duration: 900 },
        );
      } catch {
        /* ignore fit errors during teardown */
      }
    };

    const t1 = window.setTimeout(fit, 120);
    const t2 = window.setTimeout(fit, 500);
    const t3 = window.setTimeout(fit, 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [townSlugFilter, markers]);

  const url = 'https://treasurestate.com/historic-markers/';
  const title = 'Montana Historic Markers Explorer';
  const desc = `Explore ${markers.length.toLocaleString()} historic markers across Montana. Filter by topic, county, or search to discover the stories that shaped Big Sky Country.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Historic Markers', url },
  ];

  const filteredMarkers = useMemo(() => {
    return markers.filter(m => {
      if (townSlugFilter && m.townSlug !== townSlugFilter) return false;
      if (topicFilter && !m.topics.includes(topicFilter)) return false;
      if (countyFilter && m.county !== countyFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return m.title.toLowerCase().includes(q) ||
               m.inscription.toLowerCase().includes(q) ||
               (m.town && m.town.toLowerCase().includes(q));
      }
      return true;
    });
  }, [markers, townSlugFilter, topicFilter, countyFilter, searchQuery]);

  const clearAllFilters = useCallback(() => {
    setTopicFilter('');
    setCountyFilter('');
    setTownSlugFilter('');
    setSearchQuery('');
    router.replace('/historic-markers/', undefined, { shallow: true });
  }, [router]);

  const visibleMarkers = useMemo(() => {
    return filteredMarkers.slice(0, 500);
  }, [filteredMarkers]);

  const curatedSet = useMemo(() => new Set(curatedSlugs), [curatedSlugs]);

  const centerPopupInView = useCallback((m: MarkerData) => {
    const ref = mapRef.current;
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!ref) {
      setViewState(prev => ({ ...prev, latitude: m.lat, longitude: m.lng, zoom: Math.max(prev.zoom, 10) }));
      return;
    }

    try {
      ref.flyTo({
        center: [m.lng, m.lat],
        zoom: Math.max(ref.getZoom(), 10),
        duration: 700,
      });
    } catch {
      setViewState(prev => ({ ...prev, latitude: m.lat, longitude: m.lng, zoom: Math.max(prev.zoom, 10) }));
    }
  }, []);

  const centerRenderedPopup = useCallback(() => {
    const ref = mapRef.current;
    const mapEl = mapContainerRef.current;
    const popupEl = mapEl?.querySelector<HTMLElement>('.mapboxgl-popup');
    if (!ref || !mapEl || !popupEl) return;

    const mapRect = mapEl.getBoundingClientRect();
    const popupRect = popupEl.getBoundingClientRect();
    const popupCenterX = popupRect.left + popupRect.width / 2;
    const popupCenterY = popupRect.top + popupRect.height / 2;
    const targetCenterX = mapRect.left + mapRect.width / 2;
    const targetCenterY = mapRect.top + mapRect.height / 2;
    const dx = targetCenterX - popupCenterX;
    const dy = targetCenterY - popupCenterY;

    popupEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;

    try {
      ref.panBy([dx, dy], { duration: 450 });
    } catch {
      /* ignore pan errors during teardown */
    }
  }, []);

  useEffect(() => {
    if (!selectedMarker) return;
    if (selectedMarkerPopupMode === 'title') return;

    const timers = [250, 800, 1300].map((delay) => window.setTimeout(centerRenderedPopup, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [centerRenderedPopup, selectedMarker, selectedMarkerPopupMode]);

  const handleMarkerClick = useCallback((m: MarkerData) => {
    setSelectedMarkerPopupMode('full');
    setSelectedMarker(m);
    centerPopupInView(m);
  }, [centerPopupInView]);

  const handleFeaturedMarkerMapClick = useCallback((m: MarkerData) => {
    setSelectedMarkerPopupMode('title');
    setSelectedMarker(m);
    centerPopupInView(m);
  }, [centerPopupInView]);

  const toggleMarkerPane = useCallback((id: string) => {
    setExpandedMarkerId(prev => (prev === id ? null : id));
  }, []);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url,
    numberOfItems: markers.length,
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
      <Hero title="Historic Markers Explorer" subtitle={`${markers.length.toLocaleString()} Markers Across Montana`} image="/images/hero-image.jpg" alt="Historic marker" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .markers-page { max-width: 1400px; margin: 0 auto; padding: 1rem; }
        .markers-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; min-height: 800px; }
        @media (max-width: 900px) { .markers-layout { grid-template-columns: 1fr; } }
        .markers-sidebar { background: #fff; border-radius: 10px; border: 1px solid #e8ede8; padding: 1rem; height: fit-content; }
        .markers-sidebar h2 { font-size: 1rem; color: #204051; margin: 0 0 1rem; }
        .filter-section { margin-bottom: 1.25rem; }
        .filter-section label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.4rem; }
        .filter-section input, .filter-section select {
          width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;
          font-size: 0.9rem;
        }
        .filter-section select { background: #fff; }
        .filter-stats { font-size: 0.85rem; color: #888; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
        .clear-filters { font-size: 0.85rem; color: #3b6978; background: none; border: none; cursor: pointer; padding: 0; margin-top: 0.5rem; }
        .clear-filters:hover { text-decoration: underline; }
        .markers-sidebar-app { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #eee; }
        .markers-sidebar .markers-sidebar-app .app-install-inline {
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          align-items: start;
          gap: 0.35rem 0.5rem;
          margin: 0;
          padding: 0.65rem;
          border-radius: 9px;
          border-left-width: 3px;
          font-size: 0.76rem;
        }
        .markers-sidebar .markers-sidebar-app .app-install-inline-icon {
          font-size: 0.95rem;
          line-height: 1;
          margin: 0.1rem 0 0;
        }
        .markers-sidebar .markers-sidebar-app .app-install-inline-body {
          gap: 0.12rem;
          line-height: 1.25;
        }
        .markers-sidebar .markers-sidebar-app .app-install-inline-body strong { font-size: 0.78rem; }
        .markers-sidebar .markers-sidebar-app .app-install-inline-body span { font-size: 0.72rem; }
        .markers-sidebar .markers-sidebar-app .app-install-inline-btn {
          grid-column: 1 / -1;
          width: 100%;
          margin-top: 0.25rem;
          padding: 0.34rem 0.55rem;
          border-radius: 7px;
          font-size: 0.74rem;
        }
        .markers-map-container { height: 75vh; min-height: 600px; max-height: 900px; border-radius: 10px; overflow: visible; border: 1px solid #e0e0e0; position: relative; }
        .map-marker {
          width: 12px; height: 12px; background: #c0392b; border: 2px solid #fff;
          border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .map-marker.curated { background: #27ae60; width: 14px; height: 14px; }
        .map-marker:hover { transform: scale(1.3); }
        .markers-list {
          margin-top: 1.5rem;
          margin-left: calc(280px + 1rem);
          max-width: calc(100% - 280px - 1rem);
        }
        .markers-list h2 { font-size: 1.1rem; color: #204051; margin-bottom: 1rem; }
        .markers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.65rem;
          max-width: 980px;
          margin: 0 auto;
        }
        .marker-card {
          background: #fff; border-radius: 8px; border: 1px solid #e8ede8;
          transition: box-shadow 0.15s;
        }
        .marker-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .marker-card summary {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 0.75rem;
          align-items: center;
          padding: 0.8rem 1rem;
          cursor: pointer;
          list-style: none;
        }
        .marker-card summary::-webkit-details-marker { display: none; }
        .marker-card summary::after {
          content: '+';
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 999px;
          background: #eef5f6;
          color: #3b6978;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          line-height: 1;
        }
        .marker-card[open] summary {
          border-bottom: 1px solid #e8ede8;
        }
        .marker-card[open] summary::after { content: '−'; }
        .marker-card h3 { font-size: 0.95rem; color: #204051; margin: 0; }
        .marker-card .loc { font-size: 0.8rem; color: #888; margin-top: 0.25rem; display: block; }
        .marker-card-body { padding: 0.85rem 1rem 1rem; }
        .marker-card .excerpt {
          max-width: 760px;
          font-size: 0.88rem;
          color: #555;
          line-height: 1.5;
          margin-top: 0.35rem;
        }
        .marker-card .topics { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .marker-card .topic-tag { font-size: 0.7rem; padding: 0.15rem 0.4rem; background: #f0f4f0; border-radius: 3px; color: #666; }
        .marker-card-actions { display: flex; gap: 0.85rem; flex-wrap: wrap; align-items: center; margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px solid #f0f0f0; }
        .marker-map-btn {
          border: none;
          border-radius: 6px;
          background: #204051;
          color: #fff;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.4rem 0.65rem;
        }
        .marker-map-btn:hover { background: #3b6978; }
        .view-more-link { font-size: 0.82rem; color: #3b6978; display: inline-block; }
        .trails-cta {
          margin-top: 2rem; padding: 1.25rem; background: #f8faf8;
          border-radius: 10px; border: 1px solid #e8ede8; text-align: center;
        }
        .trails-cta h3 { font-size: 1rem; color: #204051; margin: 0 0 0.5rem; }
        .trails-cta p { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
        .trails-cta a {
          display: inline-block; padding: 0.6rem 1.25rem; background: #204051;
          color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600;
        }
        @media (max-width: 900px) {
          .markers-list {
            margin-left: 0;
            max-width: none;
          }
        }
      `}} />

      <main className="markers-page">
        <div className="markers-layout">
          <aside className="markers-sidebar">
            <h2>Filter Markers</h2>

            <div className="filter-section">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                type="text"
                placeholder="Search markers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-section">
              <label htmlFor="topic">Topic</label>
              <select id="topic" value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
                <option value="">All Topics</option>
                {Object.entries(topicCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, count]) => (
                    <option key={topic} value={topic}>
                      {MARKER_TOPIC_LABELS[topic] || topic} ({count})
                    </option>
                  ))}
              </select>
            </div>

            <div className="filter-section">
              <label htmlFor="county">County</label>
              <select id="county" value={countyFilter} onChange={e => setCountyFilter(e.target.value)}>
                <option value="">All Counties</option>
                {Object.entries(countyCounts)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([county, count]) => (
                    <option key={county} value={county}>
                      {county} ({count})
                    </option>
                  ))}
              </select>
            </div>

            {townSlugFilter && (
              <div
                className="filter-section"
                style={{
                  padding: '0.65rem 0.75rem',
                  background: '#f4f8f5',
                  borderRadius: '8px',
                  border: '1px solid #dce8dc',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '0.25rem' }}>Town (from link)</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#204051' }}>{filteredTownName}</div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.35rem' }}>
                  Showing markers matched to this community in the statewide dataset.
                </div>
              </div>
            )}

            <div className="filter-stats">
              Showing {filteredMarkers.length.toLocaleString()} of {markers.length.toLocaleString()} markers
              {filteredMarkers.length > 500 && (
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>
                  (First 500 shown on map)
                </div>
              )}
            </div>

            {(topicFilter || countyFilter || townSlugFilter || searchQuery) && (
              <button type="button" className="clear-filters" onClick={clearAllFilters}>
                Clear all filters
              </button>
            )}

            <div className="markers-sidebar-app">
              <AppInstallCTA
                variant="inline"
                forceShow
                headline="Explore on the go"
                body="Get landmark alerts in the app."
                buttonLabel="Add Free App"
              />
            </div>
          </aside>

          <div className="markers-map-container" id="markers-explorer-map" ref={mapContainerRef}>
            {MAPBOX_TOKEN && (
              <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
              >
                <NavigationControl position="top-right" showCompass={false} />
                {visibleMarkers.map(m => (
                  <Marker key={m.id} latitude={m.lat} longitude={m.lng} anchor="center">
                    <div
                      className={`map-marker ${curatedSet.has(m.slug) ? 'curated' : ''}`}
                      onClick={() => handleMarkerClick(m)}
                    />
                  </Marker>
                ))}
                {selectedMarker && (
                  <Popup
                    latitude={selectedMarker.lat}
                    longitude={selectedMarker.lng}
                    onClose={() => {
                      setSelectedMarker(null);
                      setSelectedMarkerPopupMode('full');
                    }}
                    closeButton
                    closeOnClick={false}
                    anchor={selectedMarkerPopupMode === 'title' ? 'bottom' : 'center'}
                    offset={selectedMarkerPopupMode === 'title' ? 18 : [0, 0]}
                    maxWidth={selectedMarkerPopupMode === 'title' ? '260px' : '480px'}
                  >
                    <div
                      style={{
                        maxWidth: selectedMarkerPopupMode === 'title' ? 240 : 460,
                        maxHeight: selectedMarkerPopupMode === 'title' ? 'none' : 'min(60vh, 440px)',
                        padding: selectedMarkerPopupMode === 'title' ? '0.55rem 0.7rem' : '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                      }}
                    >
                      <h4 style={{ margin: selectedMarkerPopupMode === 'title' ? 0 : '0 0 0.35rem', fontSize: '0.98rem', color: '#204051', flexShrink: 0 }}>
                        {selectedMarker.title}
                      </h4>
                      {selectedMarkerPopupMode === 'full' && (
                        <>
                          <p style={{ fontSize: '0.76rem', color: '#888', margin: '0 0 0.45rem', flexShrink: 0 }}>
                            📍 {selectedMarker.town || selectedMarker.county}
                            {selectedMarker.town && selectedMarker.county && `, ${selectedMarker.county} County`}
                          </p>
                          {selectedMarker.topics.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.45rem', flexShrink: 0 }}>
                              {selectedMarker.topics.slice(0, 4).map(t => (
                                <span key={t} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: '#e8f4f8', borderRadius: '4px', color: '#3b6978' }}>
                                  {MARKER_TOPIC_LABELS[t] || t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ ...HISTORIC_MARKER_MAP_POPUP_SCROLL, flex: 1, minHeight: 0, marginBottom: '0.5rem' }}>
                            <MarkerInscription
                              text={selectedMarker.inscription}
                              variant="popup"
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.55rem', borderTop: '1px solid #e8ede8', flexShrink: 0 }}>
                            {curatedSet.has(selectedMarker.slug) && (
                              <Link
                                href={`/historic-markers/${selectedMarker.slug}/`}
                                style={{ fontSize: '0.82rem', color: '#27ae60', fontWeight: 600 }}
                              >
                                View full page →
                              </Link>
                            )}
                            {popupDeepRead && (
                              <Link
                                href={popupDeepRead.href}
                                style={{ fontSize: '0.82rem', color: '#925f14', fontWeight: 600 }}
                              >
                                {popupDeepRead.title} →
                              </Link>
                            )}
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.82rem', color: '#3b6978' }}
                            >
                              Get directions
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </Popup>
                )}
              </Map>
            )}
          </div>
        </div>

        <section className="markers-list">
          <h2>
            {searchQuery || topicFilter || countyFilter || townSlugFilter
              ? `Filtered Results (${filteredMarkers.length})`
              : 'Featured Markers'}
          </h2>
          <div className="markers-grid">
            {(searchQuery || topicFilter || countyFilter || townSlugFilter ? filteredMarkers.slice(0, 24) : markers.filter(m => curatedSet.has(m.slug)).slice(0, 12)).map(m => (
              <details
                key={m.id}
                className="marker-card"
                open={expandedMarkerId === m.id}
              >
                <summary onClick={(event) => { event.preventDefault(); toggleMarkerPane(m.id); }}>
                  <span>
                    <h3>{m.title}</h3>
                    <span className="loc">
                      {m.town || m.county}{m.town && m.county ? `, ${m.county} County` : ''}
                    </span>
                  </span>
                </summary>
                <div className="marker-card-body">
                  <div className="excerpt">
                    <MarkerInscription text={m.inscription} variant="compact" />
                  </div>
                  <div className="topics">
                    {m.topics.slice(0, 3).map(t => (
                      <span key={t} className="topic-tag">{MARKER_TOPIC_LABELS[t] || t}</span>
                    ))}
                  </div>
                  <div className="marker-card-actions">
                    <button type="button" className="marker-map-btn" onClick={() => handleFeaturedMarkerMapClick(m)}>
                      Show on map
                    </button>
                    {curatedSet.has(m.slug) && (
                      <Link href={`/historic-markers/${m.slug}/`} className="view-more-link">
                        Read Full Story &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="trails-cta">
          <h3>Explore History Trails</h3>
          <p>
            Discover curated driving routes that connect historic markers by theme —
            Lewis &amp; Clark, Mining Heritage, Battlefields, and more.
          </p>
          <Link href="/guides/history-trails/">View History Trails</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const markersPath = path.join(process.cwd(), 'data', 'historic-markers.json');
  const curatedPath = path.join(process.cwd(), 'data', 'historic-markers-curated.json');

  const markers: MarkerData[] = fs.existsSync(markersPath)
    ? JSON.parse(fs.readFileSync(markersPath, 'utf8'))
    : [];

  const curated: MarkerData[] = fs.existsSync(curatedPath)
    ? JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
    : [];

  const curatedSlugs = curated.map(m => m.slug);

  const topicCounts: Record<string, number> = {};
  const countyCounts: Record<string, number> = {};

  markers.forEach(m => {
    m.topics.forEach(t => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
    if (m.county) {
      countyCounts[m.county] = (countyCounts[m.county] || 0) + 1;
    }
  });

  return {
    props: {
      markers,
      curatedSlugs,
      topicCounts,
      countyCounts,
    },
  };
};
