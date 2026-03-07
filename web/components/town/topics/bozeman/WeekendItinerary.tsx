import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Manhattan Area Museum',
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
        A weekend in {townName} puts you at the crossroads of Montana's best outdoor access
        and a genuinely vibrant college-town culture. Yellowstone National Park is an hour south,
        world-class skiing is minutes away, and downtown is packed with independent restaurants,
        breweries, and shops. This three-day itinerary works for first-time visitors, families,
        couples, and solo travelers — adjust based on season and energy level.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather; December–March for skiing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Bozeman Yellowstone International Airport (BZN) or drive via I-90</li>
        <li><strong>Getting around:</strong> Car recommended for canyon and mountain trips; downtown is walkable</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax</li>
      </ul>

      <h2>Day 1: Downtown & Campus</h2>

      <h3>Morning</h3>
      <p>
        Start on Main Street downtown — one of the best-preserved historic commercial districts
        in Montana. Walk the full stretch between Grand Avenue and Rouse Avenue, browsing
        independent shops, galleries, and coffee roasters. The buildings date to the late 1800s
        and early 1900s, and the storefronts house the kind of locally owned businesses that
        have largely disappeared from other mountain towns. Grab coffee at Treeline, Wild Joe*s,
        or Rockford.
      </p>

      <h3>Midday</h3>
      <p>
        Lunch on Main Street. Open Range serves Montana-raised beef and game in a handsome
        brick-walled dining room. Plonk pairs creative small plates with an impressive wine
        list. Jam! and Feed Café are excellent casual breakfast-and-lunch spots if you're
        looking for something more relaxed. All are within a few blocks of each other.
      </p>

      <h3>Afternoon</h3>
      <p>
        Head to the Montana State University campus and visit the{' '}
        <strong>Museum of the Rockies</strong> — a world-class natural history museum with one
        of the largest dinosaur fossil collections in the world, assembled under paleontologist
        Jack Horner. The planetarium and living history farm round out the visit. Allow at
        least two hours. Afterward, walk through the MSU campus and, if you have the energy,
        hike Peet's Hill — a short climb just south of downtown that rewards you with panoramic
        views of the Bridger Range, Gallatin Valley, and the Spanish Peaks at sunset.
        See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for more trail options.
      </p>

      <h3>Evening</h3>
      <p>
        {townName}'s brewery scene is one of the best in Montana. MAP Brewing sits right on
        the East Gallatin River with mountain views from the patio. Bozeman Brewing Company
        is a long-running local staple, and Mountains Walking specializes in farmhouse ales.
        Hit one or two, then grab dinner downtown — the restaurant scene ranges from
        farm-to-table to wood-fired pizza to traditional Montana steakhouses.
      </p>

      <h2>Day 2: Mountain Adventure</h2>

      <h3>Morning</h3>
      <p>
        Drive south to Hyalite Canyon, about 10 miles from town. In summer, hike to Palisade
        Falls — an easy 1.2-mile roundtrip to a dramatic 80-foot waterfall on a paved,
        wheelchair-accessible trail. For a longer outing, continue up the canyon to Emerald
        and Heather Lakes, a moderate out-and-back through subalpine forest with rewarding
        alpine lake payoffs. In winter, swap Hyalite for Bridger Bowl (16 miles northeast), a
        community-owned ski area beloved by locals for its steep terrain and affordable
        lift tickets. See our{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for detailed trail
        descriptions.
      </p>

      <h3>Afternoon</h3>
      <p>
        After your morning adventure, drive to Bozeman Hot Springs (5 miles south) for a
        soak. The facility has a dozen pools at different temperatures, from cool plunge
        pools to 106°F soaking tubs, plus a fitness center and sauna. It's the perfect
        recovery after a hike or ski day and a legitimate local hangout, not just a tourist
        stop.
      </p>

      <h3>Evening</h3>
      <p>
        Check the local events calendar. In summer, Music on Main takes over downtown on
        Thursday evenings with free live music and food vendors. The Sweet Pea Festival
        in early August is {townName}'s signature arts event — three days of music, art,
        and performances in Lindley Park. Year-round, catch a show at the Ellen Theatre
        (a beautifully restored 1919 movie palace that hosts live music, comedy, and
        film) or the Rialto, a versatile events venue with a strong booking calendar.
      </p>

      <h2>Day 3: Gallatin Valley & Departure</h2>

      <h3>Morning</h3>
      <p>
        For a history-focused morning, drive 28 miles west to Missouri Headwaters State
        Park, where the Jefferson, Madison, and Gallatin rivers converge to form the
        Missouri River. Lewis and Clark documented this exact confluence in July 1805,
        and interpretive trails walk you through the geography and history of the spot.
        It's a powerful, quiet place — one of the most significant geographic landmarks
        in the American West.
      </p>
      <p>
        Alternatively, do a morning hike up Drinking Horse Mountain (4 miles north of
        town). The moderate loop trail climbs through grasslands and scattered timber to
        a ridgeline with panoramic views of the Gallatin Valley, Bridger Range, and the
        Tobacco Root Mountains. It takes about 90 minutes and is one of the most
        accessible hikes near {townName}.
      </p>

      <h3>Before You Leave</h3>
      <p>
        If it's a summer Saturday, the Bozeman Farmers Market at Lindley Park is one of
        the best in the state — local produce, baked goods, crafts, and prepared foods.
        Any day of the week, stop at the Co-op (a well-stocked natural grocery) or
        Heeb's East Main Grocery for Montana-made products and road snacks. For fishing
        gear or last-minute outdoor supplies, Bozeman has several excellent fly shops —
        see our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
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
        The <strong>Museum of the Rockies</strong> (1 mi from downtown) is the standout —
        Jack Horner built one of the largest dinosaur collections in the world here,
        including a T. rex skull and growth-series specimens that changed how scientists
        understand dinosaur biology. Beyond paleontology, the museum covers regional
        history from Native peoples through homesteading, runs a planetarium, and maintains
        a living history farm with heritage crops and period buildings. The{' '}
        <strong>American Computer Museum</strong> (1 mi) traces the history of computing
        from the abacus to modern AI in a surprisingly engaging exhibit, and the{' '}
        <strong>Gallatin History Museum</strong> (downtown) occupies the old county jail
        and covers Bozeman's frontier and railroad heritage.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> Bridger Bowl (16 miles northeast) is the local
        favorite — steep, affordable, and community-owned. Big Sky Resort (45 miles southwest)
        offers massive terrain across four mountains and some of the biggest vertical in
        North America. For cross-country skiing, Bohart Ranch Nordic Center has groomed
        trails with mountain views. End any ski day at Bozeman Hot Springs for a soak.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Spring trails are often muddy until late May,
        but the rivers start fishing well by April. Fall (September–October) is arguably
        the best time to visit {townName} — golden cottonwoods line the Gallatin Valley,
        tourist crowds thin out, and fishing conditions are excellent. The Gallatin,
        Madison, and Yellowstone rivers all fish well into October.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Downtown hotels put you within walking distance of Main Street restaurants,
        breweries, and shops — the best setup for a car-light weekend. Vacation rentals
        in the residential neighborhoods south and west of downtown offer more space and
        are still just a short drive from everything. For families or longer stays,
        rentals near the Hyalite Canyon road give you quick access to trails and the
        hot springs.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
