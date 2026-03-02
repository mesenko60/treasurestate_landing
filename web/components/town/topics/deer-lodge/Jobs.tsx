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
        {townName} is a historic ranching and institutional town of {fmt(population)} people in
        Powell County, situated in the Deer Lodge Valley at 4,521 feet elevation along Interstate 90.
        Three pillars define the local economy: government employment anchored by Montana State Prison,
        healthcare and education services, and a growing tourism sector built around Grant-Kohrs Ranch
        National Historic Site and the Old Montana Prison Museum. With a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : 'very low'} unemployment
        rate and a job score of {e?.jobScore != null ? `${e.jobScore}/10` : 'the highest tier'},{' '}
        {townName} offers remarkable employment stability for a town its size — driven largely by a
        recession-resistant government employment base. This guide covers industry composition,
        employment statistics, and what job seekers should know about working in one of Montana's
        most historically significant small towns. For the full town profile, see
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
        leads at {industries[0]?.pct ?? 27.9}%, anchored by the local hospital, Deer Lodge Public
        Schools, and National Park Service staffing at Grant-Kohrs Ranch. Government follows at{' '}
        {industries.find(i => i.name === 'Government')?.pct ?? 20.8}%, driven overwhelmingly by
        Montana State Prison — the single largest employer in town and the economic anchor of the
        entire community. Tourism & Hospitality ranks third at{' '}
        {industries.find(i => i.name === 'Tourism')?.pct ?? 20.4}%, fueled by Grant-Kohrs Ranch
        National Historic Site, the Old Montana Prison Museum, and visitors passing through on I-90
        between Butte and Missoula.
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

      <h2>Montana State Prison — The Anchor Employer</h2>
      <p>
        Montana State Prison, located just south of {townName}, is by far the community's largest
        single employer and the primary reason government accounts for{' '}
        {industries.find(i => i.name === 'Government')?.pct ?? 20.8}% of local employment. The
        facility employs correctional officers, administrative staff, healthcare workers,
        maintenance crews, and support personnel — providing stable, benefits-eligible jobs with
        state retirement plans. Prison employment is inherently recession-resistant: staffing
        levels are driven by incarceration policy rather than economic cycles, giving {townName} an
        employment floor that most small Montana towns lack. Additional government jobs come from
        the National Park Service (Grant-Kohrs Ranch), Powell County offices, and state highway
        maintenance.
      </p>

      <h2>Tourism and Heritage Economy</h2>
      <p>
        Tourism & Hospitality accounts for{' '}
        {industries.find(i => i.name === 'Tourism')?.pct ?? 20.4}% of {townName}'s employment — a
        remarkably high share for a town not adjacent to a major national park. Grant-Kohrs Ranch
        National Historic Site, a working cattle ranch preserved by the National Park Service, draws
        visitors year-round and employs rangers, interpreters, and maintenance staff. The Old Montana
        Prison Museum complex, housed in the original territorial prison built in 1871, is one of the
        state's most visited heritage attractions. Together, these two sites anchor a heritage tourism
        economy supplemented by I-90 travelers, Georgetown Lake recreation traffic, and hunters and
        anglers accessing the surrounding Deer Lodge Valley.
      </p>
      <p>
        {townName} also benefits from its position on Interstate 90 between Butte (37 miles east) and
        Missoula (80 miles west). Through-travelers stop for fuel, food, and lodging, supporting a
        small but steady hospitality sector. The College of Montana — the first college chartered in
        the state, founded in 1878 — adds a layer of historical interest, though the institution no
        longer operates.
      </p>

      <h2>Healthcare and Education Employment</h2>
      <p>
        Education & Healthcare is the largest sector at{' '}
        {industries[0]?.pct ?? 27.9}% of employment. The local hospital and clinic system provides
        primary care, emergency services, and outpatient treatment for {townName} and the surrounding
        valley. Deer Lodge Public Schools employs teachers, administrators, and support staff. The
        National Park Service contributes to this category through interpretive and educational
        programming at Grant-Kohrs Ranch. Healthcare positions — nurses, medical technicians,
        therapists — are among the most consistent hiring needs in a small community where the
        aging population drives steady demand for medical services.
      </p>

      <h2>Commuting to Butte and Anaconda</h2>
      <p>
        {townName} sits 37 miles — roughly 35 minutes — east of Butte via Interstate 90, and just
        23 miles from Anaconda. This proximity is a significant economic advantage: many {townName}
        residents commute to Butte for employment at Montana Tech, St. James Healthcare, NorthWestern
        Energy, or mining and reclamation operations in the Butte-Silver Bow area. Anaconda offers
        additional opportunities in healthcare, recreation, and Superfund remediation work. This
        interconnected labor market effectively gives {townName} residents access to a combined
        metro-area economy while enjoying lower housing costs and a quiet, valley-floor lifestyle.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : 'low'} labor
        force participation rate is well below Montana's statewide average near 63%. This reflects the
        community's demographic profile: a significant share of the population is retired or
        semi-retired, and the town's affordable housing and quiet character attract retirees from across
        the state. The {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : 'extremely low'} unemployment
        rate is effectively zero — virtually everyone seeking work is employed. With a labor force of
        only {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, this is a very small
        market where individual employers like the prison and hospital dominate hiring. Seasonal
        fluctuations from tourism are buffered by year-round government and healthcare employment.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at 27.9% — the local hospital, clinics, school district, and NPS staffing provide stable, year-round employment.</li>
        <li>Government at 20.8% — Montana State Prison is the anchor employer, offering benefits-eligible, recession-resistant positions with state retirement.</li>
        <li>Tourism & Hospitality at 20.4% — Grant-Kohrs Ranch, Old Montana Prison Museum, and I-90 travel traffic support seasonal and year-round hospitality jobs.</li>
        <li>Butte is 37 miles east and Anaconda is 23 miles away, giving commuters access to the broader southwest Montana job market.</li>
        <li>The 2.3% unemployment rate and 9.4/10 job score indicate an extremely tight labor market — employers are actively seeking workers.</li>
        <li>{townName}'s low labor force participation (49.3%) reflects a large retired population — competition for available jobs is minimal.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
