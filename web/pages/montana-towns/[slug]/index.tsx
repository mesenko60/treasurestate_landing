import { useState, useEffect, type MouseEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import StaysCTA from '../../../components/StaysCTA';
import { injectStaysCTA } from '../../../lib/affiliate-urls';
import Footer from '../../../components/Footer';
import Schema from '../../../components/Schema';
import Breadcrumbs from '../../../components/Breadcrumbs';
import NearbyTowns from '../../../components/NearbyTowns';
import TableOfContents from '../../../components/TableOfContents';
import SingleTownMap from '../../../components/SingleTownMap';
import TownWeather from '../../../components/TownWeather';
import TownDistances from '../../../components/TownDistances';
import StoreBanner from '../../../components/StoreBanner';
import TownQuickFacts from '../../../components/TownQuickFacts';
import ClimateTable from '../../../components/ClimateTable';
import NearbyRecreation from '../../../components/NearbyRecreation';
import SchoolInfo from '../../../components/SchoolInfo';
import TownHousing from '../../../components/TownHousing';
import { getTownList, getTownNameFromSlug, getRelatedTowns } from '../../../lib/towns';
import { readTownMarkdownByTownName, AEOData } from '../../../lib/markdown';
import { getClusterConfig } from '../../../components/town/cluster-data';
import { filterNearbyRecreation } from '../../../lib/recreation';
import { getCorridorsForTown, TownCorridor } from '../../../lib/town-corridors';
import CrossHubCities from '../../../components/town/CrossHubCities';
import RelatedContent from '../../../components/RelatedContent';
import HistoricMarkers from '../../../components/town/HistoricMarkers';
import { isEnabled } from '../../../lib/feature-flags';
import { getArticlesForTown, getFeaturedArticles, type ArticleSummary } from '../../../lib/articles';

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
  lat: number;
  lng: number;
  distMiles: number;
};

type HistoricMarkerSummary = {
  id: string;
  slug: string;
  title: string;
  inscription: string;
  topics: string[];
  isCurated: boolean;
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
  scenicDrives: TownCorridor[];
  relatedArticles: ArticleSummary[];
  historicMarkers: HistoricMarkerSummary[];
  heroImage: string;
  ogImage: string;
  heroCredit?: string;
};

function formatHomeValueForMeta(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000)}K`;
  return `$${val.toLocaleString()}`;
}

function buildDataDrivenMetaDesc(
  townName: string,
  recreationPlaces: RecreationPlace[] | null,
  housing: Props['housing'],
  population: number | null | undefined
): string | null {
  const recCount = recreationPlaces?.length ?? 0;
  const homeVal = housing?.zillowHomeValue ?? housing?.medianHomeValue ?? null;
  const pop = population ?? null;

  const parts: string[] = [];
  if (recCount > 0) parts.push(`${recCount} recreation sites`);
  if (homeVal != null) parts.push(`${formatHomeValueForMeta(homeVal)} housing market`);
  if (pop != null) parts.push(`${pop.toLocaleString()} residents`);

  if (parts.length === 0) return null;

  const dataPhrase = parts.length === 1
    ? parts[0]
    : parts.length === 2
      ? `${parts[0]} and ${parts[1]}`
      : `${parts[0]}, ${parts[1]}, and ${parts[2]}`;

  return `Explore ${townName}'s ${dataPhrase} — the complete ${townName}, Montana guide for visitors and future residents.`;
}

const HERO_CREDITS: Record<string, string> = {
  billings: 'Photo: Quintin Soloviev / Wikimedia Commons (CC BY 4.0)',
  bozeman: 'Photo: Chris06 / Wikimedia Commons (CC BY-SA 3.0)',
  helena: 'Photo: RTC / Wikimedia Commons (CC BY-SA 3.0)',
};

