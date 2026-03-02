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
        {townName}'s housing market tells a story no other Montana city can match: the most affordable
        major metro in the state, combined with the largest inventory surge anywhere in Montana. Known
        as "The Electric City" for the hydroelectric dams on the Missouri River, {townName} offers
        buyers a rare combination of genuine affordability, growing supply, and an economy backed by
        Malmstrom Air Force Base and Benefis Health System. Whether you're buying, renting, or
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
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        The gap between ZHVI and list price is notable here{'\u2014'}it partly reflects the mix of
        older, more affordable housing stock and newer construction on the city's south and west sides
        that skews listing prices upward.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019{'\u2013'}2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}Crucially, {townName} remains the most affordable of Montana's major cities{'\u2014'}cheaper
        than Billings (~$340K), Helena (~$453K), Missoula (~$547K), and far below Bozeman (~$635K)
        and the Flathead Valley.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year${h.inventoryYoY > 0 ? '\u2014the largest inventory expansion of any Montana city and a massive shift toward buyer-friendly conditions' : ''}.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month.` : ''}
      </p>
      <p>
        Several factors drive this inventory surge. Military personnel rotations at Malmstrom AFB
        create regular turnover as families PCS (Permanent Change of Station) in and out of the city.
        The 8.2% vacancy rate{'\u2014'}the highest of any Montana hub{'\u2014'}suggests some softening
        of demand, possibly linked to military drawdowns or retirees relocating to warmer climates.
        Unlike mountain-hemmed cities such as Missoula or Helena, {townName} sits on the open plains
        of the Missouri River valley with ample room for development in every direction. The south
        and west sides of the city have seen the most new construction, while established neighborhoods
        closer to downtown and the base offer older homes at lower price points.
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
        The rental market here is shaped heavily by Malmstrom Air Force Base. Military families on
        rotation often rent rather than buy, creating consistent demand for family-sized rentals near
        the base and in the south-side neighborhoods. Benefis Health System employees{'\u2014'}including
        traveling nurses and new hires evaluating the area{'\u2014'}add another steady renter
        demographic. Unlike Glacier-area or Yellowstone-area communities, {townName} has negligible
        short-term rental conversion from tourism. The overwhelming majority of rental stock remains
        in the long-term pool, which keeps rents more moderate relative to home values than in places
        like Kalispell or Whitefish.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}%\u2014the highest of any major Montana city, suggesting meaningful supply availability for both buyers and renters.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s evolution from a frontier outpost to a 20th-century
        military and industrial city. Downtown and the near-north neighborhoods feature early 1900s
        bungalows and Craftsman homes with character{'\u2014'}many well-maintained, some in need of
        renovation. Mid-century ranch-style homes dominate the neighborhoods built during Malmstrom's
        Cold War expansion in the 1960s. Newer subdivisions on the south and west sides offer modern
        construction with larger lots. Unlike resort towns where luxury spec homes dominate new
        building permits, {townName}'s development skews toward workforce and family housing priced
        for military and healthcare salaries rather than out-of-state wealth.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is more attainable than in any other major
        Montana city. The ratio of 5.1 falls within the commonly cited national benchmark of 3.0 to
        5.0{'\u2014'}making {townName} the only major Montana metro that approaches what economists
        consider a balanced housing market. Compare that to Billings (5.4), Helena (6.6), Missoula
        (7.9), and Bozeman (8.8).
      </p>
      <p>
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year inventory increase` : 'growing inventory'} further
        strengthens the buyer's position. With 284 active listings and 52 new homes hitting the market
        each month, buyers have selection that's virtually unmatched elsewhere in Montana. Renting
        remains reasonable at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'},
        making it a practical option for military families on shorter rotations or newcomers evaluating
        the area{'\u2014'}and Montana property taxes remain well below the national average for those
        who do buy. The absence of a state sales tax also reduces the overall cost burden for
        homeowners furnishing and maintaining a property.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is defined by two forces that set it apart from the rest of Montana:
        Malmstrom Air Force Base provides a federal demand floor that no state policy can replicate,
        while the +31.5% inventory surge{'\u2014'}the largest of any Montana city{'\u2014'}signals a
        market that is clearly tilting in favor of buyers. The 8.2% vacancy rate adds further
        evidence that supply is outpacing demand in the near term.
      </p>
      <p>
        Key factors to watch include Malmstrom's force posture and any changes to the Minuteman III
        mission (the Sentinel ICBM replacement program could bring new construction and personnel),
        Benefis Health System's expansion plans, and whether buyers priced out of western Montana
        increasingly discover {townName} as the most affordable alternative with genuine city
        infrastructure. The absence of resort-town speculation means {townName} is unlikely to
        experience the dramatic price swings seen in the Flathead or Gallatin valleys{'\u2014'}instead,
        expect steady, fundamentals-driven pricing anchored by military and healthcare employment,
        with the current inventory surplus giving buyers leverage that may not last as the broader
        Montana market continues to attract new residents.
      </p>
    </article>
  );
}
