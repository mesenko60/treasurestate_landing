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
        {townName} offers families a comprehensive education system from preschool through graduate school,
        anchored by {schoolDistrict ?? 'the local public school district'} and the University of Montana.
        This guide covers K-12 schools, enrollment data, academic outcomes, and higher education options
        in the {townName} area. For the full city profile, see
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
        {schoolDistrict ?? `${townName}'s public school district`} serves approximately{' '}
        {fmt(schoolEnrollment)} students across elementary, middle, and high school levels.
        The district operates multiple elementary schools, three middle schools (Washington,
        Meadow Hill, and C.S. Porter), and three comprehensive high schools{' '}—{' '}Sentinel,
        Hellgate, and Big Sky.
      </p>
      <p>
        The graduation rate stands at {graduationRate != null ? `${graduationRate}%` : 'a competitive level'},
        and per-pupil spending is {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'above the state average'},
        reflecting the community's investment in education. Montana as a whole ranks above the national
        average in per-pupil spending, and {townName}'s figure is consistent with that pattern.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        {townName}'s high schools offer a range of Advanced Placement (AP) courses, career and technical
        education (CTE) programs, and extracurricular activities. The district emphasizes outdoor
        education and environmental science, leveraging {townName}'s natural surroundings. Students
        have access to dual-enrollment courses through partnerships with the University of Montana,
        allowing high schoolers to earn college credits before graduation.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName} has several private school options including Loyola Sacred Heart High School
        (Catholic, founded 1877), Missoula International School (IB curriculum), and several
        Montessori programs at the elementary level. The Sussex School offers an independent
        progressive education through 8th grade. Home schooling is also common in the {townName}
        area, with several co-op groups providing resources and community.
      </p>

      <h2>University of Montana</h2>
      <p>
        The University of Montana (UM) is a public research university with approximately 10,000
        students. Founded in 1893, UM is {townName}'s cultural and intellectual anchor. Nationally
        recognized programs include creative writing, wildlife biology, journalism, environmental
        studies, and forestry. The university's location in the Northern Rockies provides unique
        field research opportunities unavailable at most institutions.
      </p>
      <p>
        UM's presence shapes the city in profound ways{' '}—{' '}from the cultural events and Division I
        athletics (the Montana Grizzlies) to the restaurants, shops, and housing market that cater
        to a student population. The university is also one of the city's major employers.
      </p>

      <h2>Missoula College</h2>
      <p>
        Missoula College, a two-year college within the University of Montana system, offers associate
        degrees and certificates in applied sciences, technology, and health professions. Programs
        include surgical technology, respiratory care, information technology, diesel technology,
        and culinary arts. For those not pursuing a four-year degree, Missoula College provides
        direct pathways to employment in the region's growing healthcare and technical sectors.
      </p>

      <h2>Continuing Education & Libraries</h2>
      <p>
        The Missoula Public Library, which opened its modern new building in 2021, serves as a community
        education hub offering digital literacy classes, children's programs, and access to technology.
        The university's Mansfield Library is also open to the public for research purposes.
        Several community organizations offer adult education, ESL classes, and professional
        development workshops.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s school system is a significant draw. The combination of
        well-funded public schools, diverse private options, and a research university creates educational
        opportunities uncommon in cities of this size. The outdoor environment provides natural laboratories
        for science education, and the university brings visiting speakers, cultural events, and athletic
        competitions that enrich the broader community.
      </p>
      <p>
        Housing costs near the best-regarded schools tend to run above the city median.
        For details on housing by area, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
