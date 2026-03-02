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
        {townName} is a blue-collar gateway town of {fmt(population)} people at the doorstep of
        Glacier National Park. For over 60 years the Columbia Falls Aluminum Company defined the
        local economy, employing hundreds and anchoring a manufacturing identity. When the smelter
        closed permanently in 2015, the town faced a pivotal transition — one it has navigated by
        leaning into tourism, construction, and the broader growth of the Flathead Valley. Today
        {townName}'s economy blends seasonal Glacier-driven tourism, a construction boom fueled by
        valley population growth, and stable public-sector employers including the Montana Veterans
        Home. This guide covers industry composition, employment statistics, and what job seekers
        should know about working in a town that has reinvented itself. For the full town profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}'s employment spans {industries.length} major sectors. Tourism & Hospitality
        leads at {industries[0]?.pct ?? 22.5}%, a dramatic shift from the manufacturing-centered
        economy of the aluminum-smelter era. Glacier National Park's 3+ million annual visitors
        drive lodging, dining, outfitting, and guide services across town. Education & Healthcare
        follows at {industries[1]?.pct ?? 14.5}%, anchored by the school district and proximity to
        Kalispell Regional Healthcare. Construction ranks third at {industries[2]?.pct ?? 13.5}%,
        well above the Montana average, reflecting the Flathead Valley's building boom as new
        residents arrive from higher-cost western states.
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

      <h2>Major Employers</h2>
      <p>
        The National Park Service and U.S. Forest Service are among {townName}'s most visible
        employers. Glacier National Park headquarters sits just northeast of town, and the park
        employs hundreds of seasonal rangers, maintenance workers, and administrative staff each
        summer. Park concessioners — the companies that operate lodges, restaurants, gift shops, and
        tour buses inside Glacier — hire additional hundreds of seasonal workers, many of whom live
        in {townName} or nearby. The Flathead National Forest's Hungry Horse Ranger District is also
        based near town, providing year-round forestry and fire-management positions.
      </p>
      <p>
        The Montana Veterans Home, a state-run long-term care facility for veterans, is one of
        {townName}'s most important year-round employers, providing stable healthcare, nursing, and
        administrative jobs that are not subject to seasonal swings. Columbia Falls School District
        #6 employs teachers, administrators, and support staff across four campuses. Local government
        and Flathead County services add additional public-sector positions.
      </p>
      <p>
        Meadow Lake Golf Resort and Big Sky Waterpark contribute seasonal hospitality employment
        during the summer months. The Gateway to Glacier infrastructure project, a roughly $10
        million investment in downtown revitalization, streetscaping, and visitor amenities, has
        generated construction jobs and is expected to sustain commercial employment as new
        businesses fill the upgraded corridor.
      </p>

      <h2>The Aluminum Legacy</h2>
      <p>
        The Columbia Falls Aluminum Company operated for over 60 years, at its peak employing
        roughly 1,000 workers with wages well above the regional average. The smelter's closure in
        2015 removed the town's single largest private employer and ended an era in which a
        blue-collar worker could earn a middle-class living without leaving town. The transition was
        painful — job losses rippled through the supply chain, local businesses lost customers, and
        the town's identity as a smelter community dissolved almost overnight.
      </p>
      <p>
        What followed was a gradual pivot. Tourism, already growing thanks to Glacier's rising
        visitation numbers, expanded to fill much of the employment gap. Construction boomed as
        Flathead Valley's population surged. The smelter site itself remains a brownfield
        remediation project, and its future redevelopment may eventually bring new economic activity
        to the property. Manufacturing still accounts for {industries.find(i => i.name === 'Manufacturing')?.pct ?? 6.9}%
        of jobs — primarily wood products and small-scale manufacturing — but it is a fraction of
        what it once was.
      </p>

      <h2>Tourism Economy</h2>
      <p>
        Tourism is now {townName}'s top industry at {industries[0]?.pct ?? 22.5}% of employment.
        Glacier National Park is the draw — over 3 million visitors annually pass through or near
        {townName} en route to the park's west entrance. River rafting outfitters on the Flathead
        River, fishing guides, and trail-ride operations add seasonal employment from June through
        September. Hotels, motels, vacation rentals, and RV parks fill to capacity during peak
        summer months.
      </p>
      <p>
        The seasonal nature of Glacier tourism creates a pronounced employment swing. Summer is
        booming, with nearly every hospitality operation at full staffing. Winter is quieter —
        {townName} lacks its own ski resort, though Whitefish Mountain Resort is 16 miles west and
        some residents work there seasonally. The shoulder seasons of October through November and
        April through May are the softest periods, when some businesses reduce hours and seasonal
        workers face gaps.
      </p>

      <h2>Construction Boom</h2>
      <p>
        At {industries.find(i => i.name === 'Construction')?.pct ?? 13.5}% of employment,
        construction is one of {townName}'s standout sectors, significantly above the Montana
        average. The Flathead Valley has experienced sustained population growth as remote workers,
        retirees, and families from higher-cost West Coast markets relocate to northwestern Montana.
        {townName}, with lower housing costs than Whitefish or Kalispell, has absorbed a significant
        share of new residential construction. Subdivision development, custom home building, and
        remodeling projects provide steady demand for carpenters, electricians, plumbers, and
        general contractors.
      </p>
      <p>
        Commercial construction has also expanded with new lodging properties, retail spaces, and
        the Gateway to Glacier downtown project. For workers in the building trades, {townName}
        offers more affordable housing than Whitefish while remaining within the valley's active
        construction market.
      </p>

      <h2>Commuting Patterns</h2>
      <p>
        {townName} sits at the nexus of the Flathead Valley's commuter network. Kalispell is 15
        miles south and Whitefish is 16 miles west — both within a 20-minute drive. Many {townName}
        residents commute to Kalispell for jobs at Kalispell Regional Healthcare, retail centers
        along Highway 93, or Flathead County government offices. Others commute to Whitefish for
        resort and hospitality employment. Conversely, some Kalispell and Whitefish workers commute
        to {townName} for park-related, manufacturing, or Veterans Home positions.
      </p>
      <p>
        This interconnected labor market means job seekers in {townName} effectively have access to
        the entire Flathead Valley's employment base. The trade-off is that wages are set by valley
        standards while {townName}'s housing costs, though lower than Whitefish, have risen sharply
        alongside regional growth.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Tourism and hospitality offer the most positions, but the majority are seasonal — plan for reduced hours or layoffs from October through May.</li>
        <li>Construction and skilled trades are in high demand as the Flathead Valley's building boom continues. Carpenters, electricians, and plumbers can find steady year-round work.</li>
        <li>The National Park Service, U.S. Forest Service, and Glacier concessioners hire hundreds of seasonal workers each summer — applications typically open in January and February for summer positions.</li>
        <li>The Montana Veterans Home and school district provide stable, non-seasonal public-sector employment.</li>
        <li>Manufacturing persists at roughly {industries.find(i => i.name === 'Manufacturing')?.pct ?? 6.9}% of jobs, primarily in wood products, a legacy of the valley's timber heritage.</li>
        <li>{townName}'s location between Kalispell and Whitefish gives residents access to valley-wide employment without the higher housing costs of those towns.</li>
        <li>For current NPS openings, check <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>. For Veterans Home positions, see the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
