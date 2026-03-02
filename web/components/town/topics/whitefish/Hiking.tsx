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
  const day = trails.filter(t => t.distMiles > 8 && t.distMiles <= 25);
  const backcountry = trails.filter(t => t.distMiles > 25).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at the base of Big Mountain in the Flathead Valley of northwest Montana,
        with Glacier National Park's west entrance just 17 miles northeast, closer than any
        other town of significant size. With 80 trailheads within 50 miles, the hiking here
        ranges from summit trails at Whitefish Mountain Resort to world-renowned alpine routes
        along the Continental Divide in Glacier. The combination of a deep local trail network
        and proximity to one of America's most iconic national parks makes {townName} one of
        the premier hiking towns in Montana. This guide organizes trails by distance and covers
        seasonal considerations. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>80 trailheads</strong> within 50 miles</li>
        <li><strong>4 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>5 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> Danny On Trail, 4 miles from downtown</li>
        <li><strong>Closest wilderness:</strong> Great Bear Wilderness, 61 miles</li>
        <li><strong>Glacier National Park:</strong> West entrance 17 miles northeast</li>
        <li><strong>Whitefish Mountain Resort:</strong> 5 miles with extensive summer trail network and chairlift access</li>
      </ul>

      <h2>Summit & Resort Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s signature hike is the <strong>Danny On Trail</strong>, a 3.8-mile climb
        from the base of Whitefish Mountain Resort to the summit of Big Mountain at 6,817
        feet. The trail switchbacks through wildflower meadows and dense forest before
        breaking above treeline for panoramic views stretching from Glacier National Park
        to the north and the Flathead Valley and Flathead Lake to the south. In summer, the
        resort runs a scenic chairlift, so hikers can ride up and walk down (or vice versa).
        The summit has a nature center with interpretive exhibits on the local ecosystem.
      </p>
      <p>
        The broader <strong>Big Mountain trail network</strong> (4 to 6 miles from town)
        includes several additional loops and ridge traverses accessible from the resort
        base area. These trails offer mountain biking in summer and connect into the
        backcountry of the Whitefish Range for stronger hikers seeking longer routes. The{' '}
        <strong>Whitefish Trail</strong>, a growing community trail system, provides
        multi-use paths closer to town, winding through forest along Whitefish Lake's
        western shore and connecting neighborhoods to the mountain. The{' '}
        <strong>Smith Lake</strong> and <strong>Swift Creek</strong> trailheads (7 miles)
        offer moderate forest hikes to quiet mountain lakes.
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

      <h2>Day Hikes (8 to 25 Miles)</h2>
      <p>
        Within day-trip range, {townName} offers access to trails that most hikers travel
        across the country to experience. <strong>Glacier National Park's</strong> west
        entrance at Apgar is just 17 miles northeast, making it a 20-minute drive from
        your front door to one of the greatest trail systems in North America.
      </p>
      <p>
        The <strong>Apgar Lookout Trail</strong> (16 miles from town) climbs 3.6 miles to
        a historic fire lookout with commanding views of Lake McDonald and the Livingston
        Range. The <strong>Howe Lake Trail</strong> (19 miles) is a gentle 2-mile walk to
        a quiet lake surrounded by old-growth forest, ideal for families wanting a mellow
        Glacier experience without the crowds. <strong>Lake McDonald</strong> (19 miles)
        offers shoreline walks, paddling, and some of the most photographed scenery in the
        Northern Rockies.
      </p>
      <p>
        <strong>Lone Pine State Park</strong> (17 miles south, near Kalispell) provides
        interconnected loops through ponderosa pine forest and meadow, with a signature
        overlook of the Flathead Valley. The park is groomed for Nordic skiing in winter
        and is a year-round destination.
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

      <h2>Glacier National Park Trails</h2>
      <p>
        No hiking guide for {townName} would be complete without Glacier National Park. From
        {' '}{townName}, the park is closer than from any other Flathead Valley town. The west
        entrance is 17 miles away, and the Apgar area trails are accessible within 20 minutes.
        The park holds over 700 miles of maintained trail across one of the most dramatic
        alpine landscapes in North America.
      </p>
      <p>
        <strong>Avalanche Lake</strong> (21 miles from {townName}) is one of the park's most
        popular hikes, a moderate 5.9-mile round trip through old-growth cedar and hemlock
        forest to a turquoise glacial lake ringed by waterfalls cascading down 3,000-foot
        cliffs. The adjacent <strong>Trail of the Cedars</strong> is a wheelchair-accessible
        boardwalk loop through ancient forest.
      </p>
      <p>
        The <strong>Highline Trail</strong>, accessed from Logan Pass along Going-to-the-Sun
        Road, is widely considered one of the best hikes in the United States. This 11.8-mile
        point-to-point traverse follows a narrow shelf along the Continental Divide with
        wildflower meadows, mountain-goat sightings, and views into glacier-carved valleys
        on both sides. Going-to-the-Sun Road requires a vehicle reservation during peak
        summer months. Plan ahead and secure reservations early.
      </p>
      <p>
        The <strong>Grinnell Glacier Trail</strong> in the Many Glacier area (51 miles from{' '}
        {townName} via the east side) leads 10.6 miles round trip to one of the park's
        remaining active glaciers, passing vivid blue lakes and cirque walls.
      </p>

      <h2>Wilderness & Backcountry</h2>
      <p>
        Four federally designated wilderness areas are accessible from {townName}. The{' '}
        <strong>Great Bear Wilderness</strong> (61 miles southeast) borders the southern edge
        of Glacier National Park and the northern boundary of the Bob Marshall Wilderness,
        forming part of the largest contiguous wilderness complex in the lower 48. The{' '}
        <strong>Cabinet Mountains Wilderness</strong> (66 miles west) offers granite peaks,
        alpine lakes, and mountain goat habitat in a compact but rugged range. The{' '}
        <strong>Mission Mountains Wilderness</strong> (79 miles south) rises dramatically
        above the Mission Valley. The <strong>Bob Marshall Wilderness</strong> (92 miles
        southeast), at over one million acres, is Montana's most iconic backcountry
        destination.
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
        {townName}'s closest state park is <strong>Whitefish Lake State Park</strong> (2 miles),
        which offers shoreline trails, a swimming beach, and a campground on the west shore
        of Whitefish Lake. <strong>Lone Pine State Park</strong> (17 miles, near Kalispell)
        provides the best valley overlook in the Flathead area.{' '}
        <strong>Wayfarers State Park</strong> and <strong>Flathead Lake State Park</strong>{' '}
        offer lakeside walking paths along Montana's largest natural lake.{' '}
        <strong>Wild Horse Island State Park</strong>, accessible only by boat, preserves
        2,163 acres of grassland and forest where bighorn sheep and wild horses roam.
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
        <strong>Spring (April to May):</strong> Lower trails around Whitefish Lake and the
        Whitefish Trail clear of snow by mid-April. Danny On Trail and Big Mountain are
        typically snow-covered through May. Glacier National Park trails above 5,000 feet
        remain under snow well into June. Going-to-the-Sun Road is usually closed until
        late June. Valley-floor trails and the Whitefish River corridor are the best spring
        options.
      </p>
      <p>
        <strong>Summer (June to August):</strong> Peak season. Danny On Trail and the Big
        Mountain network reach prime condition in late June. Glacier National Park trails
        open progressively, with Logan Pass and the Highline Trail typically accessible by
        early July. Temperatures reach the low 80s in the Flathead Valley. Carry water
        and plan alpine hikes for early starts to avoid afternoon thunderstorms. Wildfire
        smoke can affect visibility in late July and August.
      </p>
      <p>
        <strong>Fall (September to October):</strong> The finest hiking season. Western larch
        trees turn brilliant gold across the high country. Larch season peaks in mid-October
        and draws hikers from across Montana. Glacier National Park is less crowded after
        Labor Day, and Going-to-the-Sun Road typically stays open through mid-October. Crisp
        mornings, stable weather, and outstanding fall color make this the premier time to hike.
      </p>
      <p>
        <strong>Winter (November to March):</strong> Snowshoeing and cross-country skiing
        replace hiking on most trails. The Whitefish Trail grooms Nordic sections. Glacier
        National Park's interior roads close, but the park remains open for snowshoeing and
        backcountry skiing. Avalanche awareness is essential for any backcountry travel.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is core grizzly bear habitat. Both grizzly and black bears are
        common on trails throughout the Whitefish Range, Glacier National Park, and
        surrounding forests. Carry bear spray, make noise, hike in groups when possible, and
        store food in bear-resistant containers. Mountain lion and moose encounters also occur.
        Cell service is unreliable beyond the immediate valley floor and nonexistent in most
        of Glacier National Park. Carry a paper map or downloaded offline maps.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
