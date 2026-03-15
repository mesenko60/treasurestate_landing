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
        {townName} sits 15 miles northeast of Kalispell and just 17 miles from the west entrance
        of Glacier National Park — close enough to draw park-driven demand but far enough to
        remain more affordable than neighboring Whitefish. That positioning defines the housing
        market here: rapid appreciation fueled by Glacier proximity, a construction boom
        reshaping the town's economic base, and growing pressure from buyers priced out of
        Whitefish and Bigfork. This guide covers current home values, rental rates, inventory
        trends, and the forces shaping {townName}'s market.
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

      <h2>Census vs. Zillow: A Market That Has Outrun Its Baseline</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline, a pace that outstrips most Montana communities and reflects the sustained Glacier-area demand surge.` : ''}
      </p>
      <p>
        The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)},
        far above the Zillow index. The spread signals a luxury segment pulling the active-market
        average higher — large-lot properties with mountain views, newer builds on acreage along
        the US-2 corridor, and riverfront parcels that attract out-of-state buyers willing to pay
        well above the overall midpoint. For typical buyers seeking a primary residence, the
        Zillow figure is a more realistic benchmark than the list-price average.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values.` : ''}
      </p>

      <h2>Inventory & Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a significant tightening that limits buyer options and sustains competitive pricing.` : ''}
        {h?.newListings != null ? ` New listings are arriving at roughly ${h.newListings} per month, a thin pace for a market absorbing demand from both local buyers and Whitefish overflow.` : ''}
      </p>
      <p>
        Construction is a major part of {townName}'s economy — roughly 13.5% of local jobs are
        in the construction sector — and new subdivisions are actively expanding the housing
        stock along the US-2 corridor and on the town's eastern edge. However, buildable land
        near the town center is limited by the Flathead River corridor, forest service boundaries,
        and floodplain restrictions. The pace of new development, while above average for Montana,
        has not been sufficient to keep up with the demand driven by Glacier tourism, Whitefish
        spillover, and remote-worker relocation.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — moderate in absolute terms but high relative to local wages.` : ''}
      </p>
      <p>
        Seasonal and vacation rentals compete directly with long-term housing. {townName}'s
        proximity to Glacier National Park makes short-term rental platforms lucrative during
        the June-through-September peak season, when nightly rates for properties marketed as
        "Glacier base camps" can far exceed what monthly tenants pay. Property owners who convert
        units to short-term rentals reduce the year-round rental pool, tightening supply for the
        workers — hospitality staff, construction crews, retail employees — who keep the local
        economy running. The rental squeeze is felt most acutely in the summer months when
        seasonal workers arrive alongside rising tourist demand.
      </p>

      <h2>Vacancy & Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, elevated by seasonal homes, vacation properties, and short-term rentals rather than weak demand.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the majority serve year-round residents, but the vacant stock reflects ${townName}'s role as a Glacier-area vacation hub.` : ''}
      </p>
      <p>
        The housing stock spans a wide range. The historic downtown core along Nucleus Avenue
        features older homes and smaller lots with walkable access to shops and restaurants. The
        Montana Veterans Home neighborhood on the east side provides a stable, established
        residential area with mature trees and modest single-family homes. Newer developments
        extend along the US-2 corridor toward Glacier and south toward Kalispell, offering
        larger lots and contemporary construction. The mix gives buyers a genuine spectrum from
        starter homes to upscale mountain-view properties — a broader range than the
        luxury-dominated Whitefish market offers.
      </p>

      <h2>Glacier Proximity Premium</h2>
      <p>
        Glacier National Park is the single most powerful demand driver in {townName}'s housing
        market. The west entrance at Apgar is just 17 miles from downtown, making {townName} a
        practical base for year-round park access — close enough for after-work hikes in summer
        and easy access to cross-country skiing and snowshoeing in winter. This proximity
        commands a premium that shows up in every metric: faster appreciation than inland
        Flathead Valley communities, stronger investor interest, and a persistent bid from
        buyers who want daily Glacier access without Whitefish pricing.
      </p>
      <p>
        Many buyers in {townName} are Glacier-area workers — park service employees, hospitality
        staff, outfitters, and contractors — who have been priced out of Whitefish. {townName}
        offers the nearest affordable alternative while keeping commutes to both the park and
        Whitefish workplaces under 30 minutes. This workforce demand provides a floor under
        the market that pure vacation-home towns lack: even if second-home buying slows,
        the need for worker housing near Glacier sustains baseline demand.
      </p>

      <h2>Aluminum Plant Site Redevelopment</h2>
      <p>
        The former Columbia Falls Aluminum Company (CFAC) smelter — once the town's largest
        employer — closed in 2015 after decades of operation. The 960-acre site along the
        Flathead River represents the most significant redevelopment opportunity in the Flathead
        Valley. Remediation and planning for the site are ongoing, and the eventual reuse could
        reshape {townName}'s housing market depending on the mix of residential, commercial,
        and industrial uses approved.
      </p>
      <p>
        If a substantial residential component is included, the site could meaningfully expand
        {townName}'s housing supply — a rare opportunity in a market constrained by geography
        and land availability. Riverfront access, proximity to downtown, and the sheer scale
        of the parcel make it a potentially transformative project. However, environmental
        remediation timelines, zoning decisions, and infrastructure investment will determine
        when and how any housing reaches the market. For now, the site represents upside
        potential rather than near-term supply relief.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} on local wages requires careful financial planning. At current prices and
        typical mortgage rates, a monthly payment on a median-priced home would consume well
        above the standard 28% of gross income. The gap is driven by external demand — buyers
        bringing equity from higher-cost markets who are less constrained by local income ratios.
      </p>
      <p>
        {townName} remains meaningfully cheaper than Whitefish, where medians exceed $800K,
        making it the Flathead Valley's primary value alternative for buyers who want Glacier
        proximity. Renters evaluating a purchase should consider that Montana property taxes
        remain well below the national average and the state has no sales tax — factors that
        reduce the total cost of ownership. For those not yet ready to buy, renting
        in {townName} is more affordable than Whitefish or Bigfork, though the seasonal rental
        squeeze means finding year-round leases requires persistence and early commitment.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is propelled by structural forces: Glacier National Park's
        enduring appeal, the Whitefish-to-Columbia Falls price arbitrage that redirects buyers
        eastward, a construction sector that adds both jobs and housing, and the ongoing
        possibility of transformative CFAC site redevelopment. These are not cyclical
        forces — they reflect long-term geographic and demographic realities.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year drop in inventory suggests continued price firmness in the near term.` : ''}
      </p>
      <p>
        Key factors to watch include the pace and composition of CFAC site redevelopment,
        short-term rental regulation at the county level (any restrictions would release units
        back into long-term supply), and whether Glacier National Park's vehicle reservation
        system affects visitor patterns and, by extension, seasonal housing demand.
        {townName}'s fundamental value proposition — Glacier access at a fraction of Whitefish
        pricing, an active construction economy, and room to grow — positions it as one of the
        Flathead Valley's most dynamic housing markets for years to come.
      </p>
    </article>
  );
}
