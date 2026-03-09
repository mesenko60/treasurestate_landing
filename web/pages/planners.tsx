import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function Planners() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/planners/" />
        <title>Montana Trip Planner — Interactive Backroads Map | Treasure State</title>
        <meta name="description" content="Plan your Montana road trip with our interactive backroads planner — 13 scenic corridors, 850+ points of interest, and trip-building tools." />
        <meta property="og:title" content="Montana Trip Planner — Interactive Backroads Map" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/planners/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />
      <Hero
        title="Montana Trip Planner"
        subtitle="Plan your perfect Montana road trip"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape"
        small
      />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
        <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#204051', marginBottom: '0.75rem' }}>Backroads Travel Planner</h2>
          <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Our full-page interactive map lets you explore 13 scenic corridors and 850+ points of
            interest across Montana. Build your route, discover hidden gems, and plan your road trip.
          </p>
          <Link
            href="/planners/backroads-planner"
            style={{
              display: 'inline-block', padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #1a1e2e, #2d3348)', color: '#fff',
              borderRadius: '8px', textDecoration: 'none', fontWeight: 700,
              fontSize: '1.05rem', border: '2px solid #3b82f6',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Open Trip Planner &rarr;
          </Link>
        </section>

        <section style={{
          padding: '1.5rem', background: '#f8faf8', borderRadius: '10px',
          border: '1px solid #e8ede8', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#204051', marginTop: 0, marginBottom: '0.5rem' }}>
            Looking for Travel Guides?
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            Skiing, fly fishing, hiking, hunting, state parks, wildlife viewing, and more &mdash;
            browse all our Montana travel and relocation guides.
          </p>
          <Link
            href="/guides"
            style={{
              display: 'inline-block', padding: '0.7rem 1.5rem',
              background: '#3b6978', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
            }}
          >
            Browse All Guides &rarr;
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
