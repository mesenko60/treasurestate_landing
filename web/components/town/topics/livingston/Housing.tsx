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
        {townName}'s housing market is one of the tightest in Montana{'\u2014'}a small-town market under
        big-town pressure. With just {fmt(h?.totalHousingUnits ?? null)} total housing units serving a
        population of 8,040, a vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'},
        and only {fmt(h?.forSaleInventory ?? null)} active listings at any given time, this is a market
        where supply constraints dominate every conversation. Second-home buyers, vacation-rental
        operators, Paradise Valley ranch seekers, and Bozeman spillover all compete for a housing
        stock that barely turns over. Whether you're buying, renting, or investing, this guide covers
        current values, inventory dynamics, and what makes {townName}'s market uniquely constrained.
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
        The $15K gap between ZHVI and list price is modest, suggesting sellers here price closer to
        market reality than in speculative resort markets{'\u2014'}likely because the buyer pool, while
        motivated, is small enough that overpriced listings simply sit.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019{'\u2013'}2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}For a town of 8,040 people, these are exceptional numbers. {townName} is more expensive
        than Helena (~$411K) and Kalispell (~$509K){'\u2014'}cities several times its size{'\u2014'}and only
        modestly below Bozeman (~$635K), 25 miles west. The Yellowstone gateway premium, Paradise
        Valley's ranch-country cachet, and the arts-community draw all inflate values well beyond what
        local wages alone would support.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale{'\u2014'}one of
        the smallest active inventories of any town in our analysis.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year, meaning the already-tight market is getting even tighter.` : ''}
        {h?.newListings != null ? ` New listings trickle in at just ${h.newListings} per month\u2014a pace so slow that a single week of strong buyer activity can meaningfully shift market dynamics.` : ''}
      </p>
      <p>
        The supply constraint is structural, not cyclical. {townName} is geographically pinched
        between the Absaroka Range to the south and east, the Crazy Mountains to the northeast, and
        the Bangtail Range to the north. Buildable land within city limits is largely built out, and
        new development faces the same infrastructure limitations (water, sewer) that constrain many
        small Montana towns. Paradise Valley to the south offers acreage and ranch properties, but
        these are premium holdings{'\u2014'}often $1M+ and rarely subdivided for workforce housing. Unlike
        Helena or Kalispell, which have valley floors that allow suburban expansion, {townName}'s
        geography limits the pipeline of new supply.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '\u2014'} according
        to Zillow's Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'}, again reflecting
        the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns\u2014one of the highest in the state.` : ''}
      </p>
      <p>
        The rental market is under acute pressure from vacation rentals. {townName}'s proximity to
        Yellowstone (44 miles to the North Entrance) and its position at the head of Paradise Valley
        make it a natural base for park visitors, and property owners can earn substantially more from
        nightly rentals during the June{'\u2013'}September Yellowstone season than from year-round tenants.
        The result is a {h?.vacancyRate != null ? `${h.vacancyRate}%` : 'very low'} vacancy rate and
        a long-term rental pool that is genuinely difficult to access. Service-industry workers,
        teachers, and healthcare staff{'\u2014'}the people who keep the town running{'\u2014'}face the sharpest
        squeeze, competing for a shrinking pool of year-round units while earning wages well below
        the median household income.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate of ${h.vacancyRate}% is among the lowest in our analysis\u2014well below the 5\u20137% range that housing economists consider healthy for a functioning market.` : ''}
      </p>
      <p>
        The housing stock tells the story of {townName}'s layered history. The historic downtown
        along Park Street and the surrounding neighborhoods feature late-19th and early-20th century
        homes from {townName}'s railroad era{'\u2014'}the Northern Pacific Railway established the town in
        1882 as the original gateway to Yellowstone. Many of these structures are beautifully
        preserved, with Queen Anne and Craftsman styles well represented. The railroad depot itself,
        now a museum, anchors the historic district. Moving outward, mid-century ranch homes fill
        the residential streets, while the handful of newer developments cluster on the town's edges.
        South of town, Paradise Valley transitions to ranch properties{'\u2014'}large-acreage holdings along
        the Yellowstone River corridor that attract high-net-worth buyers seeking trophy ranches with
        park access and blue-ribbon trout water.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is a stretch for most local earners. The
        ratio of 7.8 is better than Whitefish (11.7) or Bozeman (8.8) but worse than Helena (6.6),
        Missoula (7.9 but in a much larger job market), or Great Falls (3.7). A dual-income
        professional household can make it work; a single-income service or tourism worker likely
        cannot without significant savings or outside equity.
      </p>
      <p>
        The market's tiny size{'\u2014'}{fmt(h?.forSaleInventory ?? null)} active listings, {h?.newListings ?? 8} new
        per month{'\u2014'}means buying is as much about patience and timing as it is about budget. Desirable
        properties near downtown or along the river can receive multiple offers despite the small buyer
        pool. Renting at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'} consumes a
        significant share of a median-income budget, but it does buy time to learn the market and wait
        for the right property in a town where inventory is measured in dozens, not hundreds. Montana's
        low property taxes and absence of a state sales tax reduce the ongoing ownership burden for
        those who do buy.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is defined by structural scarcity. The combination of geographic
        constraints, limited buildable land, vacation-rental conversion, and second-home demand creates
        a floor under prices that is unlikely to soften meaningfully.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year decline in inventory signals continued tightening\u2014the opposite of what buyers in an already-constrained market want to see.` : ''}
      </p>
      <p>
        Key factors to watch include Yellowstone visitation trends (which directly affect
        vacation-rental economics), Bozeman's continued growth (which pushes more spillover buyers
        east on I-90), and any local regulatory action on short-term rentals that could return units
        to the long-term pool. Remote work has been a tailwind for {townName}{'\u2014'}its literary and
        artistic reputation, Yellowstone access, and small-town character appeal strongly to
        location-independent professionals. As long as that trend holds, expect continued pressure
        on a market that has very little room to absorb new demand.
        {townName}'s fundamental appeal{'\u2014'}Yellowstone gateway, Paradise Valley, Yellowstone River
        through downtown, a nationally recognized arts community, and Bozeman-area recreation at a
        lower price point{'\u2014'}ensures sustained interest from buyers well beyond Park County.
      </p>
    </article>
  );
}
