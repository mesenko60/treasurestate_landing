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
        {townName} — Montana's largest city — operates the state's largest school district,{' '}
        {schoolDistrict ?? 'Billings Public Schools'}, and is the only city in Montana with three
        Class AA high schools. With a population of {fmt(population)} and an economy anchored by
        healthcare, energy, and finance, {townName}'s schools serve a diverse student body drawn
        from families across the economic spectrum. The district's scale allows for specialized
        programs, robust Career and Technical Education (CTE) pathways, and extracurricular
        opportunities that smaller Montana districts cannot match. Two local colleges — one public,
        one private — extend the education pipeline from K-12 through bachelor's and master's
        degrees. For the full city profile, see
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
        {schoolDistrict ?? 'Billings Public Schools'} serves approximately {fmt(schoolEnrollment)}{' '}
        students across a network of elementary schools, middle schools, and three comprehensive high
        schools — the only city in Montana with three Class AA programs. Billings Senior High School,
        the oldest of the three, carries decades of academic and athletic tradition as a cornerstone
        of the community. Billings West High School serves the city's west side and has built a
        reputation for strong academics and competitive athletics. Billings Skyview High School, the
        newest of the three, opened to accommodate growth on the city's west end and has quickly
        established its own identity. The three-school structure creates spirited crosstown rivalries
        — Senior Broncs, West Golden Bears, and Skyview Falcons — that energize the community on
        Friday nights throughout the fall.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, and per-pupil
        spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's investment in its schools through local mill levies and bond
        measures. As the state's largest district, {schoolDistrict ?? 'Billings Public Schools'}{' '}
        benefits from economies of scale that allow for specialized staffing, advanced coursework,
        and facilities that smaller Montana districts struggle to fund. The district also operates
        alternative education programs and an early childhood education center to serve students
        with varying needs.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        All three high schools offer Advanced Placement (AP) courses spanning English, mathematics,
        sciences, and social studies. Career and Technical Education (CTE) is a particular strength
        of {townName}'s school system — the district operates a dedicated Career Center that provides
        hands-on training in health sciences, welding, automotive technology, construction trades,
        information technology, and culinary arts. These programs connect directly to {townName}'s
        major employment sectors, giving students a pathway from the classroom into healthcare,
        energy, and skilled trades careers without leaving the city.
      </p>
      <p>
        The three-high-school structure gives families meaningful choice within the public system.
        Each school has developed its own academic culture and extracurricular strengths — from
        robotics and STEM clubs to award-winning fine arts and music programs. Dual-enrollment
        agreements with Montana State University Billings and Rocky Mountain College allow qualifying
        juniors and seniors to earn college credits while still in high school, reducing the time and
        cost of postsecondary education for students who stay in {townName}.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        Families in {townName} have access to several private school options, including faith-based
        schools that serve elementary and middle school students with smaller class sizes and
        values-centered curricula. Billings Central Catholic High School provides a private high
        school alternative, competing at the Class A level with a strong academic and athletic
        tradition. Homeschooling is well-established in the {townName} area, with cooperative groups
        that provide group instruction, field trips, and social activities. The Montana Digital
        Academy offers accredited online courses for homeschool families and students seeking
        coursework beyond what their local school provides.
      </p>

      <h2>Montana State University Billings</h2>
      <p>
        Montana State University Billings (MSUB) is {townName}'s public university — part of the
        Montana University System — with approximately 3,700 students. MSUB offers bachelor's and
        master's degrees across more than 60 programs in arts and sciences, business, education,
        health professions, and technology. The university's City College division is a dedicated
        two-year college that provides associate degrees and certificate programs in high-demand
        fields including nursing, diesel technology, welding, process plant technology, and
        information technology — programs designed to feed graduates directly into {townName}'s
        healthcare, energy, and industrial sectors.
      </p>
      <p>
        MSUB's affordability as a public institution makes it accessible to a broad range of
        students, including working adults, first-generation college students, and career changers.
        The Yellowjackets compete in NCAA Division II athletics, and the campus provides cultural
        events, guest lectures, and community engagement opportunities that enrich {townName}'s
        civic life. For a city of {townName}'s size, having a public university is a significant
        workforce development asset — it allows residents to earn degrees and credentials without
        relocating to Missoula or Bozeman.
      </p>

      <h2>Rocky Mountain College</h2>
      <p>
        Rocky Mountain College is {townName}'s private institution of higher education — an
        interdenominational liberal arts college with approximately 1,000 students. Founded in 1878,
        it is the oldest college in Montana and offers bachelor's and master's degrees across more
        than 70 programs, with particular strength in aviation, physician assistant studies, nursing,
        and outdoor recreation leadership. Rocky Mountain College's aviation program — which includes
        a fleet of training aircraft and an on-campus hangar — is one of the most respected in the
        Northern Rockies and draws students nationally.
      </p>
      <p>
        The Battlin' Bears compete in NAIA athletics, and the college's small size fosters close
        faculty-student relationships and a tight-knit campus community. Rocky Mountain College
        complements MSUB by offering a private liberal arts alternative, and together the two
        institutions give {townName} an educational breadth that no other Montana city outside of
        Missoula and Bozeman can match.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Billings Public Library serves {townName} and the surrounding area with a modern main
        branch downtown and the Lockwood Branch Library serving the eastern community. The library
        offers children's reading programs, digital literacy classes, maker spaces, community meeting
        rooms, and an extensive collection of physical and digital resources. The Parmly Billings
        Library — named after Frederick Billings, the city's namesake — has undergone significant
        renovations to serve as a 21st-century community resource.
      </p>
      <p>
        MSUB's continuing education programs, Rocky Mountain College's professional development
        offerings, and various community organizations provide non-credit courses, workforce training,
        and lifelong learning opportunities. GED preparation, English-language learning, and workforce
        development programs are available through local nonprofits and state agencies. Early
        childhood education options — including Head Start, private preschools, and daycare centers —
        serve the families of healthcare workers, energy-sector employees, and other professionals
        who make up {townName}'s diverse working population.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers Montana's largest
        school district with an {graduationRate ?? 82}% graduation rate, three Class AA high schools,
        strong CTE and AP programs, and the unique advantage of both a public university (MSUB) and
        a private college (Rocky Mountain College) within city limits. The three-school structure
        gives families meaningful choice and keeps class sizes manageable despite the district's
        scale. The dedicated Career Center provides vocational training that connects directly to
        {' '}{townName}'s major employers in healthcare, energy, and skilled trades.
      </p>
      <p>
        The presence of two colleges means that students who want to stay close to home for higher
        education have both an affordable public option and a selective private alternative —
        a combination available in no other Montana city of comparable size. Housing near the most
        sought-after schools tends to run above the city median. For details on housing by
        neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
