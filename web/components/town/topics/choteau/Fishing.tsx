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
        {townName} sits at 3,816 feet on the high plains east of the Rocky Mountain Front in
        north-central Montana, the seat of Teton County, 60 miles west of Great Falls. With{' '}
        <strong>29 lakes</strong> within 50 miles, <strong>1 fishing access site</strong>,
        and rivers flowing east from the Bob Marshall Wilderness, {townName} offers a mix of
        prairie reservoir fishing, freestone river trout fishing, and bucket-list backcountry
        fishing in one of the most remote wilderness areas in the lower 48. The{' '}
        <strong>Teton River</strong> flows through the {townName} area carrying brown and rainbow
        trout from the Rocky Mountain Front, while the <strong>Sun River</strong> (28 miles)
        provides excellent trout water draining the vast Sun River Game Preserve. For those
        willing to pack in, the <strong>Bob Marshall Wilderness</strong> holds pristine streams
        and alpine lakes with native westslope cutthroat trout. This guide covers every major
        fishing zone accessible from {townName}. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>1 fishing access site</strong> within 50 miles</li>
        <li><strong>29 lakes</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Westslope cutthroat trout (native), rainbow trout, brown trout, brook trout</li>
        <li><strong>Star fishery:</strong> Bob Marshall Wilderness{'\u2014'}native westslope cutthroat in pristine backcountry</li>
        <li><strong>Closest lake:</strong> Dougcliff Reservoir, 9 miles</li>
        <li><strong>Major rivers:</strong> Teton River (through area), Sun River (28 miles)</li>
        <li><strong>Backcountry fishing:</strong> Bob Marshall Wilderness streams and alpine lakes{'\u2014'}pack-in trips</li>
        <li><strong>Float fishing:</strong> Lower Teton River and Sun River</li>
        <li><strong>Hot springs:</strong> 2 within 50 miles for post-fishing recovery</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Teton River</h2>
      <p>
        The <strong>Teton River</strong> is {townName}{'\u2019'}s home water, flowing east from
        the Rocky Mountain Front through the {townName} area and out across the plains toward
        the Marias River. The river{'\u2019'}s upper reaches near the Front run through cottonwood
        bottoms and ranch land, carrying cold water off the mountains that supports populations
        of <strong>brown trout</strong> and <strong>rainbow trout</strong>. The Teton is an
        intimate, wadeable stream in most sections{'\u2014'}classic western freestone water with
        riffles, runs, and undercut banks that hold trout.
      </p>
      <p>
        The upper Teton offers the best trout fishing, where the gradient is steeper and water
        temperatures stay cold through summer. As the river moves east past {townName} and onto
        the open plains, it warms and slows, and the fishery transitions accordingly. Float
        fishing on the lower Teton is possible in spring and early summer when flows are
        sufficient, offering a quieter alternative to Montana{'\u2019'}s more famous float
        streams. Access is primarily through public land crossings and willing landowner
        permission{'\u2014'}respect private property along the river corridor.
      </p>

      <h2>Sun River</h2>
      <p>
        The <strong>Sun River</strong> (28 miles from {townName}) is a major tributary of the
        Missouri River and one of the premier trout fisheries accessible from the {townName}
        area. The river drains the vast <strong>Sun River Game Preserve</strong> in the Bob
        Marshall Wilderness, flowing east through a dramatic canyon before emerging onto the
        plains near Augusta. The Sun River holds strong populations of rainbow trout and brown
        trout, with excellent water quality sustained by its wilderness headwaters.
      </p>
      <p>
        The <strong>South Fork Sun River</strong>, deep in the Bob Marshall Wilderness, is a
        legendary backcountry trout stream. This wilderness water holds pure{' '}
        <strong>westslope cutthroat trout</strong>{'\u2014'}Montana{'\u2019'}s native trout
        species{'\u2014'}in pristine, undeveloped settings. Reaching the South Fork requires
        multi-day pack trips by horse or backpacking; there are no roads. The fishing rewards
        those who make the effort{'\u2014'}wild cutthroat rising to dry flies in water that has
        not changed in centuries. Float fishing on the lower Sun River below Gibson Reservoir is
        a productive option for trout in more accessible water.
      </p>

      <h2>Bob Marshall Wilderness Fishing</h2>
      <p>
        Fishing the <strong>Bob Marshall Wilderness</strong> is a bucket-list experience for
        serious anglers. The {'\u201C'}Bob{'\u201D'} encompasses over 1 million acres of roadless
        wilderness with hundreds of miles of streams and dozens of alpine lakes holding native
        westslope cutthroat trout. These fish are wild, genetically pure, and live in water that
        receives zero stocking pressure or development. The wilderness streams{'\u2014'}the South
        Fork Sun, the South Fork Flathead, and their tributaries{'\u2014'}run gin-clear through
        lodgepole forests and subalpine meadows.
      </p>
      <p>
        Access from the {townName} side is primarily via the <strong>South Fork Teton
        Trail</strong> (28 miles) and other eastern-slope trailheads. Most wilderness fishing
        trips require 2{'\u2013'}5 days minimum, either backpacking or with horses and an
        outfitter. The cutthroat are generally willing to take dry flies, small nymphs, and
        lightweight spinning lures. Mountain lakes in the Bob hold cutthroat that may see only a
        handful of anglers per year. Come prepared with bear-resistant food storage, water
        purification, and backcountry experience{'\u2014'}this is grizzly bear country with no
        cell service and no rescue access.
      </p>

      <h2>Rivers Near {townName}</h2>
      <p>
        Beyond the Teton and Sun Rivers, several smaller streams draining the Rocky Mountain
        Front provide creek fishing for trout in forested and canyon settings. These waters flow
        east from the Lewis and Clark National Forest through wildlife management areas and ranch
        land, offering half-day fishing opportunities within easy reach of {townName}. Brook trout
        are common in the smaller mountain streams, while the larger drainages hold rainbow and
        brown trout. The intimate scale of these streams rewards careful, stealthy approaches with
        light tackle.
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
        Montana Fish, Wildlife & Parks maintains 1 public fishing access site within 50 miles
        of {townName}. Additional access to fishing waters is available through wildlife
        management areas, national forest lands, and bridge crossings on public roads.
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
        <strong>29 lakes</strong> lie within 50 miles of {townName}, a mix of prairie reservoirs
        and mountain lakes. <strong>Dougcliff Reservoir</strong> (9 miles) is the closest,
        followed by <strong>Arod Lakes</strong> (15 miles), <strong>Bynum Reservoir</strong> (15
        miles), and <strong>Willow Creek Reservoir</strong> (15 miles). The reservoirs offer
        warmwater species and some trout fishing, while alpine lakes in the Bob Marshall
        Wilderness and along the Front hold native cutthroat trout accessible only by trail.{' '}
        <strong>Nilan Reservoir</strong> (28 miles) and <strong>Our Lake</strong> (29 miles)
        expand the options further. Many of the mountain lakes are small, remote, and lightly
        fished{'\u2014'}ideal for anglers seeking solitude in stunning Rocky Mountain Front
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
          +{lakes.length - nearLakes.length} more lakes within 50 miles.
        </p>
      )}

      <h2>Hot Springs</h2>
      <p>
        Two hot springs lie within 50 miles of {townName}, offering a welcome recovery option
        after long days of wading rivers or packing into backcountry lakes along the Rocky
        Mountain Front. The combination of remote wilderness fishing and accessible thermal
        springs is a rare pairing in Montana.
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
            <td style={tdStyle}>Westslope cutthroat trout</td>
            <td style={tdStyle}>Bob Marshall Wilderness streams and lakes, South Fork Sun River</td>
            <td style={tdStyle}>July{'\u2013'}September</td>
            <td style={tdStyle}>Native species{'\u2014'}pure populations in backcountry waters</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Rainbow trout</td>
            <td style={tdStyle}>Teton River, Sun River</td>
            <td style={tdStyle}>June{'\u2013'}September</td>
            <td style={tdStyle}>Strong populations in both major rivers</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brown trout</td>
            <td style={tdStyle}>Teton River, Sun River</td>
            <td style={tdStyle}>Spring{'\u2013'}fall</td>
            <td style={tdStyle}>Found in lower, slower reaches; fall spawners</td>
          </tr>
          <tr style={rowStyle}>
            <td style={tdStyle}>Brook trout</td>
            <td style={tdStyle}>Mountain streams, small tributaries</td>
            <td style={tdStyle}>Summer{'\u2013'}fall</td>
            <td style={tdStyle}>Common in smaller mountain drainages along the Front</td>
          </tr>
        </tbody>
      </table>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> The Teton River and lower-elevation waters
        begin clearing after spring runoff in late April and May. Reservoir fishing at Dougcliff,
        Bynum, and Willow Creek picks up as ice comes off, typically in April. Mountain streams
        are running high with snowmelt and are generally unfishable until late May or June.
        Backcountry waters in the Bob Marshall remain frozen and inaccessible through May.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Prime season across all waters. The Teton
        River fishes well with caddis, stonefly, and attractor patterns as flows stabilize in
        June. The Sun River below Gibson Reservoir is productive for rainbow and brown trout.
        Backcountry streams and lakes in the Bob Marshall become accessible as snow melts in late
        June and July{'\u2014'}the window for wilderness fishing trips opens. Reservoirs near
        {townName} are warm and productive for warmwater species. Afternoon thunderstorms are
        common.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider fall the best
        fishing season. River flows drop and clarify, making for excellent sight-fishing on the
        Teton and Sun Rivers. Brown trout become aggressive ahead of their fall spawn. Cutthroat
        fishing in the Bob Marshall is exceptional in September before snow closes access.
        Reservoir fishing remains productive through October. Fewer anglers on all waters.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> The Teton River can be fished through
        winter on warmer days with nymphs and streamers, though access may be limited by ice and
        snow. Reservoirs freeze and offer limited ice fishing opportunities. Backcountry waters
        in the Bob Marshall are completely inaccessible. Winter fishing near {townName} is a
        cold-weather endeavor{'\u2014'}dress for wind and subzero temperatures on the high plains.
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
        <strong>Special regulations</strong> apply on several waters near {townName}. The Teton
        River and Sun River have specific reach-by-reach regulations including gear restrictions
        and catch-and-release sections{'\u2014'}check current FWP regulations before fishing.
        Westslope cutthroat trout are a species of special concern in Montana, and many
        backcountry waters in the Bob Marshall Wilderness have catch-and-release requirements to
        protect genetically pure populations. Always check current{' '}
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
