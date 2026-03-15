import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

const DirectoryMap = dynamic(() => import('../../components/DirectoryMap'), { ssr: false });

/* ─── Types ────────────────────────────────────────── */

type StatePark = {
  name: string;
  slug: string;
  category: string;
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  description: string;
  acreage: number;
  county: string;
  established: number;
  camping: boolean;
  campsites: number;
  reservable: boolean;
  dayUseFeeNR: number;
  dayUseFeeMT: number;
  activities: string[];
  website: string;
  phone: string;
  address: string;
  accessibleFacilities: boolean;
  petFriendly: boolean;
  notes: string;
};

type Props = {
  parks: StatePark[];
  contentHtml: string;
};

/* ─── Constants ────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  badlands: '#a0522d',
  cave: '#4a4a4a',
  'ghost-town': '#8b6914',
  archaeology: '#7a6b3d',
  history: '#6b4423',
  natural: '#5a8a5c',
  island: '#2e86ab',
  wildlife: '#d4760a',
  reservoir: '#3b6978',
  'float-trip': '#1a5276',
  canyon: '#8b4513',
  cultural: '#6c3483',
};

const CATEGORY_LABELS: Record<string, string> = {
  badlands: 'Badlands',
  cave: 'Cave',
  'ghost-town': 'Ghost Town',
  archaeology: 'Archaeology',
  history: 'History',
  natural: 'Natural Area',
  island: 'Island',
  wildlife: 'Wildlife',
  reservoir: 'Reservoir',
  'float-trip': 'Float Trip',
  canyon: 'Canyon',
  cultural: 'Cultural',
};

const ACTIVITY_LABELS: Record<string, string> = {
  hiking: 'Hiking',
  camping: 'Camping',
  fishing: 'Fishing',
  photography: 'Photography',
  picnicking: 'Picnicking',
  stargazing: 'Stargazing',
  'mountain-biking': 'Mountain Biking',
  archery: 'Archery',
  'disc-golf': 'Disc Golf',
  'fossil-viewing': 'Fossil Viewing',
  'cave-tours': 'Cave Tours',
  'wildlife-viewing': 'Wildlife Viewing',
  'ghost-town-exploration': 'Ghost Town Exploration',
  history: 'History',
  'rock-art-viewing': 'Rock Art Viewing',
  archaeology: 'Archaeology',
  kayaking: 'Kayaking',
  birdwatching: 'Birdwatching',
  'springs-viewing': 'Springs Viewing',
  walking: 'Walking',
  boating: 'Boating',
  'waterfall-viewing': 'Waterfall Viewing',
  'cultural-interpretation': 'Cultural Interpretation',
  'interpretive-exhibits': 'Interpretive Exhibits',
  'interpretive-signs': 'Interpretive Signs',
  geology: 'Geology',
  'float-trip': 'Float Trip',
  'fly-fishing': 'Fly Fishing',
  waterskiing: 'Waterskiing',
  swimming: 'Swimming',
};

function fmt(n: number) { return n.toLocaleString(); }

/* ─── Area Card ────────────────────────────────────── */

