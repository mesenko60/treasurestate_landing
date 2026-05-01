import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedContent from '../../components/RelatedContent';
import StaysCTA from '../../components/StaysCTA';
import AppInstallCTA from '../../components/AppInstallCTA';
import { filterNearbyRecreation } from '../../lib/recreation';
import { isEnabled } from '../../lib/feature-flags';
import { getRelatedArticles, type ArticleSummary } from '../../lib/articles';
import { formatCountyLabel } from '../../lib/county';

const SLUG_TAG_MAP: Record<string, string[]> = {
  'most-affordable-towns': ['relocation', 'cost-of-living'],
  'best-outdoor-recreation': ['outdoor', 'recreation'],
  'best-ski-towns': ['skiing', 'winter'],
  'best-fishing-towns': ['fishing', 'outdoor'],
  'towns-near-hot-springs': ['outdoor', 'travel'],
  'best-small-towns': ['culture', 'travel'],
  'best-towns-near-glacier-yellowstone': ['travel', 'outdoor'],
  'best-towns-for-retirees': ['relocation', 'culture'],
  'best-climate': ['travel', 'relocation'],
  'best-towns-for-families': ['relocation', 'culture'],
  'best-towns-for-young-professionals': ['relocation', 'culture'],
  'best-towns-for-digital-nomads': ['relocation', 'culture'],
  'safest-towns': ['relocation'],
  'best-housing-availability': ['relocation', 'cost-of-living'],
};

function deriveTagsFromSlug(slug: string): string[] {
  return SLUG_TAG_MAP[slug] || ['culture', 'travel'];
}

type RankedTown = {
  rank: number;
  slug: string;
  name: string;
  nickname: string;
  population: number | null;
  highlight: string;
  stats: { label: string; value: string }[];
  hasGuide: boolean;
  hasLodging: boolean;
};

type PageData = {
  slug: string;
  title: string;
  metaDescription: string;
  heroSubtitle: string;
  intro: string;
  methodology: string;
  towns: RankedTown[];
};

type DataFreshness = {
  zillowInventory?: string;
  censusEmployment?: string;
  crime?: string;
  schools?: string;
  healthcare?: string;
  environmental?: string;
};

type RelatedRanking = { slug: string; title: string };

type Props = { page: PageData; freshness: DataFreshness; relatedRankings: RelatedRanking[]; relatedArticles: ArticleSummary[] };

function fmt(n: number | null | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null | undefined): string {
  if (n == null) return '—';
  return '$' + n.toLocaleString('en-US');
}

