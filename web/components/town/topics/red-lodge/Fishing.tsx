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
        {townName} is a mountain fishing town at 5,568 feet where Rock Creek{'\u2014'}a cold, clear
        freestone stream fed by snowmelt from the Beartooth Mountains{'\u2014'}flows directly through
        the center of town. With 15 FWP fishing access sites and 149 lakes within 30 miles,
        {townName} offers an extraordinary range of water: from Rock Creek's accessible in-town
        riffles to the alpine lakes of the Absaroka-Beartooth Wilderness to the Stillwater River's
        remote canyon water. The Beartooth Highway{'\u2014'}one of America's most spectacular alpine
        drives{'\u2014'}opens access to high-country lakes above 9,000 feet that hold populations
        of brook trout and Yellowstone cutthroat trout in settings that rival anywhere in the
        Lower 48. Three rivers flow within reach of {townName}, and the Beartooth Plateau's 700+
        alpine lakes provide a lifetime of stillwater exploration. For Montana's fly fishing heritage and alpine lake fishing, see our <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> and <Link href="/guides/fly-fishing-rivers#alpine-lakes" style={{ color: '#3b6978', textDecoration: 'none' }}>Rivers Deep Dive</Link>. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>149 lakes</strong> within 30 miles</li>
        <li><strong>15 FWP fishing access sites</strong> within 30 miles</li>
        <li><strong>3 rivers</strong> within range</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, Yellowstone cutthroat trout, brook trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Rock Creek{'\u2014'}flows through town, accessible freestone water</li>
        <li><strong>Alpine fishery:</strong> Beartooth Plateau lakes (700+ lakes, accessed via Beartooth Highway)</li>
        <li><strong>Closest access:</strong> Rock Creek through downtown {townName}</li>
        <li><strong>National park water:</strong> Yellowstone National Park (72 mi via Beartooth Highway){'\u2014'}native cutthroat trout</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>Rock Creek</h2>

      <h3>Through Town &amp; Upper Canyon</h3>
      <p>
        Rock Creek is the defining waterway of {townName}{'\u2014'}a mountain freestone stream
        that flows from its headwaters in the Beartooth Mountains north through town, carrying
        cold, well-oxygenated water over gravel and cobble substrate that supports healthy
        populations of rainbow trout and brown trout. The in-town stretch is remarkably accessible:
        you can walk from Broadway Avenue's restaurants and shops to fishable water in minutes.
        This is wade-friendly water{'\u2014'}a medium-sized stream with pocket water, runs, and
        pools that reward attentive nymphing and, during hatches, careful dry-fly work.
      </p>
      <p>
        Upstream of {townName}, Rock Creek enters a scenic canyon where the fishing becomes more
        remote and the trout less pressured. The West Fork of Rock Creek, branching south toward
        the Absaroka-Beartooth Wilderness, offers exceptional small-stream fishing for brook trout
        and cutthroat trout in a forest setting. This upper water sees far less traffic than the
        in-town stretch and provides a genuine backcountry fishing experience within a short drive.
        Hatches on Rock Creek include caddis, pale morning duns, and stoneflies through the summer
        months, with blue-winged olives providing late-season surface action into October.
      </p>

      <h2>The Stillwater River</h2>
      <p>
        The <strong>Stillwater River</strong> flows east out of the Absaroka-Beartooth Wilderness
        through a dramatic canyon before reaching the agricultural valley near Columbus and
        Absarokee. The upper Stillwater is remote, lightly fished water that holds Yellowstone
        cutthroat trout, brook trout, and rainbow trout in a pristine mountain setting. Access
        requires a longer drive from {townName} (approximately 30{'\u2013'}40 miles depending on
        the section), but the reward is solitude and wild fish in water that sees a fraction of
        the pressure of more famous Montana streams.
      </p>
      <p>
        The lower Stillwater near Absarokee and Columbus holds brown trout and rainbow trout in
        larger, more accessible water. Fishing access sites along the lower river provide put-in
        points for wade fishing and short floats. The Stillwater is an excellent alternative when
        Rock Creek runs high with snowmelt in late spring{'\u2014'}the larger river clears sooner
        and provides fishable conditions earlier in the season.
      </p>

      <h2>The Alpine Lakes</h2>
      <p>
        With 149 lakes within 30 miles{'\u2014'}and the broader Beartooth Plateau holding over
        700{'\u2014'}{townName} offers alpine lake fishing on a scale matched by few places in the
        Lower 48. The Beartooth Highway provides roadside access to several high-elevation lakes
        above 9,000 feet, including Beartooth Lake, Island Lake, and Long Lake, which hold
        brook trout and Yellowstone cutthroat trout in spectacular alpine settings. These
        roadside lakes are the most accessible high-country fishing near {townName}{'\u2014'}you
        can fish at 9,500 feet within an hour of leaving Broadway Avenue.
      </p>
      <p>
        For anglers willing to hike, the backcountry lakes of the Absaroka-Beartooth Wilderness
        offer extraordinary solitude. Many of these lakes are stocked with Yellowstone cutthroat
        trout or hold self-sustaining brook trout populations in crystal-clear water surrounded by
        granite peaks and alpine tundra. The fish are often eager feeders{'\u2014'}alpine lake trout
        have short growing seasons and tend to be less selective than stream trout, making dry-fly
        and attractor-pattern fishing highly productive. Some lakes receive only a handful of
        anglers per season, offering a quality of solitude that is increasingly rare in Western
        fishing destinations.
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
        Beyond Rock Creek, {townName}'s river fishing extends to the <strong>Stillwater
        River</strong> and the <strong>Clark's Fork of the Yellowstone</strong>. The Clark's Fork
        flows south of the Beartooth Plateau through a deep canyon that holds brown trout, rainbow
        trout, and cutthroat trout{'\u2014'}this is remote, powerful water accessed from the
        Beartooth Highway corridor. The combination of Rock Creek's accessibility, the Stillwater's
        wilderness character, and the Clark's Fork's canyon drama gives {townName} anglers three
        distinct river personalities within day-trip distance.
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
        {townName} benefits from 15 FWP fishing access sites within 30 miles{'\u2014'}a strong
        number that reflects Carbon County's extensive public-water access along Rock Creek, the
        Stillwater River, and surrounding waters. Rock Creek access points in and near town put
        anglers on the water within minutes of downtown. The Stillwater and Clark's Fork corridors
        provide additional access for wade fishing and short floats. Montana's stream-access law,
        which guarantees public access to navigable waterways below the high-water mark, further
        extends fishing opportunities throughout the region.
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
        <strong>Spring (March–May):</strong> Rock Creek runs high and turbid with spring runoff
        from mid-April through early June. Fishing during runoff is tough on the main creek, but
        nymphing with heavy patterns in the margins can produce. The Stillwater River clears
        earlier and provides an alternative during peak runoff. Alpine lakes remain ice-covered
        through May and into June. Early spring offers uncrowded water for patient anglers willing
        to work through challenging conditions.
      </p>
      <p>
        <strong>Summer (June–August):</strong> The marquee season. Rock Creek typically clears
        and drops to ideal flows by late June, and hatches of caddis, pale morning duns, and
        stoneflies bring trout to the surface through the summer. The Beartooth Highway opens
        (usually late May or early June), unlocking access to high-alpine lakes that fish well
        from July through September. Alpine lake ice-out occurs progressively through June and
        July depending on elevation. Summer evenings on Rock Creek{'\u2014'}with caddis swarms and
        rising trout as the light fades behind the Beartooths{'\u2014'}are among {townName}'s
        finest experiences.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced {townName} anglers name fall
        as the best season. Brown trout become aggressive ahead of their October spawning run, and
        streamer fishing produces the year's largest fish on Rock Creek and the Stillwater. Blue-winged
        olives return on overcast autumn afternoons, bringing selective trout to the surface.
        The Beartooth Highway closes in mid-October, ending high-lake access, but the creek and
        river fishing continues through November. Crowds thin dramatically after Labor Day.
      </p>
      <p>
        <strong>Winter (December–February):</strong> Rock Creek is fishable through winter for
        dedicated anglers, with midges bringing trout to the surface on warmer afternoons. Winter
        fishing in {townName} is a quiet, solitary experience{'\u2014'}January highs average 31°F,
        and the creek runs low and clear through snow-covered banks. Alpine lakes are frozen and
        inaccessible. The Beartooth Highway is closed. After a cold session on the creek, the
        region's hot springs farther afield offer a welcome warm-up on a separate outing.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has several fly shops and outfitters along Broadway Avenue that carry local
        patterns, provide current hatch reports, and book guided trips on Rock Creek, the
        Stillwater River, and the alpine lakes. Guide services offer walk-and-wade trips on the
        local creeks and rivers, as well as backcountry hike-and-fish excursions to Beartooth
        Plateau lakes. A Montana fishing license is required for anyone 12 and older; licenses
        are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local shops. Non-resident licenses are available for durations ranging from two days
        to a full season.
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
