import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { expediaUrl, vrboUrl } from '../../lib/affiliate-urls';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

const DirectoryMap = dynamic(() => import('../../components/DirectoryMap'), { ssr: false });

type HotSpring = {
  name: string;
  slug: string;
  type: 'resort' | 'community' | 'primitive';
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  location: string;
  tempF: string;
  hours: string;
  cost: string;
  access: string;
  hikeMiles: number | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  description: string;
  yearRound: boolean;
  clothingOptional: boolean;
  rating: number | null;
  reviews: number | null;
  state?: string;
  /** Step-by-step directions (primitive springs). Filled as we research. */
  directions?: string;
  /** Trailhead name or address (primitive springs). */
  trailhead?: string;
  /** AllTrails or similar trail page URL. */
  trailUrl?: string;
  /** USFS/BLM ranger district or info page URL. */
  landManagerUrl?: string;
};

type Props = {
  resorts: HotSpring[];
  community: HotSpring[];
  primitive: HotSpring[];
  nearBorder: HotSpring[];
  totalCount: number;
};

const TYPE_LABELS: Record<string, string> = {
  resort: 'Resort',
  community: 'Community',
  primitive: 'Primitive / Backcountry',
};

const TYPE_COLORS: Record<string, string> = {
  resort: '#3b6978',
  community: '#d8973c',
  primitive: '#5a8a5c',
};

function Stars({ rating }: { rating: number }) {
  const pct = (rating / 5) * 100;
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ position: 'relative', display: 'inline-block', fontSize: '0.95rem', letterSpacing: '1px' }}>
      <span style={{ color: '#ddd' }}>{'★★★★★'}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden', whiteSpace: 'nowrap', width: `${pct}%`, color: '#d8973c' }}>{'★★★★★'}</span>
    </span>
  );
}

