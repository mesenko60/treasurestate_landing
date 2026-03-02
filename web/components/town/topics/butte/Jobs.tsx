import Link from 'next/link';

type Industry = { name: string; pct: number };

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
        {townName} is a city defined by reinvention. Once the largest city in the American West — built
        on the richest copper deposits ever discovered — it has spent generations transitioning from a
        single-industry mining powerhouse to a diversified economy anchored by healthcare, education,
        energy, and an unlikely employer: environmental cleanup. With a population of {fmt(population)},
        {townName} today is the consolidated city-county seat of Silver Bow County, and its workforce
        reflects both the grit of its mining heritage and the pragmatism of a community that refuses to
        become a ghost town. For the full city profile, see
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
        {townName}'s employment spans {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'Education & Healthcare'}, accounting for{' '}
        {industries[0]?.pct ?? 23.5}% of all jobs — driven by St. James Healthcare, Montana Tech,
        and Butte Public Schools. Retail trade follows at approximately 11.4%, while Tourism &
        Hospitality accounts for roughly 10.2%, a share that has grown steadily as {townName} leans
        into its identity as a National Historic Landmark district with one of the largest collections
        of Victorian-era commercial architecture in the United States.
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
                <td style={{ padding: '0.5rem' }}>{ind.name}</td>
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

      <h2>Mining — Still Part of the Story</h2>
      <p>
        Unlike most former mining towns in the West, {townName} never fully stopped mining. Montana
        Resources continues to extract copper and molybdenum from the Continental Pit — an active
        open-pit mine on the eastern edge of the city. The operation employs several hundred workers
        in extraction, processing, and heavy equipment roles, and its payroll ripples through the
        local economy. Montana Resources is not the Anaconda Company reborn — it is a modern,
        environmentally regulated operation — but its presence means that mining remains a living part
        of {townName}'s identity rather than a purely historical footnote.
      </p>
      <p>
        The Berkeley Pit, the massive flooded former open-pit copper mine, is now part of the nation's
        largest Superfund complex. Federal and state cleanup efforts have employed environmental
        engineers, remediation specialists, hydrologists, and construction workers for decades, and
        that work continues. Superfund cleanup is, paradoxically, one of {townName}'s most durable
        employers — the scale of contamination ensures that remediation jobs will persist for years to
        come, providing steady technical and labor positions that would not exist without the city's
        mining legacy.
      </p>

      <h2>Healthcare & Montana Tech</h2>
      <p>
        St. James Healthcare — now part of Intermountain Health — is {townName}'s largest private
        employer. The regional hospital serves Silver Bow County and the surrounding area with
        emergency, surgical, specialty, and outpatient services. Nursing, clinical, technical, and
        administrative positions make St. James one of the most consistent sources of employment in
        the city, and healthcare as a sector accounts for the largest share of {townName}'s workforce.
      </p>
      <p>
        Montana Tech — formally Montana Technological University — is both an employer and the city's
        most important workforce pipeline. Founded in 1900 as the Montana School of Mines, Montana
        Tech has grown into a nationally recognized STEM-focused university with approximately 1,800
        students. Its programs in mining engineering, petroleum engineering, geological engineering,
        environmental science, and computer science attract recruiters from across the country. Montana
        Tech graduates command strong starting salaries, and many stay in Montana to work in energy,
        mining, environmental remediation, and technology. The university itself employs hundreds of
        faculty, staff, and researchers, making it one of {townName}'s anchor institutions.
      </p>

      <h2>Energy, Retail & Government</h2>
      <p>
        NorthWestern Energy maintains a significant operational presence in {townName}, providing
        utility-sector careers in engineering, line work, operations, and administration. Town Pump
        — one of Montana's largest privately held companies — is headquartered in {townName}, operating
        petroleum distribution, convenience stores, hotels, and casinos across the state. Town Pump's
        corporate headquarters and distribution operations provide management, logistics, and
        administrative jobs that would otherwise be found only in larger Montana cities.
      </p>
      <p>
        Silver Bow County — which operates as a consolidated city-county government — employs workers
        across law enforcement, public works, planning, social services, and administration. Butte
        Public Schools is another significant public-sector employer, staffing teachers, counselors,
        administrators, and support personnel across the district.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 58.1}% is the lowest among Montana's hub cities, reflecting an
        older population, a higher share of retirees, and a legacy workforce that includes former
        miners and industrial workers who have aged out of the labor market. The unemployment rate of{' '}
        {e?.unemploymentRate ?? 4.3}% is modestly above the state average — honest context for a
        community still navigating the long tail of deindustrialization. These numbers do not tell the
        full story: {townName}'s cost of living is among the lowest in western Montana, which means
        that employed workers stretch their earnings further here than in Bozeman, Missoula, or
        Kalispell.
      </p>
      <p>
        Heritage tourism has become a genuine growth sector. {townName}'s Uptown district, the World
        Museum of Mining, the Dumas Brothel Museum, and events like Evel Knievel Days and the Montana
        Folk Festival draw visitors who spend money in local restaurants, hotels, and shops. The city's
        authenticity — it has not been polished into a resort facsimile — is precisely what makes it
        attractive to a growing segment of travelers seeking real Western history.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>St. James Healthcare (Intermountain Health) is the largest private employer — clinical, nursing, technical, and administrative roles are consistently available.</li>
        <li>Montana Tech is both an employer and the city's STEM pipeline — engineering, environmental science, and computer science graduates are recruited nationally, and the university itself provides faculty and staff positions.</li>
        <li>Montana Resources still operates the Continental Pit, making {townName} one of the few cities in the West where mining remains a viable career path.</li>
        <li>Superfund cleanup provides durable employment for environmental engineers, remediation specialists, and construction workers — a paradoxical but real source of stable jobs.</li>
        <li>Town Pump's corporate headquarters offers management, logistics, and administrative careers that leverage {townName}'s central Montana location.</li>
        <li>NorthWestern Energy provides utility-sector careers in engineering, operations, and line work.</li>
        <li>Silver Bow County government and Butte Public Schools round out the public-sector employment base with positions in law enforcement, public works, education, and administration.</li>
        <li>{townName}'s economy is a transition economy — unemployment is higher and participation lower than the state average, but the cost of living is among the lowest in western Montana, making it an affordable base for workers willing to bet on the city's ongoing reinvention.</li>
      </ul>
    </article>
  );
}
