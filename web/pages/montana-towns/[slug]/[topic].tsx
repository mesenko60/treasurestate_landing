import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import StaysCTA from '../../../components/StaysCTA';
import StoreBanner from '../../../components/StoreBanner';
import RelatedGuides from '../../../components/town/RelatedGuides';
import CrossHubLinks from '../../../components/town/CrossHubLinks';
import { clusterConfigs, getClusterConfig } from '../../../components/town/cluster-data';
import { getTownNameFromSlug } from '../../../lib/towns';

const topicComponents: Record<string, Record<string, ComponentType<any>>> = {
  missoula: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/WeekendItinerary')),
  },
  bozeman: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/bozeman/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/bozeman/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/bozeman/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/bozeman/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/bozeman/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/bozeman/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/bozeman/WeekendItinerary')),
  },
  kalispell: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/kalispell/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/kalispell/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/kalispell/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/kalispell/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/kalispell/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/kalispell/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/kalispell/WeekendItinerary')),
  },
  whitefish: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/whitefish/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/whitefish/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/whitefish/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/whitefish/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/whitefish/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/whitefish/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/whitefish/WeekendItinerary')),
  },
  helena: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/helena/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/helena/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/helena/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/helena/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/helena/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/helena/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/helena/WeekendItinerary')),
  },
  billings: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/billings/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/billings/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/billings/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/billings/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/billings/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/billings/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/billings/WeekendItinerary')),
  },
  'great-falls': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/great-falls/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/great-falls/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/great-falls/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/great-falls/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/great-falls/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/great-falls/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/great-falls/WeekendItinerary')),
  },
  butte: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/butte/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/butte/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/butte/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/butte/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/butte/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/butte/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/butte/WeekendItinerary')),
  },
  livingston: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/livingston/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/livingston/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/livingston/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/livingston/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/livingston/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/livingston/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/livingston/WeekendItinerary')),
  },
  'red-lodge': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/red-lodge/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/red-lodge/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/red-lodge/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/red-lodge/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/red-lodge/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/red-lodge/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/red-lodge/WeekendItinerary')),
  },
  hamilton: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/hamilton/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/hamilton/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/hamilton/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/hamilton/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/hamilton/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/hamilton/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/hamilton/WeekendItinerary')),
  },
  'west-yellowstone': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/west-yellowstone/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/west-yellowstone/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/west-yellowstone/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/west-yellowstone/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/west-yellowstone/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/west-yellowstone/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/west-yellowstone/WeekendItinerary')),
  },
  'big-sky': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/big-sky/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/big-sky/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/big-sky/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/big-sky/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/big-sky/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/big-sky/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/big-sky/WeekendItinerary')),
  },
  'miles-city': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/miles-city/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/miles-city/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/miles-city/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/miles-city/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/miles-city/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/miles-city/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/miles-city/WeekendItinerary')),
  },
  polson: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/polson/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/polson/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/polson/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/polson/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/polson/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/polson/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/polson/WeekendItinerary')),
  },
  dillon: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/dillon/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/dillon/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/dillon/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/dillon/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/dillon/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/dillon/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/dillon/WeekendItinerary')),
  },
  'columbia-falls': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/columbia-falls/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/columbia-falls/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/columbia-falls/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/columbia-falls/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/columbia-falls/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/columbia-falls/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/columbia-falls/WeekendItinerary')),
  },
  anaconda: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/anaconda/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/anaconda/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/anaconda/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/anaconda/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/anaconda/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/anaconda/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/anaconda/WeekendItinerary')),
  },
  bigfork: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/bigfork/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/bigfork/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/bigfork/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/bigfork/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/bigfork/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/bigfork/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/bigfork/WeekendItinerary')),
  },
  'deer-lodge': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/deer-lodge/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/deer-lodge/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/deer-lodge/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/deer-lodge/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/deer-lodge/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/deer-lodge/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/deer-lodge/WeekendItinerary')),
  },
  libby: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/libby/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/libby/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/libby/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/libby/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/libby/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/libby/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/libby/WeekendItinerary')),
  },
  lewistown: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/lewistown/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/lewistown/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/lewistown/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/lewistown/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/lewistown/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/lewistown/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/lewistown/WeekendItinerary')),
  },
  glendive: {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/glendive/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/glendive/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/glendive/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/glendive/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/glendive/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/glendive/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/glendive/WeekendItinerary')),
  },
  'choteau': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/choteau/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/choteau/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/choteau/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/choteau/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/choteau/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/choteau/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/choteau/WeekendItinerary')),
  },
  'three-forks': {
    'cost-of-living': dynamic(() => import('../../../components/town/topics/three-forks/CostOfLiving')),
    'housing': dynamic(() => import('../../../components/town/topics/three-forks/Housing')),
    'jobs': dynamic(() => import('../../../components/town/topics/three-forks/Jobs')),
    'schools': dynamic(() => import('../../../components/town/topics/three-forks/Schools')),
    'hiking': dynamic(() => import('../../../components/town/topics/three-forks/Hiking')),
    'fishing': dynamic(() => import('../../../components/town/topics/three-forks/Fishing')),
    'weekend-itinerary': dynamic(() => import('../../../components/town/topics/three-forks/WeekendItinerary')),
  },
};

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  slug: string;
  topic: string;
  townName: string;
  heroImage: string;
  ogImage: string;
  housing: any | null;
  economy: any | null;
  population: number | null;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  schoolWebsite: string | null;
  graduationRate: number | null;
  perPupilSpending: number | null;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
  fishingAccess: RecPlace[];
  rivers: RecPlace[];
  lakes: RecPlace[];
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

