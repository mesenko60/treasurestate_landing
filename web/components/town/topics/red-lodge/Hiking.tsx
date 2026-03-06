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
        {townName} sits at 5,568 feet in a narrow valley carved by Rock Creek at the base of the
        Beartooth Mountains{'\u2014'}one of the most dramatic alpine landscapes in the Northern
        Rockies. The Beartooth Highway begins just south of town and climbs to 10,947 feet on its
        way to Yellowstone National Park's northeast entrance, passing through a world of alpine
        tundra, glacial lakes, and granite peaks that rivals anything in the Lower 48. The
        Absaroka-Beartooth Wilderness (15 miles south) protects over 943,000 acres of alpine
        plateaus, peaks exceeding 12,000 feet, and more than 700 alpine lakes. With 13 trailheads
        within 50 miles, {townName} offers an unusual combination of in-town creek-side walks,
        high-alpine scrambles, and direct access to one of Montana's most spectacular wilderness
        areas. This guide organizes trails by distance from {townName} and covers seasonal
        considerations. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>13 trailheads</strong> within 50 miles</li>
        <li><strong>338 recreation sites</strong> within 50 miles</li>
        <li><strong>1 wilderness area</strong> directly accessible: Absaroka-Beartooth (15 mi)</li>
        <li><strong>3 state parks</strong> within range</li>
        <li><strong>5 waterfalls</strong> within 50 miles</li>
        <li><strong>Closest trailhead:</strong> Rock Creek trails, in town</li>
        <li><strong>Closest wilderness:</strong> Absaroka-Beartooth Wilderness, 15 miles</li>
        <li><strong>National parks:</strong> Yellowstone (72 mi via Beartooth Highway)</li>
        <li><strong>Ski area:</strong> Red Lodge Mountain (4 mi)</li>
        <li><strong>Hot springs:</strong> none within 50 miles</li>
        <li><strong>Scenic drive:</strong> Beartooth Highway (All-American Road), 15 miles to summit</li>
      </ul>

      <h2>In-Town &amp; Urban Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s in-town hiking centers on Rock Creek, which flows through the heart of
        downtown before continuing north into the valley. Paved and gravel paths follow the
        creek through Lions Park and Coal Miners Park, offering easy walking, running, and
        family-friendly outings with views of the Beartooth front rising to the west. The
        benchlands above town provide informal trail networks with sweeping views south toward
        the Beartooth Plateau and east across the high plains of Carbon County. These lower-elevation
        routes stay accessible from early spring through late fall, though {townName}'s 5,568-foot
        elevation means snow can linger into April and return by late October.
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
        <strong>West Fork of Rock Creek</strong> (approximately 10 miles south) is one of the
        most popular hiking corridors near {townName}. The trail follows the West Fork upstream
        through dense forest and open meadows, gaining elevation steadily as it approaches the
        Absaroka-Beartooth Wilderness boundary. Strong hikers can continue to high alpine basins
        and lakes, including several of the 700+ lakes that dot the Beartooth Plateau. The trail
        is well-maintained and offers a genuine wilderness experience within a short drive of town.
      </p>
      <p>
        The <strong>Beartooth Highway corridor</strong> provides access to some of the most
        spectacular high-alpine hiking in Montana. Once the highway opens (typically late May or
        early June), trailheads along the route access the Beartooth Plateau{'\u2014'}the largest
        contiguous area above 10,000 feet in the Lower 48. <strong>Beartooth Lake</strong>,{' '}
        <strong>Island Lake</strong>, and <strong>Gardner Lake</strong> trailheads offer
        above-treeline hiking through a surreal landscape of alpine tundra, snowfields, and
        granite slabs with views stretching to the horizon in every direction. The terrain is
        exposed and weather can change rapidly at altitude{'\u2014'}afternoon thunderstorms build
        regularly over the plateau, and snow is possible any month of the year.
      </p>
      <p>
        <strong>Basin Lakes Trail</strong> (roughly 8 miles south) climbs through forest to a
        pair of alpine lakes set in a cirque beneath rugged peaks. The 6-mile round trip with
        about 1,500 feet of elevation gain makes it one of the most rewarding moderate day hikes
        near {townName}{'\u2014'}popular on summer weekends but never as crowded as comparable
        trails near Bozeman or Missoula.
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

      <h2>Absaroka-Beartooth Wilderness</h2>
      <p>
        The <strong>Absaroka-Beartooth Wilderness</strong> (15 miles south) is one of the crown
        jewels of the American wilderness system{'\u2014'}943,377 acres of alpine plateaus, granite
        peaks exceeding 12,000 feet (including Granite Peak, Montana's highest at 12,799 feet),
        and more than 700 alpine lakes. {townName} is the closest town to the wilderness's eastern
        front, giving hikers and backpackers direct access to the Beartooth Plateau from multiple
        trailheads along the West Fork of Rock Creek and the Beartooth Highway.
      </p>
      <p>
        The Beartooth Plateau itself offers some of the most unique hiking terrain in the
        continental United States. Above treeline at 10,000+ feet, the landscape is tundra-like:
        rolling alpine grasslands, snowfields that persist into August, scattered granite tors,
        and hundreds of lakes ranging from small tarns to substantial bodies of water. Multi-day
        backpacking routes traverse the plateau from trailhead to trailhead, with opportunities
        for extended solitude in a landscape that feels more like the Arctic than the Lower 48.
        The Beaten Path trail (approximately 26 miles point-to-point) is one of the classic
        Beartooth backpacking routes, traversing the heart of the wilderness through high passes
        and lake basins.
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
        Three state parks lie within range of {townName}, offering trail systems and interpretive
        experiences that complement the backcountry hiking. These parks provide accessible,
        family-friendly outings with maintained facilities{'\u2014'}a welcome alternative to the more
        demanding alpine terrain of the Beartooth.
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
        <strong>Spring (March–May):</strong> Lower-elevation trails along Rock Creek and the
        benchlands above town clear by mid-April in most years. The Beartooth Highway remains
        closed through spring{'\u2014'}typically not opening until late May or early June depending
        on snowpack. West Fork trails hold snow at higher elevations into June. Avalanche risk
        persists on steep terrain through May. Spring is quiet and uncrowded, with wildflowers
        appearing in the creek bottoms by late May.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. The Beartooth Highway opens and
        unlocks access to the high-alpine trailheads on the plateau. Alpine lakes and above-treeline
        trails are typically clear by mid-July, though snow patches persist on north-facing slopes
        all summer. Temperatures in {townName} reach the upper 70s to low 80s°F, but the plateau
        at 10,000+ feet is dramatically cooler{'\u2014'}frost is possible any night. Afternoon
        thunderstorms build over the mountains regularly; be off exposed ridgelines and the
        plateau by early afternoon. Wildfire smoke can affect visibility in late July and August.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Many locals consider this the finest hiking
        season near {townName}. Warm days, cool nights, and dramatically reduced crowds make for
        ideal conditions. The Beartooth Highway typically closes for the season in mid-October.
        Aspens blaze gold in the creek drainages, and the high country takes on a dusting of
        early snow against deep blue skies. Hunting season begins in October{'\u2014'}wear blaze
        orange on national forest trails.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Red Lodge Mountain ski area (4 miles west)
        provides downhill skiing from December through mid-April. Cross-country skiing and
        snowshoeing are available on the West Fork road and lower-elevation forest trails.
        The Beartooth Highway is closed, and high-alpine terrain is the domain of backcountry
        skiers and ski-mountaineers. In-town trails along Rock Creek remain accessible for
        winter walks, though temperatures in January average highs of 31°F and lows of 17°F.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is grizzly bear habitat{'\u2014'}the Absaroka-Beartooth Wilderness
        supports grizzly and black bear populations, and encounters are possible on any backcountry
        trail. Carry bear spray on every hike, travel in groups, make noise, and store food
        properly. Mountain lions are present in the foothills. <strong>Altitude</strong> is a
        distinctive {townName} hiking consideration{'\u2014'}trails on the Beartooth Plateau
        regularly exceed 10,000 feet, and visitors arriving from lower elevations should
        acclimatize before attempting strenuous high-altitude hikes. Weather above treeline can
        change within minutes; carry layers, rain gear, and be prepared to turn back. Cell
        service is limited to nonexistent in the wilderness and along much of the Beartooth
        Highway{'\u2014'}carry a map, tell someone your plans, and be self-sufficient.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
