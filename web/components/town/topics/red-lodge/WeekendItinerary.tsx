import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Cooke City Chamber of Commerce',
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
        A weekend in {townName} puts you at the foot of the Beartooth Mountains in a
        former coal-mining town of 2,700 people that has reinvented itself around skiing,
        the Beartooth Highway, and Old West heritage. Downtown Broadway Avenue is lined
        with historic brick storefronts housing independent shops, galleries, restaurants,
        and bars that feel authentically Montana{'\u2014'}no chain stores, no manufactured
        atmosphere. The Beartooth Highway, one of America's most dramatic alpine drives,
        begins just south of town and climbs to nearly 11,000 feet on its way to Yellowstone
        National Park's northeast entrance. Red Lodge Mountain ski area is 4 miles west.
        Rock Creek runs through the center of town. This three-day itinerary covers the
        essentials for first-time visitors, couples, families, and solo travelers{'\u2014'}adjust
        based on season and energy level. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for Beartooth Highway and hiking; December–March for skiing at Red Lodge Mountain</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F{'\u2014'}warm days, cool mountain evenings</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Billings Logan International Airport (BIL, 60 miles northeast); drive south on US-212</li>
        <li><strong>Getting around:</strong> Car essential for Beartooth Highway and ski area; downtown Broadway Avenue is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; the Beartooth Highway is free to drive (no entrance fee until you reach Yellowstone)</li>
        <li><strong>Key distances:</strong> Red Lodge Mountain 4 mi; Beartooth Highway summit 15 mi; Yellowstone NE entrance 72 mi; Billings 60 mi</li>
      </ul>

      <h2>Day 1: Downtown Red Lodge & Rock Creek</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at one of the cafes along <strong>Broadway Avenue</strong>,
        {townName}'s main street. The historic downtown stretches several blocks with
        well-preserved early-20th-century brick buildings from the coal-mining era{'\u2014'}the
        architecture alone is worth a slow walk. Browse the independent shops, galleries,
        and bookstores that fill the storefronts. Stop at the <strong>Carbon County
        Historical Museum</strong> to understand {townName}'s layered past{'\u2014'}from the
        Crow people who inhabited this valley, through the 1880s coal boom that built the
        town, to the ski-and-tourism era that defines it today. The museum's coal-mining
        exhibits and rodeo history give essential context for everything you'll see this
        weekend.
      </p>

      <h3>Midday</h3>
      <p>
        Walk to <strong>Rock Creek</strong>, which flows through the heart of town.
        Follow the creek-side paths through Lions Park and Coal Miners Park for a
        relaxing stroll with views of the Beartooth front rising to the west. If you're
        an angler, Rock Creek holds rainbow and brown trout and is fishable right in
        town{'\u2014'}you can cast a fly rod within walking distance of Broadway Avenue
        (see our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        details). For lunch, head back to Broadway and choose from the restaurants that
        line the main street{'\u2014'}burgers, BBQ, and Western comfort food are the
        local strengths.
      </p>

      <h3>Afternoon</h3>
      <p>
        Spend the afternoon exploring {townName}'s gallery scene. For a town of under
        2,400 people, the concentration of art galleries is notable{'\u2014'}drawn by the
        mountain setting and the town's artistic character. Browse painting, sculpture,
        photography, and Western art in the galleries along Broadway and the side streets.
        If you'd rather be outdoors, drive 4 miles west to <strong>Red Lodge Mountain</strong>{' '}
        to scope out the ski area{'\u2014'}in summer, the mountain offers scenic views and
        the base area has a lodge with food and drinks.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner on Broadway Avenue offers genuinely good options for a small mountain
        town. Several restaurants serve elevated Western fare with Montana character,
        and the atmosphere is relaxed and unpretentious. After dinner, visit one of
        {townName}'s historic bars{'\u2014'}the kind of places where ranchers, skiers,
        highway travelers, and locals share the room. Check for live music, which is
        common on summer weekends. Local craft beer is available at several establishments.
      </p>

      <h2>Day 2: Beartooth Highway</h2>

      <h3>Morning</h3>
      <p>
        This is the day you came for. Head south from {townName} on US-212 onto the{' '}
        <strong>Beartooth Highway</strong>, designated an All-American Road by the Federal
        Highway Administration and routinely called one of the most beautiful drives in
        America. The road climbs from 5,568 feet to 10,947 feet at Beartooth Pass in
        approximately 15 miles, traversing a series of switchbacks with increasingly
        dramatic views of glacial valleys, snowfields, and granite peaks. At the top,
        the <strong>Beartooth Plateau</strong> opens up{'\u2014'}the largest contiguous
        area above 10,000 feet in the Lower 48, a surreal landscape of alpine tundra,
        scattered snowfields, and hundreds of lakes.
      </p>

      <h3>Midday</h3>
      <p>
        Stop at one of the high-alpine lakes along the highway{'\u2014'}<strong>Beartooth
        Lake</strong>, <strong>Island Lake</strong>, or <strong>Long Lake</strong>{'\u2014'}for
        a lakeside picnic and a short hike on the plateau. The above-treeline terrain
        feels more Arctic than Montana: rolling tundra, granite slabs, and wildflowers
        in July and August. If you fish, bring a rod{'\u2014'}these lakes hold brook trout
        and Yellowstone cutthroat trout that feed eagerly at altitude. The air is thin
        at 9,500+ feet; take it easy if you're arriving from low elevation.
      </p>

      <h3>Afternoon</h3>
      <p>
        Continue east on the Beartooth Highway toward <strong>Cooke City</strong> and the
        <strong> northeast entrance to Yellowstone National Park</strong> (72 miles from
        {townName}). The drive through the Absaroka-Beartooth Wilderness corridor is
        stunning{'\u2014'}switchbacks descend through alpine forest, past waterfalls, and
        into the Yellowstone ecosystem. If you have time, enter the park and drive to the
        <strong> Lamar Valley</strong> for wildlife viewing{'\u2014'}bison, wolves, grizzly
        bears, elk, and pronghorn are regularly spotted here. Return to {townName} the
        way you came, timing the return drive for evening light on the Beartooth switchbacks.
      </p>

      <h3>Evening</h3>
      <p>
        After the drive back to {townName}, keep dinner casual on Broadway. You've
        earned a quiet evening after a full day of high-altitude driving and exploration.
        Regional hot springs offer an excellent post-drive soak
        if you have the energy.
      </p>

      <h2>Day 3: Local Explorations & Departure</h2>

      <h3>Morning</h3>
      <p>
        For hikers, an early start for the <strong>Basin Lakes Trail</strong> (roughly
        8 miles south) rewards with a pair of alpine lakes set in a cirque beneath rugged
        Beartooth peaks. The 6-mile round trip with 1,500 feet of gain takes 3{'\u2013'}4
        hours and is one of the most rewarding moderate day hikes near {townName}. For a
        more relaxed morning, take the <strong>West Fork of Rock Creek</strong> road south
        into the forest for a streamside walk and, if you fish, a few hours on the creek.
        Either way, circle back to Broadway for a final coffee and pastry at one of the
        cafes.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Browse any galleries or shops you missed on Day 1. Pick up local goods{'\u2014'}jerky,
        huckleberry products, and Western art make good souvenirs from a town that hasn't
        been taken over by tourist kitsch. If you're heading to Billings and the airport,
        the drive northeast on US-212 takes about an hour on open highway through the
        rolling foothills of Carbon County. For anglers or outdoor enthusiasts planning
        a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> and the{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for detailed
        recommendations.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName}'s cultural scene is modest in scale but authentic in character{'\u2014'}rooted
        in the town's coal-mining past, rodeo heritage, and mountain community identity:
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
        The <strong>Carbon County Historical Museum</strong> is the anchor cultural
        institution, covering {townName}'s coal-mining era, the Crow and other Native
        peoples of the Beartooth region, rodeo history (the town hosts the annual Home
        of Champions Rodeo), and the natural history of the surrounding mountains.
        Downtown Broadway Avenue's galleries showcase regional painting, sculpture, and
        photography{'\u2014'}most are free to enter and reflect the creative community
        that has grown around {townName}'s mountain setting.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Replace Day 2's Beartooth Highway drive (the
        highway is closed November through late May) with a day at <strong>Red Lodge
        Mountain</strong> ski area, 4 miles west. The mountain offers 2,400+ vertical
        feet of skiing with uncrowded runs and mountain-town character that contrasts
        sharply with larger destination resorts. After skiing, Broadway Avenue's
        restaurants and bars are at their liveliest during ski season, and the hot springs
        in the wider region provide a perfect apr&egrave;s-ski soak.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Late May brings the first tentative openings
        of the Beartooth Highway (depending on snowpack), wildflowers in the Rock Creek
        valley, and uncrowded trails at lower elevations. Fall (September{'\u2013'}October)
        is arguably {townName}'s finest season{'\u2014'}golden aspens in the creek
        drainages, warm days, cold nights, the Beartooth Highway's final weeks before
        closing for winter, and dramatically reduced tourist traffic. The annual Home
        of Champions Rodeo in early July is {townName}'s signature community event and
        worth timing a visit around.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} has a selection of historic hotels, inns, and lodges along
        Broadway Avenue that put you within walking distance of restaurants, shops, and
        Rock Creek. Several properties occupy restored buildings from the coal-mining
        era, offering character that modern hotels cannot replicate. Motels and vacation
        rentals near Red Lodge Mountain cater to the ski crowd. For a distinctive
        overnight, several guest ranches and cabins in the surrounding Rock Creek valley
        offer mountain seclusion with easy access to town.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
