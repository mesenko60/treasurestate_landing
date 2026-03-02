import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '1rem 0',
  fontSize: '0.92rem',
};

const thStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'left',
  borderBottom: '2px solid #e0e0e0',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
};

const tdRight: React.CSSProperties = { ...tdStyle, textAlign: 'right' };

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  const museums = highlights
    .filter(h => h.type === 'Museum' && h.distMiles <= 20)
    .slice(0, 8);
  const parks = highlights
    .filter(h => h.type === 'State Park' && h.distMiles <= 50)
    .slice(0, 4);
  const hotSprings = highlights
    .filter(h => h.type === 'Hot Spring' && h.distMiles <= 50)
    .slice(0, 4);
  const skiAreas = highlights
    .filter(h => h.type === 'Ski Area' && h.distMiles <= 50)
    .slice(0, 2);
  const allNearby = [...museums, ...parks, ...hotSprings, ...skiAreas]
    .sort((a, b) => a.distMiles - b.distMiles);

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you on the south shore of Flathead Lake{'\u2014'}the
        largest natural freshwater lake west of the Mississippi{'\u2014'}with the Mission
        Mountains rising to the east and 50 miles of shoreline to explore. {townName} is
        a genuine small town of around 5,000 people that serves as the gateway to Wild
        Horse Island, cherry orchards, world-class birding at Ninepipes, and the cultural
        heart of the Confederated Salish and Kootenai Tribes. This is not a resort
        destination{'\u2014'}it{'\u2019'}s a working lake town where outdoor recreation is woven into
        daily life. This weekend itinerary covers a Friday evening arrival through Sunday
        departure. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <ul>
        <li>
          <strong>Peak season (June{'\u2013'}September):</strong> Warm days, lake activities,
          cherry picking in July, long daylight hours.
          {summerClimate && ` July highs average ${summerClimate.avgHigh}\u00b0F with lows near ${summerClimate.avgLow}\u00b0F.`}
        </li>
        <li>
          <strong>Shoulder season (May & October):</strong> Fewer crowds, lower lodging
          rates, great birding at Ninepipes, fall color in the Mission Range.
        </li>
        <li>
          <strong>Winter (December{'\u2013'}March):</strong> Blacktail Mountain skiing (27 mi),
          hot springs, cozy dining downtown.
          {winterClimate && ` January highs average ${winterClimate.avgHigh}\u00b0F with lows near ${winterClimate.avgLow}\u00b0F.`}
        </li>
      </ul>

      <h2>Friday Evening: Arrival & Lakeside Sunset</h2>
      <p>
        Check into lakeside lodging on Flathead Lake{'\u2014'}vacation rentals and
        cabins along the east shore between {townName} and Bigfork offer water access
        and mountain views, while motels in town keep you within walking distance of
        downtown. Once settled, head to downtown {townName} for dinner. The compact
        commercial strip along Main Street has several restaurants ranging from casual
        American fare to lakeside dining. After dinner, walk to Sacajawea Park on
        Polson Bay for sunset over Flathead Lake{'\u2014'}the sky above the lake turns gold
        and pink as the sun drops behind the Salish Mountains to the west. This is one
        of the best sunset vantage points in the Flathead Valley.
      </p>

      <h2>Saturday: Flathead Lake & Cultural Highlights</h2>

      <h3>Morning: On the Water</h3>
      <p>
        Start the day on Flathead Lake. Rent a kayak or stand-up paddleboard from one
        of the outfitters near Polson Bay, or arrange a boat tour. The water is
        remarkably clear{'\u2014'}visibility often exceeds 30 feet{'\u2014'}and the scale of the lake
        (nearly 200 square miles) is stunning once you{'\u2019'}re on it. For a more ambitious
        morning, take a boat shuttle to <strong>Wild Horse Island State Park</strong> (7
        miles by water). The 2,163-acre island is home to bighorn sheep, wild horses,
        mule deer, and bald eagles, with several miles of hiking trails and shoreline
        to explore. Access is by private boat or rental only{'\u2014'}no ferry
        service{'\u2014'}so plan ahead. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for trail
        details on Wild Horse Island and elsewhere near {townName}.
      </p>

      <h3>Lunch: Downtown Polson</h3>
      <p>
        Head back to town for lunch on Main Street. {townName}{'\u2019'}s restaurant options
        include burger joints, bakeries, ice cream shops, and casual American
        restaurants. Montana has no sales tax, so prices are what you see. Browse the
        downtown shops and galleries after your meal{'\u2014'}local art, Montana-made goods,
        and cherry products are common finds.
      </p>

      <h3>Afternoon: Choose Your Adventure</h3>
      <p>
        <strong>Option A {'\u2014'} Miracle of America Museum (1 mi):</strong> One of
        Montana{'\u2019'}s most eclectic museums, with a vast collection of Americana spanning
        antique motorcycles, military vehicles, pioneer artifacts, a one-room
        schoolhouse, and much more. It{'\u2019'}s far larger than its modest exterior
        suggests{'\u2014'}plan at least 90 minutes.
      </p>
      <p>
        <strong>Option B {'\u2014'} Cherry Orchards (summer only):</strong> In July, the
        Flathead Cherry harvest is in full swing. U-pick orchards along the east shore
        of Flathead Lake let you pick Rainier, Bing, and Lambert cherries straight
        from the tree. The Flathead Cherry Festival celebrates the harvest with events
        around {townName}.
      </p>
      <p>
        <strong>Option C {'\u2014'} Hot Springs:</strong> Drive 29 miles west to the town
        of Hot Springs for a soak at Symes Hot Springs (a historic 1928 hotel with
        outdoor mineral pools) or Wild Horse Hot Springs (rustic private soaking
        tubs).
      </p>

      <h3>Evening: Scenic Drive to Bigfork</h3>
      <p>
        Take the scenic lake drive north along Highway 35 to Bigfork (17 miles), a
        charming village at the northeast corner of Flathead Lake known for its art
        galleries, restaurants, and the Bigfork Summer Playhouse. Dinner in Bigfork
        offers upscale options that complement {townName}{'\u2019'}s more casual scene.
        Return south along the lakeshore as evening light plays across the water
        and the Mission Mountains{'\u2014'}the full loop around Flathead Lake is roughly
        90 miles and one of the most scenic drives in Montana.
      </p>

      <h2>Sunday Morning: Nature & Culture</h2>

      <h3>Morning Hike</h3>
      <p>
        Start with a morning hike before the day heats up. The <strong>Mud Lake
        trail</strong> near Polson offers an easy walk through wetlands and forest
        with birding opportunities. For a lakeside stroll, walk the shoreline path
        at Flathead Lake State Park or the trails around Polson Bay. The Mission
        Mountain views from these trails are spectacular in morning light. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        more trail recommendations.
      </p>

      <h3>Cultural Stop Before Departure</h3>
      <p>
        <strong>Option A {'\u2014'} The People{'\u2019'}s Center in Pablo (5 mi):</strong> The
        cultural center of the Confederated Salish and Kootenai Tribes (CSKT) tells
        the story of the S\u0259li\u0161, Ql\u0313ispé, and Ksanka peoples through
        exhibits, a gallery, and cultural programs. The Flathead Reservation{'\u2014'}which
        encompasses {townName} and the surrounding valley{'\u2014'}has a deep and complex
        history, and this center provides essential context for understanding the land
        you{'\u2019'}ve been exploring.
      </p>
      <p>
        <strong>Option B {'\u2014'} Ninepipes National Wildlife Refuge (18 mi):</strong> One
        of the best birding sites in Montana, with over 180 species recorded in the
        wetlands and potholes below the Mission Mountains. Spring and fall migration
        bring spectacular concentrations of waterfowl. The adjacent{' '}
        <strong>Ninepipes Museum of Early Montana</strong> covers the natural and cultural
        history of the region.
      </p>
      <p>
        Before heading out, stop at <strong>Seli{'\u0161'} Ksanka Qlispe{'\u2019'}
        Dam</strong> (formerly Kerr Dam), 7 miles southwest of {townName}. The scenic
        overlook offers a dramatic view of the Flathead River pouring through a
        narrow canyon{'\u2014'}the dam is now tribally owned and operated by the CSKT. For
        anglers planning a return trip, see
        our <Link href={`/montana-towns/${slug}/fishing/`}>fishing guide</Link> for
        recommendations on Flathead Lake and the Flathead River system.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        Winter weekends in {townName} trade lake activities for mountain and hot-spring
        experiences. <strong>Blacktail Mountain Ski Area</strong> (27 miles) is a
        locals{'\u2019'} favorite with uncrowded runs, affordable lift tickets, and
        panoramic views of Flathead Lake from the summit{'\u2014'}one of the most dramatic
        ski-area vistas in Montana. After skiing, drive to Hot Springs (29 mi) for a
        soak at Symes or Wild Horse Hot Springs. Back in {townName}, cozy up at a
        downtown restaurant for dinner. The lake itself is beautiful in
        winter{'\u2014'}quieter, often frosted at the edges, and framed by snow-covered
        mountains.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>{townName} Monthly Climate</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Month</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Avg High ({'\u00b0'}F)</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Avg Low ({'\u00b0'}F)</th>
                </tr>
              </thead>
              <tbody>
                {climate.map(c => (
                  <tr key={c.month}>
                    <td style={tdStyle}>{c.month}</td>
                    <td style={tdRight}>{c.avgHigh}</td>
                    <td style={tdRight}>{c.avgLow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Summer:</strong> Swimsuit, sunscreen, sunglasses, water shoes for lake access, layers for cool evenings (lows in the 50s even in July)</li>
        <li><strong>Fall/Spring:</strong> Warm layers, rain jacket, binoculars for birding at Ninepipes, hiking boots</li>
        <li><strong>Winter:</strong> Ski gear or warm outerwear, base layers, swimsuit for hot springs</li>
        <li><strong>Year-round:</strong> Bear spray if hiking (grizzly and black bear habitat), camera for lake and mountain views</li>
      </ul>

      {allNearby.length > 0 && (
        <>
          <h2>Nearby Highlights Within 50 Miles</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Distance</th>
                </tr>
              </thead>
              <tbody>
                {allNearby.map(h => (
                  <tr key={h.name}>
                    <td style={tdStyle}>{h.name}</td>
                    <td style={tdStyle}>{h.type}</td>
                    <td style={tdRight}>
                      {h.distMiles === 0 ? 'In town' : `${h.distMiles} mi`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2>Where to Stay</h2>
      <p>
        Lakeside vacation rentals and cabins along Flathead Lake{'\u2019'}s east shore offer
        the most memorable lodging{'\u2014'}water access, mountain views, and sunsets from
        your deck. Downtown {townName} has motels and inns within walking distance of
        restaurants and the bay. For budget-conscious travelers, Montana has no sales
        tax, and {townName}{'\u2019'}s lodging market is more affordable than resort towns like
        Whitefish or Bigfork. Camping is available at Flathead Lake State Park units
        around the lakeshore.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>
    </article>
  );
}
