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
        {townName} sits in central Montana at 4,121 feet — a town of roughly 6,204 people and the
        Fergus County seat, with a housing market shaped by its position as the geographic center
        of Montana and regional hub for central Montana. Big Spring Creek flows through town,
        with the Big Snowy Mountains and Judith Mountains rising to the south and east. The
        distinctive Croatian stone architecture and historic downtown preserve frontier character.
        {townName} is not a resort town — it's a county seat where healthcare, retail, and
        agriculture sustain the economy. The Yogo Inn and Main Street anchor the community.
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
      {dateStr && <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Census vs. Zillow: Appreciation in a Regional Hub</h2>
      <p>
        The Census Bureau's American Community Survey reports a median home value
        of {fmtDollar(censusValue)} in {townName}, based on a 5-year rolling average (2019–2023).
        The Zillow Home Value Index — which tracks current market conditions — puts the typical
        home at {fmtDollar(zillowValue)}.
        {appreciation != null ? ` That gap represents roughly ${appreciation}% appreciation beyond the census baseline — significant growth for a central Montana regional hub, reflecting the draw of the geographic center and regional services. Still, ${fmtDollar(zillowValue)} remains below Billings and Great Falls, keeping ${townName} in more affordable territory than Montana's larger metros.` : ''}
      </p>
      <p>
        The median list price of {fmtDollar(h?.medianListPrice ?? null)} runs above the Zillow
        Home Value Index of {fmtDollar(zillowValue)}, reflecting that active listings skew toward
        newer or higher-end properties. In a market of {fmt(h?.totalHousingUnits ?? null)} total
        units, individual sales can move the median — a Big Spring Creek view or a Judith Mountains
        vista can shift the numbers. {townName} serves as the regional hub for central Montana;
        the distinctive Croatian stone architecture and Yogo Inn add character to the market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values — near the midpoint, reflecting regional hub demand without metro pricing.` : ''}
      </p>

      <h2>Inventory &amp; Supply Trends</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` Inventory has ${h.inventoryYoY > 0 ? 'increased' : 'decreased'} ${Math.abs(h.inventoryYoY)}% compared to the same period last year — a shift that reflects stronger buyer interest and expanding supply.` : ''}
      </p>
      <p>
        With an inventory rate of 9.9 homes per 1,000 residents, {townName}'s supply is moderate
        and more available than many Montana markets. The market mix includes in-town homes,
        properties along Big Spring Creek, and parcels closer to the Big Snowy and Judith Mountains.
        New construction is limited — this is not a growth market with subdivisions — but the
        existing housing stock provides options from modest worker cottages to larger homes with
        mountain views. The 31.1% inventory increase YoY suggests a market that is opening up
        as buyers discover {townName}'s combination of affordability and central Montana location.
      </p>

      <h2>Rental Market</h2>
      <p>
        The Census ACS reports a median rent of {h?.medianRent ? `$${fmt(h.medianRent)}` : '—'} in {townName}.
        {h?.zillowRent ? ` Zillow's Observed Rent Index puts current typical rent at $${fmt(h.zillowRent)} per month.` : ''}
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns — one of the more affordable rental markets in the state.` : ''}
      </p>
      <p>
        At $896 per month, {townName}'s rent is well below Bozeman or Missoula and competitive with
        other central Montana towns. The moderate rents reflect {townName}'s smaller economy and
        distance from major employment centers, but they also make the town a genuine option for
        remote workers, retirees, and anyone seeking affordable Montana living with direct access
        to Big Spring Creek, the Charlie Russell Chew Choo, and the Big Snowy and Judith Mountains.
        The regional hub role creates steady demand for housing, but the effect on {townName}'s
        rental market is modest compared to resort towns — most residents are year-round rather
        than seasonal.
      </p>

      <h2>Vacancy &amp; Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The vacancy rate is ${h.vacancyRate}%` : ''}
        {vacantUnits ? ` — roughly ${fmt(vacantUnits)} units` : ''}
        {h?.vacancyRate != null ? `, moderate by Montana standards. This rate reflects a balance between year-round residents and some seasonal or second-home demand from those drawn to central Montana's geographic center and recreation. With 29 units specifically vacant-for-sale, there is genuine availability for buyers.` : '.'}
        {occupiedUnits ? ` Of the approximately ${fmt(occupiedUnits)} occupied units, the vast majority serve year-round residents in ${townName}'s established neighborhoods.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}'s history as a frontier town turned regional hub.
        The downtown features distinctive Croatian stone architecture — built by stonemasons who
        settled in the area — and adjacent residential blocks. Some properties carry the character
        of a central Montana county seat — views of Big Spring Creek, access to fishing and hiking,
        and the Big Snowy and Judith Mountains on the horizon. The Yogo Inn and historic Main
        Street add to the market mix, attracting buyers interested in authentic Montana living
        as much as the home itself. The retirement and second-home component is evident in the
        labor force participation rate (57.3%), suggesting a population that includes people who
        chose {townName} for lifestyle rather than employment.
      </p>

      <h2>Central Montana Regional Hub &amp; Recreation Demand</h2>
      <p>
        {townName}'s housing market is influenced by its position as the geographic center of Montana
        and regional hub for central Montana. Big Spring Creek flows through town — a blue-ribbon
        trout stream fed by one of the largest springs in the West. The Charlie Russell Chew Choo
        dinner train travels across historic trestles through pristine countryside. The Big Snowy
        Mountains and Judith Mountains rise to the south and east. Bear Gulch Pictographs and the
        American Prairie Reserve are within day-trip range.
      </p>
      <p>
        {townName}'s position on US-87 and US-191 — 125 miles from Great Falls and 125 miles from
        Billings — places it at the crossroads of central Montana without the destination tourism
        scale of resort towns. The agriculture backbone of Fergus County anchors the economy.
        These assets drive gradual appreciation and buyer interest, particularly from remote workers
        and retirees seeking central Montana living at a working price point. {townName} is unlikely
        to see the speculative surges of a Whitefish, but the 70% Census-to-Zillow appreciation
        gap shows the direction is firmly upward. The town's appeal is its authenticity: a county
        seat with a courthouse, a hospital, and prairie and mountains in every direction — not a
        manufactured resort experience.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '—'} (median home value divided
        by median household income of {fmtDollar(h?.medianHouseholdIncome ?? null)}), buying
        in {townName} requires planning but remains more achievable than in Billings or Missoula.
        At current Zillow values, a median-priced home would push monthly mortgage payments above
        the standard 28% of gross income for a single-earner household at the median, but the gap
        is far less severe than in resort communities where buying on local wages is effectively
        impossible.
      </p>
      <p>
        The 7.4% vacancy rate and 59 active listings suggest buyers have more options than in
        many Montana markets. Unlike Whitefish or Big Sky, where multiple offers and above-asking
        prices are common, {townName}'s market gives buyers time and choice. Montana's property
        taxes remain well below the national average and the state has no sales tax, reducing
        total cost of ownership. For those not ready to buy, renting at {townName}'s rates —
        {h?.rentPercentile != null ? ` ${ordinal(h.rentPercentile)} percentile statewide` : 'among the more affordable in Montana'} — offers
        one of the most affordable entry points in central Montana.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}'s housing market is driven by a combination of structural factors: the growing
        recognition of central Montana as a lifestyle destination, the appeal of affordability at
        a price point below Billings and Great Falls, and the retirement/second-home demand that
        its labor force participation rate suggests is already underway. These forces are gradual
        rather than explosive — {townName} is unlikely to see the speculative surges of a Whitefish,
        but the 70% Census-to-Zillow appreciation gap shows the direction is firmly upward.
      </p>
      <p>
        Key factors to watch include whether inventory continues to expand (up 31.1% YoY) and
        how regional hub demand evolves as remote workers and retirees discover {townName}'s
        combination of affordability and central Montana location. The 7.4% vacancy rate provides
        moderate availability that many Montana towns lack — housing is available here, and that
        availability may prove to be {townName}'s most attractive feature for buyers tired of
        competing in overheated markets elsewhere in the state. For those seeking Montana's
        geographic center at a working price point, {townName} remains one of the region's
        most compelling value propositions — a town where the real estate market reflects
        regional hub demand without the metro premium of Billings or Great Falls.
      </p>
    </article>
  );
}
