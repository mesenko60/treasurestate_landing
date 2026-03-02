import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import StaysCTA from '../../../components/StaysCTA';
import StoreBanner from '../../../components/StoreBanner';
import RelatedGuides from '../../../components/town/RelatedGuides';
import { clusterConfigs, getClusterConfig } from '../../../components/town/cluster-data';
import { getTownNameFromSlug } from '../../../lib/towns';

import CostOfLiving from '../../../components/town/topics/CostOfLiving';
import Housing from '../../../components/town/topics/Housing';
import Jobs from '../../../components/town/topics/Jobs';
import Schools from '../../../components/town/topics/Schools';
import Hiking from '../../../components/town/topics/Hiking';
import Fishing from '../../../components/town/topics/Fishing';
import WeekendItinerary from '../../../components/town/topics/WeekendItinerary';

import BzmCostOfLiving from '../../../components/town/topics/bozeman/CostOfLiving';
import BzmHousing from '../../../components/town/topics/bozeman/Housing';
import BzmJobs from '../../../components/town/topics/bozeman/Jobs';
import BzmSchools from '../../../components/town/topics/bozeman/Schools';
import BzmHiking from '../../../components/town/topics/bozeman/Hiking';
import BzmFishing from '../../../components/town/topics/bozeman/Fishing';
import BzmWeekendItinerary from '../../../components/town/topics/bozeman/WeekendItinerary';

import KalCostOfLiving from '../../../components/town/topics/kalispell/CostOfLiving';
import KalHousing from '../../../components/town/topics/kalispell/Housing';
import KalJobs from '../../../components/town/topics/kalispell/Jobs';
import KalSchools from '../../../components/town/topics/kalispell/Schools';
import KalHiking from '../../../components/town/topics/kalispell/Hiking';
import KalFishing from '../../../components/town/topics/kalispell/Fishing';
import KalWeekendItinerary from '../../../components/town/topics/kalispell/WeekendItinerary';

import WfCostOfLiving from '../../../components/town/topics/whitefish/CostOfLiving';
import WfHousing from '../../../components/town/topics/whitefish/Housing';
import WfJobs from '../../../components/town/topics/whitefish/Jobs';
import WfSchools from '../../../components/town/topics/whitefish/Schools';
import WfHiking from '../../../components/town/topics/whitefish/Hiking';
import WfFishing from '../../../components/town/topics/whitefish/Fishing';
import WfWeekendItinerary from '../../../components/town/topics/whitefish/WeekendItinerary';

import HelCostOfLiving from '../../../components/town/topics/helena/CostOfLiving';
import HelHousing from '../../../components/town/topics/helena/Housing';
import HelJobs from '../../../components/town/topics/helena/Jobs';
import HelSchools from '../../../components/town/topics/helena/Schools';
import HelHiking from '../../../components/town/topics/helena/Hiking';
import HelFishing from '../../../components/town/topics/helena/Fishing';
import HelWeekendItinerary from '../../../components/town/topics/helena/WeekendItinerary';

import BilCostOfLiving from '../../../components/town/topics/billings/CostOfLiving';
import BilHousing from '../../../components/town/topics/billings/Housing';
import BilJobs from '../../../components/town/topics/billings/Jobs';
import BilSchools from '../../../components/town/topics/billings/Schools';
import BilHiking from '../../../components/town/topics/billings/Hiking';
import BilFishing from '../../../components/town/topics/billings/Fishing';
import BilWeekendItinerary from '../../../components/town/topics/billings/WeekendItinerary';

import GfCostOfLiving from '../../../components/town/topics/great-falls/CostOfLiving';
import GfHousing from '../../../components/town/topics/great-falls/Housing';
import GfJobs from '../../../components/town/topics/great-falls/Jobs';
import GfSchools from '../../../components/town/topics/great-falls/Schools';
import GfHiking from '../../../components/town/topics/great-falls/Hiking';
import GfFishing from '../../../components/town/topics/great-falls/Fishing';
import GfWeekendItinerary from '../../../components/town/topics/great-falls/WeekendItinerary';

