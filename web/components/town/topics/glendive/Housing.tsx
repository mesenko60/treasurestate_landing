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
        {townName} sits in eastern Montana at 2,064 feet — a town of roughly 4,873 people and the
        Dawson County seat, with a housing market shaped by its position on I-94, 220 miles east of
        Billings and 35 miles from the North Dakota border. The Yellowstone River runs through town,
        and Makoshika State Park — Montana's largest state park at 11,500 acres of badlands — rises
        at the city's edge. {townName} is a working railroad town, built by the Northern Pacific
        Railway (now BNSF), where transportation, energy, and healthcare sustain the economy.
        This guide covers current home values, rental rates, inventory trends, and the forces
        shaping {townName}'s market.
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

      <h2>Census vs. Zillow: The Most Stable Market in Montana</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That ${appreciation}% gap is the tightest of any Montana hub community — a signal that ${townName}'s market has been remarkably stable, with no speculative boom inflating prices beyond fundamentals. At ${fmtDollar(zillowValue)}, ${townName} is firmly in the lower quartile of Montana home values, offering genuine entry-level pricing for the state.` : ''}
      </p>
      <p>
        The median list price of {fmtDollar(h?.medianListPrice ?? null)} runs close to the Zillow
        Home Value Index of {fmtDollar(zillowValue)}, confirming that sellers are pricing
        realistically — there is no speculative premium on active listings. In a market of{' '}
        {fmt(h?.totalHousingUnits ?? null)} total units, individual sales can move the median,
        but the consistency between Census, Zillow, and list price data paints a picture of a
        well-grounded market. {townName}'s railroad heritage and Dawson County seat status provide
        economic stability without the volatility of oil-boom towns to the north.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — lower quartile, reflecting eastern Montana pricing rather than western Montana resort dynamics.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a meaningful expansion that gives buyers more options.` : ''}
      </p>
      <p>
        With an inventory rate of 12.1 homes per 1,000 residents, {townName}'s supply is healthy
        and well above many Montana markets. The market includes in-town homes near the historic
        downtown, properties along the Yellowstone River, and ranch parcels on the outskirts.
        New construction is limited — {townName} is not a growth market with subdivisions — but
        the existing stock provides options from modest worker homes near the BNSF yards to
        larger properties with badlands views toward Makoshika. The {h?.inventoryYoY ?? 20.4}%
        inventory increase YoY reflects a buyer's market where supply is outpacing demand,
        giving purchasers leverage that is rare in most Montana communities.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — in the lower third of the state's rental markets.` : ''}
      </p>
      <p>
        At $832 per month, {townName}'s rent is well below Billings, Bozeman, or Missoula and
        competitive with Miles City and other eastern Montana towns. The moderate rents reflect
        {townName}'s distance from western Montana population centers, but they also make the town
        a genuine option for railroad workers, energy sector employees, and retirees seeking
        affordable Montana living with Yellowstone River access and Makoshika State Park at the
        doorstep. The high vacancy rate keeps rent increases in check — landlords compete for
        tenants here, not the other way around.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, one of the highest rates among Montana hub communities. This is a decisive buyer's market: housing is readily available, and buyers have genuine choice and negotiating leverage that is extremely rare in Montana's tighter markets farther west.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s history as a Northern Pacific Railway town.
        The grid-pattern streets near the BNSF yards hold worker cottages and mid-century homes,
        while the historic downtown along Merrill Avenue features commercial buildings from the
        town's founding era in the 1880s. Properties range from modest in-town homes to ranch
        acreage outside the city limits. Unlike oil-boom towns such as Williston and Sidney, where
        housing markets have whipsawed with crude prices, {townName}'s Williston Basin exposure
        is moderate — enough to boost wages without creating the volatile boom-bust housing cycle.
      </p>

      <h2>Eastern Montana &amp; Recreation Demand</h2>
      <p>
        {townName}'s housing market benefits from Makoshika State Park — Montana's largest state
        park, with 11,500 acres of badlands, dinosaur fossils, and hiking trails — without the
        price inflation that destination parks create in western Montana. The Yellowstone River
        flows through town, offering paddlefish snagging, walleye, and catfish — a draw for
        anglers that adds lifestyle value without resort pricing.
      </p>
      <p>
        {townName}'s position on I-94 — 220 miles east of Billings and 35 miles from North
        Dakota — places it on a major transportation corridor without destination tourism pressure.
        The BNSF railroad remains central to the economy and the town's identity. Named by Sir
        George Gore in 1855 and founded in 1881, {townName} holds the record for Montana's
        all-time high temperature at 117°F in 1893 and produced Tim Babcock, the 16th Governor
        of Montana. These assets ground {townName} as an authentic eastern Montana community —
        one where the housing market reflects working-town economics, not speculation.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} is more achievable than in virtually any other Montana hub community.
        At current Zillow values, a median-priced home keeps monthly mortgage payments well
        within the standard 28% of gross income guideline — even for a single-earner household
        at the median. This is an exceptionally rare position in Montana, where most communities
        have pushed past the 3.0 comfort threshold.
      </p>
      <p>
        The {h?.vacancyRate ?? 13.3}% vacancy rate and {fmt(h?.forSaleInventory ?? null)} active
        listings mean buyers have the broadest selection of any Montana hub market. Unlike
        Bozeman or Whitefish, where multiple offers and above-asking prices are common,
        {townName}'s market gives buyers time, choice, and negotiating room. Montana's property
        taxes remain well below the national average and the state has no sales tax, reducing
        total cost of ownership. For those not ready to buy, renting at {townName}'s rates —
        {h?.rentPercentile != null ? ` ${ordinal(h.rentPercentile)} percentile statewide` : 'among the most affordable in Montana'} — offers
        one of the lowest entry points in the state.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is anchored by structural stability: the BNSF railroad provides
        consistent employment, Glendive Medical Center serves the region, and Dawson County
        government sustains baseline demand. The 3% Census-to-Zillow gap — tightest in Montana —
        shows this is not a market prone to speculative swings. Oil and gas activity from the
        Williston Basin provides periodic boosts without the destabilizing volatility seen in
        towns closer to the action.
      </p>
      <p>
        Key factors to watch include whether inventory continues to expand (up {h?.inventoryYoY ?? 20.4}%
        YoY) and how eastern Montana's appeal evolves as remote workers discover {townName}'s
        combination of I-94 connectivity, Makoshika State Park, and Yellowstone River access at
        Montana's lowest hub price point. The {h?.vacancyRate ?? 13.3}% vacancy rate provides
        the most buyer-friendly conditions in the state — housing is available and affordable here
        in a way that most Montana communities simply cannot offer. For those seeking Montana
        living at the lowest cost among hub communities, {townName} remains the state's most
        compelling value — a railroad town on the Yellowstone where the real estate market
        reflects working economics, not resort speculation.
      </p>
    </article>
  );
}
