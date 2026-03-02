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
        {townName} sits at 2,064 feet on the Yellowstone River in eastern Montana, the seat of
        Dawson County and home to 4,873 people. This is <strong>badlands country</strong>{'\u2014'}
        eroded buttes, hoodoos, cap rocks, and exposed Late Cretaceous formations up to 65 million
        years old. <strong>Makoshika State Park</strong> (2 miles), Montana{'\u2019'}s largest state
        park at 11,500 acres, dominates the landscape south of town. With{' '}
        <strong>7 viewpoints</strong> within 7 miles, <strong>6 campgrounds</strong>,{' '}
        <strong>6 lakes</strong>, <strong>5 wildlife refuges</strong>, <strong>2 state parks</strong>,{' '}
        and <strong>11 museums</strong>, {townName} offers a hiking experience unlike anywhere else in
        Montana{'\u2014'}open, arid, fossil-rich terrain where dinosaur bones erode from canyon walls.
        For the full town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>40 recreation sites</strong> within 50 miles</li>
        <li><strong>7 viewpoints</strong> within 7 miles (all inside Makoshika State Park)</li>
        <li><strong>6 campgrounds</strong> within 50 miles</li>
        <li><strong>5 wildlife refuges</strong> within 50 miles</li>
        <li><strong>2 state parks</strong> within 50 miles (Makoshika, 2 mi)</li>
        <li><strong>1 formal trailhead:</strong> Vista View Trailhead, 5 miles</li>
        <li><strong>No wilderness areas</strong>{'\u2014'}this is prairie and badlands, not mountains</li>
        <li><strong>Best seasons:</strong> Spring (April{'\u2013'}May) and fall (September{'\u2013'}October)</li>
        <li><strong>Hazards:</strong> Extreme heat, rattlesnakes, limited water and shade</li>
      </ul>

      <h2>Makoshika State Park</h2>
      <p>
        <strong>Makoshika State Park</strong> (2 miles from {townName}) is Montana{'\u2019'}s largest
        state park, covering 11,500 acres of badlands terrain. The name comes from the Lakota word
        meaning {'\u201C'}bad land{'\u201D'} or {'\u201C'}bad earth.{'\u201D'} The park exposes
        Late Cretaceous geology{'\u2014'}formations dating back 65 million years, when this landscape
        was a subtropical floodplain bordering an inland sea. Fossils of <strong>Triceratops</strong>,{' '}
        <strong>Tyrannosaurus rex</strong>, and other dinosaurs have been found eroding from canyon
        walls and buttes throughout the park.
      </p>
      <p>
        Hiking in Makoshika is unlike mountain hiking in western Montana. The terrain is open and
        exposed{'\u2014'}eroded buttes, deep coulees, cap rock formations, and hoodoos sculpted by
        wind and water. Seven named viewpoints lie within 7 miles of town: <strong>Caines Coulee
        Overlook</strong> (3 mi), <strong>Eyeful Vista Point</strong> (4 mi),{' '}
        <strong>Pine on Rocks Vista</strong> (4 mi), <strong>Kinney Coulee Vista</strong> (4 mi),{' '}
        <strong>Caprock Vista View and Trail</strong> (4 mi), <strong>Artists Vista</strong> (6 mi),
        and <strong>Sandcreek Coulee Overlook</strong> (7 mi). The <strong>Caprock Trail</strong> at
        4 miles from town takes hikers through signature cap rock formations. The park also features
        a disc golf course and an archery range.
      </p>

      <h2>Vista View Trailhead</h2>
      <p>
        <strong>Vista View Trailhead</strong> (5 miles from {townName}) is the only formal trailhead
        in the area{'\u2019'}s recreation data. From here, hikers access panoramic views across the
        badlands{'\u2014'}layered buttes stretching to the horizon, with the Yellowstone River valley
        visible to the north. The trail traverses open terrain with little shade, so carry plenty of
        water and start early in warm weather.
      </p>

      {stateParks.length > 0 && (
        <>
          <h2>State Parks</h2>
          <p>
            Two state parks lie within 50 miles of {townName}. Makoshika dominates outdoor recreation
            in the immediate area, offering maintained trails, campgrounds, and visitor facilities
            within a badlands landscape found nowhere else in Montana.
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

      {local.length > 0 && (
        <>
          <h2>Trails Near {townName}</h2>
          <table style={tableStyle}>
            <thead>
              <tr style={headRow}>
                <th style={thStyle}>Trail / Trailhead</th>
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
            Beyond the immediate {townName} area, trails and access points in the surrounding
            badlands and prairie provide additional day-hiking options. The terrain remains open
            and arid{'\u2014'}expect exposed ridgelines, coulees, and grassland rather than
            forested mountain trails.
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

      {backcountry.length > 0 && (
        <>
          <h2>Extended Trips (35+ Miles)</h2>
          <p>
            For hikers looking beyond the {townName} area, <strong>Theodore Roosevelt National
            Park</strong> in western North Dakota (approximately 90 miles) offers additional badlands
            hiking through dramatic Painted Canyon terrain. Short Pines OHV Recreation Area
            (2,800 acres) provides off-road trails that double as hiking routes through rough breaks
            country.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRow}>
                <th style={thStyle}>Trail / Area</th>
                <th style={thRight}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {backcountry.map(t => (
                <tr key={t.name} style={bodyRow}>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdRight}>{t.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> The best season for badlands hiking near{' '}
        {townName}. Temperatures are mild, wildflowers bloom on the prairie, and the landscape is
        green before summer heat sets in. Trails in Makoshika State Park are accessible by early
        April. Spring storms can bring brief but intense rain{'\u2014'}clay soils become extremely
        slippery when wet.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Extreme heat dominates. {townName} has
        recorded temperatures as high as 117{'\u00b0'}F. Hiking in July and August requires early
        morning starts{'\u2014'}finish by mid-morning. There is virtually no shade on badlands
        trails. Carry at least one gallon of water per person per day. Rattlesnakes are active.
        Dawn and dusk offer the best conditions.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many consider fall the finest hiking
        season near {townName}. Heat breaks, skies are clear, and the badlands take on warm autumn
        tones. Wildlife viewing is excellent. Hunting season begins in September{'\u2014'}wear blaze
        orange on trails during hunting season.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Cold and wind limit hiking, but mild days
        can offer good conditions in the badlands. Snow is typically light in this part of eastern
        Montana. Makoshika State Park remains open year-round, though the scenic drive may close
        temporarily after snow or ice.
      </p>

      <h2>Trail Safety</h2>
      <p>
        Badlands hiking near {townName} presents hazards different from mountain hiking in western
        Montana. <strong>Heat</strong> is the primary danger{'\u2014'}carry far more water than you
        think you need. <strong>Rattlesnakes</strong> are present; watch where you step and place
        your hands. The terrain offers <strong>no shade</strong> and <strong>no water sources</strong>{'\u2014'}
        bring everything you need. Clay soils become treacherous when wet. Cell service can be
        unreliable in coulees and canyons. Carry a paper map or downloaded offline maps.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
