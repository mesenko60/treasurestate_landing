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
  if (n == null) return '\u2014';
  return n.toLocaleString('en-US');
}

function pct(v: number | null): string {
  return v != null ? `${v}%` : '\u2014';
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
        {townName} is a lakeside town of {fmt(population)} on the southern shore of Flathead
        Lake{'\u2009'}{'\u2014'}{'\u2009'}the largest natural freshwater lake west of the Mississippi{'\u2009'}
        {'\u2014'}{'\u2009'}and sits entirely within the Flathead Indian Reservation, homeland of the
        Confederated Salish and Kootenai Tribes (CSKT). The local economy reflects this layered
        identity: tribal government, healthcare, retail commerce serving summer tourists, cherry
        orchards, and a school system that anchors year-round employment. With an unemployment rate
        of {pct(e?.unemploymentRate ?? 6.9)} and a labor force participation rate of just{' '}
        {pct(e?.laborForceParticipation ?? 56.2)}, {townName}{'\u2019'}s job market is shaped as much by
        seasonal rhythms and a sizable retiree population as by any single employer. For the full
        city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}{'\u2019'}s employment spans {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'Education & Healthcare'}, accounting for{' '}
        {industries[0]?.pct ?? 30.3}% of all jobs{'\u2009'}{'\u2014'}{'\u2009'}anchored by Providence
        St. Joseph Medical Center, Polson School District, and tribal education and health programs
        operated by the CSKT. Retail trade is an unusually large second sector at 21.5%, reflecting
        {townName}{'\u2019'}s role as the primary shopping destination for communities ringing Flathead
        Lake{'\u2019'}s southern and eastern shores and for the hundreds of thousands of summer visitors
        the lake attracts each year.
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019{'\u2013'}2023).
      </p>

      <h2>Major Employers {'\u2014'} Healthcare, Schools & Tribal Government</h2>
      <p>
        Providence St. Joseph Medical Center is {townName}{'\u2019'}s largest institutional employer
        and the primary healthcare facility for Lake County. The hospital provides emergency,
        surgical, obstetric, and outpatient services, and serves as the medical hub for
        communities from Ronan to Big Arm. With Education & Healthcare composing 30.3% of local
        employment, the hospital{'\u2019'}s clinical, nursing, and administrative workforce represents
        a critical mass of year-round, benefited jobs in a town where seasonal work is otherwise
        prevalent.
      </p>
      <p>
        Polson School District employs teachers, administrators, and support staff across its
        elementary, middle, and high schools, serving approximately 1,400 students. The district
        posts an 83% graduation rate and spends roughly $11,300 per pupil{'\u2009'}{'\u2014'}{'\u2009'}both
        figures in line with Montana averages. The Confederated Salish and Kootenai Tribes (CSKT)
        operate a tribal government complex in nearby Pablo and maintain offices, programs, and
        enterprises across the reservation that employ hundreds of people in administrative,
        natural-resource, cultural, and law-enforcement roles.
      </p>

      <h2>The Seasonal Economy {'\u2014'} Tourism on Flathead Lake</h2>
      <p>
        Tourism and Hospitality account for roughly 10.1% of {townName}{'\u2019'}s employment, but the
        sector{'\u2019'}s influence extends well beyond that headline number. From Memorial Day through
        Labor Day, Flathead Lake draws boaters, anglers, kayakers, and beachgoers from across the
        Northwest. The summer influx supports marinas, fishing guides, boat-rental outfits,
        restaurants, ice-cream shops, motels, vacation rentals, and the retail stores that line
        Main Street. The 16.9% housing vacancy rate in {townName} reflects the volume of seasonal
        and vacation homes ringing the lake.
      </p>
      <p>
        This seasonality is the single most important structural feature of {townName}{'\u2019'}s labor
        market. The 6.9% unemployment rate{'\u2009'}{'\u2014'}{'\u2009'}above Montana{'\u2019'}s statewide
        average{'\u2009'}{'\u2014'}{'\u2009'}partly reflects workers in tourism-dependent roles who experience
        gaps between the summer season and the quieter winter months. Retail{'\u2019'}s outsized 21.5%
        employment share is likewise inflated by tourist-serving businesses that scale up staffing
        in June and scale back in October. Workers who can bridge the off-season with alternative
        employment, remote work, or seasonal unemployment insurance fare best.
      </p>

      <h2>Tribal Economy {'\u2014'} CSKT and the Reservation</h2>
      <p>
        {townName} sits on the Flathead Indian Reservation, and the Confederated Salish and
        Kootenai Tribes are one of the most significant economic forces in the region. CSKT
        operates a tribal government headquartered in Pablo (15 miles south), managing natural
        resources across 1.3 million acres, operating the Salish Kootenai College (a tribally
        chartered institution offering associate and bachelor{'\u2019'}s degrees), running S&K
        Technologies (an aerospace and defense contractor), and overseeing tribal enterprises in
        forestry, fisheries, and cultural preservation. The tribes also manage the recently
        reacquired Seli{'\u0161'} Ksanka Qlispe{'\u2019'} Dam (formerly Kerr Dam), a 194-megawatt
        hydroelectric facility on the Flathead River just south of town{'\u2009'}{'\u2014'}{'\u2009'}a landmark
        achievement in tribal sovereignty and a source of revenue and employment.
      </p>
      <p>
        For job seekers, CSKT positions span a wide range: wildlife biologists, forestry
        technicians, educators, social workers, law enforcement, administrative staff, and
        skilled tradespeople. Many tribal positions carry Indian preference in hiring, but
        non-tribal members are employed throughout the reservation economy as well. Salish
        Kootenai College also generates teaching and administrative employment and provides
        local workforce training.
      </p>

      <h2>Agriculture {'\u2014'} Cherry Orchards and the Flathead Valley</h2>
      <p>
        Agriculture and Mining account for 3.3% of employment, but agriculture punches above
        its statistical weight in {townName}{'\u2019'}s identity and seasonal economy. The east shore
        of Flathead Lake is famous for its cherry orchards{'\u2009'}{'\u2014'}{'\u2009'}Flathead cherries are
        a regional delicacy, and the annual Flathead Cherry Festival in July is {townName}{'\u2019'}s
        signature cultural event. Cherry harvest season (typically July) brings seasonal picking
        jobs and supports roadside fruit stands, u-pick operations, and local food businesses.
      </p>
      <p>
        Beyond cherries, the broader Flathead Valley supports cattle ranching, hay production,
        and small-scale diversified agriculture. The agricultural sector is modest in employment
        terms but integral to the rural character and food economy of Lake County. For workers
        interested in agricultural employment, opportunities are concentrated in the summer and
        early fall harvest seasons.
      </p>

      <h2>Commuting Patterns {'\u2014'} Between Missoula and Kalispell</h2>
      <p>
        {townName} occupies a geographic midpoint on the US-93 corridor between Missoula (70
        miles south) and Kalispell (55 miles north){'\u2009'}{'\u2014'}{'\u2009'}two of Montana{'\u2019'}s largest
        labor markets. Some {townName} residents commute to Kalispell for jobs at Glacier Park
        International Airport, Kalispell Regional Healthcare, or Flathead Valley retail and
        service employers. Others drive south toward Missoula for university, hospital, or
        federal-agency employment. This two-directional commute pattern gives {townName} residents
        access to a broader job market than the town{'\u2019'}s own {fmt(e?.laborForce ?? 2442)}-person
        labor force would suggest, though winter driving conditions on US-93 through the Mission
        Valley can be challenging.
      </p>
      <p>
        The {pct(e?.laborForceParticipation ?? 56.2)} labor force participation rate is well below
        Montana{'\u2019'}s statewide average, but this figure reflects {townName}{'\u2019'}s demographics more
        than its economic health. A substantial share of the adult population consists of
        retirees drawn to Flathead Lake{'\u2019'}s beauty, seasonal residents who maintain primary
        employment elsewhere, and tribal members engaged in subsistence and cultural activities
        not captured in conventional labor statistics. For a detailed look at how wages align
        with living costs, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Providence St. Joseph Medical Center is {townName}{'\u2019'}s largest institutional employer{'\u2009'}{'\u2014'}{'\u2009'}clinical, nursing, and administrative roles are the most stable year-round employment in town.</li>
        <li>The Confederated Salish and Kootenai Tribes (CSKT) operate a broad range of government, natural-resource, education, and enterprise positions across the reservation, many based in nearby Pablo.</li>
        <li>Retail is unusually large at 21.5% of employment, driven by tourist-serving businesses on and around Flathead Lake{'\u2009'}{'\u2014'}{'\u2009'}but much of this work is seasonal, peaking June through September.</li>
        <li>The 6.9% unemployment rate is above Montana{'\u2019'}s average, partly reflecting seasonal tourism employment patterns rather than structural economic weakness.</li>
        <li>Cherry orchards and agriculture provide seasonal harvest work in summer, and the Flathead Cherry Festival anchors {townName}{'\u2019'}s cultural calendar each July.</li>
        <li>{townName} sits between the Missoula and Kalispell job markets on US-93{'\u2009'}{'\u2014'}{'\u2009'}commuting to either city expands employment options significantly.</li>
        <li>Salish Kootenai College in Pablo offers local higher education and workforce training, while the University of Montana (Missoula) and Flathead Valley Community College (Kalispell) are each within commuting distance.</li>
        <li>The {pct(e?.laborForceParticipation ?? 56.2)} participation rate reflects a large retiree and seasonal-resident population{'\u2009'}{'\u2014'}{'\u2009'}not a lack of opportunity for those actively seeking work.</li>
      </ul>
    </article>
  );
}
