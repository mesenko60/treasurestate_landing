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
        {townName}'s economy has transformed over the past two decades from a quiet college town into
        one of Montana's most dynamic job markets. With a population of {fmt(population)}, the city
        blends a strong university presence, a growing technology sector, and a tourism economy fueled
        by proximity to Yellowstone National Park and world-class skiing. This guide covers industry
        composition, employment statistics, and what job seekers should know about working in the
        Gallatin Valley. For the full city profile, see
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
        {industries[0]?.pct ?? 26.5}% of all jobs. This concentration reflects the outsized role
        of Montana State University and Bozeman Health Deaconess Hospital as anchor institutions
        in the local economy. Professional services follow at roughly 14.6%, boosted by the city's
        expanding tech and consulting workforce, while retail trade holds a 12.9% share driven by
        both local demand and tourist spending.
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

      <h2>Major Employers</h2>
      <p>
        Montana State University is {townName}'s largest single employer with approximately 4,000
        faculty and staff. As a land-grant research university, MSU generates substantial downstream
        employment in student housing, food service, retail, and construction. The university's
        research expenditures — exceeding $200 million annually — fund hundreds of additional positions
        in laboratories, engineering centers, and agricultural research stations across the valley.
      </p>
      <p>
        Bozeman Health Deaconess Hospital is the second major employment anchor, providing a full
        spectrum of medical services to the Gallatin Valley and surrounding rural communities. The
        hospital and its network of clinics employ thousands of clinical, administrative, and support
        staff. Other notable employers include Kenyon Noble Lumber & Hardware, a regional building
        supply company headquartered in {townName}, and Simms Fishing Products, which designs and
        manufactures premium fly-fishing gear and has its global headquarters here.
      </p>

      <h2>Tech & Professional Services</h2>
      <p>
        {townName} has emerged as Montana's leading technology hub. The city's tech trajectory
        accelerated in the early 2000s when RightNow Technologies — a customer relationship management
        software company founded here — grew to over 1,000 employees before Oracle acquired it in
        2012. Oracle maintains a significant {townName} office to this day, and the talent pool that
        RightNow cultivated seeded dozens of startups and attracted other tech firms to the valley.
      </p>
      <p>
        Professional services represent{' '}
        {industries.find(i => i.name.includes('Professional'))?.pct ?? 14.6}% of employment,
        a share that has grown steadily with the rise of remote work. {townName} became one of the
        most prominent "Zoom towns" during and after the pandemic, attracting remote workers from
        the coasts who earn metropolitan salaries while enjoying the Gallatin Valley's quality of
        life. Co-working spaces, fiber internet buildout, and a growing startup ecosystem support
        this workforce. Zoot Enterprises, a financial technology company, is another homegrown tech
        employer with deep roots in the community.
      </p>

      <h2>Tourism & Outdoor Industry</h2>
      <p>
        Tourism is a cornerstone of {townName}'s economy, driven by the city's position as the
        busiest gateway to Yellowstone National Park — the north entrance at Gardiner is roughly
        80 miles south. Gallatin Field airport (BZN) has seen explosive growth, becoming one of the
        fastest-growing small airports in the country. Big Sky Resort, located 45 miles southwest,
        and Bridger Bowl, just 16 miles north, bring winter visitors, while summer draws fly fishers,
        hikers, rafters, and wildlife watchers.
      </p>
      <p>
        The outdoor recreation industry extends beyond tourism into manufacturing and retail.
        Companies like Simms Fishing Products, Mystery Ranch (backpacks and military gear), and
        Oboz Footwear have chosen {townName} for access to the landscapes that inspire and test
        their products. Hotels, restaurants, outfitters, and guide services round out a hospitality
        sector that peaks in summer but has become increasingly year-round as winter sports tourism
        and shoulder-season events expand.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 72.1}% significantly exceeds the national average of roughly
        62%, reflecting the city's young, highly educated population. The unemployment rate of{' '}
        {e?.unemploymentRate ?? 3.1}% is well below the national average, indicative of a tight labor
        market where employers often struggle to fill positions — particularly in hospitality,
        construction, and healthcare support roles.
      </p>
      <p>
        The university creates a dual labor dynamic: it supplies a steady pipeline of educated
        graduates, but many accept lower starting wages in exchange for {townName}'s lifestyle
        amenities — a phenomenon sometimes called the "mountain tax." Meanwhile, the influx of
        high-earning remote workers has pushed up housing costs, creating tension between wages in
        local-serving industries and the cost of living. For a detailed look at how wages align with
        expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Healthcare and education anchor the job market with stable, year-round positions at MSU and Bozeman Health.</li>
        <li>The tech sector offers competitive salaries, particularly at Oracle, Zoot Enterprises, and a growing cluster of startups.</li>
        <li>Remote workers can leverage {townName}'s quality of life while earning coastal-market wages — but competition for housing is fierce.</li>
        <li>Tourism and hospitality jobs are plentiful but often seasonal, with wages that may not keep pace with rising living costs.</li>
        <li>Construction and trades are in high demand as the valley's rapid population growth fuels residential and commercial building.</li>
        <li>For current openings, check the <a href="https://jobs.montana.edu" target="_blank" rel="noopener noreferrer">MSU careers page</a> and <a href="https://www.bozemanhealth.org/careers" target="_blank" rel="noopener noreferrer">Bozeman Health careers</a>.</li>
      </ul>
    </article>
  );
}
