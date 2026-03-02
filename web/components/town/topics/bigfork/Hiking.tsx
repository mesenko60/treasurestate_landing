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
        {townName} sits at 2,940 feet on the northeast shore of{' '}
        <strong>Flathead Lake</strong>{'\u2014'}the largest natural freshwater lake west of the
        Mississippi{'\u2014'}in Flathead County, Montana. The Swan River flows directly through
        town, and the <strong>Jewel Basin Hiking Area</strong> rises just 10 miles to the east
        with 35+ miles of trails and 27 alpine lakes reserved exclusively for hikers. With{' '}
        <strong>69 trailheads</strong> within 50 miles, 29 waterfalls, and{' '}
        <strong>Glacier National Park</strong> only 45 miles north, {townName} is one of
        northwest Montana{'\u2019'}s premier hiking basecamps. This guide covers every major
        hiking zone accessible from {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>69 trailheads</strong> within 50 miles</li>
        <li><strong>7 wilderness areas</strong> within 50 miles</li>
        <li><strong>5 state parks</strong> within 50 miles (Wayfarers State Park just 2 miles)</li>
        <li><strong>29 waterfalls</strong> within 50 miles{'\u2014'}more than almost any other Montana hub</li>
        <li><strong>91 campgrounds</strong> within 50 miles</li>
        <li><strong>Closest trailhead:</strong> Swan River West Trailhead, 1 mile</li>
        <li><strong>Marquee hiking:</strong> Jewel Basin Hiking Area{'\u2014'}15,349 acres, hikers-only, 27 alpine lakes</li>
        <li><strong>Day-trip range:</strong> Glacier National Park, 45 miles north</li>
        <li><strong>Ski areas:</strong> 22 within 50 miles</li>
        <li><strong>Peak season:</strong> Late June through mid-October (Jewel Basin snow-free July{'\u2013'}October)</li>
      </ul>

      <h2>Local Trails (Within 15 Miles)</h2>
      <p>
        The closest hiking from {townName} starts right in town with the{' '}
        <strong>Swan River Nature Trail</strong>{'\u2014'}an easy walk along the river suitable
        for all ages and fitness levels. The <strong>Swan River West Trailhead</strong> (1 mile)
        and <strong>Swan River East Trailhead</strong> (3 miles) provide quick access to
        riverside and forested paths. Two miles from downtown,{' '}
        <strong>Wayfarers State Park</strong> offers lakeside trails with panoramic views across
        Flathead Lake to the Mission Mountains{'\u2014'}the sunset views from the park{'\u2019'}s
        shoreline trails are among the best in the Flathead Valley.
      </p>
      <p>
        The real draw within 15 miles is the <strong>Jewel Basin Hiking Area</strong>, a
        15,349-acre hikers-only preserve in the Swan Range managed by the Flathead National
        Forest. No motorized vehicles and no horses are permitted{'\u2014'}a rarity in Montana
        that makes Jewel Basin uniquely peaceful. The area holds <strong>27 named alpine
        lakes</strong> connected by 35+ miles of maintained trails. Popular destinations include{' '}
        <strong>Black Lake</strong>, <strong>Birch Lake</strong>, <strong>Twin Lakes</strong>,
        and <strong>Picnic Lakes</strong>{'\u2014'}each set in glacial basins surrounded by
        subalpine fir and larch forest. <strong>Mount Aeneas</strong> (7,528 feet) is the
        signature summit, offering 360-degree panoramic views of Flathead Lake, the Swan Range,
        the Bob Marshall Wilderness, and Glacier National Park from its open ridgeline.
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

      <h2>Jewel Basin Hiking Area</h2>
      <p>
        <strong>Jewel Basin</strong> deserves its own section because it is THE marquee hiking
        destination near {townName} and one of the most unique hiking areas in Montana. Created
        in 1970 as the nation{'\u2019'}s first designated hiking area, the 15,349-acre preserve
        bans all motorized and horse traffic. The result is a backcountry experience that feels
        far more remote than its proximity to {townName} would suggest.
      </p>
      <p>
        <strong>Black Lake</strong> is the most popular day hike{'\u2014'}a moderate 5-mile
        round trip to a stunning alpine lake ringed by rock walls. <strong>Birch Lake</strong>{' '}
        and <strong>Twin Lakes</strong> offer longer outings with exceptional scenery and good
        backcountry camping. The traverse from <strong>Camp Misery Trailhead</strong> to{' '}
        <strong>Strawberry Lake</strong> and beyond links multiple lakes in a single day or
        overnight trip. For peak-baggers, <strong>Mount Aeneas</strong> (7,528 feet) rewards the
        climb with panoramic views that on clear days stretch from Flathead Lake to Glacier
        National Park{'\u2019'}s peaks.
      </p>
      <p>
        Jewel Basin trails are typically snow-free from <strong>July through October</strong>,
        though snowfields can linger on north-facing slopes into mid-July. The larch forests
        turn brilliant gold in early October, making fall one of the best seasons to visit. Water
        is available at most lakes but should be filtered. This is{' '}
        <strong>grizzly bear country</strong>{'\u2014'}carry bear spray and store food properly
        at all backcountry campsites.
      </p>

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        Beyond Jewel Basin, the <strong>Swan Range</strong> extends south with rugged backcountry
        options including trails accessing the <strong>Bob Marshall Wilderness</strong>. The{' '}
        <strong>Danny On Trail</strong> near Whitefish and <strong>Blacktail Mountain</strong>{' '}
        trails west of Flathead Lake provide additional day-hike options with outstanding views.
        The broader Flathead Valley offers forest trails in the Flathead National Forest, with
        trailheads scattered along the Swan Highway and the east shore of Flathead Lake.
      </p>
      <p>
        Trails in the <strong>Mission Mountains</strong> (across Flathead Lake to the west) are
        accessible as day trips from {townName} and provide some of the most dramatic alpine
        scenery in Montana. The Mission Mountain Tribal Wilderness on the Flathead Reservation
        side requires a tribal recreation permit. Further north, trails approaching{' '}
        <strong>Glacier National Park</strong> from the west side offer alternatives to the
        park{'\u2019'}s busiest corridors.
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

      <h2>Glacier National Park</h2>
      <p>
        <strong>Glacier National Park</strong> lies just 45 miles north of {townName}, making
        world-class alpine hiking accessible as a day trip. The park{'\u2019'}s 700+ miles of
        trails include iconic routes like <strong>Highline Trail</strong>,{' '}
        <strong>Grinnell Glacier Trail</strong>, and <strong>Avalanche Lake</strong>. While the
        park deserves its own extended visit, {townName}{'\u2019'}s location makes it an
        excellent basecamp for hikers who want to explore Glacier during the day and return to
        Flathead Lake{'\u2019'}s restaurants and lodging in the evening. Going-to-the-Sun Road
        typically opens fully by late June or early July.
      </p>

      <h2>Backcountry Trails (Beyond 35 Miles)</h2>
      {backcountry.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail / Trailhead</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {backcountry.map(t => (
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
        Seven federally designated wilderness areas lie within 50 miles of {townName}, reflecting
        the extraordinary concentration of protected wildlands in northwest Montana. The{' '}
        <strong>Bob Marshall Wilderness</strong> and <strong>Great Bear Wilderness</strong> to
        the east form one of the largest contiguous wilderness complexes in the lower 48 states.
        The <strong>Mission Mountains Wilderness</strong> rises across Flathead Lake to the west.
        These wilderness areas provide limitless backcountry hiking for multi-day trips into some
        of the most remote terrain in the Northern Rockies.
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
        <strong>Wayfarers State Park</strong> (2 miles) is the closest state park to {townName},
        situated on the northeast shore of Flathead Lake with lakeside trails, a campground, and
        a swim beach. The park{'\u2019'}s short trails wind through old-growth ponderosa pine
        with views across the lake to the Mission Mountains and Wild Horse Island. Four
        additional state parks lie within 50 miles, providing further trail options across the
        Flathead region.
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
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation trails around Flathead
        Lake and the Swan River valley begin clearing by mid-April. Wayfarers State Park and
        lakeside trails are accessible early. Jewel Basin and higher Swan Range trails remain
        snow-covered through May and into June. Wildflowers bloom in the valley, and bears are
        active as they emerge from hibernation{'\u2014'}carry bear spray on all hikes.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Jewel Basin trails
        are typically snow-free by early to mid-July. Summer highs in {townName} reach the low
        80s{'\u00b0'}F, but alpine trails are 15{'\u2013'}25 degrees cooler with afternoon
        thunderstorms common above treeline. Glacier National Park{'\u2019'}s Going-to-the-Sun
        Road opens fully by late June or early July. Wildfire smoke can affect air quality and
        visibility in late July and August.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider this the finest
        hiking season around {townName}. Crowds thin dramatically, larch trees turn brilliant
        gold in Jewel Basin and the Swan Range in early October, and crisp mornings give way to
        stable, clear weather. Jewel Basin is especially rewarding in September and early October
        before the first significant snowfall. Lakeside and valley trails remain accessible
        through October and often into November.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails in Jewel Basin
        and the Swan Range are buried under snow. Twenty-two ski areas lie within 50 miles,
        including Whitefish Mountain Resort and Blacktail Mountain. Lower-elevation trails near
        Flathead Lake can be snowshoed when conditions allow. Cross-country skiing is available
        throughout the Flathead Valley. Avalanche awareness is essential for any backcountry
        winter travel in the Swan Range.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>grizzly bear and black bear country</strong>. Both species
        are common throughout the Swan Range, Jewel Basin, and the broader Flathead Valley. This
        is some of the densest grizzly habitat in the lower 48 states. Carry bear spray on every
        hike, make noise on the trail, hike in groups when possible, and store food properly in
        the backcountry. Mountain lions are also present in the region.
      </p>
      <p>
        Cell service is unreliable beyond {townName} proper and nonexistent in Jewel Basin, the
        Swan Range, and most surrounding national forest areas. Carry a paper map or downloaded
        offline maps, and let someone know your itinerary for any backcountry trip. Weather at
        alpine elevations can change rapidly{'\u2014'}snow is possible above 6,000 feet in any
        month, and lightning is a serious hazard on exposed ridges like Mount Aeneas in summer.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
