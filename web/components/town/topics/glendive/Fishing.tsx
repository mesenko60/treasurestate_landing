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
        {townName} sits at 2,064 feet on the <strong>Yellowstone River</strong> in eastern Montana,
        the seat of Dawson County and home to 4,873 people. This is <strong>warmwater fishing
        country</strong>{'\u2014'}not the blue-ribbon trout streams of western Montana. The
        Yellowstone River flows directly through town, carrying <strong>walleye</strong>,{' '}
        <strong>channel catfish</strong>, <strong>smallmouth bass</strong>, and{' '}
        <strong>sauger</strong>. But {townName}{'\u2019'}s signature fishery is the{' '}
        <strong>paddlefish</strong>{'\u2014'}a prehistoric species dating to the age of the dinosaurs,
        reaching 100+ pounds, found in the Yellowstone and Missouri rivers. With{' '}
        <strong>3 lakes</strong> within 30 miles and the Yellowstone running through the heart of
        town, {townName} offers a fishing experience unlike anywhere else in Montana. For the full
        town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>3 lakes</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Walleye, channel catfish, smallmouth bass, sauger, paddlefish</li>
        <li><strong>Signature fishery:</strong> Paddlefish{'\u2014'}prehistoric, 100+ lbs, mid-May to June</li>
        <li><strong>Main access:</strong> MT FWP Black Bridge Fishing Site, 1 mile</li>
        <li><strong>Water type:</strong> Warmwater{'\u2014'}Yellowstone River and prairie lakes</li>
        <li><strong>NOT trout water:</strong> Eastern Montana warmwater fishery, not blue-ribbon trout</li>
        <li><strong>License required:</strong> Montana fishing license + special paddlefish permit (available at{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Paddlefish{'\u2014'}{townName}{'\u2019'}s Signature Species</h2>
      <p>
        The <strong>paddlefish</strong> (<em>Polyodon spathula</em>) is one of the oldest surviving
        species on Earth{'\u2014'}a filter-feeding fish whose lineage dates back over 125 million years to
        the Cretaceous period. Adults commonly exceed 100 pounds. Unlike conventional fishing, paddlefish
        are caught exclusively by <strong>snagging</strong>{'\u2014'}casting heavy treble hooks into
        the current and jerking them through the water column because paddlefish feed on plankton,
        not bait or lures.
      </p>
      <p>
        The paddlefish season runs from <strong>mid-May through June</strong> on the Yellowstone
        River near {townName}. Anglers line the banks and the intake diversion dam area during the
        run. A <strong>special FWP paddlefish permit</strong> is required in addition to a standard
        Montana fishing license. Permits are limited and must be obtained before fishing. The
        paddlefish season attracts anglers from across the region and is a defining event in{' '}
        {townName}{'\u2019'}s outdoor calendar.
      </p>

      <h2>Yellowstone River</h2>
      <p>
        The <strong>Yellowstone River</strong> flows directly through {townName}, providing the
        primary fishing water in the area. At this point in its course, the Yellowstone is a broad,
        slow-moving warmwater river{'\u2014'}a world apart from the cold, fast trout water upstream
        near Livingston and Yellowstone National Park. The river supports excellent populations of{' '}
        <strong>walleye</strong> (the most popular gamefish in the area),{' '}
        <strong>channel catfish</strong>, <strong>smallmouth bass</strong>, and{' '}
        <strong>sauger</strong>.
      </p>
      <p>
        Walleye fishing is productive from spring through fall, with jigs, crankbaits, and live bait
        all effective. Channel catfish respond to cut bait and nightcrawlers, especially in summer
        evenings. Smallmouth bass provide strong fights on light tackle along rocky banks and
        current seams.
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
        <strong>MT FWP Black Bridge Fishing Site</strong> (1 mile from {townName}) is the primary
        public fishing access on the Yellowstone River. Montana Fish, Wildlife & Parks maintains
        this site with bank access and parking. Additional access is available at bridge crossings
        and through wildlife management areas in the region. <strong>Elk Island WMA</strong> (33
        miles) provides backcountry fishing and wildlife viewing opportunities along the
        Yellowstone corridor.
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
        <strong>3 lakes</strong> lie within 30 miles of {townName}. <strong>Crisafulli
        Lake</strong> (2 mi) and <strong>Hollecker Lake</strong> (2 mi) are the closest, offering
        still-water fishing just minutes from town. <strong>Lindsay Reservoir</strong> (22 mi)
        provides a larger impoundment for day trips. These prairie lakes and reservoirs complement
        the river fishing on the Yellowstone with warmwater species including bass, perch, and
        panfish.
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
            <td style={tdStyle}>Paddlefish</td>
            <td style={tdStyle}>Yellowstone River near intake</td>
            <td style={tdStyle}>Mid-May{'\u2013'}June</td>
            <td style={tdStyle}>Snagging only; special FWP permit required; 100+ lbs</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Walleye</td>
            <td style={tdStyle}>Yellowstone River, reservoirs</td>
            <td style={tdStyle}>April{'\u2013'}October</td>
            <td style={tdStyle}>Most popular gamefish; jigs and crankbaits</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Channel catfish</td>
            <td style={tdStyle}>Yellowstone River, lakes</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Cut bait and nightcrawlers; best in evening</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Smallmouth bass</td>
            <td style={tdStyle}>Yellowstone River</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Rocky banks and current seams; light tackle</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Sauger</td>
            <td style={tdStyle}>Yellowstone River</td>
            <td style={tdStyle}>March{'\u2013'}May, September{'\u2013'}November</td>
            <td style={tdStyle}>Related to walleye; common in deeper pools</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Walleye and sauger fishing picks up as water
        temperatures rise. The Yellowstone runs high with snowmelt from upstream, but bank fishing
        remains productive. Prairie lakes thaw and warm through April and May.
      </p>
      <p>
        <strong>Paddlefish Season (Mid-May{'\u2013'}June):</strong> The signature event. Paddlefish
        migrate upstream in the Yellowstone, and anglers gather at the intake diversion dam area.
        Obtain your special FWP permit well in advance{'\u2014'}this is a popular season with
        limited tags.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak warmwater fishing. Walleye, catfish,
        and smallmouth bass are all active. Fish early morning and evening to avoid midday heat{'\u2014'}
        {townName} regularly exceeds 100{'\u00b0'}F in July and August. Lake fishing is productive
        throughout summer.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Excellent walleye and sauger fishing as
        water temperatures cool. Fewer anglers on the water. River levels drop and stabilize,
        making bank access easier. Many locals consider fall the best all-around fishing season.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> River fishing slows but does not stop.
        Walleye and sauger can be caught through winter on warmer days. Prairie lakes may offer
        ice fishing for perch and other panfish when ice conditions are safe.
      </p>

      <h2>Regulations and Conservation</h2>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all state
        waters. For paddlefish, a <strong>separate special permit</strong> is required in addition
        to the standard license{'\u2014'}these are limited and must be obtained before the season
        opens. Licenses and permits are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores.
      </p>
      <p>
        Always check current{' '}
        <a href="https://fwp.mt.gov/fish/regulations" target="_blank" rel="noopener noreferrer">
          FWP regulations
        </a>{' '}
        before fishing any water near {townName}. Paddlefish regulations change annually based on
        population surveys{'\u2014'}verify season dates, harvest limits, and permit requirements
        each year.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link>.
      </p>
    </article>
  );
}
