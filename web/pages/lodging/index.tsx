import Head from 'next/head';
import { GetStaticProps } from 'next';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import { readLodgingIndex } from '../../lib/lodging';

type Props = {
  title: string;
  contentHtml: string;
};

const LODGING_URL = 'https://treasurestate.com/lodging/';

export default function LodgingIndex({ title, contentHtml }: Props) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lodging', url: '/lodging/' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Where to Stay in Montana — Lodging Guide by Town',
    description: 'Find hotels, B&Bs, cabins, and vacation rentals across Montana. Town-by-town lodging guides with Expedia and VRBO links.',
    url: LODGING_URL,
  };

  return (
    <>
      <Head>
        <title>Where to Stay in Montana — Hotels, Cabins & B&Bs by Town | Treasure State</title>
        <meta
          name="description"
          content="Find the best hotels, B&Bs, cabins, and vacation rentals in Montana. Town-by-town guides with price ranges, traveler tips, and links to Expedia and VRBO."
        />
        <link rel="canonical" href={LODGING_URL} />
        <meta property="og:title" content="Where to Stay in Montana — Lodging Guide by Town" />
        <meta property="og:description" content="Find hotels, B&Bs, cabins, and vacation rentals across Montana. Town-by-town guides with Expedia and VRBO links." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={LODGING_URL} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Where to Stay in Montana — Lodging Guide by Town" />
        <meta name="twitter:description" content="Find hotels, B&Bs, cabins, and vacation rentals across Montana." />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero title="Where to Stay in Montana" subtitle="Lodging Guide by Town" image="/images/hero-image.jpg" alt="Montana lodging" small />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .lodging-content table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 1rem 0; }
          .lodging-content table th, .lodging-content table td { padding: 0.5rem 0.75rem; border: 1px solid #e8ede8; text-align: left; }
          .lodging-content table th { background: #f8faf8; font-weight: 600; color: #204051; }
          .lodging-content h2 { font-size: 1.25rem; color: #204051; margin: 1.5rem 0 0.75rem; }
          .lodging-content h3 { font-size: 1.1rem; color: #204051; margin: 1.25rem 0 0.5rem; }
          .lodging-content p { margin: 0 0 1rem; line-height: 1.7; color: #444; }
          .lodging-content a { color: #3b6978; text-decoration: none; }
          .lodging-content a:hover { text-decoration: underline; }
        ` }} />
        <article className="lodging-content content-section" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await readLodgingIndex();
  if (!data) return { notFound: true };
  return { props: { title: data.title, contentHtml: data.contentHtml } };
};
