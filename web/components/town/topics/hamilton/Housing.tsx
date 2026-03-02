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
        {townName}{'\u2019'}s housing market tells the story of the Bitterroot Valley{'\u2019'}s transformation
        from a quiet, affordable corner of western Montana into one of the state{'\u2019'}s most
        sought-after destinations. With {fmt(h?.totalHousingUnits ?? null)} total housing units
        serving a population of 4,659, a vacancy rate of {h?.vacancyRate != null ? `${h.vacancyRate}%` : '\u2014'},
        and {fmt(h?.forSaleInventory ?? null)} active listings, {townName} is a small market under
        growing pressure from remote workers, retirees, and out-of-state buyers drawn to the
        valley{'\u2019'}s mountain scenery, mild climate, and proximity to Missoula (47 miles north).
        Whether you{'\u2019'}re buying, renting, or investing, this guide covers current values, inventory
        dynamics, and what makes this market tick.
        For the broader cost picture, see
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
        For a town of 4,659 people, these numbers reflect the Bitterroot Valley{'\u2019'}s appeal to
        buyers from higher-cost markets{'\u2014'}particularly retirees and remote workers from the Pacific
        Northwest and California who find the valley{'\u2019'}s combination of mountain scenery, mild climate,
        and small-town character irresistible.
      </p>
      <p>
        The Census Bureau{'\u2019'}s American Community Survey reports a median home value of {fmtDollar(h?.medianHomeValue ?? null)},
        but this figure is based on a 5-year rolling average (2019{'\u2013'}2023) and significantly lags the
        current market.
        {h?.homeValuePercentile != null ? ` Among Montana towns, ${townName} ranks in the ${ordinal(h.homeValuePercentile)} percentile for home values\u2014placing it in the top ${100 - h.homeValuePercentile}% statewide.` : ''}
        {' '}{townName} is more expensive than Great Falls (~$265K) and comparable to Kalispell (~$509K),
        despite having a fraction of either city{'\u2019'}s population. The Bitterroot premium{'\u2014'}scenic
        mountain corridor, abundant recreation, proximity to Missoula{'\u2014'}drives values well beyond
        what local retail and healthcare wages alone would support.
      </p>

      <h2>Inventory & Supply</h2>
      <p>
        {townName} currently has {fmt(h?.forSaleInventory ?? null)} homes listed for sale.
        {h?.inventoryYoY != null ? ` This represents a ${Math.abs(h.inventoryYoY)}% ${h.inventoryYoY > 0 ? 'increase' : 'decrease'} compared to the same period last year${h.inventoryYoY > 0 ? '\u2014a welcome loosening of an otherwise tight market' : ''}.` : ''}
        {h?.newListings != null ? ` New listings arrive at a pace of ${h.newListings} per month.` : ''}
      </p>
      <p>
        The growing inventory (+11.1% year-over-year) is a positive signal for buyers who have
        struggled in the Bitterroot Valley{'\u2019'}s competitive market. Unlike resort towns where
        inventory declines are structural, {townName}{'\u2019'}s increase may reflect a combination of
        new construction in the surrounding valley, some seller capitulation on elevated asking
        prices, and a modest cooling from the pandemic-era frenzy that brought waves of out-of-state
        buyers. The Bitterroot Valley{'\u2019'}s geography allows for more suburban and rural development
        than geographically constrained towns like Livingston or Red Lodge{'\u2014'}the broad valley floor
        between the Bitterroot and Sapphire ranges provides buildable acreage that can absorb
        some demand pressure over time.
      </p>

      <h2>Rental Market</h2>
      <p>
        Zillow does not publish a rental index for {townName}, reflecting the small and informal
        nature of the local rental market. The Census ACS puts the median rent
        at {h?.medianRent ? `$${fmt(h.medianRent)}` : '\u2014'}.
        {h?.rentPercentile != null ? ` ${townName} ranks in the ${ordinal(h.rentPercentile)} percentile for rents among Montana towns.` : ''}
      </p>
      <p>
        The {h?.vacancyRate != null ? `${h.vacancyRate}%` : 'moderate'} vacancy rate suggests
        a rental market that is not as critically tight as Bozeman or Whitefish, but still
        constrained by {townName}{'\u2019'}s small size. Short-term vacation rentals have a smaller
        footprint here than in gateway towns near national parks, which means fewer long-term
        units are lost to the nightly rental market. For service-industry workers and young
        families, the Bitterroot Valley offers scattered rental options in Stevensville, Corvallis,
        and surrounding communities that provide alternatives if {townName} proper has limited
        availability.
      </p>

      <h2>Housing Stock</h2>
      <p>
        {townName} has {fmt(h?.totalHousingUnits ?? null)} total housing units.
        {h?.vacancyRate != null ? ` The overall vacancy rate of ${h.vacancyRate}% is moderate\u2014higher than the critically tight markets in Bozeman (3.2%) or Livingston (3.2%), suggesting slightly more breathing room for renters and buyers.` : ''}
      </p>
      <p>
        The housing stock reflects {townName}{'\u2019'}s evolution from a timber and ranching town to a
        Bitterroot Valley hub. Downtown features early-20th-century homes from the town{'\u2019'}s founding
        era, with Craftsman and vernacular styles well represented. Mid-century neighborhoods extend
        outward, while newer subdivisions and rural-residential development spread into the
        surrounding valley along the Bitterroot River corridor. South of town toward Darby, and
        north toward Corvallis and Stevensville, larger-acreage properties with mountain views
        attract buyers seeking space and privacy{'\u2014'}these often carry premium prices reflecting
        the valley{'\u2019'}s scenic appeal.
      </p>

      <h2>Buying vs. Renting</h2>
      <p>
        With an affordability ratio of {h?.affordabilityRatio ?? '\u2014'} (median home value divided
        by median household income), buying in {townName} is a significant stretch for local earners.
        The ratio of 9.5 is worse than Missoula (7.9), Bozeman (8.8), and Helena (6.6){'\u2014'}a
        reflection of {townName}{'\u2019'}s relatively modest local incomes ($53K median) against home
        values inflated by outside buyers. A dual-income professional household or a remote worker
        with a non-local salary can make ownership work; a single-income retail or service worker
        faces genuine affordability challenges.
      </p>
      <p>
        Renting provides an entry point for newcomers learning the Bitterroot Valley market, though
        the absence of Zillow rental data underscores the informal, word-of-mouth nature of many
        rental arrangements in small Montana towns. Montana{'\u2019'}s low property taxes and absence of
        a state sales tax reduce ongoing ownership costs for those who do buy.
      </p>

      <h2>Market Outlook</h2>
      <p>
        {townName}{'\u2019'}s housing market is at an inflection point. The +11.1% year-over-year inventory
        increase suggests the most acute supply pressure may be easing, and growing inventory
        gives buyers more negotiating room than they{'\u2019'}ve had in years. However, the fundamental
        demand drivers{'\u2014'}remote workers, retirees, Bitterroot Valley lifestyle seekers{'\u2014'}remain
        intact and continue to attract buyers with purchasing power above local wage levels.
      </p>
      <p>
        Key factors to watch include Missoula{'\u2019'}s growth trajectory (which pushes spillover demand
        south along US-93), remote-work trends among tech and professional-services workers, and
        the pace of new construction in the broader Bitterroot Valley. {townName}{'\u2019'}s fundamental
        appeal{'\u2014'}the Bitterroot River, Selway-Bitterroot Wilderness 10 miles west, 100 trailheads
        within 50 miles, Rocky Mountain Laboratories providing stable federal employment, and a
        mild valley climate{'\u2014'}ensures sustained interest from buyers well beyond Ravalli County.
      </p>
    </article>
  );
}
