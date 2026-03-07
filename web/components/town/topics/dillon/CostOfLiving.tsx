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
        {townName} is a historic railroad and ranching town of roughly 3,880 people in Beaverhead
        County, set in a broad high-desert valley at 5,095 feet elevation along I-15, about 65 miles
        south of Butte. Home to the University of Montana Western{'\u2014'}a small public university
        with roughly 1,284 students{'\u2014'}{townName} blends an agricultural and mining heritage with
        a growing appeal to remote workers, fly-fishing enthusiasts, and retirees drawn by blue-ribbon
        trout streams, Bannack ghost town, and hot springs. Despite its remote location, home values
        have surged in recent years, though {townName} remains one of the more affordable communities
        in western Montana. This guide breaks down housing, income, affordability, and employment data
        so you know what it actually costs to live here. For a broader overview, see
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
        Housing in {townName} tells two stories depending on which data source you consult. The
        median home value stands at {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's
        Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at {fmtDollar(h?.medianHomeValue ?? null)},
        reflecting the multi-year survey window. That roughly 57% gap between Census and Zillow
        figures illustrates how rapidly {townName}'s market has appreciated{'\u2014'}driven by remote
        workers pricing out of Bozeman and Missoula, fly-fishing buyers drawn to the Beaverhead and
        Big Hole rivers, and a general westward migration of equity-rich transplants.
      </p>
      <p>
        Renters pay a median of {fmtDollar(h?.medianRent ?? null)} per month according to Census data.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}The low rent relative to home values reflects the influence of the University of Montana
        Western student population, which keeps demand concentrated in modest apartments and older
        housing stock. The vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} across
        {h?.totalHousingUnits ? ` ${fmt(h.totalHousingUnits)}` : ''} total housing units is
        moderately high, though a portion of those vacancies are seasonal or recreational properties
        rather than available rentals.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        At {h?.affordabilityRatio ?? 'this level'}, {townName} is stretched but still far better than
        Bozeman (11.4), Whitefish (11.7), Big Sky (18+), or even Livingston (7.8). It compares more
        closely to Helena (6.6){'\u2014'}expensive by Great Plains standards, but genuinely affordable
        by western Montana resort-town metrics.
      </p>
      <p>
        The income figure reflects {townName}'s education-heavy economy. University employment,
        Barrett Hospital, Beaverhead County government, and Barretts Minerals (talc mining) provide
        stable year-round jobs, but these are public-sector and resource-industry wages{'\u2014'}solid
        but not high. The growing cohort of remote workers with outside incomes can absorb the
        rising home prices more easily than local workers earning education or healthcare wages.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses{'\u2014'}groceries,
        clothing, and household goods all cost less at the register than in states with 6{'\u2013'}9% sales taxes.
        {townName}'s high-desert location in the Beaverhead Valley at 5,095 feet means cold, dry
        winters with less snowfall than mountain towns but sharp cold snaps that push heating costs
        higher than lower-elevation communities. Groceries and goods carry a modest rural premium
        given the 65-mile distance to Butte, the nearest larger city.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.medianRent ?? 821, pct: h?.medianHouseholdIncome ? Math.round(((h?.medianRent ?? 821) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 240, pct: h?.medianHouseholdIncome ? Math.round((240 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 490, pct: h?.medianHouseholdIncome ? Math.round((490 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 380, pct: h?.medianHouseholdIncome ? Math.round((380 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 290, pct: h?.medianHouseholdIncome ? Math.round((290 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s high-desert location at 5,095 ft elevation{'\u2014'}expect
        higher heating bills from October through April despite lower snowfall than mountain towns.
        Groceries carry a modest rural premium given the 65-mile distance to Butte.
      </p>

      <h2>University Impact on the Rental Market</h2>
      <p>
        The University of Montana Western enrolls roughly 1,284 students, and their presence shapes
        {townName}'s rental landscape in ways that set it apart from other small western Montana towns.
        Student demand concentrates in the cheapest tier of the rental market{'\u2014'}older apartments,
        shared houses, and converted single-family homes near campus{'\u2014'}which keeps the Census median
        rent figure low at {fmtDollar(h?.medianRent ?? null)} even as purchase prices climb. During
        the academic year (September through May), most affordable rentals are spoken for, and
        newcomers arriving mid-semester may find options limited.
      </p>
      <p>
        Conversely, summer months free up student-occupied units, creating a brief window of rental
        availability that overlaps with peak fly-fishing and tourism season{'\u2014'}when short-term
        vacation rentals also compete for the same housing stock. The net effect is a bifurcated
        market: student-grade rentals under $800/month during the school year, and a thin supply
        of quality long-term rentals at market rates year-round. For families or professionals
        relocating to {townName}, timing and flexibility matter more than in larger markets.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 30.8}% of employment{'\u2014'}a dominant share driven by the
        University of Montana Western, Barrett Hospital, and the Beaverhead County school district.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Tourism and hospitality benefit from blue-ribbon fly fishing on the Beaverhead and Big
        Hole rivers, Bannack State Park, and nearby hot springs, providing a seasonal boost that
        fills motels and restaurants from June through September.
      </p>
      <p>
        Other notable employers include Barretts Minerals (talc mining operations southwest of town),
        Great Harvest Bread Company (national headquarters based in {townName}), and Beaverhead
        County government. This mix of education, healthcare, mining, and government provides more
        year-round stability than pure resort economies, though wages remain modest.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        Unlike seasonal resort towns where unemployment swings sharply, {townName}'s education-anchored
        economy provides relatively steady employment throughout the year, with a mild summer uptick
        from tourism-related hiring.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}'s most natural comparison is Butte, 65 miles north on I-15. Butte's affordability
        ratio of roughly 4.0 makes it significantly cheaper, with a larger and more diversified economy
        anchored by mining heritage, Montana Tech, and healthcare. Many {townName} residents drive to
        Butte for medical specialists, big-box retail, and Bert Mooney Airport flights, underscoring
        how the two towns function as an informal network despite the distance.
      </p>
      <p>
        Among western Montana communities, {townName}'s affordability ratio of{' '}
        {h?.affordabilityRatio ?? 7.3} places it in a middle tier{'\u2014'}substantially cheaper than
        Bozeman (11.4), Whitefish (11.7), or Big Sky (18+), but more expensive than Great Falls (3.7)
        or Helena (6.6). What {townName} offers for the price is genuine small-town character, world-class
        fly fishing within minutes of downtown, a university campus that keeps the community
        intellectually engaged, and a cost structure that still allows local workers{'\u2014'}not just
        remote professionals{'\u2014'}a realistic path to homeownership. That accessibility is increasingly
        rare in western Montana, and it's a significant part of {townName}'s appeal.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is appreciating fast{'\u2014'}a 57% gap between Census ({fmtDollar(h?.medianHomeValue ?? null)}) and Zillow ({fmtDollar(h?.zillowHomeValue ?? null)}) figures reflects surging demand from remote workers and fishing enthusiasts.</li>
        <li>Still one of western Montana's more affordable options, with an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} versus 11+ in Bozeman and Whitefish.</li>
        <li>Rents stay low ({fmtDollar(h?.medianRent ?? null)}, {h?.rentPercentile ? `${ordinal(h.rentPercentile)} percentile` : 'below-average'}) partly because University of Montana Western students anchor the low end of the market.</li>
        <li>Education & Healthcare (30.8%) dominate employment; Barrett Hospital, the university, Barretts Minerals, and Great Harvest Bread Company HQ provide year-round stability.</li>
        <li>Montana's zero state sales tax offsets daily costs, but {townName}'s high-desert location at 5,095 ft means cold winters and a 65-mile drive to Butte for major shopping and services.</li>
      </ul>
    </article>
  );
}
