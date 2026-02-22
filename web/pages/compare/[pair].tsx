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

type TownData = {
  name: string;
  slug: string;
  elevation: number | null;
  county: string | null;
  region: string | null;
  population: number | null;
  zipCode: string | null;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  nearestAirportMiles: number | null;
  nearestAirportName: string | null;
};

type Props = {
  townA: TownData;
  townB: TownData;
};

const AIRPORT_NAMES: Record<string, string> = {
  BZN: 'Bozeman', BIL: 'Billings', MSO: 'Missoula',
  FCA: 'Kalispell', GTF: 'Great Falls', HLN: 'Helena',
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

export default function ComparePage({ townA, townB }: Props) {
  const title = `${townA.name} vs ${townB.name}, Montana - Side by Side Comparison`;
  const metaDesc = `Compare ${townA.name} and ${townB.name}, Montana side by side. Population, elevation, climate, schools, and more.`;
  const url = `https://treasurestate.com/compare/${townA.slug}-vs-${townB.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/Montana-towns/' },
    { name: `${townA.name} vs ${townB.name}`, url },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={url} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbs} />
      <Hero
        title={`${townA.name} vs ${townB.name}`}
        subtitle="Montana Town Comparison"
        image="/images/hero-image.jpg"
        alt="Montana landscape"
        small
      />

      <main>
        <section className="content-section">
          <h2 style={{ textAlign: 'center' }}>{townA.name} vs {townB.name}</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            A side-by-side comparison of two Montana communities. Explore the key differences to help you decide which town is right for your visit or relocation.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.8rem', borderBottom: '2px solid #204051', textAlign: 'left', color: '#204051' }}></th>
                  <th style={{ padding: '0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#204051', fontSize: '1.1rem' }}>
                    <Link href={`/montana-towns/${townA.slug}/`} style={{ color: '#3b6978', textDecoration: 'none' }}>{townA.name}</Link>
                  </th>
                  <th style={{ padding: '0.8rem', borderBottom: '2px solid #204051', textAlign: 'center', color: '#204051', fontSize: '1.1rem' }}>
                    <Link href={`/montana-towns/${townB.slug}/`} style={{ color: '#3b6978', textDecoration: 'none' }}>{townB.name}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Population" valA={townA.population?.toLocaleString() || 'N/A'} valB={townB.population?.toLocaleString() || 'N/A'} />
                <CompareRow label="County" valA={townA.county || ''} valB={townB.county || ''} />
                <CompareRow label="Region" valA={townA.region ? `${townA.region} MT` : ''} valB={townB.region ? `${townB.region} MT` : ''} />
                <CompareRow label="Elevation" valA={townA.elevation ? `${townA.elevation.toLocaleString()} ft` : ''} valB={townB.elevation ? `${townB.elevation.toLocaleString()} ft` : ''} />
                <CompareRow label="Zip Code" valA={townA.zipCode || ''} valB={townB.zipCode || ''} />
                <CompareRow label="Nearest Airport" valA={townA.nearestAirportMiles != null ? `${townA.nearestAirportName} (${townA.nearestAirportMiles} mi)` : ''} valB={townB.nearestAirportMiles != null ? `${townB.nearestAirportName} (${townB.nearestAirportMiles} mi)` : ''} />
                <CompareRow label="School District" valA={townA.schoolDistrict || ''} valB={townB.schoolDistrict || ''} />
                <CompareRow label="School Enrollment" valA={townA.schoolEnrollment ? `~${townA.schoolEnrollment.toLocaleString()}` : ''} valB={townB.schoolEnrollment ? `~${townB.schoolEnrollment.toLocaleString()}` : ''} />
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link href={`/montana-towns/${townA.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#3b6978', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
              Learn More About {townA.name}
            </Link>
            <Link href={`/montana-towns/${townB.slug}/`} style={{ padding: '0.75rem 1.5rem', background: '#3b6978', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
              Learn More About {townB.name}
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

  const townDataPath = path.resolve(process.cwd(), 'data', 'town-data.json');
  const airportPath = path.resolve(process.cwd(), 'data', 'town-airport-distances.json');

  const townData = JSON.parse(fs.readFileSync(townDataPath, 'utf8'));
  let airportData: Record<string, Record<string, { distanceMiles: number }>> = {};
  if (fs.existsSync(airportPath)) {
    airportData = JSON.parse(fs.readFileSync(airportPath, 'utf8'));
  }

  function buildTown(slug: string): TownData {
    const d = townData[slug] || {};
    const airports = airportData[slug];
    let nearestAirportMiles: number | null = null;
    let nearestAirportName: string | null = null;
    if (airports) {
      for (const [code, info] of Object.entries(airports)) {
        if (nearestAirportMiles === null || info.distanceMiles < nearestAirportMiles) {
          nearestAirportMiles = info.distanceMiles;
          nearestAirportName = AIRPORT_NAMES[code] || code;
        }
      }
    }
    return {
      name: d.name || slug,
      slug,
      elevation: d.elevation || null,
      county: d.county || null,
      region: d.region || null,
      population: d.population || null,
      zipCode: d.zipCode || null,
      schoolDistrict: d.schoolDistrict || null,
      schoolEnrollment: d.schoolEnrollment || null,
      nearestAirportMiles,
      nearestAirportName,
    };
  }

  return {
    props: {
      townA: buildTown(slugA),
      townB: buildTown(slugB),
    }
  };
};
