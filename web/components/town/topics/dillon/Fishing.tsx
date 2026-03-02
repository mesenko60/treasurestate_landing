import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  fishingAccess: RecPlace[];
  rivers: RecPlace[];
  lakes: RecPlace[];
};

const thStyle = { padding: '0.5rem' } as const;
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' } as const;
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

const speciesGuide = [
  { species: 'Brown Trout', water: 'Beaverhead River, Clark Canyon Reservoir', size: '14–22 in', technique: 'Nymphing, streamers, dry-fly' },
  { species: 'Rainbow Trout', water: 'Beaverhead River, Clark Canyon Reservoir', size: '14–20 in', technique: 'Nymphing, dry-fly, streamers' },
  { species: 'Westslope Cutthroat', water: 'Pioneer Mountain alpine lakes', size: '8–14 in', technique: 'Dry flies, small nymphs' },
  { species: 'Brook Trout', water: 'Pioneer Mountain alpine lakes, tributaries', size: '6–12 in', technique: 'Dry flies, spinners' },
  { species: 'Arctic Grayling', water: 'Big Hole River (upper)', size: '8–14 in', technique: 'Small dry flies, nymphs' },
  { species: 'Mountain Whitefish', water: 'Beaverhead, Jefferson, Big Hole rivers', size: '10–16 in', technique: 'Nymphing, small dries' },
];

const seasonalCalendar = [
  { season: 'Early Spring (March–April)', conditions: 'Pre-runoff window on Beaverhead; BWO and midge hatches; reservoir ice-off in April', rating: 'Good' },
  { season: 'Late Spring (May–June)', conditions: 'Runoff on rivers; Clark Canyon Reservoir and Poindexter Slough remain productive; alpine lakes ice-covered', rating: 'Fair' },
  { season: 'Summer (July–August)', conditions: 'Peak dry-fly season on Beaverhead; PMDs, caddis, hoppers; alpine lakes open; all rivers fishable', rating: 'Excellent' },
  { season: 'Early Fall (September–October)', conditions: 'Brown trout pre-spawn; streamer fishing peaks; Big Hole grayling active; low crowds', rating: 'Excellent' },
  { season: 'Late Fall (November)', conditions: 'Brown trout spawning; large fish moving; cold mornings, midday windows', rating: 'Good' },
  { season: 'Winter (December–February)', conditions: 'Beaverhead tailwater stays open and productive; midges; nymphing; solitude', rating: 'Good' },
];

