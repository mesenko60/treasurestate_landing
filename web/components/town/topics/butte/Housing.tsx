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
        {townName}'s housing market is defined by something no other Montana city can match: an
        enormous stock of historic homes priced far below state averages, the legacy of a city that
        once housed over 100,000 people during the copper mining boom and now has roughly 34,500.
        That population decline created a buyer's market with high vacancy, low prices, and a
        selection of Victorian-era and early-20th-century architecture that rivals any city in the
        Northern Rockies. Whether you're buying, renting, or investing, this guide covers current
        home values, rental rates, inventory trends, and market dynamics.
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
        The gap between ZHVI and list price is relatively narrow here{'\u2014'}{townName} doesn't see
        the speculative listing premiums common in resort markets like Whitefish or Big Sky, and
        sellers generally price closer to what the market will bear.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019{'\u2013'}2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}At these prices, {townName} is dramatically more affordable than Bozeman (~$635K),
        Missoula (~$547K), Kalispell (~$509K), and Helena (~$395K). For buyers who need to be in
        western Montana, {townName} offers entry points that simply don't exist elsewhere in the region.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month.` : ''}
      </p>
      <p>
        The high vacancy rate ({h?.vacancyRate != null ? `${h.vacancyRate}%` : '11.7%'}) is the most
        distinctive feature of {townName}'s supply picture. It's the highest among Montana's hub cities
        and reflects the massive population decline from the mining era's peak of over 100,000 to
        today's 34,500. Many of these vacant units are in {townName}'s historic Uptown district and
        surrounding neighborhoods{'\u2014'}older homes that may need renovation but offer extraordinary
        square footage and architectural character at prices that would be unimaginable in Bozeman or
        Missoula. New construction is limited; most building activity focuses on infill and
        rehabilitation rather than greenfield subdivision development.
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
        Rental demand in {townName} is driven primarily by Montana Tech's roughly 2,000 students and
        faculty, St. James Healthcare workers, and Silver Bow County government employees. The student
        population creates steady demand for apartments and smaller homes near campus, particularly
        in the Uptown area. Unlike Glacier-area or Yellowstone-area communities, {townName} sees
        minimal short-term rental conversion{'\u2014'}tourism visits are day-trip oriented (Berkeley Pit
        viewing stand, World Museum of Mining) rather than multi-night stays, so the long-term rental
        pool remains intact. For landlords, the combination of low acquisition costs and reliable
        student-driven demand creates some of Montana's better rental yield opportunities.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate of ${h.vacancyRate}% is the highest among Montana's hub cities\u2014a direct result of the city shrinking from over 100,000 residents to 34,500 over the past century.` : ''}
      </p>
      <p>
        The housing stock is {townName}'s most distinctive asset. Uptown Butte is one of the largest
        National Historic Landmark Districts in the United States, encompassing block after block of
        Victorian-era, Queen Anne, Romanesque, and early-20th-century commercial and residential
        architecture. These are substantial brick and stone buildings{'\u2014'}built to house the managers,
        merchants, and workers of one of the world's richest mining districts{'\u2014'}and many remain in
        remarkable condition. Outside the historic core, mid-century neighborhoods fill the flats,
        while modest miners' cottages dot the hillsides. Newer construction is sparse; {townName}'s
        population hasn't grown enough to drive significant new development, and most investment goes
        toward restoring the existing historic stock.
      </p>
      <p>
        Buyers should be aware that some areas of {townName} fall within or near Superfund cleanup
        zones related to historic mining contamination. The EPA's remediation work is extensive and
        ongoing, and affected properties may have use restrictions or require environmental
        assessments. These zones are well-documented and localized{'\u2014'}a knowledgeable local agent
        can identify them easily{'\u2014'}and they don't affect the majority of residential
        neighborhoods, particularly Uptown and the south side of the city.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is more attainable than in any other Montana
        hub city. The ratio of 4.7 is the lowest in the guide{'\u2014'}well below Helena (6.6),
        Great Falls (5.4), Bozeman (8.8), Missoula (7.9), and Whitefish's extreme 11.7. A household
        earning {townName}'s median income can comfortably qualify for a mortgage on a median-priced
        home, which is increasingly rare anywhere in Montana.
      </p>
      <p>
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year inventory increase` : 'available inventory'} and
        {' '}high vacancy rate give buyers significant leverage. Properties sit on the market longer
        here than in tighter markets like Bozeman or Missoula, and competitive bidding is uncommon.
        Renting at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'} is also very
        reasonable{'\u2014'}but given {townName}'s low purchase prices, the rent-to-buy math often favors
        ownership, especially for anyone planning to stay more than a few years. Montana property taxes
        remain well below the national average, and the absence of a state sales tax reduces the
        overall cost burden for homeowners.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is at an inflection point. The long decline from mining-era
        population levels has largely stabilized, and the city's economic anchors{'\u2014'}Montana Tech,
        St. James Healthcare, county government, and a growing tourism sector built around mining
        heritage{'\u2014'}provide a floor that the city lacked during the worst of the post-mining contraction.
        The high vacancy rate means there's absorption capacity if population grows, rather than the
        immediate price spikes that new demand causes in supply-constrained markets like Bozeman.
      </p>
      <p>
        Key factors to watch include Montana Tech's enrollment trajectory (growth would directly boost
        housing demand), the pace of historic preservation investment in Uptown, whether remote workers
        priced out of Missoula and Bozeman discover {townName}'s combination of ultra-low housing costs
        and western Montana location, and the ongoing Superfund remediation timeline. {townName}'s
        fundamental appeal{'\u2014'}the most affordable entry point in western Montana, one of the richest
        historic districts in the American West, and a community identity forged in 160 years of
        mining history{'\u2014'}positions it as a value opportunity that few Montana cities can match.
      </p>
    </article>
  );
}
