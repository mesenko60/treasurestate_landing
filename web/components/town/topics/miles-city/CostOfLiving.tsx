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
        {townName} is the self-proclaimed {'\u201C'}Cow Capital of Montana{'\u201D'} — a ranching hub of
        roughly 8,412 people in Custer County, sitting at 2,365 feet where the Tongue River flows
        into the Yellowstone River. Located 145 miles east of Billings on I-94, {townName} serves
        as the commercial center of southeastern Montana{'\u2014'}a vast landscape of prairie, cattle
        ranches, and badlands that feels worlds away from the mountain towns of western Montana.
        The good news for anyone considering a move: {townName} is one of the most genuinely
        affordable places to live in the state. With an affordability ratio of just 3.8, median
        home values under $230K, and rents around $750 per month, this is a town where a working
        family can own a home without financial gymnastics. This guide breaks down the numbers.
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
        Housing in {townName} is remarkably affordable by Montana standards. The median home value
        stands at {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow{'\u2019'}s Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau{'\u2019'}s American Community Survey puts the figure at {fmtDollar(h?.medianHomeValue ?? null)}.
        For context, that{'\u2019'}s less than half the median in Bozeman, roughly 40% of Missoula{'\u2019'}s median,
        and lower than every western Montana hub city we track. The eastern Montana prairie doesn{'\u2019'}t
        carry the mountain-resort premium{'\u2014'}there are no ski lifts, no Yellowstone gateway crowds,
        and no second-home gold rush driving prices up.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month{'\u2014'}a
        figure that would barely cover a studio apartment in Bozeman or Whitefish.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile.` : ''}
        {' '}The vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} is higher than
        most Montana towns, meaning renters have real choices and rarely face bidding wars for
        available units. For a detailed look at inventory and market trends, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        The affordability ratio{'\u2014'}median home value divided by median household income{'\u2014'}is{' '}
        {h?.affordabilityRatio ?? '\u2014'}. The commonly cited national benchmark for a healthy
        housing market is 3.0 to 5.0. At {h?.affordabilityRatio ?? 'this level'}, {townName} sits
        squarely in the affordable zone{'\u2014'}comparable to Great Falls (5.1) and dramatically better
        than Bozeman (8.8), Whitefish (11.7), or even Helena (6.6). A household earning the median
        income can realistically purchase a median-priced home with a conventional mortgage and
        still have room in the budget.
      </p>
      <p>
        {townName}{'\u2019'}s economy is built on agriculture, healthcare, and education rather than
        tourism or tech{'\u2014'}which keeps wages moderate but also keeps housing prices anchored to
        local earning power rather than outside money. There is no flood of remote workers with
        coastal salaries or second-home buyers bidding up prices. The result is a market that
        actually works for the people who live and work here.
      </p>
      <p>
        Montana{'\u2019'}s lack of a state sales tax provides meaningful relief on everyday expenses.
        {townName}{'\u2019'}s low elevation of 2,365 feet and semi-arid continental climate mean hot
        summers (highs near 89{'\u00B0'}F in July) and cold winters (lows around 18{'\u00B0'}F in January).
        Heating costs in winter and cooling costs in summer are both real budget items, but neither
        reaches the extremes of higher-elevation mountain towns where winter lasts six months.
      </p>

      <h2>Monthly Budget Estimate</h2>
      <p>
        While individual budgets vary widely, here{'\u2019'}s a rough breakdown of monthly costs for a
        household earning {townName}{'\u2019'}s median income:
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 750, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 750) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 220, pct: h?.medianHouseholdIncome ? Math.round((220 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 480, pct: h?.medianHouseholdIncome ? Math.round((480 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 420, pct: h?.medianHouseholdIncome ? Math.round((420 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        Transportation costs reflect {townName}{'\u2019'}s remote location{'\u2014'}the nearest major
        city (Billings) is 145 miles west, and most goods and services require driving.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}{'\u2019'}s economy is anchored by {e?.mainIndustry ?? 'Education & Healthcare'}, which
        accounts for {e?.topIndustries?.[0]?.pct ?? 28}% of employment.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Holy Rosary Healthcare (an SCL Health / Intermountain facility) is the largest employer
        in the region, and Miles Community College provides both education jobs and workforce
        training for the agricultural and healthcare sectors. Agriculture and ranching remain
        the economic backbone of Custer County{'\u2014'}the Bucking Horse Sale each May draws thousands
        and underscores the town{'\u2019'}s identity as cattle country.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}. The economy is
        stable but not booming{'\u2014'}growth comes gradually in eastern Montana, tied to commodity
        prices, healthcare expansion, and the slow but steady diversification of the regional
        economy. For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName}{'\u2019'}s most natural comparisons are other eastern Montana towns and Montana{'\u2019'}s
        more affordable cities. Great Falls (affordability ratio 5.1) is the closest match in
        price-to-income terms, though Great Falls is three times larger and has Malmstrom Air
        Force Base anchoring its economy. Billings (145 miles west) is the regional metropolis
        with far more amenities, restaurants, and flights{'\u2014'}but also higher housing costs.
      </p>
      <p>
        What {townName} trades for its affordability is remoteness and scale. The nearest
        commercial airport with regular service is Billings Logan International, a 2.5-hour drive
        west. Shopping, specialty healthcare, and entertainment options that larger cities take
        for granted require a trip to Billings. What {townName} offers in return is genuine
        small-town community, a cost of living that lets families build wealth rather than just
        survive, the Yellowstone and Tongue rivers at your doorstep, and a Western ranching
        culture that hasn{'\u2019'}t been diluted by tourism or transplant money. For families, retirees,
        and remote workers who can work from anywhere, {townName}{'\u2019'}s affordability is its most
        compelling selling point.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>An affordability ratio of {h?.affordabilityRatio ?? '\u2014'} makes {townName} an affordable hub city in Montana{'\u2014'}a median-income household can realistically buy a median-priced home.</li>
        <li>Rents around {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '$750/mo'} are among the lowest in the state, and a {h?.vacancyRate ?? 10.6}% vacancy rate means renters have real options.</li>
        <li>The economy is built on agriculture, healthcare (Holy Rosary), and education (Miles Community College){'\u2014'}stable but not fast-growing.</li>
        <li>Montana{'\u2019'}s zero state sales tax offsets daily costs, and {townName}{'\u2019'}s low elevation keeps winters shorter than mountain towns, though summers run hot.</li>
        <li>Remoteness is the trade-off{'\u2014'}Billings is 145 miles west, and {townName} lacks the amenities, restaurants, and flight options of larger Montana cities.</li>
      </ul>
    </article>
  );
}
