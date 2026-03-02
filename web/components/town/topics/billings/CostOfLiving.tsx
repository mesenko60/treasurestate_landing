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
        {townName} is Montana's largest city, founded in 1882 when the Northern Pacific Railroad
        arrived and sparked such explosive growth that locals dubbed it "The Magic City." With a
        population of roughly 117,100 in Yellowstone County, it serves as the commercial and
        medical hub for a 500,000-person service area spanning eastern Montana, northern Wyoming,
        and the western Dakotas{'\u2014'}and its cost of living reflects a working city where
        healthcare, energy, and agriculture drive the economy rather than tourism or resort
        speculation. This guide breaks down housing, income, affordability, and employment data
        so you know what it actually costs to live here.
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
        Housing is the single largest expense for {townName} residents, but it's remarkably
        affordable by Montana standards. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window. Either way,
        {' '}{townName} offers the most affordable housing of any major Montana city{'\u2014'}significantly
        below Bozeman (~$635K), Missoula (~$547K), Helena (~$466K), and Kalispell (~$509K).
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}Unlike Whitefish or Big Sky, {townName} doesn't face heavy short-term rental
        conversion from tourism{'\u2014'}the rental market is driven by healthcare workers, energy
        sector employees, and the city's large retail and service workforce.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is the most affordable major city in
        Montana{'\u2014'}comfortably below Helena (6.6), Missoula (7.9), Bozeman (8.8), and Whitefish (11.7).
        A household earning the local median income can realistically qualify for a median-priced home here,
        which is increasingly rare in the state.
      </p>
      <p>
        {townName}'s affordability stems from a diversified, non-resort economy. Two major hospital
        systems{'\u2014'}Billings Clinic and St. Vincent Healthcare{'\u2014'}are the city's largest
        employers, providing thousands of professional-wage jobs with benefits. Two oil
        refineries (CHS and ExxonMobil) anchor the energy sector, while First Interstate BancSystem
        is headquartered here. These employers generate stable, year-round incomes that support
        mortgage qualification without the seasonal gaps common in tourism-driven towns.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}'s lower elevation (3,123 feet{'\u2014'}the lowest of Montana's major cities) and its
        position in the Yellowstone River valley produce a warmer, drier climate than western Montana,
        which translates to lower heating costs and less snow removal than Missoula, Helena, or Kalispell.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1404, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1404) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 200, pct: h?.medianHouseholdIncome ? Math.round((200 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 500, pct: h?.medianHouseholdIncome ? Math.round((500 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s warmer, drier climate and lower elevation (3,123 ft) compared to western Montana cities.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 26.2}% of employment. Billings Clinic and St. Vincent Healthcare
        are the two largest employers{'\u2014'}together forming the largest medical corridor between
        Minneapolis and Seattle, drawing patients from across a multi-state region.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The energy sector adds another layer of economic stability{'\u2014'}CHS and ExxonMobil refineries
        process crude from the Bakken formation and the Powder River Basin, providing
        high-wage industrial jobs uncommon in most Montana cities.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Unlike western Montana's resort communities, {townName}'s economy has minimal seasonal
        variation. Healthcare operates year-round, energy production is continuous, and the city's
        role as a regional retail and logistics hub creates steady demand across all seasons.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's cities, {townName} stands out as the most affordable major market with the
        strongest job base. Its affordability ratio of {h?.affordabilityRatio ?? '\u2014'}{' '}
        is the best of any major Montana city{'\u2014'}below Helena (6.6), Missoula (7.9),
        Bozeman (8.8), Kalispell (8.5), and dramatically below Whitefish's 11.7.
        With 546 active listings and 112 new listings per month, {townName} also offers
        Montana's most liquid housing market, giving buyers real choices and negotiating leverage.
      </p>
      <p>
        What {townName} trades off is the mountain-town aesthetics of Bozeman or Missoula and the
        lakefront recreation of the Flathead Valley. What it gains is substance: two world-class
        hospital systems, Montana's busiest airport (BIL), a diversified economy that doesn't
        depend on tourism, and the dramatic Rimrocks sandstone cliffs that frame the city's
        skyline. The Yellowstone River runs along the city's edge, the Beartooth Highway and
        Yellowstone National Park are roughly 120 miles southwest, and the cost of entry is the
        lowest of any major Montana city. For buyers seeking value, career stability, and
        big-city services in a Montana setting, {townName} is the clear front-runner.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, but {townName} has the best affordability ratio (5.4) of any major Montana city{'\u2014'}well below the state average.</li>
        <li>Two major hospital systems and two oil refineries provide a diversified, year-round employment base that insulates {townName} from seasonal tourism swings.</li>
        <li>Montana's zero state sales tax offsets daily expenses, and {townName}'s lower elevation (3,123 ft) and drier climate mean lower heating and snow-removal costs than western Montana.</li>
        <li>No resort-town or university-town price inflation{'\u2014'}{townName}'s housing market is driven by local demand from healthcare, energy, and regional commerce.</li>
        <li>Montana's largest and most liquid housing market (546 listings, 112 new per month) gives buyers real choices unavailable in tighter markets like Bozeman or Missoula.</li>
      </ul>
    </article>
  );
}
