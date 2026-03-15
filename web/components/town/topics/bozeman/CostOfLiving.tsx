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
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000).toLocaleString('en-US')}K`;
}

function fmtPct(n: number | null): string {
  if (n == null) return '—';
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
        {townName} is one of the fastest-growing cities in the United States, anchored by Montana State
        University and surrounded by world-class skiing, fly fishing, and Yellowstone National Park just
        ninety minutes to the south. That growth has made the cost of living a defining concern for anyone
        considering a move to the Gallatin Valley. This guide breaks down housing, income, affordability,
        and employment data to give you a clear picture of what it costs to call {townName} home.
        For a broader overview of the city, see our{' '}
        <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Median Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? h?.medianHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : fmtDollar(h?.medianRent ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Income</div><div style={cardValue}>{fmtDollar(h?.medianHouseholdIncome ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Affordability Ratio</div><div style={cardValue}>{h?.affordabilityRatio ?? '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Unemployment</div><div style={cardValue}>{fmtPct(e?.unemploymentRate ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Home Value Rank</div><div style={cardValue}>{h?.homeValuePercentile ? `Top ${100 - h.homeValuePercentile}%` : '—'}</div></div>
      </div>

      <h2>Housing Costs</h2>
      <p>
        Housing is the single largest expense for {townName} residents and the primary driver of the city's
        high cost of living. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window. Either way,
        {townName} sits firmly at the top of Montana's housing market.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}Montana State University's 16,000-plus students create intense rental demand near campus and downtown,
        pushing rents higher than most Montana cities.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        While that income level is healthy by Montana standards, it hasn't kept pace with the surge in
        home prices. The affordability ratio{' '}—{' '}median home value divided by median household income{' '}—{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} means {townName}'s housing costs are significantly
        stretched relative to local earning power, even by western mountain-town standards.
      </p>
      <p>
        This doesn't mean {townName} is unaffordable in absolute terms. Home values here remain well below
        Jackson Hole, Wyoming, where median prices exceed $1.5 million. And Montana's lack of a state
        sales tax provides meaningful relief on everyday expenses{' '}—{' '}groceries, clothing, and household
        goods all cost less at the register than in states with 6–9% sales taxes.
      </p>
      <p>
        At the same time, {townName} is notably more expensive than Missoula, Montana's other major university
        city, where home values run roughly $150K lower. The gap reflects {townName}'s proximity to Big Sky
        Resort, the tech-sector growth that has earned it the nickname "Boz Angeles," and the continuous
        influx of high-income remote workers from coastal markets.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 2114, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 2114) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 270, pct: h?.medianHouseholdIncome ? Math.round((270 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 550, pct: h?.medianHouseholdIncome ? Math.round((550 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 420, pct: h?.medianHouseholdIncome ? Math.round((420 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 360, pct: h?.medianHouseholdIncome ? Math.round((360 / (h.medianHouseholdIncome / 12)) * 100) : null },
          ].map(row => (
            <tr key={row.cat} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{row.cat}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${fmt(row.amt)}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>{row.pct != null ? `${row.pct}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Utilities may run higher in winter due to {townName}'s cold-climate heating demands.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 26.5}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Montana State University is the city's anchor institution and single largest employer, supporting
        thousands of jobs across research, administration, athletics, and extension services.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}{' '}—{' '}well above
        the national average of roughly 62%. {townName}'s tech sector has expanded significantly in
        recent years, with companies drawn by the quality of life, MSU's engineering graduates,
        and a growing startup ecosystem.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's larger cities, {townName} sits near the top for cost of living. Missoula is
        more affordable, with median home values around $547K compared to {townName}'s{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)}. Great Falls and Billings offer significantly lower
        housing costs but lack the outdoor recreation access and cultural vibrancy that drive demand in
        the Gallatin Valley.
      </p>
      <p>
        Looking beyond Montana, {townName} remains more affordable than resort-adjacent peers like
        Jackson Hole, Park City, or Bend. Its combination of a research university, proximity to
        two ski areas (Big Sky Resort and Bridger Bowl), and year-round outdoor access creates a
        lifestyle premium that sustains demand{' '}—{' '}and keeps upward pressure on housing costs{' '}—{' '}even as
        inventory gradually expands.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with home values in the top 7% of Montana towns.</li>
        <li>Incomes are above the Montana median but haven't kept pace with home price growth, creating a wide affordability gap.</li>
        <li>Montana's zero state sales tax offsets some daily expenses, but cold winters mean higher utility bills.</li>
        <li>The job market is strong and diversifying, led by education, healthcare, professional services, and a growing tech sector.</li>
        <li>{townName}'s rapid population growth continues to fuel demand, though rising inventory may moderate price increases over time.</li>
      </ul>
    </article>
  );
}
