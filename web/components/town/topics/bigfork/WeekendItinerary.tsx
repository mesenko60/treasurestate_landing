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
  const galleries = highlights
    .filter(h => h.type === 'Gallery' && h.distMiles <= 15)
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
        A weekend in {townName} immerses you in Montana{'\u2019'}s art-town charm,
        the crystal waters of Flathead Lake, and rugged mountain wilderness just
        minutes from a walkable downtown. Known as the {'\u201C'}Village by the Bay,{'\u201D'}{' '}
        {townName} sits at 2,940 feet on the northeast shore of Flathead Lake
        where the Swan River meets the largest natural freshwater lake west of
        the Mississippi. The town{'\u2019'}s population of roughly 5,000 means you{'\u2019'}ll
        find genuine Montana hospitality, 20-plus art galleries lining Electric
        Avenue, a legendary summer playhouse, and alpine wilderness{'\u2014'}all without
        resort-town crowds. This two-day itinerary covers the essentials. For
        the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>June through September</strong> is the prime window for {townName}.
        Summer opens up Flathead Lake for kayaking, paddleboarding, and boat tours,
        Jewel Basin for alpine hiking, and the Bigfork Summer Playhouse for live
        theater. Electric Avenue buzzes with gallery walks, the weekly farmers
        market runs May through October, and Flathead cherries ripen along the
        east-shore orchards in July.
      </p>
      <p>
        July and August are the warmest months{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}{' '}
        {'\u2014'} ideal for lake days, gallery strolls, and alpine hikes. September
        brings golden larch season in Jewel Basin, thinner crowds, and crisp fall
        air. The Festival of the Arts in August and the Whitewater Festival in late
        May bookend the summer season.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> June{'\u2013'}September for lake recreation, hiking, and theater; December{'\u2013'}March for skiing and cozy gallery walks</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F with mountain snow at higher elevations</li>}
        <li><strong>Getting here:</strong> Drive US-35 along Flathead Lake{'\u2019'}s east shore from Polson (30 mi) or MT-83 from Kalispell (17 mi); nearest airport is Glacier Park International (FCA) in Kalispell</li>
        <li><strong>Getting around:</strong> Walkable downtown; car needed for Jewel Basin, Echo Lake, and Glacier National Park day trips</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} dining and lodging are affordable compared to nearby Whitefish</li>
        <li><strong>Key distances:</strong> Wayfarers State Park 2 mi, Echo Lake 3 mi, Jewel Basin 10 mi, Whitefish Mountain Resort 25 mi, Glacier National Park 45 mi</li>
      </ul>

      <h2>Day 1: Village, Lake &amp; Arts</h2>

      <h3>Morning: Electric Avenue &amp; Downtown</h3>
      <p>
        Start your weekend on <strong>Electric Avenue</strong>, {townName}{'\u2019'}s
        walkable main street packed with more than 20 art galleries, boutique
        shops, and inviting cafes. Grab a coffee at a local roaster and take
        your time browsing{'\u2014'}the galleries range from contemporary Western art
        and bronze sculpture to photography, pottery, and jewelry from Montana
        artisans. {townName} was named one of the {'\u201C'}100 Best Small Art Towns
        in the Nation,{'\u201D'} and Electric Avenue is why. Between galleries, duck
        into the independent bookshops and gift stores that give the village
        its character.
      </p>

      <h3>Midday: Flathead Lake Adventure</h3>
      <p>
        Head to <strong>Wayfarers State Park</strong> (2 miles south) to launch
        a kayak or stand-up paddleboard on Flathead Lake{'\u2014'}the largest natural
        freshwater lake west of the Mississippi, with water so clear you can
        see the bottom in 30 feet. For a bigger adventure, book a boat tour to{' '}
        <strong>Wild Horse Island State Park</strong>, accessible only by water,
        where wild horses, bighorn sheep, mule deer, and bald eagles roam
        2,163 acres of island wilderness. Whether you paddle, sail, or cruise,
        the lake{'\u2019'}s mountain-ringed setting is unforgettable.
      </p>

      <h3>Afternoon: Cherry Orchards &amp; Echo Lake</h3>
      <p>
        Drive the east-shore road south of {townName} through the famous{' '}
        <strong>Flathead cherry orchards</strong>{'\u2014'}in July, roadside stands sell
        the region{'\u2019'}s prized Rainier, Bing, and Lambert cherries straight from
        the trees. Continue to <strong>Echo Lake</strong> (3 miles east), a
        family-friendly swimming and fishing spot surrounded by forest with
        views of the Swan Range. The warm, shallow waters make it ideal for
        an afternoon dip and picnic.
      </p>

      <h3>Evening: Dinner &amp; the Playhouse</h3>
      <p>
        Return to downtown for dinner at one of {townName}{'\u2019'}s restaurants{'\u2014'}the
        dining scene ranges from upscale lakeside fare to casual pubs and a local
        brewery. In summer, cap the evening with a show at the{' '}
        <strong>Bigfork Summer Playhouse</strong>, known as {'\u201C'}Broadway in the
        Rockies{'\u201D'} since 1960{'\u2014'}the productions rival big-city theater in a
        300-seat intimate venue. Off-season, settle in at the brewery or a
        wine bar for a relaxed evening.
      </p>

      <h2>Day 2: Mountains &amp; Nature</h2>

      <h3>Morning: Jewel Basin Hike</h3>
      <p>
        Drive 10 miles east to the <strong>Jewel Basin Hiking Area</strong>,
        a designated hiking-only wilderness with over 35 miles of trails and
        27 alpine lakes scattered through the Swan Range. The{' '}
        <strong>Alpine Trail to Black Lake or Birch Lake</strong> rewards with
        stunning mountain scenery, wildflower meadows, and turquoise alpine
        water{'\u2014'}moderate difficulty, roughly 4{'\u2013'}6 miles round trip depending on
        your route. Start early to enjoy the cool morning air and the best
        chance of spotting mountain goats and deer along the trail. See
        our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        more trail options and difficulty details.
      </p>

      <h3>Midday: Trailside Lunch &amp; Alpine Lakes</h3>
      <p>
        Pack a lunch and enjoy it at one of Jewel Basin{'\u2019'}s alpine lakes{'\u2014'}sitting
        on a granite slab above a glacial lake with the Swan Range peaks all
        around you is as good as backcountry dining gets. The area{'\u2019'}s
        no-motorized-vehicle policy means it stays quiet even on summer
        weekends. Refill water bottles from clear mountain streams (filter
        first) and savor the solitude before heading back down.
      </p>

      <h3>Afternoon: Swan River &amp; Farmers Market</h3>
      <p>
        Return to {townName} and walk the <strong>Swan River Nature Trail</strong>,
        which follows the river through town with views of the famous Wild Mile
        whitewater section{'\u2014'}in late May, kayakers and rafters compete in the
        annual Whitewater Festival here. If it{'\u2019'}s a market day (May{'\u2013'}October),
        stop by the <strong>weekly farmers market</strong> for local produce,
        baked goods, and artisan crafts. Browse any galleries you missed on
        Day 1 or rent a bike and ride the lakeshore roads.
      </p>

      <h3>Evening: Sunset over Flathead Lake</h3>
      <p>
        End your weekend with sunset over Flathead Lake from{' '}
        <strong>Wayfarers State Park</strong> or a lakeside restaurant. The
        evening light turns the Mission Mountains gold and the lake to glass{'\u2014'}it{'\u2019'}s
        the signature {townName} moment. Grab a final dinner downtown and reflect
        on a weekend that covered Montana{'\u2019'}s finest art town, one of the West{'\u2019'}s
        great lakes, and alpine wilderness that few visitors ever discover.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling off-season weekend with a quieter but
        equally rewarding set of experiences. <strong>Whitefish Mountain
        Resort</strong> (25 miles northwest) offers over 3,000 acres of skiable
        terrain, 105 runs, and legendary powder{'\u2014'}one of the top ski destinations
        in the Northern Rockies, with none of the lift-line waits you{'\u2019'}d find
        at Colorado mega-resorts.
      </p>
      <p>
        Closer to town, the <strong>Swan River trails</strong> are ideal for
        cross-country skiing and snowshoeing, and <strong>Echo Lake</strong>{' '}
        freezes over for ice fishing. {townName}{'\u2019'}s downtown galleries stay open
        year-round, and the annual <strong>Christmas Stroll</strong> in December
        transforms Electric Avenue into a holiday village with lights, music,
        and local artisan markets.
      </p>
      <p>
        Winter dining in {townName} is cozy and unhurried{'\u2014'}restaurants, the
        brewery, and wine bars offer warm refuges from the cold{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
        With Glacier National Park{'\u2019'}s Going-to-the-Sun Road closed for winter,
        the west-side trails near {townName} offer snowshoe access to
        frozen waterfalls and snow-draped forests.
      </p>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 2,940 feet on the northeast shore of Flathead
            Lake, which moderates temperatures compared to higher-elevation
            Montana towns. Summers are warm and sunny with cool lake breezes;
            winters are cold but milder than the state{'\u2019'}s interior valleys.
            The lake effect keeps {townName} a few degrees warmer in winter
            and cooler in summer than nearby mountain towns{'\u2014'}pack layers
            year-round.
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
        <li><strong>Layers:</strong> {townName}{'\u2019'}s 2,940-foot lakeside elevation means pleasant summer days but cool mornings on the water and noticeably colder temperatures at Jewel Basin{'\u2019'}s alpine elevations{'\u2014'}bring a fleece and light jacket even in July</li>
        <li><strong>Swimsuit:</strong> Essential for Flathead Lake, Echo Lake, and summer paddling</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Jewel Basin{'\u2019'}s rocky alpine trails and Swan River paths</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the {townName} area borders grizzly and black bear country, particularly in Jewel Basin and near Glacier National Park</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}long summer days on the lake and alpine trails mean extended UV exposure</li>
        <li><strong>Binoculars:</strong> Wild horses on Wild Horse Island, eagles along Flathead Lake, and mountain goats in Jewel Basin reward a closer look</li>
        <li><strong>Paddling gear:</strong> Water shoes and a dry bag if you plan to kayak or paddleboard; rentals are available in town and at Wayfarers State Park</li>
        <li><strong>Winter additions:</strong> Ski gear for Whitefish Mountain, cross-country skis or snowshoes for Swan River trails, warm base layers, and insulated boots for ice fishing at Echo Lake</li>
      </ul>

      {galleries.length > 0 && (
        <>
          <h2>Galleries &amp; Cultural Sites</h2>
          <p>
            {townName}{'\u2019'}s reputation as one of America{'\u2019'}s best small art towns
            is built on a remarkable concentration of galleries and cultural
            venues along Electric Avenue and the surrounding blocks:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr style={headRowStyle}>
                <th style={thStyle}>Gallery</th>
                <th style={thRightStyle}>Distance from {townName}</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map(g => (
                <tr key={g.name} style={rowStyle}>
                  <td style={tdStyle}>{g.name}</td>
                  <td style={tdRightStyle}>{g.distMiles === 0 ? 'In town' : `${g.distMiles} mi`}</td>
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
        {townName} offers a range of lodging from lakeside vacation rentals and
        cozy bed-and-breakfasts in historic homes to modern cabin resorts and
        campgrounds. Staying in the village puts you within walking distance of
        Electric Avenue{'\u2019'}s galleries, restaurants, and the Playhouse.{' '}
        <strong>Wayfarers State Park</strong> (2 miles south) offers lakeside
        campsites for those who prefer to sleep near the water.
      </p>
      <p>
        <strong>Eagle Bend Golf Club</strong> (1 mile from downtown) anchors
        a resort area with rental homes and condos{'\u2014'}a good option for golfers
        or families wanting more space. For additional hotel options and
        nightlife, Kalispell (17 miles west) and Whitefish (25 miles northwest)
        provide full-service resort towns with easy access back to {townName}.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails, alpine lakes, and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For lake and stream fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
