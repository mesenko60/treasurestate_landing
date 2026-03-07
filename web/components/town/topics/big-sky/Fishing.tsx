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
        {townName} sits in the heart of some of the finest fly-fishing water in the American West.
        The <Link href="/planners/fly-fishing-rivers#gallatin-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Gallatin River</Link>{'\u2014'}immortalized in Norman Maclean's <em>A River Runs Through It</em> and
        the Robert Redford film adaptation{'\u2014'}flows through the Gallatin Canyon just minutes from
        town, carrying wild rainbow and brown trout through a dramatic boulder-strewn canyon. The
        legendary Madison River is 30 miles west, offering 50-fish days of dry-fly action that draw
        anglers from around the world. With 18 lakes within 30 miles, 2 FWP fishing access sites,
        4 major river systems within day-trip range, and proximity to Yellowstone National Park's
        native cutthroat trout waters, {townName} provides access to a fishery that rivals any in
        North America. The Gallatin Canyon corridor is lined with fly shops and outfitters, and
        guided trips on the Gallatin, Madison, and Yellowstone rivers are available year-round.
        For Montana's fly fishing heritage, see our <Link href="/planners/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link>. For the full community profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>18 lakes</strong> within 30 miles</li>
        <li><strong>2 FWP fishing access sites</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, Yellowstone cutthroat trout, brook trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Gallatin River{'\u2014'}flows through the canyon minutes from town, legendary pocket water</li>
        <li><strong>Blue-ribbon water:</strong> Madison River (30 mi west), Yellowstone River (75 mi east via Paradise Valley)</li>
        <li><strong>Closest access:</strong> Gallatin River corridor, roadside access along US-191</li>
        <li><strong>National park water:</strong> Yellowstone National Park (50 mi){'\u2014'}native cutthroat trout</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Gallatin River</h2>

      <h3>Through the Canyon</h3>
      <p>
        The Gallatin River is {townName}'s home water{'\u2014'}a fast, cold, boulder-studded freestone
        river that flows north through the Gallatin Canyon along US-191 from Yellowstone National
        Park to the Gallatin Valley near Bozeman. The canyon stretch, from the park boundary
        downstream through {townName}, is classified as blue-ribbon trout water by Montana FWP and
        holds strong populations of wild rainbow trout and brown trout in the 10{'\u2013'}18-inch range,
        with larger fish holding in the deeper pools and undercut banks. This is quintessential
        pocket water{'\u2014'}fast currents, submerged boulders, tight seams, and short drifts that
        reward accurate casting and quick reflexes over long, delicate presentations.
      </p>
      <p>
        Wade fishing is the primary method on the Gallatin{'\u2014'}the river's gradient, boulders, and
        rapids make most stretches too rough for drift boats. Roadside access along US-191 is
        excellent, with pullouts and informal access points every mile or so through the canyon.
        The fishing is productive from the salmonfly hatch in late June through fall, with caddis,
        stoneflies, pale morning duns, and blue-winged olives providing surface action through the
        season. The Gallatin's clear, cold water and wild trout population make it a technically
        satisfying fishery{'\u2014'}the fish are not large by Madison or Yellowstone standards, but
        they are wild, numerous, and rising in one of the most beautiful canyon settings in Montana.
      </p>

      <h2>The Madison River</h2>
      <p>
        The <strong>Madison River</strong>{'\u2014'}roughly 30 miles west of {townName} via MT-64 and
        US-287{'\u2014'}is one of the most celebrated trout rivers in the world. The 50-mile stretch
        from Quake Lake to Ennis (known as the "50-Mile Riffle") is legendary for its consistent
        dry-fly fishing, prolific hatches, and the sheer number of wild rainbow and brown trout
        it holds. The Madison produces some of the highest catch rates of any trout river in
        Montana, with 50-fish days possible during peak hatches. The river's broad, wadeable riffles
        and runs make it more accessible than the bouldery Gallatin{'\u2014'}both wade fishing and
        float trips are productive.
      </p>
      <p>
        The Madison's hatch calendar is the stuff of fly-fishing legend. Salmonflies and golden
        stoneflies in late June and early July trigger aggressive surface feeding from the river's
        largest trout. Caddis swarms follow in July, and pale morning duns, blue-winged olives,
        and terrestrials (hoppers, beetles, ants) carry the dry-fly season through September.
        Fall streamer fishing with large articulated patterns targets pre-spawn brown trout that
        can exceed 20 inches. For {townName} visitors, the Madison is an easy day trip{'\u2014'}drive
        west through the Gallatin Canyon, over the pass to Ennis or the Three Dollar Bridge area,
        and fish one of the world's great trout rivers before returning for dinner.
      </p>

      <h2>The Lakes</h2>
      <p>
        With 18 lakes within 30 miles, {townName} offers outstanding stillwater fishing to
        complement its river credentials. Alpine lakes in the Lee Metcalf Wilderness and the
        Spanish Peaks hold populations of Yellowstone cutthroat trout and brook trout in spectacular
        mountain settings. Many of these high-country lakes see light fishing pressure due to the
        hiking required to reach them{'\u2014'}a welcome contrast to the popular Gallatin Canyon
        pullouts. Cutthroat trout in these alpine lakes are often eager feeders, making them an
        excellent option for anglers looking for solitude and reliable surface action.
      </p>
      <p>
        <strong>Beehive Basin Lake</strong> (accessible via the popular Beehive Basin trail) and
        lakes in the Spanish Creek and Cascade Creek drainages offer alpine fishing in cirque
        settings surrounded by 10,000-foot peaks. Lower-elevation lakes and reservoirs in the
        broader Gallatin Valley provide additional trout and warm-water options for anglers willing
        to make the drive north toward Bozeman. Hebgen Lake (40 miles south near West Yellowstone)
        is a large reservoir renowned for its gulper fishing{'\u2014'}brown trout rising to Callibaetis
        mayfly hatches on calm summer evenings create one of the most exciting stillwater
        dry-fly experiences in Montana.
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

      <h2>The Rivers</h2>
      <p>
        Beyond the Gallatin and Madison, two additional world-class rivers lie within day-trip
        distance of {townName}. The <strong>Yellowstone River</strong> (75 miles east via
        Paradise Valley){'\u2014'}the longest free-flowing river in the contiguous United States{'\u2014'}offers
        blue-ribbon drift-boat fishing for rainbow and brown trout through the stunning
        Absaroka-flanked corridor of Paradise Valley. The famous salmonfly hatch on the
        Yellowstone in late June draws anglers from across the country.
      </p>
      <p>
        The <strong>Upper Gallatin</strong> inside Yellowstone National Park (50 miles south)
        holds native Yellowstone cutthroat trout in meadow water{'\u2014'}a gentler, more intimate
        fishing experience than the canyon stretch near {townName}. Park regulations apply:
        catch-and-release only for cutthroat, no lead tackle, and a Yellowstone fishing permit
        (free, available at park visitor centers) in addition to the Montana license. The
        combination of four major river systems{'\u2014'}Gallatin, Madison, Yellowstone, and the
        upper Gallatin in Yellowstone{'\u2014'}within day-trip range gives {townName} anglers a
        diversity of water types that few locations in the West can match.
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
        {townName} has 2 FWP fishing access sites within 30 miles. The Gallatin Canyon corridor
        along US-191 provides the most convenient access{'\u2014'}roadside pullouts and informal
        parking areas offer wade-fishing entry points every mile or so through the canyon without
        formal FWP signage. The formal fishing access sites serve as designated put-in/take-out
        points and provide developed parking, and some offer primitive camping. For the Madison
        River, access sites near Ennis and along MT-287 provide both wade and float-trip options.
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

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March–May):</strong> The Gallatin runs high and off-color with spring
        runoff from April through early June. Fishing can be productive during lower-water
        windows using nymph rigs and streamers. The Madison clears slightly earlier than the
        Gallatin in some years. Alpine lakes remain ice-covered through May at {townName}'s
        elevation. March brown and blue-winged olive hatches appear on warmer afternoons.
      </p>
      <p>
        <strong>Summer (June–August):</strong> The marquee season. Salmonfly hatches arrive on
        the Gallatin and Madison in late June to early July, triggering aggressive surface
        feeding. The Gallatin typically clears and drops to ideal flows by late June. Caddis,
        golden stoneflies, pale morning duns, and terrestrials carry the dry-fly action through
        August. Alpine lakes in the Spanish Peaks thaw by mid-July. Summer evenings on the
        Gallatin{'\u2014'}with caddis swarms and rising trout as the light fades behind Lone
        Mountain{'\u2014'}are among the finest experiences in Montana fly fishing.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced anglers name fall as the
        best season. Brown trout become aggressive ahead of their October spawning run, and
        streamer fishing produces the year's biggest fish on both the Gallatin and Madison.
        Blue-winged olives return on overcast autumn afternoons. Crowds thin dramatically
        after Labor Day, and the combination of fall colors, elk bugling in the surrounding
        mountains, and uncrowded water creates a fishing experience that summer cannot match.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Gallatin remains fishable through
        winter for dedicated anglers, with midge and BWO hatches on warmer afternoons bringing
        trout to the surface. Nymphing is more consistent. Access can be limited by snow and
        ice along the canyon pullouts, but the highway is maintained and the river never fully
        freezes. Winter fishing on the Gallatin is a quiet, solitary experience{'\u2014'}and a
        perfect complement to a morning of skiing at Big Sky Resort five miles away.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} and the Gallatin Canyon corridor are well-served by fly shops and outfitters.
        East Slope Outdoors, Gallatin River Guides, and several other operations offer guided
        wade trips on the Gallatin, float trips on the Madison and Yellowstone, and alpine lake
        excursions into the Lee Metcalf Wilderness. Fly shops carry local patterns tied
        specifically for the Gallatin's pocket water{'\u2014'}heavier, bushier flies that ride high
        in the turbulent currents. Hatch reports are updated regularly during the season. A
        Montana fishing license is required for anyone 12 and older; licenses are available
        online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local shops. Non-resident licenses are available for durations ranging from two
        days to a full season.
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
