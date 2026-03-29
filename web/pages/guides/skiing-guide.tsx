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

type SkiArea = {
  name: string; slug: string; category: string;
  lat: number; lng: number;
  nearestTown: string; nearestTownName: string;
  description: string;
  verticalDrop: number; skiableAcres: number;
  runs: number; lifts: number;
  annualSnowfall: number; adultDayTicket: number;
  seasonOpen: string; seasonClose: string;
  passAccepted: string[];
  website: string | null; phone: string; address: string;
  difficulty: { beginner: number; intermediate: number; advanced: number; expert: number };
  amenities: string[];
  nightSkiing: boolean; indy: boolean;
  notes: string;
};

type Props = {
  areas: SkiArea[];
  contentHtml: string;
};

/* ─── Constants ────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  'destination-resort': '#1e40af',
  'non-profit': '#5a8a5c',
  independent: '#3b6978',
  community: '#7a6b3d',
  tribal: '#9333ea',
  summer: '#ea580c',
};

const CATEGORY_LABELS: Record<string, string> = {
  'destination-resort': 'Destination Resort',
  'non-profit': 'Non-Profit',
  independent: 'Independent',
  community: 'Community Hill',
  tribal: 'Tribal',
  summer: 'Summer Skiing',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#4caf50',
  intermediate: '#2196f3',
  advanced: '#1a1a1a',
  expert: '#d32f2f',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

function fmt(n: number) { return n.toLocaleString(); }
function fmtDollars(n: number) { return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`; }

function seasonLabel(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ─── Difficulty Bar ──────────────────────────────── */

function DifficultyBar({ difficulty }: { difficulty: SkiArea['difficulty'] }) {
  const entries = Object.entries(difficulty).filter(([, v]) => v > 0);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.25rem', fontWeight: 500 }}>Terrain Difficulty</div>
      <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', height: '14px' }}>
        {entries.map(([key, pct]) => (
          <div
            key={key}
            title={`${DIFFICULTY_LABELS[key]}: ${pct}%`}
            style={{ width: `${pct}%`, background: DIFFICULTY_COLORS[key], minWidth: pct > 0 ? '8px' : 0 }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
        {entries.map(([key, pct]) => (
          <span key={key} style={{ fontSize: '0.72rem', color: '#777', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: DIFFICULTY_COLORS[key], display: 'inline-block' }} />
            {DIFFICULTY_LABELS[key]} {pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Area Card ────────────────────────────────────── */

function AreaCard({ a }: { a: SkiArea }) {
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
          <div><strong>Vertical Drop:</strong> {fmt(a.verticalDrop)} ft</div>
          <div><strong>Skiable Acres:</strong> {fmt(a.skiableAcres)}</div>
          <div><strong>Runs:</strong> {a.runs}</div>
          <div><strong>Lifts:</strong> {a.lifts}</div>
          <div><strong>Annual Snowfall:</strong> {a.annualSnowfall > 0 ? `${fmt(a.annualSnowfall)} in` : 'Varies'}</div>
          <div><strong>Day Ticket:</strong> {fmtDollars(a.adultDayTicket)}</div>
          <div><strong>Season:</strong> {seasonLabel(a.seasonOpen)} – {seasonLabel(a.seasonClose)}</div>
          <div><strong>Pass:</strong> {a.passAccepted.length > 0 ? a.passAccepted.join(', ') : 'None'}</div>
        </div>

        <DifficultyBar difficulty={a.difficulty} />

        {a.nightSkiing && (
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#1e1b4b', color: '#c4b5fd', borderRadius: '4px', fontWeight: 600 }}>
              🌙 Night Skiing Available
            </span>
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

export default function SkiingGuide({ areas, contentHtml }: Props) {
  const url = 'https://treasurestate.com/guides/skiing-guide/';
  const title = 'Montana Skiing & Snowboarding Guide';
  const desc = `All ${areas.length} Montana ski areas with vertical drop, acreage, snowfall, lift ticket prices, and pass affiliations.`;

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/guides/' },
    { name: 'Skiing Guide', url },
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
        <meta name="keywords" content="Montana skiing, Montana ski areas, Montana snowboarding, Montana ski resorts, Big Sky Resort, Whitefish Mountain, Bridger Bowl, Montana powder, Montana ski guide" />
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
        title="Montana Skiing &amp; Snowboarding Guide"
        subtitle={`All ${areas.length} Montana ski areas — vertical drop, acreage, snowfall, prices & pass info`}
        image="/images/hero-image.jpg"
        alt="Montana skiing landscape"
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
          Montana is one of the most underrated ski destinations in North America. With {areas.length} ski
          areas spread across the western half of the state — ranging from a 5,800-acre destination resort
          to a tribal-owned community hill that doesn&rsquo;t take credit cards — the Treasure State offers
          something for every skier and snowboarder, at every price point. Lift tickets range
          from {fmtDollars(Math.min(...areas.map(a => a.adultDayTicket)))} to {fmtDollars(Math.max(...areas.map(a => a.adultDayTicket)))}.
        </p>

        {/* ─── Map ─── */}
        <DirectoryMap
          items={filteredAreas.map(a => ({ name: a.name, slug: a.slug, lat: a.lat, lng: a.lng, category: a.category }))}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {/* ─── Ski Areas ─── */}
        <h2 className="guide-section-title">
          ⛷️ Montana Ski Areas <span className="guide-section-count">({filteredAreas.length}{filteredAreas.length !== areas.length ? ` of ${areas.length}` : ''})</span>
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

        {/* ─── Narrative Content ─── */}
        <h2 className="guide-section-title">
          📖 Skier&rsquo;s Guide to Montana
        </h2>

        <div className="guide-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <p style={{ fontSize: '0.78rem', color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          All lift ticket prices, terrain stats, and season dates reflect 2024–2025 information from individual resort websites
          and the Montana Office of Tourism. Always verify current conditions and pricing directly with each ski area before visiting.
        </p>

        {/* ─── CTAs ─── */}
        <div className="guide-cta">
          <Link href="/guides/state-parks-guide" className="guide-cta-primary">State Parks Guide</Link>
          <Link href="/guides/wildlife-guide" className="guide-cta-secondary">Wildlife Guide</Link>
          <Link href="/guides/photography-guide" className="guide-cta-secondary">Photography Guide</Link>
          <Link href="/guides/hunting-guide" className="guide-cta-secondary">Hunting Guide</Link>
          <Link href="/montana-towns" className="guide-cta-secondary">Browse All Towns</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─── Static Props ─────────────────────────────────── */

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { marked } = require('marked');
  const dataDir = path.join(process.cwd(), 'data');

  const areas: SkiArea[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'skiing-areas.json'), 'utf8'));
  const contentMd = fs.readFileSync(path.join(dataDir, 'skiing-guide-content.md'), 'utf8');
  const contentHtml = marked(contentMd);

  areas.sort((a, b) => a.name.localeCompare(b.name));

  return { props: { areas, contentHtml } };
};