export default function TownPage({ slug, townName, nickname, contentHtml, description, aeoData, relatedTowns, currentTownCoords, relatedTownCoords, airportDistances, townFacts, climateMonths, recreationPlaces, housing, economy, healthcare, crossLinks, scenicDrives, heroImage, ogImage, heroCredit, relatedArticles, historicMarkers }: Props) {
  const router = useRouter();
  const [focusedRec, setFocusedRec] = useState<RecreationPlace | null>(null);

  useEffect(() => {
    const { focusName, focusLat, focusLng, focusType } = router.query;
    if (typeof focusName === 'string' && typeof focusLat === 'string' && typeof focusLng === 'string') {
      const place: RecreationPlace = {
        name: focusName,
        type: (typeof focusType === 'string' ? focusType : '') as string,
        lat: parseFloat(focusLat),
        lng: parseFloat(focusLng),
        distMiles: 0,
      };
      setFocusedRec(place);
      setTimeout(() => {
        document.getElementById('town-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [router.query]);

  const title = `${townName}, Montana - ${nickname} | Travel Guide & Things to Do`;
  const metaDesc = description || buildDataDrivenMetaDesc(townName, recreationPlaces, housing, townFacts?.population) || `Discover ${townName}, Montana: ${nickname}. Explore top attractions, outdoor activities, history, and where to stay in ${townName}. Your ultimate travel guide.`;
  const url = `https://treasurestate.com/montana-towns/${slug}/`;

  const { html: enrichedHtml, injected: staysInjected } = injectStaysCTA(contentHtml, townName, slug);

  const cluster = getClusterConfig(slug);

  const schemaFaqs = cluster
    ? { faqs: cluster.faqs.map(f => ({ question: f.question, answer: f.answer })) }
    : aeoData || undefined;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/montana-towns/' },
    { name: townName, url: url }
  ];
  const featuredMapRecreation = recreationPlaces?.filter(p => ['Hot Spring','Campground','Trailhead','Lake','Ski Area','State Park','National Park','Fishing Access','Waterfall'].includes(p.type)).slice(0, 60) ?? undefined;

  const scrollToSection = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <Schema
        townName={townName} slug={slug} description={metaDesc}
        population={townFacts?.population} elevation={townFacts?.elevation} county={townFacts?.county}
        lat={currentTownCoords?.lat} lng={currentTownCoords?.lng}
        recreationPlaces={recreationPlaces}
        aeoData={schemaFaqs}
      />

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Hero
        title={townName}
        subtitle={nickname}
        image={heroImage}
        alt={`${townName} - Scenic View`}
        small
        credit={heroCredit}
      />

      <main style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', marginTop: '-15px', zIndex: 1 }}>
        <style dangerouslySetInnerHTML={{__html: `
          .toc-desktop { display: none; }
          @media (min-width: 1024px) {
            .toc-desktop { display: block; width: 300px; flex-shrink: 0; }
          }
          .hub-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin: 1.25rem 0 2rem; }
          .hub-card { display: flex; align-items: center; gap: 0.6rem; padding: 0.85rem 1rem; background: #f8faf8; border: 1px solid #e2ebe2; border-radius: 10px; text-decoration: none; color: #204051; font-size: 0.9rem; transition: box-shadow 0.2s, transform 0.2s; }
          .hub-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
          .hub-card-icon { font-size: 1.35rem; flex-shrink: 0; }
          .hub-card-body { min-width: 0; }
          .hub-card-title { font-weight: 600; font-family: var(--font-primary); margin-bottom: 0.15rem; }
          .hub-card-desc { font-size: 0.8rem; color: #666; line-height: 1.4; }
          .hub-faq-item { margin-bottom: 1.25rem; }
          .hub-faq-q { font-weight: 600; font-size: 0.95rem; color: #204051; margin-bottom: 0.35rem; }
          .hub-faq-a { font-size: 0.9rem; color: #555; line-height: 1.6; }
          .map-jump-links { display: flex; flex-wrap: wrap; gap: 0.65rem; margin: 0 0 1.5rem; }
          .map-jump-link {
            display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.7rem 0.95rem;
            border-radius: 999px; border: 1px solid #d8e2d8; background: #f8faf8;
            color: #2e5c66; text-decoration: none; font-size: 0.87rem; font-weight: 600;
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          }
          .map-jump-link:hover {
            background: #eef5ee; transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.06);
          }
        `}} />
        <div className="toc-desktop">
          <TableOfContents contentSelector=".content-section" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>

          {cluster && (
            <>
              <div className="content-section" style={{ marginBottom: '0' }}>
                <div dangerouslySetInnerHTML={{ __html: cluster.hubIntro.replace(/\n/g, '</p><p>') }} style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#444' }} />
              </div>

              <div className="content-section" style={{ marginTop: '0.5rem' }}>
                <h2 id="explore-guides" style={{ fontSize: '1.25rem', color: '#204051', marginBottom: '0.5rem' }}>Explore {townName} Guides</h2>
                <div className="hub-cards">
                  {cluster.guides.map(g => (
                    <Link key={g.topic} href={`/montana-towns/${slug}/${g.topic}/`} className="hub-card">
                      <span className="hub-card-icon">{g.icon}</span>
                      <div className="hub-card-body">
                        <div className="hub-card-title">{g.title}</div>
                        <div className="hub-card-desc">{g.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {townFacts && <TownQuickFacts elevation={townFacts.elevation} county={townFacts.county} region={townFacts.region} zipCode={townFacts.zipCode} areaCode={townFacts.areaCode} timeZone={townFacts.timeZone} population={townFacts.population} nearestHospital={healthcare?.nearestHospital ?? null} nearestHospitalDist={healthcare?.nearestHospitalDist ?? null} mainIndustry={economy?.mainIndustry ?? null} industryVintage={economy?.industryVintage ?? null} healthcareVintage={economy?.healthcareVintage ?? null} />}
          {currentTownCoords && <TownWeather lat={currentTownCoords.lat} lng={currentTownCoords.lng} />}
          {airportDistances && <TownDistances distances={airportDistances} />}
          {recreationPlaces && recreationPlaces.length > 0 && (
            <div className="map-jump-links" aria-label={`${townName} quick navigation`}>
              <a href="#outdoor-recreation-heading" className="map-jump-link" onClick={scrollToSection('outdoor-recreation-heading')}>
                <span aria-hidden="true">🥾</span>
                Browse recreation
              </a>
            </div>
          )}
          <SingleTownMap
            currentTown={currentTownCoords}
            relatedTowns={relatedTownCoords}
            recreation={featuredMapRecreation}
            focusedRec={focusedRec}
          />
          {recreationPlaces && recreationPlaces.length > 0 && <NearbyRecreation townName={townName} places={recreationPlaces} onSelectPlace={(p) => setFocusedRec({ ...p })} />}
          {historicMarkers && historicMarkers.length > 0 && <HistoricMarkers markers={historicMarkers} townName={townName} townSlug={slug} />}
          <article className="content-section" dangerouslySetInnerHTML={{ __html: enrichedHtml }} />
          {climateMonths && <ClimateTable townName={townName} months={climateMonths} />}
          {housing && <TownHousing {...housing} />}
          {townFacts?.schoolDistrict && <SchoolInfo district={townFacts.schoolDistrict} enrollment={townFacts.schoolEnrollment ?? null} website={townFacts.schoolWebsite ?? null} graduationRate={economy?.graduationRate ?? null} perPupilSpending={economy?.perPupilSpending ?? null} schoolsVintage={economy?.schoolsVintage ?? null} />}
          {scenicDrives.length > 0 && (
            <div className="content-section" style={{ margin: '2rem 0' }}>
              <h2 id="scenic-drives">Scenic Drives Near {townName}</h2>
              <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: 1.6, marginBottom: '1rem' }}>
                {townName} is located along or near {scenicDrives.length === 1 ? 'a scenic corridor' : `${scenicDrives.length} scenic corridors`} in Montana.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {scenicDrives.map(drive => (
                  <Link
                    key={drive.id}
                    href={`/planners/corridors/${drive.id}/`}
                    style={{
                      display: 'block', padding: '1rem 1.15rem', background: '#f8faf8',
                      border: '1px solid #e2ebe2', borderRadius: '10px', textDecoration: 'none',
                      color: '#204051', transition: 'box-shadow 0.2s, transform 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: drive.color, flexShrink: 0 }} />
                      <strong style={{ fontSize: '0.95rem' }}>{drive.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span>{drive.highways.join(', ')}</span>
                      <span>{drive.distanceMiles} mi</span>
                      <span style={{ color: drive.difficulty === 'easy' ? '#27ae60' : drive.difficulty === 'moderate' ? '#f39c12' : '#c0392b', fontWeight: 600 }}>
                        {drive.difficulty.charAt(0).toUpperCase() + drive.difficulty.slice(1)}
                      </span>
                      <span style={{ color: '#999', fontStyle: 'italic' }}>
                        {drive.relation === 'start' ? 'Starts here' : drive.relation === 'end' ? 'Ends here' : drive.relation === 'through' ? 'Passes through' : 'Nearby'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link href="/planners/backroads-planner" style={{ color: '#3b6978', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  Explore all routes on the interactive planner →
                </Link>
              </div>
            </div>
          )}

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
          <NearbyTowns towns={relatedTowns} />

          {cluster && (
            <div className="content-section" style={{ marginTop: '1.5rem' }}>
              <h2 id="faqs">Frequently Asked Questions About {townName}</h2>
              {cluster.faqs.map((faq, i) => (
                <div key={i} className="hub-faq-item">
                  <div className="hub-faq-q">{faq.question}</div>
                  <div className="hub-faq-a">{faq.answer}</div>
                </div>
              ))}
            </div>
          )}

          {cluster && <CrossHubCities slug={slug} townName={townName} />}

          {!staysInjected && <StaysCTA townName={townName} slug={slug} />}
          <StoreBanner />
          {relatedArticles.length > 0 && (
            <RelatedContent articles={relatedArticles} title="Related Reading" />
          )}
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
  
  let relatedTowns: { name: string; slug: string }[] = [];
  if (md?.nearbyDestinations && md.nearbyDestinations.length > 0) {
    const allTowns = getTownList();
    relatedTowns = md.nearbyDestinations.map(name => {
      const match = allTowns.find(t => t.name.toLowerCase() === name.toLowerCase());
      return match ? { name: match.name, slug: match.slug } : null;
    }).filter(Boolean) as { name: string; slug: string }[];
    
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
  const recreationPlaces = filterNearbyRecreation(allRecreation[slug]?.places || null);

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

  const { allCrossLinks } = await import('../../../lib/cross-links');
  const crossLinks = allCrossLinks(slug);
  const scenicDrives = getCorridorsForTown(slug);

  // Load historic markers for this town
  let historicMarkers: HistoricMarkerSummary[] = [];
  try {
    const markersPath = path.resolve(process.cwd(), 'data', 'historic-markers.json');
    const curatedPath = path.resolve(process.cwd(), 'data', 'historic-markers-curated.json');
    if (fs.existsSync(markersPath)) {
      const allMarkers = JSON.parse(fs.readFileSync(markersPath, 'utf8'));
      const curatedSlugs = fs.existsSync(curatedPath)
        ? new Set(JSON.parse(fs.readFileSync(curatedPath, 'utf8')).map((m: { slug: string }) => m.slug))
        : new Set<string>();
      historicMarkers = allMarkers
        .filter((m: { townSlug: string | null }) => m.townSlug === slug)
        .slice(0, 20)
        .map((m: { id: string; slug: string; title: string; inscription: string; topics: string[] }) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          inscription: m.inscription,
          topics: m.topics.slice(0, 3),
          isCurated: curatedSlugs.has(m.slug),
        }));
    }
  } catch (e) {
    console.error("Failed to load historic markers", e);
  }

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
      scenicDrives,
      heroImage: fs.existsSync(path.resolve(process.cwd(), 'public', 'images', 'towns', `${slug}.jpg`))
        ? `/images/towns/${slug}.jpg`
        : '/images/towns/default-town.jpg',
      ogImage: fs.existsSync(path.resolve(process.cwd(), 'public', 'images', 'towns', `${slug}.jpg`))
        ? `https://treasurestate.com/images/towns/${slug}.jpg`
        : 'https://treasurestate.com/images/hero-image.jpg',
      ...(HERO_CREDITS[slug] ? { heroCredit: HERO_CREDITS[slug] } : {}),
      relatedArticles: isEnabled('content_hub_enabled')
        ? (() => {
            const townArticles = getArticlesForTown(slug);
            if (townArticles.length > 0) return townArticles.slice(0, 3);
            return getFeaturedArticles().slice(0, 3);
          })()
        : [],
      historicMarkers,
    } 
  };
};
