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
        {townName} is the Fergus County seat and geographic center of Montana, a community of{' '}
        {fmt(population)} people at 4,121 feet elevation in the Judith Basin. Agriculture remains
        the backbone of Fergus County — 26% of the county workforce — though within the city limits
        only {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 2.5}%
        of employment is in agriculture. {townName} serves as a regional hub for healthcare, retail,
        and government, drawing workers from across central Montana. With a {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'}
        unemployment rate — higher than most Montana hubs — and a job score of {e?.jobScore != null ? `${e.jobScore}/10` : '—'},{' '}
        the labor market reflects both opportunity and challenge. This guide covers industry
        composition, employment statistics, and what job seekers should know. For the full town
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
        {townName}'s employment spans {industries.length} major sectors. Education & Healthcare
        leads at {industries[0]?.pct ?? 29.6}%, anchored by regional healthcare facilities and
        Lewistown Public Schools — the largest employers in central Montana. Retail follows at{' '}
        {industries[1]?.pct ?? 14.9}%, serving residents and the rural population across Fergus
        County. Transportation ranks third at {industries[2]?.pct ?? 9.3}%, supporting agriculture
        and regional logistics. Professional Services at {industries.find(i => i.name === 'Professional Services')?.pct ?? 8.2}%,
        Other Services at {industries.find(i => i.name === 'Other Services')?.pct ?? 7.3}%, and
        Tourism & Hospitality at {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 6.9}%
        round out a diversified economy built on its role as a regional hub.
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

      <h2>Agriculture: County Backbone, City Context</h2>
      <p>
        Agriculture employs 26% of the Fergus County workforce — farms and ranches generate roughly
        $75 million in value added. Within {townName} city limits, however, agriculture accounts for
        only {industries.find(i => i.name === 'Agriculture' || i.name === 'Agriculture & Mining')?.pct ?? 2.5}%
        of employment. The town serves as the service center for the county's agricultural economy:
        retail, transportation, professional services, and government all support the ranching and
        farming operations that define the landscape. For every ten farm and ranch jobs in the
        county, four additional jobs are created in supporting sectors.
      </p>

      <h2>Tourism and Heritage</h2>
      <p>
        Tourism & Hospitality accounts for {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 6.9}%
        of {townName}'s employment. The Charlie Russell Chew Choo, a premier Montana dinner train,
        travels across historic trestles through pristine countryside. The Central Montana Museum
        and Central Montana Historical Society preserve the region's heritage. Big Spring Creek,
        a blue-ribbon trout stream flowing through town, draws anglers. The Big Snowy Mountains and
        Judith Mountains offer hiking and outdoor recreation. Agritourism and range management
        innovations are emerging growth areas.
      </p>
      <p>
        Local lodging, restaurants, and outfitters provide tourism employment. Seasonal events —
        the Montana Winter Fair, Chokecherry Festival, Central Montana Fair — bring visitors and
        temporary jobs. The economy remains more diversified than purely seasonal resort towns.
      </p>

      <h2>Healthcare and Government</h2>
      <p>
        {townName} anchors central Montana's healthcare sector, providing critical access services
        for Fergus County and surrounding areas. Regional medical facilities, clinics, and home
        health services are among the town's largest employers. As the Fergus County seat, {townName}
        hosts the county courthouse, sheriff's office, and various county services — government
        provides stable, year-round positions. Education & Healthcare at {industries[0]?.pct ?? 29.6}%
        reflects the importance of both schools and healthcare in a regional hub of this size.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}{' '}
        labor force participation rate is below Montana's statewide average near 63%. With a labor
        force of {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, the{' '}
        {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate is higher
        than most Montana hubs — job seekers should expect more competition than in tighter labor
        markets like Libby or Kalispell. Remote work has added a new dimension: the central Montana
        setting and affordable housing attract telecommuters who bring outside income into the
        local economy.
      </p>

      <h2>Commuting to Great Falls and Billings</h2>
      <p>
        {townName} sits roughly 125 miles from both Great Falls to the northwest and Billings to
        the southeast. While daily commutes are uncommon, some {townName} residents make the drive
        for employment in larger metros. For most, the distance makes {townName} a destination for
        quality of life — affordable housing, Big Spring Creek fishing, and a tight-knit community
        draw those seeking a different pace. MSU Billings and Great Falls College, each about 125
        miles away, offer higher education access for those willing to relocate or commute
        occasionally.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at {industries[0]?.pct ?? 29.6}% — regional healthcare and Lewistown Public Schools provide stable, year-round employment.</li>
        <li>Retail at {industries[1]?.pct ?? 14.9}% and Transportation at {industries[2]?.pct ?? 9.3}% round out the top three — both serve the regional hub and agricultural economy.</li>
        <li>Tourism at {industries.find(i => i.name === 'Tourism' || i.name === 'Tourism & Hospitality')?.pct ?? 6.9}% is driven by the Charlie Russell Chew Choo, Central Montana Museum, Big Spring Creek, and outdoor recreation.</li>
        <li>The {e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'} unemployment rate is higher than most Montana hubs — job seekers should expect more competition.</li>
        <li>The labor force is {fmt(e?.laborForce ?? null)} people — a regional hub economy with steady turnover and openings.</li>
        <li>The {e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'} participation rate reflects demographic mix; agriculture dominates the county but not the city.</li>
        <li>Remote work is a growing option: {townName}'s central location and affordable housing attract telecommuters.</li>
        <li>Great Falls (125 mi) and Billings (125 mi) provide access to larger job markets for occasional commuters or hybrid workers.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
