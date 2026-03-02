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
        A weekend in {townName} is a journey into Montana{'\u2019'}s industrial past,
        its architectural treasures, and the wild mountain landscape that surrounds
        it all. Founded in 1883 by Copper King Marcus Daly as the smelting hub for
        Butte{'\u2019'}s mines, {townName} sits at 5,335 feet in the Deer Lodge Valley
        with the Anaconda-Pintler Wilderness rising to the south and Georgetown Lake
        shimmering 15 miles west. The town{'\u2019'}s population of roughly 9,400 means
        you{'\u2019'}ll find authentic Montana hospitality without tourist-town crowds{'\u2014'}plus
        a concentration of Art Deco architecture, a Jack Nicklaus golf course built on
        reclaimed smelter land, and hot springs, waterfalls, and alpine wilderness all
        within a short drive. This two-day itinerary covers the essentials. For the
        full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is the prime window for {townName}.
        Summer opens up Georgetown Lake for fishing and boating, Lost Creek State Park
        for waterfall hikes, and the Anaconda-Pintler Wilderness for alpine
        backcountry. The Old Works Golf Course is in full swing, and the Pintler
        Veterans Memorial Scenic Route (MT-1) is at its most spectacular with
        wildflowers and green valleys.
      </p>
      <p>
        July and August are the warmest months{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}{' '}
        \u2014 ideal for golfing, hiking, and lake days. September brings golden
        larch season in the high country, thinner crowds, and crisp fall air.
        Winter transforms the area into a snow-sports destination with Discovery
        Ski Area 20 miles away, ice fishing at Georgetown Lake, and year-round
        soaking at Fairmont Hot Springs.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}September for hiking, golf, and lake recreation; December{'\u2013'}March for skiing and ice fishing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F with heavy snowfall in the mountains</li>}
        <li><strong>Getting here:</strong> Drive I-90 to MT-1 from Butte (26 miles) or Missoula (110 miles); nearest airport is Bert Mooney Airport (BTM) in Butte</li>
        <li><strong>Getting around:</strong> Car essential; attractions are spread between town and the surrounding mountains and lakes</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Fairmont Hot Springs 8 mi, Lost Creek State Park 5 mi, Georgetown Lake 15 mi, Discovery Ski Area 20 mi, Butte 26 mi</li>
      </ul>

      <h2>Day 1: Heritage &amp; Hot Springs</h2>

      <h3>Morning: Downtown {townName}</h3>
      <p>
        Start with a walking tour of {townName}{'\u2019'}s remarkable downtown, which
        packs more architectural significance per block than most Montana cities.
        Begin at the <strong>Washoe Theater</strong>, a stunning Nuevo Deco movie
        palace built in 1936 and ranked fifth in the nation for interior
        architectural beauty by the Smithsonian{'\u2014'}the silver, copper, and gold
        leaf detailing inside is worth the visit alone. Walk to the{' '}
        <strong>Club Moderne</strong>, an Art Deco cocktail bar on East Park Avenue
        that{'\u2019'}s been in continuous operation since 1937 and sits on the National
        Register of Historic Places. Then visit the{' '}
        <strong>Hearst Free Library</strong>, built by Phoebe Hearst (mother of
        William Randolph Hearst) as a gift to the community{'\u2014'}the Romanesque
        Revival building is a working library that still serves the town.
        Throughout downtown you{'\u2019'}ll find brick storefronts, historic signage,
        and a brewery, coffee shops, and boutiques worth browsing.
      </p>

      <h3>Midday: Old Works Golf Course</h3>
      <p>
        Head to the <strong>Old Works Golf Course</strong>, one of the most unique
        courses in America. Designed by Jack Nicklaus and built on a reclaimed
        copper smelter site, the course features bunkers filled with black slag from
        the original smelting operations{'\u2014'}a visual and historical detail you
        won{'\u2019'}t find anywhere else. Play a full round if time allows, or simply
        tour the clubhouse, learn the smelter-to-golf-course reclamation story, and
        walk a few holes to see the slag bunkers and the Washoe Smelter Stack rising
        585 feet in the background. The Stack{'\u2014'}once the tallest freestanding
        masonry structure in the world{'\u2014'}is visible from nearly everywhere in the
        valley and anchors every view of {townName}{'\u2019'}s skyline.
      </p>

      <h3>Afternoon: Fairmont Hot Springs</h3>
      <p>
        Drive 8 miles south to <strong>Fairmont Hot Springs</strong>, a natural hot
        springs resort fed by geothermal water that surfaces at 160{'\u00B0'}F and is
        cooled to comfortable soaking temperatures. The facility has four pools: a
        large warm-water swimming pool, a hot soaking pool, and two waterslides for
        families. After a morning of walking and golf, the mineral-rich water is the
        perfect midday reset. The setting{'\u2014'}at the base of the Pintler Mountains
        with views across the valley{'\u2014'}is quintessential Montana.
      </p>

      <h3>Evening: Downtown Dinner &amp; Brewery</h3>
      <p>
        Return to {townName} for dinner at one of the downtown restaurants. The dining
        scene is unpretentious and locally focused{'\u2014'}expect hearty Montana fare,
        steaks, and pub food. Cap the evening with a pint at the local brewery. On
        clear evenings, step outside for a view of the Washoe Stack silhouetted
        against the mountain sky{'\u2014'}it{'\u2019'}s a sight unique to this town.
      </p>

      <h2>Day 2: Wilderness &amp; Water</h2>

      <h3>Morning: Lost Creek State Park</h3>
      <p>
        Drive 5 miles east to <strong>Lost Creek State Park</strong>, a compact gem
        tucked into a dramatic limestone canyon. The main attraction is the{' '}
        <strong>Lost Creek Falls</strong>{'\u2014'}a waterfall that drops through a
        narrow slot in the canyon walls, accessible via a short, moderate trail.
        The canyon{'\u2019'}s limestone cliffs are home to mountain goats; bring
        binoculars and scan the ledges and upper walls, especially in the early
        morning when they{'\u2019'}re most active. The park is uncrowded even in
        peak summer, making it one of {townName}{'\u2019'}s best-kept secrets. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        more trail options and difficulty details.
      </p>

      <h3>Midday: Pintler Scenic Route &amp; Georgetown Lake</h3>
      <p>
        Pick up the <strong>Pintler Veterans Memorial Scenic Route</strong> (MT-1)
        and drive west toward <strong>Georgetown Lake</strong>, 15 miles from town.
        The route climbs through evergreen forest with mountain views on both sides
        before arriving at the lake{'\u2014'}a 2,800-acre reservoir at 6,330 feet that{'\u2019'}s
        one of southwestern Montana{'\u2019'}s premier recreation spots. Pack a picnic
        lunch and set up at one of the lakeside pullouts. Georgetown Lake is renowned
        for rainbow and brook trout fishing, and in summer the calm water is ideal
        for kayaking, canoeing, and stand-up paddleboarding. See
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details and access points.
      </p>

      <h3>Afternoon: Anaconda-Pintler Wilderness</h3>
      <p>
        For those with energy and time, continue past Georgetown Lake to explore
        the edge of the <strong>Anaconda-Pintler Wilderness</strong>{'\u2014'}158,000
        acres of protected alpine backcountry straddling the Continental Divide.
        Several trailheads along MT-1 provide access to day hikes through
        subalpine meadows, past alpine lakes, and into terrain that sees few
        visitors. Even a short 2{'\u2013'}3 mile out-and-back from a trailhead puts
        you in genuine wilderness with mountain views and the quiet that defines
        Montana{'\u2019'}s backcountry. For a less strenuous alternative, simply
        continue the scenic loop on MT-1{'\u2014'}the drive itself is one of the most
        beautiful in the state.
      </p>

      <h3>Evening: Sunset &amp; the Washoe Stack</h3>
      <p>
        Return to {townName} in time for the evening light. The Washoe Smelter
        Stack{'\u2014'}585 feet of brick and mortar rising from the valley floor{'\u2014'}is
        most dramatic at sunset, when it catches the last golden light against
        the darkening Pintler Mountains. Find a spot along the Washoe Stack
        Interpretive Trail or simply pull over on the highway approach to town
        for the view. Grab dinner downtown and reflect on a weekend that covered
        a century of Montana history, two mountain ecosystems, and some of the
        best hot springs in the Northern Rockies.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend destination with a different
        but equally rewarding set of experiences. <strong>Discovery Ski Area</strong>{' '}
        (20 miles west on MT-1) offers 15 runs across varied terrain with short
        lift lines and affordable tickets{'\u2014'}a locals{'\u2019'} mountain with none of
        the resort-town crowds or pricing. The drive to Discovery on the Pintler
        Scenic Route is beautiful in winter, with snow-covered peaks and frosted
        forests lining the highway.
      </p>
      <p>
        <strong>Georgetown Lake</strong> transforms into one of Montana{'\u2019'}s top
        ice-fishing destinations, with anglers drilling through the ice for
        rainbow trout, brook trout, and kokanee salmon. The lake{'\u2019'}s high
        elevation ensures reliable ice through March. Combine a morning of
        ice fishing with an afternoon of skiing at Discovery for a true
        Montana winter double-header.
      </p>
      <p>
        <strong>Fairmont Hot Springs</strong> is open year-round and arguably at
        its best in winter{'\u2014'}soaking in steaming mineral water while snow falls
        around you is a quintessential Montana experience. Back in {townName},
        the Washoe Theater, Club Moderne, and downtown restaurants provide warm
        indoor escapes{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 5,335 feet in the Deer Lodge Valley with a
            semi-arid continental climate. Summers are warm and dry with cool
            mountain evenings; winters are cold with moderate snowfall in town
            and heavy snow at higher elevations. The valley{'\u2019'}s position between
            the Pintler and Flint Creek ranges creates temperature inversions in
            winter{'\u2014'}pack layers year-round.
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
        <li><strong>Layers:</strong> {townName}{'\u2019'}s 5,335-foot elevation means cool mornings and warm afternoons in summer, with Georgetown Lake and wilderness areas running 10{'\u2013'}15{'\u00B0'}F cooler{'\u2014'}bring a fleece and light jacket even in July</li>
        <li><strong>Swimsuit:</strong> Essential for Fairmont Hot Springs and Georgetown Lake in summer</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Lost Creek State Park and the Anaconda-Pintler Wilderness trails</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the {townName} area is grizzly and black bear country, particularly in the wilderness areas</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}UV exposure increases significantly at this elevation</li>
        <li><strong>Binoculars:</strong> Mountain goats at Lost Creek, eagles along the valley, and big-sky views everywhere reward a closer look</li>
        <li><strong>Golf gear:</strong> If playing Old Works, bring your own clubs or rent at the pro shop</li>
        <li><strong>Winter additions:</strong> Ski gear for Discovery, ice-fishing equipment, warm base layers, and insulated boots for Georgetown Lake</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area offer several museums and historic
            sites{'\u2014'}the town{'\u2019'}s copper-smelting heritage and early 20th-century
            architecture provide rich material for history enthusiasts:
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
        {townName} offers affordable lodging options that reflect the town{'\u2019'}s
        working-class character{'\u2014'}motels, vacation rentals, and a handful of
        bed-and-breakfasts in historic homes. Rates are well below what you{'\u2019'}d
        pay in nearby resort areas. <strong>Fairmont Hot Springs Resort</strong>{' '}
        (8 miles south) offers full resort accommodations with pool access,
        golf, and dining on-site{'\u2014'}a good option if you want to combine lodging
        with hot springs. For a more rustic experience, cabins near Georgetown
        Lake put you right on the water for morning fishing.
      </p>
      <p>
        Butte (26 miles east on I-90) provides additional hotel options and a
        lively restaurant and bar scene of its own{'\u2014'}the two towns share deep
        historical ties through the copper industry. Many visitors pair a weekend
        in {townName} with a day exploring Butte{'\u2019'}s Uptown Historic District.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails, waterfalls, and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For lake and stream fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
