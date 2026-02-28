import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import AffiliateBanner from '../../components/AffiliateBanner';
import Footer from '../../components/Footer';
import Schema from '../../components/Schema';
import Breadcrumbs from '../../components/Breadcrumbs';
import NearbyTowns from '../../components/NearbyTowns';
import TableOfContents from '../../components/TableOfContents';
import SingleTownMap from '../../components/SingleTownMap';
import TownWeather from '../../components/TownWeather';
import TownDistances from '../../components/TownDistances';
import StoreBanner from '../../components/StoreBanner';
import TownQuickFacts from '../../components/TownQuickFacts';
import ClimateTable from '../../components/ClimateTable';
import NearbyRecreation from '../../components/NearbyRecreation';
import SchoolInfo from '../../components/SchoolInfo';
import TownHousing from '../../components/TownHousing';
import { getTownList, getTownNameFromSlug, getRelatedTowns } from '../../lib/towns';
import { readTownMarkdownByTownName, AEOData } from '../../lib/markdown';

type TownCoordinate = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

type AirportDistance = {
  distanceMiles: number;
  durationSeconds: number;
  airportName?: string;
};

type TownFactsData = {
  elevation: number | null;
  county: string | null;
  region: string | null;
  zipCode?: string | null;
  areaCode?: string | null;
  timeZone?: string | null;
  population?: number | null;
  schoolDistrict?: string | null;
  schoolEnrollment?: number | null;
  schoolWebsite?: string | null;
};

type MonthClimate = {
  month: string;
  avgHigh: number;
  avgLow: number;
  precipIn: number;
};

type RecreationPlace = {
  name: string;
  type: string;
  distMiles: number;
};

type Props = {
  slug: string;
  townName: string;
  nickname: string;
  contentHtml: string;
  description: string;
  aeoData: AEOData | null;
  relatedTowns: { name: string; slug: string }[];
  currentTownCoords: TownCoordinate | null;
  relatedTownCoords: TownCoordinate[];
  airportDistances: Record<string, AirportDistance> | null;
  townFacts: TownFactsData | null;
  climateMonths: MonthClimate[] | null;
  recreationPlaces: RecreationPlace[] | null;
  housing: {
    medianHomeValue: number | null; medianRent: number | null; medianHouseholdIncome: number | null;
    zillowHomeValue: number | null; zillowHomeValueDate: string | null;
    zillowRent: number | null; zillowRentDate: string | null;
    homeValuePercentile: number | null; rentPercentile: number | null;
    incomePercentile: number | null; affordabilityRatio: number | null;
    forSaleInventory: number | null; forSaleInventoryDate: string | null;
    inventoryYoY: number | null; medianListPrice: number | null;
    newListings: number | null; totalHousingUnits: number | null;
    vacancyRate: number | null;
    unemploymentRate: number | null; laborForceParticipation: number | null;
    employed: number | null; laborForce: number | null;
    topIndustries: { name: string; pct: number }[] | null;
  } | null;
  economy: {
    graduationRate: number | null;
    perPupilSpending: number | null;
    mainIndustry: string | null;
    schoolsVintage: string | null;
    industryVintage: string | null;
    healthcareVintage: string | null;
  } | null;
  healthcare: {
    nearestHospital: string | null;
    nearestHospitalDist: number | null;
  } | null;
  crossLinks: { label: string; href: string }[];
};

