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
        {townName} sits at 2,096 feet in Montana{'\u2019'}s rugged northwest corner at the
        confluence of Libby Creek and the <strong>Kootenai River</strong>. With{' '}
        <strong>17 lakes</strong> within 50 miles, <strong>1 fishing access site</strong> in the
        data, and the turquoise Kootenai flowing through town, {townName} offers world-class trout
        fishing in one of Montana{'\u2019'}s most scenic river corridors. The Kootenai River (1 mile
        from town) holds rainbow, cutthroat, and bull trout and is renowned for fly fishing. Lake
        Koocanusa, created by Libby Dam, offers kokanee, rainbow trout, and lake trout. Bull trout
        are native and protected{'\u2014'}catch-and-release regulations apply. Three hot springs
        within 50 miles provide post-fishing recovery. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>1 fishing access site</strong> within 50 miles</li>
        <li><strong>17 lakes</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, cutthroat trout, bull trout (native, protected), kokanee, lake trout</li>
        <li><strong>Star fishery:</strong> Kootenai River{'\u2014'}world-class trout, fly fishing popular</li>
        <li><strong>Closest river:</strong> Kootenai River, 1 mile</li>
        <li><strong>Major lake:</strong> Lake Koocanusa (kokanee, rainbow, lake trout)</li>
        <li><strong>Bull trout:</strong> Native and protected{'\u2014'}catch-and-release required</li>
        <li><strong>Hot springs:</strong> 3 within 50 miles for post-fishing recovery</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Kootenai River</h2>
      <p>
        The <strong>Kootenai River</strong> (1 mile from {townName}) is {townName}{'\u2019'}s home
        water and one of Montana{'\u2019'}s premier trout fisheries. The turquoise river flows
        through town from Libby Dam, carrying cold, clear water that supports world-class
        populations of <strong>rainbow trout</strong>, <strong>cutthroat trout</strong>, and{' '}
        <strong>bull trout</strong>. Bull trout are native to the Kootenai drainage and are
        protected{'\u2014'}catch-and-release is required. The river is intimate and wadeable in
        many sections, with riffles, runs, and undercut banks that hold trout.
      </p>
      <p>
        Fly fishing is extremely popular on the Kootenai. Dry flies, nymphs, and streamers all
        produce. The river below Libby Dam benefits from cold, regulated flows that keep water
        temperatures ideal through summer. Access is available through the fishing access site and
        at various points along the river corridor. Respect private property and use established
        access points.
      </p>

      <h2>Lake Koocanusa</h2>
      <p>
        <strong>Lake Koocanusa</strong> stretches 90 miles behind Libby Dam (1975) and offers
        excellent lake fishing within easy reach of {townName}. The reservoir holds{' '}
        <strong>kokanee salmon</strong>, <strong>rainbow trout</strong>, and{' '}
        <strong>lake trout</strong>. Kokanee are the primary draw for many anglers, with good
        populations sustained by FWP stocking. Rainbow trout and lake trout provide additional
        opportunities. Boat access, shore fishing, and trolling are all productive. The lake{'\u2019'}s
        clear water and mountain scenery make it a popular destination for both fishing and
        recreation.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        Beyond the Kootenai, smaller streams and tributaries in the Cabinet Mountains and Kootenai
        National Forest provide creek fishing for trout. These waters flow through forested and
        canyon settings, offering half-day fishing opportunities. Bull trout and cutthroat are
        present in many headwater streams{'\u2014'}check regulations, as many waters have
        catch-and-release requirements for native species. The intimate scale of these streams
        rewards careful, stealthy approaches with light tackle.
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
        Montana Fish, Wildlife & Parks maintains 1 public fishing access site within 50 miles of
        {townName} in the data. Additional access to fishing waters is available through wildlife
        management areas, national forest lands, and bridge crossings on public roads. The Kootenai
        River corridor offers multiple access points along U.S. Highway 2.
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
        <strong>17 lakes</strong> lie within 50 miles of {townName}, a mix of reservoirs and
        mountain lakes. Lake Koocanusa is the dominant fishery, with kokanee, rainbow trout, and
        lake trout. Smaller lakes in the Cabinet Mountains and Kootenai National Forest hold
        cutthroat and other species, many accessible only by trail. The combination of river and
        lake fishing within a short drive makes {townName} a versatile base for anglers.
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
        Three hot springs lie within 50 miles of {townName}, offering a welcome recovery option
        after long days of wading the Kootenai or fishing Lake Koocanusa. The combination of
        world-class trout fishing and accessible thermal springs is a rare pairing in northwest
        Montana.
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
            <td style={tdStyle}>Kootenai River, Lake Koocanusa</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Strong populations; fly fishing popular</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Cutthroat trout</td>
            <td style={tdStyle}>Kootenai River, mountain streams</td>
            <td style={tdStyle}>July{'\u2013'}September</td>
            <td style={tdStyle}>Native populations in headwaters</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Bull trout</td>
            <td style={tdStyle}>Kootenai River, cold tributaries</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Native, protected{'\u2014'}catch-and-release required</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Kokanee</td>
            <td style={tdStyle}>Lake Koocanusa</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Primary lake species; trolling productive</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Lake trout</td>
            <td style={tdStyle}>Lake Koocanusa</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Deep-water trolling; larger fish in cold months</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> The Kootenai River below Libby Dam fishes
        year-round due to regulated flows. Spring runoff affects tributaries and lower river
        sections. Lake Koocanusa ice typically comes off in April; kokanee and trout fishing picks
        up as water warms. Mountain streams are running high with snowmelt until late May or June.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. The Kootenai
        River fishes well with dry flies, nymphs, and streamers as flows stabilize. Lake Koocanusa
        is productive for kokanee, rainbow, and lake trout. Fly fishing on the Kootenai is at its
        best. Afternoon thunderstorms are common in the Cabinet Mountains.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider fall the best fishing
        season. River flows drop and clarify, making for excellent sight-fishing on the Kootenai.
        Lake Koocanusa kokanee fishing remains productive. Bull trout become more active in cooler
        water. Fewer anglers on all waters.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> The Kootenai River below Libby Dam can be
        fished through winter on warmer days with nymphs and streamers. Lake Koocanusa may offer
        ice fishing when conditions allow. Winter fishing near {townName} requires dressing for cold
        and snow.
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
        <strong>Bull trout</strong> are a threatened species and are protected throughout the
        Kootenai drainage. Catch-and-release is required. Special regulations apply on the Kootenai
        River and other waters{'\u2014'}check current FWP regulations before fishing. Always check
        current{' '}
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