export default function Fishing({ townName, slug, fishingAccess, rivers, lakes }: Props) {
  const nearLakes = lakes.slice(0, 12);

  return (
    <article className="content-section">
      <p>
        {townName} is arguably the best-positioned fishing basecamp in Montana. The Beaverhead
        River{'\u2014'}a blue-ribbon trout stream{'\u2014'}flows directly through town, and three more
        legendary rivers sit within an hour{'\u2019'}s drive: the Big Hole, the Madison, and the
        Jefferson. That{'\u2019'}s four world-class trout rivers accessible from a single small town
        of 4,000 people. Add 14 FWP fishing access sites, Clark Canyon Reservoir 20 miles south,
        Poindexter Slough{'\u2019'}s technical spring-creek fishing 3 miles out, and two dozen alpine
        lakes in the Pioneer Mountains, and the scope of the fishery becomes extraordinary.
        {townName}{'\u2019'}s fly shops and guide services have built their reputations on this
        concentration of quality water{'\u2014'}there is simply no bad direction to drive from town
        if you{'\u2019'}re carrying a rod. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>24 lakes</strong> within 50 miles</li>
        <li><strong>14 FWP fishing access sites</strong> within 20 miles</li>
        <li><strong>4 major rivers</strong> within day-trip range</li>
        <li><strong>Primary species:</strong> Brown trout, rainbow trout, westslope cutthroat, Arctic grayling, mountain whitefish</li>
        <li><strong>Signature fishery:</strong> Beaverhead River{'\u2014'}flows through town, trophy browns and rainbows to 22 inches</li>
        <li><strong>Spring creek:</strong> Poindexter Slough (3 mi){'\u2014'}technical fishing for large, educated trout</li>
        <li><strong>Unique species:</strong> Native fluvial Arctic grayling in the upper Big Hole River</li>
        <li><strong>Reservoir:</strong> Clark Canyon Reservoir (20 mi){'\u2014'}feeds the Beaverhead, excellent stillwater fishing</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Beaverhead River</h2>
      <p>
        The Beaverhead River is the centerpiece of {townName}{'\u2019'}s fishing identity and the
        reason many anglers make the drive to southwestern Montana. Fed by the cold, consistent
        releases from Clark Canyon Dam 20 miles south, the Beaverhead maintains ideal water
        temperatures and flows through the summer months when other Montana rivers run warm and
        low. This tailwater character produces trophy-sized trout{'\u2014'}brown trout and rainbow
        trout commonly measuring 18 to 22 inches, with fish exceeding 24 inches taken every
        season. The Beaverhead is not a numbers river; it is a quality river where every fish
        earned feels significant.
      </p>

      <h3>Species & Character</h3>
      <p>
        Brown trout are the Beaverhead{'\u2019'}s headline species{'\u2014'}heavy-bodied fish that hold
        in undercut banks, logjams, and the deeper runs that characterize much of the river
        between Clark Canyon Dam and the confluence with the Ruby River at Twin Bridges. Rainbow
        trout share the river in strong numbers, often in the faster riffles and runs. Mountain
        whitefish round out the cold-water community. The river{'\u2019'}s substrate is cobble and
        gravel, with dense aquatic vegetation in many sections that harbors enormous populations
        of scuds, sowbugs, mayfly nymphs, and caddis larvae{'\u2014'}the forage base that grows
        these large trout.
      </p>

      <h3>Techniques</h3>
      <p>
        The Beaverhead demands technical fishing. The river is not wide{'\u2014'}often 40 to 60
        feet across{'\u2014'}and trout that see steady angling pressure throughout the season
        require precise presentations. Nymphing with small patterns (size 16{'\u2013'}20 scuds,
        sowbugs, and PMD nymphs) under an indicator is the most consistent technique, but the
        reward comes when hatches bring fish to the surface. Pale morning duns (July{'\u2013'}August),
        caddis (June{'\u2013'}September), and blue-winged olives (spring and fall) produce dry-fly
        opportunities that test an angler{'\u2019'}s casting accuracy. Streamer fishing with sculpin
        and leech patterns works well for targeting the largest browns, especially during fall
        and in low-light conditions.
      </p>

      <h3>Access & Float Sections</h3>
      <p>
        The most popular float section runs from Pipe Organ FAS (13 miles south) or Henneberry
        FAS (14 miles south) downstream to access points near town. This middle section of the
        Beaverhead offers the highest concentration of large trout and the most consistent flows.
        The upper river immediately below Clark Canyon Dam holds excellent fish but is narrower
        and more technical to float. Wade fishing is productive throughout, particularly at the
        named FAS sites where bank access is maintained. Poindexter Slough FAS (3 miles),
        Highway 91 Bridge FAS (3 miles), and Corrals FAS (9 miles) provide the closest access
        to {townName}.
      </p>

      <h2>Poindexter Slough</h2>
      <p>
        Three miles from downtown {townName}, Poindexter Slough is a spring creek that branches
        from and parallels the Beaverhead River before rejoining it downstream. This small,
        clear stream holds disproportionately large and notoriously selective trout in a
        spring-creek environment that humbles experienced anglers. The water is gin-clear
        and shallow{'\u2014'}trout are visible but so is your leader, your shadow, and every
        imperfect drift. Weed beds line the bottom, providing cover and forage that grow
        fat fish in a narrow channel.
      </p>
      <p>
        Poindexter Slough is strictly a technical fishing experience. Long leaders (12 feet
        minimum, often 15), fine tippets (5X to 7X), and precise dry-fly and emerger
        presentations are standard. The slough produces excellent hatches of PMDs, tricos,
        and blue-winged olives. Fish commonly run 16 to 20 inches despite the stream{'\u2019'}s
        modest size. Special regulations apply{'\u2014'}check current Montana FWP rules before
        fishing. For anglers who appreciate spring-creek challenge, Poindexter is one of
        the finest in the northern Rockies and alone justifies a trip to {townName}.
      </p>

      <h2>Big Hole River</h2>
      <p>
        The Big Hole River, 44 miles northwest of {townName}, holds a distinction shared by no
        other river in the lower 48 states: it sustains a native population of fluvial Arctic
        grayling{'\u2014'}a species that once ranged across the upper Missouri basin but now survives
        only in the Big Hole{'\u2019'}s upper reaches. These beautiful, sail-finned fish are a living
        remnant of Montana{'\u2019'}s Ice Age aquatic heritage. Catching a native grayling on a dry
        fly in the upper Big Hole is one of the most meaningful angling experiences available
        in Montana{'\u2014'}and it{'\u2019'}s available from {townName} as a day trip.
      </p>
      <p>
        Beyond grayling, the Big Hole is a superb trout river in its own right. Brown trout
        and rainbow trout populate the middle and lower reaches in excellent numbers, with
        brook trout in the upper river and tributaries. The Big Hole is famous for its
        salmonfly hatch{'\u2014'}enormous stoneflies (Pteronarcys californica) that emerge in June
        and draw the river{'\u2019'}s largest trout to the surface in a feeding frenzy that ranks
        among the premier hatch events in American fly fishing. The river{'\u2019'}s character
        ranges from intimate meadow water in the upper valley to powerful canyon runs in
        the lower stretches. Special grayling regulations restrict fishing methods and seasons
        on certain sections{'\u2014'}check Montana FWP for current closures and gear restrictions.
      </p>

      <h2>Madison River</h2>
      <p>
        The Madison River at Ennis, 45 miles northeast of {townName}, is one of the most famous
        trout rivers in the world. Born at the confluence of the Firehole and Gibbon rivers in
        Yellowstone National Park, the Madison flows north through the Madison Valley{'\u2014'}a broad
        corridor between the Madison Range and the Tobacco Root Mountains{'\u2014'}past Ennis and into
        Ennis Lake before plunging through Bear Trap Canyon to the Missouri headwaters. The
        50-mile stretch between Quake Lake and Ennis Lake is the legendary water: a continuous
        riffle of pocket water, runs, and pools holding enormous populations of brown trout
        and rainbow trout.
      </p>
      <p>
        The Madison{'\u2019'}s reputation rests on its consistency and sheer biomass. This is not a
        river where you might get skunked{'\u2014'}the trout density supports steady action on
        nymphs, dry-dropper rigs, and streamers throughout the season. The salmonfly hatch
        (late June) and caddis emergences (July{'\u2013'}August) produce surface activity that
        borders on the surreal. Fall brings blue-winged olive hatches and streamer fishing
        for pre-spawn browns. The drive from {townName} to Ennis crosses the scenic Ruby
        Valley{'\u2014'}less than an hour on good roads{'\u2014'}making the Madison a practical day trip
        that expands {townName}{'\u2019'}s already remarkable fishing portfolio.
      </p>

      <h2>Jefferson River</h2>
      <p>
        The Jefferson River, 51 miles north of {townName}, is formed by the confluence of the
        Beaverhead and Big Hole rivers at Twin Bridges and flows northeast to the Missouri
        headwaters at Three Forks. The Jefferson is the overlooked gem among {townName}{'\u2019'}s
        accessible rivers{'\u2014'}a broad, cottonwood-lined waterway that receives a fraction of
        the fishing pressure directed at the Beaverhead and Madison. Float fishing by drift
        boat or raft is the most productive approach, covering miles of water and accessing
        bank structure where large brown trout hold.
      </p>
      <p>
        The Jefferson{'\u2019'}s brown trout fishery improves in the fall, when fish move upstream
        from the Missouri headwaters to spawn. Hopper-dropper fishing in late summer and
        streamer fishing through October are particularly effective. The river{'\u2019'}s low profile
        among visiting anglers is an advantage{'\u2014'}solitude on the Jefferson is easier to find
        than on any of {townName}{'\u2019'}s other rivers, and the fish are less pressured and often
        more willing.
      </p>

      <h2>Clark Canyon Reservoir</h2>
      <p>
        Clark Canyon Reservoir sits 20 miles south of {townName} at the head of the Beaverhead
        River, impounding the waters of the Red Rock River and Horse Prairie Creek where they
        converge in a broad valley below the Continental Divide. The reservoir serves a dual
        role in {townName}{'\u2019'}s fishing economy: its cold-water releases create the tailwater
        conditions that make the Beaverhead a trophy trout stream, and the reservoir itself
        offers excellent stillwater fishing for rainbow trout and brown trout.
      </p>
      <p>
        Rainbow trout are the primary target at Clark Canyon, with fish averaging 15 to 18
        inches and larger specimens taken regularly. Brown trout provide additional opportunity,
        particularly in fall when they stage near tributary inlets. Shore fishing is productive
        along rocky points and near the dam, while float tubes and small boats allow access
        to deeper water. Ice fishing draws a dedicated following in winter{'\u2014'}the reservoir
        produces well through the ice for trout targeting scuds and chironomid larvae.
        The reservoir{'\u2019'}s Lewis and Clark historical significance (Captain Clark{'\u2019'}s
        expedition passed through this valley in August 1805) adds context to a day on the water.
      </p>

      <h2>Fishing Access Sites</h2>
      <p>
        {townName} benefits from 14 FWP fishing access sites within 20 miles{'\u2014'}a dense network
        that provides bank fishing options, wade access, and boat launch facilities along the
        Beaverhead River corridor. These sites form the backbone of both guided float trips and
        walk-and-wade fishing near town. The closest sites{'\u2014'}Poindexter Slough and Highway 91
        Bridge at 3 miles{'\u2014'}are within minutes of downtown, while sites like Pipe Organ (13
        miles) and Henneberry (14 miles) provide access to the mid-river section where the
        Beaverhead{'\u2019'}s largest fish concentrate. Buffalo Bridge Boat Launch (18 miles) and
        Glen (18 miles) serve the upper Beaverhead below Clark Canyon Dam.
      </p>
      {fishingAccess.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>Access Site</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {fishingAccess.map(f => (
              <tr key={f.name} style={rowStyle}>
                <td style={tdStyle}>{f.name}</td>
                <td style={tdRightStyle}>{f.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Alpine Lakes</h2>
      <p>
        The Pioneer Mountains west of {townName} hold two dozen lakes within 50 miles, many
        accessible only by hiking trails that climb into alpine basins between 7,500 and 9,500
        feet. These high-country lakes hold populations of westslope cutthroat trout and brook
        trout{'\u2014'}smaller fish than the Beaverhead{'\u2019'}s trophies, but eager surface feeders in
        spectacular settings. Tash Pond (3 miles) offers the closest stillwater option near
        town. Deeper into the Pioneers, Deerhead Lake (21 miles), Boot Lake (22 miles), Anchor
        Lake (23 miles), and Hopkins Lake (26 miles) provide backcountry fishing experiences
        that combine hiking and angling in some of southwestern Montana{'\u2019'}s most pristine
        alpine terrain.
      </p>
      <p>
        Alpine lake fishing peaks from mid-July through September, after ice-off opens the
        basins. Small dry flies{'\u2014'}elk hair caddis, parachute Adams, stimulators{'\u2014'}are
        effective on cutthroat that see minimal pressure. Brook trout in some lakes respond
        to nearly any presentation. Float tubes extend the reach of stillwater anglers on
        the larger lakes, though the hike-in requirement limits their practicality to the
        most dedicated. The Pioneer Mountains Scenic Byway provides access to most trailheads;
        for detailed trail descriptions, see the{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
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

      <h2>Rivers</h2>
      {rivers.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>River</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {rivers.map(r => (
              <tr key={r.name} style={rowStyle}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdRightStyle}>{r.distMiles === 0 ? 'Through town' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Species Guide</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={headRowStyle}>
            <th style={thStyle}>Species</th>
            <th style={thStyle}>Primary Water</th>
            <th style={thStyle}>Typical Size</th>
            <th style={thStyle}>Technique</th>
          </tr>
        </thead>
        <tbody>
          {speciesGuide.map(s => (
            <tr key={s.species} style={rowStyle}>
              <td style={tdStyle}><strong>{s.species}</strong></td>
              <td style={tdStyle}>{s.water}</td>
              <td style={tdStyle}>{s.size}</td>
              <td style={tdStyle}>{s.technique}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Seasonal Calendar</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={headRowStyle}>
            <th style={thStyle}>Season</th>
            <th style={thStyle}>Conditions & Hatches</th>
            <th style={thStyle}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {seasonalCalendar.map(s => (
            <tr key={s.season} style={rowStyle}>
              <td style={tdStyle}><strong>{s.season}</strong></td>
              <td style={tdStyle}>{s.conditions}</td>
              <td style={tdStyle}>{s.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Local Resources</h2>
      <p>
        {townName}{'\u2019'}s fly fishing guide services and outfitters are among the most
        experienced in the state, with deep knowledge of the Beaverhead{'\u2019'}s technical demands
        and the seasonal rhythms of all four river systems. A guided float on the Beaverhead
        is the best introduction for visiting anglers{'\u2014'}the guides know where the big fish
        hold and how to present to them in a river that punishes careless technique. Outfitters
        also offer trips to the Big Hole, Madison, and Jefferson, as well as backcountry
        alpine lake excursions.
      </p>
      <p>
        A Montana fishing license is required for anyone 12 and older. Licenses are available
        online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local fly shops in {townName}. Non-resident licenses are available for durations
        ranging from two days to a full season. Special regulations apply to Poindexter Slough,
        sections of the Big Hole River (grayling protections), and Clark Canyon Reservoir{'\u2014'}always
        check current FWP regulations before fishing unfamiliar water.
      </p>
      <p>
        For hiking trails to alpine fishing lakes and other outdoor activities near {townName}, see
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link>.
      </p>
    </article>
  );
}
