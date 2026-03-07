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
        {townName} sits at 5,335 feet at the foot of the Anaconda Range in southwestern Montana,
        26 miles west of Butte and 120 miles from Missoula. With <strong>48 lakes</strong> within
        30 miles, <strong>2 fishing access sites</strong>, and <strong>5 rivers</strong> within
        driving distance, {townName} commands a remarkable density of fishable water.{' '}
        <strong>Georgetown Lake</strong>{'\u2014'}15 miles west{'\u2014'}is the premier fishery:
        a 2,800-acre mountain lake at 6,330 feet stocked with rainbow trout, brook trout, and
        kokanee salmon, and widely regarded as Montana{'\u2019'}s ice fishing capital. The
        Anaconda-Pintler Wilderness holds backcountry lakes with pure <Link href="/planners/fly-fishing-rivers#westslope-cutthroat" style={{ color: '#3b6978', textDecoration: 'none' }}>westslope cutthroat trout</Link>,
        while Silver Bow Creek{'\u2014'}the headwaters of the Clark Fork River{'\u2014'}has been
        restored from Superfund dead water to a productive trout stream. This guide covers every
        major fishing zone accessible from {townName}. For Montana's fly fishing heritage and alpine lake fishing, see our <Link href="/planners/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> and <Link href="/planners/fly-fishing-rivers#alpine-lakes" style={{ color: '#3b6978', textDecoration: 'none' }}>Rivers Deep Dive</Link>. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>2 fishing access sites</strong> within 30 miles</li>
        <li><strong>48 lakes</strong> within 30 miles</li>
        <li><strong>5 rivers</strong> within driving distance</li>
        <li><strong>Primary species:</strong> Rainbow trout, brook trout, westslope cutthroat trout, kokanee salmon, brown trout, mountain whitefish</li>
        <li><strong>Star fishery:</strong> Georgetown Lake{'\u2014'}rainbow trout, brook trout, kokanee salmon, ice fishing</li>
        <li><strong>Closest lake:</strong> Georgetown Lake, 15 miles west</li>
        <li><strong>Backcountry fishing:</strong> Anaconda-Pintler Wilderness alpine lakes{'\u2014'}pure westslope cutthroat</li>
        <li><strong>Restoration success:</strong> Silver Bow Creek, Superfund recovery to productive trout stream</li>
        <li><strong>Ice fishing:</strong> Georgetown Lake is Montana{'\u2019'}s premier ice fishing destination</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Georgetown Lake</h2>
      <p>
        <strong>Georgetown Lake</strong>, 15 miles west of {townName} at 6,330 feet, is THE
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
        anglers from across the state. Access is excellent, with plowed parking areas and
        well-established community of winter anglers.
      </p>

      <h2>Silver Bow Creek</h2>
      <p>
        <strong>Silver Bow Creek</strong>, the headwaters of the Clark Fork River, is one of
        Montana{'\u2019'}s great environmental success stories. The creek flows through the
        Butte{'\u2013'}{townName} corridor and was severely degraded by a century of mining
        operations{'\u2014'}heavy metals from Butte{'\u2019'}s copper mines rendered the stream
        essentially lifeless for decades. Following extensive Superfund cleanup and habitat
        restoration, Silver Bow Creek now supports a recovering trout population with brown trout
        and rainbow trout returning to waters that were once considered dead.
      </p>
      <p>
        The fishing on Silver Bow Creek is improving each year as the restoration matures. The
        creek offers intimate small-stream fishing through open grassland and cottonwood
        corridors, with public access at several points along the Butte{'\u2013'}{townName}
        corridor. While it does not yet rival the region{'\u2019'}s premier trout streams, the
        trajectory is positive, and fishing Silver Bow Creek carries a special
        significance{'\u2014'}proof that even the most damaged waters can recover.
      </p>

      <h2>Anaconda-Pintler Wilderness Lakes</h2>
      <p>
        The <strong>Anaconda-Pintler Wilderness</strong>, beginning 11 miles south of {townName},
        holds dozens of alpine lakes scattered across 158,000 acres of high-mountain terrain
        along the Continental Divide. These backcountry lakes{'\u2014'}including{' '}
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
        unmatched{'\u2014'}many of these lakes see only a handful of anglers per season. Come
        prepared with bear spray, water purification, and appropriate backcountry gear.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        Several rivers within driving distance of {townName} provide varied trout fishing
        opportunities. The <strong>Clark Fork River</strong> downstream from {townName} holds
        brown trout, rainbow trout, and mountain whitefish in its improving waters. The{' '}
        <strong>Big Hole River</strong> (approximately 40 miles south) is one of Montana{'\u2019'}s
        legendary trout streams, famous for its salmonfly hatch in June and populations of brown
        trout, rainbow trout, and Arctic grayling{'\u2014'}one of the last native grayling
        populations in the lower 48 states.
      </p>
      <p>
        The <strong>Rock Creek</strong> (approximately 50 miles northwest) is a blue-ribbon trout
        stream with excellent access and strong populations of rainbow and brown trout. Closer to
        town, smaller streams draining the Anaconda Range and Flint Creek Range offer creek fishing
        for brook trout and cutthroat in forested settings. These smaller waters are often
        overlooked but provide rewarding half-day fishing within easy reach of {townName}.
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
        Montana Fish, Wildlife & Parks maintains 2 public fishing access sites within 30 miles
        of {townName}. These sites provide reliable access to the Clark Fork River, Georgetown
        Lake, and surrounding waters, with parking and, in most cases, boat launch facilities.
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
        Beyond Georgetown Lake, an impressive <strong>48 lakes</strong> lie within 30 miles
        of {townName}{'\u2014'}one of the highest densities of fishable lakes for any town in
        Montana. <strong>Barker Lakes</strong> (8 miles), <strong>Thornton Lake</strong> (10
        miles), and <strong>Hunters Lake</strong> (11 miles) are among the closest options.{' '}
        <strong>Porcupine Lake</strong> (11 miles), <strong>Big Pozega Lake</strong> and{' '}
        <strong>Little Pozega Lake</strong> (12 miles), and the{' '}
        <strong>Bowman Lakes</strong> (13 miles) expand the network further. Many of the alpine
        lakes hold brook trout or cutthroat trout and are accessible only by trail, rewarding
        anglers willing to hike for uncrowded water in stunning mountain settings.
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
        After a day on the water, <strong>Fairmont Hot Springs</strong> (8 miles from {townName})
        offers natural hot springs pools for soaking. An additional 13 hot springs lie within
        the wider area, making the {townName} area a rare combination of outstanding fishing and easily
        accessible thermal springs{'\u2014'}a welcome recovery option after long days of wading
        and hiking to backcountry lakes.
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
            <td style={tdStyle}>Brown trout</td>
            <td style={tdStyle}>Silver Bow Creek, Clark Fork River, Big Hole River</td>
            <td style={tdStyle}>Spring{'\u2013'}fall</td>
            <td style={tdStyle}>Big Hole is legendary for large browns</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Mountain whitefish</td>
            <td style={tdStyle}>Clark Fork River, Big Hole River</td>
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
        Silver Bow Creek and the Clark Fork clear before spring runoff in May, providing a
        window for early-season nymphing. Mountain lakes in the Pintler Wilderness remain frozen
        through May and often into June.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. Georgetown
        Lake{'\u2019'}s insect hatches peak{'\u2014'}damselfly, callibaetis, and chironomid
        hatches bring trout to the surface for excellent dry-fly and float-tube fishing.
        Backcountry lakes in the Pintler Wilderness become accessible as ice clears in late June
        and July. River fishing on the Clark Fork and Big Hole is productive with caddis,
        stoneflies, and attractor patterns. The Big Hole{'\u2019'}s famous salmonfly hatch
        typically occurs in mid-June.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many locals consider fall the best
        fishing season. Georgetown Lake fishing improves as summer crowds thin and water
        temperatures cool{'\u2014'}brook trout become especially aggressive ahead of their fall
        spawn. Cutthroat fishing in the Pintler Wilderness is excellent in September before
        snowfall closes access. Blue-winged olive hatches on the Clark Fork and Big Hole extend
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
        current regulations before fishing. Silver Bow Creek has special catch-and-release and
        gear restriction sections as part of the ongoing Superfund restoration. The Big Hole
        River has special regulations protecting Arctic grayling, including seasonal closures on
        some tributaries and reduced bag limits. Warm Springs Ponds, between Butte and{' '}
        {townName}, offer limited fishing and wildlife viewing but have specific consumption
        advisories due to their role in the Superfund treatment process. Always check current{' '}
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
