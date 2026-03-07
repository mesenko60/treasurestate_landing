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
        {townName}'s housing market is unlike any other in Montana{'\u2014'}a micro-market of just{' '}
        {fmt(h?.totalHousingUnits ?? null)} total housing units where nearly half sit vacant or are
        used seasonally, only {fmt(h?.forSaleInventory ?? null)} homes are listed for sale at any
        given time, and short-term vacation rentals dominate the available stock. With Yellowstone's
        busiest entrance one mile away and a year-round population of just 1,202, this is a market
        driven almost entirely by tourism investment and second-home demand rather than local housing
        needs. Whether you're buying, renting, or investing, this guide covers current values,
        inventory dynamics, and what makes {townName}'s market one of the most constrained and
        unusual in the Northern Rockies. For the broader cost picture, see
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
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        These are extraordinary numbers for a town of 1,202 year-round residents and reflect the
        premium buyers pay for proximity to Yellowstone National Park and the income-generating
        potential of vacation rental properties.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        based on a 5-year rolling average (2019{'\u2013'}2023) that lags the current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}Many properties in {townName} function primarily as short-term rental investments rather
        than primary residences, which creates pricing dynamics more similar to a resort market
        than a traditional small-town housing market. Buyers evaluate properties based on projected
        rental income during the June{'\u2013'}September Yellowstone season and the winter snowmobile
        season, not on local wage affordability.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale{'\u2014'}an
        extraordinarily small inventory that makes this one of the tightest markets in Montana.
        {h?.inventoryYoY != null ? ` This represents a ${h.inventoryYoY > 0 ? '+' : ''}${h.inventoryYoY}% change compared to the same period last year.` : ''}
        {h?.newListings != null ? ` New listings arrive at roughly ${h.newListings} per month\u2014so few that a single transaction can meaningfully shift market dynamics.` : ''}
      </p>
      <p>
        The supply constraint in {townName} is both structural and economic. The town is surrounded
        on three sides by Gallatin National Forest and bordered by Yellowstone National Park to the
        east{'\u2014'}there is essentially no room to expand. The existing housing stock is finite and
        largely built out. More importantly, the economics of short-term vacation rentals create a
        powerful incentive for property owners to keep units off the traditional sale and long-term
        rental markets. A cabin that generates $200{'\u2013'}$400 per night during peak season represents
        a far higher return than a year-round lease, and this dynamic removes properties from the
        market that would otherwise be available to local workers and year-round residents.
      </p>

      <h2>Rental Market</h2>
      <p>
        The long-term rental market in {townName} is, for practical purposes, nearly nonexistent.
        Zillow's Observed Rent Index returns no data for the town{'\u2014'}a telling indicator that
        there are too few traditional long-term rental transactions to generate a statistically
        meaningful index. The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'},
        but this captures a mix of year-round and seasonal arrangements.
      </p>
      <p>
        The vacation-rental economy has consumed nearly all available rental stock. Property owners
        who might otherwise rent to year-round tenants at $1,000{'\u2013'}$1,500 per month can earn that
        amount in a single week during Yellowstone's peak summer season. The result is a
        {' '}{h?.vacancyRate != null ? `${h.vacancyRate}%` : 'massive'} vacancy rate{'\u2014'}not because
        units sit empty, but because nearly half the housing stock is classified as seasonal,
        recreational, or occasional use. Finding a year-round rental in {townName} requires local
        connections, employer-provided housing, or exceptional timing. Many seasonal workers live
        in employer-managed housing, RVs, or commute from communities outside the immediate area.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units{'\u2014'}a remarkably
        small stock for a town that hosts millions of visitors annually.
        {h?.vacancyRate != null ? ` The overall vacancy rate of ${h.vacancyRate}% is the highest in our analysis by a wide margin, reflecting the dominance of vacation and seasonal properties rather than a healthy surplus of available units.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s identity as a gateway community. Log cabins, small
        motels converted to condominiums, and modular homes make up much of the inventory. Many
        properties were built or renovated with short-term rental use in mind{'\u2014'}furnished,
        managed by property management companies, and marketed to Yellowstone visitors. Larger
        homes and custom builds on the town's periphery cater to second-home buyers from Bozeman,
        Salt Lake City, and beyond. True workforce housing{'\u2014'}affordable units designed for
        year-round residents earning tourism wages{'\u2014'}is virtually nonexistent, and this gap
        is the defining housing challenge in {townName}.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} on local wages alone is nearly impossible.
        The ratio of 10.5 exceeds Bozeman (8.8) and approaches Whitefish (11.7){'\u2014'}towns with
        far more diversified economies and larger labor markets. Most buyers in {townName} are not
        purchasing primary residences with local income; they are investors acquiring vacation
        rental properties or second-home buyers with equity from other markets.
      </p>
      <p>
        For year-round residents, the calculus is difficult. With only {fmt(h?.forSaleInventory ?? null)} active
        listings and no meaningful long-term rental market, options are severely limited. Some
        employers in {townName}{'\u2014'}particularly park concessioners, hotels, and larger
        restaurants{'\u2014'}provide seasonal housing for workers, which partially offsets the
        impossible market conditions. Montana's low property taxes and absence of a state sales
        tax reduce ongoing ownership costs for those who do manage to purchase, but the barrier
        to entry remains the highest of any small town in our analysis.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is defined by absolute scarcity and tourism-driven demand.
        The combination of national-forest boundaries preventing expansion, vacation-rental
        economics pulling units from the long-term market, and Yellowstone's status as one of the
        world's most visited national parks creates a floor under prices that is unlikely to soften.
        {h?.inventoryYoY != null && h.inventoryYoY > 0 ? ` The ${h.inventoryYoY}% year-over-year increase in inventory provides a small measure of relief, but from a base of just ${fmt(h?.forSaleInventory ?? null)} listings, even a meaningful percentage change represents only a handful of additional properties.` : ''}
      </p>
      <p>
        Key factors to watch include Yellowstone visitation trends, any local or county regulatory
        action on short-term rentals, and the growth of Big Sky Resort (45 miles northwest), which
        increasingly competes for both visitors and workforce housing. The fundamental constraint
        remains geographic{'\u2014'}{townName} is a small town physically enclosed by public lands,
        and that will not change. For year-round residents and local employers, the housing
        challenge will likely intensify unless workforce housing solutions emerge through
        public-private partnerships or regulatory intervention.
      </p>
    </article>
  );
}
