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
        {townName} sits in southeastern Montana at 2,900 feet — a town of roughly 3,818 people and
        the Big Horn County seat, with a housing market shaped by its position on I-90, 46 miles east
        of Billings and at the edge of the Crow Indian Reservation. Little Bighorn Battlefield National
        Monument draws over 300,000 visitors annually just 14 miles south, and the Bighorn River is
        one of the premier trout fisheries in the American West. Founded in 1907 and named after
        cattleman Samuel Hardin, the town anchors a region where ranching, tourism, and tribal
        government sustain the economy. This guide covers current home values, rental rates, inventory
        trends, and the forces shaping {townName}{'\u2019'}s market. For the broader cost picture, see
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

      <h2>Census vs. Zillow: Tourism-Driven Appreciation</h2>
      <p>
        The Census Bureau{'\u2019'}s American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That ${appreciation}% gap reflects meaningful appreciation driven by two forces: the sustained tourism demand from Little Bighorn Battlefield (300,000+ annual visitors just 14 miles south) and ${townName}'s proximity to Billings — close enough for commuters at 46 miles on I-90, yet priced far below the Billings metro. At ${fmtDollar(zillowValue)}, ${townName} remains in the lower third of Montana home values, offering genuine entry-level pricing for the state.` : ''}
      </p>
      <p>
        The median list price of {fmtDollar(h?.medianListPrice ?? null)} runs above the Zillow
        Home Value Index of {fmtDollar(zillowValue)}, suggesting sellers are pricing with optimism —
        likely reflecting the recent inventory surge and interest from Billings-area buyers seeking
        more affordable options. In a market of {fmt(h?.totalHousingUnits ?? null)} total units,
        individual sales can move the median, but the upward trajectory from Census to Zillow to
        list price signals a market gaining momentum rather than stagnating.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — lower third, reflecting small-town eastern Montana pricing rather than western Montana resort dynamics.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'surged' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a dramatic expansion that fundamentally shifts the market dynamic in buyers' favor.` : ''}
      </p>
      <p>
        With an inventory rate of roughly 9.4 homes per 1,000 residents, {townName}{'\u2019'}s supply is
        well above many Montana markets. The {fmtPct(h?.inventoryYoY ?? null)} inventory increase
        YoY is one of the largest among Montana hub communities, suggesting a wave of new listings
        as homeowners take advantage of the appreciation gap between Census and Zillow values.
        The housing stock includes in-town homes near the Big Horn County courthouse, properties along
        the Bighorn River, and ranch parcels on the surrounding benchlands. New construction is
        limited — {townName} is a small county seat, not a subdivision market — but the existing stock
        provides options from modest worker homes in the original townsite to larger properties with
        views toward the Pryor Mountains and Bighorn Canyon.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — in the bottom fifth of the state's rental markets.` : ''}
      </p>
      <p>
        At $726 per month, {townName}{'\u2019'}s rent is well below Billings, Bozeman, or Missoula and
        among the most affordable in the state. The low rents reflect {townName}{'\u2019'}s small-town scale
        and eastern Montana pricing, but they also make the town a genuine option for Crow Agency
        workers, Big Horn County Memorial Hospital staff, and those employed in the tourism sector
        around Little Bighorn Battlefield. The {h?.vacancyRate ?? 8.7}% vacancy rate keeps
        rent increases in check — landlords compete for tenants, and renters have options without
        months of searching or bidding wars.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, above the national average but typical for small Montana county seats where seasonal and transitional housing plays a role. This is a buyer-friendly market: housing is available, and purchasers have genuine choice and negotiating leverage that is rare in Montana's tighter markets farther west.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}{'\u2019'}s history as a turn-of-the-century railroad and
        ranching town. Founded in 1907 when the Chicago, Burlington and Quincy Railroad arrived,
        the original townsite grew along a grid pattern near the rail line. Properties range from
        early 1900s bungalows and mid-century ranch-style homes to newer construction on the town{'\u2019'}s
        edges. Unlike resort communities where second homes dominate, {townName}{'\u2019'}s housing stock
        primarily serves working residents — county employees, hospital staff, ranchers, and
        families connected to the Crow Reservation.
      </p>

      <h2>Little Bighorn, Crow Country &amp; Billings Proximity</h2>
      <p>
        {townName}{'\u2019'}s housing market benefits from a unique combination of demand drivers that no
        other Montana small town can match. Little Bighorn Battlefield National Monument — 14 miles
        south on I-90 — draws over 300,000 visitors annually, sustaining a tourism economy that
        supports motels, restaurants, and guide services in town. The Crow Indian Reservation, one
        of the largest in the U.S. at 2.3 million acres, borders {townName} and generates employment
        through tribal government, the Bureau of Indian Affairs, and associated services.
      </p>
      <p>
        The Bighorn River below Yellowtail Dam is a world-class trout fishery that attracts fly
        anglers from across the country, adding a seasonal recreation demand that boosts the local
        economy without creating the resort-price inflation seen in western Montana gateway towns.
        {townName}{'\u2019'}s position on I-90 — just 46 miles east of Billings, Montana{'\u2019'}s largest city —
        makes it a viable commuter option for those willing to trade drive time for dramatically
        lower housing costs. Big Horn County Memorial Hospital, a 25-bed critical access facility,
        anchors healthcare services for the region. These assets create a more diversified economic
        base than most eastern Montana towns of similar size.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} is well within reach for working households. At 3.4, this ratio is among
        the healthiest in Montana — better than most hub communities and dramatically below
        Missoula (7.9), Bozeman (8.8), or Whitefish (11.7). A single-income household earning the
        median can qualify for a conventional mortgage on a median-priced home, a position that is
        increasingly rare across the state.
      </p>
      <p>
        The {h?.vacancyRate ?? 8.7}% vacancy rate and {fmt(h?.forSaleInventory ?? null)} active
        listings mean buyers have solid selection and negotiating room. Unlike Bozeman or
        Whitefish, where multiple offers and above-asking prices are common, {townName}{'\u2019'}s market
        gives buyers time, choice, and leverage. Montana{'\u2019'}s property taxes remain well below
        the national average and the state has no sales tax, reducing total cost of ownership.
        For those not ready to buy, renting at {townName}{'\u2019'}s rates —
        {h?.rentPercentile != null ? ` ${ordinal(h.rentPercentile)} percentile statewide` : ' among the most affordable in Montana'} — offers
        one of the lowest entry points in the state.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}{'\u2019'}s housing market is anchored by structural demand drivers that distinguish it from
        other eastern Montana small towns: Little Bighorn Battlefield tourism provides a consistent
        economic base, the Crow Reservation generates government and service employment, and Billings
        proximity at 46 miles on I-90 connects {townName} to Montana{'\u2019'}s largest employment center.
        Big Horn County Memorial Hospital sustains healthcare jobs, and the Bighorn River{'\u2019'}s
        world-class trout fishing adds recreational appeal without resort pricing.
      </p>
      <p>
        Key factors to watch include whether the {fmtPct(h?.inventoryYoY ?? null)} inventory surge
        continues — a sign of sellers capitalizing on the appreciation gap — and how Billings{'\u2019'}
        rising housing costs push more commuters toward {townName}{'\u2019'}s dramatically lower price
        point. The {appreciation != null ? `${appreciation}%` : ''} Census-to-Zillow gap shows
        a market that has appreciated meaningfully but remains accessible, with an affordability ratio
        of {h?.affordabilityRatio ?? 3.4} that most Montana communities can no longer offer.
        For those seeking Montana living with genuine affordability, Bighorn River access, and
        proximity to one of America{'\u2019'}s most significant historical sites, {townName} offers a
        combination of value and character that is increasingly difficult to find elsewhere in
        the state.
      </p>
    </article>
  );
}
