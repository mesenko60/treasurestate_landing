import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Kalispell Convention & Visitors Bureau',
  'Lone Pine Visitor Center',
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
        A weekend in {townName} puts you in one of Montana's most charming mountain towns —
        a place where a walkable downtown on Central Avenue meets world-class skiing at
        Whitefish Mountain Resort (5 miles), Glacier National Park (17 miles), and a
        glacial lake at the edge of town. {townName} is smaller and more intimate than
        Kalispell or Missoula, with a resort-town energy that blends Montana authenticity
        with excellent dining, craft breweries, and outdoor access that rivals anywhere in
        the Northern Rockies. This three-day itinerary covers the essentials for first-time
        visitors. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for summer; December–March for skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Glacier Park International Airport (FCA, 11 miles south) or Amtrak Empire Builder</li>
        <li><strong>Getting around:</strong> Car useful for Glacier trips; downtown is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax</li>
        <li><strong>Key distance:</strong> Glacier National Park's west entrance is 17 miles away (about 20 minutes)</li>
      </ul>

      <h2>Day 1: Downtown & Whitefish Lake</h2>

      <h3>Morning</h3>
      <p>
        Start on Central Avenue, {townName}'s walkable main street. The three-block commercial
        core is packed with independent boutiques, art galleries, outdoor shops, and coffee
        roasters. Grab coffee at Montana Coffee Traders — a regional roaster with roots in
        the Flathead Valley — and browse the shops. The{' '}
        <strong>Stumptown Historical Society Museum</strong> (downtown) covers {townName}'s
        history from its origins as a Great Northern Railway division point through the
        development of the ski resort and the town's transformation into a year-round
        destination.
      </p>

      <h3>Midday</h3>
      <p>
        Walk or drive 2 miles to Whitefish Lake. City Beach is the main public access point,
        with a sandy beach, swimming area, picnic facilities, and views across the lake to
        the mountains. In summer, rent a stand-up paddleboard or kayak from one of the
        outfitters near the beach. Whitefish Lake State Park, on the west shore, offers a
        quieter alternative with a campground and shoreline trails through the forest. Lunch
        at one of the lakeside restaurants or pack a picnic — the beach setting is one of the
        best in Montana.
      </p>

      <h3>Afternoon</h3>
      <p>
        Explore the Whitefish Trail — a growing community trail system that winds through
        forest along the lake's western shore and connects into the broader valley. For a
        shorter option, walk the lakeshore path at Whitefish Lake State Park. If you're
        visiting in summer, afternoon thunderstorms can roll in quickly — keep an eye on
        the sky and head back to town if clouds build.
      </p>

      <h3>Evening</h3>
      <p>
        Dinner on Central Avenue. Tupelo Grille serves Southern-inspired cuisine in a warm,
        bustling atmosphere — one of {townName}'s most popular restaurants, so reservations
        are recommended. Pescado Blanco offers creative Mexican-seafood dishes. Loula's is
        a beloved local spot for comfort food. After dinner, walk to Great Northern Brewing
        Company — one of Montana's original craft breweries, operating since 1994 — or
        Bonsai Brewing Project for a more intimate tasting-room experience. The Bulldog Pub
        is a Central Avenue institution if you want a casual bar with a locals' vibe.
      </p>

      <h2>Day 2: Glacier National Park</h2>

      <h3>Full Day</h3>
      <p>
        Dedicate the entire day to Glacier National Park. The west entrance at Apgar is just
        17 miles from {townName} — about 20 minutes. If Going-to-the-Sun Road is fully open
        (typically July through mid-October), drive the entire 50-mile route across the
        Continental Divide. Stop at overlooks, pull over at Logan Pass (6,646 feet), and hike
        the Highline Trail — a spectacular ridgeline traverse — or the shorter Hidden Lake
        Overlook trail (1.5 miles to views of a pristine alpine lake backed by Bearhat
        Mountain).
      </p>
      <p>
        If Going-to-the-Sun Road isn't fully open, hike Avalanche Lake — an easy, popular
        5.8-mile round trip through old-growth cedar forest to a glacier-fed lake surrounded
        by waterfalls — or walk the Trail of the Cedars, a boardwalk loop through ancient
        western red cedars. Vehicle reservations may be required during summer months for
        Going-to-the-Sun Road — check the NPS website before you go. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for more trails.
      </p>

      <h2>Day 3: The Mountain & Departure</h2>

      <h3>Morning</h3>
      <p>
        Drive 5 miles to Whitefish Mountain Resort. In summer, ride the scenic chairlift to
        the summit of Big Mountain (6,817 feet) for panoramic views of Glacier National Park,
        the Flathead Valley, and Whitefish Lake far below. The summit nature center has
        interpretive exhibits. The resort offers lift-served mountain biking on an extensive
        trail network and a zip-line course through the forest canopy. In winter, this is
        why {townName} exists — over 3,000 acres of skiable terrain with consistent
        inland-northwest powder and a base village with dining and après-ski options.
      </p>
      <p>
        Alternatively, hike the Danny On Trail from the base to the summit — a 3.8-mile
        climb through wildflower meadows with rewarding views at the top. In summer you can
        ride the chairlift one direction and hike the other.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Walk Central Avenue one more time for any last shopping or a final coffee. If it's
        Saturday in summer, the Whitefish Farmers Market is worth a stop for local produce,
        baked goods, and crafts. Stop by the historic Whitefish Depot — the Amtrak station —
        to see the beautifully restored Great Northern Railway building. For a memorable
        departure meal, Cafe Kandahar at the ski resort base offers refined mountain dining
        that has earned a loyal following.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        If weather or preference shifts your plans indoors, {townName} and the nearby valley
        have several museums worth a visit:
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
        The <strong>Stumptown Historical Society Museum</strong> in downtown {townName} is the
        anchor cultural institution, tracing the town's evolution from a railroad division
        point to a world-class resort destination. The{' '}
        <strong>Glacier Park Museum</strong> (7 miles) covers the history and ecology of
        Glacier National Park. For a deeper cultural excursion, Kalispell (15 miles south)
        offers the Northwest Montana History Museum and the Conrad Mansion — a beautifully
        preserved 1895 Victorian home with guided tours.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Whitefish Mountain Resort is the centerpiece — one
        of the best ski resorts in Montana with consistent snow, varied terrain from groomed
        runs to steep chutes, and a lively base village. Nordic skiing is excellent on
        groomed trails around the valley. In Glacier National Park, Going-to-the-Sun Road
        stays open to Lake McDonald Lodge, providing access to snowshoeing and cross-country
        routes along the lake. Après-ski on Central Avenue is a quintessential {townName}
        experience.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings skiing through April at higher
        elevations and the slow reopening of Glacier National Park. Fall (late September
        through October) is larch season — western larch trees turn brilliant gold across
        the high ridges of the Whitefish Range and Glacier, creating one of the most stunning
        autumn displays in the Northern Rockies. Tourist crowds drop dramatically, and
        trails that feel congested in July become serene. Lodging rates are significantly
        lower during both shoulder seasons.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Central Avenue and the surrounding blocks offer the most walkable lodging options,
        with boutique hotels, historic inns, and vacation rentals putting you within steps
        of restaurants and nightlife. The ski resort base area has slopeside condominiums
        and lodges — ideal if skiing is the priority. Lakeside vacation rentals on Whitefish
        Lake combine water access with mountain views and work well for families and groups.
        For budget-conscious travelers, Kalispell (15 miles south) and Columbia Falls (9
        miles east) offer more affordable hotel options while keeping {townName} and Glacier
        within easy reach.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
