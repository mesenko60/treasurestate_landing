import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { filterNearbyRecreation } from '../../lib/recreation';

type MonthClimate = {
  month: string; avgHigh: number; avgLow: number; precipIn: number; snowIn?: number;
};

type RecPlace = { name: string; type: string; lat: number; lng: number; distMiles: number };
type RecSummary = { total: number; byCategory: { type: string; count: number }[]; highlights: RecPlace[] };

type TownData = {
  name: string;
  slug: string;
  nickname: string;
  elevation: number | null;
  county: string | null;
  region: string | null;
  population: number | null;
  zipCode: string | null;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  nearestAirportMiles: number | null;
  nearestAirportName: string | null;
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
  zillowHomeValue: number | null;
  zillowHomeValueDate: string | null;
  zillowRent: number | null;
  janHigh: number | null; janLow: number | null;
  julHigh: number | null; julLow: number | null;
  annualPrecip: string | null; annualSnow: string | null;
  climateMonths: MonthClimate[] | null;
  recreation: RecSummary | null;
};

type GuideLink = { name: string; href: string } | null;

type Props = {
  townA: TownData;
  townB: TownData;
  guideA: GuideLink;
  guideB: GuideLink;
};

const AIRPORT_NAMES: Record<string, string> = {
  BZN: 'Bozeman', BIL: 'Billings', MSO: 'Missoula',
  FCA: 'Kalispell', GTF: 'Great Falls', HLN: 'Helena',
  BTM: 'Butte', WYS: 'West Yellowstone',
  SDY: 'Sidney', GGW: 'Glasgow', OLF: 'Wolf Point',
  GDV: 'Glendive', HVR: 'Havre',
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

function CompareRow({ label, valA, valB }: { label: string; valA: string; valB: string }) {
  return (
    <tr>
      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 500, color: '#204051', borderBottom: '1px solid #eee', width: '30%' }}>{label}</td>
      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', borderBottom: '1px solid #eee', width: '35%' }}>{valA || '—'}</td>
      <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', borderBottom: '1px solid #eee', width: '35%' }}>{valB || '—'}</td>
    </tr>
  );
}

