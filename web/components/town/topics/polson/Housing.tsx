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

function fmtPct(n: number | null): string {
  if (n == null) return '—';
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

  const censusValue = h?.medianHomeValue ?? null;
  const zillowValue = h?.zillowHomeValue ?? null;
  const appreciation =
    censusValue && zillowValue
      ? Math.round(((zillowValue - censusValue) / censusValue) * 100)
      : null;

  const occupiedUnits = h?.totalHousingUnits && h?.vacancyRate != null
    ? Math.round(h.totalHousingUnits * (1 - h.vacancyRate / 100))
    : null;
  const vacantUnits = h?.totalHousingUnits && occupiedUnits
    ? h.totalHousingUnits - occupiedUnits
    : null;

  return (
    <article className="content-section">
      <p>
        {townName} sits at the southern tip of Flathead Lake — the largest natural freshwater
        lake west of the Mississippi — and its housing market reflects that singular geography.
        Lakefront and lake-view properties command steep premiums, vacation homes drive an
        unusually high vacancy rate, and out-of-state buyers compete with locals for a limited
        supply. This guide covers current home values, rental rates, inventory trends, and the
        forces shaping one of western Montana's fastest-appreciating markets.
        For the broader cost picture, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Census Median</div><div style={cardValue}>{fmtDollar(h?.medianHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{fmtPct(h?.inventoryYoY ?? null)} YoY</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '—'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Census vs. Zillow: A Market in Motion</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline, a striking indicator of how fast ${townName} has moved.` : ''}
        {' '}The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)},
        even higher than the Zillow index, reflecting the premium composition of what's
        currently on the market — lakefront parcels, lake-view homes, and newer construction
        that skew above the overall midpoint.
      </p>
      <p>
        {h?.homeValuePercentile != null ? `Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values. ` : ''}
        {townName} remains more affordable than Whitefish or Bigfork further up the Flathead
        Lake shoreline, but the price gap has been narrowing as buyers priced out of those
        communities look south. Properties without lake frontage — particularly those east of
        US-93 — still offer relative value, but the overall trajectory is upward.
      </p>

      <h2>Inventory & Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory is down ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a significant tightening in a market that was already supply-constrained.` : ''}
        {h?.newListings != null ? ` Only ${h.newListings} new listings came on the market in January 2026, an extremely thin pace that limits buyer options and keeps competition elevated.` : ''}
      </p>
      <p>
        New construction in {townName} faces practical constraints. Much of the surrounding
        land falls within the Flathead Indian Reservation, where some parcels are held in
        tribal trust — adding layers of approval and limiting the pool of developable land
        available for conventional sale. Lakefront lots are largely built out, and the steep
        terrain east of town restricts expansion. The result is a market where supply growth
        cannot easily keep pace with demand from second-home buyers, retirees, and remote workers
        drawn to the Flathead Lake lifestyle.
      </p>

      <h2>Vacancy & Seasonal Housing</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, one of the highest in Montana.` : '.'}
        {' '}This figure does not signal weak demand. It reflects a housing stock heavily weighted
        toward vacation homes, seasonal residences, and short-term rentals. Many owners occupy
        their {townName} property only during the summer boating season or use it as a
        weekend retreat from Missoula or the Flathead Valley's northern communities.
      </p>
      <p>
        {occupiedUnits ? `Of the roughly ${fmt(occupiedUnits)} occupied units, ` : ''}
        year-round residents compete for a housing pool that is significantly smaller than
        the raw unit count suggests. The seasonal ownership pattern — common throughout
        Flathead Lake communities — concentrates demand for long-term housing into a fraction
        of the available stock, pushing prices and rents higher for full-time residents.
      </p>

      <h2>Rental Market</h2>
      <p>
        {h?.zillowRent ? `Zillow's Observed Rent Index puts ${townName}'s typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {' '}The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'},
        reflecting the multi-year survey lag.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        The long-term rental market in {townName} is squeezed by the same vacation-economy
        forces that elevate vacancy rates. Property owners who can list on Airbnb and VRBO
        during the peak Flathead Lake summer season — when nightly rates for lakefront
        properties can exceed $300 — have strong financial incentive to keep units out of
        the year-round rental pool. The result is limited availability and higher rents for
        the workforce that keeps {townName}'s tourism, healthcare, and service economy running.
      </p>

      <h2>The Flathead Lake Premium</h2>
      <p>
        Flathead Lake is the defining feature of {townName}'s housing market. Properties with
        direct lake frontage or unobstructed lake views routinely sell for multiples of the
        town's median value. A standard 3-bedroom home a mile from shore might list near the
        town's overall median, while a comparable home with 100 feet of lake frontage can
        command $1M or more. This premium creates a two-tier market: lakefront and lake-view
        properties that attract out-of-state wealth, and inland homes that serve the local
        workforce at more accessible — though still rising — price points.
      </p>
      <p>
        {townName}'s position at the south end of Flathead Lake also places it on the Flathead
        Indian Reservation. Some properties sit on fee-simple land (privately owned, freely
        transferable), while others are on tribal trust or allotted land with different purchase
        requirements, including potential tribal right-of-first-refusal or lease-only
        arrangements. Buyers unfamiliar with reservation land status should work with a local
        title company and real estate attorney to understand the specific terms for any
        property of interest.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} on local wages is extremely challenging. At current prices and typical
        mortgage rates, a monthly payment on a median-priced home would consume far more than
        the standard 28% of gross income. The affordability gap is driven less by local wage
        stagnation than by external demand — out-of-state buyers who bring equity from higher-cost
        markets and are less sensitive to local income ratios.
      </p>
      <p>
        For those committed to living in {townName} long-term, buying locks in costs and builds
        equity in a market with strong historical appreciation. Montana property taxes remain well
        below the national average, and the absence of a state sales tax reduces the overall cost
        burden. Renters who cannot yet purchase may find more affordable options in Pablo, Ronan,
        or other communities along the US-93 corridor south of Flathead Lake while remaining
        within commuting range.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is propelled by structural forces: Flathead Lake's enduring
        recreational appeal, the growth of remote work enabling high-income relocation, steady
        retirement migration to western Montana, and spillover demand from Whitefish and Bigfork
        buyers seeking relative value.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year drop in inventory and a trickle of just ${h?.newListings ?? 'a few'} new listings per month suggest continued price firmness.` : ''}
        {' '}These are not cyclical forces that unwind with interest-rate shifts — they reflect
        long-term demographic and lifestyle trends.
      </p>
      <p>
        Key factors to watch include short-term rental regulation at the county or tribal level,
        the pace of new construction on available fee-simple land, and whether Flathead Lake water
        quality and access policies evolve in ways that affect property desirability. For now,
        {townName} occupies a compelling niche — Flathead Lake access at a lower entry point than
        the lake's east-shore or north-shore communities — and that value proposition continues to
        draw buyers and support long-term appreciation.
      </p>
    </article>
  );
}
