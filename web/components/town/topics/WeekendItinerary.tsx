import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Arts Missoula', 'E3 Convergance Gallery', 'Garden City Monument Services',
  'Missoula Fire Department Memorial', 'Missoula Law Enforcement Memorial',
  'Korean Veterans Memorial', 'Vietnam Veterans Memorial', 'Grizzly Statue',
  'Rattlesnake Graveyard Memorial', 'Hellgate Meadows Village',
  'Bitterroot Chamber of Commerce', 'Philipsburg Public Library',
]);

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && !SKIP_NAMES.has(h.name) && h.distMiles <= 10)
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const fallClimate = climate?.find(m => m.month === 'Sep');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} delivers a concentrated dose of what makes Montana special{' '}—{' '}big
        mountains, clean rivers, craft beer, and a downtown that's walkable, independent, and
        genuinely interesting. This itinerary covers three days and works for first-time visitors,
        couples, families, and solo travelers. Adjust based on season and interests.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather; December–March for skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Fly into Missoula Montana Airport (MSO) or drive via I-90</li>
        <li><strong>Getting around:</strong> Car recommended for outdoor activities; downtown is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax</li>
      </ul>

      <h2>Day 1: Downtown & River</h2>

      <h3>Morning</h3>
      <p>
        Start at Caras Park on the Clark Fork River, the heart of {townName}'s riverfront.
        Walk or bike the Riverfront Trail east toward the University of Montana campus,
        passing Brennan's Wave{' '}—{' '}a constructed whitewater feature where you can
        watch surfers and kayakers year-round. Continue to the Kim Williams Nature Trail,
        which follows an old railroad grade along the south bank of the Clark Fork.
        The trail is flat and easy, perfect for warming up.
      </p>

      <h3>Midday</h3>
      <p>
        Head to the Hip Strip (South Higgins Avenue) for lunch. This compact stretch of
        independent shops, bookstores, and restaurants is {townName}'s most interesting
        commercial corridor. Browse the aisles at Fact & Fiction (a locally beloved bookstore
        with a strong Montana section) and grab lunch at one of several casual spots.
      </p>

      <h3>Afternoon</h3>
      <p>
        Walk through the University of Montana campus, a handsome collection of early-20th-century
        buildings set against the steep backdrop of Mount Sentinel. If you have time and energy, hike
        the M Trail{' '}—{' '}the switchback trail to the university's signature whitewashed "M" on
        Mount Sentinel. It's about 45 minutes up and offers sweeping views of the entire
        valley. See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for more trail options.
      </p>

      <h3>Evening</h3>
      <p>
        {townName} has over a dozen craft breweries, and tasting your way through a few is
        an essential part of the experience. Draught Works, Kettlehouse, and Bayern Brewing
        are local favorites. Pair your beer tour with dinner downtown{' '}—{' '}the restaurant
        scene ranges from farm-to-table to traditional Montana steakhouses.
      </p>

      <h2>Day 2: River Adventure</h2>

      <h3>Morning</h3>
      <p>
        Pick your river. The Blackfoot (about 30 minutes east) is the{' '}
        <em>A River Runs Through It</em> river and offers some of the most beautiful floating
        in Montana. You can arrange a guided float trip through one of {townName}'s many
        outfitters, or rent a tube and do a casual float on a calmer stretch.
        If fishing is your priority, the Bitterroot River to the south has excellent
        access{' '}—{' '}see our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        details on rivers and access sites.
      </p>

      <h3>Afternoon</h3>
      <p>
        Visit Travelers Rest State Park (10 miles south), the archaeologically confirmed
        campsite where Lewis and Clark's Corps of Discovery rested in 1805 and 1806. The
        interpretive center tells the story of the expedition's passage through what is
        now western Montana. It's a quick visit (30–60 minutes) but adds historical
        context to the landscape you've been exploring.
      </p>

      <h3>Evening</h3>
      <p>
        Check the local events calendar. In summer, {townName} hosts Out to Lunch at
        Caras Park (Wednesdays) and Downtown Tonight (Thursdays){' '}—{' '}free outdoor
        concerts with food vendors. Year-round, catch a show at the Wilma Theatre
        (a restored 1921 movie palace that now hosts live music and films) or the
        Roxy Theater (an independent cinema that serves beer).
      </p>

      <h2>Day 3: Mountain & Departure</h2>

      <h3>Morning</h3>
      <p>
        Drive to Pattee Canyon Recreation Area (5 miles south) for a morning hike or
        mountain bike ride through ponderosa pine forest. Trails range from easy loops
        to more challenging climbs. In winter, Pattee Canyon has groomed Nordic ski trails.
        Alternatively, drive to Snowbowl (12 miles north) for skiing or snowboarding
        in winter, or the scenic chairlift ride and summit hikes in summer.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Stop at the Missoula Farmers Market (Saturday mornings at the Circle Square,
        May–October) for local produce, crafts, and baked goods. If it's not market
        day, the Good Food Store is {townName}'s excellent natural grocery and a good
        place to pick up Montana-made products for the road.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        If weather or preference shifts your plans indoors, {townName} has several
        museums worth a visit:
      </p>
      {museums.length > 0 && (
        <ul>
          {museums.map(m => (
            <li key={m.name}>
              <strong>{m.name}</strong>{' '}
              — {m.distMiles === 0 ? 'downtown' : `${m.distMiles} mi from downtown`}
            </li>
          ))}
        </ul>
      )}
      <p>
        The <strong>Historical Museum at Fort Missoula</strong> (5 miles south) is the standout — a
        campus of restored historic buildings covering the region's military, forestry, and
        agricultural history. Downtown, the <strong>Missoula Art Museum</strong> (free
        admission) focuses on contemporary art from the Northern Rockies, and the{' '}
        <strong>Museum of Mountain Flying</strong> near the airport tells the story of the
        backcountry pilots who shaped wildfire response in the American West.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Replace river activities with skiing at Snowbowl
        (12 miles), cross-country skiing at Pattee Canyon, or snowshoeing in the Rattlesnake.{' '}
        {townName}'s breweries and restaurants are even more appealing after a cold day outdoors.
        The university's basketball and football games add energy to winter weekends.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring (April–May) brings rain but also the skwala
        stonefly hatch that opens fly fishing season. Fall (September–October) is arguably
        the best time to visit{' '}—{' '}warm days, cool nights, golden larch trees, and
        far fewer tourists than summer.
      </p>

      <h2>Where to Stay</h2>
      <p>
        {townName} has a range of lodging from downtown hotels within walking distance
        of restaurants and nightlife to vacation rentals in quieter residential areas.
        The downtown corridor along Front Street and Broadway offers the most convenient
        location for a walkable weekend. For families or longer stays, vacation rentals
        in the Rattlesnake neighborhood or the South Hills provide more space and
        mountain views.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
