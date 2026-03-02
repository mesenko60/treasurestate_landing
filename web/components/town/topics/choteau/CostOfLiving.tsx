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
        {townName} is a town of roughly 1,721 people and the county seat of Teton County,
        sitting at 3,816 feet along the Rocky Mountain Front where the Rockies meet the Great
        Plains — about 60 miles northwest of Great Falls on US-89. Named for French fur merchant
        Pierre Chouteau Jr., the town anchors a landscape defined by agriculture, paleontology
        (Egg Mountain's dinosaur nesting site), and the spectacular Freezout Lake wildlife refuge.
        {townName} is one of Montana's most affordable small towns, offering genuine rural living
        at a fraction of what resort communities or even mid-size cities charge. The Bob Marshall
        Wilderness and Lewis and Clark National Forest rise to the west, while the eastern horizon
        stretches across open prairie. This guide breaks down housing, income, affordability, and
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
        Housing is the single largest expense in {townName} and a category that has moved
        meaningfully in recent years. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 45% gap that reflects significant appreciation
        since the Census survey window closed, though {townName}'s Zillow value remains far below
        the state median. Even with this growth, {townName} is still one of the more affordable
        markets in Montana — a town where buying a home on local wages remains within reach.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — slightly below the midpoint.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — exceptionally low by Montana standards, making ${townName} one of the cheapest rental markets in the state.` : ''}
        {' '}At $713 per month, rent in {townName} is roughly half what tenants pay in Bozeman or
        Missoula, and far below Great Falls rates. Freezout Lake and Rocky Mountain Front tourism
        draw some short-term rental interest, but the effect on the long-term rental pool is minimal
        compared to Glacier or Yellowstone gateway towns.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $54K figure reflects {townName}'s rural, agricultural economy — an Education &amp;
        Healthcare workforce (24.8% of jobs) paired with tourism, agriculture, and government
        employment that together provide steady but modest wages. The lower labor force participation
        rate (54.3%) suggests a meaningful retiree population. The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} just above the comfortable
        range but well below the severe stress seen in Montana's resort towns.
      </p>
      <p>
        For comparison, Great Falls (60 miles southeast) has a stronger income base and lower ratio,
        reflecting that city's military and medical economy. Meanwhile, Bozeman exceeds 10.0 and
        Whitefish sits above 11.0 — communities where home prices have detached entirely from local
        earning power. {townName}'s 5.3 ratio means housing is stretched relative to local wages but
        still within reach for dual-income households, especially with Montana's lack of a state
        sales tax providing meaningful relief on everyday expenses like groceries, clothing, and
        household goods. Conrad, a similar small town 45 miles northeast, offers comparable
        affordability — but without {townName}'s proximity to the Rocky Mountain Front.
      </p>
      <p>
        As the Teton County seat, {townName} has a courthouse, Benefis Teton Medical Center, and
        county services that provide stable government employment and keep essential services local.
        The 60-mile drive to Great Falls connects residents to that city's retail, medical
        specialists, and Great Falls International Airport — but for most daily needs, {townName}'s
        own Main Street serves residents without requiring the commute.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 713, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 713) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 195, pct: h?.medianHouseholdIncome ? Math.round((195 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 430, pct: h?.medianHouseholdIncome ? Math.round((430 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 370, pct: h?.medianHouseholdIncome ? Math.round((370 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Healthcare', amt: 290, pct: h?.medianHouseholdIncome ? Math.round((290 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        {townName}'s proximity to Great Falls (60 mi) keeps retail costs reasonable, and the absence
        of a state sales tax reduces everyday expenses compared to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy is rooted in agriculture and county-seat services, supplemented by
        a growing tourism sector drawn to the Rocky Mountain Front and Freezout Lake. The leading
        employer sector is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 24.8}% of employment. Benefis Teton Medical Center and
        the Choteau school district anchor this sector, providing stable, year-round employment
        that helps offset seasonal swings from tourism and agriculture.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Tourism &amp; Hospitality at {e?.topIndustries?.[1]?.pct ?? 15.5}% of employment reflects
        the draw of the Rocky Mountain Front, Bob Marshall Wilderness, Freezout Lake's spectacular
        snow goose and tundra swan migrations, Egg Mountain's paleontology significance, and Teton
        Pass Ski Area 16 miles to the west. Agriculture &amp; Mining at {e?.topIndustries?.[3]?.pct ?? 9.0}%
        captures the ranching and farming operations that define the surrounding landscape.
        The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)} — essentially zero,
        reflecting a labor market so tight that employers struggle to fill positions. Labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)}, a notably low figure
        that reflects {townName}'s significant retiree population and the rural character of
        the community.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is one of the most affordable communities along the Rocky Mountain Front. Its
        median home value ({fmtDollar(h?.zillowHomeValue ?? null)}) is less than half of Bozeman
        ($703K) and Missoula ($547K), and a fraction of Whitefish or Big Sky prices. Compared to
        Great Falls — the nearest city at 60 miles — {townName} offers lower home prices, though
        Great Falls' stronger income base yields a somewhat better affordability ratio. Even Conrad,
        a similar agricultural town in neighboring Pondera County, offers a comparable price point
        but lacks {townName}'s gateway-to-the-Rockies setting.
      </p>
      <p>
        Where {townName} stands out is the combination of genuine affordability with proximity to
        some of Montana's most iconic landscapes. The Bob Marshall Wilderness, Teton Pass Ski Area,
        and Freezout Lake are all within easy reach, and the town's position on US-89 between
        Glacier and Yellowstone makes it a natural stopping point on one of Montana's great scenic
        corridors. {townName} isn't a resort town and doesn't pretend to be — it's a county seat
        with a courthouse, a hospital, and ranches stretching to the horizon. For buyers looking
        for "real Montana" at a working price point, {townName} remains the clear value play along
        the Rocky Mountain Front.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'mid-range ranking'} among Montana towns and a 45% Census-to-Zillow appreciation gap showing significant but still-affordable price growth.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 5.3} is just above the national comfort zone but far below resort towns like Big Sky (15+) and Whitefish (11+), keeping {townName} accessible to working households.</li>
        <li>Rent at $713/month is exceptionally low — {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lowest in Montana'} — making {townName} one of the most affordable rental markets in the state.</li>
        <li>The economy centers on Education &amp; Healthcare ({e?.topIndustries?.[0]?.pct ?? 24.8}%), Tourism ({e?.topIndustries?.[1]?.pct ?? 15.5}%), and Construction ({e?.topIndustries?.[2]?.pct ?? 10.7}%), with agriculture and county-seat services providing a stable base.</li>
        <li>Montana's zero state sales tax and {townName}'s 12.2% vacancy rate mean housing is available and everyday costs stay manageable, while the Rocky Mountain Front and Bob Marshall Wilderness add recreation value that pure prairie towns can't match.</li>
      </ul>
    </article>
  );
}
