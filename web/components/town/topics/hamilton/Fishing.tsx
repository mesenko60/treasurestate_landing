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
        {townName} sits on the <Link href="/planners/fly-fishing-rivers#bitterroot-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Bitterroot River</Link>{'\u2014'}one of Montana{'\u2019'}s most celebrated trout
        streams{'\u2014'}in the heart of the Bitterroot Valley, surrounded by an extraordinary
        concentration of fishable water. The Bitterroot and its major forks (East Fork and
        West Fork) carry wild populations of brown trout, rainbow trout, westslope cutthroat
        trout, and bull trout through mountain canyons and cottonwood-lined valley stretches
        that define western Montana fly fishing. With 14 FWP fishing access sites and 55
        lakes within 30 miles, {townName} offers a fishery that ranges from technical dry-fly
        water on the main Bitterroot to remote alpine lake fishing in the Selway-Bitterroot
        Wilderness. The Bitterroot{'\u2019'}s fall brown trout run{'\u2014'}when large fish move upstream
        from the Clark Fork to spawn{'\u2014'}is one of the signature fishing events in western
        Montana. For Montana's fly fishing heritage and the Skwala hatch, see our <Link href="/planners/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link>. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>55 lakes</strong> within 30 miles</li>
        <li><strong>14 FWP fishing access sites</strong> within 30 miles</li>
        <li><strong>5 rivers</strong> within range</li>
        <li><strong>Primary species:</strong> Brown trout, rainbow trout, westslope cutthroat trout, bull trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Bitterroot River{'\u2014'}flows through the valley, renowned dry-fly and streamer water</li>
        <li><strong>Fall highlight:</strong> Brown trout spawning run from the Clark Fork into the Bitterroot (October{'\u2013'}November)</li>
        <li><strong>Forks:</strong> East Fork Bitterroot River, West Fork Bitterroot River{'\u2014'}outstanding wade fishing</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Bitterroot River</h2>

      <h3>Main Stem Through the Valley</h3>
      <p>
        The Bitterroot River is the defining waterway of {townName} and the valley that bears its
        name. Formed by the confluence of the East Fork and West Fork south of Darby, the river
        flows north through the broad Bitterroot Valley for roughly 84 miles before joining the
        Clark Fork at Missoula. The stretch near {townName} offers classic western Montana trout
        water{'\u2014'}riffles, runs, and pools flowing through cottonwood bottoms and ranch land with
        the Bitterroot Range rising dramatically to the west. Brown trout and rainbow trout are
        the primary quarry on the main stem, with fish in the 12- to 18-inch range common and
        larger specimens taken regularly, particularly during the fall brown trout run.
      </p>
      <p>
        The Bitterroot is outstanding dry-fly water. Prolific hatches of pale morning duns,
        caddis, golden stoneflies, and March browns produce reliable surface feeding from late
        May through October. The river{'\u2019'}s moderate gradient and wadeable flows make it more
        accessible to walk-and-wade anglers than the larger, swifter Clark Fork or Blackfoot.
        Float fishing by drift boat or raft is also productive, with multiple put-in and take-out
        options provided by the valley{'\u2019'}s extensive network of FWP fishing access sites.
      </p>

      <h3>The Fall Brown Trout Run</h3>
      <p>
        The Bitterroot{'\u2019'}s most anticipated fishing event is the fall brown trout spawning run.
        Beginning in October and extending into November, large brown trout migrate upstream from
        the Clark Fork River into the Bitterroot and its tributaries to spawn. Fish of 20 inches
        and larger{'\u2014'}some exceeding 24 inches{'\u2014'}enter the Bitterroot system during this run,
        making fall the prime season for trophy-sized browns. Streamer fishing with large
        articulated patterns is the go-to technique, though aggressive browns will also hammer
        big dry flies and nymphs. The run coincides with thinning crowds and spectacular
        fall foliage{'\u2014'}golden cottonwoods and western larch against the snow-dusted Bitterroot
        peaks.
      </p>

      <h2>East Fork & West Fork</h2>
      <p>
        The <strong>East Fork Bitterroot River</strong> flows north from the Anaconda-Pintler
        Wilderness through a scenic canyon before reaching the valley floor. The East Fork holds
        excellent populations of westslope cutthroat trout and bull trout in its upper reaches,
        with brown trout and rainbow trout more prevalent downstream. This is premier wade-fishing
        water{'\u2014'}a smaller, more intimate stream than the main Bitterroot, with pocket water,
        boulder runs, and undercut banks that reward careful, stealthy anglers. The canyon
        section offers solitude and wild scenery that the more accessible main stem cannot match.
      </p>
      <p>
        The <strong>West Fork Bitterroot River</strong> drains the Selway-Bitterroot Wilderness
        to the west, carrying cold, clear water through dense forest and open meadows south of
        Darby. The West Fork is one of the purest cutthroat trout streams in the Bitterroot
        system{'\u2014'}westslope cutthroat dominate the upper reaches, eager feeders that rise willingly
        to attractor dry flies. Bull trout inhabit the deeper pools and are strictly catch-and-release.
        The West Fork{'\u2019'}s wilderness character{'\u2014'}minimal development, limited road access in the
        upper canyon{'\u2014'}makes it a destination for anglers seeking a backcountry fishing experience
        within striking distance of {townName}.
      </p>

      <h2>The Lakes</h2>
      <p>
        With 55 lakes within 30 miles, {townName} offers extensive stillwater fishing to complement
        its river credentials. <strong>Lake Como</strong> (16 miles south) is the most accessible
        and popular{'\u2014'}a scenic mountain reservoir at the base of the Bitterroot Range stocked
        with rainbow trout and kokanee salmon, with facilities for bank fishing, float tubes,
        and small boats. The lake{'\u2019'}s mountain setting and easy access make it a family-friendly
        fishing destination.
      </p>
      <p>
        Alpine lakes in the Selway-Bitterroot Wilderness and the Bitterroot Range canyons hold
        populations of westslope cutthroat trout and brook trout in spectacular high-country
        settings. Many of these lakes see minimal fishing pressure due to the hiking required
        to reach them{'\u2014'}a welcome contrast to the popular river stretches. Cutthroat in these
        lakes are often eager surface feeders, making alpine lake fly fishing one of the most
        rewarding experiences available from {townName}.
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
        Beyond the Bitterroot system, several outstanding rivers lie within day-trip range.
        The <strong>Clark Fork River</strong> at Missoula (47 miles north) is one of western
        Montana{'\u2019'}s premier trout rivers, with improving water quality and growing populations
        of brown trout and rainbow trout through the Missoula valley. The <strong>Blackfoot
        River</strong> (60 miles north), immortalized in Norman Maclean{'\u2019'}s <em>A River Runs
        Through It</em>, offers classic freestone fishing through a scenic canyon and meadow
        corridor. The <strong>Rock Creek</strong> (55 miles northeast), a tributary of the Clark
        Fork, is one of Montana{'\u2019'}s most beloved small trout streams, with outstanding hatches
        and willing trout in a beautiful canyon setting.
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
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{r.distMiles === 0 ? 'Through valley' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Fishing Access Sites</h2>
      <p>
        {townName} benefits from 14 FWP fishing access sites within 30 miles{'\u2014'}an outstanding
        number that reflects the Bitterroot Valley{'\u2019'}s status as a premier fishing destination.
        Access sites are distributed along the main Bitterroot River, the East Fork, and the
        West Fork, providing numerous put-in and take-out options for float trips and convenient
        bank access for wade anglers. The density of access sites means anglers can put together
        float trips of varying lengths{'\u2014'}from short 2-hour afternoon floats to full-day
        adventures covering 15 or more river miles.
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
        <strong>Spring (March{'\u2013'}May):</strong> The Bitterroot runs high and off-color with
        snowmelt from April through early June{'\u2014'}not prime time for the main river. March
        brown mayflies appear in April during lower-water windows, and skwala stoneflies provide
        some of the season{'\u2019'}s earliest dry-fly fishing on the lower Bitterroot. The East Fork
        and West Fork clear earlier than the main stem and can fish well in May. Mountain
        lakes remain ice-covered through May.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak season on the Bitterroot. The river
        typically clears and drops to ideal flows by late June. Golden stonefly hatches in
        late June and early July bring larger trout to the surface. Pale morning duns and
        caddis keep the action going through July and August. The East Fork and West Fork
        offer cooler water and willing cutthroat throughout summer. Alpine lakes thaw and
        fish well from July through September. Summer evenings on the Bitterroot{'\u2014'}with
        caddis swarms and rising trout as the light fades behind the Bitterroot Range{'\u2014'}are
        among the finest experiences in western Montana fly fishing.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}November):</strong> The Bitterroot{'\u2019'}s marquee season. The
        brown trout spawning run from the Clark Fork begins in October, bringing the year{'\u2019'}s
        largest fish into the system. Streamer fishing with articulated patterns produces
        trophy-sized browns. Blue-winged olive hatches return on overcast autumn afternoons,
        and the combination of fall color, cooler temperatures, and thinning crowds makes this
        the preferred season for experienced Bitterroot anglers. October is the month to fish
        here if you can only pick one.
      </p>
      <p>
        <strong>Winter (December{'\u2013'}February):</strong> The Bitterroot is fishable through
        winter for dedicated anglers. {townName}{'\u2019'}s mild valley climate{'\u2014'}January highs
        averaging 40°F{'\u2014'}makes winter fishing more comfortable here than in colder Montana
        towns. Midges bring trout to the surface on warmer afternoons, and nymphing remains
        productive through the cold months. A post-fishing soak at Sleeping Child Hot Springs
        (8 miles) completes the winter day.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has several fly shops that carry local patterns, provide current hatch
        reports, and book guided trips on the Bitterroot system. Guide services offer drift-boat
        floats on the main Bitterroot, walk-and-wade trips on the East Fork and West Fork, and
        alpine lake expeditions into the Selway-Bitterroot Wilderness. A Montana fishing license
        is required for anyone 12 and older; licenses are available online at{' '}
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
