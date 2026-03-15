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
        {townName} is a small town of roughly 3,033 people in Powell County, sitting at 4,521 feet
        on the Clark Fork River about 37 miles northwest of Butte along I-90. Founded in the 1860s
        as a frontier cattle town, Deer Lodge became home to Montana's first territorial prison and
        the Grant-Kohrs Ranch — a National Historic Site that preserves one of the best-known
        19th-century cattle operations in the West. Today {townName} is one of the most affordable
        communities along Montana's I-90 corridor, offering genuine small-town living at prices
        well below what cities like Missoula, Butte, or resort communities charge. Government
        employment — the state prison, National Park Service, and county offices — anchors the
        local economy, while proximity to Georgetown Lake and the Anaconda-Pintler Wilderness
        draws outdoor enthusiasts. This guide breaks down housing, income, affordability, and
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
        {fmtDollar(h?.medianHomeValue ?? null)} — a 41% gap that reflects substantial appreciation
        since the Census survey window closed. Even at the Zillow estimate, {townName} remains
        well under $300K — one of the most affordable entry points along the I-90 corridor
        between Missoula and Butte.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — squarely in the middle of the pack.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — very affordable by Montana standards, making ${townName} one of the cheapest rental markets in the state.` : ''}
        {' '}At $781 per month, rent in {townName} is well below what tenants pay in Bozeman or
        Missoula, and a fraction of Big Sky rates. The rental pool is modest in size — this is a
        town of 3,033 — but the stable government employment base keeps demand consistent and
        turnover predictable.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $54K figure reflects {townName}'s government-anchored economy — prison and NPS
        employment paired with Education &amp; Healthcare (27.9% of jobs) and Tourism &amp;
        Hospitality (20.4%) that together provide steady but modest wages. The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} right at the upper edge
        of the comfortable range — a genuinely affordable market by Montana standards.
      </p>
      <p>
        For comparison, nearby Anaconda (23 miles) has a ratio of 5.7, and Butte (37 miles) sits
        at 4.4 — reflecting Butte's larger city economy and higher incomes. Meanwhile, Big Sky
        exceeds 15.0 and Whitefish sits above 11.0 — communities where home prices have detached
        entirely from local earning power. {townName}'s 5.2 ratio means housing is manageable for
        working households, especially with Montana's lack of a state sales tax providing
        meaningful relief on everyday expenses like groceries, clothing, and household goods.
      </p>
      <p>
        {townName}'s position on I-90 means residents can access Butte's retail, medical, and
        transportation infrastructure — including the Bert Mooney Airport — with a 37-mile drive,
        while Anaconda is just 23 miles away. For most daily needs, however, {townName}'s own
        Main Street commercial district and the small-town services along Milwaukee Avenue handle
        the basics without requiring a commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 781, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 781) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 200, pct: h?.medianHouseholdIncome ? Math.round((200 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 430, pct: h?.medianHouseholdIncome ? Math.round((430 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 340, pct: h?.medianHouseholdIncome ? Math.round((340 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 300, pct: h?.medianHouseholdIncome ? Math.round((300 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s I-90 access to Butte (37 mi) and Anaconda (23 mi) keeps retail costs
        reasonable, and the absence of a state sales tax reduces everyday expenses compared
        to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy is anchored by government employment — the Montana State Prison,
        the Grant-Kohrs Ranch National Historic Site, and Powell County offices provide a stable
        base of year-round jobs that insulates the town from the seasonal swings that affect
        pure tourism economies. The largest employment sector is{' '}
        {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts for{' '}
        {e?.topIndustries?.[0]?.pct ?? 27.9}% of jobs.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Government employment at {e?.topIndustries?.[1]?.pct ?? 20.8}% reflects the prison and
        NPS presence — a distinctive feature that sets {townName} apart from other Montana small
        towns. Tourism &amp; Hospitality at {e?.topIndustries?.[2]?.pct ?? 20.4}% captures
        visitors to the Old Montana Prison Museum Complex, Grant-Kohrs Ranch, and travelers
        passing through on I-90. The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)} —
        very low even by Montana standards — and labor force participation stands at{' '}
        {fmtPct(e?.laborForceParticipation ?? null)}, somewhat low due to {townName}'s retiree
        population and the small-town employment structure.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is one of the most affordable communities along Montana's I-90 corridor. Its
        median home value ({fmtDollar(h?.zillowHomeValue ?? null)}) is well below Missoula ($547K),
        Bozeman ($703K), and a fraction of Big Sky's $1M+ prices. Even compared to nearby
        Anaconda (23 miles, $280K) and Butte (37 miles), {townName} holds a price advantage.
        The affordability ratio of {h?.affordabilityRatio ?? '5.2'} is better than Anaconda's
        5.7 and dramatically below resort markets.
      </p>
      <p>
        Where {townName} stands out is the combination of genuine affordability with a
        government-stabilized economy and proximity to serious outdoor recreation. Georgetown
        Lake is 13 miles southwest, the Anaconda-Pintler Wilderness is 3 miles south, and the
        Clark Fork River runs through town. NBA legend Phil Jackson was born here — it's the kind of quiet,
        working Montana town that hasn't been discovered by the remote-work migration the way
        Flathead Valley or Gallatin Valley towns have. For buyers looking at southwest Montana,
        {townName} offers a rare combination: sub-$300K homes, stable government employment,
        and genuine mountain-recreation access in a town that still feels like the Montana
        most people imagine.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'mid-range ranking'} among Montana towns and a 41% Census-to-Zillow appreciation gap showing strong but measured price growth.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 5.2} is at the upper edge of the national comfort zone and well below resort towns like Big Sky (15+) and Whitefish (11+), keeping {townName} accessible to working households.</li>
        <li>Rent at $781/month is very affordable — {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lowest in Montana'} — making {townName} one of the cheapest rental markets in the state.</li>
        <li>The economy is anchored by government employment (prison, NPS at {e?.topIndustries?.[1]?.pct ?? 20.8}%), Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 27.9}%), and Tourism ({e?.topIndustries?.[2]?.pct ?? 20.4}%), providing a diversified and stable employment base.</li>
        <li>Montana's zero state sales tax and {townName}'s I-90 access to Butte and Anaconda keep everyday costs manageable, while Georgetown Lake and the Pintler Wilderness add recreation value that pure budget towns lack.</li>
      </ul>
    </article>
  );
}
