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
        {townName} sits at the confluence of the Yellowstone and Tongue rivers{'\u2014'}two major
        prairie waterways that support outstanding warm-water fishing in a landscape most people
        associate with cattle rather than casting lines. This is not trout country. The fishing
        around {townName} centers on walleye, sauger, smallmouth bass, channel catfish, and the
        iconic paddlefish{'\u2014'}species that thrive in the warm, turbid waters of the lower
        Yellowstone and its tributaries. The paddlefish snagging season on the Yellowstone
        (typically May through June) draws anglers from across Montana and beyond for a chance
        at these prehistoric giants, some exceeding 100 pounds. With 6 lakes and 2 reservoirs
        within range, plus the two rivers flowing through town, {townName} offers more fishing
        variety than its prairie setting might suggest. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>6 lakes</strong> within 50 miles</li>
        <li><strong>Primary rivers:</strong> Yellowstone River (through town), Tongue River (through town)</li>
        <li><strong>Target species:</strong> Walleye, sauger, channel catfish, smallmouth bass, paddlefish, northern pike, burbot</li>
        <li><strong>Signature fishery:</strong> Yellowstone River paddlefish snagging (May{'\u2013'}June)</li>
        <li><strong>Best walleye water:</strong> Yellowstone River from {townName} downstream to Intake</li>
        <li><strong>Best bass water:</strong> Tongue River, river access points south of town</li>
        <li><strong>Reservoir fishing:</strong> Tongue River Reservoir (70 mi south){'\u2014'}walleye, bass, crappie</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Yellowstone River</h2>

      <h3>Walleye, Sauger & Catfish</h3>
      <p>
        The Yellowstone River through {townName} and downstream is premier walleye and sauger
        water. Unlike the cold, clear upper Yellowstone near Livingston where trout dominate,
        the river at {townName} runs warmer, wider, and more turbid{'\u2014'}ideal habitat for
        warm-water species that thrive in slower currents, sandy substrates, and off-channel
        pools. Walleye and sauger fishing is productive from spring through fall, with the
        best action typically occurring from late April through June as fish move upstream on
        their spawning runs.
      </p>
      <p>
        Jigs tipped with minnows or leeches are the go-to presentation, fished along current
        seams, wing dams, and the gravel bars that punctuate the river. Evening and low-light
        fishing is particularly productive{'\u2014'}walleye feed aggressively at dawn and dusk, and
        summer nights on the Yellowstone produce some of the best catches. Channel catfish
        are abundant throughout the reach, with fish regularly exceeding 10 pounds and
        occasional specimens pushing 20. Cut bait, chicken liver, and nightcrawlers fished on
        the bottom produce steady catfish action from June through September.
      </p>

      <h3>Paddlefish Snagging</h3>
      <p>
        The paddlefish snagging season on the Yellowstone River is {townName}{'\u2019'}s most distinctive
        fishing event. Paddlefish{'\u2014'}ancient, filter-feeding fish that can exceed 100 pounds and
        have remained virtually unchanged for 75 million years{'\u2014'}migrate up the Yellowstone each
        spring to spawn. Montana FWP manages a limited snagging season, typically from mid-May
        through late June, at designated sites downstream of {townName} near Intake. Anglers
        use heavy rods and large treble hooks, casting into the current and snagging fish as
        they move upstream{'\u2014'}a technique unique to paddlefish and nothing like conventional
        angling.
      </p>
      <p>
        The fishery is managed with harvest limits and a tag system; check Montana FWP
        regulations each year for current dates, tag requirements, and harvest limits. The
        Intake Diversion Dam (65 miles downstream) has been a focal point of paddlefish
        conservation, with a bypass channel constructed to improve upstream passage. Paddlefish
        caviar{'\u2014'}processed from harvested fish{'\u2014'}is a delicacy, and processing stations operate
        during the season. This is a bucket-list fishery that draws anglers from across the
        region and connects {townName} to a prehistoric species found in few other places.
      </p>

      <h2>The Tongue River</h2>
      <p>
        The Tongue River flows into the Yellowstone at {townName} from the south, passing through
        a cottonwood-lined valley of ranch country. The Tongue offers a different fishing
        experience from the broad Yellowstone{'\u2014'}smaller, more intimate, with clearer water and
        habitat that supports a healthy population of smallmouth bass. Smallmouth in the
        Tongue are aggressive, willing to hit topwater lures, crankbaits, and soft plastics,
        and fish in the 12- to 16-inch range are common with occasional larger specimens.
      </p>
      <p>
        The Tongue also holds channel catfish, sauger, and some walleye in its lower reaches
        near the Yellowstone confluence. Wade fishing is practical in many stretches during
        normal flows, and small boats or canoes can navigate sections of the river for a
        more exploratory approach. Access points south of {townName} are less developed than
        the Yellowstone{'\u2019'}s FWP sites, so local knowledge{'\u2014'}or a conversation at a local
        sporting goods store{'\u2014'}is valuable for finding productive water.
      </p>

      <h2>The Lakes</h2>
      <p>
        With 6 lakes within 50 miles, {townName}{'\u2019'}s stillwater options are modest compared to
        western Montana{'\u2019'}s mountain lakes, but they provide additional fishing variety. Prairie
        reservoirs and stock dams in the region hold warm-water species including northern pike,
        walleye, yellow perch, and largemouth bass. <strong>Tongue River Reservoir</strong>{' '}
        (70 miles south) is the premier stillwater destination{'\u2014'}a 12-mile-long impoundment
        offering excellent walleye, smallmouth bass, crappie, and northern pike fishing in a
        scenic ponderosa-pine setting. The reservoir has developed facilities including boat
        ramps, campgrounds, and a state park.
      </p>
      <p>
        Closer to town, smaller reservoirs and stock dams on BLM and private land offer
        solitary fishing for those willing to seek permission and explore. Many of these waters
        receive little pressure and can produce surprisingly good fishing for warm-water species.
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

      {rivers.length > 0 && (
        <>
          <h2>Rivers</h2>
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
        </>
      )}

      {fishingAccess.length > 0 && (
        <>
          <h2>Fishing Access Sites</h2>
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
        </>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> As ice clears and water warms, walleye and sauger
        begin their upstream spawning migration on the Yellowstone{'\u2014'}this is prime time for
        jig fishing along current seams and gravel bars. The paddlefish snagging season opens
        in mid-May (check FWP for exact dates). Smallmouth bass on the Tongue become active as
        water temperatures reach the mid-50s. Spring runoff can muddy both rivers through April
        and into May, but the walleye bite often improves in turbid water.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak warm-water season. Walleye fishing shifts
        to early morning and evening as daytime temperatures push into the upper 80s and 90s.
        Channel catfish are in full swing{'\u2014'}night fishing on the Yellowstone with cut bait
        produces the biggest fish. Smallmouth bass hit topwater aggressively through summer on
        the Tongue River. The paddlefish season typically closes by late June. Tongue River
        Reservoir offers excellent summer fishing for walleye, bass, and crappie.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> As water cools, walleye and sauger feed
        heavily ahead of winter{'\u2014'}fall produces some of the year{'\u2019'}s best walleye catches on the
        Yellowstone. Smallmouth bass fishing peaks in September and October as fish bulk up
        before dormancy. Northern pike in area reservoirs become aggressive in cooler water.
        Fishing pressure drops dramatically after hunting season opens, leaving the rivers
        largely to dedicated anglers.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> Ice fishing on area reservoirs and stock
        dams for walleye, perch, and northern pike is the winter option. The Yellowstone
        typically does not freeze solid through {townName}, and some anglers pursue walleye
        and burbot (ling) through the coldest months{'\u2014'}burbot, in particular, are a
        winter-spawning species that becomes more active as water temperatures drop below
        40{'\u00B0'}F. Dress for cold{'\u2014'}January lows average 18{'\u00B0'}F, and wind chill on the open
        river can be severe.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName}{'\u2019'}s fishing culture is practical and unpretentious{'\u2014'}this is bait-and-tackle
        country rather than fly-shop country, reflecting the warm-water fisheries that define
        the region. Local sporting goods stores carry tackle, live bait, and current information
        on river conditions and what{'\u2019'}s biting. Guide services are available for Yellowstone
        River walleye trips and paddlefish snagging during the season. A Montana fishing license
        is required for anyone 12 and older; licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local shops. Paddlefish tags require a separate permit{'\u2014'}check FWP regulations
        for current requirements, as the fishery is actively managed with harvest caps.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking and outdoors guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>weekend itinerary</Link>.
      </p>
    </article>
  );
}
