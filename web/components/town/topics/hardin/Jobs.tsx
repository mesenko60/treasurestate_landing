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
        {townName} is the Big Horn County seat in southeastern Montana, a community of{' '}
        {fmt(population)} people on Interstate 90, roughly 46 miles east of Billings. Situated at
        the edge of the Crow Indian Reservation and just 14 miles north of the Little Bighorn
        Battlefield National Monument, {townName} serves as a gateway for heritage tourism while
        anchoring healthcare, education, and government services for the surrounding region. With
        a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate and a
        job score of {e?.jobScore != null ? `${e.jobScore}/10` : '—'}, the labor market reflects
        both the town's role as a county seat and its deep ties to the Crow Nation and ranching
        economy. This guide covers industry composition, employment statistics, and what job
        seekers should know. For the full town profile, see
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
        leads at {industries[0]?.pct ?? 34.8}%, anchored by Big Horn County Memorial Hospital,
        the Hardin school district, and Crow Agency education programs. Tourism & Hospitality
        follows at{' '}
        {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 16.7}%,
        driven by the Little Bighorn Battlefield National Monument and Crow Fair. Transportation
        ranks third at {industries.find(i => i.name === 'Transportation')?.pct ?? 9.8}%, supported
        by I-90 freight corridors, while Professional Services at{' '}
        {industries.find(i => i.name === 'Professional Services')?.pct ?? 9.6}% and Agriculture &
        Mining at{' '}
        {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 8.3}%
        round out a service-oriented economy shaped by {townName}'s role as a county seat and
        reservation-border town.
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
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>Healthcare & Education — The Lead Sector</h2>
      <p>
        Education & Healthcare at {industries[0]?.pct ?? 34.8}% is {townName}'s dominant sector —
        the largest share of any industry by a wide margin. Big Horn County Memorial Hospital, a
        25-bed critical access facility, is one of the town's top employers, providing emergency
        care, primary medicine, and outpatient services for {townName} and the surrounding
        reservation communities. The nearest larger hospital is in Billings, 46 miles west, making
        {townName}'s facility essential for the region. The Hardin school district and Head Start
        programs employ teachers, administrators, and support staff, while the Crow Tribe operates
        education and social service programs at nearby Crow Agency that draw workers from{' '}
        {townName}. County government offices — courts, public health, law enforcement — add
        another layer of stable, benefits-eligible employment tied to {townName}'s status as the
        Big Horn County seat.
      </p>

      <h2>Tourism & Hospitality</h2>
      <p>
        Tourism & Hospitality accounts for{' '}
        {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 16.7}%
        of {townName}'s employment, driven by three major draws. The Little Bighorn Battlefield
        National Monument, 14 miles south, attracts over 300,000 visitors annually and is one of
        the most visited National Park Service sites in Montana. Crow Fair, held each August at
        Crow Agency, draws 45,000–50,000 attendees for what is billed as the "Tipi Capital of the
        World" — a weeklong celebration of Crow culture featuring parades, powwow dancing, and
        horse racing that fills {townName}'s hotels and restaurants. Bighorn Canyon National
        Recreation Area, accessible south of {townName}, adds fishing, boating, and scenic
        sightseeing. Together, these attractions create a seasonal tourism economy that peaks from
        June through September, with hotels, restaurants, gift shops, and guide services employing
        a significant share of the local workforce.
      </p>

      <h2>Agriculture & Ranching</h2>
      <p>
        Agriculture & Mining accounts for{' '}
        {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 8.3}%
        of in-town employment, but the sector's influence extends far beyond {townName}'s borders.
        Cattle ranching dominates the surrounding Big Horn County landscape, and {townName} serves
        as the commercial hub where ranchers access supplies, veterinary services, and equipment
        dealers. Historically, the area was home to Thomas D. Campbell's 95,000-acre wheat
        operation — once the nation's largest farm — and a Holly Sugar Corporation beet processing
        plant. While those operations have closed, irrigated hay, alfalfa, and small-grain
        production continue along the Bighorn River bottoms. The Crow Tribe manages significant
        agricultural land across the reservation, including cattle and hay operations that
        contribute to the broader county economy.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}{' '}
        labor force participation rate is above Montana's statewide average near 63%, reflecting a
        working-age population actively engaged in the economy. With a labor force of{' '}
        {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, the{' '}
        {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate is
        slightly elevated compared to western Montana communities, reflecting the economic
        challenges common to reservation-border towns. The Crow Tribe is a significant regional
        employer through tribal government, Indian Health Service facilities, and education
        programs at Crow Agency. Seasonal tourism hiring creates a summer employment surge, while
        healthcare, education, and county government provide year-round stability. Billings — just
        46 miles west on I-90 — offers a large job market accessible for commuters willing to make
        the drive.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the dominant sector at {industries[0]?.pct ?? 34.8}% — Big Horn County Memorial Hospital, the school district, and tribal education programs are the largest employers.</li>
        <li>Tourism & Hospitality at {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 16.7}% is driven by the Little Bighorn Battlefield (300,000+ annual visitors) and Crow Fair (45,000–50,000 attendees).</li>
        <li>Agriculture accounts for {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 8.3}% in town but looms much larger in the county — ranching, hay, and tribal agricultural operations dominate the landscape.</li>
        <li>The Crow Tribe is a major regional employer through tribal government, IHS healthcare, and education — positions are available to both tribal members and non-members.</li>
        <li>County seat status provides stable government employment — courts, public health, law enforcement, and administrative offices.</li>
        <li>The {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate is slightly above the state average — job seekers should expect moderate competition, especially outside peak tourism season.</li>
        <li>Billings (46 mi west on I-90) provides access to Montana's largest job market for commuters.</li>
        <li>The labor force is {fmt(e?.laborForce ?? null)} people — a small market with consistent turnover in healthcare, hospitality, and education.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
