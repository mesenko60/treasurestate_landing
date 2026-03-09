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
        {townName} sits at 3,077 feet in the Flathead Valley of northwest Montana, 17 miles
        from the west entrance of Glacier National Park and 11 miles from Hungry Horse
        Reservoir.         The <Link href="/guides/fly-fishing-rivers#flathead-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Flathead River</Link> system{'\u2014'}Middle Fork, South Fork, and
        mainstem{'\u2014'}threads through the surrounding landscape, and 26 lakes lie within 30
        miles. Westslope cutthroat trout, the native species and the star fish of the region,
        inhabit the cold streams draining Glacier{'\u2019'}s peaks and the Great Bear Wilderness.
        Hungry Horse Reservoir offers deep-water mackinaw fishing in a 34-mile-long canyon
        setting, and Whitefish Lake provides year-round opportunity just 9 miles northwest. With
        10 public fishing access sites, pristine national park waters, and ice fishing through
        winter, {townName} is a quiet basecamp for some of the finest freshwater fishing in the
        Northern Rockies. For Montana's fly fishing heritage and river guides, see our <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> and <Link href="/guides/fly-fishing-rivers#flathead-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Rivers Deep Dive</Link>. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>10 fishing access sites</strong> within 30 miles</li>
        <li><strong>26 lakes</strong> within 30 miles</li>
        <li><strong>2 major rivers</strong> within driving distance (Flathead River, Swan River)</li>
        <li><strong>Primary species:</strong> Westslope cutthroat trout, lake trout (mackinaw), mountain whitefish, northern pike, yellow perch, bull trout (C&R only), kokanee salmon</li>
        <li><strong>Star species:</strong> Westslope cutthroat trout{'\u2014'}the native trout of the Flathead drainage</li>
        <li><strong>Closest lake:</strong> Cedar Lake, 4 miles</li>
        <li><strong>Closest river access:</strong> Glacier Rim River Access, 9 miles</li>
        <li><strong>Glacier National Park:</strong> No additional fishing license needed (park pass only){'\u2014'}west entrance 17 miles east</li>
        <li><strong>Bull trout:</strong> Catch-and-release ONLY throughout the region{'\u2014'}threatened species, strictly enforced</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Flathead River System</h2>
      <p>
        The Flathead River system defines the fly fishing around {townName}. Three forks drain
        Glacier National Park and the surrounding wilderness before converging in the Flathead
        Valley, each with distinct character and opportunity.
      </p>
      <p>
        The <strong>Middle Fork</strong> of the Flathead forms Glacier National Park{'\u2019'}s
        southern boundary and is a federally designated Wild and Scenic River. It holds native
        westslope cutthroat trout and bull trout (catch-and-release only) in cold, clear water
        flowing through dramatic canyon scenery. Access is limited{'\u2014'}which keeps fishing
        pressure low and fish quality high. Float trips are the primary method, launching from
        points along US Highway 2 east of {townName}. The Middle Fork rewards anglers willing to
        work for their fish with some of the most beautiful trout water in Montana.
      </p>
      <p>
        The <strong>South Fork</strong> of the Flathead drains the Bob Marshall and Great Bear
        Wilderness areas, feeding Hungry Horse Reservoir before reaching the valley floor. Above
        the reservoir, the South Fork is remote backcountry water accessible primarily by trail or
        floatplane{'\u2014'}holding native cutthroat in pristine wilderness settings. Below the
        dam, the river offers accessible wade and float fishing for cutthroat and mountain
        whitefish.
      </p>
      <p>
        The main stem <strong>Flathead River</strong> (20 miles from {townName}) is more accessible
        than the forks, holding rainbow trout, cutthroat trout, and mountain whitefish with good
        wade access at several points. It{'\u2019'}s a solid year-round fishery, particularly
        productive during caddis hatches in summer and blue-winged olive hatches in fall.
      </p>
      <p>
        The <strong>Swan River</strong> (54 miles southeast) flows through the scenic Swan Valley
        between the Mission Mountains and the Swan Range. It holds native westslope cutthroat and
        bull trout (catch-and-release only) in clear, cold water{'\u2014'}a rewarding longer drive
        for anglers seeking solitude and native fish.
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

      <h2>Hungry Horse Reservoir</h2>
      <p>
        Hungry Horse Reservoir, 11 miles east of {townName}, is a 34-mile-long impoundment on the
        South Fork of the Flathead River backed by Hungry Horse Dam. The reservoir stretches deep
        into the mountains between the Great Bear Wilderness and the Flathead National Forest,
        offering a remote fishing experience accessible by road.
      </p>
      <p>
        <strong>Lake trout (mackinaw)</strong> are the premier target. The reservoir{'\u2019'}s cold,
        deep waters support healthy populations of mackinaw that are taken by trolling with
        downriggers or jigging over deep structure. <strong>Westslope cutthroat trout</strong> inhabit
        the reservoir and especially the tributary streams that feed it{'\u2014'}small creek mouths
        along the shoreline can produce excellent cutthroat fishing, particularly in spring and fall
        when fish stage near inflows. <strong>Bull trout</strong> are present but are strictly
        catch-and-release; they are a threatened species and regulations are enforced vigorously.
      </p>
      <p>
        The South Shore River and Reservoir Access (22 miles) and Graves Bay (24 miles) provide
        developed boat launch access. The reservoir{'\u2019'}s long, narrow shape means that a boat
        opens up miles of remote shoreline that sees very light fishing pressure compared to
        Flathead Lake or Whitefish Lake. Hungry Horse Reservoir is significantly less crowded than
        the valley{'\u2019'}s higher-profile lakes and is a local favorite for anglers seeking
        quality mackinaw fishing without the boat traffic.
      </p>

      <h2>Glacier National Park Fishing</h2>
      <p>
        Glacier National Park{'\u2019'}s waters are accessible from {townName} in under 30 minutes,
        and fishing inside the park requires only a valid park pass{'\u2014'}no additional Montana
        fishing license is needed. The park{'\u2019'}s streams and lakes hold native westslope
        cutthroat trout in some of the clearest water in the Northern Rockies, along with bull trout
        (catch-and-release only throughout the park).
      </p>
      <p>
        McDonald Creek and its tributaries near Lake McDonald offer accessible fishing close to the
        Going-to-the-Sun Road corridor. Cutthroat here are willing fish that respond well to small
        dry flies, nymphs, and light spinning tackle. Lake McDonald itself holds lake trout,
        cutthroat, and bull trout in strikingly clear water reaching depths over 400 feet. The
        smaller streams flowing into Lake McDonald{'\u2014'}Snyder Creek, Sprague Creek, and
        Avalanche Creek{'\u2014'}provide intimate small-stream fishing in old-growth forest settings.
      </p>
      <p>
        Park regulations are strict: no bait fishing with lead in most waters, barbless hooks
        recommended, and bull trout must be released immediately. Check the{' '}
        <a href="https://www.nps.gov/glac/planyourvisit/fishing.htm" target="_blank" rel="noopener noreferrer">
          NPS Glacier fishing regulations
        </a>{' '}
        before heading out. The reward for following the rules is fishing for native trout in
        some of the most stunning mountain scenery in North America.
      </p>

      <h2>Whitefish Lake</h2>
      <p>
        Whitefish Lake, 9 miles northwest of {townName}, is a 3,300-acre glacial lake with public
        access at City Beach and Whitefish Lake State Park. The lake holds healthy populations of
        lake trout (mackinaw), mountain whitefish, northern pike, and yellow perch.
      </p>
      <p>
        Pike fishing is best in the weedy shallows at the north and south ends during spring and
        early summer. Lake trout are taken by trolling at depth during the warm months and move
        shallow in spring and fall. Mountain whitefish are abundant, fight well on light tackle, and
        are excellent table fare{'\u2014'}they{'\u2019'}re often overlooked by anglers chasing trout.
        Yellow perch provide consistent action for families and are a primary ice-fishing target
        in winter. Early mornings and weekdays offer the best fishing as summer recreational boat
        traffic picks up on warm afternoons.
      </p>
      <p>
        <strong>Ice fishing</strong> on Whitefish Lake is a Flathead Valley tradition. The lake
        freezes reliably by late December, and anglers target northern pike and yellow perch through
        the ice into March. Smaller lakes near {townName}{'\u2014'}including Cedar Lake and several
        forest lakes{'\u2014'}also provide ice-fishing access with less traffic.
      </p>

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains 10 public fishing access sites within 30 miles
        of {townName}. These sites provide reliable access to the Flathead River system, Hungry
        Horse Reservoir, and surrounding lakes, with parking and, in most cases, boat launch
        facilities. Glacier Rim River Access and Blankenship Bridge (both 9 miles) are the closest
        river access points.
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
        Beyond the headline waters, 26 lakes lie within 30 miles of {townName}. Cedar Lake (4
        miles) is the closest lake to town and offers a quiet forest-lake setting for casual
        fishing. Bailey Lake and Spoon Lake (8 miles) provide secluded shoreline access in the
        Flathead National Forest. <strong>Ashley Lake</strong> (22 miles west) is a 3,200-acre
        lake with kokanee salmon, yellow perch, and northern pike{'\u2014'}a Forest Service
        campground on the shore makes it an excellent overnight fishing destination. Numerous
        alpine lakes in the Whitefish Range and Jewel Basin hold cutthroat and brook trout
        reachable only by trail, rewarding anglers willing to hike for uncrowded water in stunning
        mountain settings.
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
          +{lakes.length - nearLakes.length} more lakes within 30 miles.
        </p>
      )}

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
            <td style={tdStyle}>Westslope cutthroat trout</td>
            <td style={tdStyle}>Glacier NP streams, Middle Fork, mountain lakes</td>
            <td style={tdStyle}>Summer</td>
            <td style={tdStyle}>Native species{'\u2014'}the star fish of the region</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Lake trout (mackinaw)</td>
            <td style={tdStyle}>Hungry Horse Reservoir, Whitefish Lake, Lake McDonald</td>
            <td style={tdStyle}>Spring, fall</td>
            <td style={tdStyle}>Trolling with downriggers; move shallow at ice-off</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Bull trout</td>
            <td style={tdStyle}>All major waters</td>
            <td style={tdStyle}>{'\u2014'}</td>
            <td style={tdStyle}>Catch-and-release ONLY{'\u2014'}threatened species</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Mountain whitefish</td>
            <td style={tdStyle}>Flathead River, Whitefish Lake</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Abundant, excellent table fare, often overlooked</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Northern pike</td>
            <td style={tdStyle}>Whitefish Lake, Ashley Lake</td>
            <td style={tdStyle}>Spring{'\u2013'}summer</td>
            <td style={tdStyle}>Weedy shallows; aggressive on spoons and spinners</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Yellow perch</td>
            <td style={tdStyle}>Whitefish Lake, Ashley Lake</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Excellent for families and ice fishing</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Kokanee salmon</td>
            <td style={tdStyle}>Ashley Lake</td>
            <td style={tdStyle}>Summer{'\u2013'}early fall</td>
            <td style={tdStyle}>Best at dawn and dusk near surface</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Main stem Flathead River</td>
            <td style={tdStyle}>Spring{'\u2013'}fall</td>
            <td style={tdStyle}>Productive during caddis and stonefly hatches</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Ice-off on Whitefish Lake and smaller lakes
        typically occurs in late March to early April, and the fishing immediately after ice-off
        can be excellent as lake trout and pike feed aggressively near the surface. Hungry Horse
        Reservoir ice-off is later{'\u2014'}usually mid to late April{'\u2014'}due to elevation
        and depth, but the post-ice mackinaw fishing is outstanding. The Flathead River clears
        before spring runoff in May, offering a window for early-season dry flies to blue-winged
        olive and caddis hatches. Glacier NP streams are typically high and cold through May;
        nymphing is productive during runoff.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. Lake trout
        on Hungry Horse Reservoir and Whitefish Lake move deep as surface temperatures rise,
        requiring downriggers or lead-core line. The Flathead River system produces excellent
        dry-fly fishing with caddis, stoneflies, and attractor patterns. Glacier National Park
        streams offer cutthroat trout in crystal-clear water{'\u2014'}small dry flies and light
        tippet are the standard approach. Ashley Lake kokanee fishing peaks in July and August.
        Evening hatches on the rivers can be outstanding. Glacier NP requires a vehicle
        reservation for Going-to-the-Sun Road entry from late May through mid-September.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many locals consider fall the best
        fishing season. Lake trout move shallow on Hungry Horse Reservoir and Whitefish Lake as
        water cools{'\u2014'}excellent opportunity for jigging and casting near rocky structure.
        Bull trout stage in rivers ahead of spawning{'\u2014'}admire them but release carefully.
        Cutthroat fishing in Glacier NP improves as summer crowds thin and fish feed aggressively
        before winter. Blue-winged olives hatch on overcast days on the Flathead River through
        November. Glacier NP vehicle reservations are no longer required after mid-September.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> Ice fishing on Whitefish Lake is a
        local tradition, with northern pike and yellow perch as primary targets. Smaller lakes
        near {townName}{'\u2014'}including Cedar Lake and forest lakes in the Flathead National
        Forest{'\u2014'}also provide ice-fishing access with lighter traffic. Hungry Horse
        Reservoir ice conditions are variable and require caution due to fluctuating water levels.
        The Flathead River remains fishable through winter with nymphs and streamers on warmer
        afternoons. Glacier NP{'\u2019'}s interior is largely inaccessible in winter, but
        McDonald Creek near Apgar remains open to fishing.
      </p>

      <h2>Regulations and Conservation</h2>
      <p>
        <strong>Bull trout</strong> are a threatened species under the Endangered Species Act and
        are <strong>catch-and-release only</strong> throughout the {townName} region{'\u2014'}on
        the Flathead River system, Hungry Horse Reservoir, Whitefish Lake, Glacier National Park
        waters, and all tributaries. Learn to identify bull trout: they display light spots on a
        dark background with a broad, flat head, unlike lake trout which show dark spots on a
        light background. If you catch a bull trout, minimize handling time and release it in the
        water. Regulations are enforced vigorously and penalties are significant.
      </p>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all state
        waters. Licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. <strong>Glacier National Park</strong> waters do
        not require a state fishing license{'\u2014'}only a valid park entrance pass{'\u2014'}but
        park-specific regulations apply and are strict. Check current{' '}
        <a href="https://fwp.mt.gov/fish/regulations" target="_blank" rel="noopener noreferrer">
          FWP regulations
        </a>{' '}
        and{' '}
        <a href="https://www.nps.gov/glac/planyourvisit/fishing.htm" target="_blank" rel="noopener noreferrer">
          NPS Glacier fishing rules
        </a>{' '}
        before fishing any water near {townName}.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link>.
      </p>
    </article>
  );
}
