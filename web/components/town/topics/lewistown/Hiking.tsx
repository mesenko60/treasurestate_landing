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
        {townName} sits at 4,121 feet in the exact geographic center of Montana, the seat of
        Fergus County and home to 6,204 people. The town is surrounded by island-range geology{'\u2014'}
        isolated mountain ranges rising from the plains, including the <strong>Big Snowy Mountains</strong>{'\u2014'}
        Wilderness Study Area (21 miles) and the <strong>Judith Mountains</strong>. With{' '}
        <strong>17 campgrounds</strong>, <strong>3 nature reserves</strong>, <strong>3 lakes</strong>,{' '}
        <strong>2 museums</strong>, <strong>1 hot spring</strong> (Gigantic Warm Spring, 8 miles
        away) within 30 miles, {townName} is a gateway to prairie
        landscapes, rock art, and mountain backcountry. Bear Gulch Pictographs and the American Prairie
        Reserve are within day-trip range. Spring Creek Trout Hatchery area is 3 miles from town. For
        the full town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>17 campgrounds</strong> within 30 miles</li>
        <li><strong>3 nature reserves</strong> within 30 miles</li>
        <li><strong>3 lakes</strong> within 30 miles</li>
        <li><strong>2 museums</strong> within 30 miles</li>
        <li><strong>1 hot spring</strong> within 30 miles (Gigantic Warm Spring, 8 mi)</li>
        <li><strong>Closest wilderness:</strong> Big Snowy Mountains Wilderness Study Area, 21 miles</li>
        <li><strong>Spring Creek Trout Hatchery area:</strong> 3 miles</li>
        <li><strong>Peak season:</strong> June through October</li>
      </ul>

      <h2>Big Snowy Mountains</h2>
      <p>
        The <strong>Big Snowy Mountains</strong> (21 miles from {townName}) form a Wilderness Study
        Area protecting backcountry terrain south of the Judith Basin. The range rises dramatically
        from the plains, exemplifying the island-range geology typical of central Montana. Hiking
        and backpacking opportunities range from day hikes to multi-day trips. The Big Snowy Mountains
        provide a dramatic backdrop to {townName} and offer solitude and scenic vistas. Come prepared
        with maps, water, and appropriate gear for variable mountain weather.
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

      <h2>Judith Mountains and Bear Gulch Pictographs</h2>
      <p>
        The <strong>Judith Mountains</strong> rise east of {townName} and offer additional hiking
        and exploration. <strong>Bear Gulch Pictographs</strong> is a significant rock art site
        featuring Native American pictographs and petroglyphs created over thousands of years. The
        site preserves images from indigenous peoples and offers a unique glimpse into the
        region{'\u2019'}s pre-European history. Visitors should respect the site{'\u2019'}s cultural
        significance and follow access guidelines.
      </p>

      <h2>American Prairie Reserve</h2>
      <p>
        The <strong>American Prairie Reserve</strong> is a large-scale conservation project in
        northeastern Montana, working to restore a functioning prairie ecosystem with bison and
        native wildlife. The reserve is within day-trip range of {townName} and offers wildlife
        viewing, hiking, and a chance to experience the Great Plains as they once were. The project
        aims to create the largest nature reserve in the continental United States, connecting
        existing public lands.
      </p>

      {local.length > 0 && (
        <>
          <h2>Trails Near {townName}</h2>
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
        </>
      )}

      {midRange.length > 0 && (
        <>
          <h2>Mid-Range Trails (15{'\u2013'}35 Miles)</h2>
          <p>
            Beyond the immediate {townName} area, trails and access points throughout the Big Snowy
            Mountains, Judith Mountains, and surrounding public lands provide excellent day hiking
            and overnight options. Island ranges rising from the plains create distinctive
            landscapes and varied terrain for exploration.
          </p>
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
        </>
      )}

      {stateParks.length > 0 && (
        <>
          <h2>State Parks</h2>
          <p>
            State parks within 30 miles of {townName} provide maintained trail systems and
            day-use facilities, offering accessible alternatives to more remote backcountry.
          </p>
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
        </>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> Lower-elevation areas near {townName} are
        accessible by mid-April. Higher trails in the Big Snowy Mountains remain snowy and muddy
        through May. Prairie and foothill hikes offer early-season options.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. Most trails are clear by
        mid-June, though high passes may remain snowbound until late June. Summer highs in {townName}
        reach the 80s{'\u00b0'}F, but temperatures drop with elevation. Afternoon thunderstorms are
        common{'\u2014'}plan alpine hikes for early starts.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider this the finest hiking
        season. Crowds vanish, the air is crisp and clear, and fall colors light up the valleys.
        Wildlife viewing is exceptional. Snow can close high passes by mid-October. Hunting season
        begins in September{'\u2014'}wear blaze orange on trails during hunting season.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> High-elevation trails and the Big Snowy
        Mountains are buried under snow. The nearest downhill skiing is beyond 30 miles, but lower-
        elevation areas near {townName} can be walked when conditions allow, but expect cold and snow.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area includes prairie, foothills, and mountain terrain. Carry water, sun
        protection, and appropriate layers. Cell service can be unreliable beyond town. Carry a
        paper map or downloaded offline maps, and file a trip plan for any backcountry excursion.
        Weather in the island ranges can change quickly.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
