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
        {townName} is, by any measure, one of the great fly-fishing towns in America. The
        Yellowstone River — the longest free-flowing river in the contiguous United States — runs
        directly through the center of town, carrying blue-ribbon rainbow and brown trout past
        downtown storefronts and beneath the Park Street bridge. Dan Bailey's Fly Shop, founded
        here in 1938, helped establish {townName} as a fly-fishing destination decades before the
        rest of Montana's trout towns gained national attention. The town's reputation rests not
        only on the Yellowstone itself but on an extraordinary concentration of world-class water
        within easy reach: the legendary Paradise Valley spring creeks — DePuy, Armstrong, and
        Nelson — offer some of the most technically demanding and rewarding trout fishing on earth,
        while the Boulder River, the <Link href="/guides/fly-fishing-rivers#gallatin-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Gallatin River</Link> (made famous by <em>A River Runs Through
        It</em>), and 40 mountain lakes within 30 miles round out a fishery that rivals any in
        North America.         With 2 FWP fishing access sites and Mayor's Landing just 1 mile from town,
        {townName} puts serious trout water at your feet. For Montana's fly fishing heritage and river guides, see our <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none' }}>Fly Fishing Guide</Link> and <Link href="/guides/fly-fishing-rivers#yellowstone-river" style={{ color: '#3b6978', textDecoration: 'none' }}>Rivers Deep Dive</Link>. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>40 lakes</strong> within 30 miles</li>
        <li><strong>2 FWP fishing access sites</strong> within 30 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, Yellowstone cutthroat trout, brook trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Yellowstone River — flows through town, legendary dry-fly water</li>
        <li><strong>Spring creeks:</strong> DePuy, Armstrong, Nelson — world-famous private-access spring creek fishing</li>
        <li><strong>Closest access:</strong> Mayor's Landing, 1 mile from downtown</li>
        <li><strong>National park water:</strong> Yellowstone National Park (44 mi) — native cutthroat trout</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Yellowstone River</h2>

      <h3>Through Town &amp; Paradise Valley</h3>
      <p>
        The Yellowstone River is the defining feature of {townName} — geographically, culturally,
        and as a fishery. It flows from its headwaters in Yellowstone National Park north through
        Paradise Valley and directly through town, carrying cold, nutrient-rich water that supports
        outstanding populations of rainbow trout and brown trout. The stretch from Gardiner
        downstream through {townName} is classified as blue-ribbon trout water by Montana FWP,
        with consistent populations of 14- to 20-inch fish and larger specimens taken regularly
        throughout the season. This is classic dry-fly water — prolific hatches of salmonflies,
        golden stoneflies, pale morning duns, caddis, and blue-winged olives produce surface
        feeding from late May through November.
      </p>
      <p>
        Mayor's Landing FWP fishing access site — just 1 mile from downtown — puts anglers on the
        river within minutes. Both wade fishing and drift-boat floats are productive, with the
        Paradise Valley stretch from Gardiner to {townName} (roughly 44 river miles) offering
        multiple put-in and take-out options. The famous salmonfly hatch in late June and early
        July is the marquee event of the {townName} fishing calendar — swarms of giant stoneflies
        bring the river's largest trout to the surface to feed on size-4 and size-6 dry flies, and
        the entire town buzzes with anticipation. The hatch progresses upstream over several weeks,
        so anglers can follow the "front" up the river for weeks of action.
      </p>

      <h2>Paradise Valley Spring Creeks</h2>
      <p>
        The spring creeks of Paradise Valley — <strong>DePuy Spring Creek</strong>,{' '}
        <strong>Armstrong Spring Creek</strong>, and <strong>Nelson Spring Creek</strong> — are
        among the most celebrated trout waters in the world. Fed by underground springs that
        maintain a constant temperature of roughly 50°F year-round, these small, crystal-clear
        streams flow through private ranchland south of {townName} before entering the Yellowstone
        River. The steady temperature and rich aquatic vegetation produce extraordinary insect
        hatches and grow trout far larger than the creeks' modest size would suggest — 16- to
        22-inch rainbow and brown trout are common, and fish over 24 inches are taken each season.
      </p>
      <p>
        Fishing these spring creeks requires a rod fee paid to the landowner — typically $100–$200
        per angler per day, with rod counts strictly limited to preserve the experience. The
        fishing is technical: long leaders, fine tippets (6X and 7X), precise presentations, and
        accurate imitations of the current hatch are essential. The creeks produce hatches
        year-round, including midges and blue-winged olives through the winter months, making
        them a genuine four-season fishery. Many visiting anglers consider a day on DePuy or
        Armstrong the highlight of a Montana fishing trip — the combination of gin-clear water,
        large educated trout, and the Paradise Valley backdrop is unmatched.
      </p>

      <h2>The Lakes</h2>
      <p>
        With 40 lakes within 30 miles, {townName} offers
        extraordinary stillwater fishing to complement its river credentials. Alpine lakes in the
        Absaroka Range east of Paradise Valley hold populations of Yellowstone cutthroat trout and
        brook trout in spectacular mountain settings. Pine Creek Lake, accessible via the popular
        Pine Creek Falls trail (13 miles south), is one of the most scenic alpine lake fisheries
        in the area. Many of these high-country lakes see light fishing pressure due to the hiking
        required to reach them — a welcome contrast to the popular river floats. Cutthroat trout
        in these lakes are often eager feeders, making alpine lake fishing an excellent option for
        anglers looking for solitude and reliable surface action.
      </p>
      <p>
        Lower-elevation lakes and reservoirs in the region offer warm-water and mixed-species
        fishing. Dailey Lake (28 miles south) provides good rainbow trout fishing in an accessible
        setting with mountain views. The lakes north and west of {townName} in the Gallatin Valley
        area offer additional trout and warm-water options.
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
        Beyond the Yellowstone, several outstanding rivers lie within day-trip distance of
        {townName}. The <strong>Boulder River</strong> (27 miles east) is a freestone mountain
        stream flowing through a scenic canyon south of Big Timber. The Boulder offers a more
        intimate, wade-friendly experience than the broad Yellowstone — the river runs through
        narrow rock gorges and open meadow stretches holding brown trout and brook trout in the
        12- to 16-inch range. Natural Bridges Falls, where the river disappears into a limestone
        cavern and re-emerges below, is a geological curiosity worth the side trip.
      </p>
      <p>
        The <strong>Gallatin River</strong> (31 miles west) gained worldwide fame as the setting
        for Norman Maclean's <em>A River Runs Through It</em> and the Robert Redford film
        adaptation. The Gallatin Canyon stretch — a fast, bouldery river running through a narrow
        canyon along Highway 191 — offers pocket-water fishing for rainbow and brown trout amid
        dramatic scenery. Wade fishing is the primary method; the river's gradient and rapids make
        most stretches too rough for drift boats. The upper Gallatin inside Yellowstone National
        Park holds native Yellowstone cutthroat trout in meadow water.
      </p>
      <p>
        The <strong>Stillwater River</strong> (49 miles east) and its tributaries drain the
        Absaroka-Beartooth Wilderness and offer remote, lightly fished water for anglers willing
        to make the drive. Brook trout and cutthroat trout inhabit the upper reaches, with brown
        trout in the lower river near Columbus.
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
        {townName} benefits from 2 FWP fishing access sites within 30 miles — a strong number that
        reflects the region's status as a fishing destination. <strong>Mayor's Landing</strong>{' '}
        (1 mile from downtown) is the crown jewel — a fully developed access site on the
        Yellowstone River practically in town, with a boat ramp for drift-boat launches and bank
        access for wade anglers. This is the most convenient put-in point for Paradise Valley
        floats ending in town, and it sees heavy use during the salmonfly hatch. Grey Bear (26 mi),
        Buffalo Jump (40 mi), Moraine (41 mi), Castle Rock (42 mi), Bratten (45 mi), and Cliff
        Swallow (46 mi) provide additional access along the Yellowstone corridor and surrounding
        rivers, giving float anglers multiple options for putting together half-day and full-day
        trips of varying lengths.
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
        <strong>Spring (March–May):</strong> The Yellowstone River runs high and off-color with
        spring runoff from April through early June — this is not prime time for the main river.
        However, the Paradise Valley spring creeks fish beautifully through spring, with
        blue-winged olive and midge hatches on warmer afternoons. The spring creeks' constant
        temperature means they're unaffected by runoff and provide excellent fishing when other
        waters are blown out. March brown hatches appear on the Yellowstone in April during
        lower-water windows. Mountain lakes remain ice-covered through May.
      </p>
      <p>
        <strong>Summer (June–August):</strong> The marquee season. The legendary salmonfly hatch
        arrives on the Yellowstone in late June to early July — enormous stoneflies blanketing the
        river and triggering aggressive surface feeding from the largest trout. The hatch moves
        upstream over 2–3 weeks, and following the front is a {townName} tradition. After the
        salmonflies, golden stoneflies keep the action going, followed by pale morning duns and
        caddis through July and August. The Yellowstone typically clears and drops to ideal flows
        by late June. Alpine lakes thaw and fish well from July through September. Summer evenings
        on the Yellowstone — with caddis swarms and rising trout as the light fades over the
        Absarokas — are among the finest experiences in American fly fishing.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Experienced {townName} anglers often name fall
        as the best season. Brown trout become aggressive ahead of their October spawning run,
        and streamer fishing with large articulated patterns produces the year's biggest fish.
        Blue-winged olives return on overcast autumn afternoons — sometimes the heaviest hatches
        of the year — and trout sip tiny mayflies with the Absaroka peaks dusted in early snow.
        The spring creeks continue to fish superbly. October's baetis hatches on DePuy Creek are
        legendary among technical fly fishers. Crowds thin dramatically after Labor Day.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Yellowstone River is fishable through
        winter for dedicated anglers, with midges bringing trout to the surface on warmer
        afternoons. The Paradise Valley spring creeks are the star of the winter season — their
        50°F water remains comfortable for trout and insects alike, producing midge and BWO
        hatches that keep fish feeding on the surface even when the surrounding valley is locked
        in snow. Rod fees on the spring creeks are typically lower in winter, and the experience
        of sight-fishing to rising trout on a January afternoon while steam rises from the
        creek's surface is uniquely {townName}. A post-fishing soak at Chico Hot Springs
        (21 miles south) completes the winter day.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has been a fly-fishing town since Dan Bailey opened his legendary shop in 1938,
        and the infrastructure reflects that heritage. Multiple fly shops in town carry local
        patterns, provide current hatch reports, and book guided trips on the Yellowstone and
        surrounding waters. Guide services offer drift-boat floats on the Yellowstone, walk-and-wade
        trips on the Boulder and Gallatin, and guided days on the Paradise Valley spring creeks
        (where a guide is highly recommended for first-time visitors). The spring creeks require
        advance reservations, especially during peak season — contact the individual creek operators
        directly for rod fees and availability. A Montana fishing license is required for anyone 12
        and older; licenses are available online at{' '}
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
