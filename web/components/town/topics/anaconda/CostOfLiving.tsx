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
        {townName} is a consolidated city-county of roughly 9,421 people in Deer Lodge County,
        sitting at 5,335 feet in the upper Clark Fork Valley about 26 miles west of Butte. Founded
        in 1883 by Copper King Marcus Daly as the smelting hub for his Anaconda Copper Mining
        Company, the town's identity was forged by copper — and reshaped when the Washoe Smelter
        shut down in 1980. Today {townName} is one of southwest Montana's most affordable towns,
        offering genuine small-city living at a fraction of what resort communities like Big Sky or
        Whitefish charge. The Jack Nicklaus-designed Old Works Golf Course, Georgetown Lake, and
        the Anaconda-Pintler Wilderness draw visitors and new residents alike, but prices remain
        grounded by local wages. This guide breaks down housing, income, affordability, and
        employment data so you know what it actually costs to live here.
        For a broader overview of the town, see our{' '}
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
        Housing is the single largest expense in {townName} and a category that has moved
        significantly in recent years. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 34% gap that reflects meaningful appreciation
        since the Census survey window closed, though far less dramatic than the surges seen in
        resort-adjacent communities. The median list price of $318K sits above the Zillow estimate,
        indicating sellers are pricing optimistically in a market with tightening inventory.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — squarely in the middle of the pack.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — extremely low by Montana standards, making ${townName} one of the most affordable rental markets in the state.` : ''}
        {' '}At $661 per month, rent in {townName} is roughly half what tenants pay in Bozeman or
        Missoula, and less than a third of Big Sky rates. The Georgetown Lake corridor and
        seasonal recreation draw some short-term rental activity, but the effect on the long-term
        rental pool is modest compared to Glacier or Yellowstone gateway towns.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $50K figure reflects {townName}'s post-industrial economy — an Education &amp;
        Healthcare workforce (25.8% of jobs) paired with tourism, construction, and government
        employment that together provide steady but modest wages. The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} above the comfortable
        range but well below the severe stress seen in Montana's resort towns.
      </p>
      <p>
        For comparison, nearby Butte has a ratio of 4.4, reflecting that larger city's broader
        economic base and higher incomes. Meanwhile, Big Sky exceeds 15.0 and Whitefish sits
        above 11.0 — communities where home prices have detached entirely from local earning
        power. {townName}'s 5.7 ratio means housing is stretched relative to local wages but
        still within reach for dual-income households, especially with Montana's lack of a state
        sales tax providing meaningful relief on everyday expenses like groceries, clothing, and
        household goods.
      </p>
      <p>
        {townName}'s elevation (5,335 ft) means cold winters with real heating costs, and the
        26-mile drive to Butte connects residents to the larger city's retail, medical, and
        transportation infrastructure — including the Bert Mooney Airport. For most daily needs,
        however, {townName}'s own commercial district along East Commercial Avenue serves
        residents without requiring the commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 661, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 661) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 210, pct: h?.medianHouseholdIncome ? Math.round((210 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 450, pct: h?.medianHouseholdIncome ? Math.round((450 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 350, pct: h?.medianHouseholdIncome ? Math.round((350 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 310, pct: h?.medianHouseholdIncome ? Math.round((310 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s proximity to Butte (26 mi) keeps retail costs reasonable, and the absence
        of a state sales tax reduces everyday expenses compared to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy underwent a fundamental transformation when the Anaconda Smelter —
        once employing thousands — closed in 1980, followed by decades of Superfund cleanup. The
        economy has since rebuilt around {e?.mainIndustry ?? 'Education & Healthcare'}, which
        accounts for {e?.topIndustries?.[0]?.pct ?? 25.8}% of employment. Community Hospital of
        Anaconda and the local school district anchor this sector, providing the kind of stable,
        year-round employment that helps offset the seasonal swings from tourism.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Tourism &amp; Hospitality at {e?.topIndustries?.[1]?.pct ?? 11.3}% of employment reflects
        the draw of Georgetown Lake, the Anaconda-Pintler Wilderness, Discovery Ski Area, and
        the Old Works Golf Course. Construction at {e?.topIndustries?.[2]?.pct ?? 10.7}% captures
        both local building activity and tradespeople who work projects across southwest Montana.
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)} — the latter somewhat
        low, reflecting {townName}'s retiree population and the lingering effects of the
        post-smelter economic transition.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is one of the most affordable communities in southwest Montana. Its median
        home value ({fmtDollar(h?.zillowHomeValue ?? null)}) is roughly half of Bozeman ($703K)
        and Missoula ($547K), and a fraction of Big Sky's $1M+ prices. Even compared to nearby
        Butte — the nearest city with a comparable population base — {townName} offers lower home
        prices, though Butte's stronger income levels yield a better affordability ratio (4.4 vs.
        {townName}'s {h?.affordabilityRatio ?? '5.7'}).
      </p>
      <p>
        Where {townName} stands out is the combination of genuine affordability with outdoor
        recreation access that most Montana budget towns can't match. Georgetown Lake, the
        Pintler Wilderness, and Discovery Ski Area are all within 20 minutes, and the Old Works
        Golf Course is built on reclaimed smelter land — a unique amenity found nowhere else. Great
        Falls and Miles City may offer cheaper housing, but they lack the mountain-recreation
        lifestyle that {townName} provides. For buyers looking at southwest Montana, {townName}
        remains the clear value play — a working-class town with Superfund scars that's quietly
        becoming a recreation-adjacent alternative to the region's overheated resort markets.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'mid-range ranking'} among Montana towns and a 34% Census-to-Zillow appreciation gap showing steady but measured price growth.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 5.7} is above the national comfort zone but far below resort towns like Big Sky (15+) and Whitefish (11+), keeping {townName} accessible to working households.</li>
        <li>Rent at $661/month is exceptionally low — {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lowest in Montana'} — making {townName} one of the most affordable rental markets in the state.</li>
        <li>The economy transitioned from copper smelting to Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 25.8}%), Tourism ({e?.topIndustries?.[1]?.pct ?? 11.3}%), and Construction ({e?.topIndustries?.[2]?.pct ?? 10.7}%), providing a diversified if modest employment base.</li>
        <li>Montana's zero state sales tax and {townName}'s proximity to Butte keep everyday costs manageable, while Georgetown Lake and the Pintler Wilderness add recreation value that pure budget towns lack.</li>
      </ul>
    </article>
  );
}
