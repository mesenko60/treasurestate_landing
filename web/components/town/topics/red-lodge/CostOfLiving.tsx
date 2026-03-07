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
        {townName} is a former coal-mining town of roughly 2,700 people in Carbon County, tucked
        against the base of the Beartooth Mountains at 5,568 feet elevation. The Beartooth Highway
        {'\u2014'}one of America's most spectacular alpine drives{'\u2014'}begins just south of town and
        climbs to nearly 11,000 feet on its way to Yellowstone National Park's northeast entrance
        72 miles away. Red Lodge Mountain ski area sits 4 miles west, and the Absaroka-Beartooth
        Wilderness starts 15 miles south. This combination of ski-town appeal, Beartooth Highway
        gateway status, and proximity to Yellowstone has turned {townName} into a resort and
        second-home market where prices far outstrip local wages. This guide breaks down housing,
        income, affordability, and employment data so you know what it actually costs to live here.
        For a broader overview, see
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
        reflecting the multi-year survey window. For a town of 2,700 people, these are remarkable
        numbers{'\u2014'}driven by {townName}'s ski-resort proximity, Beartooth Highway tourism, and
        a second-home market fueled by buyers from Billings (60 miles northeast) and beyond.
      </p>
      <p>
        Zillow rent data is not available for {townName} due to its small market size.
        The Census ACS reports a median rent of {fmtDollar(h?.medianRent ?? null)}.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}The vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} is
        misleadingly high{'\u2014'}the vast majority of vacant units are seasonal or recreational
        properties, not available for year-round rental. Finding a genuine long-term rental in
        {townName} is difficult, particularly during ski season and the summer Beartooth Highway months.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is among the most stretched markets in
        Montana{'\u2014'}worse than Whitefish (11.7 with far higher incomes), Bozeman (8.8), or
        Livingston (7.8). The disconnect between local wages and home prices reflects a market
        shaped almost entirely by outside money: second-home buyers from Billings and beyond,
        vacation-rental investors, and seasonal residents who push the median home value to nearly
        half a million dollars while local workers earn under $44K.
      </p>
      <p>
        The income figure itself reflects {townName}'s tourism-dependent economy. Many jobs are
        seasonal{'\u2014'}ski-area operations, Beartooth Highway tourism, summer recreation outfitting{'\u2014'}and
        wages in hospitality and retail tend to cluster at the lower end of the spectrum. Year-round
        professional employment is limited to the healthcare system, Carbon County government, and
        the school district, which provide stable but modest incomes.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}'s elevation of 5,568 feet means cold, snowy winters with heating costs running higher
        than lower-elevation Montana towns. Groceries and goods carry a modest rural premium given the
        60-mile distance to Billings, the nearest full-service city.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.medianRent ?? 1100, pct: h?.medianHouseholdIncome ? Math.round(((h?.medianRent ?? 1100) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 280, pct: h?.medianHouseholdIncome ? Math.round((280 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 530, pct: h?.medianHouseholdIncome ? Math.round((530 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 420, pct: h?.medianHouseholdIncome ? Math.round((420 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s mountain location at 5,568 ft elevation{'\u2014'}expect
        higher heating bills from October through April. Groceries carry a modest rural
        premium given the 60-mile distance to Billings.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 20}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Tourism and hospitality provide a significant seasonal boost tied to Red Lodge Mountain
        ski area (December{'\u2013'}April), Beartooth Highway traffic (late May{'\u2013'}mid-October), and
        the town's role as a gateway to Yellowstone via the northeast entrance.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        The seasonal nature of {townName}'s economy means unemployment fluctuates throughout the year,
        with tighter conditions during ski season and summer and softer periods in the shoulder months
        of April{'\u2013'}May and October{'\u2013'}November. Unlike larger Montana towns with diversified
        employment bases, {townName}'s small workforce is heavily dependent on tourism dollars.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}'s most natural comparison is Billings, the nearest city at 60 miles northeast.
        Billings' affordability ratio of roughly 4.5 makes it dramatically more affordable, with
        a diversified economy offering healthcare, energy, agriculture, and professional-services
        jobs at wages that align with its housing costs. Many {townName} residents commute to
        Billings for medical appointments, major shopping, and air travel (Billings Logan International
        Airport), underscoring how dependent the town remains on its larger neighbor for services
        that a community of 2,700 cannot sustain independently.
      </p>
      <p>
        Among Montana resort and gateway communities, {townName}'s affordability ratio of{' '}
        {h?.affordabilityRatio ?? 11.2} places it in the most expensive tier alongside Whitefish
        and Big Sky. What distinguishes {townName} is the severity of the income-to-home-value gap:
        the median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)} is among the
        lowest of any resort-adjacent town we track, while home values approach half a million
        dollars. This is a market where the people who work in town largely cannot afford to buy in
        town{'\u2014'}a dynamic familiar across Western ski communities but particularly acute in
        {townName} given its small size and limited employment alternatives.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is extremely expensive relative to income{'\u2014'}an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} reflects second-home demand, ski-resort proximity, and Beartooth Highway tourism more than local wages.</li>
        <li>The {h?.vacancyRate ?? 27.3}% vacancy rate is misleading{'\u2014'}most vacant units are seasonal or recreational properties, not available for year-round tenants.</li>
        <li>Median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)} is among the lowest of any resort-adjacent town in Montana, creating a severe housing affordability gap.</li>
        <li>Montana's zero state sales tax offsets daily costs, but {townName}'s 5,568-ft elevation means higher heating bills and a 60-mile drive to Billings for major shopping and services.</li>
        <li>The economy is heavily seasonal{'\u2014'}ski season and Beartooth Highway summer tourism drive employment, with shoulder-season softness in April{'\u2013'}May and October{'\u2013'}November.</li>
      </ul>
    </article>
  );
}
