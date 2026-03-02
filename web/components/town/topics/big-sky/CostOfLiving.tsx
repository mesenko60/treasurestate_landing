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
        {townName} is an unincorporated resort community of roughly 3,591 people in Gallatin County,
        nestled at 6,319 feet in the shadow of Lone Mountain{'\u2014'}home to Big Sky Resort, one of
        the largest ski areas in North America with 5,800 skiable acres and 4,350 feet of vertical.
        Situated 45 miles south of Bozeman and halfway to Yellowstone National Park via US-191
        through the Gallatin Canyon, {townName} has evolved from a quiet ranching valley into
        Montana's most expensive real estate market. The cost of living here is dominated by
        housing{'\u2014'}a $1.78M median home value, an affordability ratio of 17.2 (the highest in
        Montana), and a 64.9% vacancy rate that reveals a community where nearly two-thirds of
        homes sit empty as second residences or vacation rentals. This guide breaks down housing,
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
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}</div></div>
      </div>

      <h2>Housing Costs</h2>
      <p>
        Housing is not just the defining cost-of-living factor in {townName}{'\u2014'}it is the
        defining fact of life. The median home value stands at {fmtDollar(h?.zillowHomeValue ?? null)} according
        to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at {fmtDollar(h?.medianHomeValue ?? null)},
        reflecting the multi-year survey window. At nearly $1.8 million, {townName} has the most
        expensive housing in Montana by a wide margin{'\u2014'}eclipsing even Whitefish and Bozeman. The
        market is driven almost entirely by resort real estate: ski-in/ski-out condos, luxury mountain
        homes, and second-home purchases by out-of-state buyers who use properties a few weeks per year.
      </p>
      <p>
        Rental data is limited{'\u2014'}Zillow does not report a rent index for {townName}, reflecting
        the near-absence of a traditional long-term rental market.
        {h?.homeValuePercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns.` : ''}
        {' '}The vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} is extraordinary{'\u2014'}nearly
        two-thirds of all housing units sit vacant, almost entirely as seasonal or recreational
        second homes. This is not abandonment; it is extreme second-home dominance that leaves
        year-round residents competing for a tiny sliver of available housing. The worker housing
        crisis is the central community issue, with resort employees, teachers, and service workers
        struggling to find any housing at all within the community.
        For a detailed look at market trends and inventory, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the community at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} has the worst affordability ratio in
        Montana{'\u2014'}far exceeding Whitefish (11.7), Bozeman (8.8), or any other community in the
        state. The $103K median income sounds high by Montana standards, but when the median home costs
        $1.78M, even well-compensated professionals face a massive gap between earnings and ownership.
      </p>
      <p>
        The affordability crisis is structural. {townName}'s housing stock was largely built for the
        resort market{'\u2014'}luxury condominiums, mountain lodges, and custom homes priced for second-home
        buyers with primary incomes earned elsewhere. The year-round workforce{'\u2014'}lift operators,
        restaurant staff, housekeepers, ski instructors, trail crew{'\u2014'}earns tourism-industry wages
        that bear no relationship to the local real estate market. Deed-restricted workforce housing
        programs exist but remain vastly undersupplied relative to demand.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales
        taxes. However, {townName}'s remote mountain location at 6,319 feet means higher costs for
        groceries, fuel, and services compared to valley towns. Winter heating bills are substantial
        given the 300+ inches of annual snowfall, and the limited commercial options within the
        community mean many residents drive 45 miles north to Bozeman for routine shopping and medical
        appointments.
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
            { cat: 'Housing (rent or mortgage)', amt: 2800, pct: h?.medianHouseholdIncome ? Math.round((2800 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities & Heating', amt: 350, pct: h?.medianHouseholdIncome ? Math.round((350 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 620, pct: h?.medianHouseholdIncome ? Math.round((620 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Housing estimate reflects workforce rental rates in {townName}{'\u2014'}deed-restricted units
        when available. Market-rate housing costs substantially more. Grocery and fuel costs run
        higher than valley towns due to the remote mountain location.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'Tourism & Hospitality'}, with
        Big Sky Resort as the dominant employer.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}The resort operates year-round{'\u2014'}skiing from Thanksgiving through April, and an
        expanding summer season of mountain biking, ziplines, hiking, and the Lone Peak Tram. This
        year-round programming has reduced (but not eliminated) the seasonal employment swings that
        once defined the community.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}{'\u2014'}both figures
        reflecting a community where virtually everyone works, often at multiple jobs. Many
        workers commute from Bozeman (45 miles north) or the Gallatin Canyon corridor because
        they cannot afford to live in {townName} itself. This commuter pattern adds transportation
        costs and winter driving hazards on US-191 through the canyon.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}'s most natural comparison is Whitefish, Montana's other major ski-resort
        community. Whitefish's affordability ratio of 11.7 is steep, but {townName}'s 17.2 dwarfs
        it. Bozeman (8.8), 45 miles north, has a far more diversified economy anchored by Montana
        State University and a growing tech sector, making it a more sustainable place to earn a
        living. Many {townName} workers live in Bozeman and commute south precisely because housing
        is attainable there (relatively speaking) while earning resort wages.
      </p>
      <p>
        What sets {townName} apart from every other Montana community is the sheer scale of the
        second-home market. A 64.9% vacancy rate means nearly two out of every three housing units
        are not occupied year-round{'\u2014'}a ratio that dwarfs Whitefish (19.4%) and is entirely
        unlike any traditional Montana town. The result is a community that can feel empty during
        shoulder seasons and packed during holidays, with a year-round population that provides the
        services but struggles to afford the real estate. Compared to Helena (6.6 affordability) or
        Great Falls (3.7), {townName} exists in a different economic universe altogether.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing costs are the highest in Montana{'\u2014'}a $1.78M median and 17.2 affordability ratio reflect a resort real estate market driven by second-home buyers, not local wages.</li>
        <li>The 64.9% vacancy rate means nearly two-thirds of homes sit empty as seasonal residences{'\u2014'}the most extreme second-home dominance in the state.</li>
        <li>Worker housing is the defining community challenge{'\u2014'}resort employees, teachers, and service workers face a severe shortage of affordable year-round housing.</li>
        <li>Montana's zero state sales tax helps with daily expenses, but {townName}'s remote location at 6,319 ft means higher grocery, fuel, and heating costs than valley towns.</li>
        <li>Most workers commute from Bozeman (45 mi) or the Gallatin Canyon because they cannot afford to live in {townName} itself{'\u2014'}a 45-minute mountain drive that adds cost and winter risk.</li>
      </ul>
    </article>
  );
}
