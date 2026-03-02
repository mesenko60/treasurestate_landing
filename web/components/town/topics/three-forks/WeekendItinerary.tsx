import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  climate: { month: string; avgHigh: number; avgLow: number }[] | null;
  highlights: RecPlace[];
};

const thStyle = { padding: '0.5rem' } as const;
const thRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tdStyle = { padding: '0.5rem' } as const;
const tdRightStyle = { padding: '0.5rem', textAlign: 'right' as const };
const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, margin: '1rem 0', fontSize: '0.92rem' };
const headRowStyle = { borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const };
const rowStyle = { borderBottom: '1px solid #eee' };

export default function WeekendItinerary({ townName, slug, climate, highlights }: Props) {
  const museums = highlights
    .filter(h => h.type === 'Museum' && h.distMiles <= 15)
    .slice(0, 8);
  const stateParks = highlights
    .filter(h => h.type === 'State Park')
    .slice(0, 6);
  const viewpoints = highlights
    .filter(h => h.type === 'Viewpoint' && h.distMiles <= 35)
    .slice(0, 6);
  const skiAreas = highlights
    .filter(h => h.type === 'Ski Area')
    .slice(0, 4);
  const summerClimate = climate?.find(m => m.month === 'Jul');
  const winterClimate = climate?.find(m => m.month === 'Jan');

  return (
    <article className="content-section">
      <p>
        A weekend in {townName} puts you at one of the most historically
        significant spots in the American West{'\u2014'}the birthplace of the Missouri
        River. Here, the Jefferson, Madison, and Gallatin rivers converge to form
        the mighty Missouri, a confluence that Meriwether Lewis named on July 27,
        1805, in honor of President Thomas Jefferson, Secretary of State James
        Madison, and Treasury Secretary Albert Gallatin. Sacagawea was captured
        near this very spot by a Hidatsa raiding party around 1800, only to return
        five years later as an indispensable member of the Lewis {'\u0026'} Clark
        Expedition. Today {townName} is a small Gallatin County community of about
        1,989 people at 4,075 feet, sitting 31 miles west of Bozeman with three
        state parks, a restored 1910 luxury hotel, blue-ribbon fishing, and
        underground caverns all within a short drive. This two-day itinerary
        covers the essentials. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is the prime window for {townName}.
        Summer opens up Missouri Headwaters State Park for hiking, Lewis {'\u0026'} Clark
        Caverns for guided cave tours (May through September), and the Jefferson,
        Madison, and Gallatin rivers for blue-ribbon trout fishing. The Madison
        Buffalo Jump interpretive trail is accessible, and Norris Hot Springs hosts
        live acoustic music on weekend evenings.
      </p>
      <p>
        July and August are the warmest months{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}{' '}
        {'\u2014'} ideal for river floating, fishing, and exploring the headwaters.
        The Three Forks NRA Rodeo in mid-July draws crowds from across the region.
        September brings golden cottonwoods along the river bottoms, thinner crowds,
        and excellent fall fishing. Winter transforms the area into a quieter
        landscape with ice fishing, cross-country skiing, and easy access to
        Bridger Bowl ski area via Bozeman.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}September for cave tours, fishing, and state parks; December{'\u2013'}March for skiing and ice fishing</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F</li>}
        <li><strong>Getting here:</strong> Drive I-90 to Exit 274 from Bozeman (31 miles) or Butte (64 miles); nearest airport is Bozeman Yellowstone International (BZN), 35 miles east</li>
        <li><strong>Getting around:</strong> Car essential; state parks and attractions are spread 4{'\u2013'}24 miles from town</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Missouri Headwaters State Park 4 mi, Madison Buffalo Jump 15 mi, Lewis {'\u0026'} Clark Caverns 16 mi, Norris Hot Springs 24 mi, Bozeman 31 mi</li>
      </ul>

      <h2>Day 1: Headwaters &amp; History</h2>

      <h3>Morning: Missouri Headwaters State Park</h3>
      <p>
        Start early with a drive 4 miles northeast to{' '}
        <strong>Missouri Headwaters State Park</strong>, a U.S. National Historic
        Landmark where the Jefferson, Madison, and Gallatin rivers merge to create
        the Missouri River. Walk the interpretive trails along the riverbanks and
        read the Lewis {'\u0026'} Clark displays that mark the explorers{'\u2019'} July 1805
        campsite. Stand at the exact confluence point where three rivers become
        one{'\u2014'}the birthplace of a waterway that flows 2,341 miles to the
        Mississippi. The park is a birding hotspot with osprey, bald eagles, and
        great blue herons along the water. In summer, the morning light on the
        rivers against the surrounding Bridger and Tobacco Root ranges is
        spectacular. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        trail details.
      </p>

      <h3>Midday: Downtown {townName}</h3>
      <p>
        Return to town for lunch at the historic{' '}
        <strong>Sacajawea Hotel</strong>{'\u2014'}a beautifully restored 1910 railroad
        hotel that anchors downtown {townName}. The hotel{'\u2019'}s restaurant serves
        upscale Montana fare, and the lobby retains its original character with
        period furnishings and local history on display. After lunch, walk a block
        to the <strong>Headwaters Heritage Museum</strong> for exhibits on Lewis
        {'\u0026'} Clark, the fur trade era, railroad history, and the town{'\u2019'}s founding.
        Downtown {townName} is compact and walkable{'\u2014'}browse the shops and
        take in the small-town character before heading out for the afternoon.
      </p>

      <h3>Afternoon: Madison Buffalo Jump State Park</h3>
      <p>
        Drive 15 miles south to <strong>Madison Buffalo Jump State Park</strong>,
        one of the most significant archaeological sites in Montana. For thousands
        of years, Native American hunters drove bison herds over these cliffs in
        a highly organized communal hunting technique. Walk the interpretive trail
        along the base of the jump and up to the clifftop for panoramic views of
        the Madison River valley and the surrounding mountain ranges. The site is
        remarkably well-preserved, and interpretive signs explain the hunting
        process, the archaeology, and the importance of bison to Plains tribes.
        The open grassland and big-sky views make this a memorable afternoon stop.
      </p>

      <h3>Evening: Sacajawea Hotel</h3>
      <p>
        Return to {townName} for dinner at the <strong>Sacajawea Hotel{'\u2019'}s
        dining room</strong>, where the menu features locally sourced steaks, fish,
        and seasonal dishes in an elegant historic setting. After dinner, settle
        into the hotel{'\u2019'}s bar{'\u2014'}the Sac Bar{'\u2014'}for cocktails in a space
        that has been gathering locals and travelers since the railroad era. On
        warm evenings, step outside to enjoy the quiet streets of a Montana town
        that still feels rooted in its frontier origins.
      </p>

      <h2>Day 2: Caverns, Rivers &amp; Hot Springs</h2>

      <h3>Morning: Lewis &amp; Clark Caverns State Park</h3>
      <p>
        Drive 16 miles west to <strong>Lewis {'\u0026'} Clark Caverns State Park</strong>,
        Montana{'\u2019'}s first state park and home to one of the largest known
        limestone cavern systems in the Northwest. Join a guided cave tour that
        descends through spectacular formations{'\u2014'}stalactites, stalagmites,
        columns, and flowstone created over millions of years. The cave
        maintains a constant 50{'\u00B0'}F year-round, so bring a jacket regardless of
        outside temperatures. Tours run from May through September and involve
        moderate walking with some stooping and stairways. Above ground, the park
        offers hiking trails with views across the Jefferson River canyon.
      </p>

      <h3>Midday: Picnic or Downtown Lunch</h3>
      <p>
        Pack a picnic and enjoy it at the caverns{'\u2019'} shaded picnic area
        overlooking the Jefferson River valley, or drive back to {townName} for
        lunch at a local restaurant. The return drive along the Jefferson River
        is scenic and short{'\u2014'}you{'\u2019'}ll be back in town in about 20 minutes.
      </p>

      <h3>Afternoon: River Time</h3>
      <p>
        Spend the afternoon on the water. The <strong>Jefferson</strong> and{' '}
        <strong>Madison</strong> rivers near {townName} offer blue-ribbon trout
        fishing for brown and rainbow trout{'\u2014'}wade in at public access points
        or arrange a guided float trip. For a more relaxed experience, kayak or
        canoe near the confluence at Missouri Headwaters State Park, where the
        rivers are broad and gentle. The <strong>Three Forks Ponds</strong> in
        town provide a family-friendly option with swimming, picnicking, and
        volleyball courts. See
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details, access points, and seasonal hatches.
      </p>

      <h3>Evening: Norris Hot Springs</h3>
      <p>
        Cap the weekend with a 24-mile drive south to{' '}
        <strong>Norris Hot Springs</strong>{'\u2014'}a natural hot spring pool fed by
        water that surfaces at over 120{'\u00B0'}F and is cooled to comfortable soaking
        temperatures in a wooden pool open to the big Montana sky. On Friday,
        Saturday, and Sunday evenings, local and touring musicians play live
        acoustic sets poolside{'\u2014'}soaking under the stars with live music is one
        of the most uniquely Montana experiences in the region. A small on-site
        kitchen serves organic food and local beer. The drive back to {townName}{' '}
        on a clear night offers stargazing opportunities that remind you just
        how far you are from city lights.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a quieter but rewarding winter weekend destination.{' '}
        <strong>Bridger Bowl</strong> ski area (accessible via Bozeman, about 50
        miles) offers expert and intermediate terrain with legendary cold-smoke
        powder and affordable lift tickets. <strong>Big Sky Resort</strong>{' '}
        (60 miles south) provides a world-class alternative with extensive terrain
        and vertical drop.
      </p>
      <p>
        Closer to town, the Jefferson and Madison rivers offer excellent{' '}
        <strong>winter fly fishing</strong> for hardy anglers{'\u2014'}midges and
        blue-winged olives hatch even on mild winter days. Cross-country skiing
        and snowshoeing are available along river trails and at Missouri
        Headwaters State Park when snow cover allows.
      </p>
      <p>
        <strong>Bozeman Hot Springs</strong> (31 miles east) provides year-round
        soaking with indoor and outdoor pools, and Norris Hot Springs remains
        open in winter for a steaming soak under snowy skies. Back in{' '}
        {townName}, the Sacajawea Hotel offers warm lodging with its restaurant
        and bar providing cozy indoor escapes{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 4,075 feet in the broad valley where three rivers
            converge, with a semi-arid continental climate. Summers are warm and
            sunny with cool evenings; winters are cold with moderate snowfall.
            The valley{'\u2019'}s open geography means wind and temperature swings
            are common{'\u2014'}pack layers year-round.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Month</th>
                <th style={thRightStyle}>Avg High ({'\u00B0'}F)</th>
                <th style={thRightStyle}>Avg Low ({'\u00B0'}F)</th>
              </tr>
            </thead>
            <tbody>
              {climate.map(c => (
                <tr key={c.month} style={rowStyle}>
                  <td style={tdStyle}>{c.month}</td>
                  <td style={tdRightStyle}>{c.avgHigh}{'\u00B0'}</td>
                  <td style={tdRightStyle}>{c.avgLow}{'\u00B0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>What to Pack</h2>
      <ul>
        <li><strong>Layers:</strong> {townName}{'\u2019'}s 4,075-foot elevation means warm afternoons and cool mornings in summer, with caves running a constant 50{'\u00B0'}F{'\u2014'}bring a fleece and light jacket even in July</li>
        <li><strong>Swimsuit:</strong> Essential for Norris Hot Springs, Three Forks Ponds, and river floating</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for state park trails and the caverns tour (uneven surfaces underground)</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the {townName} area is grizzly and black bear country, particularly near river corridors</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}UV exposure increases at elevation and on open water</li>
        <li><strong>Fishing gear:</strong> Rod, waders, and flies for blue-ribbon trout water on the Jefferson, Madison, and Gallatin rivers</li>
        <li><strong>Cave jacket:</strong> A warm layer for the 50{'\u00B0'}F caverns, even on hot summer days</li>
        <li><strong>Winter additions:</strong> Ski gear for Bridger Bowl, warm base layers, and insulated boots for winter fishing</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area offer museums and historic sites
            rooted in the Lewis {'\u0026'} Clark expedition, railroad heritage, and
            the region{'\u2019'}s deep Native American history:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Museum</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {museums.map(m => (
                <tr key={m.name} style={rowStyle}>
                  <td style={tdStyle}>{m.name}</td>
                  <td style={tdRightStyle}>{m.distMiles === 0 ? 'In town' : `${m.distMiles} mi`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(stateParks.length > 0 || viewpoints.length > 0 || skiAreas.length > 0) && (
        <>
          <h2>Highlights &amp; Nearby Attractions</h2>
          {stateParks.length > 0 && (
            <>
              <h3>State Parks</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>State Park</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {stateParks.map(p => (
                    <tr key={p.name} style={rowStyle}>
                      <td style={tdStyle}>{p.name}</td>
                      <td style={tdRightStyle}>{p.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {viewpoints.length > 0 && (
            <>
              <h3>Viewpoints</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Viewpoint</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewpoints.map(v => (
                    <tr key={v.name} style={rowStyle}>
                      <td style={tdStyle}>{v.name}</td>
                      <td style={tdRightStyle}>{v.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {skiAreas.length > 0 && (
            <>
              <h3>Ski Areas</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Ski Area</th>
                    <th style={thRightStyle}>Distance from {townName}</th>
                  </tr>
                </thead>
                <tbody>
                  {skiAreas.map(s => (
                    <tr key={s.name} style={rowStyle}>
                      <td style={tdStyle}>{s.name}</td>
                      <td style={tdRightStyle}>{s.distMiles} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      <h2>Where to Stay</h2>
      <p>
        The <strong>Sacajawea Hotel</strong> is the premier lodging option in{' '}
        {townName}{'\u2014'}this restored 1910 railroad hotel offers boutique rooms,
        fine dining, and a historic bar in the heart of downtown. It{'\u2019'}s the
        kind of small-town luxury hotel that{'\u2019'}s increasingly rare in Montana.
        Beyond the Sacajawea, {townName} has motels, vacation rentals, and
        campgrounds{'\u2014'}including tipi rentals at Missouri Headwaters State Park
        for a more immersive experience. Rates are well below what you{'\u2019'}d pay
        in nearby Bozeman or Big Sky.
      </p>
      <p>
        Bozeman (31 miles east on I-90) provides extensive hotel, restaurant,
        and nightlife options if you want a broader range of amenities. Many
        visitors use {townName} as a quieter base for exploring the region while
        making day trips to Bozeman for dining and shopping.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and state park routes near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For river fishing details, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
