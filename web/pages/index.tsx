import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppInstallCTA from '../components/AppInstallCTA';
import HomepageCultureModule from '../components/HomepageCultureModule';
import TodayInHistory from '../components/TodayInHistory';
import { isEnabled } from '../lib/feature-flags';
import { getFeaturedArticles, getFeaturedFieldNotes, type ArticleSummary, type FieldNote } from '../lib/articles';

type FeaturedTown = {
  slug: string;
  name: string;
  nickname: string | null;
  population: number | null;
  medianHomeValue: number | null;
  recCount: number;
  hasImage: boolean;
};

type Ranking = {
  slug: string;
  title: string;
  icon: string;
};

type DataSource = {
  label: string;
  lastCollected: string;
};

type Props = {
  featuredTowns: FeaturedTown[];
  totalTowns: number;
  totalGuides: number;
  totalRankings: number;
  totalComparisons: number;
  featuredRankings: Ranking[];
  dataSources: DataSource[];
  cultureArticles: ArticleSummary[];
  cultureFieldNotes: FieldNote[];
};

const FEATURED_RANKINGS: Ranking[] = [
  { slug: 'best-towns-for-families', title: 'Best for Families', icon: '👨‍👩‍👧‍👦' },
  { slug: 'best-towns-for-retirees', title: 'Best for Retirees', icon: '🌅' },
  { slug: 'most-affordable-towns', title: 'Most Affordable', icon: '💰' },
  { slug: 'best-outdoor-recreation', title: 'Best Recreation', icon: '🏔️' },
  { slug: 'best-ski-towns', title: 'Best Ski Towns', icon: '⛷️' },
  { slug: 'best-towns-for-digital-nomads', title: 'Best for Digital Nomads', icon: '💻' },
];

function fmt(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  return `$${Math.round(n / 1000).toLocaleString('en-US')}K`;
}

