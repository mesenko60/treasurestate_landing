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

function fmtPct(n: number | null): string {
  if (n == null) return '\u2014';
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

  const censusToZillowGap = h?.medianHomeValue && h?.zillowHomeValue
    ? Math.round(((h.zillowHomeValue - h.medianHomeValue) / h.medianHomeValue) * 100)
    : null;

  return (
    <article className="content-section">
      <p>
        {townName}{'\u2019'}s housing market is a small-town Montana market under rapidly growing
        pressure. With just {fmt(h?.totalHousingUnits ?? null)} total housing units, only{' '}
        {fmt(h?.forSaleInventory ?? null)} active listings, and inventory down{' '}
        {h?.inventoryYoY != null ? `${Math.abs(h.inventoryYoY)}%` : '23%'} year over year, this
        is a market where scarcity defines the conversation. The University of Montana Western
        creates year-round rental demand, seasonal tourism along I-15 and toward Bannack State
        Park adds pressure, and ranch buyers seeking large acreage with water rights compete at
        the top end. Despite all of this, {townName} remains far more affordable than the
        Bozeman{'\u2013'}Missoula corridor{'\u2014'}though that gap is narrowing fast. For the broader cost
        picture, see our{' '}
        <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{h?.inventoryYoY != null ? fmtPct(h.inventoryYoY) + ' YoY' : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Census vs. Zillow: Rapid Appreciation</h2>
      <p>
        The Census Bureau{'\u2019'}s American Community Survey reports a median home value
        of {fmtDollar(h?.medianHomeValue ?? null)}, based on the 5-year rolling average
        (2019{'\u2013'}2023). The Zillow Home Value Index, which tracks current market conditions,
        puts {townName}{'\u2019'}s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)}.
        {censusToZillowGap != null ? ` That ${censusToZillowGap}% gap between the Census figure and Zillow\u2019s current estimate signals how rapidly ${townName} has appreciated in recent years\u2014values have outpaced the Census survey\u2019s ability to keep up.` : ''}
      </p>
      <p>
        The median list price of {fmtDollar(h?.medianListPrice ?? null)} for currently active
        listings runs even higher than the Zillow index, suggesting sellers are pricing above
        recent comps{'\u2014'}a sign of a market where demand outstrips supply and sellers feel
        confident testing higher price points.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values.` : ''}
        {' '}While still well below Bozeman (~$635K) or Whitefish (~$483K), {townName} is no longer
        the bargain it was even five years ago.
      </p>

      <h2>Inventory & Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale{'\u2014'}one
        of the tightest inventories of any Montana town in our analysis.
        {h?.inventoryYoY != null ? ` Inventory is down ${Math.abs(h.inventoryYoY)}% year over year, meaning the already-constrained market is contracting further.` : ''}
        {h?.newListings != null ? ` New listings arrive at roughly ${h.newListings} per month\u2014a pace so slow that a single motivated buyer can shift market dynamics.` : ''}
      </p>
      <p>
        The supply constraint is partly structural. {townName} is a town of roughly 4,300 people
        in the broad Beaverhead Valley, surrounded by vast ranching country. While the valley floor
        offers theoretical room to build, the small local labor pool limits new construction{'\u2014'}there
        simply aren{'\u2019'}t enough builders, electricians, and plumbers to support significant subdivision
        development. Most new homes are custom builds on individual lots, not large-scale projects.
        The housing stock reflects {townName}{'\u2019'}s evolution from a mining-era supply town and railroad
        stop through its current role as a university and ranching community{'\u2014'}expect everything from
        early-1900s bungalows near downtown to 1970s ranch-style homes to scattered newer construction
        on the town{'\u2019'}s periphery.
      </p>

      <h2>Rental Market & University Impact</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '\u2014'} according
        to Zillow{'\u2019'}s Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'}, reflecting
        the multi-year survey window.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        The University of Montana Western, with its roughly 1,500 students, is the single largest
        driver of rental demand. The university{'\u2019'}s unique{' '}
        {'\u201C'}Experience One{'\u201D'} block scheduling draws students year-round, not just during
        the traditional academic calendar, which means rental pressure doesn{'\u2019'}t follow the seasonal
        lull that other college towns see in summer. Faculty and staff housing needs add further
        demand. Seasonal tourism{'\u2014'}visitors to Bannack State Park, Beaverhead-Deerlodge National
        Forest, and the Big Hole Valley{'\u2014'}has increasingly pushed some rental stock toward
        short-term vacation use, further tightening the long-term pool. For landlords, {townName}
        offers better rental yields than its home prices might suggest, given the consistent
        university-driven demand floor.
      </p>

      <h2>Vacancy Analysis</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units, of which
        approximately 1,646 are occupied and 190 are vacant{'\u2014'}a vacancy rate
        of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '10.3%'}. This rate is higher than
        Bozeman (~3%) or Missoula (~4%) but somewhat misleading in context. A significant portion
        of {townName}{'\u2019'}s vacant units are seasonal or occasional-use properties{'\u2014'}ranches and
        cabins in the surrounding Beaverhead Valley that are counted in the Census but don{'\u2019'}t
        function as available housing for residents.
      </p>
      <p>
        When seasonal vacancies are excluded, the effective vacancy rate for year-round housing in
        town is considerably lower. The combination of university-driven rental demand, limited new
        construction, and the conversion of some long-term rentals to vacation use means that
        functional availability{'\u2014'}units a renter or buyer can actually access{'\u2014'}is tighter than
        the headline vacancy number suggests. This structural mismatch between Census-counted
        vacancies and actual market availability is common in Montana{'\u2019'}s smaller towns with
        significant surrounding ranch and recreational land.
      </p>

      <h2>Ranch & Rural Properties</h2>
      <p>
        Beyond {townName}{'\u2019'}s town limits, the Beaverhead Valley and surrounding mountain
        ranges offer a distinct and significant market segment: ranch and rural acreage properties.
        These range from 20-acre hobby ranches along the Beaverhead River to multi-thousand-acre
        working cattle operations stretching into the Pioneer Mountains, Tendoy Range, or the
        Big Hole Valley to the north.
      </p>
      <p>
        Properties with deeded water rights and irrigated hay ground command substantial premiums.
        Water rights in the Beaverhead drainage are among the most senior in Montana, and buyers
        seeking agricultural properties frequently value the water rights as much as the land
        itself. Some of these ranches offer genuine agricultural income potential{'\u2014'}cattle
        operations, hay production, and increasingly, conservation easement value{'\u2014'}alongside
        recreational amenities like private river access, elk habitat, and proximity to
        backcountry wilderness. This upper market tier operates on different fundamentals than
        in-town housing and can push {townName}{'\u2019'}s median list price higher than the typical
        residential home alone would suggest.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} requires careful budgeting but remains within reach for dual-income
        households. The ratio of 7.3 sits between Montana{'\u2019'}s most affordable markets{'\u2014'}Great
        Falls (3.7), Miles City (3.8){'\u2014'}and the extreme end{'\u2014'}Whitefish (11.7), Bozeman (8.8).
        A single-income household at the median will find the math tight; a dual-income
        professional household, particularly with university employment, can make it work.
      </p>
      <p>
        The market{'\u2019'}s tiny size{'\u2014'}{fmt(h?.forSaleInventory ?? null)} active
        listings{'\u2014'}means buying is as much about patience and timing as budget.
        Renting at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'} is relatively
        affordable, and provides time to learn the community{'\u2019'}s neighborhoods before committing.
        Montana{'\u2019'}s low property taxes and absence of a state sales tax reduce ongoing ownership
        costs for those who do purchase. For buyers willing to look beyond town limits, rural
        properties with acreage offer a different value proposition{'\u2014'}higher sticker prices but
        more land, agricultural potential, and the kind of privacy and open space that defines
        southwestern Montana living.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}{'\u2019'}s housing market is appreciating faster than its size might suggest.
        The {censusToZillowGap != null ? `${censusToZillowGap}% Census-to-Zillow gap` : 'widening gap between Census and current values'} reflects
        real momentum, and the {h?.inventoryYoY != null ? `${Math.abs(h.inventoryYoY)}% year-over-year inventory decline` : 'shrinking inventory'} signals
        continued tightening. This is no longer a sleepy, overlooked market{'\u2014'}it{'\u2019'}s a small
        market drawing increasing attention from buyers priced out of the Bozeman corridor and
        remote workers discovering southwestern Montana{'\u2019'}s combination of affordability, outdoor
        access, and authentic ranching-community character.
      </p>
      <p>
        Key factors to watch include University of Montana Western enrollment trends (which
        directly drive rental demand and support local services), the pace of remote-worker
        in-migration, agricultural commodity prices (which affect ranch property values and
        the broader Beaverhead County economy), and whether the limited construction labor
        pool can expand enough to add meaningful new supply. The Big Hole Valley, Bannack
        ghost town, Pioneer Mountains, and Beaverhead River corridor give {townName} a
        recreational profile that punches well above its population{'\u2014'}and as more people
        discover it, expect continued pressure on a housing market that has very little room
        to absorb new demand.
      </p>
    </article>
  );
}
