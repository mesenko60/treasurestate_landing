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
  const skiAreas = highlights
    .filter(h => h.type === 'Ski Area')
    .slice(0, 4);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you closer to Glacier National Park than any
        other Montana town{'\u2014'}the west entrance is just 17 miles east, and
        Going-to-the-Sun Road, one of America{'\u2019'}s most iconic scenic drives,
        begins less than 20 miles away. {townName} sits at 3,077 feet in the Flathead
        Valley with Glacier Park International Airport only 8 miles south, making it
        one of the easiest gateways to reach in the Northern Rockies. The town itself
        is unpretentious{'\u2014'}a former aluminum-smelting hub that has quietly evolved
        into a practical, affordable basecamp for Glacier visitors{'\u2014'}with honest
        restaurants, easy access to the North Fork corridor, and none of the
        resort-town pricing you{'\u2019'}ll find in Whitefish or Kalispell. This three-day
        itinerary covers the essentials for first-time visitors, families, couples,
        and adventurers. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is the prime window, and the timing
        hinges on one thing: Going-to-the-Sun Road. The 50-mile highway across the
        Continental Divide typically opens fully in late June and closes by mid-October,
        depending on snowfall. When it{'\u2019'}s open, the entire Glacier National Park
        experience{'\u2014'}Logan Pass, Hidden Lake, the Highline Trail, the alpine
        meadows{'\u2014'}becomes accessible. If your trip falls outside that window, the
        park{'\u2019'}s west side (Lake McDonald, Apgar, Avalanche Creek) is still
        beautiful but the full crossing isn{'\u2019'}t possible.
      </p>
      <p>
        July and August are the warmest months{summerClimate ? ` — highs around ${summerClimate.avgHigh}°F with lows near ${summerClimate.avgLow}°F` : ''}{' '}
        — but also the busiest. A <strong>vehicle reservation</strong> is required for
        Going-to-the-Sun Road entry from late May through mid-September; book early on{' '}
        <a href="https://www.recreation.gov" target="_blank" rel="noopener noreferrer">Recreation.gov</a>,
        as slots sell out weeks in advance. Without a reservation, enter before 6 a.m.
        September is ideal for those who can swing it: warm days, thinner crowds,
        no reservation required after mid-month, and the start of larch season in the
        high country.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}September (Going-to-the-Sun Road open); December{'\u2013'}March for skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}°F, lows near {winterClimate.avgLow}°F with heavy snowfall in the mountains</li>}
        <li><strong>Getting here:</strong> Glacier Park International Airport (FCA, 8 miles south) or drive via US-2</li>
        <li><strong>Getting around:</strong> Car essential; {townName} is small but all major attractions require driving</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging is significantly cheaper than Whitefish or resort-area hotels</li>
        <li><strong>Key distances:</strong> Glacier NP west entrance 17 mi, Hungry Horse Dam 11 mi, Whitefish Mountain Resort 11 mi, Whitefish 16 mi</li>
      </ul>

      <h2>Friday: Arrive &amp; Settle In</h2>

      <h3>Arrival</h3>
      <p>
        Fly into Glacier Park International Airport (FCA), just 8 miles south of{' '}
        {townName} with daily flights from Denver, Minneapolis, Salt Lake City, Seattle,
        and other hubs. Pick up a rental car and head north on US-2{'\u2014'}you{'\u2019'}ll
        be in town in 15 minutes. Check into your lodging and get your bearings. If you{'\u2019'}re
        arriving by car from Missoula, the 130-mile drive on US-93 and US-2 takes about
        two and a half hours through some of Montana{'\u2019'}s most scenic valley and
        mountain corridors.
      </p>

      <h3>Afternoon</h3>
      <p>
        Drive 11 miles east on US-2 to the <strong>Hungry Horse Dam</strong> overlook.
        The 564-foot-high concrete arch dam{'\u2014'}completed in 1953{'\u2014'}impounds the
        South Fork of the Flathead River, creating a 34-mile-long reservoir surrounded
        by the Flathead National Forest. A visitor center offers interpretive displays
        on the dam{'\u2019'}s construction and the region{'\u2019'}s natural history, and the
        panoramic views from the dam top stretch across the reservoir to the peaks
        along Glacier{'\u2019'}s southern boundary. It{'\u2019'}s a quick stop (30{'\u2013'}60
        minutes) that provides a dramatic introduction to the scale of the landscape.
      </p>

      <h3>Evening</h3>
      <p>
        Return to {townName} for dinner. The dining scene is straightforward and
        locally focused{'\u2014'}you{'\u2019'}ll find family restaurants, burger joints, pizza,
        and a few spots that cater to the Glacier crowd without the markup. After
        dinner, take an evening stroll through <strong>River{'\u2019'}s Edge Park</strong>,
        a paved and gravel trail system following the Flathead River through the heart
        of town. The paths are flat and easy, with bald eagles, osprey, and deer
        common along the riparian corridor. On clear evenings, the sunset light on the
        surrounding peaks is exceptional.
      </p>

      <h2>Saturday: Glacier National Park</h2>
      <p>
        Dedicate the full day to Glacier{'\u2014'}this is the reason you{'\u2019'}re here.
        Pack water, snacks, layers, sunscreen, and bear spray. Leave early; the park
        gets busy by mid-morning in summer.
      </p>

      <h3>Morning: Going-to-the-Sun Road</h3>
      <p>
        Drive 17 miles east to the <strong>West Glacier entrance</strong> and begin
        the Going-to-the-Sun Road. If the road is fully open (typically late June
        through mid-October), drive the 50-mile route that climbs from the shores of
        Lake McDonald through old-growth cedar forest, past waterfalls, and up to
        Logan Pass at 6,646 feet on the Continental Divide. Pull over at overlooks
        along the way{'\u2014'}each one reveals a different angle of the glacier-carved
        valleys and thousand-foot cliff faces that define the park. Vehicle
        reservations are required for summer entry; without one, you must enter
        before 6 a.m.
      </p>

      <h3>Midday: Trail of the Cedars &amp; Avalanche Lake</h3>
      <p>
        Stop at the <strong>Avalanche Creek trailhead</strong> (24 miles from{' '}
        {townName}) for the day{'\u2019'}s main hike. Start with the{' '}
        <strong>Trail of the Cedars</strong>, a 0.7-mile wheelchair-accessible
        boardwalk loop through one of the finest old-growth western red cedar and
        hemlock groves in the Northern Rockies. The trail crosses Avalanche Creek
        on a footbridge overlooking Avalanche Gorge, where the stream has carved
        blood-red argillite into smooth, sinuous channels.
      </p>
      <p>
        From the boardwalk, continue on the <strong>Avalanche Lake Trail</strong>{'\u2014'}a
        moderate 5.8-mile round trip that climbs gently through old-growth forest
        before emerging at a turquoise glacial lake ringed by 3,000-foot cliffs. Three
        waterfalls cascade down the headwall into the lake. On calm mornings the
        reflections are extraordinary. The trailhead parking lot fills by 8 a.m. on
        summer weekends, so an early start pays off. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        more trail options and difficulty details.
      </p>

      <h3>Afternoon: Apgar Village &amp; Lake McDonald</h3>
      <p>
        After the hike, head to <strong>Apgar Village</strong> near the park{'\u2019'}s
        west entrance for lunch. The small cluster of shops, restaurants, and a visitor
        center sits at the foot of <strong>Lake McDonald</strong>{'\u2014'}Glacier{'\u2019'}s
        largest lake at 10 miles long. Spend the afternoon at Lake McDonald{'\u2019'}s
        shoreline: wade into the famously clear water, rent a kayak, or simply sit on
        the rocky beach with the Livingston Range reflected in the lake. The colored
        stones visible through the water are one of Glacier{'\u2019'}s signature
        images. If energy and time permit, drive up to Logan Pass for the{' '}
        <strong>Hidden Lake Overlook</strong> trail{'\u2014'}a 2.7-mile round trip through
        alpine meadows with wildflowers, mountain goats, and views down to a turquoise
        alpine lake backed by Bearhat Mountain. It{'\u2019'}s one of the most rewarding
        short hikes in the park.
      </p>

      <h3>Evening</h3>
      <p>
        Stay for sunset in the park{'\u2014'}Lake McDonald at golden hour is unforgettable,
        with alpenglow lighting the peaks above the lake. Then drive back to{' '}
        {townName} for a well-earned dinner. The 17-mile return takes about 25 minutes.
      </p>

      <h2>Sunday: Local Exploration &amp; Departure</h2>

      <h3>Morning</h3>
      <p>
        Choose your morning based on energy level. For panoramic mountain views, drive
        11 miles north to <strong>Whitefish Mountain Resort</strong> and hike the{' '}
        <strong>Danny On Memorial Trail</strong>{'\u2014'}a 3.8-mile climb through
        wildflower meadows and subalpine forest to the summit of Big Mountain at 6,817
        feet, delivering a 360-degree panorama stretching from Glacier National Park to
        the Flathead Valley floor. The resort runs a scenic chairlift in summer for
        those who prefer to ride up and hike down. For a mellower morning,{' '}
        <strong>Whitefish Lake State Park</strong> (9 miles) offers lakeside walking
        paths along the shore of Whitefish Lake with swimming beaches and picnic areas.
      </p>

      <h3>Midday</h3>
      <p>
        Head to <strong>Whitefish</strong> (16 miles north) for lunch. The walkable
        downtown on Central Avenue is packed with independent restaurants, boutiques,
        art galleries, and coffee roasters. It{'\u2019'}s a charming mountain town with
        a polished resort-town energy that contrasts with {townName}{'\u2019'}s working-class
        character. Tupelo Grille, Pescado Blanco, and Loula{'\u2019'}s are local favorites.
      </p>

      <h3>Afternoon</h3>
      <p>
        Before heading to the airport, make one or two quick stops. The{' '}
        <strong>Montana Vortex</strong> (in {townName}) is a quirky roadside attraction
        with optical illusions and gravitational oddities{'\u2014'}kitschy but fun,
        especially with kids. The{' '}
        <strong>Stumptown Historical Society Museum</strong> (7 miles, in Whitefish)
        traces the area{'\u2019'}s history from its origins as a Great Northern Railway
        division point through the development of the ski resort. The{' '}
        <strong>Museum of Wildlife</strong> (6 miles) and the{' '}
        <strong>Glacier Park Museum</strong> (11 miles) are also worth a stop if
        time allows.
      </p>
      <p>
        Families visiting in summer should consider <strong>Big Sky Waterpark</strong>,
        located right in {townName}{'\u2014'}a full-scale waterpark with slides, a wave
        pool, and a lazy river. <strong>Heritage Days</strong> in late July features
        parades, live music, a carnival, and the tradition of running wild horses
        through town. If golf is your thing, <strong>Meadow Lake Golf Resort</strong>{' '}
        (5 miles) offers a well-regarded 18-hole course in the shadow of the mountains.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend destination anchored by{' '}
        <strong>Whitefish Mountain Resort</strong> (11 miles north){'\u2014'}one of
        Montana{'\u2019'}s premier ski areas with 3,000 skiable acres, consistent
        inland-northwest powder, varied terrain from groomed runs to steep chutes, and
        a lively base village with dining and apr{'\u00e8'}s-ski options. The resort{'\u2019'}s
        summit reaches 6,817 feet, with 2,353 feet of vertical drop and over 300
        inches of annual snowfall.
      </p>
      <p>
        In Glacier National Park, Going-to-the-Sun Road closes to vehicles beyond Lake
        McDonald Lodge by late October, but the road to Lake McDonald remains accessible
        and becomes a beautiful corridor for <strong>snowshoeing</strong> and{' '}
        <strong>cross-country skiing</strong> along the lakefront with mountain views
        that rival the summer experience in their own way. The Apgar area provides
        winter trailhead access.
      </p>
      <p>
        Back in {townName}, cozy dining at local restaurants feels especially
        welcoming after a cold day on the mountain or the trails. Winter lodging
        rates in {townName} are often significantly lower than in Whitefish
        itself{winterClimate ? ` — expect highs around ${winterClimate.avgHigh}°F and lows near ${winterClimate.avgLow}°F in January` : ''}.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} has a Pacific-influenced continental climate at 3,077 feet.
            Summers are warm with long days and cool evenings; winters bring significant
            snowfall, particularly at higher elevations. The Flathead Valley{'\u2019'}s
            proximity to the Northern Rockies means weather can shift quickly{'\u2014'}pack
            layers year-round.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Month</th>
                <th style={thRightStyle}>Avg High (°F)</th>
                <th style={thRightStyle}>Avg Low (°F)</th>
              </tr>
            </thead>
            <tbody>
              {climate.map(c => (
                <tr key={c.month} style={rowStyle}>
                  <td style={tdStyle}>{c.month}</td>
                  <td style={tdRightStyle}>{c.avgHigh}°</td>
                  <td style={tdRightStyle}>{c.avgLow}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Layers:</strong> Even in July, Glacier{'\u2019'}s alpine elevations are 20{'\u2013'}30°F cooler than the valley floor{'\u2014'}bring a fleece or light jacket for any hike above treeline, and a warmer layer for evenings</li>
        <li><strong>Rain shell:</strong> Afternoon thunderstorms are common in summer, especially at higher elevations; a lightweight waterproof layer is essential</li>
        <li><strong>Bear spray:</strong> Carry it on every hike{'\u2014'}the {townName} area is core grizzly bear habitat, and bear encounters occur on trails throughout Glacier and the Flathead Valley</li>
        <li><strong>Park pass &amp; reservation:</strong> A Glacier National Park entrance pass ($35/vehicle for 7 days) is required, plus a separate <strong>vehicle reservation</strong> for Going-to-the-Sun Road entry from late May through mid-September{'\u2014'}book on Recreation.gov well in advance</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}UV exposure increases at alpine elevations</li>
        <li><strong>Sturdy footwear:</strong> Trail shoes or hiking boots for Avalanche Lake and any other park trails; sandals for Lake McDonald beach</li>
        <li><strong>Water and snacks:</strong> Services inside Glacier are limited outside of Apgar Village; bring enough for a full day in the park</li>
        <li><strong>Winter additions:</strong> Ski gear for Whitefish Mountain, warm base layers, snowshoes if you plan to explore Glacier{'\u2019'}s winter trails</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding Flathead Valley offer several museums worth
            a visit{'\u2014'}useful for rainy days or as quick stops on the way to or from
            the airport:
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

      {(stateParks.length > 0 || viewpoints.length > 0 || skiAreas.length > 0) && (
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
          {skiAreas.length > 0 && (
            <>
              <h3>Ski Areas</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Ski Area</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {skiAreas.map(s => (
                    <tr key={s.name} style={rowStyle}>
                      <td style={tdStyle}>{s.name}</td>
                      <td style={tdRightStyle}>{s.distMiles} mi</td>
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
        {townName} offers the most budget-friendly lodging in the Glacier corridor.
        Hotels and motels along US-2 and Nucleus Avenue put you within 15{'\u2013'}20
        minutes of both the park entrance and Whitefish Mountain Resort{'\u2014'}at rates
        well below what you{'\u2019'}d pay in Whitefish or West Glacier. Several vacation
        rentals and cabins in the surrounding area provide more space for families and
        groups. For a splurge, <strong>Meadow Lake Resort</strong> (5 miles) offers
        golf-course lodging with mountain views.
      </p>
      <p>
        Whitefish (16 miles north) has a more polished resort atmosphere with boutique
        hotels and walkable nightlife{'\u2014'}ideal if dining and apr{'\u00e8'}s-ski are
        priorities. West Glacier (17 miles east) puts you right at the park entrance
        for early starts. Many visitors who work in Whitefish or at the park choose to
        stay in {townName} for the lower cost while keeping everything within easy reach.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails, waterfalls, and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For river and lake fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
