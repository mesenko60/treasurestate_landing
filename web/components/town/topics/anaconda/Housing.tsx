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
    forSaleInventory: number | null;
    forSaleInventoryDate: string | null;
    inventoryYoY: number | null;
    medianListPrice: number | null;
    newListings: number | null;
    totalHousingUnits: number | null;
    vacancyRate: number | null;
  } | null;
};

function fmt(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${fmt(n)}`;
}

function fmtPct(n: number | null): string {
  if (n == null) return '—';
  return `${n > 0 ? '+' : ''}${n}%`;
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

export default function Housing({ townName, slug, housing }: Props) {
  const h = housing;
  const dateStr = h?.zillowHomeValueDate
    ? new Date(h.zillowHomeValueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const censusValue = h?.medianHomeValue ?? null;
  const zillowValue = h?.zillowHomeValue ?? null;
  const appreciation =
    censusValue && zillowValue
      ? Math.round(((zillowValue - censusValue) / censusValue) * 100)
      : null;

  const occupiedUnits = h?.totalHousingUnits && h?.vacancyRate != null
    ? Math.round(h.totalHousingUnits * (1 - h.vacancyRate / 100))
    : null;
  const vacantUnits = h?.totalHousingUnits && occupiedUnits
    ? h.totalHousingUnits - occupiedUnits
    : null;

  return (
    <article className="content-section">
      <p>
        {townName} sits 26 miles west of Butte in the upper Clark Fork Valley at 5,335 feet —
        a consolidated city-county of roughly 9,421 people with a housing market shaped by its
        copper-smelting past and its growing identity as a recreation-adjacent affordable
        alternative in southwest Montana. The Washoe Smelter closed in 1980, and decades of
        Superfund cleanup have both constrained and created opportunity: the Old Works Golf Course
        was built on reclaimed smelter land, and additional remediated parcels are opening new
        development possibilities. Georgetown Lake, the Anaconda-Pintler Wilderness, and Discovery
        Ski Area draw outdoor enthusiasts, while modest prices attract buyers priced out of
        Bozeman, Missoula, and even Butte. This guide covers current home values, rental rates,
        inventory trends, and the forces shaping {townName}'s market.
        For the broader cost picture, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Census Median</div><div style={cardValue}>{fmtDollar(h?.medianHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{fmtPct(h?.inventoryYoY ?? null)} YoY</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '—'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Census vs. Zillow: Steady Appreciation in a Working-Class Market</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — meaningful growth for a town historically known for flat or declining values, and a sign that southwest Montana's broader price surge is reaching even its most affordable corners.` : ''}
      </p>
      <p>
        The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)},
        above the Zillow index by roughly $38K. The premium indicates a seller's market: with
        inventory down sharply and new listings arriving slowly, sellers are pricing above recent
        comps and finding buyers. Unlike resort markets where luxury properties skew the list
        price, {townName}'s gap is driven by general supply-demand dynamics — too few homes for
        the buyers who've discovered {townName}'s value proposition.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — firmly mid-market.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a significant tightening that limits buyer options and supports pricing above recent baselines.` : ''}
        {h?.newListings != null ? ` New listings are arriving at roughly ${h.newListings} per month, a thin pace for a market of ${fmt(h?.totalHousingUnits ?? null)} total units.` : ''}
      </p>
      <p>
        With an inventory rate of 4.5 homes per 1,000 residents, {townName}'s supply is lean but
        not critically constrained. The consolidated city-county structure means housing stock
        extends beyond the city core into surrounding Deer Lodge County — ranch properties, parcels
        along the Georgetown Lake road, and scattered rural residential lots that broaden the
        effective market. New development is modest: {townName} lacks the construction boom seen in
        Bozeman or the Flathead Valley, though Superfund-remediated land — particularly in the Old
        Works area — represents a unique source of future buildable acreage that most Montana towns
        simply don't have.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — one of the lowest rental markets in the state.` : ''}
      </p>
      <p>
        At $661 per month, {townName}'s rent is roughly half of Bozeman or Missoula and even below
        nearby Butte. The low rents reflect {townName}'s smaller economy and limited demand from
        high-wage employers, but they also make the town a genuine option for workers, retirees,
        and anyone seeking affordable Montana living without sacrificing access to outdoor
        recreation. Georgetown Lake's vacation-rental market draws some units into short-term use
        during summer and ski season, but the effect on in-town rental supply is limited —
        most short-term activity clusters along the lake corridor rather than in {townName}'s
        residential neighborhoods.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, notably higher than the Montana average. This elevated rate reflects several factors: seasonal and second homes near Georgetown Lake, the lingering effects of population decline since the smelter closure, and some housing stock that has deteriorated beyond easy rehabilitation.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock tells {townName}'s story in layers. The historic core along Main Street
        and East Park Avenue features turn-of-the-century homes built during the copper boom —
        craftsman bungalows, brick Victorians, and worker cottages with genuine architectural
        character. Mid-century neighborhoods expanded as the smelter workforce grew. Newer
        construction is sparse but includes some subdivisions on the town's edges and properties
        along the Georgetown Lake road. The consolidated city-county government means no separate
        municipal and county zoning barriers — a structural advantage for development that most
        Montana communities don't share.
      </p>

      <h2>Superfund Legacy &amp; New Development</h2>
      <p>
        The Anaconda Smelter's closure in 1980 left behind one of the largest Superfund sites in
        the western United States. Decades of EPA-led remediation have cleaned contaminated soil,
        capped waste areas, and reclaimed land that was once off-limits. The most visible success
        is the Jack Nicklaus-designed Old Works Golf Course, built directly on former smelter
        processing grounds — a nationally recognized example of Superfund-to-recreation conversion.
      </p>
      <p>
        Additional remediated parcels are becoming available for development, creating an unusual
        opportunity in {townName}'s housing market. While most small Montana towns are constrained
        by geography, federal land, or infrastructure limits, {townName} has land that is
        progressively re-entering the usable inventory. The pace depends on ongoing EPA processes
        and local planning decisions, but the trajectory is clear: Superfund cleanup is slowly
        unlocking buildable acreage that could meaningfully expand {townName}'s housing supply in
        the coming decades. For a town of 9,421 people with 5,506 existing units, even modest new
        development on these parcels would have a material impact on availability and pricing.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} requires planning but remains achievable for dual-income households. At
        current prices, a median-priced home would push monthly mortgage payments above the
        standard 28% of gross income for a single-earner household at the median, but the gap
        is far less severe than in Bozeman (ratio above 10), Missoula (above 9), or resort
        communities where buying on local wages is effectively impossible.
      </p>
      <p>
        Compared to Butte — the nearest comparable city at 34,000 population — {townName} offers
        lower absolute prices but also lower incomes, yielding a slightly higher affordability
        ratio (5.7 vs. Butte's 4.4). Buyers weighing the two markets should consider {townName}'s
        superior recreation access (Georgetown Lake, Pintler Wilderness, Old Works) against
        Butte's broader job market and services. Montana's property taxes remain well below the
        national average and the state has no sales tax, reducing total cost of ownership. For
        those not ready to buy, renting at {townName}'s rates offers one of the most affordable
        entry points in the state.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by a combination of structural factors: the ongoing
        repricing of southwest Montana as Bozeman and Missoula push buyers outward, Superfund
        remediation opening new land, and the town's recreation assets drawing a new generation
        of residents who value outdoor access over urban amenities. These forces are gradual
        rather than explosive — {townName} is unlikely to see the speculative surges of a Big Sky
        or Whitefish, but the direction is firmly upward.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year drop in inventory suggests continued price firmness in the near term, with sellers holding leverage as long as supply remains constrained.` : ''}
      </p>
      <p>
        Key factors to watch include the pace and scale of Superfund land becoming available for
        development, whether remote workers and retirees continue to discover {townName}'s value
        proposition, and the evolution of Georgetown Lake's recreation economy. The consolidated
        city-county government gives {townName} a unique ability to coordinate land-use planning
        without the jurisdictional friction that slows development in many Montana communities.
        For buyers seeking southwest Montana at a working-class price point with genuine recreation
        access, {townName} remains one of the region's most compelling markets — a town whose best
        days may be ahead of it as the smelter-era stigma fades and the outdoor-recreation
        identity takes hold.
      </p>
    </article>
  );
}
