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
        A weekend in {townName} drops you into Montana{'\u2019'}s geographic
        center{'\u2014'}Fergus County, where a town of 6,204 sits at 4,121 feet
        elevation, 125 miles from both Great Falls and Billings. Big Spring
        Creek, a blue-ribbon trout stream fed by one of the largest springs in
        the West, flows through town. The Charlie Russell Chew Choo dinner train
        travels across historic trestles through pristine countryside. The Big
        Snowy Mountains and Judith Mountains rise to the south and east. Add the
        Central Montana Museum, Gigantic Warm Spring, Bear Gulch Pictographs,
        and the Yogo Inn, and you have a weekend of authentic central Montana
        adventure. For the full town profile, see our{' '}
        <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through August</strong> is prime for hiking the Big Snowy
        or Judith Mountains, fishing Big Spring Creek, and soaking at Gigantic
        Warm Spring. Summer days are warm and long{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}.
        August brings the Chokecherry Festival. Winter delivers the Montana Winter
        Fair and a different character{'\u2014'}the mountains under snow, the
        Charlie Russell Chew Choo{'\u2019'}s North Pole Adventure, and uncrowded
        trails.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}August for hiking, fishing, and warm springs; August for Chokecherry Festival; winter for Montana Winter Fair</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F</li>}
        <li><strong>Getting here:</strong> US-87 and US-191; {townName} is 125 miles from Great Falls and 125 miles from Billings</li>
        <li><strong>Getting around:</strong> Car essential; attractions range from in-town to 8 miles (Gigantic Warm Spring) and beyond</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Central Montana Museum in town, Charlie Russell Chew Choo in town, Big Spring Creek in town, Gigantic Warm Spring 8 mi, Bear Gulch Pictographs, Big Snowy Mountains, Judith Mountains</li>
      </ul>

      <h2>Day 1: Dinner Train, Museum &amp; Fishing</h2>

      <h3>Morning: Charlie Russell Chew Choo</h3>
      <p>
        Start your weekend with the <strong>Charlie Russell Chew Choo</strong>,
        a premier Montana dinner train that travels through central Montana{'\u2019'}s
        countryside. Passengers enjoy a meal while the train crosses historic
        trestles and passes through pristine landscapes. The experience combines
        Montana{'\u2019'}s railroad heritage with scenic views of the Judith
        Basin and surrounding mountains. Reservations are recommended. The
        train departs from {townName} and offers a memorable introduction to
        the region.
      </p>

      <h3>Midday: Central Montana Museum</h3>
      <p>
        Return to {townName} and visit the <strong>Central Montana Museum</strong>,
        which preserves the region{'\u2019'}s heritage{'\u2014'}the Métis
        settlers who founded the town in 1879, the gold rush in the Judith
        Mountains, the Montana Railroad, and the distinctive stone architecture
        built by Croatian stonemasons. It{'\u2019'}s a perfect orientation to
        central Montana before you explore the outdoors.
      </p>

      <h3>Afternoon: Big Spring Creek Fishing</h3>
      <p>
        Spend the afternoon on <strong>Big Spring Creek</strong>, the
        blue-ribbon trout stream that flows through {townName}. Fed by one of
        the largest springs in the American West, the crystal-clear water
        supports excellent populations of rainbow and brown trout. The creek runs
        right through town, offering convenient access for fly fishing. See our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and our{' '}
        <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> for
        species details and access points.
      </p>

      <h3>Evening: Downtown {townName}</h3>
      <p>
        Return to {townName} for dinner at one of the local restaurants in the
        historic downtown. The dining scene is unpretentious and locally
        focused{'\u2014'}expect hearty Montana fare. After dinner, stroll the
        streets and take in the stone architecture. The Yogo Inn is a landmark
        hotel for overnight stays.
      </p>

      <h2>Day 2: Mountains, Warm Spring &amp; Pictographs</h2>

      <h3>Morning: Big Snowy or Judith Mountains Hike</h3>
      <p>
        Day two takes you into the <strong>Big Snowy Mountains</strong> or{' '}
        <strong>Judith Mountains</strong> for a day hike. The Big Snowy Mountains
        rise south of {townName} with rugged terrain and wilderness study area
        access. The Judith Mountains offer their own trails and historic mining
        character. Both ranges provide dramatic backdrops to the Judith Basin.
        See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        trail details, difficulty ratings, and seasonal access information.
      </p>

      <h3>Midday: Gigantic Warm Spring</h3>
      <p>
        Drive to <strong>Gigantic Warm Spring</strong>, 8 miles from {townName}.
        One of the hot springs within day-trip range, it offers a chance to soak
        after a morning hike. Pack a picnic or enjoy the area before continuing
        to Bear Gulch Pictographs.
      </p>

      <h3>Afternoon: Bear Gulch Pictographs</h3>
      <p>
        Visit <strong>Bear Gulch Pictographs</strong>, a significant rock art
        site featuring Native American pictographs and petroglyphs. The site
        preserves images created by indigenous peoples over thousands of years
        and offers a unique glimpse into the region{'\u2019'}s pre-European
        history. The area was originally territory of the Blackfoot. Visitors
        should respect the site{'\u2019'}s cultural significance and follow
        access guidelines.
      </p>

      <h3>Evening: Sunset on the Prairie</h3>
      <p>
        End your weekend with sunset views of the Big Snowy or Judith Mountains
        from town or along the road. Dinner at one of {townName}{'\u2019'}s
        local restaurants{'\u2014'}the <strong>Yogo Inn</strong> offers lodging
        and dining{'\u2014'}caps off a weekend that covered the dinner train,
        trout fishing, mountain hikes, a warm spring soak, and ancient rock art.
      </p>

      <h2>Seasonal Events</h2>
      <p>
        {townName} hosts the <strong>Chokecherry Festival</strong> in August and
        the <strong>Montana Winter Fair</strong> in winter. The Charlie Russell
        Chew Choo runs seasonally, with the North Pole Adventure train ride in
        winter. The Central Montana Fair brings rodeo, exhibits, and community
        celebration. Plan your visit around these events for an extra dose of
        local flavor.
      </p>

      <h2>Seasonal Tips</h2>
      <ul>
        <li><strong>June{'\u2013'}August:</strong> Prime for hiking the Big Snowy and Judith Mountains, fishing Big Spring Creek, and Gigantic Warm Spring</li>
        <li><strong>August:</strong> Chokecherry Festival</li>
        <li><strong>Winter:</strong> Montana Winter Fair, North Pole Adventure train, uncrowded trails</li>
        <li><strong>Bear country:</strong> The mountains are bear habitat{'\u2014'}carry bear spray on hikes and store food properly</li>
        <li><strong>Weather warning:</strong> Central Montana weather changes fast; pack layers regardless of season and check conditions before mountain hikes</li>
      </ul>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 4,121 feet in the geographic center of Montana,
            in Fergus County. Summers are warm with cool evenings; winters are
            cold with snow in the mountains. The Judith Basin can see temperature
            swings. Precipitation is moderate year-round, with more snow at
            higher elevations in the Big Snowy and Judith ranges.
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
        <li><strong>Layers:</strong> Central Montana weather changes fast{'\u2014'}bring a fleece, windbreaker, and warm base layers even in summer</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Big Snowy and Judith Mountains trails</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the mountains are bear habitat</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}the prairie and mountain trails offer varying shade</li>
        <li><strong>Camera:</strong> Mountain scenery, pictographs, and prairie landscapes reward photography</li>
        <li><strong>Fishing gear:</strong> Rod and waders for Big Spring Creek; Montana fishing license required</li>
        <li><strong>Swimsuit:</strong> For Gigantic Warm Spring</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area offer museums that reflect the
            region{'\u2019'}s frontier, mining, and agricultural history:
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
        {townName}{'\u2019'}s accommodations include the landmark{' '}
        <strong>Yogo Inn</strong>, historic properties, cabins, lodges, and
        campgrounds. Rates are well below what you{'\u2019'}d pay in resort
        areas{'\u2014'}{townName} is an authentic western town and regional
        hub, and prices reflect that. Fill up on gas before heading out{'\u2014'}
        the town is 125 miles from Great Falls and Billings.
      </p>
      <p>
        Great Falls and Billings (125 miles each) provide additional hotel
        options and the nearest major airports. Many visitors use {townName} as
        a base for exploring the Big Snowy Mountains, Judith Mountains, Bear
        Gulch Pictographs, and American Prairie Reserve, or as a stop on the
        central Montana corridor.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For creek and river fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
