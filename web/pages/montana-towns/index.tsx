import Head from 'next/head';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import TownDirectory from '../../components/TownDirectory';
import { getTownList } from '../../lib/towns';
import { clusterConfigs } from '../../components/town/cluster-data';
import fs from 'fs';
import path from 'path';

function loadJson(filePath: string): Record<string, any> {
  try {
    const full = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(full)) return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch { /* ignore */ }
  return {};
}

const HUB_TAGLINES: Record<string, string> = {
  missoula: 'The Garden City',
  bozeman: 'College town & outdoor hub',
  kalispell: 'Gateway to Glacier',
  whitefish: 'Mountain resort town',
  helena: 'State capital',
  billings: "Montana's largest city",
  'great-falls': 'The Electric City',
  butte: 'The Richest Hill on Earth',
  livingston: 'Gateway to Yellowstone',
  'red-lodge': 'Beartooth Highway gateway',
  hamilton: "Bitterroot Valley — Montana's Banana Belt",
  'west-yellowstone': 'Yellowstone west entrance',
  'big-sky': 'Mountain resort destination',
  'miles-city': 'Cow Capital of Montana',
  polson: 'Flathead Lake gateway',
  dillon: 'Blue-ribbon fishing & frontier heritage',
  'columbia-falls': 'Gateway to Glacier National Park',
  anaconda: 'Copper heritage & Pintler wilderness',
  bigfork: 'Flathead Lake arts village',
  'deer-lodge': 'Frontier ranching heritage & prison history',
  'three-forks': 'Birthplace of the Missouri River',
  choteau: 'Rocky Mountain Front & dinosaur country',
  libby: 'Kootenai Falls & Cabinet Mountains gateway',
  lewistown: 'Geographic center of Montana',
  glendive: 'Badlands, dinosaurs & paddlefish',
  hardin: 'Little Bighorn & Crow country',
};

export async function getStaticProps() {
  const basicTowns = getTownList();
  const coordinates = loadJson('data/town-coordinates.json');
  const townData = loadJson('data/town-data.json');
  const nicknames = loadJson('data/town-nicknames.json');

  const hubSlugs = new Set(Object.keys(clusterConfigs));

  const towns = basicTowns.map(t => {
    const coords = coordinates[t.slug];
    const data = townData[t.slug];
    const isHub = hubSlugs.has(t.slug);
    return {
      ...t,
      lat: coords?.lat || null,
      lng: coords?.lng || null,
      population: data?.population || null,
      region: data?.region || null,
      nickname: nicknames[t.slug] || null,
      isHub,
      hubTagline: isHub ? (HUB_TAGLINES[t.slug] || null) : null,
      hubGuideCount: isHub ? clusterConfigs[t.slug].guides.length : 0,
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
      <Hero title="Montana Cities and Towns" subtitle="Explore communities across Big Sky Country" image="/images/hero-image.jpg" alt="Montana cities and towns directory" small />
      <main style={{ position: 'relative', marginTop: '-15px', zIndex: 1 }}>
        <section className="content-section">
          <TownDirectory towns={towns} />
        </section>
      </main>
      <Footer />
    </>
  );
}
