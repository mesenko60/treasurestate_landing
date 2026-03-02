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
        {townName}'s school system punches well above its weight for a resort town of{' '}
        {fmt(population)} people. The {schoolDistrict ?? 'Whitefish School District'} delivers
        strong academics with a {graduationRate != null ? `${graduationRate}%` : 'high'} graduation
        rate and {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'competitive'} per-pupil
        spending, backed by a community that values education and has the tax base to fund it.
        Unlike Bozeman and Missoula, {townName} does not have a university in town, but families
        consistently cite the school system as a key reason for choosing this ski town over
        larger Montana cities. For the full town profile, see
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
        The {schoolDistrict ?? 'Whitefish School District'} serves approximately{' '}
        {fmt(schoolEnrollment)} students across a compact system that includes two elementary
        schools, one middle school, and Whitefish High School. The single-high-school structure
        means every student in town attends the same school, creating a strong sense of
        community identity and school spirit. Whitefish High competes in Class B athletics, a
        smaller classification than the Class AA programs in Kalispell and Missoula, which means
        smaller team sizes but high participation rates. Student-athletes often play multiple
        sports across seasons, and the ski team is a particular point of pride given the
        town's proximity to Whitefish Mountain Resort.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a strong level'}, well above both the
        Montana state average and the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        exceeds the Montana average, supported by a community that consistently passes school
        levies. The strong property-tax base, driven by high home values, gives the district
        funding resources that many rural Montana districts lack.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the
          district website at{' '}
          <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">
            {schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}
          </a>.
        </p>
      )}

      <h2>Academic Programs and Outdoor Education</h2>
      <p>
        Whitefish High School offers Advanced Placement (AP) courses across core subjects
        including AP English, AP Calculus, and AP Sciences. The school size of roughly 400
        to 500 students means AP class sizes are small, providing more individual attention
        than typical urban schools. Career and Technical Education (CTE) programs include
        woodworking, welding, and digital media, connecting students to practical skills
        relevant to the Flathead Valley construction, trades, and creative economies.
      </p>
      <p>
        Outdoor education is woven into the school culture in ways few districts can match.
        Glacier National Park is a 20-minute field trip from the classroom. The ski team
        trains at Whitefish Mountain Resort, and Nordic skiing programs use the network of
        groomed trails around the valley. Environmental science coursework draws on the
        immediate landscape: Whitefish Lake, the Whitefish River, and surrounding national
        forest lands serve as living laboratories. Dual-enrollment agreements with Flathead
        Valley Community College (15 miles south in Kalispell) allow juniors and seniors to
        begin earning college credits before graduation.
      </p>

      <h2>Private and Alternative Schools</h2>
      <p>
        {townName} has a small selection of private school options. Whitefish Christian Academy
        provides faith-based K-8 education with small class sizes. Several Montessori and
        alternative preschool programs serve younger children. Homeschooling is well-established
        in the Flathead Valley, with active cooperative groups organizing field trips, science
        fairs, and group instruction. The Montana Digital Academy provides accredited online
        courses for homeschool families and students seeking coursework not available locally.
      </p>
      <p>
        Families seeking additional private options often look to Kalispell (15 miles south),
        where Stillwater Christian School offers a K-12 Christian education with a larger
        student body and more comprehensive athletics and extracurricular programs. The short
        commute makes cross-town schooling practical for Flathead Valley families.
      </p>

      <h2>Higher Education</h2>
      <p>
        {townName} does not have a college or university campus, which is the most significant
        limitation for families and young adults seeking local higher education. The nearest
        institution is Flathead Valley Community College (FVCC) in Kalispell, 15 miles south.
        FVCC offers associate degrees and certificates in liberal arts, nursing, skilled trades,
        business, and IT. Its nursing program feeds directly into Logan Health and Kalispell
        Regional Healthcare, creating an efficient local pipeline from classroom to career.
      </p>
      <p>
        For four-year and graduate degrees, students leave the valley. The University of
        Montana is 130 miles south in Missoula, and Montana State University is in Bozeman
        (260 miles southeast). Many {townName} families view this as a reasonable trade-off:
        the quality of the K-12 experience, the outdoor lifestyle, and the safety of a small
        mountain town outweigh the eventual need to leave for college. Some graduates return
        after college, drawn back by the lifestyle and by the growing ability to work
        remotely while living in {townName}.
      </p>

      <h2>Libraries and Continuing Education</h2>
      <p>
        The Whitefish Community Library is a modern, well-funded facility that serves as a
        community hub. It offers children's reading programs, digital literacy classes,
        meeting rooms, and a growing collection of digital resources. The library's
        programming reflects {townName}'s engaged community, with author readings, film
        screenings, and educational workshops that are well-attended. FVCC's Community
        Education division in Kalispell provides non-credit courses in art, photography,
        computer skills, and personal finance for Flathead Valley residents.
      </p>

      <h2>Schools and Family Life</h2>
      <p>
        For families considering a move to {townName}, the school system is a genuine strength.
        The small-district environment means teachers know students individually, parent
        involvement is high, and the community rallies around school events and athletics.
        The graduation rate, per-pupil spending, and outdoor-education opportunities compare
        favorably with much larger Montana districts. The main consideration is cost: housing
        near {townName}'s schools ranks in the top 4% of the state. Families seeking the
        {' '}{townName} school experience at lower housing costs sometimes settle in Columbia
        Falls (9 miles east) or Kalispell, though each has its own school district.
      </p>
      <p>
        For details on housing by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