function fmtFresh(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function BestOfPage({ page, freshness, relatedRankings, relatedArticles }: Props) {
  const url = `https://treasurestate.com/best-of/${page.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Best Of', url: '/best-of/' },
    { name: page.title, url },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.title,
    description: page.metaDescription,
    url,
    numberOfItems: page.towns.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: page.towns.map(t => {
      const townUrl = `https://treasurestate.com/montana-towns/${t.slug}/`;
      return {
        '@type': 'ListItem',
        position: t.rank,
        item: {
          '@type': 'Place',
          '@id': townUrl,
          name: `${t.name}, Montana`,
          url: townUrl,
          description: t.highlight,
          address: { '@type': 'PostalAddress', addressLocality: t.name, addressRegion: 'MT', addressCountry: 'US' },
        },
      };
    }),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.metaDescription,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Treasure State',
      url: 'https://treasurestate.com',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('/') ? `https://treasurestate.com${b.url}` : b.url,
    })),
  };

  return (
    <>
      <Head>
        <title>{`${page.title} | Treasure State`}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <Header />
      <Hero title={page.title} subtitle={page.heroSubtitle} image="/images/hero-image.jpg" alt={page.title} small />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333', marginBottom: '1rem' }}>
          {page.intro}
        </p>

        {page.slug === 'towns-near-hot-springs' && (
          <p style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
            <Link href="/guides/hot-springs-guide" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
              Browse all 31 hot springs in our complete directory →
            </Link>
          </p>
        )}

        {page.slug === 'best-fishing-towns' && (
          <p style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>
            <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
              Fly Fishing Guide
            </Link>
            {' — '}
            <Link href="/guides/fly-fishing-rivers" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
              Rivers Deep Dive
            </Link>
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {page.towns.map(town => (
            <article key={town.slug} style={{
              background: '#fff', borderRadius: '10px', border: '1px solid #e8ede8',
              overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'stretch', flexWrap: 'wrap',
              }}>
                {/* Rank badge */}
                <div style={{
                  width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: town.rank <= 3 ? '#204051' : '#3b6978',
                  color: '#fff', fontSize: town.rank <= 3 ? '1.5rem' : '1.2rem', fontWeight: 700,
                  flexShrink: 0,
                }}>
                  #{town.rank}
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '1rem 1.25rem', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <Link href={`/montana-towns/${town.slug}/`} style={{
                        fontSize: '1.15rem', fontWeight: 700, color: '#204051',
                        textDecoration: 'none',
                      }}>
                        {town.name}
                      </Link>
                      <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>
                        {town.nickname}
                      </span>
                    </div>
                    {town.population && (
                      <span style={{ fontSize: '0.78rem', color: '#999' }}>
                        Pop. {fmt(town.population)}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#555', margin: '0.4rem 0 0.6rem', lineHeight: 1.5 }}>
                    {town.highlight}
                  </p>

                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                  }}>
                    {town.stats.map((s, i) => (
                      <div key={i} style={{
                        padding: '0.3rem 0.6rem', background: '#f5f8f5', borderRadius: '6px',
                        fontSize: '0.78rem',
                      }}>
                        <span style={{ color: '#888' }}>{s.label}: </span>
                        <span style={{ fontWeight: 600, color: '#204051' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                    <Link href={`/montana-towns/${town.slug}/`} style={{
                      fontSize: '0.82rem', color: '#3b6978', fontWeight: 500, textDecoration: 'none',
                    }}>
                      Explore {town.name} →
                    </Link>
                    {town.hasGuide && (
                      <Link href={`/guides/moving-to-${town.slug}-montana/`} style={{
                        fontSize: '0.82rem', color: '#3b6978', textDecoration: 'none',
                      }}>
                        Moving Guide
                      </Link>
                    )}
                    {town.hasLodging && (
                      <Link href={`/lodging/${town.slug === 'anaconda' ? 'anaconda-montana' : town.slug}/`} style={{
                        fontSize: '0.82rem', color: '#3b6978', textDecoration: 'none',
                      }}>
                        Where to Stay
                      </Link>
                    )}
                    <Link href={`/compare?a=${town.slug}`} style={{
                      fontSize: '0.82rem', color: '#888', textDecoration: 'none',
                    }}>
                      Compare
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{
          marginTop: '2.5rem', padding: '1.25rem', background: '#f8faf8',
          borderRadius: '8px', border: '1px solid #e8ede8',
        }}>
          <h3 style={{ fontSize: '0.95rem', color: '#204051', marginTop: 0, marginBottom: '0.5rem' }}>
            How We Ranked These Towns
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#666', lineHeight: 1.6, margin: 0 }}>
            {page.methodology}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#aaa', margin: '0.6rem 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
            Data last collected: Zillow Research ({fmtFresh(freshness.zillowInventory) || 'Jan 2026'}),
            U.S. Census ACS ({fmtFresh(freshness.censusEmployment) || '2019–2023'}),
            FBI UCR ({fmtFresh(freshness.crime) || '2023'}),
            Montana OPI/NCES ({fmtFresh(freshness.schools) || '2022–23'}),
            Montana DPHHS ({fmtFresh(freshness.healthcare) || '2024'}),
            EPA NPL ({fmtFresh(freshness.environmental) || '2024'}).
            Rankings are updated when data is refreshed. Check individual town profiles for details.
          </p>
        </div>

        {relatedRankings.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#204051', marginBottom: '0.75rem' }}>
              Explore More Rankings
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {relatedRankings.map(r => (
                <Link key={r.slug} href={`/best-of/${r.slug}/`} style={{
                  display: 'inline-block', padding: '0.4rem 0.85rem',
                  background: '#f5f8f5', border: '1px solid #dde8dd', borderRadius: '20px',
                  color: '#3b6978', fontSize: '0.82rem', fontWeight: 500,
                  textDecoration: 'none',
                }}>
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/best-of/" style={{
            display: 'inline-block', padding: '0.75rem 1.5rem',
            background: '#3b6978', color: '#fff', borderRadius: '6px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
          }}>
            View All Rankings
          </Link>
        </div>
        <AppInstallCTA
          variant="inline"
          headline="Install on your phone"
          body="Install this on your mobile device to be notified when approaching points of interest."
        />

        <div style={{ marginTop: '2rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          <StaysCTA variant="compact" />
        </div>

        {relatedArticles.length > 0 && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            <RelatedContent articles={relatedArticles} title="Related Reading" />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// ─── Ranking Definitions ────────────────────────────────────────────

type TownRaw = {
  slug: string;
  name: string;
  nickname: string;
  population: number | null;
  elevation: number | null;
  county: string | null;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
  zillowHomeValue: number | null;
  zillowRent: number | null;
  affordabilityRatio: number | null;
  homeValuePercentile: number | null;
  recScore: number;
  recTotal: number;
  recByType: Record<string, number>;
  nearestSkiMiles: number | null;
  nearestSkiName: string | null;
  nearestHotSpringMiles: number | null;
  nearestHotSpringName: string | null;
  nearestNatParkMiles: number | null;
  nearestNatParkName: string | null;
  fishingCount: number;
  riverCount: number;
  lakeCount: number;
  trailCount: number;
  campgroundCount: number;
  wildernessMiles: number | null;
  safetyScore: number | null;
  environmentalScore: number | null;
  environmentalConcernLevel: string | null;
  superfundSites: number;
  violentCrimeRate: number | null;
  propertyCrimeRate: number | null;
  totalCrimeRate: number | null;
  forSaleInventory: number | null;
  inventoryYoY: number | null;
  medianListPrice: number | null;
  totalHousingUnits: number | null;
  vacancyRate: number | null;
  unemploymentRate: number | null;
  laborForceParticipation: number | null;
  jobScore: number | null;
  graduationRate: number | null;
  schoolScore: number | null;
  perPupilSpending: number | null;
  mainIndustry: string | null;
  topIndustries: { name: string; pct: number }[] | null;
  healthcareScore: number | null;
  nearestHospitalDist: number | null;
  nearestHospitalName: string | null;
  nearestMajorHospitalDist: number | null;
  nearestMajorHospitalName: string | null;
  hasLocalHospital: boolean;
  hospitalsWithin30: number;
  julHigh: number | null;
  janLow: number | null;
  annualSnow: number | null;
  annualPrecip: number | null;
  nearestAirportMiles: number | null;
  nearestAirportName: string | null;
};

function computeRecScore(places: any[]): number {
  const types = new Set(places.map((p: any) => p.type));
  const weights: Record<string, number> = {
    'National Park': 10, 'Wilderness': 7, 'National Forest': 6, 'Hot Spring': 6,
    'Ski Area': 5, 'State Park': 5, 'River': 5, 'National HQ': 5,
    'Scenic Drive': 4, 'Waterfall': 4, 'Lake': 4, 'National Rec Area': 4,
    'Museum': 3, 'Historic Site': 3, 'Fishing Access': 3, 'Wildlife Refuge': 3,
    'Campground': 2, 'Trailhead': 2, 'Golf': 2, 'Boat Launch': 2, 'Viewpoint': 1,
  };
  const diversity = Math.min(types.size / 8, 1) * 3;
  const volume = Math.min(Math.log10(Math.max(places.length, 1)) / Math.log10(400), 1) * 2.5;
  let qRaw = 0;
  Array.from(types).forEach((t: any) => { qRaw += weights[t] ?? 1; });
  const quality = Math.min(qRaw / 40, 1) * 3;
  const notable = places.filter((p: any) => (weights[p.type] ?? 0) >= 4);
  const nearest = notable.length > 0 ? notable[0].distMiles : 50;
  const proximity = Math.max(1 - nearest / 50, 0) * 1.5;
  return Math.min(Math.round((diversity + volume + quality + proximity) * 10) / 10, 10);
}

function housingAvailScore(t: TownRaw): number {
  const vacScore = t.vacancyRate != null ? Math.min(t.vacancyRate / 3, 3) : 1.5;
  const invScore = t.forSaleInventory != null && t.population
    ? Math.min((t.forSaleInventory / Math.max(t.population, 1)) * 1000 / 5, 3)
    : 1;
  const yoyBonus = t.inventoryYoY != null && t.inventoryYoY > 0 ? Math.min(t.inventoryYoY / 20, 1) : 0;
  return vacScore + invScore + yoyBonus;
}

type RankingDef = {
  slug: string;
  title: string;
  metaDescription: string;
  heroSubtitle: string;
  intro: string;
  methodology: string;
  count: number;
  filter?: (t: TownRaw) => boolean;
  sort: (a: TownRaw, b: TownRaw) => number;
  highlight: (t: TownRaw) => string;
  stats: (t: TownRaw) => { label: string; value: string }[];
};

const SKI_AREA_SNOWFALL: Record<string, number> = {
  'Whitefish Mountain Resort': 221,
  'Big Sky Resort': 265,
  'Bridger Bowl': 188,
  'Red Lodge Mountain': 143,
  'Snowbowl': 300,
  'Lost Trail Powder Mountain': 325,
  'Discovery Ski Area': 132,
  'Showdown Montana': 165,
  'Maverick Mountain': 75,
  'Blacktail Mountain': 138,
  'Turner Mountain': 250,
  'Bear Paw Ski Bowl': 140,
};

function skiSnow(skiName: string | null): number | null {
  if (!skiName) return null;
  for (const [key, val] of Object.entries(SKI_AREA_SNOWFALL)) {
    if (skiName.includes(key) || key.includes(skiName)) return val;
  }
  return null;
}

const RANKINGS: RankingDef[] = [
  {
    slug: 'most-affordable-towns',
    title: '10 Most Affordable Towns in Montana',
    metaDescription: 'Discover Montana\'s most affordable places to live. Ranked by home prices, rent, and price-to-income ratio using Census and Zillow data.',
    heroSubtitle: 'Where Your Dollar Goes Furthest in Big Sky Country',
    intro: 'Montana\'s stunning landscapes don\'t have to come with a steep price tag. While towns like Bozeman and Whitefish have seen prices soar, many Montana communities still offer an affordable cost of living paired with incredible quality of life. We ranked every Montana town by affordability using median home values, rent, household income, and the critical price-to-income ratio.',
    methodology: 'Rankings based on affordability ratio (median home value ÷ median household income), with preference for towns with lower absolute home values and rent. Data from U.S. Census Bureau ACS 5-Year Estimates and Zillow Home Value Index. Towns without sufficient housing data were excluded. See collection dates below.',
    count: 10,
    filter: t => t.affordabilityRatio != null && t.affordabilityRatio > 0 && t.medianHomeValue != null,
    sort: (a, b) => (a.affordabilityRatio ?? 99) - (b.affordabilityRatio ?? 99),
    highlight: t => {
      const ratio = t.affordabilityRatio!;
      const label = ratio <= 2 ? 'extremely affordable' : ratio <= 3 ? 'very affordable' : 'affordable';
      const inv = t.forSaleInventory ? ` There are currently ${t.forSaleInventory} homes for sale.` : '';
      const indNote = t.mainIndustry ? ` The local economy is driven by ${t.mainIndustry.toLowerCase()}.` : '';
      return `With a price-to-income ratio of ${ratio}x, ${t.name} is ${label}. ${t.county ? `Located in ${formatCountyLabel(t.county)}` : 'Located'} with a population of ${fmt(t.population)}, it offers small-town Montana living at a fraction of the cost of larger cities.${indNote}${inv}`;
    },
    stats: t => [
      { label: 'Home Value', value: fmtDollar(t.zillowHomeValue ?? t.medianHomeValue) },
      ...(t.mainIndustry ? [{ label: 'Top Industry', value: t.mainIndustry }] : []),
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      ...(t.forSaleInventory ? [{ label: 'For Sale', value: fmt(t.forSaleInventory) + ' homes' }] : [{ label: 'Income', value: fmtDollar(t.medianHouseholdIncome) }]),
    ],
  },
  {
    slug: 'best-outdoor-recreation',
    title: '10 Best Montana Towns for Outdoor Recreation',
    metaDescription: 'The top Montana towns for outdoor adventure: ranked by access to trails, parks, rivers, ski areas, and wilderness within 30 miles.',
    heroSubtitle: 'Where Adventure Is Always Just Outside Your Door',
    intro: 'Montana is an outdoor paradise, but some towns are better positioned than others. We scored every Montana community based on the variety, quality, and proximity of nearby recreation: from national parks and wilderness areas to trailheads, rivers, ski resorts, and hot springs. These are the towns where the outdoors isn\'t just nearby, it\'s your backyard.',
    methodology: 'Recreation Score (0–10) computed from four factors: category diversity (how many types of recreation are nearby), total volume of sites within 30 miles, quality weighting (national parks and wilderness count more than viewpoints), and proximity of the nearest notable attraction. Data sourced from OpenStreetMap and editorial research. All recreation counts use a 30-mile radius from each town.',
    count: 10,
    sort: (a, b) => b.recScore - a.recScore,
    highlight: t => `${t.name} scores ${t.recScore}/10 for outdoor recreation with ${t.recTotal} destinations nearby.${t.nearestNatParkMiles != null && t.nearestNatParkMiles <= 60 ? ` Just ${t.nearestNatParkMiles} miles from ${t.nearestNatParkName}.` : ''}${t.nearestSkiMiles != null && t.nearestSkiMiles <= 30 ? ` ${t.nearestSkiName} ski area is only ${t.nearestSkiMiles} miles away.` : ''}`,
    stats: t => [
      { label: 'Rec Score', value: t.recScore + '/10' },
      { label: 'Sites Nearby', value: fmt(t.recTotal) },
      { label: 'Trails', value: fmt(t.trailCount) },
      { label: 'Lakes', value: fmt(t.lakeCount) },
    ],
  },
  {
    slug: 'best-ski-towns',
    title: '10 Best Montana Ski Towns',
    metaDescription: 'The top Montana towns closest to ski resorts: from Whitefish Mountain to Big Sky, Bridger Bowl, and more hidden gems.',
    heroSubtitle: 'Montana\'s Premier Mountain Communities for Powder Chasers',
    intro: 'Montana is home to some of the best skiing in North America, with uncrowded slopes, deep powder, and affordable lift tickets compared to Colorado or Utah. These towns put you closest to the action, whether you\'re chasing groomers at Whitefish Mountain Resort, powder stashes at Bridger Bowl, or the sprawling terrain of Big Sky.',
    methodology: 'Ranked by distance to the nearest ski area, with consideration for towns near multiple ski areas. Ski areas include both major destination resorts and smaller community hills. Distances are straight-line estimates.',
    count: 10,
    filter: t => t.nearestSkiMiles != null,
    sort: (a, b) => (a.nearestSkiMiles ?? 999) - (b.nearestSkiMiles ?? 999),
    highlight: t => {
      const resortSnow = skiSnow(t.nearestSkiName);
      const snowNote = resortSnow ? ` ${t.nearestSkiName} averages ${resortSnow}" of snow annually.` : '';
      return `${t.name} is just ${t.nearestSkiMiles} miles from ${t.nearestSkiName}.${snowNote} ${t.nickname !== 'A Montana Community' ? `Known as "${t.nickname}," it` : 'It'} offers year-round mountain living with world-class winter sports on your doorstep.`;
    },
    stats: t => {
      const resortSnow = skiSnow(t.nearestSkiName);
      return [
        { label: 'Nearest Ski', value: t.nearestSkiName ?? '—' },
        { label: 'Distance', value: (t.nearestSkiMiles ?? 0) + ' mi' },
        { label: 'Resort Snow', value: resortSnow ? resortSnow + '"' : '—' },
        { label: 'Elevation', value: fmt(t.elevation) + ' ft' },
      ];
    },
  },
  {
    slug: 'best-fishing-towns',
    title: '10 Best Montana Towns for Fly Fishing',
    metaDescription: 'Montana\'s top towns for fly fishing: ranked by access to blue-ribbon rivers, fishing access sites, and lakes.',
    heroSubtitle: 'Where World-Class Trout Water Is Minutes Away',
    intro: 'Montana is the fly fishing capital of America, home to legendary rivers like the Madison, Yellowstone, Missouri, and Blackfoot. But which towns give you the best access? We ranked every Montana community by the number of rivers, fishing access sites, and lakes within reach. Whether you\'re a seasoned angler or picking up a rod for the first time, these towns put you on the water.',
    methodology: 'Ranked by a composite fishing score: number of rivers (×3 weight) + fishing access sites (×2) + lakes (×1) within the standard radius. Blue-ribbon rivers and designated fishing access sites are weighted more heavily than general lakes.',
    count: 10,
    sort: (a, b) => {
      const scoreA = a.riverCount * 3 + a.fishingCount * 2 + Math.min(a.lakeCount, 20);
      const scoreB = b.riverCount * 3 + b.fishingCount * 2 + Math.min(b.lakeCount, 20);
      return scoreB - scoreA;
    },
    highlight: t => `${t.name} has ${t.riverCount} rivers, ${t.fishingCount} fishing access sites, and ${t.lakeCount} lakes nearby. ${t.county ? `Located in ${formatCountyLabel(t.county)}` : 'Located'} at ${fmt(t.elevation)} feet, it\'s a premier base camp for Montana fly fishing.`,
    stats: t => [
      { label: 'Rivers', value: fmt(t.riverCount) },
      { label: 'Fishing Access', value: fmt(t.fishingCount) },
      { label: 'Lakes', value: fmt(t.lakeCount) },
      { label: 'Population', value: fmt(t.population) },
    ],
  },
  {
    slug: 'towns-near-hot-springs',
    title: '10 Best Montana Towns Near Hot Springs',
    metaDescription: 'Montana towns closest to natural hot springs: from Chico to Lolo, Quinn\'s, and more. Find your perfect soak.',
    heroSubtitle: 'Soak in Big Sky Country\'s Natural Geothermal Waters',
    intro: 'Montana sits atop one of the most geothermally active regions in North America, and the state is dotted with natural hot springs: from rustic soaking pools along mountain creeks to full resort experiences. These towns put you closest to Montana\'s best hot springs, so you can end every adventure with a warm soak under the stars.',
    methodology: 'Ranked by distance to the nearest hot spring. Hot springs include both developed resorts and natural soaking areas. Only named, publicly accessible hot springs are included.',
    count: 10,
    filter: t => t.nearestHotSpringMiles != null,
    sort: (a, b) => (a.nearestHotSpringMiles ?? 999) - (b.nearestHotSpringMiles ?? 999),
    highlight: t => `${t.name} is just ${t.nearestHotSpringMiles} miles from ${t.nearestHotSpringName}. ${t.nickname !== 'A Montana Community' ? `Known as "${t.nickname}," this` : 'This'} ${t.population && t.population > 5000 ? 'city' : 'town'} of ${fmt(t.population)} makes a perfect base for combining outdoor adventure with relaxation.`,
    stats: t => [
      { label: 'Nearest Spring', value: t.nearestHotSpringName ?? '—' },
      { label: 'Distance', value: (t.nearestHotSpringMiles ?? 0) + ' mi' },
      { label: 'Population', value: fmt(t.population) },
      { label: 'Elevation', value: fmt(t.elevation) + ' ft' },
    ],
  },
  {
    slug: 'best-small-towns',
    title: '10 Best Small Towns in Montana',
    metaDescription: 'Discover Montana\'s best small towns: charming communities under 5,000 with great schools, available housing, low crime, and stunning scenery.',
    heroSubtitle: 'Small-Town Charm Meets Big Sky Country',
    intro: 'Some of Montana\'s most special places are its smallest communities. These towns under 5,000 people offer the quintessential Montana experience: genuine character, stunning natural settings, good schools, available housing, and a pace of life that lets you breathe. We ranked them by a blend of safety, school quality, housing availability, employment, recreation access, and affordability.',
    methodology: 'Limited to towns with population under 5,000. Ranked by a composite score of safety (FBI UCR, ×3), school quality (graduation rate, ×3), housing availability (vacancy rate + inventory, ×2), environmental health (EPA Superfund, ×2), job market (Census unemployment, ×2), recreation score (×3), and affordability (×2). Housing data from Zillow Research and Census ACS.',
    count: 10,
    filter: t => t.population != null && t.population > 0 && t.population < 5000 && t.affordabilityRatio != null,
    sort: (a, b) => {
      const safetyA = a.safetyScore != null ? a.safetyScore : 5;
      const safetyB = b.safetyScore != null ? b.safetyScore : 5;
      const schoolA = a.schoolScore ?? 8.5;
      const schoolB = b.schoolScore ?? 8.5;
      const jobA = a.jobScore ?? 8;
      const jobB = b.jobScore ?? 8;
      const scoreA = safetyA * 3 + schoolA * 3 + housingAvailScore(a) * 2 + (a.environmentalScore ?? 10) * 2 + jobA * 2 + a.recScore * 3 + Math.max(6 - (a.affordabilityRatio ?? 6), 0) * 2;
      const scoreB = safetyB * 3 + schoolB * 3 + housingAvailScore(b) * 2 + (b.environmentalScore ?? 10) * 2 + jobB * 2 + b.recScore * 3 + Math.max(6 - (b.affordabilityRatio ?? 6), 0) * 2;
      return scoreB - scoreA;
    },
    highlight: t => {
      const safety = t.safetyScore != null ? ` with a safety score of ${t.safetyScore}/10` : '';
      const gradNote = t.graduationRate != null ? ` The local graduation rate is ${t.graduationRate}%.` : '';
      const jobNote = t.unemploymentRate != null ? ` Unemployment: ${t.unemploymentRate}%.` : '';
      const invNote = t.forSaleInventory != null ? ` ${t.forSaleInventory} homes currently for sale.` : (t.vacancyRate != null ? ` Vacancy rate: ${t.vacancyRate}%.` : '');
      const indNote = t.mainIndustry ? ` Main industry: ${t.mainIndustry.toLowerCase()}.` : '';
      return `With just ${fmt(t.population)} residents, ${t.name} ${t.nickname !== 'A Montana Community' ? `("${t.nickname}") ` : ''}offers ${t.recTotal} recreation sites nearby${safety} and a ${(t.affordabilityRatio ?? 0) <= 3 ? 'very affordable' : 'moderate'} cost of living.${gradNote}${jobNote}${indNote}${invNote} ${t.county ? `Nestled in ${formatCountyLabel(t.county)}` : 'Nestled'} at ${fmt(t.elevation)} feet, it\'s authentic Montana.`;
    },
    stats: t => [
      { label: 'Population', value: fmt(t.population) },
      ...(t.graduationRate != null ? [{ label: 'Grad Rate', value: t.graduationRate + '%' }] : []),
      ...(t.forSaleInventory != null ? [{ label: 'For Sale', value: fmt(t.forSaleInventory) }] : [{ label: 'Vacancy', value: (t.vacancyRate ?? 0) + '%' }]),
      { label: 'Rec Score', value: t.recScore + '/10' },
    ],
  },
  {
    slug: 'best-towns-near-glacier-yellowstone',
    title: '10 Best Montana Towns Near Glacier & Yellowstone',
    metaDescription: 'Montana towns closest to Glacier and Yellowstone National Parks: gateway communities for America\'s most iconic parks.',
    heroSubtitle: 'Gateway Communities to America\'s Crown Jewels',
    intro: 'Glacier and Yellowstone are two of the most visited national parks in America, drawing millions of visitors each year. But the towns near these parks are destinations in their own right: vibrant communities with their own character, dining, lodging, and outdoor offerings. Whether you\'re planning a park visit or looking for a place to call home near wild country, these are the best gateway towns.',
    methodology: 'Ranked by distance to the nearest entrance of Glacier National Park or Yellowstone National Park. Distances are straight-line estimates to the nearest park entrance (West Glacier, East Glacier, West Yellowstone entrance, or Gardiner/North entrance).',
    count: 10,
    filter: t => t.nearestNatParkMiles != null,
    sort: (a, b) => (a.nearestNatParkMiles ?? 999) - (b.nearestNatParkMiles ?? 999),
    highlight: t => `${t.name} is just ${t.nearestNatParkMiles} miles from ${t.nearestNatParkName}. ${t.nickname !== 'A Montana Community' ? `Known as "${t.nickname}," this` : 'This'} community of ${fmt(t.population)} serves as an ideal base camp with ${t.recTotal} recreation sites nearby.`,
    stats: t => [
      { label: 'Nearest Park', value: t.nearestNatParkName ?? '—' },
      { label: 'Distance', value: (t.nearestNatParkMiles ?? 0) + ' mi' },
      { label: 'Rec Sites', value: fmt(t.recTotal) },
      { label: 'Population', value: fmt(t.population) },
    ],
  },
  {
    slug: 'best-towns-for-retirees',
    title: '10 Best Montana Towns for Retirees',
    metaDescription: 'The best Montana towns to retire in: combining healthcare access, safety, housing availability, affordability, mild climate, and outdoor recreation.',
    heroSubtitle: 'Your Golden Years in Big Sky Country',
    intro: 'Montana is increasingly popular with retirees seeking stunning scenery, low crime, and a relaxed pace of life, along with no state sales tax. We ranked Montana\'s towns by the factors that matter most to retirees: healthcare access, safety, housing availability, affordability, climate mildness, environmental quality, and recreation.',
    methodology: 'Ranked by a composite retiree score factoring in healthcare access (distance to hospitals + trauma center level, ×4), safety (FBI UCR crime rate, ×3), environmental health (EPA Superfund data, ×3), affordability ratio (×3), housing availability (×2), climate mildness (×2), recreation score (×2), and proximity to hot springs/museums (×1 each). Healthcare data from Montana DPHHS Trauma Facility Designations.',
    count: 10,
    filter: t => t.affordabilityRatio != null && t.janLow != null,
    sort: (a, b) => {
      const safetyA = a.safetyScore != null ? a.safetyScore : 5;
      const safetyB = b.safetyScore != null ? b.safetyScore : 5;
      const healthA = a.healthcareScore ?? 3;
      const healthB = b.healthcareScore ?? 3;
      const scoreA = healthA * 4
        + safetyA * 3
        + (a.environmentalScore ?? 10) * 3
        + Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 3
        + housingAvailScore(a) * 2
        + Math.max((a.janLow ?? -20) + 20, 0) / 5 * 2
        + a.recScore * 2
        + (a.nearestHotSpringMiles != null && a.nearestHotSpringMiles <= 30 ? 2 : 0)
        + Math.min((a.recByType['Museum'] ?? 0) / 3, 2);
      const scoreB = healthB * 4
        + safetyB * 3
        + (b.environmentalScore ?? 10) * 3
        + Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 3
        + housingAvailScore(b) * 2
        + Math.max((b.janLow ?? -20) + 20, 0) / 5 * 2
        + b.recScore * 2
        + (b.nearestHotSpringMiles != null && b.nearestHotSpringMiles <= 30 ? 2 : 0)
        + Math.min((b.recByType['Museum'] ?? 0) / 3, 2);
      return scoreB - scoreA;
    },
    highlight: t => {
      const safety = t.safetyScore != null ? ` Safety: ${t.safetyScore}/10.` : '';
      const healthNote = t.nearestHospitalName ? ` ${t.hasLocalHospital ? `Has a local hospital (${t.nearestHospitalName})` : `${t.nearestHospitalName} is ${t.nearestHospitalDist} mi away`}${t.nearestMajorHospitalDist != null && t.nearestMajorHospitalDist <= 60 ? `, with ${t.nearestMajorHospitalName} (Level ${t.nearestMajorHospitalDist <= 5 ? '' : t.nearestMajorHospitalDist + ' mi'}${t.nearestMajorHospitalDist <= 5 ? 'in town' : ''}) for advanced care` : ''}.` : '';
      const invNote = t.forSaleInventory != null ? ` ${t.forSaleInventory} homes for sale.` : '';
      const envNote = t.superfundSites > 0 ? ` Note: ${t.superfundSites} EPA Superfund site(s) nearby.` : '';
      return `${t.name} offers ${(t.affordabilityRatio ?? 0) <= 3 ? 'excellent' : (t.affordabilityRatio ?? 0) <= 5 ? 'good' : 'moderate'} affordability (${t.affordabilityRatio}x ratio) with January lows averaging ${t.janLow}°F.${healthNote}${safety}${invNote} Recreation score: ${t.recScore}/10 with ${t.recTotal} nearby attractions.${t.nearestHotSpringMiles != null && t.nearestHotSpringMiles <= 30 ? ` ${t.nearestHotSpringName} is just ${t.nearestHotSpringMiles} miles away.` : ''}${envNote}`;
    },
    stats: t => [
      { label: 'Healthcare', value: (t.healthcareScore ?? 0) + '/10' },
      ...(t.safetyScore != null ? [{ label: 'Safety', value: t.safetyScore + '/10' }] : []),
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Hospital', value: t.nearestHospitalDist != null ? (t.nearestHospitalDist <= 5 ? 'In town' : t.nearestHospitalDist + ' mi') : '—' },
    ],
  },
  {
    slug: 'best-climate',
    title: '10 Montana Towns with the Best Climate',
    metaDescription: 'Montana towns with the mildest winters and best year-round weather: ranked by temperature, snowfall, and sunshine.',
    heroSubtitle: 'Where Montana\'s Winters Are (Relatively) Gentle',
    intro: 'Let\'s be honest: Montana winters can be brutal. But not everywhere in the state gets hammered equally. Montana\'s western valleys, particularly along the Clark Fork and Bitterroot corridors, benefit from Pacific weather patterns that moderate winter temperatures. These towns offer the mildest Montana winters while still delivering four distinct seasons and plenty of sunshine.',
    methodology: 'Ranked by a climate mildness score factoring in January average low temperature (higher is better, ×3), annual snowfall (lower is better, ×2), and July average high (moderate is best, ×1). Based on 5-year climate averages from Open-Meteo historical data.',
    count: 10,
    filter: t => t.janLow != null && t.annualSnow != null,
    sort: (a, b) => {
      const scoreA = ((a.janLow ?? -20) + 20) * 3 - (a.annualSnow ?? 100) * 0.5 - Math.abs((a.julHigh ?? 85) - 85) * 0.5;
      const scoreB = ((b.janLow ?? -20) + 20) * 3 - (b.annualSnow ?? 100) * 0.5 - Math.abs((b.julHigh ?? 85) - 85) * 0.5;
      return scoreB - scoreA;
    },
    highlight: t => `${t.name} enjoys January lows averaging ${t.janLow}°F and July highs around ${t.julHigh}°F, with ${t.annualSnow}" of annual snowfall. At ${fmt(t.elevation)} feet in ${t.county ? formatCountyLabel(t.county) : 'Montana'}, it stands out for comparatively mild winters by Montana standards.`,
    stats: t => [
      { label: 'Jan Low', value: (t.janLow ?? 0) + '°F' },
      { label: 'Jul High', value: (t.julHigh ?? 0) + '°F' },
      { label: 'Annual Snow', value: (t.annualSnow ?? 0) + '"' },
      { label: 'Precip', value: (t.annualPrecip ?? 0) + '"' },
    ],
  },
  {
    slug: 'best-towns-for-families',
    title: '10 Best Montana Towns for Families',
    metaDescription: 'The best Montana towns to raise a family: ranked by school quality, safety, healthcare, housing availability, jobs, affordability, and recreation.',
    heroSubtitle: 'Where Montana Families Thrive',
    intro: 'Raising a family in Montana often means outdoor access, close-knit communities, and kids who grow up exploring the outdoors. But which towns offer the best combination of good schools, available housing, hospital access, strong job markets, and family-friendly recreation? We analyzed every Montana community across the factors that matter most to families.',
    methodology: 'Ranked by a composite family score: safety (FBI UCR crime rate, ×4), school quality (graduation rate, ×4), environmental health (EPA Superfund data, ×3), job market (Census unemployment rate, ×3), affordability ratio (×3), healthcare access (hospital proximity + trauma level, ×2), housing availability (×2), school enrollment (×2), recreation score (×2), and population (×1). Healthcare data from Montana DPHHS.',
    count: 10,
    filter: t => t.schoolEnrollment != null && t.schoolEnrollment > 100 && t.affordabilityRatio != null,
    sort: (a, b) => {
      const safetyA = a.safetyScore != null ? a.safetyScore : 5;
      const safetyB = b.safetyScore != null ? b.safetyScore : 5;
      const schoolA = a.schoolScore ?? 8.5;
      const schoolB = b.schoolScore ?? 8.5;
      const jobA = a.jobScore ?? 8;
      const jobB = b.jobScore ?? 8;
      const healthA = a.healthcareScore ?? 3;
      const healthB = b.healthcareScore ?? 3;
      const scoreA = safetyA * 4
        + schoolA * 4
        + (a.environmentalScore ?? 10) * 3
        + jobA * 3
        + Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 3
        + healthA * 2
        + housingAvailScore(a) * 2
        + Math.min((a.schoolEnrollment ?? 0) / 500, 3) * 2
        + a.recScore * 2
        + Math.min((a.population ?? 0) / 5000, 2);
      const scoreB = safetyB * 4
        + schoolB * 4
        + (b.environmentalScore ?? 10) * 3
        + jobB * 3
        + Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 3
        + healthB * 2
        + housingAvailScore(b) * 2
        + Math.min((b.schoolEnrollment ?? 0) / 500, 3) * 2
        + b.recScore * 2
        + Math.min((b.population ?? 0) / 5000, 2);
      return scoreB - scoreA;
    },
    highlight: t => {
      const safetyLabel = t.safetyScore != null ? (t.safetyScore >= 8 ? 'very safe' : t.safetyScore >= 6 ? 'safe' : t.safetyScore >= 4 ? 'moderate safety' : 'higher crime rates') : '';
      const gradNote = t.graduationRate != null ? ` The local high school graduation rate is ${t.graduationRate}%.` : '';
      const jobNote = t.unemploymentRate != null ? ` Unemployment is ${t.unemploymentRate}%.` : '';
      const hospNote = t.hasLocalHospital ? ` Has a local hospital.` : (t.nearestHospitalDist != null && t.nearestHospitalDist <= 30 ? ` Nearest hospital: ${t.nearestHospitalDist} mi.` : '');
      const indNote = t.mainIndustry ? ` Top industry: ${t.mainIndustry.toLowerCase()}.` : '';
      const envNote = t.superfundSites > 0 ? ` Note: ${t.superfundSites} EPA Superfund site(s) nearby.` : '';
      return `${t.name}${t.nickname !== 'A Montana Community' ? ` ("${t.nickname}")` : ''} has ${fmt(t.schoolEnrollment)} students in the ${t.schoolDistrict || t.name} school district.${gradNote} ${safetyLabel ? `The community has ${safetyLabel} (${t.safetyScore}/10).` : ''}${jobNote}${indNote}${hospNote} With a ${(t.affordabilityRatio ?? 0) <= 3 ? 'very affordable' : (t.affordabilityRatio ?? 0) <= 5 ? 'moderate' : 'higher'} cost of living and ${t.recTotal} recreation sites nearby, it\'s a great place to raise kids.${envNote}`;
    },
    stats: t => [
      ...(t.safetyScore != null ? [{ label: 'Safety', value: t.safetyScore + '/10' }] : []),
      ...(t.graduationRate != null ? [{ label: 'Grad Rate', value: t.graduationRate + '%' }] : []),
      { label: 'Hospital', value: t.nearestHospitalDist != null ? (t.nearestHospitalDist <= 5 ? 'In town' : t.nearestHospitalDist + ' mi') : '—' },
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
    ],
  },
  {
    slug: 'best-towns-for-young-professionals',
    title: '10 Best Montana Towns for Young Professionals',
    metaDescription: 'Montana towns with the best job markets, available housing, lowest unemployment, and highest quality of life for young professionals and remote workers.',
    heroSubtitle: 'Build Your Career in Big Sky Country',
    intro: 'Montana isn\'t just a place to retire or vacation. It\'s increasingly a destination for young professionals and remote workers drawn by the quality of life, outdoor access, and growing local economies. We ranked Montana towns by the factors that matter most to career-minded residents: job availability, housing you can actually buy, affordability, safety, recreation, and community vitality.',
    methodology: 'Ranked by a composite score: job market health (Census unemployment rate + labor force participation, ×5), housing availability (vacancy rate + inventory, ×3), affordability ratio (×3), safety (FBI UCR, ×3), recreation score (×2), population vitality (×1), and environmental health (×1). Housing data from Zillow Research and Census ACS.',
    count: 10,
    filter: t => t.unemploymentRate != null && t.affordabilityRatio != null && t.population != null && t.population > 500,
    sort: (a, b) => {
      const safetyA = a.safetyScore != null ? a.safetyScore : 5;
      const safetyB = b.safetyScore != null ? b.safetyScore : 5;
      const jobA = (a.jobScore ?? 5) + Math.min((a.laborForceParticipation ?? 60) / 10, 8);
      const jobB = (b.jobScore ?? 5) + Math.min((b.laborForceParticipation ?? 60) / 10, 8);
      const scoreA = jobA * 5
        + housingAvailScore(a) * 3
        + Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 3
        + safetyA * 3
        + a.recScore * 2
        + Math.min((a.population ?? 0) / 5000, 2)
        + (a.environmentalScore ?? 10) * 1;
      const scoreB = jobB * 5
        + housingAvailScore(b) * 3
        + Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 3
        + safetyB * 3
        + b.recScore * 2
        + Math.min((b.population ?? 0) / 5000, 2)
        + (b.environmentalScore ?? 10) * 1;
      return scoreB - scoreA;
    },
    highlight: t => {
      const safetyNote = t.safetyScore != null ? ` Safety: ${t.safetyScore}/10.` : '';
      const invNote = t.forSaleInventory != null ? ` There are ${t.forSaleInventory} homes currently for sale.` : (t.vacancyRate != null ? ` Vacancy rate: ${t.vacancyRate}%.` : '');
      const indNote = t.mainIndustry ? ` The local economy is led by ${t.mainIndustry.toLowerCase()}${t.topIndustries && t.topIndustries.length >= 2 ? ` (${t.topIndustries[0].pct}%) and ${t.topIndustries[1].name.toLowerCase()} (${t.topIndustries[1].pct}%)` : ''}.` : '';
      return `${t.name} has a ${t.unemploymentRate}% unemployment rate with ${t.laborForceParticipation}% labor force participation.${indNote} ${(t.affordabilityRatio ?? 99) <= 4 ? 'Housing is affordable' : 'Housing is moderate'} at a ${t.affordabilityRatio}x price-to-income ratio.${invNote}${safetyNote}`;
    },
    stats: t => [
      { label: 'Unemp', value: t.unemploymentRate + '%' },
      ...(t.mainIndustry ? [{ label: 'Top Industry', value: t.mainIndustry }] : []),
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Rec Score', value: t.recScore + '/10' },
    ],
  },
  {
    slug: 'best-housing-availability',
    title: '10 Montana Towns with the Best Housing Availability',
    metaDescription: 'Montana towns with the most homes for sale right now: ranked by current Zillow inventory, vacancy rates, and market activity.',
    heroSubtitle: 'Where You Can Actually Find a Home to Buy',
    intro: 'Montana\'s housing market has been notoriously tight in recent years, with bidding wars and limited inventory frustrating buyers across the state. But not every town is equally competitive. We ranked Montana communities by current housing availability using real-time Zillow inventory data and Census vacancy rates to help you find towns where homes are actually on the market.',
    methodology: 'Ranked by a housing availability score combining: Zillow for-sale inventory per 1,000 residents (×3 weight, higher means more options relative to town size), Census vacancy rate (×2, higher means more housing turnover), and year-over-year inventory change (×1, increasing inventory is positive). Data from Zillow Research and U.S. Census ACS 5-Year Estimates. Towns without sufficient data were excluded. See collection dates below.',
    count: 10,
    filter: t => t.forSaleInventory != null && t.forSaleInventory > 0 && t.totalHousingUnits != null && t.population != null && t.population > 500,
    sort: (a, b) => {
      const invPerCapA = (a.forSaleInventory ?? 0) / Math.max(a.population ?? 1, 1) * 1000;
      const invPerCapB = (b.forSaleInventory ?? 0) / Math.max(b.population ?? 1, 1) * 1000;
      const scoreA = invPerCapA * 3 + (a.vacancyRate ?? 0) * 0.3 + Math.max(a.inventoryYoY ?? 0, 0) * 0.1;
      const scoreB = invPerCapB * 3 + (b.vacancyRate ?? 0) * 0.3 + Math.max(b.inventoryYoY ?? 0, 0) * 0.1;
      return scoreB - scoreA;
    },
    highlight: t => {
      const perCap = Math.round((t.forSaleInventory ?? 0) / Math.max(t.population ?? 1, 1) * 1000 * 10) / 10;
      const yoy = t.inventoryYoY != null ? (t.inventoryYoY > 0 ? `, up ${t.inventoryYoY}% from last year` : t.inventoryYoY < 0 ? `, down ${Math.abs(t.inventoryYoY)}% from last year` : '') : '';
      return `${t.name} currently has ${t.forSaleInventory} homes for sale (${perCap} per 1,000 residents${yoy}). With ${t.totalHousingUnits?.toLocaleString()} total housing units and a ${t.vacancyRate}% vacancy rate, buyers have more options here than in most Montana communities.`;
    },
    stats: t => [
      { label: 'For Sale', value: fmt(t.forSaleInventory) + ' homes' },
      { label: 'Per 1,000', value: (Math.round((t.forSaleInventory ?? 0) / Math.max(t.population ?? 1, 1) * 1000 * 10) / 10).toString() },
      { label: 'Vacancy', value: (t.vacancyRate ?? 0) + '%' },
      { label: 'Home Value', value: fmtDollar(t.zillowHomeValue ?? t.medianHomeValue) },
    ],
  },
  {
    slug: 'best-towns-for-digital-nomads',
    title: '10 Best Montana Towns for Digital Nomads',
    metaDescription: 'The best Montana towns for digital nomads and remote workers: ranked by internet infrastructure, airport access, affordability, recreation, safety, and quality of life.',
    heroSubtitle: 'Remote Work Meets the Last Best Place',
    intro: 'Montana is emerging as an appealing destination for digital nomads and remote workers. Affordable housing compared to coastal cities, no state sales tax, world-class outdoor recreation, and access to larger regional service centers make Big Sky Country a compelling home base. Whether you\'re a freelancer, remote employee, or location-independent entrepreneur, these Montana towns offer the best combination of airport access, cost of living, and the legendary Montana lifestyle.',
    methodology: 'Ranked by a composite digital nomad score: internet infrastructure (population as broadband availability proxy, ×5), airport access (road miles to nearest commercial airport, ×4), affordability (price-to-income ratio, ×3), outdoor recreation (diversity and proximity of sites, ×3), safety (FBI UCR crime rates, ×2), climate mildness (January lows, ×2), and community amenities (healthcare, cafes, coworking proxy via population density, ×1). Towns under 2,000 population excluded due to unreliable broadband.',
    count: 10,
    filter: t => t.population != null && t.population >= 2000 && t.affordabilityRatio != null && t.nearestAirportMiles != null,
    sort: (a, b) => {
      const internetA = Math.min(Math.log10(Math.max(a.population ?? 1, 1)) / Math.log10(100000), 1) * 10;
      const internetB = Math.min(Math.log10(Math.max(b.population ?? 1, 1)) / Math.log10(100000), 1) * 10;
      const airportA = Math.max(10 - (a.nearestAirportMiles ?? 200) / 20, 0);
      const airportB = Math.max(10 - (b.nearestAirportMiles ?? 200) / 20, 0);
      const affordA = Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 1.25;
      const affordB = Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 1.25;
      const safetyA = a.safetyScore ?? 5;
      const safetyB = b.safetyScore ?? 5;
      const climateA = Math.max((a.janLow ?? -20) + 20, 0) / 4;
      const climateB = Math.max((b.janLow ?? -20) + 20, 0) / 4;
      const amenityA = Math.min((a.population ?? 0) / 10000, 1) * 5 + (a.healthcareScore ?? 3) * 0.5;
      const amenityB = Math.min((b.population ?? 0) / 10000, 1) * 5 + (b.healthcareScore ?? 3) * 0.5;
      const scoreA = internetA * 5 + airportA * 4 + affordA * 3 + a.recScore * 3 + safetyA * 2 + climateA * 2 + amenityA;
      const scoreB = internetB * 5 + airportB * 4 + affordB * 3 + b.recScore * 3 + safetyB * 2 + climateB * 2 + amenityB;
      return scoreB - scoreA;
    },
    highlight: t => {
      const airportNote = t.nearestAirportMiles != null && t.nearestAirportName
        ? `${t.nearestAirportName} is ${t.nearestAirportMiles} miles away for easy travel.`
        : '';
      const affordLabel = (t.affordabilityRatio ?? 99) <= 3 ? 'very affordable' : (t.affordabilityRatio ?? 99) <= 5 ? 'affordable' : 'moderate';
      const indNote = t.mainIndustry ? ` The local economy is anchored by ${t.mainIndustry.toLowerCase()}.` : '';
      const safetyNote = t.safetyScore != null ? ` Safety: ${t.safetyScore}/10.` : '';
      return `${t.name} combines ${affordLabel} living (${t.affordabilityRatio}x ratio) with ${t.recScore}/10 recreation access, making it a strong remote work base in Montana. ${airportNote}${indNote}${safetyNote} Population: ${fmt(t.population)}.`;
    },
    stats: t => [
      { label: 'Airport', value: t.nearestAirportMiles != null ? t.nearestAirportMiles + ' mi' : '—' },
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Rec Score', value: t.recScore + '/10' },
      { label: 'Population', value: fmt(t.population) },
    ],
  },
];

// ─── Static Generation ──────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: RANKINGS.map(r => ({ params: { slug: r.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const ranking = RANKINGS.find(r => r.slug === slug);
  if (!ranking) return { notFound: true };

  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (f: string) => {
    const p = path.join(dataDir, f);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };

  const townData = load('town-data.json');
  const housing = load('town-housing.json');
  const recreation = load('town-recreation.json');
  const climate = load('town-climate.json');
  const nicknames = load('town-nicknames.json');
  const coords = load('town-coordinates.json');
  const crime = load('town-crime.json');
  const envData = load('town-environmental.json');
  const economy = load('town-economy.json');
  const healthcare = load('town-healthcare.json');
  const airportDist = load('town-airport-distances.json');
  const rawFreshness = load('data-freshness.json');

  const allTowns: TownRaw[] = Object.keys(coords).map(s => {
    const d = townData[s] || {};
    const h = housing[s] || {};
    const rec = filterNearbyRecreation(recreation[s]?.places || []);
    const clim = climate[s]?.months;

    const recByType: Record<string, number> = {};
    rec.forEach((p: any) => { recByType[p.type] = (recByType[p.type] || 0) + 1; });

    const nearest = (type: string) => {
      const match = rec.find((p: any) => p.type === type);
      return match ? { miles: match.distMiles, name: match.name } : { miles: null, name: null };
    };

    const ski = nearest('Ski Area');
    const hs = nearest('Hot Spring');
    const np = nearest('National Park');
    const wild = nearest('Wilderness');

    return {
      slug: s,
      name: d.name || s,
      nickname: nicknames[s] || 'A Montana Community',
      population: d.population || null,
      elevation: d.elevation || null,
      county: d.county || null,
      schoolDistrict: d.schoolDistrict || null,
      schoolEnrollment: d.schoolEnrollment || null,
      medianHomeValue: h.medianHomeValue || null,
      medianRent: h.medianRent || null,
      medianHouseholdIncome: h.medianHouseholdIncome || null,
      zillowHomeValue: h.zillowHomeValue || null,
      zillowRent: h.zillowRent || null,
      affordabilityRatio: h.affordabilityRatio || null,
      homeValuePercentile: h.homeValuePercentile || null,
      recScore: computeRecScore(rec),
      recTotal: rec.length,
      recByType,
      nearestSkiMiles: ski.miles, nearestSkiName: ski.name,
      nearestHotSpringMiles: hs.miles, nearestHotSpringName: hs.name,
      nearestNatParkMiles: np.miles, nearestNatParkName: np.name,
      fishingCount: recByType['Fishing Access'] || 0,
      riverCount: recByType['River'] || 0,
      lakeCount: recByType['Lake'] || 0,
      trailCount: recByType['Trailhead'] || 0,
      campgroundCount: recByType['Campground'] || 0,
      wildernessMiles: wild.miles,
      safetyScore: crime[s]?.safetyScore ?? null,
      violentCrimeRate: crime[s]?.violentCrimeRate ?? null,
      propertyCrimeRate: crime[s]?.propertyCrimeRate ?? null,
      totalCrimeRate: crime[s]?.totalCrimeRate ?? null,
      environmentalScore: envData[s]?.environmentalScore ?? 10,
      environmentalConcernLevel: envData[s]?.environmentalConcernLevel ?? 'none',
      superfundSites: envData[s]?.superfundSites ?? 0,
      forSaleInventory: h.forSaleInventory ?? null,
      inventoryYoY: h.inventoryYoY ?? null,
      medianListPrice: h.medianListPrice ?? null,
      totalHousingUnits: h.totalHousingUnits ?? null,
      vacancyRate: h.vacancyRate ?? null,
      unemploymentRate: economy[s]?.unemploymentRate ?? null,
      laborForceParticipation: economy[s]?.laborForceParticipation ?? null,
      jobScore: economy[s]?.jobScore ?? null,
      graduationRate: economy[s]?.graduationRate ?? null,
      schoolScore: economy[s]?.schoolScore ?? null,
      perPupilSpending: economy[s]?.perPupilSpending ?? null,
      mainIndustry: economy[s]?.mainIndustry ?? null,
      topIndustries: economy[s]?.topIndustries ?? null,
      healthcareScore: healthcare[s]?.healthcareScore ?? null,
      nearestHospitalDist: healthcare[s]?.nearestHospitalDist ?? null,
      nearestHospitalName: healthcare[s]?.nearestHospital ?? null,
      nearestMajorHospitalDist: healthcare[s]?.nearestMajorHospitalDist ?? null,
      nearestMajorHospitalName: healthcare[s]?.nearestMajorHospital ?? null,
      hasLocalHospital: healthcare[s]?.hasLocalHospital ?? false,
      hospitalsWithin30: healthcare[s]?.hospitalsWithin30 ?? 0,
      julHigh: clim?.[6]?.avgHigh ?? null,
      janLow: clim?.[0]?.avgLow ?? null,
      annualSnow: clim ? Math.round(clim.reduce((s: number, m: any) => s + (m.snowIn || 0), 0)) : null,
      annualPrecip: clim ? Math.round(clim.reduce((s: number, m: any) => s + m.precipIn, 0) * 10) / 10 : null,
      nearestAirportMiles: (() => {
        const ap = airportDist[s] as Record<string, { distanceMiles: number; airportName: string }> | undefined;
        if (!ap) return null;
        const entries = Object.values(ap);
        if (entries.length === 0) return null;
        const closest = entries.reduce((best, cur) =>
          cur.distanceMiles < best.distanceMiles ? cur : best);
        return closest.distanceMiles;
      })(),
      nearestAirportName: (() => {
        const ap = airportDist[s] as Record<string, { distanceMiles: number; airportName: string }> | undefined;
        if (!ap) return null;
        const entries = Object.values(ap);
        if (entries.length === 0) return null;
        const closest = entries.reduce((best, cur) =>
          cur.distanceMiles < best.distanceMiles ? cur : best);
        return closest.airportName;
      })(),
    };
  });

  let filtered = ranking.filter ? allTowns.filter(ranking.filter) : [...allTowns];
  filtered.sort(ranking.sort);
  const top = filtered.slice(0, ranking.count);

  const { hasGuide, getRelatedRankings } = await import('../../lib/cross-links');

  const lodgingDir = path.resolve(process.cwd(), '..', 'lodging_pages');
  const toLodgingSlug = (s: string) => s === 'anaconda' ? 'anaconda-montana' : s;

  const towns: RankedTown[] = top.map((t, i) => ({
    rank: i + 1,
    slug: t.slug,
    name: t.name,
    nickname: t.nickname,
    population: t.population,
    highlight: ranking.highlight(t),
    stats: ranking.stats(t),
    hasGuide: hasGuide(t.slug),
    hasLodging: fs.existsSync(path.join(lodgingDir, `${toLodgingSlug(t.slug)}.md`)),
  }));

  const relatedRankings = getRelatedRankings(slug);

  return {
    props: {
      page: {
        slug: ranking.slug,
        title: ranking.title,
        metaDescription: ranking.metaDescription,
        heroSubtitle: ranking.heroSubtitle,
        intro: ranking.intro,
        methodology: ranking.methodology,
        towns,
      },
      freshness: {
        zillowInventory: rawFreshness.zillowInventory?.lastCollected ?? null,
        censusEmployment: rawFreshness.censusEmployment?.lastCollected ?? null,
        crime: rawFreshness.crime?.lastCollected ?? null,
        schools: rawFreshness.schools?.lastCollected ?? null,
        healthcare: rawFreshness.healthcare?.lastCollected ?? null,
        environmental: rawFreshness.environmental?.lastCollected ?? null,
      },
      relatedRankings,
      relatedArticles: isEnabled('content_hub_enabled')
        ? getRelatedArticles({ tags: deriveTagsFromSlug(slug), limit: 3 })
        : [],
    },
  };
};
