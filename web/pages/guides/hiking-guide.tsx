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

const DirectoryMap = dynamic(() => import('../../components/DirectoryMap'), { ssr: false });

type HikingSite = {
  name: string;
  slug: string;
  category: 'trail' | 'state_park' | 'national_park' | 'waterfall';
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
  trails: HikingSite[];
  stateParks: HikingSite[];
  nationalPark: HikingSite[];
  waterfalls: HikingSite[];
  totalCount: number;
};

const CAT_LABELS: Record<string, string> = {
  trail: 'Trail / Trailhead',
  state_park: 'State Park',
  national_park: 'National Park',
  waterfall: 'Waterfall Trail',
};

const CAT_COLORS: Record<string, string> = {
  trail: '#8b6914',
  state_park: '#27ae60',
  national_park: '#2d7d46',
  waterfall: '#2980b9',
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

function HikeCard({ h }: { h: HikingSite }) {
  const color = CAT_COLORS[h.category] || '#3b6978';
  return (
    <div id={h.slug} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#204051' }}>{h.name}</h3>
          {h.rating != null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#d8973c' }}>
              <Stars rating={h.rating} />
              <span style={{ color: '#888', fontSize: '0.78rem', fontWeight: 500 }}>
                {h.rating.toFixed(1)}{h.reviews ? ` (${h.reviews.toLocaleString()})` : ''}
              </span>
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {CAT_LABELS[h.category]}
        </span>
      </div>
      <div style={{ padding: '0.5rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.85rem', color: '#555' }}>
          {h.address && <div><strong>Location:</strong> {h.address}</div>}
          <div><strong>Nearest Town:</strong> {h.nearestTownName}</div>
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <Link href={`/montana-towns/${h.nearestTown}`} style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}>
            {h.nearestTownName} Town Profile →
          </Link>
          {h.website && (
            <a href={h.website} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>
              Official Website →
            </a>
          )}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', textDecoration: 'none', fontWeight: 600 }}>
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HikingGuide({ trails, stateParks, nationalPark, waterfalls, totalCount }: Props) {
  const url = 'https://treasurestate.com/guides/hiking-guide/';
  const title = `Montana Hiking Guide: ${totalCount} Trails, State Parks & Trailheads`;
  const desc = `Explore ${totalCount} hiking trails and outdoor destinations across Montana. ${trails.length} trailheads, ${stateParks.length} state parks, ${nationalPark.length} national park trails, and ${waterfalls.length} waterfall hikes with Google ratings and directions.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners' },
    { name: 'Hiking Guide', url },
  ];

  const allHikes = [...nationalPark, ...stateParks, ...waterfalls, ...trails];

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

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana hiking trails, Montana trailheads, Montana state parks hiking, Glacier National Park trails, Montana waterfall hikes, best hikes Montana, hiking near Missoula, hiking near Bozeman" />
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
      <Hero title="Montana Hiking Guide" subtitle={`${totalCount} trails, state parks & trailheads`} image="/images/hero-image.jpg" alt="Hiking trail through Montana mountains" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .hk-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .hk-toc { background: #fff; border-radius: 10px; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        .hk-toc h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #204051; }
        .hk-toc-cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
        .hk-toc-cat { font-size: 0.85rem; padding: 0.4rem 0.8rem; border-radius: 6px; color: #fff; text-decoration: none; font-weight: 600; }
        .hk-toc-cat:hover { opacity: 0.85; }
        .hk-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .hk-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .hk-tips { background: #fef3e2; border-left: 4px solid #d8973c; border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem; margin: 2rem 0; }
        .hk-tips h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #8b6914; }
        .hk-tips ul { margin: 0; padding-left: 1.25rem; }
        .hk-tips li { font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 0.25rem; }
        .hk-cta { text-align: center; margin-top: 2rem; }
        .hk-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .hk-cta-primary { background: #3b6978; color: #fff; }
        .hk-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        @media (max-width: 600px) {
          .hk-toc-cats { flex-direction: column; }
        }
      `}} />

      <main className="hk-page">

        <div className="hk-toc">
          <h2>Browse by Category</h2>
          <div className="hk-toc-cats">
            <a href="#national-park" className="hk-toc-cat" style={{ background: CAT_COLORS.national_park }}>National Park ({nationalPark.length})</a>
            <a href="#state-parks" className="hk-toc-cat" style={{ background: CAT_COLORS.state_park }}>State Parks ({stateParks.length})</a>
            <a href="#waterfalls" className="hk-toc-cat" style={{ background: CAT_COLORS.waterfall }}>Waterfall Trails ({waterfalls.length})</a>
            <a href="#trails" className="hk-toc-cat" style={{ background: CAT_COLORS.trail }}>Trails & Trailheads ({trails.length})</a>
          </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          Montana is a hiker&apos;s paradise. From the alpine glaciers of Glacier National Park to
          the badlands formations of Makoshika State Park, the state offers unmatched variety.
          This directory covers {totalCount} hiking destinations across Montana, organized by type
          and sorted by visitor reviews. Every listing includes Google ratings and one-tap directions
          to the trailhead.
        </p>

        <DirectoryMap
          items={allHikes.map(h => ({ name: h.name, slug: h.slug, lat: h.lat, lng: h.lng, category: h.category, rating: h.rating, reviews: h.reviews, address: h.address }))}
          categoryColors={CAT_COLORS}
          categoryLabels={CAT_LABELS}
          height="400px"
        />

        <h2 id="national-park" className="hk-section-title">
          🏔️ National Park Trails <span className="hk-section-count">({nationalPark.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Iconic trails in and around Glacier National Park — plan ahead, as trailhead parking fills early in summer.
        </p>
        {nationalPark.map(h => <HikeCard key={h.slug} h={h} />)}

        <h2 id="state-parks" className="hk-section-title">
          🌲 State Parks with Trails <span className="hk-section-count">({stateParks.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Montana&apos;s state parks offer well-maintained trails with interpretive signs, picnic areas, and often campground access.
        </p>
        {stateParks.map(h => <HikeCard key={h.slug} h={h} />)}

        <h2 id="waterfalls" className="hk-section-title">
          💧 Waterfall Trails <span className="hk-section-count">({waterfalls.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Short-to-moderate hikes leading to Montana&apos;s most photogenic waterfalls.
        </p>
        {waterfalls.map(h => <HikeCard key={h.slug} h={h} />)}

        <h2 id="trails" className="hk-section-title">
          🥾 Trails &amp; Trailheads <span className="hk-section-count">({trails.length})</span>
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '1rem' }}>
          Community trails, forest service trailheads, and local hiking destinations across the state.
        </p>
        {trails.map(h => <HikeCard key={h.slug} h={h} />)}

        <div className="hk-tips">
          <h3>Montana Hiking Safety</h3>
          <ul>
            <li><strong>Bear spray:</strong> Carry it and know how to use it. Both grizzly and black bears are common throughout Montana.</li>
            <li><strong>Ten Essentials:</strong> Always bring navigation, sun protection, insulation, illumination, first aid, fire, repair tools, nutrition, hydration, and emergency shelter.</li>
            <li><strong>Weather:</strong> Mountain storms develop quickly. Start early and turn back if thunderstorms approach — lightning kills above treeline.</li>
            <li><strong>Stream crossings:</strong> Snowmelt-fed streams run highest in June and July. Cross early in the day when water levels are lowest.</li>
            <li><strong>Tell someone:</strong> Leave your itinerary with a friend. Cell service is nonexistent at most Montana trailheads.</li>
            <li><strong>Leave No Trace:</strong> Pack out all trash, stay on marked trails, and camp on durable surfaces at least 200 feet from water.</li>
            <li><strong>Permits:</strong> Glacier National Park requires vehicle reservations and backcountry permits. Check <a href="https://www.nps.gov/glac" target="_blank" rel="noopener noreferrer" style={{ color: '#8b6914' }}>nps.gov/glac</a> for current requirements.</li>
          </ul>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '1.5rem' }}>
          Trail conditions change seasonally. Many high-elevation trails are snow-covered through June. Check local ranger districts for current conditions.
        </p>

        <div className="hk-cta">
          <Link href="/guides/campgrounds-guide" className="hk-cta-primary">Campgrounds Directory</Link>
          <Link href="/guides/fly-fishing-guide" className="hk-cta-secondary">Fly Fishing Guide</Link>
          <Link href="/guides/hot-springs-guide" className="hk-cta-secondary">Hot Springs Guide</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'data', 'hiking.json');
  const all: HikingSite[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const trails = all.filter(h => h.category === 'trail');
  const stateParks = all.filter(h => h.category === 'state_park');
  const nationalPark = all.filter(h => h.category === 'national_park');
  const waterfalls = all.filter(h => h.category === 'waterfall');

  return {
    props: { trails, stateParks, nationalPark, waterfalls, totalCount: all.length },
  };
};
