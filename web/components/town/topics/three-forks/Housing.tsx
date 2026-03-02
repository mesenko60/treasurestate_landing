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
        {townName} sits 31 miles west of Bozeman on I-90 at 4,075 feet — a town of roughly 1,989
        people at the exact spot where the Jefferson, Madison, and Gallatin rivers converge to
        form the Missouri River. That geographic distinction — the &ldquo;Birthplace of the
        Missouri&rdquo; — defines {townName}'s identity and increasingly its housing market, as
        buyers priced out of Bozeman look west along the I-90 corridor for more affordable
        options. Founded in 1908 as a Milwaukee Road railroad town, {townName} has the historic
        Sacajawea Hotel (1910), Missouri Headwaters State Park (4 mi), and proximity to Lewis &amp;
        Clark Caverns (16 mi) and Madison Buffalo Jump (15 mi). This guide covers current home
        values, rental rates, inventory trends, and the forces shaping {townName}'s market.
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
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Census vs. Zillow: Bozeman Spillover Drives Rapid Appreciation</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — dramatic growth driven almost entirely by Bozeman spillover, as buyers who can't afford Gallatin Valley prices discover that ${townName} is just 31 miles down I-90 with a fraction of the price tag.` : ''}
      </p>
      <p>
        The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)},
        well above the Zillow index by roughly $144K. This premium reflects new construction
        commanding higher prices and sellers pricing to what Bozeman transplants are willing to
        pay — not what the existing housing stock has historically been worth. In a market with
        only 895 total units, even a handful of upscale new builds significantly skews the
        median list price.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — elevated by Gallatin County's proximity to Bozeman.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a significant surge that likely reflects new subdivision development and homeowners capitalizing on Bozeman-spillover pricing.` : ''}
        {h?.newListings != null ? ` New listings are arriving at roughly ${h.newListings} per month, a meaningful pace for a market of only ${fmt(h?.totalHousingUnits ?? null)} total units.` : ''}
      </p>
      <p>
        With an inventory rate of 23.1 homes per 1,000 residents, {townName}'s supply appears
        high on paper — but context matters. The total housing stock is just 895 units, so 46
        active listings represents over 5% of all housing turning over at once. This is less a
        sign of a glutted market and more a reflection of new construction entering the market
        and long-time homeowners selling into the Bozeman-spillover demand wave. The I-90
        corridor between Bozeman and {townName} has seen steady subdivision activity, and new
        parcels are being developed on the town's edges as developers respond to the price gap
        between {townName} and Bozeman.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — above the state median, reflecting Gallatin County demand.` : ''}
      </p>
      <p>
        At $1,263 per month, {townName}'s rent is substantially below Bozeman but well above
        what you'd pay in Butte (64 mi west) or Anaconda. The rental market is exceptionally
        tight: with a 1.8% vacancy rate and only 895 total housing units, available rentals are
        nearly nonexistent. The combination of Bozeman commuters competing for limited rental
        stock and the town's tiny overall size creates conditions where a single apartment complex
        or a handful of short-term rental conversions can meaningfully shift availability.
        The Sacajawea Hotel and Missouri Headwaters State Park draw tourism, but short-term
        rental pressure is modest compared to resort towns — the demand is primarily from
        year-round residents.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, extremely low by any standard and far below the Montana average. This near-zero vacancy reflects a market where demand from Bozeman spillover has absorbed virtually all available housing, leaving almost nothing for new arrivals or existing residents looking to move within town.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s layered history. The original railroad-era
        downtown along Main Street features early 20th-century homes built when John Q. Adams
        founded the town for the Milwaukee Road in 1908 — modest worker cottages and bungalows
        with the kind of architectural character that newer subdivisions can't replicate. The
        Sacajawea Hotel (1910) anchors the historic core as a luxury boutique hotel. Mid-century
        expansion added ranch-style homes, and recent development has brought new subdivisions
        on the town's periphery catering to Bozeman commuters seeking more space and lower
        prices. With only 895 total units for a population of roughly 1,989, the per-capita
        housing stock is constrained — every unit matters, and new construction has an outsized
        impact on market dynamics.
      </p>

      <h2>Bozeman Spillover &amp; Growth Dynamics</h2>
      <p>
        The defining force in {townName}'s housing market is proximity to Bozeman. At 31 miles
        on I-90, the commute is roughly 30 minutes — close enough for daily employment in
        Bozeman's strong job market, far enough to escape its housing prices. As Bozeman's median
        home value has climbed past $700K and its affordability ratio exceeds 10, buyers
        increasingly look west. {townName}'s Zillow value of {fmtDollar(zillowValue)} represents
        roughly 76% of Bozeman's, but the median list price of {fmtDollar(h?.medianListPrice ?? null)} suggests
        the gap is narrowing as new construction targets Bozeman-priced buyers.
      </p>
      <p>
        Belgrade, between Bozeman and {townName}, has absorbed much of the initial spillover
        and is now itself becoming expensive. {townName} represents the next ring out — and its
        inventory surge of {fmtPct(h?.inventoryYoY ?? null)} year-over-year suggests developers
        have taken notice. The question is whether {townName} can grow its housing stock without
        losing the small-town, railroad-heritage character that makes it distinct from Belgrade's
        suburban sprawl. The town's historic downtown, the Sacajawea Hotel, and the Missouri
        Headwaters provide an identity anchor that pure bedroom communities lack.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} requires planning but remains achievable for dual-income households —
        especially those with one earner commuting to Bozeman wages. At current prices, a
        median-priced home would push monthly mortgage payments above the standard 28% of gross
        income for a single earner at the median, but the gap is far less severe than in Bozeman
        (ratio above 10) or resort communities where buying on local wages is effectively
        impossible.
      </p>
      <p>
        Compared to Belgrade — the most direct competitor for Bozeman commuters — {townName}
        offers lower prices with more historic character but a longer commute. Compared to Butte
        (64 mi west), {townName} is much pricier but offers Bozeman employment access that
        Butte cannot match. Montana's property taxes remain well below the national average and
        the state has no sales tax, reducing total cost of ownership. For those not ready to buy,
        renting at {townName}'s rates is difficult simply because so few rentals exist — the 1.8%
        vacancy rate means finding an available unit requires persistence and timing.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by a single dominant force: Bozeman spillover along
        the I-90 corridor. As long as Bozeman remains one of Montana's most expensive markets
        and remote work allows greater commuting flexibility, {townName} will continue attracting
        buyers seeking the Gallatin Valley lifestyle at a discount. The 35.3% inventory surge
        suggests the supply side is responding — new construction and subdivision development
        are adding units to a historically tiny market of 895 homes.
      </p>
      <p>
        Key factors to watch include the pace of new subdivision development along the I-90
        corridor, whether Belgrade's continued growth pushes more buyers further west to {townName},
        and how the town manages growth pressure against its historic railroad-town character.
        Missouri Headwaters State Park, Lewis &amp; Clark Caverns, and the Sacajawea Hotel give
        {townName} a tourism and recreation identity that pure bedroom communities lack — an
        asset that could support long-term value even if the Bozeman growth wave eventually
        moderates. For buyers seeking the western Gallatin Valley at a relative discount
        with genuine small-town character and the Missouri River at their doorstep, {townName}
        remains one of the corridor's most compelling options.
      </p>
    </article>
  );
}
