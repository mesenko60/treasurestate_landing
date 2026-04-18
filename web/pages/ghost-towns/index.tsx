import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
const MapboxMap = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.default), { ssr: false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Popup), { ssr: false });

type AllPin = { gnisId: number; name: string; countyFips: string; lat: number; lng: number };
type CuratedRow = {
  slug: string;
  name: string;
  countyLabel: string;
  /** 3-digit Montana county FIPS when known — used to narrow grey GNIS pins when filters are on */
  countyFips: string | null;
  region: string;
  status: string;
  lat: number | null;
  lng: number | null;
  excerpt: string;
};

type Props = {
  allPins: AllPin[];
  curated: CuratedRow[];
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const STATUS_LABEL: Record<string, string> = {
  preserved: 'Preserved',
  ruins: 'Ruins / remnants',
  partial: 'Partial / small population',
  vanished: 'Mostly vanished',
  manual: 'Historic site',
};

export default function GhostTownsHub({ allPins, curated }: Props) {
  const [selectedGrey, setSelectedGrey] = useState<AllPin | null>(null);
  const [selectedGold, setSelectedGold] = useState<CuratedRow | null>(null);
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewState, setViewState] = useState({
    latitude: 46.8,
    longitude: -110.5,
    zoom: 5.5,
  });

  const regions = useMemo(() => {
    const s = new Set<string>();
    curated.forEach((c) => s.add(c.region));
    return Array.from(s).sort();
  }, [curated]);

  const filteredCurated = useMemo(() => {
    return curated.filter((c) => {
      if (regionFilter && c.region !== regionFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [curated, regionFilter, statusFilter]);

  const hasActiveFilter = Boolean(regionFilter || statusFilter);

  const curatedOnMap = useMemo(
    () => filteredCurated.filter((c) => c.lat != null && c.lng != null),
    [filteredCurated],
  );

  const greyPins = useMemo(() => {
    const cap = 500;
    if (!hasActiveFilter) return allPins.slice(0, cap);
    const counties = new Set(
      filteredCurated.map((c) => c.countyFips).filter((f): f is string => Boolean(f)),
    );
    if (counties.size === 0) return [];
    return allPins.filter((p) => counties.has(p.countyFips)).slice(0, cap);
  }, [allPins, filteredCurated, hasActiveFilter]);

  useEffect(() => {
    if (selectedGold && !filteredCurated.some((c) => c.slug === selectedGold.slug)) {
      setSelectedGold(null);
    }
  }, [filteredCurated, selectedGold]);

  useEffect(() => {
    if (selectedGrey && !greyPins.some((p) => p.gnisId === selectedGrey.gnisId)) {
      setSelectedGrey(null);
    }
  }, [greyPins, selectedGrey]);

  const handleGoldClick = useCallback((c: CuratedRow) => {
    setSelectedGrey(null);
    setSelectedGold(c);
    setViewState((vs) => ({ ...vs, latitude: c.lat!, longitude: c.lng!, zoom: 11 }));
  }, []);

  const url = 'https://treasurestate.com/ghost-towns/';
  const title = 'Montana Ghost Towns';
  const desc =
    'Seventy-five in-depth Montana ghost-town stories on a statewide map with 417 historical settlements (GNIS). Mining camps, railroad towns, and frontier communities.';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url,
    numberOfItems: curated.length,
  };

  const grouped = useMemo(() => {
    const m = new Map<string, CuratedRow[]>();
    for (const c of filteredCurated.sort((a, b) => a.name.localeCompare(b.name))) {
      const arr = m.get(c.region) || [];
      arr.push(c);
      m.set(c.region, arr);
    }
    return m;
  }, [filteredCurated]);

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
      <Hero
        title="Montana Ghost Towns"
        subtitle={`${curated.length} full stories · ${allPins.length} historical settlements on the map`}
        image="/images/hero-image.jpg"
        alt="Montana ghost towns map"
        small
      />
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Ghost Towns', url }]} />

      <style dangerouslySetInnerHTML={{ __html: `
        .gt-page { max-width: 1320px; margin: 0 auto; padding: 1rem 1rem 3rem; }
        .gt-layout { display: grid; grid-template-columns: 260px 1fr; gap: 1rem; min-height: 560px; }
        @media (max-width: 900px) { .gt-layout { grid-template-columns: 1fr; } }
        .gt-sidebar { background: #fff; border-radius: 10px; border: 1px solid #e8ede8; padding: 1rem; height: fit-content; }
        .gt-sidebar h2 { font-size: 1rem; color: #204051; margin: 0 0 0.75rem; }
        .gt-sidebar label { display: block; font-size: 0.82rem; color: #666; margin-bottom: 0.35rem; }
        .gt-sidebar select { width: 100%; margin-bottom: 1rem; padding: 0.45rem; border-radius: 6px; border: 1px solid #ddd; font-size: 0.9rem; }
        .gt-map-wrap { height: 520px; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
        .gt-pin-grey { width: 7px; height: 7px; background: #8899a6; border: 1px solid #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.25); }
        .gt-pin-gold { width: 14px; height: 14px; background: #c9a227; border: 2px solid #fff; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.35); }
        .gt-legend { font-size: 0.8rem; color: #666; margin-top: 0.75rem; line-height: 1.5; }
        .gt-region { margin-top: 2rem; }
        .gt-region h2 { font-size: 1.2rem; color: #204051; margin-bottom: 0.75rem; border-bottom: 2px solid #e8ede8; padding-bottom: 0.35rem; }
        .gt-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .gt-card { background: #fff; border: 1px solid #e8ede8; border-radius: 10px; padding: 1rem; }
        .gt-card h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
        .gt-card h3 a { color: #204051; text-decoration: none; }
        .gt-card h3 a:hover { color: #3b6978; text-decoration: underline; }
        .gt-badges { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
        .gt-badge { font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: #eef6f8; color: #3b6978; }
        .gt-excerpt { font-size: 0.9rem; color: #555; line-height: 1.55; }
        .gt-all-link { display: inline-block; margin-top: 1.5rem; font-weight: 600; color: #3b6978; }
        .compare-intro-prose.gt-hub-prose { margin-top: 1rem; font-size: 0.95rem; color: #555; line-height: 1.6; }
      `}} />

      <main className="gt-page">
        <p className="compare-intro-prose gt-hub-prose">
          Explore Montana&apos;s mining camps, railroad towns, and frontier communities. Gold pins mark the{' '}
          {curated.length} towns with full articles. Grey dots show every GNIS historical populated place (PPLQ) in the
          state — about {allPins.length} places — many with no surviving structures. See the{' '}
          <Link href="/ghost-towns/all/">sortable index of all historical settlements</Link> or read about{' '}
          <Link href="/information/mining-history-of-montana/">Montana mining history</Link>.
        </p>

        <div className="gt-layout">
          <aside className="gt-sidebar">
            <h2>Filters</h2>
            <label htmlFor="gt-region">Region</label>
            <select id="gt-region" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label htmlFor="gt-status">Status</label>
            <select id="gt-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="preserved">Preserved</option>
              <option value="partial">Partial / small population</option>
              <option value="ruins">Ruins / remnants</option>
              <option value="vanished">Mostly vanished</option>
              <option value="manual">Historic site (approx. point)</option>
            </select>
            <p className="gt-legend">
              <strong>Grey dots</strong> — GNIS historical places (no article).{' '}
              <strong>Gold pins</strong> — curated story + map coordinates.
              {hasActiveFilter ? (
                <>
                  {' '}
                  With filters on, the map shows matching gold pins and grey dots only in counties that contain a
                  matching story (up to 500 grey pins).
                </>
              ) : null}
            </p>
          </aside>

          <div className="gt-map-wrap">
            {MAPBOX_TOKEN ? (
              <MapboxMap
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
              >
                {greyPins.map((p) => (
                  <Marker key={`g-${p.gnisId}`} latitude={p.lat} longitude={p.lng} anchor="center">
                    <div
                      className="gt-pin-grey"
                      title={p.name}
                      onClick={() => {
                        setSelectedGold(null);
                        setSelectedGrey(p);
                      }}
                    />
                  </Marker>
                ))}
                {curatedOnMap.map((c) => (
                  <Marker key={`c-${c.slug}`} latitude={c.lat!} longitude={c.lng!} anchor="center">
                    <div className="gt-pin-gold" title={c.name} onClick={() => handleGoldClick(c)} />
                  </Marker>
                ))}
                {selectedGrey && (
                  <Popup
                    latitude={selectedGrey.lat}
                    longitude={selectedGrey.lng}
                    onClose={() => setSelectedGrey(null)}
                    closeButton
                    anchor="bottom"
                  >
                    <div style={{ maxWidth: 260, fontSize: '0.88rem' }}>
                      <strong>{selectedGrey.name.replace(/\s*\(historical\)\s*$/i, '')}</strong>
                      <div style={{ color: '#666', marginTop: 4 }}>Historical settlement (GNIS)</div>
                      <div style={{ marginTop: 8, fontSize: '0.8rem' }}>
                        <Link href="/ghost-towns/all/">View in full index →</Link>
                      </div>
                    </div>
                  </Popup>
                )}
                {selectedGold && (
                  <Popup
                    latitude={selectedGold.lat!}
                    longitude={selectedGold.lng!}
                    onClose={() => setSelectedGold(null)}
                    closeButton
                    anchor="bottom"
                  >
                    <div style={{ maxWidth: 280, fontSize: '0.88rem' }}>
                      <strong>{selectedGold.name}</strong>
                      <div style={{ color: '#666', marginTop: 4 }}>{selectedGold.countyLabel}</div>
                      <div style={{ marginTop: 10 }}>
                        <Link href={`/ghost-towns/${selectedGold.slug}/`}>Read the full story →</Link>
                      </div>
                    </div>
                  </Popup>
                )}
              </MapboxMap>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                Map requires <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.
              </div>
            )}
          </div>
        </div>

        <Link href="/ghost-towns/all/" className="gt-all-link">
          All {allPins.length} historical settlements (sortable table) →
        </Link>

        {Array.from(grouped.entries()).map(([region, rows]) => (
          <section key={region} className="gt-region">
            <h2>{region}</h2>
            <div className="gt-cards">
              {rows.map((c) => (
                <article key={c.slug} className="gt-card">
                  <h3>
                    <Link href={`/ghost-towns/${c.slug}/`}>{c.name}</Link>
                  </h3>
                  <div className="gt-badges">
                    <span className="gt-badge">{c.countyLabel}</span>
                    <span className="gt-badge">{STATUS_LABEL[c.status] || c.status}</span>
                  </div>
                  {c.excerpt ? <p className="gt-excerpt">{c.excerpt}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPath = path.join(process.cwd(), 'data', 'ghost-towns-all.json');
  const detailPath = path.join(process.cwd(), 'data', 'ghost-towns-detail.json');
  const allPins: AllPin[] = fs.existsSync(allPath) ? JSON.parse(fs.readFileSync(allPath, 'utf8')) : [];
  const detailRaw = fs.existsSync(detailPath) ? JSON.parse(fs.readFileSync(detailPath, 'utf8')) : [];
  const curated: CuratedRow[] = detailRaw.map((d: Record<string, unknown>) => ({
    slug: String(d.slug),
    name: String(d.name),
    countyLabel: String(d.countyLabel || ''),
    countyFips: typeof d.countyFips === 'string' && d.countyFips ? String(d.countyFips) : null,
    region: String(d.region),
    status: String(d.status),
    lat: typeof d.lat === 'number' ? d.lat : null,
    lng: typeof d.lng === 'number' ? d.lng : null,
    excerpt: String(d.excerpt || ''),
  }));

  return { props: { allPins, curated } };
};
