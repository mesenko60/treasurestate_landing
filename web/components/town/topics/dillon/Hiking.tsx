import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

const thStyle = { padding: '0.5rem' } as const;
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' } as const;
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

const historicSites = [
  { name: "Clark's Lookout Monument", distMiles: 1 },
  { name: 'Robbers Roost', distMiles: 27 },
  { name: '2 Story Outhouse', distMiles: 33 },
  { name: 'Virginia City Historic District', distMiles: 34 },
  { name: 'Place of Discovery', distMiles: 34 },
  { name: 'Union City Christeot Mill', distMiles: 35 },
];

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const dayHikes = trails.filter(t => t.distMiles <= 30);
  const backcountry = trails.filter(t => t.distMiles > 30).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 5,095 feet in the broad Beaverhead Valley of southwestern Montana,
        ringed by the Pioneer Mountains to the west, the Tendoy Mountains to the south, and the
        Ruby Range to the east. Unlike most Montana trail towns where trailheads sit at the edge
        of the city limits, {townName}'s serious mountain hiking begins 20 miles out — the town
        occupies open ranchland valley floor while the Beaverhead-Deerlodge National Forest and
        its alpine country rise above the surrounding foothills. That distance is part of the
        appeal: 8 trailheads within 40 miles lead to uncrowded alpine lakes, high-country ridges,
        and some of the least-visited wilderness in the state. Closer to town, the "B" and "M"
        trails on the hillside above the University of Montana Western campus provide over 10
        miles of accessible hiking and mountain biking. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>8 trailheads</strong> within 40 miles</li>
        <li><strong>3 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>3 state parks</strong> with trail systems</li>
        <li><strong>6 historic sites</strong> with walking opportunities</li>
        <li><strong>37 campgrounds</strong> within 40 miles</li>
        <li><strong>Closest trailhead:</strong> "B" and "M" trails, in town</li>
        <li><strong>Closest alpine trailhead:</strong> Deerhead Lake, 20 miles</li>
        <li><strong>Closest wilderness:</strong> Lee Metcalf Wilderness (Madison Range), 60 miles</li>
        <li><strong>National forest:</strong> Beaverhead-Deerlodge National Forest surrounds the area</li>
        <li><strong>Scenic drive:</strong> Pioneer Mountains National Scenic Byway (backcountry loop road)</li>
        <li><strong>Elevation range:</strong> 5,095 ft (town) to 10,000+ ft (Pioneer peaks)</li>
      </ul>

      <h2>Town Trails: The "B" &amp; "M"</h2>
      <p>
        The closest hiking to downtown {townName} is the "B" and "M" trail system on the
        hillside directly above the University of Montana Western campus. Named for the large
        letter markers visible from town — the "M" for Montana Western and the "B" for
        Beaverhead County High School — these trails wind through sagebrush and grassland
        on the benchland south of the Beaverhead River. The network totals over 10 miles of
        interconnected loops popular with joggers, dog walkers, and mountain bikers. The
        terrain is open and rolling, offering views across the Beaverhead Valley to the
        Pioneer Mountains. These trails are accessible year-round except during heavy snowfall
        and provide a quick option when you want exercise without the 20-mile drive to alpine
        country.
      </p>

      <h2>Featured Hikes</h2>
      <p>
        The Pioneer Mountains west of {townName} hold some of southwestern Montana's finest
        alpine lake hikes. Three standouts anchor the range:
      </p>
      <p>
        <strong>Deerhead Lake</strong> (20 miles) is the closest alpine trailhead and a popular
        introduction to Pioneer Mountains hiking. The trail climbs through lodgepole pine and
        subalpine fir to a cirque lake nestled below rocky ridgelines at roughly 8,500 feet.
        The moderate distance from town and the trail's manageable grade make Deerhead Lake
        the go-to recommendation for visitors with limited time.
      </p>
      <p>
        <strong>Gorge Lakes</strong> (23 miles) offers a more sustained effort through a chain
        of alpine lakes connected by a creek drainage in the heart of the Pioneers. The
        trail passes through dense forest before emerging into open alpine terrain, where the
        lakes sit in rocky basins with views of surrounding ridges exceeding 9,500 feet. This
        is an excellent full-day hike or overnight backpack.
      </p>
      <p>
        <strong>Sawtooth Lake</strong> (26 miles) sits beneath the jagged crest of the
        Sawtooth Ridge — the most visually dramatic setting among the Pioneer Lakes. The trail
        gains significant elevation through switchbacks to reach the lake at approximately
        9,000 feet, with the serrated ridgeline towering above. Strong hikers can scramble
        above the lake for views across the entire Pioneer range. Snow lingers here longer
        than at the other two lakes; plan for mid-July access in most years.
      </p>

      <h2>Pioneer Mountains</h2>
      <p>
        The Pioneer Mountains are {townName}'s defining hiking landscape — a compact but rugged
        range of granite peaks, alpine basins, and subalpine forest that rises abruptly from the
        valley floor to over 10,000 feet. The <strong>Pioneer Mountains National Scenic
        Byway</strong> provides the primary access, a backcountry loop road that circles through
        the range and passes near most major trailheads. The road is unpaved through its mountain
        sections and typically open from late June through October, depending on snowpack.
      </p>
      <p>
        Beyond the three featured lakes, additional Pioneer trailheads include Blue Creek
        (29 miles), Odell Lake (35 miles), Sawmill Gulch (38 miles), Lake Louise (39 miles),
        and Lost Cabin Lake (39 miles). These trails reach increasingly remote terrain in the
        southern and western Pioneers, with lighter foot traffic and a genuine sense of solitude.
        Odell Lake and Lake Louise are particularly rewarding for hikers willing to push beyond
        the more accessible trailheads. The Pioneer range as a whole sees a fraction of the
        visitor traffic of the Beartooth or Mission ranges, making it one of Montana's better-kept
        hiking secrets.
      </p>
      {dayHikes.length > 0 && (
        <>
          <h3>Trailheads Within 30 Miles</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Trail</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {dayHikes.map(t => (
                <tr key={t.name} style={rowStyle}>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdRightStyle}>{t.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {backcountry.length > 0 && (
        <>
          <h3>Backcountry Trailheads (30+ Miles)</h3>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Trail</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {backcountry.map(t => (
                <tr key={t.name} style={rowStyle}>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdRightStyle}>{t.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Bannack &amp; Clark's Lookout: History on Foot</h2>
      <p>
        Two sites near {townName} combine walking with deep Montana history.{' '}
        <strong>Bannack State Park</strong> (18 miles) preserves Montana's first territorial
        capital — a gold rush boomtown founded in 1862 that once held 3,000 residents and
        served as the seat of government before the capital moved to Virginia City. Today the
        ghost town's 60-plus structures line an unpaved main street, and walking trails loop
        through the townsite and into the surrounding sagebrush hills above Grasshopper Creek.
        The terrain is open and gentle — this is a history walk more than a mountain hike, but
        the interpretive value is exceptional and the setting is photogenic year-round.
      </p>
      <p>
        <strong>Clark's Lookout State Park</strong> (7 miles north on Highway 41) marks the
        spot where Captain William Clark climbed a limestone bluff on August 13, 1805, to survey
        the Beaverhead Valley and plan the Corps of Discovery's route southwest toward Lemhi
        Pass. A short interpretive trail leads to the overlook, which still offers the same
        sweeping view Clark described in his journal — the Beaverhead River winding through
        cottonwood bottoms with the Pioneer Mountains rising to the west. It's a 15-minute stop
        that anchors the Lewis &amp; Clark story in the physical landscape.
      </p>

      <h2>State Parks</h2>
      <p>
        Three state parks serve the {townName} area, each offering a distinct experience.
        Clark's Lookout (7 miles) provides the quick historical stop described above.
        Bannack (18 miles) is the full ghost-town experience. <strong>Lewis and Clark
        Caverns State Park</strong> (57 miles northeast toward Whitehall) features Montana's
        most extensive limestone cave system, with guided underground tours from May through
        September and above-ground hiking trails along the Jefferson River canyon. The
        cavern trail itself climbs roughly 600 feet through switchbacks to the cave entrance,
        offering views across the Jefferson Valley.
      </p>
      {stateParks.length > 0 && (
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
      )}

      <h2>Wilderness Areas</h2>
      <p>
        Three federally designated wilderness areas are reachable from {townName}, though all
        require drives of 60 miles or more. The <strong>Lee Metcalf Wilderness — Madison
        Range unit</strong> (60 miles northeast) protects rugged alpine terrain along the
        spine of the Madison Range, with glacier-carved cirques, alpine lakes, and peaks
        exceeding 11,000 feet. The <strong>Anaconda-Pintler Wilderness</strong> (63 miles
        north) straddles the Continental Divide between Anaconda and Philipsburg, offering
        high-country backpacking through granite peaks, alpine meadows, and the headwaters
        of several major drainages. The <strong>Lee Metcalf Wilderness — Spanish Peaks
        unit</strong> (64 miles northeast) encompasses the popular Spanish Peaks south of
        Bozeman, with well-maintained trails to alpine lakes and ridgeline routes.
      </p>
      <p>
        These wilderness areas are best suited for multi-day backpacking trips from {townName}.
        The Pioneer Mountains themselves, while not formally designated wilderness, offer
        comparable solitude and scenery at much closer range.
      </p>
      {wilderness.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRowStyle}>
              <th style={thStyle}>Wilderness Area</th>
              <th style={thRightStyle}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {wilderness.map(w => (
              <tr key={w.name} style={rowStyle}>
                <td style={tdStyle}>{w.name}</td>
                <td style={tdRightStyle}>{w.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Historic Site Walks</h2>
      <p>
        Southwestern Montana's gold rush and frontier history left a network of sites that
        reward on-foot exploration. Beyond Bannack, <strong>Virginia City Historic
        District</strong> (34 miles) preserves a remarkably intact 1860s mining town — now
        a living museum where you can walk boardwalk-lined streets past restored buildings,
        saloons, and the old territorial capitol. <strong>Robbers Roost</strong> (27 miles)
        marks a stagecoach-era roadhouse associated with the notorious road agent Henry
        Plummer. The <strong>2 Story Outhouse</strong> in Twin Bridges (33 miles) is exactly
        what it sounds like — a quirky roadside curiosity worth a brief stop.{' '}
        <strong>Place of Discovery</strong> (34 miles) commemorates the Lewis &amp; Clark
        Expedition's first contact with the Shoshone near Lemhi Pass, while the{' '}
        <strong>Union City Christeot Mill</strong> (35 miles) preserves a 19th-century
        stamp mill from the region's mining heyday. None of these require significant hiking,
        but all reward a curious walker with tangible connections to Montana's frontier past.
      </p>
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

      <h2>Trail Safety</h2>
      <p>
        <strong>Elevation:</strong> {townName} sits at 5,095 feet and Pioneer Mountain
        trailheads start between 6,500 and 7,500 feet, with destinations reaching 9,000
        to 10,000+ feet. Visitors arriving from lower elevations should acclimate before
        attempting sustained climbs. Altitude symptoms — headache, nausea, shortness of
        breath — can begin above 8,000 feet for unacclimated hikers.
      </p>
      <p>
        <strong>Weather:</strong> Mountain weather in the Pioneers changes rapidly. Clear
        mornings can produce afternoon thunderstorms with lightning, hail, and sudden
        temperature drops of 30°F or more. Start alpine hikes early and plan to be below
        treeline by early afternoon. Snow can fall at high elevations any month of the year.
      </p>
      <p>
        <strong>Remoteness:</strong> The Pioneer Mountains are genuinely remote. Cell service
        is nonexistent at most trailheads and along the Scenic Byway. Trails see light traffic —
        you may hike all day without encountering another party. Carry a physical map, inform
        someone of your itinerary, and be prepared for self-rescue. The nearest hospital is in
        {' '}{townName}, and evacuation from alpine basins can take hours. Carry bear spray —
        both black bears and grizzly bears are present in the Beaverhead-Deerlodge National
        Forest, and moose frequent creek drainages and lake shores.
      </p>

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March–May):</strong> The "B" and "M" trails and Clark's Lookout
        clear of snow early, often by mid-March in normal years. Bannack's walking trails are
        accessible once roads dry out, typically by April. Pioneer Mountain trailheads remain
        snow-covered and the Scenic Byway is closed through May. Valley-floor walks along the
        Beaverhead River and visits to lower-elevation historic sites are the best spring
        options.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. The Pioneer Mountains Scenic Byway
        typically opens by late June, with alpine lake trails accessible by early to mid-July
        depending on snowpack. Sawtooth Lake often holds snow into late July. Temperatures
        in {townName} reach the upper 80s and low 90s°F, while alpine basins stay cool.
        Afternoon thunderstorms build over the Pioneers regularly — plan accordingly. Wildfire
        smoke can affect visibility and air quality in late July and August.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Many locals consider this the finest hiking
        season. Warm days, crisp nights, and golden aspens and larches in the Pioneer drainages
        create ideal conditions. The Scenic Byway remains open through mid-October in most
        years. Elk bugling echoes through the national forest in September. Hunting season
        begins in October — wear blaze orange on all forest trails. Bannack and Virginia City
        are particularly atmospheric in fall light.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Alpine trails are buried under deep snow
        and the Scenic Byway closes. The "B" and "M" trails remain accessible for winter
        hiking when conditions permit. Snowshoeing and cross-country skiing are available in
        the Pioneer foothills and along forest roads. Bannack State Park stays open year-round
        for walking tours of the ghost town, though facilities are limited in winter. The
        nearest downhill skiing is at Maverick Mountain (40 miles west), a small local hill
        with uncrowded runs and affordable lift tickets.
      </p>

      <p>
        For a structured weekend plan combining hiking, history, and local dining, see
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