export default function ComparePage({ townA, townB, guideA, guideB }: Props) {
  const title = `${townA.name} vs ${townB.name}, Montana | Side by Side Comparison`;
  const metaDesc = `Compare ${townA.name} (${townA.nickname}) and ${townB.name} (${townB.nickname}), Montana side by side: population, climate, schools, recreation, and more.`;
  const url = `https://treasurestate.com/compare/${townA.slug}-vs-${townB.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/montana-towns/' },
    { name: `${townA.name} vs ${townB.name}`, url },
  ];

  const compareSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDesc,
    url,
    about: [
      { '@type': 'City', name: townA.name, address: { '@type': 'PostalAddress', addressRegion: 'MT', addressCountry: 'US' } },
      { '@type': 'City', name: townB.name, address: { '@type': 'PostalAddress', addressRegion: 'MT', addressCountry: 'US' } },
    ],
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbs} />
      <Hero
        title={`${townA.name} vs ${townB.name}`}
        subtitle="Montana Town Comparison"
        image="/images/hero-image.jpg"
        alt="Compare Montana towns side by side"
        small
      />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 4rem' }}>
        <section className="content-section">
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

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            A side-by-side comparison to help you decide which Montana community is right for you.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'left', color: '#204051', width: '30%' }}>Overview</th>
                  <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#3b6978', width: '35%' }}>{townA.name}</th>
                  <th style={{ padding: '0.7rem 0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#c0392b', width: '35%' }}>{townB.name}</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Population" valA={townA.population?.toLocaleString() || '—'} valB={townB.population?.toLocaleString() || '—'} />
                <CompareRow label="Elevation" valA={townA.elevation ? `${townA.elevation.toLocaleString()} ft` : '—'} valB={townB.elevation ? `${townB.elevation.toLocaleString()} ft` : '—'} />
                <CompareRow label="County" valA={townA.county || '—'} valB={townB.county || '—'} />
                <CompareRow label="Region" valA={townA.region ? `${townA.region} Montana` : '—'} valB={townB.region ? `${townB.region} Montana` : '—'} />

                <tr style={{ background: '#f8f9fa' }}>
                  <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Climate</td>
                </tr>
                <CompareRow label="January Avg High" valA={townA.janHigh != null ? `${townA.janHigh}°F` : '—'} valB={townB.janHigh != null ? `${townB.janHigh}°F` : '—'} />
                <CompareRow label="January Avg Low" valA={townA.janLow != null ? `${townA.janLow}°F` : '—'} valB={townB.janLow != null ? `${townB.janLow}°F` : '—'} />
                <CompareRow label="July Avg High" valA={townA.julHigh != null ? `${townA.julHigh}°F` : '—'} valB={townB.julHigh != null ? `${townB.julHigh}°F` : '—'} />
                <CompareRow label="July Avg Low" valA={townA.julLow != null ? `${townA.julLow}°F` : '—'} valB={townB.julLow != null ? `${townB.julLow}°F` : '—'} />
                <CompareRow label="Annual Precipitation" valA={townA.annualPrecip ? `${townA.annualPrecip}"` : '—'} valB={townB.annualPrecip ? `${townB.annualPrecip}"` : '—'} />
                <CompareRow label="Annual Snowfall" valA={townA.annualSnow ? `${townA.annualSnow}"` : '—'} valB={townB.annualSnow ? `${townB.annualSnow}"` : '—'} />

                <tr style={{ background: '#f8f9fa' }}>
                  <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Housing &amp; Cost of Living <span style={{ fontWeight: 400, fontSize: '0.75rem', color: '#888' }}>(ACS 2019–2023)</span></td>
                </tr>
                <CompareRow label={townA.zillowHomeValue || townB.zillowHomeValue ? 'Typical Home Value' : 'Median Home Value'} valA={(townA.zillowHomeValue || townA.medianHomeValue) ? `$${(townA.zillowHomeValue || townA.medianHomeValue)!.toLocaleString()}` : '—'} valB={(townB.zillowHomeValue || townB.medianHomeValue) ? `$${(townB.zillowHomeValue || townB.medianHomeValue)!.toLocaleString()}` : '—'} />
                <CompareRow label={townA.zillowRent || townB.zillowRent ? 'Typical Rent' : 'Median Rent'} valA={(townA.zillowRent || townA.medianRent) ? `$${(townA.zillowRent || townA.medianRent)!.toLocaleString()}/mo` : '—'} valB={(townB.zillowRent || townB.medianRent) ? `$${(townB.zillowRent || townB.medianRent)!.toLocaleString()}/mo` : '—'} />
                <CompareRow label="Median Household Income" valA={townA.medianHouseholdIncome ? `$${townA.medianHouseholdIncome.toLocaleString()}` : '—'} valB={townB.medianHouseholdIncome ? `$${townB.medianHouseholdIncome.toLocaleString()}` : '—'} />

                <tr style={{ background: '#f8f9fa' }}>
                  <td colSpan={3} style={{ padding: '0.7rem 0.8rem', fontWeight: 700, color: '#204051', borderBottom: '2px solid #204051' }}>Access &amp; Education</td>
                </tr>
                <CompareRow label="Nearest Airport" valA={townA.nearestAirportMiles != null ? `${townA.nearestAirportName} (${townA.nearestAirportMiles} mi)` : '—'} valB={townB.nearestAirportMiles != null ? `${townB.nearestAirportName} (${townB.nearestAirportMiles} mi)` : '—'} />
                <CompareRow label="Zip Code" valA={townA.zipCode || '—'} valB={townB.zipCode || '—'} />
                <CompareRow label="School District" valA={townA.schoolDistrict || '—'} valB={townB.schoolDistrict || '—'} />
                <CompareRow label="Enrollment" valA={townA.schoolEnrollment ? `~${townA.schoolEnrollment.toLocaleString()}` : '—'} valB={townB.schoolEnrollment ? `~${townB.schoolEnrollment.toLocaleString()}` : '—'} />
              </tbody>
            </table>
          </div>

          {/* Nearby recreation */}
          {(townA.recreation || townB.recreation) && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#204051', marginBottom: '0.25rem', textAlign: 'center' }}>Outdoor Recreation &amp; Attractions (within 30 mi)</h3>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '0 0 1rem' }}>
                {townA.name}: {townA.recreation?.total || 0} sites | {townB.name}: {townB.recreation?.total || 0} sites
              </p>

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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <Link href={`/montana-towns/${townA.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#3b6978', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
              Explore {townA.name}
            </Link>
            <Link href={`/montana-towns/${townB.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#c0392b', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
              Explore {townB.name}
            </Link>
          </div>

          {(guideA || guideB) && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              {guideA && (
                <Link href={guideA.href} style={{ fontSize: '0.88rem', color: '#3b6978', fontWeight: 500, textDecoration: 'none' }}>
                  Moving to {guideA.name} Guide →
                </Link>
              )}
              {guideB && (
                <Link href={guideB.href} style={{ fontSize: '0.88rem', color: '#3b6978', fontWeight: 500, textDecoration: 'none' }}>
                  Moving to {guideB.name} Guide →
                </Link>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/compare/" style={{ color: '#3b6978', fontWeight: 500 }}>
              ← Compare different towns
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Top comparison pairs: major cities, commonly compared towns, geographic neighbors
const COMPARISON_PAIRS = [
  ['bozeman', 'missoula'],
  ['bozeman', 'billings'],
  ['bozeman', 'helena'],
  ['bozeman', 'great-falls'],
  ['bozeman', 'kalispell'],
  ['bozeman', 'whitefish'],
  ['bozeman', 'belgrade'],
  ['bozeman', 'livingston'],
  ['missoula', 'billings'],
  ['missoula', 'helena'],
  ['missoula', 'great-falls'],
  ['missoula', 'kalispell'],
  ['missoula', 'hamilton'],
  ['missoula', 'stevensville'],
  ['billings', 'great-falls'],
  ['billings', 'helena'],
  ['billings', 'miles-city'],
  ['billings', 'laurel'],
  ['helena', 'great-falls'],
  ['helena', 'butte'],
  ['kalispell', 'whitefish'],
  ['kalispell', 'columbia-falls'],
  ['kalispell', 'bigfork'],
  ['kalispell', 'polson'],
  ['whitefish', 'columbia-falls'],
  ['butte', 'anaconda'],
  ['butte', 'helena'],
  ['butte', 'dillon'],
  ['great-falls', 'havre'],
  ['livingston', 'big-timber'],
  ['red-lodge', 'big-timber'],
  ['west-yellowstone', 'big-sky'],
  ['west-yellowstone', 'gardiner'],
  ['dillon', 'butte'],
  ['lewistown', 'great-falls'],
  ['glasgow', 'wolf-point'],
  ['glendive', 'miles-city'],
  ['sidney', 'glendive'],
  ['cut-bank', 'shelby'],
  ['libby', 'troy'],
  ['hamilton', 'stevensville'],
  ['polson', 'ronan'],
  ['thompson-falls', 'plains'],
  ['columbus', 'red-lodge'],
  ['three-forks', 'manhattan'],
  ['belgrade', 'livingston'],
  ['big-sky', 'bozeman'],
  ['ennis', 'virginia-city'],
  ['choteau', 'fairfield'],
  ['conrad', 'shelby'],
  // Gallatin / Park corridor
  ['bozeman', 'manhattan'],
  ['bozeman', 'three-forks'],
  ['belgrade', 'manhattan'],
  ['livingston', 'gardiner'],
  ['livingston', 'clyde-park'],
  // Flathead / Lake
  ['whitefish', 'bigfork'],
  ['bigfork', 'polson'],
  ['ronan', 'st-ignatius'],
  // Carbon / Stillwater
  ['red-lodge', 'bridger'],
  ['fromberg', 'bridger'],
  // Ravalli / Bitterroot
  ['hamilton', 'darby'],
  ['darby', 'stevensville'],
  // Lincoln / NW Montana
  ['libby', 'eureka'],
  ['eureka', 'troy'],
  // Missoula area
  ['missoula', 'seeley-lake'],
  ['missoula', 'superior'],
  ['alberton', 'superior'],
  // Madison / Jefferson
  ['ennis', 'twin-bridges'],
  ['twin-bridges', 'virginia-city'],
  ['boulder', 'whitehall'],
  // Butte / Deer Lodge
  ['butte', 'deer-lodge'],
  ['anaconda', 'deer-lodge'],
  // Glacier gateway
  ['browning', 'east-glacier'],
  ['cut-bank', 'browning'],
  ['whitefish', 'west-glacier'],
  // Eastern Montana
  ['miles-city', 'forsyth'],
  ['havre', 'chinook'],
  ['glasgow', 'malta'],
  ['sidney', 'fairview'],
  ['glendive', 'baker'],
  ['billings', 'hardin'],
  ['laurel', 'broadview'],
  // Central
  ['great-falls', 'fort-benton'],
  ['lewistown', 'harlowton'],
  ['helena', 'east-helena'],
  ['dillon', 'lima'],
  ['philipsburg', 'drummond'],
  // Cross-region relocation
  ['great-falls', 'bozeman'],
  ['great-falls', 'missoula'],
  ['helena', 'billings'],
  ['helena', 'missoula'],
];

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = COMPARISON_PAIRS.map(([a, b]) => ({
    params: { pair: `${a}-vs-${b}` }
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const pair = String(ctx.params?.pair);
  const parts = pair.split('-vs-');
  const slugA = parts[0];
  const slugB = parts[1];

  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (file: string) => {
    const p = path.join(dataDir, file);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };

  const townData = load('town-data.json');
  const airportData = load('town-airport-distances.json');
  const climateData = load('town-climate.json');
  const recData = load('town-recreation.json');
  const nicknames = load('town-nicknames.json');
  const housingData = load('town-housing.json');

  function buildTown(slug: string): TownData {
    const d = townData[slug] || {};
    const airports = airportData[slug];
    let nearestAirportMiles: number | null = null;
    let nearestAirportName: string | null = null;
    if (airports) {
      for (const [code, info] of Object.entries(airports) as [string, any][]) {
        if (nearestAirportMiles === null || info.distanceMiles < nearestAirportMiles) {
          nearestAirportMiles = info.distanceMiles;
          nearestAirportName = AIRPORT_NAMES[code] || code;
        }
      }
    }
    const months = climateData[slug]?.months as MonthClimate[] | undefined;
    return {
      name: d.name || slug,
      slug,
      nickname: nicknames[slug] || 'A Montana Community',
      elevation: d.elevation || null,
      county: d.county || null,
      region: d.region || null,
      population: d.population || null,
      zipCode: d.zipCode || null,
      schoolDistrict: d.schoolDistrict || null,
      schoolEnrollment: d.schoolEnrollment || null,
      nearestAirportMiles,
      nearestAirportName,
      medianHomeValue: housingData[slug]?.medianHomeValue || null,
      medianRent: housingData[slug]?.medianRent || null,
      medianHouseholdIncome: housingData[slug]?.medianHouseholdIncome || null,
      zillowHomeValue: housingData[slug]?.zillowHomeValue || null,
      zillowHomeValueDate: housingData[slug]?.zillowHomeValueDate || null,
      zillowRent: housingData[slug]?.zillowRent || null,
      janHigh: months?.[0]?.avgHigh ?? null,
      janLow: months?.[0]?.avgLow ?? null,
      julHigh: months?.[6]?.avgHigh ?? null,
      julLow: months?.[6]?.avgLow ?? null,
      annualPrecip: months ? months.reduce((s, m) => s + m.precipIn, 0).toFixed(1) : null,
      annualSnow: months ? months.reduce((s, m) => s + (m.snowIn || 0), 0).toFixed(1) : null,
      climateMonths: months || null,
      recreation: (() => {
        const places: RecPlace[] = filterNearbyRecreation(recData[slug]?.places || []);
        if (!places.length) return null;
        const byCategory: Record<string, number> = {};
        for (const p of places) byCategory[p.type] = (byCategory[p.type] || 0) + 1;
        const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count }));
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
  }

  const { guideLink } = await import('../../lib/cross-links');

  return {
    props: {
      townA: buildTown(slugA),
      townB: buildTown(slugB),
      guideA: guideLink(slugA) ? { name: townData[slugA]?.name || slugA, href: `/guides/moving-to-${slugA}-montana/` } : null,
      guideB: guideLink(slugB) ? { name: townData[slugB]?.name || slugB, href: `/guides/moving-to-${slugB}-montana/` } : null,
    }
  };
};
