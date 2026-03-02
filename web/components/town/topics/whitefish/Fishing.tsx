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
        {townName} is named for the mountain whitefish that once filled its lakes and streams
        in extraordinary numbers, and the fishing here still lives up to the name. Whitefish
        Lake, a 3,300-acre glacial lake, borders the town's eastern edge just 2 miles from
        Central Avenue. Flathead Lake, the largest natural freshwater lake west of the
        Mississippi, is 20 miles south. The Flathead River system threads through the valley,
        and Glacier National Park's pristine streams are 17 miles northeast. With 11 public
        fishing access sites and 45 lakes within 50 miles, {townName} offers everything from
        trophy lake trout to delicate cutthroat on mountain streams. For the full town
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>11 fishing access sites</strong> within 50 miles</li>
        <li><strong>45 lakes</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Mountain whitefish, lake trout (mackinaw), cutthroat trout, northern pike, yellow perch, bull trout (C&R only), rainbow trout</li>
        <li><strong>Closest lake:</strong> Whitefish Lake, 2 miles</li>
        <li><strong>Closest river:</strong> Flathead River, 22 miles</li>
        <li><strong>Bull trout:</strong> Catch-and-release only in most waters. Check regulations</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Lakes</h2>

      <h3>Whitefish Lake</h3>
      <p>
        Whitefish Lake is {townName}'s home water, a 3,300-acre glacial lake reaching just 2
        miles from downtown with public access at City Beach and Whitefish Lake State Park.
        The lake's namesake species, mountain whitefish, remain abundant and are often
        overlooked by anglers chasing trout. Whitefish fight well on light tackle and are
        excellent table fare, particularly in fall and winter. The lake also holds healthy
        populations of lake trout, northern pike, and yellow perch. Pike fishing is best
        in the weedy shallows at the north and south ends during spring and early summer.
        Lake trout are taken by trolling at depth during summer. Early mornings and weekdays
        offer the best fishing as summer boat traffic picks up on warm afternoons and weekends.
      </p>

      <h3>Flathead Lake</h3>
      <p>
        Flathead Lake, 20 miles south, is the crown jewel of Flathead Valley fishing. At 197
        square miles with depths reaching 370 feet, it produces trophy lake trout (mackinaw)
        commonly reaching 20 pounds, with fish exceeding 30 pounds taken every season.
        Trolling with downriggers is the standard method, working depths of 80 to 150 feet
        during summer. Yellow perch provide excellent shore fishing at multiple bays and
        are a favorite for families and ice anglers. Lake whitefish are abundant. Bull trout
        inhabit Flathead Lake but are strictly catch-and-release as they are a threatened
        species and regulations are enforced vigorously.
      </p>

      <h2>The Rivers</h2>
      <p>
        The Flathead River system defines the fly fishing around {townName}. The river's
        three forks drain Glacier National Park and the surrounding wilderness before
        converging in the Flathead Valley.
      </p>
      <p>
        The <strong>North Fork</strong> of the Flathead flows along Glacier's western
        boundary from Canada, a designated Wild and Scenic River with westslope cutthroat
        and bull trout (catch-and-release) in exceptionally clear water. Polebridge River
        Access (26 miles from {townName}) is the primary put-in. The{' '}
        <strong>Middle Fork</strong> forms Glacier's southern boundary with native cutthroat
        in remote canyon scenery. The main stem <strong>Flathead River</strong> (22 miles
        from town) is more accessible, holding rainbow trout, cutthroat, and mountain
        whitefish with good wade access at several points.
      </p>
      <p>
        Glacier National Park's streams, accessible from {townName} in 20 minutes, hold
        native westslope cutthroat trout in some of the clearest water in the Northern
        Rockies. McDonald Creek and other park waters are catch-and-release for bull trout,
        and regulations are strict. The park's streams reward careful, light-tackle approaches
        with willing fish in stunning settings.
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

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains 11 public fishing access sites within 50
        miles of {townName}. These sites provide reliable access to the Flathead River system,
        Whitefish Lake, and surrounding lakes, with parking and, in most cases, boat launch
        facilities. Glacier Rim River Access (11 miles) and Blankenship Bridge Boat Launch
        (13 miles) are the closest river access points.
      </p>
      {fishingAccess.length > 0 && (
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
      )}

      <h2>Mountain Lakes</h2>
      <p>
        Beyond the headline waters, 45 lakes lie within 50 miles of {townName}. Cedar Lake
        and Smith Lake (7 miles) offer quiet forest-lake fishing close to town. Bailey Lake
        and Spoon Lake (10 miles) provide secluded shoreline access. Ashley Lake (19 miles
        west) is a 3,200-acre lake with kokanee salmon and cutthroat trout fishing and a
        Forest Service campground. Numerous alpine lakes in the Whitefish Range and Jewel
        Basin hold cutthroat and brook trout reachable only by trail.
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
        <strong>Spring (March to May):</strong> Whitefish Lake typically ices off in late March
        to early April, and the fishing immediately after ice-off can be excellent as lake
        trout and pike feed aggressively near the surface. Flathead Lake's ice-off triggers
        outstanding trophy mackinaw fishing. The Flathead River clears before spring runoff
        in May, offering a window for early-season dry flies to caddis and blue-winged olive
        hatches.
      </p>
      <p>
        <strong>Summer (June to August):</strong> Prime season across all waters. Lake trout on
        Flathead Lake move deep, requiring downriggers. Whitefish Lake fishes well all summer
        for pike, perch, and whitefish. The Flathead River system produces excellent dry-fly
        fishing with caddis, stoneflies, and attractor patterns. Glacier National Park streams
        offer cutthroat trout in crystal-clear water. Evening hatches can be outstanding.
      </p>
      <p>
        <strong>Fall (September to November):</strong> Many locals consider fall the best
        fishing season. Lake trout move shallow on both Whitefish Lake and Flathead Lake as
        water cools. Bull trout stage in rivers ahead of spawning. Admire them but release
        carefully. Cutthroat fishing improves as summer crowds thin. Blue-winged olives hatch
        on overcast days through November.
      </p>
      <p>
        <strong>Winter (December to February):</strong> Ice fishing on Whitefish Lake is a
        local tradition with yellow perch and northern pike as primary targets. Smaller lakes
        like Cedar Lake and Smith Lake also provide ice-fishing access. Flathead Lake rarely
        freezes entirely, so open-water lake trout trolling is possible year-round. The
        Flathead River remains fishable with nymphs and streamers on warmer afternoons.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has several well-established fly shops and outfitters. Stumptown Angler
        is a reliable source for local fishing reports, guided trips on the Flathead River
        system, and tackle. Several additional outfitters offer guided float trips and
        walk-wade experiences on the North and Middle Forks of the Flathead. A Montana
        fishing license is required for anyone 12 and older. Licenses are available online
        at <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. Bull trout regulations are strict and vary by
        water. Check current FWP regulations before fishing any Flathead Valley water.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>weekend itinerary</Link>.
      </p>
    </article>
  );
}
