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
        {townName} is Montana's largest city and the economic capital of the state's eastern half,
        serving as the regional hub for healthcare, energy, agriculture, and finance across a vast
        trade area stretching from eastern Montana into northern Wyoming. With a population of{' '}
        {fmt(population)}, {townName} commands the largest workforce in Montana — {fmt(e?.laborForce ?? null)}{' '}
        workers — and supports the most diversified economy of any city in the state. Unlike
        tourism-dependent communities in western Montana, {townName}'s job market is anchored by
        two major hospital systems, petroleum refineries, a Fortune 1000 bank headquarters, and a
        deep agricultural services sector that keeps employment stable year-round. For the full city
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {industries[0]?.pct ?? 26.2}% of all jobs — driven by Billings Clinic, St. Vincent
        Healthcare, {townName} Public Schools, and Montana State University Billings. Retail trade
        follows at approximately 12.1%, reflecting {townName}'s role as the shopping and services
        destination for a multi-state region. Tourism and hospitality account for roughly 10.9%,
        bolstered by {townName}'s position as the primary gateway to the Beartooth Highway and
        Yellowstone National Park's northeast entrance.
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

      <h2>Healthcare — The Dominant Employer</h2>
      <p>
        Healthcare is the backbone of {townName}'s economy. Billings Clinic — the city's largest
        employer with more than 6,000 employees — is an integrated, physician-led health system
        that operates a 304-bed hospital, a Level II trauma center, and dozens of specialty clinics.
        Its reach extends across Montana, Wyoming, and the Dakotas through a network of affiliated
        clinics, telehealth services, and air-ambulance operations. Billings Clinic is also a
        teaching institution, training medical residents and fellows across multiple specialties,
        which creates a continuous pipeline of clinical positions.
      </p>
      <p>
        St. Vincent Healthcare — part of Intermountain Health — is the city's second major hospital
        system, providing a full range of inpatient and outpatient services including cardiac care,
        oncology, and orthopedics. Together, the two systems make {townName} the undisputed medical
        hub for a region larger than most Eastern states. Healthcare employment in {townName} is
        non-seasonal and growing, with chronic demand for nurses, physicians, technicians, and
        administrative staff that keeps the labor market tight across clinical roles.
      </p>

      <h2>Energy, Finance & Agriculture</h2>
      <p>
        {townName}'s energy sector sets it apart from every other Montana city. Two petroleum
        refineries — CHS Inc. and ExxonMobil Billings Refinery — process crude oil from the
        Bakken formation and the Powder River Basin, employing hundreds of workers in refining,
        maintenance, and logistics. Town Pump, a Montana-based petroleum and convenience store
        company, also maintains a significant presence. The energy sector provides high-wage
        industrial jobs that support {townName}'s middle class and drive demand across the local
        supply chain.
      </p>
      <p>
        First Interstate BancSystem — headquartered in {townName} — is the only Fortune 1000
        company based in Montana, operating more than 300 banking offices across 14 states. The
        corporate headquarters provides professional careers in finance, technology, compliance,
        marketing, and executive management, giving {townName} a white-collar employment dimension
        that most Montana cities lack. Agriculture rounds out the economic base — {townName} is the
        commercial hub for eastern Montana's ranching and dryland farming operations, with
        livestock auction yards, grain elevators, farm equipment dealers, and agricultural lending
        institutions clustered in and around the city.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 66.1}% is among the highest of any Montana city, reflecting
        a broad-based economy that offers employment across skill levels — from refinery operators
        and healthcare aides to financial analysts and university faculty. The unemployment rate of{' '}
        {e?.unemploymentRate ?? 3.5}% indicates a tight labor market, with persistent demand in
        nursing, skilled trades, energy operations, and commercial transportation. Because
        {' '}{townName}'s economy is diversified across healthcare, energy, finance, agriculture,
        and retail, it does not suffer the dramatic seasonal employment swings that affect Montana's
        resort communities.
      </p>
      <p>
        Montana State University Billings (MSUB) — a public university with approximately 3,700
        students — and Rocky Mountain College — a private institution with roughly 1,000 students —
        provide local workforce development through programs in nursing, education, business, and
        applied sciences. MSUB's City College division focuses specifically on two-year technical and
        trades programs that feed directly into {townName}'s healthcare, energy, and construction
        sectors. Remote work has expanded in {townName}, attracting workers who value the city's
        relatively affordable housing, lack of sales tax, and access to outdoor recreation along the
        Yellowstone River and in the nearby Beartooth Mountains.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Healthcare dominates — Billings Clinic (6,000+ employees) and St. Vincent Healthcare are the city's two largest employers, with constant demand for nurses, physicians, technicians, and support staff across a regional service area.</li>
        <li>The energy sector provides high-wage industrial employment — CHS Inc. and ExxonMobil operate petroleum refineries that employ hundreds, with additional opportunities in pipeline operations, maintenance, and logistics.</li>
        <li>First Interstate BancSystem — headquartered in {townName} — offers corporate careers in banking, finance, technology, and management that are rare in Montana outside of this city.</li>
        <li>{townName} Public Schools, Yellowstone County government, and Montana State University Billings provide stable public-sector employment across education, administration, and public safety.</li>
        <li>Agriculture and ranching services generate year-round employment in livestock marketing, equipment sales, feed and seed operations, and agricultural finance throughout eastern Montana.</li>
        <li>Town Pump's petroleum distribution and convenience store operations add logistics, retail management, and transportation jobs to the local economy.</li>
        <li>{townName}'s economy is the most diversified in Montana — healthcare, energy, finance, agriculture, retail, and education provide multiple employment pathways, insulating the city from single-industry downturns.</li>
      </ul>
    </article>
  );
}
