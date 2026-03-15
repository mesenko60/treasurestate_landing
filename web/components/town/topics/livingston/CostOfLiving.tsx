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
        {townName} is a small arts town of roughly 8,040 people in Park County, perched at the
        mouth of Paradise Valley where the Yellowstone River spills out of the Absaroka Range toward
        the Great Plains. The North Entrance to Yellowstone National Park sits just 44 miles south
        via US-89{'\u2014'}making {townName} the historic "Gateway to Yellowstone" and a magnet for
        writers, artists, and remote professionals drawn to its literary legacy and mountain scenery.
        Despite its small population, {townName}'s cost of living punches well above its weight class,
        driven by second-home demand, vacation-rental pressure, and Bozeman spillover. This guide
        breaks down housing, income, affordability, and employment data so you know what it actually
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
        at {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at {fmtDollar(h?.medianHomeValue ?? null)},
        reflecting the multi-year survey window. For a town of 8,040 people, these are striking
        numbers{'\u2014'}driven by {townName}'s proximity to Yellowstone, Paradise Valley's trophy-ranch
        market, and steady spillover from Bozeman (25 miles west), where prices run even higher.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}The rent figure is exceptionally high for a small town, reflecting vacation-rental
        competition that pulls long-term units off the market. With a vacancy rate of just{' '}
        {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}, finding available rentals can be
        genuinely difficult, especially during peak tourist season when short-term demand surges.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is stretched significantly{'\u2014'}better
        than Whitefish (11.7) or Bozeman (8.8), but worse than Helena (6.6) or Great Falls (3.7).
        The disconnect between local wages and home prices reflects a market shaped by outside money:
        second-home buyers, remote workers with coastal salaries, and Paradise Valley ranch purchasers
        who skew the median upward.
      </p>
      <p>
        {townName}'s 17.3% Professional Services employment{'\u2014'}the second-largest sector{'\u2014'}is
        unusually high for a town this size and reflects the concentration of writers, artists,
        consultants, and remote workers who chose {townName} for its quality of life rather than
        local employment opportunities. These higher-earning professionals can absorb costs that
        strain service-industry workers earning tourism wages.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}'s elevation of 4,501 feet and location at the mouth of the Yellowstone Valley means
        cold, windy winters{'\u2014'}the city is famously one of the windiest in Montana, funneling air through
        the valley gap. Heating costs run higher than sheltered towns, and the wind is a genuine
        quality-of-life factor that newcomers should experience before committing.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1839, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1839) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 250, pct: h?.medianHouseholdIncome ? Math.round((250 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 520, pct: h?.medianHouseholdIncome ? Math.round((520 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s windy, exposed location at 4,501 ft elevation{'\u2014'}expect
        higher heating bills than sheltered Montana valleys.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 18}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The Professional Services figure of 17.3% is remarkable for a small town and reflects
        {townName}'s identity as a creative and intellectual community{'\u2014'}home to writers like Tom
        McGuane, the late Jim Harrison, and Tim Cahill, and to a broader population of consultants,
        designers, and remote workers who make their living independently.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}{'\u2014'}the highest of any
        hub city in our analysis, reflecting an entrepreneurial, self-employed culture.
        Tourism and hospitality (13.2%) provide a significant seasonal boost tied to Yellowstone
        visitation, Chico Hot Springs (21 miles south), and the town's own gallery scene and
        restaurants. Unlike pure resort towns, though, {townName}'s economy has enough professional
        and healthcare employment to avoid full seasonal dependence.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}'s most natural comparison is Bozeman, just 25 miles west on I-90. Bozeman's
        affordability ratio of 8.8 makes it pricier, and its median home value runs roughly $125K
        higher. Many buyers priced out of Bozeman look to {townName} as a more affordable
        alternative with comparable access to skiing (Bridger Bowl 19 mi, Big Sky 48 mi), fishing
        (Yellowstone River right in town), and Yellowstone National Park (actually closer from
        {townName} via Paradise Valley).
      </p>
      <p>
        What {townName} trades for lower prices is Bozeman's university-town infrastructure,
        restaurant density, and flight connections. What it gains is a quieter, more artistic
        character, direct Yellowstone River access through downtown, and a literary and creative
        community that gives it cultural weight far beyond what its 8,040-person population would
        suggest. Compared to Helena (affordability ratio 6.6) or Great Falls (3.7), {townName} is
        significantly more expensive{'\u2014'}a premium you pay for the Yellowstone gateway location,
        Paradise Valley views, and the town's singular character.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is expensive for a small town{'\u2014'}an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} reflects second-home demand, vacation rentals, and Bozeman spillover more than local wages.</li>
        <li>Rents are exceptionally high ({h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '\u2014'}, {h?.rentPercentile ? `${ordinal(h.rentPercentile)} percentile` : 'top 10%'}) due to vacation-rental competition and a {h?.vacancyRate ?? 3.2}% vacancy rate.</li>
        <li>Professional Services (17.3%) and 70.6% labor force participation reflect a creative, entrepreneurial community of writers, artists, and remote workers.</li>
        <li>Montana's zero state sales tax offsets daily costs, but {townName}'s windy, exposed location at 4,501 ft means higher heating bills than sheltered valleys.</li>
        <li>Cheaper than Bozeman (25 mi) with comparable recreation access, but still pricey{'\u2014'}newcomers should weigh the wind, the tiny market (55 listings), and the seasonal tourism intensity.</li>
      </ul>
    </article>
  );
}
