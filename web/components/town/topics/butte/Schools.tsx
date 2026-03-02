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
        {townName}'s education story is inseparable from its identity as a blue-collar mining city
        that built one of the most respected engineering schools in the American West. With a
        population of {fmt(population)}, the city supports a K-12 system anchored by{' '}
        {schoolDistrict ?? 'Butte Public Schools'}, a private Catholic high school with deep community
        roots, and Montana Tech — the institution that defines {townName}'s higher education landscape
        and serves as its most powerful economic engine. For the full city profile, see
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
        {schoolDistrict ?? 'Butte Public Schools'} serves approximately {fmt(schoolEnrollment)}{' '}
        students across a network of elementary schools, middle schools, and one comprehensive public
        high school. Butte High School — home of the Bulldogs — competes at the Class A level,
        Montana's second-largest classification, reflecting {townName}'s position as a smaller city
        compared to Billings, Missoula, Great Falls, and Helena. The Bulldogs carry a fierce athletic
        tradition, particularly in football and wrestling, rooted in the same toughness that defined
        generations of mining families. Butte High's rivalry with crosstown Butte Central and regional
        opponents is a defining feature of community life.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, which sits below the
        state average and reflects the socioeconomic challenges of a community still navigating
        deindustrialization. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        demonstrates the district's commitment to investment despite a constrained tax base. The
        district has prioritized Career and Technical Education pathways that align with {townName}'s
        employment landscape — welding, electrical, heavy equipment operation, and healthcare
        preparation — giving graduates direct routes into local jobs.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Academic Programs & Specialties</h2>
      <p>
        Butte High School offers Advanced Placement (AP) courses in core academic areas alongside a
        robust Career and Technical Education (CTE) program that reflects {townName}'s working-class
        ethos. CTE pathways in welding, automotive technology, construction trades, and health
        sciences connect directly to the city's employer base — graduates can move into positions at
        Montana Resources, St. James Healthcare, NorthWestern Energy, and the building trades without
        leaving home. This practical orientation is a point of pride for a community that has always
        valued hands-on skill alongside academic achievement.
      </p>
      <p>
        Dual-enrollment agreements with Montana Tech and Highland College allow qualifying juniors and
        seniors to earn college credits while still in high school, creating an efficient bridge
        between K-12 and post-secondary education. Students interested in STEM fields can begin
        coursework at Montana Tech early, gaining exposure to the engineering and science programs
        that have made the university nationally known.
      </p>

      <h2>Butte Central Catholic</h2>
      <p>
        Butte Central Catholic High School is {townName}'s private school anchor — a Catholic
        institution with roots reaching back to the early mining era, when Irish, Italian, Croatian,
        and other immigrant communities built parishes and parochial schools alongside the mines.
        Butte Central competes at the Class B level in athletics and maintains a reputation for
        academic rigor, small class sizes, and strong college preparation. The school's alumni network
        runs deep in {townName} and across Montana, and its annual rivalry games against Butte High
        are among the most passionately attended events in the city.
      </p>
      <p>
        The Catholic school tradition in {townName} reflects the city's immigrant heritage — a
        heritage that also produced the labor unions, fraternal organizations, and community
        institutions that shaped {townName}'s character. For families seeking faith-based education
        with a strong sense of community identity, Butte Central offers a distinctive experience that
        is deeply interwoven with the city's history.
      </p>

      <h2>Montana Tech — The Defining Institution</h2>
      <p>
        Montana Tech — formally Montana Technological University — is {townName}'s most important
        educational institution and its single greatest economic asset. Founded in 1900 as the Montana
        School of Mines, Montana Tech was established to serve the booming copper industry that made
        {townName} the "Richest Hill on Earth." Over the past century, the university has evolved from
        a specialized mining school into a nationally recognized STEM-focused university with
        approximately 1,800 students, while retaining its founding strengths in geological,
        metallurgical, and mining engineering.
      </p>
      <p>
        Montana Tech's engineering programs — particularly mining engineering, petroleum engineering,
        geological engineering, and environmental engineering — are consistently ranked among the best
        in the nation for schools of its size. Recruiters from mining companies, energy firms,
        environmental consultancies, and tech companies visit campus regularly, and Montana Tech
        graduates command starting salaries that rival those from much larger universities. The
        university's petroleum engineering program, in particular, places graduates into positions
        across the Bakken Formation, the Permian Basin, and international operations.
      </p>
      <p>
        Beyond engineering, Montana Tech offers strong programs in computer science, data science,
        environmental science, nursing, and business. The campus sits on a hillside overlooking the
        city, with the Continental Pit visible to the east and the Highland Mountains to the south —
        a setting that constantly reminds students and faculty of the relationship between education,
        industry, and landscape that defines {townName}.
      </p>

      <h2>Highlands College</h2>
      <p>
        Highlands College — Montana Tech's two-year affiliate — provides technical and vocational
        programs that serve students seeking workforce-ready credentials without a four-year
        commitment. Programs in welding technology, nursing, information technology, business
        technology, and construction trades produce graduates who step directly into {townName}'s
        employer base. Highlands College is a critical component of the local education ecosystem,
        bridging the gap between high school CTE programs and full employment while offering an
        affordable pathway for students who may later transfer to Montana Tech's four-year programs.
      </p>

      <h2>Libraries & Continuing Education</h2>
      <p>
        The Butte-Silver Bow Public Library serves the consolidated city-county with a main branch
        and community programs that include children's reading initiatives, digital literacy courses,
        and access to Montana's interlibrary loan network. Montana Tech's library provides additional
        resources, particularly in science, engineering, and mining history — the university's
        archives contain some of the most comprehensive records of {townName}'s mining era available
        anywhere.
      </p>
      <p>
        Continuing education and workforce development programs are available through Montana Tech,
        Highlands College, and community organizations. GED preparation, adult basic education, and
        industry-specific certifications serve a population that includes workers transitioning from
        declining industries into growth sectors. Early childhood education options — including Head
        Start, private preschools, and daycare centers — serve families across {townName}'s income
        spectrum.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education landscape offers an honest trade-off.
        The K-12 system is solid but not flashy — a {graduationRate ?? 80}% graduation rate reflects
        real challenges, but the district's CTE programs and direct connections to local employers
        give graduates practical pathways that many wealthier districts cannot match. Butte Central
        provides a faith-based alternative with deep community ties. And Montana Tech is the wild
        card that elevates {townName}'s education profile far above what a city of this size would
        normally offer — a nationally ranked engineering school in a town of 34,000 is genuinely
        unusual, and families with STEM-oriented students will find opportunities here that exist
        nowhere else in Montana outside Bozeman.
      </p>
      <p>
        {townName}'s education ethos is blue-collar at its core — a community that respects hard work,
        practical skills, and the kind of toughness that comes from building a life in a mining city
        at 5,500 feet. That ethos permeates the schools, the sports culture, and the expectations
        that families and teachers hold for students. Housing near {townName}'s schools is among the
        most affordable in western Montana. For details on housing by neighborhood, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
