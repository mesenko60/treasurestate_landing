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
  if (n == null) return '\u2014';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '\u2014';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${fmt(n)}`;
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

  return (
    <article className="content-section">
      <p>
        {townName}'s housing market benefits from something no other Montana city can claim: state-capital
        stability. As the seat of Montana's government since 1889, {townName} has a deep base of
        year-round public-sector employment that insulates it from the tourism booms and busts that
        drive prices in the Flathead Valley and Gallatin County. Whether you're buying, renting, or
        investing, this guide covers current home values, rental rates, inventory trends, and market dynamics.
        For the broader cost picture, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{h?.inventoryYoY != null ? `${h.inventoryYoY > 0 ? '+' : ''}${h.inventoryYoY}% YoY` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        The gap between ZHVI and list price reflects typical seller optimism, though it's narrower
        here than in resort markets like Whitefish or Big Sky where speculative pricing runs further
        ahead of fundamentals.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019{'\u2013'}2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}Crucially, {townName} remains far more affordable than Bozeman (~$635K), Missoula (~$547K),
        and Kalispell (~$509K){'\u2014'}offering the best value among Montana's cities with populations
        above 30,000.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year${h.inventoryYoY > 0 ? '\u2014the largest inventory expansion among Montana\'s major cities and a significant shift toward buyer-friendly conditions' : ''}.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month.` : ''}
      </p>
      <p>
        {townName}'s geography allows for more development flexibility than mountain-hemmed cities
        like Missoula. The Helena Valley extends north and east with buildable land, and the city
        has seen steady subdivision growth in areas like the North Hills and along the Montana City
        corridor to the south. Infrastructure investment along US-12 and Interstate 15 supports this
        expansion. Unlike the Flathead Valley, {townName} doesn't face the same pressure from
        agricultural land preservation or tourism-driven land speculation{'\u2014'}growth here follows
        a more predictable, government-and-healthcare-driven pattern.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '\u2014'} according
        to Zillow's Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'}, again reflecting
        the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        The rental market here has a different character than Montana's tourism towns. Demand comes
        primarily from state government employees, legislative session participants (the legislature
        meets biennially for 90 days), Carroll College's roughly 1,300 students, and healthcare
        workers at St. Peter's Health. Short-term rental conversion is minimal compared to Glacier-area
        or Yellowstone-area communities{'\u2014'}most rental stock remains in the long-term pool, which
        keeps rents more moderate relative to home values than in places like Kalispell or Bozeman.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}%, a moderate figure that suggests neither extreme tightness nor oversupply.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s layered history. The Last Chance Gulch corridor and
        surrounding neighborhoods feature Victorian-era homes, many beautifully preserved, from the
        city's gold-rush founding in 1864. The original Reeder's Alley district showcases some of
        the oldest remaining structures. Moving outward, mid-century neighborhoods fill the central
        valley, while newer subdivisions spread into the North Hills and toward Montana City. The
        Carroll College area on the west side offers a mix of older homes and student-oriented rentals.
        Unlike resort towns where luxury construction dominates new building, {townName}'s development
        skews toward workforce and family housing{'\u2014'}a reflection of its government-employee
        demographic.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is more attainable than in most comparable
        Montana cities. The ratio of 6.6 compares favorably to Bozeman (8.8), Missoula (7.9), and
        especially Whitefish (11.7). A household earning {townName}'s median income can realistically
        qualify for a mortgage on a median-priced home{'\u2014'}something that's increasingly difficult
        in Montana's pricier markets.
      </p>
      <p>
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year inventory increase` : 'growing inventory'} further
        strengthens the buyer's position. More choices, longer days on market, and less frantic
        bidding mean {townName} buyers have negotiating leverage that's rare elsewhere in Montana
        right now. Renting remains reasonable at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'},
        making it a practical option for newcomers evaluating the area{'\u2014'}and Montana property taxes
        remain well below the national average for those who do buy. The absence of a state sales
        tax also reduces the overall cost burden for homeowners furnishing and maintaining a property.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is anchored by fundamentals that are unusually stable for Montana.
        Government employment doesn't fluctuate with tourist seasons or commodity prices, and the
        state capital designation is permanent{'\u2014'}ensuring a baseline demand floor that resort and
        university towns don't have in the same way.
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year increase in inventory` : 'growing inventory'} is
        the most significant buyer-friendly signal in {townName}'s market today, and the most robust
        inventory growth among Montana's major cities.
      </p>
      <p>
        Key factors to watch include state government budget cycles (which affect hiring and,
        indirectly, housing demand), the pace of new development in the Helena Valley and Montana
        City corridor, and whether buyers priced out of Bozeman and Missoula increasingly view
        {townName} as a viable alternative{'\u2014'}a trend that could accelerate price appreciation.
        {townName}'s fundamental appeal{'\u2014'}state-capital stability, historic Last Chance Gulch
        downtown, Helena-Lewis & Clark National Forest access, and the most affordable housing
        among Montana's larger cities{'\u2014'}positions it well for steady, sustainable growth rather
        than the speculative spikes that characterize Montana's resort markets.
      </p>
    </article>
  );
}
