import Link from 'next/link';

type Industry = { name: string; fullName: string; pct: number };

type Props = {
  townName: string;
  slug: string;
  economy: {
    unemploymentRate: number | null;
    laborForceParticipation: number | null;
    employed: number | null;
    laborForce: number | null;
    mainIndustry: string | null;
    topIndustries: Industry[] | null;
    jobScore: number | null;
  } | null;
  population: number | null;
};

function fmt(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

const cardStyle: React.CSSProperties = {
  background: '#f8faf8', borderRadius: '10px', padding: '1rem 1.25rem',
  textAlign: 'center' as const, border: '1px solid #e2ebe2',
};
const cardLabel: React.CSSProperties = { fontSize: '0.78rem', color: '#666', marginBottom: '0.25rem' };
const cardValue: React.CSSProperties = { fontSize: '1.35rem', fontWeight: 700, color: '#204051' };

export default function Jobs({ townName, slug, economy, population }: Props) {
  const e = economy;
  const industries = e?.topIndustries ?? [];

  return (
    <article className="content-section">
      <p>
        {townName} is a small town of {fmt(population)} people in Gallatin County, sitting at 4,075
        feet elevation where the Jefferson, Madison, and Gallatin rivers converge to form the Missouri
        River. Located on Interstate 90 just 31 miles west of Bozeman, {townName} was founded in 1908
        as a Milwaukee Road railroad division point and has evolved into one of Montana's strongest
        small-town economies. With a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : 'remarkably low'} unemployment
        rate — effectively zero — and the highest job score ({e?.jobScore != null ? `${e.jobScore}/10` : '9.7/10'}) of
        all hubs analyzed, {townName} punches far above its weight class. The economy is unusually
        diversified for a town of 2,000, with no single industry commanding more than 20% of
        employment. Proximity to Bozeman's booming job market, a base of industrial employers, and
        growing tourism at the Missouri Headwaters make this a compelling place to work and live. For
        the full town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Employment at a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Unemployment Rate</div><div style={cardValue}>{e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Labor Force</div><div style={cardValue}>{fmt(e?.laborForce ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Employed</div><div style={cardValue}>{fmt(e?.employed ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Participation Rate</div><div style={cardValue}>{e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Top Industry</div><div style={{ ...cardValue, fontSize: '0.95rem' }}>{e?.mainIndustry ?? '—'}</div></div>
        {e?.jobScore != null && <div style={cardStyle}><div style={cardLabel}>Job Score</div><div style={cardValue}>{e.jobScore}/10</div></div>}
      </div>

      <h2>Industry Breakdown</h2>
      <p>
        {townName}'s employment spans {industries.length} major sectors — remarkably diversified for
        a town under 2,000 people. Retail leads at {industries[0]?.pct ?? 19.4}%, serving Interstate
        90 travelers, regional shoppers, and the growing population of the Gallatin Valley's western
        corridor. Construction follows closely at {industries[1]?.pct ?? 17.2}%, driven by Bozeman
        spillover development and new residential construction as buyers seek affordable alternatives
        to the Bozeman housing market. Education & Healthcare accounts for{' '}
        {industries[2]?.pct ?? 13.2}%, anchored by Three Forks Public Schools and proximity to
        Bozeman's medical facilities.
      </p>
      {industries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Industry</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Share</th>
              <th style={{ padding: '0.5rem', width: '40%' }}></th>
            </tr>
          </thead>
          <tbody>
            {industries.map(ind => (
              <tr key={ind.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{ind.fullName || ind.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{ind.pct}%</td>
                <td style={{ padding: '0.5rem' }}>
                  <div style={{ background: '#e2ebe2', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ background: '#3b6978', height: '100%', width: `${Math.min(ind.pct * 3, 100)}%`, borderRadius: '4px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>Manufacturing and Industry</h2>
      <p>
        Manufacturing accounts for {industries.find(i => i.name === 'Manufacturing')?.pct ?? 8.6}%
        of {townName}'s employment — a significant share for a small town and a reflection of the
        area's industrial heritage. The CRH Cement Plant in nearby Trident has operated since the
        early 1900s and remains one of the largest employers in the area, producing cement for
        construction projects across the Northern Rockies. Imerys Talc Mill processes talc mined
        from deposits in the surrounding mountains, and Kanta Block Products manufactures concrete
        masonry. These industrial employers provide wages and benefits that exceed what retail or
        hospitality typically offer, giving {townName} an economic base that most towns this size
        lack.
      </p>

      <h2>The Bozeman Commute</h2>
      <p>
        {townName} sits 31 miles — roughly 30 minutes — west of Bozeman via Interstate 90. This
        proximity is the single most important factor in {townName}'s economic strength. Many
        residents commute to Bozeman for higher-paying jobs in technology, healthcare, education,
        and professional services while enjoying housing costs significantly below the Bozeman
        market. Montana State University, Bozeman Health Deaconess Hospital, and the cluster of
        tech and outdoor industry companies in the Bozeman area all draw {townName} commuters.
        The I-90 corridor makes the drive straightforward year-round, and the commuter dynamic
        explains much of {townName}'s high labor force participation rate and low unemployment —
        residents have access to a metro-area job market while living in a small town.
      </p>

      <h2>Railroad Heritage and Transportation</h2>
      <p>
        {townName} was founded in 1908 specifically as a division point on the Chicago, Milwaukee,
        St. Paul and Pacific Railroad — the Milwaukee Road. The railroad brought the town into
        existence, and the Sacajawea Hotel, built in 1910 to serve railroad travelers, still
        operates as a historic hotel and restaurant. While the Milwaukee Road ceased operations in
        1980, transportation remains part of {townName}'s economic DNA. The town's position on
        Interstate 90 and its proximity to Bozeman Yellowstone International Airport (45 miles east)
        keep logistics and transportation relevant to the local economy.
      </p>

      <h2>Tourism and Recreation</h2>
      <p>
        Tourism & Hospitality accounts for {industries.find(i => i.name === 'Tourism')?.pct ?? 9.0}%
        of {townName}'s employment, and the sector is growing. Missouri Headwaters State Park — where
        the Jefferson, Madison, and Gallatin rivers meet to form the Missouri — is the area's
        signature attraction and a site of national historical significance. Lewis and Clark camped
        here in 1805, and Sacagawea recognized the landscape from her childhood. Lewis & Clark
        Caverns State Park, Montana's first state park, draws visitors to its guided cave tours.
        The Sacajawea Hotel anchors the town's hospitality sector with dining, events, and lodging.
        Fly fishing on the three rivers, floating, and hunting in the surrounding Gallatin and
        Madison valleys add seasonal recreation employment.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '67%'} labor
        force participation rate is well above the Montana state average near 63%. This is not a
        retiree community — {townName}'s population skews toward working-age adults and families,
        many of whom commute to Bozeman. The{' '}
        {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '1.1%'} unemployment rate is
        essentially zero, meaning virtually everyone who wants a job has one. With a labor force
        of {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, the market is tight —
        employers in {townName} and the broader Gallatin Valley consistently report difficulty
        finding workers, which gives job seekers genuine leverage in negotiations.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Retail leads at 19.4% — serving I-90 travelers and regional shoppers provides steady employment in a diversified economy where no single sector dominates.</li>
        <li>Construction at 17.2% offers strong demand for skilled tradespeople, driven by Bozeman spillover development and new housing construction.</li>
        <li>Manufacturing at 8.6% — CRH Cement, Imerys Talc, and Kanta Block provide industrial jobs with wages above the service-sector average.</li>
        <li>Bozeman is 31 miles east on I-90, giving commuters access to Montana State University, Bozeman Health, tech companies, and the full Gallatin Valley job market.</li>
        <li>The 1.1% unemployment rate means employers are competing for workers — job seekers have leverage.</li>
        <li>67% labor force participation — this is a working community, not a retirement town, with high economic engagement.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
