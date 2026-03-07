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
  if (n == null) return '\u2014';
  return n.toLocaleString('en-US');
}

function fmtDollar(n: number | null): string {
  if (n == null) return '\u2014';
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
        {townName}{'\u2019'}s housing market is defined by genuine affordability{'\u2014'}a rarity in
        modern Montana. With median home values around $229K, rents near $750 per month, and an
        affordability ratio of just 3.8, this is one of the few Montana hub cities where a
        median-income household can comfortably buy a home. The market serves roughly 8,412
        residents across {fmt(h?.totalHousingUnits ?? null)} total housing units, with a vacancy
        rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'} that gives buyers and
        renters real breathing room. There is no second-home frenzy, no vacation-rental arms race,
        and no tech-worker migration inflating prices{'\u2014'}just a stable, locally driven market in
        the heart of Montana{'\u2019'}s cattle country. For the broader cost picture, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>,
        or visit the full <Link href={`/montana-towns/${slug}/`}>{townName} profile</Link>.
      </p>

      <h2>Market Snapshot</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Zillow Home Value</div><div style={cardValue}>{fmtDollar(h?.zillowHomeValue ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median List Price</div><div style={cardValue}>{fmtDollar(h?.medianListPrice ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Active Listings</div><div style={cardValue}>{fmt(h?.forSaleInventory ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Inventory Change</div><div style={cardValue}>{h?.inventoryYoY != null ? `${h.inventoryYoY > 0 ? '+' : ''}${h.inventoryYoY}% YoY` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Median Rent</div><div style={cardValue}>{h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Vacancy Rate</div><div style={cardValue}>{h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'}</div></div>
      </div>
      {dateStr && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Data as of {dateStr}. Sources: Zillow ZHVI, U.S. Census ACS.</p>}

      <h2>Home Values & Pricing</h2>
      <p>
        The Zillow Home Value Index puts {townName}{'\u2019'}s typical home value at {fmtDollar(h?.zillowHomeValue ?? null)},
        while the median list price for currently active listings is {fmtDollar(h?.medianListPrice ?? null)}.
        These figures make {townName} one of the more affordable hub cities in our Montana analysis{'\u2014'}less
        than half the cost of Bozeman, Whitefish, or Livingston, and well below Helena or Kalispell.
      </p>
      <p>
        The Census Bureau{'\u2019'}s American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        reflecting the multi-year survey window (2019{'\u2013'}2023).
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values.` : ''}
        {' '}Prices in {townName} are driven by local fundamentals{'\u2014'}wages at Holy Rosary Healthcare,
        Miles Community College, Custer County government, and the agricultural sector{'\u2014'}rather
        than outside investment. This keeps the market accessible but also means appreciation has
        been modest compared to western Montana{'\u2019'}s boom-and-bust cycles.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year.` : ''}
        {h?.newListings != null ? ` New listings arrive at roughly ${h.newListings} per month.` : ''}
        {' '}While inventory is modest in absolute terms, it{'\u2019'}s proportionate to the market{'\u2019'}s size
        and demand level{'\u2014'}unlike western Montana towns where a handful of listings serves a
        crush of motivated buyers, {townName}{'\u2019'}s inventory generally keeps pace with buyer interest.
      </p>
      <p>
        The housing stock reflects {townName}{'\u2019'}s history as a railroad and ranching hub. The
        original townsite, platted in 1877 when the town served as a military cantonment, grew
        along Main Street and the surrounding grid. Many homes date to the early 1900s through
        the 1960s{'\u2014'}bungalows, ranch-style homes, and modest two-story houses built for railroad
        workers, ranchers, and the families who served the agricultural economy. Newer construction
        clusters on the town{'\u2019'}s edges, with some subdivision development on the benchlands above
        the Yellowstone and Tongue river bottoms. Large-acreage ranch properties surround the town
        in every direction, offering a different market segment for buyers seeking land and
        agricultural use.
      </p>

      <h2>Rental Market</h2>
      <p>
        Median rent in {townName} is {h?.zillowRent ? `$${fmt(h.zillowRent)} per month` : '\u2014'} according
        to Zillow{'\u2019'}s Observed Rent Index.
        The Census ACS puts the median at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'}.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        Unlike western Montana{'\u2019'}s resort and university towns, {townName}{'\u2019'}s rental market is
        not pressured by vacation rentals or seasonal tourism demand. The {h?.vacancyRate != null ? `${h.vacancyRate}%` : '10.6%'} vacancy
        rate is significantly higher than Bozeman, Livingston, or Whitefish, where rates below
        4% are common. Renters in {townName} can typically find options without months of searching
        or bidding wars. The rental stock includes apartments, duplexes, and single-family homes,
        with many units serving Miles Community College students and healthcare workers at Holy
        Rosary.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is genuinely within reach for working
        households. At 3.8, this ratio is one of the healthiest in Montana{'\u2014'}comparable to Great
        Falls (5.1) and dramatically better than Missoula (7.9), Bozeman (8.8), or Whitefish (11.7).
        A single-income household earning the median can qualify for a conventional mortgage on a
        median-priced home, something that is increasingly impossible in western Montana.
      </p>
      <p>
        Renting at {h?.zillowRent ? `$${fmt(h.zillowRent)}/mo` : '$750/mo'} is also affordable{'\u2014'}housing
        costs consume a smaller share of income here than in nearly any other Montana hub city.
        For newcomers, renting provides time to learn the community and explore neighborhoods
        before buying. Montana{'\u2019'}s low property taxes and absence of a state sales tax reduce
        ongoing ownership costs for those who do purchase.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}{'\u2019'}s housing market is stable rather than speculative. Without the external
        demand drivers that inflate western Montana markets{'\u2014'}no ski resorts, no national park
        gateway traffic, no tech-sector migration{'\u2014'}prices track local economic conditions.
        {h?.inventoryYoY != null && h.inventoryYoY < 0 ? ` The ${Math.abs(h.inventoryYoY)}% year-over-year decline in inventory bears watching, though the higher vacancy rate provides a buffer.` : ''}
      </p>
      <p>
        Key factors to watch include agricultural commodity prices (which directly affect ranch
        incomes and the broader Custer County economy), healthcare employment at Holy Rosary,
        and enrollment trends at Miles Community College. The energy sector{'\u2014'}oil and gas
        activity in the Bakken formation to the north{'\u2014'}can create periodic demand spikes when
        commodity prices rise. Remote work has been a modest tailwind, bringing a small but
        growing number of professionals who discover that {townName}{'\u2019'}s affordability, Yellowstone
        River access, and authentic Western character offer a quality of life that coastal
        salaries can turn into genuine financial freedom. For families and retirees looking for
        affordable Montana living without mountain-town price tags, {townName} remains one of
        the state{'\u2019'}s best values.
      </p>
    </article>
  );
}
