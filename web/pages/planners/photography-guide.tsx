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

type PhotoLocation = {
  name: string;
  slug: string;
  category: string;
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  description: string;
  subjects: string[];
  bestSeason: string[];
  bestTime: string;
  difficulty: string;
  hikingRequired: boolean;
  hikingDistance: number;
  droneAllowed: boolean;
  permitRequired: boolean;
  entranceFee: number;
  managedBy: string;
  website: string | null;
  address: string;
  lensRecommended: string[];
  notes: string;
};

type Props = {
  locations: PhotoLocation[];
  contentHtml: string;
};

/* ─── Constants ────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  landscape: '#3b6978',
  wildlife: '#d4760a',
  badlands: '#a0522d',
  geology: '#8b6914',
  canyon: '#6b4423',
  water: '#2e86ab',
  history: '#7a6b3d',
  astrophotography: '#4a1d96',
};

const CATEGORY_LABELS: Record<string, string> = {
  landscape: 'Landscape',
  wildlife: 'Wildlife',
  badlands: 'Badlands',
  geology: 'Geology',
  canyon: 'Canyon',
  water: 'Water',
  history: 'History',
  astrophotography: 'Astrophotography',
};

function fmtDollars(n: number) {
  return n === 0 ? 'Free' : `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function fmtSeasons(seasons: string[]) {
  return seasons.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')).join(', ');
}

/* ─── Area Card ────────────────────────────────────── */