export default function TownPage({ slug, townName, nickname, contentHtml, description, aeoData, relatedTowns, currentTownCoords, relatedTownCoords, airportDistances, townFacts, climateMonths, recreationPlaces, housing, economy, healthcare, crossLinks }: Props) {
  const title = `${townName}, Montana - ${nickname} | Travel Guide & Things to Do`;
  const metaDesc = description || `Discover ${townName}, Montana — ${nickname}. Explore top attractions, outdoor activities, history, and where to stay in ${townName}. Your ultimate travel guide.`;
  const url = `https://treasurestate.com/montana-towns/${slug}/`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/Montana-towns/' },
    { name: townName, url: url }
  ];

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        
        {/* OpenGraph / Social Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://treasurestate.com/images/towns/${slug}.jpg`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={`https://treasurestate.com/images/towns/${slug}.jpg`} />
      </Head>

      <Schema townName={townName} slug={slug} description={metaDesc} aeoData={aeoData || undefined} />

      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />

      <Hero
        title={townName}
        subtitle={nickname}
        image={`/images/towns/${slug}.jpg`}
        alt={`${townName} - Scenic View`}
        small
      />
      
      <main style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .toc-desktop {
            display: none;
          }
          @media (min-width: 1024px) {
            .toc-desktop {
              display: block;
              width: 300px;
              flex-shrink: 0;
            }
          }
        `}} />
        <div className="toc-desktop">
          <TableOfContents contentSelector=".content-section" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {townFacts && <TownQuickFacts elevation={townFacts.elevation} county={townFacts.county} region={townFacts.region} zipCode={townFacts.zipCode} areaCode={townFacts.areaCode} timeZone={townFacts.timeZone} population={townFacts.population} nearestHospital={healthcare?.nearestHospital ?? null} nearestHospitalDist={healthcare?.nearestHospitalDist ?? null} mainIndustry={economy?.mainIndustry ?? null} industryVintage={economy?.industryVintage ?? null} healthcareVintage={economy?.healthcareVintage ?? null} />}
          {currentTownCoords && <TownWeather lat={currentTownCoords.lat} lng={currentTownCoords.lng} />}
          {airportDistances && <TownDistances distances={airportDistances} />}
          <article className="content-section" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          {climateMonths && <ClimateTable townName={townName} months={climateMonths} />}
          {housing && <TownHousing {...housing} />}
          {townFacts?.schoolDistrict && <SchoolInfo district={townFacts.schoolDistrict} enrollment={townFacts.schoolEnrollment ?? null} website={townFacts.schoolWebsite ?? null} graduationRate={economy?.graduationRate ?? null} perPupilSpending={economy?.perPupilSpending ?? null} schoolsVintage={economy?.schoolsVintage ?? null} />}
          {recreationPlaces && recreationPlaces.length > 0 && <NearbyRecreation townName={townName} places={recreationPlaces} />}
          {crossLinks.length > 0 && (
            <div style={{ margin: '2rem 0', padding: '1.25rem', background: '#f0f5f0', borderRadius: '10px', border: '1px solid #dde8dd' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: '#204051' }}>
                {townName} in Our Rankings &amp; Guides
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {crossLinks.map(link => (
                  <Link key={link.href} href={link.href} style={{
                    display: 'inline-block', padding: '0.4rem 0.85rem',
                    background: '#fff', border: '1px solid #cddccd', borderRadius: '20px',
                    color: '#3b6978', fontSize: '0.85rem', fontWeight: 500,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <Link href={`/compare?a=${slug}`} style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#3b6978', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              Compare {townName} with Another Town
            </Link>
          </div>
          <SingleTownMap currentTown={currentTownCoords} relatedTowns={relatedTownCoords} />
          <NearbyTowns towns={relatedTowns} />
          <StoreBanner />
          <AffiliateBanner />
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const towns = getTownList();
  const paths = towns.map(t => ({ params: { slug: t.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const townName = getTownNameFromSlug(slug);
  const md = await readTownMarkdownByTownName(townName);

  let allNicknames: Record<string, string> = {};
  try {
    const nicknamePath = path.resolve(process.cwd(), 'data', 'town-nicknames.json');
    if (fs.existsSync(nicknamePath)) {
      allNicknames = JSON.parse(fs.readFileSync(nicknamePath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load nicknames", e);
  }
  const nickname = allNicknames[slug] || 'A Montana Community';
  
  const contentHtml = md?.contentHtml || `<h2>About ${townName}</h2><p>Content coming soon.</p>`;
  const description = md?.excerpt || '';
  const aeoData = md?.aeoData || null;
  
  // Try to use the specifically parsed nearby destinations from the markdown file first.
  // If the markdown file doesn't have any, fall back to our deterministic algorithm.
  let relatedTowns = [];
  if (md?.nearbyDestinations && md.nearbyDestinations.length > 0) {
    const allTowns = getTownList();
    relatedTowns = md.nearbyDestinations.map(name => {
      const match = allTowns.find(t => t.name.toLowerCase() === name.toLowerCase());
      return match ? { name: match.name, slug: match.slug } : null;
    }).filter(Boolean) as { name: string; slug: string }[];
    
    // If we only found 1 or 2 valid ones, pad it out with the fallback algorithm so it looks full
    if (relatedTowns.length < 3) {
      const fallbacks = getRelatedTowns(slug, 3);
      for (const fallback of fallbacks) {
        if (relatedTowns.length >= 3) break;
        if (!relatedTowns.find(t => t.slug === fallback.slug)) {
          relatedTowns.push(fallback);
        }
      }
    }
  } else {
    relatedTowns = getRelatedTowns(slug, 3);
  }

  let coordinates: Record<string, TownCoordinate> = {};
  try {
    const coordsPath = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
    if (fs.existsSync(coordsPath)) {
      coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load coordinates", e);
  }

  let allAirportDistances: Record<string, Record<string, AirportDistance>> = {};
  try {
    const distancesPath = path.resolve(process.cwd(), 'data', 'town-airport-distances.json');
    if (fs.existsSync(distancesPath)) {
      allAirportDistances = JSON.parse(fs.readFileSync(distancesPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load distances", e);
  }

  const currentTownCoords = coordinates[slug] ? { ...coordinates[slug], slug } : null;
  const relatedTownCoords = relatedTowns
    .map(t => coordinates[t.slug] ? { ...coordinates[t.slug], slug: t.slug } : null)
    .filter(Boolean) as TownCoordinate[];
  const airportDistances = allAirportDistances[slug] || null;

  let allTownData: Record<string, any> = {};
  try {
    const townDataPath = path.resolve(process.cwd(), 'data', 'town-data.json');
    if (fs.existsSync(townDataPath)) {
      allTownData = JSON.parse(fs.readFileSync(townDataPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load town data", e);
  }
  const rawFacts = allTownData[slug];
  const townFacts: TownFactsData | null = rawFacts ? {
    elevation: rawFacts.elevation || null,
    county: rawFacts.county || null,
    region: rawFacts.region || null,
    zipCode: rawFacts.zipCode || null,
    areaCode: rawFacts.areaCode || null,
    timeZone: rawFacts.timeZone || null,
    population: rawFacts.population || null,
    schoolDistrict: rawFacts.schoolDistrict || null,
    schoolEnrollment: rawFacts.schoolEnrollment || null,
    schoolWebsite: rawFacts.schoolWebsite || null,
  } : null;

  let allClimateData: Record<string, { months: MonthClimate[] }> = {};
  try {
    const climatePath = path.resolve(process.cwd(), 'data', 'town-climate.json');
    if (fs.existsSync(climatePath)) {
      allClimateData = JSON.parse(fs.readFileSync(climatePath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load climate data", e);
  }
  const climateMonths = allClimateData[slug]?.months || null;

  let allRecreation: Record<string, { places: RecreationPlace[] }> = {};
  try {
    const recPath = path.resolve(process.cwd(), 'data', 'town-recreation.json');
    if (fs.existsSync(recPath)) {
      allRecreation = JSON.parse(fs.readFileSync(recPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load recreation data", e);
  }
  const recreationPlaces = allRecreation[slug]?.places || null;

  let allHousingData: Record<string, any> = {};
  try {
    const housingPath = path.resolve(process.cwd(), 'data', 'town-housing.json');
    if (fs.existsSync(housingPath)) {
      allHousingData = JSON.parse(fs.readFileSync(housingPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load housing data", e);
  }

  let allEconomyData: Record<string, any> = {};
  try {
    const econPath = path.resolve(process.cwd(), 'data', 'town-economy.json');
    if (fs.existsSync(econPath)) {
      allEconomyData = JSON.parse(fs.readFileSync(econPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load economy data", e);
  }
  let allHealthcareData: Record<string, any> = {};
  try {
    const healthPath = path.resolve(process.cwd(), 'data', 'town-healthcare.json');
    if (fs.existsSync(healthPath)) {
      allHealthcareData = JSON.parse(fs.readFileSync(healthPath, 'utf8'));
    }
  } catch (e) {
    console.error("Failed to load healthcare data", e);
  }

  let freshness: Record<string, any> = {};
  try {
    const freshnessPath = path.resolve(process.cwd(), 'data', 'data-freshness.json');
    if (fs.existsSync(freshnessPath)) {
      freshness = JSON.parse(fs.readFileSync(freshnessPath, 'utf8'));
    }
  } catch (e) { /* ignore */ }

  const { allCrossLinks } = await import('../../lib/cross-links');
  const crossLinks = allCrossLinks(slug);

  const rawEconomy = allEconomyData[slug];
  const rawHealthcare = allHealthcareData[slug];
  const rawHousing = allHousingData[slug];
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
    unemploymentRate: rawEconomy?.unemploymentRate ?? null,
    laborForceParticipation: rawEconomy?.laborForceParticipation ?? null,
    employed: rawEconomy?.employed ?? null,
    laborForce: rawEconomy?.laborForce ?? null,
    topIndustries: rawEconomy?.topIndustries ?? null,
    censusVintage: freshness.censusEmployment?.vintage ?? null,
  } : null;

  return { 
    props: { 
      slug, 
      townName, 
      nickname,
      contentHtml, 
      description, 
      aeoData, 
      relatedTowns,
      currentTownCoords,
      relatedTownCoords,
      airportDistances,
      townFacts,
      climateMonths,
      recreationPlaces,
      housing,
      economy: rawEconomy ? {
        graduationRate: rawEconomy.graduationRate ?? null,
        perPupilSpending: rawEconomy.perPupilSpending ?? null,
        mainIndustry: rawEconomy.mainIndustry ?? null,
        schoolsVintage: freshness.schools?.vintage ?? null,
        industryVintage: freshness.censusIndustry?.vintage ?? null,
        healthcareVintage: freshness.healthcare?.vintage ?? null,
      } : null,
      healthcare: rawHealthcare ? {
        nearestHospital: rawHealthcare.nearestHospital ?? null,
        nearestHospitalDist: rawHealthcare.nearestHospitalDist ?? null,
      } : null,
      crossLinks,
    } 
  };
};
