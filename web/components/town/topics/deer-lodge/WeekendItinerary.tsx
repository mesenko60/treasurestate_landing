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
        A weekend in {townName} is an immersion in Montana{'\u2019'}s frontier heritage,
        from one of the nation{'\u2019'}s best-preserved 19th-century cattle ranches to a
        notorious territorial prison turned museum complex. Sitting at 4,521 feet
        in the broad Deer Lodge Valley with the Flint Creek Range to the west and
        the Anaconda-Pintler Wilderness rising to the south, {townName} is a town of
        roughly 3,000 where ranching history, mountain wilderness, and the Clark Fork
        River converge. Phil Jackson{'\u2014'}basketball Hall of Famer and winner of 11 NBA
        championships{'\u2014'}was born here in 1945, and the town{'\u2019'}s Victorian-era Main Street
        still reflects the grit and character of its frontier roots. This two-day
        itinerary covers the essentials. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is the prime window for {townName}.
        Summer opens up Georgetown Lake for fishing and kayaking, Lost Creek State
        Park for waterfall hikes, and the Anaconda-Pintler Wilderness for alpine
        backcountry. Grant-Kohrs Ranch runs its full schedule of living-history
        demonstrations, and the Pintler Veterans Memorial Scenic Route (MT-1) is
        at its most spectacular with wildflowers and green valleys.
      </p>
      <p>
        July and August are the warmest months{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}{' '}
        {'\u2014'} ideal for lake days, hiking, and exploring the outdoor attractions.
        September brings golden larch season in the high country, thinner crowds,
        and crisp fall air. Winter transforms the area into a snow-sports destination
        with Discovery Ski Area 25 miles away, ice fishing at Georgetown Lake, and
        year-round soaking at Fairmont Hot Springs.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}September for hiking, fishing, and lake recreation; December{'\u2013'}March for skiing and ice fishing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F with heavy snowfall in the mountains</li>}
        <li><strong>Getting here:</strong> I-90 between Butte (40 miles east) and Missoula (80 miles west); nearest airport is Bert Mooney Airport (BTM) in Butte</li>
        <li><strong>Getting around:</strong> Car essential; attractions are spread between town and the surrounding mountains and lakes</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; Grant-Kohrs Ranch is free (NPS site); {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Georgetown Lake 13 mi, Lost Creek State Park 12 mi, Fairmont Hot Springs 20 mi, Discovery Ski Area 25 mi, Philipsburg 37 mi</li>
      </ul>

      <h2>Day 1: Frontier Heritage</h2>

      <h3>Morning: Grant-Kohrs Ranch National Historic Site</h3>
      <p>
        Start your weekend at <strong>Grant-Kohrs Ranch National Historic Site</strong>,
        a National Park Service site that preserves one of the best-known 19th-century
        cattle ranches in the country{'\u2014'}and admission is free. Tour the original ranch
        house built by pioneer Johnny Grant and later expanded by cattle baron Conrad
        Kohrs, with period furnishings intact. Watch blacksmithing and leather-working
        demonstrations by rangers in period dress, walk among the cattle and corrals
        that still operate much as they did in the 1880s, and explore the massive
        draft-horse barn, bunkhouse, and outbuildings that line the property. The
        ranch sits on the edge of town along the Clark Fork River{'\u2014'}plan at least
        two hours to do it justice.
      </p>

      <h3>Midday: Downtown {townName}</h3>
      <p>
        Head into downtown {townName} for lunch and a walking tour of the historic Main
        Street. The town{'\u2019'}s Victorian-era commercial buildings{'\u2014'}brick facades, original
        signage, and ornate cornices{'\u2014'}reflect the wealth that cattle ranching and the
        nearby mining economy brought to the valley in the late 1800s. Browse the local
        shops, grab a coffee, and soak in the small-town atmosphere of a place that
        feels more like a living Western movie set than a tourist attraction.
      </p>

      <h3>Afternoon: Old Montana Prison Museum Complex</h3>
      <p>
        Spend the afternoon at the <strong>Old Montana Prison Museum Complex</strong>,
        one of the most unusual museum campuses in the West. The centerpiece is the
        territorial prison itself{'\u2014'}Montana{'\u2019'}s first state prison, built by convict
        labor starting in 1871, where you can walk the cell blocks, maximum-security
        wing, and exercise yard. But the complex houses four additional museums on the
        same grounds: the <strong>Montana Auto Museum</strong> with over 120 vintage and
        classic cars, <strong>Frontier Montana</strong> with one of the region{'\u2019'}s best
        collections of Western artifacts and firearms, <strong>Desert John{'\u2019'}s
        Saloon</strong> recreating a frontier drinking establishment, and{' '}
        <strong>Yesterday{'\u2019'}s Playthings</strong>, a nostalgic collection of antique
        toys and dolls. Allow 2{'\u2013'}3 hours to explore the full complex.
      </p>

      <h3>Evening: Valley Sunset</h3>
      <p>
        Wrap up Day 1 with dinner at one of {townName}{'\u2019'}s downtown restaurants{'\u2014'}expect
        hearty Montana fare with locally raised beef. After dinner, drive to a scenic
        pullout for sunset over the Deer Lodge Valley. The Flint Creek Range to the
        west catches the last golden light while the Clark Fork River winds through
        the valley floor below{'\u2014'}a wide-open Montana sunset with no crowds and no
        distractions.
      </p>

      <h2>Day 2: Mountains &amp; Water</h2>

      <h3>Morning: Georgetown Lake</h3>
      <p>
        Drive 13 miles southwest on the <strong>Pintler Veterans Memorial Scenic
        Route</strong> (MT-1) to <strong>Georgetown Lake</strong>, a 2,800-acre
        reservoir at 6,330 feet that{'\u2019'}s one of southwestern Montana{'\u2019'}s premier
        recreation spots. The drive itself is part of a 63-mile scenic byway winding
        through evergreen forest with mountain views on both sides. At the lake,
        launch a kayak, cast for rainbow and brook trout, or simply enjoy the mountain
        setting with coffee and a picnic. The calm water and mountain backdrop make
        Georgetown Lake one of the best paddle-and-fish spots in the region. See
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details and access points.
      </p>

      <h3>Midday: Lost Creek State Park</h3>
      <p>
        Head to <strong>Lost Creek State Park</strong>, 12 miles from town, tucked
        into a dramatic limestone canyon in the Flint Creek Range. The main draw is
        the <strong>Lost Creek Falls</strong>{'\u2014'}a waterfall that drops through a narrow
        slot in the canyon walls, accessible via a short, moderate trail. The canyon{'\u2019'}s
        limestone cliffs are home to mountain goats; bring binoculars and scan the
        ledges and upper walls, especially in the morning when they{'\u2019'}re most active.
        The park is uncrowded even in peak summer, making it one of {townName}{'\u2019'}s
        best-kept secrets. See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking
        guide</Link> for more trail options and difficulty details.
      </p>

      <h3>Afternoon: Philipsburg or Fairmont Hot Springs</h3>
      <p>
        Choose your afternoon adventure. <strong>Option A:</strong> Drive 37 miles
        west to <strong>Philipsburg</strong>, a beautifully restored mining town famous
        for sapphire mining{'\u2014'}you can dig for Montana sapphires at several commercial
        operations in town. From Philipsburg, visit the ghost town of{' '}
        <strong>Granite</strong>, once one of the richest silver mines in the world,
        now a haunting collection of ruins on the mountainside above town.{' '}
        <strong>Option B:</strong> Soak at <strong>Fairmont Hot Springs</strong> (about
        20 miles from {townName}), a natural hot springs resort with four pools fed by
        geothermal water{'\u2014'}the perfect way to recover after a morning of paddling and
        hiking. The setting at the base of the Pintler Mountains with views across the
        valley is quintessential Montana.
      </p>

      <h3>Evening: Valley Reflections</h3>
      <p>
        Return to {townName} for the evening. The drive back through the Deer Lodge
        Valley offers views of the Flint Creek Range and the broad agricultural
        landscape that has defined this place since Johnny Grant ran cattle here in
        the 1860s. Grab dinner downtown and reflect on a weekend that covered
        frontier ranching history, a territorial prison, alpine lakes, waterfalls,
        and the wide-open Montana landscape that ties it all together.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend destination with a different
        but equally rewarding set of experiences. <strong>Discovery Ski Area</strong>{' '}
        (25 miles west on MT-1) offers varied terrain with short lift lines and
        affordable tickets{'\u2014'}a locals{'\u2019'} mountain with none of the resort-town crowds
        or pricing. The drive to Discovery on the Pintler Scenic Route is beautiful
        in winter, with snow-covered peaks and frosted forests lining the highway.
      </p>
      <p>
        <strong>Georgetown Lake</strong> transforms into one of Montana{'\u2019'}s top
        ice-fishing destinations, with anglers drilling through the ice for rainbow
        trout, brook trout, and kokanee salmon. The lake{'\u2019'}s high elevation ensures
        reliable ice through March. Combine a morning of ice fishing with an
        afternoon of skiing at Discovery for a true Montana winter double-header.
      </p>
      <p>
        The <strong>Old Montana Prison Museum Complex</strong> is open year-round and
        makes an excellent indoor activity on cold days{'\u2014'}the five museums can
        easily fill a winter afternoon. <strong>Fairmont Hot Springs</strong> is
        arguably at its best in winter{'\u2014'}soaking in steaming mineral water while
        snow falls around you is a quintessential Montana experience. And{' '}
        <strong>Grant-Kohrs Ranch</strong> operates year-round with a quieter, more
        intimate winter atmosphere{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 4,521 feet in the Deer Lodge Valley with a
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
        <li><strong>Layers:</strong> {townName}{'\u2019'}s 4,521-foot elevation means cool mornings and warm afternoons in summer, with Georgetown Lake and wilderness areas running 10{'\u2013'}15{'\u00B0'}F cooler{'\u2014'}bring a fleece and light jacket even in July</li>
        <li><strong>Swimsuit:</strong> Essential for Fairmont Hot Springs and Georgetown Lake in summer</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Lost Creek State Park and the Anaconda-Pintler Wilderness trails</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the {townName} area is grizzly and black bear country, particularly in the wilderness areas</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}UV exposure increases significantly at this elevation</li>
        <li><strong>Binoculars:</strong> Mountain goats at Lost Creek, eagles along the Clark Fork River, and big-sky views everywhere reward a closer look</li>
        <li><strong>Fishing gear:</strong> Georgetown Lake and the Clark Fork River are prime trout water{'\u2014'}bring a rod or rent locally</li>
        <li><strong>Winter additions:</strong> Ski gear for Discovery, ice-fishing equipment, warm base layers, and insulated boots for Georgetown Lake</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} punches well above its weight for museums{'\u2014'}the Old Montana
            Prison Complex alone houses five distinct museums, and Grant-Kohrs Ranch
            is a National Historic Site operated by the National Park Service:
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
        ranching heritage{'\u2014'}motels, vacation rentals, and a handful of historic
        properties. Rates are well below what you{'\u2019'}d pay in nearby resort areas.{' '}
        <strong>Fairmont Hot Springs Resort</strong> (about 20 miles away) offers
        full resort accommodations with pool access and dining on-site{'\u2014'}a good
        option if you want to combine lodging with hot springs. For a more rustic
        experience, cabins near Georgetown Lake put you right on the water for
        morning fishing.
      </p>
      <p>
        Butte (40 miles east on I-90) provides additional hotel options and a
        lively restaurant and bar scene of its own{'\u2014'}the two towns share deep
        historical ties through the mining and ranching industries. Missoula
        (80 miles west) is the nearest larger city with a full range of
        accommodations and dining.
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
