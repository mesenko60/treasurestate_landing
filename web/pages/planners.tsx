import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AffiliateBanner from '../components/AffiliateBanner';
import Footer from '../components/Footer';

export default function Planners() {
  return (
    <>
      <Head>
        <title>Montana Travel Planners & Guides - Treasure State</title>
        <meta name="description" content="Plan your perfect Montana adventure with our comprehensive travel planners, scenic routes, and thematic guides." />
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
          </div>
        </section>
        <AffiliateBanner />
      </main>
      <Footer />
    </>
  );
}
