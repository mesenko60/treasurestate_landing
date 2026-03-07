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
  const urban = trails.filter(t => t.distMiles <= 6);
  const day = trails.filter(t => t.distMiles > 6 && t.distMiles <= 25);
  const backcountry = trails.filter(t => t.distMiles > 25).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at the north end of the Gallatin Valley, framed by the Bridger Mountains
        to the northeast and the Gallatin Range to the south. With 16 trailheads within 30 miles,
        it's a compact but remarkably varied hiking base — from gentle riverside walks in town to
        exposed alpine ridgelines above 9,000 feet. Home to Montana State University and a
        thriving outdoor culture, {townName} treats trail access as a daily amenity rather than
        a weekend event. This guide organizes trails by distance from {townName} and covers
        seasonal considerations. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>16 trailheads</strong> within 30 miles</li>
        <li><strong>2 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>3 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> Peet's Hill / Burke Park Trail, 1 mile from downtown</li>
        <li><strong>Closest wilderness:</strong> Lee Metcalf Wilderness (Spanish Peaks), 23 miles</li>
        <li><strong>Ski area:</strong> Bridger Bowl, 16 miles (summer hiking trails available)</li>
      </ul>

      <h2>In-Town & Urban Trails (Within 6 Miles)</h2>
      <p>
        {townName}'s urban trail network punches well above what you'd expect for a city of
        55,000. Peet's Hill, just a mile from Main Street, is a gentle grassy knoll with
        360-degree views of the surrounding ranges — locals use it for everything from morning
        dog walks to sunset picnics. The M Trail on Baldy Mountain is the city's signature
        climb, a steep series of switchbacks ascending to the whitewashed "M" that marks
        Montana State University. On any spring evening you'll find dozens of students and
        residents making the quick but lung-burning ascent.
      </p>
      <p>
        Drinking Horse Mountain, four miles north of town off Bridger Canyon Road, is a
        favorite moderate hike with a loop option and panoramic views from the summit. Sypes
        Canyon, five miles northeast, follows a creek through the Bridger foothills before
        opening onto exposed ridgeline — it's a gateway to longer traverses along the
        Bridger Ridge for those with the ambition and fitness.
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

      <h2>Day Hikes (6–25 Miles)</h2>
      <p>
        The Hyalite Canyon area, about 10 miles south of {townName}, is the region's day-hiking
        epicenter. A paved road winds past Hyalite Reservoir and into a glacially carved canyon
        holding a dozen trails. Palisade Falls is a short, accessible walk to a dramatic 80-foot
        cascade — perfect for families. Emerald and Heather Lakes offer moderate alpine lake hikes
        through subalpine forest. The Hyalite Peak trail tops out at 10,298 feet with commanding
        views of the Gallatin Range and, on clear days, the Absaroka-Beartooths to the east.
      </p>
      <p>
        North of town, the Bridger Ridge Trail is {townName}'s premier long day hike — a
        20-mile point-to-point ridgeline traverse across the crest of the Bridger Mountains.
        The route stays above 8,000 feet for most of its length, with exposure and wind but
        extraordinary views into the Gallatin Valley on one side and the Shield River drainage
        on the other. Most hikers shuttle cars between Fairy Lake and the Ross Pass or Bridger
        Bowl trailheads. Sacagawea Peak, the highest point in the Bridgers at 9,665 feet, is
        reached via a spur trail from Fairy Lake and rewards with one of the finest summit
        panoramas in southwest Montana.
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

      <h2>Wilderness & Backcountry</h2>
      <p>
        The Lee Metcalf Wilderness flanks {townName} from two directions. The Spanish Peaks
        unit, 23 miles southwest, is the closest designated wilderness — a compact but rugged
        area of alpine lakes, granite peaks, and old-growth spruce-fir forest. Popular
        objectives include the Spanish Lakes, Mirror Lake, and multi-day loops through the
        upper Gallatin drainage. The Madison Range unit, 37 miles to the west, is wilder and
        less traveled, with peaks topping 10,000 feet and genuine solitude.
      </p>
      <p>
        The Absaroka-Beartooth Wilderness lies 81 miles to the east near Red Lodge — a longer
        drive but worth it for its immense scale. At nearly one million acres, it encompasses
        Montana's highest peaks, the Beartooth Plateau above 10,000 feet, and over a thousand
        alpine lakes. Multi-day trips into the Lake Plateau or the Stillwater drainage are
        among the finest backcountry experiences in the northern Rockies.
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
        Story Mill Community Park, just two miles from downtown, is {townName}'s showpiece urban
        nature park — 60 acres of restored wetlands, ponds, and paved trails along Bozeman
        Creek with interpretive signage on local ecology. Missouri Headwaters State Park, 28
        miles northwest, marks the confluence where the Jefferson, Madison, and Gallatin rivers
        join to form the Missouri River. Lewis and Clark camped here in 1805, and the park
        preserves both the geographic landmark and the historical significance with interpretive
        trails along the riverbanks. Lewis and Clark Caverns State Park, 41 miles west, features
        Montana's most extensive limestone cave system alongside above-ground trails offering
        views of the Jefferson River valley.
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
        <strong>Spring (April–May):</strong> Lower-elevation trails like Peet's Hill and the M
        Trail clear of snow by early April. Drinking Horse and Sypes Canyon are usually hikeable
        by mid-April, though muddy stretches are common. Hyalite Canyon road may remain gated
        until late May depending on snowpack. Bridger Ridge holds snow well into June.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak season. All trails are accessible, including
        high-alpine routes in the Spanish Peaks and Beartooths. Temperatures reach the mid-80s
        at valley floor; carry plenty of water. Afternoon thunderstorms are common above
        treeline — plan alpine hikes for early starts. Wildfire smoke can affect air quality
        in late July and August.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Arguably the finest hiking season in the
        Gallatin Valley. Crisp mornings, golden aspens in Hyalite Canyon, and significantly
        fewer crowds. Most trails remain snow-free through mid-October. Larch season in the
        surrounding ranges peaks in the second week of October.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Snowshoeing and cross-country skiing replace
        hiking on most trails. Hyalite Canyon is a hub for Nordic skiing and ice climbing. The
        M Trail sees year-round use but can be icy — microspikes are recommended. Avalanche
        awareness is essential for any backcountry travel in the Bridgers or Gallatin Range.
      </p>

      <h2>Trail Safety</h2>
      <p>
        {townName}-area trails are in bear country — both black bears and grizzly bears are
        present in the Gallatin and Bridger ranges. Carry bear spray, make noise on the trail,
        and store food properly in the backcountry. Mountain lion sightings occur occasionally,
        particularly in Bridger Canyon and the Hyalite drainage. Cell service is unreliable
        beyond the immediate valley floor; carry a paper map and let someone know your plans
        for any backcountry excursion.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
