import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const urban = trails.filter(t => t.distMiles <= 8);
  const day = trails.filter(t => t.distMiles > 8 && t.distMiles <= 30);
  const backcountry = trails.filter(t => t.distMiles > 30).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits where the Yellowstone River breaks through the Absaroka Range and spills
        into the broad sweep of Paradise Valley — one of the most dramatic landscape transitions in
        the Northern Rockies. The town perches at 4,501 feet on the Yellowstone's north bank, with
        the Absaroka Range rising steeply to the east, the Gallatin Range and Bridger Mountains to
        the west, and the Crazy Mountains visible to the northeast. With 28 trailheads within
        50 miles, {townName} offers an unusual combination of river-corridor walks, rugged alpine
        scrambles, and direct access to Yellowstone National Park just 44 miles south through
        Paradise Valley. Wind is part of the deal — {townName} is one of the windiest towns in
        Montana, and exposed ridgeline hikes require planning around gusts that can exceed 60 mph.
        This guide organizes trails by distance from {townName} and covers seasonal considerations.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>28 trailheads</strong> within 50 miles</li>
        <li><strong>301 recreation sites</strong> within 50 miles</li>
        <li><strong>3 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>2 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> Yellowstone River corridor trails, in town</li>
        <li><strong>Closest wilderness:</strong> Lee Metcalf Spanish Peaks, 42 miles</li>
        <li><strong>National park:</strong> Yellowstone North Entrance (Gardiner), 44 miles</li>
        <li><strong>Ski areas:</strong> Bridger Bowl (19 mi), Big Sky Resort (48 mi), Red Lodge Mountain (68 mi)</li>
        <li><strong>Hot springs:</strong> Chico Hot Springs (21 mi), Bozeman Hot Springs (27 mi), Boiling River (37 mi)</li>
      </ul>

      <h2>In-Town &amp; Urban Trails (Within 8 Miles)</h2>
      <p>
        {townName}'s in-town hiking centers on the Yellowstone River corridor itself. The river
        flows directly through downtown — one of Montana's few towns where a major blue-ribbon
        trout stream runs past the main street — and riverside paths follow its banks through
        cottonwood bottomlands and open benchlands. Sacajawea Park, on the river's north bank
        downtown, provides paved and gravel paths popular with runners, dog walkers, and families.
        The benchlands above town offer informal trail networks with sweeping views south into
        Paradise Valley and across to the Absaroka Range. These lower-elevation routes stay
        accessible year-round, though {townName}'s persistent wind can make exposed stretches
        challenging on blustery days.
      </p>
      {urban.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {urban.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Day Hikes (8–30 Miles)</h2>
      <p>
        <strong>Pine Creek Falls and Pine Creek Lake</strong> (13 miles south) is the signature
        day hike from {townName} and one of the most popular trails in Paradise Valley. The trail
        begins at Pine Creek Campground on the east side of the valley and climbs steeply through
        dense forest to Pine Creek Falls — a powerful cascade tumbling over a rock ledge into a
        mossy grotto. Most hikers turn around at the falls (a 2.5-mile round trip with 500 feet of
        gain), but strong hikers can continue another 4 miles and 3,000 vertical feet to Pine Creek
        Lake, a stunning alpine cirque lake tucked beneath 10,000-foot peaks in the Absaroka Range.
        The upper trail is rugged, steep, and can hold snow into July — but the payoff is one of
        the finest alpine lake settings in southwestern Montana.
      </p>
      <p>
        The <strong>Absaroka Range</strong> east of Paradise Valley offers dozens of trail options
        ranging from riverside canyon walks to high-alpine ridge traverses. Mill Creek (15 miles
        south) provides access to the Absaroka-Beartooth Wilderness via trails that follow Mill
        Creek into high basins and over passes. These trails are longer, more remote, and see far
        less traffic than the popular Bridger Range trails west of town. The terrain is rugged and
        trail maintenance can be inconsistent — river crossings, blowdown, and route-finding skills
        are part of the experience.
      </p>
      <p>
        The <strong>Bridger Range</strong> (20–26 miles west, shared with the Bozeman area) offers
        a contrasting hiking experience — a compact, accessible mountain range with well-maintained
        trails and spectacular ridgeline routes. Sypes Canyon (22 miles) is a popular moderate hike
        climbing through forest to a saddle with views across the Gallatin Valley. The Bridger Bowl
        Ridge Run (19 miles) follows the knife-edge ridge above the ski area with exposure and
        panoramic views in every direction. <strong>Sacajawea Peak</strong> (25 miles) — the
        highest point in the Bridger Range at 9,665 feet — is reachable via a steep but
        straightforward trail from Fairy Lake, with summit views encompassing the Crazy Mountains,
        Absarokas, Spanish Peaks, and on clear days, the Beartooth Plateau.
      </p>
      {day.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {day.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Yellowstone National Park</h2>
      <p>
        The North Entrance to Yellowstone National Park at Gardiner is just 44 miles south of
        {townName} via US-89 through Paradise Valley — one of the most scenic drives in Montana.
        This is the only park entrance open to vehicle traffic year-round, making {townName} a
        legitimate four-season base camp for Yellowstone hiking. The Mammoth Hot Springs area,
        immediately inside the North Entrance, offers trails through terraced thermal formations,
        open sagebrush valleys, and along the Gardner River canyon. Rescue Creek Trail, Beaver
        Ponds Loop, and the Mammoth Terraces boardwalks are all accessible on a day trip from
        {townName} with time to spare.
      </p>
      <p>
        More ambitious hikers use the North Entrance as a launching point for deeper Yellowstone
        backcountry — the Black Canyon of the Yellowstone, Electric Peak (10,969 feet), and the
        Lamar Valley trail network are all reachable. The drive from {townName} to Gardiner takes
        about 50 minutes, making early-morning starts practical. Paradise Valley itself offers
        trailhead access to the Absaroka Range on the east side and the Gallatin Range on the west,
        with trails climbing from the valley floor into alpine country well before reaching the
        park boundary.
      </p>

      <h2>Wilderness &amp; Backcountry</h2>
      <p>
        Three federally designated wilderness areas are accessible from {townName}. The
        <strong> Lee Metcalf Wilderness — Spanish Peaks unit</strong> (42 miles west) encompasses
        rugged alpine terrain in the Madison Range south of Bozeman, with glacier-carved cirques,
        alpine lakes, and peaks exceeding 11,000 feet. The Spanish Peaks offer multi-day
        backpacking through some of the most spectacular mountain scenery in southwestern Montana.
        The <strong>Lee Metcalf Wilderness — Madison Range unit</strong> (51 miles southwest)
        protects the remote heart of the Madison Range, with fewer trails and a wilder, more
        primitive character.
      </p>
      <p>
        The <strong>Absaroka-Beartooth Wilderness</strong> (60 miles southeast) is one of
        Montana's largest wilderness areas, spanning over 943,000 acres of alpine plateaus,
        granite peaks exceeding 12,000 feet, and more than 700 alpine lakes. Access from the
        {townName} side involves longer drives through Paradise Valley and over passes, but the
        reward is some of the most spectacular high-country terrain in the Northern Rockies.
        The Beartooth Plateau — the largest contiguous area above 10,000 feet in the Lower 48 —
        offers surreal, tundra-like hiking above treeline with views stretching to the horizon.
      </p>
      {wilderness.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Wilderness Area</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {wilderness.map(w => (
              <tr key={w.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{w.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{w.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>State Parks</h2>
      <p>
        Two state parks lie within range of {townName}. <strong>Story Mill Community Park</strong>{' '}
        (22 miles west, in Bozeman) is a 60-acre restored wetland and trail park along the East
        Gallatin River, featuring boardwalk loops through riparian habitat, a nature play area,
        and interpretive exhibits. While technically a Bozeman park, it's a worthwhile stop for
        {townName} visitors headed west. <strong>Missouri Headwaters State Park</strong> (49 miles
        west) marks the historically significant confluence of the Jefferson, Madison, and Gallatin
        rivers to form the Missouri River — the spot Lewis and Clark reached on July 27, 1805.
        The park offers riverside trails through cottonwood bottoms with interpretive panels on the
        expedition and the region's geological history.
      </p>
      {stateParks.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>State Park</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {stateParks.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{p.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{p.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Considerations</h2>
      <p>
        <strong>Spring (March–May):</strong> Lower-elevation trails along the Yellowstone River
        corridor and the benchlands above town clear early, often by mid-March. Paradise Valley's
        east-side canyon trails (Pine Creek, Mill Creek) can hold snow and mud into May, with
        creek crossings running high from snowmelt. The Bridger Range stays snow-covered at
        upper elevations through May. Yellowstone's North Entrance is open year-round, but many
        park trails remain snow-covered into June. Wind is strongest in spring — expect sustained
        gusts of 30–50 mph on exposed terrain, especially on the benchlands and ridgelines.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. Pine Creek Falls and the Bridger Range
        trails are fully clear by late June, with alpine lakes accessible by mid-July in most
        years. Temperatures in Paradise Valley reach the upper 80s and low 90s°F — start early,
        especially on south-facing Absaroka slopes. Afternoon thunderstorms build over the
        mountains regularly; be off ridgelines and exposed terrain by early afternoon. Yellowstone
        National Park trails are in prime condition, though the North Entrance corridor can be
        extremely busy. Wildfire smoke can affect visibility and air quality in late July and
        August — check conditions before committing to high-elevation hikes.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Many locals consider this the best hiking
        season around {townName}. Warm days, cool nights, and dramatically reduced crowds make
        for ideal conditions. The Absaroka Range and Paradise Valley put on exceptional fall
        color — aspens blaze gold against the dark spruce forests. Elk bugling echoes through
        the drainages east of Paradise Valley in September, and wildlife viewing is outstanding.
        Yellowstone's North Entrance stays open and the park's thermal features are uncrowded.
        Hunting season begins in October; wear blaze orange on national forest trails.
      </p>
      <p>
        <strong>Winter (November–March):</strong> {townName}'s proximity to Bridger Bowl (19 mi)
        and Big Sky Resort (48 mi) makes it an affordable base for downhill skiing. Cross-country
        skiing and snowshoeing are available in Paradise Valley and the Bridger Range foothills.
        Yellowstone's North Entrance remains open, and winter in the park — with bison herds on
        snow-covered roads and thermal features steaming against frozen landscapes — is
        unforgettable. The Yellowstone River corridor stays accessible for winter walks, though
        wind chill can be brutal. Chico Hot Springs (21 miles) provides a perfect post-hike
        warm-up through the winter months.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is prime grizzly bear habitat — the Yellowstone ecosystem supports
        one of the densest grizzly populations in the Lower 48. Carry bear spray on every
        backcountry hike, travel in groups, make noise on the trail, and store food properly.
        Black bears and mountain lions are also present throughout the area. <strong>Wind</strong>{' '}
        is a distinctive {townName} hazard — the town sits in a natural wind funnel where the
        Yellowstone Valley narrows through the Absaroka-Gallatin gap, producing gusts that can
        exceed 60 mph. Check wind forecasts before heading to exposed ridgelines, particularly in
        the Bridger Range and on Absaroka peaks. High-elevation trails in the Absaroka Range and
        Yellowstone backcountry can be remote with limited cell service — carry a map, inform
        someone of your plans, and be prepared for rapidly changing mountain weather.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
