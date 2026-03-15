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
import TableOfContents from '../../components/TableOfContents';
import { filterNearbyRecreation } from '../../lib/recreation';

/* ─── Types ──────────────────────────────────────────────── */

type FAQ = { q: string; a: string };

type GuideData = {
  slug: string;
  townSlug: string;
  townName: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  sections: { id: string; heading: string; html: string }[];
  faqs: FAQ[];
};

type FreshnessMap = Record<string, { lastCollected?: string; vintage?: string }>;

type RankingLink = { label: string; href: string };

type Props = { guide: GuideData; freshness: FreshnessMap; rankings: RankingLink[] };

/* ─── Page Component ─────────────────────────────────────── */

function fmtFresh(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function GuidePage({ guide, freshness, rankings }: Props) {
  const url = `https://treasurestate.com/guides/${guide.slug}/`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides/' },
    { name: guide.title, url },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: '2026-01-15T00:00:00-07:00',
    dateModified: '2026-03-14T00:00:00-07:00',
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    about: { '@type': 'City', name: guide.townName, containedInPlace: { '@type': 'State', name: 'Montana' } },
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

  const faqSchema = guide.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <>
      <Head>
        <title>{guide.title} | Treasure State</title>
        <meta name="description" content={guide.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:title" content={guide.title} />
        <meta name="twitter:description" content={guide.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      </Head>
      <Header />
      <Hero title={guide.heroTitle} subtitle={guide.heroSubtitle} image="/images/hero-image.jpg" alt={guide.title} small />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ display: 'flex', gap: '40px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px 3rem', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .toc-desktop { display: none; }
          @media (min-width: 1024px) { .toc-desktop { display: block; width: 280px; flex-shrink: 0; } }
          .guide-content h2 { color: #204051; font-size: 1.3rem; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 2px solid #e8ede8; }
          .guide-content h3 { color: #3b6978; font-size: 1.05rem; margin: 1.5rem 0 0.5rem; }
          .guide-content p { color: #333; line-height: 1.7; margin: 0.6rem 0; }
          .guide-content ul { color: #444; line-height: 1.7; padding-left: 1.5rem; }
          .guide-content li { margin: 0.3rem 0; }
          .guide-content .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
          .guide-content .stat-card { text-align: center; padding: 0.75rem; background: #f5f8f5; border-radius: 8px; border: 1px solid #e8ede8; }
          .guide-content .stat-card .val { font-size: 1.3rem; font-weight: 700; color: #204051; }
          .guide-content .stat-card .lbl { font-size: 0.78rem; color: #666; margin-top: 2px; }
          .guide-content .cta-box { margin: 1.5rem 0; padding: 1rem 1.25rem; background: #f0f5f0; border-radius: 8px; border-left: 4px solid #3b6978; }
          .guide-content .cta-box a { color: #3b6978; font-weight: 600; }
          .guide-content a[href^="/"] { color: #925f14; }
          .guide-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.88rem; }
          .guide-content th { background: #204051; color: #fff; padding: 0.5rem 0.75rem; text-align: left; font-weight: 600; }
          .guide-content td { padding: 0.4rem 0.75rem; border-bottom: 1px solid #eee; }
          .guide-content tr:nth-child(even) td { background: #f9f9f9; }
        ` }} />

        <div className="toc-desktop">
          <TableOfContents contentSelector=".guide-content" />
        </div>

        <div className="guide-content content-section" style={{ flex: 1, minWidth: 0 }}>
          {guide.sections.map(s => (
            <section key={s.id} id={s.id}>
              <h2>{s.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}

          {guide.faqs.length > 0 && (
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              {guide.faqs.map((f, i) => (
                <div key={i} style={{ marginBottom: '1.25rem' }}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem', color: '#555555', lineHeight: 1.6 }}>
            <strong style={{ color: '#888' }}>Data Sources & Freshness:</strong>{' '}
            Housing values and inventory from Zillow Research ({fmtFresh(freshness.zillowInventory?.lastCollected) || 'Jan 2026'}).{' '}
            Income, vacancy, employment, and industry data from U.S. Census Bureau {freshness.censusEmployment?.vintage || 'ACS 5-Year (2019–2023)'}.{' '}
            Crime statistics from {freshness.crime?.vintage || 'FBI UCR (2023)'}.{' '}
            Graduation rates from {freshness.schools?.vintage || 'Montana OPI / NCES CCD (2022–23)'}.{' '}
            Hospital data from {freshness.healthcare?.vintage || 'Montana DPHHS (2024)'}.{' '}
            Environmental data from {freshness.environmental?.vintage || 'EPA NPL (2024)'}.{' '}
            All data reflects conditions at the time of collection and may not represent current conditions.
            Verify critical information (housing prices, job availability, school enrollment) directly with local sources before making relocation decisions.
          </div>

          {rankings.length > 0 && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#f0f5f0', borderRadius: '10px', border: '1px solid #dde8dd' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', color: '#204051' }}>
                {guide.townName} in Our Rankings &amp; Guides
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {rankings.map(r => (
                  <Link key={r.href} href={r.href} style={{
                    display: 'inline-block', padding: '0.4rem 0.85rem',
                    background: '#fff', border: '1px solid #cddccd', borderRadius: '20px',
                    color: '#3b6978', fontSize: '0.85rem', fontWeight: 500,
                    textDecoration: 'none',
                  }}>
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="cta-box" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#204051' }}>Ready to learn more?</p>
            <Link href={`/montana-towns/${guide.townSlug}/`} style={{ marginRight: '1rem' }}>
              Full {guide.townName} Profile →
            </Link>
            <Link href={`/compare?a=${guide.townSlug}`}>
              Compare {guide.townName} →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─── Helper Formatting ──────────────────────────────────── */

function $(n: number | null | undefined): string {
  if (n == null) return '—';
  return '$' + n.toLocaleString('en-US');
}
function n(v: number | null | undefined): string {
  if (v == null) return '—';
  return v.toLocaleString('en-US');
}

function statCard(val: string, label: string): string {
  return `<div class="stat-card"><div class="val">${val}</div><div class="lbl">${label}</div></div>`;
}

function climateRow(m: any): string {
  return `<tr><td>${m.month}</td><td>${m.avgHigh}°F</td><td>${m.avgLow}°F</td><td>${m.precipIn}"</td><td>${m.snowIn}"</td></tr>`;
}

/* ─── Guide Generators ───────────────────────────────────── */

type TownBundle = {
  slug: string; name: string; nickname: string;
  td: any; h: any; clim: any; rec: any; air: any; econ: any; health: any;
  freshness: FreshnessMap;
};

function movingGuide(t: TownBundle): GuideData {
  const pop = t.td.population;
  const elev = t.td.elevation;
  const county = t.td.county;
  const homeVal = t.h?.zillowHomeValue ?? t.h?.medianHomeValue;
  const rent = t.h?.zillowRent ?? t.h?.medianRent;
  const income = t.h?.medianHouseholdIncome;
  const ratio = t.h?.affordabilityRatio;
  const inv = t.h?.forSaleInventory;
  const invYoY = t.h?.inventoryYoY;
  const listPrice = t.h?.medianListPrice;
  const vacancy = t.h?.vacancyRate;
  const units = t.h?.totalHousingUnits;
  const months = t.clim?.months;
  const places = filterNearbyRecreation(t.rec?.places || []);
  const recTypes = new Set(places.map((p: any) => p.type));
  const janLow = months?.[0]?.avgLow;
  const julHigh = months?.[6]?.avgHigh;
  const annualSnow = months ? Math.round(months.reduce((s: number, m: any) => s + (m.snowIn || 0), 0)) : null;

  const sizeLabel = pop > 50000 ? 'city' : pop > 10000 ? 'city' : pop > 3000 ? 'town' : 'small town';
  const skiAreas = places.filter((p: any) => p.type === 'Ski Area').slice(0, 2);
  const nearestSki = skiAreas[0] ?? null;
  const secondSki = skiAreas[1] ?? null;
  const nearestPark = places.find((p: any) => p.type === 'National Park');
  const rivers = places.filter((p: any) => p.type === 'River').slice(0, 5);
  const lakes = places.filter((p: any) => p.type === 'Lake').slice(0, 5);
  const hotSprings = places.filter((p: any) => p.type === 'Hot Spring').slice(0, 3);

  const sections: { id: string; heading: string; html: string }[] = [];

  // Overview
  sections.push({
    id: 'overview',
    heading: `Why Move to ${t.name}?`,
    html: `
      <p>${t.name} is a ${sizeLabel} of ${n(pop)} people${county ? ` in ${county} County` : ''}, sitting at ${n(elev)} feet in elevation. ${t.nickname !== 'A Montana Community' ? `Known as "${t.nickname}," it` : 'It'} combines the best of Montana living: stunning natural beauty, outdoor recreation, and a strong community, ${pop > 20000 ? 'with the amenities of a mid-size city' : pop > 5000 ? 'with small-city conveniences' : 'with authentic small-town charm'}.</p>
      <p>Montana has no state sales tax and does not tax Social Security benefits or most pension income, making it financially attractive for both working professionals and retirees. ${t.name} specifically offers ${places.length} recreation and attraction sites nearby, ${ratio ? `a housing affordability ratio of ${ratio}x` : 'a growing community'}, and four distinct seasons.</p>
      <div class="stat-grid">
        ${statCard(n(pop), 'Population')}
        ${statCard(n(elev) + ' ft', 'Elevation')}
        ${statCard(county || '—', 'County')}
        ${statCard(n(places.length), 'Rec Sites Nearby')}
      </div>
    `,
  });

  // Cost of Living
  sections.push({
    id: 'cost-of-living',
    heading: `Cost of Living in ${t.name}`,
    html: `
      <p>${homeVal ? `The typical home value in ${t.name} is ${$(homeVal)}` : `Housing data for ${t.name}`}${listPrice ? `, with homes currently listing at a median of ${$(listPrice)}` : ''}. ${rent ? `Renters can expect to pay around ${$(rent)} per month.` : ''} ${income ? `The median household income is ${$(income)}.` : ''}</p>
      ${ratio ? `<p>The affordability ratio (home price ÷ income) is <strong>${ratio}x</strong>, which is ${ratio <= 3 ? 'very affordable by national standards' : ratio <= 5 ? 'moderate and comparable to the national average' : ratio <= 7 ? 'above average: plan your budget carefully' : 'on the expensive side, reflecting strong demand'}.</p>` : ''}
      <div class="stat-grid">
        ${homeVal ? statCard($(homeVal), 'Typical Home Value') : ''}
        ${rent ? statCard($(rent) + '/mo', 'Typical Rent') : ''}
        ${income ? statCard($(income), 'Median Income') : ''}
        ${ratio ? statCard(ratio + 'x', 'Affordability Ratio') : ''}
      </div>
      <p>Montana has <strong>no state sales tax</strong>, which saves residents money on everyday purchases. The state also has no tax on Social Security benefits or most pension income. Property taxes are moderate, based on assessed value.</p>
    `,
  });

  // Housing Market
  if (inv || units) {
    const marketTight = vacancy != null && vacancy < 5;
    const marketLoose = vacancy != null && vacancy > 15;
    sections.push({
      id: 'housing-market',
      heading: `${t.name} Housing Market`,
      html: `
        <p>${inv ? `There are currently <strong>${n(inv)} homes for sale</strong> in ${t.name}` : `${t.name}`}${invYoY != null ? `: ${invYoY > 0 ? `up ${invYoY}% from last year, indicating a loosening market` : invYoY < 0 ? `down ${Math.abs(invYoY)}% from last year, indicating tightening supply` : 'flat compared to last year'}` : ''}. ${units ? `The community has ${n(units)} total housing units with a ${vacancy}% vacancy rate${marketTight ? ': a tight market where buyers should be prepared to act quickly' : marketLoose ? ', suggesting more options and negotiating room for buyers' : ''}.` : ''}</p>
        <div class="stat-grid">
          ${inv ? statCard(n(inv), 'Homes for Sale') : ''}
          ${units ? statCard(n(units), 'Total Housing Units') : ''}
          ${vacancy != null ? statCard(vacancy + '%', 'Vacancy Rate') : ''}
          ${invYoY != null ? statCard((invYoY > 0 ? '+' : '') + invYoY + '%', 'Inventory YoY') : ''}
        </div>
        <p style="font-size: 0.78rem; color: #999; font-style: italic;">Inventory data from Zillow Research (${t.h?.forSaleInventoryDate ? new Date(t.h.forSaleInventoryDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'recent'}). Vacancy &amp; housing units from U.S. Census Bureau ${t.freshness.censusVacancy?.vintage || 'ACS 5-Year (2019–2023)'}. Market conditions change. Verify current listings before making decisions.</p>
        <div class="cta-box">
          <p>See detailed housing data and percentile rankings on the <a href="/montana-towns/${t.slug}/">full ${t.name} profile</a>.</p>
        </div>
      `,
    });
  }

  // Climate
  if (months) {
    sections.push({
      id: 'climate',
      heading: `${t.name} Weather & Climate`,
      html: `
        <p>${t.name} experiences four distinct seasons. ${julHigh ? `Summers are ${julHigh > 90 ? 'hot' : julHigh > 80 ? 'warm' : 'mild'} with July highs averaging ${julHigh}°F.` : ''} ${janLow != null ? `Winters are ${janLow < 0 ? 'severe' : janLow < 10 ? 'cold' : janLow < 20 ? 'cool' : 'relatively mild'} with January lows around ${janLow}°F.` : ''} ${annualSnow ? `Expect about ${annualSnow}" of snow annually.` : ''}</p>
        <table>
          <thead><tr><th>Month</th><th>Avg High</th><th>Avg Low</th><th>Precip</th><th>Snow</th></tr></thead>
          <tbody>${months.map(climateRow).join('')}</tbody>
        </table>
      `,
    });
  }

  // Outdoor Recreation
  if (places.length > 0) {
    const highlights = places.filter((p: any) => ['National Park', 'Wilderness', 'National Forest', 'Ski Area', 'Hot Spring', 'Scenic Drive'].includes(p.type)).slice(0, 8);
    sections.push({
      id: 'outdoor-recreation',
      heading: `Outdoor Recreation Near ${t.name}`,
      html: `
        <p>${t.name} has access to <strong>${places.length} recreation and attraction sites</strong> spanning ${recTypes.size} categories. ${nearestPark ? `${nearestPark.name} is about ${nearestPark.distMiles} miles away.` : ''} ${nearestSki ? `For skiing, ${nearestSki.name} is about ${nearestSki.distMiles} miles from town${secondSki ? ` and ${secondSki.name} is about ${secondSki.distMiles} miles` : ''}.` : ''}</p>
        ${highlights.length > 0 ? `
        <h3>Top Nearby Attractions</h3>
        <ul>
          ${highlights.map((p: any) => `<li><strong>${p.name}</strong> (${p.type}): ${p.distMiles} miles</li>`).join('')}
        </ul>` : ''}
        ${rivers.length > 0 ? `<h3>Rivers</h3><p>${rivers.map((r: any) => r.name).join(', ')} ${rivers.length > 1 ? 'are all' : 'is'} within reach for fishing, floating, and kayaking.</p>` : ''}
        ${lakes.length > 0 ? `<h3>Lakes</h3><p>Nearby lakes include ${lakes.map((l: any) => l.name).join(', ')}.</p>` : ''}
        ${hotSprings.length > 0 ? `<h3>Hot Springs</h3><p>${hotSprings.map((h: any) => `${h.name} (${h.distMiles} mi)`).join(', ')}: perfect for soaking after a day on the trails.</p>` : ''}
        <div class="cta-box">
          <p>Explore all ${places.length} recreation sites on the <a href="/montana-towns/${t.slug}/">full ${t.name} profile</a>.</p>
        </div>
      `,
    });
  }

  // Jobs & Economy
  const unemp = t.econ?.unemploymentRate;
  const lfpr = t.econ?.laborForceParticipation;
  const employed = t.econ?.employed;
  const topInd = t.econ?.topIndustries;
  const mainInd = t.econ?.mainIndustry;
  if (unemp != null || topInd) {
    const indList = topInd ? topInd.slice(0, 3).map((i: any) => `<strong>${i.name}</strong> (${i.pct}%)`).join(', ') : '';
    sections.push({
      id: 'jobs-economy',
      heading: `Jobs & Economy in ${t.name}`,
      html: `
        ${unemp != null ? `<p>${t.name} has an unemployment rate of <strong>${unemp}%</strong>${unemp <= 3.5 ? ', which is at or below the state average: indicating a healthy local job market' : unemp <= 6 ? ', which is moderate' : ', which is above the state average and may present challenges for job seekers'}. ${lfpr != null ? `The labor force participation rate is ${lfpr}%${lfpr >= 70 ? ', reflecting an active and engaged workforce' : lfpr >= 60 ? '' : ', which is below average: common in retirement and college communities'}.` : ''}</p>` : ''}
        ${topInd ? `<p>The top industries by employment are ${indList}.${employed ? ` Approximately ${n(employed)} residents are employed locally.` : ''}</p>` : (employed ? `<p>Approximately ${n(employed)} residents are employed locally.</p>` : '')}
        <div class="stat-grid">
          ${unemp != null ? statCard(unemp + '%', 'Unemployment Rate') : ''}
          ${mainInd ? statCard(mainInd, 'Top Industry') : ''}
          ${lfpr != null ? statCard(lfpr + '%', 'Labor Force Participation') : ''}
          ${statCard('0%', 'State Sales Tax')}
        </div>
        ${topInd && topInd.length >= 3 ? `
        <h3>Employment by Industry</h3>
        <table>
          <thead><tr><th>Industry</th><th>Share of Employment</th></tr></thead>
          <tbody>${topInd.map((i: any) => `<tr><td>${i.name}</td><td>${i.pct}%</td></tr>`).join('')}</tbody>
        </table>` : ''}
        <p>Montana has <strong>no state sales tax</strong> and <strong>no tax on Social Security benefits or most pension income</strong>, making it attractive for both workers and retirees.</p>
        <p style="font-size: 0.78rem; color: #999; font-style: italic;">Employment and industry data from U.S. Census Bureau ${t.freshness.censusEmployment?.vintage || 'ACS 5-Year (2019–2023)'}. Current conditions may differ.</p>
      `,
    });
  }

  // Schools
  const gradRate = t.econ?.graduationRate;
  const perPupil = t.econ?.perPupilSpending;
  if (t.td.schoolDistrict) {
    sections.push({
      id: 'schools',
      heading: `Schools & Education`,
      html: `
        <p>${t.name} is served by the <strong>${t.td.schoolDistrict}</strong> school district${t.td.schoolEnrollment ? ` with approximately ${n(t.td.schoolEnrollment)} students enrolled` : ''}. ${gradRate != null ? `The high school graduation rate is <strong>${gradRate}%</strong>${gradRate >= 90 ? ', which is above the Montana state average of ~87%' : gradRate >= 85 ? ', which is near the Montana state average of ~87%' : gradRate >= 75 ? ', which is below the state average of ~87%' : ', which is significantly below the state average'}.` : ''} ${perPupil != null ? `Per-pupil spending is approximately $${n(perPupil)}.` : ''}</p>
        ${t.td.schoolWebsite ? `<p>Visit <a href="${t.td.schoolWebsite}" target="_blank" rel="noopener noreferrer">${t.td.schoolDistrict}</a> for enrollment information and school performance data.</p>` : ''}
        ${gradRate != null || perPupil != null ? `<div class="stat-grid">
          ${t.td.schoolEnrollment ? statCard(n(t.td.schoolEnrollment), 'Students Enrolled') : ''}
          ${gradRate != null ? statCard(gradRate + '%', 'Graduation Rate') : ''}
          ${perPupil != null ? statCard($(perPupil), 'Per-Pupil Spending') : ''}
        </div>` : ''}
        ${pop > 20000 ? `<p>${t.name} also has access to higher education institutions and continuing education programs.</p>` : ''}
        <p style="font-size: 0.78rem; color: #999; font-style: italic;">Graduation rates from ${t.freshness.schools?.vintage || 'Montana OPI / NCES CCD (2022–23)'}. Per-pupil spending from Montana OPI fiscal data.</p>
      `,
    });
  }

  // Healthcare
  const hc = t.health;
  if (hc) {
    const hospDist = hc.nearestHospitalDist;
    const majorDist = hc.nearestMajorHospitalDist;
    sections.push({
      id: 'healthcare',
      heading: `Healthcare in ${t.name}`,
      html: `
        <p>${hc.hasLocalHospital ? `${t.name} has its own hospital: <strong>${hc.nearestHospital}</strong>${hc.nearestHospitalBeds ? ` (${hc.nearestHospitalBeds} beds)` : ''}.` : `The nearest hospital is <strong>${hc.nearestHospital}</strong> in ${hc.nearestHospitalCity}, ${hospDist} miles away.`} ${majorDist != null && majorDist <= 100 ? `For advanced or emergency care, <strong>${hc.nearestMajorHospital}</strong> in ${hc.nearestMajorHospitalCity} (Level ${hc.nearestMajorTraumaLevel} Trauma Center) is ${majorDist} miles away.` : majorDist != null ? `The nearest major trauma center is ${hc.nearestMajorHospital} in ${hc.nearestMajorHospitalCity}, ${majorDist} miles away. Plan accordingly for emergencies.` : ''}</p>
        <div class="stat-grid">
          ${statCard(hc.healthcareScore + '/10', 'Healthcare Score')}
          ${statCard(hospDist <= 5 ? 'In Town' : hospDist + ' mi', 'Nearest Hospital')}
          ${statCard(n(hc.hospitalsWithin30), 'Hospitals < 30 mi')}
          ${statCard(n(hc.hospitalsWithin60), 'Hospitals < 60 mi')}
        </div>
        ${hc.healthcareScore < 4 ? `<p><em>Note: Healthcare access in ${t.name} is limited. If you have ongoing medical needs, consider proximity to ${hc.nearestMajorHospital || 'a major hospital'} when making your decision.</em></p>` : ''}
        <p style="font-size: 0.78rem; color: #999; font-style: italic;">Hospital data from ${t.freshness.healthcare?.vintage || 'Montana DPHHS Trauma Facility Designations (2024)'}. Verify services directly with facilities.</p>
      `,
    });
  }

  // Getting There
  const airportEntries = t.air ? Object.entries(t.air) : [];
  if (airportEntries.length > 0) {
    sections.push({
      id: 'getting-there',
      heading: `Getting to ${t.name}`,
      html: `
        <p>${t.name} is accessible via the following airports:</p>
        <ul>
          ${airportEntries.slice(0, 5).map(([code, d]: [string, any]) =>
            `<li><strong>${d.airportName || code}</strong>: ${d.distanceMiles} miles (${Math.round(d.durationSeconds / 60)} min drive)</li>`
          ).join('')}
        </ul>
      `,
    });
  }

  // Visitor Lodging (where to stay while scouting)
  const lodgingSlug = t.slug === 'anaconda' ? 'anaconda-montana' : t.slug;
  sections.push({
    id: 'visitor-lodging',
    heading: `Where to Stay While You Scout ${t.name}`,
    html: `
      <p>If you're visiting to scout the area before moving, see our <a href="/lodging/${lodgingSlug}/">Where to Stay in ${t.name} guide</a> for hotels, B&Bs, cabins, and vacation rentals with price ranges and direct links to Expedia and VRBO.</p>
    `,
  });

  // Pros and Cons
  const pros = [
    'No state sales tax',
    places.length > 100 ? `${places.length}+ recreation sites nearby` : places.length > 30 ? 'Strong outdoor recreation access' : 'Montana outdoor lifestyle',
    unemp != null && unemp <= 3.5 ? `Low unemployment (${unemp}%)` : null,
    gradRate != null && gradRate >= 90 ? `Strong schools (${gradRate}% grad rate)` : null,
    janLow != null && janLow > 10 ? 'Milder winters than eastern Montana' : null,
    ratio != null && ratio <= 4 ? 'Affordable cost of living' : null,
    nearestSki ? `Skiing at ${nearestSki.name} (${nearestSki.distMiles} mi)${secondSki ? ` and ${secondSki.name} (${secondSki.distMiles} mi)` : ''}` : null,
    nearestPark ? `Near ${nearestPark.name}` : null,
    hc && hc.hasLocalHospital ? 'Has a local hospital' : null,
    hc && hc.healthcareScore >= 7 ? 'Strong healthcare access' : null,
    pop > 15000 ? 'Good amenities and services' : 'Authentic small-town community',
    'No state tax on Social Security or most pensions',
  ].filter(Boolean);

  const cons = [
    annualSnow != null && annualSnow > 60 ? 'Heavy snowfall requires winter preparedness' : 'Cold winters',
    ratio != null && ratio > 6 ? 'Housing costs above national average' : null,
    inv != null && inv < 50 ? 'Limited housing inventory' : null,
    unemp != null && unemp > 6 ? `Higher unemployment (${unemp}%)` : null,
    gradRate != null && gradRate < 75 ? `Below-average school graduation rate (${gradRate}%)` : null,
    hc && hc.healthcareScore < 4 ? `Limited healthcare access (nearest hospital: ${hc.nearestHospitalDist} mi)` : null,
    pop < 5000 ? 'Limited shopping and dining options' : null,
    'Distance from major metro areas',
    airportEntries.length > 0 && (airportEntries[0][1] as any).distanceMiles > 60 ? 'Airport is a significant drive' : null,
  ].filter(Boolean);

  sections.push({
    id: 'pros-cons',
    heading: `Pros & Cons of Living in ${t.name}`,
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <h3 style="color: #27ae60;">Pros</h3>
          <ul>${pros.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div>
          <h3 style="color: #c0392b;">Cons</h3>
          <ul>${cons.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>
    `,
  });

  // FAQs
  const faqs: FAQ[] = [
    { q: `What is the cost of living in ${t.name}, Montana?`, a: `${homeVal ? `The typical home value is ${$(homeVal)}` : `Housing costs vary`}${rent ? ` and rent averages ${$(rent)}/month` : ''}. ${income ? `The median household income is ${$(income)}.` : ''} Montana has no state sales tax, which helps offset costs.` },
    { q: `What are winters like in ${t.name}?`, a: `${janLow != null ? `January lows average ${janLow}°F` : 'Winters are cold'}${annualSnow ? ` with about ${annualSnow}" of annual snowfall` : ''}. ${janLow != null && janLow > 10 ? 'Compared to eastern Montana, winters here are relatively mild.' : 'Winter driving skills and proper vehicle preparation are essential.'}` },
    { q: `Is ${t.name} a good place to live?`, a: `${t.name} offers ${places.length} nearby recreation sites, ${ratio ? `a ${ratio <= 4 ? 'favorable' : ratio <= 6 ? 'moderate' : 'higher'} affordability ratio of ${ratio}x` : 'Montana quality of life'}, and four distinct seasons. ${nearestPark ? `It's about ${nearestPark.distMiles} miles from ${nearestPark.name}.` : ''} Montana's lack of sales tax can help offset some day-to-day costs.` },
    { q: `How many homes are for sale in ${t.name}?`, a: `${inv ? `As of early 2026, there were ${n(inv)} homes for sale in ${t.name}` : `Housing availability varies`}${invYoY != null ? `, ${invYoY > 0 ? `up ${invYoY}%` : `down ${Math.abs(invYoY)}%`} from the prior year` : ''}. ${units ? `The community has ${n(units)} total housing units with a ${vacancy}% vacancy rate (Census ACS 2019–2023).` : ''} Check Zillow or local MLS for the most current listings.` },
    ...(unemp != null ? [{ q: `What is the job market like in ${t.name}?`, a: `${t.name} has a ${unemp}% unemployment rate${unemp <= 3.5 ? ', which is at or below the state average' : unemp <= 6 ? '' : ', which is above the state average'}.${lfpr != null ? ` Labor force participation is ${lfpr}%.` : ''} ${employed ? `About ${n(employed)} residents are employed locally.` : ''} ${mainInd ? `The leading industry is ${mainInd.toLowerCase()}.` : ''} Montana has no state sales tax, which benefits both businesses and consumers.` }] : []),
    ...(gradRate != null ? [{ q: `How are the schools in ${t.name}?`, a: `The ${t.td.schoolDistrict || t.name} school district has a graduation rate of ${gradRate}%${gradRate >= 90 ? ', above the Montana state average of ~87%' : gradRate >= 85 ? ', near the state average' : ', below the state average of ~87%'}.${t.td.schoolEnrollment ? ` Approximately ${n(t.td.schoolEnrollment)} students are enrolled.` : ''}${perPupil ? ` Per-pupil spending is approximately ${$(perPupil)}.` : ''}` }] : []),
    ...(hc ? [{ q: `What healthcare is available in ${t.name}?`, a: `${hc.hasLocalHospital ? `${t.name} has a local hospital, ${hc.nearestHospital}` : `The nearest hospital is ${hc.nearestHospital} in ${hc.nearestHospitalCity} (${hc.nearestHospitalDist} miles)`}.${hc.nearestMajorHospitalDist != null ? ` The nearest major trauma center is ${hc.nearestMajorHospital} in ${hc.nearestMajorHospitalCity}, ${hc.nearestMajorHospitalDist} miles away.` : ''} There are ${hc.hospitalsWithin60} hospitals within 60 miles.` }] : []),
    ...(nearestSki ? [{ q: `Where is the nearest skiing to ${t.name}?`, a: `${nearestSki.name} is ${nearestSki.distMiles} miles from ${t.name}${secondSki ? ` and ${secondSki.name} is ${secondSki.distMiles} miles away` : ''}. ${annualSnow ? `${t.name} itself receives about ${annualSnow}" of snow annually, while ski areas in the region receive significantly more.` : ''}` }] : []),
  ];

  return {
    slug: `moving-to-${t.slug}-montana`,
    townSlug: t.slug,
    townName: t.name,
    title: `Moving to ${t.name}, Montana: Everything You Need to Know`,
    metaDescription: (() => {
      let desc = `Complete guide to moving to ${t.name}, MT. ${homeVal ? `Home values at ${$(homeVal)}` : 'Housing costs'}, ${janLow != null ? `${janLow}°F winter lows` : 'four-season climate'}, ${places.length} recreation sites, schools, and more.`;
      if (desc.length < 120 && county) desc = desc.replace(' and more.', `, jobs in ${county}, and more.`);
      if (desc.length > 160) desc = desc.slice(0, 157) + '...';
      return desc;
    })(),
    heroTitle: `Moving to ${t.name}`,
    heroSubtitle: t.nickname !== 'A Montana Community' ? t.nickname : 'Montana Relocation Guide',
    sections,
    faqs,
  };
}

/* ─── Guide Registry ─────────────────────────────────────── */

/** All towns with coordinates get a Moving Guide. */
function getAllGuideTowns(): string[] {
  const coordsPath = path.resolve(process.cwd(), 'data', 'town-coordinates.json');
  if (!fs.existsSync(coordsPath)) return [];
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));
  return Object.keys(coords).sort();
}

/* ─── Static Generation ──────────────────────────────────── */

export const getStaticPaths: GetStaticPaths = async () => {
  const towns = getAllGuideTowns();
  return {
    paths: towns.map(s => ({ params: { slug: `moving-to-${s}-montana` } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const rawSlug = String(ctx.params?.slug);

  const dataDir = path.resolve(process.cwd(), 'data');
  const load = (f: string) => {
    const p = path.join(dataDir, f);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  };

  const townData = load('town-data.json');
  const housing = load('town-housing.json');
  const climate = load('town-climate.json');
  const recreation = load('town-recreation.json');
  const nicknames = load('town-nicknames.json');
  const airports = load('town-airport-distances.json');
  const economy = load('town-economy.json');
  const healthcareData = load('town-healthcare.json');
  const rawFreshness = load('data-freshness.json');

  const match = rawSlug.match(/^moving-to-(.+)-montana$/);
  if (!match) return { notFound: true };
  const townSlug = match[1];

  const td = townData[townSlug];
  if (!td) return { notFound: true };

  const bundle: TownBundle = {
    slug: townSlug,
    name: td.name || townSlug,
    nickname: nicknames[townSlug] || 'A Montana Community',
    td, h: housing[townSlug] || {},
    clim: climate[townSlug] || null,
    rec: recreation[townSlug] || null,
    air: airports[townSlug] || null,
    econ: economy[townSlug] || null,
    health: healthcareData[townSlug] || null,
    freshness: rawFreshness,
  };

  const guide = movingGuide(bundle);

  const { rankingLinks, plannerLinks } = await import('../../lib/cross-links');
  const rankings = [...rankingLinks(townSlug), ...plannerLinks(townSlug)];

  return { props: { guide, freshness: rawFreshness, rankings } };
};
