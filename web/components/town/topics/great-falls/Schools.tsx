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
        {townName} — Montana's third-largest city and home to Malmstrom Air Force Base — offers a
        K-12 education system built around {schoolDistrict ?? 'Great Falls Public Schools'}, one of
        the state's largest districts with approximately {fmt(schoolEnrollment)} students. Complemented
        by Great Falls College MSU and the University of Providence, the city provides educational
        pathways from kindergarten through four-year degrees. The military community shapes the
        schools in distinctive ways — from enrollment turnover to JROTC programs — giving {townName}'s
        education landscape a character unlike any other Montana city. For the full city profile, see
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
        {schoolDistrict ?? 'Great Falls Public Schools'} serves approximately {fmt(schoolEnrollment)}{' '}
        students across a network of elementary schools, middle schools, and two comprehensive high
        schools. Great Falls High School — the Bison — is the city's oldest high school and one of
        Montana's most storied, carrying decades of academic and athletic tradition. C.M. Russell High
        School — the Rustlers, named for legendary Western artist Charles M. Russell — opened to serve
        the city's growing east side, and the two schools have sustained one of Montana's fiercest
        crosstown rivalries. Both compete at the Class AA level, Montana's largest classification,
        and the annual Bison-Rustler showdowns in football, basketball, and track are defining events
        on the community calendar.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, which is somewhat
        below the Montana state average. This partly reflects the realities of a military community —
        families rotating in and out of Malmstrom Air Force Base every two to four years create
        enrollment churn that complicates cohort tracking and graduation-rate statistics. Students who
        transfer mid-year are counted against the originating school's completion metrics even when
        they graduate elsewhere. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's support for education through local mill levies and bond measures.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        Both Great Falls High School and C.M. Russell High School offer Advanced Placement (AP)
        courses across English, mathematics, sciences, and social studies. Career and Technical
        Education (CTE) programs are a significant strength, with pathways in health sciences,
        information technology, automotive technology, welding, and construction trades — fields that
        connect directly to {townName}'s healthcare, defense, and skilled-trades employment landscape.
        Dual-enrollment agreements with Great Falls College MSU allow qualifying juniors and seniors
        to earn college credits while still in high school, giving students a head start on
        postsecondary education.
      </p>
      <p>
        {townName}'s military community adds a distinctive dimension to school programming. Both high
        schools offer Junior Reserve Officers' Training Corps (JROTC) programs — a direct reflection
        of Malmstrom Air Force Base's presence — providing students with leadership training,
        discipline, physical fitness, and a pathway toward military service or ROTC scholarships at
        the college level. The schools also benefit from military-connected families who bring
        geographic diversity and broad life experience into classrooms, enriching the educational
        environment in ways unique among Montana districts.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        Families in {townName} have access to private school options that reflect the city's
        character. Several faith-based schools serve elementary and middle school students, offering
        smaller class sizes and values-centered curricula. The Catholic school tradition is
        well-established in {townName}, supported by the same community that sustains the University
        of Providence. Homeschooling is well-represented in the Great Falls area, with cooperative
        groups that provide group instruction, field trips, and social activities. The Montana Digital
        Academy offers accredited online courses for homeschool families and students seeking
        coursework beyond what their local school provides.
      </p>

      <h2>Great Falls College MSU</h2>
      <p>
        Great Falls College MSU is a two-year community college affiliated with Montana State
        University, serving as the city's primary institution for accessible, affordable postsecondary
        education. The college offers associate degrees, certificates, and workforce training programs
        with particular strength in nursing, health sciences, diesel technology, welding, cybersecurity,
        and trades — fields that align directly with {townName}'s largest employers. The nursing
        program is especially significant: graduates feed directly into Benefis Health System, the
        city's largest civilian employer, creating an efficient local pipeline from classroom to career.
      </p>
      <p>
        For students who are uncertain about a four-year degree or need to balance work and education,
        Great Falls College MSU provides an affordable on-ramp with small class sizes and hands-on
        instruction. Transfer pathways to Montana State University in Bozeman and other four-year
        institutions allow students to begin locally and complete bachelor's degrees without losing
        credits. The college also serves the military community — service members and military spouses
        use tuition assistance and GI Bill benefits to pursue credentials through the college's
        flexible scheduling and online course offerings.
      </p>

      <h2>University of Providence</h2>
      <p>
        The University of Providence — formerly the University of Great Falls — is a small private
        Catholic university with approximately 1,000 students. Founded by the Sisters of Providence,
        the university offers bachelor's and select master's degrees across liberal arts, sciences,
        education, and health-related fields. Its small size fosters close faculty-student
        relationships and a tight-knit campus culture. The Argos compete in NAIA athletics, and the
        university serves as a cultural and educational asset for a city that would otherwise lack a
        four-year institution.
      </p>
      <p>
        However, the University of Providence is a private institution with limited enrollment
        capacity, and {townName} does not have a large public university. Students seeking affordable
        four-year degrees or graduate programs must look to the University of Montana in Missoula
        (200 miles west) or Montana State University in Bozeman (185 miles southeast). This absence
        of a large public university distinguishes {townName} from both Missoula and Bozeman and
        shapes the city's educational profile around workforce-oriented training at Great Falls
        College MSU and the targeted programs at Providence.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Great Falls Public Library serves the city and surrounding area with a well-equipped main
        branch and community programming that includes children's reading programs, digital literacy
        classes, and meeting spaces. The library maintains a notable Montana Room collection focused
        on local history, including materials related to the Lewis and Clark expedition, the
        homesteading era, and the city's development as a military and industrial center along the
        Missouri River.
      </p>
      <p>
        Great Falls College MSU provides community education offerings, non-credit courses,
        professional development workshops, and workforce training for adult learners. GED
        preparation, English-language learning, and career-transition programs serve both long-term
        residents and incoming military families adapting to a new community. Early childhood education
        options — including Head Start, private preschools, and childcare centers — serve the families
        of military personnel, healthcare workers, and other professionals, though childcare
        availability is a persistent concern shared with communities across Montana.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers a large two-high-school
        district with {graduationRate ?? 79}% graduation rate, competitive per-pupil spending, strong
        CTE and JROTC programs, and the added dimension of a two-year college and small university.
        The crosstown rivalry between Great Falls High and C.M. Russell High gives both schools strong
        identities and keeps athletics and extracurriculars vibrant. Military families will find a
        community well-practiced in welcoming newcomers — school counselors, family readiness groups,
        and on-base support services are geared toward smooth transitions for children entering
        mid-year.
      </p>
      <p>
        The trade-off is a graduation rate that lags the state average — though much of this is
        attributable to military-related transfers rather than dropout rates — and the absence of a
        large public university for college-bound students. But many families view these as acceptable
        trade-offs for the stability, affordability, and strong sense of community that define
        {' '}{townName} during the formative K-12 years. Housing near the most sought-after schools
        tends to run above the city median. For details on housing by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
