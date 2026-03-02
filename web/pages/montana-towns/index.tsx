import Head from 'next/head';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import TownDirectory from '../../components/TownDirectory';
import { getTownList } from '../../lib/towns';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const basicTowns = getTownList();
  let coordinates: Record<string, any> = {};
  
  try {
    const coordsPath = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
    if (fs.existsSync(coordsPath)) {
      coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load coordinates", e);
  }

  const towns = basicTowns.map(t => {
    const coords = coordinates[t.slug];
    return {
      ...t,
      lat: coords?.lat || null,
      lng: coords?.lng || null
    };
  });

  return { props: { towns } };
}

export default function TownsIndex({ towns }: { towns: any[] }) {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/montana-towns/" />
        <title>Montana Cities and Towns - Treasure State</title>
        <meta name="description" content="Browse Montana cities and towns. Find guides, things to do, and lodging." />
        <meta property="og:title" content="Montana Cities and Towns - Treasure State" />
        <meta property="og:description" content="Browse Montana cities and towns. Find guides, things to do, and lodging." />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/montana-towns/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Montana Cities and Towns - Treasure State" />
        <meta name="twitter:description" content="Browse Montana cities and towns. Find guides, things to do, and lodging." />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />
      <Hero title="Montana Cities and Towns" subtitle="Explore communities across Big Sky Country" image="/images/hero-image.jpg" alt="Montana" small />
      <main>
        <section className="content-section">
          <h2>All Towns</h2>
          <TownDirectory towns={towns} />
        </section>
      </main>
      <Footer />
    </>
  );
}