function AreaCard({ a }: { a: PhotoLocation }) {
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
          <div><strong>Managed by:</strong> {a.managedBy}</div>
          <div><strong>Difficulty:</strong> {a.difficulty.charAt(0).toUpperCase() + a.difficulty.slice(1)}</div>
          <div><strong>Entrance Fee:</strong> {fmtDollars(a.entranceFee)}</div>
          <div><strong>Best Season:</strong> {fmtSeasons(a.bestSeason)}</div>
          <div><strong>Best Time:</strong> {a.bestTime.charAt(0).toUpperCase() + a.bestTime.slice(1).replace(/-/g, ' / ')}</div>
          <div><strong>Hiking:</strong> {a.hikingRequired ? `Yes — ${a.hikingDistance} mi` : 'No'}</div>
          <div><strong>Drone Allowed:</strong> {a.droneAllowed ? 'Yes' : 'No'}</div>
          <div><strong>Permit Required:</strong> {a.permitRequired ? 'Yes' : 'No'}</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
          {a.subjects.map(s => (
            <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f0f7fa', border: '1px solid #d4e4ec', borderRadius: '4px', color: '#3b6978' }}>
              {s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        {a.lensRecommended.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600 }}>Lenses:</span>
            {a.lensRecommended.map(l => (
              <span key={l} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', background: '#f5f0e8', border: '1px solid #e0d8c8', borderRadius: '3px', color: '#8b6914' }}>
                {l}
              </span>
            ))}
          </div>
        )}

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
            <a href={a.website} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>Official Website →</a>
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

export default function PhotographyGuide({ locations, contentHtml }: Props) {
  const url = 'https://treasurestate.com/planners/photography-guide/';
  const title = "Montana Photographer's Guide";
  const desc = `Best photography locations in Montana — landscape, wildlife, astrophotography, and badlands. ${locations.length} verified locations with GPS coordinates, best times, and gear recommendations.`;

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners/' },
    { name: "Photographer's Guide", url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Montana Photography Locations',
    numberOfItems: locations.length,
    itemListElement: locations.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: a.name,
        description: a.description,
        geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
      },
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where are the best photography locations in Montana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Montana offers ${locations.length} premier photography locations including Glacier National Park (Lake McDonald, Wild Goose Island, Logan Pass), the Beartooth Highway, Yellowstone's Lamar Valley for wildlife, and dark sky locations like Makoshika State Park and Medicine Rocks for astrophotography.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can you fly a drone in Montana national parks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Drones are prohibited in all national parks including Glacier and Yellowstone. Drone use is generally permitted in national forests and on BLM land, subject to temporary flight restrictions and fire closures. Always check current regulations before flying.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best time of year for photography in Montana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Summer (June–September) is best for landscape and wildflower photography. March–April is peak for Freezout Lake bird migration. Late May–June for mountain goats at Goat Lick. Year-round for badlands and astrophotography. October–March for aurora borealis.',
        },
      },
    ],
  };

  const filteredLocations = locations.filter(a => {
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(locations.map(a => a.category)));

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana photography, Montana landscape photography, Montana wildlife photography, Montana astrophotography, Glacier National Park photography, Beartooth Highway, Lamar Valley, Makoshika State Park, Montana dark skies" />
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <Header />
      <Hero
        title="Montana Photographer's Guide"
        subtitle={`${locations.length} photography locations · Landscape, wildlife, astrophotography & badlands`}
        image="/images/hero-image.jpg"
        alt="Montana photography landscape"
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
        .guide-content hr { border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0; }
        @media (max-width: 600px) {
          .guide-content table { font-size: 0.78rem; }
          .guide-filters { gap: 0.35rem; }
        }
      ` }} />

      <main className="guide-page">

        {/* ─── Intro ─── */}
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana is one of the most photographically diverse states in the country. Within a single
          day&rsquo;s drive, a photographer can move from glacier-carved peaks to dinosaur badlands,
          from the world&rsquo;s largest freshwater springs to one of the darkest sky locations in
          North America. This guide covers {locations.length} verified photography locations with GPS
          coordinates, recommended gear, best times to shoot, and access details for each site.
        </p>

        {/* ─── Map ─── */}
        <DirectoryMap
          items={filteredLocations.map(a => ({ name: a.name, slug: a.slug, lat: a.lat, lng: a.lng, category: a.category }))}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {/* ─── Photography Locations ─── */}
        <h2 className="guide-section-title">
          📍 Photography Locations <span className="guide-section-count">({filteredLocations.length}{filteredLocations.length !== locations.length ? ` of ${locations.length}` : ''})</span>
        </h2>

        <div className="guide-filters">
          <button className={`guide-chip ${!categoryFilter ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(null)}>All</button>
          {categories.map(c => (
            <button key={c} className={`guide-chip ${categoryFilter === c ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}>
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {filteredLocations.map(a => <AreaCard key={a.slug} a={a} />)}

        {/* ─── Disclaimer ─── */}
        <div className="guide-disclaimer">
          <h3>⚠️ Always Verify Before You Go</h3>
          <p>
            Access, fees, and conditions change seasonally. Road closures, fire restrictions, and
            permit requirements can affect access without notice.
          </p>
          <ul>
            <li>Check road conditions at <a href="https://www.511mt.net" target="_blank" rel="noopener noreferrer">511mt.net</a> before traveling to mountain locations</li>
            <li>Verify current entrance fees on the managing agency&rsquo;s website</li>
            <li>Drones are prohibited in all national parks — always confirm drone policy before flying</li>
            <li>Carry bear spray in western Montana and the Greater Yellowstone Ecosystem</li>
          </ul>
        </div>

        {/* ─── Narrative Content ─── */}
        <h2 className="guide-section-title">
          📖 Photographer&rsquo;s Field Guide
        </h2>

        <div className="guide-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          All locations, fees, and access details reflect current information from the National Park Service,
          Montana Fish Wildlife &amp; Parks, USFS, and BLM. Always verify current conditions before visiting.
        </p>

        {/* ─── CTAs ─── */}
        <div className="guide-cta">
          <Link href="/planners/wildlife-guide" className="guide-cta-primary">Wildlife Guide</Link>
          <Link href="/planners/skiing-guide" className="guide-cta-secondary">Skiing Guide</Link>
          <Link href="/planners/state-parks-guide" className="guide-cta-secondary">State Parks Guide</Link>
          <Link href="/planners/hunting-guide" className="guide-cta-secondary">Hunting Guide</Link>
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

  const locations: PhotoLocation[] = load('photography-locations.json');
  locations.sort((a, b) => a.name.localeCompare(b.name));

  const mdPath = path.join(dataDir, 'photography-guide-content.md');
  const mdRaw = fs.readFileSync(mdPath, 'utf8');
  const { marked } = require('marked');
  const contentHtml: string = marked(mdRaw);

  return { props: { locations, contentHtml } };
};
