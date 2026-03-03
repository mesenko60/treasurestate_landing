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
    .filter(h => h.type === 'Museum' && h.distMiles <= 15)
    .slice(0, 8);
  const stateParks = highlights
    .filter(h => h.type === 'State Park')
    .slice(0, 6);
  const viewpoints = highlights
    .filter(h => h.type === 'Viewpoint' && h.distMiles <= 35)
    .slice(0, 6);
  const historicSites = highlights
    .filter(h => h.type === 'Historic Site')
    .slice(0, 8);
  const fishingAccess = highlights
    .filter(h => h.type === 'Fishing Access')
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} immerses you in one of the most consequential
        landscapes in American history{'\u2014'}the Little Bighorn Valley, where
        268 U.S. soldiers and scouts{'\u2014'}including Lt. Col. George Armstrong
        Custer{'\u2014'}fell on June 25{'\u2013'}26, 1876, in a battle against Lakota Sioux,
        Northern Cheyenne, and Arapaho warriors that shocked the nation and reshaped
        U.S. policy toward Native peoples. {townName} (pop. 3,818) sits 46
        miles east of Billings on I-90, serving as the gateway to the Little
        Bighorn Battlefield National Monument and to the Crow Indian
        Reservation{'\u2014'}home of the annual Crow Fair, the largest outdoor powwow in
        the world with 1,500+ teepees and 45,000{'\u2013'}50,000 attendees each August.
        Beyond the battlefield, the Bighorn River south of town is a
        world-class trout fishery, Pompeys Pillar preserves William Clark{'\u2019'}s
        1806 signature, and the surrounding Big Horn County offers vast
        grasslands, rimrock formations, and genuine small-town Montana
        hospitality. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>Late June</strong> is the signature time for {townName}{'\u2014'}the
        anniversary of the Battle of the Little Bighorn (June 25{'\u2013'}26) brings
        the annual <strong>Custer{'\u2019'}s Last Stand Reenactment</strong> with 200+
        participants recreating the battle on land near the original site. The
        reenactment, held annually around June 25, is one of the largest
        battle reenactments in the West.
      </p>
      <p>
        <strong>August</strong> brings <strong>Crow Fair</strong>, held on the Crow
        Agency grounds just south of {townName}{'\u2014'}six days of dancing, rodeo,
        horse racing, and traditional ceremony that has earned the Crow
        Reservation the title {'\u201C'}Teepee Capital of the World.{'\u201D'} The
        encampment of 1,500+ teepees along the Little Bighorn River is a sight
        without equal in the United States.
      </p>
      <p>
        <strong>June through September</strong> offers the best weather for
        exploring the battlefield, fishing the Bighorn River, and visiting
        Pompeys Pillar and Chief Plenty Coups State
        Park{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> Late June for the battle anniversary and reenactment; August for Crow Fair; June{'\u2013'}September for warm weather and river access</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F{'\u2014'}hot and dry with expansive prairie skies</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F{'\u2014'}cold with occasional chinook winds</li>}
        <li><strong>Getting here:</strong> I-90, 46 miles east of Billings; fly into Billings Logan International Airport (BIL) and drive east on I-90</li>
        <li><strong>Getting around:</strong> Car essential{'\u2014'}the battlefield is 14 miles south, Pompeys Pillar 26 miles west, and the Bighorn River access at Fort Smith is 45 miles south</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; Little Bighorn Battlefield entrance is $10/vehicle; {townName}{'\u2019'}s restaurants and lodging are significantly cheaper than western Montana</li>
        <li><strong>Key distances:</strong> Little Bighorn Battlefield 14 mi, Weir Point 17 mi, Pompeys Pillar 26 mi, Chief Plenty Coups SP 31 mi, Rosebud Battlefield SP 36 mi, Billings 46 mi</li>
      </ul>

      <h2>Day 1: Battlefield &amp; History</h2>

      <h3>Morning: Big Horn County Historical Museum</h3>
      <p>
        Start your weekend at the <strong>Big Horn County Historical
        Museum</strong>, just a mile from downtown {townName}. This local
        history museum provides essential orientation to the region{'\u2014'}covering
        the Crow people, homesteading, ranching, and the military history that
        defines Big Horn County. Plan 45{'\u2013'}60 minutes to get your bearings
        before heading to the battlefield. Stop by the <strong>Visitor
        Center</strong> nearby to pick up maps and current information about
        ranger programs and events.
      </p>

      <h3>Mid-Morning to Afternoon: Little Bighorn Battlefield</h3>
      <p>
        Drive 14 miles south to <strong>Little Bighorn Battlefield National
        Monument</strong>{'\u2014'}the centerpiece of any {townName} weekend and one of
        the most important military history sites in the United States. The
        battlefield preserves the ground where Lt. Col. Custer and five
        companies of the 7th Cavalry were overwhelmed by a combined force of
        Lakota Sioux, Northern Cheyenne, and Arapaho on June 25{'\u2013'}26, 1876.
      </p>
      <p>
        Begin at the <strong>visitor center</strong>, where exhibits and a
        short film cover the battle{'\u2019'}s causes, course, and consequences from
        both U.S. Army and tribal perspectives. Then drive the{' '}
        <strong>4.5-mile self-guided tour road</strong>, stopping at{' '}
        <strong>Custer Hill</strong> (where the marble markers show where
        soldiers fell), the <strong>Indian Memorial</strong> (dedicated in
        2003 to honor the Lakota, Cheyenne, and Arapaho warriors), and the{' '}
        <strong>Reno-Benteen Battlefield</strong> at the south end of the tour
        road, where Major Reno{'\u2019'}s troops fought a desperate hilltop defense.
        Don{'\u2019'}t miss the <strong>7th Cavalry horse cemetery</strong> near the
        visitor center. Ranger-led talks and walks, available seasonally, add
        valuable depth. Plan at least 2{'\u2013'}3 hours for the full experience.
      </p>

      <h3>Late Afternoon: Weir Point</h3>
      <p>
        From the battlefield, drive or walk to <strong>Weir Point</strong> (17
        miles from {townName}), an overlook where Captain Weir attempted to
        advance toward Custer{'\u2019'}s position during the battle. The viewpoint
        offers a sweeping panorama of the battlefield landscape and helps you
        understand the terrain that shaped the fight{'\u2014'}the rolling grassland,
        the river valley below, and the distances that made communication
        between Custer{'\u2019'}s and Reno{'\u2019'}s commands impossible.
      </p>

      <h3>Evening: Dinner &amp; Sunset</h3>
      <p>
        Return to {townName} for dinner. The town{'\u2019'}s restaurants are
        straightforward and affordable{'\u2014'}steak and American fare in a genuine
        small-town setting. After dinner, drive to a vantage point outside
        town for sunset over the prairie. The Big Horn Valley sunsets{'\u2014'}enormous
        skies streaked with color above the rimrock and grassland{'\u2014'}are
        spectacular and a fitting end to a day spent on hallowed ground.
      </p>

      <h2>Day 2: Monuments &amp; Rivers</h2>

      <h3>Option A: Pompeys Pillar &amp; Chief Plenty Coups</h3>
      <p>
        Drive 26 miles west on I-90 to <strong>Pompeys Pillar National
        Monument</strong>{'\u2014'}a 150-foot sandstone pillar rising from the
        Yellowstone River valley that bears the only remaining physical
        evidence of the Lewis and Clark Expedition. William Clark carved his
        name and the date (July 25, 1806) into the rock during the
        expedition{'\u2019'}s return journey, and you can still see the signature
        today, protected behind glass. A boardwalk leads to the top with
        views across the Yellowstone bottomland{'\u2014'}the same vista Clark
        described in his journal. Plan 60{'\u2013'}90 minutes.
      </p>
      <p>
        From Pompeys Pillar, drive south to <strong>Chief Plenty Coups State
        Park</strong> (31 miles from {townName}), the home and burial site of
        the last traditional chief of the Crow Nation. The park ($5/vehicle)
        preserves the chief{'\u2019'}s log home, walking trails through cottonwood
        groves, and the <strong>sacred spring</strong> where Plenty Coups
        received his childhood vision. The visitor center covers Crow history
        and Plenty Coups{'\u2019'} remarkable diplomacy{'\u2014'}he traveled to Washington,
        D.C. and represented all Native Americans at the Tomb of the Unknown
        Soldier dedication in 1921. This is one of Montana{'\u2019'}s most meaningful
        and least-visited historic sites.
      </p>

      <h3>Option B: Bighorn River &amp; Canyon</h3>
      <p>
        Drive 45 miles south to <strong>Fort Smith</strong> and the{' '}
        <strong>Bighorn River</strong>{'\u2014'}one of the premier trout fisheries in
        the American West. The tailwater below Yellowtail Dam produces
        trophy-size brown and rainbow trout in a dramatic canyon setting.
        Even if you don{'\u2019'}t fish, the drive south through the Crow
        Reservation follows the Little Bighorn River through open rangeland
        and offers access to <strong>Bighorn Canyon</strong> views. For
        fishing details, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>

      <h3>Afternoon: Return via I-90</h3>
      <p>
        Head back to {townName} via I-90 with time for any stops you missed.
        The <strong>Tomb of the Unknown Soldier &amp; Peace Memorial</strong> at
        Crow Agency (17 miles south) is worth a brief stop{'\u2014'}a quiet,
        reflective site that connects to the broader history of the Crow
        people{'\u2019'}s relationship with the U.S. military. If you have extra time,
        continue east on I-90 toward Billings and stop at{' '}
        <strong>Pictograph Cave State Park</strong> (42 miles west) or{' '}
        <strong>Lake Elmo State Park</strong> (41 miles west) for a walk
        before heading home.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName}{'\u2019'}s cultural attractions center on the military and Native
        American history of the Little Bighorn Valley{'\u2014'}a landscape where
        the consequences of westward expansion played out in ways that still
        resonate:
      </p>
      {museums.length > 0 && (
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
      )}

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Late June (Battle Anniversary):</strong> The anniversary of
        the Battle of the Little Bighorn (June 25{'\u2013'}26) is marked by the annual{' '}
        <strong>Custer{'\u2019'}s Last Stand Reenactment</strong> with 200+
        participants{'\u2014'}one of the largest battle reenactments in the West.
        The battlefield hosts special ranger programs and commemorative
        events. Book lodging well in advance.
      </p>
      <p>
        <strong>August (Crow Fair):</strong> The Crow Fair transforms the
        landscape south of {townName} into a city of 1,500+ teepees along the
        Little Bighorn River{'\u2014'}six days of traditional dancing, rodeo, horse
        racing, and ceremony drawing 45,000{'\u2013'}50,000 attendees. It is one of
        the most significant cultural events in the American West. Lodging in
        {townName} books up{'\u2014'}reserve months ahead.
      </p>
      <p>
        <strong>Summer:</strong> Hot{'\u2014'}July highs average 90{'\u00B0'}F and can exceed
        100{'\u00B0'}F. Plan outdoor activities for morning and evening. The Bighorn
        River fishes well all summer. The battlefield is best visited early
        in the day to avoid crowds and heat.
      </p>
      <p>
        <strong>Fall:</strong> September and October bring comfortable
        temperatures, golden cottonwoods along the rivers, and fewer crowds
        at the battlefield. Hunting season opens across the surrounding
        prairie and rimrock country.
      </p>
      <p>
        <strong>Winter:</strong> Cold but quiet{'\u2014'}January highs around
        40{'\u00B0'}F, lows near 20{'\u00B0'}F. The battlefield is open year-round and
        eerily beautiful under snow. {townName}{'\u2019'}s museums and restaurants
        provide warm stops between outdoor excursions.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits in the Bighorn River valley of south-central
            Montana at roughly 2,900 feet. Summers are hot and dry with cool
            evenings; winters are cold with occasional chinook winds that can
            bring rapid warming. The semi-arid climate means low humidity and
            big temperature swings between day and night.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Month</th>
                <th style={thRightStyle}>Avg High ({'\u00B0'}F)</th>
                <th style={thRightStyle}>Avg Low ({'\u00B0'}F)</th>
              </tr>
            </thead>
            <tbody>
              {climate.map(c => (
                <tr key={c.month} style={rowStyle}>
                  <td style={tdStyle}>{c.month}</td>
                  <td style={tdRightStyle}>{c.avgHigh}{'\u00B0'}</td>
                  <td style={tdRightStyle}>{c.avgLow}{'\u00B0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Getting There</h2>
      <p>
        {townName} sits on <strong>I-90</strong>, 46 miles east of Billings
        {'\u2014'}an easy 45-minute drive. Fly into <strong>Billings Logan
        International Airport</strong> (BIL), Montana{'\u2019'}s busiest airport
        with service from most major carriers, and rent a car for the drive
        east. From the west, I-90 crosses the state from Missoula through
        Butte and Billings. From the east, I-90 connects from Sheridan,
        Wyoming and the Black Hills of South Dakota. A car is essential
        {'\u2014'}the battlefield, Pompeys Pillar, Chief Plenty Coups, and the
        Bighorn River are all outside town and require driving.
      </p>

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Layers:</strong> {townName}{'\u2019'}s semi-arid climate means big temperature swings{'\u2014'}mornings can be 30{'\u00B0'}F cooler than afternoon highs, even in summer</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}the battlefield and prairie offer little shade, and elevation intensifies UV exposure</li>
        <li><strong>Comfortable walking shoes:</strong> The battlefield tour involves walking on uneven terrain; sturdy shoes are essential for Custer Hill, the Indian Memorial, and Reno-Benteen</li>
        <li><strong>Binoculars:</strong> Useful for scanning the battlefield landscape from Weir Point and spotting wildlife along the rivers</li>
        <li><strong>Water bottle:</strong> Essential in summer{'\u2014'}the battlefield has limited shade and temperatures can exceed 100{'\u00B0'}F</li>
        <li><strong>Camera:</strong> The battlefield, Pompeys Pillar, and Big Horn Valley landscapes reward photography at all hours</li>
        <li><strong>Fishing gear:</strong> Rod and waders if visiting the Bighorn River; Montana fishing license required</li>
        <li><strong>Winter additions:</strong> Insulated boots, warm layers, and a windbreaker{'\u2014'}wind across the open prairie adds significant chill</li>
      </ul>

      {(stateParks.length > 0 || viewpoints.length > 0 || historicSites.length > 0) && (
        <>
          <h2>Highlights &amp; Nearby Attractions</h2>
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
                  {historicSites.map(h => (
                    <tr key={h.name} style={rowStyle}>
                      <td style={tdStyle}>{h.name}</td>
                      <td style={tdRightStyle}>{h.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
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
          {viewpoints.length > 0 && (
            <>
              <h3>Viewpoints</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Viewpoint</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewpoints.map(v => (
                    <tr key={v.name} style={rowStyle}>
                      <td style={tdStyle}>{v.name}</td>
                      <td style={tdRightStyle}>{v.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      {fishingAccess.length > 0 && (
        <>
          <h2>Fishing Access</h2>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Access Point</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {fishingAccess.map(f => (
                <tr key={f.name} style={rowStyle}>
                  <td style={tdStyle}>{f.name}</td>
                  <td style={tdRightStyle}>{f.distMiles} mi</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Where to Stay</h2>
      <p>
        {townName} has a selection of chain motels along the I-90 corridor
        that offer clean, reliable, and affordable lodging{'\u2014'}expect to pay
        significantly less than western Montana hotels. During the Custer
        {'\u2019'}s Last Stand Reenactment (late June) and Crow Fair (August), book
        well in advance{'\u2014'}the town fills up and nearby Billings hotels see
        increased demand as well. RV parks and campgrounds provide additional
        options for budget travelers.
      </p>
      <p>
        Billings (46 miles west on I-90) offers a full range of hotel,
        restaurant, and entertainment options if you want a larger-city base.
        Many visitors split their time between {townName} for the battlefield
        and historic sites and Billings for dining and nightlife.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