import BtCostOfLiving from '../../../components/town/topics/butte/CostOfLiving';
import BtHousing from '../../../components/town/topics/butte/Housing';
import BtJobs from '../../../components/town/topics/butte/Jobs';
import BtSchools from '../../../components/town/topics/butte/Schools';
import BtHiking from '../../../components/town/topics/butte/Hiking';
import BtFishing from '../../../components/town/topics/butte/Fishing';
import BtWeekendItinerary from '../../../components/town/topics/butte/WeekendItinerary';

import LvCostOfLiving from '../../../components/town/topics/livingston/CostOfLiving';
import LvHousing from '../../../components/town/topics/livingston/Housing';
import LvJobs from '../../../components/town/topics/livingston/Jobs';
import LvSchools from '../../../components/town/topics/livingston/Schools';
import LvHiking from '../../../components/town/topics/livingston/Hiking';
import LvFishing from '../../../components/town/topics/livingston/Fishing';
import LvWeekendItinerary from '../../../components/town/topics/livingston/WeekendItinerary';

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
    { name: 'Cities and Towns', url: 'https://treasurestate.com/Montana-towns/' },
    { name: townName, url: `https://treasurestate.com/montana-towns/${slug}/` },
    { name: guide.title, url: `https://treasurestate.com/montana-towns/${slug}/${topic}/` },
  ];

  const topicComponents: Record<string, Record<string, React.ComponentType<any>>> = {
    missoula: {
      'cost-of-living': CostOfLiving,
      'housing': Housing,
      'jobs': Jobs,
      'schools': Schools,
      'hiking': Hiking,
      'fishing': Fishing,
      'weekend-itinerary': WeekendItinerary,
    },
    bozeman: {
      'cost-of-living': BzmCostOfLiving,
      'housing': BzmHousing,
      'jobs': BzmJobs,
      'schools': BzmSchools,
      'hiking': BzmHiking,
      'fishing': BzmFishing,
      'weekend-itinerary': BzmWeekendItinerary,
    },
    kalispell: {
      'cost-of-living': KalCostOfLiving,
      'housing': KalHousing,
      'jobs': KalJobs,
      'schools': KalSchools,
      'hiking': KalHiking,
      'fishing': KalFishing,
      'weekend-itinerary': KalWeekendItinerary,
    },
    whitefish: {
      'cost-of-living': WfCostOfLiving,
      'housing': WfHousing,
      'jobs': WfJobs,
      'schools': WfSchools,
      'hiking': WfHiking,
      'fishing': WfFishing,
      'weekend-itinerary': WfWeekendItinerary,
    },
    helena: {
      'cost-of-living': HelCostOfLiving,
      'housing': HelHousing,
      'jobs': HelJobs,
      'schools': HelSchools,
      'hiking': HelHiking,
      'fishing': HelFishing,
      'weekend-itinerary': HelWeekendItinerary,
    },
    billings: {
      'cost-of-living': BilCostOfLiving,
      'housing': BilHousing,
      'jobs': BilJobs,
      'schools': BilSchools,
      'hiking': BilHiking,
      'fishing': BilFishing,
      'weekend-itinerary': BilWeekendItinerary,
    },
    'great-falls': {
      'cost-of-living': GfCostOfLiving,
      'housing': GfHousing,
      'jobs': GfJobs,
      'schools': GfSchools,
      'hiking': GfHiking,
      'fishing': GfFishing,
      'weekend-itinerary': GfWeekendItinerary,
    },
    butte: {
      'cost-of-living': BtCostOfLiving,
      'housing': BtHousing,
      'jobs': BtJobs,
      'schools': BtSchools,
      'hiking': BtHiking,
      'fishing': BtFishing,
      'weekend-itinerary': BtWeekendItinerary,
    },
    livingston: {
      'cost-of-living': LvCostOfLiving,
      'housing': LvHousing,
      'jobs': LvJobs,
      'schools': LvSchools,
      'hiking': LvHiking,
      'fishing': LvFishing,
      'weekend-itinerary': LvWeekendItinerary,
    },
  };

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems.map((item, i) => ({
            '@type': 'ListItem', position: i + 1, name: item.name, item: item.url,
          })),
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
