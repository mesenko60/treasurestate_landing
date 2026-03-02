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
  const nearby = trails.filter(t => t.distMiles <= 12);
  const day = trails.filter(t => t.distMiles > 12 && t.distMiles <= 25);
  const backcountry = trails.filter(t => t.distMiles > 25).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at the southern tip of Flathead Lake, Montana's largest natural
        freshwater lake, with the Mission Mountains rising dramatically to the east. With 47
        trailheads within 50 miles, the hiking here spans lakeshore walks, waterfall trails,
        and rugged alpine routes that climb nearly 7,000 vertical feet from lake level to the
        peaks of the Mission Range. What sets {townName} apart is its proximity to the{' '}
        <strong>Mission Mountains Tribal Wilderness</strong> — the only tribally designated
        wilderness area in the United States, established in 1982 by the Confederated Salish
        and Kootenai Tribes — and <strong>Wild Horse Island State Park</strong>, a 2,163-acre
        island in Flathead Lake accessible only by boat. This guide organizes trails by
        distance and covers permits, seasonal access, and safety. For the full town profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>47 trailheads</strong> within 50 miles</li>
        <li><strong>8 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>9 state parks</strong> with trail access</li>
        <li><strong>Closest trailhead:</strong> Mud Lake, 8 miles east</li>
        <li><strong>Closest wilderness:</strong> Mission Mountains Wilderness, 29 miles</li>
        <li><strong>Closest state park:</strong> Wild Horse Island State Park, 7 miles (boat access only)</li>
        <li><strong>Elevation range:</strong> ~2,900 ft (lake level) to 9,800+ ft (Mission peaks)</li>
        <li><strong>Tribal permit required</strong> for Mission Mountains Tribal Wilderness</li>
      </ul>

      <h2>Featured Trails & Hikes (Within 12 Miles)</h2>
      <p>
        The closest trails to {townName} follow drainages east into the foothills of the
        Mission Range. <strong>Mud Lake</strong> (8 miles) is the nearest trailhead, offering
        a moderate hike to a quiet mountain lake tucked below the western face of the
        Missions. The <strong>Mud Creek Falls</strong> trail (9 miles) leads to one of the
        area's most accessible waterfalls, a popular spring and early summer destination when
        snowmelt fuels the cascade.
      </p>
      <p>
        <strong>Cedar Lake</strong> (11 miles) provides a longer day hike through dense
        conifer forest to an alpine lake ringed by steep terrain. <strong>Flathead Lake
        State Park</strong> (11 miles) offers shoreline trails along multiple units around
        the lake, with easy walking paths and picnic areas suited to families. For a
        longer outing, <strong>Terrace Falls</strong> (15 miles) rewards hikers with a
        tiered waterfall set deep in a forested canyon.
      </p>
      {nearby.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {nearby.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Day Hikes (12–25 Miles)</h2>
      <p>
        Within day-trip range, the terrain steepens into the heart of the Mission Range.{' '}
        <strong>Cold Lakes</strong> (17 miles) is a classic Mission Mountains destination —
        a chain of glacial lakes set in a dramatic cirque with sheer walls rising on three
        sides. The trail climbs steeply through old-growth forest before breaking into
        alpine meadow. <strong>Beardance</strong> (19 miles) and{' '}
        <strong>Upper Beardance</strong> (20 miles) trailheads access some of the most
        rugged terrain in the range, with routes gaining thousands of feet through avalanche
        chutes and talus fields to remote basins.
      </p>
      <p>
        The <strong>Cherry Creek</strong> and <strong>Post Creek</strong> drainages offer
        primary access corridors into the Mission Range from the west, with trailheads in
        the 17-to-22-mile range. <strong>South Elk Ridge</strong>, <strong>Lion
        Palisade</strong>, and <strong>North Elk Ridge</strong> (all ~20 miles) provide
        ridge-running routes with expansive views west to Flathead Lake and east into the
        wild interior of the Missions.
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

      <h2>Mission Mountains Tribal Wilderness</h2>
      <p>
        The Mission Mountains Tribal Wilderness is the only wilderness area in the United
        States designated by a tribal nation. Established in 1982 by the Confederated Salish
        and Kootenai Tribes, it protects 89,500 acres of the western slopes of the Mission
        Range on the Flathead Indian Reservation. The designation predated any federal
        wilderness protection for the Missions and reflects the tribes' deep stewardship
        of this landscape.
      </p>
      <p>
        The terrain is among the most dramatic in Montana: peaks rise from roughly 2,900
        feet at the valley floor to over 9,800 feet, gaining nearly 7,000 feet of elevation
        in a horizontal distance of just a few miles. Glacial cirques, alpine lakes, hanging
        valleys, and knife-edge ridges define the high country. Grizzly bears are common —
        some drainages are seasonally closed to all human entry to protect critical grizzly
        habitat.
      </p>
      <p>
        <strong>A tribal recreation permit is required</strong> for all entry into the Mission
        Mountains Tribal Wilderness. Permits are available at local stores in {townName} and
        surrounding communities, as well as from the CSKT Division of Fish, Wildlife,
        Recreation and Conservation. Permit requirements and seasonal closures are set by
        the tribes and may change year to year — check current regulations before planning
        your trip.
      </p>

      <h2>Wild Horse Island State Park</h2>
      <p>
        <strong>Wild Horse Island</strong> (7 miles from {townName}) is a 2,163-acre island
        in the south end of Flathead Lake — the largest island in the largest natural
        freshwater lake west of the Mississippi. The island is accessible only by boat; there
        is no ferry service, so visitors must arrange private watercraft, rent a kayak, or
        hire a boat shuttle from {townName} or nearby marinas.
      </p>
      <p>
        Once on the island, hiking trails cross open grassland, ponderosa pine forest, and
        rocky ridgelines, with views stretching across Flathead Lake to the Mission Mountains,
        the Swan Range, and the Salish Mountains. The island supports bighorn sheep, wild
        horses (a small band of 2–6 animals), mule deer, songbirds, and bald eagles. The
        highest point on the island is about 3,900 feet, roughly 1,000 feet above lake level.
        There are no services on the island — bring water, food, and everything you need.
        Dogs are prohibited to protect wildlife.
      </p>

      <h2>State Parks</h2>
      <p>
        {townName} has exceptional state park access, with nine Montana state parks within 50
        miles. Beyond Wild Horse Island, <strong>Flathead Lake State Park</strong> (11 miles)
        maintains multiple units around the lake — including Finley Point, Yellow Bay, and Big
        Arm — each with shoreline trails, swimming beaches, and campgrounds.{' '}
        <strong>Wayfarers State Park</strong> (28 miles, near Bigfork) offers lakeside walks
        through old-growth forest on the northeast shore. <strong>Lone Pine State Park</strong>{' '}
        (34 miles, near Kalispell) provides ridgeline hikes with sweeping Flathead Valley
        panoramas. <strong>Whitefish Lake State Park</strong> (51 miles) rounds out the
        northern options.
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

      <h2>Wilderness Areas</h2>
      <p>
        Eight federally or tribally designated wilderness areas are accessible from{' '}
        {townName}. The <strong>Mission Mountains Wilderness</strong> (29 miles, Forest
        Service-managed eastern slopes) and the adjacent tribal wilderness together protect
        the full width of the Mission Range. The <strong>Great Bear Wilderness</strong> (42
        miles north) borders the southern edge of Glacier National Park and connects to the{' '}
        <strong>Bob Marshall Wilderness</strong> (55 miles), forming part of the largest
        contiguous wilderness complex in the lower 48 states. The{' '}
        <strong>Rattlesnake Wilderness</strong> (53 miles south, near Missoula) and the{' '}
        <strong>Cabinet Mountains Wilderness</strong> (69 miles northwest) round out the
        regional options.
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

      <h2>Backcountry Trails (25+ Miles)</h2>
      {backcountry.length > 0 && (
        <>
          <p>
            Beyond day-trip range, additional trailheads provide access to remote terrain in
            the Swan Range, Flathead National Forest, and the wilderness areas listed above.
          </p>
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
        </>
      )}

      <h2>Trail Safety: Bears, Permits & Elevation</h2>
      <p>
        The Mission Mountains are core <strong>grizzly bear habitat</strong>. Both grizzly and
        black bears are common throughout the range, and certain drainages in the tribal
        wilderness are closed seasonally (typically July 15 through October 1) to protect
        grizzly bears during the critical huckleberry feeding season. Check closure maps
        before planning any Mission Mountains hike. Carry bear spray, make noise, hike in
        groups when possible, and store food in bear-resistant containers.
      </p>
      <p>
        <strong>Permits:</strong> A tribal recreation permit is required for the Mission
        Mountains Tribal Wilderness (the western slopes within the Flathead Reservation).
        The Forest Service-managed Mission Mountains Wilderness (eastern slopes) does not
        require a permit but has standard wilderness regulations. Wild Horse Island State
        Park requires no special permit beyond a valid Montana State Parks pass.
      </p>
      <p>
        <strong>Elevation:</strong> The elevation gain from Flathead Lake (~2,900 feet) to
        Mission peaks (9,800+ feet) is extreme by any standard. Routes in the Missions
        frequently gain 3,000 to 5,000 feet or more. Hikers accustomed to lower-elevation
        trails should plan conservatively, start early, and carry adequate water. Afternoon
        thunderstorms are common above treeline in summer.
      </p>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April–May):</strong> Lakeshore trails and lower-elevation paths
        around Flathead Lake clear of snow by mid-April. Mud Lake and Cedar Lake trails
        may remain muddy or snow-covered at higher elevations through May. The Mission
        Mountains above 6,000 feet are under heavy snow well into June. Wild Horse Island
        is accessible year-round by boat, though lake conditions can be rough in early spring.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak hiking season. Mission Mountains trails
        open progressively as snow recedes, with most alpine routes accessible by mid-July.
        Valley temperatures reach the mid-80s°F. Carry water on all hikes. Wildfire smoke
        can affect air quality and visibility in late July and August. Check tribal wilderness
        seasonal closures — some drainages close for grizzly bear management.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The finest hiking season in the {townName}{' '}
        area. Western larch turn gold in mid-October across the higher elevations of the
        Missions and Swan Range. Flathead Lake's moderating effect keeps {townName}-area
        temperatures milder than inland valleys. Crowds thin after Labor Day. Tribal
        wilderness closures typically lift October 1, reopening seasonal drainages.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Snowshoeing replaces hiking on mountain
        trails. Lakeshore paths and Wild Horse Island remain accessible (by boat) for
        winter walking. The Mission Mountains receive heavy snowfall and avalanche terrain
        is extensive — avalanche awareness and proper equipment are essential for any
        backcountry travel above the valley floor.
      </p>

      <p style={{ marginTop: '1.5rem' }}>
        For more on what to do in {townName}, see
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
