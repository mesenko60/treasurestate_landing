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
        {townName} sits at 6,667 feet on a forested plateau at the western edge of Yellowstone
        National Park{'\u2014'}one mile from the West Entrance gate. The town is surrounded on
        three sides by Gallatin National Forest and bordered to the east by the world's first
        national park, creating hiking access that is virtually unmatched in the Northern Rockies.
        With 13 trailheads within 30 miles, 49 recreation sites, and direct access to
        Yellowstone's geyser basins, backcountry trails, and nearby wilderness terrain, {townName}{' '}
        offers everything from boardwalk strolls past erupting geysers to multi-day
        backpacking trips through grizzly country. The elevation is high, the winters are
        brutal (January averages 24/8°F), and the terrain demands respect. This guide organizes
        trails by distance from {townName} and covers seasonal considerations. For the full
        city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>13 trailheads</strong> within 30 miles</li>
        <li><strong>49 recreation sites</strong> within 30 miles</li>
        <li><strong>Closest trailhead:</strong> Rendezvous Ski Trails, in town</li>
        <li><strong>Closest wilderness:</strong> Lee Metcalf Wilderness, about 41 miles</li>
        <li><strong>National park:</strong> Yellowstone West Entrance, 1 mile</li>
        <li><strong>Ski areas:</strong> Big Sky Resort (45 mi), cross-country at Rendezvous Trails (in town)</li>
        <li><strong>Hot springs:</strong> Firehole River swimming area (Yellowstone, 16 mi)</li>
      </ul>

      <h2>In-Town & Urban Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s in-town hiking centers on the <strong>Rendezvous Ski Trails</strong>, a
        world-class Nordic trail system that doubles as hiking and mountain biking terrain during
        summer months. The network of groomed and natural-surface trails winds through lodgepole
        pine forest immediately adjacent to town, offering easy to moderate loops from 1 to 15
        kilometers. The trails have hosted the U.S. Cross-Country Ski Championships and provide
        a rare combination of accessibility and quality{'\u2014'}you can walk from downtown to
        serious trail running in minutes.
      </p>
      <p>
        The town's grid of streets gives way to forest in every direction, and informal paths
        connect to the Gallatin National Forest surrounding the community. The Boundary Trail,
        skirting the edge of Yellowstone's western boundary south of town, provides a moderate
        out-and-back through mixed forest with occasional meadow views and the possibility of
        wildlife encounters{'\u2014'}bison, elk, and moose all frequent the park boundary zone.
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

      <h2>Day Hikes (8{'\u2013'}30 Miles)</h2>
      <p>
        <strong>Yellowstone National Park</strong> provides the marquee day-hiking from {townName}.
        Entering through the West Entrance (1 mile), the road follows the Madison River through
        broad meadows where bison herds graze and elk congregate at dawn and dusk. The Lower and
        Upper Geyser Basins{'\u2014'}including Old Faithful (30 miles inside the park){'\u2014'}offer
        boardwalk trails through the densest concentration of geysers on earth. The{' '}
        <strong>Fairy Falls Trail</strong> (approximately 25 miles from town via the park road)
        is a 5-mile round-trip to a stunning 197-foot waterfall, with a side trip to Grand
        Prismatic Spring overlook providing one of the park's most iconic viewpoints.
      </p>
      <p>
        The <strong>Madison River corridor</strong> inside the park offers flat, easy trails
        through wildlife-rich meadows{'\u2014'}ideal for families and casual hikers. For more
        elevation and solitude, the <strong>Purple Mountain Trail</strong> climbs through
        lodgepole forest to views over the Madison Valley. Outside the park to the north, trails
        in the <strong>Gallatin National Forest</strong> climb from the Highway 191 corridor
        into the Madison Range, offering alpine terrain and significantly fewer people than
        the park trails.
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

      <h2>Yellowstone Backcountry</h2>
      <p>
        {townName}'s proximity to the West Entrance makes it the most convenient base for
        Yellowstone's western backcountry. The park's backcountry permit system opens access to
        hundreds of miles of trails through geyser basins, alpine meadows, and remote river
        valleys. The <strong>Bechler River Trail</strong> (accessible from the park's southwest
        corner, roughly 30 miles from town) traverses one of Yellowstone's most spectacular
        backcountry regions{'\u2014'}a landscape of waterfalls, hot springs, and old-growth forest
        that sees a fraction of the traffic at the geyser basins. Multi-day trips through the
        Bechler area require backcountry permits (available at the West Yellowstone Visitor
        Information Center) and bear canisters.
      </p>
      <p>
        The <strong>Shoshone Lake</strong> area, accessible via the DeLacy Creek or Lone Star
        Geyser trails, offers backcountry camping at Yellowstone's largest backcountry lake with
        its own geyser basin on the shore. The Yellowstone backcountry is grizzly bear country
        of the highest order{'\u2014'}proper food storage, bear spray, and group travel are
        essential, not optional.
      </p>

      <h2>Wilderness & Backcountry</h2>
      <p>
        Three federally designated wilderness areas are accessible from {townName}. The{' '}
        <strong>Lee Metcalf Wilderness</strong> encompasses rugged terrain in the Madison Range
        to the north and west, with the Spanish Peaks and Bear Trap Canyon units offering
        glacier-carved cirques, alpine lakes, and peaks exceeding 11,000 feet. Trails from
        the Highway 287/191 corridor north of town climb into some of the most spectacular
        alpine country in southwestern Montana. The <strong>Cabin Creek</strong> area provides
        a more accessible introduction to Lee Metcalf's wild character.
      </p>
      <p>
        The <strong>Absaroka-Beartooth Wilderness</strong> to the northeast spans over 943,000
        acres of alpine plateaus and granite peaks exceeding 12,000 feet. While the main access
        points are further from {townName} than from towns like Red Lodge or Livingston, the
        northwestern approaches through Paradise Valley and the Gallatin Range provide entry to
        some of the wilderness's most remote and least-visited terrain.
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

      {stateParks.length > 0 && (
        <>
          <h2>State Parks</h2>
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
        </>
      )}

      <h2>Seasonal Considerations</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> {townName}'s high elevation means spring
        arrives late. Snow can persist on trails through May and into June at higher elevations.
        The West Entrance to Yellowstone typically opens to vehicles in mid-April, but many park
        trails remain snow-covered and muddy. The Rendezvous Ski Trails transition from skiing
        to hiking as snow melts, usually by mid-May. Black bears and grizzlies emerge from
        hibernation and are active along trails{'\u2014'}be especially alert during spring.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Yellowstone's geyser
        basin boardwalks are fully accessible, and backcountry trails clear by late June to
        mid-July depending on elevation and snowpack. July highs average 78°F with lows near
        46°F{'\u2014'}pleasant but with intense afternoon sun at 6,667 feet. Afternoon thunderstorms
        build regularly over the mountains; be off exposed ridgelines by early afternoon. Wildfire
        smoke can affect visibility and air quality in late July and August. Yellowstone's popular
        trails (Old Faithful, Grand Prismatic boardwalk) can be extremely crowded{'\u2014'}start
        early to beat both heat and crowds.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Locals consider this the best hiking
        season. Warm days, cool nights, dramatically reduced crowds, and spectacular fall color
        make for ideal conditions. Elk bugling echoes through the Madison Valley, and wildlife
        viewing is outstanding. The West Entrance typically remains open through early November.
        Frost arrives by mid-September at this elevation, and snow can fall by late September.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> {townName} is one of the coldest
        inhabited places in the lower 48{'\u2014'}January averages 24°F high and 8°F low, with
        subzero stretches common. The West Entrance closes to wheeled vehicles in early November
        but reopens for over-snow travel (snowmobiles and snowcoaches) in mid-December. The
        Rendezvous Ski Trails become one of the premier Nordic skiing venues in North America,
        with 35 km of groomed trails. Snowshoeing in the surrounding national forest and into
        Yellowstone's snow-covered interior offers a magical winter experience. Dress for
        extreme cold and watch for wildlife on trails{'\u2014'}bison use groomed roads as travel
        corridors in winter.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is the heart of the Greater Yellowstone Ecosystem{'\u2014'}the densest
        concentration of grizzly bears in the lower 48. Carry bear spray on every hike, travel
        in groups, make noise, and store food in bear-resistant containers in the backcountry.
        Bison are also a serious hazard in Yellowstone; maintain at least 25 yards distance (they
        are faster than they look and have injured more park visitors than bears). Thermal areas
        require absolute adherence to boardwalks{'\u2014'}the ground near geysers and hot springs can
        be a thin crust over boiling water. The high elevation (6,667+ feet) affects those
        arriving from lower elevations; allow time to acclimatize and carry more water than you
        think you need. Cell service is unreliable in the park and surrounding forest{'\u2014'}carry
        a map and inform someone of your plans.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
