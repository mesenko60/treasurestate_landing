import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import ArticleCard from '../../components/ArticleCard';
import AppInstallCTA from '../../components/AppInstallCTA';
import { isEnabled } from '../../lib/feature-flags';
import { getArticleSummaries, type ArticleSummary } from '../../lib/articles';

type GuideLink = {
  slug: string;
  townName: string;
  population: number;
  homeValue: string;
  recCount: number;
};

type Props = { guides: GuideLink[]; cultureGuides: ArticleSummary[] };

const TRAVEL_GUIDES = [
  { href: '/guides/skiing-guide', title: 'Skiing & Snowboarding Guide', desc: 'All 16 Montana ski areas — from Big Sky\u2019s 5,800 acres to Bear Paw\u2019s $25 lift tickets.' },
  { href: '/guides/fly-fishing-guide', title: 'Fly Fishing Guide', desc: 'Montana\u2019s trout legacy from 1919 to today — Madison, Gallatin, Yellowstone, and Glacier waters.' },
  { href: '/guides/hiking-guide', title: 'Hiking Trails & Trailheads', desc: '60+ hiking destinations across Montana with difficulty ratings, directions, and tips.' },
  { href: '/guides/hunting-guide', title: 'Montana Hunting Guide', desc: 'Season dates, license fees, 21 WMAs, and species profiles for deer, elk, antelope, and more.' },
  { href: '/guides/land-ownership', title: 'Montana Land Ownership & GIS Map', desc: 'MSDI cadastral layers for public lands, conservation easements, parcels, PLSS grid, statewide FTP GIS links, hunter access FAQs.' },
  { href: '/guides/state-parks-guide', title: 'State Parks Guide', desc: '20 Montana state parks — badlands, ghost towns, cave tours, buffalo jumps, and the Smith River.' },
  { href: '/guides/wildlife-guide', title: 'Wildlife Viewing Guide', desc: 'Grizzly bears, wolves, bison, elk, bighorn sheep — 15 verified locations with species and seasons.' },
  { href: '/guides/photography-guide', title: 'Photographer\u2019s Guide', desc: '18 photography locations with GPS coordinates, best times, recommended lenses, and gear tips.' },
  { href: '/guides/hot-springs-guide', title: 'Hot Springs Guide', desc: '20+ natural and developed geothermal hot springs across Montana.' },
  { href: '/guides/golf-courses-guide', title: 'Montana Golf Courses', desc: 'Full directory of Montana golf courses with map, stats, and town links.' },
  { href: '/guides/campgrounds-guide', title: 'Campgrounds & RV Parks', desc: 'Campgrounds and RV parks from our places database — KOAs, state sites, public land, and private camps.' },
  { href: '/guides/montana-backroads', title: 'Montana Backroads Guide', desc: 'Scenic routes off the beaten path — hidden gems of Big Sky Country.' },
  { href: '/guides/summer-road-trips', title: 'Summer Road Trips', desc: 'The best scenic drives June through September — alpine passes and wildflower meadows.' },
  { href: '/guides/winter-driving-guide', title: 'Winter Driving Guide', desc: 'Year-round routes, seasonal closures, and essential winter driving tips.' },
  { href: '/guides/montana-railroad-history', title: 'Montana Railroad History', desc: 'Interactive map and 18 articles exploring Montana\u2019s railroad heritage — depots, disasters, and abandoned routes.' },
  { href: '/guides/history-trails', title: 'History Trails', desc: 'Curated driving routes connecting historic markers — Lewis & Clark, mining, battlefields, and railroads.' },
  { href: '/this-day-in-history', title: 'This Day in Montana History', desc: 'A daily Montana history story for every calendar day, plus a full browse archive.' },
];

