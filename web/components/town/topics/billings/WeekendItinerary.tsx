import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Pictograph Caves Visitor Center',
  'Visitor Center',
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
        A weekend in {townName} puts you in Montana's largest city — a high-plains hub
        built beneath dramatic sandstone rimrocks that rise 400 feet above the Yellowstone
        River valley. Unlike the mountain towns to the west, {townName} sprawls across open
        benchlands with a skyline defined by those rimrocks rather than peaks. Downtown
        centers on <strong>Montana Avenue</strong>, a walkable stretch of historic
        buildings housing independent shops, galleries, and restaurants. The city punches
        above its weight in museums — a contemporary art museum in a converted county jail,
        a 1903 mansion frozen in time, a children's science center, and Montana's only
        zoo all sit within a few miles of each other. Beyond town, Pictograph Cave's
        4,500-year-old rock art, Pompeys Pillar's Lewis &amp; Clark inscription, and the
        Little Bighorn Battlefield are all day-trip distance. This three-day itinerary
        covers the essentials for first-time visitors, families, couples, and solo
        travelers — adjust based on season and energy level. For the full city profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> May–September for warm weather and outdoor activities; June–August for Beartooth Highway access</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — {townName} is the warmest of Montana's hub cities</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Billings Logan International Airport (BIL) — Montana's busiest airport. I-90, I-94</li>
        <li><strong>Getting around:</strong> Car needed for day trips; downtown and Montana Avenue are walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax — stock up on gear and souvenirs downtown</li>
        <li><strong>Key distances:</strong> Pictograph Cave State Park is 4 miles south; Pompeys Pillar is 28 miles east; Little Bighorn Battlefield is 60 miles southeast</li>
      </ul>

      <h2>Day 1: Downtown Billings</h2>

      <h3>Morning</h3>
      <p>
        Start the weekend with breakfast at <strong>Stella's Kitchen &amp; Bakery</strong>,
        a {townName} institution famous for generous portions, fresh-baked pastries, and a
        loyal following — arrive early on weekends. From there, drive or walk to the{' '}
        <strong>Rimrocks</strong> at <strong>Swords Rimrock Park</strong> for panoramic
        views of the city, the Yellowstone River valley, and the Beartooth Mountains to the
        southwest. The sandstone cliffs that define {townName}'s skyline are striking from
        below, but from the top the full scope of the high-plains landscape opens up — it's
        the best orientation point in the city and worth the short detour before heading
        downtown.
      </p>

      <h3>Midday</h3>
      <p>
        Head to the <strong>Yellowstone Art Museum</strong>, housed in the old Yellowstone
        County jail — the building itself is part of the experience, with thick masonry
        walls and original cell blocks integrated into the gallery layout. The permanent
        collection focuses on contemporary Western and regional art, and rotating
        exhibitions consistently surprise. From there, walk to the <strong>Moss Mansion
        Museum</strong>, a 1903 Romanesque sandstone residence designed by New York
        architect Henry Janeway Hardenbergh (who also designed the Waldorf-Astoria and the
        Plaza Hotel). Guided tours take you through the original furnishings, stained glass,
        and hand-painted wallcoverings — a window into {townName}'s early-1900s wealth.
      </p>

      <h3>Afternoon</h3>
      <p>
        Walk to the <strong>Western Heritage Center</strong>, which traces the cultural
        history of the Yellowstone River valley through artifacts, oral histories, and
        exhibits that cover Native American life, homesteading, ranching, and the
        railroad's role in building {townName}. For families, <strong>Wise
        Wonders</strong> children's science museum is nearby with hands-on exhibits that
        keep younger visitors engaged. Afterward, explore <strong>Montana Avenue</strong> —
        {townName}'s historic main street lined with independent shops, galleries,
        bookstores, and cafes. The avenue retains more character than the strip-mall
        corridors on the city's edges and rewards an unhurried stroll.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner downtown offers strong options. <strong>Walkers Grill</strong> serves
        upscale contemporary cuisine with a seasonal menu and an excellent wine list — one
        of the best restaurants in {townName}. <strong>Bin 119</strong> pairs craft
        cocktails with shareable plates in a stylish, intimate space. <strong>The
        Fieldhouse</strong> and <strong>Jake's Downtown</strong> both serve reliable
        American fare in welcoming settings. After dinner, a brewery crawl is the natural
        move: <strong>Überbrew</strong> draws the biggest crowds with its inventive tap
        list, <strong>Angry Hank's Micro Brewery</strong> keeps things unpretentious and
        local, <strong>Carter's Brewing</strong> specializes in approachable styles, and{' '}
        <strong>Yellowstone Valley Brewing</strong> offers a laid-back taproom. If cider is
        more your speed, <strong>Last Chance Pub &amp; Cider Mill</strong> rounds out the
        options.
      </p>

      <h2>Day 2: Outdoor Adventure & History</h2>

      <h3>Morning</h3>
      <p>
        Drive 4 miles south to <strong>Pictograph Cave State Park</strong>, one of the
        most significant archaeological sites in the northern Great Plains. A paved
        interpretive trail leads to three sandstone caves containing rock paintings —
        pictographs — some dating back over 4,500 years. The cave art depicts animals,
        warriors, and abstract designs left by prehistoric hunters who camped in the caves
        for millennia. The trail is easy and well-signed, making it accessible to all ages.
        Plan about 90 minutes for the loop and the interpretive panels.
      </p>

      <h3>Afternoon — Choose Your Adventure</h3>
      <p>
        <strong>Option A: Pompeys Pillar.</strong> Drive 28 miles east on I-94 to{' '}
        <strong>Pompeys Pillar National Monument</strong>, a 150-foot sandstone butte
        rising from the Yellowstone River floodplain. Captain William Clark carved his name
        and the date — July 25, 1806 — into the rock face during the return leg of the
        Lewis &amp; Clark Expedition. It remains the only physical evidence of the
        expedition found along the entire trail. A boardwalk leads to the inscription, and
        the interpretive center covers the expedition's passage through the Yellowstone
        Valley.
      </p>
      <p>
        <strong>Option B: Beartooth Highway (seasonal, June–October).</strong> Drive 60
        miles southwest to Red Lodge, then climb the <strong>Beartooth Highway</strong>{' '}
        (US-212) — called "the most beautiful drive in America" by Charles Kuralt. The road
        climbs to nearly 11,000 feet through alpine tundra, glacial lakes, and snowfields
        with views that stretch to the Absaroka Range and Yellowstone's northern boundary.
        This is a full-day commitment but unforgettable in clear weather.
      </p>
      <p>
        <strong>Option C: Little Bighorn Battlefield.</strong> Drive 60 miles southeast to{' '}
        <strong>Little Bighorn Battlefield National Monument</strong>, the site of Custer's
        Last Stand in June 1876. The battlefield, ranger talks, and museum tell the story
        from both U.S. military and Native American perspectives — it's one of the most
        powerful historic sites in the American West.
      </p>

      <h3>Evening</h3>
      <p>
        Back in town, unwind at <strong>Lake Elmo State Park</strong>, a 64-acre urban lake
        2 miles northeast of downtown. Walking paths circle the lake, and on a warm evening
        the swimming beach and paddleboard rentals make for a relaxing end to a big day.
        Grab a casual dinner nearby before heading in for the night.
      </p>

      <h2>Day 3: Local Culture & Departure</h2>

      <h3>Morning</h3>
      <p>
        Start with another breakfast at <strong>Stella's</strong> — or try somewhere new if
        you're feeling adventurous. Then head to <strong>ZooMontana</strong>, the state's
        only zoo and botanical garden, spread across 70+ acres on {townName}'s west side.
        The zoo focuses on Northern Rockies and high-plains species — grizzly bears, gray
        wolves, mountain lions, river otters, and raptors — in naturalistic habitats. The
        botanical garden and sensory trails make it a good stop for families with younger
        children. Plan about two hours.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If you have time, return to Montana Avenue for departure shopping — pick up
        Montana-made goods, local art, or craft beer to go from the breweries. For anglers
        or outdoor enthusiasts planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on the Yellowstone River and nearby streams.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} has a strong museum lineup concentrated within a few miles of downtown —
        most are affordable and several are walkable from Montana Avenue:
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
        The <strong>Yellowstone Art Museum</strong> is the cultural anchor — its permanent
        collection of contemporary Western art and rotating exhibitions make it one of the
        most respected regional art museums in the northern Rockies. The <strong>Moss
        Mansion Museum</strong> offers an intimate look at turn-of-the-century prosperity,
        with original furnishings and architecture that rival anything in the state. The{' '}
        <strong>Western Heritage Center</strong> tells the deeper story of the Yellowstone
        River valley through artifacts and oral histories. For families, <strong>Wise
        Wonders</strong> and <strong>ZooMontana</strong> are the standout options. The{' '}
        <strong>Peter Yegen Jr. Yellowstone County Museum</strong>, perched on the
        Rimrocks near the airport, houses frontier and Native American artifacts with
        sweeping views from its grounds.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName}'s lower elevation and eastern-Montana
        climate mean winters are cold but often drier than the mountain towns. Red Lodge
        Mountain (60 miles southwest) is the closest downhill skiing. Downtown museums,
        ZooMontana, and the brewery scene keep a winter weekend engaging. Pictograph Cave
        State Park is open year-round but trails may be icy — check conditions.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings the Yellowstone River to life
        with snowmelt — fishing and floating pick up by late May. Fall (September through
        October) is excellent in {townName}: warm afternoons, cool evenings, golden
        cottonwoods along the river, thinning crowds, and reliably clear skies. The
        Beartooth Highway typically closes by mid-October, so time a fall visit
        accordingly. Pictograph Cave and Pompeys Pillar are particularly pleasant in the
        shoulder months without summer heat.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} has a mix of hotels that put you within walking distance of
        Montana Avenue, the museums, and the restaurant scene. Several chain hotels cluster
        near the I-90 corridor and the airport for convenience and budget-friendly rates.
        For a more distinctive stay, look for locally owned options closer to downtown or
        along the Rimrocks where views can be spectacular.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
