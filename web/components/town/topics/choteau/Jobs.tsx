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
        {townName} is the Teton County seat, a ranching and gateway community of{' '}
        {fmt(population)} people at 3,816 feet elevation along the Rocky Mountain Front, 60 miles
        northwest of Great Falls. For generations, cattle ranching, wheat farming, and hay production
        defined the local economy. Today {townName} has added tourism, healthcare, and education to
        that agricultural base — a diversification driven by world-class paleontology sites, Freezout
        Lake's birding spectacle, and the Bob Marshall Wilderness just to the west. With a 1%
        unemployment rate and a job score of {e?.jobScore != null ? `${e.jobScore}/10` : '9.8/10'} —
        near the highest of any hub in the state — {townName}'s micro-economy is remarkably tight.
        This guide covers industry composition, employment statistics, and what job seekers should
        know about working in a small but resilient Rocky Mountain Front community. For the full
        town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        leads at {industries[0]?.pct ?? 24.8}%, anchored by Benefis Teton Medical Center and
        Choteau Public Schools — the two largest employers in a county seat of under 2,000 people.
        Tourism & Hospitality follows at {industries[1]?.pct ?? 15.5}%, a rapidly growing sector
        fueled by the Egg Mountain dinosaur site, Old Trail Museum, Freezout Lake Wildlife
        Management Area, and guided trips into the Bob Marshall Wilderness. Construction ranks third
        at {industries[2]?.pct ?? 10.7}%, driven by residential building, ranch infrastructure, and
        maintenance across the sprawling Teton County landscape.
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

      <h2>Agriculture: The Economic Backbone</h2>
      <p>
        Agriculture & Mining accounts for {industries.find(i => i.name === 'Agriculture')?.pct ?? 9}%
        of {townName}'s employment, but its true influence extends far beyond that number. Teton
        County is cattle country — ranching operations surround the town in every direction, and
        wheat farming and hay production fill the benchlands east of the Rocky Mountain Front.
        Agricultural supply, equipment repair, veterinary services, and seasonal labor ripple through
        the local economy. The annual Teton County Fair and community rodeos reflect a culture where
        agriculture remains the identity even as other sectors grow.
      </p>

      <h2>Tourism and the Rocky Mountain Front</h2>
      <p>
        Tourism & Hospitality accounts for {industries.find(i => i.name === 'Tourism')?.pct ?? 15.5}%
        of {townName}'s employment and is the fastest-growing sector. The Rocky Mountain Front — the
        dramatic transition from Great Plains to the Continental Divide — draws hikers, hunters,
        anglers, and wildlife watchers. The Bob Marshall Wilderness, accessible from trailheads west
        of {townName}, is one of the largest wilderness areas in the Lower 48. Egg Mountain, where
        paleontologist Jack Horner discovered the first dinosaur eggs in the Western Hemisphere, and
        the Old Trail Museum in {townName} attract science-minded visitors. Freezout Lake, 10 miles
        south, hosts up to 300,000 snow geese and thousands of tundra swans during spring migration,
        drawing birders from across the continent.
      </p>
      <p>
        The Stage Stop Inn, local outfitters, hunting guides, and guest ranches provide tourism
        employment. The Montana Dinosaur Center in Bynum (13 miles away) adds to the regional draw.
        Seasonal tourism brings a summer employment surge, but winter quiets significantly —
        though Teton Pass Ski Area (16 miles west) provides some winter recreation traffic.
      </p>

      <h2>Healthcare and Government</h2>
      <p>
        Benefis Teton Medical Center anchors {townName}'s healthcare sector, providing critical
        access services for a county where the nearest full-service hospital is in Great Falls, 60
        miles southeast. The medical center, along with associated clinics and home health services,
        is among the town's largest employers. As the Teton County seat, {townName} also hosts the
        county courthouse, sheriff's office, and various county services — government accounts for{' '}
        {industries.find(i => i.name === 'Government')?.pct ?? 7.9}% of employment, providing
        stable, year-round positions.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '54.3%'}{' '}
        labor force participation rate is well below Montana's statewide average near 63%. This
        reflects the community's demographic profile: a significant share of the population is
        retired or semi-retired, drawn by affordable housing, open space, and proximity to
        world-class outdoor recreation. With a labor force of only {fmt(e?.laborForce ?? null)} and{' '}
        {fmt(e?.employed ?? null)} employed, {townName} operates a micro-scale economy where
        virtually every available worker has a job — the 1% unemployment rate is essentially zero.
        Remote work has added a new dimension: the scenic Rocky Mountain Front setting has helped
        attract telecommuters who bring outside income into the local economy.
      </p>

      <h2>Commuting to Great Falls</h2>
      <p>
        {townName} sits 60 miles — roughly 70 minutes — northwest of Great Falls via U.S. Highway
        89. While this is a longer commute than most Montanans prefer daily, some {townName}
        residents do make the drive for employment at Malmstrom Air Force Base, Benefis Health
        System's main campus, Great Falls College MSU, or the retail and service sectors in the
        Great Falls metro area. For others, the 60-mile distance makes Great Falls a practical
        destination for occasional work, shopping, and services rather than a daily commute.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at 24.8% — Benefis Teton Medical Center and Choteau Public Schools provide stable, year-round employment.</li>
        <li>Tourism & Hospitality at 15.5% is growing rapidly, driven by dinosaur paleontology sites, Freezout Lake birding, and Bob Marshall Wilderness access.</li>
        <li>Agriculture & Mining at 9% underpins the local culture — ranching, wheat, and hay operations provide seasonal and year-round work.</li>
        <li>The 1% unemployment rate and 9.8/10 job score mean {townName} has a remarkably tight labor market — employers need workers.</li>
        <li>The labor force is only 730 people — job openings are few but competition is minimal.</li>
        <li>Remote work is a growing option: {townName}'s scenic setting and affordable housing attract telecommuters.</li>
        <li>Great Falls (60 mi) provides access to a larger job market for occasional commuters or hybrid workers.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
