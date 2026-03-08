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

type HuntingArea = {
  name: string;
  slug: string;
  category: string;
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  description: string;
  species: string[];
  season: string;
  accessType: string;
  managedBy: string;
  acreage: number;
  fwpRegion: number;
  website: string;
  huntingDistricts: string[];
  permitRequired: boolean;
  campingAllowed: boolean;
  notes: string;
};

type SeasonEntry = {
  type: string;
  openDate: string;
  closeDate: string;
  displayDates: string;
  notes: string;
};

type SpeciesSeason = {
  species: string;
  speciesSlug: string;
  seasons: SeasonEntry[];
  bagLimits: Record<string, string>;
  licenseRequired: string[];
  applicationDeadline: string;
  source: string;
  regulationsUrl: string;
};

type LicenseEntry = {
  name: string;
  slug: string;
  residentFee: number | null;
  nonresidentFee: number | null;
  applicationFee?: number;
  notes: string;
  required?: boolean;
};

type DeadlineEntry = {
  license: string;
  deadline: string;
  applicationFee: number;
  notes: string;
};

type LicenseCategory = {
  category: string;
  description: string;
  licenses?: LicenseEntry[];
  deadlines?: DeadlineEntry[];
};

type Props = {
  areas: HuntingArea[];
  seasons: SpeciesSeason[];
  licenses: LicenseCategory[];
};

/* ─── Constants ────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  wma: '#5a8a5c',
  'national-forest': '#3b6978',
  'national-wildlife-refuge': '#7a6b3d',
  blm: '#a0522d',
};

const CATEGORY_LABELS: Record<string, string> = {
  wma: 'Wildlife Management Area',
  'national-forest': 'National Forest',
  'national-wildlife-refuge': 'National Wildlife Refuge',
  blm: 'BLM Land',
};

const SPECIES_LABELS: Record<string, string> = {
  elk: 'Elk', 'mule-deer': 'Mule Deer', 'white-tailed-deer': 'Whitetail',
  antelope: 'Antelope', 'black-bear': 'Black Bear', moose: 'Moose',
  'bighorn-sheep': 'Bighorn Sheep', 'mountain-goat': 'Mountain Goat',
  'mountain-lion': 'Mountain Lion', wolf: 'Wolf', turkey: 'Turkey',
  pheasant: 'Pheasant', ducks: 'Ducks', geese: 'Geese',
  'canada-geese': 'Canada Geese', 'snow-geese': 'Snow Geese',
  'tundra-swan': 'Tundra Swan',
  'blue-grouse': 'Dusky Grouse', 'dusky-grouse': 'Dusky Grouse',
  'ruffed-grouse': 'Ruffed Grouse', 'spruce-grouse': 'Spruce Grouse',
  'sharp-tailed-grouse': 'Sharp-tailed Grouse', 'sage-grouse': 'Sage Grouse',
  'mountain-grouse': 'Mountain Grouse', 'grizzly-bear': 'Grizzly Bear',
};

function fmt(n: number) { return n.toLocaleString(); }
function fmtDollars(n: number) { return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`; }

/* ─── Area Card ────────────────────────────────────── */

