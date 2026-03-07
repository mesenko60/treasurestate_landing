import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const SKIP_NAMES = new Set([
  'Church at World Museum of Mining',
  'Bank Building',
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
        A weekend in {townName} puts you in the heart of Montana's most storied mining
        city — a mile-high town built on the richest hill on Earth, where copper barons
        raised Victorian mansions while miners tunneled beneath their feet. Uptown {townName}{' '}
        is a National Historic Landmark District, one of the largest in the United States,
        with hundreds of original brick buildings, towering mine headframes still visible on
        the skyline, and a walkable downtown that feels unlike anywhere else in Montana. The
        Berkeley Pit, a mile-wide open-pit Superfund site, is a stark reminder of the scale
        of extraction that built this city. But {townName} is far more than its mining
        past — it's a tight-knit community with exceptional food (Butte pasties are an
        essential Montana food experience), a fiercely independent spirit, and a St. Patrick's
        Day celebration that rivals cities ten times its size. This three-day itinerary covers
        the essentials for first-time visitors — adjust based on season and energy level.
        For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June–September for warm weather and outdoor day trips; March for St. Patrick's Day — one of the biggest celebrations in the western US</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F — {townName} sits at 5,741 feet and has some of the coolest summers of any Montana hub city</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Bert Mooney Airport (BTM, limited service), or fly into Bozeman (BZN, 80 mi) or Missoula (MSO, 120 mi). I-90 between Missoula and Bozeman runs through {townName}</li>
        <li><strong>Getting around:</strong> Uptown is walkable; car needed for day trips to Fairmont Hot Springs, Our Lady of the Rockies shuttle, and scenic drives</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax, and several {townName} attractions are inexpensive or free</li>
        <li><strong>Key distance:</strong> Fairmont Hot Springs is 15 miles west (about 20 minutes); Pioneer Mountains Scenic Byway starts 42 miles south</li>
      </ul>

      <h2>Day 1: Mining History</h2>

      <h3>Morning</h3>
      <p>
        Start at the <strong>Berkeley Pit Viewing Stand</strong>, about a mile from
        Uptown. The Berkeley Pit is a former open-pit copper mine — now a mile-wide,
        1,780-foot-deep lake of toxic water that is one of the largest Superfund sites in
        the United States. An observation platform gives you a direct view into the pit,
        with interpretive panels explaining the scale of mining that removed billions of
        tons of earth and shaped modern {townName}. It's an unforgettable sight and an
        essential first stop to understand what this city was built on. From there, drive
        to the <strong>World Museum of Mining</strong>, built on the site of the Orphan
        Girl mine. The museum includes a full replica 1890s mining town called Hell Roarin'
        Gulch, with dozens of original and reconstructed buildings, and offers underground
        mine tours that take you into the actual Orphan Girl mine shaft — one of the few
        places in Montana where you can experience a real mine underground.
      </p>

      <h3>Afternoon</h3>
      <p>
        Walk to the <strong>Copper King Mansion</strong>, the 34-room Victorian mansion
        built by copper baron W.A. Clark — one of the wealthiest men in America at the
        turn of the 20th century. Guided tours take you through the ornate rooms, original
        furnishings, and hand-painted frescoes that showcase the staggering wealth that
        copper mining concentrated in {townName}. The mansion also operates as a
        bed-and-breakfast, so you can sleep in a copper king's home if you book ahead. After
        the mansion, spend the rest of the afternoon walking <strong>Uptown
        {townName}</strong>. The National Historic Landmark District is packed with original
        brick buildings, ornate facades, and the iconic mine headframes that still rise above
        the rooftops — silent monuments to the 10,000 miles of tunnels that honeycomb the
        ground beneath your feet.
      </p>

      <h3>Evening</h3>
      <p>
        Hit the breweries before dinner. <strong>Quarry Brewing</strong> and{' '}
        <strong>Muddy Creek Brewing</strong> both serve solid craft beer in casual,
        locals-friendly taprooms — a good way to feel {townName}'s community character.
        For dinner, head to <strong>Casagranda's Steakhouse</strong>, a {townName}{' '}
        institution that has been serving steaks and Italian-American dishes since the
        1950s. The wood-paneled interior, generous portions, and old-school atmosphere
        are pure {townName}.
      </p>

      <h2>Day 2: Outdoor Adventure & Culture</h2>

      <h3>Morning</h3>
      <p>
        Choose your adventure based on preference and energy. Option one: take the shuttle
        from Butte Plaza Mall to <strong>Our Lady of the Rockies</strong>, a 90-foot statue
        perched on the Continental Divide at 8,510 feet — the fourth-tallest statue in the
        United States. The shuttle ride and guided tour take about two hours and offer
        sweeping views of the {townName} valley and surrounding ranges. Option two: drive
        15 miles west on I-90 to <strong>Fairmont Hot Springs</strong>, a resort with
        naturally heated pools, a 350-foot waterslide, and a relaxed atmosphere that makes
        it one of the most popular day trips from {townName}. On a cool morning, the hot
        springs are hard to beat.
      </p>

      <h3>Lunch</h3>
      <p>
        This is the meal that defines a {townName} visit. Stop at <strong>Joe's Pasty
        Shop</strong> and order a <strong>Butte pasty</strong> — a savory hand pie filled
        with seasoned meat, potatoes, and onions, enclosed in a crimped pastry crust.
        Pasties were brought to {townName} by Cornish miners in the 19th century and became
        the working lunch of the mining camps — portable, filling, and eaten underground
        by hand. They remain a deeply local food tradition, and Joe's has been making them
        the same way for decades. If you eat one thing in {townName}, make it a pasty.
      </p>

      <h3>Afternoon</h3>
      <p>
        If you chose the statue in the morning, drive to Fairmont Hot Springs now — or
        vice versa. Alternatively, for a scenic drive, head south toward the{' '}
        <strong>Pioneer Mountains Scenic Byway</strong> (starting point about 42 miles
        south), a stunning loop through the Pioneer Mountains with views of glacial
        valleys, alpine lakes, and some of the least-visited backcountry in southwest
        Montana. Even driving the first portion and turning back gives you a taste of the
        landscape.
      </p>

      <h3>Evening</h3>
      <p>
        Return to Uptown for a relaxed evening. Walk through the historic district as the
        late light catches the headframes and brick facades, then find dinner at{' '}
        <strong>Metals Banquet</strong> for a more upscale experience, or keep it casual at
        one of {townName}'s many neighborhood bars — the city has more bars per capita than
        almost any city in America, a legacy of its mining-camp origins.
      </p>

      <h2>Day 3: Local Flavor & Departure</h2>

      <h3>Morning</h3>
      <p>
        Visit the <strong>Historic Clark Chateau Museum & Gallery</strong>, the Chateauesque
        home built by Charles Clark (son of copper king W.A. Clark). The museum houses art
        exhibitions and local history displays in one of {townName}'s most architecturally
        distinctive buildings. Next door, the <strong>Science Mine</strong> is an interactive
        science center with hands-on exhibits — a good stop for families or anyone curious
        about the science behind mining and geology. If you have time, check out the{' '}
        <strong>Piccadilly Museum of Transportation</strong> for a collection of historic
        vehicles and transportation artifacts.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Grab a final {townName} meal at <strong>Matt's Place</strong>, a classic drive-in
        that has been serving burgers since 1930 and is one of the oldest drive-in
        restaurants in Montana — or hit <strong>Pork Chop John's</strong>, another {townName}{' '}
        original known for its namesake pork chop sandwiches. Both are cheap, fast, and
        deeply local. Fun fact: Evel Knievel was born and raised in {townName} — the city's
        daredevil spirit runs deep. For anglers or outdoor enthusiasts planning a return
        trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on nearby rivers and lakes.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        If weather or preference shifts your plans indoors, {townName} has a strong
        cluster of museums and cultural sites — most within walking distance of Uptown:
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
        The <strong>World Museum of Mining</strong> is the anchor cultural institution — built
        on the Orphan Girl mine site, it combines a surface-level replica mining town with
        underground mine tours that give you a firsthand sense of what life was like for the
        thousands of miners who worked beneath {townName}. The <strong>Copper King
        Mansion</strong> offers the most vivid window into the wealth that mining
        created — W.A. Clark's 34-room home is one of the finest Victorian mansions in the
        American West. The <strong>Clark Chateau</strong> and <strong>Science Mine</strong>{' '}
        round out the Uptown museum cluster and can be visited in a single morning.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName} winters are cold at 5,741 feet, but the
        city's indoor attractions — museums, mansions, breweries, and restaurants — make a
        winter weekend viable if you dress for it. Discovery Ski Area (38 miles west near
        Anaconda) offers uncrowded runs and affordable lift tickets. Fairmont Hot Springs is
        especially appealing in winter, with steam rising from the outdoor pools against a
        snowy backdrop.
      </p>
      <p>
        <strong>St. Patrick's Day (March):</strong> If you visit in mid-March, you'll
        experience one of the biggest St. Patrick's Day celebrations in the western United
        States. {townName}'s large Irish-American population — descended from the Irish
        miners who worked the copper mines — throws a city-wide party with parades, live
        music, and festivities that draw visitors from across Montana and beyond. Book
        lodging well in advance.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> Fall (September–October) is {townName}'s quietest
        and most atmospheric season — the cottonwoods turn gold, the crowds thin, and the
        light on the headframes and brick facades is at its best. Spring brings snowmelt and
        wildflowers to the surrounding mountains by late May, though temperatures can be
        unpredictable at this elevation.
      </p>

      <h2>Where to Stay</h2>
      <p>
        Uptown {townName} has a handful of hotels and motels that put you within walking
        distance of the historic district, restaurants, and breweries. For a unique
        experience, book a room at the <strong>Copper King Mansion</strong>, which operates
        as a bed-and-breakfast — you'll sleep in one of the most historic homes in
        Montana. Chain hotels along I-90 and Harrison Avenue offer reliable,
        budget-friendly options with easy highway access. If you're visiting for St.
        Patrick's Day, book early — lodging fills up fast.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
