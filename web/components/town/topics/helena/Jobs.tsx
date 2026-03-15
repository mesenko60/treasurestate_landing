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
        {townName} is Montana's state capital and the seat of Lewis and Clark County, giving it an
        employment profile unlike any other city in the state. With a population of {fmt(population)},
        the local economy is anchored by state government — thousands of workers staff the capitol
        complex, state agencies, and supporting offices — complemented by healthcare, federal agencies,
        and higher education. This combination produces a remarkably stable, non-seasonal job market
        that stands in sharp contrast to Montana's resort and tourism-driven towns. For the full city
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
        {industries[0]?.pct ?? 27.1}% of all jobs — driven by St. Peter's Health, Helena Public
        Schools, and Carroll College. Government follows at roughly 15.5%, a share that reflects
        {' '}{townName}'s role as the state capital: the Montana Legislature, executive agencies,
        and the state court system all operate from the capitol complex. Retail trade accounts
        for approximately 12.1%, serving both residents and the surrounding Lewis and Clark County.
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

      <h2>State Government — The Anchor Employer</h2>
      <p>
        The State of Montana is {townName}'s largest single employer by a wide margin. Thousands
        of workers staff the Montana State Capitol, the Department of Administration, the Department
        of Revenue, the Department of Natural Resources and Conservation, the Montana Highway Patrol,
        and dozens of other agencies clustered in and around the capitol complex. During legislative
        sessions — which convene biennially for 90 days in odd-numbered years — the city sees an
        additional influx of lawmakers, lobbyists, legislative staff, and journalists, boosting
        demand for lodging, dining, and services.
      </p>
      <p>
        Government employment provides {townName} with a level of economic stability that few Montana
        cities can match. State workers receive consistent salaries, benefits, and retirement packages
        regardless of tourism cycles, commodity prices, or housing market fluctuations. This public-sector
        anchor insulates the local economy from the sharp seasonal swings that affect resort communities
        like Whitefish and Big Sky, making {townName}'s unemployment rate — currently{' '}
        {e?.unemploymentRate ?? 3.1}% — one of the most consistently low in the state.
      </p>

      <h2>Healthcare & Federal Presence</h2>
      <p>
        St. Peter's Health is {townName}'s largest private employer, operating a full-service hospital,
        specialty clinics, and outpatient facilities that serve Lewis and Clark County and the
        surrounding region. The hospital employs hundreds of physicians, nurses, technicians, and
        administrative staff, and ongoing expansion projects continue to add positions in clinical
        and support roles.
      </p>
      <p>
        {townName} also hosts a significant federal workforce. The U.S. Forest Service maintains
        regional offices here, as does the Bureau of Land Management (BLM), the Department of
        Veterans Affairs (Fort Harrison VA Medical Center), and other agencies. Federal employment
        adds another layer of year-round economic stability and provides career opportunities across
        land management, environmental science, healthcare, and administration. NorthWestern Energy,
        headquartered in {townName}, is another major employer, providing utility services across
        Montana and South Dakota with a corporate office presence in the city.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 61.5}% reflects a workforce that skews toward government,
        healthcare, and professional services rather than seasonal or gig-economy work. The
        unemployment rate of {e?.unemploymentRate ?? 3.1}% indicates a tight labor market,
        particularly in healthcare, skilled trades, and IT. Because state government provides a
        large base of stable employment, {townName} does not experience the dramatic seasonal
        unemployment swings common in Montana's tourism-dependent communities.
      </p>
      <p>
        Carroll College — a private Catholic liberal arts institution with approximately 1,300
        students — contributes to the local workforce pipeline, particularly in nursing, engineering,
        and education. However, {townName} lacks a large public university, so employers seeking
        large-scale graduate recruitment often look to the University of Montana in Missoula (115
        miles west) or Montana State University in Bozeman (190 miles east). Remote work has grown
        in {townName}, aided by its relatively affordable housing compared to Bozeman and Missoula,
        and its proximity to outdoor recreation in the Helena National Forest and the Gates of the
        Mountains Wilderness.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>State government is the dominant employer — positions span administration, law enforcement, IT, environmental science, engineering, and legislative support, with openings posted on the <a href="https://mtstatejobs.taleo.net/" target="_blank" rel="noopener noreferrer">State of Montana careers portal</a>.</li>
        <li>Healthcare jobs at St. Peter's Health are consistently available across clinical, nursing, and administrative roles, making it the largest private employer in the city.</li>
        <li>Federal agencies — including the Forest Service, BLM, and the VA — offer additional public-sector career paths with competitive benefits and retirement packages.</li>
        <li>NorthWestern Energy provides utility-sector careers in engineering, operations, and corporate functions from its {townName} headquarters.</li>
        <li>{townName}'s economy is notably non-seasonal — unlike Whitefish, Big Sky, or other resort towns, employment here remains stable year-round thanks to the government and healthcare anchors.</li>
        <li>Lewis and Clark County government and Helena Public Schools round out the public-sector employment base, with openings in education, public safety, and municipal services.</li>
        <li>Carroll College is a smaller but valued employer and talent source, particularly for nursing and education graduates entering the local workforce.</li>
      </ul>
    </article>
  );
}
