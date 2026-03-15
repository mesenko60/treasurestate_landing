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
        {townName} is the commercial and medical hub of Montana's Flathead Valley, serving a trade
        area that stretches from Whitefish and Columbia Falls to Bigfork and Lakeside. With a city
        population of {fmt(population)} and a broader valley population exceeding 100,000, the local
        economy blends healthcare, retail, tourism driven by Glacier National Park, and legacy
        industries like timber and agriculture. This guide covers industry composition, employment
        statistics, and what job seekers should know about working in the Flathead Valley. For the
        full city profile, see
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
        {industries[0]?.pct ?? 29.5}% of all jobs. This concentration reflects the dominant role of
        Kalispell Regional Healthcare — the Flathead Valley's largest employer — along with the
        school district and social service agencies that serve the broader region. Retail trade
        follows at roughly 15.1%, driven by {townName}'s role as the primary shopping destination
        for the entire valley, while tourism and hospitality contribute 11.3%, peaking sharply
        during the Glacier National Park summer season.
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
        Kalispell Regional Healthcare (KRH) is the valley's largest employer with approximately
        4,000 employees across its hospital campus, specialty clinics, and The HealthCenter
        facility. As the only Level II trauma center between Missoula and Spokane, KRH draws
        patients — and workers — from across northwestern Montana. The healthcare system is also
        the single most important year-round employer in a region where many other sectors
        experience seasonal fluctuations.
      </p>
      <p>
        Flathead County government and {townName}'s city government provide stable public-sector
        employment in administration, law enforcement, public works, and social services.
        Weyerhaeuser, one of the last major timber operations in the valley, maintains lumber
        manufacturing and forestry operations. CHS, a farmer-owned agricultural cooperative,
        operates grain facilities and an energy division. Glacier Bancorp, headquartered in
        {' '}{townName}, is a regional bank holding company with branches throughout the Northern
        Rockies and a significant corporate office presence in the city.
      </p>

      <h2>Tourism & Seasonal Economy</h2>
      <p>
        Glacier National Park — roughly 30 miles northeast — is the engine of {townName}'s tourism
        economy. Each summer, millions of visitors pass through the Flathead Valley, and many use
        {' '}{townName} as their base for lodging, dining, supplies, and outfitting. Glacier Park
        International Airport (FCA), located between {townName} and Glacier, provides direct
        flights from major U.S. hubs and has experienced strong passenger growth, supporting hotels,
        rental car agencies, and ground transportation services.
      </p>
      <p>
        The seasonal nature of Glacier tourism creates a pronounced employment surge from June
        through September. Hotels, restaurants, river outfitters, and guide services hire heavily
        for the summer months, while winter employment relies on nearby Whitefish Mountain Resort
        and cross-country skiing operations. The shoulder seasons — particularly October through
        November and March through May — see lower hospitality employment, which contributes to
        the valley's higher winter unemployment figures. Efforts to extend the tourist season
        through fall festivals, arts events, and winter recreation marketing have gained momentum
        but have not yet eliminated the seasonal employment gap.
      </p>

      <h2>Retail & Services</h2>
      <p>
        {townName} is the undisputed commercial center of the Flathead Valley. Residents of
        Whitefish, Columbia Falls, Bigfork, Lakeside, Somers, and surrounding rural communities
        drive to {townName} for grocery shopping, home improvement, medical appointments, and
        major retail purchases. This regional draw supports a retail sector that accounts for
        roughly 15.1% of local employment — well above the national average for a city this size.
      </p>
      <p>
        The Hutton Ranch Town Center and the strip along U.S. Highway 93 anchor the big-box
        retail landscape with stores like Walmart, Costco, Home Depot, and Target. Downtown
        {' '}{townName} offers a more curated mix of independent shops, galleries, breweries, and
        restaurants that cater to both locals and tourists. The service sector as a whole —
        including financial services, insurance, and real estate — has expanded as the Flathead
        Valley's population has grown, adding professional-class jobs that were once available
        only in larger Montana cities.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 65.6}% sits below both the Montana state average and the
        national average. This lower rate is not a sign of economic weakness but rather reflects
        the Flathead Valley's large and growing retiree population — many people relocate to the
        area specifically for retirement, drawn by the natural beauty, lower cost of living
        relative to West Coast cities, and access to outdoor recreation. Among working-age adults,
        participation is considerably higher.
      </p>
      <p>
        The unemployment rate of{' '}
        {e?.unemploymentRate ?? 3.6}% is low, reflecting a tight labor market particularly in
        healthcare, construction, and skilled trades. Unlike Bozeman, {townName} does not have a
        four-year university producing a steady flow of graduates, so workforce development depends
        heavily on Flathead Valley Community College (FVCC), which offers targeted programs in
        nursing, welding, IT, and other high-demand fields. Remote work has grown in the valley
        but remains less prevalent than in Bozeman, given {townName}'s economy is more oriented
        toward hands-on industries like healthcare, construction, and retail.
      </p>
      <p>
        For a detailed look at how wages align with expenses in the Flathead Valley, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Healthcare dominates the job market — Kalispell Regional Healthcare alone employs roughly 4,000 people and consistently has openings across clinical, administrative, and support roles.</li>
        <li>Retail and service-sector jobs are abundant because {townName} serves as the shopping hub for the entire Flathead Valley, not just its own residents.</li>
        <li>Tourism and hospitality offer plentiful summer employment driven by Glacier National Park, but many positions are seasonal — plan for reduced hours or layoffs in winter.</li>
        <li>Skilled trades — electricians, plumbers, carpenters, welders — are in high demand as residential and commercial construction continues across the valley.</li>
        <li>FVCC is the primary local pipeline for workforce training; its nursing and trades programs lead directly to employment at major valley employers.</li>
        <li>The timber and agricultural sectors still provide employment but have contracted significantly over recent decades — healthcare, services, and construction have absorbed much of that workforce.</li>
        <li>For current openings, check <a href="https://www.krh.org/careers" target="_blank" rel="noopener noreferrer">Kalispell Regional Healthcare careers</a> and <a href="https://www.flathead.mt.gov/human_resources/" target="_blank" rel="noopener noreferrer">Flathead County jobs</a>.</li>
      </ul>
    </article>
  );
}
