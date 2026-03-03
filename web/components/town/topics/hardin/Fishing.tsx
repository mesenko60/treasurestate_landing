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
  return name.replace(/Reservior/g, 'Reservoir').replace(/Acess/g, 'Access');
}

export default function Fishing({ townName, slug, fishingAccess, rivers, lakes }: Props) {
  const sortedAccess = [...fishingAccess].sort((a, b) => a.distMiles - b.distMiles);
  const sortedRivers = [...rivers].sort((a, b) => a.distMiles - b.distMiles);
  const sortedLakes = [...lakes].sort((a, b) => a.distMiles - b.distMiles);
  const nearLakes = sortedLakes.slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} is the gateway to one of the world{'\u2019'}s premier trout fisheries. The{' '}
        <strong>Bighorn River</strong> below Yellowtail Dam{'\u2014'}about 45 miles south near Fort
        Smith{'\u2014'}is a world-class tailwater holding brown trout and rainbow trout averaging 14 to
        20 inches, drawing fly anglers from around the globe. Add Bighorn Canyon National
        Recreation Area{'\u2019'}s 71-mile-long Bighorn Lake, the Afterbay Reservoir, the Tongue River
        to the east, and multiple FWP fishing access sites along the Yellowstone River corridor,
        and {townName} offers a fishing base that punches far above its weight. For the full town
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains public fishing access sites within range of{' '}
        {townName}, primarily along the Yellowstone River corridor. These sites provide boat ramps,
        shore access, and wade-fishing entry points.
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

      <h2>The Bighorn River</h2>
      <p>
        The Bighorn River below Yellowtail Dam is {townName}{'\u2019'}s headline fishery and one of the
        most productive trout waters in North America. The tailwater section, centered around the
        small town of Fort Smith approximately 45 miles south, holds dense populations of{' '}
        <strong>brown trout</strong> and <strong>rainbow trout</strong> averaging 14 to 20 inches,
        with fish over 20 inches caught regularly. Cold, dam-controlled releases maintain stable
        water temperatures year-round, fueling dense aquatic insect populations that make the
        Bighorn one of the finest dry-fly rivers in the world.
      </p>
      <p>
        Most anglers fish the Bighorn from <strong>guided drift boats</strong>, floating the
        13-mile stretch from Afterbay Dam downstream. Guided drift boat trips typically cost{' '}
        <strong>$525{'\u2013'}$625 per day</strong>. Wade fishing is also excellent at multiple access
        points{'\u2014'}the river is wide, relatively flat-bottomed, and wadeable in many areas during
        normal flows. The Bighorn{'\u2019'}s consistency is its greatest asset: unlike freestone rivers
        that blow out in spring runoff, this tailwater fishes productively 12 months a year.
      </p>
      <p>
        <strong>Peak dry fly fishing</strong> arrives in July with prolific hatches of pale morning
        duns (PMDs), caddis, tricos, and hoppers. Blue-winged olive (Baetis) hatches produce
        surface feeding in spring and fall, while winter brings excellent streamer fishing and
        reliable Baetis hatches on overcast afternoons. Nymph rigs with midges, sowbugs, and
        scuds are productive year-round beneath the surface.
      </p>

      <h2>Afterbay Reservoir</h2>
      <p>
        <strong>Afterbay Reservoir</strong> sits 2.2 miles below Yellowtail Dam and covers 181
        acres. It holds <strong>rainbow trout</strong> with a limit of 5 trout combined. The
        reservoir provides additional fishing opportunity close to the Bighorn River tailwater
        section and is accessible from the Fort Smith area.
      </p>
      <p>
        <strong>Safety warning:</strong> Water levels in Afterbay Reservoir can fluctuate up to{' '}
        <strong>15 feet daily</strong> due to dam operations. Anglers should exercise extreme
        caution, monitor water levels closely, and avoid wading in areas where rapid level changes
        could create dangerous conditions.
      </p>

      <h2>Bighorn Lake</h2>
      <p>
        <strong>Bighorn Lake</strong> stretches 71 miles through Bighorn Canyon National Recreation
        Area (52 miles from {townName}). The lake offers a different fishery from the tailwater
        below{'\u2014'}<strong>walleye</strong>, <strong>trout</strong>,{' '}
        <strong>smallmouth bass</strong>, and surface-feeding carp are the primary species. Boat
        access is available at Ok-A-Beh Marina (south end) and at Barry{'\u2019'}s Landing and Horseshoe
        Bend on the north end. The canyon setting is dramatic{'\u2014'}sheer walls rising over 1,000
        feet above the water{'\u2014'}and the lake receives far less fishing pressure than the
        Bighorn River tailwater.
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

      <h2>Lakes & Reservoirs</h2>
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
          +{lakes.length - nearLakes.length} more lakes within range.
        </p>
      )}

      <h2>Tongue River & Other Waters</h2>
      <p>
        The <strong>Tongue River</strong> (49 miles east) flows through prairie and ranch country,
        offering a quieter alternative to the Bighorn. Smallmouth bass, channel catfish, and
        sauger inhabit the deeper pools and undercut banks. Wade fishing is practical in many
        stretches during normal flows. The Yellowstone River is also accessible to the north
        near the Billings area, with multiple FWP access sites along the corridor.
      </p>

      <h2>Permits & Regulations</h2>
      <p>
        A <strong>Montana fishing license</strong> is required for anyone 12 and older on all state
        waters. Licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season.
      </p>
      <p>
        <strong>Crow Reservation:</strong> The Bighorn River flows through the Crow Indian
        Reservation. A <strong>tribal fishing permit</strong> may be required for certain waters
        on reservation land. Check with the Crow Tribe{'\u2019'}s fish and game department for current
        permit requirements before your trip. State and tribal regulations can differ{'\u2014'}verify
        which jurisdiction applies to the water you plan to fish.
      </p>
      <p>
        Always check current{' '}
        <a href="https://fwp.mt.gov/fish/regulations" target="_blank" rel="noopener noreferrer">
          FWP regulations
        </a>{' '}
        before fishing any water near {townName}.
      </p>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> The Bighorn tailwater fishes year-round, but
        spring brings increasing insect activity{'\u2014'}blue-winged olives and midges produce surface
        feeding from March onward. The Yellowstone River corridor runs high and muddy with spring
        runoff from April through mid-June. Lakes begin to open as ice clears in April and May.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across most waters.{' '}
        <strong>July is peak dry fly fishing</strong> on the Bighorn with PMDs, caddis, tricos,
        and hoppers all active. Bighorn Lake fishing is productive for walleye and bass. Tongue
        River smallmouth bass become active as water warms. {townName}{'\u2019'}s hot summers push
        afternoon temperatures into the 90s{'\u00B0'}F{'\u2014'}fish early and late, and the Bighorn{'\u2019'}s cold
        tailwater stays comfortable for trout regardless of air temperature.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> Many anglers consider fall the best season.
        Brown trout become aggressive before their October{'\u2013'}November spawn, and streamer fishing
        on the Bighorn produces the year{'\u2019'}s largest fish. Blue-winged olive hatches return on
        overcast autumn afternoons. Fewer anglers on all waters.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> The Bighorn tailwater is the winter
        workhorse{'\u2014'}stable dam releases keep the water fishable year-round, and midge hatches on
        warmer winter afternoons bring trout to the surface. Excellent streamer fishing and
        reliable Baetis hatches make winter on the Bighorn productive fishing rather than an
        endurance exercise. Dress warmly{'\u2014'}January lows near {townName} average in the teens.
      </p>

      <p>
        For hiking and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link>.
      </p>
    </article>
  );
}
