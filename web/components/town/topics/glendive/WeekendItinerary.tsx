import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const thStyle = { padding: '0.5rem' } as const;
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' } as const;
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && h.distMiles <= 15)
    .slice(0, 8);
  const stateParks = highlights
    .filter(h => h.type === 'State Park')
    .slice(0, 6);
  const viewpoints = highlights
    .filter(h => h.type === 'Viewpoint' && h.distMiles <= 35)
    .slice(0, 6);
  const fishingAccess = highlights
    .filter(h => h.type === 'Fishing Access' && h.distMiles <= 20)
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you in eastern Montana{'\u2019'}s badlands
        country{'\u2014'}Dawson County seat, where a town of 4,873 sits at
        2,064 feet elevation along I-94, 220 miles east of Billings and 80 miles
        east of Miles City. Makoshika State Park, Montana{'\u2019'}s largest state
        park at 11,500 acres, rises just two miles from downtown with eroded
        badlands formations and dinosaur fossils. The Yellowstone River flows
        through town, bringing paddlefish snagging in season and year-round
        walleye and catfish fishing. Add the Glendive Dinosaur &amp; Fossil
        Museum, Frontier Gateway Museum, Short Pines OHV area, and some of
        Montana{'\u2019'}s darkest skies, and you have a weekend of fossils,
        river, and open prairie. For the full town profile, see our{' '}
        <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>May through June</strong> is prime for paddlefish season on the
        Yellowstone River{'\u2014'}the signature eastern Montana event{'\u2014'}
        and comfortable hiking in Makoshika State Park.{' '}
        <strong>September through October</strong> brings ideal hiking weather
        and fall colors in the badlands{summerClimate ? `. Summer days are hot \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}.
        July and August can bring extreme heat (the all-time Montana record of
        117{'\u00B0'}F was set in {townName} in 1893), so plan outdoor
        activities for early morning or evening in midsummer.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> May{'\u2013'}June for paddlefish and spring hiking; September{'\u2013'}October for best weather and fall badlands colors</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F</li>}
        <li><strong>Getting here:</strong> I-94; {townName} is 220 miles from Billings, 80 miles from Miles City, and 90 miles from Theodore Roosevelt National Park in North Dakota</li>
        <li><strong>Getting around:</strong> Car essential; Makoshika State Park is 2 miles from downtown, Short Pines OHV area is farther out</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging rates are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Makoshika State Park 2 mi, Glendive Dinosaur &amp; Fossil Museum 2 mi, Frontier Gateway Museum 2 mi, Black Bridge Fishing Site 1 mi</li>
      </ul>

      <h2>Day 1: Badlands &amp; Dinosaurs</h2>

      <h3>Morning: Makoshika State Park</h3>
      <p>
        Start your weekend at <strong>Makoshika State Park</strong>, Montana
        {'\u2019'}s largest state park, just two miles from downtown {townName}.
        Hike the <strong>Caprock Trail</strong> through 11,500 acres of eroded
        badlands formations{'\u2014'}layered sandstone and mudstone sculpted by
        millions of years of wind and water. Stop at the named viewpoints:
        Caines Coulee, Eyeful Vista, and Artists Vista each offer a different
        perspective on the formations. The park preserves significant dinosaur
        fossil sites, including Triceratops and T. rex specimens found in the
        Hell Creek Formation.
      </p>

      <h3>Midday: Visitor Center &amp; Lunch</h3>
      <p>
        Return to the <strong>Makoshika State Park Visitor Center</strong> for
        fossil displays and interpretive exhibits that provide context for the
        geology you just hiked through. Then head into {townName} for lunch at
        one of the local restaurants{'\u2014'}the downtown is compact and
        walkable.
      </p>

      <h3>Afternoon: Dinosaur &amp; Fossil Museum</h3>
      <p>
        Spend the afternoon at the <strong>Glendive Dinosaur &amp; Fossil
        Museum</strong>, which houses Triceratops and T. rex specimens along
        with other fossils from the region. Then visit the{' '}
        <strong>Frontier Gateway Museum</strong> for pioneer and railroad
        history{'\u2014'}{townName} grew up as a Northern Pacific Railway town,
        and the museum preserves that heritage. See our{' '}
        <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link> for
        more on local history.
      </p>

      <h3>Evening: Sunset at Makoshika</h3>
      <p>
        Drive back to Makoshika State Park for sunset. The low-angle light on
        the badlands formations is spectacular{'\u2014'}reds, oranges, and
        purples emerge in layers that are muted during midday. Bring a camera.
        Dinner in downtown {townName} afterward caps the day.
      </p>

      <h2>Day 2: River &amp; Prairie</h2>

      <h3>Morning: Yellowstone River Fishing</h3>
      <p>
        Day two starts on the <strong>Yellowstone River</strong>. Head to{' '}
        <strong>Black Bridge Fishing Site</strong>, one mile from downtown, for
        walleye and catfish. If you{'\u2019'}re visiting mid-May through June,
        paddlefish snagging is THE event{'\u2014'}these prehistoric fish run up
        the Yellowstone and draw anglers from across the region. A Montana
        fishing license is required. See our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details and access points.
      </p>

      <h3>Midday: Downtown Glendive</h3>
      <p>
        Explore downtown {townName} and grab lunch at a local restaurant. The
        town serves as the Dawson County seat and regional hub for eastern
        Montana{'\u2014'}it{'\u2019'}s authentic, unpretentious, and a window
        into life along the Yellowstone River corridor.
      </p>

      <h3>Afternoon: OHV or Makoshika Encore</h3>
      <p>
        If you have an off-road vehicle, head to the{' '}
        <strong>Short Pines OHV Recreation Area</strong> for 2,800 acres of
        trails through rough eastern Montana terrain. Otherwise, return to
        Makoshika for disc golf, the archery range, or a different trail for
        photography. The park{'\u2019'}s size means you won{'\u2019'}t run out
        of new ground to cover.
      </p>

      <h3>Evening: Stargazing</h3>
      <p>
        End your weekend under {townName}{'\u2019'}s dark skies. Minimal light
        pollution makes this one of Montana{'\u2019'}s best locations for
        stargazing{'\u2014'}the Milky Way is vivid on clear nights. Makoshika
        State Park or any spot outside town offers unobstructed views. Bring
        binoculars or a telescope if you have them.
      </p>

      <h2>Seasonal Events</h2>
      <p>
        {townName}{'\u2019'}s calendar centers on the <strong>Paddlefish
        Run</strong> (mid-May through June), which draws anglers statewide. The{' '}
        <strong>Dawson County Fair</strong> brings rodeo and community
        celebration in summer. Makoshika State Park hosts interpretive programs
        and guided hikes seasonally. Plan your visit around the paddlefish run
        for the full eastern Montana experience.
      </p>

      <h2>Seasonal Tips</h2>
      <ul>
        <li><strong>May{'\u2013'}June:</strong> Paddlefish season is the signature event{'\u2014'}book lodging early; comfortable hiking weather in Makoshika</li>
        <li><strong>September{'\u2013'}October:</strong> Best hiking weather, fall colors in the badlands, fewer crowds</li>
        <li><strong>July{'\u2013'}August:</strong> Extreme heat possible (average highs in the mid-80s, record 117{'\u00B0'}F){'\u2014'}plan outdoor activities for early morning or evening</li>
        <li><strong>Winter:</strong> Quiet and cold with limited activities, but Makoshika is uncrowded and dramatic under snow</li>
        <li><strong>Rattlesnakes:</strong> Present in warm months{'\u2014'}watch your step on trails, especially in rocky terrain at Makoshika</li>
        <li><strong>Bring water:</strong> The badlands have no shade and can be brutally hot{'\u2014'}carry more water than you think you{'\u2019'}ll need</li>
      </ul>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 2,064 feet in eastern Montana{'\u2019'}s
            Yellowstone River valley, in Dawson County. Summers are hot with warm
            evenings; winters are cold and dry. The semi-arid climate brings wide
            temperature swings{'\u2014'}Montana{'\u2019'}s all-time record high
            of 117{'\u00B0'}F was set here in July 1893. Precipitation is low
            year-round.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Month</th>
                <th style={thRightStyle}>Avg High ({'\u00B0'}F)</th>
                <th style={thRightStyle}>Avg Low ({'\u00B0'}F)</th>
              </tr>
            </thead>
            <tbody>
              {climate.map(c => (
                <tr key={c.month} style={rowStyle}>
                  <td style={tdStyle}>{c.month}</td>
                  <td style={tdRightStyle}>{c.avgHigh}{'\u00B0'}</td>
                  <td style={tdRightStyle}>{c.avgLow}{'\u00B0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Water:</strong> The badlands have no shade{'\u2014'}carry at least two liters per person for any hike at Makoshika</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a wide-brimmed hat{'\u2014'}the open terrain offers no relief from the sun</li>
        <li><strong>Sturdy footwear:</strong> Hiking boots or trail shoes for the uneven, rocky terrain at Makoshika State Park</li>
        <li><strong>Layers:</strong> Eastern Montana weather can shift quickly{'\u2014'}bring a windbreaker even in summer</li>
        <li><strong>Fishing gear:</strong> Rod and tackle for the Yellowstone River; paddlefish snagging requires specialized gear; Montana fishing license required</li>
        <li><strong>Camera:</strong> Badlands formations, sunset light, and dark-sky stargazing reward photography</li>
        <li><strong>Binoculars:</strong> Useful for wildlife spotting in Makoshika and stargazing after dark</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area offer museums focused on
            paleontology, pioneer history, and the railroad heritage that built
            eastern Montana:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Museum</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {museums.map(m => (
                <tr key={m.name} style={rowStyle}>
                  <td style={tdStyle}>{m.name}</td>
                  <td style={tdRightStyle}>{m.distMiles === 0 ? 'In town' : `${m.distMiles} mi`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(stateParks.length > 0 || viewpoints.length > 0 || fishingAccess.length > 0) && (
        <>
          <h2>Highlights &amp; Nearby Attractions</h2>
          {stateParks.length > 0 && (
            <>
              <h3>State Parks</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>State Park</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {stateParks.map(p => (
                    <tr key={p.name} style={rowStyle}>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdRightStyle}>{p.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {viewpoints.length > 0 && (
            <>
              <h3>Viewpoints</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Viewpoint</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewpoints.map(v => (
                    <tr key={v.name} style={rowStyle}>
                      <td style={tdStyle}>{v.name}</td>
                      <td style={tdRightStyle}>{v.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {fishingAccess.length > 0 && (
            <>
              <h3>Fishing Access</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Fishing Access</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {fishingAccess.map(f => (
                    <tr key={f.name} style={rowStyle}>
                      <td style={tdStyle}>{f.name}</td>
                      <td style={tdRightStyle}>{f.distMiles === 0 ? 'In town' : `${f.distMiles} mi`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      <h2>Where to Stay</h2>
      <p>
        {townName}{'\u2019'}s accommodations include the{' '}
        <strong>La Quinta</strong>, <strong>Holiday Inn Express</strong>,{' '}
        <strong>Yellowstone River Inn</strong>, and{' '}
        <strong>Riverside Inn</strong>. For camping, Makoshika State Park offers
        28 sites among the badlands formations{'\u2014'}a memorable place to
        wake up. Rates across {townName} are well below resort-town prices;
        this is an authentic eastern Montana town and regional hub.
      </p>
      <p>
        Billings (220 miles west on I-94) provides the nearest major airport
        and additional hotel options. Miles City (80 miles west) and Sidney
        (90 miles north) offer alternative stops along the route. Many visitors
        use {townName} as a base for Makoshika State Park or as a stop between
        Billings and Theodore Roosevelt National Park in North Dakota.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For river fishing and paddlefish information, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
