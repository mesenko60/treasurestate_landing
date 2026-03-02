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
  if (n == null) return '\u2014';
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
        {townName} is a resort town of {fmt(population)} people whose economy revolves around
        Whitefish Mountain Resort, Glacier National Park tourism, and the hospitality and
        service industries that support them. Unlike Kalispell, the commercial hub 15 miles
        south, {townName}'s employment base is shaped by seasonal visitor traffic and a
        growing community of remote workers and retirees drawn by the lifestyle. This guide
        covers industry composition, employment statistics, and what job seekers should know
        about working in a mountain resort town. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Employment at a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Unemployment Rate</div><div style={cardValue}>{e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Labor Force</div><div style={cardValue}>{fmt(e?.laborForce ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Employed</div><div style={cardValue}>{fmt(e?.employed ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Participation Rate</div><div style={cardValue}>{e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Top Industry</div><div style={{ ...cardValue, fontSize: '0.95rem' }}>{e?.mainIndustry ?? '\u2014'}</div></div>
        {e?.jobScore != null && <div style={cardStyle}><div style={cardLabel}>Job Score</div><div style={cardValue}>{e.jobScore}/10</div></div>}
      </div>

      <h2>Industry Breakdown</h2>
      <p>
        {townName}'s employment spans {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'Education & Healthcare'}, accounting for{' '}
        {industries[0]?.pct ?? 21.1}% of jobs, a smaller share than in Kalispell or Missoula,
        reflecting {townName}'s relatively small institutional footprint. The school district
        and North Valley Hospital (part of Logan Health) are the primary employers in this
        sector. Retail follows at {industries[1]?.pct ?? 15.5}%, powered by boutiques,
        galleries, outdoor shops, and restaurants along Central Avenue and Highway 93.
        Professional services accounts for {industries[2]?.pct ?? 11.5}%, a category that has
        grown as remote workers with tech, consulting, and creative-industry jobs have
        relocated to {townName}.
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019-2023).
      </p>

      <h2>Major Employers</h2>
      <p>
        Whitefish Mountain Resort is {townName}'s defining employer, though its workforce
        fluctuates dramatically by season. During ski season (December through April), the
        resort employs hundreds of workers across lift operations, ski patrol, rental shops,
        restaurants, lodging, and snowmaking. Summer operations including mountain biking,
        the scenic chairlift, zip-line tours, and events retain a smaller but significant
        staff. The resort has been expanding year-round programming to reduce the seasonal
        gap, but the November and May shoulder periods still see significant layoffs.
      </p>
      <p>
        North Valley Hospital, part of the Logan Health system, provides year-round healthcare
        employment including emergency services, primary care, and specialty clinics. For
        major medical procedures and specialist care, patients travel to Kalispell Regional
        Healthcare (15 miles south), the Flathead Valley's largest employer. The Whitefish
        School District, local government, and the U.S. Forest Service (Tally Lake Ranger
        District) provide additional stable, year-round public-sector employment.
      </p>
      <p>
        The Central Avenue business district supports a dense cluster of small employers:
        restaurants, bars, galleries, boutiques, real estate agencies, and professional
        offices. Great Northern Brewing Company, one of Montana's established craft breweries,
        operates its brewery and tasting room in town. The construction and trades sector
        has expanded alongside the town's building boom, with residential remodeling and new
        construction providing strong demand for carpenters, electricians, and plumbers.
      </p>

      <h2>Tourism & Seasonal Economy</h2>
      <p>
        Tourism is the engine that drives {townName}'s economy. Winter revolves around
        Whitefish Mountain Resort, with over 3,000 skiable acres that attract skiers from
        across the Pacific Northwest, Midwest, and beyond. Central Avenue fills with visitors
        and the town's restaurants and bars operate at peak capacity from Christmas through
        March.
      </p>
      <p>
        Summer shifts the draw to Glacier National Park (17 miles northeast), Whitefish Lake,
        and the surrounding trail network. Glacier draws over 3 million visitors annually,
        and {townName} captures a significant share of their lodging, dining, and outfitting
        spending. River rafting outfitters, fishing guides, and mountain-biking operations
        add seasonal employment from June through September.
      </p>
      <p>
        The shoulder seasons, roughly October through November and April through May, are
        the economic soft spots. Hotels drop rates, some restaurants reduce hours or close
        temporarily, and seasonal employees may face gaps. The growing popularity of fall
        larch-tree hikes and spring skiing has started to fill some of this gap, but the
        seasonal swing remains a defining characteristic of {townName}'s job market.
      </p>

      <h2>Remote Work & New Economy</h2>
      <p>
        {townName} has become a magnet for remote workers, particularly since 2020. The
        combination of outdoor lifestyle, a walkable downtown with good coffee and coworking
        options, reliable internet, and daily Amtrak service has attracted professionals in
        tech, finance, consulting, and creative industries who earn coastal salaries while
        living in a mountain town. This influx has driven up housing prices and brought new
        spending power to the local economy, but it has also widened the gap between newcomer
        incomes and traditional local wages.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 67.3}% sits below both the Montana and national averages.
        This lower rate reflects the town's substantial retiree population and seasonal
        residents who are not in the workforce. Among working-age adults, the labor market
        is extremely tight: the {e?.unemploymentRate ?? 2}% unemployment rate is one of the
        lowest in Montana, and employers across hospitality, construction, and healthcare
        report persistent difficulty filling positions.
      </p>
      <p>
        The workforce challenge is compounded by housing costs. Workers who cannot afford
        {' '}{townName}'s $835K median home value or $2,400+/month rents increasingly commute
        from Kalispell or Columbia Falls. Some resort employers provide on-mountain housing
        for seasonal staff, but capacity is limited. Flathead Valley Community College in
        Kalispell (15 miles south) is the closest workforce-training institution, offering
        programs in nursing, skilled trades, and hospitality management.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Tourism and hospitality offer the most positions, but many are seasonal. Plan for reduced hours or layoffs in November and April through May.</li>
        <li>The {e?.unemploymentRate ?? 2}% unemployment rate means jobs are available, but housing is the bigger challenge. Securing affordable year-round housing should be a priority before accepting a position.</li>
        <li>Construction and skilled trades are in high demand as residential development and remodeling continue across the valley.</li>
        <li>Remote workers with out-of-state incomes are a growing segment. The town offers strong internet, walkability, and lifestyle appeal for location-independent professionals.</li>
        <li>Healthcare positions at North Valley Hospital and Kalispell Regional Healthcare (15 miles south) provide stable, non-seasonal employment.</li>
        <li>For current resort openings, check <a href="https://skiwhitefish.com" target="_blank" rel="noopener noreferrer">Whitefish Mountain Resort careers</a>.</li>
      </ul>
    </article>
  );
}
