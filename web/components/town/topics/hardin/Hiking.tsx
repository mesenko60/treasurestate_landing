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
        {townName} sits at 2,900 feet in Big Horn County, southeastern Montana, where the Bighorn
        River meets the Little Bighorn River before flowing into the Yellowstone. This is{' '}
        <strong>battlefield country</strong>{'\u2014'}the Little Bighorn Battlefield National Monument
        lies just 14 miles south, and the surrounding landscape is steeped in Crow Nation heritage
        and frontier history. The terrain around {townName} is open prairie, river bottomland, and
        rolling grassland{'\u2014'}not mountain country. Hiking here means walking historic battlefields,
        exploring wildlife management areas along the Bighorn River, and day-tripping to canyon
        country at Bighorn Canyon National Recreation Area. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      {local.length > 0 && (
        <>
          <h2>Trails Near {townName}</h2>
          <table style={tableStyle}>
            <thead>
              <tr style={headRow}>
                <th style={thStyle}>Trail / Site</th>
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

      <h2>In-Town &amp; Nearby Walking</h2>
      <p>
        The closest outdoor walking near {townName} is at <strong>Grant Marsh Wildlife Management
        Area</strong> (7 miles), where informal paths follow the Bighorn River through cottonwood
        bottomland and wetland habitat. The WMA offers birding, wildlife observation, and quiet
        riverside walks through terrain that supports whitetail deer, pheasants, wild turkeys, and
        waterfowl.
      </p>
      <p>
        <strong>Little Bighorn Battlefield National Monument</strong> (14 miles) provides a
        4.5-mile self-guided tour road with walking paths between interpretive markers across the
        battlefield. Visitors can walk among the marble headstones marking where soldiers and
        warriors fell during the June 1876 battle. The battlefield sits on open ridgeline
        terrain{'\u2014'}exposed and windswept{'\u2014'}with views across the Little Bighorn River valley.{' '}
        <strong>Weir Point</strong> (17 miles) offers an elevated overlook above the battlefield,
        providing the same vantage point Captain Weir used during the battle. The{' '}
        <strong>7th Cavalry horse cemetery</strong> and{' '}
        <strong>Tomb of the Unknown Soldier &amp; Peace Memorial</strong> are also within the
        monument grounds.
      </p>

      <h2>Bighorn Canyon National Recreation Area</h2>
      <p>
        <strong>Bighorn Canyon NRA</strong> (52 miles via Fort Smith) covers over 120,000 acres
        where the Bighorn River has carved a dramatic canyon with walls rising over 1,000 feet.
        The North District, accessed from Fort Smith, Montana, offers 17 miles of trails through
        canyon-rim terrain, sagebrush flats, and juniper woodlands. Named trails in the North
        District include the <strong>Beaver Pond Nature Trail</strong> (2.6 miles round trip,
        moderate), <strong>Bighorn Head Gate</strong> (0.1 miles), and{' '}
        <strong>Three Mile Access Trail</strong> (2 miles round trip, easy). The canyon itself is
        spectacular{'\u2014'}a deep, arid gorge cutting through limestone and dolomite formations,
        with bighorn sheep visible on the cliffs and raptors soaring above the rim.
      </p>

      <h2>Chief Plenty Coups State Park</h2>
      <p>
        <strong>Chief Plenty Coups State Park</strong> (31 miles) near Pryor preserves the home
        and legacy of the last traditional chief of the Crow Nation. The 195-acre park, designated
        a <strong>National Historic Landmark</strong>, features walking trails through meadows,
        cottonwood groves, and along a spring-fed creek. The sacred spring on the property holds
        deep cultural significance to the Crow people. The park{'\u2019'}s gentle terrain makes it
        accessible for all ages. Entry is $5 per vehicle. The visitor center and historic cabin
        provide context for the landscape and the Crow Nation{'\u2019'}s history in the Bighorn
        country.
      </p>

      <h2>Rosebud Battlefield State Park</h2>
      <p>
        <strong>Rosebud Battlefield State Park</strong> (36 miles) preserves over 3,000 acres of
        undeveloped prairie where the Battle of the Rosebud was fought on June 17, 1876{'\u2014'}just
        eight days before the Battle of the Little Bighorn. Designated a{' '}
        <strong>National Historic Landmark</strong>, the park offers hiking through open grassland
        and rolling hills with interpretive markers. The terrain is wild and unmanicured{'\u2014'}no
        paved paths or maintained trails, just open prairie where visitors walk the same ground
        where Lakota, Cheyenne, and U.S. Army forces clashed. Spring wildflowers and fall golden
        grass make this an especially atmospheric hike.
      </p>

      <h2>Pompeys Pillar National Monument</h2>
      <p>
        <strong>Pompeys Pillar National Monument</strong> (26 miles) is a 150-foot sandstone butte
        rising above the Yellowstone River, famous as the site where William Clark carved his
        signature on July 25, 1806{'\u2014'}the <strong>only remaining physical evidence</strong> along
        the entire Lewis and Clark Trail. A boardwalk and stairway lead visitors to Clark{'\u2019'}s
        signature, protected behind glass. The walk is short but steep, and the views from the top
        span the Yellowstone River valley in both directions. Interpretive panels describe the
        pillar{'\u2019'}s significance to the Crow people (who called it {'\u201C'}the place where the
        mountain lion lies{'\u201D'}) and its role in the Lewis and Clark expedition.
      </p>

      {stateParks.length > 0 && (
        <>
          <h2>State Parks &amp; Historic Sites</h2>
          <p>
            Several state parks and nationally significant historic sites lie within day-trip range
            of {townName}, spanning Crow Nation heritage, frontier military history, and Lewis and
            Clark exploration.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRow}>
                <th style={thStyle}>Park / Site</th>
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

      {(wilderness.length > 0 || backcountry.length > 0) && (
        <>
          <h2>Wilderness &amp; Backcountry</h2>
          <p>
            South and west of {townName}, the landscape rises toward the Pryor Mountains and the
            Bighorn Range. <strong>Pryor Mountain Wild Horse Range</strong> (58 miles) is home to
            one of the few remaining herds of wild horses in the United States{'\u2014'}approximately
            120 mustangs roaming a rugged landscape of alpine meadows, desert canyons, and juniper
            woodlands. The area is remote and roads are unpaved; high-clearance vehicles are
            recommended. <strong>Burnt Timber Canyon WSA</strong> (59 miles) and{' '}
            <strong>Bighorn Tack-On WSA</strong> (57 miles) offer additional backcountry
            exploration through Wilderness Study Areas with no developed trails.
          </p>
          {wilderness.length > 0 && (
            <table style={tableStyle}>
              <thead>
                <tr style={headRow}>
                  <th style={thStyle}>Wilderness / Backcountry Area</th>
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
          {backcountry.length > 0 && (
            <table style={tableStyle}>
              <thead>
                <tr style={headRow}>
                  <th style={thStyle}>Trail / Area (35+ Miles)</th>
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
          )}
        </>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (April{'\u2013'}May):</strong> An excellent season for hiking near {townName}.
        Prairie wildflowers bloom, temperatures are mild (50s{'\u2013'}70s{'\u00B0'}F), and the landscape
        is green before summer heat arrives. The Bighorn River runs high with snowmelt. Trails at
        Chief Plenty Coups and Rosebud Battlefield are at their most scenic. Wind can be strong
        and persistent on the open prairie.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Hot and dry, with July highs averaging near
        90{'\u00B0'}F and occasional days above 100{'\u00B0'}F. Start early{'\u2014'}the open prairie and
        battlefield terrain offer little shade. Bighorn Canyon is especially dramatic in summer
        light but requires ample water. The Bighorn River corridor and cottonwood bottoms along
        Grant Marsh WMA provide the most comfortable warm-weather walking.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider fall the best hiking
        season around {townName}. Temperatures cool to pleasant 60s and 70s{'\u00B0'}F, cottonwoods
        along the rivers turn gold, and the battlefields take on a quiet, atmospheric quality. Big
        game and upland bird hunting seasons begin{'\u2014'}wear blaze orange on public land from October
        onward.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Cold but generally manageable{'\u2014'}January
        highs average around 40{'\u00B0'}F with lows near 20{'\u00B0'}F. Snowfall is modest compared to
        mountain areas. Little Bighorn Battlefield and Pompeys Pillar remain accessible on most
        winter days, and the stark winter prairie has its own austere beauty. Arctic cold snaps can
        push temperatures well below zero; check forecasts before venturing out.
      </p>

      <h2>Trail Safety</h2>
      <p>
        Hiking near {townName} presents different hazards than mountain country.{' '}
        <strong>Heat</strong> is the primary summer concern{'\u2014'}carry water on any outing, start
        early, and watch for heat exhaustion on exposed prairie and battlefield terrain.{' '}
        <strong>Rattlesnakes</strong> are present in the coulees, rocky breaks, and canyon country
        south and west of town; watch where you step. <strong>Ticks</strong> are common in spring
        in the river bottoms and grasslands. Bighorn Canyon trails involve cliff-edge terrain with
        significant drop-offs{'\u2014'}stay on marked paths. Cell service is reliable in {townName} and
        at the battlefield but can be spotty in canyon and backcountry areas; carry a paper map or
        downloaded offline maps.
      </p>
      <p>
        For water-based recreation, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
