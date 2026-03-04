import Link from 'next/link';

type Props = {
  townName: string;
  slug: string;
  housing: {
    medianHomeValue: number | null;
    medianRent: number | null;
    medianHouseholdIncome: number | null;
    zillowHomeValue: number | null;
    zillowHomeValueDate: string | null;
    zillowRent: number | null;
    zillowRentDate: string | null;
    homeValuePercentile: number | null;
    rentPercentile: number | null;
    incomePercentile: number | null;
    affordabilityRatio: number | null;
    totalHousingUnits: number | null;
    vacancyRate: number | null;
  } | null;
  economy: {
    unemploymentRate: number | null;
    laborForceParticipation: number | null;
    mainIndustry: string | null;
    topIndustries: { name: string; pct: number }[] | null;
  } | null;
};

function fmt(n: number | null): string {
  if (n == null) return '\u2014';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '\u2014';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000).toLocaleString('en-US')}K`;
}

function fmtPct(n: number | null): string {
  if (n == null) return '\u2014';
  return `${n}%`;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  return `${n}${suffixes[n % 10] || 'th'}`;
}

const cardStyle: React.CSSProperties = {
  background: '#f8faf8', borderRadius: '10px', padding: '1rem 1.25rem',
  textAlign: 'center' as const, border: '1px solid #e2ebe2',
};
const cardLabel: React.CSSProperties = { fontSize: '0.78rem', color: '#666', marginBottom: '0.25rem' };
const cardValue: React.CSSProperties = { fontSize: '1.35rem', fontWeight: 700, color: '#204051' };

export default function CostOfLiving({ townName, slug, housing, economy }: Props) {
  const h = housing;
  const e = economy;

  return (
    <article className="content-section">
      <p>
        {townName} is the commercial center of Montana{'\u2019'}s Bitterroot Valley, a town of
        roughly 4,659 people in Ravalli County at 3,573 feet elevation. Nestled between the
        Bitterroot Range to the west and the Sapphire Mountains to the east, {townName} sits
        47 miles south of Missoula on US-93{'\u2014'}close enough for day trips to the university
        city, far enough to maintain its own distinct small-town identity. Once an affordable
        alternative to western Montana{'\u2019'}s pricier markets, {townName} has seen significant
        cost-of-living increases driven by remote workers, retirees from higher-cost states, and
        the Bitterroot Valley{'\u2019'}s growing reputation as an outdoor paradise. This guide breaks
        down housing, income, affordability, and employment data so you know what it actually
        costs to live here. For a broader overview, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Median Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? h?.medianHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : fmtDollar(h?.medianRent ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Income</div><div style={cardValue}>{fmtDollar(h?.medianHouseholdIncome ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Affordability Ratio</div><div style={cardValue}>{h?.affordabilityRatio ?? '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Unemployment</div><div style={cardValue}>{fmtPct(e?.unemploymentRate ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Home Value Rank</div><div style={cardValue}>{h?.homeValuePercentile ? `Top ${100 - h.homeValuePercentile}%` : '\u2014'}</div></div>
      </div>

      <h2>Housing Costs</h2>
      <p>
        Housing is the defining cost-of-living challenge in {townName}. The median home value stands
        at {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow{'\u2019'}s Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau{'\u2019'}s American Community Survey puts the figure at {fmtDollar(h?.medianHomeValue ?? null)},
        reflecting the multi-year survey window. For a town of 4,659 people, an affordability
        ratio of {h?.affordabilityRatio ?? 9.5} is striking{'\u2014'}driven by out-of-state buyers,
        remote workers with coastal salaries, and retirees drawn to the Bitterroot Valley{'\u2019'}s
        mild climate — the valley is known as the "Banana Belt of Montana" — and mountain scenery.
      </p>
      <p>
        Rental data for {townName} is limited{'\u2014'}Zillow does not publish a rent index for the
        town, reflecting the small and informal nature of the local rental market. Census ACS
        data puts the median rent at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}With a vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'},
        finding available rentals requires patience and local connections.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is severely stretched{'\u2014'}worse
        than Bozeman (8.8) and approaching Whitefish (11.7) territory, despite being a far smaller
        town. The disconnect between local wages and home prices reflects a market reshaped by
        outside money: remote workers, retirees from California, Oregon, and Washington, and
        second-home buyers who bid up prices beyond what Bitterroot Valley wages can support.
      </p>
      <p>
        Missoula, 47 miles north, offers a larger job market and university-town amenities, but
        many workers commute the US-93 corridor between the two towns{'\u2014'}living in the Bitterroot
        for its lower density and outdoor access while earning Missoula-area wages. This commuter
        dynamic further inflates {townName}{'\u2019'}s housing costs without proportionally raising
        local income figures.
      </p>
      <p>
        Montana{'\u2019'}s lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}{'\u2019'}s elevation of 3,573 feet and sheltered position in the Bitterroot Valley produces
        relatively mild winters by Montana standards{'\u2014'}January highs average 40°F, significantly warmer
        than Great Falls, Helena, or the Hi-Line. Heating costs are moderate compared to higher-elevation
        or wind-exposed Montana towns.
      </p>

      <h2>Monthly Budget Estimate</h2>
      <p>
        While individual budgets vary widely, here{'\u2019'}s a rough breakdown of monthly costs for a household
        earning {townName}{'\u2019'}s median income:
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Category</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Estimated Monthly</th>
            <th style={{ padding: '0.5rem', textAlign: 'right' }}>% of Income</th>
          </tr>
        </thead>
        <tbody>
          {[
            { cat: 'Housing (rent or mortgage)', amt: h?.medianRent ?? 1100, pct: h?.medianHouseholdIncome ? Math.round(((h?.medianRent ?? 1100) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 200, pct: h?.medianHouseholdIncome ? Math.round((200 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 500, pct: h?.medianHouseholdIncome ? Math.round((500 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 420, pct: h?.medianHouseholdIncome ? Math.round((420 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 300, pct: h?.medianHouseholdIncome ? Math.round((300 / (h.medianHouseholdIncome / 12)) * 100) : null },
          ].map(row => (
            <tr key={row.cat} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{row.cat}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${fmt(row.amt)}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>{row.pct != null ? `${row.pct}%` : '\u2014'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Utilities reflect {townName}{'\u2019'}s sheltered valley position at 3,573 ft{'\u2014'}milder
        winters than many Montana towns keep heating costs moderate.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}{'\u2019'}s economy is anchored by {e?.mainIndustry ?? 'retail'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 16}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Rocky Mountain Laboratories, a National Institutes of Health (NIH) research facility
        in {townName}, is one of the most significant federal employers in rural Montana{'\u2014'}a
        BSL-4 biosafety laboratory conducting research on infectious diseases. RML provides
        high-skill, well-compensated employment that is unusual for a town this size and adds
        economic stability independent of tourism or real estate cycles.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}{'\u2014'}remarkably low and
        indicative of a tight labor market. Labor force participation stands
        at {fmtPct(e?.laborForceParticipation ?? null)}, reflecting the community{'\u2019'}s mix of
        retirees (who lower participation) and self-employed outdoor professionals.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}{'\u2019'}s most natural comparison is Missoula, 47 miles north on US-93. Missoula
        offers a university, a regional airport, and a far larger job market, but its affordability
        ratio of 7.9 is actually better than {townName}{'\u2019'}s 9.5{'\u2014'}meaning {townName} is
        proportionally more expensive relative to local incomes. Many Bitterroot Valley residents
        accepted that trade-off for the valley{'\u2019'}s quieter pace, closer mountain access, and
        lower population density.
      </p>
      <p>
        Compared to Helena (6.6) or Great Falls (3.7), {townName} is significantly more
        expensive{'\u2014'}a premium driven by the Bitterroot Valley{'\u2019'}s scenic appeal, mild climate,
        and the influx of out-of-state buyers who have reshaped the market over the past decade.
        What {townName} offers in return is unmatched outdoor access{'\u2014'}100 trailheads within 50
        miles, the Bitterroot River through town, the Selway-Bitterroot Wilderness 10 miles
        away{'\u2014'}and a small-town character that larger Montana cities have partially lost to growth.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is expensive for a town of 4,659{'\u2014'}an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} reflects remote-worker and retiree demand more than local wages.</li>
        <li>Rental data is limited (no Zillow index), but Census figures and a {h?.vacancyRate ?? 10.5}% vacancy rate suggest a tight but not impossible rental market.</li>
        <li>Rocky Mountain Laboratories (NIH) provides high-skill federal employment unusual for rural Montana, adding economic stability beyond retail and tourism.</li>
        <li>Montana{'\u2019'}s zero state sales tax offsets daily costs, and {townName}{'\u2019'}s mild valley climate (Jan highs ~40°F) keeps heating bills lower than many Montana towns.</li>
        <li>Pricier than Missoula (47 mi) relative to income, but {townName} offers unmatched recreation access{'\u2014'}100 trailheads, 7 wilderness areas, and the Bitterroot River{'\u2014'}at a fraction of the population density.</li>
      </ul>
    </article>
  );
}
