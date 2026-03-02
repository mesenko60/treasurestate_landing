import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Livingston Area Chamber of Commerce',
  'Big Sky Visitors Information Center & Chamber of Commerce',
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
        A weekend in {townName} puts you at the original gateway to Yellowstone
        National Park — a small railroad town on the Yellowstone River where
        fly-fishing culture, a surprisingly vibrant art scene, and honest Western
        character have drawn writers, artists, and outdoor enthusiasts for over a
        century. Downtown {townName} is remarkably well-preserved, with historic
        brick buildings housing independent galleries, fly shops, and bars that
        still feel authentically Montana. The town sits at the mouth of Paradise
        Valley, a 50-mile corridor of ranch land and river that runs south to
        Gardiner and the north entrance of Yellowstone. Wind is a constant here —
        locals will tell you it builds character. This three-day itinerary covers
        the essentials for first-time visitors, couples, families, and solo
        travelers — adjust based on season and energy level. For the full town
        profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather and river access; January–March for Yellowstone winter tours and uncrowded hot springs</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — dry heat with cool evenings and persistent wind</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Bozeman Yellowstone International Airport (BZN, 30 miles west), I-90 from Bozeman or Billings</li>
        <li><strong>Getting around:</strong> Car essential for Paradise Valley and Yellowstone day trips; downtown {townName} is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and {townName}'s galleries are free to browse</li>
        <li><strong>Key distance:</strong> Yellowstone North Entrance at Gardiner is 53 miles south (about 1 hour); Chico Hot Springs is 23 miles south</li>
      </ul>

      <h2>Day 1: Downtown Livingston</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at <strong>Gil's Goods</strong>, a cafe and market
        on Main Street with excellent coffee and baked goods that draw both locals
        and visitors. From there, walk to the <strong>Yellowstone Gateway
        Museum</strong>, which covers {townName}'s layered history — from the
        Crow and Blackfeet peoples who lived in this valley for millennia, through
        the Northern Pacific Railroad era that founded the town in 1882, to the
        early days of Yellowstone tourism. The museum's railroad collection and
        Yellowstone artifacts give essential context for everything you'll see
        this weekend.
      </p>

      <h3>Midday</h3>
      <p>
        Walk to the <strong>Livingston Depot Center</strong>, the beautifully
        restored 1902 Northern Pacific Railway depot designed by the same
        architectural firm behind New York's Grand Central Terminal. The building
        itself is reason enough to visit — Italian Renaissance Revival
        architecture with terra-cotta details, arched windows, and a grand
        interior hall. Today it hosts rotating art exhibitions and a permanent
        display on the depot's history. From there, head to <strong>Dan
        Bailey's Fly Shop</strong>, a {townName} institution since 1938 and one
        of the most famous fly shops in the world. Even if you don't fish, the
        shop is worth a visit for its history and the sheer artistry of the fly
        selection — this is the town that helped put Montana fly-fishing on the
        map.
      </p>

      <h3>Afternoon</h3>
      <p>
        Spend the afternoon on a gallery walk through downtown {townName}.
        For a town of 8,000 people, the concentration of art galleries is
        remarkable — drawn here by the same light and landscape that attracted
        writers like Thomas McGuane, Jim Harrison, and Tim Cahill.
        Browse the galleries along Main Street and the side streets, stopping
        into the boutiques and bookshops that fill the historic storefronts.
        The whole downtown is walkable and unhurried — take your time.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner downtown offers genuinely good options for a small town.{' '}
        <strong>2nd Street Bistro</strong> serves refined, seasonal cuisine in a
        warm setting — one of the best restaurants in the Yellowstone gateway
        region. <strong>Livingston Bar and Grille</strong> is a reliable choice
        for American fare with Montana character. After dinner, walk to the{' '}
        <strong>Murray Bar</strong>, a legendary {townName} gathering spot with
        live music most nights — the kind of bar where ranchers, writers,
        fishing guides, and tourists share the same room. Check their calendar
        for who's playing. For craft beer, <strong>Katabatic Brewing
        Company</strong> and <strong>Neptune's Brewery</strong> both have
        welcoming taprooms.
      </p>

      <h2>Day 2: Paradise Valley & Yellowstone</h2>

      <h3>Morning</h3>
      <p>
        Head south on US-89 into <strong>Paradise Valley</strong>, one of the
        most beautiful drives in Montana. The two-lane highway follows the
        Yellowstone River through 50 miles of ranch land flanked by the Absaroka
        Range to the east and the Gallatin Range to the west — snow-capped peaks,
        cottonwood-lined riverbanks, and open meadows where elk and pronghorn
        graze. About 13 miles south of town, take the short detour to{' '}
        <strong>Pine Creek Falls</strong>, a rewarding waterfall hike that's
        roughly 2 miles round-trip through forest to a cascading falls in a
        narrow canyon. It's one of the most popular short hikes in the valley for
        good reason.
      </p>

      <h3>Midday</h3>
      <p>
        Continue south to <strong>Chico Hot Springs</strong>, a beloved Montana
        institution about 23 miles from {townName}. The historic resort has been
        welcoming guests since 1900, and the natural hot springs pool — open-air,
        with mountain views in every direction — is one of the best soaking
        experiences in the state. Buy a day pass for the pool and stay for lunch
        at the <strong>Chico Dining Room</strong>, which has earned a reputation
        as one of the finest restaurants in Montana, serving elevated comfort
        food with ingredients sourced from the surrounding valley. The poolside
        grill offers a more casual option.
      </p>

      <h3>Afternoon</h3>
      <p>
        From Chico, continue south on US-89 through the narrowing valley to{' '}
        <strong>Gardiner</strong>, the small town at the North Entrance of{' '}
        <strong>Yellowstone National Park</strong>. Drive under the historic
        Roosevelt Arch and into the park. Head to <strong>Mammoth Hot
        Springs</strong>, where dramatic terraced limestone formations created by
        geothermal activity cascade down the hillside — the boardwalk loop takes
        about an hour. If time allows, continue east into the park toward the{' '}
        <strong>Lamar Valley</strong>, often called the Serengeti of North
        America for its wildlife — bison herds, wolves, grizzly bears, elk, and
        pronghorn are regularly spotted here, especially in the early morning and
        evening hours. Return north through Paradise Valley as the evening light
        turns the Absarokas golden.
      </p>

      <h3>Evening</h3>
      <p>
        After the drive back to {townName}, keep dinner simple. Grab a casual
        meal downtown or pick up food to go — you've earned a quiet evening after
        a full day of driving and exploring. If you still have energy, the Murray
        Bar is always there.
      </p>

      <h2>Day 3: Local Culture & Departure</h2>

      <h3>Morning</h3>
      <p>
        For ambitious hikers, an early start for <strong>Sacajawea Peak</strong>{' '}
        (about 25 miles northwest in the Bridger Range) rewards with the highest
        point in the range at 9,665 feet and sweeping views of the Crazy
        Mountains, Absarokas, and the Gallatin Valley. The trail is roughly 4
        miles round-trip with significant elevation gain — plan 3–4 hours and
        start early. If a peak hike isn't in the cards, stay in town and take a
        morning walk along the <strong>Yellowstone River</strong> — the trail
        system near Sacajawea Park offers easy riverside paths with mountain
        views, and in summer you'll see drift boats and fly anglers working the
        riffles. Either way, circle back through downtown for coffee.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Stop at <strong>Mark's In & Out</strong>, a classic {townName} drive-in
        that's been serving burgers and shakes since the 1950s — it's a local
        ritual and a fitting last stop. Browse any galleries or shops you missed
        on Day 1. If you're heading west toward Bozeman, the drive on I-90 takes
        about 30 minutes to the airport. For anglers or outdoor enthusiasts
        planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on the Yellowstone River and nearby spring creeks.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} is a small town, but its two museums punch above their weight
        and its gallery scene rivals towns many times its size:
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
        The <strong>Yellowstone Gateway Museum</strong> is the anchor cultural
        institution — it traces {townName}'s story from the indigenous peoples of
        the Yellowstone Valley through the railroad era, early Yellowstone
        tourism, and the ranching and arts communities that define the town today.
        The <strong>Livingston Depot Center</strong> combines architectural
        significance with contemporary art exhibitions in one of the most
        beautiful buildings in Montana. Beyond the museums, {townName}'s downtown
        galleries showcase painting, sculpture, photography, and mixed media from
        regional and nationally recognized artists — most are free to enter and
        worth lingering in.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Paradise Valley and the road to
        Yellowstone's North Entrance remain open year-round (the only Yellowstone
        entrance that does), making {townName} a genuine winter base for the
        park. Chico Hot Springs is especially magical in winter — soaking in the
        hot pool while snow falls around you. Yellowstone's Lamar Valley offers
        prime wolf-watching in winter months when packs are active and visible
        against the snow. {townName}'s downtown galleries, restaurants, and bars
        remain open, and the pace slows to a quiet rhythm that many regulars
        prefer.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings snowmelt to the
        Yellowstone River and wildflowers to Paradise Valley by late May — the
        river runs high and muddy through June before clearing for summer
        fishing. Fall (September through October) is arguably {townName}'s best
        season — golden cottonwoods line the Yellowstone, elk bugling echoes
        through Paradise Valley, tourist crowds thin dramatically, and the dry
        climate produces reliably clear days with warm afternoons and crisp
        evenings. The wind, a constant in {townName}, tends to pick up in spring
        and fall — locals barely notice it, but visitors should be prepared.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} has a small selection of hotels and historic
        properties that put you within walking distance of galleries, restaurants,
        and the river. The <strong>Murray Hotel</strong>, a 1904 landmark on Main
        Street, has hosted everyone from Will Rogers to Sam Peckinpah and
        recently underwent renovation — it's the most characterful option in
        town. Several chain and independent motels along Park Street and the I-90
        corridor offer reliable, budget-friendly options. For a distinctive
        overnight, <strong>Chico Hot Springs Resort</strong> in Paradise Valley
        combines historic lodge rooms, cabins, hot springs, and fine dining in
        one package — many visitors split their weekend between a night in town
        and a night at Chico.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
