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
        {townName} sits at the crossroads of southwestern Montana's finest trout rivers — a
        region where blue-ribbon water, rare native fish, and sheer variety of angling
        opportunities rival anywhere in the Rocky Mountain West. The Big Hole River, 38 miles
        southwest, carries the last fluvial population of Arctic grayling in the contiguous
        United States — a living relic of the Ice Age found nowhere else in the lower 48 in
        its native river habitat. The Beaverhead River, a tailwater below Clark Canyon Dam 55
        miles south, holds over 3,000 trout per mile with brown trout regularly exceeding 20
        inches. The Jefferson River flows just 27 miles east as {townName}'s closest major
        river, and the legendary Madison River at Ennis lies 60 miles southeast. With 69 lakes
        within 50 miles — many of them high-mountain cirque lakes holding brook trout and
        cutthroat — and five FWP fishing access sites, {townName} is one of Montana's
        most underrated fishing bases. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>69 lakes</strong> within 50 miles</li>
        <li><strong>5 fishing access sites</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Brown trout, rainbow trout, brook trout, Arctic grayling, cutthroat trout, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Big Hole River (38 mi) — blue-ribbon trout river, only fluvial Arctic grayling in the lower 48</li>
        <li><strong>Closest major river:</strong> Jefferson River, 27 miles east</li>
        <li><strong>Closest fishing access:</strong> Cardwell Bridge, 30 miles</li>
        <li><strong>Closest lake fishery:</strong> Georgetown Lake, ~30 miles west</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Big Hole River</h2>
      <p>
        The Big Hole River is the defining fishery of the {townName} region and one of the
        most ecologically significant trout streams in North America. Designated a blue-ribbon
        trout river by Montana FWP, the Big Hole flows 153 miles through a broad, hay-meadow
        valley flanked by the Pioneer and Bitterroot mountains before joining the Beaverhead
        to form the Jefferson. The river holds healthy populations of brown trout and rainbow
        trout throughout its length, with fish averaging 12 to 18 inches and larger fish
        regularly taken in the deeper runs and undercut banks of the lower river.
      </p>
      <p>
        What makes the Big Hole truly extraordinary is its Arctic grayling — the only
        remaining fluvial (river-dwelling) population of this species in the contiguous United
        States. These fish, with their sail-like dorsal fins and iridescent coloring, once
        ranged across the upper Missouri basin but have been reduced to the upper Big Hole as
        their last stronghold south of Canada. Grayling are found primarily in the upper river
        above Wisdom, where the cold, clean water flowing off the Continental Divide
        maintains the conditions they require. Anglers targeting grayling should use barbless
        hooks and practice careful catch-and-release — this is a population measured in
        hundreds, not thousands. Check current FWP regulations before fishing, as special
        restrictions may apply to protect grayling during vulnerable periods.
      </p>
      <p>
        The Big Hole is classic wade-fishing water. Unlike the broad Missouri tailwater near
        Helena, the Big Hole is intimate — a medium-sized river that can be waded and cast
        across in most stretches. The salmonfly hatch in mid-June draws anglers from around
        the world as these giant stoneflies emerge from the cobble bottom and trout feed
        aggressively on the surface. Pale morning duns, caddis, and terrestrials carry the
        dry-fly fishing through summer. Float fishing is popular on the lower river below
        Divide, while the upper river above Wisdom is best explored on foot.
      </p>

      <h2>The Beaverhead River</h2>
      <p>
        The Beaverhead River, 55 miles south of {townName} below Clark Canyon Dam, is one of
        Montana's premier tailwater fisheries. Dam-controlled releases from Clark Canyon
        Reservoir maintain cold, consistent flows that support astonishing trout densities —
        over 3,000 trout per mile in the upper reaches, predominantly large brown trout with
        fish regularly exceeding 20 inches. The Beaverhead is technical water: the river is
        narrow, willow-lined, and filled with undercut banks, logjams, and tight casting
        situations. This is not beginner water — the fish are large but educated, and precise
        presentations with small nymphs and streamers produce better than casual approaches.
      </p>
      <p>
        The upper Beaverhead from Clark Canyon Dam to Barretts is the most productive stretch,
        with consistent hatches of pale morning duns, blue-winged olives, and caddis from May
        through October. Float fishing in drift boats or rafts is the standard approach on the
        lower river, while the upper tailwater section is wadeable in many places. The
        Beaverhead feeds into the Jefferson River at Twin Bridges — anglers fishing both rivers
        in a single trip can experience two very different trout-fishing personalities within
        an hour's drive.
      </p>

      <h2>The Jefferson River</h2>
      <p>
        The Jefferson River is {townName}'s closest major trout river at 27 miles east. Formed
        by the confluence of the Beaverhead, Big Hole, and Ruby rivers near Twin Bridges, the
        Jefferson flows north through a broad agricultural valley before joining the Madison
        and Gallatin at Missouri Headwaters State Park to form the Missouri River. Brown trout
        are the primary species, with fish averaging 13 to 17 inches in the deeper pools and
        runs. The Jefferson is a warmer, slower river than its tributaries — water temperatures
        rise in late summer, shifting fish activity to early morning and evening. It fishes
        best in late spring before runoff peaks and again in early fall when flows drop and
        water cools.
      </p>
      <p>
        The Jefferson is less pressured than the Big Hole or Beaverhead and offers a quieter,
        more solitary fishing experience. Float fishing covers more water efficiently on this
        meandering river, though wade access is available at bridge crossings and FWP access
        sites. Streamers and nymphs produce consistently; dry-fly opportunities are best
        during evening caddis hatches and hopper season in August and September.
      </p>

      <h2>The Madison River</h2>
      <p>
        The Madison River at Ennis, 60 miles southeast of {townName}, is one of the most
        famous trout rivers in the world. While it's a longer drive than the Big Hole or
        Jefferson, the Madison's legendary hatches and consistent trophy-class trout make it
        a natural day-trip destination from {townName}. The 50-mile stretch between Quake Lake
        and Ennis Lake — known simply as "the fifty" — holds rainbow and brown trout in
        water that ranges from fast pocket water to long, glassy runs. The salmonfly hatch
        in late June, followed by caddis and PMDs through summer, makes the Madison
        world-class dry-fly water.
      </p>

      <h2>Mountain Lakes</h2>
      <p>
        With 69 lakes within 50 miles, {townName} has access to an exceptional network of
        stillwater fishing. Georgetown Lake, approximately 30 miles west near Anaconda, is
        the most popular — a shallow, nutrient-rich lake at 6,300 feet that produces large
        rainbow trout and brook trout. Georgetown is well known for consistent hatches of
        Callibaetis mayflies and damselflies that bring trout to the surface, making it
        outstanding fly-fishing water from a float tube or small boat. Ice fishing at
        Georgetown Lake is a winter tradition, with brook trout and rainbow trout active
        under the ice from December through March.
      </p>
      <p>
        Beyond Georgetown, the Pioneer Mountains and Anaconda-Pintler Wilderness hold dozens
        of alpine lakes — many stocked with brook trout or westslope cutthroat trout by
        Montana FWP. These high lakes typically sit between 7,000 and 9,000 feet and require
        hikes of 2 to 8 miles. Lake Louise, Lost Cabin Lake, and numerous unnamed cirque
        lakes in the Pioneers offer backcountry fishing in spectacular alpine settings with
        very few other anglers. The fish tend to be smaller than in the rivers — 8 to 14
        inches is typical — but the combination of solitude, scenery, and eager fish on
        dry flies makes alpine lake fishing one of {townName}'s hidden strengths.
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
        {townName}'s position at the headwaters of the Jefferson River system puts multiple
        blue-ribbon fisheries within a 90-minute drive. The <strong>Big Hole River</strong> (38
        miles southwest) is the signature water — a blue-ribbon trout river harboring the
        world's only fluvial Arctic grayling population in the lower 48 states. The{' '}
        <strong>Beaverhead River</strong> (55 miles south) is a technical tailwater with 3,000+
        trout per mile and trophy-class brown trout. The <strong>Jefferson River</strong> (27
        miles east) offers the closest major-river fishing with solid brown trout populations.
        The <strong>Madison River</strong> (60 miles southeast) needs no introduction — one of
        the world's premier trout streams. Together, these rivers represent a concentration of
        blue-ribbon trout water unmatched in Montana outside the greater Yellowstone region.
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
        Five Montana FWP fishing access sites lie within 50 miles of {townName}, concentrated
        along the Jefferson River corridor to the east. Cardwell Bridge (30 miles) is the
        closest, providing boat and wade access to the Jefferson near the mouth of the Boulder
        River. Glen (38 miles) and Red Bridge (38 miles) offer access to the upper Jefferson
        near its formation at Twin Bridges. Comers Point (39 miles) and Notch Bottom (40 miles)
        round out the options along the Jefferson. Additional informal access points exist on
        the Big Hole River and at Georgetown Lake, though formal FWP sites are more limited
        in the immediate {townName} area. Always check current access conditions and respect
        private land boundaries.
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
        <strong>Spring (March–May):</strong> Rivers run high with snowmelt from the surrounding
        mountains. The Jefferson and lower Big Hole become fishable as runoff recedes in late
        May. The Beaverhead tailwater fishes well through spring thanks to dam-controlled flows,
        making it the most reliable early-season option. Georgetown Lake ice-off typically
        occurs in late April, with rainbow trout feeding aggressively in the shallows. Blue-
        winged olive hatches begin on the Beaverhead in March on warmer afternoons.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season on all waters. The Big Hole's
        legendary salmonfly hatch erupts in mid-June, moving upstream over two to three weeks
        and producing explosive surface action for brown and rainbow trout. Following the
        salmonflies, pale morning duns, caddis, and golden stoneflies sustain dry-fly fishing
        through July. Terrestrial patterns — hoppers, ants, beetles — take over in August on
        all rivers. Georgetown Lake's Callibaetis hatches peak in July, with consistent evening
        rises through summer. Mountain lake access opens as snow melts from high trails in late
        June and July. Watch water temperatures on the Jefferson in August — trout become
        stressed above 68°F.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced anglers consider fall the
        finest season in the {townName} region. Brown trout on the Big Hole, Beaverhead, and
        Jefferson become aggressive as they stage for their October–November spawning run.
        Streamer fishing produces the year's largest fish on all three rivers. Blue-winged
        olive hatches return on overcast autumn days, sometimes the heaviest hatches of the
        year. Georgetown Lake brook trout move into the shallows for fall spawning, offering
        excellent fly fishing into October. The upper Big Hole grayling are most active
        in early fall before water temperatures drop.
      </p>
      <p>
        <strong>Winter (December–February):</strong> Georgetown Lake ice fishing is a regional
        tradition — brook trout and rainbow trout remain active under the ice, with anglers
        jigging small flies and bait through drilled holes. The Beaverhead tailwater remains
        fishable year-round; midging with small nymphs under an indicator is the standard
        winter technique, with occasional surface activity on warmer afternoons. The Big Hole
        and Jefferson are largely dormant in winter due to cold temperatures and ice. Mountain
        lakes are frozen and inaccessible. Hot springs at Fairmont (15 miles) make an excellent
        post-fishing winter warm-up.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} and the surrounding communities of Twin Bridges, Dillon, and Wise River serve
        as bases for the Big Hole, Beaverhead, and Jefferson fisheries. Fly shops in these towns
        provide current river conditions, hatch reports, and guide services for float and wade
        trips. The Big Hole River is served by outfitters based primarily in Wise River and Twin
        Bridges, while the Beaverhead is covered by Dillon-area shops and guides. A Montana
        fishing license is required for anyone 12 and older; licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. Special regulations apply on portions of the
        Big Hole to protect Arctic grayling — check current FWP regulations before fishing.
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
