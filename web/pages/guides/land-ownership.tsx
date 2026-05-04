import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import LandOwnershipInfo, { type LandFaq, type LandOwnershipStatsPayload } from '../../components/LandOwnershipInfo';

type Props = {
  stats: LandOwnershipStatsPayload;
};

const FAQS: LandFaq[] = [
  {
    question: 'Is Montana parcel GIS accurate enough for surveying or deeds?',
    answer:
      'No. Montana State Library states its statewide parcel and public lands GIS—the MSDI Cadastral parcel program—is for informational use only—not for legal, engineering, or surveying purposes. Polygon boundaries can lag deeds, split lots, exempt transfers, or rural fence lines.',
  },
  {
    question: 'Does mapped public land guarantee I can hunt or camp there?',
    answer:
      'Separate rules apply for Wilderness, national parks, grazing closures, firearm restrictions, motorized travel, closures for wildfire safety, leased state trust parcels, tribal boundaries, nuances of enrolled Block Management parcels, conservation easements, and local ordinances.',
  },
  {
    question: 'What is shown in the Conservation Easements layer?',
    answer:
      'MSL maps easements voluntarily recorded between landowners and qualifying agencies or land trusts on private parcels. Showing an easement does not grant public recreation rights—consult the steward organization for permissible uses.',
  },
  {
    question: 'How often are Montana parcel records updated?',
    answer:
      'Montana parcels are maintained on roughly a monthly statewide GIS cycle mirrored on State Library MapServer services plus FTP snapshots. Operational delays still happen; verify parcels that matter on the Montana Cadastral GIS viewer or your county assessor map.',
  },
  {
    question: 'Why keep parcel linework toggled off by default?',
    answer:
      'Statewide parcel rendering is heavier than thematic public-lands overlays. Showing parcels only once you zoom in keeps the Treasure State viewer responsive while you pan across Montana on phones and laptops.',
  },
];

export default function LandOwnershipGuide({ stats }: Props) {
  const url = 'https://treasurestate.com/guides/land-ownership/';
  const title = 'Interactive Montana Land Ownership Map (Parcels, Public Lands & GIS)';
  const desc =
    'Interactive Montana land ownership map with a built-in steward-color legend plus Montana State Library GIS tiles: parcels, conservation easements, public land classifications, township grid / PLSS, and links to the Montana Cadastral GIS viewer and FWP Hunt Planner — informational only.';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/guides/' },
    { name: 'Land Ownership', url },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: '2026-05-03T00:00:00-06:00',
    dateModified: '2026-05-03T00:00:00-06:00',
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta
          name="keywords"
          content="Montana land ownership map, parcel GIS legend, steward color key, Montana public lands map, property boundaries GIS, PLSS township grid, Treasure State GIS, conservation easements, Montana Cadastral viewer"
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <Header />
      <Hero
        title="Montana Land Ownership &amp; GIS"
        subtitle="Montana State Library GIS (parcels &amp; public lands) — informational only"
        image="/images/hero-image.jpg"
        alt="Montana landscape from above illustrating public lands and towns"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .guide-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .guide-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .guide-content p { font-size: 0.95rem; line-height: 1.7; color: #444; margin: 0.75rem 0; }
        .guide-disclaimer { background: #fffbf0; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
        .guide-disclaimer h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .guide-disclaimer p, .guide-disclaimer li { font-size: 0.9rem; color: #555; line-height: 1.6; }
      `,
        }}
      />

      <main className="guide-page">
        <h2 id="interactive-map" className="guide-section-title" style={{ marginTop: '1rem' }}>
          Interactive Montana land ownership map
        </h2>
        <div
          style={{
            marginBottom: '1.75rem',
            padding: '1.35rem 1.5rem',
            borderRadius: 12,
            border: '1px solid #d4e4ec',
            background: 'linear-gradient(165deg, #f6fbfc 0%, #eef6f9 100%)',
          }}
        >
          <p style={{ margin: '0 0 0.85rem', fontSize: '0.98rem', lineHeight: 1.65, color: '#344850' }}>
            Open the full-screen Montana map with Topo / Satellite / Hybrid basemaps, optional 3D terrain (Mapbox elevation),
            steward-colored public lands, parcels, conservation easements, PLSS grid, and hunting pins — same MSDI layers as before,
            optimized for phones and desktops.
          </p>
          <Link
            href="/map/"
            style={{
              display: 'inline-block',
              padding: '0.72rem 1.35rem',
              borderRadius: 10,
              background: '#3b6978',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              fontFamily: 'var(--font-primary, sans-serif)',
            }}
          >
            Open full Montana map →
          </Link>
        </div>

        <LandOwnershipInfo stats={stats} faqs={FAQS} />
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');

  const stats: LandOwnershipStatsPayload = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'land-ownership-stats.json'), 'utf8'),
  );

  return { props: { stats } };
};
