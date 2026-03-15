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
        {townName} is a town of roughly 4,873 people and the county seat of Dawson County,
        sitting at 2,064 feet in eastern Montana along I-94 — about 220 miles east of Billings,
        80 miles east of Miles City, and 35 miles from the North Dakota border. The Yellowstone
        River runs through town, and Makoshika State Park — Montana's largest state park at
        11,500 acres of badlands — sits at the city's edge. {townName} is an exceptionally
        affordable community, with the median household earning{' '}
        {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile` : ''} among
        Montana communities — strong incomes driven by transportation and energy sector employment.
        This guide breaks down housing, income, affordability, and
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
        Housing is the single largest expense in {townName} — and an unusually manageable one.
        The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — only a 3% gap that signals an exceptionally
        stable market with no speculative boom. {townName}'s affordability ratio of{' '}
        {h?.affordabilityRatio ?? '—'} is the lowest of all Montana hub communities, meaning
        homes cost less than three times the median household income — well below the commonly
        cited national comfort zone of 3.0 to 5.0.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — firmly in the lower quartile for home prices.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — in the lower third of Montana markets.` : ''}
        {' '}The {h?.vacancyRate ?? 13.3}% vacancy rate indicates abundant availability — with
        {fmt(h?.totalHousingUnits ?? null)} total housing units, {townName} has ample stock for
        a town of roughly 4,873 people. The Northern Pacific Railway — now BNSF — built the town
        and continues to shape its economy. For a detailed look at market trends, inventory, and
        buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $71K figure reflects {townName}'s role as a transportation and energy hub —
        {e?.mainIndustry ?? 'Education & Healthcare'} leads at {e?.topIndustries?.[0]?.pct ?? 23.4}%, followed
        by Transportation ({e?.topIndustries?.[1]?.pct ?? 16.9}%) and Retail ({e?.topIndustries?.[2]?.pct ?? 15.2}%).
        The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} places {townName} far below the
        comfort ceiling — making it the most affordable hub community tracked in Montana.
      </p>
      <p>
        BNSF railroad wages, oil and gas activity from the nearby Williston Basin, and healthcare
        employment at Glendive Medical Center push incomes above what the town's size would suggest.
        Compared to Miles City (80 miles west) and Billings (220 miles west), {townName} offers
        comparable incomes with significantly lower housing costs. Montana's lack of a state sales
        tax provides meaningful relief on everyday expenses like groceries, clothing, and household
        goods. The Yellowstone River, Makoshika State Park, and the surrounding badlands provide
        recreation at no cost, while the I-94 corridor connects residents to larger cities when needed.
      </p>
      <p>
        As the Dawson County seat, {townName} has a courthouse, Glendive Medical Center,
        and county services that provide stable government employment and keep essential services
        local. The 220-mile drive to Billings connects residents to a regional airport, retail,
        and medical specialists — but for most daily needs, {townName}'s own Merrill Avenue and
        downtown serve residents without requiring the commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 832, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 832) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 210, pct: h?.medianHouseholdIncome ? Math.round((210 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 450, pct: h?.medianHouseholdIncome ? Math.round((450 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s position on I-94 keeps retail costs reasonable, and the absence of a state
        sales tax reduces everyday expenses compared to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy is built on transportation, energy, and its role as an eastern
        Montana regional hub. The leading employer sector is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 23.4}% of employment. Glendive Medical Center and
        the Glendive school district anchor this sector, providing stable, year-round employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Transportation at {e?.topIndustries?.[1]?.pct ?? 16.9}% reflects {townName}'s heritage
        as a Northern Pacific Railway hub — BNSF remains a major employer and the railroad shapes
        both employment patterns and wage levels. Construction at {e?.topIndustries?.[3]?.pct ?? 9.5}%
        reflects periodic oil and gas activity from the Williston Basin. The unemployment rate
        is {fmtPct(e?.unemploymentRate ?? null)} — reflecting cyclical energy sector fluctuations.
        Labor force participation stands at{' '}
        {fmtPct(e?.laborForceParticipation ?? null)}, a figure that reflects {townName}'s
        retiree population and the rural character of the community.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is the most affordable hub community in Montana, with an affordability ratio
        of {h?.affordabilityRatio ?? 2.6} that sits well below every other tracked Montana town.
        Miles City (80 miles west) offers a similar eastern Montana character but at slightly
        higher housing costs. Billings (220 miles west) provides metro amenities but with
        correspondingly higher home values and rents. Sidney and Williston (to the north) have
        seen oil-boom volatility that {townName} has largely avoided — the Williston Basin
        influence is present but moderate.
      </p>
      <p>
        Where {townName} stands out is the combination of strong incomes and low housing costs.
        The $71K median household income — boosted by BNSF railroad wages and energy sector
        employment — paired with $183K home values creates an affordability equation that no other
        Montana hub can match. Makoshika State Park, the Yellowstone River, and the badlands
        landscape provide recreation and scenery without resort-town pricing. {townName} isn't
        a destination resort — it's a working railroad town and county seat where the cost of
        living reflects its eastern Montana roots. For buyers looking for Montana living at the
        lowest price point among hub communities, {townName} offers the clearest value
        proposition in the state.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 2.6} is the lowest of all Montana hub communities — homes cost less than three times the median household income, well below the 3.0–5.0 national comfort zone.</li>
        <li>The 3% Census-to-Zillow gap ({fmtDollar(h?.medianHomeValue ?? null)} vs. {fmtDollar(h?.zillowHomeValue ?? null)}) signals an exceptionally stable market with no speculative boom — the tightest gap of any Montana hub.</li>
        <li>Median income of {fmtDollar(h?.medianHouseholdIncome ?? null)} ({h?.incomePercentile != null ? `${ordinal(h.incomePercentile)} percentile` : 'above median'}) reflects strong wages from BNSF, energy, and healthcare — well above what the town's population would suggest.</li>
        <li>The economy centers on Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 23.4}%), Transportation ({e?.topIndustries?.[1]?.pct ?? 16.9}%), Retail ({e?.topIndustries?.[2]?.pct ?? 15.2}%), and Construction ({e?.topIndustries?.[3]?.pct ?? 9.5}%), with BNSF railroad and Williston Basin energy providing the wage backbone.</li>
        <li>Montana's zero state sales tax, a {h?.vacancyRate ?? 13.3}% vacancy rate with {fmt(h?.totalHousingUnits ?? null)} housing units, and Makoshika State Park — Montana's largest state park — make {townName} one of the most affordable and livable small towns in the state.</li>
      </ul>
    </article>
  );
}
