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
        {townName} is the Lincoln County seat, a former timber and mining community of{' '}
        {fmt(population)} people at 2,096 feet elevation in Montana's rugged northwest corner at the
        confluence of Libby Creek and the Kootenai River. For generations, timber and vermiculite
        mining defined the local economy. Today {townName} has transitioned toward healthcare,
        retail, construction, and growing tourism — a diversification driven by Libby Dam, the
        Heritage Museum, and world-class recreation at Kootenai Falls, the Cabinet Mountains, and
        Turner Mountain. With a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'}
        unemployment rate and a job score of {e?.jobScore != null ? `${e.jobScore}/10` : '—'},{' '}
        {townName}'s labor market is tight. This guide covers industry composition, employment
        statistics, and what job seekers should know about working in a northwest Montana wilderness
        gateway. For the full town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}'s employment spans {industries.length} major sectors. Education & Healthcare
        leads at {industries[0]?.pct ?? 26.5}%, anchored by Cabinet Peaks Medical Center and
        Libby Public Schools — the largest employers in Lincoln County. Retail follows at{' '}
        {industries[1]?.pct ?? 13.6}%, serving residents and visitors along the Kootenai River
        corridor. Construction ranks third at {industries[2]?.pct ?? 13.4}%, driven by
        residential building, infrastructure maintenance, and seasonal projects. Professional
        Services at {industries.find(i => i.name === 'Professional Services')?.pct ?? 12.6}%
        and Tourism & Hospitality at {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 7.8}%
        round out a diversified economy in transition from its timber and mining roots.
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

      <h2>Transition from Timber and Mining</h2>
      <p>
        Agriculture & Mining accounts for {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 7.6}%
        of {townName}'s employment, but the sector's historical influence runs deep. Timber dominated
        for decades — the J. Neils (later St. Regis) lumber mill employed over 1,500 at its peak.
        Vermiculite mining supplied 80% of the world's vermiculite until closure in 1990. Libby Dam
        construction (1966–1975) employed 2,000 workers. The Heritage Museum preserves this history.
        Today, remaining natural resource employment and transportation ({industries.find(i => i.name === 'Transportation')?.pct ?? 6.6}%)
        support the regional economy, while tourism and healthcare have grown to fill the gap.
      </p>

      <h2>Tourism: A Growing Sector</h2>
      <p>
        Tourism & Hospitality accounts for {industries.find(i => i.name === 'Tourism')?.pct ?? 7.8}%
        of {townName}'s employment and is growing. Kootenai Falls, 11 miles east, is Montana's
        largest undammed waterfall — featured in "The River Wild" and "The Revenant" — with a
        suspension bridge 90 feet above the churning waters. The Cabinet Mountains Wilderness
        (94,360 acres) offers hiking, backpacking, and mountaineering. Turner Mountain Ski Area,
        12 miles away, is known as "the best little ski hill in Montana." Lake Koocanusa, created
        by Libby Dam, draws boaters and anglers. Ross Creek Cedars Scenic Area features ancient
        western red cedars over 1,000 years old.
      </p>
      <p>
        Local outfitters, guides, lodging, and restaurants provide tourism employment. Seasonal
        tourism brings a summer and winter employment surge — fishing and hiking in warm months,
        skiing and snowmobiling in winter — though the economy remains more diversified than
        purely seasonal resort towns.
      </p>

      <h2>Healthcare and Government</h2>
      <p>
        Cabinet Peaks Medical Center anchors {townName}'s healthcare sector, providing critical
        access services for Lincoln County. The medical center, along with associated clinics and
        home health services, is among the town's largest employers. As the Lincoln County seat,
        {townName} hosts the county courthouse, sheriff's office, and various county services —
        government provides stable, year-round positions. Education & Healthcare at{' '}
        {industries[0]?.pct ?? 26.5}% reflects the importance of both schools and healthcare
        in a community of this size.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}{' '}
        labor force participation rate is well below Montana's statewide average near 63%. This
        reflects the community's demographic profile: a significant share of the population is
        retired or semi-retired, drawn by affordable housing, clean air, and proximity to
        world-class outdoor recreation. With a labor force of only {fmt(e?.laborForce ?? null)} and{' '}
        {fmt(e?.employed ?? null)} employed, {townName} operates a micro-scale economy where
        virtually every available worker has a job — the {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'}
        unemployment rate is remarkably low. Remote work has added a new dimension: the scenic
        Kootenai River setting and reliable internet have begun attracting telecommuters who bring
        outside income into the local economy.
      </p>

      <h2>Commuting to Kalispell and Spokane</h2>
      <p>
        {townName} sits 90 miles northwest of Kalispell (Glacier Park International Airport) and
        roughly 160 miles from Spokane, Washington. While daily commutes are uncommon, some
        {townName} residents make the drive for employment in the Flathead Valley or Spokane metro
        area. For most, the distance makes {townName} a destination for quality of life rather than
        a commute — affordable housing, wilderness access, and a tight-knit community draw those
        seeking a different pace.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at 26.5% — Cabinet Peaks Medical Center and Libby Public Schools provide stable, year-round employment.</li>
        <li>Retail at 13.6% and Construction at 13.4% round out the top three — both serve residents and the growing tourism economy.</li>
        <li>Tourism at 7.8% is growing, driven by Kootenai Falls, Cabinet Mountains, Turner Mountain, and Lake Koocanusa.</li>
        <li>The 1.9% unemployment rate and 9.5/10 job score mean {townName} has a tight labor market — employers need workers.</li>
        <li>The labor force is 1,175 people — job openings are few but competition is minimal.</li>
        <li>The 46.2% participation rate reflects a retirement-age population; many residents are drawn by outdoor recreation and affordability.</li>
        <li>Remote work is a growing option: {townName}'s scenic setting and affordable housing attract telecommuters.</li>
        <li>Kalispell (90 mi) and Spokane (160 mi) provide access to larger job markets for occasional commuters or hybrid workers.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