function AreaCard({ a }: { a: StatePark }) {
  const color = CATEGORY_COLORS[a.category] || '#3b6978';
  return (
    <div id={a.slug} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#204051' }}>{a.name}</h3>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {CATEGORY_LABELS[a.category] || a.category}
        </span>
      </div>
      <div style={{ padding: '0.5rem 1.25rem 1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{a.description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.85rem', color: '#555' }}>
          <div><strong>County:</strong> {a.county}</div>
          <div><strong>Acreage:</strong> {fmt(a.acreage)}</div>
          <div><strong>Established:</strong> {a.established}</div>
          <div><strong>Camping:</strong> {a.camping ? `Yes — ${a.campsites} sites` : 'No'}</div>
          <div><strong>Fee:</strong> {a.dayUseFeeNR > 0 ? `$${a.dayUseFeeNR} NR` : 'Free'} / {a.dayUseFeeMT > 0 ? `$${a.dayUseFeeMT} MT` : 'Free MT'}</div>
          <div><strong>Reservable:</strong> {a.reservable ? 'Yes' : 'No'}</div>
          <div><strong>Accessible:</strong> {a.accessibleFacilities ? 'Yes' : 'No'}</div>
          <div><strong>Pet Friendly:</strong> {a.petFriendly ? 'Yes' : 'No'}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
          {a.activities.slice(0, 8).map(act => (
            <span key={act} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f0f7fa', border: '1px solid #d4e4ec', borderRadius: '4px', color: '#3b6978' }}>
              {ACTIVITY_LABELS[act] || act.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          ))}
          {a.activities.length > 8 && (
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#999' }}>+{a.activities.length - 8} more</span>
          )}
        </div>
        {a.notes && (
          <p style={{ fontSize: '0.82rem', color: '#8a6d3b', background: '#fffbf0', borderLeft: '3px solid #d8973c', padding: '0.5rem 0.75rem', margin: '0.75rem 0 0', borderRadius: '0 4px 4px 0' }}>
            {a.notes}
          </p>
        )}
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <Link href={`/montana-towns/${a.nearestTown}/`} style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}>
            {a.nearestTownName} Town Profile →
          </Link>
          {a.website && (
            <a href={a.website} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>FWP Website →</a>
          )}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', textDecoration: 'none', fontWeight: 600 }}>
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Component ───────────────────────────────── */

export default function StateParksGuide({ parks, contentHtml }: Props) {
  const url = 'https://treasurestate.com/guides/state-parks-guide/';
  const title = 'Montana State Parks Guide';
  const desc = `Montana's state parks — from Makoshika's badlands to the Smith River float corridor. Camping, fees, activities, and directions for ${parks.length} parks.`;

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/guides/' },
    { name: 'State Parks Guide', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much do Montana state parks cost to visit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Montana residents who pay the $9/year state parks fee at vehicle registration enter all parks free. Nonresident vehicles pay $8 per day at most parks. A $60 annual pass covers unlimited nonresident day-use access.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you camp in Montana state parks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${parks.filter(p => p.camping).length} of the ${parks.length} parks featured here offer camping, with a total of ${parks.reduce((sum, p) => sum + p.campsites, 0)}+ campsites. Some are reservable; others are first-come, first-served.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What is the largest state park in Montana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Makoshika State Park near Glendive is Montana\'s largest state park at 11,634 acres. It features badlands formations and Triceratops and T. rex fossil sites.',
        },
      },
    ],
  };

  const filteredParks = parks.filter(a => {
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(parks.map(a => a.category)));

  const campingCount = parks.filter(p => p.camping).length;
  const totalSites = parks.reduce((sum, p) => sum + p.campsites, 0);

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content="Montana's state parks — from Makoshika's badlands to the Smith River float corridor. Camping, fees, activities, and directions." />
        <meta name="keywords" content="Montana state parks, Montana camping, Makoshika State Park, Lewis and Clark Caverns, Bannack ghost town, Smith River float, Montana FWP, Montana parks guide" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <Header />
      <Hero
        title="Montana State Parks Guide"
        subtitle={`${parks.length} state parks · ${campingCount} with camping · ${totalSites}+ campsites`}
        image="/images/hero-image.jpg"
        alt="Montana state park landscape"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .guide-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .guide-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .guide-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .guide-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
        .guide-chip { font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 999px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-family: var(--font-primary); transition: all 0.15s; color: #555; }
        .guide-chip:hover { border-color: #3b6978; color: #3b6978; }
        .guide-chip--active { background: #3b6978; color: #fff; border-color: #3b6978; }
        .guide-disclaimer { background: #fff8e1; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
        .guide-disclaimer h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .guide-disclaimer p, .guide-disclaimer li { font-size: 0.9rem; color: #555; line-height: 1.6; }
        .guide-disclaimer ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
        .guide-cta { text-align: center; margin-top: 2.5rem; }
        .guide-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .guide-cta-primary { background: #3b6978; color: #fff; }
        .guide-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        .guide-content h2 { font-family: var(--font-primary); font-size: 1.3rem; color: #204051; margin: 2rem 0 0.5rem; }
        .guide-content h3 { font-family: var(--font-primary); font-size: 1.1rem; color: #3b6978; margin: 1.5rem 0 0.4rem; }
        .guide-content p { font-size: 0.95rem; color: #444; line-height: 1.7; margin: 0 0 1rem; }
        .guide-content table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 0.75rem 0 1.25rem; }
        .guide-content th { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 2px solid #e0e0e0; color: #666; font-weight: 600; }
        .guide-content td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #f0f0f0; }
        .guide-content a { color: #3b6978; }
        .guide-content ul, .guide-content ol { padding-left: 1.25rem; margin: 0 0 1rem; }
        .guide-content li { font-size: 0.95rem; color: #444; line-height: 1.7; margin-bottom: 0.25rem; }
        .guide-content hr { border: none; border-top: 1px solid #e8e8e8; margin: 2rem 0; }
        @media (max-width: 600px) {
          .guide-content table { font-size: 0.78rem; }
          .guide-filters { gap: 0.35rem; }
        }
      ` }} />

      <main className="guide-page">

        {/* ─── Intro ─── */}
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana&rsquo;s 55 state parks span 12,000 years of human history, over 11,000 acres of badlands,
          some of the world&rsquo;s largest freshwater springs, and a ghost town that once served as the
          territorial capital. Managed by <a href="https://fwp.mt.gov/stateparks" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978' }}>Montana Fish, Wildlife &amp; Parks (FWP)</a>,
          the system is one of the most diverse in the American West &mdash; and one of the most affordable,
          with all parks free for Montana residents who pay the $9/year parks fee at vehicle registration.
          This guide covers {parks.length} parks across {categories.length} categories, with camping details,
          fees, activities, and directions.
        </p>

        {/* ─── Map ─── */}
        <DirectoryMap
          items={filteredParks.map(a => ({ name: a.name, slug: a.slug, lat: a.lat, lng: a.lng, category: a.category }))}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {/* ─── Park Directory ─── */}
        <h2 className="guide-section-title">
          🏞️ State Parks Directory <span className="guide-section-count">({filteredParks.length}{filteredParks.length !== parks.length ? ` of ${parks.length}` : ''})</span>
        </h2>

        <div className="guide-filters">
          <button className={`guide-chip ${!categoryFilter ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(null)}>All</button>
          {categories.map(c => (
            <button key={c} className={`guide-chip ${categoryFilter === c ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}>
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {filteredParks.map(a => <AreaCard key={a.slug} a={a} />)}

        {/* ─── Fee & Camping Info ─── */}
        <div className="guide-disclaimer">
          <h3>💲 Fees &amp; Reservations</h3>
          <p>
            Montana residents pay $9/year at vehicle registration for unlimited free day-use access to all 55 state parks.
            Nonresident vehicles pay $8/day at most parks. The <strong>Montana State Parks Annual Pass</strong> ($60 for nonresidents)
            covers unlimited day-use access for one year.
          </p>
          <ul>
            <li>Campground reservations: <a href="https://stateparks.mt.gov" target="_blank" rel="noopener noreferrer">stateparks.mt.gov</a> or (855) 922-6768</li>
            <li>Reservations open in early January &mdash; popular parks fill quickly</li>
            <li>Smith River float permits: lottery applications open January 1</li>
          </ul>
        </div>

        {/* ─── Narrative Content ─── */}
        <h2 className="guide-section-title">
          📖 Montana State Parks Planning Guide
        </h2>

        <div className="guide-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          All fees, campsite counts, and park details reflect current information from Montana Fish, Wildlife &amp; Parks.
          Always verify at <a href="https://fwp.mt.gov/stateparks" style={{ color: '#aaa' }}>fwp.mt.gov/stateparks</a> before visiting.
        </p>

        {/* ─── CTAs ─── */}
        <div className="guide-cta">
          <Link href="/guides/wildlife-guide" className="guide-cta-primary">Wildlife Guide</Link>
          <Link href="/guides/photography-guide" className="guide-cta-secondary">Photography Guide</Link>
          <Link href="/guides/skiing-guide" className="guide-cta-secondary">Skiing Guide</Link>
          <Link href="/guides/hiking-guide" className="guide-cta-secondary">Hiking Guide</Link>
          <Link href="/montana-towns" className="guide-cta-secondary">Browse All Towns</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─── Static Props ─────────────────────────────────── */

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  const load = (f: string) => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));

  const parks: StatePark[] = load('state-parks.json');
  parks.sort((a, b) => a.name.localeCompare(b.name));

  const mdPath = path.join(dataDir, 'state-parks-guide-content.md');
  const mdRaw = fs.readFileSync(mdPath, 'utf8');
  const { marked } = require('marked');
  const contentHtml: string = marked(mdRaw);

  return { props: { parks, contentHtml } };
};
