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
        {townName} has something almost no other Montana city can claim — the Missouri River
        flows directly through town, just one mile from downtown, carrying brown and rainbow
        trout past city parks and beneath highway bridges. But the in-town Missouri is only the
        beginning. Forty-six miles downstream lies the Missouri River at Craig, the same
        world-class tailwater that draws fly anglers from around the globe to Helena's doorstep,
        holding 4,000+ trout per mile in cold, dam-regulated water. The Sun River drains the
        Bob Marshall Wilderness 29 miles to the west, the legendary Smith River awaits
        permit-holders 39 miles away, and Giant Springs State Park houses one of Montana's
        most important fish hatcheries. With 11 lakes and multiple rivers within reach,
        {townName} is an underappreciated fishing base. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>11 lakes</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Brown trout, rainbow trout, mountain whitefish, walleye, northern pike</li>
        <li><strong>In-town fishery:</strong> Missouri River at {townName} — 1 mile from downtown</li>
        <li><strong>Signature tailwater:</strong> Missouri River at Craig (46 mi) — 4,000+ trout per mile</li>
        <li><strong>Permit-only float:</strong> Smith River (39 mi) — lottery system for float permits</li>
        <li><strong>Closest river:</strong> Missouri River, 1 mile — flows through the city</li>
        <li><strong>Fish hatchery:</strong> Giant Springs State Fish Hatchery at Giant Springs State Park (4 mi)</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Missouri River at {townName}</h2>
      <p>
        The Missouri River's passage through {townName} is the city's defining geographic
        feature and its most accessible fishery. The river enters the city from the southwest,
        tumbles over the series of falls and dams that give the city its name, and flows
        northeast toward Fort Benton and the Missouri Breaks. Above the dams, the river holds
        rainbow trout, brown trout, and mountain whitefish in cold, clear water. Below the
        falls, the river transitions to warmer water with walleye, northern pike, sauger, and
        smallmouth bass joining the mix — a diverse urban fishery accessible from the River's
        Edge Trail and city park access points.
      </p>
      <p>
        Giant Springs State Park (4 miles from downtown) is the best access point for the
        upper Missouri in the {townName} area. The park sits at the outflow of Giant Springs —
        one of the largest freshwater springs in the world — where a constant 54°F water
        temperature sustains year-round trout populations. The Giant Springs State Fish Hatchery,
        located within the park, raises rainbow trout for stocking across Montana, and the
        spring outflow itself holds wild trout in crystal-clear water. Shore fishing along the
        Missouri within the park is productive, and the short Roe River — one of the world's
        shortest — connects the spring to the Missouri through a channel that trout frequently
        enter.
      </p>

      <h2>The Missouri River Tailwater at Craig</h2>
      <p>
        The Missouri River below Holter Dam — 46 miles southeast of {townName} near the town
        of Craig — is one of the premier trout streams in the United States. This is the same
        legendary tailwater accessible from Helena, and {townName} anglers share it as a
        primary destination. The 35-mile stretch from Holter Dam downstream consistently holds
        4,000 to 5,000 trout per mile — predominantly rainbow and brown trout in the 14- to
        20-inch range, with fish exceeding 20 inches taken regularly. Cold, stable water
        temperatures maintained by dam releases create ideal conditions for prolific insect
        hatches year-round.
      </p>
      <p>
        Drift-boat fishing is the standard approach on the Craig tailwater, with outfitters
        running full-day floats through the canyon below the dam. Wade fishing is productive at
        access points near Craig and at the Dearborn River confluence. The Mother's Day caddis
        hatch in mid-May is legendary — blizzard hatches of caddis flies blanket the water
        and produce explosive dry-fly action. Pale morning duns carry the summer, tricos take
        over in July and August, and blue-winged olives return for outstanding fall fishing
        on overcast afternoons. The tailwater fishes well even in winter, with midge hatches
        bringing trout to the surface on warmer days.
      </p>

      <h2>The Smith River</h2>
      <p>
        The Smith River (39 miles from {townName}) is one of Montana's most coveted fishing
        and floating experiences — a 59-mile, multi-day canyon float through remote limestone
        gorges accessible only by raft, canoe, or drift boat. Access is controlled by a
        competitive lottery permit system administered by Montana FWP, with the float season
        running from late May through early July depending on water conditions. Brown trout and
        rainbow trout inhabit the river, and the canyon scenery — towering limestone walls,
        cave openings, and old-growth ponderosa pine — is spectacular.
      </p>
      <p>
        {townName} is one of the closest cities to the Smith River put-in at Camp Baker,
        making it an ideal staging point for Smith River float trips. The permit lottery is
        highly competitive — applications open in February for the upcoming season, and demand
        far exceeds supply. For anglers who draw a permit, the Smith offers a rare combination
        of wilderness solitude, quality trout fishing, and multi-day river camping that few
        other experiences in Montana can match. Check{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        for current lottery deadlines and float conditions.
      </p>

      <h2>The Sun River</h2>
      <p>
        The Sun River (29 miles west) drains the eastern slope of the Rocky Mountain Front and
        the Bob Marshall Wilderness, flowing east through Sun River Canyon before reaching the
        plains and eventually joining the Missouri south of {townName}. The upper Sun River
        above Gibson Reservoir holds cutthroat and rainbow trout in cold, freestone water
        surrounded by dramatic mountain scenery. Below the reservoir, the river warms and
        widens through agricultural bottomlands, supporting brown trout, rainbow trout, and
        mountain whitefish. The Sun River is less pressured than the Missouri tailwater at Craig
        and offers a more intimate freestone fishing experience, with wading access at bridge
        crossings and BLM land along the river corridor.
      </p>

      <h2>The Lakes</h2>
      <p>
        {townName} has 11 lakes within 50 miles — fewer than Helena's reservoir chain but
        offering a mix of fishing opportunities. Several smaller lakes and reservoirs in the
        surrounding prairie provide warmwater fishing for walleye, northern pike, and perch,
        while mountain lakes along the Rocky Mountain Front hold trout in alpine settings.
        Lake access on the plains is generally straightforward with developed boat ramps and
        shore-fishing areas. The contrast between prairie reservoir fishing and mountain lake
        fishing is striking — a single day can take you from casting for pike on a windswept
        plains reservoir to fishing for cutthroat in a cirque lake beneath the Continental
        Divide.
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
        Beyond the Missouri and the tailwater at Craig, {townName} is within reach of several
        significant Montana rivers. The <strong>Sun River</strong> (29 miles) is the closest
        major freestone stream, offering rainbow and brown trout in a scenic Front Range
        setting. The <strong>Smith River</strong> (39 miles) is the legendary permit-only float
        detailed above. The <strong>Missouri River at Craig</strong> (46 miles) is the
        world-class tailwater that anchors the region's fishing reputation. Together, these
        rivers give {townName} anglers access to three fundamentally different fishing
        experiences — urban river, freestone stream, and dam-regulated tailwater — all within
        an hour's drive.
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
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{r.distMiles <= 1 ? 'Through town' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Fishing Access Sites</h2>
      <p>
        Formal FWP fishing access sites near {townName} are limited — only one designated site,
        Pelican Point FAS (31 miles), falls within 50 miles. However, public fishing access is
        more abundant than the formal count suggests. Giant Springs State Park provides excellent
        Missouri River shore access within the city, and multiple city park access points along
        the River's Edge Trail reach the Missouri's banks. The Craig tailwater has well-developed
        boat launches and wade-fishing access at bridge crossings. Sun River access is available
        at bridge crossings and on BLM land along the river corridor. Smith River access is
        controlled through the permit system at Camp Baker.
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
        <strong>Spring (March–May):</strong> The Missouri through {townName} fishes well from
        ice-off, with brown trout active on streamers and nymphs as water temperatures rise.
        The Craig tailwater's blue-winged olive hatches begin as early as March, and the
        legendary Mother's Day caddis hatch in mid-May produces some of the year's best dry-fly
        action. Sun River runoff typically peaks in May and June — fish the lower Sun during
        clearing conditions for aggressive post-runoff trout. Smith River float permits run
        from late May into July depending on water levels.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season across all waters. The Missouri
        through town offers early morning and evening fishing to avoid midday heat. The Craig
        tailwater's stable flows maintain excellent fishing through summer — pale morning dun
        hatches in June and July, tricos in July and August. The Sun River fishes best with
        terrestrial patterns — hoppers, beetles, and ants — from July into September. Giant
        Springs' constant-temperature water provides reliable fishing even on the hottest days.
        Water temperatures on the in-town Missouri rise in August, pushing trout activity to
        dawn and dusk.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced anglers consider fall the
        best season on the Missouri. Brown trout become aggressive ahead of their October–
        November spawn, and streamer fishing on both the Craig tailwater and the in-town
        Missouri produces some of the year's largest fish. Blue-winged olives return on overcast
        autumn afternoons for outstanding dry-fly fishing. The Sun River is excellent in early
        fall with lower, clearer flows and reduced angling pressure. Fall colors along the
        Missouri cottonwood corridors make this a scenic time to fish.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Missouri through {townName} remains
        fishable year-round in open water sections, though ice forms along the banks and in
        slower pools. The Craig tailwater is the primary winter destination — midges are the
        dominant hatch, and nymphing with small midge patterns under an indicator is the
        standard technique. Warmer winter afternoons can bring trout to midge clusters on the
        surface. Giant Springs' spring-fed water never freezes and provides reliable winter
        trout fishing within the city. Ice fishing on prairie reservoirs targets walleye,
        perch, and northern pike.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has a well-established fly-fishing community supported by local fly shops
        and outfitters. Shops in town carry gear and provide current conditions for the in-town
        Missouri, Sun River, and the Craig tailwater. Craig-based outfitters — roughly an hour
        south — are the go-to for guided drift-boat trips on the Missouri tailwater. The Giant
        Springs Fish Hatchery at Giant Springs State Park is open to visitors and provides an
        educational look at Montana's trout-stocking program. A Montana fishing license is
        required for anyone 12 and older; licenses are available online at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season. Smith River float permits are awarded by
        lottery — applications open in February; check FWP for current deadlines.
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
