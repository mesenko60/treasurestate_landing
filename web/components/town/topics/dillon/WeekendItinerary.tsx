import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const thStyle = { padding: '0.5rem' } as const;
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' } as const;
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && h.distMiles <= 40)
    .slice(0, 8);
  const hotSprings = highlights
    .filter(h => h.type === 'Hot Spring')
    .slice(0, 8);
  const stateParks = highlights
    .filter(h => h.type === 'State Park')
    .slice(0, 6);
  const historicSites = highlights
    .filter(h => h.type === 'Historic Site' && h.distMiles <= 40)
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you in the quiet heart of southwestern Montana —
        a ranching and university town of 3,880 people at 5,095 feet in the broad
        Beaverhead Valley, where blue-ribbon trout streams, ghost towns, hot springs,
        and Lewis &amp; Clark history converge within an easy drive. {townName} lacks
        the tourist infrastructure of Bozeman or Whitefish, and that's part of the
        appeal: this is authentic small-town Montana with genuine outdoor access and
        almost no crowds. The Beaverhead River runs through town — one of the finest
        brown trout fisheries in the state — and the Pioneer Mountains rise to over
        10,000 feet to the west. Bannack State Park, Montana's first territorial
        capital turned ghost town, sits 18 miles south. Six hot springs lie within
        50 miles. This three-day itinerary covers the essentials for first-time
        visitors, couples, anglers, and history buffs — adjust based on season and
        energy level. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is prime season for fishing, hiking,
        and exploring ghost towns and hot springs under long, warm days. July and
        August bring the warmest weather{summerClimate ? ` — highs around ${summerClimate.avgHigh}°F with lows near ${summerClimate.avgLow}°F` : ''}{' '}
        — but even midsummer evenings cool quickly at this elevation, so bring a
        jacket. September is arguably the best month: warm days, crisp nights, golden
        cottonwoods along the Beaverhead, thinning crowds, and prime fall fishing.
      </p>
      <p>
        {townName} has year-round appeal, though. Winter brings uncrowded skiing at
        Maverick Mountain (38 miles), hot springs soaking, and a slower pace
        downtown{winterClimate ? ` — expect highs around ${winterClimate.avgHigh}°F and lows near ${winterClimate.avgLow}°F in January` : ''}.
        Spring and fall shoulder seasons are quiet and atmospheric, with wildflowers
        in May and elk bugling through September.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June–September for fishing and hiking; December–March for skiing and hot springs</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — dry heat with cool evenings at 5,095 feet</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}°F, lows near {winterClimate.avgLow}°F — cold and dry with moderate snowfall</li>}
        <li><strong>Getting here:</strong> I-15 from Butte (65 miles north) or Idaho Falls (160 miles south); nearest commercial airport is Butte (BTM) or Bozeman (BZN, 110 miles)</li>
        <li><strong>Getting around:</strong> Car essential; downtown {townName} is walkable but all major attractions require driving</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and {townName}'s lodging and dining are significantly cheaper than resort towns</li>
        <li><strong>Key distances:</strong> Bannack State Park 18 mi, Elkhorn Hot Springs 30 mi, Virginia City 34 mi, Maverick Mountain 38 mi</li>
      </ul>

      <h2>Friday Evening: Arrive &amp; Settle In</h2>

      <h3>Check In</h3>
      <p>
        Arrive in {townName} and check into your lodging. For anglers, the{' '}
        <strong>Angler Village Inn</strong> caters to fly-fishing visitors with
        convenient river access and guide connections. The <strong>Best Western
        Paradise Inn</strong> offers reliable comfort on the north end of town.
        Several independent motels along Montana Street provide budget-friendly
        options. Drop your bags and head downtown.
      </p>

      <h3>Evening</h3>
      <p>
        Walk {townName}'s compact downtown along Montana Street, browsing the
        handful of shops, outfitters, and local businesses that line the main
        corridor. Grab dinner at one of the local restaurants — {townName}'s dining
        scene is modest but honest, with steakhouses, burger joints, and a Mexican
        restaurant that locals swear by. After dinner, take an evening stroll south
        toward <strong>Clark's Lookout</strong> (1 mile from town), a limestone bluff
        where Captain William Clark surveyed the Beaverhead Valley on August 13,
        1805, during the Corps of Discovery expedition. The overlook offers the same
        sweeping view Clark described in his journal — the Beaverhead River winding
        through cottonwood bottoms with the Pioneer Mountains rising to the west.
        It's a 15-minute stop that anchors the Lewis &amp; Clark story in the
        physical landscape and sets the tone for the weekend.
      </p>

      <h2>Saturday: River, Ghost Town &amp; Hot Springs</h2>

      <h3>Morning — Fly Fishing the Beaverhead</h3>
      <p>
        The <strong>Beaverhead River</strong> is {townName}'s crown jewel — a
        tailwater fishery below Clark Canyon Reservoir that produces some of the
        largest brown trout in Montana. The river flows directly through town,
        making morning access effortless. Book a guided float trip for the best
        experience: guides know the hatches, access points, and productive runs
        that can be difficult to find on your own. For experienced anglers,{' '}
        <strong>Poindexter Slough</strong> — a spring creek channel of the
        Beaverhead just south of town — offers technical sight-fishing for large,
        selective trout in gin-clear water. Wade fishing is possible at several
        public access points along the river. For detailed water and access
        information, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>

      <h3>Lunch</h3>
      <p>
        Return to town for a midday meal. {townName}'s lunch options are
        straightforward — diners and cafes that serve the ranching community and
        university students. Eat well and refuel for the afternoon.
      </p>

      <h3>Afternoon — Bannack State Park</h3>
      <p>
        Drive 18 miles south to <strong>Bannack State Park</strong>, Montana's
        first territorial capital and one of the best-preserved ghost towns in the
        American West. Founded in 1862 during the Grasshopper Creek gold rush,
        Bannack once held 3,000 residents and served as the seat of Montana's
        territorial government before the capital moved to Virginia City. Today,
        over 60 structures line the unpaved main street — the old hotel, Masonic
        lodge, jail, schoolhouse, and miners' cabins stand largely as they were
        left. Walking trails loop through the townsite and into the surrounding
        sagebrush hills above Grasshopper Creek. Plan 2–3 hours to explore
        thoroughly. The connection to Montana's vigilante history — Sheriff Henry
        Plummer, who was also the leader of a gang of road agents, was hanged here
        in 1864 — gives Bannack a weight that goes beyond scenic value.
      </p>

      <h3>Evening — Hot Springs</h3>
      <p>
        After Bannack, head to one of southwestern Montana's natural hot springs
        for a well-earned soak. <strong>Elkhorn Hot Springs</strong> (30 miles from
        {townName}) is a rustic lodge with outdoor pools in the Pioneer Mountains —
        the setting is remote and the water is naturally heated, with views of
        forested ridges in every direction. <strong>Jackson Hot Springs Lodge</strong>{' '}
        (40 miles south on Highway 278) offers a large outdoor pool, lodge rooms,
        and a restaurant, making it a convenient one-stop evening destination. Both
        are well worth the drive, and the soak after a day of fishing and exploring
        ghost towns is one of the signature {townName} experiences. Return to town
        for the night.
      </p>

      <h2>Sunday: Museum, Scenic Drive &amp; Departure</h2>

      <h3>Morning — Museum &amp; Downtown</h3>
      <p>
        Start Sunday at the <strong>Beaverhead County Museum</strong> in downtown
        {townName}. The museum covers the deep history of the Beaverhead Valley —
        from the Shoshone and Salish peoples who lived here for millennia, through
        the Lewis &amp; Clark Expedition, the gold rush era, ranching settlement,
        and the railroad. Exhibits include Native American artifacts, mining
        equipment, ranching tools, and a detailed account of the vigilante justice
        that marked territorial Montana. It's a compact museum that gives essential
        context for everything you've seen this weekend. After the museum, browse
        {townName}'s downtown shops — fly shops, Western wear, and local businesses
        that serve the valley.
      </p>

      <h3>Scenic Drive</h3>
      <p>
        For your departure drive, choose based on interest. The{' '}
        <strong>Pioneer Mountains National Scenic Byway</strong> is a backcountry
        loop road that circles through the Pioneer Mountains west of {townName},
        passing near alpine trailheads, mountain meadows, and some of the least-
        visited backcountry in the state — the unpaved sections are typically open
        late June through October. For history buffs, drive north to{' '}
        <strong>Virginia City</strong> (34 miles), a remarkably intact 1860s mining
        town that succeeded Bannack as territorial capital. The <strong>Nevada City
        Museum</strong> and <strong>Alder Gulch Railroad</strong> (both 33 miles)
        sit adjacent, forming a gold rush historic corridor that rivals any in the
        West. Either drive adds 2–3 hours to your departure but rewards with
        scenery and history you won't find elsewhere in Montana.
      </p>
      <p>
        Golfers with extra time can fit in a round at <strong>Beaverhead Golf
        Course</strong> (1 mile from downtown) — a pleasant nine-hole course along
        the Beaverhead River.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend destination for visitors who
        prefer uncrowded slopes and hot springs over resort-town bustle.{' '}
        <strong>Maverick Mountain</strong> (38 miles west) is a small, family-owned
        ski area with 2,020 feet of vertical, 24 runs, and lift tickets that cost a
        fraction of what you'd pay at Big Sky or Whitefish Mountain. The mountain
        operates Thursday through Sunday and draws almost exclusively local skiers —
        lift lines are essentially nonexistent. Pair a ski day with an afternoon or
        evening soak at Elkhorn Hot Springs (30 miles), which sits in the Pioneer
        Mountains along the same road and is especially magical in winter with
        snow-dusted ridges and steam rising from the pools. Back in town,
        {townName}'s restaurants, bars, and the university campus provide enough
        evening activity to fill a winter weekend. The Beaverhead County Museum
        remains open year-round.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} has a semi-arid continental climate at 5,095 feet. Summers are
            warm and dry with cool nights; winters are cold but relatively mild for
            inland Montana. Pack layers year-round — temperature swings of 30°F or
            more between day and night are common.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Month</th>
                <th style={thRightStyle}>Avg High (°F)</th>
                <th style={thRightStyle}>Avg Low (°F)</th>
              </tr>
            </thead>
            <tbody>
              {climate.map(c => (
                <tr key={c.month} style={rowStyle}>
                  <td style={tdStyle}>{c.month}</td>
                  <td style={tdRightStyle}>{c.avgHigh}°</td>
                  <td style={tdRightStyle}>{c.avgLow}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Layers:</strong> Even in July, {townName} evenings drop into the 50s°F — bring a fleece or light jacket for evening hot springs drives and morning fishing</li>
        <li><strong>Sun protection:</strong> High-elevation sun at 5,095 feet is intense; bring sunscreen, sunglasses, and a hat</li>
        <li><strong>Wading gear:</strong> If you're fishing, bring waders and wading boots or arrange rental through a local fly shop</li>
        <li><strong>Sturdy shoes:</strong> Bannack's ghost town trails and Clark's Lookout are on uneven ground — closed-toe shoes with grip</li>
        <li><strong>Swimsuit and towel:</strong> Essential for hot springs; some springs provide towels, others don't</li>
        <li><strong>Bear spray:</strong> Carry it on any hike in the Pioneer Mountains — grizzly and black bears are present in the Beaverhead-Deerlodge National Forest</li>
        <li><strong>Winter additions:</strong> Ski gear for Maverick Mountain, warm base layers, and tire chains or AWD for Pioneer Mountain roads</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName}'s museum scene extends well beyond town — the Beaverhead
            Valley and the gold rush corridor to the north form one of the richest
            historic zones in Montana:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Museum</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {museums.map(m => (
                <tr key={m.name} style={rowStyle}>
                  <td style={tdStyle}>{m.name}</td>
                  <td style={tdRightStyle}>{m.distMiles === 0 ? 'In town' : `${m.distMiles} mi`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {hotSprings.length > 0 && (
        <>
          <h2>Hot Springs</h2>
          <p>
            Southwestern Montana has the highest concentration of natural hot springs
            in the state, and {townName} is ideally positioned to reach six of them
            within 52 miles:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Hot Spring</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {hotSprings.map(s => (
                <tr key={s.name} style={rowStyle}>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={tdRightStyle}>{s.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(stateParks.length > 0 || historicSites.length > 0) && (
        <>
          <h2>Highlights &amp; Nearby Attractions</h2>
          {stateParks.length > 0 && (
            <>
              <h3>State Parks</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>State Park</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {stateParks.map(p => (
                    <tr key={p.name} style={rowStyle}>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdRightStyle}>{p.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {historicSites.length > 0 && (
            <>
              <h3>Historic Sites</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Historic Site</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {historicSites.map(s => (
                    <tr key={s.name} style={rowStyle}>
                      <td style={tdStyle}>{s.name}</td>
                      <td style={tdRightStyle}>{s.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      <h2>Where to Stay</h2>
      <p>
        {townName}'s lodging options are limited but adequate — this is a small
        town without resort-style accommodations, and the honest simplicity is part
        of the appeal:
      </p>
      <ul>
        <li><strong>Angler Village Inn:</strong> Geared toward fly-fishing visitors with river proximity and guide connections</li>
        <li><strong>Best Western Paradise Inn:</strong> The most reliable full-service option in {townName}</li>
        <li><strong>Independent motels:</strong> Several budget-friendly options along Montana Street</li>
        <li><strong>Elkhorn Hot Springs Lodge:</strong> Rustic cabins in the Pioneer Mountains (30 mi) — combine lodging with hot springs for a memorable overnight</li>
        <li><strong>Jackson Hot Springs Lodge:</strong> Lodge rooms and a restaurant alongside the hot springs pool (40 mi south)</li>
      </ul>
      <p>
        For detailed housing costs and market data, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
      </p>
    </article>
  );
}
