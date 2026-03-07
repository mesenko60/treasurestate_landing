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
        {townName} is the county seat of Beaverhead County in southwestern Montana{'\u2014'}a
        ranching town of {fmt(population)} people tucked into the Beaverhead Valley where the
        Beaverhead River winds north toward its confluence with the Big Hole. The economy blends
        higher education, healthcare, agriculture, mining, and a growing tourism sector built
        around world-class fly fishing, hot springs, and proximity to Bannack State Park. With
        a {e?.unemploymentRate ?? 4.2}% unemployment rate and a labor force participation rate
        of {e?.laborForceParticipation ?? 61.2}%, {townName}{'\u2019'}s job market is characteristic
        of a small western Montana college town{'\u2014'}stable but modest, with the University of
        Montana Western and Barrett Hospital anchoring year-round employment. For the full city
        profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}{'\u2019'}s employment spans {industries.length > 0 ? industries.length : 'several'} major
        sectors. Education & Healthcare dominates at {industries[0]?.pct ?? 30.8}% of all
        jobs{'\u2014'}driven by the University of Montana Western and Barrett Hospital &
        Healthcare, the two institutions that employ the largest share of {townName}{'\u2019'}s
        workforce. Tourism & Hospitality accounts for {industries[1]?.pct ?? 20.3}%, reflecting
        the Beaverhead Valley{'\u2019'}s reputation as a fly-fishing destination and gateway to
        Bannack ghost town and several natural hot springs. Agriculture & Mining still
        represents 6.5% of employment{'\u2014'}significant for a town of this size and a reminder
        that Beaverhead County{'\u2019'}s ranching heritage and Barretts Minerals{'\u2019'} talc operation
        remain real economic forces.
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019{'\u2013'}2023).
      </p>

      <h2>University of Montana Western{'\u2014'}The Town{'\u2019'}s Anchor</h2>
      <p>
        The University of Montana Western is {townName}{'\u2019'}s largest institutional employer and
        the defining presence in the community. With approximately 1,284 students and a
        full complement of faculty, staff, and administrators, UM Western generates a steady
        flow of wages, housing demand, and consumer spending that ripples through the local
        economy. The university is nationally recognized for its Experience One program{'\u2014'}a
        block scheduling model where students take a single course at a time in intensive
        18-day blocks rather than juggling four or five courses simultaneously. This approach
        draws students from across the country who prefer immersive, hands-on learning.
      </p>
      <p>
        UM Western{'\u2019'}s academic programs reflect the landscape: education, equestrian studies,
        natural horsemanship, environmental science, and outdoor recreation are signature
        offerings that leverage {townName}{'\u2019'}s setting in the Beaverhead Valley. Faculty and
        staff positions at UM Western provide the kind of stable, benefited employment that
        is scarce in most rural Montana towns, and the university{'\u2019'}s presence supports
        everything from downtown restaurants and coffee shops to the rental housing market.
      </p>

      <h2>Barrett Hospital & Healthcare</h2>
      <p>
        Barrett Hospital and Healthcare is {townName}{'\u2019'}s critical-access hospital and the
        primary medical facility serving Beaverhead County. The hospital provides emergency
        services, inpatient care, surgical services, and outpatient clinics for a service area
        that stretches across one of Montana{'\u2019'}s largest and most sparsely populated counties.
        For a region where the next major hospital is in Butte (65 miles north), Barrett is
        indispensable.
      </p>
      <p>
        Healthcare positions{'\u2014'}physicians, nurses, physical therapists, lab technicians,
        imaging specialists, and administrative staff{'\u2014'}represent some of the best-compensated
        and most stable jobs in {townName}. Rural healthcare recruitment is a persistent
        challenge across Montana, and Barrett actively recruits for clinical and nursing
        positions. These roles typically come with full benefits, competitive salaries by
        rural standards, and the professional satisfaction of serving a community with genuine
        need.
      </p>

      <h2>Barretts Minerals & Industrial Employment</h2>
      <p>
        Barretts Minerals Inc., a subsidiary of Minerals Technologies, operates a talc mining
        and processing facility near {townName} that has been an industrial employer in
        Beaverhead County for decades. Talc from the Sweetwater Mine is processed locally and
        shipped to markets across the country for use in plastics, ceramics, paper, and
        personal care products. These mining and processing jobs pay well above the local
        median and provide industrial-sector employment that is uncommon in small southwestern
        Montana towns.
      </p>

      <h2>Ranching & Agricultural Economy</h2>
      <p>
        Beaverhead County was once Montana{'\u2019'}s largest wool-exporting region, and while the
        sheep industry has contracted, cattle ranching remains a pillar of the local economy.
        The valley{'\u2019'}s irrigated hay meadows and surrounding rangeland support cow-calf
        operations that have been running for generations, and {townName} serves as the
        supply, service, and auction center for ranchers across the county. Feed stores,
        veterinary clinics, livestock equipment dealers, and the Western Livestock Auction
        are all economic tributaries of the ranching industry.
      </p>
      <p>
        Great Harvest Bread Company{'\u2014'}the franchise headquartered in {townName}{'\u2014'}is an
        often-overlooked employer and a point of local pride. The company{'\u2019'}s national
        franchising headquarters operates from {townName}, generating management, marketing,
        and administrative employment that connects this small Montana town to a national
        retail network. It{'\u2019'}s an unusual corporate presence for a town of {fmt(population)}.
      </p>

      <h2>Tourism & Outfitting</h2>
      <p>
        Tourism accounts for roughly 20% of {townName}{'\u2019'}s employment and is growing. The
        Beaverhead River is one of Montana{'\u2019'}s premier trout streams, drawing fly anglers
        from across the country. Outfitting and guide services{'\u2014'}for fishing, hunting, and
        backcountry horseback trips{'\u2014'}provide seasonal employment that peaks from June through
        October. Bannack State Park, the preserved ghost town 25 miles west, draws history
        and photography enthusiasts. Nearby hot springs (Jackson, Elkhorn) add to the
        visitor draw.
      </p>
      <p>
        Hotels, restaurants, fly shops, and outfitter supply businesses in {townName} all
        depend on the summer and fall tourism season. While these jobs tend to be seasonal
        and lower-wage compared to healthcare or education, they provide employment
        opportunities for students, part-time workers, and entrepreneurs who build guide
        businesses and outdoor recreation companies.
      </p>

      <h2>Commuting & Regional Connections</h2>
      <p>
        {townName} sits 65 miles south of Butte along Interstate 15, and some residents
        commute to Butte for employment in mining, healthcare (St. James Healthcare), and
        Montana Tech-related positions. The drive takes roughly one hour{'\u2014'}manageable by
        rural Montana standards, though winter conditions on the interstate can be
        challenging. This Butte connection gives {townName} residents access to a broader
        job market without giving up the small-town lifestyle and lower cost of living
        that the Beaverhead Valley provides.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>The University of Montana Western is the largest employer{'\u2014'}faculty, staff, and administrative positions provide stable, benefited employment anchored by the distinctive Experience One block-scheduling program.</li>
        <li>Barrett Hospital & Healthcare offers clinical, nursing, and administrative roles serving all of Beaverhead County, with active recruitment for healthcare professionals.</li>
        <li>Barretts Minerals provides above-median industrial wages in talc mining and processing{'\u2014'}a rare industrial employer in southwestern Montana.</li>
        <li>Ranching remains foundational{'\u2014'}Beaverhead County{'\u2019'}s cattle industry drives feed, supply, veterinary, and auction employment throughout the valley.</li>
        <li>Great Harvest Bread Company headquarters brings national-franchise management and administrative jobs to a town of {fmt(population)}.</li>
        <li>Tourism and outfitting account for ~20% of jobs{'\u2014'}fly fishing guides, hunting outfitters, and hospitality businesses peak from June through October.</li>
        <li>Butte (65 miles) expands the job market for commuters willing to drive I-15{'\u2014'}mining, healthcare, and Montana Tech positions are accessible.</li>
        <li>The {e?.unemploymentRate ?? 4.2}% unemployment rate and {e?.jobScore ?? 9}/10 job score reflect a stable market where low cost of living stretches moderate wages. For the full cost picture, see our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.</li>
      </ul>
    </article>
  );
}