function SpringCard({ s }: { s: HotSpring }) {
  const color = TYPE_COLORS[s.type] || '#3b6978';
  return (
    <div id={s.slug} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#204051' }}>{s.name}</h3>
          {s.rating != null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#d8973c' }}>
              <Stars rating={s.rating} />
              <span style={{ color: '#888', fontSize: '0.78rem', fontWeight: 500 }}>
                {s.rating.toFixed(1)}{s.reviews ? ` (${s.reviews.toLocaleString()})` : ''}
              </span>
            </span>
          )}
        </div>
        {s.type === 'resort' ? (
          <a
            href={expediaUrl(s.nearestTownName, s.nearestTown)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '999px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'none', display: 'inline-block' }}
            title="Find hotels near this resort on Expedia"
          >
            {TYPE_LABELS[s.type]}
          </a>
        ) : (
          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {TYPE_LABELS[s.type]}
          </span>
        )}
      </div>
      <div style={{ padding: '0.5rem 1.25rem 1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{s.description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.85rem', color: '#555' }}>
          <div><strong>Location:</strong> {s.location}{s.state === 'ID' ? ' (Idaho)' : ''}</div>
          <div><strong>Temperature:</strong> {s.tempF}°F</div>
          <div><strong>Hours:</strong> {s.hours}</div>
          <div><strong>Cost:</strong> {s.cost}</div>
          <div><strong>Access:</strong> {s.access}{s.hikeMiles ? ` (${s.hikeMiles} mi)` : ''}</div>
          <div><strong>Season:</strong> {s.yearRound ? 'Year-round' : 'Seasonal'}</div>
          {s.address && <div><strong>Address:</strong> {s.address}</div>}
          {s.trailhead && <div><strong>Trailhead:</strong> {s.trailhead}</div>}
          {s.directions && <div style={{ gridColumn: '1 / -1' }}><strong>Directions:</strong> {s.directions}</div>}
          {s.phone && <div><strong>Phone:</strong> <a href={`tel:${s.phone.replace(/[^+\d]/g, '')}`} style={{ color: '#3b6978', textDecoration: 'none' }}>{s.phone}</a></div>}
        </div>
        {(s.type === 'primitive' || s.state === 'ID') && (
          <p style={{ fontSize: '0.8rem', color: '#8a6d3b', background: '#fffbf0', borderLeft: '3px solid #d8973c', padding: '0.5rem 0.75rem', margin: '0.75rem 0 0', borderRadius: '0 4px 4px 0' }}>
            <strong>Verify before visiting.</strong> Directions here are intentionally general. Trails, road conditions, and access change with fires, floods, and seasons. Consult{' '}
            {(s.trailUrl || s.landManagerUrl) ? (
              <>
                {s.trailUrl && <a href={s.trailUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', fontWeight: 600 }}>trail info</a>}
                {s.trailUrl && s.landManagerUrl && ' or '}
                {s.landManagerUrl && <a href={s.landManagerUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', fontWeight: 600 }}>USFS/BLM</a>}
              </>
            ) : (
              <a href="https://www.alltrails.com" target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', fontWeight: 600 }}>AllTrails</a>
            )}
            , local ranger districts, or recent trip reports before you go.
          </p>
        )}
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <Link href={`/montana-towns/${s.nearestTown}`} style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}>
            {s.nearestTownName} Town Profile →
          </Link>
          {s.type === 'resort' && (
            <>
              <a href={expediaUrl(s.nearestTownName, s.nearestTown)} target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#204051', textDecoration: 'none', fontWeight: 600 }}>
                Find Hotels →
              </a>
              <a href={vrboUrl(s.nearestTownName, s.nearestTown)} target="_blank" rel="noopener noreferrer sponsored" style={{ color: '#204051', textDecoration: 'none', fontWeight: 600 }}>
                Find Vacation Rentals →
              </a>
            </>
          )}
          {s.website && (
            <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>
              Official Website →
            </a>
          )}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', textDecoration: 'none', fontWeight: 600 }}>
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HotSpringsGuide({ resorts, community, primitive, nearBorder, totalCount }: Props) {
  const url = 'https://treasurestate.com/guides/hot-springs-guide/';
  const title = `Montana Hot Springs Directory: All ${totalCount} Springs You Can Visit`;
  const desc = `Complete guide to every publicly accessible hot spring in and near Montana. ${resorts.length} resorts, ${community.length} community pools, and ${primitive.length + nearBorder.length} primitive backcountry soaks with temperatures, hours, costs, and access details.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners' },
    { name: 'Hot Springs Directory', url },
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

  const allSprings = [...resorts, ...community, ...primitive, ...nearBorder];

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana hot springs, Montana soaking, hot springs near me, backcountry hot springs Montana, primitive hot springs Montana, Montana hot springs resorts, hot springs Idaho Montana border" />
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
      <Hero title="Montana Hot Springs Directory" subtitle={`${totalCount} springs: resorts, community pools, and backcountry soaks`} image="/images/hero-image.jpg" alt="Natural hot spring in Montana" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .hs-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .hs-toc { background: #fff; border-radius: 10px; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        .hs-toc h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #204051; }
        .hs-toc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.35rem 1rem; }
        .hs-toc-grid a { font-size: 0.85rem; color: #3b6978; text-decoration: none; }
        .hs-toc-grid a:hover { text-decoration: underline; }
        .hs-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .hs-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .hs-safety { background: #fff8e1; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 2rem 0; }
        .hs-primitive-disclaimer { background: #fff8e1; border-left: 4px solid #8a6d3b; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 0 0 1.25rem; }
        .hs-primitive-disclaimer h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .hs-primitive-disclaimer p { margin: 0; font-size: 0.9rem; color: #555; line-height: 1.6; }
        .hs-safety h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8a6d3b; }
        .hs-safety ul { margin: 0; padding-left: 1.25rem; }
        .hs-safety li { font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 0.25rem; }
        .hs-cta { text-align: center; margin-top: 2rem; }
        .hs-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .hs-cta-primary { background: #3b6978; color: #fff; }
        .hs-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        @media (max-width: 600px) {
          .hs-toc-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <main className="hs-page">

        {/* Jump-to directory */}
        <div className="hs-toc">
          <h2>Jump to a Spring</h2>
          <div className="hs-toc-grid">
            {[...resorts, ...community, ...primitive, ...nearBorder].map(s => (
              <a key={s.slug} href={`#${s.slug}`}>{s.name}</a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana sits atop one of the most geothermally active regions in North America. With {totalCount} publicly
          accessible hot springs ranging from full-service resorts to primitive backcountry pools reached only by trail,
          there is a soak for every type of traveler. This directory covers every spring you can visit, including three
          popular springs just across the Idaho border that Montana locals consider part of their backyard.
        </p>

        <DirectoryMap
          items={allSprings.map(s => ({ name: s.name, slug: s.slug, lat: s.lat, lng: s.lng, category: s.type, rating: s.rating, reviews: s.reviews, address: s.address }))}
          categoryColors={{ resort: '#3b6978', community: '#d8973c', primitive: '#5a8a5c' }}
          categoryLabels={{ resort: 'Resort', community: 'Community', primitive: 'Primitive' }}
          height="400px"
        />

        {/* ─── RESORTS ─── */}
        <h2 className="hs-section-title">
          ♨️ Hot Spring Resorts <span className="hs-section-count">({resorts.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Developed facilities with pools, lodging, dining, and amenities. Admission fees apply.
        </p>
        {resorts.map(s => <SpringCard key={s.slug} s={s} />)}

        {/* ─── COMMUNITY ─── */}
        <h2 className="hs-section-title">
          🏘️ Community Hot Springs <span className="hs-section-count">({community.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Locally operated pools with basic facilities, changing rooms, and affordable admission.
        </p>
        {community.map(s => <SpringCard key={s.slug} s={s} />)}

        {/* ─── PRIMITIVE ─── */}
        <h2 className="hs-section-title">
          🏔️ Primitive &amp; Backcountry Springs <span className="hs-section-count">({primitive.length})</span>
        </h2>
        <div className="hs-primitive-disclaimer">
          <h3>⚠️ Important: Directions Are General</h3>
          <p>
            We intentionally keep primitive spring directions vague to protect fragile sites and because access changes constantly. Trails wash out, roads close for fire or flood, and private land boundaries shift. <strong>Do not rely on this guide alone.</strong> Before visiting any primitive spring, consult current trail reports (AllTrails, Gaia, etc.), the local USFS or BLM ranger district, and recent trip reports. Conditions can be dangerous—source water often exceeds 140°F, and backcountry travel carries inherent risk.
          </p>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Undeveloped natural pools: free, no facilities, and often requiring a hike to reach. Bring bear spray and pack out all trash.
        </p>
        {primitive.map(s => <SpringCard key={s.slug} s={s} />)}

        {/* ─── NEAR-BORDER ─── */}
        <h2 className="hs-section-title">
          🗺️ Near-Border Springs (Idaho) <span className="hs-section-count">({nearBorder.length})</span>
        </h2>
        <div className="hs-primitive-disclaimer">
          <h3>⚠️ Same Caveats Apply</h3>
          <p>
            These springs are in Idaho but popular with Montana visitors. Directions are general—verify trailhead locations, road conditions, and closures (e.g., Jerry Johnson and Weir Creek enforce 6am–8pm hours) before you go.
          </p>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          These popular backcountry springs are just across the Idaho border, easily accessible from western Montana towns via Highway 12 or Highway 93.
        </p>
        {nearBorder.map(s => <SpringCard key={s.slug} s={s} />)}

        {/* ─── SAFETY ─── */}
        <div className="hs-safety">
          <h3>Hot Springs Safety &amp; Etiquette</h3>
          <ul>
            <li><strong>Hydrate:</strong> Geothermal water and high altitudes cause rapid dehydration. Bring plenty of drinking water.</li>
            <li><strong>Bear country:</strong> Backcountry springs are in bear habitat. Carry bear spray and make noise on trails.</li>
            <li><strong>Leave no trace:</strong> Pack out all trash. Never bring glass containers to primitive springs.</li>
            <li><strong>No soap or shampoo:</strong> Chemicals contaminate natural pools and harm aquatic life.</li>
            <li><strong>Check conditions:</strong> Springs close for fires, floods, and high water. Verify access before traveling.</li>
            <li><strong>Test temperature:</strong> Source water can exceed 140°F. Always test before entering and mix with cool water.</li>
            <li><strong>Respect closures:</strong> Nighttime closures at some primitive springs are enforced with citations.</li>
          </ul>
        </div>

        {/* ─── PHOTOGRAPHY CREDIT ─── */}
        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '1.5rem' }}>
          Hours, prices, and seasonal availability may change. Contact individual springs to confirm before visiting.
          All photography original and locally captured.
        </p>

        {/* ─── CTAs ─── */}
        <div className="hs-cta">
          <Link href="/best-of/towns-near-hot-springs" className="hs-cta-primary">Top 10 Towns Near Hot Springs</Link>
          <Link href="/guides/fly-fishing-guide" className="hs-cta-secondary">Fly Fishing Guide</Link>
          <Link href="/montana-towns" className="hs-cta-secondary">Browse All 134 Towns</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'data', 'hot-springs.json');
  const all: HotSpring[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const resorts = all.filter(s => s.type === 'resort' && !s.state);
  const community = all.filter(s => s.type === 'community' && !s.state);
  const primitive = all.filter(s => s.type === 'primitive' && !s.state);
  const nearBorder = all.filter(s => s.state === 'ID');

  return {
    props: {
      resorts,
      community,
      primitive,
      nearBorder,
      totalCount: all.length,
    },
  };
};
