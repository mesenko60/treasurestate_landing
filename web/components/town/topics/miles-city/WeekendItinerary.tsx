import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && h.distMiles <= 10)
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const fallClimate = climate?.find(m => m.month === 'Sep');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you in the heart of eastern Montana{'\u2019'}s cattle
        country{'\u2014'}a genuine Western town where the Bucking Horse Sale isn{'\u2019'}t a tourist
        attraction but a working livestock auction, where the Range Riders Museum
        preserves frontier history with the kind of authenticity that curated
        museums cannot replicate, and where the Yellowstone and Tongue rivers
        converge at the edge of a downtown that still feels like the Old West.
        {townName} is not a mountain resort or a gateway town{'\u2014'}it{'\u2019'}s a working
        community of 8,412 people that has been the hub of southeastern Montana
        since the 1870s. Visitors who come with open minds and a taste for
        authentic Western culture will find a town with real character. This
        three-day itinerary covers the essentials. For the full town profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best time to visit:</strong> Bucking Horse Sale weekend (third weekend of May); otherwise June{'\u2013'}September for warm weather and river access</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F{'\u2014'}hot and dry with big prairie skies</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}{'\u00B0'}F, lows near {fallClimate.avgLow}{'\u00B0'}F</li>}
        <li><strong>Getting here:</strong> Billings Logan International Airport (BIL, 145 miles west on I-94); or drive I-94 from Billings or I-94 from Bismarck, ND</li>
        <li><strong>Getting around:</strong> Car essential{'\u2014'}attractions are spread across town and the surrounding area; downtown Main Street is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and {townName}{'\u2019'}s restaurants and lodging are significantly cheaper than western Montana</li>
        <li><strong>Key distances:</strong> Billings 145 mi west; Makoshika State Park (Glendive) 135 mi east; Tongue River Reservoir 70 mi south</li>
      </ul>

      <h2>Day 1: Downtown & Western Heritage</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at a local diner on Main Street{'\u2014'}{townName}{'\u2019'}s downtown
        retains the kind of honest, small-town restaurant culture where the coffee
        is strong, the portions are generous, and the ranchers at the counter have
        been coming since before you were born. After breakfast, walk to the{' '}
        <strong>Range Riders Museum</strong>, {townName}{'\u2019'}s essential cultural
        attraction. This sprawling complex on the west end of town houses one of
        the most remarkable collections of frontier artifacts in Montana{'\u2014'}a
        genuine cabinet of curiosities assembled over decades by the Range Riders,
        a fraternal organization of local ranchers and cowboys. The museum covers
        Native American history, the open-range cattle era, the military history
        of Fort Keogh (established 1877), homesteading, and the town{'\u2019'}s evolution
        through the 20th century. Plan at least 90 minutes.
      </p>

      <h3>Midday</h3>
      <p>
        Walk or drive to the <strong>WaterWorks Art Museum</strong>, housed in the
        beautifully restored 1910 municipal water treatment plant. The building
        itself is worth the visit{'\u2014'}a striking example of early industrial
        architecture repurposed as gallery space. The museum hosts rotating
        exhibitions of regional and national art, with a focus on Western and
        contemporary work. From there, explore <strong>Main Street</strong>.
        {townName}{'\u2019'}s downtown is compact and unpretentious{'\u2014'}brick-front buildings
        house local businesses, a good bookstore, and bars that have served
        cowboys and ranchers for generations. The architecture reflects the town{'\u2019'}s
        early 1900s prosperity as a railroad and cattle-shipping hub.
      </p>

      <h3>Afternoon</h3>
      <p>
        Drive to <strong>Pirogue Island State Park</strong> on the east side of
        town for a walk along the Yellowstone River. The park occupies a
        cottonwood-shaded stretch of river bottomland{'\u2014'}flat, easy walking with
        good bird watching (bald eagles, great blue herons, white pelicans) and
        views across the wide Yellowstone. If it{'\u2019'}s summer and the temperature
        allows, bring fishing gear{'\u2014'}the river holds walleye, catfish, and sauger
        right at the park. For more on the fishing, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link>.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner downtown offers solid options at prices that will surprise anyone
        coming from western Montana. {townName}{'\u2019'}s restaurants lean toward steakhouses
        and American fare{'\u2014'}fitting for the Cow Capital of Montana. After dinner,
        explore the local bar scene. {townName}{'\u2019'}s bars are the real deal{'\u2014'}no
        craft-cocktail pretension, just honest Montana watering holes where
        ranchers, college students, and travelers share the room. The{' '}
        <strong>Montana Bar</strong> on Main Street is a classic. If you{'\u2019'}re
        visiting during the Bucking Horse Sale (third weekend of May), the entire
        town transforms into a Western festival{'\u2014'}rodeo events, street dances,
        concerts, and a livestock sale that draws buyers and spectators from across
        the region.
      </p>

      <h2>Day 2: Rivers & Prairie</h2>

      <h3>Morning</h3>
      <p>
        Head south along the <strong>Tongue River</strong> for a morning of
        exploration. The Tongue flows through a cottonwood-lined valley of ranch
        country south of {townName}, offering scenic driving, fishing access
        points, and a landscape that epitomizes eastern Montana. If you fish,
        bring spinning gear for smallmouth bass{'\u2014'}the Tongue{'\u2019'}s clear pools and
        rocky runs produce aggressive strikes on topwater lures and soft plastics.
        If you don{'\u2019'}t fish, the drive south through the valley is scenic in its
        own right{'\u2014'}rolling grassland, cottonwood groves, and working cattle
        ranches stretching to the horizon.
      </p>

      <h3>Midday</h3>
      <p>
        Return to town for lunch, then spend the afternoon on the{' '}
        <strong>Yellowstone River</strong>. Floating the Yellowstone by canoe or
        kayak from upstream access points back to town is a quintessential
        {townName} experience{'\u2014'}the river is broad, relatively slow through this
        reach, and the prairie scenery from water level is spectacular. If
        floating isn{'\u2019'}t your speed, drive along the river to explore the breaks
        and coulees where badlands formations begin to emerge{'\u2014'}a preview of the
        dramatic geology found at Makoshika State Park near Glendive.
      </p>

      <h3>Afternoon</h3>
      <p>
        Visit the grounds of <strong>Fort Keogh</strong>, now the USDA Fort Keogh
        Livestock and Range Research Laboratory on the west side of town. The
        original military post was established in 1877 following the Battle of
        the Little Bighorn and served as the staging ground for the Army{'\u2019'}s
        campaigns against the Nez Perce and other tribes. Several original
        buildings remain, and interpretive markers cover the post{'\u2019'}s history.
        The USDA research station continues the site{'\u2019'}s agricultural legacy,
        conducting range science and livestock research relevant to the
        surrounding ranch country.
      </p>

      <h3>Evening</h3>
      <p>
        Keep dinner relaxed{'\u2014'}a steak dinner at a local restaurant is fitting
        after a day exploring cattle country. If the weather cooperates, take an
        evening walk along the river as the sun sets over the prairie. Eastern
        Montana sunsets{'\u2014'}enormous skies streaked with color above the flat
        horizon{'\u2014'}are genuinely spectacular and a fitting end to a day spent
        outdoors.
      </p>

      <h2>Day 3: Culture & Departure</h2>

      <h3>Morning</h3>
      <p>
        For an early start, drive east on I-94 toward <strong>Makoshika State
        Park</strong> near Glendive (135 miles, about 1.5 hours). Montana{'\u2019'}s
        largest state park features badlands formations, dinosaur fossils (T. rex
        and triceratops bones have been found here), hiking trails through eroded
        sandstone pinnacles, and some of the most dramatic geology in the state.
        If the drive is too far for a morning trip, stay in {townName} and revisit
        any stops you missed{'\u2014'}the Range Riders Museum alone could fill another
        morning, and a walk along the Tongue River in early light is peaceful and
        rewarding.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Browse downtown Main Street for any shops you missed. Pick up locally
        made goods or Western wear{'\u2014'}{townName}{'\u2019'}s shops cater to working ranchers
        as much as visitors, so what you find here is authentic rather than
        tourist-oriented. Stock up on snacks for the road{'\u2014'}the drive to Billings
        is 145 miles of open prairie with limited services, and it{'\u2019'}s one of the
        most beautiful stretches of I-94 in Montana, following the Yellowstone
        River valley through rangeland and badlands.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName}{'\u2019'}s museums are its cultural anchors{'\u2014'}authentic institutions
        that preserve the frontier and ranching heritage of southeastern Montana:
      </p>
      {museums.length > 0 && (
        <ul>
          {museums.map(m => (
            <li key={m.name}>
              <strong>{m.name}</strong>{' '}
              {'\u2014'} {m.distMiles === 0 ? 'in town' : `${m.distMiles} mi from downtown`}
            </li>
          ))}
        </ul>
      )}
      <p>
        The <strong>Range Riders Museum</strong> is the must-see{'\u2014'}a sprawling
        collection of frontier artifacts, photographs, and memorabilia assembled
        by generations of local ranchers. The <strong>WaterWorks Art
        Museum</strong> combines a striking historic building with quality
        contemporary art exhibitions. Together, they give {townName} a cultural
        depth that surprises visitors expecting nothing but cattle and prairie.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Bucking Horse Sale (May):</strong> If you can time your visit
        for the third weekend of May, the Bucking Horse Sale is {townName}{'\u2019'}s
        signature event and one of the most authentic Western celebrations in
        Montana. Part rodeo stock sale, part community festival{'\u2014'}it features
        bronc riding, bull riding, concerts, street dances, a parade, and a
        livestock auction that draws buyers from across the West. The entire town
        comes alive, and the event captures {townName}{'\u2019'}s identity as the Cow
        Capital better than anything else.
      </p>
      <p>
        <strong>Summer:</strong> Hot{'\u2014'}July highs average 89{'\u00B0'}F and can exceed
        100{'\u00B0'}F. Plan outdoor activities for morning and evening, and use midday
        for museums and indoor stops. The rivers are at their best for fishing
        and floating. Paddlefish snagging season (May{'\u2013'}June) is a unique draw.
      </p>
      <p>
        <strong>Fall:</strong> Arguably the best season{'\u2014'}temperatures moderate
        to comfortable 60s and 70s{'\u00B0'}F, cottonwoods along the rivers turn gold,
        and hunting season brings the prairie to life with activity. The town
        quiets down and the light is beautiful.
      </p>
      <p>
        <strong>Winter:</strong> Cold but manageable{'\u2014'}January highs around
        36{'\u00B0'}F, lows near 18{'\u00B0'}F. {townName} doesn{'\u2019'}t have ski resorts or hot
        springs to draw winter visitors, but the winter prairie has a stark
        beauty{'\u2014'}bald eagles along the Yellowstone, mule deer in the river
        breaks, and empty highways under enormous skies. The museums remain
        open and the bars are warm.
      </p>

      <h2>Where to Stay</h2>
      <p>
        {townName} has a selection of chain motels along Main Street and the I-94
        corridor that offer clean, reliable, and affordable lodging{'\u2014'}expect to
        pay significantly less than western Montana hotels. During the Bucking
        Horse Sale, book well in advance{'\u2014'}the town fills up and rates rise. A
        handful of independent lodging options and RV parks round out the choices.
        For longer stays, {townName}{'\u2019'}s rental market is one of the most affordable
        in Montana{'\u2014'}see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link> for details.
      </p>
    </article>
  );
}