export default function TopicPage(props: Props) {
  const { slug, topic, townName, ogImage } = props;
  const config = getClusterConfig(slug);
  const guide = config?.guides.find(g => g.topic === topic);
  if (!guide) return null;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/montana-towns/' },
    { name: townName, url: `https://treasurestate.com/montana-towns/${slug}/` },
    { name: guide.title, url: `https://treasurestate.com/montana-towns/${slug}/${topic}/` },
  ];

  const TopicComponent = topicComponents[slug]?.[topic] ?? topicComponents.missoula[topic];

  const topicProps: Record<string, Record<string, unknown>> = {
    'cost-of-living': { townName, slug, housing: props.housing, economy: props.economy },
    'housing': { townName, slug, housing: props.housing },
    'jobs': { townName, slug, economy: props.economy, population: props.population },
    'schools': { townName, slug, schoolDistrict: props.schoolDistrict, schoolEnrollment: props.schoolEnrollment, schoolWebsite: props.schoolWebsite, graduationRate: props.graduationRate, perPupilSpending: props.perPupilSpending, population: props.population },
    'hiking': { townName, slug, trails: props.trails, wilderness: props.wilderness, stateParks: props.stateParks },
    'fishing': { townName, slug, fishingAccess: props.fishingAccess, rivers: props.rivers, lakes: props.lakes },
    'weekend-itinerary': { townName, slug, climate: props.climate, highlights: props.highlights },
  };

  const content = TopicComponent ? <TopicComponent {...(topicProps[topic] || {})} /> : null;

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://treasurestate.com/montana-towns/${slug}/${topic}/`} />
        <title>{guide.metaTitle}</title>
        <meta name="description" content={guide.metaDescription} />
        <meta property="og:title" content={guide.metaTitle} />
        <meta property="og:description" content={guide.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://treasurestate.com/montana-towns/${slug}/${topic}/`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guide.metaTitle} />
        <meta name="twitter:description" content={guide.metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.h1,
          description: guide.metaDescription,
          url: `https://treasurestate.com/montana-towns/${slug}/${topic}/`,
          image: ogImage,
          datePublished: '2026-01-15T00:00:00-07:00',
          dateModified: '2026-02-21T00:00:00-07:00',
          author: {
            '@type': 'Organization',
            name: 'Treasure State',
            url: 'https://treasurestate.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Treasure State',
            url: 'https://treasurestate.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://treasurestate.com/favicon-512x512.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://treasurestate.com/montana-towns/${slug}/${topic}/`,
          },
          about: {
            '@type': 'City',
            name: townName,
            containedInPlace: { '@type': 'State', name: 'Montana' },
          },
        }) }} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Hero
        title={guide.h1}
        image={props.heroImage}
        alt={`${townName}, Montana`}
        small
      />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        {content}
        <RelatedGuides slug={slug} townName={townName} currentTopic={topic} />
        <CrossHubLinks slug={slug} topic={topic} townName={townName} />
        <StaysCTA townName={townName} slug={slug} />
        <StoreBanner />
      </main>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string; topic: string } }[] = [];
  for (const [slug, config] of Object.entries(clusterConfigs)) {
    for (const guide of config.guides) {
      paths.push({ params: { slug, topic: guide.topic } });
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const topic = String(ctx.params?.topic);
  const townName = getTownNameFromSlug(slug);

  const dataDir = path.resolve(process.cwd(), 'data');

  function loadJson(filename: string): Record<string, any> {
    try {
      const p = path.join(dataDir, filename);
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch { /* ignore */ }
    return {};
  }

  const allHousing = loadJson('town-housing.json');
  const allEconomy = loadJson('town-economy.json');
  const allTownData = loadJson('town-data.json');
  const allRecreation = loadJson('town-recreation.json');
  const allClimate = loadJson('town-climate.json');

  const rawHousing = allHousing[slug];
  const rawEconomy = allEconomy[slug];
  const rawTown = allTownData[slug];
  const recPlaces: RecPlace[] = allRecreation[slug]?.places || [];
  const climateMonths = allClimate[slug]?.months || null;

  const housing = rawHousing ? {
    medianHomeValue: rawHousing.medianHomeValue || null,
    medianRent: rawHousing.medianRent || null,
    medianHouseholdIncome: rawHousing.medianHouseholdIncome || null,
    zillowHomeValue: rawHousing.zillowHomeValue || null,
    zillowHomeValueDate: rawHousing.zillowHomeValueDate || null,
    zillowRent: rawHousing.zillowRent || null,
    zillowRentDate: rawHousing.zillowRentDate || null,
    homeValuePercentile: rawHousing.homeValuePercentile ?? null,
    rentPercentile: rawHousing.rentPercentile ?? null,
    incomePercentile: rawHousing.incomePercentile ?? null,
    affordabilityRatio: rawHousing.affordabilityRatio ?? null,
    forSaleInventory: rawHousing.forSaleInventory ?? null,
    forSaleInventoryDate: rawHousing.forSaleInventoryDate ?? null,
    inventoryYoY: rawHousing.inventoryYoY ?? null,
    medianListPrice: rawHousing.medianListPrice ?? null,
    newListings: rawHousing.newListings ?? null,
    totalHousingUnits: rawHousing.totalHousingUnits ?? null,
    vacancyRate: rawHousing.vacancyRate ?? null,
  } : null;

  const economy = rawEconomy ? {
    unemploymentRate: rawEconomy.unemploymentRate ?? null,
    laborForceParticipation: rawEconomy.laborForceParticipation ?? null,
    employed: rawEconomy.employed ?? null,
    laborForce: rawEconomy.laborForce ?? null,
    mainIndustry: rawEconomy.mainIndustry ?? null,
    topIndustries: rawEconomy.topIndustries ?? null,
    jobScore: rawEconomy.jobScore ?? null,
  } : null;

  const trailTypes = new Set(['Trailhead']);
  const wildTypes = new Set(['Wilderness']);
  const parkTypes = new Set(['State Park']);
  const fishTypes = new Set(['Fishing Access']);
  const riverTypes = new Set(['River']);
  const lakeTypes = new Set(['Lake']);
  const highlightTypes = new Set(['Museum', 'State Park', 'Hot Spring', 'Ski Area']);

  return {
    props: {
      slug,
      topic,
      townName,
      heroImage: fs.existsSync(path.resolve(process.cwd(), 'public', 'images', 'towns', `${slug}.jpg`))
        ? `/images/towns/${slug}.jpg`
        : '/images/towns/default-town.jpg',
      ogImage: fs.existsSync(path.resolve(process.cwd(), 'public', 'images', 'towns', `${slug}.jpg`))
        ? `https://treasurestate.com/images/towns/${slug}.jpg`
        : 'https://treasurestate.com/images/hero-image.jpg',
      housing,
      economy,
      population: rawTown?.population ?? null,
      schoolDistrict: rawTown?.schoolDistrict ?? null,
      schoolEnrollment: rawTown?.schoolEnrollment ?? null,
      schoolWebsite: rawTown?.schoolWebsite ?? null,
      graduationRate: rawEconomy?.graduationRate ?? null,
      perPupilSpending: rawEconomy?.perPupilSpending ?? null,
      trails: recPlaces.filter(p => trailTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles),
      wilderness: recPlaces.filter(p => wildTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles),
      stateParks: recPlaces.filter(p => parkTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles),
      fishingAccess: recPlaces.filter(p => fishTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles),
      rivers: recPlaces.filter(p => riverTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles),
      lakes: recPlaces.filter(p => lakeTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles).slice(0, 15),
      climate: climateMonths,
      highlights: recPlaces.filter(p => highlightTypes.has(p.type)).sort((a, b) => a.distMiles - b.distMiles).slice(0, 20),
    },
  };
};
