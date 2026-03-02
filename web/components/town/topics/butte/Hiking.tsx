import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const urban = trails.filter(t => t.distMiles <= 8);
  const day = trails.filter(t => t.distMiles > 8 && t.distMiles <= 30);
  const backcountry = trails.filter(t => t.distMiles > 30).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 5,741 feet on the western slope of the Continental Divide — one of
        the highest-elevation cities in Montana and a place where the divide literally runs
        through town. The surrounding landscape is defined by high-altitude basins, exposed
        ridgelines, and the rugged peaks of the Anaconda Range and Pioneer Mountains. With 25
        trailheads within 50 miles and 246 recreation sites in the area, {townName} offers a
        hiking experience built around mining-era history, dramatic geology, and genuine
        high-country solitude. Humbug Spires' 600-foot granite pinnacles rise just 19 miles
        south, the Anaconda-Pintler Wilderness puts alpine lakes and Continental Divide Trail
        access within 30 miles, and the Pioneer Mountains offer some of the most remote terrain
        in southwestern Montana. This guide organizes trails by distance from {townName} and
        covers seasonal considerations. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>25 trailheads</strong> within 50 miles</li>
        <li><strong>246 recreation sites</strong> in the surrounding area</li>
        <li><strong>9 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>4 state parks</strong> within reach</li>
        <li><strong>Elevation:</strong> 5,741 feet — shorter hiking season than lower valleys</li>
        <li><strong>Closest wilderness:</strong> Humbug Spires WSA, 19 miles south</li>
        <li><strong>Continental Divide:</strong> passes directly through {townName}</li>
        <li><strong>Hot springs:</strong> Fairmont Hot Springs, 15 miles west</li>
        <li><strong>Ski areas:</strong> Discovery (38 mi), Maverick Mountain (45 mi), Lost Trail (72 mi), Big Sky (74 mi)</li>
      </ul>

      <h2>In-Town &amp; Urban Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s urban trail options reflect its mining-town origins — the terrain is steep,
        the views are wide, and the trails often traverse old mining roads and reclaimed
        landscapes above the Berkeley Pit and surrounding hillsides. The Sheepshead Mountain
        Recreation Area on the city's fringe provides a network of multi-use trails through
        open terrain with sweeping views of the Highland Mountains to the south and the
        Anaconda Range to the west. These trails are accessible from town without a long drive,
        making them ideal for after-work hikes and trail runs. The elevation means even urban
        trails sit above 5,500 feet, so expect thinner air and faster weather changes than
        valley-floor trails in Missoula or Helena.
      </p>
      {urban.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {urban.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Day Hikes (8–30 Miles)</h2>
      <p>
        The standout day hike from {townName} is Humbug Spires Wilderness Study Area, 19 miles
        south along Interstate 15. This 11,175-acre area protects a remarkable cluster of
        600-foot granite pinnacles — weathered monoliths of quartz monzonite rising from a
        forested canyon of Moose Creek. The formations are unique in Montana, resembling
        desert tower country transplanted to a mountain forest. A moderate 4-mile trail follows
        Moose Creek through the canyon to the base of the spires, where technical rock climbers
        tackle multi-pitch routes on the sheer granite faces. For hikers, the trail offers
        close-up views of the pinnacles without technical difficulty, and side trails lead to
        higher viewpoints overlooking the formation. Humbug Spires is quieter than comparable
        destinations in western Montana — you may have the canyon to yourself on a weekday.
      </p>
      <p>
        The Anaconda-Pintler Wilderness boundary lies 30 miles west, where trails climb from
        the Warm Springs Creek and Storm Lake drainages into alpine terrain along the
        Continental Divide. Storm Lake is a popular day-hike destination — a deep cirque lake
        set beneath 9,000-foot peaks on the divide, reached by a moderate trail through
        subalpine forest and meadow. The Anaconda-Pintler is one of Montana's original
        wilderness areas (designated 1964) and holds over 40 alpine lakes in a compact range
        of glacially carved granite peaks. It receives far less use than the Bob Marshall or
        Absaroka-Beartooth, making it an excellent choice for solitude seekers.
      </p>
      {day.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {day.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>The Continental Divide</h2>
      <p>
        The Continental Divide runs directly through {townName} — one of the few American cities
        where the hydrological spine of the continent passes through the city limits. Water
        falling on the east side of town drains to the Atlantic via the Missouri and Mississippi;
        water on the west side flows toward the Pacific via the Clark Fork and Columbia. The
        Continental Divide National Scenic Trail (CDT) traverses the mountains surrounding
        {townName}, and thru-hikers pass through or near town each summer. Pipestone Pass
        (6,453 feet) on Highway 2 east of town and Homestake Pass (6,375 feet) on Interstate 90
        both sit on the divide and offer access points for CDT day hikes along the ridgeline.
        The divide here is less dramatic than in Glacier National Park but no less significant —
        the terrain is open, wind-swept, and offers expansive views across the Summit Valley in
        every direction.
      </p>

      <h2>Pioneer Mountains &amp; Backcountry</h2>
      <p>
        The Pioneer Mountains rise 36 miles southwest of {townName} along the Pioneer Mountains
        Scenic Byway — a 42-mile gravel loop road considered one of Montana's finest backcountry
        drives. This compact mountain range contains rugged alpine terrain, numerous high lakes,
        and trails that see a fraction of the traffic found in Glacier or the Beartooth. The
        Lake Louise Trailhead (36 miles) accesses a string of alpine lakes in the West Pioneers,
        while Lost Cabin Lake (36 miles) offers a moderately strenuous hike into a glacial
        cirque surrounded by 9,000-foot peaks. The East Pioneers are wilder and more remote,
        with fewer maintained trails and genuine backcountry solitude.
      </p>
      <p>
        Beyond the Pioneers, nine federally designated wilderness areas are accessible from
        {townName}. The Anaconda-Pintler Wilderness (30 miles) is the closest formal wilderness
        and the natural extension of {townName}'s hiking terrain. The Gates of the Mountains
        (66 miles), Welcome Creek (67 miles), and Lee Metcalf (70 miles) wilderness areas
        require longer drives but open access to hundreds of miles of backcountry trail in
        dramatically different landscapes — limestone canyons, dense cedar forests, and the
        rugged peaks of the northern Madison Range.
      </p>
      {backcountry.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {backcountry.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {wilderness.length > 0 && (
        <>
          <h2>Wilderness Areas</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Wilderness Area</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {wilderness.map(w => (
                <tr key={w.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{w.name}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{w.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>State Parks</h2>
      <p>
        Four state parks lie within reach of {townName}, each offering a distinct experience.
        Lewis &amp; Clark Caverns State Park (35 miles east) features Montana's most extensive
        limestone cave system with guided underground tours from May through September, plus
        above-ground hiking trails along the Jefferson River canyon with views of the Tobacco
        Root Mountains. Missouri Headwaters State Park (50 miles east) marks the exact spot
        where the Jefferson, Madison, and Gallatin rivers converge to form the Missouri River —
        a site of immense historical significance explored by Lewis and Clark in 1805, with
        riverside trails and interpretive exhibits. Spring Meadow Lake State Park (46 miles
        north in Helena) is a spring-fed urban oasis, and Beavertail Hill State Park (60 miles
        northwest) offers a quiet rest stop with picnic areas and short trails along the Clark
        Fork River.
      </p>
      {stateParks.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>State Park</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {stateParks.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{p.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{p.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Considerations</h2>
      <p>
        <strong>Spring (April–May):</strong> {townName}'s 5,741-foot elevation means spring
        arrives later than in lower Montana valleys. Lower trails around the Sheepshead area
        and Humbug Spires typically clear of snow by mid-April, but higher-elevation trails in
        the Anaconda-Pintler and Pioneer Mountains remain buried into June. Snowmelt can make
        creek crossings hazardous in May. The exposed terrain around {townName} is subject to
        sudden spring storms — afternoon snow squalls are common through May at elevations
        above 7,000 feet.
      </p>
      <p>
        <strong>Summer (Late June–August):</strong> Peak hiking season is compressed by
        elevation. Most alpine trails don't fully open until late June, and the optimal
        window is July through mid-September. Summer days are warm but rarely oppressive at
        this altitude — highs typically reach the low 80s°F with cool nights in the 40s and
        50s. Afternoon thunderstorms build quickly over the divide and can produce lightning,
        hail, and brief but intense downpours. Start alpine hikes early to clear exposed
        ridgelines before afternoon storms. Wildfire smoke can affect the area in late July
        and August. The Pioneer Mountains Scenic Byway is typically passable from late June
        through October.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The finest hiking season in the {townName}
        area. Stable weather, cool temperatures, and golden larch in the Anaconda-Pintler and
        Pioneer Mountains create ideal conditions. The first dustings of snow appear on the
        divide peaks in September but lower trails remain excellent through October. Elk
        hunting season begins in October — wear blaze orange on all national forest trails.
        Humbug Spires is particularly rewarding in fall, with warm granite walls and fewer
        visitors.
      </p>
      <p>
        <strong>Winter (November–March):</strong> {townName}'s high elevation brings cold,
        snowy winters with sustained below-zero stretches in January and February. Most
        backcountry trails are inaccessible from November through May. Lower trails near
        town may be used with snowshoes or cross-country skis. Discovery Ski Area (38 miles)
        and Maverick Mountain (45 miles) offer downhill skiing closer to {townName} than to
        most Montana cities. Fairmont Hot Springs (15 miles) is a popular post-hike
        winter destination.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is home to black bears, mountain lions, and moose — grizzly bears
        are occasionally reported in the Anaconda-Pintler Wilderness and Pioneer Mountains.
        Carry bear spray on all backcountry hikes. The high elevation increases exposure
        risks: hypothermia can develop quickly when afternoon storms hit above treeline, even
        in summer. Lightning is a serious hazard on exposed ridgelines along the divide — if
        thunderstorms are forecast, plan to be off ridges and summits by early afternoon.
        Water sources in the mining-impacted drainages immediately around {townName} may
        contain heavy metals; carry your own water or filter from known clean sources in
        wilderness areas. Cell service is unreliable outside of town and drops off quickly
        in the canyons and mountain valleys.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
