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
        {townName} is Montana's state capital and one of the few American capitals where you
        can summit a mountain on your lunch break. The city nestles into the eastern flank of
        the Continental Divide in the Prickly Pear Valley, with the Helena National Forest
        wrapping around three sides and the broad Missouri River valley opening to the north.
        With 11 trailheads within 30 miles, {townName} has fewer total trailheads than the big
        western Montana trail towns — but what it lacks in sheer count it makes up for in
        immediacy and quality. Mount Helena City Park puts a 620-acre trail network at the
        literal edge of downtown, the Scratchgravel Hills offer wide-open ridgeline rambling
        minutes from the capitol building, and the Gates of the Mountains Wilderness — named
        by Lewis and Clark themselves — lies just 20 miles north. This guide organizes trails
        by distance from {townName} and covers seasonal considerations. For the full city
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>11 trailheads</strong> within 30 miles</li>
        <li><strong>9 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>4 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> Rodney Street Trailhead (Mount Helena), 1 mile from downtown</li>
        <li><strong>Closest wilderness:</strong> Gates of the Mountains, 20 miles north</li>
        <li><strong>National forest:</strong> Helena-Lewis &amp; Clark National Forest, 8 miles</li>
        <li><strong>Continental Divide:</strong> passes within 10 miles of town</li>
        <li><strong>Hot springs:</strong> Broadwater Hot Springs, 1 mile from downtown</li>
      </ul>

      <h2>In-Town &amp; Urban Trails (Within 8 Miles)</h2>
      <p>
        Mount Helena City Park is the crown jewel of {townName}'s trail system and a defining
        feature of the city itself. This 620-acre park rises directly from the southwest edge
        of downtown, with the Rodney Street Trailhead just one mile from Last Chance Gulch.
        The summit trail climbs 1,300 feet to a 5,468-foot peak offering panoramic views of
        the Elkhorn Mountains, Big Belt Mountains, the Missouri River valley, and the city
        spread below. The park's network includes over 20 miles of interconnected trails
        ranging from gentle lower loops to steep ridge traverses, making it one of the finest
        urban trail parks in the Northern Rockies. The 1906 Trail and Prairie Trail are
        popular loop options for runners and dog walkers, while the Backside Trail offers a
        longer, less-crowded route to the summit.
      </p>
      <p>
        Beyond Mount Helena, the Mount Helena Ridge Trailhead (5 miles) extends the network
        along the ridgeline south of town, connecting into the broader South Hills trail
        system. The Head Lane (6 miles) and Echo Lane (7 miles) trailheads access the
        Scratchgravel Hills — a rolling landscape of open grassland and scattered ponderosa
        pine north of town that offers expansive views and gentler terrain than the Mount
        Helena trails. These are excellent shoulder-season options when higher trails still
        hold snow.
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
        The McMasters Hills East trailhead (14 miles south) opens access to a network of
        trails in the Helena National Forest with rolling terrain through mixed conifer and
        grassland. These trails see far less traffic than Mount Helena and offer a sense of
        backcountry solitude within a short drive. Further out, the Gates of the Mountains
        Wilderness (20 miles north) is {townName}'s most dramatic hiking destination. Lewis
        and Clark named this stretch of the Missouri River in 1805 when towering 1,200-foot
        limestone cliffs appeared to open like a gate as they paddled upstream. Today, a
        seasonal boat shuttle crosses the river to trailheads accessing the wilderness
        interior, where trails wind through deep limestone canyons, past bighorn sheep
        habitat, and up to ridgeline views over the Missouri River gorge.
      </p>
      <p>
        The Refrigerator Canyon and Meriwether Canyon trails are standout routes in the Gates
        area — Refrigerator Canyon is named for the cool air that pools in the narrow
        limestone defile even on the hottest summer days. The terrain here is distinctly
        different from western Montana's glacier-carved alpine landscapes; this is limestone
        country, with dry canyons, cliff bands, and open ridges that feel more like the
        American Southwest transplanted to Montana. Mountain goats and bighorn sheep are
        regularly spotted on the cliff faces.
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
        The Continental Divide passes within 10 miles of {townName} — closer than any other
        Montana city of comparable size. The Continental Divide National Scenic Trail (CDT)
        traverses the mountains west of town, and several access points put day hikers on
        the divide itself. MacDonald Pass (20 miles west on Highway 12) is a popular starting
        point for CDT hikes along the divide ridgeline, with panoramic views into the
        Blackfoot Valley to the west and the Helena Valley to the east. The Elkhorn Mountains,
        rising to 9,414 feet at Crow Peak southeast of town, offer additional high-country
        hiking through a landscape of granite peaks, alpine meadows, and ghost-town remnants
        from {townName}'s gold-rush past.
      </p>

      <h2>Wilderness &amp; Backcountry</h2>
      <p>
        Nine federally designated wilderness areas are accessible from {townName}, though most
        require drives of 40 miles or more. The Gates of the Mountains Wilderness (20 miles
        north) is the closest and most distinctive — its 28,562 acres of rugged limestone
        terrain along the Missouri River offer a hiking experience unlike anywhere else in
        Montana. The Scapegoat Wilderness (45 miles northwest) connects to the massive Bob
        Marshall Wilderness complex, providing access to over a million acres of contiguous
        roadless country along the Continental Divide.
      </p>
      <p>
        The Elkhorn Mountains (30 miles southeast) contain a Wildlife Management Unit rather
        than formal wilderness, but the terrain is wild and uncrowded, with elk herds, mountain
        goat populations, and trails passing through abandoned mining districts from the 1880s.
        For longer backcountry trips, the Bob Marshall Wilderness (65 miles northwest) and its
        iconic Chinese Wall are reachable from trailheads along the Rocky Mountain Front — a
        full day's drive but a world-class multi-day destination.
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
        {townName}'s four nearby state parks each serve a different purpose. Spring Meadow
        Lake State Park (2 miles from downtown) is an urban oasis — a 30-acre spring-fed lake
        surrounded by walking paths, popular for lunchtime strolls and catch-and-release trout
        fishing. It's one of the closest state parks to any Montana city center. Missouri
        Headwaters State Park (52 miles southeast) marks the exact spot where the Jefferson,
        Madison, and Gallatin rivers converge to form the Missouri River — a site of immense
        historical significance explored by Lewis and Clark in 1805. The park offers riverside
        trails through cottonwood bottoms with interpretive exhibits on the expedition.
      </p>
      <p>
        Lewis &amp; Clark Caverns State Park (53 miles southeast) features Montana's most
        extensive limestone cave system, with guided underground tours and above-ground hiking
        trails along the Jefferson River canyon. Tower Rock State Park (53 miles) preserves a
        dramatic 424-foot volcanic rock formation along the Missouri River — a brief but
        memorable stop with a short interpretive trail.
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
        <strong>Spring (March–May):</strong> {townName}'s drier climate means trails clear
        earlier than in western Montana. Mount Helena and Scratchgravel Hills are often
        hikeable by mid-March, with only patches of snow on north-facing slopes. The lower
        trails dry out quickly thanks to {townName}'s semi-arid conditions — expect fewer
        muddy-season closures than in Missoula or the Flathead Valley. Gates of the Mountains
        boat service typically begins in late May. Higher-elevation trails in the Elkhorns and
        along the Continental Divide remain snow-covered into June.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. Temperatures regularly reach the
        upper 80s and low 90s°F — hotter and drier than western Montana trail towns. Start
        early to beat the heat, especially on Mount Helena's exposed south-facing slopes.
        Gates of the Mountains boat shuttle runs daily, opening the wilderness interior.
        Afternoon thunderstorms are common in the mountains but typically brief. Wildfire smoke
        can affect air quality and visibility in late July and August — check conditions before
        heading out. Water sources are scarce on many {townName}-area trails; carry more water
        than you think you'll need.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The best hiking season around {townName}.
        Warm days, cool nights, and low humidity make for ideal trail conditions. The Elkhorn
        Mountains and Continental Divide see outstanding fall color in the aspens and larch.
        Gates of the Mountains boat service typically runs through mid-September. Elk bugling
        echoes through the Helena National Forest in September — an unforgettable backcountry
        experience. Hunting season begins in October; wear blaze orange on national forest
        trails.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Mount Helena remains accessible year-round
        and is popular for winter hiking on packed snow — microspikes are recommended from
        December through February. Scratchgravel Hills are often wind-scoured and snow-free
        even in winter. Cross-country skiing is available at MacDonald Pass and in the Helena
        National Forest. {townName}'s two closest downhill ski areas — Discovery (62 miles)
        and Showdown (65 miles) — are both over an hour away, making {townName} more of a
        Nordic and winter hiking town than a destination ski town.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is home to both black bears and mountain lions, with occasional
        grizzly bear sightings in the Gates of the Mountains area and along the Continental
        Divide. Carry bear spray on all backcountry hikes and make noise on the trail.
        Rattlesnakes are present on lower-elevation trails — particularly the south-facing
        slopes of Mount Helena and in the limestone canyons of the Gates of the Mountains —
        from May through September. Watch where you step and place your hands, especially
        on rocky terrain. The dry climate means dehydration is a real concern; carry adequate
        water on every hike. Cell service is reliable on the Mount Helena summit and
        Scratchgravel Hills ridgeline but drops off quickly in canyons and the backcountry.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
