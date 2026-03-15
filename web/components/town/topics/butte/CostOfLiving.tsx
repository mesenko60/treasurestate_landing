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
        {townName} is "The Richest Hill on Earth"{'\u2014'}a city built on the copper, silver, and gold
        mining that powered America's industrial revolution from the 1860s through the 20th century.
        With a population of roughly 34,500 in Silver Bow County (Montana's only consolidated
        city-county government), it sits at 5,741 feet on the Continental Divide{'\u2014'}the highest
        elevation of any major Montana city. Today {townName} is the most affordable hub in the state,
        with a cost of living shaped by its mining heritage, historic housing stock, and an economy
        transitioning from extraction to education and healthcare. This guide breaks down housing,
        income, affordability, and employment data so you know what it actually costs to live here.
        For a broader overview, see our{' '}
        <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        Housing is the single largest expense for {townName} residents{'\u2014'}but it's cheaper here
        than anywhere else among Montana's major cities. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window.
        {' '}{townName}'s prices rank well below Bozeman (~$635K), Missoula (~$547K), Kalispell (~$509K),
        and even Helena (~$395K){'\u2014'}making it the clear value leader for buyers in western Montana.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}Much of the rental demand comes from Montana Tech students and faculty, along with
        healthcare workers at St. James Healthcare. Unlike resort-area markets, {townName} doesn't
        lose rental units to short-term vacation conversions{'\u2014'}the long-term rental pool remains
        largely intact.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        That's the lowest median income among Montana's hub cities{'\u2014'}a legacy of the mining
        economy's decline from a peak population of over 100,000. But the affordability
        ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}, the lowest (most affordable) of any hub city in the guide.
        For context, the commonly cited national benchmark is 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is comfortably within that healthy range,
        far below Whitefish (11.7), Bozeman (8.8), Kalispell (8.5), Missoula (7.9), and Helena (6.6).
      </p>
      <p>
        Montana Tech{'\u2014'}a public university with roughly 2,000 students and strong STEM, engineering,
        and mining programs{'\u2014'}is {townName}'s most important economic anchor today. Together with
        St. James Healthcare and Silver Bow County government, these institutions provide a stable
        employment base that has replaced much of the mining-era workforce. The transition is ongoing,
        but these employers offer the kind of benefits-eligible, year-round positions that support
        mortgage qualification.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        However, {townName}'s elevation of 5,741 feet{'\u2014'}the highest of any major Montana
        city{'\u2014'}means colder winters and higher heating bills. January highs average just 28°F,
        and the long heating season from October through May is a real budget factor. Expect utility
        costs to run $30{'\u2013'}$50 per month higher than lower-elevation cities like Billings or
        Great Falls during winter months.
      </p>

      <h2>Monthly Budget Estimate</h2>
      <p>
        While individual budgets vary widely, here's a rough breakdown of monthly costs for a household
        earning {townName}'s median income:
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1341, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1341) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 260, pct: h?.medianHouseholdIncome ? Math.round((260 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 480, pct: h?.medianHouseholdIncome ? Math.round((480 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 370, pct: h?.medianHouseholdIncome ? Math.round((370 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 310, pct: h?.medianHouseholdIncome ? Math.round((310 / (h.medianHouseholdIncome / 12)) * 100) : null },
          ].map(row => (
            <tr key={row.cat} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{row.cat}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${fmt(row.amt)}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>{row.pct != null ? `${row.pct}%` : '\u2014'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Utilities reflect {townName}'s high elevation (5,741 ft) and cold winters{'\u2014'}heating costs run higher than lower-elevation Montana cities.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 23.5}% of employment. St. James Healthcare is the city's
        largest private employer, while Montana Tech provides both jobs and a pipeline of STEM-trained
        graduates{'\u2014'}many of whom stay in the region for careers in environmental remediation,
        engineering, and technology.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Tourism and hospitality (10.2%) have grown as {townName} leans into its mining heritage{'\u2014'}the
        Berkeley Pit, the World Museum of Mining, and Uptown Butte's National Historic Landmark District
        all draw visitors year-round.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}{townName}'s 4.3% unemployment is the highest among Montana's hub cities, reflecting
        the long economic transition from mining to a diversified economy. The Superfund cleanup
        of mining-era contamination{'\u2014'}one of the largest in U.S. history{'\u2014'}has itself become
        a source of skilled employment in environmental science and remediation, though the broader
        job market remains thinner than in faster-growing cities like Bozeman or Missoula.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's hub cities, {townName} is the clear affordability champion. Its ratio
        of {h?.affordabilityRatio ?? '\u2014'} is dramatically lower than Bozeman (8.8), Missoula (7.9),
        Kalispell (8.5), and Whitefish (11.7){'\u2014'}and even beats Helena (6.6) and Great Falls (5.4).
        For buyers priced out of western Montana's more expensive markets, {townName} offers entry-level
        homeownership that's increasingly rare in the state.
      </p>
      <p>
        What {townName} trades off is the job-market depth of Bozeman or Missoula and the resort
        access of the Flathead Valley. Incomes are lower, and the mining-era population decline has
        left a high vacancy rate ({h?.vacancyRate != null ? `${h.vacancyRate}%` : '11.7%'}) that speaks
        to a city still right-sizing from its 100,000-person peak. But what {townName} gains is
        genuinely affordable living, a historic Uptown district that rivals any downtown in the state
        for character, Montana Tech's growing academic presence, and a community identity{'\u2014'}"Butte,
        America"{'\u2014'}that's as fierce and distinctive as any in Montana. The Superfund sites that
        dominate national headlines don't affect daily life for most residents{'\u2014'}they're
        concentrated in specific zones well outside residential neighborhoods.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, but {townName} is the most affordable hub city in Montana with an affordability ratio of {h?.affordabilityRatio ?? '\u2014'}{'\u2014'}comfortably within the healthy national benchmark of 3.0{'\u2013'}5.0.</li>
        <li>Median household income ({fmtDollar(h?.medianHouseholdIncome ?? null)}) is the lowest of Montana's hubs, but ultra-low home prices more than compensate.</li>
        <li>Montana's zero state sales tax offsets daily expenses, but {townName}'s 5,741-foot elevation means higher heating costs from October through May.</li>
        <li>Montana Tech and St. James Healthcare anchor a transitioning economy{'\u2014'}mining is mostly gone, but education, healthcare, and environmental remediation have partially filled the gap.</li>
        <li>Superfund cleanup sites are concentrated in specific zones and don't affect daily living for the vast majority of residents.</li>
      </ul>
    </article>
  );
}
