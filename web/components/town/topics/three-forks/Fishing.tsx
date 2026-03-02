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
        {townName} sits at 4,075 feet at the confluence of the Jefferson, Madison, and Gallatin
        Rivers{'\u2014'}the exact point where the Missouri River is born. This is the fishing
        holy grail of Montana: three legendary trout rivers meeting in a single valley, 31 miles
        west of Bozeman in Gallatin County. With <strong>59 lakes</strong> within 50 miles,
        dedicated fishing access sites, and three of Montana{'\u2019'}s most storied rivers
        flowing through or immediately adjacent to town, {townName} commands one of the most
        extraordinary concentrations of world-class fishing water in the American West. The
        Madison is a blue-ribbon icon, the Jefferson is an underrated brown trout haven, and the
        Gallatin runs crystal-clear from Yellowstone. This guide covers every major fishing zone
        accessible from {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>3 legendary rivers</strong> converge at {townName}{'\u2014'}Jefferson, Madison, Gallatin</li>
        <li><strong>59 lakes</strong> within 50 miles</li>
        <li><strong>Fishing access sites</strong> along the river corridors</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, mountain whitefish, westslope cutthroat trout</li>
        <li><strong>Star fishery:</strong> Madison River{'\u2014'}one of Montana{'\u2019'}s most famous blue-ribbon trout streams</li>
        <li><strong>Closest lake:</strong> Pacabo Dam, 2 miles</li>
        <li><strong>Hot springs:</strong> Norris Hot Springs (24 mi), Bozeman Hot Springs (24 mi){'\u2014'}perfect post-fishing soak</li>
        <li><strong>Float fishing:</strong> Popular on the Jefferson and Madison Rivers</li>
        <li><strong>Fly fishing culture:</strong> Guides, outfitters, and fly shops in nearby Bozeman</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Madison River</h2>
      <p>
        The <strong>Madison River</strong> is one of Montana{'\u2019'}s most famous blue-ribbon
        trout streams and one of the finest dry-fly rivers in the world. Born at the confluence
        of the Firehole and Gibbon Rivers in Yellowstone National Park, the Madison flows
        northwest through the Madison Valley before joining the Jefferson and Gallatin at{' '}
        {townName} to form the Missouri. The lower Madison near {townName} offers outstanding
        fishing for <strong>rainbow trout</strong> and <strong>brown trout</strong>, with fish
        averaging 14{'\u2013'}18 inches and trophy specimens exceeding 20 inches taken regularly.
      </p>
      <p>
        The Madison{'\u2019'}s riffle-run-pool structure is tailor-made for dry-fly fishing, and
        the river produces prolific hatches of caddis, stoneflies, pale morning duns, and
        blue-winged olives throughout the season. Float fishing the Madison is immensely popular,
        with drift boats and rafts providing access to miles of productive water. Wade fishing is
        equally rewarding in the riffles and runs near {townName}. The Madison{'\u2019'}s
        reputation draws anglers from around the world{'\u2014'}expect company during peak
        season, but the fishing quality justifies the attention.
      </p>

      <h2>Jefferson River</h2>
      <p>
        The <strong>Jefferson River</strong> is the underrated gem of the {townName} area. Formed
        by the confluence of the Big Hole, Beaverhead, and Ruby Rivers near Twin Bridges, the
        Jefferson winds through a broad agricultural valley before reaching {townName}. The river
        holds excellent populations of <strong>brown trout</strong>, with large fish hiding in
        undercut banks, logjams, and deep pools along its meandering course. The Jefferson sees
        far less angling pressure than the Madison, rewarding those who seek it out with solitude
        and quality fish.
      </p>
      <p>
        Float fishing the Jefferson is popular and effective{'\u2014'}the river{'\u2019'}s slow,
        winding character makes it ideal for drift boats and canoes, allowing anglers to cover
        long stretches of productive water. The <strong>fall brown trout spawning run</strong> on
        the Jefferson is legendary among local anglers, drawing large browns upstream from the
        Missouri headwaters area. Streamers and large nymphs are particularly effective during the
        fall run. The Jefferson also holds rainbow trout and mountain whitefish throughout its
        length.
      </p>

      <h2>Gallatin River</h2>
      <p>
        The <strong>Gallatin River</strong> flows north from Yellowstone National Park through the
        spectacular Gallatin Canyon before emerging onto the valley floor near {townName}. The
        Gallatin gained worldwide fame as a filming location for the movie{' '}
        <em>A River Runs Through It</em>{'\u2014'}while the story is set on the Blackfoot River,
        the Gallatin{'\u2019'}s photogenic waters were used extensively in filming. The river
        holds strong populations of <strong>rainbow trout</strong> and{' '}
        <strong>brown trout</strong> in crystal-clear water that demands careful presentation and
        fine tippets.
      </p>
      <p>
        The upper Gallatin through the canyon is a freestone river with pocket water, plunge
        pools, and fast riffles{'\u2014'}classic wade-fishing terrain. As the river reaches the
        valley floor near {townName}, it broadens and slows, offering different character with
        deeper runs and undercut banks. The Gallatin is an excellent year-round fishery, with
        stonefly hatches in early summer, terrestrial fishing in July and August, and blue-winged
        olive hatches extending into November.
      </p>

      <h2>Missouri River</h2>
      <p>
        The <strong>Missouri River</strong> begins at {townName}{'\u2014'}the exact point where
        the Jefferson, Madison, and Gallatin converge. The headwaters reach near {townName} marks
        the birth of the longest river in North America. Downstream from the confluence, the
        Missouri offers productive fishing with brown trout, rainbow trout, and mountain whitefish
        benefiting from the combined flows of three nutrient-rich rivers. The Missouri headwaters
        section is less pressured than the famous tailwater fishery below Holter Dam near Helena,
        providing quality fishing in a historic setting.
      </p>

      <h2>Rivers Near {townName}</h2>
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
        Montana Fish, Wildlife & Parks maintains public fishing access sites within driving
        distance of {townName}, providing reliable access to the river corridors with parking
        and, in most cases, boat launch facilities for float trips. The{' '}
        <strong>Cardwell Bridge FAS</strong> (19 miles) on the Jefferson River is one of the
        primary launch points for float fishing the Jefferson downstream toward {townName}.
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
        Beyond the rivers, <strong>59 lakes</strong> lie within 50 miles of {townName}.{' '}
        <strong>Pacabo Dam</strong> (2 miles) is the closest stillwater option, practically at
        the edge of town. <strong>Ottertail Lake</strong> (9 miles),{' '}
        <strong>Plunket Lake Dam</strong> (13 miles), and{' '}
        <strong>Willow Creek Reservoir</strong> (15 miles) provide additional stillwater fishing
        within easy driving distance. <strong>River Rock Lake</strong> (18 miles) rounds out the
        nearby options. Many of these lakes hold rainbow trout, brown trout, and warmwater species,
        offering a change of pace from the rivers.
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

      <h2>Hot Springs</h2>
      <p>
        After a day on the water, three hot springs within 24 miles offer the perfect recovery.{' '}
        <strong>Norris Hot Springs</strong> (24 miles) is a beloved rustic soaking pool fed by a
        natural hot spring, known for its live music on summer weekends.{' '}
        <strong>Potosi Hot Springs</strong> (24 miles) provides a more secluded mountain setting.{' '}
        <strong>Bozeman Hot Springs</strong> (24 miles) offers multiple pools at various
        temperatures with full resort amenities. The combination of world-class river fishing
        and easily accessible hot springs is one of the {townName} area{'\u2019'}s most compelling
        draws.
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
            <td style={tdStyle}>Madison River, Gallatin River, Missouri River</td>
            <td style={tdStyle}>June{'\u2013'}October</td>
            <td style={tdStyle}>Madison River{'\u2019'}s primary target; excellent dry-fly fishing</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brown trout</td>
            <td style={tdStyle}>Jefferson River, Madison River, Gallatin River</td>
            <td style={tdStyle}>Spring{'\u2013'}fall</td>
            <td style={tdStyle}>Jefferson{'\u2019'}s fall spawning run is legendary</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Westslope cutthroat trout</td>
            <td style={tdStyle}>Backcountry streams, alpine lakes</td>
            <td style={tdStyle}>July{'\u2013'}September</td>
            <td style={tdStyle}>Montana{'\u2019'}s native trout{'\u2014'}found in tributary streams</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Mountain whitefish</td>
            <td style={tdStyle}>All three rivers, Missouri River</td>
            <td style={tdStyle}>Year-round</td>
            <td style={tdStyle}>Abundant, excellent nymphing target, often overlooked</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> The rivers run high and off-color with
        snowmelt from mid-April through May, limiting wade fishing but creating opportunities
        for skilled nymph anglers along the edges. The Madison clears earlier than the Jefferson
        and Gallatin, offering a window for early-season fishing. As flows subside in late May,
        the first significant hatches of the year begin. Nearby lakes become fishable as ice
        clears, typically by late April at the valley{'\u2019'}s 4,075-foot elevation.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. The
        Madison{'\u2019'}s famed salmonfly hatch typically arrives in late June, followed by
        prolific caddis and pale morning dun hatches through July. The Gallatin fishes
        beautifully with attractor dry flies and hopper-dropper rigs. The Jefferson{'\u2019'}s
        brown trout become active as flows stabilize. Float fishing on the Madison and Jefferson
        is at its best. Terrestrial fishing{'\u2014'}hoppers, beetles, ants{'\u2014'}takes over
        in late July and August as grasshoppers fill the riverside meadows.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many local anglers consider fall the
        best fishing season at {townName}. The <strong>Jefferson{'\u2019'}s fall brown trout
        spawning run</strong> draws large fish upstream and is the marquee event of the season.
        Streamer fishing on all three rivers becomes increasingly productive as water temperatures
        drop and trout feed aggressively ahead of winter. Blue-winged olive hatches on overcast
        afternoons extend the dry-fly season through November. Crowds thin dramatically after
        Labor Day.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> Winter fishing is possible on all
        three rivers during warmer afternoons, with nymph fishing producing consistent results on
        days when water temperatures rise above 38{'\u00b0'}F. The Missouri headwaters section
        can fish well on mild winter days. Midges provide the primary hatch through the cold
        months. Ice fishing on nearby lakes offers an alternative when river conditions are
        challenging.
      </p>

      <h2>Regulations and Conservation</h2>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all state
        waters. Licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores and fly shops in Bozeman. Non-resident licenses are
        available for durations ranging from two days to a full season.
      </p>
      <p>
        <strong>Special regulations</strong> apply on sections of all three rivers near{' '}
        {townName}. The Madison River has specific sections with catch-and-release only
        regulations and gear restrictions. The Jefferson and Gallatin have their own regulation
        zones with varying bag limits. Float fishing requires adherence to river access laws and
        bridge-to-bridge floating rules. The three rivers{'\u2019'} confluence area at Missouri
        Headwaters State Park has specific regulations{'\u2014'}check current rules before
        fishing. Always consult the latest{' '}
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
