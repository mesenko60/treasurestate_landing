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

type WildlifeArea = {
  name: string;
  slug: string;
  category: string;
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  description: string;
  species: string[];
  bestSeason: string[];
  bestTime: string;
  managedBy: string;
  accessType: string;
  entranceFee: number;
  website: string;
  phone: string;
  address: string;
  equipmentRecommended: string[];
  viewingDistance: string;
  notes: string;
};

type Props = {
  areas: WildlifeArea[];
  contentHtml: string;
};

/* ─── Constants ────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  'national-park': '#2d7d46',
  wma: '#5a8a5c',
  'wildlife-refuge': '#7a6b3d',
  'roadside-viewing': '#d4760a',
  'wildlife-area': '#3b6978',
};

const CATEGORY_LABELS: Record<string, string> = {
  'national-park': 'National Park',
  wma: 'Wildlife Management Area',
  'wildlife-refuge': 'Wildlife Refuge',
  'roadside-viewing': 'Roadside Viewing',
  'wildlife-area': 'Wildlife Area',
};

const SPECIES_LABELS: Record<string, string> = {
  'gray-wolf': 'Gray Wolf', 'grizzly-bear': 'Grizzly Bear', 'black-bear': 'Black Bear',
  'bison': 'Bison', 'elk': 'Elk', 'pronghorn': 'Pronghorn', 'moose': 'Moose',
  'bighorn-sheep': 'Bighorn Sheep', 'mountain-goat': 'Mountain Goat',
  'mule-deer': 'Mule Deer', 'white-tailed-deer': 'Whitetail',
  'bald-eagle': 'Bald Eagle', 'golden-eagle': 'Golden Eagle',
  'osprey': 'Osprey', 'great-blue-heron': 'Great Blue Heron',
  'snow-goose': 'Snow Goose', 'tundra-swan': 'Tundra Swan',
  'coyote': 'Coyote', 'raven': 'Raven',
  'white-pelican': 'White Pelican', 'prairie-dog': 'Prairie Dog',
  'clark-nutcracker': "Clark's Nutcracker", 'gray-jay': 'Gray Jay',
  'pika': 'Pika', 'hoary-marmot': 'Hoary Marmot',
  'sandhill-crane': 'Sandhill Crane', 'double-crested-cormorant': 'Cormorant',
  'piping-plover': 'Piping Plover', 'mallard': 'Mallard', 'teal': 'Teal',
  'canvasback': 'Canvasback', 'redhead': 'Redhead', 'ruddy-duck': 'Ruddy Duck',
  'pintail': 'Pintail', 'songbirds': 'Songbirds',
  'sharp-tailed-grouse': 'Sharp-tailed Grouse',
  'ferruginous-hawk': 'Ferruginous Hawk', 'rough-legged-hawk': 'Rough-legged Hawk',
  'prairie-falcon': 'Prairie Falcon', 'mountain-lion': 'Mountain Lion',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  'spotting-scope': 'Spotting Scope',
  '500mm-telephoto': '500mm Telephoto',
  '300mm-telephoto': '300mm Telephoto',
  'binoculars': 'Binoculars',
  'bear-spray': 'Bear Spray',
  'wide-angle-lens': 'Wide-Angle Lens',
};

function formatSeason(seasons: string[]): string {
  if (seasons.length === 1 && seasons[0] === 'year-round') return 'Year-round';
  return seasons.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
}

function formatFee(fee: number): string {
  return fee === 0 ? 'Free' : `$${fee}`;
}

/* ─── Area Card ────────────────────────────────────── */

