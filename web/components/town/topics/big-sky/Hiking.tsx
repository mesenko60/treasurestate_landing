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
        {townName} sits at 6,319 feet in the shadow of Lone Mountain (11,166 feet){'\u2014'}the
        dramatic peak that anchors Big Sky Resort and dominates the skyline from every angle.
        The community is flanked by the Madison Range to the west, the Gallatin Range to the east,
        and the Gallatin Canyon to the north, with Yellowstone National Park just 50 miles south.
        With 42 trailheads within 50 miles, three wilderness areas, and direct access to some of
        the most spectacular alpine terrain in the Northern Rockies, {townName} is a hiking
        destination of the first order. Summer brings the Lone Peak Tram to 11,166 feet for
        summit access without the climb, while hundreds of miles of trail through the Lee
        Metcalf Wilderness, Gallatin National Forest, and Yellowstone backcountry offer everything
        from riverside strolls to multi-day alpine traverses. This guide organizes trails by
        distance from {townName} and covers seasonal considerations. For the full community
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>42 trailheads</strong> within 50 miles</li>
        <li><strong>283 recreation sites</strong> within 50 miles</li>
        <li><strong>3 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>3 state parks</strong> within range</li>
        <li><strong>Closest trailhead:</strong> Big Sky Resort trail network, in town</li>
        <li><strong>Closest wilderness:</strong> Lee Metcalf Wilderness (Madison Range), 6 miles</li>
        <li><strong>National parks:</strong> Yellowstone (West Entrance 50 mi, North Entrance 75 mi)</li>
        <li><strong>Ski areas:</strong> Big Sky Resort (5 mi), Bridger Bowl (50+ mi)</li>
        <li><strong>Hot springs:</strong> Yellowstone Hot Springs (40 mi), Bozeman Hot Springs (45 mi), Boiling River in Yellowstone (70 mi)</li>
      </ul>

      <h2>In-Town &amp; Resort Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s in-town hiking centers on the Big Sky Resort trail network, which doubles
        as a mountain-biking and hiking system during summer. The resort's base area trails wind
        through meadows and forest at the foot of Lone Mountain, with wildflower-filled alpine
        meadows accessible via the Lone Peak Tram and the Ramcharger and Swift Current chairlifts.
        The <strong>Lone Peak Tram</strong>, operating in summer, whisks hikers to 11,166 feet for
        above-treeline scrambling and panoramic views spanning the Madison Range, Spanish Peaks,
        Gallatin Range, and on clear days, the Teton Range and Yellowstone Plateau. The Hummocks
        Trail, Moose Tracks, and the Uplands Trail provide moderate, family-friendly hiking
        through the meadow-and-forest landscape immediately surrounding the community, with
        wildlife sightings (moose, elk, deer) common in early morning and evening.
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
        The <strong>Gallatin Canyon</strong> corridor along US-191 north of {townName} provides
        access to dozens of trailheads on both sides of the highway. The Gallatin River carves
        through a narrow, forested canyon with trails climbing from the river into the Gallatin
        Range (east) and the Madison Range (west). <strong>Lava Lake</strong> (12 miles north) is
        one of the most popular day hikes{'\u2014'}a moderate 6-mile round trip to a stunning alpine lake
        set beneath Gallatin Peak. <strong>Beehive Basin</strong> (8 miles) is a signature {townName}
        hike: a 7-mile round trip that climbs through wildflower meadows into a spectacular cirque
        basin surrounded by the Spanish Peaks{'\u2014'}widely considered one of the best day hikes in
        southwestern Montana.
      </p>
      <p>
        <strong>Ousel Falls</strong> (5 miles from the Town Center) is {townName}'s most accessible
        waterfall hike{'\u2014'}a 1.6-mile round trip on a well-built trail to a dramatic 70-foot
        waterfall on the South Fork of the West Fork of the Gallatin River. The trail is paved and
        family-friendly, making it the go-to recommendation for visitors with young children or
        limited hiking experience. Farther afield, <strong>Garnet Mountain</strong> (20 miles north
        in the Gallatin Canyon) offers a challenging climb with expansive ridgeline views, and the
        <strong>Spanish Creek</strong> drainage (15 miles west) provides access to the heart of
        the Spanish Peaks via trails that connect to the broader Lee Metcalf Wilderness network.
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

      <h2>Yellowstone National Park</h2>
      <p>
        {townName} is one of the closest communities to Yellowstone National Park. The West
        Entrance at West Yellowstone is approximately 50 miles south on US-191, and the park's
        interior is accessible for day-trip hiking from {townName}. The drive through the upper
        Gallatin Canyon and along the park's western boundary is spectacular in its own right.
        Inside the park, trail options range from boardwalk loops at geyser basins (Old Faithful,
        Midway Geyser Basin, Norris) to serious backcountry routes in the Gallatin Range, Bechler
        River country, and the Yellowstone Lake shoreline.
      </p>
      <p>
        For backcountry hikers, the park's northwest corner{'\u2014'}accessible via trails that begin
        near the {townName} area and cross into the park{'\u2014'}offers some of the most remote and
        lightly traveled terrain in Yellowstone. The Gallatin Range within the park provides high
        ridgeline traverses with views of the Yellowstone Plateau and the possibility of
        encountering bison, elk, grizzly bears, and wolves. The combination of {townName}'s
        proximity and the park's vast trail network makes multi-day Yellowstone backpacking trips
        a realistic option for residents and visitors alike.
      </p>

      <h2>Wilderness &amp; Backcountry</h2>
      <p>
        Three federally designated wilderness areas are accessible from {townName}. The
        <strong> Lee Metcalf Wilderness</strong> is the closest and most significant{'\u2014'}its
        Madison Range and Spanish Peaks units rise directly from the {townName} area, with
        trailheads as close as 6 miles from the community center. The Spanish Peaks unit offers
        glacier-carved cirques, alpine lakes, and peaks exceeding 11,000 feet, with multi-day
        backpacking loops through some of the most spectacular mountain scenery in southwestern
        Montana. The Madison Range unit protects the remote heart of the Madison Range, including
        the iconic Hilgard Peak (11,316 feet){'\u2014'}the highest point in the Madison Range.
      </p>
      <p>
        The <strong>Absaroka-Beartooth Wilderness</strong> (accessible via Yellowstone and
        Paradise Valley, 60+ miles) and additional wilderness study areas in the Gallatin Range
        expand the backcountry options further. The Lee Metcalf Wilderness alone offers enough
        trail miles to fill an entire summer of weekend backpacking trips without repeating a
        route{'\u2014'}and the proximity to {townName} means trailheads are reachable after work for
        overnight trips on long summer evenings.
      </p>
      {wilderness.length > 0 && (
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
      )}

      <h2>State Parks</h2>
      <p>
        Three state parks lie within range of {townName}. <strong>Missouri Headwaters State
        Park</strong> (60 miles northwest) marks the historically significant confluence of the
        Jefferson, Madison, and Gallatin rivers to form the Missouri River{'\u2014'}the spot Lewis
        and Clark reached in July 1805. The park offers riverside trails with interpretive panels
        on the expedition. <strong>Madison Buffalo Jump State Park</strong> (55 miles north)
        preserves a dramatic cliff site where Native peoples drove bison herds for thousands of
        years, with interpretive trails and sweeping views of the Madison Valley. Both parks make
        worthwhile half-day excursions from {townName}.
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
        <strong>Spring (March–May):</strong> {townName} receives 300+ inches of snowfall annually,
        and spring comes late at 6,319 feet. Lower trails along the Gallatin Canyon begin clearing
        by late April, but alpine trails and the Spanish Peaks remain snow-covered well into June.
        Ousel Falls trail is one of the first to clear and makes a good early-season option.
        Spring runoff swells the Gallatin River and its tributaries{'\u2014'}creek crossings on
        backcountry trails can be dangerous. The Lone Peak Tram typically does not open for summer
        until late June.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak hiking season. Alpine trails clear by late
        June to mid-July, with wildflower displays in the Spanish Peaks and Beehive Basin reaching
        their peak in mid-July. The Lone Peak Tram provides summit access for above-treeline
        exploration. Afternoon thunderstorms build over the mountains regularly{'\u2014'}start early and
        be off ridgelines by early afternoon. Temperatures reach the mid-70s at the base area with
        cool nights in the low 50s. Grizzly bears are active throughout the area; carry bear spray
        on every hike.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Many locals consider this the finest hiking
        season. Larches turn gold in the higher elevations, aspens blaze in the canyons, and
        crowds thin dramatically. Daytime temperatures in the 50s and 60s make for comfortable
        hiking, and the clear autumn air provides the best visibility of the year. Elk bugling
        echoes through the Madison Range in September. Hunting season begins in October; wear
        blaze orange on national forest trails.
      </p>
      <p>
        <strong>Winter (November–April):</strong> {townName} transforms into one of the premier
        ski destinations in North America. Big Sky Resort's 5,800 acres and 4,350 feet of
        vertical offer world-class downhill skiing. Cross-country skiing and snowshoeing on the
        Lone Mountain Ranch trail system (30+ km of groomed Nordic trails) provide quieter winter
        alternatives. Backcountry skiing in the Lee Metcalf Wilderness and surrounding terrain
        draws expert skiers. Yellowstone Hot Springs (40 miles south) offers a perfect post-hike
        soak.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is core grizzly bear habitat within the Greater Yellowstone Ecosystem.
        Carry bear spray on every hike, travel in groups, make noise, and store food properly.
        Black bears, mountain lions, and moose are also present{'\u2014'}give moose wide berth,
        especially cows with calves. The high elevation (6,319 ft base, 11,166 ft summit) means
        weather changes rapidly; carry layers and rain gear even on clear mornings. Alpine
        terrain in the Spanish Peaks and on Lone Mountain requires route-finding skills and
        awareness of exposure. Cell service is unreliable on most backcountry trails{'\u2014'}carry a
        map, inform someone of your plans, and consider a satellite communicator for remote trips
        into the Lee Metcalf Wilderness.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
