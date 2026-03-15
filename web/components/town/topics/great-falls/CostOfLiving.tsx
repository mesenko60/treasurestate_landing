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
        {townName} is Montana's third-largest city, known as "The Electric City" for the hydroelectric
        dams harnessing the Missouri River's five great falls. With a population of roughly 60,000 in
        Cascade County, it anchors central Montana's economy through a combination of military
        presence{'\u2014'}Malmstrom Air Force Base and the 341st Missile Wing{'\u2014'}and civilian
        healthcare employment led by Benefis Health System. Its cost of living reflects a prairie city
        where defense spending and medical-sector stability keep prices grounded well below Montana's
        resort and university towns. This guide breaks down housing, income, affordability, and
        employment data so you know what it actually costs to live here.
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
        Housing is the single largest expense for {townName} residents, but it's remarkably affordable
        by Montana standards. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window. Either way,
        {' '}{townName} is the most affordable of any major Montana city{'\u2014'}cheaper than Billings,
        Helena, Missoula, Bozeman, and the Flathead Valley by a significant margin.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}Unlike Whitefish or Big Sky, {townName} has virtually no short-term rental pressure from
        tourism{'\u2014'}the rental market is driven by military personnel rotating through Malmstrom AFB,
        healthcare workers at Benefis Health System, and families drawn to the city's affordable cost
        structure.
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
        Montana{'\u2014'}better than Billings (5.4), Helena (6.6), Missoula (7.9), Kalispell (8.5),
        and dramatically below Bozeman (8.8) and Whitefish (11.7). A median-income household here
        can realistically afford a median-priced home without severe financial strain.
      </p>
      <p>
        Malmstrom Air Force Base is the city's economic anchor, supporting thousands of military
        and civilian positions with federal pay scales and benefits packages. Benefis Health System,
        the largest civilian employer, adds another layer of stable, well-compensated employment.
        Together, defense and healthcare provide a dual-pillar economy that insulates {townName} from
        the seasonal swings that plague Montana's tourism-dependent towns.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}'s elevation of 3,340 feet and its position on the northern Great Plains bring cold
        winters, but Chinook winds{'\u2014'}warm, dry downslope gusts from the Rockies{'\u2014'}can raise
        temperatures 30{'\u2013'}50\u00B0F in hours, providing dramatic mid-winter relief. The city is one
        of the windiest in the United States, which keeps summer cooling costs low but means higher
        heating bills during extended cold snaps.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1352, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1352) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 240, pct: h?.medianHouseholdIncome ? Math.round((240 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 480, pct: h?.medianHouseholdIncome ? Math.round((480 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 370, pct: h?.medianHouseholdIncome ? Math.round((370 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Utilities reflect {townName}'s prairie climate with cold winters and persistent wind; Chinook events can temporarily reduce heating demand.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 28.1}% of employment. Benefis Health System is the largest
        civilian employer, while Malmstrom Air Force Base{'\u2014'}home to the 341st Missile Wing and its
        fleet of Minuteman III ICBMs{'\u2014'}provides a substantial federal payroll that circulates
        through the local economy.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The military presence creates a unique dynamic: regular personnel rotations bring a steady
        flow of new residents, but also mean some families are temporary{'\u2014'}contributing to the
        city's 8.2% vacancy rate, the highest among Montana's hub cities.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Unlike seasonal resort towns, {townName}'s employment base is remarkably steady year-round.
        Military operations don't shut down for winter, hospitals run 24/7, and the city's retail and
        service sectors serve the broader central Montana region rather than depending on tourist traffic.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Montana's major cities, {townName} stands out as the single most affordable option. Its
        affordability ratio of {h?.affordabilityRatio ?? '\u2014'} beats every other hub in the
        state{'\u2014'}Billings (5.4), Helena (6.6), Missoula (7.9), Kalispell (8.5), Bozeman (8.8),
        and Whitefish (11.7). For buyers who have been priced out of western Montana's overheated
        markets, {townName} offers the rare combination of a city with 60,000 people, genuine
        infrastructure, and homes that a median-income household can actually afford.
      </p>
      <p>
        What {townName} trades off is proximity to the mountain recreation corridors that drive demand
        in the Flathead and Gallatin valleys. What it gains is value: a military-and-healthcare economy
        with federal-grade benefits, the Missouri River running through town, Giant Springs State
        Park just four miles away, the C.M. Russell Museum's world-class western art collection,
        and Lewis & Clark history woven into the landscape. The inventory surge of +31.5%
        year-over-year{'\u2014'}the largest of any Montana city{'\u2014'}means buyers have more selection
        and more negotiating power here than anywhere else in the state right now.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, but {townName} is the most affordable major city in Montana with an affordability ratio of {h?.affordabilityRatio ?? '\u2014'}{'\u2014'}lower than any other hub.</li>
        <li>Malmstrom AFB and Benefis Health System provide dual economic anchors with year-round, benefits-backed employment that insulates the city from seasonal swings.</li>
        <li>Montana's zero state sales tax offsets daily expenses, and {townName}'s Chinook winds can bring dramatic mid-winter warming to reduce heating costs.</li>
        <li>No resort-town or university-town price inflation{'\u2014'}{townName}'s housing market is driven by military, healthcare, and regional service-center demand rather than tourism or short-term rentals.</li>
        <li>Inventory is up 31.5% year-over-year{'\u2014'}the biggest increase of any Montana city{'\u2014'}creating the strongest buyer's market in the state.</li>
      </ul>
    </article>
  );
}
