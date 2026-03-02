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

const waterfalls: { name: string; distMiles: number; trail: string }[] = [
  { name: 'McDonald Falls', distMiles: 24, trail: 'Going-to-the-Sun Road pullout' },
  { name: 'Beaver Medicine Falls', distMiles: 24, trail: 'Avalanche Lake Trail' },
  { name: 'Feather Woman Falls', distMiles: 25, trail: 'Visible from Avalanche Lake' },
  { name: 'Akaiyan Falls', distMiles: 25, trail: 'Visible from Avalanche Lake' },
  { name: 'Beaver Chief Falls', distMiles: 25, trail: 'Visible from Avalanche Lake' },
  { name: 'Sacred Dancing Cascade', distMiles: 24, trail: 'McDonald Creek Trail' },
  { name: 'Monument Falls', distMiles: 27, trail: 'Monument Falls Trail' },
  { name: 'Red Rock Falls', distMiles: 28, trail: 'Red Rock Falls Trail (Many Glacier)' },
  { name: 'Siksika Falls', distMiles: 29, trail: 'St. Mary Falls Trail' },
  { name: 'St. Mary Falls', distMiles: 30, trail: 'St. Mary Falls Trail' },
  { name: 'Virginia Falls', distMiles: 30, trail: 'St. Mary / Virginia Falls Trail' },
  { name: 'Baring Falls', distMiles: 31, trail: 'Sun Point Trail' },
  { name: 'Bird Woman Falls', distMiles: 31, trail: 'Visible from Going-to-the-Sun Road' },
  { name: 'Florence Falls', distMiles: 32, trail: 'Florence Falls Trail' },
];

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const local = trails.filter(t => t.distMiles <= 15);
  const glacierDay = trails.filter(t => t.distMiles > 15 && t.distMiles <= 40);
  const backcountry = trails.filter(t => t.distMiles > 40).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 3,077 feet in the Flathead Valley of northwest Montana, just 17 miles
        from the west entrance of Glacier National Park. No other town in Montana offers a closer
        basecamp to one of America{'\u2019'}s most iconic wilderness parks. With{' '}
        <strong>84 trailheads</strong> and <strong>44 waterfalls</strong> within 50 miles, the
        hiking here spans everything from gentle river walks in town to world-renowned alpine
        traverses along the Continental Divide. Going-to-the-Sun Road{'\u2014'}one of the great
        engineering feats of the American West{'\u2014'}begins less than 20 miles east and unlocks
        trail access to glacier-carved valleys, hanging waterfalls, and subalpine meadows that
        draw hikers from around the world. The North Fork Road starts right in {townName} and
        leads to the park{'\u2019'}s remote northwest corner, while Hungry Horse Reservoir and
        the Great Bear Wilderness extend the trail network to the south. This guide covers every
        major hiking zone accessible from {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>84 trailheads</strong> within 50 miles</li>
        <li><strong>44 waterfalls</strong> within 50 miles</li>
        <li><strong>131 campgrounds</strong> within 50 miles</li>
        <li><strong>16 viewpoints</strong> within 50 miles</li>
        <li><strong>5 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>5 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> River{'\u2019'}s Edge Park, in town</li>
        <li><strong>Closest wilderness:</strong> Great Bear Wilderness, 55 miles east</li>
        <li><strong>Glacier National Park:</strong> West entrance 17 miles east</li>
        <li><strong>Ski area:</strong> Whitefish Mountain Resort, 11 miles (summer hiking via Danny On Trail)</li>
        <li><strong>Peak season note:</strong> Glacier NP requires vehicle reservation for Going-to-the-Sun Road entry, June{'\u2013'}September</li>
      </ul>

      <h2>Local Trails (Within 15 Miles)</h2>
      <p>
        {townName}{'\u2019'}s in-town hiking starts at <strong>River{'\u2019'}s Edge Park</strong>,
        a paved and gravel trail system following the Flathead River through the heart of
        town. The paths are flat, family-friendly, and connect to downtown shops and
        restaurants{'\u2014'}ideal for morning walks, evening strolls, and easy access to the
        river. Bald eagles, osprey, and white-tailed deer are common sightings along the
        riparian corridor.
      </p>
      <p>
        Ten miles north, the <strong>Danny On Memorial Trail</strong> on Big Mountain at
        Whitefish Mountain Resort is one of the Flathead Valley{'\u2019'}s signature hikes. The
        3.8-mile trail climbs 1,460 feet through wildflower meadows and subalpine forest to
        the summit at 6,817 feet, delivering a 360-degree panorama stretching from Glacier
        National Park to the Flathead Valley floor and the Whitefish Range. The resort runs a
        chairlift in summer for those who prefer to ride up and hike down. Adjacent Big Mountain
        trails extend the network with additional ridge traverses and summit loops.
      </p>
      <p>
        The <strong>Old Flathead Ranger Station</strong> trailhead (12 miles) provides access to
        forested paths along the Middle Fork of the Flathead River. <strong>Apgar Lookout
        Trail</strong> (12 miles), just inside Glacier{'\u2019'}s west boundary, climbs 1,850
        feet over 3.6 miles to a fire lookout with commanding views of Lake McDonald and the
        Livingston Range. <strong>Smith Lake</strong> and <strong>Boundary Trail</strong>{' '}
        trailheads (14 miles) offer quieter forest walks near the park boundary, while{' '}
        <strong>Swift Creek</strong> (14 miles) follows a tumbling mountain stream through
        dense cedar forest.
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

      <h2>Glacier National Park: Iconic Hikes</h2>
      <p>
        Glacier National Park is the reason hikers come to {townName}. The park holds over 700
        miles of maintained trail across one of the most dramatic alpine landscapes in North
        America, and {townName}{'\u2019'}s 17-mile proximity to the west entrance makes it the
        closest Montana town to the park{'\u2019'}s trail system. Four hikes stand above the rest.
      </p>

      <h3>Avalanche Lake</h3>
      <p>
        The 5.9-mile round-trip to Avalanche Lake is Glacier{'\u2019'}s most popular hike and one
        of the finest moderate trails in the Northern Rockies. The path climbs gently through
        old-growth cedar and hemlock forest{'\u2014'}following Avalanche Creek through a narrow
        gorge{'\u2014'}before emerging at a turquoise glacial lake ringed by 3,000-foot cliffs.
        Three waterfalls{'\u2014'}Beaver Medicine Falls, Feather Woman Falls, and Akaiyan
        Falls{'\u2014'}cascade down the headwall into the lake. On calm mornings the reflections
        are extraordinary. The trailhead is 24 miles from {townName} along Going-to-the-Sun Road.
        Arrive early; the parking lot fills by 8 a.m. in summer.
      </p>

      <h3>Trail of the Cedars</h3>
      <p>
        Adjacent to the Avalanche Lake trailhead, the <strong>Trail of the Cedars</strong> is a
        0.7-mile wheelchair-accessible boardwalk loop through one of the finest old-growth western
        red cedar and hemlock groves in the Northern Rockies. The trail crosses Avalanche Creek on
        a footbridge overlooking Avalanche Gorge, where the stream has sculpted blood-red argillite
        into smooth, sinuous channels. It{'\u2019'}s a quick walk with outsized impact{'\u2014'}the
        ancient forest canopy, the sound of rushing water, and the moss-covered giants create a
        cathedral atmosphere.
      </p>

      <h3>Highline Trail</h3>
      <p>
        Widely considered one of the best hikes in the United States, the Highline Trail is an
        11.8-mile point-to-point traverse from Logan Pass along the Garden Wall{'\u2014'}a sheer
        arête along the Continental Divide. The trail follows a narrow shelf blasted into the
        cliff face, with wildflower meadows, mountain goat sightings, and unobstructed views
        into glacier-carved valleys on both sides. The route passes through Haystack Butte and
        descends to Granite Park Chalet before continuing to The Loop, where a shuttle returns
        hikers to Logan Pass. Logan Pass is approximately 34 miles from {townName} via
        Going-to-the-Sun Road. The trail is typically snow-free from early July through
        mid-September. The initial cliff-edge section has a cable handhold{'\u2014'}it{'\u2019'}s
        exposed but not technical.
      </p>

      <h3>Hidden Lake Overlook</h3>
      <p>
        Starting from the Logan Pass Visitor Center, the 2.7-mile round-trip to Hidden Lake
        Overlook is one of Glacier{'\u2019'}s most rewarding short hikes. A boardwalk climbs
        through alpine meadows that explode with beargrass, glacier lilies, and Indian paintbrush
        in July, cresting a ridge with views down to the turquoise waters of Hidden Lake and the
        rugged peaks of the Livingston Range. Mountain goats are almost guaranteed here{'\u2014'}the
        meadows around Logan Pass support one of the most visible mountain goat populations in
        North America. Continuing below the overlook to the lakeshore adds 3 miles round trip and
        1,300 feet of elevation change on the return.
      </p>

      <h2>Going-to-the-Sun Road Trails</h2>
      <p>
        Going-to-the-Sun Road is a 50-mile National Historic Landmark highway that bisects
        Glacier National Park from west to east, climbing from the shores of Lake McDonald to
        Logan Pass at 6,646 feet before descending to St. Mary. Trailheads line the road at
        regular intervals, and from {townName} the western approach offers a progression of hikes
        that climb from valley-floor forest to the alpine zone.
      </p>
      <p>
        Near Lake McDonald, the <strong>McDonald Creek Trail</strong> follows the crystalline
        creek through riverside forest past Sacred Dancing Cascade. <strong>Johns Lake
        Loop</strong> (1.8 miles) winds through forest with views of McDonald Creek.
        Higher along the road, the <strong>Oberlin Bend</strong> viewpoint (31 miles) and{' '}
        <strong>Jackson Glacier Overlook</strong> (33 miles) provide roadside access to
        sweeping vistas without a long hike. The <strong>St. Mary Falls</strong> and{' '}
        <strong>Virginia Falls</strong> trails on the east side (30 miles) offer a moderate
        3.6-mile round trip to two stunning waterfalls in quick succession{'\u2014'}a strong
        candidate for the best short waterfall hike in the park.
      </p>
      {glacierDay.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail / Trailhead</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {glacierDay.map(t => (
              <tr key={t.name} style={bodyRow}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdRight}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Waterfall Guide</h2>
      <p>
        With <strong>44 named waterfalls</strong> within 50 miles, {townName} has a legitimate
        claim as the waterfall capital of Montana. The vast majority are concentrated in Glacier
        National Park, fed by snowmelt and glacial runoff cascading down cirque headwalls and
        narrow gorges. Many are visible from trails along Going-to-the-Sun Road; others require
        backcountry hikes to reach. The density of waterfalls around Avalanche Lake alone{'\u2014'}where
        three named falls plunge into a single glacial basin{'\u2014'}is unmatched elsewhere in the
        Northern Rockies.
      </p>
      <p>
        The most accessible waterfalls cluster along two corridors: the Avalanche Creek
        drainage (McDonald Falls, Sacred Dancing Cascade, Beaver Medicine Falls, and the three
        Avalanche Lake headwall falls) and the eastern Going-to-the-Sun Road (St. Mary Falls,
        Virginia Falls, Baring Falls, and Florence Falls). <strong>Bird Woman Falls</strong>,
        visible from a pullout along Going-to-the-Sun Road below the Garden Wall, drops 492 feet
        in a free-fall plume that ranks among the tallest in the park. No hiking is required{'\u2014'}just
        a short walk from the roadside to the viewpoint.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr style={headRow}>
            <th style={thStyle}>Waterfall</th>
            <th style={thStyle}>Access</th>
            <th style={thRight}>Distance from {townName}</th>
          </tr>
        </thead>
        <tbody>
          {waterfalls.map(w => (
            <tr key={w.name} style={bodyRow}>
              <td style={tdStyle}>{w.name}</td>
              <td style={tdStyle}>{w.trail}</td>
              <td style={tdRight}>{w.distMiles} mi</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.88rem', color: '#666', marginTop: '0.25rem' }}>
        14 of 44 waterfalls shown. Remaining falls are deeper in Glacier{'\u2019'}s backcountry,
        along the North Fork, or in the Many Glacier and Two Medicine valleys.
      </p>

      <h2>North Fork Adventures</h2>
      <p>
        The North Fork of the Flathead River road begins in {townName} and follows the river
        north along Glacier{'\u2019'}s western boundary into some of the most remote and pristine
        country accessible by car in the lower 48 states. The road is gravel, rough, and
        slow{'\u2014'}plan 90 minutes for the 35-mile drive to Polebridge{'\u2014'}but the payoff
        is solitude and wilderness character that the rest of the park cannot match.
      </p>
      <p>
        <strong>Polebridge</strong>, a tiny off-grid community with a legendary mercantile and
        bakery, serves as the gateway to Glacier{'\u2019'}s northwest corner. From here, a rough
        road continues to <strong>Bowman Lake</strong> (approximately 50 miles from {townName}),
        a 7-mile-long glacial lake framed by peaks exceeding 8,000 feet. The Bowman Lake
        shoreline trail and the route to Numa Ridge Lookout offer full-day hikes with sweeping
        lake and mountain views. Further north, <strong>Kintla Lake</strong> (approximately 60
        miles) is even more remote{'\u2014'}the trailhead for the Boulder Pass Trail, a multi-day
        backpacking route widely regarded as one of the finest wilderness traverses in the
        Northern Rockies. The North Fork area sees a fraction of the traffic that the
        Going-to-the-Sun corridor receives, and encounters with moose, wolves, and grizzlies are
        not uncommon.
      </p>
      <p>
        South of the park, <strong>Hungry Horse Reservoir</strong> stretches 34 miles along the
        South Fork of the Flathead River with dispersed camping and trailheads accessing the Great
        Bear Wilderness. The reservoir{'\u2019'}s east-side trails climb into alpine basins that
        few visitors ever reach.
      </p>

      <h2>Wilderness Areas</h2>
      <p>
        Five federally designated wilderness areas are accessible from {townName}, together
        encompassing over two million acres of roadless terrain. The <strong>Great Bear
        Wilderness</strong> (55 miles east) borders the southern edge of Glacier National Park
        and the northern boundary of the Bob Marshall Wilderness, forming part of the largest
        contiguous wilderness complex in the lower 48 states. Trails follow the Middle Fork of
        the Flathead River and climb into remote alpine basins rarely visited by casual hikers.
      </p>
      <p>
        The <strong>Cabinet Mountains Wilderness</strong> (71 miles west) is a compact but
        rugged range with granite peaks, alpine lakes, and resident mountain goat herds. The{' '}
        <strong>Mission Mountains Wilderness</strong> (74 miles south) rises dramatically above
        the Mission Valley{'\u2014'}some peaks gain 7,000 feet from valley floor. The{' '}
        <strong>Bob Marshall Wilderness</strong> (86 miles southeast), at over one million acres,
        is Montana{'\u2019'}s most iconic backcountry destination, known for the Chinese
        Wall{'\u2014'}a 1,000-foot-high escarpment stretching 22 miles along the Continental
        Divide. The <strong>Rattlesnake Wilderness</strong> (100 miles south near Missoula)
        offers accessible alpine lakes and ridgeline hiking.
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
        Five Montana state parks with trail systems lie within reach of {townName}.{' '}
        <strong>Whitefish Lake State Park</strong> (9 miles) offers lakeside walking paths along
        the shore of Whitefish Lake with swimming beaches and picnic areas.{' '}
        <strong>Lone Pine State Park</strong> (16 miles, near Kalispell) sits on a bluff with
        interconnected loops through ponderosa pine forest and a signature overlook delivering
        panoramic Flathead Valley views. <strong>Wayfarers State Park</strong> (21 miles) provides
        shoreline trails on Flathead Lake{'\u2019'}s northeast shore.{' '}
        <strong>Flathead Lake State Park</strong> (36 miles), spread across multiple units around
        Montana{'\u2019'}s largest natural lake, offers shoreline trails with mountain backdrops.{' '}
        <strong>Wild Horse Island State Park</strong> (41 miles) is accessible only by boat and
        preserves 2,163 acres of grassland and forest where bighorn sheep, wild horses, and mule
        deer roam{'\u2014'}hiking the island{'\u2019'}s trails is a uniquely Montana experience.
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
        <strong>Spring (April{'\u2013'}May):</strong> Valley-floor trails near {townName} and
        along the Flathead River clear of snow by mid-April. Danny On Trail on Big Mountain is
        typically hikeable by late May. Going-to-the-Sun Road in Glacier is plowed from both
        ends but usually remains closed at Logan Pass until late June. Low-elevation trails near
        Lake McDonald and the Apgar area are the best spring options inside the park. Bear
        activity is high as grizzlies emerge from hibernation{'\u2014'}be especially alert on
        early-season trails.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak season. Going-to-the-Sun Road
        typically opens fully by late June or early July. Logan Pass trails{'\u2014'}Highline,
        Hidden Lake{'\u2014'}become accessible as snow melts, usually by early July. July highs
        in {townName} average the mid-80s{'\u00b0'}F; alpine trails are 20{'\u2013'}30 degrees
        cooler. Afternoon thunderstorms are common above treeline{'\u2014'}plan alpine hikes for
        early starts. Wildfire smoke can affect air quality and visibility in late July and
        August. Glacier NP requires a <strong>vehicle reservation</strong> for Going-to-the-Sun
        Road entry from late May through mid-September{'\u2014'}book early, as reservations sell
        out weeks in advance. Avalanche Lake parking fills by 8 a.m. on summer weekends.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> The finest hiking season around{' '}
        {townName}. Glacier National Park is dramatically less crowded after Labor Day, and
        Going-to-the-Sun Road typically stays open through mid-October. Larch trees turn
        brilliant gold in the high country{'\u2014'}larch season in Glacier and along the
        North Fork peaks in mid-October and draws hikers from across the region. Vehicle
        reservations are no longer required after mid-September. Crisp mornings, stable weather,
        and outstanding fall color make this the premier time to hike.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Going-to-the-Sun Road closes to
        vehicles beyond Lake McDonald Lodge (typically by late October). Glacier{'\u2019'}s
        interior becomes snowshoe and backcountry ski terrain. The Apgar area and the road to
        Lake McDonald remain accessible for winter hiking and snowshoeing. Danny On Trail and
        Whitefish Mountain Resort offer groomed Nordic trails and snowshoe routes. Avalanche
        awareness is essential for any backcountry travel{'\u2014'}the northern ranges receive
        heavy snowfall and avalanche terrain is extensive. The North Fork Road may be impassable
        in winter.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is core <strong>grizzly bear habitat</strong>. Both grizzly and black
        bears are common on trails throughout the Flathead Valley, Glacier National Park, and the
        North Fork corridor. Carry bear spray on every hike, make noise on the trail, hike in
        groups when possible, and store food in bear-resistant containers in the backcountry.
        Trail closures for bear activity are common in Glacier, particularly around berry patches
        in late summer and early fall{'\u2014'}check the{' '}
        <a href="https://www.nps.gov/glac/planyourvisit/trailstatusreports.htm" target="_blank" rel="noopener noreferrer">
          NPS trail status page
        </a>{' '}
        before heading out. Mountain lion and moose encounters also occur.
      </p>
      <p>
        <strong>Glacier NP reservations:</strong> A timed-entry vehicle reservation is required
        for Going-to-the-Sun Road corridor entry from late May through mid-September. Reservations
        are released in batches on{' '}
        <a href="https://www.recreation.gov" target="_blank" rel="noopener noreferrer">Recreation.gov</a>.
        Without a reservation, enter before 6 a.m. or use the park shuttle system (free, operates
        from Apgar Visitor Center). The North Fork and Two Medicine areas do not require
        reservations.
      </p>
      <p>
        Cell service is unreliable beyond the immediate valley floor and nonexistent in most of
        Glacier National Park and the North Fork. Carry a paper map or downloaded offline maps,
        and let someone know your itinerary for any backcountry trip. Weather at alpine elevations
        can change rapidly{'\u2014'}snow is possible above 6,000 feet in any month.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
