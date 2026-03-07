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
        {townName} sits at 4,521 feet in the Deer Lodge Valley of Powell County, Montana,
        37 miles northwest of Butte along I-90.         With <strong>52 lakes</strong> within
        30 miles, <strong>3 fishing access sites</strong>, and access to the{' '}
        <strong>Clark Fork</strong> plus other blue-ribbon rivers within easy driving distance,
        {townName} commands one of the highest densities of fishable water for
        any town in Montana. The <strong>Clark Fork River</strong> flows directly through the
        valley, <strong>Georgetown Lake</strong>{'\u2014'}13 miles southwest{'\u2014'}is the
        premier fishery: a 2,800-acre mountain lake stocked with rainbow trout, brook trout, and
        kokanee salmon, and widely regarded as Montana{'\u2019'}s ice fishing capital. The
        Anaconda-Pintler Wilderness holds backcountry lakes with pure westslope cutthroat trout
        just 3 miles from town. This guide covers every major fishing zone accessible from{' '}
        {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>3 fishing access sites</strong> within 30 miles</li>
        <li><strong>52 lakes</strong> within 30 miles</li>
        <li><strong>1 river</strong> within 30 miles (Big Hole River, 25 mi)</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, brook trout, westslope cutthroat trout, kokanee salmon, mountain whitefish</li>
        <li><strong>Star fishery:</strong> Georgetown Lake{'\u2014'}rainbow trout, brook trout, kokanee salmon, ice fishing</li>
        <li><strong>Closest fishing access:</strong> Comers Point and Red Bridge, 13 miles</li>
        <li><strong>Backcountry fishing:</strong> Anaconda-Pintler Wilderness alpine lakes{'\u2014'}pure westslope cutthroat</li>
        <li><strong>Blue-ribbon stream:</strong> Rock Creek, approximately 30 miles{'\u2014'}one of Montana{'\u2019'}s famous trout streams</li>
        <li><strong>Ice fishing:</strong> Georgetown Lake is Montana{'\u2019'}s premier ice fishing destination</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Clark Fork River</h2>
      <p>
        The <strong>Clark Fork River</strong> flows directly through the Deer Lodge Valley, giving
        {townName} residents and visitors immediate access to Montana{'\u2019'}s longest river.
        Through the {townName} reach, the Clark Fork holds populations of <strong>brown
        trout</strong> and <strong>rainbow trout</strong>, along with mountain whitefish. The river
        here winds through open ranch country and cottonwood bottoms, offering a mix of riffles,
        runs, and deeper pools that produce fish on nymphs, dry flies, and streamers.
      </p>
      <p>
        The Clark Fork through the Deer Lodge Valley has benefited from ongoing restoration
        efforts following decades of mining impacts upstream near Butte. Water quality has improved
        significantly, and the trout population continues to strengthen. The river provides
        accessible wade fishing and float opportunities, with caddis and stonefly hatches in summer
        driving surface feeding. Fall brings blue-winged olive hatches and aggressive brown trout
        ahead of their spawning season, making the Clark Fork a productive fishery from spring
        through late autumn.
      </p>

      <h2>Georgetown Lake</h2>
      <p>
        <strong>Georgetown Lake</strong>, 13 miles southwest of {townName} at 6,330 feet, is THE
        premier fishery in the area and one of the most productive mountain lakes in Montana.
        The 2,800-acre reservoir sits in a stunning bowl surrounded by the Flint Creek Range and
        the Anaconda Range, with Discovery Ski Area visible on the ridgeline above. Georgetown
        Lake is managed as a trophy fishery and produces large rainbow trout, brook trout, and
        kokanee salmon.
      </p>
      <p>
        <strong>Rainbow trout</strong> are the primary target, with fish averaging 14{'\u2013'}18
        inches and larger specimens taken regularly. The lake{'\u2019'}s rich weed beds support
        exceptional insect hatches{'\u2014'}damselfly, callibaetis, and chironomid
        hatches{'\u2014'}that bring fish to the surface for outstanding dry-fly and float-tube
        fishing, particularly in June and September. <strong>Brook trout</strong> are abundant
        and often run 10{'\u2013'}14 inches, feeding aggressively near weed edges and tributary
        inflows. <strong>Kokanee salmon</strong> provide fast action for trollers and attract
        crowds during the late summer spawning run.
      </p>
      <p>
        Georgetown Lake{'\u2019'}s claim to fame, however, is <strong>ice fishing</strong>. The
        lake freezes reliably by late December at its 6,330-foot elevation, and the ice fishing
        season runs through March. Hundreds of ice shanties dot the lake on winter weekends as
        anglers target rainbow trout, brook trout, and kokanee through the ice. Georgetown Lake
        is widely considered Montana{'\u2019'}s ice fishing capital, and the winter fishery draws
        anglers from across the state. Access is excellent, with plowed parking areas and a
        well-established community of winter anglers.
      </p>

      <h2>Rock Creek</h2>
      <p>
        <strong>Rock Creek</strong>, approximately 30 miles northwest of {townName}, is one of
        Montana{'\u2019'}s legendary <strong>blue-ribbon trout streams</strong> and a destination
        fishery in its own right. The creek flows through a scenic canyon for over 50 miles,
        holding strong populations of rainbow trout, brown trout, and cutthroat trout. Rock Creek
        is known for its excellent access{'\u2014'}a road parallels much of the stream{'\u2014'}and
        its outstanding insect hatches, including salmonfly, golden stonefly, and caddis hatches
        that bring large trout to the surface from June through August.
      </p>
      <p>
        Rock Creek offers everything from pocket water and riffles to deep pools and undercut
        banks. Wade fishing is the primary approach, and the stream{'\u2019'}s variety of water
        types means that nymph anglers, dry-fly purists, and streamer fishers all find productive
        water. The proximity of Rock Creek to {townName} makes it an easy day trip for anglers
        seeking a world-class trout stream experience.
      </p>

      <h2>Anaconda-Pintler Wilderness Lakes</h2>
      <p>
        The <strong>Anaconda-Pintler Wilderness</strong>, beginning just 3 miles south of{' '}
        {townName}, holds dozens of alpine lakes scattered across 158,000 acres of high-mountain
        terrain along the Continental Divide. These backcountry lakes{'\u2014'}including{' '}
        <strong>Johnson Lake</strong>, <strong>Warren Lake</strong>, and{' '}
        <strong>Carpp Lake</strong>{'\u2014'}hold pure <strong>westslope cutthroat trout</strong>,
        Montana{'\u2019'}s native trout species, in pristine settings above 7,000 feet.
      </p>
      <p>
        Backcountry fishing in the Pintler Wilderness rewards anglers willing to hike for their
        fish. The cutthroat in these lakes are wild, native, and generally willing to take dry
        flies, small nymphs, and lightweight spinning lures. Most lakes require hikes of 3
        {'\u2013'}8 miles with significant elevation gain, and the best fishing window runs from
        mid-July (after ice-out) through September. The solitude and scenery are
        unmatched{'\u2014'}many of these lakes see only a handful of anglers per season. {townName}
        {'\u2019'}s remarkable 3-mile proximity to the wilderness boundary means these pristine
        waters are closer than from any other town in the region. Come prepared with bear spray,
        water purification, and appropriate backcountry gear.
      </p>

      <h2>Flint Creek and Small Streams</h2>
      <p>
        <strong>Flint Creek</strong> flows through the valley west of {townName}, offering
        intimate small-stream fishing for brook trout and cutthroat trout in a pastoral setting.
        The creek winds through open meadows and cottonwood galleries, providing a pleasant
        half-day fishing option close to town. While Flint Creek does not rival the region{'\u2019'}s
        premier trout streams in size or fish numbers, it offers solitude and easy access for
        anglers looking for a quiet afternoon on the water.
      </p>
      <p>
        Smaller streams draining the Flint Creek Range and the foothills of the Anaconda-Pintler
        Wilderness provide additional creek fishing opportunities. These tributaries hold brook
        trout and cutthroat in forested settings, and most see very little fishing pressure.
        They are ideal for light-tackle and tenkara anglers who enjoy exploring small water.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        Beyond the Clark Fork and Rock Creek, several other rivers within driving distance of{' '}
        {townName} provide varied trout fishing. The <strong>Big Hole River</strong> (approximately
        50 miles south) is one of Montana{'\u2019'}s legendary trout streams, famous for its
        salmonfly hatch in June and populations of brown trout, rainbow trout, and Arctic
        grayling{'\u2014'}one of the last native grayling populations in the lower 48 states.
        The <strong>Blackfoot River</strong> to the north offers additional blue-ribbon trout
        fishing in the storied river made famous by Norman Maclean.
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

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains 3 public fishing access sites within 30 miles
        of {townName}. <strong>Comers Point</strong> and <strong>Red Bridge</strong> (both 13
        miles) are the nearest, providing reliable access to area waters with parking and, in
        most cases, boat launch facilities.
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
        An impressive <strong>52 lakes</strong> lie within 30 miles of {townName}{'\u2014'}one
        of the highest densities of fishable lakes for any town in Montana. <strong>Barker
        Lakes</strong> (3 miles) are the closest, followed by <strong>Storm Lake</strong> (8
        miles), <strong>Lion Lake</strong> (11 miles), <strong>Georgetown Lake</strong> (13
        miles), <strong>Hunters Lake</strong> (13 miles), and <strong>Thornton Lake</strong> (13
        miles). Many of the alpine lakes hold brook trout or cutthroat trout and are accessible
        only by trail, rewarding anglers willing to hike for uncrowded water in stunning mountain
        settings.
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

      <h2>Hot Springs</h2>
      <p>
        After a day on the water, <strong>Fairmont Hot Springs</strong> (approximately 20 miles
        from {townName}) is the sole hot spring within 30 miles, offering natural hot springs
        pools for soaking{'\u2014'}a welcome recovery option after long days of wading and
        hiking to backcountry lakes.
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
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Georgetown Lake, Clark Fork River</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Georgetown Lake{'\u2019'}s primary target; excellent hatches</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brown trout</td>
            <td style={tdStyle}>Clark Fork River, Rock Creek, Big Hole River</td>
            <td style={tdStyle}>Spring{'\u2013'}fall</td>
            <td style={tdStyle}>Clark Fork through valley; Rock Creek produces large browns</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brook trout</td>
            <td style={tdStyle}>Georgetown Lake, mountain streams, alpine lakes</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Abundant at Georgetown; aggressive feeders</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Westslope cutthroat trout</td>
            <td style={tdStyle}>Anaconda-Pintler Wilderness lakes, mountain streams</td>
            <td style={tdStyle}>July{'\u2013'}September</td>
            <td style={tdStyle}>Native species{'\u2014'}pure populations in backcountry lakes</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Kokanee salmon</td>
            <td style={tdStyle}>Georgetown Lake</td>
            <td style={tdStyle}>Summer{'\u2013'}early fall</td>
            <td style={tdStyle}>Fast action trolling; spawning run draws crowds</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Mountain whitefish</td>
            <td style={tdStyle}>Clark Fork River, Rock Creek</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Abundant, excellent table fare, often overlooked</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Arctic grayling</td>
            <td style={tdStyle}>Big Hole River (upper)</td>
            <td style={tdStyle}>Summer</td>
            <td style={tdStyle}>Last native population in lower 48{'\u2014'}handle with care</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Ice-off on Georgetown Lake typically occurs
        in late April to early May at its 6,330-foot elevation. The immediate post-ice period
        offers outstanding fishing as rainbow and brook trout feed aggressively near the surface.
        The Clark Fork River through the Deer Lodge Valley clears before spring runoff in May,
        providing a window for early-season nymphing. Mountain lakes in the Pintler Wilderness
        remain frozen through May and often into June.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. Georgetown
        Lake{'\u2019'}s insect hatches peak{'\u2014'}damselfly, callibaetis, and chironomid
        hatches bring trout to the surface for excellent dry-fly and float-tube fishing.
        Backcountry lakes in the Pintler Wilderness become accessible as ice clears in late June
        and July. River fishing on the Clark Fork and Rock Creek is productive with caddis,
        stoneflies, and attractor patterns. Rock Creek{'\u2019'}s salmonfly hatch typically occurs
        in mid-June.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many locals consider fall the best
        fishing season. Georgetown Lake fishing improves as summer crowds thin and water
        temperatures cool{'\u2014'}brook trout become especially aggressive ahead of their fall
        spawn. Cutthroat fishing in the Pintler Wilderness is excellent in September before
        snowfall closes access. Blue-winged olive hatches on the Clark Fork and Rock Creek extend
        through November on overcast days.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}March):</strong> Georgetown Lake{'\u2019'}s ice fishing
        season is the main event. The lake freezes by late December and the ice fishery runs
        through March, drawing hundreds of anglers on winter weekends for rainbow trout, brook
        trout, and kokanee through the ice. Georgetown Lake is widely considered Montana{'\u2019'}s
        ice fishing capital. The Clark Fork River remains fishable through winter with nymphs and
        streamers on warmer afternoons. Backcountry waters are inaccessible.
      </p>

      <h2>Regulations and Conservation</h2>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all state
        waters. Licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season.
      </p>
      <p>
        <strong>Special regulations</strong> apply on several waters near {townName}. Georgetown
        Lake has specific daily and possession limits that change periodically{'\u2014'}check
        current regulations before fishing. Rock Creek has special regulations including
        catch-and-release sections and gear restrictions on certain stretches. The Big Hole
        River has special regulations protecting Arctic grayling, including seasonal closures on
        some tributaries and reduced bag limits. <strong>Warm Springs Ponds</strong>, south of{' '}
        {townName}, offer limited fishing and wildlife viewing but have specific consumption
        advisories due to their role in environmental treatment processes. Always check current{' '}
        <a href="https://fwp.mt.gov/fish/regulations" target="_blank" rel="noopener noreferrer">
          FWP regulations
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
