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
        {townName} is a resort village of roughly 5,000 people in Flathead County, perched at
        2,940 feet on the northeast shore of Flathead Lake — the largest natural freshwater lake
        west of the Mississippi. Known as the &ldquo;Village by the Bay,&rdquo; {townName} was
        founded in 1902 as a logging and agriculture outpost and has evolved into one of
        Montana&rsquo;s premier arts-and-tourism communities, named one of the &ldquo;100 Best
        Small Art Towns in the Nation.&rdquo; The Swan River flows through the town center, cherry
        orchards line the east shore of the lake, and the Bigfork Summer Playhouse has staged
        &ldquo;Broadway in the Rockies&rdquo; since 1960. Sitting 17 miles southeast of Kalispell,
        35 miles south of Whitefish, and 45 miles from Glacier National Park, {townName} commands
        premium prices befitting its location — but not quite at the level of its resort neighbors
        to the north. This guide breaks down housing, income, affordability, and employment data
        so you know what it actually costs to live here.
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
        Housing is the single largest expense in {townName} and a category that reflects the
        community&rsquo;s dual identity as both a year-round village and a premier vacation
        destination. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow&rsquo;s Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau&rsquo;s American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 24% gap that reflects significant appreciation
        driven by Flathead Lake&rsquo;s enduring desirability as a destination for second-home
        buyers, retirees, and remote workers. The median list price of nearly $993K approaches
        the million-dollar threshold, pushed upward by lakefront and view properties that dominate
        the upper end of the market.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — firmly in the premium tier.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — moderate by resort-town standards, reflecting a rental pool that serves year-round workers in the hospitality, education, and service sectors.` : ''}
        {' '}At $1,103 per month, rent in {townName} is well below Whitefish and Big Sky rates
        but above Kalispell and Polson, reflecting {townName}&rsquo;s position as a mid-tier
        resort market. The 29% vacancy rate is the telling housing statistic — nearly a third of
        {townName}&rsquo;s 3,207 housing units are vacant, overwhelmingly as second homes and
        vacation rentals rather than abandoned properties.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $83K figure is higher than most Montana towns and reflects {townName}&rsquo;s
        demographic mix of professional transplants, successful retirees, and business owners
        alongside the seasonal workers who power the tourism economy. The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} well above the
        comfortable range — expensive, but not as extreme as Whitefish (above 11.0) or
        Big Sky (above 15.0), where home prices have detached entirely from local earnings.
      </p>
      <p>
        For comparison, Kalispell — the Flathead Valley&rsquo;s workaday commercial center 17 miles
        northwest — offers substantially more affordable housing with a broader employment base.
        Polson, on Flathead Lake&rsquo;s south shore, provides a less expensive lakeside alternative,
        while Whitefish commands even steeper premiums driven by the ski-resort economy. {townName}
        occupies a distinct niche: more affordable than Whitefish, more scenic and culturally rich
        than Kalispell, and positioned as the Flathead&rsquo;s arts-and-lake village rather than a
        ski town or regional hub. Montana&rsquo;s zero state sales tax and absence of an estate tax
        provide meaningful relief — particularly for the retiree population that forms a significant
        share of {townName}&rsquo;s demographic base.
      </p>
      <p>
        The low labor force participation rate of {fmtPct(e?.laborForceParticipation ?? null)} is
        largely explained by {townName}&rsquo;s retired population rather than economic distress —
        with unemployment at just {fmtPct(e?.unemploymentRate ?? null)}, those who want work can
        find it. The 17-mile drive to Kalispell connects residents to the valley&rsquo;s hospitals,
        big-box retail, and Glacier Park International Airport, while {townName}&rsquo;s own
        Electric Avenue commercial core handles day-to-day needs with galleries, restaurants, and
        local shops.
      </p>

      <h2>Monthly Budget Estimate</h2>
      <p>
        While individual budgets vary widely, here is a rough breakdown of monthly costs for a
        household earning {townName}&rsquo;s median income:
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 1103, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 1103) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 240, pct: h?.medianHouseholdIncome ? Math.round((240 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 520, pct: h?.medianHouseholdIncome ? Math.round((520 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 380, pct: h?.medianHouseholdIncome ? Math.round((380 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Estimates based on local medians and regional cost indices. Actual costs vary.
        {townName}&rsquo;s resort-area pricing on groceries and dining is partially offset by
        Montana&rsquo;s zero state sales tax and access to Kalispell&rsquo;s larger retail market
        17 miles away.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}&rsquo;s economy has transitioned from its logging and agriculture origins to one
        driven by arts, tourism, and professional services — a shift accelerated by Flathead
        Lake&rsquo;s appeal to retirees and remote workers. The leading employment sector
        is {e?.mainIndustry ?? 'Education & Healthcare'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 17.4}% of employment — anchored by the Bigfork school
        system and regional healthcare providers.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Tourism &amp; Hospitality at {e?.topIndustries?.[1]?.pct ?? 15.8}% of employment reflects
        {townName}&rsquo;s position as a summer destination anchored by Flathead Lake, the Bigfork
        Summer Playhouse, Electric Avenue&rsquo;s galleries and restaurants, and proximity to Glacier
        National Park and Jewel Basin Hiking Area. Professional Services at{' '}
        {e?.topIndustries?.[2]?.pct ?? 14.2}% captures the remote workers, consultants, and small
        firms that have been drawn to {townName}&rsquo;s quality of life. Construction
        at {e?.topIndustries?.[3]?.pct ?? 11.6}% reflects steady building activity in a market
        where demand consistently outstrips supply. The unemployment rate
        is {fmtPct(e?.unemploymentRate ?? null)}, and labor force participation stands
        at {fmtPct(e?.laborForceParticipation ?? null)} — the latter notably low, driven by
        {townName}&rsquo;s substantial retired population rather than a lack of opportunity.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} is a premium community by Montana standards but occupies a middle ground within
        the Flathead Valley&rsquo;s resort hierarchy. Its median home value
        ({fmtDollar(h?.zillowHomeValue ?? null)}) is roughly two-thirds of Whitefish&rsquo;s
        prices and well below Big Sky, yet substantially above Kalispell — the nearest full-service
        city — and Polson on Flathead Lake&rsquo;s more affordable south shore. The key
        differentiator is {townName}&rsquo;s 29% vacancy rate, the highest in the Flathead Valley,
        signaling a market dominated by second homes and vacation rentals. This pushes year-round
        residents into competition with outside buyers who treat {townName} properties as lifestyle
        investments rather than primary residences.
      </p>
      <p>
        Where {townName} stands out is the combination of lakeside living, a vibrant arts community,
        and access to some of Montana&rsquo;s finest outdoor recreation without the ski-resort price
        tag. Jewel Basin Hiking Area — with 35+ miles of trails and 27 alpine lakes — is 10 miles
        east. Glacier National Park is under an hour. Cherry orchards, live theater, and a walkable
        gallery district give {townName} a cultural identity that most Montana resort towns lack. For
        buyers priced out of Whitefish but seeking more character than Kalispell, {townName} is the
        Flathead Valley&rsquo;s arts-and-lake village — a place where summer demand drives the market
        and the community&rsquo;s identity as a creative enclave commands a distinct premium.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'premium ranking'} among Montana towns and a 24% Census-to-Zillow appreciation gap showing continued price growth driven by the second-home market.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 9.2} is well above the national comfort zone but below Whitefish (11+) and Big Sky (15+), positioning {townName} as expensive but not impossibly so for dual-income households.</li>
        <li>Rent at $1,103/month sits at the {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile` : 'mid-range'} statewide — moderate by resort standards, reflecting the year-round worker economy beneath the vacation overlay.</li>
        <li>The 29% vacancy rate is the defining market feature — nearly a third of housing units are second homes or vacation rentals, limiting supply for year-round residents and supporting premium pricing.</li>
        <li>Montana&rsquo;s zero state sales tax and no estate tax benefit {townName}&rsquo;s retiree-heavy demographic, while the 17-mile drive to Kalispell provides access to a full range of services and retail options.</li>
      </ul>
    </article>
  );
}
