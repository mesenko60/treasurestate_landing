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
        {townName}'s housing market is shaped by a powerful combination of Glacier National Park
        proximity, Whitefish overflow demand, and steady retirement migration into the Flathead
        Valley. Whether you're buying, renting, or investing, this guide covers current home values,
        rental rates, inventory trends, and market dynamics.
        For the broader cost picture, see
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
        The sizable gap between ZHVI and list price reflects aggressive seller pricing{' '}—{' '}in a market
        where Glacier-area demand and Whitefish overflow keep buyer competition strong, sellers routinely
        list well above recent comparable sales.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019–2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}Whitefish, just 15 miles north, has a median around $835K — making {townName} the
        more affordable Flathead Valley alternative, though the price gap has been narrowing.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year, a welcome sign for buyers in what has been a persistently tight market.` : ''}
        {h?.newListings != null ? ` New listings are coming on at a pace of roughly ${h.newListings} per month.` : ''}
      </p>
      <p>
        The Flathead Valley's broad, flat terrain theoretically allows more room for development than
        mountain-constrained towns like Missoula or Whitefish. In practice, agricultural land
        preservation, wetland protections near the Flathead River corridor, and infrastructure
        capacity along US-93 and US-2 shape where and how fast new housing can be built. Subdivision
        development on the valley floor has accelerated, but supply still trails demand from
        relocating retirees, remote workers, and tourism-sector investors.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '—'} according
        to Zillow's Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'}, again reflecting
        the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — remarkably high for a city of roughly 30,000 without a four-year university.` : ''}
      </p>
      <p>
        The short-term rental market is a major factor. Glacier National Park draws over 3 million
        visitors annually, and many property owners convert long-term rentals to Airbnb and VRBO
        listings to capture peak-season tourist revenue. Flathead Lake — the largest natural freshwater
        lake west of the Mississippi — adds another layer of summer vacation-rental demand. The
        result is a tighter long-term rental market and higher rents than local wages alone would sustain.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}%, which includes seasonal, recreational, and short-term rental units — a tight figure that reflects persistent demand.` : ''}
      </p>
      <p>
        The housing stock ranges from older bungalows and craftsman-style homes in the downtown and
        old-town core to newer subdivisions spreading north and west. The Northridge area offers
        mid-range single-family homes, while the unincorporated Evergreen community east of town
        provides somewhat more affordable options outside city limits. The west side near Glacier Park
        International Airport has seen growing development, and infill projects downtown are adding
        mixed-use density. Unlike mountain-hemmed Missoula or resort-priced Whitefish, {townName}'s
        valley-floor setting gives it more room to grow — a factor that may help moderate prices over time.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income), buying in {townName} is a stretch for households earning local
        wages. The income-to-housing gap here is sharper than in Bozeman or Missoula, which benefit
        from university-anchored professional economies. At current prices and typical mortgage rates,
        a monthly payment on a median-priced home would consume a much larger share of income than
        the standard 28% guideline.
      </p>
      <p>
        Renting may be the more practical option for newcomers evaluating the Flathead Valley, though
        the {h?.rentPercentile != null ? `${ordinal(h.rentPercentile)} percentile rent` : 'high rent level'} means
        even renting is expensive relative to local incomes.
        For those committed to staying, buying locks in costs and builds equity{' '}—{' '}and
        Montana property taxes remain well below the national average. The absence of a state sales
        tax also reduces the overall cost burden for homeowners furnishing and maintaining a property.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by forces largely external to the local economy: Glacier
        tourism, Whitefish overflow, retirement migration, and remote-worker relocation. These demand
        drivers are structural, not cyclical, which suggests sustained upward pressure on prices even
        during broader market slowdowns.
        The {h?.inventoryYoY != null && h.inventoryYoY > 0 ? `${h.inventoryYoY}% year-over-year increase in inventory` : 'gradually expanding inventory'} is
        a positive signal for buyers, but the valley needs significantly more supply — particularly
        workforce housing — to meaningfully improve affordability.
      </p>
      <p>
        Key factors to watch include short-term rental regulation (any Flathead County restrictions
        would free units back to long-term supply), the pace of new subdivision development on the
        valley floor, and whether Glacier National Park's reservation system affects visitor volumes
        and, by extension, tourism-driven housing demand. {townName}'s fundamental
        appeal{' '}—{' '}gateway to one of America's most iconic national parks, Flathead Lake access,
        and a lower price point than Whitefish{' '}—{' '}continues to attract buyers and support
        long-term values.
      </p>
    </article>
  );
}
