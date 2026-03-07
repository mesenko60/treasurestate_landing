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
        {townName} sits at 4,121 feet in the exact geographic center of Montana. <strong>Big Spring
        Creek</strong>, a blue-ribbon trout stream, flows through town. Spring-fed and crystal-clear,
        it supports excellent populations of <strong>rainbow trout</strong> and{' '}
        <strong>brown trout</strong>.         With <strong>3 lakes</strong> within 30 miles,{' '}
        <strong>1 river</strong> in the data, and central Montana streams throughout the region,{' '}
        {townName} offers premier trout fishing in one of Montana{'\u2019'}s most distinctive
        landscapes. With <strong>3 lakes</strong> within 30 miles and 1 hot spring nearby, the
        region{'\u2019'}s spring-fed waters are the main draw.         Spring Creek Trout Hatchery (3 miles)
        raises fish for stocking. For Montana's fly fishing heritage, see our <Link href="/planners/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link>. For the full
        town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>3 lakes</strong> within 30 miles</li>
        <li><strong>1 river</strong> in the data</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout</li>
        <li><strong>Star fishery:</strong> Big Spring Creek{'\u2014'}blue-ribbon trout, flows through town</li>
        <li><strong>Spring Creek Trout Hatchery:</strong> 3 miles</li>
        <li><strong>Water type:</strong> Spring-fed, central Montana streams</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Big Spring Creek</h2>
      <p>
        <strong>Big Spring Creek</strong> flows through {townName} and is one of Montana{'\u2019'}s
        premier trout fisheries. Fed by one of the largest springs in the American West, the creek
        carries cold, clear, spring-fed water that supports excellent populations of{' '}
        <strong>rainbow trout</strong> and <strong>brown trout</strong>. The creek runs right
        through town, offering convenient access for fly fishing. Big Spring Creek is a blue-ribbon
        stream and a major draw for anglers visiting central Montana.
      </p>
      <p>
        Fly fishing is extremely popular on Big Spring Creek. Dry flies, nymphs, and streamers all
        produce. The spring-fed flows keep water temperatures ideal through summer. Access is
        available at various points along the creek corridor. Respect private property and use
        established access points.
      </p>

      <h2>Spring Creek Trout Hatchery</h2>
      <p>
        <strong>Spring Creek Trout Hatchery</strong> (3 miles from {townName}) raises fish for
        stocking and supports the Big Spring Creek fishery. The hatchery area offers additional
        fishing opportunities and is a short drive from town. Visitors can learn about trout
        propagation and the role of spring-fed waters in central Montana{'\u2019'}s fisheries.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        Beyond Big Spring Creek, central Montana streams throughout the region provide creek fishing
        for trout. These waters flow through prairie, foothill, and canyon settings, offering
        half-day and full-day fishing opportunities. The intimate scale of these streams rewards
        careful, stealthy approaches with light tackle.
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
        No formal FWP fishing access sites lie within 30 miles of {townName}. Access to fishing
        waters is available through wildlife management areas and bridge crossings on public roads.
        Big Spring Creek offers multiple access points along the creek corridor.
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
        <strong>3 lakes</strong> lie within 30 miles of {townName}, a mix of reservoirs and
        natural lakes. These waters provide still-water fishing opportunities to complement the
        stream fishing on Big Spring Creek. The combination of creek and lake fishing within a
        short drive makes {townName} a versatile base for anglers.
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
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Big Spring Creek, central Montana streams</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Strong populations; fly fishing popular</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brown trout</td>
            <td style={tdStyle}>Big Spring Creek, central Montana streams</td>
            <td style={tdStyle}>July{'\u2013'}October</td>
            <td style={tdStyle}>Spring-fed waters support quality fish</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Big Spring Creek fishes year-round due to
        spring-fed flows. Spring runoff can affect some tributaries. Lake ice typically comes off
        in April; still-water fishing picks up as water warms.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. Big Spring
        Creek fishes well with dry flies, nymphs, and streamers as flows stabilize. Lake fishing
        is productive. Fly fishing on Big Spring Creek is at its best.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider fall the best fishing
        season. Creek flows drop and clarify, making for excellent sight-fishing. Brown trout
        become more active in cooler water. Fewer anglers on all waters.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Big Spring Creek can be fished through
        winter on warmer days with nymphs and streamers. Lakes may offer ice fishing when
        conditions allow. Winter fishing near {townName} requires dressing for cold and snow.
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
        Always check current{' '}
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
