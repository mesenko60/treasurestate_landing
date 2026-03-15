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
        {townName} is a town of roughly 1,989 people in Gallatin County, sitting at 4,075 feet
        where the Jefferson, Madison, and Gallatin rivers converge to form the Missouri River —
        earning it the title &ldquo;Birthplace of the Missouri.&rdquo; Lewis and Clark named
        the three rivers here on July 27, 1805, and Sacagawea was captured near this site five
        years earlier. Founded in 1908 by John Q. Adams as a division point for the Milwaukee
        Road railroad, {townName} retains its small-town railroad character while absorbing
        spillover demand from Bozeman, just 31 miles east on I-90. The historic Sacajawea Hotel
        (1910) anchors downtown, and Missouri Headwaters State Park sits four miles away. This
        guide breaks down housing, income, affordability, and employment data so you know what
        it actually costs to live here.
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
        dramatically in recent years thanks to Bozeman spillover. The median home value stands at{' '}
        {fmtDollar(h?.zillowHomeValue ?? null)} according to Zillow's Home Value Index
        {h?.zillowHomeValueDate ? ` as of ${new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.
        The U.S. Census Bureau's American Community Survey puts the figure at{' '}
        {fmtDollar(h?.medianHomeValue ?? null)} — a 40% gap that reflects rapid appreciation
        driven by buyers priced out of Bozeman seeking value along the I-90 corridor. The median
        list price of $680K sits well above the Zillow estimate, reflecting new construction
        premiums and sellers pricing to the Bozeman-adjacent market.
        {h?.homeValuePercentile != null ? ` ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile among Montana towns — well above average, pulled upward by Gallatin County demand.` : ''}
      </p>
      <p>
        Renters pay a median of {h?.zillowRent ? `$${fmt(h.zillowRent)}` : fmtDollar(h?.medianRent ?? null)} per month.
        {h?.rentPercentile != null ? ` Rents sit at the ${ordinal(h.rentPercentile)} percentile — above the state median, reflecting Gallatin County's tight rental market.` : ''}
        {' '}At $1,263 per month, rent in {townName} is substantially below Bozeman rates but
        well above what you'd pay in Butte or Anaconda. The 1.8% vacancy rate means available
        rentals are exceptionally scarce — with only 895 total housing units serving roughly 2,000
        people, there is essentially no slack in the system.
        For a detailed look at market trends, inventory, and buying conditions, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
      </p>

      <h2>Income &amp; Affordability</h2>
      <p>
        The median household income in {townName} is {fmtDollar(h?.medianHouseholdIncome ?? null)},
        {h?.incomePercentile != null ? ` placing the town at the ${ordinal(h.incomePercentile)} percentile among Montana communities` : ''}.
        That $80K figure is strong for a small Montana town and reflects the Bozeman commuter
        effect — many residents earn Bozeman wages while living in {townName}'s more affordable
        housing. Industrial employers like CRH Cement and Imerys Talc also contribute solid
        blue-collar incomes. The affordability ratio{' '}&mdash;{' '}
        median home value divided by median household income{' '}&mdash;{' '}is{' '}
        {h?.affordabilityRatio ?? '—'}. The commonly cited national benchmark is 3.0 to 5.0.
        A ratio of {h?.affordabilityRatio ?? 'this level'} puts {townName} above the comfortable
        range but meaningfully below Bozeman's ratio of roughly 10, making it a realistic
        alternative for households priced out of the college town.
      </p>
      <p>
        For comparison, Belgrade — another Bozeman-adjacent community — has similar pricing
        pressure but less historic character. Butte, 64 miles west, offers a ratio closer to 4.4
        with much cheaper housing but fewer employment connections to Bozeman. {townName}'s 6.7
        ratio means housing is stretched relative to incomes but still within reach for
        dual-income households, especially with Montana's lack of a state sales tax providing
        meaningful relief on everyday expenses like groceries, clothing, and household goods.
      </p>
      <p>
        {townName}'s location on I-90 makes the 31-mile Bozeman commute practical for daily
        employment, while the 64-mile drive to Butte keeps that city's services and airport
        within reach. The town's own commercial district along Main Street handles most daily
        needs without requiring the drive east.
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
            { cat: 'Housing (rent or mortgage)', amt: h?.zillowRent ?? h?.medianRent ?? 1263, pct: h?.medianHouseholdIncome ? Math.round(((h?.zillowRent ?? h?.medianRent ?? 1263) / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Utilities', amt: 220, pct: h?.medianHouseholdIncome ? Math.round((220 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Groceries', amt: 500, pct: h?.medianHouseholdIncome ? Math.round((500 / (h.medianHouseholdIncome / 12)) * 100) : null },
            { cat: 'Transportation', amt: 400, pct: h?.medianHouseholdIncome ? Math.round((400 / (h.medianHouseholdIncome / 12)) * 100) : null },
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
        Transportation costs are higher in {townName} if commuting to Bozeman (31 mi each way),
        and the absence of a state sales tax reduces everyday expenses compared to most U.S. states.
      </p>

      <h2>Employment &amp; Economic Context</h2>
      <p>
        {townName}'s economy blends Bozeman-corridor commuter employment with local industrial
        and service jobs. The leading sector is {e?.mainIndustry ?? 'Retail'}, which accounts
        for {e?.topIndustries?.[0]?.pct ?? 19.4}% of employment. CRH Cement Plant and Imerys
        Talc Mill are major industrial employers providing well-paying blue-collar jobs uncommon
        in most small Montana towns.
        {e?.topIndustries && e.topIndustries.length >= 3
          ? ` The next largest sectors are ${e.topIndustries[1].name} (${e.topIndustries[1].pct}%) and ${e.topIndustries[2].name} (${e.topIndustries[2].pct}%).`
          : ''}
      </p>
      <p>
        Tourism &amp; Hospitality at {e?.topIndustries?.find(i => i.name.includes('Tourism'))?.pct ?? 9}% of employment reflects
        Missouri Headwaters State Park, Lewis &amp; Clark Caverns (16 mi), the Sacajawea Hotel,
        and the town's position as a gateway to outdoor recreation along the Jefferson and Madison
        rivers. The unemployment rate is {fmtPct(e?.unemploymentRate ?? null)} — essentially zero,
        indicating a labor market so tight that employers struggle to fill positions. Labor force
        participation stands at {fmtPct(e?.laborForceParticipation ?? null)} — high, reflecting
        a working-age population that is overwhelmingly employed.
        For the full industry breakdown, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>

      <h2>How {townName} Compares</h2>
      <p>
        {townName} occupies a distinct niche in the Bozeman-adjacent market. Its median home value
        ({fmtDollar(h?.zillowHomeValue ?? null)}) is well below Bozeman ($703K) but above
        working-class towns like Butte ($220K) and Anaconda ($280K). The affordability
        ratio of {h?.affordabilityRatio ?? '6.7'} sits between Bozeman's ~10 and Butte's 4.4 —
        not cheap, but not the severe stress that makes homeownership impossible on local wages.
      </p>
      <p>
        Where {townName} stands out is its combination of Bozeman-commutable location, genuine
        historic character (the 1910 Sacajawea Hotel, railroad-era downtown), and the unique
        distinction of sitting at the birthplace of the Missouri River. Belgrade offers a
        similar commuting proposition but with suburban sprawl rather than small-town identity.
        Manhattan and Amsterdam are smaller and more agricultural. For buyers looking at the
        Gallatin Valley's western fringe, {townName} offers the most distinctive sense of place —
        a railroad town at the headwaters of America's longest river, with I-90 access and
        proximity to Lewis &amp; Clark Caverns, Madison Buffalo Jump, and Missouri Headwaters
        State Park.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Housing is the biggest cost driver, with a {h?.homeValuePercentile ? `${ordinal(h.homeValuePercentile)} percentile ranking` : 'high ranking'} among Montana towns and a 40% Census-to-Zillow appreciation gap showing aggressive Bozeman-spillover price growth.</li>
        <li>The affordability ratio of {h?.affordabilityRatio ?? 6.7} is above the national comfort zone but well below Bozeman (~10), keeping {townName} accessible to dual-income households and Bozeman commuters.</li>
        <li>Rent at $1,263/month is {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'above the state median'} — not cheap, but substantially less than Bozeman, reflecting Gallatin County demand in a tiny 895-unit housing stock.</li>
        <li>The economy benefits from a 1.1% unemployment rate, industrial employers (CRH Cement, Imerys Talc), and Bozeman commuter incomes that push the median household income to $80K ({e?.topIndustries?.[0]?.pct ?? 19.4}% Retail, {e?.topIndustries?.[1]?.pct ?? 17.2}% Construction, {e?.topIndustries?.[2]?.pct ?? 13.2}% Education &amp; Healthcare).</li>
        <li>Montana's zero state sales tax and {townName}'s I-90 access to Bozeman (31 mi) and Butte (64 mi) keep everyday costs manageable, while Missouri Headwaters State Park and Lewis &amp; Clark Caverns add recreation value unmatched by other small Gallatin County towns.</li>
      </ul>
    </article>
  );
}
