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
        {townName}'s housing market operates at a level unlike any other small town in Montana.
        With Whitefish Mountain Resort 5 miles from downtown, Glacier National Park 17 miles
        northeast, and Whitefish Lake at the town's edge, property here commands resort-level
        pricing driven by vacation buyers, retirees, and remote workers — not local wages.
        This guide covers current home values, rental rates, inventory, and the structural
        forces that shape one of Montana's most expensive markets.
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
      {dateStr && <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}'s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        The gap between these two figures — over $450,000 — is extraordinary and reveals the
        composition of the active market: a significant share of listings in {townName} are
        luxury properties, ski-in/ski-out condos, and lakefront homes that pull the median list
        price well above the overall market midpoint.
      </p>
      <p>
        The Census Bureau's American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        based on a 5-year rolling average (2019–2023) that significantly lags the current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — virtually the top of the state.` : ''}
        {' '}Only a handful of communities — Big Sky, parts of the Yellowstone Club corridor —
        consistently surpass {townName}'s pricing.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year${h.inventoryYoY < 0 ? ', tightening an already constrained market' : ''}.` : ''}
        {h?.newListings != null ? ` New listings are coming on at roughly ${h.newListings} per month — a thin pace for a market with this level of demand.` : ''}
      </p>
      <p>
        {townName}'s geography limits development. The town is pinched between Whitefish Lake
        to the east and the mountain slopes to the west, with highway corridors and wetlands
        constraining expansion in other directions. Unlike the broad valley floor around
        Kalispell, {townName} has limited room to grow outward. Infill development and higher-density
        projects near the downtown core have added some units, but the pace falls well short of
        demand from buyers with out-of-state resources.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '—'} according
        to Zillow's Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'}, reflecting
        the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — among the highest in the state for a town of under 9,000 people.` : ''}
      </p>
      <p>
        The short-term rental market is the central story of {townName}'s rental landscape.
        Whitefish Mountain Resort generates winter tourist demand, Glacier National Park drives
        summer visitor traffic, and Whitefish Lake adds a layer of vacation-rental appeal that
        stretches from Memorial Day through Labor Day. Property owners who can earn $300–$500
        per night in peak season have strong incentive to keep units out of the long-term rental
        pool. The resulting squeeze on year-round renters — particularly resort and hospitality
        workers — is one of the most acute workforce-housing challenges in Montana.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate is ${h.vacancyRate}% — one of the highest in Montana. This figure is not a sign of weak demand; it reflects the enormous share of housing stock used as vacation homes, seasonal residences, and short-term rentals rather than primary dwellings.` : ''}
      </p>
      <p>
        The housing stock spans a wide range. The historic downtown core and neighborhoods
        around Central Avenue feature older craftsman-style homes and bungalows — some dating
        to the early 1900s — that carry premium prices for walkability and character. Newer
        developments south of town along Highway 93 and in the Wisconsin Avenue corridor offer
        more contemporary construction. Ski-in/ski-out condominiums at Whitefish Mountain Resort
        and lakefront properties on Whitefish Lake occupy the top of the market, with individual
        listings routinely exceeding $2M. Workforce housing — the most critical gap — is
        limited and contested.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value
        divided by median household income), buying in {townName} on local wages is
        exceedingly difficult. The town's affordability ratio is the highest among the
        Flathead Valley communities and among the most extreme in Montana. At current prices
        and typical mortgage rates, a monthly payment on a median-priced home would consume
        the majority of a median household's income.
      </p>
      <p>
        For year-round residents who can afford to buy, homeownership locks in costs and
        builds equity in a market with strong long-term appreciation. Montana property taxes
        remain well below the national average, and the absence of a state sales tax reduces
        overall cost burden. For those priced out of {townName}, Kalispell (15 miles south)
        and Columbia Falls (9 miles east) offer significantly more affordable options while
        keeping Glacier and the ski resort within commuting range.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by forces that are structural, not cyclical:
        Whitefish Mountain Resort's reputation as a premier ski destination, Glacier National
        Park's enduring appeal, the rise of remote work enabling high-income buyers to relocate
        from coastal cities, and steady retirement migration. These demand drivers have survived
        interest-rate increases and broader market corrections. The{' '}
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? `${Math.abs(h.inventoryYoY)}% year-over-year decrease in inventory` : 'tight inventory'}{' '}
        suggests continued price firmness.
      </p>
      <p>
        The key wildcard is regulation. Short-term rental policy in {townName} and Flathead
        County has been debated but not meaningfully restricted — any future caps or permitting
        requirements could release units back into the long-term market and moderate rents.
        Workforce housing initiatives, including employer-sponsored housing at the resort and
        potential deed-restricted developments, are under discussion but have not yet reached
        the scale needed to materially improve affordability for the local workforce.
      </p>
    </article>
  );
}
