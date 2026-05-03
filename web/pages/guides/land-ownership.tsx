import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import LandLegend from '../../components/LandLegend';
import LandOwnershipInfo, { type LandFaq, type LandOwnershipStatsPayload } from '../../components/LandOwnershipInfo';

const LandOwnershipMap = dynamic(() => import('../../components/LandOwnershipMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 560,
        borderRadius: 12,
        background: '#f0f6f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5a7582',
        fontSize: '0.9rem',
        marginBottom: '1.25rem',
      }}
    >
      Loading Montana cadastral map…
    </div>
  ),
});

type HuntingAreaLite = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category: string;
};

type Props = {
  huntingMarkers: HuntingAreaLite[];
  stats: LandOwnershipStatsPayload;
};

const FAQS: LandFaq[] = [
  {
    question: 'Is Montana cadastral data accurate enough for surveying or deeds?',
    answer:
      'No. Montana State Library explicitly states MSDI Cadastral is for informational use only—not for legal, engineering, or surveying purposes. Parcel geometry can lag deeds, split lots, exempt transfers, or rural fence lines.',
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
    question: 'How often is the cadastral data updated?',
    answer:
      'Montana parcels are maintained on a statewide monthly cadastral cycle mirrored on the State Library GIS services plus FTP snapshots. Operational delays can still occur; cross-check parcels you care about directly in Montana Cadastral or county assessor GIS.',
  },
  {
    question: 'Why keep parcel linework toggled off by default?',
    answer:
      'Statewide parcel rendering is heavier than thematic public-lands overlays. Showing parcels only once you zoom in keeps the Treasure State viewer responsive while you pan across Montana on phones and laptops.',
  },
];

export default function LandOwnershipGuide({ huntingMarkers, stats }: Props) {
  const url = 'https://treasurestate.com/guides/land-ownership/';
  const title = 'Montana Land Ownership Map & GIS Guide';
  const desc =
    'Interactive MSDI Cadastral map for Montana public lands, conservation easements, parcel boundaries, PLSS township grid, FTP downloads, hunter access reminders, plus links to statewide Montana Cadastral and FWP tools.';

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
          content="Montana land ownership, Montana cadastral map, MSDI parcels, Montana public lands GIS, DNRC trust land recreation, hunter access Montana, Treasure State GIS"
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
        subtitle={`MSDI cadastral layers · ${huntingMarkers.length} hunting guide pins · DNRC/FWP checkpoints`}
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
        .guide-cta { text-align: center; margin-top: 2.5rem; }
        .guide-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .guide-cta-primary { background: #3b6978; color: #fff; }
        .guide-cta-secondary { background: #f0f7fa; color: #3b6978; border: 2px solid #3b6978; }
      `,
        }}
      />

      <main className="guide-page">
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.25rem' }}>
          Explore Montana&rsquo;s statewide cadastral themes as published by the{' '}
          <a href="https://msl.mt.gov/geoinfo/msdi/cadastral/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
            Montana State Library MSDI Program
          </a>
          . Toggle public lands, conservation easements, parcel linework, and the PLSS grid while cross-referencing the same{' '}
          <Link href="/guides/hunting-guide/" style={{ color: '#3b6978', fontWeight: 600 }}>
            public hunting overlays
          </Link>{' '}
          that power our elk, deer, and bird hunting playbook.
        </p>

        <LandLegend />

        <h2 id="interactive-map" className="guide-section-title" style={{ marginTop: '1rem' }}>
          Interactive MSDI Cadastral map
        </h2>
        <LandOwnershipMap height="560px" huntingMarkers={huntingMarkers} />

        <LandOwnershipInfo stats={stats} faqs={FAQS} />

        <div className="guide-cta">
          <Link href="/guides/hunting-guide/" className="guide-cta-primary">
            Montana Hunting Guide
          </Link>
          <Link href="/guides/fly-fishing-guide/" className="guide-cta-secondary">
            Fly Fishing Guide
          </Link>
          <Link href="/guides/wildlife-guide/" className="guide-cta-secondary">
            Wildlife Guide
          </Link>
          <Link href="/planners/" className="guide-cta-secondary">
            Trip Planners Hub
          </Link>
          <Link href="/montana-towns" className="guide-cta-secondary">
            Browse All Towns
          </Link>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem', lineHeight: 1.5 }}>
          Map base layer © Mapbox. Cadastral rasters courtesy Montana Spatial Data Infrastructure and Montana Fish, Wildlife &amp; Parks-linked reference materials cited above—always defer to landowners, statutes, signage,{' '}
          <a href="https://svc.mt.gov/msl/cadastral/" target="_blank" rel="noopener noreferrer" style={{ color: '#555' }}>
            svc.mt.gov cadastral
          </a>
          , and official regulations before recreating.
        </p>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  const areasRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'hunting-areas.json'), 'utf8')) as {
    name: string;
    slug: string;
    lat: number;
    lng: number;
    category: string;
  }[];

  const huntingMarkers: HuntingAreaLite[] = areasRaw.map((a) => ({
    name: a.name,
    slug: a.slug,
    lat: a.lat,
    lng: a.lng,
    category: a.category,
  }));

  const stats: LandOwnershipStatsPayload = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'land-ownership-stats.json'), 'utf8'),
  );

  return { props: { huntingMarkers, stats } };
};
