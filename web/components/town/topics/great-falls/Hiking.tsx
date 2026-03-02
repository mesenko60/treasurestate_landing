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
  return (
    <article className="content-section">
      <p>
        {townName} is Montana's third-largest city and the only one built around a series of
        waterfalls on the Missouri River. The city sits where the Great Plains meet the Rocky
        Mountain Front — a dramatic geological boundary where the mountains rise abruptly from
        the prairie with no foothills in between. With only 3 formal trailheads within 50 miles,
        {townName} is not a traditional trail town in the way Missoula or Whitefish are. But
        what it offers is something different and arguably more distinctive: the River's Edge
        Trail system — 60+ miles of paved and unpaved paths tracing the Missouri River through
        the city — plus immediate access to the Rocky Mountain Front, one of the most visually
        stunning landscapes in the American West. This guide covers {townName}'s trail options
        from urban paths to backcountry wilderness. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>85 recreation sites</strong> within 50 miles</li>
        <li><strong>3 trailheads</strong> within 50 miles</li>
        <li><strong>4 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>3 state parks</strong> with trails and interpretive walks</li>
        <li><strong>River's Edge Trail:</strong> 60+ miles of urban trail along the Missouri River</li>
        <li><strong>Closest state park:</strong> Giant Springs State Park, 4 miles</li>
        <li><strong>Rocky Mountain Front:</strong> 50–70 miles west — dramatic mountain wall rising from prairie</li>
        <li><strong>Ski areas:</strong> Showdown Montana (53 mi), Teton Pass (61 mi)</li>
      </ul>

      <h2>River's Edge Trail System</h2>
      <p>
        The River's Edge Trail is {townName}'s defining outdoor asset and one of the finest
        urban trail systems in the Northern Rockies. Over 60 miles of interconnected paved and
        unpaved paths follow both banks of the Missouri River through the heart of the city,
        linking parks, historic sites, and all five of the waterfalls that give the city its
        name. The trail passes Black Eagle Falls, Rainbow Falls, Crooked Falls, the Giant
        Springs area, and the Great Falls of the Missouri itself — the cascade that halted the
        Lewis and Clark Expedition for a month-long portage in June 1805.
      </p>
      <p>
        The paved sections are accessible year-round for walking, running, and cycling, while
        unpaved singletrack spurs climb the bluffs above the river for more rugged terrain. The
        trail connects directly to Giant Springs State Park, offering a continuous riverside
        experience from downtown to one of the largest freshwater springs on Earth. For visitors
        accustomed to mountain trail towns, the River's Edge Trail reframes what "hiking" means
        in Montana — this is prairie-river walking at its best, with cottonwood-lined corridors,
        cliff-edge overlooks, and a landscape shaped by water and wind rather than glaciers and
        granite.
      </p>

      <h2>Giant Springs State Park &amp; Nearby Walks</h2>
      <p>
        Giant Springs State Park (4 miles from downtown) is the anchor of {townName}'s trail
        network and one of Montana's most visited state parks. The park sits at the outflow of
        Giant Springs — one of the largest freshwater springs in the world, discharging
        approximately 156 million gallons of water daily at a constant 54°F. The spring feeds
        the Roe River, which at 201 feet is recognized as one of the shortest rivers on Earth.
        Walking trails wind through the park along the spring outflow and the Missouri River
        bank, with interpretive exhibits on the area's natural history and the Lewis and Clark
        Expedition's encampment here.
      </p>
      <p>
        First Peoples Buffalo Jump State Park (11 miles southwest) offers a very different
        hiking experience — an interpretive trail leads to the top of a mile-long sandstone
        cliff used by Indigenous peoples for over 1,000 years to drive bison herds over the
        edge. The cliff is one of the largest buffalo jumps in North America, and the trail
        provides sweeping views across the prairie. Benton Lake National Wildlife Refuge (10
        miles north) offers birding trails through wetland and prairie habitat, with over 230
        bird species recorded, including nesting avocets, white pelicans, and migrating
        waterfowl.
      </p>

      <h2>Trailheads Within 50 Miles</h2>
      <p>
        {townName}'s formal trailhead count is modest — just three within 50 miles — reflecting
        the city's prairie setting rather than a lack of outdoor opportunity. Sulphur Springs
        (12 miles) is the closest, offering access to rolling terrain in the foothills east of
        the Rockies. Taylor Hills (37 miles) and South Pilgrim (40 miles) push further into the
        transition zone between prairie and mountains, where grassland gives way to scattered
        ponderosa pine and Douglas fir. These trailheads see minimal traffic compared to western
        Montana trails, offering genuine solitude.
      </p>
      {trails.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {trails.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>The Rocky Mountain Front</h2>
      <p>
        The Rocky Mountain Front is {townName}'s most spectacular hiking destination and one of
        the most dramatic landscapes in Montana. Fifty to seventy miles west of the city, the
        front is the abrupt eastern edge of the Rocky Mountains — a wall of peaks rising 4,000
        to 5,000 feet directly from the plains with no foothills to soften the transition. This
        is one of the few places in North America where the mountains meet the prairie in a
        single, unbroken escarpment, and the visual impact is extraordinary. On clear days, the
        front is visible from {townName} as a jagged horizon line stretching from Glacier
        National Park south to Rogers Pass.
      </p>
      <p>
        Day hikes along the front access alpine terrain surprisingly quickly. Trails climb from
        prairie trailheads through aspen groves and conifer forests to ridgeline views over both
        the mountain wilderness to the west and the vast plains stretching east to the horizon.
        The Sun River Canyon area — where the Sun River cuts through the front — is a popular
        access point with trails leading into the Bob Marshall Wilderness. Our Lady of the
        Rockies and other trails near Augusta and Choteau (both roughly 60–70 miles from
        {townName}) provide day-hike access to the front's most dramatic terrain. This landscape
        is grizzly bear country — bear spray is essential, and proper food storage is required
        for overnight trips.
      </p>

      <h2>Wilderness &amp; Backcountry</h2>
      <p>
        Four federally designated wilderness areas are accessible from {townName}, all
        concentrated along the Rocky Mountain Front and the Continental Divide to the west.
        The Gates of the Mountains Wilderness (52 miles south) is the closest — a rugged
        limestone canyon landscape along the Missouri River named by Lewis and Clark. The
        Scapegoat Wilderness (77 miles) and the Bob Marshall Wilderness (85 miles) form the
        heart of the Bob Marshall Wilderness Complex — over a million acres of contiguous
        roadless country stretching along the Continental Divide, home to grizzly bears,
        wolverines, and the iconic Chinese Wall, a 1,000-foot limestone escarpment running 22
        miles along the divide.
      </p>
      <p>
        The Great Bear Wilderness (96 miles northwest) extends the complex north toward Glacier
        National Park, completing one of the largest intact ecosystems in the lower 48 states.
        Multi-day pack trips into the Bob Marshall from Rocky Mountain Front trailheads are a
        classic Montana backcountry experience — most trips run 5 to 10 days, with outfitters
        offering horse-supported expeditions for those who want to reach the wilderness interior
        without carrying heavy packs. The wilderness areas see their heaviest use in September
        during hunting season; summer offers more solitude.
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
        {townName}'s three nearby state parks each highlight a different facet of central
        Montana. Giant Springs State Park (4 miles) is the crown jewel — home to one of the
        world's largest freshwater springs, the tiny Roe River, a state fish hatchery, and miles
        of riverside trails along the Missouri. It's the most accessible outdoor destination in
        the city and connects directly to the River's Edge Trail system.
      </p>
      <p>
        First Peoples Buffalo Jump State Park (11 miles southwest) preserves one of North
        America's largest buffalo jumps — a mile-long sandstone cliff used by Indigenous peoples
        for communal bison hunts for over a millennium. The interpretive trail to the cliff top
        offers panoramic prairie views and a powerful connection to the region's deep human
        history. Tower Rock State Park (30 miles south) features a striking 424-foot volcanic
        rock formation along the Missouri River — a brief stop with an interpretive trail, best
        combined with a drive along the Missouri River canyon.
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
        <strong>Spring (March–May):</strong> The River's Edge Trail and Giant Springs State Park
        are accessible year-round, and spring brings migrating birds to Benton Lake NWR and
        warming temperatures to the prairie trails. Snow lingers on the Rocky Mountain Front
        into June, limiting higher-elevation access. Wind is a significant factor in
        {townName} — spring winds regularly exceed 30 mph, and exposed river bluffs and prairie
        trails can be challenging on gusty days. First Peoples Buffalo Jump is excellent in
        spring with wildflowers on the prairie.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. {townName} is warmer and drier than
        western Montana, with temperatures regularly reaching the upper 80s and low 90s°F.
        The River's Edge Trail is best enjoyed early morning or evening in midsummer. Rocky
        Mountain Front trails are fully accessible from late June through September. Giant
        Springs State Park's constant 54°F spring water provides a cool contrast to summer
        heat. Afternoon thunderstorms are common in the mountains but typically brief. Wildfire
        smoke can affect air quality in late July and August — check conditions before planning
        Rocky Mountain Front hikes.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The best season for hiking near {townName}.
        Cool, dry conditions, golden cottonwoods along the Missouri River, and fall color in
        the aspens on the Rocky Mountain Front make this an ideal time. Elk bugling echoes
        along the front in September. Hunting season begins in October — wear blaze orange on
        all trails outside city limits. The River's Edge Trail is beautiful in autumn light,
        and Giant Springs State Park sees fewer crowds than summer.
      </p>
      <p>
        <strong>Winter (November–March):</strong> The River's Edge Trail remains hikeable
        year-round, though ice and packed snow require traction devices from December through
        February. {townName}'s prairie location means cold, windy winters with temperatures
        regularly dropping below 0°F during cold snaps. Giant Springs State Park's trails are
        maintained in winter and the spring never freezes. Showdown Montana (53 miles) and
        Teton Pass (61 miles) offer downhill skiing — closer than Helena's ski options. Cross-
        country skiing is available along the Rocky Mountain Front when snow conditions allow.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area straddles the boundary between prairie and mountain ecosystems,
        bringing unique safety considerations. Grizzly bears are present along the Rocky
        Mountain Front and increasingly on the plains east of the mountains — carry bear spray
        on all hikes west of the city and on prairie trails near the front. Rattlesnakes inhabit
        the river bluffs and rocky terrain along the Missouri from May through September. Wind
        exposure is a factor on prairie trails and river bluffs year-round but especially in
        spring; dress in layers and be prepared for sudden temperature drops. The Missouri
        River's current is powerful — stay on trails near cliff edges and river banks. Cell
        service is reliable on the River's Edge Trail and in state parks but drops off rapidly
        on the Rocky Mountain Front and in wilderness areas.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
