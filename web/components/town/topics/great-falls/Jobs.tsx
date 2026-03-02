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
        {townName} is Montana's third-largest city and the seat of Cascade County, with an economy
        defined by something no other Montana city can claim — an active U.S. Air Force base. With
        a population of {fmt(population)}, the local economy is anchored by Malmstrom Air Force Base,
        Benefis Health System, and public-sector employment, producing a stable, non-seasonal job
        market that more closely resembles a mid-sized military community than a typical Rocky Mountain
        town. For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {industries[0]?.pct ?? 28.1}% of all jobs — driven by Benefis Health System, Great Falls
        Public Schools, and the University of Providence. Retail trade accounts for approximately
        13.2%, serving both the city and the surrounding agricultural communities of north-central
        Montana. Tourism and hospitality contribute roughly 11.2%, bolstered by the Lewis and Clark
        National Historic Trail Interpretive Center, Giant Springs State Park, and the C.M. Russell
        Museum, which together draw visitors year-round.
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

      <h2>Malmstrom Air Force Base — The Defining Employer</h2>
      <p>
        Malmstrom Air Force Base is the single most important economic institution in {townName} and
        the feature that sets the city apart from every other community in Montana. Home to the 341st
        Missile Wing, Malmstrom is one of three bases in the United States responsible for the
        land-based leg of the nuclear triad, operating Minuteman III intercontinental ballistic
        missiles across a vast missile field stretching over 13,800 square miles of central Montana.
        Thousands of active-duty military personnel, civilian Department of Defense employees,
        contractors, and their families live and spend in {townName}, generating economic impact that
        ripples through every sector of the local economy — housing, retail, dining, healthcare,
        childcare, and automotive services.
      </p>
      <p>
        The Montana Air National Guard's 120th Airlift Wing also operates from Great Falls
        International Airport, flying C-130 Hercules transport aircraft. The Guard unit provides
        additional military employment and reinforces {townName}'s identity as a defense community.
        Between Malmstrom and the Air National Guard, the military presence accounts for a substantial
        share of the local workforce and provides a baseline of demand that insulates the economy from
        the seasonal fluctuations that affect Montana's resort and tourism-driven towns.
      </p>
      <p>
        Military rotation cycles — typically every two to four years — create a distinctive workforce
        dynamism. Families arrive, integrate into the community, patronize local businesses, enroll
        children in schools, and eventually rotate out. This constant turnover sustains steady demand
        for housing rentals, services, and consumer goods, but also means {townName}'s population
        includes a significant transient component that distinguishes it from more rooted Montana
        communities.
      </p>

      <h2>Benefis Health System — Largest Civilian Employer</h2>
      <p>
        Benefis Health System is {townName}'s largest civilian employer, with approximately 3,000
        employees staffing a major regional hospital, specialty clinics, urgent care facilities, and
        outpatient services. Benefis serves not only Cascade County but a vast catchment area across
        north-central Montana — for many rural communities, it is the nearest full-service hospital.
        The health system employs physicians, nurses, surgical technicians, pharmacists, therapists,
        and a large administrative workforce, making healthcare one of the deepest and most diverse
        employment sectors in the city.
      </p>
      <p>
        Ongoing investments in facility expansion, specialty services, and telehealth infrastructure
        continue to generate new positions. Great Falls College MSU's nursing and health sciences
        programs feed graduates directly into Benefis, creating an efficient local pipeline from
        classroom to career that benefits both institutions and the broader community.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 60.6}% reflects a workforce shaped by military employment,
        healthcare, and public-sector work rather than seasonal or gig-economy labor. The
        unemployment rate of {e?.unemploymentRate ?? 3.2}% indicates a tight labor market,
        particularly in healthcare, skilled trades, and technical fields supporting the defense
        sector. Military-connected spouses represent a distinct segment of the workforce — often
        highly educated but facing employment challenges due to frequent relocations and the need for
        portable careers or remote-work arrangements.
      </p>
      <p>
        Great Falls College MSU — a two-year institution affiliated with Montana State University —
        provides workforce training in nursing, diesel technology, welding, information technology,
        and other applied fields that connect directly to local employer needs. The University of
        Providence, a small private Catholic university with roughly 1,000 students, offers four-year
        degrees but does not generate the large-scale graduate output of Montana's flagship
        universities. Employers seeking candidates with advanced degrees or specialized graduate
        training often recruit from the University of Montana in Missoula or Montana State University
        in Bozeman. Remote work has grown steadily in {townName}, aided by housing costs that remain
        well below those of Bozeman and Missoula.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Malmstrom Air Force Base is the economic anchor — military and civilian defense positions span logistics, security, engineering, maintenance, and administration, with openings posted on <a href="https://www.usajobs.gov/" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
        <li>Benefis Health System is the largest civilian employer (~3,000 employees), with consistent demand for nurses, physicians, technicians, and administrative staff across its hospital and clinic network.</li>
        <li>The Montana Air National Guard's 120th Airlift Wing provides additional military employment at Great Falls International Airport, with both full-time and drill-status positions.</li>
        <li>Great Falls Public Schools and Cascade County government round out the public-sector employment base, with openings in education, public safety, and municipal services.</li>
        <li>Great Falls College MSU provides accessible workforce training — its nursing and technical programs are directly aligned with the city's top employers.</li>
        <li>{townName}'s economy is notably non-seasonal — unlike Whitefish, Big Sky, or other resort towns, employment here remains stable year-round thanks to military, healthcare, and government anchors.</li>
        <li>Military spouse employment is a recognized challenge — several local organizations and programs support spouse career placement, remote work, and entrepreneurship.</li>
      </ul>
    </article>
  );
}
