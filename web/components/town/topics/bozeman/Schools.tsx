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
        {townName} offers families an exceptionally strong education system from preschool through
        graduate school, anchored by{' '}
        {schoolDistrict ?? 'the local public school district'} and Montana State University. With a
        population of {fmt(population)} and a deeply education-oriented culture, the city supports
        well-funded public schools, diverse private options, and one of the Mountain West's leading
        research universities. This guide covers K-12 schools, enrollment data, academic outcomes,
        and higher education opportunities in the Gallatin Valley. For the full city profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {schoolDistrict ?? `${townName}'s public school district`} (BSD7) serves approximately{' '}
        {fmt(schoolEnrollment)} students across the Gallatin Valley. The district operates multiple
        elementary schools, two middle schools — Sacajawea Middle School and Chief Joseph Middle
        School — and two comprehensive high schools. Bozeman High School, established in 1902, has
        long been the city's flagship secondary school. Gallatin High School opened in 2020 to
        accommodate the valley's rapid population growth, featuring state-of-the-art facilities and
        a modern campus on the city's west side.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, well above both
        the Montana state average and the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's strong investment in education, supported by local levies that
        consistently pass with broad voter support. The district's rapid enrollment growth — driven
        by {townName}'s population boom — has spurred significant construction of new schools and
        facility upgrades in recent years.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        {townName}'s high schools offer a broad range of Advanced Placement (AP) courses, career
        and technical education (CTE) programs, and extracurricular activities. Both Bozeman High
        and Gallatin High provide AP coursework in sciences, mathematics, humanities, and world
        languages, with participation rates that rank among the highest in Montana. The district's
        CTE programs include engineering, computer science, culinary arts, and agricultural sciences —
        the latter benefiting from close ties to Montana State University's College of Agriculture.
      </p>
      <p>
        Dual-enrollment partnerships with MSU allow high school juniors and seniors to earn college
        credits, giving motivated students a head start on higher education. The district also
        emphasizes outdoor education and environmental science, leveraging {townName}'s proximity
        to the Gallatin Range, Yellowstone, and the Gallatin River for hands-on field learning.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName} supports several private school options catering to different educational
        philosophies. Headwaters Academy offers an independent, project-based curriculum for grades
        6 through 12 with small class sizes and an emphasis on experiential learning. Petra Academy
        provides a classical Christian education through 12th grade, with a rigorous great-books
        curriculum. Mount Ellis Academy, a Seventh-day Adventist boarding school, serves students
        in grades 9–12 on a scenic campus southeast of town.
      </p>
      <p>
        At the elementary level, several Montessori programs and faith-based schools serve younger
        students. Homeschooling is also common in the {townName} area, with active co-op groups
        and the Montana Digital Academy providing online coursework for supplemental or full-time
        home-based education.
      </p>

      <h2>Montana State University</h2>
      <p>
        Montana State University (MSU) is a public land-grant research university with approximately
        16,000 students. Founded in 1893, MSU is {townName}'s intellectual and cultural cornerstone
        and one of the top research institutions in the Northern Rockies. The university is
        particularly renowned for its programs in engineering, architecture, film and photography,
        agriculture, computer science, and the natural sciences — fields that benefit from the
        Gallatin Valley's landscape and MSU's proximity to Yellowstone.
      </p>
      <p>
        MSU's presence shapes {townName} in profound ways — from Division I athletics (the Montana
        State Bobcats draw passionate support) to cultural events, guest lectures, and the Museum
        of the Rockies, which houses one of the world's largest collections of dinosaur fossils.
        The university is the city's largest employer, and its research expenditures of over $200
        million annually drive innovation and attract talent to the valley. MSU's engineering and
        computer science graduates feed directly into {townName}'s growing tech sector.
      </p>

      <h2>Gallatin College MSU</h2>
      <p>
        Gallatin College MSU, a two-year college within the Montana State University system, offers
        associate degrees and certificates in applied sciences, technology, health professions, and
        trades. Programs include nursing, construction technology, welding, IT and cybersecurity,
        and sustainable agriculture. For those not pursuing a four-year degree, Gallatin College
        provides direct pathways to employment in the region's high-demand fields — particularly
        healthcare, construction, and technology — with tuition rates significantly below those of
        the four-year university.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Bozeman Public Library, a modern facility on East Main Street, serves as a community
        education hub offering digital literacy classes, children's reading programs, maker-space
        access, and meeting rooms for community groups. The library's extensive collection and
        programming reflect {townName}'s highly educated population and culture of lifelong learning.
        MSU's Renne Library is open to community members for research purposes and hosts public
        lectures and exhibitions throughout the academic year.
      </p>
      <p>
        Several community organizations offer adult education, English-language learning, and
        professional development workshops. The Gallatin Valley's growing population has also
        spurred expansion of early childhood education options, including Head Start programs and
        private preschools.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system is one of the city's strongest
        draws. The combination of well-funded public schools with high graduation rates, diverse
        private and alternative options, and a major research university creates educational
        opportunities uncommon in cities of this size. The outdoor environment — surrounded by
        mountains, rivers, and national forest — provides natural laboratories for science education,
        while MSU brings visiting scholars, cultural performances, and Division I athletics that
        enrich the broader community.
      </p>
      <p>
        Housing costs near the most sought-after schools tend to run above the city median, and the
        valley's rapid growth has tightened the housing market considerably. For details on housing
        by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
