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
        {townName} is a resort town of roughly 8,915 people tucked between Whitefish Mountain
        Resort and Whitefish Lake in Montana's Flathead Valley. Glacier National Park's west
        entrance is 17 miles northeast, closer than any other town of significant size. That
        combination of world-class skiing, national-park access, and a charming walkable
        downtown on Central Avenue has made {townName} one of the most desirable small towns
        in the American West and one of the most expensive places to live in Montana. This
        guide breaks down housing, income, affordability, and employment data so you know
        what it actually costs to live here.
        For a broader overview of the town, see our{' '}
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
        Housing is the defining cost-of-living factor in {townName}. The median home value
        stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)}, reflecting its multi-year survey window.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, placing it in the top ${100 - h.homeValuePercentile}% of the entire state.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents rank in the ${ordinal(h.rentPercentile)} percentile, virtually the highest in Montana.` : ''}
        {' '}The short-term rental market is a dominant force: Whitefish Mountain Resort draws
        skiers in winter, Glacier National Park draws millions of visitors in summer, and
        property owners routinely earn more from Airbnb and VRBO than from year-round tenants.
        The result is a severely constrained long-term rental market and rents that far exceed
        what local wages would otherwise support.
        For a detailed look at market trends and inventory, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        The affordability ratio{' '}&mdash;{' '}median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is
        3.0 to 5.0. A ratio of {h?.affordabilityRatio ?? 'this level'} means {townName}'s
        housing is deeply unaffordable relative to local earning power, among the most
        stretched ratios in Montana.
      </p>
      <p>
        The income-to-housing disconnect reflects {townName}'s dual identity: the people who
        buy homes here are often not the same people who work here. Vacation-home buyers,
        retirees, and remote workers with out-of-state incomes drive purchase prices, while
        the local workforce of resort employees, hospitality staff, retail workers, and
        tradespeople faces a market priced well beyond local wages. This dynamic is more
        extreme in {townName} than in any other Montana community except perhaps Big Sky.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses.
        {townName}'s elevation (3,038 ft) results in cold winters, and heating costs should
        be factored into any budget. Groceries, dining, and retail in {townName} lean toward
        resort-town pricing, particularly along Central Avenue and near the mountain.
      </p>

      <h2>Monthly Budget Estimate</h2>
      <p>
        While individual budgets vary widely, here is a rough breakdown of monthly costs for a
        household earning {townName}'s median income:
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 2436, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 2436) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 260, pct: h?.medianHouseholdIncome ? Math.round((260 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 550, pct: h?.medianHouseholdIncome ? Math.round((550 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 380, pct: h?.medianHouseholdIncome ? Math.round((380 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 340, pct: h?.medianHouseholdIncome ? Math.round((340 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Groceries and dining in {townName} trend higher than the Montana average due to resort-town pricing.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which
        accounts for {e?.topIndustries?.[0]?.pct ?? 21.1}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` Retail (${e.topIndustries[1].pct}%) and professional services (${e.topIndustries[2].pct}%) round out the top three sectors.`
          : ''}
        {' '}Tourism and hospitality, driven by Whitefish Mountain Resort in winter and Glacier
        National Park in summer, employ a substantial share of the workforce but add sharp
        seasonal swings.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}The low participation rate partly reflects {townName}'s large retiree and seasonal-resident
        population. Among working-age adults, the job market is extremely tight, particularly
        in hospitality, construction, and skilled trades.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is the most expensive place to live among Montana's major communities. Its
        median home value ({fmtDollar(h?.zillowHomeValue ?? null)}) exceeds Bozeman ($703K),
        Missoula ($547K), and neighboring Kalispell ($538K). The median list price of over
        $1.29M reflects the luxury and vacation-home segment that dominates the market. Even
        Bozeman, with its tech-fueled growth, has a lower affordability ratio.
      </p>
      <p>
        Kalispell, 15 miles south, is {townName}'s practical alternative. Many resort workers
        commute from Kalispell or Columbia Falls, where housing costs are 30 to 40% lower. The
        trade-off is clear: {townName} offers a walkable downtown, proximity to the mountain,
        and a resort-town atmosphere that Kalispell does not match. Great
        Falls and Billings remain far more affordable for housing but lack the Glacier-area
        lifestyle that sustains demand in the Flathead Valley.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the overwhelming cost driver, with home values in the top {h?.homeValuePercentile ? `${100 - h.homeValuePercentile}%` : '4%'} of Montana towns and a median list price exceeding $1.29M.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 11.7} is among the most extreme in Montana{h?.incomePercentile != null && h?.homeValuePercentile != null ? `: ${ordinal(h.incomePercentile)} percentile income vs. ${ordinal(h.homeValuePercentile)} percentile home values` : ''}.</li>
        <li>Nearly 1 in 5 housing units ({h?.vacancyRate ?? 19.3}% vacancy rate) is a vacation home or short-term rental, constraining supply for year-round residents.</li>
        <li>Montana's zero state sales tax offsets some daily expenses, but resort-town pricing affects groceries, dining, and services.</li>
        <li>Most local workers cannot afford to buy in {townName} at current prices. The workforce increasingly commutes from Kalispell and Columbia Falls.</li>
      </ul>
    </article>
  );
}