function AreaCard({ a }: { a: WildlifeArea }) {
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
          <div><strong>Entrance Fee:</strong> {formatFee(a.entranceFee)}</div>
          <div><strong>Best Season:</strong> {formatSeason(a.bestSeason)}</div>
          <div><strong>Best Time:</strong> {a.bestTime}</div>
          <div><strong>Viewing Distance:</strong> {a.viewingDistance}</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
          {a.species.slice(0, 8).map(s => (
            <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f0f7fa', border: '1px solid #d4e4ec', borderRadius: '4px', color: '#3b6978' }}>
              {SPECIES_LABELS[s] || s}
            </span>
          ))}
          {a.species.length > 8 && (
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#999' }}>+{a.species.length - 8} more</span>
          )}
        </div>

        {a.equipmentRecommended.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
            {a.equipmentRecommended.map(e => (
              <span key={e} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', background: '#f5f0e6', border: '1px solid #e0d8c8', borderRadius: '3px', color: '#7a6b3d' }}>
                {EQUIPMENT_LABELS[e] || e}
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
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2d7d46', textDecoration: 'none', fontWeight: 600 }}>
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Component ───────────────────────────────── */

export default function WildlifeGuide({ areas, contentHtml }: Props) {
  const url = 'https://treasurestate.com/guides/wildlife-guide/';
  const title = 'Montana Wildlife Viewing Guide';
  const desc = `Best places to see grizzly bears, wolves, bison, elk, bighorn sheep, and more in Montana. Verified locations with species, seasons, and access details.`;

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/guides/' },
    { name: 'Wildlife Guide', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: '2026-01-15T00:00:00-07:00',
    dateModified: '2026-03-14T00:00:00-07:00',
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  const filteredAreas = areas.filter(a => {
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(areas.map(a => a.category)));

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana wildlife viewing, Montana grizzly bear viewing, Montana wolf watching, Yellowstone wildlife, Glacier National Park wildlife, Montana bison, Montana elk viewing, Montana wildlife guide" />
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
      </Head>
      <Header />
      <Hero
        title="Montana Wildlife Viewing Guide"
        subtitle={`${areas.length} verified viewing areas · Bears, wolves, bison, elk, eagles & more`}
        image="/images/hero-image.jpg"
        alt="Montana wildlife landscape"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .guide-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .guide-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .guide-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .guide-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
        .guide-chip { font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 999px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-family: var(--font-primary); transition: all 0.15s; color: #555; }
        .guide-chip:hover { border-color: #2d7d46; color: #2d7d46; }
        .guide-chip--active { background: #2d7d46; color: #fff; border-color: #2d7d46; }
        .guide-disclaimer { background: #fff8e1; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
        .guide-disclaimer h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .guide-disclaimer p, .guide-disclaimer li { font-size: 0.9rem; color: #555; line-height: 1.6; }
        .guide-disclaimer ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
        .guide-cta { text-align: center; margin-top: 2.5rem; }
        .guide-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .guide-cta-primary { background: #2d7d46; color: #fff; }
        .guide-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        .guide-content h2 { font-family: var(--font-primary); font-size: 1.3rem; color: #204051; margin: 2rem 0 0.5rem; }
        .guide-content h3 { font-family: var(--font-primary); font-size: 1.1rem; color: #2d7d46; margin: 1.5rem 0 0.4rem; }
        .guide-content p { font-size: 0.95rem; color: #444; line-height: 1.7; margin: 0 0 1rem; }
        .guide-content table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 0.75rem 0 1.25rem; }
        .guide-content th { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 2px solid #e0e0e0; color: #666; font-weight: 600; }
        .guide-content td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #f0f0f0; }
        .guide-content a { color: #2d7d46; }
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
          Montana is home to more than 600 species of wildlife, including every large mammal native to
          the contiguous United States except the jaguar. From wolf packs in Yellowstone&rsquo;s Lamar Valley
          to 300,000 snow geese at Freezout Lake, from mountain goats at Logan Pass to the largest
          bighorn sheep herd in the nation at Sun River Canyon — this guide covers {areas.length} verified
          viewing locations with species, seasons, equipment recommendations, and access details. All
          locations are sourced from <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#2d7d46' }}>Montana Fish, Wildlife &amp; Parks</a>,
          the National Park Service, and the U.S. Fish &amp; Wildlife Service.
        </p>

        {/* ─── Map ─── */}
        <DirectoryMap
          items={filteredAreas.map(a => ({ name: a.name, slug: a.slug, lat: a.lat, lng: a.lng, category: a.category }))}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {/* ─── Wildlife Viewing Areas ─── */}
        <h2 className="guide-section-title">
          🦌 Wildlife Viewing Areas <span className="guide-section-count">({filteredAreas.length}{filteredAreas.length !== areas.length ? ` of ${areas.length}` : ''})</span>
        </h2>

        <div className="guide-filters">
          <button className={`guide-chip ${!categoryFilter ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(null)}>All</button>
          {categories.map(c => (
            <button key={c} className={`guide-chip ${categoryFilter === c ? 'guide-chip--active' : ''}`} onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}>
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {filteredAreas.map(a => <AreaCard key={a.slug} a={a} />)}

        {/* ─── Safety & Etiquette ─── */}
        <h2 className="guide-section-title">
          ⚠️ Wildlife Viewing Safety &amp; Etiquette
        </h2>

        <div className="guide-disclaimer">
          <h3>⚠️ Distance Requirements</h3>
          <p>
            Montana&rsquo;s wildlife is wild — encounters can be unpredictable and dangerous. These distances
            are enforced as federal law in Yellowstone and Glacier National Parks.
          </p>
          <ul>
            <li><strong>Bears and wolves:</strong> Stay at least 100 yards (300 feet) away at all times.</li>
            <li><strong>Bison, elk, and all other wildlife:</strong> Stay at least 25 yards (75 feet) away.</li>
            <li><strong>Bear spray:</strong> Carry it and know how to use it in all grizzly country (western and north-central Montana).</li>
            <li><strong>Never feed wildlife.</strong> Animals that associate humans with food are almost always euthanized.</li>
            <li><strong>Seasonal closures:</strong> Many areas in Glacier and Yellowstone have seasonal closures to protect nesting or denning animals. Check current conditions before heading out.</li>
          </ul>
        </div>

        {/* ─── Narrative Content from Markdown ─── */}
        <h2 className="guide-section-title">
          📖 Species Guide &amp; Viewing Tips
        </h2>

        <div className="guide-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <p style={{ fontSize: '0.78rem', color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          All locations and details sourced from Montana Fish, Wildlife &amp; Parks, the National Park Service, and the U.S. Fish &amp; Wildlife Service.
          Always verify current conditions and closures at <a href="https://fwp.mt.gov" style={{ color: '#555' }}>fwp.mt.gov</a> or the relevant park/refuge website before visiting.
        </p>

        {/* ─── CTAs ─── */}
        <div className="guide-cta">
          <Link href="/guides/photography-guide" className="guide-cta-primary">Photography Guide</Link>
          <Link href="/guides/state-parks-guide" className="guide-cta-secondary">State Parks Guide</Link>
          <Link href="/guides/skiing-guide" className="guide-cta-secondary">Skiing Guide</Link>
          <Link href="/guides/hunting-guide" className="guide-cta-secondary">Hunting Guide</Link>
          <Link href="/guides/land-ownership" className="guide-cta-secondary">Land Ownership GIS</Link>
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
  const areas: WildlifeArea[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'wildlife-viewing-areas.json'), 'utf8'));

  areas.sort((a, b) => a.name.localeCompare(b.name));

  const mdPath = path.join(dataDir, 'wildlife-guide-content.md');
  const mdRaw = fs.readFileSync(mdPath, 'utf8');
  const { marked } = require('marked');
  const contentHtml: string = await marked.parse(mdRaw);

  return { props: { areas, contentHtml } };
};
