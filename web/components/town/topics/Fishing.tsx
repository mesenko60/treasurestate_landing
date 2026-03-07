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
  const nearAccess = fishingAccess.filter(f => f.distMiles <= 25);
  const farAccess = fishingAccess.filter(f => f.distMiles > 25);
  const nearLakes = lakes.slice(0, 12);

  return (
    <article className="content-section">
      <p>
        {townName} sits at the confluence of three legendary trout rivers{' '}—{' '}the Clark Fork,
        the Blackfoot, and the Bitterroot{' '}—{' '}making it one of the premier fly fishing
        destinations in the American West. Norman Maclean's <em>A River Runs Through It</em> was
        set on these waters, and the fishing here lives up to the literary reputation. With
        28 public fishing access sites and 13 lakes within 30 miles, {townName} offers
        year-round angling opportunities for every skill level. For the full city profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>28 fishing access sites</strong> within 30 miles</li>
        <li><strong>5 major rivers</strong> within driving distance</li>
        <li><strong>13 lakes</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, westslope cutthroat trout, bull trout</li>
        <li><strong>Closest river access:</strong> Clark Fork River, flows through downtown</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Rivers</h2>

      <h3>Clark Fork River</h3>
      <p>
        The Clark Fork flows directly through downtown {townName}, making it the most accessible
        river in the region. It's a large freestone river with good populations of rainbow and
        brown trout. The reach from Milltown downstream through the city offers wading
        opportunities right in town. Below {townName}, the river widens and is best fished
        from a drift boat. The Clark Fork has benefited enormously from the Milltown Dam
        removal (completed 2008), which restored connectivity with the Blackfoot River and
        improved fish passage and habitat.
      </p>

      <h3>Blackfoot River</h3>
      <p>
        The Blackfoot joins the Clark Fork about 8 miles east of {townName} and is the river
        immortalized in <em>A River Runs Through It</em>. It's a classic Montana freestone
        stream{' '}—{' '}clear water running through pine-forested canyon and open meadow.
        The Blackfoot holds healthy populations of westslope cutthroat, rainbow, and brown
        trout. Conservation efforts over the past two decades have significantly improved
        fish numbers, and catch-and-release regulations on certain stretches help maintain
        the fishery.
      </p>

      <h3>Bitterroot River</h3>
      <p>
        The Bitterroot flows north through the Bitterroot Valley and joins the Clark Fork
        at the west end of {townName}. It's an excellent dry-fly river with prolific hatches
        from spring through fall. The Bitterroot is particularly productive during salmon
        fly season (late June) and the fall brown trout spawning run. Access is good
        throughout the valley, with numerous fishing access sites maintained by Montana
        Fish, Wildlife & Parks.
      </p>

      <h3>Rock Creek</h3>
      <p>
        Rock Creek enters the Clark Fork about 30 miles east of {townName} and is one of
        Montana's most renowned small trout streams. Blue-ribbon status, wild fish,
        and a narrow canyon setting make it a favorite of experienced fly anglers. The
        lower reaches are accessible from I-90, while the upper stretches require a
        longer drive on a gravel road. Catch-and-release regulations apply on some sections.
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

      <h2>Fishing Access Sites (Within 25 Miles)</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains public fishing access sites throughout the{' '}
        {townName} area. These provide free public access to rivers and streams, typically
        with parking, boat ramps or walk-in access, and sometimes restroom facilities.
      </p>
      {nearAccess.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Access Site</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance</th>
            </tr>
          </thead>
          <tbody>
            {nearAccess.map(f => (
              <tr key={f.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{f.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{f.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {farAccess.length > 0 && (
        <details style={{ margin: '0.5rem 0 1.5rem' }}>
          <summary style={{ cursor: 'pointer', color: '#3b6978', fontWeight: 600, fontSize: '0.9rem' }}>
            {farAccess.length} more access sites (25–30 miles) &rsaquo;
          </summary>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.5rem 0', fontSize: '0.92rem' }}>
            <tbody>
              {farAccess.map(f => (
                <tr key={f.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{f.name}</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{f.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}

      <h2>Lake Fishing</h2>
      <p>
        While {townName} is best known for its river fishing, the surrounding mountains hold
        13 lakes within 30 miles. Many are alpine or sub-alpine lakes accessible by
        trail, offering solitude and the chance to catch native westslope cutthroat trout
        in stunning settings. Placid Lake and Seeley Lake (both about 30 miles northeast)
        are popular drive-to options with developed access and boat ramps.
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

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March–May):</strong> Skwala stoneflies bring the first dry-fly fishing
        of the year on the Bitterroot and Clark Fork, typically starting in March. Spring
        runoff increases flows and turbidity in April–May; nymphing is productive during high water.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season. Salmon flies hatch on the Blackfoot
        and Bitterroot in late June{' '}—{' '}the most anticipated hatch of the year. PMDs, caddis,
        and golden stoneflies follow through July. Evening dry-fly fishing can be exceptional.
        Flows drop and clear by late July, making wading easier.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Brown trout become aggressive ahead of their
        fall spawning run. Streamer fishing is productive on all three rivers. October brings
        smaller crowds and cooler temperatures. Blue-winged olives hatch on overcast days
        well into November.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Clark Fork and Bitterroot remain open
        and fishable year-round. Midging and nymphing in slow, deep runs can produce
        fish on warmer days. Dress for cold; wading can be hazardous with ice.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has over a dozen fly shops offering guided trips, gear, and up-to-date fishing
        reports. A Montana fishing license is required for anyone 12 and older; licenses are
        available online at <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a> or
        at local sporting goods stores. Non-resident licenses are available for various durations.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>weekend itinerary</Link>.
      </p>
    </article>
  );
}
