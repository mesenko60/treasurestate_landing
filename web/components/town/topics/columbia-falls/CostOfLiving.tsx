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
        {townName} is a small city of roughly 5,308 people in Flathead County, sitting at
        3,077 feet along the Flathead River just 17 miles from the west entrance of Glacier
        National Park. Once anchored by the Columbia Falls Aluminum Company — which closed in
        2015 — the town has reinvented itself around tourism, construction, and its role as the
        most affordable gateway to Glacier and nearby Whitefish. Workers priced out of
        Whitefish ($835K+ median home value) increasingly settle here, and that spillover
        demand is reshaping the local cost of living. This guide breaks down housing, income,
        affordability, and employment data so you know what it actually costs to live here.
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
        Housing is the single largest expense in {townName} and the cost category changing
        fastest. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 68% gap that underscores how rapidly values
        have appreciated since the Census survey window closed. The median list price of $810K
        skews even higher, pulled up by luxury properties and Glacier-corridor estates.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, placing it in the top ${100 - h.homeValuePercentile}% statewide despite its small-town character.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — moderate by Montana standards, reflecting ${townName}'s role as the affordable alternative in the Flathead Valley.` : ''}
        {' '}Glacier National Park's 3+ million annual visitors and the growing short-term rental
        market (Airbnb, VRBO) pull some units out of the long-term pool, but the effect is less
        severe here than in neighboring Whitefish, where nearly 1 in 5 units is a vacation home.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $65K figure is notably higher than many Montana towns — above Kalispell, Polson,
        and most of eastern Montana — reflecting a workforce that includes Glacier Park
        employees, construction tradespeople, and commuters to Whitefish and Kalispell jobs.
        Yet the affordability ratio{' '}&mdash;{' '}median home value divided by median household
        income{' '}&mdash;{' '}is{' '}{h?.affordabilityRatio ?? '—'}. For context, the commonly cited
        national benchmark is 3.0 to 5.0. A ratio of {h?.affordabilityRatio ?? 'this level'}{' '}
        means {townName}'s housing is deeply stretched relative to local earning power.
      </p>
      <p>
        The disconnect has a clear cause: the people buying homes in {townName} are
        increasingly not the same people who work here. Whitefish overflow buyers, retirees,
        and remote workers with coastal salaries drive purchase prices, while the local
        workforce — tourism staff, construction crews, healthcare aides — faces a market
        priced well beyond local wages. The Census-to-Zillow gap of 68% captures the speed
        of this shift.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses —
        groceries, clothing, and household goods all cost less at the register than in states
        with 6–9% sales taxes. {townName}'s elevation (3,077 ft) means cold winters with
        meaningful heating costs, though GPI Airport just 8 miles south and the US-2 corridor
        keep transportation access better than more isolated Montana communities.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1003, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1003) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 235, pct: h?.medianHouseholdIncome ? Math.round((235 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 490, pct: h?.medianHouseholdIncome ? Math.round((490 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 390, pct: h?.medianHouseholdIncome ? Math.round((390 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 330, pct: h?.medianHouseholdIncome ? Math.round((330 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s proximity to Kalispell (15 mi) and GPI Airport keeps transportation and
        retail costs lower than more isolated Montana communities.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy underwent a fundamental shift when the Columbia Falls Aluminum
        Company — once the town's largest employer — closed in 2015. The economy has since
        pivoted to {e?.mainIndustry ?? 'Tourism & Hospitality'}, which accounts for{' '}
        {e?.topIndustries?.[0]?.pct ?? 22.5}% of employment. Glacier National Park, Whitefish
        Mountain Resort, and the Flathead Valley's growing visitor economy drive demand for
        hospitality, guiding, and service-sector workers.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Construction at {e?.topIndustries?.[2]?.pct ?? 13.5}% of employment reflects the
        building boom underway as {townName} absorbs residential growth from the broader
        Flathead Valley. The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and
        labor force participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Tourism adds pronounced seasonality — summer brings a flood of Glacier visitors,
        while winter is quieter than in ski-resort Whitefish, though growing mountain-resort
        traffic provides some winter spillover.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is the Flathead Valley's affordable gateway. Its median home value
        ({fmtDollar(h?.zillowHomeValue ?? null)}) is roughly 30% below neighboring Kalispell
        ($538K) and far below Whitefish ($835K+). Buyers and renters priced out of those
        communities increasingly turn to {townName} for Glacier-area access at a fraction of
        the cost — a dynamic that has driven the 68% Census-to-Zillow appreciation gap and
        continues to push prices higher.
      </p>
      <p>
        Compared to Montana's other mid-size cities, {townName}'s home values are below
        Bozeman ($703K) and Missoula ($547K). What distinguishes {townName} is the
        combination: a {h?.incomePercentile != null ? `${ordinal(h.incomePercentile)} percentile income` : 'moderate income level'}{' '}
        — higher than many MT towns — paired with {h?.homeValuePercentile != null ? `${ordinal(h.homeValuePercentile)} percentile home values` : 'rapidly appreciating home values'}{' '}
        that reflect Glacier proximity rather than local wages. Great Falls and Billings
        remain far cheaper for housing but lack the national-park lifestyle that sustains
        demand in the Flathead corridor. Among Glacier gateway communities, {townName} offers
        the best value, but the window is narrowing as Whitefish spillover and construction
        activity accelerate price growth.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with home values in the top {h?.homeValuePercentile ? `${100 - h.homeValuePercentile}%` : '11%'} of Montana towns and a 68% Census-to-Zillow appreciation gap showing rapid price growth.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 8.9} is steep — {h?.incomePercentile != null && h?.homeValuePercentile != null ? `${ordinal(h.incomePercentile)} percentile income vs. ${ordinal(h.homeValuePercentile)} percentile home values` : 'moderate incomes paired with high housing costs'} — though less extreme than Whitefish (11.7).</li>
        <li>Montana's zero state sales tax offsets daily expenses, and proximity to Kalispell and GPI Airport keeps retail and transportation costs manageable.</li>
        <li>The economy shifted from aluminum manufacturing to tourism and construction after the smelter closed in 2015, with construction at {e?.topIndustries?.[2]?.pct ?? 13.5}% reflecting the current building boom.</li>
        <li>{townName} is the most affordable Glacier-area community, but Whitefish overflow buyers and remote workers are rapidly closing that gap.</li>
      </ul>
    </article>
  );
}
