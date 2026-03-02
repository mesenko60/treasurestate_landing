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
        {townName} sits at 5,568 feet in the shadow of the Beartooth Mountains{'\u2014'}a former
        coal-mining town of {fmt(population)} people that has reinvented itself around tourism,
        outdoor recreation, and the steady anchor of education and healthcare. Red Lodge Mountain
        ski area (4 miles west), the Beartooth Highway (15 miles south), and the town's role as a
        gateway to Yellowstone National Park via the northeast entrance define the seasonal rhythm
        of the local economy. With a labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 62.8}% and an unemployment rate of{' '}
        {e?.unemploymentRate ?? 4.1}%, {townName} offers a tight but distinctly seasonal job market
        where winter ski operations and summer highway tourism create pronounced peaks and valleys.
        For the full city profile, see
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
        {industries[0]?.pct ?? 20}% of all jobs{'\u2014'}anchored by Beartooth Billings Clinic, the
        primary healthcare provider for Carbon County, and the Red Lodge Public Schools district.
        Tourism and hospitality represent the next major block, driven by Red Lodge Mountain ski area,
        Beartooth Highway traffic, downtown Broadway Avenue's restaurants and shops, and the town's
        role as a staging point for Yellowstone-bound visitors. Retail trade, construction, and
        public administration round out the employment landscape in a community where nearly every
        sector connects, directly or indirectly, to the recreation economy.
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

      <h2>Red Lodge Mountain & the Tourism Economy</h2>
      <p>
        Red Lodge Mountain ski area is the single largest driver of {townName}'s seasonal economy.
        Located just 4 miles west of downtown, the ski area operates from early December through
        mid-April, employing lift operators, ski patrol, instructors, rental-shop staff, and food
        service workers. The ski area's presence ripples through the entire town{'\u2014'}lodging
        properties fill, restaurants and bars on Broadway Avenue see their busiest months, and
        retail shops selling gear and clothing operate at peak capacity.
      </p>
      <p>
        Summer brings the Beartooth Highway season, typically late May through mid-October depending
        on snow conditions at the 10,947-foot summit. Designated an All-American Road by the Federal
        Highway Administration, the Beartooth Highway draws motorcyclists, RV travelers, and scenic
        drivers from across the country, many of whom stop in {townName} for fuel, food, lodging,
        and supplies. The highway connects to Yellowstone National Park's northeast entrance at
        Cooke City (72 miles), making {townName} a natural overnight stop for park-bound visitors.
        Fishing guides, rafting outfitters, and horseback-riding operations add to the summer
        employment base, while downtown galleries, shops, and restaurants staff up for the warm-weather
        influx.
      </p>

      <h2>Healthcare & Education — Year-Round Anchors</h2>
      <p>
        Beartooth Billings Clinic is {townName}'s primary healthcare facility and one of the largest
        year-round employers in Carbon County. As a critical access hospital affiliated with the
        Billings Clinic system, it provides emergency care, primary care, and outpatient services
        that reduce the need for Carbon County residents to drive 60 miles to Billings for routine
        medical needs. Healthcare employment{'\u2014'}physicians, nurses, technicians, and
        administrative staff{'\u2014'}provides stable, benefits-eligible positions that counterbalance
        the seasonal patterns of the tourism sector.
      </p>
      <p>
        Red Lodge Public Schools employs teachers, staff, and administrators year-round, serving
        the district's K-12 students. Carbon County government offices in {townName} (the county
        seat) provide additional public-sector employment in administration, law enforcement, road
        maintenance, and social services. Together, healthcare, education, and county government
        form the stable employment core that keeps {townName} functioning as a year-round community
        rather than a pure seasonal resort.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force of {fmt(e?.laborForce ?? null)} is very small, reflecting the
        town's population of {fmt(population)}. The participation rate of{' '}
        {e?.laborForceParticipation ?? 62.8}% and unemployment rate of{' '}
        {e?.unemploymentRate ?? 4.1}% indicate a market where available workers are largely employed
        but a meaningful share of the population{'\u2014'}retirees, seasonal residents, and
        second-home owners{'\u2014'}sits outside the labor force entirely.
      </p>
      <p>
        Seasonal employment fluctuation is the defining characteristic of {townName}'s workforce.
        Ski season (December{'\u2013'}April) and Beartooth Highway season (late May{'\u2013'}mid-October)
        are the two hiring peaks. The shoulder months of April{'\u2013'}May and late October{'\u2013'}November
        bring quieter conditions, with some businesses reducing hours or closing temporarily.
        Workers who can bridge both seasons{'\u2014'}skiing in winter, guiding or hospitality in
        summer{'\u2014'}fare best. The proximity to Billings provides a commutable fallback for those
        seeking year-round employment with a larger employer base, though the 60-mile drive over
        open highway is a commitment, particularly in winter.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Beartooth Billings Clinic and Red Lodge Public Schools are the primary year-round employers, offering stable healthcare and education positions with benefits.</li>
        <li>Red Lodge Mountain ski area drives winter employment (December{'\u2013'}April) across hospitality, retail, food service, and ski operations.</li>
        <li>Beartooth Highway tourism fuels the summer economy (late May{'\u2013'}mid-October), with guiding, outfitting, restaurant, and lodging jobs peaking June through September.</li>
        <li>Carbon County government provides public-sector employment in {townName} as the county seat{'\u2014'}administration, law enforcement, and municipal services.</li>
        <li>Seasonal workers who can bridge ski and summer seasons have the best employment continuity; shoulder months bring reduced hours and closures.</li>
        <li>Billings (60 miles northeast) offers a diversified job market for commuters seeking year-round employment beyond {townName}'s tourism-dependent economy.</li>
        <li>Housing availability is a real constraint for workers{'\u2014'}the second-home and vacation-rental market limits year-round rental options in a town with {fmt(population)} residents.</li>
      </ul>
    </article>
  );
}
