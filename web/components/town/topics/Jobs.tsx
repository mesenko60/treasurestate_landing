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
        {townName}'s economy is shaped by its role as western Montana's regional center for education,
        healthcare, and professional services. With a population of {fmt(population)}, the city supports
        a diverse job market anchored by the University of Montana and several major healthcare systems.
        This guide covers industry composition, employment rates, and what job seekers should know.
        For the full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}'s employment spreads across {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'education and healthcare'}, which accounts for{' '}
        {industries[0]?.pct ?? 26}% of all jobs. This is driven primarily by the University of Montana,
        Community Medical Center, Providence St. Patrick Hospital, and the Missoula County school system.
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
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>Major Employers</h2>
      <p>
        The University of Montana is the city's single largest employer with approximately 2,500 faculty
        and staff. The university also generates significant downstream employment in student housing,
        food service, and retail. Healthcare is the second major employment anchor, led by Providence
        St. Patrick Hospital and Community Medical Center, which together employ thousands of clinical
        and administrative workers.
      </p>
      <p>
        Federal and state government agencies maintain a notable presence. The U.S. Forest Service's
        Region 1 headquarters is based in {townName}, and several other federal agencies including the
        Bureau of Land Management have regional offices here. Missoula County government and the city
        itself are also significant employers.
      </p>

      <h2>Professional Services & Tech</h2>
      <p>
        Professional services represent {industries.find(i => i.name.includes('Professional'))?.pct ?? 14}% of employment,
        a sector that has grown with the rise of remote work. {townName}'s quality of life has attracted
        a growing cohort of tech workers, consultants, and creative professionals who work remotely
        for companies based in larger cities. Co-working spaces have expanded in the downtown core
        to serve this population.
      </p>

      <h2>Tourism & Hospitality</h2>
      <p>
        Tourism and hospitality account for {industries.find(i => i.name.includes('Tourism'))?.pct ?? 14}% of employment,
        reflecting {townName}'s role as a gateway to Glacier National Park, the Bitterroot Valley, and
        world-class fly fishing. The sector is seasonal, with employment peaking in summer and
        during ski season at nearby Snowbowl. The craft brewing industry{' '}—{' '}{townName} has over a
        dozen breweries{' '}—{' '}has become a draw in its own right.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of {e?.laborForceParticipation ?? 73}% exceeds the national
        average of roughly 62%, reflecting the city's younger-than-average population and university influence.
        The unemployment rate of {e?.unemploymentRate ?? 4.7}% is in line with Montana's statewide average.
      </p>
      <p>
        The university creates a unique labor dynamic: a steady supply of educated young workers
        willing to accept lower wages in exchange for {townName}'s lifestyle amenities. This
        "lifestyle discount" keeps wages in some sectors below national averages, particularly in
        non-profit, education, and hospitality roles. For a look at how wages relate to living costs,
        see our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Healthcare and education offer the most stable, year-round employment.</li>
        <li>Remote workers can leverage {townName}'s quality of life while earning coastal wages.</li>
        <li>Tourism and hospitality jobs are abundant but often seasonal.</li>
        <li>The university creates a competitive job market for entry-level professional positions.</li>
        <li>Federal and state government roles offer strong benefits and job security.</li>
        <li>For the latest openings, check the <a href="https://www.mcpsmt.org" target="_blank" rel="noopener noreferrer">school district</a> and university career pages.</li>
      </ul>
    </article>
  );
}
