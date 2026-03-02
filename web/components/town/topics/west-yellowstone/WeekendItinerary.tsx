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
        A weekend in {townName} puts you one mile from the busiest entrance to
        Yellowstone National Park{'\u2014'}a tiny gateway town of 1,272 year-round
        residents at 6,667 feet where the entire community exists to connect
        visitors with the world's first national park. Canyon Street, the main
        drag, is lined with fly shops, outfitters, restaurants, and souvenir
        stores that cater to the millions of visitors passing through each summer.
        But {townName} is more than a staging area{'\u2014'}the Madison River,
        Hebgen Lake, the Rendezvous Ski Trails, and the Grizzly & Wolf Discovery
        Center make the town a destination in its own right. This three-day
        itinerary covers the essentials for first-time visitors, couples, families,
        and solo travelers. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months to visit:</strong> June{'\u2013'}September for warm weather and full park access; December{'\u2013'}March for snowmobiling and winter Yellowstone tours</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}°F, lows near {summerClimate.avgLow}°F{'\u2014'}warm days, cold nights at 6,667 feet</li>}
        {fallClimate && <li><strong>Fall weather:</strong> Highs around {fallClimate.avgHigh}°F, lows near {fallClimate.avgLow}°F</li>}
        <li><strong>Getting here:</strong> Bozeman Yellowstone International Airport (BZN, 90 miles north); Idaho Falls Regional Airport (IDA, 110 miles south)</li>
        <li><strong>Getting around:</strong> Car essential; {townName}'s core is walkable but park access requires driving</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; Yellowstone entrance pass ($35/vehicle for 7 days) covers unlimited re-entry</li>
        <li><strong>Key distance:</strong> Yellowstone West Entrance gate is 1 mile from downtown; Old Faithful is 30 miles inside the park</li>
      </ul>

      <h2>Day 1: {townName} & Yellowstone's West Side</h2>

      <h3>Morning</h3>
      <p>
        Start with breakfast at one of the cafes on Canyon Street, then head
        directly into <strong>Yellowstone National Park</strong> through the West
        Entrance{'\u2014'}just a mile from town. The road follows the{' '}
        <strong>Madison River</strong> through broad meadows where bison graze
        and elk congregate in the early light. Continue to{' '}
        <strong>Madison Junction</strong>, where the Firehole and Gibbon Rivers
        merge to form the Madison, then drive south along the Firehole toward
        the geyser basins.
      </p>

      <h3>Midday</h3>
      <p>
        Spend the morning exploring the <strong>Lower Geyser Basin</strong> and{' '}
        <strong>Midway Geyser Basin</strong>{'\u2014'}home to{' '}
        <strong>Grand Prismatic Spring</strong>, the park's largest and most
        photogenic hot spring. The boardwalk loop at Midway takes about 30
        minutes; for the iconic aerial view, hike the Fairy Falls Trail to
        the Grand Prismatic overlook (1 mile each way). Continue south to{' '}
        <strong>Old Faithful</strong>, where eruptions occur roughly every 90
        minutes. Watch an eruption, explore the Upper Geyser Basin boardwalks
        past Morning Glory Pool and Castle Geyser, and have lunch at the Old
        Faithful Lodge cafeteria or Snow Lodge dining room.
      </p>

      <h3>Afternoon</h3>
      <p>
        Drive back toward {townName} via the Madison River road, stopping to
        watch for wildlife in the <strong>Madison Valley</strong> meadows{'\u2014'}bison
        herds, elk, and coyotes are commonly spotted along this stretch,
        especially in late afternoon. If time allows, make a short stop at{' '}
        <strong>Firehole Canyon Drive</strong>, a one-way loop with views of the
        Firehole River cascading through a narrow canyon and a popular swimming
        hole (the Firehole Swimming Area, one of the only places in Yellowstone
        where swimming is officially sanctioned).
      </p>

      <h3>Evening</h3>
      <p>
        Back in {townName}, dinner on Canyon Street offers solid options for a
        small gateway town. Look for restaurants serving local Montana beef,
        elk, and bison{'\u2014'}several spots exceed expectations for a town this size.
        After dinner, walk to the <strong>Grizzly & Wolf Discovery
        Center</strong>, which stays open late enough for an evening visit during
        summer. This AZA-accredited wildlife park provides guaranteed close-up
        viewing of grizzly bears and gray wolves{'\u2014'}animals you may or may not
        see in the park{'\u2014'}in naturalistic habitats. The bears are rescues
        that cannot be returned to the wild, making this an educational
        complement to (not a substitute for) wild Yellowstone encounters.
      </p>

      <h2>Day 2: Madison River & Hebgen Lake</h2>

      <h3>Morning</h3>
      <p>
        Dedicate the morning to the <strong>Madison River</strong>. Whether you
        fish or not, the drive north along Highway 287 following the river
        through its broad valley is beautiful. For anglers, this is bucket-list
        water{'\u2014'}hire a local guide for a half-day wade or drift-boat trip on
        one of the world's great trout rivers. For non-anglers, the riverside
        pullouts offer excellent wildlife viewing and photography opportunities.
        The Madison Valley is a major elk and bison corridor, and osprey and
        bald eagles hunt along the river.
      </p>

      <h3>Midday</h3>
      <p>
        Head to <strong>Hebgen Lake</strong>, the 12-mile reservoir northwest of
        town. The <strong>Earthquake Lake Visitor Center</strong> (roughly 20
        miles north) tells the dramatic story of the 1959 Hebgen Lake earthquake
        {'\u2014'}a magnitude 7.3 event that triggered a massive landslide, dammed
        the Madison River to create Earthquake Lake, and killed 28 people. The
        visitor center overlooks the slide area and the ghostly remains of trees
        still standing in the lake. It's one of the most striking geological
        stories in the Northern Rockies and well worth the stop.
      </p>

      <h3>Afternoon</h3>
      <p>
        Return to town and visit the{' '}
        <strong>Museum of the Yellowstone</strong>, housed in the historic 1909
        Union Pacific Railroad depot on Yellowstone Avenue. The museum covers
        the history of Yellowstone tourism, the railroads that built the gateway
        towns, and the natural history of the Greater Yellowstone Ecosystem.
        Afterward, explore {townName}'s shops and outfitters along Canyon
        Street{'\u2014'}the fly shops alone are worth browsing even if you don't
        fish, and the gift shops range from tourist kitsch to genuinely
        interesting Yellowstone books and art.
      </p>

      <h3>Evening</h3>
      <p>
        For dinner, try one of {townName}'s sit-down restaurants for Montana
        fare{'\u2014'}steaks, bison burgers, and local craft beer are the staples.
        After dinner, the <strong>IMAX theater</strong> (Yellowstone Giant
        Screen Theatre) screens a Yellowstone documentary on a six-story screen
        {'\u2014'}a surprisingly effective way to see aerial footage of the park's
        landscapes that are inaccessible on foot. If you prefer a quiet evening,
        a drive along Hebgen Lake's north shore at dusk offers moose sightings
        and sunset views over the Madison Range.
      </p>

      <h2>Day 3: Rendezvous Trails & Departure</h2>

      <h3>Morning</h3>
      <p>
        Start with a hike or walk on the <strong>Rendezvous Ski Trails</strong>,
        {townName}'s world-class Nordic trail system that doubles as hiking and
        mountain biking terrain in summer. The 35 km of trails wind through
        lodgepole pine forest immediately adjacent to town{'\u2014'}you can walk
        from your hotel to the trailhead. Choose a 3{'\u2013'}5 km loop for a morning
        stroll or push deeper into the network for a longer outing. The trails
        are well-marked and offer a peaceful contrast to the bustle of
        Yellowstone's geyser basins.
      </p>

      <h3>Before You Leave</h3>
      <p>
        Grab breakfast or coffee on Canyon Street and make any last-minute
        souvenir stops. If you're heading north to Bozeman (90 miles, roughly
        90 minutes), the drive through the Gallatin Canyon along Highway 191 is
        one of the most scenic in Montana{'\u2014'}the Gallatin River runs alongside
        the highway through a narrow canyon with towering rock walls. If you're
        heading south to Idaho Falls or Salt Lake City, Highway 20 crosses the
        Continental Divide at Targhee Pass and drops into the Snake River Plain.
        For anglers or outdoor enthusiasts planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        detailed information on the Madison River, Hebgen Lake, and Yellowstone
        park waters.
      </p>

      <h2>Cultural Stops</h2>
      <p>
        {townName} is a tiny town, but its museums and attractions focus tightly
        on the Yellowstone story and the Greater Yellowstone Ecosystem:
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
        The <strong>Grizzly & Wolf Discovery Center</strong> is the anchor
        attraction{'\u2014'}an AZA-accredited wildlife park where rescued grizzly
        bears and gray wolves live in naturalistic habitats, providing guaranteed
        close-up viewing and educational programming. The{' '}
        <strong>Museum of the Yellowstone</strong> in the historic 1909 Union
        Pacific depot covers the region's railroad history, early park tourism,
        and natural history. The <strong>Yellowstone Giant Screen Theatre</strong>{' '}
        (IMAX) offers aerial and close-up Yellowstone footage on a massive
        screen. Together, these attractions provide context and depth that
        enriches your time in the park itself.
      </p>

      <h2>Seasonal Adjustments</h2>
      <p>
        <strong>Winter weekends:</strong> {townName} transforms into the
        "Snowmobile Capital of the World" from December through March. Hundreds
        of miles of groomed snowmobile trails radiate from town into the
        surrounding national forest, and guided snowmobile and snowcoach tours
        enter Yellowstone through the West Entrance{'\u2014'}experiencing the park in
        winter, with bison herds on snow-covered roads and geysers erupting
        against frozen landscapes, is unforgettable. The{' '}
        <strong>Rendezvous Ski Trails</strong> become one of the premier Nordic
        skiing venues in North America, with 35 km of professionally groomed
        track. January temperatures average 24°F high and 8°F low{'\u2014'}dress
        accordingly. The Grizzly & Wolf Discovery Center remains open year-round.
      </p>
      <p>
        <strong>Shoulder seasons:</strong> The West Entrance opens to vehicles
        in mid-April, and fall visitation drops off sharply after Labor Day. May
        and September{'\u2013'}October offer dramatically reduced crowds with
        pleasant weather (though snow is possible at 6,667 feet from September
        onward). Fall brings elk bugling in the Madison Valley, golden aspens,
        and some of the best fishing of the year on the Madison River. The
        shoulder seasons reward flexibility{'\u2014'}some businesses reduce hours,
        but the core restaurants and attractions remain open.
      </p>

      <h2>Where to Stay</h2>
      <p>
        {townName} has a range of lodging for a town its size, driven by the
        enormous summer tourism demand. Hotels, cabins, and vacation rentals
        line the streets within easy walking distance of Canyon Street and the
        park entrance. Chain hotels and independent lodges offer reliable options
        at various price points. Cabin rentals{'\u2014'}many bookable through
        vacation rental platforms{'\u2014'}are popular with families and groups.
        During peak summer (July{'\u2013'}August), book well in advance; the town's
        accommodation fills quickly despite its high capacity. In winter, rates
        drop and availability opens up, making it an affordable time to visit
        for snowmobile and Nordic ski enthusiasts.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
