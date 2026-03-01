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
        {townName} is western Montana's largest city and a regional hub for education, healthcare, and outdoor recreation.
        Understanding the cost of living here is essential whether you're considering a move or comparing {townName} to
        other Montana communities. This guide breaks down housing, income, affordability, and employment data
        to give you a clear picture of what it costs to call {townName} home.
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
        Housing is the single largest expense for most {townName} residents. The median home value stands
        at {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{' '}—{' '}median home value divided by median household income{' '}—{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} means housing in {townName} is stretched relative to local incomes,
        a pattern common in desirable Western mountain communities.
      </p>
      <p>
        This doesn't mean {townName} is unaffordable in absolute terms{' '}—{' '}median home values here remain
        well below those in comparable cities like Bend, Oregon or Boise, Idaho. And Montana's lack of
        a state sales tax provides some relief on everyday expenses.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1526, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1526) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 250, pct: h?.medianHouseholdIncome ? Math.round((250 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 500, pct: h?.medianHouseholdIncome ? Math.round((500 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 350, pct: h?.medianHouseholdIncome ? Math.round((350 / (h.medianHouseholdIncome / 12)) * 100) : null },
          ].map(row => (
            <tr key={row.cat} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{row.cat}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${fmt(row.amt)}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>{row.pct != null ? `${row.pct}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 26}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The University of Montana is the city's single largest employer, followed by several major
        healthcare systems.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}{' '}—{' '}higher than
        the national average of roughly 62%. This reflects {townName}'s younger-skewing population and
        university-driven job market. For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's larger cities, {townName} falls in the middle tier for overall cost of living.
        Bozeman is significantly more expensive (median home values exceed $700K), while
        Great Falls and Billings offer lower housing costs but fewer of the outdoor recreation
        and cultural amenities that draw people to western Montana.
      </p>
      <p>
        {townName}'s combination of a university-driven economy, access to five major river valleys,
        and a vibrant downtown makes it attractive to remote workers, retirees, and outdoor
        enthusiasts{' '}—{' '}which in turn keeps upward pressure on housing costs. The 15% year-over-year
        increase in for-sale inventory suggests the market may be shifting toward more balance.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with home values in the top 12% of Montana towns.</li>
        <li>Incomes are middle-of-the-pack for Montana, creating an affordability gap.</li>
        <li>Montana's zero state sales tax offsets some daily expenses.</li>
        <li>The job market is stable, driven by education, healthcare, and professional services.</li>
        <li>Inventory is growing, which may ease prices for buyers over time.</li>
      </ul>
    </article>
  );
}
