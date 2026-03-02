import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Bitterroot Chamber of Commerce',
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
        A weekend in {townName} puts you in the heart of Montana{'\u2019'}s Bitterroot Valley{'\u2014'}a
        small town of 4,659 people flanked by the dramatic Bitterroot Range to the west and
        the gentler Sapphire Mountains to the east. The Bitterroot River flows through the
        valley floor, the Selway-Bitterroot Wilderness begins just 10 miles from downtown,
        and the town itself offers a genuine Montana Main Street with local shops, restaurants,
        and the kind of unhurried pace that bigger valley towns have started to lose. {townName}{' '}
        is not a resort town or a tourist destination in the conventional sense{'\u2014'}it{'\u2019'}s a
        working community where outdoor recreation is woven into daily life. This three-day
        itinerary covers the essentials for first-time visitors, couples, families, and solo
        travelers. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June{'\u2013'}September for warm weather and full trail access; October for fall color and the brown trout run</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F{'\u2014'}warm days with cool mountain evenings</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Missoula Montana Airport (MSO, 47 miles north via US-93); Glacier Park International (FCA, 170 miles north)</li>
        <li><strong>Getting around:</strong> Car essential for canyon hikes, hot springs, and valley exploration; downtown {townName} is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; Sleeping Child Hot Springs (8 mi) is an affordable soak</li>
        <li><strong>Key distances:</strong> Selway-Bitterroot Wilderness trailheads 10{'\u2013'}20 mi; Lake Como 16 mi; Missoula 47 mi; Lost Trail Pass 62 mi</li>
      </ul>

      <h2>Day 1: Downtown Hamilton & Sleeping Child Hot Springs</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at a downtown cafe on Main Street{'\u2014'}{townName}{'\u2019'}s compact
        downtown has several reliable options for coffee and morning meals. After breakfast,
        walk to the <strong>Ravalli County Museum</strong>, housed in the handsome 1900
        courthouse building on Bedford Street. The museum covers Bitterroot Valley history
        from the Salish people who lived in this valley for millennia, through the Lewis and
        Clark expedition (which passed through in 1805 and 1806), the founding of Fort Owen,
        and the valley{'\u2019'}s evolution from timber and ranching to its current identity as an
        outdoor recreation hub. The building itself{'\u2014'}with its period architecture and
        courtroom{'\u2014'}is worth the visit.
      </p>

      <h3>Midday</h3>
      <p>
        Drive east to <strong>Sleeping Child Hot Springs</strong>, just 8 miles from town.
        This Bitterroot Valley institution features natural hot springs pools in a forest
        setting at the base of the Sapphire Mountains. The pools range from warm to hot, and
        the setting{'\u2014'}surrounded by ponderosa pine with mountain views{'\u2014'}is a world away from
        commercialized resort hot springs. Bring a picnic lunch to enjoy at the springs, or
        head back to town for a midday meal.
      </p>

      <h3>Afternoon</h3>
      <p>
        Explore downtown {townName} at a leisurely pace. Browse the shops along Main Street,
        stop into the local bookstore, and check out any galleries that catch your eye. For
        a distinctive side trip, drive past the <strong>Rocky Mountain Laboratories</strong>{' '}
        campus{'\u2014'}the NIH{'\u2019'}s infectious disease research facility is one of the most
        significant federal research installations in rural America, and its presence in a
        town of 4,659 people is a fascinating contrast. The campus is visible from the street
        but not open to public tours.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner in downtown {townName} offers solid options{'\u2014'}local restaurants serve
        American fare with Montana character, and several spots feature craft beer from
        regional breweries. {townName}{'\u2019'}s evening scene is quiet and genuine{'\u2014'}this is
        not a resort town with velvet-rope dining, but a community where locals and visitors
        share the same tables. After dinner, take an evening walk along the Bitterroot
        River as the light fades behind the Bitterroot Range.
      </p>

      <h2>Day 2: Bitterroot Canyon Hike & Lake Como</h2>

      <h3>Morning</h3>
      <p>
        Head west to <strong>Blodgett Canyon</strong> (7 miles from town), {townName}{'\u2019'}s
        signature day hike and one of the most dramatic canyon approaches in western Montana.
        The trail enters a steep-walled granite canyon carved into the Bitterroot Range{'\u2014'}sheer
        rock walls rise thousands of feet on either side as you follow Blodgett Creek into the
        Selway-Bitterroot Wilderness. Even a moderate 4-mile round-trip to the lower canyon
        viewpoints delivers world-class mountain scenery. Strong hikers can push deeper into
        the wilderness for a longer adventure. Start early in summer to beat the afternoon
        heat{'\u2014'}July highs average 85°F in the valley.
      </p>

      <h3>Midday</h3>
      <p>
        Drive south to <strong>Lake Como</strong> (16 miles from town), the Bitterroot
        Valley{'\u2019'}s most popular recreation lake. Set against the dramatic backdrop of the
        Bitterroot Range, Lake Como offers swimming, picnicking, and a shoreline trail loop
        with continuous mountain views. The lake{'\u2019'}s facilities include a beach area, picnic
        tables, and restrooms{'\u2014'}bring lunch and spend the midday hours soaking in the
        scenery. In summer, the water is refreshing after a morning hike.
      </p>

      <h3>Afternoon</h3>
      <p>
        From Lake Como, drive south through the Bitterroot Valley toward <strong>Darby</strong>,
        a small ranching community 16 miles south of {townName} that serves as the gateway to
        the upper Bitterroot and the West Fork drainage. The drive along US-93 through the
        narrowing valley offers increasingly dramatic views of the Bitterroot Range. If time
        and energy allow, the <strong>West Fork Bitterroot River</strong> corridor south of
        Darby provides beautiful streamside drives and short walks in a wilderness setting.
        Return north through the valley as the afternoon light turns the mountains golden.
      </p>

      <h3>Evening</h3>
      <p>
        After a full day of hiking and exploring, keep dinner relaxed. Grab a casual meal
        in {townName} or pick up supplies for a simple evening in. If you{'\u2019'}re staying at
        a vacation rental, a quiet evening on the deck watching the Bitterroot Range
        silhouette against the sunset is the perfect close to a big day.
      </p>

      <h2>Day 3: Bitterroot Valley Drive & Departure</h2>

      <h3>Morning</h3>
      <p>
        For one last outdoor experience, take a morning walk or bike ride along the
        Bitterroot River near town{'\u2014'}the river corridor trails offer easy, scenic paths
        with mountain views in both directions. Alternatively, drive to one of the Sapphire
        Mountain trailheads east of town for a gentler morning hike with valley panoramas.
        Circle back through downtown for a final coffee and pastry.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Stop at any downtown shops you missed on Day 1{'\u2014'}{townName}{'\u2019'}s Main Street rewards
        browsing, and Montana{'\u2019'}s lack of sales tax makes purchases a little sweeter. For
        anglers planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for detailed
        recommendations on the Bitterroot River and its forks. The drive north to Missoula{'\u2019'}s
        airport takes about 50 minutes on US-93. If you{'\u2019'}re heading south, Lost Trail Pass
        (62 miles) crosses into Idaho through some of the most beautiful mountain scenery in
        the northern Rockies.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} is a small town, but the Ravalli County Museum and nearby cultural sites
        provide meaningful context for the valley{'\u2019'}s layered history:
      </p>
      {museums.length > 0 && (
        <ul>
          {museums.map(m => (
            <li key={m.name}>
              <strong>{m.name}</strong>{' '}
              {'\u2014'} {m.distMiles === 0 ? 'downtown' : `${m.distMiles} mi from downtown`}
            </li>
          ))}
        </ul>
      )}
      <p>
        The <strong>Ravalli County Museum</strong> is the anchor cultural institution,
        tracing the valley{'\u2019'}s story from Salish and Nez Perce presence through Lewis and
        Clark, Fort Owen (Montana{'\u2019'}s first permanent non-Native settlement), the copper-king
        era of Marcus Daly, and the valley{'\u2019'}s transformation into a recreation and retirement
        destination. The <strong>Daly Mansion</strong> (3 miles northeast) is a 24,000-square-foot
        Georgian Revival estate built by copper magnate Marcus Daly in the 1890s{'\u2014'}the grounds
        and house tours offer a window into the Gilded Age in rural Montana.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName}{'\u2019'}s mild valley climate{'\u2014'}January highs
        averaging 40°F{'\u2014'}makes it one of the more comfortable winter destinations in Montana.
        Sleeping Child Hot Springs is especially inviting in winter. Lost Trail Powder Mountain
        (62 miles south) offers uncrowded, affordable skiing with reliable snow. Downtown{' '}
        {townName}{'\u2019'}s restaurants and shops remain open year-round, and the pace slows to a
        quiet rhythm that regulars prefer. Cross-country skiing and snowshoeing are available
        in the Bitterroot National Forest foothills.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings snowmelt to the Bitterroot River and
        wildflowers to the valley floor by late April{'\u2014'}the river runs high and muddy through
        May before clearing for summer. Fall (September through October) is arguably the
        Bitterroot Valley{'\u2019'}s finest season{'\u2014'}western larch turn gold, the brown trout run
        begins on the Bitterroot, tourist crowds are minimal, and the dry climate produces
        reliably clear days with warm afternoons and crisp evenings. The fall color in the
        Bitterroot Range{'\u2014'}particularly the larch forests{'\u2014'}is one of western Montana{'\u2019'}s
        great natural spectacles.
      </p>

      <h2>Where to Stay</h2>
      <p>
        {townName} has a selection of motels, vacation rentals, and lodging options along
        US-93 and in the surrounding valley. The town{'\u2019'}s lodging market is more modest than
        resort destinations like Whitefish or Big Sky{'\u2014'}prices are reasonable by Montana
        standards, and options range from basic motels to comfortable vacation homes with
        mountain views. For a distinctive overnight, several guest ranches and cabins in the
        Bitterroot Valley offer a more immersive Montana experience{'\u2014'}particularly appealing
        for families and groups who want space and privacy.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
