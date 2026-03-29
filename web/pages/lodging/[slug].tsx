import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import { readLodgingPage, getLodgingSlugs } from '../../lib/lodging';
import { schemaTypeFromLodgingType, type LodgingAccommodation } from '../../lib/lodging-schema';

type Props = {
  slug: string;
  townName: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  accommodations: LodgingAccommodation[];
};

export default function LodgingTownPage({ slug, townName, title, contentHtml, excerpt: _excerpt, accommodations }: Props) {
  const url = `https://treasurestate.com/lodging/${slug}/`;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lodging', url: '/lodging/' },
    { name: `Where to Stay in ${townName}`, url: `/lodging/${slug}/` },
  ];

  const metaTitle = `Where to Stay in ${townName}, Montana — Hotels, Cabins & B&Bs`;
  const metaDescription =
    `Find the best hotels, B&Bs, cabins, and vacation rentals in ${townName}, Montana. Compare properties, read booking tips, and check current rates on Expedia and VRBO.`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: metaTitle,
    description: metaDescription,
    url,
  };

  const lodgingSchemas = accommodations.map((a) => ({
    '@context': 'https://schema.org',
    '@type': schemaTypeFromLodgingType(a.type),
    name: a.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: townName,
      addressRegion: 'MT',
      addressCountry: 'US',
    },
    ...(a.location && { description: `Located in ${a.location}, ${townName}, Montana` }),
    ...(a.priceRange && { priceRange: a.priceRange }),
    ...(a.url && { url: a.url }),
  }));

  return (
    <>
      <Head>
        <title>{`${metaTitle} | Treasure State`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        {lodgingSchemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
        ))}
      </Head>
      <Header />
      <Hero
        title={`Where to Stay in ${townName}`}
        subtitle="Hotels, B&Bs, Cabins & Vacation Rentals"
        image="/images/hero-image.jpg"
        alt={`Lodging in ${townName}, Montana`}
        small
      />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getLodgingSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug);
  const data = await readLodgingPage(slug);
  if (!data) return { notFound: true };
  return {
    props: {
      slug: data.slug,
      townName: data.townName,
      title: data.title,
      contentHtml: data.contentHtml,
      excerpt: data.excerpt,
      accommodations: data.accommodations,
    },
  };
};
