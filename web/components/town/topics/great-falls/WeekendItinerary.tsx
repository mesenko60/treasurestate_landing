import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Vinegar Jones Cabin',
  'Welcome Center/Information/Restrooms',
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
        A weekend in {townName} puts you on the high plains of north-central Montana, where
        the Missouri River drops over a series of five waterfalls that gave the city its name.
        Lewis and Clark spent a grueling month here in 1805 portaging around the Great Falls
        of the Missouri — today, the city of 60,000 is built around that same stretch of river
        and offers one of Montana's best concentrations of museums, trails, and natural
        landmarks. The <strong>C.M. Russell Museum</strong> holds the world's largest
        collection of Charlie Russell's western art. <strong>Giant Springs State
        Park</strong> protects one of the largest freshwater springs on Earth. And the{' '}
        <strong>River's Edge Trail</strong> stretches over 60 miles along the Missouri,
        connecting parks, neighborhoods, and scenic overlooks. {townName} is also a strong
        base for day trips to First Peoples Buffalo Jump, Fort Benton, and the seasonal snow
        goose migration at Freezout Lake. This three-day itinerary covers the essentials —
        adjust based on season and wind. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather and outdoor activities; late March for the Freezout Lake snow goose migration</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — expect wind year-round</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Great Falls International Airport (GTF), I-15 from Helena or the Canadian border, US-87/89 from Billings or Lewistown</li>
        <li><strong>Getting around:</strong> Car needed for day trips to Giant Springs, Buffalo Jump, and Fort Benton; downtown is compact and walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and several {townName} museums are affordable or free</li>
        <li><strong>Key distances:</strong> First Peoples Buffalo Jump is 11 miles south; Fort Benton is 36 miles northeast; Freezout Lake WMA is 38 miles west</li>
      </ul>

      <h2>Day 1: Downtown Great Falls</h2>

      <h3>Morning</h3>
      <p>
        Start at the <strong>C.M. Russell Museum</strong>, the crown jewel of {townName}'s
        cultural scene and one of the most significant western art museums in the country.
        The collection includes hundreds of original Charlie Russell paintings, sculptures,
        and illustrated letters, along with his preserved log cabin studio and home on the
        museum grounds. Russell lived and worked in {townName} from 1897 until his death in
        1926, and the museum captures both the art and the world that inspired it. Allow at
        least two hours — the collection is larger and more powerful than most visitors expect.
      </p>

      <h3>Midday</h3>
      <p>
        Drive to the <strong>Lewis and Clark National Historic Trail Interpretive
        Center</strong>, 3 miles from downtown on a bluff overlooking the Missouri River.
        This is one of the finest interpretive centers on the entire Lewis and Clark trail,
        with detailed exhibits on the Corps of Discovery's month-long portage around the
        Great Falls — an 18-mile overland haul that was one of the most physically demanding
        stretches of the entire expedition. Interactive exhibits, a full-scale cottonwood
        canoe, and the river views from the center make this a highlight for history buffs
        and casual visitors alike.
      </p>

      <h3>Afternoon</h3>
      <p>
        Return downtown and visit <strong>Paris Gibson Square Museum of Art</strong>, housed
        in a striking 1896 Romanesque Revival school building named for {townName}'s founder.
        The museum showcases contemporary and regional art in rotating exhibitions — the
        building itself, with its sandstone arches and original woodwork, is worth the visit.
        Afterward, walk a section of the <strong>River's Edge Trail</strong> along the
        Missouri River. The paved path stretches over 60 miles and connects parks, bridges,
        and river overlooks — even a short walk gives you a sense of the river landscape
        that defines {townName}.
      </p>

      <h3>Evening</h3>
      <p>
        {townName}'s brewery scene punches above its weight. Start at <strong>Mighty Mo
        Brewing Company</strong>, a popular downtown taproom with a solid rotating lineup.
        Walk to <strong>Jeremiah Johnson Brewing Company</strong> for a second round in a
        relaxed, western-themed space. For dinner, <strong>Dante's</strong> is a {townName}
        institution serving Italian-American food with loyal local following.{' '}
        <strong>Clark & Lewie's</strong> offers a broad menu in a comfortable setting near
        the river. <strong>3D International</strong> is a local favorite for Southeast Asian
        cuisine that surprises first-time visitors with its quality and authenticity.
      </p>

      <h2>Day 2: Outdoor Adventure & History</h2>

      <h3>Morning</h3>
      <p>
        Head to <strong>Giant Springs State Park</strong>, 4 miles from downtown on the
        Missouri River. The spring discharges roughly 156 million gallons of water per day,
        making it one of the largest freshwater springs in the world. The water emerges at a
        constant 54°F after filtering through the Madison Limestone formation for an
        estimated 3,000 years. The park also contains the <strong>Roe River</strong>,
        recognized as one of the shortest rivers in the world at just 201 feet. A state fish
        hatchery on site raises rainbow and brown trout — kids can watch the fish in the
        raceways, and the surrounding trails offer easy walking along the river with views
        of Rainbow Dam.
      </p>

      <h3>Afternoon — Choose Your Adventure</h3>
      <p>
        <strong>Option A: First Peoples Buffalo Jump State Park</strong> (11 miles south).
        This mile-long sandstone cliff was used by Native peoples for over 2,000 years to
        drive bison herds over the edge — it's one of the largest pishkun sites in North
        America. The interpretive center at the base of the cliff explains the hunting
        technique, the ecology of the buffalo-dependent plains culture, and the archaeological
        significance of the site. Walking along the cliff rim with the Great Plains stretching
        to the horizon is a striking experience.
      </p>
      <p>
        <strong>Option B: Fort Benton day trip</strong> (36 miles northeast). Called the
        "Birthplace of Montana," Fort Benton was the uppermost navigable point on the Missouri
        River and served as Montana's most important steamboat port from the 1850s through the
        1880s. The <strong>Museum of the Upper Missouri</strong> and the historic levee along
        the river tell the story of the fur trade, gold rush supply routes, and early
        settlement. The town is also the gateway to the <strong>Wild and Scenic Missouri
        River</strong> — the 149-mile stretch downstream from Fort Benton is one of the
        most pristine and undeveloped sections of the Missouri remaining anywhere.
      </p>
      <p>
        <strong>Option C: Freezout Lake WMA</strong> (38 miles west, seasonal). In late
        March and early April, over 300,000 snow geese and thousands of tundra swans stop at
        Freezout Lake during their northward migration — one of Montana's most spectacular
        wildlife events. The birds fill the sky in massive, swirling flocks at dawn and dusk.
        Outside of spring migration, the area is quieter but still good for birding.
      </p>

      <h3>Evening</h3>
      <p>
        Return to {townName} for a relaxed evening. <strong>Electric City Coffee</strong> is
        a solid stop for an afternoon pick-me-up before dinner. For a casual meal, the local
        brewery taprooms serve food or have food trucks on site. Alternatively, explore
        downtown on foot — {townName}'s downtown core is compact and easy to navigate on a
        warm evening.
      </p>

      <h2>Day 3: Local Culture & Departure</h2>

      <h3>Morning</h3>
      <p>
        Start the day at the <strong>Roadhouse Diner</strong>, a {townName} breakfast
        institution. Expect a line on weekends — the portions are enormous and the local
        following is fiercely loyal. After breakfast, drive to the <strong>Malmstrom
        Museum</strong> (4 miles), which chronicles the history of Malmstrom Air Force Base
        and its role in America's intercontinental ballistic missile program. The museum
        covers the base's Cold War history and the Minuteman missile field that still
        surrounds {townName} — a unique piece of Montana history that most visitors don't
        expect.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If you have time, take a final ride or walk on the <strong>River's Edge
        Trail</strong>. The stretch near Giant Springs and Black Eagle Dam offers some of
        the best river views in the city. Bike rentals are available locally if you want to
        cover more ground. Otherwise, grab a last coffee at Electric City Coffee and pick up
        local goods downtown. For anglers planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on the Missouri River and area lakes.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} has a remarkably strong museum scene for a city its size — most are
        clustered within a few miles of downtown and are affordable or free:
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
        The <strong>C.M. Russell Museum</strong> is the anchor institution — it holds the
        world's most comprehensive collection of Charlie Russell's original artwork and is
        widely considered one of the finest western art museums in the United States. The{' '}
        <strong>Lewis and Clark Interpretive Center</strong> is among the best stops on the
        entire Lewis and Clark trail, with a particular focus on the portage around the Great
        Falls. <strong>Paris Gibson Square Museum of Art</strong> is a beautiful small museum
        in a historic building, and the <strong>Children's Museum of Montana</strong> is
        excellent for families with younger kids.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName}'s winters are cold and notably windy.
        Focus on the indoor museum circuit — the C.M. Russell Museum, Lewis and Clark
        Interpretive Center, and The History Museum can fill a full day. Showdown Montana ski
        area is about 90 miles south near Neihart. Cross-country skiing is available at
        several area trails. Wind chill is a serious factor — dress in layers and check
        conditions before heading outdoors.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring (late March–April) brings the Freezout Lake
        snow goose migration, one of Montana's signature wildlife spectacles. Fall (September
        through October) offers warm days, golden light along the Missouri River, and thinner
        crowds at all attractions. The River's Edge Trail is excellent for biking in both
        seasons. {townName} is windy year-round — it's not a bug, it's a feature of the
        high plains geography.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} has a mix of chain hotels and locally-owned options clustered
        along the I-15 corridor and near the 10th Avenue commercial strip. Staying downtown
        puts you within walking distance of the C.M. Russell Museum, Paris Gibson Square,
        restaurants, and breweries. Hotels near the interstate offer easy access to Giant
        Springs and day-trip routes. For a more distinctive stay, look into options in Fort
        Benton — a few small inns and B&Bs sit along the Missouri River levee if you want
        to extend that day trip into an overnight.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
