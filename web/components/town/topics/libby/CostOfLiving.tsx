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
        {townName} is a town of roughly 2,775 people and the county seat of Lincoln County,
        sitting at 2,096 feet in northwest Montana along US-2 — about 35 miles from the Idaho
        border, 90 miles from Kalispell, and 160 miles from Spokane. The Kootenai River runs
        through town, with the Cabinet Mountains rising to the east and Kootenai Falls 11 miles
        upstream. Lake Koocanusa, created by Libby Dam, stretches 90 miles north. {townName} is
        affordable for a recreation town, though income is low — the median household earns{' '}
        {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile` : ''} among
        Montana communities. This guide breaks down housing, income, affordability, and
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
        meaningfully in recent years. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 53% gap that reflects significant appreciation
        since the Census survey window closed. {townName}'s affordability ratio of{' '}
        {h?.affordabilityRatio ?? '—'} is higher than Choteau's 5.3, reflecting both stronger
        home price growth and lower local wages. Even so, {townName} remains cheaper than Kalispell
        or Whitefish — a recreation gateway rather than a resort town.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — above the midpoint.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — among the lowest in Montana, making ${townName} one of the cheapest rental markets in the state.` : ''}
        {' '}At $679 per month, rent in {townName} is roughly half what tenants pay in Bozeman or
        Missoula, and below Kalispell rates. The Kootenai River corridor and Cabinet Mountains
        draw recreation tourism, but the effect on the long-term rental pool is modest compared
        to Whitefish or Big Sky. The {h?.vacancyRate ?? 7}% vacancy rate indicates moderate
        availability. For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $39K figure reflects {townName}'s transition from timber and mining to a service-based
        economy — Education &amp; Healthcare leads at {e?.topIndustries?.[0]?.pct ?? 26.5}%, followed
        by Retail ({e?.topIndustries?.[1]?.pct ?? 13.6}%) and Construction ({e?.topIndustries?.[2]?.pct ?? 13.4}%).
        The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} above the comfortable
        range — higher than Choteau's 5.3 — reflecting the tension between recreation-driven
        home demand and modest local wages.
      </p>
      <p>
        For comparison, Kalispell (90 miles southeast) and Whitefish are pricier — resort-town
        dynamics have pushed home values well above local earning power. Troy, 20 miles west along
        US-2, offers similar affordability in the same Kootenai River corridor. {townName}'s 8.5
        ratio means housing is stretched relative to local wages, but Montana's lack of a state
        sales tax provides meaningful relief on everyday expenses like groceries, clothing, and
        household goods. The Kootenai River, Cabinet Mountains, and Lake Koocanusa add recreation
        value that pure agricultural towns can't match — without the resort-town price tag.
      </p>
      <p>
        As the Lincoln County seat, {townName} has a courthouse, Cabinet Peaks Medical Center, and
        county services that provide stable government employment and keep essential services local.
        The 90-mile drive to Kalispell connects residents to Glacier Park International Airport,
        retail, and medical specialists — but for most daily needs, {townName}'s own Main Street
        serves residents without requiring the commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 679, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 679) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 195, pct: h?.medianHouseholdIncome ? Math.round((195 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 430, pct: h?.medianHouseholdIncome ? Math.round((430 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 370, pct: h?.medianHouseholdIncome ? Math.round((370 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 290, pct: h?.medianHouseholdIncome ? Math.round((290 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s proximity to Kalispell (90 mi) and Spokane (160 mi) keeps retail costs
        reasonable, and the absence of a state sales tax reduces everyday expenses compared to
        most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy has transitioned from timber and mining to a service-based model.
        The leading employer sector is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 26.5}% of employment. Cabinet Peaks Medical Center and
        the Libby school district anchor this sector, providing stable, year-round employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Retail at {e?.topIndustries?.[1]?.pct ?? 13.6}% and Construction at {e?.topIndustries?.[2]?.pct ?? 13.4}%
        reflect the town's role as a regional hub and the ongoing demand for housing and
        infrastructure. The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)} — essentially
        zero — reflecting a tight labor market. Labor force participation stands at{' '}
        {fmtPct(e?.laborForceParticipation ?? null)}, a notably low figure that reflects
        {townName}'s retiree population and the rural character of the community.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is more affordable than Kalispell and Whitefish — Montana's priciest northwest
        markets — but the affordability ratio (8.5) is higher than Choteau (5.3), reflecting lower
        income and stronger home price growth. Compared to Kalispell (90 miles southeast),
        {townName} offers lower home prices and rents, though Kalispell's stronger income base
        yields a better ratio for dual-income households. Troy, 20 miles west along US-2, offers
        similar affordability in the same Kootenai River corridor — both towns share the Cabinet
        Mountains gateway and recreation draw without the resort-town premium.
      </p>
      <p>
        Where {townName} stands out is the combination of affordability with proximity to
        world-class recreation. The Kootenai River, Kootenai Falls, Cabinet Mountains Wilderness,
        Ross Creek Cedars, and Lake Koocanusa are all within easy reach. Turner Mountain Ski Area
        offers winter recreation without the resort-town price tag. {townName} isn't a resort town
        like Whitefish and doesn't pretend to be — it's a county seat with a courthouse, a hospital,
        and wilderness stretching in every direction. For buyers looking for northwest Montana
        recreation at a working price point, {townName} and Troy offer the clearest value play
        in the region.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'mid-range ranking'} among Montana towns and a 53% Census-to-Zillow appreciation gap showing significant price growth — though still cheaper than Kalispell or Whitefish.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 8.5} is higher than Choteau (5.3) and above the national comfort zone, reflecting low income ($39K, 10th percentile) and recreation-driven home demand — but far below resort towns like Big Sky (15+) and Whitefish (11+).</li>
        <li>Rent at $679/month is exceptionally low — {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lowest in Montana'} — making {townName} one of the most affordable rental markets in the state.</li>
        <li>The economy centers on Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 26.5}%), Retail ({e?.topIndustries?.[1]?.pct ?? 13.6}%), and Construction ({e?.topIndustries?.[2]?.pct ?? 13.4}%), with the town transitioning from timber/mining to a service economy.</li>
        <li>Montana's zero state sales tax and {townName}'s 7% vacancy rate mean housing is available and everyday costs stay manageable, while the Kootenai River, Cabinet Mountains, and Lake Koocanusa add recreation value that compares favorably to Kalispell and Whitefish at a fraction of the cost.</li>
      </ul>
    </article>
  );
}
