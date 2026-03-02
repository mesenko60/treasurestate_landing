import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  trails: RecPlace[];
  wilderness: RecPlace[];
  stateParks: RecPlace[];
};

export default function Hiking({ townName, slug, trails, wilderness, stateParks }: Props) {
  const urban = trails.filter(t => t.distMiles <= 8);
  const day = trails.filter(t => t.distMiles > 8 && t.distMiles <= 30);
  const backcountry = trails.filter(t => t.distMiles > 30).slice(0, 15);

  return (
    <article className="content-section">
      <p>
        {townName} sits at 3,573 feet in the heart of the Bitterroot Valley, flanked by two
        mountain ranges{'\u2014'}the rugged Bitterroot Range rising to the west and the gentler
        Sapphire Mountains to the east. With 100 trailheads within 50 miles{'\u2014'}the most of any
        hub city in our analysis{'\u2014'}{townName} offers an extraordinary density of hiking options
        ranging from valley-floor river walks to remote wilderness traverses in the
        Selway-Bitterroot, one of the largest wilderness areas in the Lower 48. Seven federally
        designated wilderness areas are accessible from town, and the Bitterroot National Forest
        essentially begins at {townName}{'\u2019'}s western edge. This guide organizes trails by distance
        from {townName} and covers seasonal considerations.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>100 trailheads</strong> within 50 miles{'\u2014'}most of any hub city we track</li>
        <li><strong>411 recreation sites</strong> within 50 miles</li>
        <li><strong>7 wilderness areas</strong> accessible from {townName}</li>
        <li><strong>6 state parks</strong> within range</li>
        <li><strong>Closest wilderness:</strong> Selway-Bitterroot, 10 miles west</li>
        <li><strong>Signature hike:</strong> Blodgett Canyon, 7 miles from town</li>
        <li><strong>Ski areas:</strong> Lost Trail Powder Mountain (62 mi), Discovery (59 mi), Snowbowl (57 mi), Lookout Pass (120 mi)</li>
        <li><strong>Hot springs:</strong> Sleeping Child (8 mi), Lolo Hot Springs (48 mi), and 8 more within 50 miles</li>
        <li><strong>Lake Como:</strong> 16 miles south{'\u2014'}swimming, trails, and Bitterroot Range access</li>
      </ul>

      <h2>In-Town & Urban Trails (Within 8 Miles)</h2>
      <p>
        {townName}{'\u2019'}s in-town hiking begins along the Bitterroot River corridor, where paths
        follow the river through cottonwood bottoms and open meadows with views of the Bitterroot
        Range to the west. The river trail system provides easy, accessible walking and running
        routes popular with families, dog walkers, and after-work joggers. Above town, the
        benchlands offer informal trail networks with panoramic views up and down the Bitterroot
        Valley.
      </p>
      <p>
        <strong>Blodgett Canyon</strong> (7 miles from town) is {townName}{'\u2019'}s signature close-in
        hike and one of the most dramatic canyon approaches in western Montana. The trailhead sits
        at the mouth of a steep-walled granite canyon carved into the Bitterroot Range{'\u2014'}sheer
        rock walls rise thousands of feet on either side as you hike into the canyon along Blodgett
        Creek. The trail extends deep into the Selway-Bitterroot Wilderness, but even a 4-mile
        round-trip to the lower canyon viewpoints delivers world-class scenery. Rock climbers come
        from across the West for Blodgett{'\u2019'}s granite walls.
      </p>
      {urban.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {urban.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Day Hikes (8{'\u2013'}30 Miles)</h2>
      <p>
        <strong>Lake Como</strong> (16 miles south) is the Bitterroot Valley{'\u2019'}s most popular
        recreation lake{'\u2014'}a mountain reservoir set against the dramatic backdrop of the
        Bitterroot Range with swimming, picnicking, and a network of trails that loop around
        the lake and climb into the surrounding forest. The Lake Como Loop Trail (7 miles) is
        an excellent moderate day hike with continuous mountain views. From the lake, trails
        extend westward into the Selway-Bitterroot Wilderness, providing access to alpine basins
        and high peaks along the Idaho border.
      </p>
      <p>
        The <strong>Bitterroot Range</strong> west of {townName} offers dozens of canyon trails
        that penetrate deep into the mountains. Each major canyon{'\u2014'}Blodgett, Mill Creek, Fred
        Burr, Bear Creek, Sweathouse, and others{'\u2014'}provides a unique character, from narrow
        granite gorges to broad alpine basins. Many of these trails enter the Selway-Bitterroot
        Wilderness within a few miles of the trailhead, transitioning quickly from managed forest
        to true wilderness. The <strong>Sapphire Mountains</strong> to the east offer gentler
        terrain with ridgeline routes, meadow hikes, and less-traveled trails that see a fraction
        of the use that the Bitterroot canyons attract.
      </p>
      <p>
        <strong>Sleeping Child Hot Springs</strong> (8 miles east) combines a short drive with a
        natural hot springs soak{'\u2014'}a perfect post-hike reward and one of the Bitterroot
        Valley{'\u2019'}s cherished local institutions.
      </p>
      {day.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Trail</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {day.map(t => (
              <tr key={t.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{t.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{t.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Wilderness & Backcountry</h2>
      <p>
        Seven federally designated wilderness areas are accessible from {townName}{'\u2014'}more than
        any other hub city in our analysis. The <strong>Selway-Bitterroot Wilderness</strong>{' '}
        (10 miles west) is the crown jewel{'\u2014'}at 1.34 million acres, it is one of the largest
        wilderness areas in the contiguous United States, spanning the Bitterroot Range along
        the Montana-Idaho border. The wilderness offers multi-day backpacking through vast
        roadless terrain: high alpine lakes, dense old-growth forests, granite peaks, and the
        deep canyon of the Selway River. Access from {townName} is direct via multiple canyon
        trailheads along the Bitterroot Range, making it possible to reach true wilderness
        in under an hour{'\u2019'}s drive from downtown.
      </p>
      <p>
        The <strong>Frank Church{'\u2013'}River of No Return Wilderness</strong>, accessible via
        longer approaches from the Bitterroot canyons, is the largest wilderness area in the
        Lower 48 at 2.37 million acres{'\u2014'}a vast, remote landscape of deep river canyons and
        forested ridges in central Idaho. Additional wilderness areas including the
        Anaconda-Pintler, Welcome Creek, and others in the surrounding region provide a lifetime
        of backcountry exploration from {townName} as a base.
      </p>
      {wilderness.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Wilderness Area</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {wilderness.map(w => (
              <tr key={w.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{w.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{w.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>State Parks</h2>
      <p>
        Six state parks lie within range of {townName}, providing developed recreation sites
        with trail systems, interpretive displays, and picnic facilities. These parks offer
        accessible outdoor experiences for visitors who prefer maintained trails and facilities
        over wilderness backcountry. The Bitterroot Valley{'\u2019'}s state parks highlight the
        region{'\u2019'}s cultural and natural history{'\u2014'}from Native American heritage sites to
        historic fur-trade routes along the Bitterroot River corridor.
      </p>
      {stateParks.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>State Park</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {stateParks.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{p.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{p.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Considerations</h2>
      <p>
        <strong>Spring (March{'\u2013'}May):</strong> Valley-floor trails along the Bitterroot River
        clear early, often by mid-March. {townName}{'\u2019'}s relatively low elevation (3,573 ft) and
        mild valley climate mean spring arrives sooner here than in higher-elevation Montana
        towns. Bitterroot Range canyon trails (Blodgett, Lake Como) shed snow through April and
        May, with creek crossings running high from snowmelt. Higher-elevation wilderness trails
        hold snow into June. Wildflowers carpet the Sapphire foothills by late April.
      </p>
      <p>
        <strong>Summer (June{'\u2013'}August):</strong> Peak hiking season. All canyon trails and
        wilderness routes are fully accessible by late June. {townName} is warm in summer{'\u2014'}July
        highs average 85°F{'\u2014'}so start early on exposed routes and carry extra water. Afternoon
        thunderstorms build over the Bitterroot Range regularly; plan to be off ridgelines by
        early afternoon. Wildfire smoke can affect visibility and air quality in late July and
        August{'\u2014'}check conditions before committing to high-elevation hikes. Lake Como is at
        its best for combined hiking and swimming.
      </p>
      <p>
        <strong>Fall (September{'\u2013'}October):</strong> Many locals consider fall the finest hiking
        season in the Bitterroot. Warm days, cool nights, and dramatically reduced crowds create
        ideal conditions. The Bitterroot Range puts on exceptional fall color{'\u2014'}western larch
        (tamarack) turns gold in late October, a display unique to the northern Rockies. Elk
        bugling echoes through the canyons in September. Hunting season begins in October; wear
        blaze orange on national forest trails.
      </p>
      <p>
        <strong>Winter (November{'\u2013'}March):</strong> Valley-floor trails remain accessible for
        winter walking and snowshoeing. {townName}{'\u2019'}s mild winter climate (January highs
        averaging 40°F) makes low-elevation hiking feasible year-round. Cross-country skiing and
        snowshoeing are popular in the Bitterroot Range foothills. Lost Trail Powder Mountain
        (62 mi) and Discovery Ski Area (59 mi) provide downhill skiing. Sleeping Child Hot
        Springs (8 mi) is the perfect post-hike winter warm-up.
      </p>

      <h2>Trail Safety</h2>
      <p>
        The {townName} area is grizzly bear and black bear habitat{'\u2014'}carry bear spray on every
        backcountry hike, travel in groups, make noise on the trail, and store food properly.
        Mountain lions are present throughout the Bitterroot Range and Sapphire Mountains.
        The Selway-Bitterroot Wilderness is vast and remote{'\u2014'}cell service is nonexistent in
        most of the backcountry. Carry a detailed map (or GPS device), inform someone of your
        plans, and be prepared for rapidly changing mountain weather. Creek crossings in the
        Bitterroot canyons can be dangerous during spring runoff.
      </p>
      <p>
        For more outdoor activities, see our{' '}
        <Link href={`/montana-towns/${slug}/fishing/`}>{townName} fishing guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>{townName} weekend itinerary</Link>.
      </p>
    </article>
  );
}
