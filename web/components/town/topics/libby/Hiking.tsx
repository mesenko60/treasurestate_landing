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
        {townName} sits at 2,096 feet in Montana{'\u2019'}s rugged northwest corner, the seat of
        Lincoln County and home to 2,775 people. The town is surrounded by over 2 million acres of
        wilderness, anchored by the <strong>Cabinet Mountains Wilderness</strong> (94,360 acres) and
        Kootenai National Forest. With <strong>4 trailheads</strong> within 30 miles, {townName} is
        a gateway to Montana{'\u2019'}s largest undammed waterfall, ancient cedar groves, and
        pristine backcountry. One wilderness area, two waterfalls, and 23 campgrounds within 30
        miles make this some of the most accessible yet wild hiking country in northwest Montana. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>4 trailheads</strong> within 30 miles</li>
        <li><strong>1 wilderness area</strong> within 30 miles</li>
        <li><strong>2 waterfalls</strong> within 30 miles</li>
        <li><strong>23 campgrounds</strong> within 30 miles</li>
        <li><strong>Closest trailhead:</strong> Kootenai Falls area, 11 miles</li>
        <li><strong>Closest wilderness:</strong> Cabinet Mountains Wilderness, 94,360 acres</li>
        <li><strong>Ski area:</strong> Turner Mountain, 12 miles (winter)</li>
        <li><strong>Peak season:</strong> June through October (bear country{'\u2014'}carry bear spray)</li>
      </ul>

      <h2>Kootenai Falls</h2>
      <p>
        <strong>Kootenai Falls</strong> (11 miles from {townName}) is Montana{'\u2019'}s largest
        undammed waterfall and the crown jewel of day hiking near {townName}. The Kootenai River
        drops through a dramatic gorge with turquoise water churning below. A thrilling suspension
        bridge crosses 90 feet above the river, offering unforgettable views. The falls have been
        featured in films including {'\u201C'}The River Wild{'\u201D'} and {'\u201C'}The
        Revenant.{'\u201D'} The site is sacred to the Kootenai Tribe and is managed as Kootenai
        Falls Wildlife Management Area. The short hike to the falls and bridge is one of the most
        popular outings in northwest Montana.
      </p>
      <p>
        <strong>Kootenai Falls WMA</strong> (8 miles) and <strong>Leigh Creek Falls</strong> (12
        miles) provide additional waterfall and trail access within easy reach of {townName}. These
        areas offer forested trails along the Kootenai River corridor with opportunities for
        wildlife viewing and river access.
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

      <h2>Cabinet Mountains Wilderness</h2>
      <p>
        The <strong>Cabinet Mountains Wilderness</strong> covers 94,360 acres of pristine backcountry
        in the Cabinet Range, with peaks reaching 8,712 feet. The wilderness features rugged terrain,
        crystal-clear alpine lakes, ancient cedar groves, and abundant wildlife including grizzly
        bears, mountain goats, and elk. Hiking in the Cabinet Mountains means entering roadless
        wilderness with no cell service and no facilities{'\u2014'}come prepared with topographic
        maps, bear canisters or hang systems, water purification, and backcountry experience.
      </p>
      <p>
        <strong>Ross Creek Cedars</strong> Scenic Area, on the wilderness edge, contains western red
        cedars over 1,000 years old and 12 feet in diameter. The interpretive trail through the
        ancient grove is a must-do for visitors to the {townName} area. The Cabinet Mountains offer
        everything from short day hikes to multi-day backpacking and mountaineering. Bear country
        precautions are essential{'\u2014'}carry bear spray on every hike.
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

      <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
      <p>
        Beyond the immediate {townName} area, trails and access points throughout Kootenai National
        Forest and the Cabinet Mountains provide excellent day hiking and overnight options. The
        Libby-Troy corridor along U.S. Highway 2 offers multiple trailheads into the Cabinet
        Mountains Wilderness. Forest roads lead to trailheads for alpine lakes and high-elevation
        routes. Summer brings wildflowers and clear skies; fall offers golden larch and fewer
        crowds.
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

      <h2>State Parks</h2>
      <p>
        No state parks lie within 30 miles of {townName}. The nearest state parks are beyond the
        30-mile radius but remain day-trip options for visitors seeking maintained trail systems,
        interpretive signage, and campground access as alternatives to the more remote wilderness
        trails in the Cabinet Mountains.
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
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation trails near Kootenai Falls
        and along the river corridor are accessible by mid-April. Higher trails in the Cabinet
        Mountains remain snowy and muddy through May.         The Cabinet Mountains Wilderness is largely
        inaccessible due to deep snowpack and avalanche danger. Grizzly bears are emerging from
        hibernation{'\u2014'}bear spray is essential on every hike.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Most trails are clear by
        mid-June, though high passes in the Cabinet Mountains may remain snowbound until late June.
        Summer highs in {townName} reach the 80s{'\u00b0'}F, but temperatures drop with elevation.
        Afternoon thunderstorms are common{'\u2014'}plan alpine hikes for early starts. Wildfire
        smoke can affect air quality in late July and August.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider this the finest hiking
        season in the Cabinet Mountains. Crowds vanish, the air is crisp and clear, and fall
        colors{'\u2014'}golden larch and aspen{'\u2014'}light up the valleys. Wildlife viewing is
        exceptional. Snow can close high passes by mid-October. Hunting season begins in
        September{'\u2014'}wear blaze orange on trails during hunting season.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails and the Cabinet
        Mountains Wilderness are buried under snow. <strong>Turner Mountain</strong> (12 miles)
        provides downhill skiing. Lower-elevation areas near {townName} can be walked when conditions
        allow, but expect cold and snow. Avalanche danger is significant in the Cabinet
        Mountains{'\u2014'}backcountry winter travel requires avalanche training and equipment.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is <strong>bear country</strong>{'\u2014'}grizzly bears and black bears
        are present throughout the Cabinet Mountains and Kootenai National Forest. Carry bear spray
        on every hike, make noise on the trail, hike in groups when possible, and store food in
        bear-resistant containers in the backcountry. The Cabinet Mountains Wilderness is home to
        grizzly bears, mountain lions, and other predators.
      </p>
      <p>
        Cell service is unreliable beyond {townName} proper and nonexistent in the Cabinet Mountains
        Wilderness. Carry a paper map or downloaded offline maps, and file a trip plan for any
        backcountry excursion. Weather in the Cabinet Mountains can change quickly{'\u2014'}snow is
        possible at higher elevations in any month.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
