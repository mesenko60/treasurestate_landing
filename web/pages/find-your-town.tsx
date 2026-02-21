import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

type TownEntry = {
  slug: string;
  name: string;
  elevation: number | null;
  county: string | null;
  region: string | null;
  nearestAirportMiles: number | null;
  nearestAirportCode: string | null;
};

type Props = {
  towns: TownEntry[];
  counties: string[];
};

const REGIONS = ['All', 'Western', 'Central', 'Eastern'];

const ELEVATION_RANGES = [
  { label: 'All Elevations', min: 0, max: Infinity },
  { label: 'Under 3,000 ft', min: 0, max: 3000 },
  { label: '3,000–4,000 ft', min: 3000, max: 4000 },
  { label: '4,000–5,000 ft', min: 4000, max: 5000 },
  { label: 'Above 5,000 ft', min: 5000, max: Infinity },
];

const AIRPORT_RANGES = [
  { label: 'Any Distance', max: Infinity },
  { label: 'Under 50 miles', max: 50 },
  { label: 'Under 100 miles', max: 100 },
  { label: 'Under 150 miles', max: 150 },
];

const AIRPORT_NAMES: Record<string, string> = {
  BZN: 'Bozeman',
  BIL: 'Billings',
  MSO: 'Missoula',
  FCA: 'Kalispell',
  GTF: 'Great Falls',
  HLN: 'Helena',
};

export default function FindYourTown({ towns, counties }: Props) {
  const [region, setRegion] = useState('All');
  const [elevIdx, setElevIdx] = useState(0);
  const [airportIdx, setAirportIdx] = useState(0);
  const [county, setCounty] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'elevation' | 'airport'>('name');

  const filtered = useMemo(() => {
    let list = towns;

    if (region !== 'All') {
      list = list.filter(t => t.region === region);
    }

    if (county !== 'All') {
      list = list.filter(t => t.county === county);
    }

    const elev = ELEVATION_RANGES[elevIdx];
    if (elev.min > 0 || elev.max < Infinity) {
      list = list.filter(t => t.elevation != null && t.elevation >= elev.min && t.elevation < elev.max);
    }

    const air = AIRPORT_RANGES[airportIdx];
    if (air.max < Infinity) {
      list = list.filter(t => t.nearestAirportMiles != null && t.nearestAirportMiles <= air.max);
    }

    if (sortBy === 'elevation') {
      list = [...list].sort((a, b) => (b.elevation || 0) - (a.elevation || 0));
    } else if (sortBy === 'airport') {
      list = [...list].sort((a, b) => (a.nearestAirportMiles || 9999) - (b.nearestAirportMiles || 9999));
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [towns, region, county, elevIdx, airportIdx, sortBy]);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Find Your Montana Town', url: 'https://treasurestate.com/find-your-town/' },
  ];

  const selectStyle: React.CSSProperties = {
    padding: '0.6rem 0.8rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontFamily: "'Montserrat', sans-serif",
    background: '#fff',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#204051',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <>
      <Head>
        <title>Find Your Montana Town - Interactive Town Finder | Treasure State</title>
        <meta name="description" content="Filter and explore 134 Montana towns by region, elevation, county, and proximity to airports. Find your perfect Montana community." />
        <meta property="og:title" content="Find Your Montana Town" />
        <meta property="og:description" content="Interactive tool to discover the perfect Montana town for your visit or relocation." />
        <meta property="og:url" content="https://treasurestate.com/find-your-town/" />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />
      <Hero
        title="Find Your Montana Town"
        subtitle="Filter by region, elevation, and more"
        image="/images/hero-image.jpg"
        alt="Montana landscape"
        small
      />

      <main>
        <section className="content-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Filter Towns</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem',
            marginBottom: '1.5rem'
          }}>
            <label style={labelStyle}>
              Region
              <select value={region} onChange={e => setRegion(e.target.value)} style={selectStyle}>
                {REGIONS.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : `${r} Montana`}</option>)}
              </select>
            </label>

            <label style={labelStyle}>
              County
              <select value={county} onChange={e => setCounty(e.target.value)} style={selectStyle}>
                <option value="All">All Counties</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label style={labelStyle}>
              Elevation
              <select value={elevIdx} onChange={e => setElevIdx(Number(e.target.value))} style={selectStyle}>
                {ELEVATION_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
            </label>

            <label style={labelStyle}>
              Distance to Airport
              <select value={airportIdx} onChange={e => setAirportIdx(Number(e.target.value))} style={selectStyle}>
                {AIRPORT_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
            </label>

            <label style={labelStyle}>
              Sort By
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={selectStyle}>
                <option value="name">Name (A–Z)</option>
                <option value="elevation">Elevation (High → Low)</option>
                <option value="airport">Nearest Airport</option>
              </select>
            </label>
          </div>

          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.95rem' }}>
            Showing <strong>{filtered.length}</strong> of {towns.length} towns
          </p>
        </section>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {filtered.map(town => (
            <Link key={town.slug} href={`/montana-towns/${town.slug}/`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.2rem',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#204051', marginBottom: '0.5rem' }}>
                  {town.name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  {town.region && <span style={{ background: '#f0f4f5', padding: '2px 8px', borderRadius: '4px' }}>{town.region}</span>}
                  {town.elevation && <span style={{ background: '#f0f4f5', padding: '2px 8px', borderRadius: '4px' }}>{town.elevation.toLocaleString()} ft</span>}
                  {town.county && <span style={{ background: '#f0f4f5', padding: '2px 8px', borderRadius: '4px' }}>{town.county.replace(' County', '')}</span>}
                  {town.nearestAirportMiles != null && town.nearestAirportCode && (
                    <span style={{ background: '#f0f4f5', padding: '2px 8px', borderRadius: '4px' }}>
                      {town.nearestAirportMiles} mi to {AIRPORT_NAMES[town.nearestAirportCode] || town.nearestAirportCode}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const townDataPath = path.resolve(process.cwd(), 'data', 'town-data.json');
  const airportPath = path.resolve(process.cwd(), 'data', 'town-airport-distances.json');

  let townData: Record<string, any> = {};
  let airportData: Record<string, Record<string, { distanceMiles: number }>> = {};

  if (fs.existsSync(townDataPath)) {
    townData = JSON.parse(fs.readFileSync(townDataPath, 'utf8'));
  }
  if (fs.existsSync(airportPath)) {
    airportData = JSON.parse(fs.readFileSync(airportPath, 'utf8'));
  }

  const countiesSet = new Set<string>();
  const towns: TownEntry[] = Object.entries(townData).map(([slug, d]: [string, any]) => {
    if (d.county) countiesSet.add(d.county);

    let nearestAirportMiles: number | null = null;
    let nearestAirportCode: string | null = null;
    const airports = airportData[slug];
    if (airports) {
      for (const [code, info] of Object.entries(airports)) {
        if (nearestAirportMiles === null || info.distanceMiles < nearestAirportMiles) {
          nearestAirportMiles = info.distanceMiles;
          nearestAirportCode = code;
        }
      }
    }

    return {
      slug,
      name: d.name,
      elevation: d.elevation || null,
      county: d.county || null,
      region: d.region || null,
      nearestAirportMiles,
      nearestAirportCode,
    };
  });

  const counties = Array.from(countiesSet).sort();

  return { props: { towns, counties } };
};
