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
        A weekend in {townName} puts you at the gateway to Glacier National Park and the
        heart of Montana's Flathead Valley — one of the most dramatically scenic stretches
        of the Northern Rockies. Glacier's peaks are 30 minutes north, Flathead Lake (the
        largest natural freshwater lake west of the Mississippi) is 14 miles south, and
        Whitefish Mountain Resort is a short drive for year-round mountain recreation.
        Downtown {townName} itself has grown into a legitimate dining and arts destination
        with none of the resort-town pricing. This three-day itinerary covers the essentials
        for first-time visitors, families, couples, and solo travelers — adjust based on
        season and energy level. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather; December–March for skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Glacier Park International Airport (FCA) or drive via US-93/US-2</li>
        <li><strong>Getting around:</strong> Car essential; downtown is walkable but attractions are spread out across the valley</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax</li>
        <li><strong>Key distance:</strong> Glacier National Park's West Glacier entrance is 25 miles away (about 30 minutes)</li>
      </ul>

      <h2>Day 1: Downtown & Flathead Lake</h2>

      <h3>Morning</h3>
      <p>
        Start on Main Street in downtown {townName}. The historic commercial strip runs
        several blocks and is lined with antique shops, art galleries, and locally owned
        stores that reflect the valley's mix of old Montana grit and newer creative energy.
        Grab coffee at Montana Coffee Traders — a regional roaster headquartered here since
        the 1980s — and walk the side streets to browse. Visit the{' '}
        <strong>Northwest Montana History Museum</strong>, which covers Flathead Valley
        history from the Salish and Kootenai peoples through the timber and railroad eras.
        The <strong>Glacier Art Museum</strong> downtown showcases regional artists and
        rotating exhibitions focused on the Northern Rockies landscape.
      </p>

      <h3>Midday</h3>
      <p>
        Drive 14 miles south to Flathead Lake. You can head to Bigfork on the east shore —
        a small town packed with art galleries, gift shops, and the Bigfork Summer Playhouse,
        which has staged musicals since the 1960s — or to Somers and Lakeside on the west
        shore for a quieter, more local vibe. Either way, eat lunch lakeside. The views of
        the Mission Mountains across the water are among the most striking in Montana.
      </p>

      <h3>Afternoon</h3>
      <p>
        Take a boat tour on Flathead Lake or, for something more adventurous, arrange a
        boat shuttle from Dayton (29 miles from {townName}) to Wild Horse Island State Park.
        The 2,163-acre island is home to wild horses, bighorn sheep, mule deer, and bald
        eagles, with several miles of hiking trails and shoreline to explore. Access is by
        private boat or rental only — no ferry service — so plan ahead. For a more relaxed
        alternative, swim and picnic at Wayfarers State Park (14 miles), a beautiful
        day-use area on the northeast shore of Flathead Lake with a swimming beach, picnic
        shelters, and campground.
      </p>

      <h3>Evening</h3>
      <p>
        Head back to downtown {townName} for dinner. Ciao Mambo serves generous Italian
        dishes in a lively atmosphere. Hops Downtown Grill offers craft beer and elevated
        pub fare. The Desoto Grill focuses on locally sourced American cuisine. After
        dinner, check out {townName}'s growing brewery scene — Kalispell Brewing Company,
        Bias Brewing, and Sacred Waters Brewing all offer distinct tasting-room experiences
        within a short drive of each other.
      </p>

      <h2>Day 2: Glacier National Park</h2>

      <h3>Full Day</h3>
      <p>
        Dedicate the entire day to Glacier National Park. Drive 25 miles north to the West
        Glacier entrance — about 30 minutes from {townName}. If Going-to-the-Sun Road is
        fully open (typically July through mid-October), drive the entire 50-mile route
        across the Continental Divide. Stop at overlooks along the way, pull over at Logan
        Pass (6,646 feet), and consider hiking the Highline Trail — a spectacular ridgeline
        traverse with wildflower meadows and mountain-goat sightings — or the shorter
        Hidden Lake Overlook trail, which starts at the Logan Pass Visitor Center and
        climbs 1.5 miles to views of a pristine alpine lake backed by Bearhat Mountain.
      </p>
      <p>
        If Going-to-the-Sun Road isn't fully open (spring and early summer or after
        mid-October closures), hike Avalanche Lake — an easy, popular 5.8-mile round-trip
        through old-growth cedar forest to a glacier-fed lake surrounded by waterfalls —
        or walk the Trail of the Cedars, a short boardwalk loop through ancient western
        red cedars. Note that vehicle reservations may be required during summer months
        for the Going-to-the-Sun Road corridor; check the NPS website before you go.
        See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        more trail options near {townName} and in the park.
      </p>

      <h2>Day 3: Mountains & Departure</h2>

      <h3>Morning</h3>
      <p>
        Drive 19 miles to Whitefish Mountain Resort. In summer, ride the scenic chairlift
        to the summit for panoramic views of Glacier Park, Flathead Lake, and the Whitefish
        Range. The resort also offers mountain biking on lift-served trails and a zip-line
        tour through the forest canopy. In winter, this is one of Montana's premier ski
        areas with over 3,000 acres of terrain and consistent inland-northwest snowfall.
        For a lower-key morning closer to town, hike Lone Pine State Park — just 3 miles
        from downtown {townName} — where short trails wind through ponderosa pine forest
        to overlooks with sweeping views of the Flathead Valley and the peaks beyond.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If it's a summer Saturday, the Kalispell Farmers Market is worth a stop for local
        produce, baked goods, and crafts. Otherwise, drive 15 miles north to Whitefish —
        a charming resort town with an excellent walkable downtown, independent restaurants,
        galleries, and coffee shops that make it worth at least an hour of browsing. For
        fishing gear or last-minute outdoor supplies, several outfitters in the valley
        can point you toward the Flathead River system. See
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations.
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
        The <strong>Northwest Montana History Museum</strong> (downtown) is the anchor
        cultural institution — housed in a former Carnegie library, its permanent collection
        traces Flathead Valley history from the Salish and Kootenai peoples through the
        fur trade, timber industry, and the arrival of the Great Northern Railway. The{' '}
        <strong>Conrad Mansion</strong> (downtown) is a beautifully preserved
        Norman-style Victorian home built in 1895 by {townName} founder Charles E. Conrad;
        guided tours walk you through 26 original rooms filled with period furnishings
        and family artifacts — one of the best historic house tours in Montana.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Whitefish Mountain Resort (19 miles) is the
        primary draw — consistent snow, varied terrain, and a lively base village. Blacktail
        Mountain Ski Area (11 miles), a locals' favorite, offers uncrowded runs and
        stunning lake views at a fraction of the price. Cross-country skiing and
        snowshoeing are excellent at several groomed trail systems in the valley. In Glacier
        National Park, Going-to-the-Sun Road stays open to Lake McDonald Lodge, providing
        access to peaceful snowshoeing and cross-country routes along the lake.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring brings the slow reopening of Glacier
        National Park — Lake McDonald is accessible early, and wildflowers begin blooming
        through May and June. Fall (late September through October) is larch season in the
        Northern Rockies: western larch trees turn brilliant gold across the high ridges
        of Glacier and the surrounding national forests, creating one of the most stunning
        autumn displays in the country. Tourist crowds drop dramatically, and trails that
        feel congested in July become serene.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown {townName} offers the most budget-friendly hotel and motel options in the
        valley and puts you close to restaurants, shops, and the museums. Whitefish (15
        miles north) has a more polished resort atmosphere with boutique hotels and
        vacation rentals — ideal if you want walkable nightlife and dining at a higher
        price point. For a different experience entirely, lakeside lodges and cabins on
        Flathead Lake combine water access with mountain views and work especially well
        for families or groups.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
