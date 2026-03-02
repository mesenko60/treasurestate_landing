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
        {townName} is a lakefront community of roughly 5,148 people on the southern shore of
        Flathead Lake — the largest natural freshwater lake west of the Mississippi — in Lake
        County, Montana. Situated on the Flathead Indian Reservation (Confederated Salish and
        Kootenai Tribes), {townName} sits at the crossroads of US-93 between Missoula (70 miles
        south) and Kalispell (55 miles north). Cherry orchards line the surrounding hillsides,
        tourism drives the summer economy, and lakefront property commands a steep premium. This
        guide breaks down housing, income, affordability, and employment data so you know what it
        actually costs to live here.
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
        Housing is the defining cost-of-living factor in {townName}, driven overwhelmingly by
        Flathead Lake frontage and proximity. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The Census Bureau's American Community Survey puts the figure considerably lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting both the multi-year survey window
        and the rapid appreciation that lakefront demand has produced in recent years.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents rank in the ${ordinal(h.rentPercentile)} percentile — moderate by Montana standards, reflecting the fact that rental stock in ${townName} is limited and many lakefront properties are owner-occupied or used as vacation homes rather than rentals.` : ''}
        {' '}Seasonal short-term rentals (Airbnb, VRBO) pull lakeside units out of the year-round
        market during peak summer months, tightening supply for permanent residents.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That is well below the statewide median, reflecting an economy built on healthcare,
        retail, and seasonal tourism rather than high-wage professional sectors.
        The affordability ratio{' '}&mdash;{' '}median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. For context, the commonly cited national benchmark is
        3.0 to 5.0. A ratio of {h?.affordabilityRatio ?? 'this level'} means {townName}'s
        housing is significantly stretched relative to local earning power, though less extreme
        than Whitefish (11.7) or Big Sky.
      </p>
      <p>
        The disconnect between home values and incomes is a hallmark of lakefront Montana
        communities. Many buyers in {townName} are retirees, vacation-home purchasers, or
        remote workers with out-of-state incomes. Local wages — particularly in retail,
        hospitality, and agriculture — do not support the lakefront price levels that drive the
        median upward. The CSKT reservation economy provides some public-sector and healthcare
        employment, but these jobs alone cannot close the income-housing gap.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses —
        groceries, clothing, and household goods all cost less at the register than in states
        with 6–9% sales taxes. {townName}'s elevation (2,930 ft) means cold winters with
        meaningful heating costs, though the moderating influence of Flathead Lake keeps
        temperature swings slightly milder than inland valleys at similar elevation.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 921, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 921) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 230, pct: h?.medianHouseholdIncome ? Math.round((230 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 480, pct: h?.medianHouseholdIncome ? Math.round((480 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 420, pct: h?.medianHouseholdIncome ? Math.round((420 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 320, pct: h?.medianHouseholdIncome ? Math.round((320 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Transportation costs reflect {townName}'s relative isolation — Missoula and Kalispell are
        the nearest full-service retail centers, requiring regular highway drives on US-93.
      </p>

      <h2>Vacancy & Seasonal Housing</h2>
      <p>
        {townName}'s vacancy rate of {fmtPct(h?.vacancyRate ?? null)} is among the highest in
        Montana, but it does not signal weak demand. Of the roughly {fmt(h?.totalHousingUnits ?? null)} total
        housing units, a large share are vacation homes, seasonal lakefront cabins, and
        short-term rentals that sit empty outside summer months. Flathead Lake's draw as a
        summer destination means many properties are occupied only from June through September,
        inflating the vacancy figure while doing nothing to relieve the housing crunch for
        year-round residents.
      </p>
      <p>
        This seasonal dynamic is central to understanding {townName}'s housing market. The
        Census-measured vacancy rate counts these vacation units as "vacant," but they are
        effectively removed from the permanent housing supply. For workers and families seeking
        year-round rentals or starter homes, the practical inventory is far smaller than the
        raw unit count suggests. The Flathead Cherry Festival in July and peak lake season
        drive short-term rental demand to its highest, further compressing availability for
        locals.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'Education & Healthcare'}, which
        accounts for {e?.topIndustries?.[0]?.pct ?? 30.3}% of employment. Providence St. Joseph
        Medical Center and the local school district are among the largest year-round employers.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
        {' '}Tourism and hospitality ({e?.topIndustries?.[3]?.pct ?? 10.1}%) round out the top
        four, with employment surging in summer and contracting sharply over winter.
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Cherry agriculture remains an important niche industry along the east shore of
        Flathead Lake, providing seasonal employment during the July harvest. The CSKT tribal
        government also contributes public-sector jobs, though many reservation-based positions
        are located outside {townName} proper.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Flathead-area communities, {townName} occupies a middle ground. Its median home
        value ({fmtDollar(h?.zillowHomeValue ?? null)}) is well below Whitefish ($835K) and
        Bigfork, but above Great Falls and most eastern Montana cities. Buyers priced out of
        Whitefish and Kalispell increasingly look to {townName} for lakefront access at a lower
        entry point — a dynamic that has steadily pushed prices higher over the past decade.
      </p>
      <p>
        Compared to Kalispell ({fmtDollar(null)}$538K), {townName}'s home values are comparable,
        but {townName}'s lower median income ({fmtDollar(h?.medianHouseholdIncome ?? null)} vs.
        Kalispell's roughly $55K) produces a worse affordability ratio. Missoula ($547K) and
        Bozeman ($703K) have higher home values but also benefit from university-town economies
        that support significantly higher household incomes. {townName}'s{' '}
        {h?.incomePercentile != null ? `${ordinal(h.incomePercentile)} percentile income` : 'lower income level'}{' '}
        paired with {h?.homeValuePercentile != null ? `${ordinal(h.homeValuePercentile)} percentile home values` : 'high home values'}{' '}
        creates one of the sharper affordability gaps among Montana's lakefront communities.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the primary cost driver, with home values in the top {h?.homeValuePercentile ? `${100 - h.homeValuePercentile}%` : '13%'} of Montana towns, fueled by Flathead Lake frontage and vacation-home demand.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 10.5} is steep — {h?.incomePercentile != null && h?.homeValuePercentile != null ? `${ordinal(h.incomePercentile)} percentile income vs. ${ordinal(h.homeValuePercentile)} percentile home values` : 'low incomes paired with high housing costs'} — though less extreme than Whitefish or Big Sky.</li>
        <li>A {fmtPct(h?.vacancyRate ?? null)} vacancy rate reflects seasonal and vacation housing, not weak demand — year-round inventory is tight.</li>
        <li>Montana's zero state sales tax offsets some daily expenses, but isolation from major retail centers adds transportation costs.</li>
        <li>Cherry agriculture, tribal government, and tourism create a seasonal employment pattern that depresses winter-quarter incomes.</li>
      </ul>
    </article>
  );
}
