import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  fishingAccess: RecPlace[];
  rivers: RecPlace[];
  lakes: RecPlace[];
};

const tableStyle = { width: '100%' as const, borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const thStyle = { padding: '0.5rem' };
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' };
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

function fixAccessName(name: string): string {
  return name
    .replace(/Reservior/g, 'Reservoir')
    .replace(/Acess/g, 'Access');
}

export default function Fishing({ townName, slug, fishingAccess, rivers, lakes }: Props) {
  const sortedAccess = [...fishingAccess].sort((a, b) => a.distMiles - b.distMiles);
  const sortedRivers = [...rivers].sort((a, b) => a.distMiles - b.distMiles);
  const sortedLakes = [...lakes].sort((a, b) => a.distMiles - b.distMiles);
  const nearLakes = sortedLakes.slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits on the southern shore of Flathead Lake — the largest natural freshwater
        lake west of the Mississippi — making it one of Montana's premier fishing destinations.
        Flathead Lake covers roughly 200 square miles with depths reaching 370 feet, producing
        trophy lake trout that regularly exceed 30 pounds. Beyond the lake, 13 public fishing
        access sites and 80 lakes lie within 50 miles, along with the Flathead River system below
        Seli'š Ksanka Qlispe' Dam. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>13 fishing access sites</strong> within 50 miles</li>
        <li><strong>80 lakes</strong> within 50 miles</li>
        <li><strong>3 rivers</strong> within driving distance</li>
        <li><strong>Primary species:</strong> Lake trout (mackinaw), yellow perch, lake whitefish, bull trout (C&R only), rainbow trout, kokanee salmon</li>
        <li><strong>Closest lake:</strong> Pablo Reservoir, 4 miles (tribal permit required)</li>
        <li><strong>Flathead Lake:</strong> 13 miles — trophy lake trout, yellow perch, lake whitefish</li>
        <li><strong>Closest river:</strong> Swan River, 19 miles</li>
        <li><strong>Bull trout:</strong> Catch-and-release only — threatened species, strictly enforced</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
        <li><strong>Reservation waters:</strong> CSKT tribal recreation permit required for Pablo Reservoir and other reservation lakes</li>
      </ul>

      <h2>Flathead Lake</h2>
      <p>
        Flathead Lake is the centerpiece of fishing near {townName} and the reason many anglers
        make the trip. At roughly 200 square miles with depths reaching 370 feet, it's an inland
        sea that produces fish to match. {townName}'s position on the south shore puts anglers
        within minutes of productive water.
      </p>

      <h3>Lake Trout (Mackinaw)</h3>
      <p>
        Lake trout are the premier target on Flathead Lake. Fish commonly reach 20 pounds, and
        trophies exceeding 30 pounds are caught every season. Lake trout are actually non-native
        to Flathead Lake and threaten native bull trout populations, so Fish, Wildlife & Parks
        encourages liberal harvest — there is no daily limit on lake trout. Trolling with
        downriggers is the standard method, working depths of 80 to 150 feet during summer. In
        spring (immediately after ice-off) and fall, mackinaw move shallow and can be taken on
        jigs and spoons near rocky structure.
      </p>

      <h3>Yellow Perch</h3>
      <p>
        Flathead Lake supports an excellent yellow perch fishery that's popular with families
        and shore anglers. Perch are found in bays and along weed lines, particularly on the
        south and east shores near {townName}. They're active year-round and provide some of the
        best ice fishing on the smaller bays and connected sloughs during winter. Small jigs
        tipped with worms or maggots are the standard approach.
      </p>

      <h3>Lake Whitefish</h3>
      <p>
        Lake whitefish are abundant in Flathead Lake and significantly underutilized by anglers.
        They fight well on light tackle, grow to respectable sizes, and are excellent table fare.
        Whitefish are caught incidentally by perch anglers or targeted with small nymphs and
        maggots fished near bottom. They're an outstanding option for anglers seeking consistent
        action without the crowds that lake trout attract.
      </p>

      <h3>Bull Trout</h3>
      <p>
        Bull trout inhabit Flathead Lake and its tributaries but are strictly catch-and-release.
        They are a threatened species under the Endangered Species Act, and regulations are
        enforced vigorously. Learn to identify bull trout — they lack the dark spots on a light
        background that lake trout display, instead showing light spots on a dark background
        with a broad, flat head. If you catch one, minimize handling time and release it in the
        water.
      </p>

      <h2>The Rivers</h2>

      <h3>Flathead River</h3>
      <p>
        The Flathead River below Seli'š Ksanka Qlispe' Dam (formerly Kerr Dam), about 28 miles
        from {townName}, is excellent trout water. The dam-controlled flows create a tailwater
        effect that supports healthy populations of rainbow trout, mountain whitefish, and some
        brown trout. The river offers both wading and float fishing opportunities, with nymph
        and dry-fly fishing productive depending on the season. Several fishing access sites
        provide public entry points along the lower river.
      </p>

      <h3>Swan River</h3>
      <p>
        The Swan River, 19 miles northeast of {townName}, flows through the scenic Swan Valley
        between the Mission Mountains and the Swan Range. It holds native westslope cutthroat
        trout and bull trout (catch-and-release only) in clear, cold water. The Swan is a
        rewarding destination for anglers seeking solitude and native fish in a stunning mountain
        setting. Access is available at several bridge crossings and the Swan Lake Boat Launch.
      </p>
      {sortedRivers.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>River</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {sortedRivers.map(r => (
              <tr key={r.name} style={rowStyle}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdRightStyle}>{r.distMiles === 0 ? 'Through town' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Lake Mary Ronan</h2>
      <p>
        Lake Mary Ronan, 17 miles northwest of {townName}, is one of western Montana's most
        popular mixed fisheries. The 1,500-acre lake supports kokanee salmon, largemouth bass,
        yellow perch, and rainbow trout — an unusually diverse species mix for a Montana lake.
        Kokanee fishing is best from midsummer through early fall when schools concentrate near
        the surface at dawn and dusk. Largemouth bass fishing is productive in the weedy
        shallows during warm months. A state park campground on the shore makes it an excellent
        overnight fishing destination.
      </p>

      <h2>Reservation Fishing — Tribal Permit Required</h2>
      <p>
        Several waters near {townName} lie within the Flathead Indian Reservation, managed by the
        Confederated Salish and Kootenai Tribes (CSKT). These include Pablo Reservoir (4 miles),
        Hellroaring Reservoir (7 miles), and numerous other reservation lakes. A <strong>CSKT
        tribal recreation permit</strong> is required to fish these waters — a Montana state fishing
        license alone is not sufficient. Tribal permits are available at local businesses in{' '}
        {townName} and online through the CSKT Division of Fish, Wildlife, Recreation & Conservation.
        Regulations on reservation waters differ from state regulations, so check CSKT rules before
        fishing.
      </p>

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains 13 public fishing access sites within 50 miles
        of {townName}. These provide parking, boat launch facilities, and shore access to Flathead
        Lake, the Flathead River, and surrounding waters.
      </p>
      {sortedAccess.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>Access Site</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccess.map(f => (
              <tr key={f.name} style={rowStyle}>
                <td style={tdStyle}>{fixAccessName(f.name)}</td>
                <td style={tdRightStyle}>{f.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Lakes Near {townName}</h2>
      <p>
        Beyond Flathead Lake, 80 lakes lie within 50 miles of {townName}. Pablo Reservoir and
        Hellroaring Reservoir are the closest options (4 and 7 miles respectively, tribal permit
        required). Flathead Lake, Lower Crow Reservoir, and numerous mountain lakes in the Mission
        Mountains and Swan Range offer additional variety. Many of the smaller alpine lakes hold
        cutthroat trout reachable only by trail — rewarding anglers who are willing to hike for
        uncrowded water in stunning mountain settings.
      </p>
      {nearLakes.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>Lake</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {nearLakes.map(l => (
              <tr key={l.name} style={rowStyle}>
                <td style={tdStyle}>{l.name}</td>
                <td style={tdRightStyle}>{l.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {lakes.length > nearLakes.length && (
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
          +{lakes.length - nearLakes.length} more lakes within 50 miles.
        </p>
      )}

      <h2>Ice Fishing</h2>
      <p>
        Ice fishing is popular near {townName} from December through March. Flathead Lake itself
        rarely freezes completely due to its enormous size and depth, but sheltered bays on the
        south end can form fishable ice in cold winters — always check ice conditions carefully.
        Smaller lakes and reservoirs are more reliable for ice fishing. Pablo Reservoir, Lower
        Crow Reservoir, and Lake Mary Ronan are popular ice destinations with yellow perch, rainbow
        trout, and kokanee as primary targets. Simple setups with jigs tipped with wax worms or
        maggots work well for perch through the ice.
      </p>

      <h2>Species Guide</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={headRowStyle}>
            <th style={thStyle}>Species</th>
            <th style={thStyle}>Where</th>
            <th style={thStyle}>Best Season</th>
            <th style={thStyle}>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr style={rowStyle}>
            <td style={tdStyle}>Lake trout (mackinaw)</td>
            <td style={tdStyle}>Flathead Lake</td>
            <td style={tdStyle}>Spring, fall</td>
            <td style={tdStyle}>No limit — harvest encouraged (non-native)</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Yellow perch</td>
            <td style={tdStyle}>Flathead Lake, reservation lakes</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Excellent for families and ice fishing</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Lake whitefish</td>
            <td style={tdStyle}>Flathead Lake</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Abundant, underutilized, great table fare</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Bull trout</td>
            <td style={tdStyle}>Flathead Lake, Swan River</td>
            <td style={tdStyle}>—</td>
            <td style={tdStyle}>Catch-and-release ONLY — threatened species</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Flathead River, reservation lakes</td>
            <td style={tdStyle}>Spring–fall</td>
            <td style={tdStyle}>Good populations below the dam</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Kokanee salmon</td>
            <td style={tdStyle}>Lake Mary Ronan</td>
            <td style={tdStyle}>Summer–early fall</td>
            <td style={tdStyle}>Best at dawn and dusk near surface</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Largemouth bass</td>
            <td style={tdStyle}>Lake Mary Ronan</td>
            <td style={tdStyle}>Summer</td>
            <td style={tdStyle}>Weedy shallows, topwater productive</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Westslope cutthroat</td>
            <td style={tdStyle}>Swan River, mountain lakes</td>
            <td style={tdStyle}>Summer</td>
            <td style={tdStyle}>Native species — handle with care</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March–May):</strong> Ice-off on Flathead Lake typically occurs in late
        March to early April — one of the best times for trophy lake trout, as mackinaw feed
        aggressively in shallow water near rocky points and drop-offs. Jigging and casting spoons
        are effective before fish move deep. Smaller lakes ice off through April, offering early
        season trout and perch fishing. The Flathead River below the dam fishes well with nymphs
        as water temperatures rise.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season across all waters. Lake trout on
        Flathead Lake move deep (80–150 feet) as surface temperatures rise, requiring downriggers
        or lead-core line for trolling. Yellow perch and whitefish remain active at moderate
        depths. Lake Mary Ronan kokanee fishing peaks in July and August. The Flathead River
        offers good dry-fly fishing with caddis and attractor patterns. Reservation lakes fish
        well for stocked trout.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Lake trout move shallow again on Flathead
        Lake as water temperatures drop, and the fall spawning run concentrates fish along rocky
        shoals — excellent opportunity for shore-based and jigging anglers. Yellow perch fishing
        picks up as fish school for winter. Bull trout stage in tributaries ahead of spawning —
        admire them but release carefully. Lake Mary Ronan kokanee make their final push.
      </p>
      <p>
        <strong>Winter (December–February):</strong> Ice fishing on reservation lakes, Lake Mary
        Ronan, and sheltered bays of Flathead Lake is a local tradition. Yellow perch and
        rainbow trout are primary ice targets. Flathead Lake's open water allows year-round
        trolling for lake trout. The Flathead River below the dam remains fishable with nymphs
        and streamers on warmer afternoons.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has tackle shops and outfitters serving anglers headed to Flathead Lake and
        surrounding waters. A Montana fishing license is required for anyone 12 and older —
        available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. A separate CSKT tribal recreation permit is
        required for reservation waters. Bull trout regulations are strict and vary by water —
        check current FWP regulations before fishing any water near {townName}.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link>.
      </p>
    </article>
  );
}
