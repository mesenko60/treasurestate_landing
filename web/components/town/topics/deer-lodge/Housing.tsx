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
        {townName} sits on the Clark Fork River at 4,521 feet, 37 miles northwest of Butte on
        I-90 — a small town of roughly 3,033 people in Powell County with a housing market shaped
        by its frontier ranching heritage and its role as home to Montana's first territorial
        prison. Grant-Kohrs Ranch National Historic Site preserves the town's cattle-baron past,
        while the Old Montana Prison Museum Complex draws visitors to the massive stone
        penitentiary that operated from 1871 to 1979. Today {townName}'s housing market offers
        some of the most accessible prices along the I-90 corridor, with government employment
        providing a stable buyer base and proximity to Georgetown Lake and the Anaconda-Pintler
        Wilderness adding recreation value. This guide covers current home values, rental rates,
        inventory trends, and the forces shaping {townName}'s market.
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

      <h2>Census vs. Zillow: Meaningful Appreciation in a Small Market</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — significant growth for a small town historically known for stable, affordable values, and a sign that southwest Montana's broader price surge has reached even its most modest markets.` : ''}
      </p>
      <p>
        The median list price for active listings is {fmtDollar(h?.medianListPrice ?? null)},
        above the Zillow index by roughly $49K. The premium signals a seller's market: with
        limited inventory in a town of just 3,033, sellers are pricing above recent comps and
        finding buyers willing to pay. The list-price premium suggests that the highest-quality
        homes — particularly historic properties and those with acreage — are commanding prices
        well above the market median.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — firmly mid-market.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — an unusual trend in Montana, where most markets are seeing flat or declining inventory. The growing supply gives buyers more options than they've had in recent years.` : ''}
        {h?.newListings != null ? ` New listings are arriving at roughly ${h.newListings} per month — a meaningful pace for a market of ${fmt(h?.totalHousingUnits ?? null)} total units.` : ''}
      </p>
      <p>
        With an inventory rate of 7.6 homes per 1,000 residents, {townName}'s supply is more
        generous than most Montana towns. The rising inventory is a positive signal for buyers
        who have struggled with limited options across southwest Montana. Part of the increase
        reflects the natural turnover of government employees — prison and NPS staff rotate in
        and out — while some sellers may be capitalizing on the appreciation wave before prices
        plateau. The small total market size means individual listings have outsized impact:
        a handful of new listings can move the inventory needle significantly in a town with
        just {fmt(h?.totalHousingUnits ?? null)} total housing units.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — one of the most affordable rental markets in the state.` : ''}
      </p>
      <p>
        At $781 per month, {townName}'s rent is well below Bozeman, Missoula, and even nearby
        Butte. The low rents reflect the town's small size and limited high-wage private-sector
        employment, but they make {townName} a genuine option for government workers, retirees,
        and anyone seeking affordable Montana living with outdoor-recreation access. The rental
        pool is small and turns over primarily with prison and NPS employee rotations — a
        pattern that keeps vacancy manageable and rents predictable, if not particularly
        dynamic.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, a moderate rate that reflects a mix of factors: some seasonal or second homes tied to nearby Georgetown Lake recreation, a handful of properties held for government employee housing, and some older stock that has deteriorated or is awaiting renovation.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock tells {townName}'s story in layers. The historic downtown core along
        Main Street features Victorian-era homes and commercial buildings dating to the 1880s
        and 1890s — genuine frontier architecture with ornamental brickwork, stone foundations,
        and period detailing. Mid-century neighborhoods expanded as the prison workforce and
        ranching economy grew. Newer construction is limited; {townName} has not experienced
        the building booms seen in Bozeman, Kalispell, or other growing Montana towns.
        Development is constrained less by geography than by demand — this remains a small,
        stable market where new subdivision activity is rare and most transactions involve
        existing homes.
      </p>

      <h2>Historic Character &amp; Downtown</h2>
      <p>
        {townName}'s downtown retains a distinctly frontier-era character that sets it apart
        from most Montana small towns. The Old Montana Prison — a massive stone complex that
        operated from 1871 to 1979 — now houses five museums and stands as one of the most
        significant historic structures in the state. The Cottonwood City Historic District
        preserves Victorian commercial buildings along Main Street, and several blocks of
        residential architecture from the 1880s through the early 1900s remain intact. For
        buyers drawn to historic homes, {townName} offers authentic period properties at
        prices that would be impossible in Helena, Butte, or Missoula — homes with genuine
        architectural character in a town where the history is the real thing, not a
        reconstruction.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} is within reach for dual-income households and even some single-earner
        buyers at government wages. At current prices, a median-priced home requires planning
        but the gap between renting and owning is far less severe than in Bozeman (ratio above
        10), Missoula (above 9), or resort communities where buying on local wages is
        effectively impossible.
      </p>
      <p>
        Compared to Anaconda — the nearest comparable town at 23 miles — {townName} offers a
        better affordability ratio (5.2 vs. Anaconda's 5.7) and growing inventory. Compared to
        Butte (37 miles, ratio 4.4), {townName} has lower absolute prices but also lower incomes.
        Buyers weighing these markets should consider {townName}'s commuter appeal — I-90 access
        to both Butte and Missoula (80 miles) makes it viable for workers in either city. Montana's
        property taxes remain well below the national average and the state has no sales tax,
        reducing total cost of ownership. For those not ready to buy, renting at {townName}'s
        rates offers one of the most affordable entry points in the state.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by a combination of structural factors: government
        employment providing a stable floor for demand, I-90 corridor accessibility drawing
        commuters and remote workers, and the town's recreation proximity creating lifestyle
        value that pure budget towns lack. The 15% year-over-year increase in inventory is a
        notable departure from the tightening trend across most of Montana — a signal that
        could moderate price growth and give buyers more negotiating room than they've had
        in years.
      </p>
      <p>
        Key factors to watch include the trajectory of Montana State Prison employment (the
        town's largest single employer), whether remote workers and retirees continue to
        discover {townName}'s value proposition, and the evolution of Georgetown Lake's
        recreation economy. The town's historic character — Victorian architecture, the prison
        museum complex, and Grant-Kohrs Ranch — provides a cultural identity that distinguishes
        it from generic affordable Montana towns. For buyers seeking I-90 corridor real estate
        at prices that still start under $300K, with government-job stability and genuine
        outdoor-recreation access, {townName} remains one of southwest Montana's most
        underappreciated markets.
      </p>
    </article>
  );
}
