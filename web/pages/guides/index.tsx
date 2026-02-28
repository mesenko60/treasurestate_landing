import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

type GuideLink = {
  slug: string;
  townName: string;
  population: number;
  homeValue: string;
  recCount: number;
};

type Props = { guides: GuideLink[] };

export default function GuidesIndex({ guides }: Props) {
  const url = 'https://treasurestate.com/guides/';
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Relocation Guides', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Montana Relocation Guides',
    description: 'Comprehensive moving guides for Montana cities and towns — housing costs, climate, recreation, schools, and more.',
    url,
  };

  return (
    <>
      <Head>
        <title>Montana Relocation Guides — Moving to Montana | Treasure State</title>
        <meta name="description" content="Complete relocation guides for Montana cities and towns. Housing costs, climate data, recreation, schools, and everything you need to know about moving to Montana." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Montana Relocation Guides" />
        <meta property="og:description" content="Everything you need to know about moving to Montana." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero title="Montana Relocation Guides" subtitle="Everything You Need to Know About Moving to Big Sky Country" image="/images/hero-image.jpg" alt="Montana relocation guides" small />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333', marginBottom: '2rem' }}>
          Thinking about moving to Montana? Our comprehensive relocation guides cover everything from housing
          costs and climate to outdoor recreation, schools, and quality of life. Each guide is built from
          real data — Census figures, Zillow market data, and 2,500+ mapped recreation sites — to give
          you an honest picture of what life is really like in each community.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {guides.map(g => (
            <Link key={g.slug} href={`/guides/${g.slug}/`} style={{
              display: 'block', padding: '1.25rem', background: '#fff',
              borderRadius: '10px', border: '1px solid #e8ede8', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#204051', marginBottom: '0.4rem' }}>
                Moving to {g.townName}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#666', marginBottom: '0.5rem' }}>
                <span>Pop. {g.population.toLocaleString()}</span>
                <span>{g.homeValue}</span>
                <span>{g.recCount} rec sites</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 500 }}>
                Read Guide →
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: '2.5rem', padding: '1.25rem', background: '#f8faf8',
          borderRadius: '8px', border: '1px solid #e8ede8', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '0.95rem', color: '#204051', marginTop: 0 }}>Comparing Towns?</h3>
          <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1rem' }}>
            Use our tools to find the perfect Montana community for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/best-of/" style={{
              display: 'inline-block', padding: '0.6rem 1.25rem',
              background: '#3b6978', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
            }}>
              Best Of Rankings
            </Link>
            <Link href="/compare/" style={{
              display: 'inline-block', padding: '0.6rem 1.25rem',
              background: '#204051', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
            }}>
              Compare Towns
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const GUIDE_TOWNS = [
  'missoula', 'bozeman', 'billings', 'great-falls', 'helena', 'butte',
  'kalispell', 'whitefish', 'livingston', 'hamilton', 'belgrade', 'columbia-falls',
  'polson', 'bigfork', 'big-sky', 'red-lodge', 'dillon', 'miles-city',
  'havre', 'sidney', 'lewistown', 'anaconda', 'big-timber', 'ennis',
  'west-yellowstone', 'gardiner',
];

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (f: string) => {
    const p = path.join(dataDir, f);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };
  const townData = load('town-data.json');
  const housing = load('town-housing.json');
  const recreation = load('town-recreation.json');

  const guides: GuideLink[] = GUIDE_TOWNS
    .filter(s => townData[s])
    .map(s => {
      const td = townData[s];
      const h = housing[s] || {};
      const rec = recreation[s]?.places || [];
      const hv = h.zillowHomeValue ?? h.medianHomeValue;
      return {
        slug: `moving-to-${s}-montana`,
        townName: td.name,
        population: td.population || 0,
        homeValue: hv ? '$' + hv.toLocaleString() : '—',
        recCount: rec.length,
      };
    })
    .sort((a, b) => b.population - a.population);

  return { props: { guides } };
};