function AreaCard({ a }: { a: HuntingArea }) {
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
          <div><strong>Acreage:</strong> {fmt(a.acreage)}</div>
          <div><strong>FWP Region:</strong> {a.fwpRegion}</div>
          <div><strong>Permit Required:</strong> {a.permitRequired ? 'Yes' : 'No'}</div>
          <div><strong>Camping:</strong> {a.campingAllowed ? 'Allowed' : 'Not allowed'}</div>
          {a.huntingDistricts.length > 0 && <div><strong>Districts:</strong> {a.huntingDistricts.join(', ')}</div>}
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

/* ─── Season Accordion ─────────────────────────────── */

function SeasonAccordion({ species }: { species: SpeciesSeason[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div style={{ marginBottom: '2rem' }}>
      {species.map((sp, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={sp.speciesSlug} style={{ borderBottom: '1px solid #e8e8e8' }}>
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0.5rem', fontFamily: 'var(--font-primary)', fontSize: '1rem', fontWeight: 600, color: '#204051', textAlign: 'left' }}
            >
              <span>{sp.species}</span>
              <span style={{ fontSize: '0.8rem', color: '#999', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 0.5rem 1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Season</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Dates</th>
                      <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sp.seasons.map((s, j) => (
                      <tr key={j} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>{s.type}</td>
                        <td style={{ padding: '0.4rem 0.5rem', whiteSpace: 'nowrap' }}>{s.displayDates}</td>
                        <td style={{ padding: '0.4rem 0.5rem', color: '#666' }}>{s.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>
                  <strong>Bag limit:</strong> {sp.bagLimits.general || sp.bagLimits.spring || Object.values(sp.bagLimits).filter(v => v !== sp.bagLimits.notes)[0]}
                  {sp.bagLimits.notes && <span style={{ display: 'block', fontSize: '0.82rem', color: '#888', marginTop: '0.25rem' }}>{sp.bagLimits.notes}</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' }}>
                  <strong>Application deadline:</strong> {sp.applicationDeadline}
                </div>
                <a href={sp.regulationsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#3b6978', marginTop: '0.25rem', display: 'inline-block' }}>
                  View FWP Regulations →
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── License Table ────────────────────────────────── */

function LicenseTables({ categories }: { categories: LicenseCategory[] }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {categories.map(cat => (
        <div key={cat.category} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#204051', margin: '0 0 0.25rem', fontFamily: 'var(--font-primary)' }}>{cat.category}</h3>
          <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 0.5rem' }}>{cat.description}</p>
          {cat.licenses && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>License</th>
                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: '#666' }}>Resident</th>
                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: '#666' }}>Nonresident</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.licenses.map(l => (
                    <tr key={l.slug} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.4rem 0.5rem', fontWeight: l.required ? 600 : 400 }}>{l.name}{l.required ? ' *' : ''}</td>
                      <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{l.residentFee != null ? fmtDollars(l.residentFee) : '—'}</td>
                      <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{l.nonresidentFee != null ? fmtDollars(l.nonresidentFee) : '—'}</td>
                      <td style={{ padding: '0.4rem 0.5rem', color: '#666', fontSize: '0.8rem' }}>{l.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {cat.deadlines && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>License</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Deadline</th>
                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: '#666' }}>App Fee</th>
                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#666' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.deadlines.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>{d.license}</td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{d.deadline}</td>
                      <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{fmtDollars(d.applicationFee)}</td>
                      <td style={{ padding: '0.4rem 0.5rem', color: '#666', fontSize: '0.8rem' }}>{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '0.5rem' }}>* Required base license</p>
    </div>
  );
}

/* ─── Page Component ───────────────────────────────── */

export default function HuntingGuide({ areas, seasons, licenses }: Props) {
  const url = 'https://treasurestate.com/planners/hunting-guide/';
  const title = 'Montana Hunting Guide: Seasons, Licenses, and Public Land Access';
  const desc = `Complete guide to hunting in Montana — season dates for ${seasons.length} species, license fees, ${areas.length} WMAs and public hunting areas, and species profiles for deer, elk, antelope, bear, turkey, and more.`;

  const [regionFilter, setRegionFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners/' },
    { name: 'Hunting Guide', url },
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
    name: 'Montana Public Hunting Areas',
    numberOfItems: areas.length,
    itemListElement: areas.map((a, i) => ({
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

  const filteredAreas = areas.filter(a => {
    if (regionFilter && a.fwpRegion !== regionFilter) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  const regions = Array.from(new Set(areas.map(a => a.fwpRegion))).sort();
  const categories = Array.from(new Set(areas.map(a => a.category)));

  const bigGame = seasons.filter(s => ['deer', 'elk', 'antelope', 'black-bear', 'bighorn-sheep', 'moose', 'mountain-goat', 'mountain-lion', 'wolf', 'bison'].includes(s.speciesSlug));
  const birdGame = seasons.filter(s => ['turkey', 'pheasant', 'mountain-grouse', 'sharp-tailed-grouse', 'sage-grouse', 'partridge', 'ducks', 'geese', 'sandhill-crane'].includes(s.speciesSlug));

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana hunting, Montana elk hunting, Montana deer hunting, Montana hunting seasons, Montana hunting license, Montana WMA, Montana public land hunting, Montana FWP" />
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
      </Head>
      <Header />
      <Hero
        title="Montana Hunting Guide"
        subtitle={`${areas.length} public hunting areas · ${seasons.length} species · Season dates & license fees`}
        image="/images/hero-image.jpg"
        alt="Montana hunting landscape"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .hunt-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .hunt-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .hunt-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .hunt-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
        .hunt-chip { font-size: 0.8rem; padding: 0.35rem 0.75rem; border-radius: 999px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-family: var(--font-primary); transition: all 0.15s; color: #555; }
        .hunt-chip:hover { border-color: #3b6978; color: #3b6978; }
        .hunt-chip--active { background: #3b6978; color: #fff; border-color: #3b6978; }
        .hunt-disclaimer { background: #fff8e1; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
        .hunt-disclaimer h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .hunt-disclaimer p, .hunt-disclaimer li { font-size: 0.9rem; color: #555; line-height: 1.6; }
        .hunt-disclaimer ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
        .hunt-cta { text-align: center; margin-top: 2.5rem; }
        .hunt-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .hunt-cta-primary { background: #3b6978; color: #fff; }
        .hunt-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        .hunt-content h2 { font-family: var(--font-primary); font-size: 1.3rem; color: #204051; margin: 2rem 0 0.5rem; }
        .hunt-content h3 { font-family: var(--font-primary); font-size: 1.1rem; color: '#3b6978'; margin: 1.5rem 0 0.4rem; }
        .hunt-content p { font-size: 0.95rem; color: #444; line-height: 1.7; margin: 0 0 1rem; }
        .hunt-content table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 0.75rem 0 1.25rem; }
        .hunt-content th { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 2px solid #e0e0e0; color: #666; font-weight: 600; }
        .hunt-content td { padding: 0.4rem 0.5rem; border-bottom: 1px solid #f0f0f0; }
        .hunt-content a { color: #3b6978; }
        .hunt-content ul, .hunt-content ol { padding-left: 1.25rem; margin: 0 0 1rem; }
        .hunt-content li { font-size: 0.95rem; color: #444; line-height: 1.7; margin-bottom: 0.25rem; }
        @media (max-width: 600px) {
          .hunt-content table { font-size: 0.78rem; }
          .hunt-filters { gap: 0.35rem; }
        }
      ` }} />

      <main className="hunt-page">

        {/* ─── Intro ─── */}
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana is one of the last places in North America where a hunter can step off a paved road and
          into millions of acres of wild, publicly accessible land. With over 30 million acres of state and
          federal public land — nearly one-third of the entire state — Montana offers hunting opportunities
          unmatched in the lower 48. This guide covers {areas.length} public hunting areas
          across all 7 FWP regions, season dates for {seasons.length} species, and a complete license fee
          breakdown for both residents and nonresidents. All regulations are administered
          by <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978' }}>Montana Fish, Wildlife &amp; Parks (FWP)</a>.
        </p>

        {/* ─── Map ─── */}
        <DirectoryMap
          items={filteredAreas.map(a => ({ name: a.name, slug: a.slug, lat: a.lat, lng: a.lng, category: a.category }))}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {/* ─── Hunting Areas ─── */}
        <h2 className="hunt-section-title">
          🎯 Public Hunting Areas <span className="hunt-section-count">({filteredAreas.length}{filteredAreas.length !== areas.length ? ` of ${areas.length}` : ''})</span>
        </h2>

        <div className="hunt-filters">
          <button className={`hunt-chip ${!regionFilter && !categoryFilter ? 'hunt-chip--active' : ''}`} onClick={() => { setRegionFilter(null); setCategoryFilter(null); }}>All</button>
          {regions.map(r => (
            <button key={r} className={`hunt-chip ${regionFilter === r ? 'hunt-chip--active' : ''}`} onClick={() => { setRegionFilter(regionFilter === r ? null : r); setCategoryFilter(null); }}>
              Region {r}
            </button>
          ))}
          {categories.map(c => (
            <button key={c} className={`hunt-chip ${categoryFilter === c ? 'hunt-chip--active' : ''}`} onClick={() => { setCategoryFilter(categoryFilter === c ? null : c); setRegionFilter(null); }}>
              {CATEGORY_LABELS[c] || c}
            </button>
          ))}
        </div>

        {filteredAreas.map(a => <AreaCard key={a.slug} a={a} />)}

        {/* ─── Season Dates ─── */}
        <h2 className="hunt-section-title">
          📅 Season Dates &amp; Bag Limits
        </h2>

        <div className="hunt-disclaimer">
          <h3>⚠️ Always Verify Dates</h3>
          <p>
            Season dates and bag limits shown reflect 2025–2026 FWP regulations. Dates vary by hunting district and are
            subject to change. Always consult the <a href="https://fwp.mt.gov/hunt/regulations" target="_blank" rel="noopener noreferrer">current FWP regulation booklets</a> before hunting.
          </p>
        </div>

        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', color: '#204051', margin: '1.5rem 0 0.5rem' }}>Big Game ({bigGame.length} species)</h3>
        <SeasonAccordion species={bigGame} />

        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', color: '#204051', margin: '1.5rem 0 0.5rem' }}>Birds &amp; Waterfowl ({birdGame.length} species)</h3>
        <SeasonAccordion species={birdGame} />

        {/* ─── License Fees ─── */}
        <h2 className="hunt-section-title">
          💰 License Fees &amp; Requirements
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Every Montana hunter must purchase a Conservation License and Base Hunting License before
          any species-specific license. Fees shown are per-license. Purchase online
          at <a href="https://fwp.mt.gov/buyandapply" target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978' }}>fwp.mt.gov</a> or
          at any FWP office.
        </p>
        <LicenseTables categories={licenses} />

        {/* ─── Narrative Content ─── */}
        <h2 className="hunt-section-title">
          📖 Hunter&rsquo;s Guide to Montana
        </h2>

        <div className="hunt-content">
          <h2>Understanding Montana&rsquo;s FWP Regions</h2>
          <p>
            Montana FWP divides the state into seven administrative regions, each headquartered in a major city.
            These regions are the foundation of Montana&rsquo;s wildlife management system — season structures,
            antlerless permit allocations, and special regulations are often set at the regional or hunting-district level.
          </p>
          <table>
            <thead><tr><th>Region</th><th>Geographic Area</th><th>Headquarters</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Northwest Montana</td><td><Link href="/montana-towns/kalispell/">Kalispell</Link></td></tr>
              <tr><td>2</td><td>West-central Montana</td><td><Link href="/montana-towns/missoula/">Missoula</Link></td></tr>
              <tr><td>3</td><td>Southwest Montana</td><td><Link href="/montana-towns/bozeman/">Bozeman</Link></td></tr>
              <tr><td>4</td><td>North-central Montana</td><td><Link href="/montana-towns/great-falls/">Great Falls</Link></td></tr>
              <tr><td>5</td><td>South-central Montana</td><td><Link href="/montana-towns/billings/">Billings</Link></td></tr>
              <tr><td>6</td><td>Northeast Montana</td><td><Link href="/montana-towns/glasgow/">Glasgow</Link></td></tr>
              <tr><td>7</td><td>Southeast Montana</td><td><Link href="/montana-towns/miles-city/">Miles City</Link></td></tr>
            </tbody>
          </table>
          <p>
            Within each region, FWP further subdivides the landscape into <strong>Hunting Districts (HDs)</strong>,
            numbered three-digit codes that define the specific boundaries within which a given license is valid.
            The <a href="https://fwp.mt.gov/gis/maps/huntPlanner/" target="_blank" rel="noopener noreferrer">FWP Hunt Planner Map</a> is
            invaluable for identifying district boundaries, public land ownership, and access points.
          </p>

          <h2>Public Land Access</h2>
          <p>
            Montana FWP owns and manages over 400,000 acres of Wildlife Management Areas statewide, providing
            free public hunting access for all licensed hunters. The FWP <strong>Block Management Program</strong> opens
            over 7 million acres of private land to public hunting annually — one of the most successful hunter
            access programs in the West.
          </p>
          <p>
            Montana&rsquo;s national forests encompass millions of acres of prime habitat. The <strong>Bob Marshall
            Wilderness Complex</strong> (1.5 million acres), <strong>Selway-Bitterroot Wilderness</strong> (1.3 million
            acres), and <strong>Absaroka-Beartooth Wilderness</strong> (943,000 acres) are among the largest
            wilderness areas in the lower 48. No motorized vehicles are permitted in designated wilderness;
            access is by foot or horseback only.
          </p>
          <p>
            The Bureau of Land Management administers approximately 8 million acres in Montana. The <strong>Upper
            Missouri River Breaks National Monument</strong> (375,000 acres) is one of the premier mule deer and
            antelope destinations in North America. The <strong>Charles M. Russell National Wildlife Refuge</strong> encompasses
            1.1 million acres along 125 miles of the Missouri River.
          </p>

          <h2>Hunter Safety &amp; Field Preparation</h2>
          <ul>
            <li><strong>Hunter Education:</strong> Required for all first-time hunters born on or after January 1, 1985. Online and in-person courses available through <a href="https://fwp.mt.gov/hunt/huntereducation" target="_blank" rel="noopener noreferrer">FWP Hunter Education</a>.</li>
            <li><strong>Chronic Wasting Disease (CWD):</strong> Detected in several eastern Montana hunting districts. Mandatory check stations operate in affected areas. Current info at <a href="https://fwp.mt.gov/hunt/cwd" target="_blank" rel="noopener noreferrer">fwp.mt.gov/cwd</a>.</li>
            <li><strong>Grizzly Bear Awareness:</strong> Essential in western and north-central Montana. Carry bear spray, store food properly, and be prepared for bears on carcasses.</li>
            <li><strong>Personal Locator Beacon:</strong> Cell service is nonexistent in much of the backcountry. Carry a PLB or satellite communicator.</li>
            <li><strong>Weather:</strong> Snow in September is common at elevation. Be prepared for cold, wet conditions at any time during the season.</li>
          </ul>

          <h2>Planning Resources</h2>
          <ul>
            <li><a href="https://fwp.mt.gov/gis/maps/huntPlanner/" target="_blank" rel="noopener noreferrer">FWP Hunt Planner Map</a> — district boundaries, public land, access points</li>
            <li><a href="https://fwp.mt.gov/hunt/regulations" target="_blank" rel="noopener noreferrer">FWP Regulations</a> — current-year regulation booklets (free PDFs)</li>
            <li><a href="https://fwp.mt.gov/buyandapply" target="_blank" rel="noopener noreferrer">MyFWP License Portal</a> — purchase licenses and apply for drawings</li>
            <li><a href="https://fwp.mt.gov/hunt/access/blockmanagement" target="_blank" rel="noopener noreferrer">Block Management Program</a> — maps for enrolled private land</li>
            <li><a href="https://myfwp.mt.gov/fwpPub/landsMgmt" target="_blank" rel="noopener noreferrer">FWP WMA Search</a> — searchable database of all WMAs</li>
            <li><a href="https://fwp.mt.gov/hunt/harvestreports" target="_blank" rel="noopener noreferrer">Harvest Reports</a> — annual harvest data by species and district</li>
          </ul>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          All season dates, license fees, and regulations reflect 2025–2026 information from Montana Fish, Wildlife &amp; Parks.
          Always verify current regulations at <a href="https://fwp.mt.gov" style={{ color: '#aaa' }}>fwp.mt.gov</a> before hunting.
        </p>

        {/* ─── CTAs ─── */}
        <div className="hunt-cta">
          <Link href="/planners/fly-fishing-guide" className="hunt-cta-primary">Fly Fishing Guide</Link>
          <Link href="/planners/hiking-guide" className="hunt-cta-secondary">Hiking Guide</Link>
          <Link href="/planners/campgrounds-guide" className="hunt-cta-secondary">Campgrounds Guide</Link>
          <Link href="/montana-towns" className="hunt-cta-secondary">Browse All Towns</Link>
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

  const areas: HuntingArea[] = load('hunting-areas.json');
  const seasons: SpeciesSeason[] = load('hunting-seasons.json');
  const licenses: LicenseCategory[] = load('hunting-licenses.json');

  areas.sort((a, b) => a.name.localeCompare(b.name));

  return { props: { areas, seasons, licenses } };
};