export default function Home({ featuredTowns, totalTowns, totalGuides, totalRankings, totalComparisons, featuredRankings, dataSources, cultureArticles, cultureFieldNotes }: Props) {
  const siteTitle = 'Find Yourself in Montana | Treasure State';
  const siteDesc = `The complete guide to living and exploring Montana. Compare housing, cost of living, schools, and outdoor recreation across ${totalTowns} towns. Plan your move or your next adventure.`;

  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/" />
        <link rel="preload" as="image" href="/images/hero-image-480.webp" type="image/webp" imageSrcSet="/images/hero-image-480.webp 480w, /images/hero-image-800.webp 800w, /images/hero-image.webp 1500w" imageSizes="100vw" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta name="keywords" content="Montana towns, move to Montana, visit Montana, Montana travel, Montana cost of living, Montana recreation, Montana skiing, Montana fishing, Montana hot springs" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://treasurestate.com/" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDesc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />

      {/* ─── HERO ─── */}
      <header className="hero-section" style={{ position: 'relative' }}>
        <picture>
          <source
            type="image/webp"
            srcSet="/images/hero-image-480.webp 480w, /images/hero-image-800.webp 800w, /images/hero-image.webp 1500w"
            sizes="100vw"
          />
          <img
            src="/images/hero-image.jpg"
            alt="Montana mountain landscape with blue sky"
            className="hero-image"
            style={{ position: 'absolute', height: '100%', width: '100%', inset: '0', objectFit: 'cover', objectPosition: 'center' }}
            decoding="async"
          />
        </picture>
        <div className="hero-text">
          <h1>Find Yourself in Montana<sup style={{ fontSize: '0.28em', verticalAlign: 'super', fontWeight: 400 }}>&trade;</sup></h1>
          <p style={{ maxWidth: '660px', margin: '0.5rem auto 0', fontSize: '1.15rem' }}>
            The complete guide to living and exploring Montana
          </p>
          <div className="hp-hero-btns">
            <a href="#relocate" className="hp-hero-btn hp-hero-btn--primary">I&rsquo;m Moving</a>
            <a href="#visit" className="hp-hero-btn hp-hero-btn--secondary">I&rsquo;m Visiting</a>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('openSearch'))}
            aria-label="Open search"
            className="hp-hero-search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ flex: 1, textAlign: 'left', color: '#9ca3af', fontFamily: "'Montserrat', sans-serif", fontSize: '0.95rem', fontWeight: 500 }}>
              Search Montana...
            </span>
            <kbd style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', color: '#9ca3af', background: '#f9fafb' }}>⌘K</kbd>
          </button>
          <div className="hp-hero-history">
            <TodayInHistory variant="pill" tone="glass" />
          </div>
        </div>
      </header>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hero search bar */
        .hp-hero-search { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.95); border: none; border-radius: 8px; padding: 10px 18px; margin: 2.5rem auto 0; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.25); max-width: 340px; width: auto; transition: box-shadow 0.2s, transform 0.2s; }
        .hp-hero-search:hover { box-shadow: 0 6px 28px rgba(0,0,0,0.35); transform: translateY(-2px); }

        /* Hero buttons */
        .hp-hero-btns { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: nowrap; }
        .hp-hero-btn { display: inline-block; padding: 0.85rem 2.25rem; border-radius: 8px; font-family: var(--font-primary); font-weight: 700; font-size: 1.05rem; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; letter-spacing: 0.3px; }
        .hp-hero-btn--primary { background: var(--secondary); color: var(--white); box-shadow: 0 4px 16px rgba(216,151,60,0.4); }
        .hp-hero-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(216,151,60,0.55); }
        .hp-hero-btn--secondary { background: rgba(255,255,255,0.95); color: var(--dark); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .hp-hero-btn--secondary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }

        /* Sections */
        .hp-section { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1rem; }
        .hp-section-title { font-family: var(--font-primary); font-size: 1.75rem; color: var(--dark); text-align: center; margin-bottom: 0.4rem; }
        .hp-section-sub { text-align: center; color: var(--text-light); font-size: 1rem; margin-bottom: 2rem; }

        /* Path cards (two-column) */
        .hp-paths { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; max-width: 1000px; margin: 0 auto; transform: translateY(-15px); margin-bottom: -15px; position: relative; z-index: 2; padding: 0 1rem; }
        .hp-hero-history { max-width: 660px; margin: 0.8rem auto 0; }
        .hp-path-card { background: var(--white); border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); padding: 2rem 1.75rem; text-decoration: none; color: var(--dark); transition: transform 0.2s, box-shadow 0.2s; }
        .hp-path-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .hp-path-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .hp-path-icon { font-size: 1.75rem; }
        .hp-path-title { font-family: var(--font-primary); font-weight: 700; font-size: 1.25rem; }
        .hp-path-desc { font-size: 0.92rem; color: var(--text-light); line-height: 1.6; margin-bottom: 1rem; }
        .hp-path-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .hp-path-link { display: inline-block; padding: 0.4rem 0.85rem; background: var(--gray-light); border-radius: 6px; font-size: 0.82rem; font-family: var(--font-primary); font-weight: 600; color: var(--primary); transition: background 0.2s, color 0.2s; }
        .hp-path-link:hover { background: var(--primary); color: var(--white); }

        /* Ranking pills */
        .hp-rankings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .hp-rank-card { background: var(--white); border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.25rem; text-decoration: none; color: var(--dark); transition: transform 0.2s, box-shadow 0.2s; display: flex; align-items: center; gap: 0.75rem; }
        .hp-rank-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
        .hp-rank-icon { font-size: 2rem; flex-shrink: 0; }
        .hp-rank-title { font-family: var(--font-primary); font-weight: 600; font-size: 0.95rem; }
        .hp-rank-cta { font-size: 0.8rem; color: var(--primary); margin-top: 0.2rem; }

        /* Travel planner CTA */
        .hp-travel-cta { background: linear-gradient(135deg, #1a3a4a 0%, var(--primary) 100%); border-radius: 14px; padding: 2.5rem 2rem; display: flex; align-items: center; gap: 2.5rem; }
        .hp-travel-cta-text { flex: 1; }
        .hp-travel-cta-text h2 { color: var(--white); font-size: 1.5rem; margin-bottom: 0.5rem; }
        .hp-travel-cta-text p { color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem; }
        .hp-travel-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .hp-travel-link { display: inline-block; padding: 0.65rem 1.25rem; border-radius: 6px; font-family: var(--font-primary); font-weight: 600; font-size: 0.9rem; text-decoration: none; transition: transform 0.2s; }
        .hp-travel-link--primary { background: var(--secondary); color: var(--white); }
        .hp-travel-link--primary:hover { transform: translateY(-2px); }
        .hp-travel-link--ghost { background: rgba(255,255,255,0.15); color: var(--white); border: 1px solid rgba(255,255,255,0.3); }
        .hp-travel-link--ghost:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }

        /* Adventure grid */
        .hp-adventure-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 0.25rem; }
        .hp-adv-card { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 1rem 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; text-decoration: none; color: var(--white); transition: background 0.2s, transform 0.2s; }
        .hp-adv-card:hover { background: rgba(255,255,255,0.2); transform: translateY(-3px); }
        .hp-adv-icon { font-size: 1.75rem; }
        .hp-adv-label { font-family: var(--font-primary); font-size: 0.8rem; font-weight: 600; text-align: center; line-height: 1.3; }

        /* Featured towns */
        .hp-towns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .hp-town-card { background: var(--white); border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); overflow: hidden; text-decoration: none; color: var(--dark); transition: transform 0.2s, box-shadow 0.2s; }
        .hp-town-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .hp-town-img { position: relative; width: 100%; height: 160px; background: var(--gray); }
        .hp-town-body { padding: 1rem 1.25rem; }
        .hp-town-name { font-family: var(--font-primary); font-weight: 700; font-size: 1.15rem; margin-bottom: 0.15rem; }
        .hp-town-nick { font-size: 0.82rem; color: var(--text-light); font-style: italic; margin-bottom: 0.6rem; }
        .hp-town-stats { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hp-town-stat { font-size: 0.82rem; color: var(--text-light); }
        .hp-town-stat strong { color: var(--dark); display: block; font-size: 1rem; }

        /* Relocation CTA */
        .hp-relo-cta { background: linear-gradient(135deg, var(--dark) 0%, var(--primary) 100%); border-radius: 14px; padding: 2.5rem 2rem; text-align: center; color: var(--white); }
        .hp-relo-cta h2 { color: var(--white); font-size: 1.5rem; margin-bottom: 0.5rem; }
        .hp-relo-cta p { color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-bottom: 1.25rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .hp-relo-btn { display: inline-block; padding: 0.85rem 2rem; background: var(--secondary); color: var(--white); border-radius: 8px; text-decoration: none; font-weight: 700; font-family: var(--font-primary); font-size: 1rem; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(216,151,60,0.3); }
        .hp-relo-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(216,151,60,0.45); }

        /* Shop teaser */
        .hp-shop { background: var(--white); border-radius: 12px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 2rem; }
        .hp-shop-text { flex: 1; }
        .hp-shop-text h3 { font-size: 1.15rem; margin-bottom: 0.35rem; }
        .hp-shop-text p { font-size: 0.9rem; color: var(--text-light); line-height: 1.6; margin-bottom: 0; }
        .hp-shop-link { flex-shrink: 0; padding: 0.65rem 1.5rem; border: 2px solid var(--secondary); color: var(--secondary); border-radius: 8px; text-decoration: none; font-family: var(--font-primary); font-weight: 600; font-size: 0.9rem; transition: background 0.2s, color 0.2s; }
        .hp-shop-link:hover { background: var(--secondary); color: var(--white); }

        /* About snippet */
        .hp-about { background: var(--white); border-radius: 12px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .hp-about h2 { font-size: 1.3rem; margin-bottom: 0.5rem; }
        .hp-about p { font-size: 0.92rem; color: var(--text-light); line-height: 1.7; margin-bottom: 0.75rem; }
        .hp-about-link { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.92rem; }
        .hp-about-link:hover { text-decoration: underline; }

        /* Data credibility footer */
        .hp-credibility { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem 2.5rem; }
        .hp-cred-inner { background: var(--white); border-radius: 10px; padding: 1.5rem 2rem; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .hp-cred-title { font-family: var(--font-primary); font-size: 0.85rem; font-weight: 600; color: var(--dark); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
        .hp-cred-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.5rem 1.5rem; }
        .hp-cred-item { font-size: 0.78rem; color: var(--text-light); line-height: 1.5; }
        .hp-cred-item strong { color: var(--text); font-weight: 600; }
        .hp-cred-note { margin-top: 0.75rem; font-size: 0.75rem; color: #aaa; font-style: italic; }

        /* Responsive */
        @media (max-width: 900px) {
          .hp-paths { grid-template-columns: 1fr; max-width: 540px; }
          .hp-rankings { grid-template-columns: repeat(2, 1fr); }
          .hp-towns { grid-template-columns: repeat(2, 1fr); }
          .hp-travel-cta { flex-direction: column; text-align: center; gap: 1.5rem; }
          .hp-travel-links { justify-content: center; }
          .hp-adventure-grid { grid-template-columns: repeat(4, 1fr); }
          .hp-shop { flex-direction: column; text-align: center; }
        }
        @media (max-width: 600px) {
          .hp-hero-history { margin-top: 0.7rem; }
          .hp-paths { padding: 0 0.75rem; }
          .hp-path-card { padding: 1.5rem 1.25rem; }
          .hp-hero-btns { gap: 0.6rem; }
          .hp-hero-btn { padding: 0.7rem 1.4rem; font-size: 0.9rem; }
          .hp-rankings { grid-template-columns: 1fr; }
          .hp-towns { grid-template-columns: 1fr; }
          .hp-section { padding: 2rem 0.75rem; }
          .hp-section-title { font-size: 1.4rem; }
          .hp-relo-cta { padding: 2rem 1.25rem; border-radius: 10px; }
          .hp-relo-cta h2 { font-size: 1.3rem; }
          .hp-travel-cta { padding: 2rem 1.25rem; border-radius: 10px; }
          .hp-adventure-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-adv-icon { font-size: 1.5rem; }
          .hp-adv-card { padding: 0.75rem 0.4rem; }
          .hp-town-stats { gap: 0.75rem; }
          .hp-cred-grid { grid-template-columns: 1fr 1fr; }
        }
      `}} />

      {/* ═══ 1. SEGMENTATION — TWO PRIMARY PATHS ═══ */}
      <div className="hp-paths" role="navigation" aria-label="Choose your path">
        <div id="relocate" className="hp-path-card">
          <div className="hp-path-header">
            <div className="hp-path-icon" aria-hidden="true">🏡</div>
            <div className="hp-path-title">Move to Montana</div>
          </div>
          <div className="hp-path-desc">
            Data-driven relocation tools: compare cost of living, housing, jobs, schools, and healthcare across {totalTowns} towns.
          </div>
          <div className="hp-path-links">
            <Link href="/montana-towns" className="hp-path-link">Town Profiles</Link>
            <Link href="/compare" className="hp-path-link">Compare Towns</Link>
            <Link href="/guides" className="hp-path-link">Moving Guides</Link>
            <Link href="/best-of/most-affordable-towns" className="hp-path-link">Most Affordable</Link>
          </div>
        </div>

        <div id="visit" className="hp-path-card">
          <div className="hp-path-header">
            <div className="hp-path-icon" aria-hidden="true">🏔️</div>
            <div className="hp-path-title">Visit Montana</div>
          </div>
          <div className="hp-path-desc">
            Discover world-class skiing, fly fishing, hot springs, national parks, and scenic backroads across Big Sky Country.
          </div>
          <div className="hp-path-links">
            <Link href="/best-of/best-ski-towns" className="hp-path-link">Ski Towns</Link>
            <Link href="/best-of/best-fishing-towns" className="hp-path-link">Fishing</Link>
            <Link href="/guides/fly-fishing-guide" className="hp-path-link">Fly Fishing Guide</Link>
            <Link href="/best-of/towns-near-hot-springs" className="hp-path-link">Hot Springs</Link>
            <Link href="/lodging" className="hp-path-link">Find Lodging</Link>
            <Link href="/planners" className="hp-path-link">Travel Guides</Link>
            <Link href="/this-day-in-history" className="hp-path-link">This Day in History</Link>
          </div>
        </div>
      </div>

      <main style={{ background: 'var(--gray-light)' }}>

        {/* ═══ 2. RELOCATION TOOLS ═══ */}
        <section className="hp-section" id="relocation-tools">
          <h2 className="hp-section-title">Relocation Tools</h2>
          <p className="hp-section-sub">Everything you need to find the right Montana town</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { href: '/montana-towns', icon: '🗺️', label: 'Browse Towns', desc: `${totalTowns} detailed profiles` },
              { href: '/compare', icon: '⚖️', label: 'Compare Towns', desc: `${totalComparisons} side-by-side pairs` },
              { href: '/guides', icon: '📋', label: 'Moving Guides', desc: `${totalGuides} relocation guides` },
              { href: '/best-of', icon: '🏆', label: 'Best Of Rankings', desc: `${totalRankings} data-driven lists` },
            ].map(t => (
              <Link key={t.href} href={t.href} style={{ background: 'var(--white)', borderRadius: '10px', padding: '1.25rem', textDecoration: 'none', color: 'var(--dark)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.75rem', flexShrink: 0 }} aria-hidden="true">{t.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{t.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ 3. TRAVEL / VISIT BLOCK ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }} id="travel-planner">
          <div className="hp-travel-cta">
            <div className="hp-travel-cta-text">
              <h2>Explore Montana&rsquo;s Best Adventures</h2>
              <p>
                World-class skiing, legendary fly fishing, natural hot springs, stunning national parks, scenic backroads, and wide-open wilderness. Discover what makes Big Sky Country unforgettable.
              </p>
              <div className="hp-adventure-grid">
                <Link href="/best-of/best-ski-towns" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">⛷️</span>
                  <span className="hp-adv-label">Skiing &amp; Snowboarding</span>
                </Link>
                <Link href="/best-of/best-fishing-towns" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🎣</span>
                  <span className="hp-adv-label">Fly Fishing</span>
                </Link>
                <Link href="/guides/hot-springs-guide" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">♨️</span>
                  <span className="hp-adv-label">Hot Springs</span>
                </Link>
                <Link href="/best-of/best-towns-near-glacier-yellowstone" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🏞️</span>
                  <span className="hp-adv-label">Glacier &amp; Yellowstone</span>
                </Link>
                <Link href="/best-of/best-outdoor-recreation" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🥾</span>
                  <span className="hp-adv-label">Hiking &amp; Trails</span>
                </Link>
                <Link href="/guides/montana-backroads" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🛣️</span>
                  <span className="hp-adv-label">Scenic Backroads</span>
                </Link>
                <Link href="/lodging" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🏨</span>
                  <span className="hp-adv-label">Where to Stay</span>
                </Link>
                <Link href="/best-of/best-small-towns" className="hp-adv-card">
                  <span className="hp-adv-icon" aria-hidden="true">🏡</span>
                  <span className="hp-adv-label">Charming Small Towns</span>
                </Link>
              </div>
              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <Link href="/planners" className="hp-travel-link hp-travel-link--primary">All Travel Guides</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3b. APP INSTALL CTA ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <AppInstallCTA
              variant="card"
              headline="Explore on the go"
              body="Get notified when you pass historic markers, hot springs, and trails. Add Treasure State to your home screen."
            />
          </div>
        </section>

        {/* ═══ 4. BEST OF RANKINGS ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <h2 className="hp-section-title">Best of Montana Rankings</h2>
          <p className="hp-section-sub">Find the right town for your lifestyle</p>
          <div className="hp-rankings">
            {featuredRankings.map(r => (
              <Link key={r.slug} href={`/best-of/${r.slug}`} className="hp-rank-card">
                <div className="hp-rank-icon" aria-hidden="true">{r.icon}</div>
                <div>
                  <div className="hp-rank-title">{r.title}</div>
                  <div className="hp-rank-cta">View top 10 →</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link href="/best-of" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              See all {totalRankings} rankings →
            </Link>
          </div>
        </section>

        {/* ═══ 5. FEATURED TOWNS ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <h2 className="hp-section-title">Popular Montana Towns</h2>
          <p className="hp-section-sub">Explore profiles with housing, recreation, schools, and more</p>
          <div className="hp-towns">
            {featuredTowns.map(t => (
              <Link key={t.slug} href={`/montana-towns/${t.slug}`} className="hp-town-card">
                <div className="hp-town-img" style={{ position: 'relative' }}>
                  <picture>
                    {t.hasImage ? (
                      <source type="image/webp" srcSet={`/images/towns/${t.slug}-480.webp 480w, /images/towns/${t.slug}-800.webp 800w, /images/towns/${t.slug}.webp 1500w`} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                    ) : (
                      <source type="image/webp" srcSet="/images/towns/default-town-480.webp 480w, /images/towns/default-town-800.webp 800w, /images/towns/default-town.webp 1500w" sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                    )}
                    <img
                      src={t.hasImage ? `/images/towns/${t.slug}.jpg` : '/images/towns/default-town.jpg'}
                      alt={`${t.name}, Montana`}
                      loading="lazy"
                      style={{ position: 'absolute', height: '100%', width: '100%', inset: '0', objectFit: 'cover' }}
                    />
                  </picture>
                  {t.slug === 'billings' && (
                    <div style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                      Photo: Quintin Soloviev / Wikimedia Commons (CC BY 4.0)
                    </div>
                  )}
                  {t.slug === 'bozeman' && (
                    <div style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                      Photo: Chris06 / Wikimedia Commons (CC BY-SA 3.0)
                    </div>
                  )}
                  {t.slug === 'helena' && (
                    <div style={{ position: 'absolute', bottom: '4px', right: '6px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                      Photo: RTC / Wikimedia Commons (CC BY-SA 3.0)
                    </div>
                  )}
                </div>
                <div className="hp-town-body">
                  <div className="hp-town-name">{t.name}</div>
                  {t.nickname && <div className="hp-town-nick">{t.nickname}</div>}
                  <div className="hp-town-stats">
                    <div className="hp-town-stat">
                      <strong>{fmt(t.population)}</strong> population
                    </div>
                    <div className="hp-town-stat">
                      <strong>{fmtDollar(t.medianHomeValue)}</strong> home value
                    </div>
                    <div className="hp-town-stat">
                      <strong>{t.recCount}</strong> rec sites
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link href="/montana-towns" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              Browse all {totalTowns} towns →
            </Link>
          </div>
        </section>

        {/* ═══ 6. RELOCATION CTA ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <div className="hp-relo-cta">
            <h2>Planning a Move to Montana?</h2>
            <p>
              In-depth relocation guides covering housing, jobs, schools, healthcare, recreation, and cost of living for every Montana town.
            </p>
            <Link href="/guides" className="hp-relo-btn">Browse Moving Guides</Link>
          </div>
        </section>

        {/* ═══ 7. SHOP INTEGRATION (contextual, quiet) ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <div className="hp-shop">
            <div className="hp-shop-text">
              <h3>Wear Montana</h3>
              <p>Original designs inspired by the places and spirit of Big Sky Country. T-shirts, prints, and more.</p>
            </div>
            <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer" className="hp-shop-link">
              Visit the Shop →
            </a>
          </div>
        </section>

        {/* ═══ 9. ABOUT + PHOTOGRAPHY CREDIT ═══ */}
        <section className="hp-section" style={{ paddingTop: 0 }}>
          <div className="hp-about">
            <h2>Why &ldquo;The Treasure State&rdquo;?</h2>
            <p>
              Montana earned its nickname from the gold rushes of the 1860s, the copper empire of Butte, and the sapphires of Yogo Gulch.
              Today, Montana&rsquo;s real treasure is its unmatched quality of life &mdash; wide-open spaces, world-class recreation,
              and communities that still feel like home.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#aaa', fontStyle: 'italic', marginBottom: '0.5rem' }}>
              All photography original and locally captured.
            </p>
            <Link href="/information/why-treasure-state" className="hp-about-link">Read the full story →</Link>
          </div>
        </section>

        {/* ═══ 10. MONTANA CULTURE MODULE ═══ */}
        <HomepageCultureModule articles={cultureArticles} fieldNotes={cultureFieldNotes} />

      </main>

      {/* ═══ 9. DATA CREDIBILITY FOOTER ═══ */}
      <div className="hp-credibility">
        <div className="hp-cred-inner">
          <div className="hp-cred-title">Some of Our Data Sources</div>
          <div className="hp-cred-grid">
            {dataSources.map(s => (
              <div key={s.label} className="hp-cred-item">
                <strong>{s.label}</strong>, updated {s.lastCollected}
              </div>
            ))}
          </div>
          <div className="hp-cred-note">
            Town data is refreshed monthly for market indicators and annually for census, crime, and environmental data. Data may not reflect current conditions.
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.join(process.cwd(), 'data');

  const townData = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-data.json'), 'utf8'));
  const housing = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-housing.json'), 'utf8'));
  const recreation = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-recreation.json'), 'utf8'));
  const nicknames = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-nicknames.json'), 'utf8'));
  const coords = JSON.parse(fs.readFileSync(path.join(dataDir, 'town-coordinates.json'), 'utf8'));
  const freshness = JSON.parse(fs.readFileSync(path.join(dataDir, 'data-freshness.json'), 'utf8'));
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'towns');

  const FEATURED_SLUGS = ['missoula', 'bozeman', 'billings', 'kalispell', 'whitefish', 'helena'];

  const featuredTowns: FeaturedTown[] = FEATURED_SLUGS.map(slug => {
    const d = townData[slug] || {};
    const h = housing[slug] || {};
    const r = recreation[slug];
    const hasImage = fs.existsSync(path.join(imagesDir, `${slug}.jpg`));
    return {
      slug,
      name: d.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      nickname: nicknames[slug] || null,
      population: d.population || null,
      medianHomeValue: h.zillowHomeValue || h.medianHomeValue || null,
      recCount: r?.places?.length || 0,
      hasImage,
    };
  });

  const totalTowns = Object.keys(coords).length;
  const totalGuides = totalTowns;

  let totalComparisons = 0;
  try {
    const comparePairs = fs.readdirSync(dataDir)
      .filter((f: string) => f.startsWith('compare-') && f.endsWith('.json'));
    if (comparePairs.length > 0) {
      totalComparisons = comparePairs.length;
    } else {
      totalComparisons = 91;
    }
  } catch {
    totalComparisons = 91;
  }

  const dataSources: DataSource[] = Object.values(freshness)
    .map((v: any) => ({ label: v.label, lastCollected: v.lastCollected }))
    .sort((a: DataSource, b: DataSource) => b.lastCollected.localeCompare(a.lastCollected));

  const cultureArticles: ArticleSummary[] = isEnabled('content_hub_enabled')
    ? getFeaturedArticles()
    : [];
  const cultureFieldNotes: FieldNote[] = isEnabled('content_hub_enabled')
    ? getFeaturedFieldNotes()
    : [];

  return {
    props: {
      featuredTowns,
      totalTowns,
      totalGuides,
      totalRankings: 13,
      totalComparisons,
      featuredRankings: FEATURED_RANKINGS,
      dataSources,
      cultureArticles,
      cultureFieldNotes,
    },
  };
};
