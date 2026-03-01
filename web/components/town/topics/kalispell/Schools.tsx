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
        {townName} provides a solid and improving K-12 education system anchored by{' '}
        {schoolDistrict ?? 'the local public school district'}, complemented by several private
        school options and Flathead Valley Community College — the region's primary institution of
        higher learning. With a population of {fmt(population)} and a broader valley that draws
        families seeking Montana's outdoor lifestyle, the school system plays a key role in making
        {' '}{townName} attractive for relocation. Unlike Bozeman or Missoula, the city does not
        have a four-year university, which shapes both the local culture and the workforce pipeline.
        For the full city profile, see
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
        {schoolDistrict ?? `${townName}'s public school district`} (SD5) serves approximately{' '}
        {fmt(schoolEnrollment)} students across elementary, middle, and high school campuses.
        The district is the largest in Flathead County and operates a network of neighborhood
        elementary schools, two middle schools, and two comprehensive high schools. Flathead High
        School, one of the largest high schools in Montana, has served the community since 1903
        and fields competitive athletics programs across Class AA sports. Glacier High School
        opened in 2007 to meet enrollment growth, offering modern facilities and a full slate of
        academic and extracurricular programs that quickly established its own identity and
        traditions.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, in line with the
        Montana state average and above the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects community commitment to education, supported by local mill levies. The district
        has invested in facility upgrades and technology infrastructure in recent years as Flathead
        Valley population growth has brought new families and increased enrollment pressure on
        existing schools.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        Both Flathead High School and Glacier High School offer Advanced Placement (AP) courses
        across core academic subjects, including AP English, AP Calculus, AP Biology, and AP U.S.
        History. Career and Technical Education (CTE) programs are particularly strong in the
        district, with pathways in welding, automotive technology, woodworking, culinary arts, and
        health sciences — fields that connect directly to the Flathead Valley's employment
        landscape. The district's CTE emphasis reflects a pragmatic approach to workforce readiness,
        preparing graduates for careers in healthcare, construction, and skilled trades alongside
        the college-preparatory track.
      </p>
      <p>
        Outdoor education is a natural fit in {townName}, where Glacier National Park is a
        30-minute drive from the classroom. Both high schools incorporate environmental science
        fieldwork, and the proximity to Flathead Lake — the largest natural freshwater lake west
        of the Mississippi — provides opportunities for aquatic biology and ecology studies.
        Dual-enrollment agreements with Flathead Valley Community College allow juniors and seniors
        to begin earning college credits before graduation.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        Families in {townName} have access to several private school options spanning different
        educational philosophies. Stillwater Christian School offers a K-12 Christian education
        with small class sizes, college-preparatory academics, and competitive sports programs.
        Valley Christian School provides elementary and middle school instruction rooted in
        faith-based values. Trinity Lutheran School serves younger students with a
        Lutheran-tradition curriculum emphasizing character development alongside academics.
      </p>
      <p>
        Homeschooling is well-established in the Flathead Valley, with active cooperative groups
        that organize field trips, science fairs, and group instruction. The Montana Digital
        Academy provides accredited online courses for homeschool families and students seeking
        coursework not available at their local schools. Several Montessori programs serve
        preschool and early elementary students in the {townName} area.
      </p>

      <h2>Flathead Valley Community College</h2>
      <p>
        Flathead Valley Community College (FVCC) is {townName}'s cornerstone institution of higher
        education. With approximately 2,200 students, FVCC offers associate degrees and
        certificates across liberal arts, sciences, business, and applied technology programs.
        The college's nursing program is among its most impactful — graduates feed directly into
        Kalispell Regional Healthcare, the valley's largest employer, creating a tight and
        efficient local pipeline from classroom to career.
      </p>
      <p>
        FVCC's trades programs in welding, machining, construction technology, and IT are closely
        aligned with the Flathead Valley's employment needs. The college also serves as a transfer
        institution, with articulation agreements that allow students to complete two years locally
        before transferring to the University of Montana (120 miles south in Missoula) or Montana
        State University in Bozeman. For working adults, FVCC provides evening, weekend, and
        online courses as well as workforce development training tailored to employer needs. The
        absence of a four-year university in {townName} makes FVCC the primary engine for local
        talent development — a role it fills effectively but one that also means bachelor's-level
        and graduate-level education requires leaving the valley.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Imaginary Nest Public Library, {townName}'s main public library, and the ImagineIF
        Library system serve the broader Flathead Valley with branches in Columbia Falls, Bigfork,
        and Marion. The {townName} branch offers children's reading programs, digital literacy
        classes, community meeting rooms, and a growing collection of digital resources. The
        library system reflects the valley's community-oriented culture and serves as a gathering
        point for lifelong learners, retirees, and families alike.
      </p>
      <p>
        FVCC's Community Education division provides non-credit courses ranging from art and
        photography to computer skills and personal finance. Several community organizations offer
        GED preparation, English-language learning, and professional development workshops. Early
        childhood education options — including Head Start, private preschools, and daycare
        centers — have expanded as young families continue to move to the Flathead Valley.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers a reliable and
        improving school district, practical workforce-training pathways through FVCC, and a
        selection of private schools that ensure families can find the right fit for their children.
        The school system is a genuine draw for relocating families — particularly those attracted
        by Montana's outdoor lifestyle — and both Flathead High and Glacier High have strong
        reputations in athletics, arts, and academics. The two-high-school structure provides
        healthy rivalry and ensures manageable school sizes despite the valley's growth.
      </p>
      <p>
        The absence of a four-year university means that college-bound students will eventually
        leave {townName}, but many families view this as a reasonable trade-off for the quality of
        life, safety, and natural beauty that define the Flathead Valley during the formative K-12
        years. Housing costs near the most sought-after schools tend to run above the city median.
        For details on housing by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
