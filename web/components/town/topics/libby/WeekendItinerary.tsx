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
        A weekend in {townName} drops you into Montana{'\u2019'}s rugged northwest
        corner{'\u2014'}Lincoln County, where the Cabinet Mountains rise from the
        Kootenai River valley and over 2 million acres of wilderness surround a
        town of 2,775 at 2,096 feet. The turquoise Kootenai River runs through
        town, renowned for world-class trout fishing. Eleven miles east,{' '}
        <strong> Kootenai Falls</strong> is Montana{'\u2019'}s largest undammed
        waterfall, featured in &quot;The River Wild&quot; and &quot;The
        Revenant,&quot; with a thrilling suspension bridge 90 feet above the
        churning waters. Add ancient cedars at Ross Creek, the Cabinet Mountains
        Wilderness, Lake Koocanusa, and Turner Mountain skiing, and you have a
        weekend of raw Montana adventure without the crowds. For the full town
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through August</strong> is prime for hiking the Cabinet
        Mountains, fishing the Kootenai River, and exploring Lake Koocanusa.
        Summer days are warm and long{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}.
        September and October bring fall colors along the river, hunting
        season, and uncrowded trails. Winter delivers a different experience{'\u2014'}
        <strong>Turner Mountain Ski Area</strong> (12 miles away) is known as
        &quot;the best little ski hill in Montana,&quot; with affordable lift
        tickets and uncrowded slopes.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}August for hiking, fishing, and Lake Koocanusa; September{'\u2013'}October for fall colors and hunting; December{'\u2013'}March for Turner Mountain skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F</li>}
        <li><strong>Getting here:</strong> US-2 from Kalispell (90 miles southeast); {townName} is 35 miles from the Idaho border, 160 miles from Spokane</li>
        <li><strong>Getting around:</strong> Car essential; attractions range from in-town to 12 miles into the mountains</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Heritage Museum 1 mi, Kootenai Falls 11 mi, Libby Dam 11 mi, Turner Mountain 12 mi, Ross Creek Cedars, Lake Koocanusa, Cabinet Mountains</li>
      </ul>

      <h2>Day 1: Waterfalls, Cedars &amp; History</h2>

      <h3>Morning: Kootenai Falls &amp; Swinging Bridge</h3>
      <p>
        Start your weekend 11 miles east of {townName} at <strong>Kootenai
        Falls</strong>, Montana{'\u2019'}s largest undammed waterfall. The
        turquoise Kootenai River drops through a dramatic gorge with water
        churning 90 feet below. Cross the suspension bridge for thrilling views
        of the falls{'\u2014'}the site is sacred to the Kootenai Tribe and has
        been featured in Hollywood films. The Kootenai Falls Wildlife Management
        Area and Kootenai Falls Park provide access. Arrive early to beat
        crowds and catch the morning light on the water.
      </p>

      <h3>Midday: Ross Creek Cedars</h3>
      <p>
        Drive to <strong>Ross Creek Cedars Scenic Area</strong>, where ancient
        western red cedars over 1,000 years old and 12 feet in diameter tower
        along a gentle interpretive trail. The grove sits on the edge of the
        Cabinet Mountains Wilderness and offers a cool, shaded walk through one
        of Montana{'\u2019'}s most impressive old-growth forests. Pack a picnic
        or enjoy the trail and return to town for lunch.
      </p>

      <h3>Afternoon: Heritage Museum</h3>
      <p>
        Return to {townName} and visit the <strong>Heritage Museum</strong>, just
        a mile from downtown. The museum preserves the town{'\u2019'}s rich
        history{'\u2014'}the Kootenai Tribe{'\u2019'}s use of the river corridor,
        the Great Northern Railway{'\u2019'}s arrival in 1892, the timber era
        when the J. Neils lumber mill employed over 1,500, vermiculite mining,
        and Libby Dam construction. It{'\u2019'}s a perfect orientation to the
        region before you explore the wilderness.
      </p>

      <h3>Evening: Downtown {townName}</h3>
      <p>
        Return to {townName} for dinner at one of the local restaurants in the
        compact downtown. The dining scene is unpretentious and locally
        focused{'\u2014'}expect hearty Montana fare. After dinner, stroll along
        the Kootenai River. On clear evenings, the Cabinet Mountains glow in
        alpenglow to the east.
      </p>

      <h2>Day 2: Cabinet Mountains or Lake Koocanusa</h2>

      <h3>Morning: Cabinet Mountains Hike or Lake Koocanusa</h3>
      <p>
        Day two takes you into the <strong>Cabinet Mountains Wilderness</strong>
        (94,360 acres) for a day hike with rugged terrain, alpine lakes, and
        abundant wildlife including grizzly bears, mountain goats, and elk. Trailheads
        along the Libby-Troy corridor provide access. Alternatively, drive to{' '}
        <strong>Lake Koocanusa</strong>, the 90-mile reservoir created by Libby
        Dam in 1975. The scenic drive along the lake is one of Montana{'\u2019'}s
        most beautiful routes. See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        trail details, difficulty ratings, and seasonal access information.
      </p>

      <h3>Midday: Mountain Picnic or Town Lunch</h3>
      <p>
        Pack a picnic lunch and eat with mountain or lake views{'\u2014'}there
        are few better lunch spots in northwest Montana than the shores of Lake
        Koocanusa or a meadow at the base of the Cabinet Mountains. If you
        prefer a sit-down meal, return to {townName} for lunch at one of the
        downtown cafes.
      </p>

      <h3>Afternoon: Kootenai River Fishing</h3>
      <p>
        Spend the afternoon on the <strong>Kootenai River</strong>, which runs
        through {townName} and offers world-class trout fishing for rainbow,
        cutthroat, and bull trout. Fly fishing is popular; local outfitters and
        guides offer float trips. Lake Koocanusa holds kokanee salmon, rainbow
        trout, and lake trout for those who prefer still water. See our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details and access points.
      </p>

      <h3>Evening: Sunset on the River</h3>
      <p>
        End your weekend with sunset views of the Cabinet Mountains from town or
        along the Kootenai River. Dinner at one of {townName}{'\u2019'}s local
        restaurants{'\u2014'}the Evergreen Motel, Country Inn, or Caboose Motel
        offer lodging and dining options{'\u2014'}caps off a weekend that covered
        Montana{'\u2019'}s largest undammed waterfall, ancient cedars, wilderness
        hiking, and world-class fishing.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend with a different character.{' '}
        <strong>Turner Mountain Ski Area</strong> (12 miles away) is a
        community-owned ski hill{'\u2014'}2,110 feet of vertical drop, affordable
        lift tickets, uncrowded runs, and the kind of local atmosphere
        that{'\u2019'}s increasingly rare in ski country. Snowmobiling and
        cross-country skiing are also popular in the surrounding Kootenai
        National Forest.
      </p>
      <p>
        The Heritage Museum stays open for winter visitors, and {townName}
        {'\u2019'}s downtown restaurants provide warm escapes from the
        cold{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
        The Cabinet Mountains under fresh snow, with the Kootenai River winding
        through the valley, offer a landscape photographer{'\u2019'}s dream.
      </p>

      <h2>Seasonal Tips</h2>
      <ul>
        <li><strong>June{'\u2013'}August:</strong> Prime for hiking the Cabinet Mountains, fishing the Kootenai, and Lake Koocanusa boating</li>
        <li><strong>September{'\u2013'}October:</strong> Fall colors along the river, hunting season, uncrowded trails</li>
        <li><strong>December{'\u2013'}March:</strong> Turner Mountain skiing, snowmobiling, cross-country skiing in Kootenai National Forest</li>
        <li><strong>Bear country:</strong> The Cabinet Mountains are grizzly bear habitat{'\u2014'}carry bear spray on every hike and store food properly</li>
        <li><strong>Weather warning:</strong> Northwest Montana weather changes fast; pack layers regardless of season and check conditions before mountain hikes</li>
      </ul>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 2,096 feet in the Kootenai River valley, sheltered
            by the Cabinet Mountains. Summers are warm and pleasant with cool
            evenings; winters are cold with snow in the mountains. The valley
            can see temperature inversions in winter. Precipitation is moderate
            year-round, with more snow at higher elevations.
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
        <li><strong>Layers:</strong> Northwest Montana weather changes fast{'\u2014'}bring a fleece, windbreaker, and warm base layers even in summer</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Kootenai Falls, Ross Creek Cedars, and Cabinet Mountains trails</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the Cabinet Mountains are prime grizzly and black bear habitat</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}the river and mountain trails offer varying shade</li>
        <li><strong>Camera:</strong> Kootenai Falls, ancient cedars, and mountain scenery reward photography</li>
        <li><strong>Fishing gear:</strong> Rod and waders for the Kootenai River; Montana fishing license required</li>
        <li><strong>Winter additions:</strong> Ski gear for Turner Mountain, insulated boots, snow gear for snowmobiling or cross-country skiing</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area offer museums that reflect the
            region{'\u2019'}s timber, mining, and river history:
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
        {townName}{'\u2019'}s accommodations include the <strong>Evergreen
        Motel</strong>, <strong>Country Inn</strong>, <strong>Caboose
        Motel</strong>, <strong>Sandman Motel</strong>, and cabin rentals like
        Kootenai Angler Guest Cabins for fishing enthusiasts. Lake Koocanusa
        Resort &amp; Marina offers waterfront cabins. Rates are well below what
        you{'\u2019'}d pay in resort areas{'\u2014'}{townName} is a working
        community with a growing tourism economy, and prices reflect that.
      </p>
      <p>
        Kalispell (90 miles southeast on US-2) provides additional hotel options
        and the nearest major airport. Many visitors use {townName} as a base
        for exploring the Cabinet Mountains, Kootenai National Forest, and Lake
        Koocanusa, or as a stop on the US-2 corridor between Glacier and Idaho.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For river and lake fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
