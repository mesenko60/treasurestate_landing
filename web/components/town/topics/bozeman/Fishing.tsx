import Link from 'next/link';

type RecPlace = { name: string; type: string; distMiles: number };

type Props = {
  townName: string;
  slug: string;
  fishingAccess: RecPlace[];
  rivers: RecPlace[];
  lakes: RecPlace[];
};

export default function Fishing({ townName, slug, fishingAccess, rivers, lakes }: Props) {
  const nearLakes = lakes.slice(0, 12);

  return (
    <article className="content-section">
      <p>
        {townName} may have only five public fishing access sites within 50 miles, but what it
        lacks in access-site density it more than compensates for with the quality of the water.
        The Gallatin, Madison, and Yellowstone rivers — three of the most celebrated trout
        streams in North America — all flow within an hour's drive, and the upper Gallatin runs
        right through Gallatin Canyon just 13 miles south of town. Add the Jefferson, the
        Boulder, Hyalite Reservoir, and 69 lakes within 50 miles, and {townName} offers a
        fishing portfolio that rivals any mountain town in the West. For the full city profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <ul>
        <li><strong>5 fishing access sites</strong> within 50 miles</li>
        <li><strong>5 major rivers</strong> within driving distance</li>
        <li><strong>69 lakes</strong> within 50 miles</li>
        <li><strong>Primary species:</strong> Rainbow trout, brown trout, cutthroat trout, mountain whitefish</li>
        <li><strong>Closest river access:</strong> Gallatin River, 13 miles south via US-191</li>
        <li><strong>License required:</strong> Montana fishing license (available at local shops and{' '}
          <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">fwp.mt.gov</a>)</li>
      </ul>

      <h2>The Rivers</h2>

      <h3>Gallatin River</h3>
      <p>
        The Gallatin is {townName}'s home river and one of Montana's blue-ribbon trout streams.
        It flows north out of Yellowstone National Park through the narrow Gallatin Canyon,
        offering roughly 120 miles of fishable water. The canyon stretch south of {townName} is
        a classic pocket-water fishery — fast riffles, boulder gardens, and deep plunge pools
        holding healthy populations of rainbow and brown trout averaging 12 to 16 inches. The
        river is predominantly wade-friendly, making it accessible to anglers without a drift
        boat. Caddis and stonefly hatches run strong from June through August, and the Gallatin
        is particularly productive for dry-dropper rigs worked through the broken water.
      </p>

      <h3>Madison River</h3>
      <p>
        The Madison is widely regarded as one of the world's premier trout rivers. The famous
        50-mile riffle between Quake Lake and Ennis Lake — about 40 miles southwest of{' '}
        {townName} — is a continuous stretch of productive, wadeable water that draws fly fishers
        from around the globe. Brown and rainbow trout thrive in the Madison's nutrient-rich
        flows, and the river is renowned for its prolific insect hatches: salmon flies in late
        June, caddis through July, and blue-winged olives in fall. The lower Madison below
        Ennis Lake shifts to deeper, slower water better suited to float fishing. Dry-fly
        purists consider the Madison's upper reaches some of the finest water in the West.
      </p>

      <h3>Yellowstone River</h3>
      <p>
        The Yellowstone is the longest undammed river in the lower 48 states, and the reach
        near Livingston — 23 miles east of {townName} — is outstanding trout water. Spring
        brings strong runs of Yellowstone cutthroat trout moving upstream to spawn, while fall
        is prime time for large brown trout that become aggressive ahead of their own spawning
        season. The river alternates between braided gravel channels and deep runs, with good
        wading access at several points. Float trips from Livingston downstream are a popular
        way to cover water. The Yellowstone's scenic corridor through Paradise Valley, framed
        by the Absaroka Range, makes fishing here a visual experience as much as an angling one.
      </p>

      <h3>Jefferson River</h3>
      <p>
        The Jefferson, 49 miles west of {townName} at Twin Bridges, is a quieter alternative
        to the headline rivers. It holds good numbers of brown trout in its slower, meandering
        stretches and sees a fraction of the angling pressure of the Madison or Gallatin. The
        Jefferson rewards patient anglers willing to read the water and work streamers or
        nymphs through deeper bends. It's best fished by float, though wade access exists at
        bridge crossings and a few access sites.
      </p>

      <h3>Boulder River</h3>
      <p>
        The Boulder River, about 50 miles east near Big Timber, is a small mountain stream
        that flows out of the Absaroka-Beartooth Wilderness. Its upper reaches hold native
        cutthroat trout in clear, cold water with limited pressure. Rainbow trout are present
        in the lower sections. The Boulder is best fished with light tackle and small dry flies
        — it's a stream for anglers who value solitude and scenery over trophy fish counts.
      </p>

      {rivers.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>River</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {rivers.map(r => (
              <tr key={r.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{r.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{r.distMiles === 0 ? 'Through town' : `${r.distMiles} mi`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Fishing Access Sites</h2>
      <p>
        Montana Fish, Wildlife & Parks maintains public fishing access sites in the{' '}
        {townName} area. With only five sites within 50 miles, the list is short — but
        each provides reliable access to quality water with parking and, in most cases,
        boat launch facilities.
      </p>
      {fishingAccess.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Access Site</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {fishingAccess.map(f => (
              <tr key={f.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{f.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{f.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Lake Fishing</h2>
      <p>
        {townName}'s lake fishing is anchored by Hyalite Reservoir, just 10 miles south in
        Hyalite Canyon. The reservoir is stocked regularly with Yellowstone cutthroat trout
        and also holds grayling — one of the few accessible grayling fisheries in the state.
        Float tubes and small watercraft work well on Hyalite; a boat ramp is available at the
        dam. Glen Lake, only two miles from town, is a small community pond stocked for family
        fishing. Beyond these drive-to options, dozens of alpine lakes in the Gallatin Range,
        Spanish Peaks, and Beartooth Plateau offer backcountry fishing for cutthroat and
        brook trout in stunning high-mountain settings.
      </p>
      {nearLakes.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Lake</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Distance from {townName}</th>
            </tr>
          </thead>
          <tbody>
            {nearLakes.map(l => (
              <tr key={l.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{l.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{l.distMiles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Seasonal Guide</h2>
      <p>
        <strong>Spring (March–May):</strong> Mother's Day caddis hatches on the Yellowstone
        near Livingston are a regional highlight in May. The Gallatin fishes well with nymphs
        before runoff hits in late April. The Madison can be productive early but muddies up
        during peak snowmelt. Spring is excellent for streamer fishing as trout feed
        aggressively after winter.
      </p>
      <p>
        <strong>Summer (June–August):</strong> Prime season on all rivers. Salmon flies appear
        on the Madison and Yellowstone in late June — the most anticipated hatch of the year.
        Golden stoneflies, PMDs, and caddis follow through July. The Gallatin's pocket water
        fishes consistently all summer with dry-dropper rigs. Evening hatches on the Madison
        can produce exceptional dry-fly fishing into August.
      </p>
      <p>
        <strong>Fall (September–November):</strong> Many experienced anglers consider fall
        the best season on the Yellowstone. Brown trout become aggressive ahead of their
        spawning run, and streamer fishing is at its peak. Blue-winged olives hatch on overcast
        days across all rivers well into November. Fewer crowds and cooler temperatures make
        fall a rewarding time to fish the {townName} area.
      </p>
      <p>
        <strong>Winter (December–February):</strong> The Gallatin and Madison remain open and
        fishable year-round. Midging and nymphing in slow, deep runs can produce fish on
        warmer afternoons. The Yellowstone near Livingston fishes reasonably through winter
        as well. Dress in layers and watch for ice on wading surfaces.
      </p>

      <h2>Local Resources</h2>
      <p>
        {townName} has a strong network of fly shops and outfitters offering guided trips, gear
        rental, and current fishing reports. Montana Troutfitters, The Rivers Edge, and Yellow
        Dog Flyfishing Adventures are among the well-established local operations. A Montana
        fishing license is required for anyone 12 and older; licenses are available online
        at{' '}
        <a href="https://fwp.mt.gov" target="_blank" rel="noopener noreferrer">Montana FWP</a>{' '}
        or at local sporting goods stores. Non-resident licenses are available for durations
        ranging from two days to a full season.
      </p>
      <p>
        For hiking and other outdoor activities near {townName}, see
        our{' '}
        <Link href={`/montana-towns/${slug}/hiking/`}>hiking guide</Link> and
        the <Link href={`/montana-towns/${slug}/weekend-itinerary/`}>weekend itinerary</Link>.
      </p>
    </article>
  );
}
