import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Big Sky Visitors Information Center & Chamber of Commerce',
  'Charles A & Sue Ford Bovey Visitor Center',
  'Livingston Area Chamber of Commerce',
]);

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && !SKIP_NAMES.has(h.name) && h.distMiles <= 10)
    .slice(0, 6);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you at the base of Lone Mountain{'\u2014'}home to
        Big Sky Resort, one of the largest ski areas in North America with 5,800
        skiable acres and 4,350 feet of vertical drop. But {townName} is more than
        a ski destination: the Gallatin Canyon's blue-ribbon trout water flows
        minutes from town, the Lee Metcalf Wilderness rises from the valley floor,
        Yellowstone National Park is 50 miles south, and hot springs dot the
        surrounding region. Whether you visit in winter for world-class skiing or
        summer for hiking, mountain biking, and fly fishing, this three-day
        itinerary covers the essentials. For the full community profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> December–March for skiing; July–September for hiking, biking, and fishing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F at 6,319 ft elevation</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}°F, lows near {winterClimate.avgLow}°F with 300+ inches of snowfall</li>}
        <li><strong>Getting here:</strong> Bozeman Yellowstone International Airport (BZN, 50 miles north), then US-191 south through the Gallatin Canyon</li>
        <li><strong>Getting around:</strong> Car essential; {townName} is spread across several miles along the highway and resort access roads</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; summer lift tickets for the tram and chairlifts are far less expensive than winter ski passes</li>
        <li><strong>Key distances:</strong> Yellowstone West Entrance (50 mi south), Bozeman (45 mi north), Yellowstone Hot Springs (40 mi south)</li>
      </ul>

      <h2>Day 1: Big Sky Resort</h2>

      <h3>Morning</h3>
      <p>
        Start your weekend at <strong>Big Sky Resort</strong> itself. In winter,
        hit the slopes early{'\u2014'}the mountain opens at 9 AM and the first runs of
        the day on groomed corduroy or fresh powder are when the skiing is best.
        The resort's 5,800 acres span four mountains (Lone Mountain, Andesite
        Mountain, Flat Iron Mountain, and the Southern Comfort terrain) with
        terrain for every ability level, from gentle beginner runs at the base to
        the legendary Big Couloir off the summit tram. In summer, take the
        {' '}<strong>Lone Peak Tram</strong> to the 11,166-foot summit for panoramic
        views spanning the Madison Range, Spanish Peaks, Gallatin Range, and on
        clear days, the Tetons and Yellowstone Plateau. The tram ride itself is
        worth the trip.
      </p>

      <h3>Midday</h3>
      <p>
        Grab lunch at the <strong>Mountain Village</strong> base area, where
        several restaurants and cafes serve the resort crowd. In summer, the
        mountain bike park offers lift-accessed downhill riding with trails for
        intermediate through expert riders. Hikers can take the Swift Current
        chairlift partway up Andesite Mountain and hike through wildflower
        meadows with views of Lone Mountain's dramatic pyramid shape. The
        resort's zipline and adventure courses provide family-friendly options
        for non-skiers and non-hikers.
      </p>

      <h3>Afternoon</h3>
      <p>
        Head to <strong>Ousel Falls</strong>, {townName}'s signature easy hike.
        The 1.6-mile round trip on a well-built trail leads to a dramatic
        70-foot waterfall on the South Fork of the West Fork of the Gallatin
        River. The trail is paved and accessible, making it suitable for all
        ages and abilities. In winter, the falls freeze into spectacular ice
        formations. After Ousel Falls, explore the <strong>Town Center</strong>,
        {townName}'s growing commercial hub with shops, restaurants, and galleries
        that have given the community a walkable core it lacked a decade ago.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner options in {townName} reflect the resort community's dining
        ambitions. <strong>Horn & Cantle</strong> at Lone Mountain Ranch serves
        refined Montana cuisine in a historic ranch setting{'\u2014'}one of the best
        restaurant experiences in the region. <strong>Olive B's Big Sky
        Bistro</strong> offers upscale comfort food with a wine list that
        surprises for a mountain town. For a more casual meal, the Town Center
        restaurants and resort base-area options provide pizza, burgers, and
        pub fare. After dinner, check the live music calendar at local
        venues{'\u2014'}{townName}'s apres-ski scene in winter is lively, and summer
        brings outdoor concerts and events.
      </p>

      <h2>Day 2: Gallatin Canyon & Hot Springs</h2>

      <h3>Morning</h3>
      <p>
        Drive north on US-191 into the <strong>Gallatin Canyon</strong>, one of
        the most dramatic river corridors in Montana. The two-lane highway
        follows the Gallatin River through a narrow, forested canyon flanked by
        the Gallatin Range to the east and the Madison Range to the west. In
        summer, stop at one of the many canyon pullouts for a morning of
        fly fishing on the Gallatin{'\u2014'}the pocket water here holds wild rainbow
        and brown trout, and the roadside access makes it easy to walk in and
        start casting. For hikers, the <strong>Beehive Basin</strong> trailhead
        (8 miles from town) offers a 7-mile round trip to one of the most
        spectacular alpine basins in southwestern Montana, surrounded by the
        Spanish Peaks.
      </p>

      <h3>Midday</h3>
      <p>
        Head south on US-191 toward Yellowstone and stop at{' '}
        <strong>Yellowstone Hot Springs</strong>, approximately 40 miles south
        of {townName} near Corwin Springs. This modern hot springs facility
        features hot and cold pools, a swim-up bar, and views of the
        Yellowstone River valley and the Absaroka Range. Alternatively,
        {' '}<strong>Bozeman Hot Springs</strong> (45 miles north) offers a more
        local experience with multiple indoor and outdoor pools at varying
        temperatures, plus live music on weekend evenings. Either way, soaking
        in natural hot springs water with mountain views is a quintessential
        Montana experience.
      </p>

      <h3>Afternoon</h3>
      <p>
        If you chose the southern route toward Yellowstone Hot Springs, continue
        south to <strong>Gardiner</strong> and the <strong>North Entrance of
        Yellowstone National Park</strong>. Drive under the historic Roosevelt
        Arch and head to <strong>Mammoth Hot Springs</strong> for the dramatic
        terraced limestone formations{'\u2014'}the boardwalk loop takes about an hour.
        If time allows, drive east into the <strong>Lamar Valley</strong> for
        wildlife viewing{'\u2014'}bison herds, wolves, grizzly bears, and elk are
        regularly spotted. If you chose the northern route to Bozeman Hot Springs,
        spend the afternoon exploring downtown Bozeman{'\u2014'}the university town
        offers galleries, bookshops, breweries, and a walkable Main Street that
        contrasts with {townName}'s resort character.
      </p>

      <h3>Evening</h3>
      <p>
        Return to {townName} for dinner. If you've been active all day, keep it
        simple with a casual meal at one of the Town Center restaurants or the
        resort base area. <strong>Lone Mountain Ranch</strong> offers a
        distinctive dining experience in winter with their sleigh-ride dinner{'\u2014'}a
        horse-drawn sleigh carries you to a remote cabin for a multi-course meal
        by candlelight, and it's one of the most memorable dining experiences
        in Montana.
      </p>

      <h2>Day 3: Wilderness & Departure</h2>

      <h3>Morning</h3>
      <p>
        For ambitious hikers, an early start for <strong>Beehive Basin</strong>{' '}
        (if you didn't do it on Day 2) or <strong>Lava Lake</strong> (12 miles
        north in the Gallatin Canyon) rewards with stunning alpine scenery. Lava
        Lake is a moderate 6-mile round trip to a beautiful lake set beneath
        Gallatin Peak. In winter, <strong>Lone Mountain Ranch</strong> offers
        30+ km of groomed Nordic ski trails through meadows and forest at the
        base of the mountains{'\u2014'}one of the finest cross-country ski experiences
        in the Northern Rockies. For a mellow morning, revisit the Town Center
        for coffee, browse the shops, and take in the views of Lone Mountain
        that dominate the skyline.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If you're driving north to Bozeman for your flight, the Gallatin Canyon
        drive is one of Montana's most scenic routes and takes about an hour.
        Stop at <strong>Storm Castle Creek</strong> or any of the canyon
        pullouts for one last look at the Gallatin River. In Bozeman, grab a
        final meal on Main Street before heading to the airport. For anglers
        or outdoor enthusiasts planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on the Gallatin River and nearby waters.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} is a resort community rather than a historic town, so its
        cultural offerings center on the natural landscape and resort
        amenities rather than traditional museums:
      </p>
      {museums.length > 0 && (
        <ul>
          {museums.map(m => (
            <li key={m.name}>
              <strong>{m.name}</strong>{' '}
              — {m.distMiles === 0 ? 'in town' : `${m.distMiles} mi from town`}
            </li>
          ))}
        </ul>
      )}
      <p>
        The <strong>Warren Miller Performing Arts Center</strong> in the Town
        Center hosts live theater, concerts, film screenings, and community
        events year-round{'\u2014'}an impressive cultural venue for a community of
        3,591 people. <strong>Lone Mountain Ranch</strong>, a historic guest
        ranch dating to the 1920s, preserves the area's pre-resort ranching
        heritage and offers a glimpse of what the {townName} area was before
        Chet Huntley and Boyne Resorts transformed it into a ski destination.
        For museum-quality cultural stops, Bozeman (45 miles north) offers the
        Museum of the Rockies{'\u2014'}one of the finest natural history museums in
        the West, with world-class dinosaur exhibits and a planetarium.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName} is primarily a winter
        destination, and the skiing at Big Sky Resort is the main draw. The
        resort's 5,800 acres mean you can ski for a full weekend without
        repeating a run. The Lone Peak Tram accesses extreme terrain at the
        summit, while the lower mountain offers abundant intermediate and
        beginner terrain. Yellowstone's North Entrance (via Gardiner, 75 miles
        east) remains open year-round for winter park visits. Snowmobiling,
        cross-country skiing at Lone Mountain Ranch, and hot springs soaking
        round out the winter experience.
      </p>
      <p>
        <strong>Summer weekends:</strong> {townName}'s summer season has grown
        substantially. The Lone Peak Tram, mountain bike park, hiking trails,
        fly fishing on the Gallatin, and Yellowstone proximity make July through
        September a genuine destination season. Wildflowers peak in the Spanish
        Peaks and Beehive Basin in mid-July. Afternoon thunderstorms are common{'\u2014'}start
        outdoor activities early. Summer crowds are far lighter than winter
        peak season, and lodging rates can be significantly lower.
      </p>

      <h2>Where to Stay</h2>
      <p>
        {townName} offers a range of lodging tied to the resort. <strong>Big
        Sky Resort</strong> operates several slope-side hotels and condominium
        properties at the Mountain Village base area{'\u2014'}convenient for skiing
        but at resort prices. <strong>Lone Mountain Ranch</strong> provides a
        historic guest-ranch experience with log cabins, Nordic skiing, and
        ranch dining. Vacation rentals through VRBO and Airbnb dominate the
        mid-range market{'\u2014'}condominiums and homes throughout the {townName} area
        are available for nightly and weekly rental, many with ski-in/ski-out
        access or mountain views. Budget options are limited within {townName}
        itself; the most affordable lodging is in the Gallatin Canyon between
        {townName} and Bozeman, or in Bozeman proper (45 miles north).
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
