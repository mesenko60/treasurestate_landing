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
        {townName} sits at 2,365 feet on the open prairie of southeastern Montana, where the
        Tongue River flows into the Yellowstone River and the landscape stretches flat to the
        horizon in nearly every direction. This is not mountain country{'\u2014'}there are no alpine
        trailheads within 30 miles, no wilderness areas on the doorstep, and no ski resorts over
        the next ridge. What {townName} offers instead is a different kind of outdoor experience:
        river corridors lined with cottonwoods, prairie walks through sagebrush and grassland,
        island state parks, world-class bird watching, and some of the best hunting country in
        North America. The recreation around {townName} rewards those who appreciate wide-open
        spaces, big skies, and solitude rather than summit scrambles. For the full city
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>7 recreation sites</strong> within 30 miles</li>
        <li><strong>1 state park:</strong> Pirogue Island State Park (in town)</li>
        <li><strong>2 wildlife refuges</strong> within range</li>
        <li><strong>Primary rivers:</strong> Yellowstone River (through town), Tongue River (through town)</li>
        <li><strong>Landscape:</strong> Prairie grassland, river bottomland, badlands, coulees</li>
        <li><strong>Nearest mountain hiking:</strong> Bull Mountains (~80 mi west), Bighorn Mountains (~120 mi south in WY)</li>
        <li><strong>Nearest badlands park:</strong> Makoshika State Park in Glendive (135 mi east on I-94)</li>
        <li><strong>Best for:</strong> River walks, bird watching, hunting, prairie exploration, fishing access</li>
        <li><strong>Wildlife:</strong> Whitetail deer, mule deer, pronghorn antelope, wild turkeys, pheasants, sharp-tailed grouse, bald eagles, great blue herons</li>
      </ul>

      <h2>Pirogue Island State Park</h2>
      <p>
        Pirogue Island State Park is {townName}{'\u2019'}s closest dedicated outdoor recreation area{'\u2014'}a
        cottonwood-shaded island and riverside park on the Yellowstone River accessible from the
        east side of town. The park occupies a stretch of river bottomland with walking paths
        through mature cottonwood groves, open meadows, and riverbank habitat. It{'\u2019'}s not a
        wilderness experience, but it{'\u2019'}s a genuinely pleasant place to walk, picnic, fish from
        the bank, or watch wildlife along the river. Great blue herons, bald eagles, white
        pelicans, and kingfishers are regular visitors, and deer browse the cottonwood bottoms
        year-round.
      </p>
      <p>
        The park{'\u2019'}s flat, accessible terrain makes it suitable for families, dog walkers, and
        anyone looking for an easy riverside outing without driving. In summer, the cottonwood
        canopy provides welcome shade when prairie temperatures climb into the upper 80s and 90s.
        In fall, the cottonwoods turn gold against the wide blue sky{'\u2014'}one of eastern Montana{'\u2019'}s
        quieter but genuinely beautiful seasonal moments.
      </p>

      <h2>Yellowstone River Corridor</h2>
      <p>
        The Yellowstone River{'\u2014'}the longest free-flowing river in the contiguous United
        States{'\u2014'}passes directly through {townName}, and its corridor is the primary outdoor
        recreation spine of the area. River walks along the banks, informal trails through
        cottonwood bottomlands, and fishing access sites provide miles of accessible terrain
        for walking, jogging, and wildlife observation. The river corridor is especially
        rewarding for birders: bald eagles nest along the Yellowstone year-round, and spring
        and fall migrations bring waves of waterfowl, shorebirds, and songbirds through the
        riparian habitat.
      </p>
      <p>
        Floating the Yellowstone by canoe, kayak, or drift boat is a popular warm-season
        activity. The river through the {townName} area is broad, relatively slow, and
        manageable for intermediate paddlers, offering a different experience from the faster
        mountain reaches upstream near Livingston. Multi-day float trips downstream toward
        Glendive and the North Dakota border traverse some of the most remote, undeveloped
        river corridor in the Lower 48{'\u2014'}a prairie wilderness experience that few people
        know about.
      </p>

      <h2>Tongue River</h2>
      <p>
        The Tongue River enters {townName} from the south, flowing through a scenic
        cottonwood-lined valley before joining the Yellowstone at the edge of town. The Tongue
        River corridor offers walking paths, fishing access, and a riparian habitat that
        contrasts with the surrounding dry prairie. The river is smaller and more intimate than
        the Yellowstone, with shaded banks, shallow riffles, and quiet pools that make for
        pleasant riverside walks.
      </p>
      <p>
        South of {townName}, the Tongue River valley extends through ranch country toward the
        Northern Cheyenne Indian Reservation and the Tongue River Reservoir State Park (70 miles
        south). The reservoir is a popular destination for boating, camping, and warm-water
        fishing{'\u2014'}a worthwhile day trip from {townName} during summer months.
      </p>

      <h2>Prairie Recreation & Hunting</h2>
      <p>
        The open prairie surrounding {townName} may look empty to the uninitiated, but it supports
        some of the richest hunting and wildlife viewing in Montana. Custer County is premier
        country for mule deer, whitetail deer, pronghorn antelope, wild turkeys, pheasants,
        sharp-tailed grouse, and Hungarian partridge. Public land managed by the Bureau of Land
        Management (BLM) provides access to thousands of acres of prairie for hunting, hiking,
        and exploration{'\u2014'}though access points can require local knowledge and detailed maps.
      </p>
      <p>
        For walkers and nature observers, the prairie offers a landscape that rewards patience
        and attention. Spring brings wildflowers to the grasslands, prairie dog towns buzz with
        activity (and attract raptors), and the coulees and breaks that cut through the prairie
        create surprisingly varied terrain. The badlands formations along the Yellowstone east
        of {townName} hint at the dramatic geology found at Makoshika State Park near Glendive
        (135 miles east){'\u2014'}Montana{'\u2019'}s largest state park, featuring dinosaur fossils, eroded
        sandstone formations, and hiking trails through painted badlands.
      </p>

      {trails.length > 0 && (
        <>
          <h2>Nearby Trails</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Trail / Site</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {trails.slice(0, 10).map(t => (
                <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{t.name}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
        <strong>Spring (March{'\u2013'}May):</strong> The prairie greens up by April, and wildflowers
        appear through May. River corridors can be muddy during spring runoff, but the
        cottonwood bottoms are alive with returning songbirds and nesting raptors. Spring is
        excellent for bird watching along the Yellowstone and Tongue rivers. Temperatures warm
        quickly{'\u2014'}expect 50s to 70s{'\u00B0'}F by May. Wind can be strong and persistent.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Hot and dry, with July highs averaging 89{'\u00B0'}F
        and occasional days above 100{'\u00B0'}F. Start outdoor activities early in the morning{'\u2014'}by
        midday, the open prairie offers no shade and temperatures can be punishing. The rivers
        provide relief{'\u2014'}swimming, wading, and floating are popular. Cottonwood shade along
        Pirogue Island and the river corridors makes these the most comfortable walking spots.
        Afternoon thunderstorms build occasionally but rarely last long.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many locals consider fall the best
        outdoor season around {townName}. Temperatures moderate to pleasant 60s and 70s{'\u00B0'}F,
        cottonwoods blaze gold along the rivers, and hunting season draws thousands to the
        surrounding prairie. Upland bird hunting (pheasant, sharp-tailed grouse, Hungarian
        partridge) is a major draw, and big-game seasons for deer, antelope, and elk bring
        hunters from across the state and beyond. Wear blaze orange on public land from October
        onward.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> Cold but manageable{'\u2014'}January averages
        36{'\u00B0'}F for highs and 18{'\u00B0'}F for lows, with occasional Arctic cold snaps pushing well
        below zero. Snowfall is modest compared to mountain areas, and the prairie is often
        windswept and bare. River walks remain accessible on most winter days, and the stark
        beauty of the winter prairie{'\u2014'}bald eagles perched in bare cottonwoods, mule deer in
        the river breaks{'\u2014'}rewards those willing to bundle up.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area presents different hazards than mountain country. <strong>Heat</strong>{' '}
        is the primary summer concern{'\u2014'}carry water on any walk, start early, and watch for heat
        exhaustion on exposed prairie terrain. <strong>Rattlesnakes</strong> are present in the
        coulees and rocky breaks surrounding town; watch where you step and sit, especially in
        warm months. <strong>Ticks</strong> are common in spring in the river bottoms and
        grasslands. The rivers themselves demand respect{'\u2014'}the Yellowstone is wide and powerful,
        with strong currents and cold water even in summer. Cell service is reliable in town
        but drops off quickly on the surrounding prairie; carry a map and let someone know your
        plans if venturing onto BLM land.
      </p>
      <p>
        For water-based recreation, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
