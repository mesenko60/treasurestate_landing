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
        {townName} sits at the heart of Montana's Flathead Valley, just 25 miles from the west entrance
        of Glacier National Park. With a population of roughly 29,886, it serves as
        the commercial hub of Montana's Flathead Valley — and its cost of living reflects a town caught between
        a tourism-driven economy and wages that haven't kept pace with soaring housing demand. This guide
        breaks down housing, income, affordability, and employment data so you know what it actually costs
        to live here.
        For a broader overview of the city, see our{' '}
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
        Housing is the single largest expense for {townName} residents and the most striking element
        of the local cost of living. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure lower
        at {fmtDollar(h?.medianHomeValue ?? null)}, reflecting the multi-year survey window. Either way,
        {' '}{townName} ranks well above the Montana median, and the gap between local incomes and home
        prices is one of the widest in the state.
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.homeValuePercentile != null && h?.rentPercentile != null ? ` Home values rank in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns, while rents sit at the ${ordinal(h.rentPercentile)} percentile — remarkably high for a city of 30,000 without a major university campus.` : ''}
        {' '}Glacier National Park tourism and the short-term rental market (Airbnb, VRBO) pull units
        out of the long-term rental pool, pushing rents higher than the local wage base would otherwise support.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income & Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the city at the ${ordinal(h.incomePercentile)} percentile among Montana towns` : ''}.
        That's notably low relative to housing costs — a{' '}
        {h?.incomePercentile != null && h?.homeValuePercentile != null
          ? `${ordinal(h.incomePercentile)} percentile income paired with ${ordinal(h.homeValuePercentile)} percentile home values`
          : 'significant gap between income and home value rankings'}.
        The affordability ratio{' '}—{' '}median home value divided by median household income{' '}—{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. For context, the commonly cited national benchmark is around 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} means {townName}'s housing is deeply
        stretched relative to local earning power.
      </p>
      <p>
        Unlike Bozeman and Missoula, {townName} lacks a four-year university, which limits the
        professional-wage job base that sustains higher incomes in those cities. Kalispell Regional
        Healthcare is the largest single employer, and while healthcare pays well, the broader economy
        leans heavily on retail, tourism, and hospitality — sectors that typically pay below the
        statewide median. The result is a town where housing prices reflect visitor and retiree demand
        far more than local wages.
      </p>
      <p>
        Montana's lack of a state sales tax provides meaningful relief on everyday expenses — groceries,
        clothing, and household goods all cost less at the register than in states with 6–9% sales taxes.
        {townName}'s relatively low elevation (2,959 ft) also means slightly milder winters than Missoula
        or Bozeman, translating to modestly lower heating costs during the long cold season.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? 1950, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? 1950) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 240, pct: h?.medianHouseholdIncome ? Math.round((240 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 520, pct: h?.medianHouseholdIncome ? Math.round((520 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 340, pct: h?.medianHouseholdIncome ? Math.round((340 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Utilities reflect {townName}'s lower elevation (2,959 ft) and slightly milder winters compared to higher-altitude Montana cities.
      </p>

      <h2>Employment & Economic Context</h2>
      <p>
        {townName}'s economy is anchored by {e?.mainIndustry ?? 'education and healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 29.5}% of employment. Kalispell Regional Healthcare is the
        city's largest single employer, providing a stable economic base year-round.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)}, and labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}.
        {' '}Tourism is a major economic driver but adds pronounced seasonality — summer brings a
        flood of Glacier National Park visitors and Flathead Lake vacationers, while winter quiets
        considerably compared to ski-resort towns like Whitefish. This seasonal swing affects
        retail, hospitality, and service-sector wages, contributing to the income-housing gap.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        Among Flathead Valley communities, {townName} is the more affordable alternative to nearby
        Whitefish, where median home values exceed $835K. Buyers priced out of Whitefish's
        resort-town market frequently turn to {townName}, which offers similar Glacier-area access at
        a significant discount — though that dynamic steadily pushes {townName}'s prices higher.
      </p>
      <p>
        Compared to Montana's other mid-size cities, {townName}'s home values ({fmtDollar(h?.zillowHomeValue ?? null)})
        are roughly on par with Missoula ($547K) but below Bozeman. What sets {townName} apart is
        the income gap: Bozeman and Missoula both have university-town economies that support higher
        median household incomes, while {townName}'s{' '}
        {h?.incomePercentile != null ? `${ordinal(h.incomePercentile)} percentile income` : 'lower income level'}{' '}
        creates a sharper affordability squeeze. Great Falls and Billings remain far cheaper for
        housing but lack the Glacier-area lifestyle that sustains demand in the Flathead Valley.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with home values in the top {h?.homeValuePercentile ? `${100 - h.homeValuePercentile}%` : '13%'} of Montana towns.</li>
        <li>The income-to-housing gap is among the widest in Montana — {h?.incomePercentile != null && h?.homeValuePercentile != null ? `${ordinal(h.incomePercentile)} percentile income vs. ${ordinal(h.homeValuePercentile)} percentile home values` : 'low incomes paired with high housing costs'}.</li>
        <li>Montana's zero state sales tax offsets some daily expenses, and lower elevation means slightly reduced heating costs.</li>
        <li>Glacier National Park tourism and Whitefish overflow drive housing demand well beyond what local wages support.</li>
        <li>Retirement migration and short-term rental conversion continue to tighten the market for year-round residents.</li>
      </ul>
    </article>
  );
}
