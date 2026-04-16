import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import AppInstallCTA from '../../components/AppInstallCTA';

const RANKINGS = [
  { slug: 'most-affordable-towns', title: '10 Most Affordable Towns', icon: '💰', description: 'Where your dollar goes furthest in Big Sky Country. Ranked by home prices, rent, and price-to-income ratio.' },
  { slug: 'best-outdoor-recreation', title: '10 Best Towns for Outdoor Recreation', icon: '🏔️', description: 'The ultimate outdoor adventure towns, scored by trails, parks, rivers, ski areas, and wilderness access.' },
  { slug: 'best-ski-towns', title: '10 Best Ski Towns', icon: '⛷️', description: 'Montana\'s premier mountain communities for powder chasers. Ranked by distance to the nearest ski area.' },
  { slug: 'best-fishing-towns', title: '10 Best Towns for Fly Fishing', icon: '🎣', description: 'Where world-class trout water is minutes away. Ranked by rivers, fishing access, and lakes.' },
  { slug: 'towns-near-hot-springs', title: '10 Best Towns Near Hot Springs', icon: '♨️', description: 'Soak in Montana\'s natural geothermal waters. Ranked by proximity to hot springs.' },
  { slug: 'best-small-towns', title: '10 Best Small Towns', icon: '🏡', description: 'Charming communities under 5,000 people with big character and stunning scenery.' },
  { slug: 'best-towns-near-glacier-yellowstone', title: '10 Best Towns Near Glacier & Yellowstone', icon: '🦌', description: 'Gateway communities to America\'s most iconic national parks.' },
  { slug: 'best-towns-for-retirees', title: '10 Best Towns for Retirees', icon: '🌅', description: 'Combining affordability, mild climate, recreation, and quality of life for your golden years.' },
  { slug: 'best-climate', title: '10 Towns with the Best Climate', icon: '☀️', description: 'Where Montana\'s winters are (relatively) gentle. Ranked by temperature, snowfall, and sunshine.' },
  { slug: 'best-towns-for-families', title: '10 Best Towns for Families', icon: '👨‍👩‍👧‍👦', description: 'Top schools, safe communities, strong job markets, and family-friendly recreation. Where Montana families thrive.' },
  { slug: 'best-towns-for-young-professionals', title: '10 Best Towns for Young Professionals', icon: '💼', description: 'Low unemployment, strong labor markets, and unbeatable quality of life. Build your career in Big Sky Country.' },
  { slug: 'best-housing-availability', title: '10 Towns with Best Housing Availability', icon: '🏘️', description: 'Where you can actually find a home to buy. Ranked by current inventory, vacancy rates, and market activity.' },
  { slug: 'best-towns-for-digital-nomads', title: '10 Best Towns for Digital Nomads', icon: '💻', description: 'Top Montana towns for remote workers: ranked by internet infrastructure, airport access, affordability, recreation, and quality of life.' },
];

export default function BestOfIndex() {
  const url = 'https://treasurestate.com/best-of/';
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Best Of Montana', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Best of Montana: Town Rankings & Guides',
    description: 'Data-driven rankings of Montana\'s best towns for recreation, affordability, skiing, fishing, families, retirees, and more.',
    url,
  };

  return (
    <>
      <Head>
        <title>Best of Montana: Town Rankings & Guides | Treasure State</title>
        <meta name="description" content="Data-driven rankings of Montana's best towns for recreation, affordability, skiing, fishing, families, retirees, and more. Find your perfect Montana community." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Best of Montana: Town Rankings & Guides" />
        <meta property="og:description" content="Data-driven rankings of Montana's best towns. Find your perfect community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best of Montana: Town Rankings & Guides" />
        <meta name="twitter:description" content="Data-driven rankings of Montana's best towns. Find your perfect community." />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero
        title="Best of Montana"
        subtitle="Data-Driven Rankings to Help You Find Your Perfect Montana Community"
        image="/images/hero-image.jpg"
        alt="Best of Montana town rankings"
        small
      />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333', marginBottom: '2rem' }}>
          Whether you're planning a visit, considering a move, or just curious about Montana's communities,
          our rankings use real data: Census housing figures, Zillow home values, climate records, and
          2,500+ mapped recreation sites to help you discover the best Montana has to offer.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {RANKINGS.map(r => (
            <Link key={r.slug} href={`/best-of/${r.slug}/`} style={{
              display: 'block', padding: '1.25rem', background: '#fff',
              borderRadius: '10px', border: '1px solid #e8ede8', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{r.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#204051', marginBottom: '0.4rem' }}>
                {r.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#666', lineHeight: 1.5 }}>
                {r.description}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 500, marginTop: '0.6rem' }}>
                View Rankings →
              </div>
            </Link>
          ))}
        </div>

        <div style={{ maxWidth: '480px', margin: '2.5rem auto 0' }}>
          <AppInstallCTA
            variant="card"
            headline="Never Miss a Montana Landmark"
            body="Get alerted to historic sites, hot springs, and trails as you drive through Montana."
          />
        </div>

        <div style={{
          marginTop: '2.5rem', padding: '1.25rem', background: '#f8faf8',
          borderRadius: '8px', border: '1px solid #e8ede8', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '0.95rem', color: '#204051', marginTop: 0 }}>Can't Decide?</h3>
          <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1rem' }}>
            Use our comparison tool to stack any two Montana towns side by side.
          </p>
          <Link href="/compare/" style={{
            display: 'inline-block', padding: '0.6rem 1.25rem',
            background: '#3b6978', color: '#fff', borderRadius: '6px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
          }}>
            Compare Towns →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
