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
        {townName}'s housing market is unlike any other in Montana. With a median home value
        approaching $1.8 million, a vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '64.9%'},{' '}
        and {fmt(h?.forSaleInventory ?? null)} active listings, this is a resort real estate market
        where second-home buyers, investment properties, and vacation rentals dominate the landscape.
        Nearly two-thirds of all housing units sit empty most of the year{'\u2014'}seasonal residences
        for owners who live elsewhere. The year-round population of roughly 3,591 competes for a
        thin sliver of available housing, creating a worker housing crisis that defines community
        life. Whether you're buying a resort property, seeking workforce housing, or evaluating
        investment potential, this guide covers values, inventory, and the dynamics that make
        {townName}'s market the most expensive and unusual in the state.
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
        These are the highest figures of any community in Montana{'\u2014'}significantly above Whitefish,
        Bozeman, or any of the state's other resort and university towns. The market is defined by
        resort-oriented real estate: ski-in/ski-out condominiums at the base of Lone Mountain,
        luxury custom homes in Moonlight Basin and Spanish Peaks, and lodge-style properties
        along the Gallatin River corridor.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        based on a 5-year rolling average (2019{'\u2013'}2023).
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it at the very top of the state.` : ''}
        {' '}The buyer profile is overwhelmingly out-of-state: families from Seattle, California,
        Texas, and the Northeast purchasing second homes or investment properties near Big Sky
        Resort. Local wage earners are largely priced out of the open market entirely.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${h.inventoryYoY > 0 ? '+' : ''}${h.inventoryYoY}% change compared to the same period last year.` : ''}
        {h?.newListings != null ? ` New listings arrive at a rate of ${h.newListings} per month.` : ''}
        {' '}While 115 active listings may sound reasonable, the vast majority are priced well above
        $1 million{'\u2014'}luxury resort properties, not starter homes or workforce housing. The
        inventory that matters to year-round residents{'\u2014'}modestly priced condos, apartments, and
        single-family homes under $500K{'\u2014'}is vanishingly small.
      </p>
      <p>
        The supply dynamic is driven by resort development cycles. Major planned communities like
        Spanish Peaks Mountain Club, Moonlight Basin, and The Village Center at Big Sky add units
        in phases, but these cater to the luxury and vacation-home market. Deed-restricted workforce
        housing has been developed through the Big Sky Community Housing Trust and similar
        initiatives, but the scale remains far short of the need. The unincorporated nature of
        {townName}{'\u2014'}it has no municipal government{'\u2014'}complicates coordinated housing policy,
        as land-use decisions fall to Gallatin County and resort area district governance.
      </p>

      <h2>Rental Market</h2>
      <p>
        {townName}'s rental market is one of the tightest in Montana, and Zillow does not report
        a rent index for the community{'\u2014'}a reflection of how few traditional long-term rentals
        exist. The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'},
        but this figure captures a mix of subsidized workforce units and market-rate properties
        that makes the median less meaningful than in a conventional rental market.
      </p>
      <p>
        The overwhelming majority of rental-type housing in {townName} operates as short-term
        vacation rentals{'\u2014'}nightly and weekly bookings through platforms like VRBO, Airbnb, and
        resort booking services. Property owners earn substantially more from peak-season nightly
        rentals than from year-round leases, creating a structural incentive that pulls units out
        of the long-term rental pool. For workers who do find year-round rentals, shared housing
        and employer-provided housing (Big Sky Resort maintains some employee housing) are common
        arrangements. The vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '64.9%'}{' '}
        is the highest in Montana and reflects seasonal/recreational use, not available rental supply.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units{'\u2014'}a large
        number for a community of 3,591 permanent residents, and the gap tells the story. With a
        vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '64.9%'}, roughly two out of
        every three housing units are classified as vacant (seasonal, recreational, or occasional use).
        This is not blight{'\u2014'}these are well-maintained luxury properties that sit empty between
        owner visits. The occupied units house the year-round workforce and permanent residents who
        keep the resort community functioning.
      </p>
      <p>
        The housing stock spans several distinct tiers. At the top, custom mountain homes in
        communities like Yellowstone Club (a private ski-and-golf community with $5M+ entry prices),
        Spanish Peaks Mountain Club, and Moonlight Basin represent some of the most expensive
        residential real estate in the Rocky Mountain West. Mid-tier resort condominiums at the
        base areas and along Mountain Village Drive serve the vacation-rental and second-home market.
        At the bottom{'\u2014'}in price, not quality{'\u2014'}deed-restricted workforce housing units,
        employer-provided dormitory-style housing, and the handful of market-rate apartments or
        older homes along the highway corridor serve the year-round population. The gap between
        tiers is enormous, and the middle is largely missing.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'}{'\u2014'}the highest in
        Montana{'\u2014'}buying in {townName} on a local income is effectively impossible without
        outside equity. At 17.2, the ratio dwarfs Whitefish (11.7), Bozeman (8.8), and every
        other community in the state. Even a dual-income professional household earning $150K
        faces a 12:1 ratio at the median home price. Buyers in {townName} are overwhelmingly
        purchasing with equity from other markets{'\u2014'}selling a home in a coastal city, using
        investment returns, or buying as a secondary residence.
      </p>
      <p>
        For year-round residents who work in the community, the realistic housing options are:
        deed-restricted workforce units (limited supply, income-qualified), employer-provided
        housing (Big Sky Resort, Yellowstone Club, and some hospitality employers), shared rentals
        in the Gallatin Canyon corridor, or commuting from Bozeman (45 miles north). Montana's
        low property taxes and absence of a state sales tax reduce ownership costs somewhat for
        those who do buy, but at {townName}'s price points, the savings are modest relative to
        the asset cost.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is defined by resort economics, not traditional housing
        fundamentals. Prices are driven by the desirability of Big Sky Resort{'\u2014'}its 5,800
        skiable acres, 4,350 feet of vertical, and proximity to Yellowstone National Park make
        it a premier destination{'\u2014'}and by the wealth of buyers purchasing second homes and
        investment properties. As long as the resort continues to attract high-net-worth visitors
        and the Yellowstone brand endures, demand for resort real estate will persist.
      </p>
      <p>
        The worker housing crisis is the key variable. Ongoing efforts by the Big Sky Community
        Housing Trust, resort employers, and Gallatin County to expand workforce housing will
        determine whether the community can sustain the workforce needed to run the resort economy.
        Without adequate worker housing, businesses face chronic staffing shortages that directly
        affect the quality of the resort experience. The unincorporated governance structure makes
        coordinated policy difficult but not impossible{'\u2014'}the Big Sky Resort Area District
        tax provides funding for community services, including housing initiatives. For anyone
        considering {townName}, the housing question is not whether you can afford the lifestyle
        but whether the community can afford to house the people who make that lifestyle possible.
      </p>
    </article>
  );
}
