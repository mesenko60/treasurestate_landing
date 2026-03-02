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
        A weekend in {townName} drops you at the edge of one of America{'\u2019'}s
        most dramatic landscapes{'\u2014'}the Rocky Mountain Front, where the Northern
        Rockies rise abruptly from the Great Plains with no foothills in between.
        Named for French fur merchant Pierre Chouteau Jr., this Teton County seat
        of 1,721 sits at 3,816 feet with the Bob Marshall Wilderness (over one
        million acres of protected backcountry) rising to the west and vast
        prairie stretching east. {townName} is also ground zero for some of the
        most important dinosaur discoveries in paleontology{'\u2014'}Jack Horner{'\u2019'}s
        1970s discovery of Maiasaura nesting sites at nearby Egg Mountain
        rewrote our understanding of dinosaur behavior. Add world-class bird
        migration at Freezout Lake, uncrowded mountain hiking, and genuine
        small-town Montana hospitality, and you have a weekend unlike anything
        else in the state. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Best Time to Visit</h2>
      <p>
        <strong>Late March</strong> is the signature season for {townName}{'\u2014'}the
        spring snow goose and tundra swan migration at Freezout Lake brings
        hundreds of thousands of birds through the area in one of North
        America{'\u2019'}s great wildlife spectacles. If you can time your visit for
        that window, do it.
      </p>
      <p>
        <strong>June through August</strong> opens up hiking along the Rocky
        Mountain Front, dinosaur dig programs at the Montana Dinosaur Center in
        Bynum, fishing on the Teton River, and long summer evenings with views of
        the Front{summerClimate ? ` \u2014 highs around ${summerClimate.avgHigh}\u00B0F with lows near ${summerClimate.avgLow}\u00B0F` : ''}.
        September and October bring fall bird migration, golden cottonwoods along
        the river, and hunting season across the Front. Winter is quiet but
        rewarding{'\u2014'}Teton Pass Ski Area (16 miles west) offers community skiing,
        and the Front Range landscape under snow is stark and beautiful.
      </p>

      <h2>Quick Trip Facts</h2>
      <ul>
        <li><strong>Best months:</strong> Late March for snow goose migration; June{'\u2013'}August for hiking, dinosaur digs, and fishing; September{'\u2013'}October for fall migration and hunting</li>
        {summerClimate && <li><strong>Summer weather:</strong> Highs around {summerClimate.avgHigh}{'\u00B0'}F, lows near {summerClimate.avgLow}{'\u00B0'}F</li>}
        {winterClimate && <li><strong>Winter weather:</strong> Highs around {winterClimate.avgHigh}{'\u00B0'}F, lows near {winterClimate.avgLow}{'\u00B0'}F with significant wind chill along the Front</li>}
        <li><strong>Getting here:</strong> US-89 from Great Falls (60 miles south); {townName} sits between Glacier and Yellowstone on the US-89 corridor</li>
        <li><strong>Getting around:</strong> Car essential; attractions range from in-town to 28 miles into the mountains</li>
        <li><strong>Budget tip:</strong> Montana has no sales tax; {townName} lodging and dining are well below resort-town prices</li>
        <li><strong>Key distances:</strong> Freezout Lake WMA 10 mi, Bynum/Montana Dinosaur Center 13 mi, Teton Pass Ski Area 16 mi, Ear Mountain WMA 22 mi, Blackleaf Canyon 25 mi, Great Falls 60 mi</li>
      </ul>

      <h2>Day 1: Dinosaurs &amp; Birds</h2>

      <h3>Morning: Old Trail Museum</h3>
      <p>
        Start your weekend just a mile from downtown at the{' '}
        <strong>Old Trail Museum</strong>, a small but rich regional museum that
        punches well above its weight. The star exhibit is the{' '}
        <strong>Maiasaura</strong>{'\u2014'}Montana{'\u2019'}s official state fossil, first
        discovered at nearby Egg Mountain by paleontologist Jack Horner in the
        1970s. That discovery proved dinosaurs cared for their young, reshaping
        paleontology. Beyond the fossils, the museum covers Blackfeet and
        M{'\u00E9'}tis history, Rocky Mountain Front geology, and the homesteading era
        that shaped {townName}. It{'\u2019'}s a perfect orientation to everything you
        {'\u2019'}ll see over the weekend.
      </p>

      <h3>Midday: Montana Dinosaur Center</h3>
      <p>
        Drive 13 miles north to the tiny town of <strong>Bynum</strong> and the{' '}
        <strong>Montana Dinosaur Center</strong>, home to the world{'\u2019'}s longest
        dinosaur{'\u2014'}a massive diplodocus skeleton that stretches the length of
        the building. The center offers guided fossil dig programs in summer
        where you can work alongside paleontologists at active excavation sites
        in the surrounding badlands. Even without a dig, the museum{'\u2019'}s
        collection of hadrosaur, ceratopsian, and sauropod specimens from the
        Two Medicine Formation is world-class. This stretch of north-central
        Montana is one of the richest dinosaur fossil regions on Earth.
      </p>

      <h3>Afternoon: Freezout Lake WMA</h3>
      <p>
        Head 10 miles south to <strong>Freezout Lake Wildlife Management
        Area</strong>, one of Montana{'\u2019'}s premier birding destinations with over
        230 documented species. Walk the dikes and scan the wetlands for
        waterfowl, shorebirds, raptors, and songbirds. In{' '}
        <strong>late March</strong>, this is the site of one of North America
        {'\u2019'}s most spectacular wildlife events{'\u2014'}hundreds of thousands of snow
        geese and tundra swans stop here during their northward migration,
        filling the sky and covering the lake in white. Fall migration
        (September{'\u2013'}October) brings a second wave. Even outside migration
        windows, the WMA{'\u2019'}s mix of open water, marsh, and grassland supports
        excellent year-round birding against the backdrop of the Rocky Mountain
        Front.
      </p>

      <h3>Evening: Downtown {townName}</h3>
      <p>
        Return to {townName} for dinner at one of the local restaurants in the
        compact, walkable downtown. The dining scene is unpretentious and
        locally focused{'\u2014'}expect hearty Montana fare. After dinner, stroll the
        charming main street. On clear evenings, the Rocky Mountain Front
        glows in alpenglow to the west{'\u2014'}a view that defines this town.
      </p>

      <h2>Day 2: Rocky Mountain Front</h2>

      <h3>Morning: Ear Mountain or Blackleaf Canyon</h3>
      <p>
        Day two takes you into the <strong>Rocky Mountain Front</strong>{'\u2014'}the
        dramatic geological boundary where the Northern Rockies erupt from the
        plains. Drive 22 miles west to <strong>Ear Mountain WMA</strong> for a
        day hike with panoramic views of where the Rockies meet the Great
        Plains{'\u2014'}on a clear day the view stretches from the Chinese Wall deep
        in the Bob Marshall Wilderness to the plains beyond Great Falls.
        Alternatively, drive 25 miles to <strong>Blackleaf Canyon</strong>, a
        striking limestone canyon that serves as a nesting site for golden
        eagles. The canyon walls rise sharply from the prairie floor, and the
        drive in passes through some of the most dramatic geology in Montana.
        See our <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> for
        trail details, difficulty ratings, and seasonal access information.
      </p>

      <h3>Midday: Mountain Picnic or Town Lunch</h3>
      <p>
        Pack a picnic lunch and eat with mountain views{'\u2014'}there are few better
        lunch spots in Montana than the meadows at the base of the Front. If you
        prefer a sit-down meal, return to {townName} for lunch at one of the
        downtown cafes. The drive back from the Front is beautiful in its own
        right, with the mountains receding behind you and the plains opening up
        ahead.
      </p>

      <h3>Afternoon: Teton River or Golf</h3>
      <p>
        Spend the afternoon on the <strong>Teton River</strong>, which flows
        through the {townName} area and offers good fishing for rainbow and
        brown trout in a cottonwood-lined prairie setting. For a more relaxed
        pace, play a round at the <strong>Choteau Country Club</strong> golf
        course, just a mile from downtown, with views of the Rocky Mountain
        Front from every hole. For deeper wilderness access, drive toward the
        South Fork of the Teton for trout fishing closer to the mountains. See
        our <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> for
        species details and access points.
      </p>

      <h3>Evening: Sunset on the Front</h3>
      <p>
        End your weekend with sunset views of the Rocky Mountain Front from
        town{'\u2014'}the way the last light catches the limestone reefs and
        escarpments is one of Montana{'\u2019'}s most underrated sights. Dinner at
        the <strong>Stage Stop Inn</strong>, {townName}{'\u2019'}s main hotel with
        77 rooms, or one of the downtown restaurants caps off a weekend that
        covered 75 million years of dinosaur history, world-class bird
        migration, and the raw geological drama of the Rocky Mountain Front.
      </p>

      <h2>Winter Alternative</h2>
      <p>
        {townName} makes a compelling winter weekend with a different character.{' '}
        <strong>Teton Pass Ski Area</strong> (16 miles west) is a true community
        ski hill{'\u2014'}affordable lift tickets, uncrowded runs, and the kind of
        local atmosphere that{'\u2019'}s increasingly rare in ski country. The area
        also offers cross-country skiing and snowmobiling along the Front.
      </p>
      <p>
        Winter wildlife viewing is excellent{'\u2014'}elk herds move to lower
        elevations along the Front, and the short days concentrate animal
        activity. The Old Trail Museum stays open for winter visitors, and
        {townName}{'\u2019'}s downtown restaurants provide warm escapes from the
        cold{winterClimate ? ` \u2014 expect highs around ${winterClimate.avgHigh}\u00B0F and lows near ${winterClimate.avgLow}\u00B0F in January` : ''}.
        The Rocky Mountain Front under fresh snow, with its stark limestone
        walls and wind-sculpted drifts, is a landscape photographer{'\u2019'}s dream.
      </p>

      <h2>Seasonal Tips</h2>
      <ul>
        <li><strong>Late March:</strong> THE event{'\u2014'}spring snow goose and tundra swan migration at Freezout Lake; plan your trip around this if possible</li>
        <li><strong>June{'\u2013'}August:</strong> Prime for hiking the Front, dinosaur dig programs at Montana Dinosaur Center, fishing, and golf</li>
        <li><strong>September{'\u2013'}October:</strong> Fall bird migration, hunting season, golden cottonwoods along the Teton River</li>
        <li><strong>December{'\u2013'}March:</strong> Teton Pass skiing, cross-country skiing, snowmobiling, winter wildlife viewing</li>
        <li><strong>Bear country:</strong> The Rocky Mountain Front is grizzly bear habitat{'\u2014'}carry bear spray on every hike and store food properly</li>
        <li><strong>Weather warning:</strong> Front Range weather changes fast; pack layers regardless of season and check conditions before mountain hikes</li>
      </ul>

      {climate && climate.length > 0 && (
        <>
          <h2>Monthly Climate</h2>
          <p>
            {townName} sits at 3,816 feet where the Great Plains meet the Rocky
            Mountain Front. The exposed position means wind is a near-constant
            companion, especially in winter and spring. Summers are warm and
            pleasant with cool evenings; winters are cold with chinook winds that
            can bring dramatic temperature swings{'\u2014'}a 40{'\u00B0'}F rise in a few hours
            is not unusual along the Front.
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
        <li><strong>Layers:</strong> {townName}{'\u2019'}s position along the Rocky Mountain Front means weather changes fast{'\u2014'}bring a fleece, windbreaker, and warm base layers even in summer</li>
        <li><strong>Binoculars:</strong> Essential for birding at Freezout Lake, spotting golden eagles at Blackleaf Canyon, and scanning for wildlife along the Front</li>
        <li><strong>Hiking boots:</strong> Sturdy footwear for Ear Mountain, Blackleaf Canyon, and any Front Range trails</li>
        <li><strong>Bear spray:</strong> Carry on every hike{'\u2014'}the Rocky Mountain Front is prime grizzly and black bear habitat</li>
        <li><strong>Sun protection:</strong> Sunscreen, sunglasses, and a hat{'\u2014'}the open plains and mountain trails offer little shade</li>
        <li><strong>Camera with telephoto lens:</strong> The snow goose migration, golden eagles, and mountain scenery reward long-range photography</li>
        <li><strong>Fishing gear:</strong> Rod and waders for the Teton River; Montana fishing license required</li>
        <li><strong>Winter additions:</strong> Ski gear for Teton Pass, insulated boots, wind-resistant outer layers{'\u2014'}wind chill along the Front is significant</li>
      </ul>

      {museums.length > 0 && (
        <>
          <h2>Museums &amp; Cultural Sites</h2>
          <p>
            {townName} and the surrounding area are a paleontology hotspot with
            museums that reflect the region{'\u2019'}s extraordinary fossil record and
            frontier history:
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
        {townName}{'\u2019'}s main accommodation is the <strong>Stage Stop
        Inn</strong> with 77 rooms{'\u2014'}it{'\u2019'}s the largest hotel in town and a
        reliable base for exploring the area. Additional options include
        smaller motels, vacation rentals, and guest ranches along the Rocky
        Mountain Front. Rates are well below what you{'\u2019'}d pay in resort
        areas{'\u2014'}{townName} is a working ranching community, not a tourist
        destination, and prices reflect that.
      </p>
      <p>
        Great Falls (60 miles south on US-89) provides additional hotel options,
        restaurants, and the Lewis and Clark Interpretive Center if you want to
        extend your trip. Many visitors use {townName} as a base for exploring
        the Rocky Mountain Front and the Bob Marshall Wilderness, or as a stop
        on the US-89 corridor between Glacier and Yellowstone.
      </p>
      <p>
        For detailed housing and cost information, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link> and
        the <Link href={`/montana-towns/${slug}/housing/`}>housing market guide</Link>.
      </p>

      <p>
        For more on trails and backcountry access near {townName}, see
        the <Link href={`/montana-towns/${slug}/hiking/`}>{townName} hiking guide</Link>.
        For river and lake fishing, see
        the <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link>.
      </p>
    </article>
  );
}
