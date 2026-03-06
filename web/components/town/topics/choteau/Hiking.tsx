import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

const thStyle: React.CSSProperties = { padding: '0.5rem' };
const thRight: React.CSSProperties = { padding: '0.5rem', textAlign: 'right' };
const tdStyle: React.CSSProperties = { padding: '0.5rem' };
const tdRight: React.CSSProperties = { padding: '0.5rem', textAlign: 'right' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' };
const headRow: React.CSSProperties = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' };
const bodyRow: React.CSSProperties = { borderBottom: '1px solid #eee' };

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const local = trails.filter(t => t.distMiles <= 15);
  const midRange = trails.filter(t => t.distMiles > 15 && t.distMiles <= 35);
  const backcountry = trails.filter(t => t.distMiles > 35).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 3,816 feet on the high plains of north-central Montana, the seat of
        Teton County and home to 1,721 people. The town is the eastern gateway to the{' '}
        <strong>Rocky Mountain Front</strong>{'\u2014'}the dramatic geological wall where the
        northern Rockies rise abruptly from the Great Plains, one of the most striking landscape
        transitions on Earth. To the west lies the{' '}
        <strong>Bob Marshall Wilderness Complex</strong>, over 1 million acres of roadless
        wilderness that ranks among the largest contiguous wilderness areas in the lower 48.
        With <strong>5 trailheads</strong> within 50 miles, {townName} is a launching point for
        everything from day hikes along the Front to multi-day expeditions deep into the
        {'\u201C'}Bob.{'\u201D'} Nine wildlife management areas, Lewis and Clark National Forest
        lands, and a full suite of Rocky Mountain predators make this some of the wildest hiking
        country in Montana. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>5 trailheads</strong> within 50 miles</li>
        <li><strong>0 federally designated wilderness areas</strong> within 50 miles</li>
        <li><strong>2 state parks</strong> within 50 miles</li>
        <li><strong>4 waterfalls</strong> within 50 miles</li>
        <li><strong>11 campgrounds</strong> within 50 miles</li>
        <li><strong>8 wildlife refuges/WMAs</strong> within 50 miles</li>
        <li><strong>Closest trailhead:</strong> South Fork Teton Trailhead, 28 miles</li>
        <li><strong>Closest wilderness:</strong> North Fork Sun River WSA, 26 miles</li>
        <li><strong>Ski area:</strong> Teton Pass Ski Area, 16 miles</li>
        <li><strong>Peak season:</strong> June through October (mountain passes may be snowbound until late June)</li>
      </ul>

      <h2>The Rocky Mountain Front</h2>
      <p>
        The <strong>Rocky Mountain Front</strong> defines hiking from {townName}. This is the
        abrupt eastern escarpment of the northern Rockies{'\u2014'}massive limestone reefs and
        overthrust ridges that rise 4,000 feet above the plains in a matter of miles, with no
        foothills to soften the transition. The Front stretches roughly 100 miles from Rogers Pass
        north to Glacier National Park, and {townName} sits at its heart. Hiking along the Front
        means walking the literal edge between two worlds: open prairie to the east and deep
        wilderness to the west.
      </p>
      <p>
        <strong>Ear Mountain WMA</strong> (22 miles) is one of the most popular day hikes on the
        Front. The trail climbs to panoramic views across the plains and into the mountain
        ranges{'\u2014'}on clear days the vista stretches from the Sweetgrass Hills near Canada to
        the Highwood Mountains east of Great Falls. <strong>Blackleaf Canyon</strong> at
        Blackleaf WMA (25 miles) offers a dramatic hike into a narrow limestone canyon that is a
        major golden eagle nesting site. The canyon walls tower overhead and the trail provides
        access to one of the most visually striking formations on the entire Front.
      </p>
      {local.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {local.map(t => (
              <tr key={t.name} style={bodyRow}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdRight}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Bob Marshall Wilderness Complex</h2>
      <p>
        The <strong>Bob Marshall Wilderness Complex</strong>{'\u2014'}known simply as{' '}
        {'\u201C'}the Bob{'\u201D'}{'\u2014'}is the crown jewel of hiking from {townName} and one
        of the most legendary wilderness areas in North America. The complex encompasses over
        1 million acres across three contiguous wilderness areas (Bob Marshall, Scapegoat, and
        Great Bear), forming a vast roadless expanse of alpine peaks, river valleys, and dense
        forest stretching west from the Rocky Mountain Front to the Swan Range.
      </p>
      <p>
        The <strong>South Fork Teton Trail</strong> (28 miles from {townName}) is the primary
        gateway into the Bob from the {townName} side. This trail follows the South Fork of the
        Teton River westward into the wilderness, climbing through lodgepole pine forest and
        subalpine meadows toward the Continental Divide. Multi-day backpacking trips from this
        trailhead access the Chinese Wall{'\u2014'}a 1,000-foot-tall limestone escarpment
        stretching 22 miles along the Divide that is one of the most iconic geological features in
        the American West. The <strong>Cave Mountain area</strong> (26 miles) provides additional
        campground-based access to backcountry trails entering the wilderness from the east.
      </p>
      <p>
        Backcountry travel in the Bob is serious undertaking. There are no maintained roads, no
        cell service, and no facilities once you cross the wilderness boundary. Many trips into the
        Bob are done with pack horses and outfitters, though experienced backpackers tackle multi-day
        routes independently. Come prepared with topographic maps, bear canisters or hang systems,
        water purification, and a realistic assessment of your backcountry skills.
      </p>

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        Between {townName} and the wilderness boundary, several trails and wildlife management
        areas provide excellent day hiking. <strong>Pine Butte Swamp Preserve</strong>, managed by
        The Nature Conservancy, protects critical grizzly bear habitat where bears roam the
        plains{'\u2014'}a rare ecological phenomenon. Trails through the preserve offer a chance to
        walk through wetlands, grasslands, and aspen groves at the base of the Front, though bear
        awareness is paramount.
      </p>
      <p>
        <strong>Freezout Lake WMA</strong> (10 miles) offers flat walking and birding trails along
        the shores of one of Montana{'\u2019'}s most important waterfowl staging areas. While not
        strenuous, the trails provide spectacular wildlife viewing{'\u2014'}particularly during
        spring and fall migrations when hundreds of thousands of snow geese and tundra swans pass
        through. The <strong>Sun River WMA</strong> (27 miles) and surrounding Lewis and Clark
        National Forest lands provide trail access along the Sun River drainage, a major corridor
        into the wilderness.
      </p>
      {midRange.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail / Trailhead</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {midRange.map(t => (
              <tr key={t.name} style={bodyRow}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdRight}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Wilderness Areas</h2>
      <p>
        No federally designated wilderness areas lie within 50 miles of {townName}, but the Rocky
        Mountain Front still gives the town quick access to exceptionally wild country. The{' '}
        <strong>North Fork Sun River WSA</strong> (26 miles) is the closest designated area,
        protecting wild country along the Sun River drainage on the eastern slope of the
        Continental Divide. The core of the Bob Marshall Wilderness Complex sits farther west and
        is better thought of as a longer outing than a truly nearby hike.
      </p>
      {wilderness.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Wilderness Area</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {wilderness.map(w => (
              <tr key={w.name} style={bodyRow}>
                <td style={tdStyle}>{w.name}</td>
                <td style={tdRight}>{w.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>State Parks</h2>
      <p>
        Two state parks lie within 50 miles of {townName}, providing maintained trail systems
        and day-use facilities. These parks offer accessible alternatives to the more remote
        wilderness trails along the Front, with established paths, interpretive signage, and
        campground access for visitors seeking a less rugged outing within easy reach of town.
      </p>
      {stateParks.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>State Park</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {stateParks.map(p => (
              <tr key={p.name} style={bodyRow}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdRight}>{p.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation trails along the plains and
        at Freezout Lake WMA are accessible by mid-April, and spring migration makes Freezout one
        of the premier birding destinations in the Northern Rockies. Trails along the Rocky Mountain
        Front remain muddy and partially snow-covered at higher elevations through May. The Bob
        Marshall Wilderness is largely inaccessible due to deep snowpack, avalanche danger, and
        swollen river crossings. Grizzly bears are emerging from hibernation across the
        Front{'\u2014'}bear spray is essential on every hike.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Most Front trails are
        clear by mid-June, though high passes into the Bob Marshall may remain snowbound until
        late June or early July. Summer highs in {townName} reach the mid-80s{'\u00b0'}F, but
        temperatures drop significantly with elevation gain into the mountains. Afternoon
        thunderstorms are common along the Front and in the wilderness{'\u2014'}plan alpine
        hikes for early starts. Wildfire smoke can affect air quality and visibility in late
        July and August.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider this the finest hiking
        season on the Rocky Mountain Front. Crowds vanish, the air is crisp and clear, and fall
        colors{'\u2014'}golden larch and aspen{'\u2014'}light up the mountain valleys. Elk bugling
        echoes along the Front in September, and wildlife viewing is exceptional. The Bob Marshall
        remains accessible through September; snow can close high passes by mid-October.
        Hunting season begins in September{'\u2014'}wear blaze orange on trails during hunting
        season.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails and the Bob
        Marshall Wilderness are buried under snow and inaccessible for hiking. Teton Pass Ski
        Area (16 miles) provides downhill skiing. Lower-elevation areas near {townName} and along
        the prairie can be walked year-round when conditions allow, but expect bitter cold and
        high winds along the Front. Avalanche danger is extreme in the mountain terrain west of
        town{'\u2014'}backcountry winter travel requires avalanche training and equipment.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>grizzly bear country</strong>{'\u2014'}this is not a
        theoretical concern. The Rocky Mountain Front is home to one of the densest grizzly bear
        populations in the lower 48, and {townName} sits where these bears move between mountain
        habitat and the plains. Wolves, mountain lions, and black bears are also present. Carry
        bear spray on every hike, make noise on the trail, hike in groups when possible, and
        store food in bear-resistant containers in the backcountry. The Pine Butte Swamp Preserve
        area is one of the few places in the lower 48 where grizzly bears use prairie
        habitat{'\u2014'}heightened awareness is required.
      </p>
      <p>
        Cell service is unreliable beyond {townName} proper and nonexistent in the Bob Marshall
        Wilderness and along most of the Rocky Mountain Front. Carry a paper map or downloaded
        offline maps, and file a trip plan for any backcountry excursion. Weather along the Front
        can change with stunning speed{'\u2014'}chinook winds can raise temperatures 40 degrees in
        hours, and summer storms build quickly over the mountains. Snow is possible above 6,000
        feet in any month.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