export default function GuidesIndex({ guides, cultureGuides }: Props) {
  const url = 'https://treasurestate.com/guides/';
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Montana Guides — Travel & Relocation',
    description: 'Travel guides for skiing, fishing, hiking, and more, plus comprehensive relocation guides for Montana cities and towns.',
    url,
  };

  return (
    <>
      <Head>
        <title>Montana Guides — Travel, Outdoors & Relocation | Treasure State</title>
        <meta name="description" content="Montana travel guides for skiing, fly fishing, hiking, hunting, state parks, wildlife viewing, and more. Plus relocation guides for 55+ Montana towns." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Montana Guides — Travel, Outdoors & Relocation" />
        <meta property="og:description" content="Travel guides and relocation guides for Montana." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Montana Guides — Travel, Outdoors & Relocation" />
        <meta name="twitter:description" content="Travel guides and relocation guides for Montana." />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero title="Montana Guides" subtitle="Travel, Outdoors & Relocation" image="/images/hero-image.jpg" alt="Montana guides" small />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

        {/* Travel Guides */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#204051', marginBottom: '0.4rem' }}>Travel Guides</h2>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.25rem' }}>
            Explore Montana through our curated guides covering skiing, fishing, hiking, wildlife, photography, and more.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {TRAVEL_GUIDES.map(g => (
              <Link key={g.href} href={g.href} style={{
                display: 'block', padding: '1.25rem', background: '#fff',
                borderRadius: '10px', border: '1px solid #e8ede8', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
              }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#204051', marginBottom: '0.4rem' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {g.desc}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 500 }}>
                  Read Guide &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Culture & Living Guides */}
        {cultureGuides.length >= 2 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#204051', marginBottom: '0.4rem' }}>Culture &amp; Living</h2>
            <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.25rem' }}>
              Local knowledge, etiquette, and cultural guides for understanding Montana life.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {cultureGuides.map(a => (
                <ArticleCard
                  key={a.slug}
                  slug={a.slug}
                  title={a.title}
                  excerpt={a.excerpt}
                  type={a.type}
                  heroImage={a.hero_image}
                  heroAlt={a.hero_alt}
                  datePublished={a.date_published}
                />
              ))}
            </div>
          </section>
        )}

        {/* Relocation Guides */}
        <section>
          <h2 style={{ fontSize: '1.3rem', color: '#204051', marginBottom: '0.4rem' }}>Relocation Guides</h2>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.25rem' }}>
            Thinking about moving to Montana? Our comprehensive relocation guides cover housing costs,
            climate, outdoor recreation, schools, and quality of life — built from Census, Zillow, and
            2,500+ mapped recreation sites.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {guides.map(g => (
              <Link key={g.slug} href={`/guides/${g.slug}/`} style={{
                display: 'block', padding: '1.25rem', background: '#fff',
                borderRadius: '10px', border: '1px solid #e8ede8', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#204051', marginBottom: '0.4rem' }}>
                  Moving to {g.townName}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#666', marginBottom: '0.5rem' }}>
                  <span>Pop. {g.population.toLocaleString()}</span>
                  <span>{g.homeValue}</span>
                  <span>{g.recCount} rec sites</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#3b6978', fontWeight: 500 }}>
                  Read Guide &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div style={{ maxWidth: '480px', margin: '2.5rem auto 0' }}>
          <AppInstallCTA
            variant="card"
            headline="Install on your phone"
            body="Install this on your mobile device to be notified when approaching points of interest."
          />
        </div>

        <div style={{
          marginTop: '2.5rem', padding: '1.25rem', background: '#f8faf8',
          borderRadius: '8px', border: '1px solid #e8ede8', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '0.95rem', color: '#204051', marginTop: 0 }}>Planning a Road Trip?</h3>
          <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1rem' }}>
            Use our interactive backroads planner to build your perfect Montana route.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planners/backroads-planner" style={{
              display: 'inline-block', padding: '0.6rem 1.25rem',
              background: '#204051', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
            }}>
              Open Trip Planner
            </Link>
            <Link href="/compare/" style={{
              display: 'inline-block', padding: '0.6rem 1.25rem',
              background: '#3b6978', color: '#fff', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
            }}>
              Compare Towns
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (f: string) => {
    const p = path.join(dataDir, f);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };
  const coords = load('town-coordinates.json');
  const townData = load('town-data.json');
  const housing = load('town-housing.json');
  const recreation = load('town-recreation.json');

  const guides: GuideLink[] = Object.keys(coords)
    .filter(s => townData[s])
    .map(s => {
      const td = townData[s];
      const h = housing[s] || {};
      const rec = recreation[s]?.places || [];
      const hv = h.zillowHomeValue ?? h.medianHomeValue;
      return {
        slug: `moving-to-${s}-montana`,
        townName: td.name,
        population: td.population || 0,
        homeValue: hv ? '$' + hv.toLocaleString() : '\u2014',
        recCount: rec.length,
      };
    })
    .sort((a, b) => b.population - a.population);

  const cultureGuides: ArticleSummary[] = isEnabled('content_hub_enabled')
    ? getArticleSummaries('guides')
    : [];

  return { props: { guides, cultureGuides } };
};
