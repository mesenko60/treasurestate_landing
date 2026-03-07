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
        {townName} sits at the doorstep of one of the finest trout fisheries in North America.
        The Missouri River below Holter Dam — just 32 miles north at the town of Craig — is a
        world-class tailwater carrying over 4,000 trout per mile, drawing fly anglers from
        around the globe. But the Missouri is only the headline. Canyon Ferry, Hauser, and
        Holter lakes form a chain of Missouri River impoundments within 20 miles, Spring Meadow
        Lake offers catch-and-release trout fishing two miles from the capitol building, and the
        permit-only Smith River float is one of Montana's most coveted angling experiences. With
        10 lakes within 30 miles and multiple blue-ribbon rivers within reach, {townName} is among the strongest
        fishing bases in the state. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>10 lakes</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, walleye, yellow perch, kokanee salmon, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Missouri River tailwater at Craig (32 mi) — 4,000+ trout per mile</li>
        <li><strong>Closest lake:</strong> Spring Meadow Lake, 2 miles (catch-and-release)</li>
        <li><strong>Closest reservoir:</strong> Hauser Lake, 11 miles</li>
        <li><strong>Permit-only float:</strong> Smith River (47 mi) — lottery system for float permits</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Missouri River Tailwater</h2>

      <h3>Craig &amp; the Canyon</h3>
      <p>
        The Missouri River below Holter Dam is the defining fishery of {townName} and one of
        the premier trout streams in the United States. The 35-mile tailwater stretch from
        Holter Dam downstream through the town of Craig consistently holds 4,000 to 5,000
        trout per mile — predominantly rainbow and brown trout in the 14- to 20-inch range,
        with fish over 20 inches taken regularly. The dam-regulated flows maintain cold, stable
        water temperatures year-round, creating a fertile environment for aquatic insects and
        the trout that feed on them. This is dry-fly water at its finest: prolific hatches of
        pale morning duns, caddis, blue-winged olives, and tricos produce surface feeding
        from April through November.
      </p>
      <p>
        Most anglers fish the Missouri from drift boats, floating the classic sections between
        Holter Dam and the town of Cascade. Wade fishing is productive at several access
        points, particularly near Craig and at the Dearborn River confluence. The river is wide
        and wadeable in many places during normal flows, though felt-soled or studded wading
        boots are essential on the slippery cobble bottom. Guide services based in Craig and
        {townName} offer full-day float trips year-round — the Missouri fishes well even in
        winter, with midges bringing trout to the surface on warmer afternoons.
      </p>

      <h2>The Lakes</h2>

      <h3>Canyon Ferry Lake</h3>
      <p>
        Canyon Ferry Lake is the largest body of water near {townName} — a 35-mile-long
        reservoir on the Missouri River just 15 miles east of town. It's the most popular
        recreational lake in central Montana, drawing boaters, water-skiers, and anglers alike.
        The fishing is diverse: walleye are the primary draw, with consistent catches of
        16- to 22-inch fish throughout the reservoir. Rainbow trout run large here, with fish
        commonly exceeding 18 inches. Yellow perch are abundant and provide reliable action for
        shore anglers and families. Ice fishing on Canyon Ferry is a winter tradition —
        hundreds of ice houses dot the lake from December through March, targeting perch and
        walleye through the ice.
      </p>

      <h3>Hauser Lake</h3>
      <p>
        Hauser Lake (11 miles north) is the closest Missouri River impoundment to {townName}
        and offers excellent fishing with less recreational boat traffic than Canyon Ferry.
        Rainbow trout are the headline species, with strong populations supported by dam
        tailwater conditions. Walleye and yellow perch round out the fishery. The lake's
        relatively compact size makes it manageable for small-boat and kayak anglers. Shore
        fishing is productive at several access points along the reservoir.
      </p>

      <h3>Holter Lake</h3>
      <p>
        Holter Lake (19 miles north) sits in a dramatic canyon setting upstream of the
        legendary Craig tailwater. The lake holds rainbow trout, kokanee salmon, and walleye
        in deep, cold water flanked by towering limestone walls — the same Gates of the
        Mountains formation that awed Lewis and Clark. Trolling for kokanee in summer and
        jigging for walleye are popular techniques. The upper end of the lake transitions into
        river current, creating productive trout water where the Missouri enters the reservoir.
      </p>

      <h3>Spring Meadow Lake</h3>
      <p>
        Spring Meadow Lake State Park (2 miles from downtown) is {townName}'s urban fishing
        gem — a crystal-clear, 30-acre spring-fed lake managed as catch-and-release for trout.
        The lake's spring water maintains cold temperatures year-round, supporting healthy
        rainbow trout that test light-tackle anglers in gin-clear conditions. It's a rare
        opportunity to fish for trout on a lunch break from the state capitol. Fly fishing
        from float tubes is popular; motors are prohibited.
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
        Beyond the Missouri tailwater, several significant rivers lie within day-trip distance
        of {townName}. The <strong>Smith River</strong> (47 miles northeast) is one of
        Montana's most sought-after float-fishing experiences — a 59-mile, multi-day canyon
        float through remote limestone gorges accessible only by raft or canoe. Access is
        controlled by a competitive lottery permit system administered by Montana FWP, with
        the float season running from late May through early July. Brown trout and rainbow
        trout inhabit the river, and the canyon scenery is spectacular.
      </p>
      <p>
        The <strong>Jefferson River</strong> (53 miles south) offers a quieter alternative —
        a slower-paced river winding through agricultural bottomlands with strong populations
        of brown trout. It's less pressured than the Missouri and fishes best in late summer
        and fall when flows stabilize. The <strong>Sun River</strong> (60 miles northwest)
        drains the Bob Marshall Wilderness and holds cutthroat and rainbow trout in its upper
        reaches, with warmer-water species below Gibson Reservoir.
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
        No formal FWP fishing access sites lie within 30 miles of {townName}. However,
        boat ramps and public access points are available at
        Canyon Ferry, Hauser, and Holter lakes through Bureau of Reclamation facilities and
        county-maintained sites. The Missouri River below Holter Dam has multiple access
        points at bridge crossings and boat launches near Craig. Spring Meadow Lake State
        Park provides walk-in access within the city. Always check current access conditions,
        as water levels on the reservoirs can affect ramp usability.
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
        <strong>Spring (March–May):</strong> The Missouri tailwater fishes well from the
        moment the ice breaks. Blue-winged olive hatches begin as early as March on warmer
        afternoons, bringing trout to the surface. Mother's Day caddis hatches in mid-May are
        legendary on the Missouri — blizzard hatches of caddis flies blanket the water,
        producing some of the year's best dry-fly action. Canyon Ferry and Hauser lakes ice
        off in late March to early April, with walleye moving shallow for the spring spawn.
        Smith River float permits run from late May into July.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season across all waters. The Missouri
        tailwater's stable flows maintain excellent fishing through the warmest months — pale
        morning dun hatches in June and July provide consistent surface feeding, followed by
        tricos in July and August. Canyon Ferry walleye fishing peaks in early summer before
        fish move deep. Perch and trout remain active on all three reservoirs. Evening hatches
        on the Missouri can produce outstanding dry-fly fishing into dark. Water temperatures
        on non-tailwater rivers rise in August, shifting fish activity to early morning and
        evening.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced anglers consider fall the
        best season on the Missouri. Brown trout become aggressive ahead of their October–
        November spawning run, and streamer fishing produces some of the year's largest fish.
        Blue-winged olives return on overcast autumn afternoons — sometimes the heaviest
        hatches of the year. Canyon Ferry walleye move shallow again as water temperatures
        drop. The Jefferson River fishes at its best in early fall with lower, clearer flows.
      </p>
      <p>
        <strong>Winter (December–February):</strong> Ice fishing on Canyon Ferry Lake is a
        central Montana tradition — yellow perch and walleye are the primary targets, with
        hundreds of ice shelters dotting the lake on winter weekends. The Missouri tailwater
        remains fishable year-round; midges are the primary winter hatch, and nymphing with
        small midge patterns under an indicator is the standard technique. Warmer winter
        afternoons can bring fish to midge clusters on the surface. Hauser and Holter lakes
        offer additional ice-fishing opportunities.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} and the Craig corridor have well-established fly shops and outfitters
        serving the Missouri River fishery. Shops in Craig — the small town that serves as
        the Missouri tailwater's base camp — are the best source for current river conditions,
        hatch reports, and guide bookings. Multiple outfitters run drift-boat trips on the
        Missouri year-round. A Montana fishing license is required for anyone 12 and older;
        licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. Smith River float permits are awarded by
        lottery — applications open in February for the upcoming season; check FWP for
        current deadlines.
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
