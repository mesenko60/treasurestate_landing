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
        {townName}'s housing market operates under resort-town dynamics in a community of just 2,700
        people. With {fmt(h?.totalHousingUnits ?? null)} total housing units, a vacancy rate of{' '}
        {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} (overwhelmingly seasonal and
        recreational properties), and only {fmt(h?.forSaleInventory ?? null)} active listings at any
        given time, this is a market shaped by second-home buyers, ski-season visitors, and Beartooth
        Highway tourists rather than by traditional residential demand. Red Lodge Mountain ski area
        (4 miles west) and the Absaroka-Beartooth Wilderness (15 miles south) anchor the recreational
        appeal, while Billings{'\u2014'}60 miles northeast{'\u2014'}provides the nearest full-service
        employment and retail base. Whether you're buying, renting, or investing, this guide covers
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
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : fmtDollar(h?.medianRent ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        These figures are extraordinary for a town of under 2,400 people and reflect the resort and
        second-home premium that defines {townName}'s market. Buyers are not purchasing based on
        local wages{'\u2014'}they are purchasing a ski-town lifestyle, Beartooth Highway access, and
        proximity to Yellowstone National Park via the northeast entrance.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        based on a 5-year rolling average (2019{'\u2013'}2023) that lags the current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}For context, {townName} is more expensive than many Montana cities several times its
        size. Billings (~$310K), just 60 miles away with 20 times the population and a diversified
        economy, offers home values at roughly two-thirds the price. The gap underscores how
        thoroughly recreation and second-home demand dominate {townName}'s market.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale{'\u2014'}a
        tiny inventory even by small-town standards.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year, tightening an already-constrained market.` : ''}
        {h?.newListings != null ? ` New listings arrive at just ${h.newListings} per month\u2014a pace so slow that a single weekend of strong buyer activity can meaningfully shift market dynamics.` : ''}
      </p>
      <p>
        The supply constraint is both structural and cultural. {townName} sits in a narrow valley
        at the base of the Beartooth Mountains, with limited buildable land between the surrounding
        national forest and the town's established footprint. Rock Creek runs through town, and the
        terrain rises steeply to the west toward Red Lodge Mountain and to the south toward the
        Beartooth Plateau. New construction faces topographic limitations, higher building costs at
        5,568 feet of elevation, and the small-town infrastructure constraints (water, sewer) common
        across rural Montana. Meanwhile, a significant share of the existing housing stock is held
        as second homes or vacation rentals, effectively removing those units from the market for
        local buyers.
      </p>

      <h2>Rental Market</h2>
      <p>
        Zillow rent data is not available for {townName} due to its small market size. The Census ACS
        reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'} per month, though
        the actual rental landscape is more complex than any single figure can capture.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        The headline vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} appears
        to suggest ample availability, but the reality is the opposite. The vast majority of those
        vacant units are seasonal or recreational properties{'\u2014'}second homes occupied only during
        ski season or the Beartooth Highway summer months, and vacation rentals listed on short-term
        platforms. The year-round rental pool is extremely small. Workers at Red Lodge Mountain,
        downtown restaurants, the school district, and the local healthcare system face a genuine
        housing crunch, competing for a handful of long-term units in a market where property owners
        can earn more from nightly ski-season rentals than from year-round leases.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units. The housing stock
        tells the story of the town's layered history{'\u2014'}from the coal-mining era that founded
        {townName} in the 1880s through its transformation into a recreation and tourism community.
        Downtown along Broadway Avenue and the surrounding residential blocks feature early-20th
        century homes from the mining boom, many well-maintained with the simple frame construction
        typical of Montana mining towns. Closer to Rock Creek, a mix of small cabins, mid-century
        ranch homes, and newer construction fills the residential neighborhoods.
      </p>
      <p>
        Condo and townhouse developments near Red Lodge Mountain cater to the ski and recreation
        market, with many units used as vacation rentals or seasonal residences. South of town,
        along the highway toward the Beartooth, larger-lot properties and custom mountain homes
        command premium prices for their proximity to the wilderness and mountain views. The overall
        character of the housing stock is modest by resort-town standards{'\u2014'}{townName} retains
        a working-town feel that distinguishes it from purpose-built ski villages, though the price
        tags increasingly reflect resort economics.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is effectively out of reach for most local
        earners without outside equity. The ratio of {h?.affordabilityRatio ?? 11.2} places {townName}
        among the most stretched markets in Montana{'\u2014'}comparable to Whitefish and worse than
        Bozeman (8.8) or Livingston (7.8). A dual-income household would need to earn roughly
        three times the local median to qualify for a conventional mortgage on the median-priced home.
      </p>
      <p>
        The market's tiny size{'\u2014'}{fmt(h?.forSaleInventory ?? null)} active listings{'\u2014'}means
        buying is as much about patience and timing as budget. Desirable properties near downtown
        or with ski-area views can move quickly despite the small buyer pool. Renting offers a way to
        live in {townName} while assessing the market, but the year-round rental pool is genuinely
        limited. Montana's low property taxes and absence of a state sales tax reduce the ongoing
        ownership burden for those who do buy.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is defined by its dual identity as a working small town and a
        recreation destination. The combination of geographic constraints, limited buildable land,
        second-home demand, and vacation-rental conversion creates persistent upward pressure on
        prices.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year decline in inventory signals continued tightening in an already-constrained market.` : ''}
      </p>
      <p>
        Key factors to watch include Red Lodge Mountain's visitation and investment trajectory,
        Beartooth Highway tourism trends, any local regulatory action on short-term vacation rentals,
        and the broader Billings-area real estate market that influences {townName}'s buyer pool.
        Remote work has added a new dimension{'\u2014'}the same mountain-town appeal that draws
        skiers and Beartooth Highway tourists also attracts remote professionals seeking a small-town
        lifestyle with genuine mountain character. As long as recreation demand holds, expect
        {townName}'s market to remain tight, expensive, and fundamentally driven by outside capital
        rather than local wages.
      </p>
    </article>
  );
}
