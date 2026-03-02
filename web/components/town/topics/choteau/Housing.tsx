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
        {townName} sits 60 miles northwest of Great Falls along US-89 at 3,816 feet — a town
        of roughly 1,721 people and the Teton County seat, with a housing market shaped by its
        role as the gateway to the Rocky Mountain Front. The Bob Marshall Wilderness and Lewis
        and Clark National Forest rise to the west, while open agricultural land stretches east
        across the Great Plains. {townName} is not a resort town and has never been a boom market —
        it's a county seat where ranching, healthcare, and tourism sustain a modest but stable
        economy. Prices remain grounded by local wages, and a high vacancy rate means housing is
        available in a way that most Montana markets can no longer claim. This guide covers current
        home values, rental rates, inventory trends, and the forces shaping {townName}'s market.
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

      <h2>Census vs. Zillow: Appreciation in an Agricultural Town</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — significant growth for a small agricultural town, and a sign that even Montana's most rural markets are feeling the broader repricing that has swept the state. Still, ${fmtDollar(zillowValue)} remains one of the lowest values in Montana, keeping ${townName} firmly in affordable territory.` : ''}
      </p>
      <p>
        Median list price data is not directly available for {townName}'s small market, but the
        Zillow Home Value Index of {fmtDollar(zillowValue)} serves as the current benchmark. In a
        market of only 834 total units, individual sales can move the median significantly — a
        single ranch property or a renovated historic home can shift the numbers in ways that
        wouldn't register in a larger market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — just below the midpoint, reflecting its position as affordable but not the cheapest in the state.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a dramatic doubling that represents a meaningful shift toward buyer-friendly conditions. Where a year ago just 9 homes were available, today 18 are listed, giving purchasers substantially more choice.` : ''}
      </p>
      <p>
        With an inventory rate of 10.5 homes per 1,000 residents, {townName}'s supply is moderate
        and notably more available than tighter Montana markets. The market mix includes in-town
        homes on the established grid, agricultural properties on surrounding ranchland, and
        occasional parcels closer to the Rocky Mountain Front. New construction is limited — this
        is not a growth market with subdivisions going in — but the existing housing stock provides
        a range of options from modest worker cottages to larger ranch homes. The doubling of
        inventory suggests a buyers' market may be developing, a rarity in Montana where most
        communities remain supply-constrained.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — one of the lowest rental markets in the state.` : ''}
      </p>
      <p>
        At $713 per month, {townName}'s rent is roughly half of Bozeman or Missoula and below
        Great Falls rates. The low rents reflect {townName}'s small economy and distance from
        major employment centers, but they also make the town a genuine option for remote workers,
        retirees, and anyone seeking affordable Montana living with direct access to the Rocky
        Mountain Front. Freezout Lake's birdwatching tourism and summer Rocky Mountain Front
        visitors create some seasonal demand, but the effect on {townName}'s rental market is
        minimal — most visitors stay at the Stage Stop Inn or other motels rather than competing
        for residential rentals.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, notably high by Montana standards. This elevated rate reflects several factors: seasonal and second homes owned by those drawn to the Rocky Mountain Front, a retiree population that reduces household formation, and some older housing stock that has not been updated. With 13 units specifically vacant-for-sale, there is genuine availability for buyers — a condition increasingly rare in Montana.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s history as a frontier town and county seat.
        The grid-pattern downtown features early 20th-century commercial buildings and adjacent
        residential blocks with craftsman homes and worker cottages. Some properties carry the
        western character that defines Rocky Mountain Front towns — wide porches, simple
        construction, and views of the mountains to the west. Ranches and agricultural properties
        in the surrounding area add to the market mix, with some larger parcels attracting buyers
        interested in land as much as the home itself — David Letterman's 2,700-acre ranch nearby
        being the most notable example. The retirement and second-home component is evident in
        the low labor force participation rate (54.3%), suggesting a population that includes
        people who chose {townName} for lifestyle rather than employment.
      </p>

      <h2>Rocky Mountain Front &amp; Tourism Growth</h2>
      <p>
        {townName}'s housing market is increasingly influenced by its position as the gateway
        to the Rocky Mountain Front — the dramatic escarpment where the Northern Rockies abruptly
        meet the Great Plains. The Bob Marshall Wilderness, one of the largest wilderness areas
        in the lower 48, draws hikers, hunters, and outfitters. Freezout Lake's spring migration
        of hundreds of thousands of snow geese and tundra swans has become a nationally recognized
        wildlife spectacle. Egg Mountain, where paleontologist Jack Horner discovered dinosaur
        nesting sites in the 1970s, and the Old Trail Museum add cultural and scientific tourism.
      </p>
      <p>
        Teton Pass Ski Area, 16 miles west, provides winter recreation without the resort-town
        price tag. {townName}'s position on US-89 between Glacier National Park and Yellowstone
        places it on one of Montana's great scenic corridors, though the town sees pass-through
        traffic rather than destination tourism at scale. These assets could drive gradual
        appreciation — particularly if remote workers and retirees continue to discover the
        town — but {townName} is unlikely to see the speculative surges of a Big Sky or Whitefish.
        The town's appeal is its authenticity: a county seat with a courthouse, a hospital, and
        ranches stretching to the horizon, not a manufactured resort experience.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} requires planning but remains achievable for dual-income households. At
        current Zillow values, a median-priced home would push monthly mortgage payments above the
        standard 28% of gross income for a single-earner household at the median, but the gap
        is far less severe than in Bozeman (ratio above 10), Missoula (above 9), or resort
        communities where buying on local wages is effectively impossible.
      </p>
      <p>
        The high vacancy rate (12.2%) and doubled inventory suggest buyers have negotiating power
        that is uncommon in today's Montana market. Unlike Great Falls or Bozeman, where multiple
        offers and above-asking prices are common, {townName}'s market gives buyers time and
        options. Montana's property taxes remain well below the national average and the state has
        no sales tax, reducing total cost of ownership. For those not ready to buy, renting at
        {townName}'s rates — {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile statewide` : 'among the lowest in Montana'} — offers
        one of the most affordable entry points in the state.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by a combination of structural factors: the growing
        recognition of the Rocky Mountain Front as a recreation and lifestyle destination, the
        appeal of genuine small-town Montana living at an affordable price point, and the
        retirement/second-home demand that its low labor force participation rate suggests is
        already underway. These forces are gradual rather than explosive — {townName} is
        unlikely to see the speculative surges of a Big Sky or Whitefish, but the 45%
        Census-to-Zillow appreciation gap shows the direction is firmly upward.
      </p>
      <p>
        Key factors to watch include whether the inventory doubling (+100% YoY) persists and
        creates a sustained buyers' market, the evolution of Freezout Lake and Rocky Mountain
        Front tourism, and whether remote workers and retirees continue to discover {townName}'s
        combination of affordability and landscape. The 12.2% vacancy rate provides a cushion that
        most Montana towns lack — housing is available here, and that availability may prove to be
        {townName}'s most attractive feature for buyers tired of competing in overheated markets
        elsewhere in the state. For those seeking Montana's mountain-and-prairie landscape at a
        working price point, {townName} remains one of the state's most compelling value
        propositions — a town where the real estate market still reflects local economics rather
        than outside speculation.
      </p>
    </article>
  );
}
