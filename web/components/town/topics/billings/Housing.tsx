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
        {townName}'s housing market is Montana's largest and most liquid{'\u2014'}a reflection of the
        state's biggest city and its role as the economic hub for eastern Montana, northern Wyoming,
        and the western Dakotas. Unlike the tourism-driven markets of western Montana, {townName}'s
        real estate is powered by healthcare, energy, and regional commerce, producing steady demand
        without the speculative price spikes that characterize Bozeman, Whitefish, or Big Sky.
        Whether you're buying, renting, or investing, this guide covers current home values, rental
        rates, inventory trends, and market dynamics.
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
        {' '}{townName} remains the most affordable of Montana's major cities{'\u2014'}substantially below
        Bozeman (~$635K), Missoula (~$547K), Kalispell (~$509K), and Helena (~$466K). For a city of
        117,000 with two major hospitals, an international airport, and a diversified economy, the
        value proposition is unmatched in the state.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale{'\u2014'}the
        largest active inventory of any city in Montana.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month\u2014by far the highest volume in the state, reflecting the sheer size and activity of ${townName}'s market.` : ''}
      </p>
      <p>
        {townName}'s geography is a major advantage for supply. Sitting at the floor of the
        Yellowstone River valley at just 3,123 feet, the city has ample room to expand in
        nearly every direction{'\u2014'}unlike mountain-hemmed cities like Missoula or Bozeman. The
        West End has seen significant suburban growth with new subdivisions, retail centers,
        and medical offices. The Heights neighborhood on the Rimrocks offers elevated views
        and established communities. Development along the Lockwood corridor to the east and
        south toward Laurel continues to add housing stock. This buildable land base is a
        structural advantage that keeps {townName}'s prices more grounded than in
        geographically constrained markets.
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
        {townName}'s rental market is fundamentally different from Montana's tourism towns. Demand
        comes from healthcare professionals at Billings Clinic and St. Vincent Healthcare, energy
        sector workers at the CHS and ExxonMobil refineries, retail and service employees, and
        Montana State University Billings students. Short-term rental conversion is minimal
        compared to Glacier-area or Yellowstone-gateway communities{'\u2014'}most rental stock remains
        in the long-term pool, which keeps rents moderate relative to home values. The city's
        6.0% vacancy rate provides enough slack to absorb new arrivals without the bidding wars
        that plague tighter markets.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units{'\u2014'}the largest
        housing stock of any city in Montana.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}%, a moderate figure that suggests neither extreme tightness nor oversupply.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s layered growth since its 1882 founding. The
        historic downtown and South Side neighborhoods feature early 20th-century homes from the
        city's railroad boom era. Mid-century neighborhoods fill the central corridor, while the
        West End represents the city's primary growth frontier with modern subdivisions, big-box
        retail, and new medical campus development. The Heights{'\u2014'}perched atop the Rimrocks
        sandstone cliffs{'\u2014'}offers panoramic views and a mix of established homes and newer
        construction. Unlike resort towns where luxury second-home construction dominates new
        building, {townName}'s development skews toward workforce and family housing{'\u2014'}a
        reflection of its healthcare-and-energy-worker demographic.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is more attainable than in any other
        major Montana city. The ratio of 5.4 is the best in the state among cities above
        30,000{'\u2014'}well below Helena (6.6), Missoula (7.9), Bozeman (8.8), and Whitefish (11.7).
        A household earning {townName}'s median income can comfortably qualify for a mortgage on a
        median-priced home, which is increasingly difficult elsewhere in Montana.
      </p>
      <p>
        The {h?.forSaleInventory ? `${fmt(h.forSaleInventory)} active listings` : 'large inventory'} give
        buyers genuine choices and negotiating leverage. With {h?.newListings ? `${h.newListings} new listings per month` : 'strong listing volume'},
        {' '}{townName}'s market moves at a pace that rewards patient, informed buyers rather than
        forcing panic bidding. Renting remains reasonable at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : 'current levels'},
        making it a practical option for newcomers evaluating the area{'\u2014'}and Montana property taxes
        remain well below the national average for those who do buy. The absence of a state sales
        tax also reduces the overall cost burden for homeowners furnishing and maintaining a property.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is anchored by the most diversified economic base in Montana.
        Healthcare is recession-resistant and growing, energy production is continuous, and the
        city's role as a regional hub for retail, logistics, and financial services (First Interstate
        BancSystem is headquartered here) ensures demand from multiple sectors. Unlike resort towns
        that ride tourism cycles or college towns tied to enrollment trends, {townName}'s demand
        drivers are structural and year-round.
      </p>
      <p>
        Key factors to watch include the pace of West End and Lockwood corridor development,
        energy sector employment tied to Bakken and Powder River Basin production, continued growth
        of the medical corridor (both Billings Clinic and St. Vincent have expansion plans), and
        whether buyers priced out of Bozeman, Missoula, and Helena increasingly discover {townName}'s
        value proposition. Montana's busiest airport (BIL) and the city's proximity to the Beartooth
        Highway and Yellowstone National Park (~120 miles) add lifestyle appeal that complements
        the economic fundamentals.
        {townName}'s combination of Montana's best affordability ratio, largest housing inventory,
        and most diversified economy positions it for steady, sustainable appreciation rather than
        the speculative spikes that characterize the state's resort markets.
      </p>
    </article>
  );
}
