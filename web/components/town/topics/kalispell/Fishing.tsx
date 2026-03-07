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
        {townName} is the gateway to some of the most diverse freshwater fishing in the
        Northern Rockies. Flathead Lake — the largest natural freshwater lake west of the
        Mississippi at 197 square miles — sits just 14 miles south, while the Flathead River
        system threads through the valley with three major forks draining Glacier National
        Park and the surrounding wilderness. With 10 public fishing access sites and 27 lakes
        within 30 miles, {townName} offers everything from trophy lake trout trolling on
        Flathead Lake to delicate cutthroat dry-fly fishing on pristine mountain streams. For
        the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>10 fishing access sites</strong> within 30 miles</li>
        <li><strong>27 lakes</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Lake trout (mackinaw), cutthroat trout, bull trout (C&R only), rainbow trout, northern pike, yellow perch, mountain whitefish</li>
        <li><strong>Closest lake:</strong> Flathead Lake, 14 miles south</li>
        <li><strong>Closest river:</strong> Flathead River, 8 miles</li>
        <li><strong>Bull trout:</strong> Catch-and-release only in most waters — check regulations</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Lakes</h2>

      <h3>Flathead Lake</h3>
      <p>
        Flathead Lake dominates the fishing landscape around {townName}. At 197 square miles
        with depths reaching 370 feet, it's an inland sea by Montana standards — and it
        produces fish to match. Lake trout (mackinaw) are the premier target, with fish
        commonly reaching 20 pounds and trophies exceeding 30 pounds taken every season.
        Trolling with downriggers is the standard method for lake trout, working depths of
        80 to 150 feet during summer. Yellow perch provide excellent shore fishing at multiple
        bays and are a favorite for families and ice anglers alike. Lake whitefish are abundant
        and underappreciated — they fight well on light tackle and are excellent table fare.
      </p>
      <p>
        Bull trout inhabit Flathead Lake but are strictly catch-and-release — they are a
        threatened species under the Endangered Species Act, and regulations are enforced
        vigorously. Be able to identify bull trout and handle them carefully if caught
        incidentally. Public access to Flathead Lake is available at multiple state park units
        and fishing access sites around the shoreline.
      </p>

      <h3>Whitefish Lake</h3>
      <p>
        Whitefish Lake, 15 miles north of {townName}, is a popular 3,300-acre lake with public
        access at City Beach and Whitefish Lake State Park. Lake whitefish are the namesake
        catch and remain abundant, but the lake also holds healthy populations of northern pike,
        lake trout, and yellow perch. Pike fishing is best in the weedy shallows at the north
        and south ends during spring and early summer. The lake sees moderate boat traffic in
        summer, so early mornings and weekdays offer the best fishing conditions.
      </p>

      <h2>The Rivers</h2>
      <p>
        The Flathead River system is the defining fishery of the {townName} area. The river's
        three forks — North, Middle, and South — converge near the valley floor, each with
        distinct character and fishing opportunity.
      </p>
      <p>
        The <strong>Middle Fork</strong> of the Flathead forms the southern boundary of Glacier
        National Park and is a designated Wild and Scenic River. It holds native westslope
        cutthroat trout and bull trout (catch-and-release only) in clear, cold water flowing
        through remote canyon scenery. Access is limited, which keeps pressure low and fish
        quality high. The <strong>North Fork</strong> flows along Glacier's western boundary
        from Canada — another Wild and Scenic stretch with cutthroat and bull trout in
        exceptionally clear water. The <strong>South Fork</strong> drains the Bob Marshall
        Wilderness and offers both float and wade fishing for cutthroat.
      </p>
      <p>
        The main stem <strong>Flathead River</strong>, about 8 miles from {townName}, is more
        accessible and holds rainbow trout, cutthroat trout, and mountain whitefish. It's a
        solid year-round fishery with good wade access at several points. The{' '}
        <strong>Swan River</strong> (46 miles southeast) is a scenic, less-pressured stream
        flowing through the Swan Valley with native cutthroat and bull trout — a rewarding
        drive for anglers seeking solitude.
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
        Montana Fish, Wildlife & Parks maintains 10 public fishing access sites within 30
        miles of {townName}. These sites
        provide reliable access to the Flathead River system and surrounding lakes, with
        parking and, in most cases, boat launch facilities. Several sites along Flathead Lake
        offer both shore fishing and ramp access for trolling.
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
        Beyond the headline lakes, 27 lakes lie within 30 miles of {townName}, many offering
        quality fishing with far less traffic. Ashley Lake (14 miles west) is a 3,200-acre
        lake with good kokanee salmon and cutthroat trout fishing and a Forest Service
        campground. Echo Lake (16 miles south) provides easy access and consistent fishing for
        largemouth bass, yellow perch, and stocked rainbow trout — it's a popular family
        destination. Numerous alpine lakes in Jewel Basin and the Swan Range hold cutthroat
        and brook trout reachable only by trail, rewarding anglers willing to hike for
        uncrowded water in stunning mountain settings.
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
        <strong>Spring (March–May):</strong> Ice-off on Flathead Lake typically occurs in
        late March to early April, triggering aggressive lake trout feeding near the surface —
        one of the best times for trophy mackinaw. The Flathead River clears before the main
        spring runoff in May, offering a window for dry-fly fishing to early-season caddis and
        blue-winged olive hatches. Smaller lakes like Ashley and Echo ice off in April.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season across all waters. Lake trout on
        Flathead Lake move deep (80–150 feet) as surface temperatures rise, requiring
        downriggers or lead-core line. The Flathead River fishes well all summer with caddis,
        stoneflies, and attractor dry flies. Yellow perch and whitefish are active on Flathead
        Lake and Whitefish Lake through the warm months. Evening hatches on the rivers can
        produce outstanding dry-fly opportunities into August.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many locals consider fall the best fishing
        season in the Flathead Valley. Lake trout move shallow again on Flathead Lake as water
        temperatures drop, and the fall spawning run concentrates fish along rocky shoals. Bull
        trout stage in the rivers ahead of their spawning run — admire them but release
        carefully. Cutthroat fishing on the forks of the Flathead improves as summer crowds
        thin. Blue-winged olives hatch on overcast days through November.
      </p>
      <p>
        <strong>Winter (December–February):</strong> Ice fishing on Whitefish Lake, Ashley
        Lake, and the smaller lakes is a Flathead Valley tradition. Yellow perch and northern
        pike are the primary ice-fishing targets. Flathead Lake rarely freezes entirely due to
        its size and depth, so open-water trolling for lake trout is possible year-round. The
        main Flathead River remains fishable through winter with nymphs and streamers on
        warmer afternoons.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} and nearby Whitefish have several well-established fly shops and outfitters
        offering guided trips on the Flathead River system and Flathead Lake. Snappy's Sport
        Senter in {townName} and Stumptown Angler in Whitefish are reliable sources for local
        fishing reports, tackle, and guide referrals. A Montana fishing license is required
        for anyone 12 and older; licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. Bull trout regulations are strict and vary by
        water — check current FWP regulations before fishing any Flathead Valley water.
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
