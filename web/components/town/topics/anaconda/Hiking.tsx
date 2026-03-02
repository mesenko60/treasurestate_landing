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
        {townName} sits at 5,335 feet at the foot of the Anaconda Range in southwestern Montana,
        26 miles west of Butte and 120 miles from Missoula. The town is the gateway to the{' '}
        <strong>Anaconda-Pintler Wilderness</strong>{'\u2014'}158,000 acres of alpine lakes,
        10,000-foot peaks, and Continental Divide ridgeline stretching along the border of
        Deer Lodge and Beaverhead counties. With <strong>43 trailheads</strong> within 50 miles,
        the hiking spans everything from easy canyon walks at Lost Creek State Park to strenuous
        Pintler summit routes above treeline. Georgetown Lake sits 15 miles west with lakeside
        trails, and the Continental Divide Trail passes through the Pintler range just south of
        town. This guide covers every major hiking zone accessible from {townName}. For the full
        town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>43 trailheads</strong> within 50 miles</li>
        <li><strong>10 wilderness areas</strong> within 50 miles</li>
        <li><strong>4 state parks</strong> within 50 miles</li>
        <li><strong>3 waterfalls</strong> within 50 miles including Lost Creek Falls</li>
        <li><strong>70 campgrounds</strong> within 50 miles</li>
        <li><strong>Closest trailhead:</strong> Lost Creek Falls, 5 miles</li>
        <li><strong>Closest wilderness:</strong> Anaconda-Pintler Wilderness, 11 miles south</li>
        <li><strong>Continental Divide Trail:</strong> Passes through the Pintler range</li>
        <li><strong>Ski area:</strong> Discovery Ski Area, approximately 20 miles</li>
        <li><strong>Peak season:</strong> June through October (snow at higher elevations into July)</li>
      </ul>

      <h2>Local Trails (Within 15 Miles)</h2>
      <p>
        The closest and most popular hike from {townName} is <strong>Lost Creek Falls</strong> at
        Lost Creek State Park, just 5 miles from town. A short, well-maintained trail follows Lost
        Creek through a dramatic limestone canyon with 1,200-foot walls before reaching the
        waterfall{'\u2014'}a 50-foot cascade tucked into a narrow gorge. The canyon is home to
        mountain goats and bighorn sheep that are frequently spotted on the cliff faces above the
        trail. The hike is family-friendly and accessible to most fitness levels, making it the
        go-to outing for visitors and locals alike.
      </p>
      <p>
        Beyond Lost Creek, trails near the <strong>Georgetown Lake</strong> area (15 miles west)
        offer lakeside walking and access to forested paths in the Deerlodge National Forest.
        The <strong>Stuart Mill Bay</strong> and <strong>Piney Point</strong> areas around
        Georgetown Lake provide gentle trail options with mountain views across the lake toward
        the Anaconda Range. These trails are particularly pleasant in early summer when wildflowers
        are in full bloom and the lake reflects the surrounding peaks.
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

      <h2>Anaconda-Pintler Wilderness</h2>
      <p>
        The <strong>Anaconda-Pintler Wilderness</strong> is the crown jewel of hiking near{' '}
        {townName}. This 158,000-acre wilderness area straddles the Continental Divide with peaks
        exceeding 10,000 feet, over 50 alpine lakes, and some of the most rugged and remote terrain
        in southwestern Montana. The wilderness boundary begins just 11 miles south of town, making
        {townName} the closest basecamp to the range{'\u2019'}s northern trailheads.
      </p>
      <p>
        The <strong>Continental Divide Trail (CDT)</strong> traverses the length of the
        Anaconda-Pintler Wilderness, following the ridgeline between the Bitterroot and Big Hole
        valleys. Through-hikers and day hikers alike tackle sections of the CDT for exposed
        ridgeline walks with panoramic views into both drainages. The trail crosses several
        10,000-foot passes, including <strong>Rainbow Pass</strong> and{' '}
        <strong>Cutaway Pass</strong>, where the terrain is alpine tundra with wildflower meadows
        in late July and early August.
      </p>
      <p>
        Popular Pintler destinations include <strong>Johnson Lake</strong>,{' '}
        <strong>Warren Lake</strong>, and <strong>Carpp Lake</strong>{'\u2014'}glacial basins
        tucked beneath towering headwalls that hold cutthroat trout and offer world-class
        backcountry camping. <strong>West Goat Peak</strong> (10,793 feet) and{' '}
        <strong>Mount Tiny</strong> provide challenging summit scrambles with views stretching
        from the Bitterroot Valley to the Pioneer Mountains. Most Pintler trails involve
        significant elevation gain and remote travel{'\u2014'}come prepared with maps, water
        purification, and bear spray.
      </p>

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        Beyond the immediate {townName} area, trail options expand into the surrounding national
        forest and mountain ranges. The <strong>Stucky Ridge</strong> area and{' '}
        <strong>Mount Haggin Wildlife Management Area</strong> (approximately 20 miles south)
        offer ridge hiking through open grassland and scattered timber with sweeping views of the
        Big Hole Valley and the Pintler Range. These areas see far less traffic than the
        wilderness trails and are excellent for solitude seekers and wildlife viewing{'\u2014'}elk,
        moose, and mule deer are common.
      </p>
      <p>
        The <strong>Racetrack Creek</strong> drainage (10 miles) provides access to trails climbing
        into the northern Pintler Range. <strong>Spring Hill</strong> and surrounding trailheads
        (11 miles) connect to an extensive network of forest roads and single-track trails used by
        hikers, mountain bikers, and horseback riders. Further afield, trails near{' '}
        <strong>Discovery Ski Area</strong> (approximately 20 miles) offer summer hiking on ski
        terrain with lift-accessed ridgeline options and views of the surrounding peaks.
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
        Ten federally designated wilderness areas lie within 50 miles of {townName}, an
        extraordinary concentration of protected wildlands. The{' '}
        <strong>Anaconda-Pintler Wilderness</strong> (11 miles south) is the closest and most
        significant, encompassing 158,000 acres of the Continental Divide with alpine lakes, high
        peaks, and the CDT. The <strong>Lee Metcalf Wilderness</strong> and other surrounding
        wilderness areas extend the network of roadless terrain across southwestern Montana,
        providing seemingly limitless backcountry hiking options for multi-day trips.
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
        <strong>Lost Creek State Park</strong> (5 miles) is the premier state park near{' '}
        {townName}, featuring a dramatic limestone canyon, the Lost Creek Falls waterfall, and
        regular sightings of mountain goats and bighorn sheep on the canyon walls. The park has
        a campground, picnic area, and well-maintained trail system that makes it an easy
        half-day outing from town. Additional state parks within 50 miles provide further trail
        options across the region.
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
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation trails near {townName} and
        Lost Creek State Park begin clearing of snow by mid-April. Georgetown Lake area trails
        are accessible by late April, though the lake may still have ice. Trails into the
        Anaconda-Pintler Wilderness remain snow-covered at higher elevations through May and into
        June. Wildflowers begin blooming in the valleys, and bear activity is high as grizzlies
        and black bears emerge from hibernation{'\u2014'}carry bear spray on all hikes.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Most Pintler
        Wilderness trails are snow-free by late June or early July, though snow lingers on
        north-facing slopes and high passes into mid-July. Summer highs in {townName} reach the
        mid-80s{'\u00b0'}F, but alpine trails are 20{'\u2013'}30 degrees cooler with afternoon
        thunderstorms common above treeline{'\u2014'}plan alpine hikes for early starts.
        Wildflower meadows along the CDT peak in late July. Wildfire smoke can affect air quality
        and visibility in late July and August.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider this the finest
        hiking season around {townName}. Crowds thin dramatically, larch trees turn brilliant
        gold in the high country in mid-October, and crisp mornings give way to stable, clear
        weather. The Anaconda-Pintler Wilderness is especially rewarding in September before the
        first significant snowfall. Lost Creek State Park and lower trails remain accessible
        through October and often into November.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails are buried under
        snow and inaccessible for hiking. Discovery Ski Area (approximately 20 miles) provides
        downhill skiing, and the Georgetown Lake area offers cross-country skiing and snowshoeing
        opportunities. Lost Creek State Park is typically closed in winter, but lower-elevation
        forest roads near {townName} can be snowshoed when conditions allow. Avalanche awareness
        is essential for any backcountry winter travel in the Pintler Range.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>black bear and mountain lion country</strong>. Black bears
        are common throughout the Anaconda Range and Pintler Wilderness, and mountain lion
        sightings occur regularly in the foothills. Carry bear spray on every hike, make noise
        on the trail, hike in groups when possible, and store food properly in the backcountry.
        Grizzly bears are less common than in northwest Montana but are expanding their range
        into the Pintler area{'\u2014'}treat all backcountry travel with appropriate caution.
      </p>
      <p>
        Cell service is unreliable beyond {townName} proper and nonexistent in the
        Anaconda-Pintler Wilderness and most surrounding national forest areas. Carry a paper
        map or downloaded offline maps, and let someone know your itinerary for any backcountry
        trip. Weather at alpine elevations along the Continental Divide can change
        rapidly{'\u2014'}snow is possible above 8,000 feet in any month, and lightning is a
        serious hazard on exposed ridges in summer.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
