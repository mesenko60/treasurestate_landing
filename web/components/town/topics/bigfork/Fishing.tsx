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
        {townName} sits at 2,940 feet on the northeast shore of{' '}
        <strong>Flathead Lake</strong>{'\u2014'}the largest natural freshwater lake west of the
        Mississippi{'\u2014'}in Flathead County, Montana. The Swan River flows directly through
        town, and <strong>32 lakes</strong> lie within 30 miles alongside{' '}
        <strong>10 fishing access sites</strong> and multiple blue-ribbon rivers.{' '}
        <strong>Flathead Lake</strong> itself is the star fishery{'\u2014'}trophy lake trout
        (mackinaw) exceeding 30 pounds, bull trout, yellow perch, and westslope cutthroat draw
        anglers from across the region. The Jewel Basin alpine lakes offer backcountry cutthroat
        fishing, while Echo Lake and the Swan and Flathead rivers round out an extraordinary
        range of fishable water. This guide covers every major fishing zone accessible
        from {townName}. For Montana's fly fishing heritage and the Flathead River system, see our <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> and <Link href="/guides/fly-fishing-rivers#flathead-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Rivers Deep Dive</Link>. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>10 fishing access sites</strong> within 30 miles</li>
        <li><strong>32 lakes</strong> within 30 miles</li>
        <li><strong>Key rivers:</strong> Swan River (through town), Flathead River (10 miles)</li>
        <li><strong>Primary species:</strong> Lake trout (mackinaw), bull trout, westslope cutthroat trout, yellow perch, lake whitefish, mountain whitefish</li>
        <li><strong>Star fishery:</strong> Flathead Lake{'\u2014'}trophy mackinaw up to 30+ lbs</li>
        <li><strong>Closest fishing access:</strong> South Shore (2 miles), Sportsman{'\u2019'}s Bridge (2 miles)</li>
        <li><strong>Family fishing:</strong> Echo Lake (3 miles){'\u2014'}popular, easy access</li>
        <li><strong>Backcountry fishing:</strong> Jewel Basin alpine lakes{'\u2014'}westslope cutthroat</li>
        <li><strong>Charter fishing:</strong> Available on Flathead Lake for mackinaw</li>
        <li><strong>Bull trout:</strong> Catch-and-release only throughout the region</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>);
          Flathead Indian Reservation tribal permit may be required for south half of Flathead Lake</li>
      </ul>

      <h2>Flathead Lake</h2>
      <p>
        <strong>Flathead Lake</strong> is the defining fishery of {townName} and one of the most
        significant inland lakes in the western United States. At nearly 200 square miles, the
        lake{'\u2019'}s cold, clear waters support a world-class <strong>lake trout
        (mackinaw)</strong> fishery{'\u2014'}fish exceeding 30 pounds are taken each year, and
        the lake record stands among the largest in Montana. Mackinaw fishing is best pursued by
        trolling or jigging in deep water, and <strong>charter fishing services</strong> operate
        out of {townName} and nearby marinas for anglers who want a guided experience on this
        vast lake.
      </p>
      <p>
        <strong>Bull trout</strong> inhabit Flathead Lake and its tributary rivers but are{' '}
        <strong>strictly catch-and-release only</strong> throughout the region{'\u2014'}they are
        a threatened species under the Endangered Species Act. <strong>Yellow perch</strong> are
        abundant and provide excellent table fare, particularly in spring and fall near shallow
        weed beds. <strong>Lake whitefish</strong> and <strong>westslope cutthroat trout</strong>{' '}
        round out the lake{'\u2019'}s species mix. The south half of Flathead Lake lies within
        the Flathead Indian Reservation, where a <strong>tribal recreation permit</strong> from
        the Confederated Salish and Kootenai Tribes is required in addition to a Montana fishing
        license.
      </p>

      <h2>Swan River</h2>
      <p>
        The <strong>Swan River</strong> flows directly through {townName}, giving anglers
        in-town access to trout fishing without driving anywhere. The river holds{' '}
        <strong>westslope cutthroat trout</strong>, <strong>bull trout</strong> (catch-and-release
        only), and <strong>mountain whitefish</strong>. The{' '}
        <strong>Wild Mile</strong>{'\u2014'}a whitewater section just above town{'\u2014'}is
        popular with kayakers but also offers pocket water and pools that hold trout for wading
        anglers. Below the Wild Mile, the Swan River calms as it flows through {townName} and
        into Flathead Lake, providing gentle water well suited to fly fishing and spin casting.
      </p>
      <p>
        Fishing access points at <strong>Sportsman{'\u2019'}s Bridge</strong> (2 miles) and
        along the river through town make the Swan River one of the most convenient fisheries in
        Montana. The river is particularly productive in summer and early fall with dry flies,
        nymphs, and small streamers.
      </p>

      <h2>Echo Lake</h2>
      <p>
        <strong>Echo Lake</strong>, just 3 miles from {townName}, is a popular family fishing
        destination with easy shoreline access and a boat launch. The lake holds a mix of
        species and provides consistent fishing in a relaxed setting with mountain views. It is
        an excellent option for anglers with children or those seeking a casual half-day outing
        close to town. In winter, Echo Lake freezes reliably and attracts{' '}
        <strong>ice fishing</strong> enthusiasts.
      </p>

      <h2>Jewel Basin Alpine Lakes</h2>
      <p>
        The <strong>Jewel Basin Hiking Area</strong>, 10 miles east of {townName}, holds{' '}
        <strong>27 named alpine lakes</strong> scattered across 15,349 acres of hikers-only
        terrain. Several of these lakes support populations of{' '}
        <strong>westslope cutthroat trout</strong>{'\u2014'}native fish in pristine high-mountain
        settings above 6,000 feet. Backcountry fishing in Jewel Basin rewards anglers willing to
        hike 3{'\u2013'}8 miles for their fish. The cutthroat are generally willing to take dry
        flies, small nymphs, and lightweight spinning lures. The best fishing window runs from
        mid-July (after ice-out) through September. Come prepared with bear spray and appropriate
        backcountry gear.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        The <strong>Flathead River</strong> (10 miles) is one of Montana{'\u2019'}s premier trout
        rivers, supporting <strong>westslope cutthroat trout</strong>, <strong>bull
        trout</strong> (catch-and-release only), <strong>rainbow trout</strong>, and{' '}
        <strong>mountain whitefish</strong>. The river{'\u2019'}s three forks{'\u2014'}North,
        Middle, and South{'\u2014'}drain some of the wildest country in the Northern Rockies,
        including the Bob Marshall Wilderness and Glacier National Park. Fly fishing is
        exceptional with caddis, stonefly, and attractor patterns through the summer months.
      </p>
      <p>
        The <strong>Swan River</strong> provides closer fishing right through {townName}, while
        smaller tributaries in the Swan Range and surrounding national forest offer creek fishing
        for cutthroat and brook trout in forested settings. These smaller waters are often
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
        Montana Fish, Wildlife & Parks maintains <strong>10 public fishing access
        sites</strong> within 30 miles of {townName}. The closest are{' '}
        <strong>South Shore</strong> (2 miles) and <strong>Sportsman{'\u2019'}s Bridge</strong>{' '}
        (2 miles), providing quick access to Flathead Lake and the Swan River respectively.{' '}
        <strong>Kearney Rapids</strong> (3 miles) and <strong>Loon Lake</strong> (6 miles) expand
        the nearby options. These sites provide parking and, in most cases, boat launch
        facilities.
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
        Beyond Flathead Lake and Echo Lake, an extraordinary <strong>32 lakes</strong> lie within
        30 miles of {townName}. <strong>Aeneas Lake</strong> (10 miles),{' '}
        <strong>Birch Lake</strong> (10 miles), and <strong>Picnic Lakes</strong> (10 miles) are
        among the closest in the Jewel Basin. <strong>Big Hawk Lake</strong> (11 miles),{' '}
        <strong>Strawberry Lake</strong> (11 miles), <strong>Tom Tom Lake</strong> (11 miles),
        and <strong>Wildcat Lake</strong> (11 miles) extend the network further. Many of the
        alpine lakes hold westslope cutthroat trout and are accessible only by trail, rewarding
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
            <td style={tdStyle}>Trophy fish to 30+ lbs; trolling and jigging in deep water</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Bull trout</td>
            <td style={tdStyle}>Flathead Lake, Swan River, Flathead River</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Catch-and-release only{'\u2014'}threatened species</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Westslope cutthroat trout</td>
            <td style={tdStyle}>Jewel Basin lakes, Swan River, Flathead River</td>
            <td style={tdStyle}>July{'\u2013'}September</td>
            <td style={tdStyle}>Native species{'\u2014'}pure populations in backcountry lakes</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Yellow perch</td>
            <td style={tdStyle}>Flathead Lake</td>
            <td style={tdStyle}>Spring, fall</td>
            <td style={tdStyle}>Abundant; excellent table fare near shallow weed beds</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Lake whitefish</td>
            <td style={tdStyle}>Flathead Lake</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Consistent catches; often overlooked by trout anglers</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Mountain whitefish</td>
            <td style={tdStyle}>Swan River, Flathead River</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Abundant in rivers; good table fare</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Flathead River, tributaries</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Strong populations in the Flathead River system</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Flathead Lake{'\u2019'}s mackinaw fishing
        heats up as lake trout move to shallower water for feeding{'\u2014'}spring is one of the
        best seasons for trophy mackinaw. Swan River fishing improves as flows stabilize before
        spring runoff in May. Echo Lake and other low-elevation lakes fish well as water warms.
        Alpine lakes in Jewel Basin remain frozen through May and often into June.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across most waters. Fly
        fishing on the Swan River and Flathead River is productive with caddis, stoneflies, and
        attractor patterns. Flathead Lake mackinaw move deeper as surface temperatures rise{'\u2014'}
        downrigger trolling and deep jigging are the primary techniques. Jewel Basin alpine lakes
        become accessible as ice clears in late June and July, opening backcountry cutthroat
        fishing. Charter trips on Flathead Lake are popular through summer.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many locals consider fall the best
        fishing season. Flathead Lake mackinaw fishing improves as lake trout return to shallower
        water with cooling temperatures. Swan River cutthroat fishing is excellent in September
        and October. Jewel Basin offers outstanding September fishing before snow closes access.
        Yellow perch fishing on Flathead Lake peaks in fall near weed beds.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}March):</strong> Ice fishing takes center stage on{' '}
        <strong>Echo Lake</strong> and <strong>Swan Lake</strong>, both of which freeze
        reliably. Flathead Lake itself rarely freezes completely due to its size and depth, but
        some sheltered bays offer occasional ice fishing. Winter fishing on the Swan River and
        Flathead River is possible with nymphs and streamers on warmer afternoons. Alpine lakes
        are inaccessible.
      </p>

      <h2>Regulations and Conservation</h2>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all
        state waters. Licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season.
      </p>
      <p>
        <strong>Bull trout are catch-and-release only</strong> throughout the Flathead drainage
        and all waters near {townName}{'\u2014'}no exceptions. The south half of Flathead Lake
        lies within the <strong>Flathead Indian Reservation</strong>, where a{' '}
        <strong>tribal recreation permit</strong> from the Confederated Salish and Kootenai
        Tribes is required in addition to the Montana license. The tribal permit boundary is
        well-marked on the lake. Flathead Lake has specific daily and possession limits for lake
        trout and other species that change periodically{'\u2014'}check current regulations
        before fishing. Always check current{' '}
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
