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
        {townName} sits at 4,521 feet in the Deer Lodge Valley of Powell County, Montana,
        37 miles northwest of Butte along I-90. The Clark Fork River flows through the valley
        floor while the <strong>Flint Creek Range</strong> rises to the west and the{' '}
        <strong>Anaconda-Pintler Wilderness</strong>{'\u2014'}158,000 acres of alpine
        backcountry{'\u2014'}begins just <strong>3 miles south</strong> of town, making {townName} one
        of the closest basecamp towns to a major wilderness area in Montana. With{' '}
        <strong>10 trailheads</strong> within 30 miles, the hiking spans everything from easy river
        valley walks to strenuous summit routes above treeline on the Continental Divide. Lost Creek
        State Park lies 12 miles away with its limestone canyon and waterfall, and Georgetown Lake
        sits 13 miles southwest with lakeside trails. This guide covers every major hiking zone
        accessible from {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>10 trailheads</strong> within 30 miles</li>
        <li><strong>1 wilderness area</strong> within 30 miles</li>
        <li><strong>2 waterfalls</strong> within 30 miles</li>
        <li><strong>23 campgrounds</strong> within 30 miles</li>
        <li><strong>Closest trailhead:</strong> Seymour Creek Trailhead, 7 miles</li>
        <li><strong>Closest wilderness:</strong> Anaconda-Pintler Wilderness, 3 miles south</li>
        <li><strong>Continental Divide Trail:</strong> Passes through the Pintler range</li>
        <li><strong>Ski area:</strong> Discovery Ski Area, approximately 25 miles</li>
        <li><strong>Peak season:</strong> June through October (snow at higher elevations into July)</li>
      </ul>

      <h2>Local Trails (Within 15 Miles)</h2>
      <p>
        The extraordinary proximity of the <strong>Anaconda-Pintler Wilderness</strong>{'\u2014'}just
        3 miles from town{'\u2014'}gives {townName} immediate access to serious backcountry hiking
        that most Montana towns can only reach after a long drive. The{' '}
        <strong>Seymour Creek Trailhead</strong> (7 miles) is the nearest access point, offering
        trails that climb through mixed conifer forest into the alpine zone of the Flint Creek Range.
        The Seymour Creek area provides moderate day hikes through meadows and along creek drainages,
        with options to extend deeper into the backcountry for longer outings.
      </p>
      <p>
        <strong>Storm Lake Trail</strong> (9 miles from town) is the most popular day hike in the
        area, climbing steadily to a stunning alpine lake nestled beneath rocky peaks. The trail
        gains significant elevation but rewards hikers with one of the most scenic lake basins
        accessible as a day trip from {townName}. <strong>Barker Lakes</strong> (3 miles) offer a
        closer option for a shorter outing in the foothills, while the{' '}
        <strong>East Fork Trailhead</strong> (13 miles) opens access to the northern reaches of the
        Pintler Wilderness with trails leading to remote alpine basins.
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
        {townName}, and no town in Montana has closer access. This 158,000-acre wilderness area
        straddles the Continental Divide with peaks exceeding 10,000 feet, over 50 alpine lakes, and
        some of the most rugged and remote terrain in southwestern Montana. The wilderness boundary
        begins just 3 miles south of town, placing {townName} hikers at the trailhead faster than
        virtually any other community in the region.
      </p>
      <p>
        The <strong>Continental Divide Trail (CDT)</strong> traverses the length of the
        Anaconda-Pintler Wilderness, following the ridgeline between the Bitterroot and Big Hole
        valleys. Through-hikers and day hikers tackle sections of the CDT for exposed ridgeline
        walks with panoramic views into both drainages. The trail crosses several 10,000-foot
        passes, including <strong>Rainbow Pass</strong> and <strong>Cutaway Pass</strong>, where
        the terrain is alpine tundra with wildflower meadows in late July and early August.
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

      <h2>Flint Creek Range and Mount Powell</h2>
      <p>
        The <strong>Flint Creek Range</strong> rises immediately west of {townName}, offering ridge
        hiking, hunting access, and a distinctly different character from the Pintler Wilderness to
        the south. The range is lower and more rolling than the Pintlers, with open parks, scattered
        timber, and broad ridgelines that provide sweeping views of the Deer Lodge Valley and the
        surrounding mountain ranges.
      </p>
      <p>
        <strong>Mount Powell</strong> (10,168 feet) is the tallest peak in the Flint Creek Range and
        a worthy summit objective accessible from {townName}. The climb involves sustained elevation
        gain through forest and open alpine terrain, with panoramic views from the summit that
        stretch across the Anaconda-Pintler Wilderness, the Clark Fork corridor, and deep into the
        Big Hole Valley. The Flint Creek Range is also popular with hunters in the fall and sees
        far less hiking traffic than the Pintler Wilderness, making it an excellent choice for
        solitude seekers.
      </p>

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        Beyond the immediate {townName} area, trail options expand significantly. <strong>Lost Creek
        State Park</strong> (12 miles) features a dramatic limestone canyon with 1,200-foot walls, a
        waterfall, and regular sightings of mountain goats and bighorn sheep on the cliff faces. The
        short trail through the canyon is family-friendly and one of the most scenic easy hikes in
        southwestern Montana.
      </p>
      <p>
        <strong>Georgetown Lake</strong> (13 miles southwest) provides lakeside walking and access
        to forested paths in the Deerlodge National Forest. The <strong>Discovery Ski Area</strong>{' '}
        (approximately 25 miles) offers summer hiking on ski terrain with lift-accessed ridgeline
        options and views of the surrounding peaks. The <strong>Mount Haggin Wildlife Management
        Area</strong> south of Anaconda offers ridge hiking through open grassland and scattered
        timber with sweeping views{'\u2014'}excellent for wildlife viewing, with elk, moose, and
        mule deer common throughout.
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
        One federally designated wilderness area lies within 30 miles of {townName}, giving the
        town unusually fast access to protected backcountry. The{' '}
        <strong>Anaconda-Pintler Wilderness</strong> (3 miles south) is the closest and most
        significant, encompassing 158,000 acres of the Continental Divide with alpine lakes, high
        peaks, and the CDT. Additional wilderness areas beyond 30 miles extend the network of
        roadless terrain across southwestern Montana, providing seemingly limitless backcountry
        hiking options for multi-day trips.
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
        <strong>Lost Creek State Park</strong> (12 miles) is the nearest state park to{' '}
        {townName}, featuring a dramatic limestone canyon, the Lost Creek Falls waterfall, and
        regular sightings of mountain goats and bighorn sheep on the canyon walls. The park has
        a campground, picnic area, and well-maintained trail system that makes it an easy
        half-day outing from town.
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
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation trails in the Deer Lodge
        Valley and along the Clark Fork River begin clearing of snow by mid-April. Lost Creek
        State Park trails are typically accessible by late April. Trails into the Anaconda-Pintler
        Wilderness remain snow-covered at higher elevations through May and into June. Wildflowers
        begin blooming in the valley, and bear activity is high as black bears and occasional
        grizzlies emerge from hibernation{'\u2014'}carry bear spray on all hikes.
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
        through October and often into November. The Flint Creek Range is popular with hunters
        during this period.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails are buried under
        snow and inaccessible for hiking. Discovery Ski Area (approximately 25 miles) provides
        downhill skiing, and the Georgetown Lake area offers cross-country skiing and snowshoeing
        opportunities. Lower-elevation forest roads near {townName} and in the Clark Fork valley
        can be snowshoed when conditions allow. Avalanche awareness is essential for any backcountry
        winter travel in the Pintler Range.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>bear country</strong>{'\u2014'}both black bears and occasional
        grizzly bears inhabit the surrounding mountains. Black bears are common throughout the Flint
        Creek Range, the Pintler Wilderness, and the forested drainages near town. Grizzly bears are
        less common than in northwest Montana but are expanding their range into the Pintler
        area. Carry bear spray on every hike, make noise on the trail, hike in groups when
        possible, and store food properly in the backcountry. Mountain lion sightings occur
        regularly in the foothills surrounding the Deer Lodge Valley.
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
