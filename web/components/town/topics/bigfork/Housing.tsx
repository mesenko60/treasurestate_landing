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
        {townName} sits on the northeast shore of Flathead Lake at 2,940 feet — a resort village
        of roughly 5,000 people with a housing market shaped by its position on the largest natural
        freshwater lake west of the Mississippi. Known as the &ldquo;Village by the Bay,&rdquo;
        {townName} draws second-home buyers, retirees, and arts enthusiasts to a walkable town
        center where the Swan River flows past galleries, restaurants, and the Bigfork Summer
        Playhouse. Sitting 17 miles southeast of Kalispell and 45 miles from Glacier National Park,
        with Jewel Basin Hiking Area just 10 miles east, {townName} commands premium prices driven
        by lakefront scarcity and recreational access — but at a tier below neighboring Whitefish.
        This guide covers current home values, rental rates, inventory trends, and the forces
        shaping {townName}&rsquo;s market.
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

      <h2>Census vs. Zillow: Lakefront Premium in Full Effect</h2>
      <p>
        The Census Bureau&rsquo;s American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — significant growth driven by the pandemic-era migration of remote workers and retirees to Montana's lake communities, a trend that has moderated but not reversed.` : ''}
      </p>
      <p>
        The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)} —
        approaching the million-dollar mark and well above the Zillow index. This premium reflects
        the composition of what sellers bring to market: lakefront parcels, view properties above
        the bay, and renovated homes in the village core command prices that pull the median list
        price substantially above the typical home value. {townName}&rsquo;s market has always been
        bifurcated — modest worker housing in the residential neighborhoods versus premium lakefront
        and view lots — and the list price captures the upper tier disproportionately.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — squarely in the premium tier alongside Whitefish, Big Sky, and other destination communities.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a modest tightening that reflects continued demand and limited new construction in a geographically constrained market.` : ''}
        {h?.newListings != null ? ` New listings are arriving at roughly ${h.newListings} per month, a thin pace for a market of ${fmt(h?.totalHousingUnits ?? null)} total units.` : ''}
      </p>
      <p>
        With an inventory rate of 20.2 homes per 1,000 residents, {townName}&rsquo;s supply
        appears abundant — but that figure is misleading. The high per-capita rate reflects the
        resort-market dynamic: many listings are second homes or vacation properties being turned
        over by out-of-area owners, not primary residences. The effective inventory for year-round
        buyers seeking a primary home is considerably tighter. {townName} is geographically
        constrained by Flathead Lake to the west, the Swan River corridor, and forested hills
        to the east — limiting buildable land within the village footprint. New construction
        tends toward high-end spec homes and custom builds rather than the workforce housing the
        community needs, further concentrating supply at the top of the market.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — moderate by resort standards, reflecting a year-round rental market that serves workers in the hospitality, education, and service sectors.` : ''}
      </p>
      <p>
        At $1,103 per month, {townName}&rsquo;s rent is below Whitefish and Big Sky but above
        Kalispell and Polson, consistent with its mid-tier resort positioning. The vacation-rental
        market is the critical factor shaping {townName}&rsquo;s rental landscape — with a 29%
        vacancy rate driven largely by second homes and short-term rentals, a significant share
        of housing stock is unavailable to long-term tenants. Summer demand pushes nightly rates
        on platforms like Airbnb and VRBO well above monthly lease equivalents, creating strong
        incentives for property owners to choose short-term over year-round tenants. The result is
        a tighter effective rental market than the raw numbers suggest, particularly for seasonal
        workers who need housing during {townName}&rsquo;s peak tourism months.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, the highest in the Flathead Valley and among the highest in Montana. Unlike communities where high vacancy signals abandonment or economic distress, ${townName}'s vacant units are overwhelmingly second homes and vacation rentals owned by out-of-state buyers who use them seasonally.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, most serve the year-round population that keeps ${townName} functioning through its quieter winter months.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}&rsquo;s evolution from logging village to arts
        community to resort destination. The village core along Electric Avenue and Grand Drive
        features a mix of early-1900s cottages, mid-century homes, and newer construction. The
        Swan River corridor adds waterfront properties with a different character from lakefront
        homes. East of town toward Jewel Basin, larger acreage parcels attract buyers seeking
        privacy and mountain views. Lakefront properties on Flathead Lake command the highest
        premiums — a finite resource that underpins {townName}&rsquo;s position at the top of the
        regional market. With only 3,207 total units serving a community of roughly 5,000 people,
        the housing density is low — large lots, seasonal properties, and the geographic constraints
        of water and wilderness all limit how many units the area can absorb.
      </p>

      <h2>Lakefront Premium &amp; Market Segmentation</h2>
      <p>
        {townName}&rsquo;s housing market is really two markets operating in parallel. The village
        residential market — homes in {townName}&rsquo;s established neighborhoods away from the
        water — offers more attainable price points, with properties ranging from $400K to $700K
        for modest homes on standard lots. These serve the year-round population: teachers,
        hospitality workers, retirees on fixed incomes, and small business owners.
      </p>
      <p>
        The lakefront and premium-view market operates on an entirely different plane. Properties
        on Flathead Lake or with unobstructed lake and mountain views routinely list above $1.5M
        and can exceed $3M for larger waterfront parcels. This segment is driven almost entirely
        by outside capital — buyers from Seattle, Portland, California, and the Mountain West who
        are purchasing a lifestyle rather than housing. Cherry orchards along the east shore of
        Flathead Lake add a unique agrarian-aesthetic dimension that further inflates prices in
        that corridor. The median list price of {fmtDollar(h?.medianListPrice ?? null)} is heavily
        influenced by this upper segment, which is why it sits so far above the typical home value.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} is a stretch for most households earning local wages. A dual-income
        professional household can make the numbers work, particularly in the village residential
        market away from the lakefront, but single earners at the median income face a significant
        gap between what they earn and what the market demands.
      </p>
      <p>
        Compared to Kalispell — the Flathead Valley&rsquo;s commercial hub 17 miles northwest —
        {townName} offers a more scenic and culturally rich setting at a meaningful price premium.
        Whitefish, 35 miles north, is even more expensive, driven by Whitefish Mountain Resort
        and its established ski-town economy. Polson, on Flathead Lake&rsquo;s south shore, provides
        a more affordable lakeside alternative with a different character. Montana&rsquo;s property
        taxes remain well below the national average and the state has no sales tax, reducing total
        cost of ownership — a factor that resonates strongly with the retiree buyers who form a
        significant share of {townName}&rsquo;s market. For those not ready to buy, renting
        in {townName} provides access to the village lifestyle at a fraction of the ownership cost,
        though competition for year-round rentals intensifies during peak season.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}&rsquo;s housing market is shaped by structural forces that point toward continued
        strength: Flathead Lake&rsquo;s finite shoreline ensures lakefront scarcity, the arts-and-
        recreation identity draws a steady stream of lifestyle buyers, and limited buildable land
        constrains new supply. The seasonal dynamic — summer viewing season drives the majority of
        sales activity — creates predictable market rhythms that experienced buyers and sellers
        navigate accordingly.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year drop in inventory suggests continued price firmness, with sellers holding leverage as long as demand from second-home buyers persists.` : ''}
      </p>
      <p>
        Key factors to watch include the trajectory of remote work (which has been a significant
        demand driver since 2020), potential regulation of short-term vacation rentals (a
        contentious issue in many Montana resort communities), and whether Glacier National
        Park&rsquo;s growing visitation numbers continue to benefit gateway communities like
        {townName}. The village&rsquo;s identity as one of the &ldquo;100 Best Small Art Towns
        in the Nation&rdquo; provides a cultural moat that generic resort towns lack — a
        differentiator that sustains demand even when broader market conditions cool. For buyers
        seeking Flathead Lake access with a walkable, arts-centered community, {townName} remains
        the premier option — a market where the competition is not other buyers so much as the
        finite geography of a village built between a great lake and the Swan Range.
      </p>
    </article>
  );
}
