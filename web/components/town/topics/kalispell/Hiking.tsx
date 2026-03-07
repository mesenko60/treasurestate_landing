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
  const urban = trails.filter(t => t.distMiles <= 6);
  const day = trails.filter(t => t.distMiles > 6 && t.distMiles <= 25);
  const backcountry = trails.filter(t => t.distMiles > 25).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits in the broad Flathead Valley of northwest Montana, flanked by the
        Swan Range to the east, the Salish Mountains to the west, and Glacier National Park
        just 30 miles to the northeast. With 26 trailheads within 30 miles, the hiking here
        ranges from gentle valley walks with views over Flathead Lake to world-renowned alpine
        trails along the Continental Divide. The proximity to Glacier National Park sets{' '}
        {townName} apart from every other Montana trail town — no other city offers a gateway
        to one of America's most iconic wilderness parks alongside a deep local trail network.
        This guide organizes trails by distance from {townName} and covers seasonal
        considerations. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>26 trailheads</strong> within 30 miles</li>
        <li><strong>4 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>5 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> Lone Pine State Park, 3 miles from downtown</li>
        <li><strong>Closest wilderness:</strong> Great Bear Wilderness, 53 miles</li>
        <li><strong>Glacier National Park:</strong> West entrance 25 miles northeast</li>
        <li><strong>Ski area:</strong> Whitefish Mountain Resort, 19 miles (summer hiking trails available)</li>
      </ul>

      <h2>In-Town & Urban Trails (Within 6 Miles)</h2>
      <p>
        {townName}'s in-town hiking is anchored by Lone Pine State Park, perched on a
        bluff just three miles southwest of downtown. The park's network of interconnected
        loops covers roughly seven miles of trail through ponderosa pine forest and open
        meadow, with a signature overlook that delivers a sweeping panorama of the Flathead
        Valley, Flathead Lake, and the peaks of Glacier National Park on the horizon. It's a
        year-round destination — popular for morning trail runs, family hikes, and snowshoeing
        in winter. The visitor center at the top offers interpretive exhibits on the
        region's ecology.
      </p>
      <p>
        Closer to the valley floor, the Learn Lane, Valley View, and Lone Pine trailheads
        form a connected local trail system along the western edge of town. These short,
        moderate paths wind through mixed forest and offer quick access to ridgeline views
        without leaving the city limits. They're ideal for after-work hikes and dog walking,
        and they connect into the broader Lone Pine State Park network for those wanting a
        longer outing.
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

      <h2>Day Hikes (6–25 Miles)</h2>
      <p>
        The crown jewel of {townName}-area day hiking is Jewel Basin Hiking Area, roughly 24
        miles east of town. This dedicated hiking-only area — no motorized use and no stock
        animals — covers 15,349 acres of subalpine terrain laced with 35 miles of trail and
        27 named alpine lakes. The moderate hike to Birch Lake is the most popular route, but
        longer loops connecting Black Lake, Jewel Lakes, and Picnic Lakes reward stronger
        hikers with solitude and stunning cirque scenery. Snow lingers at elevation well into
        July, so check conditions before heading in early season.
      </p>
      <p>
        To the north, the Danny On Trail at Whitefish Mountain Resort (19 miles) climbs
        through wildflower meadows to the summit of Big Mountain at 6,817 feet, offering
        panoramic views stretching from Glacier National Park to the Flathead Valley floor.
        The resort runs a chairlift in summer for those who want to ride up and hike down.
        Strawberry Lake (15 miles east) and the Swan River Nature Trail system (15–17 miles)
        provide quieter alternatives with forested lakeside paths and gentle river walks. Big
        Mountain's broader trail network near Whitefish Mountain Resort (18–21 miles) includes
        several additional summit loops and ridge traverses.
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
        No hiking guide for {townName} would be complete without Glacier National Park, whose
        west entrance at Apgar is just 25 miles northeast. The park holds over 700 miles of
        maintained trail across one of the most dramatic alpine landscapes in North America.
        From {townName}, several world-class trails are within easy day-trip range.
      </p>
      <p>
        <strong>Avalanche Lake</strong> (25 miles from {townName}) is one of the park's most
        popular hikes — a moderate 5.9-mile round trip through old-growth cedar and hemlock
        forest to a turquoise glacial lake ringed by waterfalls cascading down 3,000-foot
        cliffs. The adjacent <strong>Trail of the Cedars</strong> is a wheelchair-accessible
        boardwalk loop through ancient western red cedar and hemlock, one of the finest
        old-growth forest walks in the Northern Rockies.
      </p>
      <p>
        The <strong>Highline Trail</strong>, accessed from Logan Pass along Going-to-the-Sun
        Road, is widely considered one of the best hikes in the United States. This 11.8-mile
        point-to-point traverse follows a narrow shelf blasted into the Garden Wall, a sheer
        arête along the Continental Divide, with wildflower meadows, mountain goat sightings,
        and unobstructed views into glacier-carved valleys on both sides. Shuttle service
        returns hikers to the trailhead.
      </p>
      <p>
        The <strong>Grinnell Glacier Trail</strong> in the Many Glacier area (53 miles from{' '}
        {townName}) leads 10.6 miles round trip to one of the park's remaining active glaciers.
        The trail passes several vivid blue lakes and offers close views of the Upper Grinnell
        Glacier and the surrounding cirque walls. Note that Glacier National Park requires a
        vehicle reservation for Going-to-the-Sun Road entry during peak summer months — plan
        ahead and secure reservations early.
      </p>

      <h2>Wilderness & Backcountry</h2>
      <p>
        Four federally designated wilderness areas are accessible from {townName}, together
        encompassing over two million acres of roadless terrain. The Great Bear Wilderness (53
        miles east) borders the southern edge of Glacier National Park and the northern boundary
        of the Bob Marshall Wilderness, forming part of the largest contiguous wilderness complex
        in the lower 48 states. Trails follow the Middle Fork of the Flathead River and climb
        into remote alpine basins rarely visited by casual hikers.
      </p>
      <p>
        The Cabinet Mountains Wilderness (61 miles west) is a compact but rugged range with
        granite peaks, alpine lakes, and resident mountain goat herds. The Mission Mountains
        Wilderness (65 miles south) rises dramatically above the Mission Valley — some peaks
        gain 7,000 feet of elevation from the valley floor. The Bob Marshall Wilderness (81
        miles southeast), at over one million acres, is Montana's most iconic backcountry
        destination, known for the Chinese Wall — a 1,000-foot-high escarpment stretching 22
        miles along the Continental Divide.
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
        The Flathead Valley is ringed by Montana state parks offering trails with distinct
        character. Lone Pine State Park (3 miles) is the closest and most frequently hiked,
        with its valley overlook and interpretive trails. Wayfarers State Park (14 miles) and
        Whitefish Lake State Park (15 miles) provide lakeside walking paths along their
        respective shorelines. Flathead Lake State Park (25 miles), spread across multiple
        units around Montana's largest natural lake, offers shoreline trails with mountain
        backdrop views. Wild Horse Island State Park (29 miles) is accessible only by boat and
        preserves 2,163 acres of grassland and forest where bighorn sheep, wild horses, and
        mule deer roam — hiking the island's trails is a uniquely Montana experience.
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
        <strong>Spring (April–May):</strong> Valley-floor trails like Lone Pine State Park
        clear of snow by mid-April, though upper loops may remain muddy into May. Jewel Basin
        and Glacier National Park trails above 5,000 feet are typically snow-covered through
        May and into June. Going-to-the-Sun Road in Glacier is usually closed to vehicles
        until late June. Low-elevation trails along the Flathead River and near Whitefish Lake
        are the best spring options.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. Glacier National Park trails open
        progressively as snow melts — Logan Pass and the Highline Trail are typically accessible
        by early July. Jewel Basin reaches peak condition in mid-July. Temperatures in the
        Flathead Valley reach the mid-80s°F; carry plenty of water. Afternoon thunderstorms
        are common above treeline — plan alpine hikes for early starts. Wildfire smoke can
        affect air quality and visibility in late July and August.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The finest hiking season in the Flathead
        Valley. Larch trees turn brilliant gold across the high country — larch season in the
        Swan Range and Jewel Basin peaks in mid-October and draws hikers from across the state.
        Glacier National Park is less crowded after Labor Day, and Going-to-the-Sun Road
        typically stays open through mid-October. Crisp mornings, stable weather, and
        outstanding fall color make this the premier time to hike.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Snowshoeing and cross-country skiing replace
        hiking on most trails. Lone Pine State Park grooms Nordic trails and is a popular
        winter destination. Glacier National Park's interior roads close to vehicles, but the
        park remains open for snowshoeing and backcountry skiing. Avalanche awareness is
        essential for any backcountry travel — the northern ranges receive heavy snowfall and
        avalanche terrain is extensive.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is core grizzly bear habitat. Both grizzly and black bears are
        common on trails throughout the Flathead Valley, Jewel Basin, and Glacier National
        Park. Carry bear spray, make noise on the trail, hike in groups when possible, and
        store food in bear-resistant containers in the backcountry. Mountain lion and moose
        encounters also occur. Cell service is unreliable beyond the immediate valley floor
        and nonexistent in most of Glacier National Park — carry a paper map or downloaded
        offline maps, and let someone know your itinerary for any backcountry trip.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
