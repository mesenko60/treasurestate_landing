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
        {townName} is a community of roughly 3,818 people and the county seat of Big Horn County,
        sitting at 2,900 feet along I-90 — just 46 miles east of Billings (about 45 minutes). Founded
        in 1907 and named after cattleman Samuel Hardin, the town sits on the edge of the Crow Indian
        Reservation and serves as the gateway to Little Bighorn Battlefield National Monument, which
        draws more than 300,000 visitors annually just 14 miles to the south. {townName} is an
        affordable community, with the median household earning{' '}
        {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile` : ''} among
        Montana communities — incomes anchored by healthcare, education, and tourism employment.
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
        Housing is the single largest expense in {townName} — and a notably manageable one.
        The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — the gap reflects recent appreciation as Billings-area
        demand pushes buyers toward nearby communities with lower entry points. {townName}'s
        affordability ratio of{' '}
        {h?.affordabilityRatio ?? '—'} sits comfortably below the commonly cited national comfort
        zone of 3.0 to 5.0, meaning homes cost about three-and-a-half times the median household income.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — firmly in the lower third for home prices.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — among the lowest in Montana.` : ''}
        {' '}The {h?.vacancyRate ?? 8.7}% vacancy rate provides reasonable availability — with
        {' '}{fmt(h?.totalHousingUnits ?? null)} total housing units serving a community of roughly
        3,818 people. The town's proximity to Billings — a 45-minute drive on I-90 — gives residents
        access to metro amenities while maintaining small-town housing costs. For a detailed look at
        market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That figure reflects {townName}'s role as a healthcare and government hub —
        {e?.mainIndustry ?? 'Education & Healthcare'} leads at {e?.topIndustries?.[0]?.pct ?? 34.8}%, followed
        by Tourism &amp; Hospitality ({e?.topIndustries?.[1]?.pct ?? 16.7}%) and Transportation ({e?.topIndustries?.[2]?.pct ?? 9.8}%).
        The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} places {townName} well within the
        comfort zone — making it one of the more affordable communities in Montana.
      </p>
      <p>
        Big Horn County Memorial Hospital — a 25-bed critical access facility — and Hardin Public
        Schools provide the largest share of stable, year-round employment. County government adds
        another layer of public-sector jobs. The tourism economy, driven by more than 300,000 annual
        visitors to Little Bighorn Battlefield National Monument, supports hospitality, retail, and
        service-sector employment that peaks in summer months. The Crow Indian Reservation, which
        borders the town, contributes additional employment through tribal government, cultural
        programs, and Crow Agency operations.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses like
        groceries, clothing, and household goods. The 46-mile drive to Billings on I-90 connects
        residents to Costco, big-box retail, Billings Clinic (a Level 1 trauma center), and
        Billings Logan International Airport — but for most daily needs, {townName}'s own
        businesses and services keep residents from needing the commute. As the Big Horn County seat,
        {townName} has a courthouse, hospital, and county services that provide stable government
        employment and keep essential services local.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 726, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 726) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 220, pct: h?.medianHouseholdIncome ? Math.round((220 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 450, pct: h?.medianHouseholdIncome ? Math.round((450 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 380, pct: h?.medianHouseholdIncome ? Math.round((380 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        {townName}'s position on I-90 — just 46 miles from Billings — keeps retail costs
        reasonable, and the absence of a state sales tax reduces everyday expenses compared
        to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy is built on healthcare, education, government, and tourism — a
        combination shaped by its role as the Big Horn County seat and gateway to Little Bighorn
        Battlefield. The leading employer sector is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 34.8}% of employment. Big Horn County Memorial Hospital
        and Hardin Public Schools anchor this sector, providing stable, year-round employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Tourism &amp; Hospitality at {e?.topIndustries?.[1]?.pct ?? 16.7}% reflects {townName}'s
        position as the service hub for Little Bighorn Battlefield visitors — the monument draws
        more than 300,000 visitors annually, and most pass through {townName} for lodging, dining,
        and fuel. The annual Crow Fair, held at Crow Agency just south of town, adds a significant
        seasonal tourism boost. The unemployment rate
        is {fmtPct(e?.unemploymentRate ?? null)} — reflecting the seasonal nature of tourism employment
        and reservation economic conditions.
        Labor force participation stands at{' '}
        {fmtPct(e?.laborForceParticipation ?? null)}, a figure that reflects {townName}'s
        mix of retirees, seasonal workers, and the broader Big Horn County labor market.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is one of the more affordable communities along the I-90 corridor in southern
        Montana, with an affordability ratio of {h?.affordabilityRatio ?? 3.4} that falls comfortably
        within the national 3.0–5.0 comfort zone. Billings (46 miles west) provides metro amenities
        but with significantly higher home values and rents. Sheridan, Wyoming (100 miles southeast)
        offers a similar small-town character but at a higher price point. Crow Agency (14 miles south)
        is the tribal capital of the Crow Nation and closely connected to {townName}'s economy
        and community.
      </p>
      <p>
        Where {townName} stands out is the combination of low housing costs and proximity to
        Billings. A 45-minute commute on I-90 puts residents within reach of Billings' healthcare
        network, retail, airport, and employment market — while {townName}'s housing costs remain
        a fraction of Billings' prices. The 300,000+ annual visitors to Little Bighorn Battlefield
        provide a tourism revenue stream that supports local businesses without driving up housing
        costs the way destination resort towns experience. Montana's zero state sales tax, access to
        the Bighorn River (a world-class trout fishery), and the cultural richness of the Crow
        Reservation make {townName} a distinctive and affordable place to live. For buyers
        seeking an affordable entry point within commuting distance of Billings, {townName}
        offers a compelling value proposition.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 3.4} falls comfortably within the 3.0–5.0 national comfort zone — homes cost about three-and-a-half times the median household income, keeping homeownership within reach.</li>
        <li>Median rent of {fmtDollar(h?.medianRent ?? null)} ({h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile` : 'among the lowest'}) makes {townName} one of the most affordable rental markets in Montana.</li>
        <li>Median income of {fmtDollar(h?.medianHouseholdIncome ?? null)} ({h?.incomePercentile != null ? `${ordinal(h.incomePercentile)} percentile` : 'mid-range'}) is anchored by healthcare (Big Horn County Memorial Hospital), education (Hardin Public Schools), and county government employment.</li>
        <li>The economy centers on Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 34.8}%), Tourism &amp; Hospitality ({e?.topIndustries?.[1]?.pct ?? 16.7}%), and Transportation ({e?.topIndustries?.[2]?.pct ?? 9.8}%), with 300,000+ annual visitors to Little Bighorn Battlefield driving seasonal tourism revenue.</li>
        <li>Montana's zero state sales tax, a {h?.vacancyRate ?? 8.7}% vacancy rate with {fmt(h?.totalHousingUnits ?? null)} housing units, and a 45-minute drive to Billings on I-90 make {townName} one of the most affordable and strategically located small towns in the state.</li>
      </ul>
    </article>
  );
}
