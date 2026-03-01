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
        {townName}'s housing market is among the most competitive in Montana, driven by the city's
        explosive population growth, proximity to Big Sky Resort and Bridger Bowl, and a thriving
        tech and professional-services sector. Whether you're buying, renting, or investing, this
        guide covers current home values, rental rates, inventory trends, and market dynamics to help
        you make informed decisions. For the broader cost picture, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{h?.inventoryYoY != null ? `${h.inventoryYoY > 0 ? '+' : ''}${h.inventoryYoY}% YoY` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '—'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        The premium of list price over ZHVI is typical in high-demand markets{' '}—{' '}sellers in {townName} can
        price aggressively because the combination of limited Gallatin Valley buildable land and persistent
        buyer demand keeps competition fierce.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019–2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}Only a handful of resort communities like Big Sky and Whitefish rank higher.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year — a more modest shift than the double-digit inventory gains seen in Missoula.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month.` : ''}
      </p>
      <p>
        The Gallatin Valley's geography plays a significant role in supply dynamics. Unlike Missoula's
        five distinct valleys, {townName} sits on a relatively flat, open valley floor that might seem
        well-suited to expansion. In practice, agricultural conservation easements, floodplain
        regulations, and infrastructure limitations along the I-90 corridor constrain outward growth.
        The result is a tighter supply pipeline than the terrain alone would suggest.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '—'} according
        to Zillow's Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'}, again reflecting
        the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        Montana State University's 16,000-plus students drive strong seasonal rental demand, particularly
        in neighborhoods near campus in the northeast and along North 7th Avenue. Rental availability is
        tightest in late summer as students return, and opens up after the spring semester. The growing
        short-term rental market{' '}—{' '}fueled by tourism to Yellowstone and the ski areas{' '}—{' '}further
        tightens long-term rental supply and pushes rents higher than they would otherwise be.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}%, which includes seasonal, recreational, and migrant-use units in addition to standard vacancies.` : ''}
      </p>
      <p>
        The housing stock spans historic bungalows in the downtown core to newer subdivisions in South
        Bozeman and along the Huffine Lane corridor toward Four Corners. Midtown{' '}—{' '}the area between
        downtown and the mall along North 7th{' '}—{' '}is undergoing significant redevelopment with
        mixed-use infill projects. Northeast Bozeman near MSU remains dominated by rental properties
        catering to students, while homes south of Main Street trend toward owner-occupied
        single-family residences.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income), buying in {townName} requires substantial income, savings, or
        equity from a prior home sale. At current prices and typical mortgage rates, a monthly payment
        on a median-priced home would significantly exceed what most renters currently pay.
      </p>
      <p>
        Renting may be the stronger financial move for newcomers still evaluating whether {townName} is
        the right long-term fit, particularly those arriving from lower-cost markets.
        For those committed to staying, buying locks in costs and builds equity{' '}—{' '}and
        Montana property taxes remain well below the national average. The absence of a state sales
        tax also reduces the overall cost burden for homeowners furnishing and maintaining a property.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market remains one of Montana's most dynamic. After years of breakneck
        appreciation driven by pandemic-era remote-work migration and the city's growing national
        profile, the pace of price gains has moderated.
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year increase in inventory` : 'gradually expanding inventory'} is
        a positive sign for buyers, though it represents a slower rebalancing than what Missoula
        has experienced.
      </p>
      <p>
        Key factors to watch include mortgage rate trends, the trajectory of {townName}'s tech sector,
        continued population growth projections, and local zoning decisions in the Gallatin Valley.
        {townName}'s fundamental strengths{' '}—{' '}MSU's economic anchor, two world-class ski areas within an
        hour, gateway access to Yellowstone, and a vibrant downtown{' '}—{' '}continue to attract buyers and
        support long-term values, even during periods of broader market correction.
      </p>
    </article>
  );
}
