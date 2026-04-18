import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

type Pin = {
  gnisId: number;
  name: string;
  countyFips: string;
  lat: number;
  lng: number;
  storySlug: string | null;
};

type Props = { rows: Pin[]; countyLabels: Record<string, string> };

function stripHistorical(name: string) {
  return name.replace(/\s*\(historical\)\s*$/i, '').trim();
}

export default function GhostTownsAll({ rows, countyLabels }: Props) {
  const [county, setCounty] = useState('');
  const [q, setQ] = useState('');
  const [curatedOnly, setCuratedOnly] = useState(false);

  const countyOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(r.countyFips));
    return Array.from(s).sort((a, b) => (countyLabels[a] || a).localeCompare(countyLabels[b] || b));
  }, [rows, countyLabels]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (curatedOnly && !r.storySlug) return false;
      if (county && r.countyFips !== county) return false;
      if (qq) {
        const n = stripHistorical(r.name).toLowerCase();
        const c = (countyLabels[r.countyFips] || '').toLowerCase();
        if (!n.includes(qq) && !c.includes(qq)) return false;
      }
      return true;
    });
  }, [rows, county, q, curatedOnly, countyLabels]);

  const url = 'https://treasurestate.com/ghost-towns/all/';

  return (
    <>
      <Head>
        <title>All Montana Historical Settlements (GNIS) | Treasure State</title>
        <meta
          name="description"
          content="Sortable list of Montana GNIS historical populated places (PPLQ) with county and coordinates. Curated towns link to full ghost-town articles."
        />
        <link rel="canonical" href={url} />
      </Head>
      <Header />
      <Hero
        title="Historical settlements index"
        subtitle="GNIS historical populated places (PPLQ) across Montana"
        image="/images/hero-image.jpg"
        alt="Montana map"
        small
      />
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: 'Ghost Towns', url: '/ghost-towns/' },
          { name: 'All settlements', url },
        ]}
      />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem 1rem 3rem' }}>
        <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          This table lists every <strong>historical populated place</strong> in the Montana GNIS layer used on the{' '}
          <Link href="/ghost-towns/">ghost towns map</Link>. Only the curated towns have dedicated story pages.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
            alignItems: 'center',
          }}
        >
          <label style={{ fontSize: '0.88rem', color: '#444' }}>
            Search{' '}
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name or county"
              style={{ marginLeft: 6, padding: '0.35rem 0.5rem', borderRadius: 6, border: '1px solid #ccc', minWidth: 200 }}
            />
          </label>
          <label style={{ fontSize: '0.88rem', color: '#444' }}>
            County{' '}
            <select value={county} onChange={(e) => setCounty(e.target.value)} style={{ marginLeft: 6, padding: '0.35rem', borderRadius: 6 }}>
              <option value="">All</option>
              {countyOptions.map((fips) => (
                <option key={fips} value={fips}>
                  {countyLabels[fips] || fips}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: '0.88rem', color: '#444', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={curatedOnly} onChange={(e) => setCuratedOnly(e.target.checked)} />
            Curated only ({rows.filter((r) => r.storySlug).length})
          </label>
          <span style={{ fontSize: '0.85rem', color: '#888' }}>
            Showing {filtered.length.toLocaleString()} of {rows.length.toLocaleString()}
          </span>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #e8ede8', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f4f8f5', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem 0.65rem' }}>Name</th>
                <th style={{ padding: '0.5rem 0.65rem' }}>County</th>
                <th style={{ padding: '0.5rem 0.65rem' }}>Latitude</th>
                <th style={{ padding: '0.5rem 0.65rem' }}>Longitude</th>
                <th style={{ padding: '0.5rem 0.65rem' }}>Story</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.gnisId} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '0.45rem 0.65rem' }}>{stripHistorical(r.name)}</td>
                  <td style={{ padding: '0.45rem 0.65rem' }}>{countyLabels[r.countyFips] || r.countyFips}</td>
                  <td style={{ padding: '0.45rem 0.65rem' }}>{r.lat.toFixed(5)}</td>
                  <td style={{ padding: '0.45rem 0.65rem' }}>{r.lng.toFixed(5)}</td>
                  <td style={{ padding: '0.45rem 0.65rem' }}>
                    {r.storySlug ? (
                      <Link href={`/ghost-towns/${r.storySlug}/`}>Read →</Link>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Static path so webpack can resolve at build time (dynamic path.join + require breaks prerender).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FIPS_TO_COUNTY_NAME } = require('../../scripts/ghost-towns-meta.cjs');
  const allPath = path.join(process.cwd(), 'data', 'ghost-towns-all.json');
  const detailPath = path.join(process.cwd(), 'data', 'ghost-towns-detail.json');
  const allPins = fs.existsSync(allPath) ? JSON.parse(fs.readFileSync(allPath, 'utf8')) : [];
  const detail: { gnisId: number | null; slug: string }[] = fs.existsSync(detailPath)
    ? JSON.parse(fs.readFileSync(detailPath, 'utf8'))
    : [];
  const gnisToSlug = new Map<number, string>();
  for (const d of detail) {
    if (d.gnisId != null) gnisToSlug.set(d.gnisId, d.slug);
  }
  const rows: Pin[] = allPins.map((p: { gnisId: number; name: string; countyFips: string; lat: number; lng: number }) => ({
    ...p,
    storySlug: gnisToSlug.get(p.gnisId) || null,
  }));
  const countyLabels: Record<string, string> = {};
  for (const f of Array.from(new Set(rows.map((r) => r.countyFips)))) {
    const n = FIPS_TO_COUNTY_NAME[f];
    countyLabels[f] = n ? `${n} County` : f;
  }
  return { props: { rows, countyLabels } };
};
