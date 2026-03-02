import Link from 'next/link';

type Props = {
  townName: string;
  slug: string;
  schoolDistrict: string | null;
  schoolEnrollment: number | null;
  schoolWebsite: string | null;
  graduationRate: number | null;
  perPupilSpending: number | null;
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

export default function Schools({ townName, slug, schoolDistrict, schoolEnrollment, schoolWebsite, graduationRate, perPupilSpending, population }: Props) {
  return (
    <article className="content-section">
      <p>
        {townName} sits at the confluence of the Yellowstone and Tongue rivers in southeastern
        Montana{'\u2014'}a ranching town of {fmt(population)} that serves as the educational hub for
        Custer County and the surrounding region. {schoolDistrict ?? 'Custer County High School District'} serves
        approximately {fmt(schoolEnrollment)} students in a district where class sizes are small,
        teachers know every family, and school events are community events. What sets {townName}
        apart from most small Montana towns is Miles Community College{'\u2014'}a two-year institution
        that gives local students access to post-secondary education without leaving home and
        draws students from across the region with its nationally ranked NIRA rodeo program.
        For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '\u2014'}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'The Custer County school district'} operates a compact system that
        includes Custer County District High School (home of the Cowboys), Washington Middle
        School, Garfield Elementary, Highland Park Elementary, and Jefferson Elementary{'\u2014'}serving
        a total enrollment of approximately {fmt(schoolEnrollment)} students. Custer County
        District High School competes at the Class B level in Montana{'\u2019'}s athletic classifications,
        giving students ample opportunity to participate in football, basketball, volleyball,
        wrestling, track, rodeo, and other activities without being crowded out by the large
        rosters found at Class AA schools in Billings or Great Falls.
      </p>
      <p>
        The graduation rate stands at {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}{'\u2014'}a
        solid figure that reflects the community{'\u2019'}s investment in its schools. Per-pupil spending
        of {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'} is
        supported through local mill levies and state funding. Small class sizes are the defining
        advantage of Custer County schools{'\u2014'}teachers provide individualized attention, and
        students who struggle academically are identified and supported early rather than lost
        in large class counts.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district{'\u2019'}s
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Custer County District High School</h2>
      <p>
        Custer County District High School is the center of {townName}{'\u2019'}s youth culture and
        community identity. As a Class B school, the Cowboys field competitive teams across
        multiple sports, and Friday night football games, wrestling tournaments, and basketball
        season are woven into the rhythm of life here. Rodeo is especially significant{'\u2014'}in
        a town that hosts the Bucking Horse Sale each May, high school rodeo is not just a
        sport but a cultural institution, and many students compete in Montana High School
        Rodeo Association events.
      </p>
      <p>
        Beyond athletics, the school offers Career and Technical Education (CTE) programs that
        align with the local economy{'\u2014'}agriculture, welding, automotive technology, and health
        occupations prepare students for immediate employment or for continuing at Miles
        Community College. The school{'\u2019'}s connection to the ranching community means that
        agricultural education (FFA) has deep roots and strong participation, with students
        raising livestock, managing projects, and competing at state and national levels.
      </p>

      <h2>Miles Community College{'\u2014'}A Rare Small-Town Advantage</h2>
      <p>
        Miles Community College (MCC) distinguishes {townName} from most small Montana towns.
        A two-year public institution, MCC offers associate degrees, certificates, and transfer
        programs that feed into the University of Montana, Montana State University, and other
        four-year schools. For families, MCC means that a student can complete two years of
        college at a fraction of the cost of a university, living at home in {townName} or in
        affordable campus housing, before transferring to finish a bachelor{'\u2019'}s degree.
      </p>
      <p>
        MCC{'\u2019'}s nursing program is a direct pipeline to Holy Rosary Healthcare and other regional
        medical facilities{'\u2014'}graduates can enter the workforce immediately in one of {townName}{'\u2019'}s
        highest-paying sectors. Workforce training in welding, diesel mechanics, and agricultural
        technology serves the ranching and energy economies of eastern Montana. The college{'\u2019'}s
        NIRA rodeo team is nationally ranked and draws student athletes from across the West,
        adding energy and diversity to a campus that might otherwise feel isolated. For a town
        of 8,412 people, having a college{'\u2014'}even a small one{'\u2014'}is a meaningful quality-of-life
        advantage that affects everything from workforce development to cultural programming
        and community events.
      </p>

      <h2>Outdoor & Agricultural Education</h2>
      <p>
        {townName}{'\u2019'}s educational experience is shaped by its landscape. The Yellowstone and
        Tongue rivers converge at the edge of town, the surrounding prairie stretches to the
        horizon, and working cattle ranches begin at the city limits. This geography creates
        educational opportunities that classroom-only settings cannot replicate. FFA and 4-H
        programs are deeply embedded in the school culture, with students raising livestock,
        managing land, and learning agricultural business skills as part of their education.
      </p>
      <p>
        Hunting, fishing, and outdoor skills are part of growing up in {townName}{'\u2014'}many families
        hunt deer, antelope, and upland birds on the surrounding prairie, and the Yellowstone
        River provides walleye and catfish fishing within walking distance of schools. While
        {townName} lacks the dramatic mountain scenery of western Montana, the open landscape
        and working-ranch culture give students a connection to the land that is just as
        genuine and increasingly rare.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}{'\u2019'}s small size means private school options are limited. Sacred Heart
        Catholic School provides a faith-based elementary alternative. Homeschooling has a
        presence in the {townName} area, supported by cooperative groups and the Montana
        Digital Academy, which provides accredited online courses for students seeking
        coursework beyond what the district offers. Some families supplement public schooling
        with private tutoring or distance-learning programs.
      </p>

      <h2>Libraries & Lifelong Learning</h2>
      <p>
        The Miles City Public Library serves the community with physical and digital collections,
        children{'\u2019'}s programming, summer reading programs, and community meeting space. Miles
        Community College extends lifelong learning opportunities through continuing education
        courses, community workshops, and cultural events that serve residents well beyond
        traditional college age. The combination of a public library and a community college
        gives {townName} an intellectual infrastructure that many towns of similar size lack.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}{'\u2019'}s education system offers the strengths of
        a small, close-knit district{'\u2014'}a {graduationRate ?? 87}% graduation rate, small class
        sizes, strong community involvement, and the personal attention that larger districts
        struggle to provide. The presence of Miles Community College adds a dimension that most
        small Montana towns cannot match{'\u2014'}affordable post-secondary education, workforce
        training, and a campus that enriches community life. Rodeo culture, FFA, and agricultural
        education are deeply woven into the school experience, reflecting {townName}{'\u2019'}s identity
        as the Cow Capital of Montana.
      </p>
      <p>
        The trade-off is scale and distance. {townName} has one high school, limited AP course
        offerings compared to larger schools, and the nearest four-year university is in
        Billings (145 miles). But for families who value small-school culture, agricultural roots,
        genuine affordability, and a community where the school is the social center of town,
        {townName}{'\u2019'}s schools deliver. For housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
