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

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  slug: string;
  topic: string;
  townName: string;
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

  let content: React.ReactNode = null;
  switch (topic) {
    case 'cost-of-living':
      content = <CostOfLiving townName={townName} slug={slug} housing={props.housing} economy={props.economy} />;
      break;
    case 'housing':
      content = <Housing townName={townName} slug={slug} housing={props.housing} />;
      break;
    case 'jobs':
      content = <Jobs townName={townName} slug={slug} economy={props.economy} population={props.population} />;
      break;
    case 'schools':
      content = <Schools townName={townName} slug={slug} schoolDistrict={props.schoolDistrict} schoolEnrollment={props.schoolEnrollment} schoolWebsite={props.schoolWebsite} graduationRate={props.graduationRate} perPupilSpending={props.perPupilSpending} population={props.population} />;
      break;
    case 'hiking':
      content = <Hiking townName={townName} slug={slug} trails={props.trails} wilderness={props.wilderness} stateParks={props.stateParks} />;
      break;
    case 'fishing':
      content = <Fishing townName={townName} slug={slug} fishingAccess={props.fishingAccess} rivers={props.rivers} lakes={props.lakes} />;
      break;
    case 'weekend-itinerary':
      content = <WeekendItinerary townName={townName} slug={slug} climate={props.climate} highlights={props.highlights} />;
      break;
  }

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
        image={`/images/towns/${slug}.jpg`}
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
