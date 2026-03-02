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
        {townName} is the Dawson County seat in eastern Montana, a community of{' '}
        {fmt(population)} people at 2,064 feet elevation along the Yellowstone River and I-94.
        Located 220 miles east of Billings and 80 miles east of Miles City, {townName} has served
        as a transportation and trade hub since the Northern Pacific Railway arrived in 1881. With
        a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate — higher
        than many Montana hubs, reflecting eastern Montana's economic cycles — and a job score
        of {e?.jobScore != null ? `${e.jobScore}/10` : '—'}, the labor market is shaped by
        transportation, energy, and healthcare. This guide covers industry composition, employment
        statistics, and what job seekers should know. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        leads at {industries[0]?.pct ?? 23.4}%, anchored by Glendive Medical Center, Glendive
        Public Schools, and Dawson Community College — the town's largest employers. Transportation
        follows at {industries.find(i => i.name === 'Transportation')?.pct ?? 16.9}%, a defining
        sector driven by the BNSF Railway corridor and I-94 trucking operations. Retail ranks third
        at {industries.find(i => i.name === 'Retail')?.pct ?? 15.2}%, serving residents and the
        surrounding ranch country. Construction at{' '}
        {industries.find(i => i.name === 'Construction')?.pct ?? 9.5}%, Other Services at{' '}
        {industries.find(i => i.name === 'Other Services')?.pct ?? 8.3}%, and Manufacturing at{' '}
        {industries.find(i => i.name === 'Manufacturing')?.pct ?? 7.7}% round out a diversified
        economy built on {townName}'s role as a railroad and highway hub.
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

      <h2>Transportation: The Economic Differentiator</h2>
      <p>
        Transportation at {industries.find(i => i.name === 'Transportation')?.pct ?? 16.9}% is
        what sets {townName} apart from most small Montana towns. The BNSF Railway corridor —
        successor to the Northern Pacific that founded the town in 1881 — runs through {townName},
        providing railroad employment from maintenance crews to dispatchers. I-94 carries freight
        and livestock trucking east toward the Dakotas and west toward Billings, supporting a
        cluster of trucking firms, fuel stops, and logistics operations. This transportation
        infrastructure is why {townName} has maintained its role as a service center despite eastern
        Montana's population decline — goods and rail traffic must still move through.
      </p>

      <h2>Energy and Agriculture: Boom-Cycle Sectors</h2>
      <p>
        Agriculture & Mining accounts for only{' '}
        {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 3.1}%
        of in-town employment, but both sectors loom far larger in the broader Dawson County economy.
        Ranching and wheat farming define the landscape outside town. The Williston Basin — which
        extends into eastern Montana from North Dakota — has produced periodic oil and gas booms:
        the 1950s Cedar Creek Anticline discovery, and the 2000s Bakken boom that sent workers and
        revenue flowing through {townName}. Energy wages help explain the $71,000 median household
        income, strong for a town of this size. When oil prices are high, {townName} benefits from
        increased drilling activity, pipeline work, and support services; when prices drop, the
        economy leans more heavily on transportation, healthcare, and retail.
      </p>

      <h2>Tourism and Recreation</h2>
      <p>
        Tourism & Hospitality accounts for{' '}
        {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 6.7}%
        of {townName}'s employment — and growing. Makoshika State Park, Montana's largest state park
        at over 11,500 acres, draws visitors for its badlands formations, dinosaur fossils, and hiking
        trails. The annual paddlefish season on the Yellowstone River brings anglers from across
        the region to harvest one of the last wild populations of this prehistoric fish. The Frontier
        Gateway Museum and local dinosaur exhibits add cultural tourism. The 109-member Glendive
        Chamber of Commerce promotes "Live. Shop. Local." initiatives that channel tourist dollars
        into the local economy.
      </p>

      <h2>Healthcare and Education</h2>
      <p>
        Education & Healthcare at {industries[0]?.pct ?? 23.4}% is {townName}'s largest sector.
        Glendive Medical Center provides critical-access healthcare for Dawson County and surrounding
        areas — the nearest larger hospital is 80 miles west in Miles City or 220 miles west in
        Billings. Glendive Public Schools and Dawson Community College are among the town's largest
        employers. As the Dawson County seat, {townName} hosts county government offices that provide
        stable, year-round positions.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}{' '}
        labor force participation rate is below Montana's statewide average near 63%. With a labor
        force of {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, the{' '}
        {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate reflects
        eastern Montana's economic cycles — energy booms tighten the labor market, while downturns
        increase competition for available positions. The BNSF railway and I-94 corridor provide a
        baseline of steady employment that buffers against the worst of the boom-bust cycle. Remote
        work has added a new dimension: {townName}'s affordable housing and Yellowstone River access
        attract telecommuters who bring outside income into the local economy.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at {industries[0]?.pct ?? 23.4}% — Glendive Medical Center, Glendive Public Schools, and Dawson Community College provide stable employment.</li>
        <li>Transportation at {industries.find(i => i.name === 'Transportation')?.pct ?? 16.9}% is the economic differentiator — BNSF Railway and I-94 trucking offer well-paying jobs uncommon in towns this size.</li>
        <li>Retail at {industries.find(i => i.name === 'Retail')?.pct ?? 15.2}% serves both residents and the surrounding ranch country.</li>
        <li>Energy sector activity from the Williston Basin creates periodic booms — oil and gas wages lift the $71K median household income.</li>
        <li>Tourism at {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 6.7}% is growing, driven by Makoshika State Park, paddlefish season, and dinosaur heritage.</li>
        <li>The {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate is higher than most Montana hubs — job seekers should expect more competition during energy downturns.</li>
        <li>The labor force is {fmt(e?.laborForce ?? null)} people — a small but diversified market with steady turnover in transportation and healthcare.</li>
        <li>Billings (220 mi west) and Miles City (80 mi west) provide access to larger job markets along I-94.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
