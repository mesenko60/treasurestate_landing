import React, { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

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
  hmdbLink: string | null;
};

type Props = {
  markers: MarkerData[];
  curatedSlugs: string[];
  topicCounts: Record<string, number>;
  countyCounts: Record<string, number>;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const TOPIC_LABELS: Record<string, string> = {
  'architecture': 'Architecture',
  'industry': 'Industry & Commerce',
  'exploration': 'Exploration',
  'native-american': 'Native American',
  'settlements': 'Settlements',
  'military': 'Military & Wars',
  'nature': 'Nature & Wildlife',
  'transportation': 'Transportation',
  'disasters': 'Disasters',
  'culture': 'Culture & Entertainment',
  'railroads': 'Railroads',
  'mining': 'Mining',
  'people': 'Notable People',
  'landmarks': 'Landmarks',
  'cemeteries': 'Cemeteries',
  'parks': 'Parks',
};

export default function HistoricMarkersExplorer({ markers, curatedSlugs, topicCounts, countyCounts }: Props) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [countyFilter, setCountyFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState({
    latitude: 46.8,
    longitude: -110.5,
    zoom: 5.5,
  });

  const url = 'https://treasurestate.com/historic-markers/';
  const title = 'Montana Historic Markers Explorer';
  const desc = `Explore ${markers.length.toLocaleString()} historic markers across Montana. Filter by topic, county, or search to discover the stories that shaped Big Sky Country.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Historic Markers', url },
  ];

  const filteredMarkers = useMemo(() => {
    return markers.filter(m => {
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
  }, [markers, topicFilter, countyFilter, searchQuery]);

  const visibleMarkers = useMemo(() => {
    return filteredMarkers.slice(0, 500);
  }, [filteredMarkers]);

  const curatedSet = useMemo(() => new Set(curatedSlugs), [curatedSlugs]);

  const handleMarkerClick = useCallback((m: MarkerData) => {
    setSelectedMarker(m);
    setViewState(prev => ({ ...prev, latitude: m.lat, longitude: m.lng, zoom: 10 }));
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
        .markers-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; min-height: 600px; }
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
        .markers-map-container { height: 600px; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0; }
        .map-marker {
          width: 12px; height: 12px; background: #c0392b; border: 2px solid #fff;
          border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .map-marker.curated { background: #27ae60; width: 14px; height: 14px; }
        .map-marker:hover { transform: scale(1.3); }
        .markers-list { margin-top: 1.5rem; }
        .markers-list h2 { font-size: 1.1rem; color: #204051; margin-bottom: 1rem; }
        .markers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .marker-card {
          background: #fff; border-radius: 8px; border: 1px solid #e8ede8;
          padding: 1rem; cursor: pointer; transition: box-shadow 0.15s;
        }
        .marker-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .marker-card h3 { font-size: 0.95rem; color: #204051; margin: 0 0 0.3rem; }
        .marker-card .loc { font-size: 0.8rem; color: #888; margin-bottom: 0.4rem; }
        .marker-card .excerpt { font-size: 0.85rem; color: #555; line-height: 1.4; }
        .marker-card .topics { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .marker-card .topic-tag { font-size: 0.7rem; padding: 0.15rem 0.4rem; background: #f0f4f0; border-radius: 3px; color: #666; }
        .view-more-link { font-size: 0.82rem; color: #3b6978; margin-top: 0.5rem; display: inline-block; }
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
                      {TOPIC_LABELS[topic] || topic} ({count})
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

            <div className="filter-stats">
              Showing {filteredMarkers.length.toLocaleString()} of {markers.length.toLocaleString()} markers
              {filteredMarkers.length > 500 && (
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>
                  (First 500 shown on map)
                </div>
              )}
            </div>

            {(topicFilter || countyFilter || searchQuery) && (
              <button
                className="clear-filters"
                onClick={() => { setTopicFilter(''); setCountyFilter(''); setSearchQuery(''); }}
              >
                Clear all filters
              </button>
            )}
          </aside>

          <div className="markers-map-container">
            {MAPBOX_TOKEN && (
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
              >
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
                    onClose={() => setSelectedMarker(null)}
                    closeButton
                    closeOnClick={false}
                    anchor="top"
                    offset={15}
                    maxWidth="550px"
                  >
                    <div style={{ maxWidth: 520, maxHeight: '60vh', overflowY: 'auto', padding: '0.75rem' }}>
                      <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', color: '#204051' }}>
                        {selectedMarker.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 0.6rem' }}>
                        📍 {selectedMarker.town || selectedMarker.county}
                        {selectedMarker.town && selectedMarker.county && `, ${selectedMarker.county} County`}
                      </p>
                      {selectedMarker.topics.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                          {selectedMarker.topics.slice(0, 4).map(t => (
                            <span key={t} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#e8f4f8', borderRadius: '4px', color: '#3b6978' }}>
                              {TOPIC_LABELS[t] || t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#444', 
                        lineHeight: 1.6, 
                        margin: '0 0 1rem'
                      }}>
                        {selectedMarker.inscription.split('\n').map((para, i) => (
                          <p key={i} style={{ margin: '0 0 0.6rem' }}>{para}</p>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #e8ede8' }}>
                        {curatedSet.has(selectedMarker.slug) && (
                          <Link
                            href={`/historic-markers/${selectedMarker.slug}/`}
                            style={{ fontSize: '0.9rem', color: '#27ae60', fontWeight: 600 }}
                          >
                            View Full Page →
                          </Link>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.9rem', color: '#3b6978' }}
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>
            )}
          </div>
        </div>

        <section className="markers-list">
          <h2>
            {searchQuery || topicFilter || countyFilter
              ? `Filtered Results (${filteredMarkers.length})`
              : 'Featured Markers'}
          </h2>
          <div className="markers-grid">
            {(searchQuery || topicFilter || countyFilter ? filteredMarkers.slice(0, 24) : markers.filter(m => curatedSet.has(m.slug)).slice(0, 12)).map(m => (
              <div
                key={m.id}
                className="marker-card"
                onClick={() => handleMarkerClick(m)}
              >
                <h3>{m.title}</h3>
                <div className="loc">
                  {m.town || m.county}{m.town && m.county ? `, ${m.county} County` : ''}
                </div>
                <div className="excerpt">{m.inscription.substring(0, 100)}...</div>
                <div className="topics">
                  {m.topics.slice(0, 3).map(t => (
                    <span key={t} className="topic-tag">{TOPIC_LABELS[t] || t}</span>
                  ))}
                </div>
                {curatedSet.has(m.slug) && (
                  <Link href={`/historic-markers/${m.slug}/`} className="view-more-link">
                    Read Full Story &rarr;
                  </Link>
                )}
              </div>
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
