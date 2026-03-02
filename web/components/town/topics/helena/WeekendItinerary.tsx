import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  "Reeder's Alley Interpretive And Convention Center",
  "Caretaker's Cabin",
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
        A weekend in {townName} puts you in Montana's state capital — a small city built
        on gold-rush grit, Victorian architecture, and a walkable downtown that punches
        well above its weight. Last Chance Gulch, the pedestrian walking mall named for
        the 1864 gold strike that founded the city, is lined with independent shops,
        restaurants, and historic facades. A Gothic Revival cathedral with 230-foot twin
        spires rises just uphill from downtown. The copper-domed State Capitol sits a few
        blocks away, and three museums are within walking distance of each other. Beyond
        downtown, {townName} is ringed by trails, hot springs, and the Missouri River
        canyon that Lewis and Clark named the Gates of the Mountains. This three-day
        itinerary covers the essentials for first-time visitors, families, couples, and
        solo travelers — adjust based on season and energy level. For the full city
        profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather and outdoor activities; December–March for skiing at Great Divide</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — dry heat with cool evenings</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Helena Regional Airport (HLN), I-15 from Great Falls or Butte, US-12 from Missoula</li>
        <li><strong>Getting around:</strong> Car needed for day trips; downtown and Last Chance Gulch are walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and several {townName} museums offer free admission</li>
        <li><strong>Key distance:</strong> Gates of the Mountains boat tour is 20 miles north (about 25 minutes); Canyon Ferry Lake is 15 miles east</li>
      </ul>

      <h2>Day 1: Downtown Helena</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at <strong>Steve's Cafe</strong>, a beloved {townName}
        institution known for massive portions and a loyal local following — arrive early
        on weekends. From there, walk to <strong>Last Chance Gulch</strong>, the historic
        pedestrian walking mall that traces the original gold-strike claims of 1864. The
        gulch runs through the heart of downtown and is lined with independent shops,
        galleries, restaurants, and some of the best-preserved commercial architecture in
        Montana. Take your time — the street itself tells the story of {townName}'s
        transformation from mining camp to state capital.
      </p>

      <h3>Midday</h3>
      <p>
        Walk uphill to the <strong>Cathedral of St. Helena</strong>, one of the most
        striking churches in the American West. Modeled after the Votive Church in Vienna,
        the Gothic Revival cathedral features twin 230-foot spires and 59 Bavarian stained
        glass windows — its interior is worth a quiet visit even if you're not attending a
        service. From the cathedral, head to the <strong>Montana State Capitol
        Building</strong>, completed in 1902 with a copper dome visible across the valley.
        Free self-guided tours take you through the rotunda and legislative chambers, where
        murals by Charles M. Russell and Edgar Paxson depict Montana's frontier history.
      </p>

      <h3>Afternoon</h3>
      <p>
        Spend the afternoon exploring {townName}'s museum cluster, all within walking
        distance of each other downtown. The <strong>Montana Historical Society
        Museum</strong> houses the largest collection of Charles M. Russell artwork in the
        world alongside extensive exhibits on Montana's Native American, mining, and
        territorial history. The <strong>Holter Museum of Art</strong> offers free
        admission and rotating contemporary exhibitions in a bright, welcoming space. For
        families, <strong>Exploration Works</strong> is an interactive science center with
        hands-on exhibits that keep kids engaged for hours. The{' '}
        <strong>Montana Heritage Center</strong>, the state's new flagship museum facility,
        expands on the Historical Society's collection with modern exhibits and immersive
        displays.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner downtown offers strong options. <strong>On Broadway</strong> serves
        upscale Italian-influenced cuisine in a warm, refined setting — one of the best
        restaurants in the city. <strong>The Windbag Saloon & Grill</strong>, housed in a
        building that dates to the 1880s, serves reliable American fare with a dose of
        {townName} character. <strong>Lucca's</strong> is a local favorite for Italian
        food in a casual atmosphere. After dinner, walk to <strong>Lewis & Clark Brewing
        Company</strong> for a pint in a converted railroad building — their taproom is
        a {townName} gathering spot. <strong>Blackfoot River Brewing Company</strong> is
        another solid option with a rotating tap list.
      </p>

      <h2>Day 2: Outdoor Adventure</h2>

      <h3>Morning</h3>
      <p>
        Choose your adventure based on season and preference. If visiting between Memorial
        Day and September, drive 20 miles north on I-15 to the <strong>Gates of the
        Mountains</strong> boat tour — a two-hour cruise through the dramatic limestone
        canyon along the Missouri River that Meriwether Lewis named in 1805 because the
        towering 1,200-foot cliffs appeared to open like a gate as he approached. The
        narrated tour covers geology, wildlife (bighorn sheep, mountain goats, osprey, and
        bald eagles are common), and Lewis and Clark history. It's one of the most unique
        boat experiences in Montana. If you prefer a morning hike, head instead to{' '}
        <strong>Mount Helena City Park</strong> — 620 acres of open space with a network
        of trails leading to the summit at 5,468 feet, offering panoramic views of the
        city, the Helena Valley, and the surrounding mountain ranges. The summit trail is
        roughly 3 miles round-trip with moderate elevation gain.
      </p>

      <h3>Afternoon</h3>
      <p>
        Drive 15 miles east to <strong>Canyon Ferry Lake</strong>, a 25-mile-long reservoir
        on the Missouri River that serves as {townName}'s backyard lake. Swimming beaches,
        boat launches, and picnic areas dot the shoreline, and the lake is popular for
        sailing, fishing (walleye, rainbow trout, perch), and stand-up paddleboarding. On
        a hot summer day, this is where locals go. Alternatively, stay closer to town and
        visit <strong>Spring Meadow Lake State Park</strong>, a peaceful urban lake just 2
        miles from downtown with a swimming area, walking paths, and bird-watching
        opportunities — a calmer option that's especially nice in the late afternoon light.
      </p>

      <h3>Evening</h3>
      <p>
        End the day at <strong>Broadwater Hot Springs</strong>, about a mile from downtown.
        The hot spring pools are a {townName} tradition — soak in the naturally heated
        mineral water while watching the sun set behind the mountains. It's one of the few
        hot spring experiences in Montana that's genuinely close to a city center. Head
        back downtown for a casual dinner and an early night.
      </p>

      <h2>Day 3: Local Culture & Departure</h2>

      <h3>Morning</h3>
      <p>
        Walk through <strong>Reeder's Alley</strong>, one of {townName}'s oldest
        surviving neighborhoods. The cluster of 1860s-era brick buildings tucked against
        the hillside was originally built as housing for miners and laborers; today it
        houses restaurants, shops, and a small interpretive space that explains the
        district's history. The narrow alley and original stone retaining walls give a
        tangible sense of what early {townName} looked and felt like — it's one of the
        most atmospheric spots in the city. From there, revisit any downtown museums you
        missed on Day 1 or browse the shops along Last Chance Gulch.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If you have time, take a short drive to <strong>Spring Meadow Lake State
        Park</strong> for a final walk along the water. Otherwise, grab a last coffee
        downtown and pick up local goods — Montana-made gifts, books on state history,
        or craft beer to go from the breweries. For anglers or outdoor enthusiasts
        planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on nearby rivers and lakes.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        If weather or preference shifts your plans indoors, {townName} has an unusually
        strong concentration of museums for a city its size — most are free or
        inexpensive:
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
        The <strong>Montana Historical Society Museum</strong> is the anchor cultural
        institution — it holds the most comprehensive collection of Montana history in
        the state, including the world's largest collection of Charles M. Russell original
        artwork, extensive exhibits on Montana's Native American peoples, the fur trade,
        territorial period, and mining era, and a research library that draws scholars
        from across the country. The <strong>Holter Museum of Art</strong> (free
        admission) showcases contemporary and regional art in rotating exhibitions — it's
        a quick visit but consistently well-curated. <strong>Exploration Works</strong> is
        ideal for families with children, offering hands-on science exhibits that make it
        one of the best children's museums in Montana.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Great Divide Ski Area (22 miles northwest) is
        {townName}'s local mountain — affordable lift tickets, uncrowded runs, and genuine
        locals-only character. Cross-country skiing and snowshoeing are excellent at
        MacDonald Pass and in the Helena National Forest. The Capitol and downtown museums
        remain open year-round, making a winter weekend more culture-focused with a day on
        the slopes. Broadwater Hot Springs is especially appealing after a cold day outside.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings snowmelt to the Missouri River
        tributaries and wildflowers to Mount Helena's trails by late May. Fall (September
        through October) is arguably {townName}'s best season — golden cottonwoods line
        Last Chance Gulch, the mountains surrounding the valley turn amber and gold,
        tourist crowds thin out, and the dry climate produces reliably clear days with
        warm afternoons and crisp evenings. The Gates of the Mountains boat tour typically
        runs through late September.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} has a mix of hotels and historic properties that put you
        within walking distance of Last Chance Gulch, the Capitol, and the museums.
        Several chain hotels cluster near the I-15 corridor and offer reliable,
        budget-friendly options with easy highway access. For a more distinctive
        experience, look for bed-and-breakfasts in the historic residential neighborhoods
        uphill from downtown — some occupy beautifully restored Victorian homes that
        reflect {townName}'s mining-era wealth.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
