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
        {townName} is a town of roughly 6,204 people and the county seat of Fergus County,
        sitting at 4,121 feet in the exact geographic center of Montana along US-87 and US-191 —
        about 125 miles from both Great Falls and Billings. Big Spring Creek flows through town,
        with the Big Snowy Mountains and Judith Mountains rising to the south and east. The
        Charlie Russell Chew Choo dinner train travels through historic countryside. {townName} is
        an affordable regional hub, though income is low — the median household earns{' '}
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
        {fmtDollar(h?.medianHomeValue ?? null)} — a 70% gap that reflects significant appreciation
        since the Census survey window closed. {townName}'s affordability ratio of{' '}
        {h?.affordabilityRatio ?? '—'} reflects both home price growth and modest local wages.
        Compared to Billings and Great Falls, {townName} remains more affordable — a regional
        hub rather than a metro center.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — near the midpoint.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — among the lower half of Montana markets.` : ''}
        {' '}The {h?.vacancyRate ?? 7.4}% vacancy rate indicates moderate availability. With {fmt(h?.totalHousingUnits ?? null)} total
        housing units, {townName} offers options for both renters and buyers. Agriculture is the
        backbone of Fergus County, and the town serves as the regional hub for central Montana.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $44K figure reflects {townName}'s role as a regional hub for healthcare, retail, and
        government services — Education &amp; Healthcare leads at {e?.topIndustries?.[0]?.pct ?? 29.6}%, followed
        by Retail ({e?.topIndustries?.[1]?.pct ?? 14.9}%) and Transportation ({e?.topIndustries?.[2]?.pct ?? 9.3}%).
        The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} above the comfortable
        range — reflecting the tension between regional hub demand and modest local wages.
      </p>
      <p>
        For comparison, Billings (125 miles southeast) and Great Falls (125 miles northwest) are
        pricier — metro dynamics have pushed home values higher. {townName}'s central location
        at the geographic center of Montana makes it a natural hub for the surrounding agricultural
        region. Agriculture remains the backbone of Fergus County, and the town provides essential
        services to a large rural area. Montana's lack of a state sales tax provides meaningful
        relief on everyday expenses like groceries, clothing, and household goods. Big Spring
        Creek, the Charlie Russell Chew Choo, and the Big Snowy and Judith Mountains add
        recreation value without the resort-town price tag.
      </p>
      <p>
        As the Fergus County seat, {townName} has a courthouse, Central Montana Medical Center,
        and county services that provide stable government employment and keep essential services
        local. The 125-mile drive to either Great Falls or Billings connects residents to
        regional airports, retail, and medical specialists — but for most daily needs, {townName}'s
        own Main Street serves residents without requiring the commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 896, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 896) / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s proximity to Great Falls and Billings (125 mi each) keeps retail costs
        reasonable, and the absence of a state sales tax reduces everyday expenses compared to
        most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy centers on its role as a regional hub for central Montana.
        The leading employer sector is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 29.6}% of employment. Central Montana Medical Center and
        the Lewistown school district anchor this sector, providing stable, year-round employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Retail at {e?.topIndustries?.[1]?.pct ?? 14.9}% and Transportation at {e?.topIndustries?.[2]?.pct ?? 9.3}%
        reflect the town's role as a regional hub and the agricultural backbone of Fergus County.
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)} — higher than most Montana
        hubs — reflecting a smaller labor market. Labor force participation stands at{' '}
        {fmtPct(e?.laborForceParticipation ?? null)}, a figure that reflects {townName}'s
        retiree population and the rural character of the community.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is more affordable than Billings and Great Falls — Montana's larger regional
        hubs — with a lower affordability ratio reflecting its smaller metro footprint. As the
        geographic center of Montana, {townName} serves a vast rural area and provides essential
        services without the price pressures of larger cities. Compared to Billings (125 miles
        southeast) and Great Falls (125 miles northwest), {townName} offers lower home prices and
        rents, making it an attractive option for those seeking central Montana living at a
        working price point.
      </p>
      <p>
        Where {townName} stands out is the combination of affordability with its unique position.
        Big Spring Creek, the Charlie Russell Chew Choo, the Big Snowy Mountains, and Judith
        Mountains are all within easy reach. The distinctive Croatian stone architecture and
        historic downtown preserve frontier character. {townName} isn't a resort town and
        doesn't pretend to be — it's a county seat with a courthouse, a hospital, and agriculture
        stretching in every direction. For buyers looking for central Montana living at a
        working price point, {townName} offers one of the clearest value propositions in the
        region.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'mid-range ranking'} among Montana towns and a 70% Census-to-Zillow appreciation gap showing significant price growth — though still more affordable than Billings or Great Falls.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 6.1} is above the national comfort zone, reflecting modest income ($44K, 16th percentile) and regional hub demand — but far below resort towns like Big Sky and Whitefish.</li>
        <li>Rent at $896/month is {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lower half of Montana markets'} — making {townName} an affordable rental option in central Montana.</li>
        <li>The economy centers on Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 29.6}%), Retail ({e?.topIndustries?.[1]?.pct ?? 14.9}%), and Transportation ({e?.topIndustries?.[2]?.pct ?? 9.3}%), with agriculture as the backbone of Fergus County.</li>
        <li>Montana's zero state sales tax and {townName}'s {h?.vacancyRate ?? 7.4}% vacancy rate mean housing is available and everyday costs stay manageable, while Big Spring Creek, the Charlie Russell Chew Choo, and the Big Snowy and Judith Mountains add recreation value at a fraction of the cost of Montana's resort markets.</li>
      </ul>
    </article>
  );
}
