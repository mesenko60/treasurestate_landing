import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  fishingAccess: RecPlace[];
  rivers: RecPlace[];
  lakes: RecPlace[];
};

export default function Fishing({ townName, slug, fishingAccess, rivers, lakes }: Props) {
  const nearLakes = lakes.slice(0, 12);

  return (
    <article className="content-section">
      <p>
        {townName} is one of the great fly-fishing destinations in North America{'\u2014'}a gateway
        town where the Madison River, Yellowstone Park waters, Hebgen Lake, and dozens of mountain
        streams converge within easy reach of a single base camp. The Madison River, flowing north
        from its origin at the confluence of the Firehole and Gibbon Rivers inside Yellowstone, is
        one of the most celebrated trout rivers in the world and runs just minutes from town.
        Hebgen Lake, a 12-mile-long reservoir on the Madison, offers outstanding stillwater fishing
        for brown and rainbow trout. Inside Yellowstone, the Firehole River, Gibbon River, and
        Madison River provide fishing in a setting of erupting geysers and steaming thermal
        features found nowhere else on earth. With {fishingAccess.length} FWP fishing access
        {fishingAccess.length === 1 ? ' site' : ' sites'} and 37 lakes within 50 miles, {townName}{' '}
        puts world-class water at your doorstep. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>37 lakes</strong> within 50 miles</li>
        <li><strong>{fishingAccess.length} FWP fishing access {fishingAccess.length === 1 ? 'site' : 'sites'}</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, Yellowstone cutthroat trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Madison River{'\u2014'}world-class dry-fly and nymph water minutes from town</li>
        <li><strong>Major stillwater:</strong> Hebgen Lake{'\u2014'}12-mile reservoir with trophy brown trout</li>
        <li><strong>Park waters:</strong> Firehole River, Gibbon River, Madison River (inside Yellowstone)</li>
        <li><strong>2 major rivers:</strong> Madison River, Yellowstone River (via park)</li>
        <li><strong>License required:</strong> Montana fishing license outside the park; Yellowstone Park fishing permit inside the park (available at{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a> and park visitor centers)</li>
      </ul>

      <h2>The Madison River</h2>

      <h3>Below Hebgen Dam to Ennis</h3>
      <p>
        The Madison River below Hebgen Dam is, by any measure, one of the finest trout rivers in
        the United States. The tailwater section immediately below the dam runs through the
        Madison Arm and into a broad valley of riffles, runs, and pools that hold extraordinary
        populations of rainbow and brown trout in the 14- to 20-inch range, with fish over 20
        inches taken regularly throughout the season. The river's consistent cold flows from
        Hebgen Lake create ideal trout habitat{'\u2014'}prolific aquatic insect populations produce
        hatches of salmonflies, golden stoneflies, caddis, pale morning duns, and blue-winged
        olives that make this classic dry-fly water from late May through November.
      </p>
      <p>
        Wade fishing is productive throughout the upper Madison, with easy access from Highway 287
        and numerous pullouts along the river corridor. Float fishing by drift boat or raft covers
        more water and accesses runs that wade anglers cannot reach. The famous{' '}
        <strong>salmonfly hatch</strong> in late June and early July is the signature event{'\u2014'}giant
        stoneflies blanketing the river, bringing the biggest trout to the surface for size-4 dry
        flies. The hatch moves upstream over several weeks, and following the front is a time-honored
        tradition among Madison River anglers.
      </p>

      <h3>Inside Yellowstone National Park</h3>
      <p>
        The Madison River originates at <strong>Madison Junction</strong> inside Yellowstone, where
        the Firehole and Gibbon Rivers merge. The park stretch of the Madison flows through broad,
        wildlife-rich meadows where bison graze along the banks and elk bed in the riverside grass.
        Fishing here requires a Yellowstone National Park fishing permit (no Montana state license
        needed inside the park). The Madison inside the park holds rainbow trout, brown trout, and
        mountain whitefish in a setting unlike any other fishery on earth.
      </p>

      <h2>The Firehole River</h2>
      <p>
        The <strong>Firehole River</strong>{'\u2014'}flowing through Yellowstone's Upper, Midway,
        and Lower Geyser Basins{'\u2014'}is one of the most unique fisheries in the world. You
        cast to rising trout while geysers erupt and steam vents hiss in the background. The
        Firehole's geothermally heated water keeps it warmer than surrounding streams, producing
        early-season hatches that start weeks before other park waters. Brown trout, rainbow trout,
        and brook trout inhabit the Firehole, with fish feeding on prolific hatches of mayflies
        and caddis. The river can become too warm for trout by mid-July in hot summers, pushing
        the best fishing to June and September{'\u2013'}October. The Firehole is accessed from the
        park road south of Madison Junction, approximately 10{'\u2013'}16 miles from {townName} via
        the West Entrance.
      </p>

      <h2>Hebgen Lake</h2>
      <p>
        <strong>Hebgen Lake</strong>, a 12-mile-long reservoir on the Madison River northwest of
        {townName}, is one of Montana's premier stillwater trout fisheries. The lake holds large
        brown trout{'\u2014'}fish over 5 pounds are not uncommon, and trophy browns exceeding 10
        pounds are taken each season{'\u2014'}along with healthy populations of rainbow trout and
        Utah chub. The lake's extensive shallows, weed beds, and tributary inflows create diverse
        feeding opportunities that grow trout to impressive sizes.
      </p>
      <p>
        Float-tube and small-boat fishing are the primary methods. The <strong>gulper
        hatch</strong>{'\u2014'}a late-summer phenomenon when Callibaetis mayflies bring large trout
        to the surface in shallow bays{'\u2014'}is a Hebgen Lake signature event that draws anglers
        from across the region. The lake's north shore, the Madison Arm, and the Grayling Arm
        all offer productive fishing with boat access from multiple launch points. Hebgen Lake
        sits at approximately 6,500 feet and freezes in winter; ice fishing for trout is popular
        from December through March.
      </p>

      {nearLakes.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Lake</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {nearLakes.map(l => (
              <tr key={l.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{l.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{l.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>The Rivers</h2>
      <p>
        Beyond the Madison, several outstanding rivers lie within reach of {townName}. The{' '}
        <strong>Gallatin River</strong> (30 miles north via Highway 191) runs through the
        dramatic Gallatin Canyon{'\u2014'}fast, bouldery pocket water holding rainbow and brown
        trout amid the canyon walls. Wade fishing is the primary method; the river's gradient
        makes most stretches too rough for drift boats. The upper Gallatin inside Yellowstone
        holds native Yellowstone cutthroat trout in scenic meadow water.
      </p>
      <p>
        The <strong>Yellowstone River</strong> is accessible through the park, with the Hayden
        Valley and Canyon stretches offering native Yellowstone cutthroat trout fishing in a
        spectacular setting. The Yellowstone Lake tributary streams{'\u2014'}particularly Pelican
        Creek and the Yellowstone River above the lake{'\u2014'}provide important native cutthroat
        habitat, though some waters have seasonal closures to protect spawning fish and bear
        activity areas.
      </p>
      {rivers.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>River</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {rivers.map(r => (
              <tr key={r.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{r.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{r.distMiles === 0 ? 'Through town' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Fishing Access Sites</h2>
      <p>
        {townName} has {fishingAccess.length} FWP fishing access{' '}
        {fishingAccess.length === 1 ? 'site' : 'sites'} within 50 miles. Given the town's small
        size and the dominance of national park and national forest land, formal FWP access sites
        are fewer here than in towns on larger river corridors. However, the Madison River's Highway
        287 corridor provides numerous informal pullouts and access points, and Hebgen Lake has
        multiple developed boat launches. Inside Yellowstone, fishing access is managed by the
        National Park Service and is generally available wherever the road meets fishable water,
        subject to seasonal closures for wildlife management.
      </p>
      {fishingAccess.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Access Site</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {fishingAccess.map(f => (
              <tr key={f.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{f.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{f.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> The Madison below Hebgen Dam fishes well through
        spring as the tailwater section remains clear even when other rivers run high with snowmelt.
        Inside Yellowstone, the Firehole River starts fishing earliest{'\u2014'}its geothermally heated
        water produces hatches by mid-April. Most park waters remain closed or snow-locked through
        May. Hebgen Lake ice-out typically occurs in late April to mid-May, after which the lake
        begins fishing well for cruising trout in the shallows.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak season. The salmonfly hatch on the
        Madison arrives in late June to early July, drawing anglers from around the world. After
        the salmonflies, golden stoneflies, caddis, and pale morning duns sustain excellent
        dry-fly fishing through August. Hebgen Lake's gulper hatch peaks in late July and August.
        The Firehole can become too warm for productive fishing by mid-July{'\u2014'}switch to the
        Gibbon or the Madison inside the park. Yellowstone park waters are open and accessible,
        but popular stretches see heavy angling pressure during peak Yellowstone visitation.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many experienced anglers consider fall
        the best season on the Madison. Brown trout become aggressive ahead of their October
        spawning run, and streamer fishing produces the year's largest fish. Blue-winged olives
        return on overcast afternoons, and the combination of fall color, reduced crowds, and
        aggressive fish makes for outstanding conditions. The Firehole River fishes beautifully
        again as water temperatures cool. The park's West Entrance typically closes to vehicles
        in early November.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> The Madison below Hebgen Dam is
        fishable through winter for dedicated anglers{'\u2014'}midges bring trout to the surface on
        warmer afternoons, and nymphing is productive even in cold conditions. Hebgen Lake offers
        ice fishing for rainbow and brown trout from December through March. Inside Yellowstone,
        winter fishing is extremely limited by access (over-snow travel only) and conditions, but
        the dedicated few who snowmobile or snowcoach to the Firehole find uncrowded, surreal
        winter fishing in a steaming, snow-covered landscape.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} is a fishing town to its core. Multiple fly shops line Canyon Street,
        carrying local patterns, providing current hatch reports, and booking guided trips on the
        Madison, Hebgen Lake, Yellowstone park waters, and the Gallatin. Guide services offer
        drift-boat and walk-and-wade trips on the Madison, float-tube and boat trips on Hebgen
        Lake, and guided park fishing excursions that handle permits and logistics. A Montana
        fishing license is required for waters outside Yellowstone (available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local shops). Inside Yellowstone, a separate Yellowstone National Park fishing
        permit is required{'\u2014'}available at park visitor centers and ranger stations. Catch-and-
        release regulations apply to many park waters, and specific rules vary by stream; check
        current regulations before fishing.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>weekend itinerary</Link>.
      </p>
    </article>
  );
}
