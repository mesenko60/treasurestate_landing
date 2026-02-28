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

type RankedTown = {
  rank: number;
  slug: string;
  name: string;
  nickname: string;
  population: number | null;
  highlight: string;
  stats: { label: string; value: string }[];
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

type Props = { page: PageData };

function fmt(n: number | null | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null | undefined): string {
  if (n == null) return '—';
  return '$' + n.toLocaleString('en-US');
}

export default function BestOfPage({ page }: Props) {
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
    itemListElement: page.towns.map(t => ({
      '@type': 'ListItem',
      position: t.rank,
      name: `${t.name}, Montana`,
      url: `https://treasurestate.com/montana-towns/${t.slug}/`,
      description: t.highlight,
    })),
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

  return (
    <>
      <Head>
        <title>{page.title} | Treasure State</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </Head>
      <Header />
      <Hero title={page.title} subtitle={page.heroSubtitle} image="/images/hero-image.jpg" alt={page.title} small />
      <Breadcrumbs items={breadcrumbs} />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333', marginBottom: '2rem' }}>
          {page.intro}
        </p>

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

                  <div style={{ marginTop: '0.6rem' }}>
                    <Link href={`/montana-towns/${town.slug}/`} style={{
                      fontSize: '0.82rem', color: '#3b6978', fontWeight: 500, textDecoration: 'none',
                    }}>
                      Explore {town.name} →
                    </Link>
                    <Link href={`/compare?a=${town.slug}`} style={{
                      fontSize: '0.82rem', color: '#888', marginLeft: '1rem', textDecoration: 'none',
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
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/best-of/" style={{
            display: 'inline-block', padding: '0.75rem 1.5rem',
            background: '#3b6978', color: '#fff', borderRadius: '6px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
          }}>
            View All Rankings
          </Link>
        </div>
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
  julHigh: number | null;
  janLow: number | null;
  annualSnow: number | null;
  annualPrecip: number | null;
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

const RANKINGS: RankingDef[] = [
  {
    slug: 'most-affordable-towns',
    title: '10 Most Affordable Towns in Montana',
    metaDescription: 'Discover Montana\'s most affordable places to live. Ranked by home prices, rent, and price-to-income ratio using Census and Zillow data.',
    heroSubtitle: 'Where Your Dollar Goes Furthest in Big Sky Country',
    intro: 'Montana\'s stunning landscapes don\'t have to come with a steep price tag. While towns like Bozeman and Whitefish have seen prices soar, many Montana communities still offer an affordable cost of living paired with incredible quality of life. We ranked every Montana town by affordability using median home values, rent, household income, and the critical price-to-income ratio.',
    methodology: 'Rankings based on affordability ratio (median home value ÷ median household income), with preference for towns with lower absolute home values and rent. Data from U.S. Census Bureau ACS 5-Year Estimates (2019–2023) and Zillow Home Value Index (2026). Towns without sufficient housing data were excluded.',
    count: 10,
    filter: t => t.affordabilityRatio != null && t.affordabilityRatio > 0 && t.medianHomeValue != null,
    sort: (a, b) => (a.affordabilityRatio ?? 99) - (b.affordabilityRatio ?? 99),
    highlight: t => {
      const ratio = t.affordabilityRatio!;
      const label = ratio <= 2 ? 'extremely affordable' : ratio <= 3 ? 'very affordable' : 'affordable';
      return `With a price-to-income ratio of ${ratio}x, ${t.name} is ${label}. ${t.county ? `Located in ${t.county} County` : 'Located'} with a population of ${fmt(t.population)}, it offers small-town Montana living at a fraction of the cost of larger cities.`;
    },
    stats: t => [
      { label: 'Home Value', value: fmtDollar(t.zillowHomeValue ?? t.medianHomeValue) },
      { label: 'Rent', value: fmtDollar(t.zillowRent ?? t.medianRent) + '/mo' },
      { label: 'Income', value: fmtDollar(t.medianHouseholdIncome) },
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
    ],
  },
  {
    slug: 'best-outdoor-recreation',
    title: '10 Best Montana Towns for Outdoor Recreation',
    metaDescription: 'The top Montana towns for outdoor adventure — ranked by access to trails, parks, rivers, ski areas, and wilderness within 50 miles.',
    heroSubtitle: 'Where Adventure Is Always Just Outside Your Door',
    intro: 'Montana is an outdoor paradise, but some towns are better positioned than others. We scored every Montana community based on the variety, quality, and proximity of nearby recreation — from national parks and wilderness areas to trailheads, rivers, ski resorts, and hot springs. These are the towns where the outdoors isn\'t just nearby, it\'s your backyard.',
    methodology: 'Recreation Score (0–10) computed from four factors: category diversity (how many types of recreation are nearby), total volume of sites, quality weighting (national parks and wilderness count more than viewpoints), and proximity of the nearest notable attraction. Data sourced from OpenStreetMap and editorial research, using a tiered radius system (50–100 miles depending on site significance).',
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
    metaDescription: 'The top Montana towns closest to ski resorts — from Whitefish Mountain to Big Sky, Bridger Bowl, and more hidden gems.',
    heroSubtitle: 'Montana\'s Premier Mountain Communities for Powder Chasers',
    intro: 'Montana is home to some of the best skiing in North America, with uncrowded slopes, deep powder, and affordable lift tickets compared to Colorado or Utah. These towns put you closest to the action, whether you\'re chasing groomers at Whitefish Mountain Resort, powder stashes at Bridger Bowl, or the sprawling terrain of Big Sky.',
    methodology: 'Ranked by distance to the nearest ski area, with consideration for towns near multiple ski areas. Ski areas include both major destination resorts and smaller community hills. Distances are straight-line estimates.',
    count: 10,
    filter: t => t.nearestSkiMiles != null,
    sort: (a, b) => (a.nearestSkiMiles ?? 999) - (b.nearestSkiMiles ?? 999),
    highlight: t => `${t.name} is just ${t.nearestSkiMiles} miles from ${t.nearestSkiName}.${t.annualSnow != null ? ` The area receives ${t.annualSnow}" of snow annually.` : ''} ${t.nickname !== 'A Montana Community' ? `Known as "${t.nickname}," it` : 'It'} offers year-round mountain living with world-class winter sports on your doorstep.`,
    stats: t => [
      { label: 'Nearest Ski', value: t.nearestSkiName ?? '—' },
      { label: 'Distance', value: (t.nearestSkiMiles ?? 0) + ' mi' },
      { label: 'Annual Snow', value: (t.annualSnow ?? 0) + '"' },
      { label: 'Elevation', value: fmt(t.elevation) + ' ft' },
    ],
  },
  {
    slug: 'best-fishing-towns',
    title: '10 Best Montana Towns for Fly Fishing',
    metaDescription: 'Montana\'s top towns for fly fishing — ranked by access to blue-ribbon rivers, fishing access sites, and lakes.',
    heroSubtitle: 'Where World-Class Trout Water Is Minutes Away',
    intro: 'Montana is the fly fishing capital of America, home to legendary rivers like the Madison, Yellowstone, Missouri, and Blackfoot. But which towns give you the best access? We ranked every Montana community by the number of rivers, fishing access sites, and lakes within reach. Whether you\'re a seasoned angler or picking up a rod for the first time, these towns put you on the water.',
    methodology: 'Ranked by a composite fishing score: number of rivers (×3 weight) + fishing access sites (×2) + lakes (×1) within the standard radius. Blue-ribbon rivers and designated fishing access sites are weighted more heavily than general lakes.',
    count: 10,
    sort: (a, b) => {
      const scoreA = a.riverCount * 3 + a.fishingCount * 2 + Math.min(a.lakeCount, 20);
      const scoreB = b.riverCount * 3 + b.fishingCount * 2 + Math.min(b.lakeCount, 20);
      return scoreB - scoreA;
    },
    highlight: t => `${t.name} has ${t.riverCount} rivers, ${t.fishingCount} fishing access sites, and ${t.lakeCount} lakes nearby. ${t.county ? `Located in ${t.county} County` : 'Located'} at ${fmt(t.elevation)} feet, it\'s a premier base camp for Montana fly fishing.`,
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
    metaDescription: 'Montana towns closest to natural hot springs — from Chico to Lolo, Quinn\'s, and more. Find your perfect soak.',
    heroSubtitle: 'Soak in Big Sky Country\'s Natural Geothermal Waters',
    intro: 'Montana sits atop one of the most geothermally active regions in North America, and the state is dotted with natural hot springs — from rustic soaking pools along mountain creeks to full resort experiences. These towns put you closest to Montana\'s best hot springs, so you can end every adventure with a warm soak under the stars.',
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
    metaDescription: 'Discover Montana\'s best small towns — charming communities under 5,000 people with big character, stunning scenery, and outdoor access.',
    heroSubtitle: 'Small-Town Charm Meets Big Sky Country',
    intro: 'Some of Montana\'s most special places are its smallest communities. These towns under 5,000 people offer the quintessential Montana experience — genuine character, stunning natural settings, and a pace of life that lets you breathe. We ranked them by a blend of recreation access, affordability, and the kind of charm that makes people fall in love with a place.',
    methodology: 'Limited to towns with population under 5,000. Ranked by a composite score of recreation score (×3), affordability (inverted ratio ×2), and category diversity. Towns with higher recreation access and lower cost of living rank highest.',
    count: 10,
    filter: t => t.population != null && t.population > 0 && t.population < 5000 && t.affordabilityRatio != null,
    sort: (a, b) => {
      const scoreA = a.recScore * 3 + Math.max(6 - (a.affordabilityRatio ?? 6), 0) * 2;
      const scoreB = b.recScore * 3 + Math.max(6 - (b.affordabilityRatio ?? 6), 0) * 2;
      return scoreB - scoreA;
    },
    highlight: t => `With just ${fmt(t.population)} residents, ${t.name} ${t.nickname !== 'A Montana Community' ? `("${t.nickname}") ` : ''}offers ${t.recTotal} recreation sites nearby and a ${(t.affordabilityRatio ?? 0) <= 3 ? 'very affordable' : 'moderate'} cost of living. ${t.county ? `Nestled in ${t.county} County` : 'Nestled'} at ${fmt(t.elevation)} feet, it\'s authentic Montana.`,
    stats: t => [
      { label: 'Population', value: fmt(t.population) },
      { label: 'Rec Score', value: t.recScore + '/10' },
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Home Value', value: fmtDollar(t.zillowHomeValue ?? t.medianHomeValue) },
    ],
  },
  {
    slug: 'best-towns-near-glacier-yellowstone',
    title: '10 Best Montana Towns Near Glacier & Yellowstone',
    metaDescription: 'Montana towns closest to Glacier and Yellowstone National Parks — gateway communities for America\'s most iconic parks.',
    heroSubtitle: 'Gateway Communities to America\'s Crown Jewels',
    intro: 'Glacier and Yellowstone are two of the most visited national parks in America, drawing millions of visitors each year. But the towns near these parks are destinations in their own right — vibrant communities with their own character, dining, lodging, and outdoor offerings. Whether you\'re planning a park visit or looking for a place to call home near wild country, these are the best gateway towns.',
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
    metaDescription: 'The best Montana towns to retire in — combining affordability, mild climate, outdoor access, and small-town quality of life.',
    heroSubtitle: 'Your Golden Years in Big Sky Country',
    intro: 'Montana is increasingly popular with retirees seeking clean air, stunning scenery, low crime, and a relaxed pace of life — all without state income tax on retirement income. We ranked Montana\'s towns by the factors that matter most to retirees: affordability, climate mildness, recreation access, and community amenities like nearby hot springs and cultural attractions.',
    methodology: 'Ranked by a composite retiree score factoring in affordability ratio (×3, lower is better), climate mildness (January low temperature, ×2, higher is better), recreation score (×2), and proximity to hot springs and museums (×1 each). Montana has no state income tax, a major benefit for retirees.',
    count: 10,
    filter: t => t.affordabilityRatio != null && t.janLow != null,
    sort: (a, b) => {
      const scoreA = Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 3
        + Math.max((a.janLow ?? -20) + 20, 0) / 5 * 2
        + a.recScore * 2
        + (a.nearestHotSpringMiles != null && a.nearestHotSpringMiles <= 30 ? 2 : 0)
        + Math.min((a.recByType['Museum'] ?? 0) / 3, 2);
      const scoreB = Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 3
        + Math.max((b.janLow ?? -20) + 20, 0) / 5 * 2
        + b.recScore * 2
        + (b.nearestHotSpringMiles != null && b.nearestHotSpringMiles <= 30 ? 2 : 0)
        + Math.min((b.recByType['Museum'] ?? 0) / 3, 2);
      return scoreB - scoreA;
    },
    highlight: t => `${t.name} offers ${(t.affordabilityRatio ?? 0) <= 3 ? 'excellent' : (t.affordabilityRatio ?? 0) <= 5 ? 'good' : 'moderate'} affordability (${t.affordabilityRatio}x ratio) with January lows averaging ${t.janLow}°F. With a recreation score of ${t.recScore}/10 and ${t.recTotal} nearby attractions, there\'s always something to do.${t.nearestHotSpringMiles != null && t.nearestHotSpringMiles <= 30 ? ` ${t.nearestHotSpringName} is just ${t.nearestHotSpringMiles} miles away for a relaxing soak.` : ''}`,
    stats: t => [
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Jan Low', value: (t.janLow ?? 0) + '°F' },
      { label: 'Rec Score', value: t.recScore + '/10' },
      { label: 'Home Value', value: fmtDollar(t.zillowHomeValue ?? t.medianHomeValue) },
    ],
  },
  {
    slug: 'best-climate',
    title: '10 Montana Towns with the Best Climate',
    metaDescription: 'Montana towns with the mildest winters and best year-round weather — ranked by temperature, snowfall, and sunshine.',
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
    highlight: t => `${t.name} enjoys January lows averaging ${t.janLow}°F and July highs around ${t.julHigh}°F, with ${t.annualSnow}" of annual snowfall. At ${fmt(t.elevation)} feet in ${t.county ? t.county + ' County' : 'western Montana'}, it benefits from Pacific-moderated weather patterns.`,
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
    metaDescription: 'The best Montana towns to raise a family — ranked by schools, affordability, recreation, and community.',
    heroSubtitle: 'Where Montana Families Thrive',
    intro: 'Raising a family in Montana means clean air, safe communities, and kids who grow up exploring the outdoors. But which towns offer the best combination of good schools, affordable housing, and family-friendly recreation? We analyzed every Montana community across the factors that matter most to families.',
    methodology: 'Ranked by a composite family score: school enrollment (indicates community investment in education, ×2), affordability ratio (lower is better, ×3), recreation score (×2), and population (mid-size towns preferred for services and community, ×1). Towns without school data were excluded.',
    count: 10,
    filter: t => t.schoolEnrollment != null && t.schoolEnrollment > 100 && t.affordabilityRatio != null,
    sort: (a, b) => {
      const scoreA = Math.min((a.schoolEnrollment ?? 0) / 500, 3) * 2
        + Math.max(8 - (a.affordabilityRatio ?? 8), 0) * 3
        + a.recScore * 2
        + Math.min((a.population ?? 0) / 5000, 2);
      const scoreB = Math.min((b.schoolEnrollment ?? 0) / 500, 3) * 2
        + Math.max(8 - (b.affordabilityRatio ?? 8), 0) * 3
        + b.recScore * 2
        + Math.min((b.population ?? 0) / 5000, 2);
      return scoreB - scoreA;
    },
    highlight: t => `${t.name}${t.nickname !== 'A Montana Community' ? ` ("${t.nickname}")` : ''} has ${fmt(t.schoolEnrollment)} students in the ${t.schoolDistrict || t.name} school district. With a ${(t.affordabilityRatio ?? 0) <= 3 ? 'very affordable' : (t.affordabilityRatio ?? 0) <= 5 ? 'moderate' : 'higher'} cost of living and ${t.recTotal} recreation sites nearby, it\'s a great place to raise kids.`,
    stats: t => [
      { label: 'Schools', value: t.schoolDistrict ?? '—' },
      { label: 'Enrollment', value: fmt(t.schoolEnrollment) },
      { label: 'Affordability', value: (t.affordabilityRatio ?? 0) + 'x' },
      { label: 'Rec Score', value: t.recScore + '/10' },
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

  const allTowns: TownRaw[] = Object.keys(coords).map(s => {
    const d = townData[s] || {};
    const h = housing[s] || {};
    const rec = recreation[s]?.places || [];
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
      julHigh: clim?.[6]?.avgHigh ?? null,
      janLow: clim?.[0]?.avgLow ?? null,
      annualSnow: clim ? Math.round(clim.reduce((s: number, m: any) => s + (m.snowIn || 0), 0)) : null,
      annualPrecip: clim ? Math.round(clim.reduce((s: number, m: any) => s + m.precipIn, 0) * 10) / 10 : null,
    };
  });

  let filtered = ranking.filter ? allTowns.filter(ranking.filter) : [...allTowns];
  filtered.sort(ranking.sort);
  const top = filtered.slice(0, ranking.count);

  const towns: RankedTown[] = top.map((t, i) => ({
    rank: i + 1,
    slug: t.slug,
    name: t.name,
    nickname: t.nickname,
    population: t.population,
    highlight: ranking.highlight(t),
    stats: ranking.stats(t),
  }));

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
    },
  };
};
