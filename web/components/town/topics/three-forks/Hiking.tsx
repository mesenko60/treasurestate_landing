import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

const thStyle: React.CSSProperties = { padding: '0.5rem' };
const thRight: React.CSSProperties = { padding: '0.5rem', textAlign: 'right' };
const tdStyle: React.CSSProperties = { padding: '0.5rem' };
const tdRight: React.CSSProperties = { padding: '0.5rem', textAlign: 'right' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' };
const headRow: React.CSSProperties = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' };
const bodyRow: React.CSSProperties = { borderBottom: '1px solid #eee' };

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const local = trails.filter(t => t.distMiles <= 15);
  const midRange = trails.filter(t => t.distMiles > 15 && t.distMiles <= 35);
  const backcountry = trails.filter(t => t.distMiles > 35).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 4,075 feet at the confluence of the Jefferson, Madison, and Gallatin
        Rivers in southwestern Montana{'\u2014'}the exact point where the Missouri River begins.
        Located 31 miles west of Bozeman in Gallatin County, the town of 1,989 is surrounded by
        river bottomland, rolling foothills, and easy access to mountain ranges in every direction.
        With <strong>28 trailheads</strong> within 50 miles, the hiking spans everything from
        interpretive river bluff trails at Missouri Headwaters State Park to guided limestone
        cavern tours at Lewis & Clark Caverns and ancient bison-hunting sites at Madison Buffalo
        Jump. The Bridger Range and Hyalite Canyon near Bozeman add alpine options within a short
        drive. This guide covers every major hiking zone accessible from {townName}. For the full
        town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>28 trailheads</strong> within 50 miles</li>
        <li><strong>5 wilderness areas</strong> within 50 miles</li>
        <li><strong>4+ state parks</strong> within 50 miles</li>
        <li><strong>2 waterfalls</strong> within 50 miles</li>
        <li><strong>43 campgrounds</strong> within 50 miles</li>
        <li><strong>Closest trailhead:</strong> The Rim TH, 8 miles</li>
        <li><strong>Closest state park:</strong> Missouri Headwaters State Park, 4 miles</li>
        <li><strong>Iconic attraction:</strong> Lewis & Clark Caverns State Park, 16 miles</li>
        <li><strong>Peak season:</strong> April through November (lower elevation extends the season)</li>
      </ul>

      <h2>Missouri Headwaters State Park</h2>
      <p>
        <strong>Missouri Headwaters State Park</strong>, just 4 miles from {townName}, marks the
        exact spot where the Jefferson, Madison, and Gallatin Rivers converge to form the Missouri
        River{'\u2014'}a geographic landmark of national significance. Lewis and Clark camped here
        in July 1805, naming the three rivers after President Thomas Jefferson, Secretary of State
        James Madison, and Secretary of the Treasury Albert Gallatin. The park preserves this
        history through interpretive displays along the trail system.
      </p>
      <p>
        The park{'\u2019'}s trails follow river bluffs above the confluence, offering panoramic
        views of the three river valleys and the surrounding mountain ranges. Short interpretive
        loops wind through the bottomland with signage covering Lewis and Clark history, Native
        American heritage, and the natural history of the headwaters region. The terrain is gentle
        and accessible to all fitness levels, making it an ideal family outing. Osprey and bald
        eagles are frequently spotted hunting along the river, and deer browse the cottonwood
        groves at dawn and dusk.
      </p>

      <h2>Lewis & Clark Caverns State Park</h2>
      <p>
        <strong>Lewis & Clark Caverns State Park</strong>, 16 miles west of {townName}, is
        Montana{'\u2019'}s first and best-known state park. The caverns are one of the largest
        known limestone cavern systems in the Northwest, featuring guided tours through chambers
        filled with stalactites, stalagmites, columns, and helictites. The cave tours involve
        moderate climbing and stooping through narrow passages{'\u2014'}a unique underground
        hiking experience unlike anything else in the region.
      </p>
      <p>
        Above ground, the park offers surface trails and mountain biking routes across
        open hillsides above the Jefferson River valley. The trails climb through Douglas fir
        and grassland with broad views of the river corridor and surrounding ranges. The
        combination of cave tours and surface hiking makes this a full-day destination.
        A campground within the park provides overnight options.
      </p>

      <h2>Madison Buffalo Jump State Park</h2>
      <p>
        <strong>Madison Buffalo Jump State Park</strong>, 15 miles south of {townName}, preserves
        one of the most significant Native American bison hunting sites in the Northern Plains.
        For thousands of years, indigenous peoples drove bison over the cliff face here{'\u2014'}a
        communal hunting technique predating horses and firearms. Interpretive trails climb to the
        top of the jump with signage explaining the hunting process, archaeological findings, and
        the cultural significance of the site.
      </p>
      <p>
        The trails at Madison Buffalo Jump offer panoramic views across the Madison River valley
        toward the Tobacco Root Mountains and the Madison Range. The open grassland terrain is
        exposed but not strenuous, and the combination of history and scenery makes this a
        rewarding half-day hike. Wildflowers blanket the hillsides in spring and early summer.
      </p>

      <h2>Local Trails (Within 15 Miles)</h2>
      <p>
        Beyond the state parks, the closest trailheads to {townName} include{' '}
        <strong>The Rim TH</strong>, <strong>Buffalo TH</strong>, and{' '}
        <strong>Northridge TH</strong>, all approximately 8 miles from town. The Rim Trail follows
        a ridge above the Gallatin Valley with sweeping panoramas of the valley floor, the Bridger
        Range to the east, and the Tobacco Root Mountains to the south. These trails offer
        moderate elevation gain through open grassland and scattered timber, with excellent
        wildflower displays in June and early July. River walks along the Jefferson, Madison, and
        Gallatin near their confluence provide flat, easy walking through cottonwood bottomland
        with outstanding birdwatching{'\u2014'}osprey, bald eagles, great blue herons, and
        kingfishers are common along all three rivers.
      </p>
      {local.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {local.map(t => (
              <tr key={t.name} style={bodyRow}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdRight}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        The proximity to Bozeman (31 miles east) opens up a wealth of additional hiking. The{' '}
        <strong>Bridger Range</strong> north of Bozeman offers strenuous ridge hiking with
        dramatic alpine scenery, including the popular Baldy Mountain and Sacagawea Peak
        summits. <strong>Hyalite Canyon</strong> south of Bozeman features a string of waterfalls
        along Hyalite Creek, alpine lake destinations like Hyalite and Emerald Lakes, and
        well-maintained forest trails through the Gallatin National Forest. Cave Gulch TH and
        East Side TH (both approximately 15 miles) provide additional access to foothill trails
        in the Horseshoe Hills between {townName} and Helena.
      </p>
      <p>
        The <strong>Tobacco Root Mountains</strong> south of {townName} offer backcountry hiking
        through a compact range with alpine lakes and 10,000-foot peaks. The Corbly Gulch TH
        (26 miles) accesses trails into this less-visited range. The terrain is rugged and
        remote{'\u2014'}fewer people, more wildlife, and a genuine backcountry experience within
        reasonable driving distance of town.
      </p>
      {midRange.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Trail / Trailhead</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {midRange.map(t => (
              <tr key={t.name} style={bodyRow}>
                <td style={tdStyle}>{t.name}</td>
                <td style={tdRight}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Wilderness Areas</h2>
      <p>
        Five federally designated wilderness areas lie within 50 miles of {townName}, providing
        access to some of Montana{'\u2019'}s most pristine backcountry. The{' '}
        <strong>Lee Metcalf Wilderness</strong> in the Madison Range and the{' '}
        <strong>Absaroka-Beartooth Wilderness</strong> to the southeast anchor the network of
        protected wildlands surrounding the greater Gallatin Valley. These wilderness areas offer
        multi-day backpacking trips through alpine terrain, with trails accessing high lakes,
        ridgeline traverses, and remote valleys. Most wilderness trails involve significant
        elevation gain and require backcountry preparedness including bear spray, water
        purification, and navigation tools.
      </p>
      {wilderness.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>Wilderness Area</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {wilderness.map(w => (
              <tr key={w.name} style={bodyRow}>
                <td style={tdStyle}>{w.name}</td>
                <td style={tdRight}>{w.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>State Parks</h2>
      <p>
        {townName} is uniquely positioned near three distinctive state parks, each offering a
        completely different hiking experience. <strong>Missouri Headwaters State Park</strong> (4
        miles) provides river bluff trails and Lewis & Clark history.{' '}
        <strong>Lewis & Clark Caverns State Park</strong> (16 miles) combines underground cave
        tours with surface trails above the Jefferson River.{' '}
        <strong>Madison Buffalo Jump State Park</strong> (15 miles) offers interpretive trails
        at an ancient bison hunting site with panoramic Madison Valley views. Few towns in Montana
        can match this concentration of state park hiking within such a short drive.
      </p>
      {stateParks.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr style={headRow}>
              <th style={thStyle}>State Park</th>
              <th style={thRight}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {stateParks.map(p => (
              <tr key={p.name} style={bodyRow}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdRight}>{p.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> {townName}{'\u2019'}s relatively low
        elevation of 4,075 feet means trails clear earlier here than in most Montana mountain
        towns. Missouri Headwaters State Park and valley floor trails are typically accessible by
        mid-April. Madison Buffalo Jump and The Rim Trail follow soon after. Lewis & Clark
        Caverns opens for guided tours in May (cave temperature is a constant 50{'\u00b0'}F
        year-round). Wildflowers bloom across the valley in May, and the three rivers run high
        with snowmelt. Bear activity increases as animals emerge from hibernation{'\u2014'}carry
        bear spray.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season with all trails and
        parks fully open. Summer highs in {townName} reach the upper 80s{'\u00b0'}F, and the
        valley floor can be warm{'\u2014'}start early or seek higher-elevation trails in the
        Bridger Range or Hyalite Canyon. Lewis & Clark Caverns provides a cool escape on hot
        days. Afternoon thunderstorms are common in the mountains surrounding the valley. The
        three rivers drop to wadeable levels by late July, and river walks become particularly
        pleasant. Wildfire smoke can affect air quality in late July and August.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider this the finest
        hiking season around {townName}. Crowds thin, temperatures cool to comfortable hiking
        weather, and the cottonwood corridors along the three rivers turn golden. The Bridger
        Range and Tobacco Roots offer crisp alpine hiking with clear visibility. Missouri
        Headwaters State Park is especially rewarding in fall when migrating birds pass through
        the confluence. Most trails remain accessible through October and often into November at
        valley elevations.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Valley floor trails at Missouri
        Headwaters and along the rivers can be walked year-round when snow cover permits,
        though the state park facilities close seasonally. Lewis & Clark Caverns typically closes
        for cave tours in winter. Snowshoeing and cross-country skiing opportunities exist in the
        surrounding foothills and at higher elevations near Bozeman. Bridger Bowl ski area
        (via Bozeman, approximately 45 miles) provides downhill skiing.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>black bear and mountain lion country</strong>, with grizzly
        bears increasingly present in the foothills surrounding the Gallatin Valley. Carry bear
        spray on every hike, make noise on the trail, and store food properly. Rattlesnakes are
        present on lower-elevation trails and rocky outcrops, particularly at Madison Buffalo Jump
        and along south-facing slopes in spring and summer{'\u2014'}watch where you step and place
        your hands.
      </p>
      <p>
        Cell service is generally available in {townName} and along major highways but becomes
        unreliable on backcountry trails and in canyon bottoms. Carry a paper map or downloaded
        offline maps for any hike beyond the state parks. The valley floor trails near the rivers
        can flood during spring runoff in May and June{'\u2014'}check conditions before heading
        out. Deer, eagles, and osprey are common along the rivers; elk and bears frequent the
        higher-elevation trails in the surrounding ranges.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
