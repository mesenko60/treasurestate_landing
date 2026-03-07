import React, { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { filterNearbyRecreation } from '../../lib/recreation';
import { trackCompare } from '../../lib/gtag';

type MonthClimate = {
  month: string;
  avgHigh: number;
  avgLow: number;
  precipIn: number;
  snowIn?: number;
};

type RecPlace = { name: string; type: string; lat: number; lng: number; distMiles: number };
type RecSummary = { total: number; byCategory: { type: string; count: number }[]; highlights: RecPlace[] };

type ClimateSummary = {
  janHigh: number; janLow: number;
  julHigh: number; julLow: number;
  annualPrecip: string; annualSnow: string;
  highs: number[];
  lows: number[];
  labels: string[];
};

type TownEntry = {
  slug: string;
  name: string;
  nickname: string;
  population: number | null;
  elevation: number | null;
  county: string | null;
  region: string | null;
  zipCode: string | null;
  areaCode: string | null;
  timeZone: string | null;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  nearestAirport: string | null;
  nearestAirportMiles: number | null;
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
  zillowHomeValue: number | null;
  zillowHomeValueDate: string | null;
  zillowRent: number | null;
  climate: ClimateSummary | null;
  recreation: RecSummary | null;
};

type Props = {
  towns: TownEntry[];
};

const AIRPORT_NAMES: Record<string, string> = {
  BZN: 'Bozeman (BZN)', BIL: 'Billings (BIL)', MSO: 'Missoula (MSO)',
  FCA: 'Kalispell (FCA)', GTF: 'Great Falls (GTF)', HLN: 'Helena (HLN)',
  BTM: 'Butte (BTM)', WYS: 'West Yellowstone (WYS)',
  SDY: 'Sidney (SDY)', GGW: 'Glasgow (GGW)', OLF: 'Wolf Point (OLF)',
  GDV: 'Glendive (GDV)', HVR: 'Havre (HVR)',
};

const REC_ICONS: Record<string, string> = {
  'National Park': '🏔️', 'National Forest': '🌲', 'Wilderness': '🏕️',
  'State Park': '🌳', 'Lake': '🏞️', 'River': '🎣', 'Hot Spring': '♨️',
  'Ski Area': '⛷️', 'Scenic Drive': '🛣️', 'Wildlife Refuge': '🦅',
  'Historic Site': '📜', 'National Rec Area': '🏞️', 'Golf': '⛳', 'Museum': '🏛️',
  'Campground': '⛺', 'Trailhead': '🥾', 'Waterfall': '💧',
  'Fishing Access': '🐟', 'Boat Launch': '🚣', 'Viewpoint': '👀', 'National HQ': '🏢',
};

const REC_COLORS: Record<string, string> = {
  'National Park': '#2d7d46', 'National Forest': '#3a7d44', 'Wilderness': '#4a7c59',
  'State Park': '#5a8f3c', 'Lake': '#3b6978', 'River': '#2980b9', 'Hot Spring': '#c0392b',
  'Ski Area': '#5b6abf', 'Scenic Drive': '#d68910', 'Wildlife Refuge': '#7d6608',
  'Historic Site': '#8b4513', 'National Rec Area': '#2e86ab', 'Golf': '#27ae60', 'Museum': '#6c3483',
  'Campground': '#6b8e23', 'Trailhead': '#8b6914', 'Waterfall': '#2e86ab',
  'Fishing Access': '#2471a3', 'Boat Launch': '#1a5276', 'Viewpoint': '#a04000', 'National HQ': '#1a5276',
};

function Indicator({ better }: { better: boolean | null }) {
  if (better === null) return null;
  return <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem' }}>{better ? '✦' : ''}</span>;
}

function ClimateChart({ townA, townB }: { townA: TownEntry; townB: TownEntry }) {
  const cA = townA.climate, cB = townB.climate;
  if (!cA?.highs || !cB?.highs) return null;
  const maxTemp = Math.max(...cA.highs, ...cB.highs);
  const minTemp = Math.min(...cA.lows, ...cB.lows);
  const range = maxTemp - minTemp || 1;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', color: '#204051', marginBottom: '1rem', textAlign: 'center' }}>
        Monthly Temperature Comparison
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#3b6978', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }} />{townA.name}</span>
        <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#c0392b', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }} />{townB.name}</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'flex-end', minWidth: '500px', height: '180px', padding: '0 0.5rem' }}>
          {cA.highs.map((highA, i) => {
            const highB = cB.highs[i];
            const barWidth = 16;
            const hA = ((highA - minTemp) / range) * 150;
            const hB = ((highB - minTemp) / range) * 150;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '150px' }}>
                  <div style={{ width: barWidth, height: Math.max(hA, 4), background: '#3b6978', borderRadius: '2px 2px 0 0' }} title={`${townA.name}: ${highA}°F`} />
                  <div style={{ width: barWidth, height: Math.max(hB, 4), background: '#c0392b', borderRadius: '2px 2px 0 0' }} title={`${townB.name}: ${highB}°F`} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>{cA.labels[i]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        {[townA, townB].map((town, idx) => (
          <div key={town.slug} style={{ textAlign: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 600, color: idx === 0 ? '#3b6978' : '#c0392b', marginBottom: '0.3rem', fontSize: '0.9rem' }}>{town.name}</div>
            <div style={{ fontSize: '0.82rem', color: '#555' }}>
              Annual Precip: {town.climate?.annualPrecip}" · Snow: {town.climate?.annualSnow}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareRow({ label, valA, valB, highlightHigher, highlightLower }: {
  label: string; valA: string; valB: string;
  highlightHigher?: boolean; highlightLower?: boolean;
}) {
  const numA = parseFloat(valA.replace(/[^0-9.-]/g, ''));
  const numB = parseFloat(valB.replace(/[^0-9.-]/g, ''));
  let bgA = 'transparent', bgB = 'transparent';
  if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
    if (highlightHigher) {
      if (numA > numB) bgA = '#e8f5e9'; else bgB = '#e8f5e9';
    }
    if (highlightLower) {
      if (numA < numB) bgA = '#e8f5e9'; else bgB = '#e8f5e9';
    }
  }
  return (
    <tr>
      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 500, color: '#204051', borderBottom: '1px solid #eee', width: '30%' }}>{label}</td>
      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', borderBottom: '1px solid #eee', width: '35%', background: bgA }}>{valA || '—'}</td>
      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', borderBottom: '1px solid #eee', width: '35%', background: bgB }}>{valB || '—'}</td>
    </tr>
  );
}

function TownSelector({ towns, value, onChange, label }: {
  towns: TownEntry[]; value: string; onChange: (slug: string) => void; label: string;
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selected = towns.find(t => t.slug === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return towns;
    const lower = search.toLowerCase();
    return towns.filter(t => t.name.toLowerCase().includes(lower));
  }, [towns, search]);

  return (
    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#204051', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', border: '2px solid #e0e0e0',
          borderRadius: '8px', background: '#fff', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'inherit', color: selected ? '#204051' : '#999',
          borderColor: open ? '#3b6978' : '#e0e0e0', transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
      >
        {selected ? selected.name : 'Select a town...'}
        <span style={{ float: 'right' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '2px solid #3b6978', borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '300px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{
              padding: '0.6rem 0.8rem', border: 'none', borderBottom: '1px solid #eee',
              fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
            {filtered.map(t => (
              <button
                key={t.slug}
                onClick={() => { onChange(t.slug); setOpen(false); setSearch(''); }}
                style={{
                  display: 'block', width: '100%', padding: '0.5rem 0.8rem', border: 'none',
                  background: t.slug === value ? '#e8f0f3' : '#fff', cursor: 'pointer',
                  textAlign: 'left', fontSize: '0.92rem', fontFamily: 'inherit', color: '#204051',
                  borderBottom: '1px solid #f5f5f5', boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => { if (t.slug !== value) e.currentTarget.style.background = '#f5f8fa'; }}
                onMouseLeave={(e) => { if (t.slug !== value) e.currentTarget.style.background = '#fff'; }}
              >
                {t.name}
                <span style={{ float: 'right', fontSize: '0.78rem', color: '#999' }}>
                  {t.population ? t.population.toLocaleString() : ''}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>No towns found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompareTool({ towns }: Props) {
  const router = useRouter();
  const [slugA, setSlugA] = useState<string>((router.query.a as string) || '');
  const [slugB, setSlugB] = useState<string>((router.query.b as string) || '');

  const townA = useMemo(() => towns.find(t => t.slug === slugA) || null, [towns, slugA]);
  const townB = useMemo(() => towns.find(t => t.slug === slugB) || null, [towns, slugB]);

  const updateUrl = useCallback((a: string, b: string) => {
    if (a && b) {
      router.replace({ pathname: '/compare', query: { a, b } }, undefined, { shallow: true });
    }
  }, [router]);

  const handleA = (slug: string) => {
    setSlugA(slug); updateUrl(slug, slugB);
    if (slug && slugB) trackCompare(slug, slugB);
  };
  const handleB = (slug: string) => {
    setSlugB(slug); updateUrl(slugA, slug);
    if (slugA && slug) trackCompare(slugA, slug);
  };
  const handleSwap = () => { setSlugA(slugB); setSlugB(slugA); updateUrl(slugB, slugA); };

  const title = townA && townB
    ? `${townA.name} vs ${townB.name} - Montana Town Comparison`
    : 'Compare Montana Towns - Find Your Ideal Community';
  const desc = townA && townB
    ? `Compare ${townA.name} and ${townB.name}, Montana side by side: population, climate, schools, recreation, and more.`
    : 'Compare any two Montana towns side by side. Explore population, climate, schools, outdoor recreation, and more to find your ideal community.';

  const breadcrumbs = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Compare Towns', url: 'https://treasurestate.com/compare/' },
  ];

  const fmt = (n: number | null | undefined) => n != null ? n.toLocaleString() : '—';
  const fmtFt = (n: number | null | undefined) => n != null ? `${n.toLocaleString()} ft` : '—';

  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/compare/" />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://treasurestate.com/compare/" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 20px 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#204051', marginBottom: '0.5rem' }}>Compare Montana Towns</h1>
          <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Thinking about moving to Montana? Pick any two towns to compare them side by side.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <TownSelector towns={towns} value={slugA} onChange={handleA} label="Town A" />
          <button
            onClick={handleSwap}
            disabled={!slugA || !slugB}
            style={{
              padding: '0.75rem', background: '#f0f0f0', border: '2px solid #e0e0e0',
              borderRadius: '8px', cursor: slugA && slugB ? 'pointer' : 'default',
              fontSize: '1.2rem', lineHeight: 1, flexShrink: 0, alignSelf: 'flex-end',
              opacity: slugA && slugB ? 1 : 0.4,
            }}
            title="Swap towns"
          >⇄</button>
          <TownSelector towns={towns} value={slugB} onChange={handleB} label="Town B" />
        </div>

        {townA && townB && (
          <div>
            {/* Nickname badges */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[townA, townB].map((t, i) => (
                <div key={t.slug} style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '1rem', background: i === 0 ? '#e8f0f3' : '#fdf0ef', borderRadius: '10px' }}>
                  <Link href={`/montana-towns/${t.slug}/`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#204051' }}>{t.name}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>{t.nickname}</div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'left', color: '#204051', width: '30%' }}>Overview</th>
                    <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#3b6978', width: '35%' }}>{townA.name}</th>
                    <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#c0392b', width: '35%' }}>{townB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label="Population" valA={fmt(townA.population)} valB={fmt(townB.population)} highlightHigher />
                  <CompareRow label="Elevation" valA={fmtFt(townA.elevation)} valB={fmtFt(townB.elevation)} />
                  <CompareRow label="County" valA={townA.county || '—'} valB={townB.county || '—'} />
                  <CompareRow label="Region" valA={townA.region ? `${townA.region} Montana` : '—'} valB={townB.region ? `${townB.region} Montana` : '—'} />

                  <tr style={{ background: '#f8f9fa' }}>
                    <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Climate</td>
                  </tr>
                  <CompareRow
                    label="January Avg High"
                    valA={townA.climate ? `${townA.climate.janHigh}°F` : '—'}
                    valB={townB.climate ? `${townB.climate.janHigh}°F` : '—'}
                    highlightHigher
                  />
                  <CompareRow
                    label="January Avg Low"
                    valA={townA.climate ? `${townA.climate.janLow}°F` : '—'}
                    valB={townB.climate ? `${townB.climate.janLow}°F` : '—'}
                    highlightHigher
                  />
                  <CompareRow
                    label="July Avg High"
                    valA={townA.climate ? `${townA.climate.julHigh}°F` : '—'}
                    valB={townB.climate ? `${townB.climate.julHigh}°F` : '—'}
                  />
                  <CompareRow
                    label="July Avg Low"
                    valA={townA.climate ? `${townA.climate.julLow}°F` : '—'}
                    valB={townB.climate ? `${townB.climate.julLow}°F` : '—'}
                  />
                  <CompareRow
                    label="Annual Precipitation"
                    valA={townA.climate ? `${townA.climate.annualPrecip}"` : '—'}
                    valB={townB.climate ? `${townB.climate.annualPrecip}"` : '—'}
                  />
                  <CompareRow
                    label="Annual Snowfall"
                    valA={townA.climate ? `${townA.climate.annualSnow}"` : '—'}
                    valB={townB.climate ? `${townB.climate.annualSnow}"` : '—'}
                  />

                  <tr style={{ background: '#f8f9fa' }}>
                    <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Housing &amp; Cost of Living</td>
                  </tr>
                  <CompareRow
                    label={townA.zillowHomeValue || townB.zillowHomeValue ? 'Typical Home Value' : 'Median Home Value'}
                    valA={(townA.zillowHomeValue || townA.medianHomeValue) ? `$${(townA.zillowHomeValue || townA.medianHomeValue)!.toLocaleString()}` : '—'}
                    valB={(townB.zillowHomeValue || townB.medianHomeValue) ? `$${(townB.zillowHomeValue || townB.medianHomeValue)!.toLocaleString()}` : '—'}
                    highlightLower
                  />
                  <CompareRow
                    label={townA.zillowRent || townB.zillowRent ? 'Typical Rent' : 'Median Rent'}
                    valA={(townA.zillowRent || townA.medianRent) ? `$${(townA.zillowRent || townA.medianRent)!.toLocaleString()}/mo` : '—'}
                    valB={(townB.zillowRent || townB.medianRent) ? `$${(townB.zillowRent || townB.medianRent)!.toLocaleString()}/mo` : '—'}
                    highlightLower
                  />
                  <CompareRow
                    label="Median Household Income"
                    valA={townA.medianHouseholdIncome ? `$${townA.medianHouseholdIncome.toLocaleString()}` : '—'}
                    valB={townB.medianHouseholdIncome ? `$${townB.medianHouseholdIncome.toLocaleString()}` : '—'}
                    highlightHigher
                  />

                  <tr style={{ background: '#f8f9fa' }}>
                    <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Access &amp; Location</td>
                  </tr>
                  <CompareRow
                    label="Nearest Airport"
                    valA={townA.nearestAirport ? `${townA.nearestAirport} (${townA.nearestAirportMiles} mi)` : '—'}
                    valB={townB.nearestAirport ? `${townB.nearestAirport} (${townB.nearestAirportMiles} mi)` : '—'}
                    highlightLower
                  />
                  <CompareRow label="Zip Code" valA={townA.zipCode || '—'} valB={townB.zipCode || '—'} />
                  <CompareRow label="Area Code" valA={townA.areaCode || '—'} valB={townB.areaCode || '—'} />
                  <CompareRow label="Time Zone" valA={townA.timeZone || '—'} valB={townB.timeZone || '—'} />

                  <tr style={{ background: '#f8f9fa' }}>
                    <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Education</td>
                  </tr>
                  <CompareRow label="School District" valA={townA.schoolDistrict || '—'} valB={townB.schoolDistrict || '—'} />
                  <CompareRow
                    label="Enrollment"
                    valA={townA.schoolEnrollment ? `~${townA.schoolEnrollment.toLocaleString()}` : '—'}
                    valB={townB.schoolEnrollment ? `~${townB.schoolEnrollment.toLocaleString()}` : '—'}
                    highlightHigher
                  />
                </tbody>
              </table>
            </div>

            {/* Climate chart */}
            <ClimateChart townA={townA} townB={townB} />

            {/* Nearby recreation comparison */}
            {(townA.recreation || townB.recreation) && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#204051', marginBottom: '0.25rem', textAlign: 'center' }}>
                  Outdoor Recreation &amp; Attractions (within 50 mi)
                </h3>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '0 0 1rem' }}>
                  {townA.name}: {townA.recreation?.total || 0} sites | {townB.name}: {townB.recreation?.total || 0} sites
                </p>

                {/* Category breakdown */}
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #204051' }}>
                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#204051' }}>Category</th>
                        <th style={{ textAlign: 'center', padding: '0.4rem 0.6rem', color: '#3b6978' }}>{townA.name}</th>
                        <th style={{ textAlign: 'center', padding: '0.4rem 0.6rem', color: '#c0392b' }}>{townB.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const allTypes = new Set<string>();
                        townA.recreation?.byCategory.forEach(c => allTypes.add(c.type));
                        townB.recreation?.byCategory.forEach(c => allTypes.add(c.type));
                        const catA = Object.fromEntries(townA.recreation?.byCategory.map(c => [c.type, c.count]) || []);
                        const catB = Object.fromEntries(townB.recreation?.byCategory.map(c => [c.type, c.count]) || []);
                        return Array.from(allTypes).sort().map(type => (
                          <tr key={type} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.35rem 0.6rem' }}>{REC_ICONS[type] || '📍'} {type}</td>
                            <td style={{ textAlign: 'center', padding: '0.35rem', fontWeight: (catA[type] || 0) >= (catB[type] || 0) ? 600 : 400, color: (catA[type] || 0) >= (catB[type] || 0) ? '#3b6978' : '#888' }}>{catA[type] || '—'}</td>
                            <td style={{ textAlign: 'center', padding: '0.35rem', fontWeight: (catB[type] || 0) >= (catA[type] || 0) ? 600 : 400, color: (catB[type] || 0) >= (catA[type] || 0) ? '#c0392b' : '#888' }}>{catB[type] || '—'}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Top highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[townA, townB].map((town, idx) => (
                    <div key={town.slug}>
                      <div style={{ fontWeight: 600, color: idx === 0 ? '#3b6978' : '#c0392b', marginBottom: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}>Top Highlights</div>
                      {town.recreation?.highlights.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.5rem', background: i % 2 === 0 ? '#f8f9fa' : '#fff', borderRadius: '4px', fontSize: '0.83rem' }}>
                          <span style={{ flexShrink: 0 }}>{REC_ICONS[p.type] || '📍'}</span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: '#204051' }}>{p.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', color: REC_COLORS[p.type] || '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{p.type}</span>
                              <span style={{ fontSize: '0.75rem', color: '#888' }}>{p.distMiles} mi</span>
                            </div>
                          </div>
                        </div>
                      )) || <div style={{ color: '#999', fontSize: '0.85rem', textAlign: 'center' }}>No data</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <Link href={`/montana-towns/${townA.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#3b6978', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                Explore {townA.name}
              </Link>
              <Link href={`/montana-towns/${townB.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#c0392b', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                Explore {townB.name}
              </Link>
            </div>
          </div>
        )}

        {(!townA || !townB) && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏔️ ⇄ 🏔️</div>
            <p style={{ fontSize: '1.1rem' }}>Select two towns above to compare them side by side.</p>
            <div style={{ marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0' }}>
              <h3 style={{ color: '#204051', marginBottom: '1rem' }}>Popular Comparisons</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  ['bozeman', 'missoula'], ['billings', 'great-falls'],
                  ['helena', 'butte'], ['kalispell', 'whitefish'],
                  ['livingston', 'bozeman'], ['red-lodge', 'big-timber'],
                ].map(([a, b]) => {
                  const tA = towns.find(t => t.slug === a);
                  const tB = towns.find(t => t.slug === b);
                  if (!tA || !tB) return null;
                  return (
                    <button
                      key={`${a}-${b}`}
                      onClick={() => { setSlugA(a); setSlugB(b); updateUrl(a, b); trackCompare(a, b); }}
                      style={{
                        padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '6px',
                        background: '#fff', cursor: 'pointer', fontSize: '0.9rem',
                        fontFamily: 'inherit', color: '#3b6978', fontWeight: 500,
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      {tA.name} vs {tB.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <Link href="/best-of/" style={{ padding: '0.6rem 1.25rem', background: '#f5f8f5', border: '1px solid #dde8dd', borderRadius: '6px', color: '#3b6978', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Best Of Rankings
          </Link>
          <Link href="/guides/" style={{ padding: '0.6rem 1.25rem', background: '#f5f8f5', border: '1px solid #dde8dd', borderRadius: '6px', color: '#3b6978', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Moving Guides
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (file: string) => {
    const p = path.join(dataDir, file);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };

  const townData = load('town-data.json');
  const climateData = load('town-climate.json');
  const recData = load('town-recreation.json');
  const airportData = load('town-airport-distances.json');
  const nicknames = load('town-nicknames.json');
  const coords = load('town-coordinates.json');
  const housingData = load('town-housing.json');

  const towns: TownEntry[] = Object.keys(coords)
    .map(slug => {
      const d = townData[slug] || {};
      const airports = airportData[slug];
      let nearestAirport: string | null = null;
      let nearestAirportMiles: number | null = null;
      if (airports) {
        for (const [code, info] of Object.entries(airports) as [string, any][]) {
          if (nearestAirportMiles === null || info.distanceMiles < nearestAirportMiles) {
            nearestAirportMiles = info.distanceMiles;
            nearestAirport = AIRPORT_NAMES[code] || code;
          }
        }
      }

      const months = climateData[slug]?.months as MonthClimate[] | undefined;
      let climate: ClimateSummary | null = null;
      if (months && months.length === 12) {
        climate = {
          janHigh: months[0].avgHigh, janLow: months[0].avgLow,
          julHigh: months[6].avgHigh, julLow: months[6].avgLow,
          annualPrecip: months.reduce((s, m) => s + m.precipIn, 0).toFixed(1),
          annualSnow: months.reduce((s, m) => s + (m.snowIn || 0), 0).toFixed(1),
          highs: months.map(m => m.avgHigh),
          lows: months.map(m => m.avgLow),
          labels: months.map(m => m.month),
        };
      }

      return {
        slug,
        name: d.name || coords[slug]?.name || slug,
        nickname: nicknames[slug] || 'A Montana Community',
        population: d.population || null,
        elevation: d.elevation || null,
        county: d.county || null,
        region: d.region || null,
        zipCode: d.zipCode || null,
        areaCode: d.areaCode || null,
        timeZone: d.timeZone || null,
        schoolDistrict: d.schoolDistrict || null,
        schoolEnrollment: d.schoolEnrollment || null,
        nearestAirport,
        nearestAirportMiles,
        medianHomeValue: housingData[slug]?.medianHomeValue || null,
        medianRent: housingData[slug]?.medianRent || null,
        medianHouseholdIncome: housingData[slug]?.medianHouseholdIncome || null,
        zillowHomeValue: housingData[slug]?.zillowHomeValue || null,
        zillowHomeValueDate: housingData[slug]?.zillowHomeValueDate || null,
        zillowRent: housingData[slug]?.zillowRent || null,
        climate,
        recreation: (() => {
          const places: RecPlace[] = filterNearbyRecreation(recData[slug]?.places || []);
          if (!places.length) return null;
          const byCategory: Record<string, number> = {};
          for (const p of places) byCategory[p.type] = (byCategory[p.type] || 0) + 1;
          const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count }));
          // Pick diverse highlights: 1 per category, then fill by distance
          const highlights: RecPlace[] = [];
          const usedTypes = new Set<string>();
          for (const p of places) {
            if (highlights.length >= 8) break;
            if (!usedTypes.has(p.type)) { highlights.push(p); usedTypes.add(p.type); }
          }
          for (const p of places) {
            if (highlights.length >= 8) break;
            if (!highlights.find(h => h.name === p.name)) highlights.push(p);
          }
          return { total: places.length, byCategory: sorted, highlights };
        })(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return { props: { towns } };
};
