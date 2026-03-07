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
        {townName} is a tiny gateway community of roughly 1,202 people in Gallatin County, perched
        at 6,667 feet on the western boundary of Yellowstone National Park. The West Entrance to
        Yellowstone sits barely a mile from town{'\u2014'}making {townName} the most park-adjacent
        gateway community and the busiest entrance corridor during summer months. Despite its
        minuscule year-round population, the cost of living here is shaped almost entirely by
        tourism economics, vacation-home demand, and the extreme seasonality of a town that can
        swell to ten times its resident population on a July afternoon. This guide breaks down
        housing, income, affordability, and employment data so you know what it actually costs
        to live here. For a broader overview, see
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
        reflecting the multi-year survey window. For a town of 1,202 year-round residents, these
        numbers are staggering{'\u2014'}driven by {townName}'s position at Yellowstone's busiest
        entrance, the dominance of short-term vacation rentals, and the extreme scarcity of
        properties that actually come to market.
      </p>
      <p>
        Rental data tells an unusual story. Zillow's rent index returns no data for {townName}
        {'\u2014'}a reflection of the near-total absence of traditional long-term rentals in a market
        where property owners earn far more from nightly vacation bookings. The Census puts
        median rent at {fmtDollar(h?.medianRent ?? null)}, but this figure captures a mix of
        year-round and seasonal units.
        {h?.homeValuePercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns.` : ''}
        {' '}With a vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}{'\u2014'}nearly
        half of all housing units vacant or seasonal{'\u2014'}the market is structurally unlike any
        other Montana town. For a detailed look at market trends, inventory, and buying conditions,
        see our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is deeply unaffordable for local
        earners{'\u2014'}worse than Bozeman (8.8) and approaching Whitefish (11.7). The disconnect
        reflects a market where prices are set by vacation-property demand and outside investment,
        not by local wages in the tourism and hospitality industry.
      </p>
      <p>
        The income figure itself is modest, reflecting {townName}'s tourism-wage economy. Most
        employment is in hospitality, guiding, retail, and park-related services{'\u2014'}sectors
        that pay well below professional-services wages. Year-round residents who work seasonal
        jobs face an additional cost squeeze during the off-season when many businesses reduce
        hours or close entirely from November through April.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        However, {townName}'s extreme elevation of 6,667 feet and location on a high plateau surrounded
        by national forest means brutally cold winters{'\u2014'}January temperatures average 24/8°F,
        making it one of the coldest inhabited places in the lower 48. Heating costs are substantial,
        and the nearest full-service grocery shopping requires a drive to Bozeman (90 miles) or
        Idaho Falls (110 miles).
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
            { cat: 'Housing (rent or mortgage)', amt: h?.medianRent ?? 1200, pct: h?.medianHouseholdIncome ? Math.round(((h?.medianRent ?? 1200) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities & Heating', amt: 350, pct: h?.medianHouseholdIncome ? Math.round((350 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 580, pct: h?.medianHouseholdIncome ? Math.round((580 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 450, pct: h?.medianHouseholdIncome ? Math.round((450 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Utilities reflect {townName}'s extreme elevation (6,667 ft) and harsh winters{'\u2014'}expect
        significantly higher heating bills than lower-elevation Montana towns. Groceries run higher
        due to limited local retail and distance from regional distribution centers.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is overwhelmingly driven by {e?.mainIndustry ?? 'Tourism & Hospitality'}, which accounts
        for the dominant share of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The economy is defined by extreme seasonality{'\u2014'}summer brings millions of
        Yellowstone visitors through town, filling hotels, restaurants, gift shops, and guide
        services. Winter brings a second, smaller tourism peak centered on snowmobiling, cross-country
        skiing at the Rendezvous Ski Trails, and snowcoach tours into Yellowstone.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}{'\u2014'}remarkably low and
        reflective of the tiny labor pool rather than a diversified economy. Labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}, indicating that
        most residents of working age are employed, many holding multiple seasonal positions.
        The challenge for workers is not finding a job but finding year-round employment that
        pays enough to cover {townName}'s elevated cost of living.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}'s most natural comparison is Gardiner, Montana's other Yellowstone gateway
        community at the park's North Entrance. Both share the gateway-town economics of extreme
        seasonality, vacation-home dominance, and tourism-dependent wages. The key difference is
        scale{'\u2014'}{townName}'s West Entrance processes more summer visitors than any other
        Yellowstone entrance, creating a larger commercial infrastructure but also more intense
        seasonal pressure on housing and services.
      </p>
      <p>
        Compared to Big Sky (45 miles northwest), {townName} is more affordable but lacks the
        resort-town amenities and year-round ski economy. Compared to Bozeman (90 miles north,
        affordability ratio 8.8), {townName} is proportionally more expensive relative to local
        wages, despite lower absolute home prices, because Bozeman's diversified economy supports
        substantially higher incomes. The 46.2% vacancy rate{'\u2014'}nearly half of all housing
        units seasonal or vacant{'\u2014'}is the defining feature that sets {townName} apart from
        any comparison town and shapes every aspect of the local cost of living.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is extremely expensive relative to local wages{'\u2014'}an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} reflects vacation-property demand, not local earning power.</li>
        <li>The {h?.vacancyRate ?? 46.2}% vacancy rate means nearly half the housing stock is seasonal or vacant{'\u2014'}the highest of any town in our analysis and a structural barrier to finding year-round housing.</li>
        <li>Traditional long-term rentals are nearly nonexistent; the short-term vacation rental market absorbs most available units.</li>
        <li>Montana's zero state sales tax offsets daily costs, but {townName}'s 6,667-foot elevation and brutal winters (Jan avg 8°F low) mean heating bills are among the highest in the state.</li>
        <li>Grocery shopping requires planning{'\u2014'}full-service options are limited locally, and the nearest large stores are 90+ miles away in Bozeman or Idaho Falls.</li>
        <li>The 0.9% unemployment rate reflects a tiny labor pool, not economic diversity{'\u2014'}virtually all employment depends on Yellowstone visitation and seasonal tourism.</li>
      </ul>
    </article>
  );
}
