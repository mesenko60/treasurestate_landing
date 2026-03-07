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
        {townName} is Montana's largest city — and quietly one of its strongest fishing bases.
        The <Link href="/planners/fly-fishing-rivers#yellowstone-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Yellowstone River</Link>, Montana's longest undammed river, flows directly through the
        {townName} metro area, carrying brown trout, smallmouth bass, channel catfish, and
        sauger through a corridor of cottonwood-lined banks and sandstone bluffs. But the
        headline fishery lies 41 miles south: the <strong>Bighorn River</strong> below Yellowtail
        Dam is a world-class tailwater holding 5,000 or more trout per mile — rivaling the
        legendary Missouri at Craig and drawing fly anglers from around the globe. Add the
        Stillwater River's freestone mountain water, 8 FWP fishing access sites within 30 miles,
        and Lake Elmo's urban stocked fishery two miles from
        downtown, and {townName} offers fishing diversity that few Montana cities can match. For Montana's fly fishing heritage and river guides, see our <Link href="/planners/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link>. For
        the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>8 FWP fishing access sites</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Brown trout, rainbow trout, smallmouth bass, channel catfish, sauger, walleye, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Bighorn River tailwater (41 mi) — 5,000+ trout per mile</li>
        <li><strong>Through-town river:</strong> Yellowstone River — Montana's longest free-flowing river</li>
        <li><strong>Closest fishing:</strong> East Bridge FWP access, 1 mile from downtown</li>
        <li><strong>Urban lake:</strong> Lake Elmo State Park, 2 miles (stocked)</li>
        <li><strong>Mountain stream:</strong> Stillwater River, 52 miles — classic freestone trout water</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Bighorn River</h2>
      <p>
        The Bighorn River below Yellowtail Dam is {townName}'s — and arguably Montana's — most
        productive trout fishery. This tailwater, centered around the town of Fort Smith 41 miles
        south, consistently holds 5,000 or more trout per mile, with rainbow and brown trout
        averaging 15 to 18 inches and fish over 20 inches caught routinely. The dam-controlled
        releases maintain cold, stable water temperatures year-round, fueling dense aquatic insect
        populations that make the Bighorn one of the finest dry-fly rivers in the American West.
        Hatches of pale morning duns, caddis, blue-winged olives, and midges produce reliable
        surface feeding across a season that runs virtually all year.
      </p>
      <p>
        Most anglers fish the Bighorn from drift boats, floating the 13-mile stretch from
        Afterbay Dam to the Bighorn fishing access. Wade fishing is excellent at multiple access
        points — the river is wide, relatively flat-bottomed, and wadeable in many areas during
        normal flows. The Bighorn's consistency is its greatest asset: unlike freestone rivers that
        blow out in spring runoff, the tailwater fishes productively 12 months a year. Guide
        services based in Fort Smith and {townName} run daily float trips. The drive from
        {townName} to Fort Smith takes about 50 minutes — close enough for a dawn-to-dusk day
        trip with a full day on the water.
      </p>

      <h2>The Yellowstone River</h2>
      <p>
        The Yellowstone River is the longest undammed river in the lower 48 states, and it flows
        directly through the {townName} metro area — a rare opportunity to fish a major Western
        river within city limits. The Yellowstone near {townName} is big water: wide, braided, and
        powerful, with gravel bars, side channels, and cottonwood-shaded banks that hold fish. The
        species mix here reflects the river's transition from mountain stream to prairie river:
        brown trout inhabit the cooler upstream sections, while smallmouth bass, channel catfish,
        sauger, and walleye become more prominent through the {townName} reach. Mountain whitefish
        are abundant throughout.
      </p>
      <p>
        FWP access sites line the Yellowstone corridor near {townName}, with East Bridge (1 mile),
        South Hills (3 miles), and Duck Creek Bridge (10 miles) providing convenient launch points
        for wade fishing and float trips. The river fishes differently than the tailwaters — flows
        vary with the seasons, and the best fishing often comes after spring runoff subsides in
        late June, with prime conditions extending through October. Streamer fishing for brown
        trout in fall is outstanding, and smallmouth bass fishing on warm summer evenings offers
        fast action on lighter tackle. The Yellowstone through {townName} is honest, unpretentious
        water — it won't appear on magazine covers, but it's right there, flowing through the
        city, fishable on a lunch break.
      </p>

      <h2>Mountain Streams</h2>

      <h3>Stillwater River</h3>
      <p>
        The Stillwater River (52 miles southwest) is a classic freestone mountain stream draining
        the Absaroka-Beartooth Wilderness — cold, clear water tumbling over cobble and boulders
        through a forested canyon. Rainbow and brown trout hold in the pocket water, runs, and
        pools, with fish typically in the 10- to 16-inch range and occasional larger fish in
        deeper pools. The Stillwater is beautiful water to wade — less crowded than the Bighorn
        and offering a mountain stream experience that the tailwater can't replicate. Access is
        good along the road paralleling the river south of Columbus.
      </p>

      <h3>Musselshell River</h3>
      <p>
        The Musselshell River (49 miles north) is a smaller prairie river winding through
        agricultural country north of {townName}. It offers a quieter, more solitary fishing
        experience than the Yellowstone or Bighorn — brown trout, smallmouth bass, and channel
        catfish inhabit the deeper pools and undercut banks. Flows can be low in late summer, but
        spring and early summer fishing can be surprisingly productive. It's a river for anglers
        who prefer solitude over trophy fish.
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

      <h2>Lakes</h2>

      <h3>Lake Elmo State Park</h3>
      <p>
        Lake Elmo State Park (2 miles from downtown) is {townName}'s urban fishing hole — a
        64-acre lake stocked by Montana FWP with rainbow trout and channel catfish. It's an
        accessible, family-friendly fishery with shore access around the lake and a gentle walking
        trail encircling the water. The park is popular for evening fishing after work and
        weekend outings with kids. No motors are allowed, making it quiet water for float-tube
        fly fishing. While it won't compete with the Bighorn for quality, Lake Elmo puts a rod
        in your hand within minutes of downtown.
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

      <h2>Fishing Access Sites</h2>
      <p>
        {townName} has 8 FWP-designated fishing access sites within 30 miles. Most of these
        line the Yellowstone River corridor, providing
        boat ramps, shore access, and wade-fishing entry points at regular intervals upstream
        and downstream of the city. The closest sites — East Bridge (1 mile), South Hills
        (3 miles), and Duck Creek Bridge (10 miles) — put anglers on the Yellowstone within
        minutes of downtown. Further out, Buffalo Mirage (21 miles), Gritty Stone (21 miles),
        Homestead Isle (22 miles), Voyagers Rest (23 miles), and Bundy Bridge (27 miles)
        access excellent stretches of the Yellowstone through agricultural and canyon country.
        This density of public access is a genuine advantage — you can fish a different stretch
        of river every day for weeks without repeating.
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
        <strong>Spring (March–May):</strong> The Bighorn tailwater fishes well year-round, but
        spring brings increasing insect activity — blue-winged olives and midges produce surface
        feeding from March onward. The Yellowstone River runs high and muddy with spring runoff
        from April through mid-June, making it largely unfishable during peak flows. Lake Elmo
        is stocked in spring and offers easy early-season fishing. The Stillwater River runs high
        with snowmelt but clears earlier than the Yellowstone.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season across most waters. The Yellowstone
        drops and clears by late June, opening excellent wade and float fishing. Bighorn River
        hatches peak with pale morning duns and caddis in June and July — this is the Bighorn at
        its finest. Smallmouth bass fishing on the Yellowstone picks up as water warms in July
        and August. Lake Elmo fishes best in early morning and evening as summer temperatures
        climb. {townName}'s hot summers (regularly mid-90s°F) push afternoon water temperatures
        up on the Yellowstone — fish early and late.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many anglers consider fall the best season
        near {townName}. Brown trout become aggressive before their October–November spawn, and
        streamer fishing on both the Yellowstone and Bighorn produces the year's largest fish.
        Blue-winged olive hatches return on overcast autumn afternoons. The Yellowstone fishes
        at its best with low, clear flows and cooler water temperatures. Stillwater River fall
        colors make for a beautiful day on the water. Fewer anglers on all waters.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Bighorn tailwater is the winter
        workhorse — stable dam releases keep the water fishable year-round, and midge hatches
        on warmer winter afternoons can bring trout to the surface. The Yellowstone near
        {townName} remains open but fishes slowly in cold water; whitefish are the most
        cooperative winter quarry. Lake Elmo freezes and supports ice fishing for trout and
        catfish. The Bighorn's winter consistency is a major draw — when most Montana rivers
        are frozen or marginal, the Bighorn is fishing at 5,000 trout per mile.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has fly shops and outfitters serving both the local Yellowstone River fishery
        and the Bighorn tailwater — several {townName}-based guide services run daily trips to
        Fort Smith. Additional outfitters and fly shops in Fort Smith serve the Bighorn directly.
        For Yellowstone River conditions, local shops are the best source for flow reports,
        hatch updates, and access conditions. A Montana fishing license is required for anyone
        12 and older; licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. The Crow Reservation borders the Bighorn River —
        a tribal fishing permit is required for fishing on reservation waters; check current
        regulations before your trip.
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
