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
        {townName} is one of the best hiking bases in Montana, with 49 trailheads within 30 miles
        of the city. From a quick after-work climb up the M Trail to multi-day backpacking trips in
        the Rattlesnake Wilderness, the range of options here is exceptional for a city of any size.
        This guide organizes trails by distance from {townName} and covers seasonal considerations.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>49 trailheads</strong> within 30 miles</li>
        <li><strong>8 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>6 state parks</strong> with trail systems</li>
        <li><strong>Closest trailhead:</strong> M Trail (Mount Sentinel), 1 mile from downtown</li>
        <li><strong>Closest wilderness:</strong> Rattlesnake Wilderness, 5 miles</li>
        <li><strong>Ski area:</strong> Snowbowl, 12 miles (summer hiking trails available)</li>
      </ul>

      <h2>In-Town & Urban Trails (Within 6 Miles)</h2>
      <p>
        {townName}'s urban trail network is one of its defining features. You can walk from a downtown
        coffee shop to a mountain trail in under 20 minutes. The most iconic is the M Trail on Mount
        Sentinel, a steep switchback climb to the university's signature whitewashed "M" that rewards
        with panoramic views of the five valleys. On any given evening, you'll find dozens of locals
        making the 2,000-foot roundtrip ascent.
      </p>
      <p>
        The Kim Williams Nature Trail follows the Clark Fork River through the heart of the city,
        connecting to Hellgate Canyon and eventually reaching the Mount Sentinel trail system.
        It's flat, paved for portions, and popular with runners and cyclists. The Rattlesnake
        corridor begins just a few miles north, with the Rattlesnake Trailhead providing access
        to both easy creek-side walks and longer routes into the Rattlesnake Wilderness.
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

      <h2>Day Hikes (6&#8211;25 Miles)</h2>
      <p>
        Within a 30-minute drive, the options expand dramatically. Pattee Canyon Recreation Area
        (5 miles south) offers a network of forested trails popular with mountain bikers and hikers
        alike. Blue Mountain (5 miles southwest) provides moderate-elevation hikes with views of
        the Bitterroot Valley. Further out, the Lolo Peak trail via Carlton Ridge (14 miles south)
        is one of the area's most rewarding summit hikes{' '}—{' '}a strenuous 9-mile roundtrip to
        a 9,096-foot peak with views stretching from the Bitterroots to the Mission Range.
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
        {townName} is surrounded by some of the most protected wilderness in the lower 48. The
        Rattlesnake Wilderness begins just 5 miles from downtown{' '}—{' '}one of the closest
        designated wilderness areas to any American city. At 33,000 acres, it offers alpine
        lakes, old-growth forest, and genuine solitude.
      </p>
      <p>
        The Selway-Bitterroot Wilderness (36 miles) is one of the largest wilderness areas in the
        contiguous U.S. at 1.3 million acres. The Welcome Creek Wilderness (25 miles) is smaller
        but rugged, with dense forests and steep terrain. And the Bob Marshall Wilderness
        complex{' '}—{' '}over a million acres of roadless backcountry{' '}—{' '}is accessible from
        trailheads farther northeast via the Seeley Lake corridor.
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
        Several Montana state parks near {townName} offer well-maintained trails with interpretive
        signage. Greenough Park (1 mile) is a forested urban retreat along Rattlesnake Creek.
        Milltown State Park (6 miles) occupies the restored site of a former dam and Superfund
        site at the confluence of the Clark Fork and Blackfoot rivers{' '}—{' '}a remarkable example
        of environmental reclamation. Travelers Rest State Park (10 miles) marks the historic
        campsite of Lewis and Clark.
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
        <strong>Spring (April–May):</strong> Lower-elevation trails clear of snow first. The M Trail
        and Kim Williams are typically accessible by April. Higher trails may not clear until June.
        Muddy conditions are common; gaiters and trekking poles help.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Peak hiking season. All trails are accessible.
        Temperatures can reach the mid-80s at lower elevations; carry plenty of water. Wildfire
        smoke is possible in late July and August.
      </p>
      <p>
        <strong>Fall (September–October):</strong> Many locals' favorite season. Cooler
        temperatures, fall colors (especially larch in October), and fewer crowds. Most trails
        remain accessible through October.
      </p>
      <p>
        <strong>Winter (November–March):</strong> Snowshoeing and cross-country skiing replace
        hiking on most trails. Pattee Canyon has groomed Nordic trails. The M Trail sees
        year-round use but can be icy. Avalanche awareness is essential in the backcountry.
      </p>

      <h2>Trail Safety</h2>
      <p>
        {townName}-area trails are in bear country{' '}—{' '}both black bears and grizzly bears.
        Carry bear spray, make noise on the trail, and store food properly. Mountain lion sightings
        are rare but do occur. Cell service is unreliable once you leave the immediate urban area;
        carry a map and let someone know your plans for any backcountry excursion.
      </p>
      <p>
        For more outdoor activities, see our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
