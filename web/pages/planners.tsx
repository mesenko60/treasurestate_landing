import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StaysCTA from '../components/StaysCTA';
import Footer from '../components/Footer';

export default function Planners() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/planners/" />
        <title>Montana Travel Planners & Guides - Treasure State</title>
        <meta name="description" content="Plan your perfect Montana adventure with our comprehensive travel planners, scenic routes, and thematic guides." />
        <meta property="og:title" content="Montana Travel Planners & Guides - Treasure State" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/planners/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />
      <Hero
        title="Montana Travel Planners"
        subtitle="Plan your perfect Montana adventure"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape - The Treasure State"
        small
      />
      <main>
        <section className="content-section" style={{ textAlign: 'center' }}>
          <h2>Thematic Travel Guides</h2>
          <p>Explore Montana through our curated travel guides designed to help you discover the state's most unique destinations and experiences.</p>
          
          <div className="planners-grid">
            <Link href="/planners/montana-backroads" style={{ textDecoration: 'none' }}>
              <div className="planner-card">
                <h3>Montana's Backroads</h3>
                <p>Discover the hidden gems of Big Sky Country with our guide to Montana's best backroads, scenic byways, and off-the-beaten-path adventures.</p>
                <span className="waitlist-btn" style={{ marginTop: '1rem' }}>Read Guide</span>
              </div>
            </Link>

            <Link href="/planners/hot-springs-guide" style={{ textDecoration: 'none' }}>
              <div className="planner-card">
                <h3>Hot Springs Guide</h3>
                <p>A comprehensive guide to the best natural and developed geothermal hot springs across Montana. Relax and soak in the Treasure State.</p>
                <span className="waitlist-btn" style={{ marginTop: '1rem' }}>Read Guide</span>
              </div>
            </Link>

            <Link href="/planners/campgrounds-guide" style={{ textDecoration: 'none' }}>
              <div className="planner-card">
                <h3>Campgrounds &amp; RV Parks</h3>
                <p>Directory of 100+ campgrounds and RV parks across Montana — KOAs, state parks, national forest sites, and private camps with ratings and contact info.</p>
                <span className="waitlist-btn" style={{ marginTop: '1rem' }}>Read Guide</span>
              </div>
            </Link>

            <Link href="/planners/hiking-guide" style={{ textDecoration: 'none' }}>
              <div className="planner-card">
                <h3>Hiking Trails &amp; Trailheads</h3>
                <p>60+ hiking destinations across Montana — Glacier National Park trails, state park hikes, waterfall treks, and community trailheads with ratings and directions.</p>
                <span className="waitlist-btn" style={{ marginTop: '1rem' }}>Read Guide</span>
              </div>
            </Link>
          </div>
        </section>
        <StaysCTA />
      </main>
      <Footer />
    </>
  );
}
