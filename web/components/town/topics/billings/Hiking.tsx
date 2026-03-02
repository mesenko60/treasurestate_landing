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
        {townName} is Montana's largest city and sits in a landscape unlike any other trail town
        in the state. Instead of mountain peaks pressing against the skyline, {townName}'s
        defining geological feature is the Rimrocks — a dramatic 400-foot band of sandstone cliffs
        running along the city's entire northern edge, offering panoramic views across the
        Yellowstone River valley and the plains stretching to the Beartooth Mountains on the
        southern horizon. The hiking here is honest: {townName} is not a mountain town, and
        there are no formal trailheads tracked in the state recreation database within city limits.
        But the city has genuine trail networks on and around the Rims, a 765-acre natural area
        above the Yellowstone River, and state parks with walking trails just minutes away. For
        serious mountain hiking, the Absaroka-Beartooth Wilderness and its 12,000-foot peaks lie
        67 miles southwest via the Beartooth Highway — one of the most spectacular drives in
        America. This guide covers the trails you can actually walk from {townName}. For the full
        city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>Signature landscape:</strong> The Rimrocks — 400-foot sandstone cliffs along the city's north edge</li>
        <li><strong>Closest trail:</strong> Swords Rimrock Park, on top of the Rims within city limits</li>
        <li><strong>Best nature area:</strong> Four Dances Natural Area, 765 acres above the Yellowstone River</li>
        <li><strong>Urban trails:</strong> Norm Schoenthal Island, Phipps Park, Riverfront Park paths</li>
        <li><strong>Closest state park:</strong> Lake Elmo State Park, 2 miles</li>
        <li><strong>Rock art:</strong> Pictograph Cave State Park, 4 miles — 4,500-year-old pictographs</li>
        <li><strong>Mountain hiking:</strong> Absaroka-Beartooth Wilderness, 67 miles via Red Lodge</li>
        <li><strong>Scenic drive:</strong> Beartooth Highway (US-212) — 10,947-foot summit, alpine trailheads</li>
      </ul>

      <h2>The Rimrocks &amp; City Trails</h2>
      {trails.length === 0 ? (
        <>
          <p>
            The Rimrocks — locals call them simply "the Rims" — are {townName}'s most distinctive
            natural feature and the backbone of its trail system. These 400-foot sandstone cliffs
            stretch for miles along the city's northern boundary, carved by millions of years of
            erosion into a dramatic escarpment visible from nearly anywhere in town. Walking and
            biking paths run along the rim's edge, offering views across the Yellowstone Valley
            to the Beartooth Plateau and Crazy Mountains. <strong>Swords Rimrock Park</strong> sits
            atop the cliffs within city limits, with paved paths, picnic areas, and unobstructed
            panoramic views — it's the easiest access point to the Rims experience and a popular
            spot for sunset walks.
          </p>
          <p>
            <strong>Four Dances Natural Area</strong> is {townName}'s premier trail destination — a
            765-acre preserve on a sandstone promontory above a sweeping bend in the Yellowstone
            River, about 4 miles from downtown. The trail network winds through native grassland,
            ponderosa pine groves, and along cliff edges with views straight down to the river
            300 feet below. Mule deer, raptors, and wild turkeys are common. The area is named
            for a Crow warrior and carries deep cultural significance for the Apsáalooke (Crow)
            people. Trails range from gentle grassland loops to steeper routes descending toward
            the river.
          </p>
          <p>
            <strong>Norm Schoenthal Island</strong> is a Yellowstone River island accessible by
            footbridge, offering flat walking trails through cottonwood groves and wetland habitat
            in the middle of town — a peaceful nature walk minutes from downtown. <strong>Phipps
            Park</strong>, one of {townName}'s largest city parks, has multi-use trails winding
            through open space on the city's west side. The <strong>Yellowstone River
            Parks</strong> trail system connects several riverfront parks with paved and gravel
            paths along the river corridor, suitable for walking, running, and cycling.
          </p>
        </>
      ) : (
        <>
          <p>
            The Rimrocks define {townName}'s northern skyline — 400-foot sandstone cliffs with
            walking paths along the edge and panoramic views across the Yellowstone Valley. Swords
            Rimrock Park sits atop the cliffs with paved paths and sunset views. Four Dances
            Natural Area (4 miles) offers 765 acres of trail network above the Yellowstone River
            on a sandstone promontory.
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
        </>
      )}

      <h2>State Parks With Trails</h2>
      <p>
        <strong>Lake Elmo State Park</strong> (2 miles) is {townName}'s closest state park — a
        64-acre urban lake with a 1.2-mile walking trail circling the water. It's a popular
        after-work loop for runners and dog walkers, with views of the Rimrocks from the south
        shore. Swimming is permitted in summer, and the park offers a quick nature break without
        leaving the city.
      </p>
      <p>
        <strong>Pictograph Cave State Park</strong> (4 miles south) is one of Montana's most
        significant archaeological sites and a genuinely compelling short hike. A paved
        interpretive trail leads to three sandstone caves containing pictographs — rock paintings
        created by prehistoric peoples over 4,500 years ago. The cave shelters yielded over 30,000
        artifacts during excavation, making this one of the most important archaeological sites in
        the Northern Plains. The trail is under a mile but the cultural weight of the site makes it
        far more than a casual stroll.
      </p>
      <p>
        <strong>Cooney State Park</strong> (36 miles southwest) wraps around Cooney Reservoir in
        the foothills south of {townName}, with trails along the shoreline and through surrounding
        grassland. It's a day-trip destination combining hiking with fishing and swimming.
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

      <h2>Wilderness &amp; Mountain Hiking</h2>
      <p>
        {townName}'s ace card for serious hikers is its proximity to the{' '}
        <strong>Absaroka-Beartooth Wilderness</strong> — 944,000 acres of alpine terrain reaching
        12,799 feet at Granite Peak, Montana's highest point. The wilderness lies 67 miles
        southwest, accessed via Red Lodge and the legendary <strong>Beartooth Highway</strong>{' '}
        (US-212), which climbs to 10,947 feet and is routinely called one of the most beautiful
        drives in America. Trailheads along the Beartooth Plateau access alpine lakes, glacier-carved
        cirques, and above-treeline ridgeline traverses. Popular day hikes from the highway include
        Beartooth Lake, Island Lake, and the Beaten Path trailhead — though many of these routes
        lead into multi-day backcountry that rivals anything in the Northern Rockies.
      </p>
      <p>
        The <strong>Crazy Mountains</strong> (75 miles northwest) are a dramatic, isolated range
        rising abruptly from the prairie — sometimes called Montana's "island range" — with rugged
        alpine peaks, mountain lakes, and trails that see far less traffic than the Beartooth.
        Access is limited by private land, so check current trail access before heading out. For
        closer backcountry, the <strong>Bull Mountains</strong> and <strong>Pryor Mountains</strong>{' '}
        south of {townName} offer less-traveled terrain through dry pine forests and canyon country,
        including the Pryor Mountain Wild Horse Range where feral horses roam free.
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

      <h2>Seasonal Considerations</h2>
      <p>
        <strong>Spring (March–May):</strong> {townName}'s semi-arid climate and low elevation
        (3,120 feet) mean city trails clear early. The Rimrocks, Four Dances, and Phipps Park
        are hikeable year-round, with only brief muddy periods after snowmelt. Lake Elmo and
        Pictograph Cave trails are accessible by March. Beartooth Highway remains closed by snow
        until late May or early June — mountain trailheads above 8,000 feet are snow-covered
        well into June. Rattlesnakes emerge on south-facing slopes from April onward.
      </p>
      <p>
        <strong>Summer (June–August):</strong> {townName} is one of Montana's hottest cities —
        temperatures regularly reach the mid-90s°F and occasionally top 100°F. Hike early
        morning or evening on the Rims and city trails, where shade is limited. The Beartooth
        Highway opens (typically late May to mid-June) and alpine trailheads become accessible,
        offering cool high-elevation hiking while the city bakes. Afternoon thunderstorms are
        common in the mountains. Wildfire smoke can affect air quality in late July and August.
        Carry extra water on all trails — the dry climate dehydrates faster than you expect.
      </p>
      <p>
        <strong>Fall (September–October):</strong> The best hiking season around {townName}.
        Temperatures moderate, the light turns golden on the Rimrocks, and the cottonwoods along
        the Yellowstone River blaze yellow. Four Dances Natural Area is at its most beautiful in
        early October. The Beartooth Highway typically closes for the season in mid-October after
        the first heavy snowfall, so September is the last window for alpine hikes. Hunting season
        begins in October — wear blaze orange on public lands outside city parks.
      </p>
      <p>
        <strong>Winter (November–March):</strong> City trails remain accessible through winter,
        though wind along the Rimrocks can be brutal. Four Dances and Phipps Park trails see
        winter walkers on milder days. Beartooth Highway and all high-elevation trailheads are
        closed. Red Lodge Mountain ski area (60 miles) is the closest downhill skiing. The Rims
        offer dramatic winter scenery when dusted with snow, and the low-angle winter light on the
        sandstone cliffs is striking.
      </p>

      <h2>Trail Safety</h2>
      <p>
        Rattlesnakes are the primary trail hazard around {townName} — prairie rattlesnakes are
        common on the Rimrocks, at Four Dances, and on south-facing slopes from April through
        October. Watch where you step and place your hands, especially on rocky outcrops and
        ledges. The cliff edges along the Rims and at Four Dances are unguarded in many places —
        the sandstone can be crumbly, and falls from the Rimrocks are occasionally fatal. Stay on
        established paths near cliff edges. Black bears are uncommon near {townName} but present
        in the Beartooth Wilderness; carry bear spray on mountain hikes. Grizzly bears inhabit
        the Absaroka-Beartooth Wilderness — full bear precautions are essential. Dehydration is a
        real risk in {townName}'s hot, dry summers; carry more water than you think you need on
        every hike. Cell service is reliable on the Rimrocks and city trails but absent in the
        Beartooth backcountry.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
