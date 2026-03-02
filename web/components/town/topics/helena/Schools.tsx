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
  if (n == null) return '—';
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
        {townName} — Montana's state capital — offers a well-regarded K-12 education system anchored
        by {schoolDistrict ?? 'Helena Public Schools'}, complemented by Carroll College, the city's
        sole institution of higher education. With a population of {fmt(population)} and a stable
        economy rooted in state government and healthcare, {townName}'s schools benefit from a
        community that values public investment in education. The two-high-school structure, strong
        graduation rates, and career-focused programs make the district a genuine draw for families
        considering relocation to central Montana. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'Helena Public Schools'} serves approximately {fmt(schoolEnrollment)}{' '}
        students across a network of elementary schools, middle schools, and two comprehensive high
        schools. Helena High School, established in 1876, is one of the oldest continuously operating
        high schools in Montana and carries a deep tradition of academic and athletic excellence.
        Capital High School opened in 1976 to serve the city's growing south side, and the two
        schools have maintained a spirited crosstown rivalry — the Helena Bengals and the Capital
        Bruins — that defines Friday nights across the community. Both compete at the Class AA
        level, Montana's largest classification.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, above the national
        average and consistent with Montana's strong statewide performance in high school completion.
        Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's willingness to support education through local mill levies and bond
        measures. As the state capital, {townName}'s school district also benefits from proximity to
        the legislature — education policy decisions are made in the same city where their effects
        are felt, giving local educators and parents a direct voice in statewide education debates.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        Both Helena High School and Capital High School offer Advanced Placement (AP) courses
        spanning English, mathematics, sciences, and social studies. Career and Technical Education
        (CTE) programs are a particular strength of the district, with pathways in health sciences,
        information technology, automotive technology, welding, and construction trades — fields
        that connect directly to {townName}'s government, healthcare, and skilled-trades employment
        landscape. The district's CTE emphasis equips graduates for immediate workforce entry or
        further technical training.
      </p>
      <p>
        Both high schools field strong fine arts programs, including band, choir, theater, and visual
        arts. Helena's location as the state capital means students have unique opportunities for
        civic engagement — mock legislature programs, capitol internships, and proximity to state
        government provide experiential learning that few other Montana districts can match.
        Dual-enrollment agreements with Carroll College allow qualifying juniors and seniors to earn
        college credits while still in high school.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        Families in {townName} have access to private school options that reflect the city's
        character. Several faith-based schools serve elementary and middle school students, offering
        smaller class sizes and values-centered curricula. The Catholic tradition is particularly
        well-represented in {townName}, supported by the same community that sustains Carroll
        College. Homeschooling is well-established in the Helena area, with cooperative groups that
        provide group instruction, field trips, and social activities. The Montana Digital Academy
        offers accredited online courses for homeschool families and students seeking coursework
        beyond what their local school provides.
      </p>

      <h2>Carroll College</h2>
      <p>
        Carroll College is {townName}'s defining institution of higher education — a private Catholic
        liberal arts college with approximately 1,300 students. Founded in 1909 by the Roman Catholic
        Diocese of Helena, Carroll is consistently ranked among the top regional colleges in the
        West. The college offers bachelor's degrees across more than 35 majors, with particular
        strength in nursing, engineering, biology, and education. Carroll's nursing program feeds
        graduates directly into St. Peter's Health, {townName}'s largest private employer, creating
        an efficient local pipeline from classroom to career.
      </p>
      <p>
        Carroll's small size fosters close faculty-student relationships and a tight-knit campus
        culture. The Fighting Saints compete in NAIA athletics, and the football program has won
        multiple national championships. For a city of {townName}'s size, having a well-regarded
        four-year college is a meaningful asset — it provides cultural events, visiting speakers,
        athletic entertainment, and a steady stream of educated young adults who contribute to the
        local economy and civic life.
      </p>
      <p>
        However, Carroll is a private institution with tuition to match, and {townName} does not
        have a public university. Students seeking affordable four-year degrees or graduate programs
        must look to the University of Montana in Missoula (115 miles west) or Montana State
        University in Bozeman (190 miles east). This absence of a large public university
        distinguishes {townName} from both Missoula and Bozeman and shapes the city's workforce
        development strategy around government employment, healthcare training, and Carroll's
        targeted programs.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Lewis & Clark Library serves {townName} and the surrounding county with a main branch
        downtown and satellite locations in East Helena and the Augusta and Lincoln communities. The
        library offers children's reading programs, digital literacy classes, community meeting
        spaces, and an extensive collection of physical and digital resources. As the capital city's
        public library, it also maintains a strong Montana history and government documents
        collection.
      </p>
      <p>
        Carroll College's Community Education offerings and various community organizations provide
        non-credit courses, professional development workshops, and lifelong learning opportunities.
        GED preparation, English-language learning, and workforce development programs are available
        through local nonprofits and state agencies headquartered in {townName}. Early childhood
        education options — including Head Start, private preschools, and daycare centers — serve
        the families of state employees, healthcare workers, and other professionals who make up
        {' '}{townName}'s stable working population.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers a reliable two-high-school
        district with an {graduationRate ?? 88}% graduation rate, competitive per-pupil spending,
        strong CTE and AP programs, and the added dimension of Carroll College. The crosstown rivalry
        between Helena High and Capital High gives both schools strong identities and keeps athletics
        and extracurriculars vibrant. The state capital setting provides unique civic-education
        opportunities that no other Montana city can replicate.
      </p>
      <p>
        The trade-off is the absence of a large public university — college-bound students will
        eventually leave {townName} for Missoula, Bozeman, or out of state. But many families view
        this as an acceptable exchange for the stability, safety, and quality of life that define
        Montana's capital city during the formative K-12 years. Housing near the most sought-after
        schools tends to run above the city median. For details on housing by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
