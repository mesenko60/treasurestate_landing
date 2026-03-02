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
        {townName} is Montana's state capital, founded in 1864 during the Last Chance Gulch gold rush
        and serving as the seat of government since 1889. With a population of roughly 33,100 in
        Lewis and Clark County, it anchors the state's political and administrative infrastructure
        {'\u2014'}and its cost of living reflects a city where government-sector stability keeps
        prices moderate compared to Montana's tourism-driven markets. This guide breaks down housing,
        income, affordability, and employment data so you know what it actually costs to live here.
        For a broader overview of the city, see our{' '}
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
        Housing is the single largest expense for {townName} residents, though it remains notably
        more affordable than Montana's resort and university towns. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window. Either way,
        {' '}{townName}'s prices sit well below Bozeman, Missoula, and Kalispell{'\u2014'}making it the
        most affordable of Montana's larger cities.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}Unlike Kalispell or Whitefish, {townName} doesn't contend with heavy short-term rental
        conversion from tourism{'\u2014'}the rental market here is driven primarily by state government
        employees, legislative session workers, and Carroll College students.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is stretched but far less than Whitefish (11.7),
        Bozeman (8.8), or Kalispell (8.5){'\u2014'}making it the best value among Montana's larger cities
        for homebuyers earning local wages.
      </p>
      <p>
        The State of Montana is {townName}'s single largest employer, providing a steady base of
        professional-wage government jobs that insulate the city from the seasonal swings that affect
        tourism-dependent towns. Government accounts for 15.5% of local employment{'\u2014'}the second
        largest sector{'\u2014'}and these positions typically come with benefits, retirement plans, and
        predictable income that make mortgage qualification easier than in commission- or tip-based
        economies.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6\u20139% sales taxes.
        {townName}'s drier climate (roughly 12 inches of annual precipitation, compared to 14\u201317 inches
        in western Montana cities) and its elevation of 4,039 feet translate to cold but less snowy winters,
        which can mean modestly lower heating and snow-removal costs compared to places like Missoula or Kalispell.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1490, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1490) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 220, pct: h?.medianHouseholdIncome ? Math.round((220 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 500, pct: h?.medianHouseholdIncome ? Math.round((500 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 380, pct: h?.medianHouseholdIncome ? Math.round((380 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 320, pct: h?.medianHouseholdIncome ? Math.round((320 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s drier climate (~12" annual precipitation) and lower snow loads compared to western Montana cities.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 27.1}% of employment. St. Peter's Health is a major employer,
        while Carroll College{'\u2014'}a private liberal arts school with roughly 1,300 students{'\u2014'}adds
        a small but stable institutional presence.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Government employment (15.5%) reflects {townName}'s role as state capital{'\u2014'}the State of
        Montana provides thousands of year-round jobs that don't depend on tourism seasons or commodity cycles.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Unlike Kalispell or Whitefish, {townName}'s economy has minimal seasonal variation.
        Government, healthcare, and education employment remain steady year-round, which makes
        the city's job market unusually predictable for Montana.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's larger cities, {townName} stands out as the most affordable option
        with genuine urban amenities. Its affordability ratio of {h?.affordabilityRatio ?? '\u2014'}{' '}
        compares favorably to Bozeman (8.8), Missoula (7.9), and Kalispell (8.5){'\u2014'}and is
        dramatically below Whitefish's 11.7. Buyers priced out of those markets increasingly look
        to {townName}, where a median-income household can realistically qualify for a median-priced home.
      </p>
      <p>
        What {townName} trades off is the university-town energy of Bozeman or Missoula and the
        resort-town recreation access of the Flathead Valley. What it gains is stability: a
        government-backed economy that doesn't boom and bust with tourism seasons, a historic
        downtown along Last Chance Gulch, and immediate access to the Helena-Lewis & Clark National
        Forest for year-round outdoor recreation. Great Falls and Billings are cheaper still, but
        neither offers {townName}'s combination of state-capital resources, mountain setting, and
        proximity to wilderness.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, but {townName} remains the most affordable of Montana's larger cities with an affordability ratio of {h?.affordabilityRatio ?? '\u2014'}.</li>
        <li>Government employment (15.5%) provides unusual economic stability{'\u2014'}the State of Montana is the single largest employer.</li>
        <li>Montana's zero state sales tax offsets daily expenses, and {townName}'s dry climate (~12" annual precipitation) means lower heating and snow-removal costs than western Montana.</li>
        <li>No resort-town or university-town price inflation{'\u2014'}{townName}'s housing market is driven by local demand rather than tourism or short-term rentals.</li>
        <li>Inventory is up 19% year-over-year, creating the best buyer opportunity among Montana's major cities.</li>
      </ul>
    </article>
  );
}
