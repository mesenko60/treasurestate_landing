import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { getTownList } from '../lib/towns';

export async function getStaticProps() {
  const towns = getTownList();
  return { props: { towns } };
}

export default function TownsIndex({ towns }: { towns: { name: string; slug: string }[] }) {
  return (
    <>
      <Head>
        <title>Montana Cities and Towns - Treasure State</title>
        <meta name="description" content="Browse Montana cities and towns. Find guides, things to do, and lodging." />
      </Head>
      <Header />
      <Hero title="Montana Cities and Towns" subtitle="Explore communities across Big Sky Country" image="/images/hero-image.jpg" alt="Montana" small />
      <main>
        <section className="content-section">
          <h2>All Towns</h2>
          <div className="towns-grid">
            {towns.map((t) => (
              <Link key={t.slug} href={`/montana-towns/${t.slug}/`}>
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
