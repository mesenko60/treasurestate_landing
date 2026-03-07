import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

type Campground = {
  name: string;
  slug: string;
  category: 'koa' | 'state' | 'public' | 'rv' | 'private';
  lat: number;
  lng: number;
  nearestTown: string;
  nearestTownName: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
};

type Props = {
  koa: Campground[];
  state: Campground[];
  publicLand: Campground[];
  rv: Campground[];
  privateCamps: Campground[];
  totalCount: number;
};

const CAT_LABELS: Record<string, string> = {
  koa: 'KOA',
  state: 'State Park',
  public: 'Public Land',
  rv: 'RV Park',
  private: 'Private',
};

const CAT_COLORS: Record<string, string> = {
  koa: '#c0392b',
  state: '#27ae60',
  public: '#2980b9',
  rv: '#8e44ad',
  private: '#d8973c',
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ letterSpacing: '1px', fontSize: '0.95rem' }}>
      {'★'.repeat(full)}{half ? '⯨' : ''}{'☆'.repeat(empty)}
    </span>
  );
}

function CampCard({ c }: { c: Campground }) {
  const color = CAT_COLORS[c.category] || '#3b6978';
  return (
    <div id={c.slug} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#204051' }}>{c.name}</h3>
          {c.rating != null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#d8973c' }}>
              <Stars rating={c.rating} />
              <span style={{ color: '#888', fontSize: '0.78rem', fontWeight: 500 }}>
                {c.rating.toFixed(1)}{c.reviews ? ` (${c.reviews.toLocaleString()})` : ''}
              </span>
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {CAT_LABELS[c.category]}
        </span>
      </div>
      <div style={{ padding: '0.5rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.85rem', color: '#555' }}>
          {c.address && <div><strong>Address:</strong> {c.address}</div>}
          {c.phone && <div><strong>Phone:</strong> <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} style={{ color: '#3b6978', textDecoration: 'none' }}>{c.phone}</a></div>}
          <div><strong>Nearest Town:</strong> {c.nearestTownName}</div>
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <Link href={`/montana-towns/${c.nearestTown}`} style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}>
            {c.nearestTownName} Town Profile →
          </Link>
          {c.website && (
            <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>
              Official Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CampgroundsGuide({ koa, state, publicLand, rv, privateCamps, totalCount }: Props) {
  const url = 'https://treasurestate.com/planners/campgrounds-guide/';
  const title = `Montana Campgrounds Directory: ${totalCount} Campgrounds & RV Parks`;
  const desc = `Complete guide to ${totalCount} campgrounds and RV parks across Montana. ${koa.length} KOA locations, ${state.length} state park campgrounds, ${rv.length} RV parks, and ${privateCamps.length} private campgrounds with ratings, addresses, and phone numbers.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners' },
    { name: 'Campgrounds Directory', url },
  ];

  const allCamps = [...koa, ...state, ...publicLand, ...rv, ...privateCamps];

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
    name: 'Montana Campgrounds & RV Parks',
    numberOfItems: totalCount,
    itemListElement: allCamps.map((c, i) => {
      const item: Record<string, unknown> = {
        '@type': 'Campground',
        name: c.name,
        geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
      };
      if (c.address) item.address = c.address;
      if (c.phone) item.telephone = c.phone;
      if (c.rating != null && c.reviews) {
        item.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: c.rating,
          bestRating: 5,
          ratingCount: c.reviews,
        };
      }
      return { '@type': 'ListItem', position: i + 1, item };
    }),
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana campgrounds, Montana RV parks, Montana camping, KOA Montana, state park campgrounds Montana, free camping Montana, dispersed camping Montana, Montana camp sites" />
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
      <Hero title="Montana Campgrounds Directory" subtitle={`${totalCount} campgrounds & RV parks across Big Sky Country`} image="/images/hero-image.jpg" alt="Campsite in the Montana mountains" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .cg-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .cg-toc { background: #fff; border-radius: 10px; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        .cg-toc h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #204051; }
        .cg-toc-cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
        .cg-toc-cat { font-size: 0.85rem; padding: 0.4rem 0.8rem; border-radius: 6px; color: #fff; text-decoration: none; font-weight: 600; }
        .cg-toc-cat:hover { opacity: 0.85; }
        .cg-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .cg-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .cg-tips { background: #e8f5e9; border-left: 4px solid #27ae60; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 2rem 0; }
        .cg-tips h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #2e7d32; }
        .cg-tips ul { margin: 0; padding-left: 1.25rem; }
        .cg-tips li { font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 0.25rem; }
        .cg-cta { text-align: center; margin-top: 2rem; }
        .cg-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .cg-cta-primary { background: #3b6978; color: #fff; }
        .cg-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        @media (max-width: 600px) {
          .cg-toc-cats { flex-direction: column; }
        }
      `}} />

      <main className="cg-page">

        {/* Category jump links */}
        <div className="cg-toc">
          <h2>Browse by Category</h2>
          <div className="cg-toc-cats">
            <a href="#koa" className="cg-toc-cat" style={{ background: CAT_COLORS.koa }}>KOA ({koa.length})</a>
            <a href="#state" className="cg-toc-cat" style={{ background: CAT_COLORS.state }}>State Parks ({state.length})</a>
            <a href="#public" className="cg-toc-cat" style={{ background: CAT_COLORS.public }}>Public Land ({publicLand.length})</a>
            <a href="#rv" className="cg-toc-cat" style={{ background: CAT_COLORS.rv }}>RV Parks ({rv.length})</a>
            <a href="#private" className="cg-toc-cat" style={{ background: CAT_COLORS.private }}>Private ({privateCamps.length})</a>
          </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana offers some of the most scenic camping in the American West, from full-service KOA
          resorts with pools and playgrounds to remote forest service campgrounds surrounded by nothing
          but mountains and wildlife. This directory covers {totalCount} campgrounds and RV parks across
          the state, organized by type and sorted by visitor reviews.
        </p>

        {/* ─── KOA ─── */}
        <h2 id="koa" className="cg-section-title">
          🏕️ KOA Campgrounds <span className="cg-section-count">({koa.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Kampgrounds of America locations with full hookups, pull-through sites, cabins, and resort amenities.
        </p>
        {koa.map(c => <CampCard key={c.slug} c={c} />)}

        {/* ─── STATE ─── */}
        <h2 id="state" className="cg-section-title">
          🌲 State Park Campgrounds <span className="cg-section-count">({state.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Montana Fish, Wildlife & Parks campgrounds in scenic state park settings. Reservations recommended in summer.
        </p>
        {state.map(c => <CampCard key={c.slug} c={c} />)}

        {/* ─── PUBLIC LAND ─── */}
        <h2 id="public" className="cg-section-title">
          🏔️ National Forest &amp; BLM <span className="cg-section-count">({publicLand.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Campgrounds on National Forest and Bureau of Land Management land. Often more rustic with lower fees.
        </p>
        {publicLand.map(c => <CampCard key={c.slug} c={c} />)}

        {/* ─── RV PARKS ─── */}
        <h2 id="rv" className="cg-section-title">
          🚐 RV Parks <span className="cg-section-count">({rv.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Dedicated RV parks with full hookups, dump stations, laundry, and often pull-through sites for larger rigs.
        </p>
        {rv.map(c => <CampCard key={c.slug} c={c} />)}

        {/* ─── PRIVATE ─── */}
        <h2 id="private" className="cg-section-title">
          ⛺ Private Campgrounds <span className="cg-section-count">({privateCamps.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Independently owned campgrounds offering a range of amenities from basic tent sites to full-service camps.
        </p>
        {privateCamps.map(c => <CampCard key={c.slug} c={c} />)}

        {/* ─── TIPS ─── */}
        <div className="cg-tips">
          <h3>Montana Camping Tips</h3>
          <ul>
            <li><strong>Bear country:</strong> All of Montana is bear habitat. Store food in bear boxes or hang it. Carry bear spray.</li>
            <li><strong>Fire restrictions:</strong> Summer fire bans are common. Check current restrictions at your ranger district before building a campfire.</li>
            <li><strong>Water:</strong> Even in developed campgrounds, treat or filter water from natural sources. Not all sites have potable water.</li>
            <li><strong>Reservations:</strong> Popular campgrounds near Glacier, Yellowstone, and Flathead Lake fill months ahead. Book early.</li>
            <li><strong>Dispersed camping:</strong> Free dispersed camping is allowed on most National Forest and BLM land. Follow Leave No Trace principles.</li>
            <li><strong>Weather:</strong> Mountain weather changes fast. Be prepared for cold nights even in summer, especially above 5,000 feet.</li>
            <li><strong>Cell service:</strong> Many campgrounds have no cell coverage. Download maps and confirm directions before leaving town.</li>
          </ul>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '1.5rem' }}>
          Rates, availability, and seasonal hours may change. Contact individual campgrounds to confirm before visiting.
        </p>

        <div className="cg-cta">
          <Link href="/planners/hot-springs-guide" className="cg-cta-primary">Hot Springs Directory</Link>
          <Link href="/montana-towns" className="cg-cta-secondary">Browse All 134 Towns</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'data', 'campgrounds.json');
  const all: Campground[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const koa = all.filter(c => c.category === 'koa');
  const state = all.filter(c => c.category === 'state');
  const publicLand = all.filter(c => c.category === 'public');
  const rv = all.filter(c => c.category === 'rv');
  const privateCamps = all.filter(c => c.category === 'private');

  return {
    props: { koa, state, publicLand, rv, privateCamps, totalCount: all.length },
  };
};
