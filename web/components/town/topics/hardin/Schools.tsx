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
        {townName} offers a culturally rich school system serving roughly{' '}
        {fmt(schoolEnrollment)} students in Big Horn County, on the edge of the Crow Indian
        Reservation in southeastern Montana. The {schoolDistrict ?? 'Hardin Public Schools'} district
        delivers education with a {graduationRate != null ? `${graduationRate}%` : '—'} district-wide
        graduation rate to one of Montana's most diverse student populations — 88% minority enrollment,
        primarily American Indian students from the Crow (Apsáalooke) community. While {townName} has
        no four-year college, Little Big Horn College, a tribal college at Crow Agency 14 miles south,
        and MSU Billings 46 miles west on I-90 provide higher education access. With the Little Bighorn
        Battlefield, Crow culture, and Big Horn County's open landscape as living classrooms, students
        grow up with place-based educational experiences rooted in both Native heritage and Montana's
        frontier history. For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Population</div><div style={cardValue}>{fmt(population)}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        The {schoolDistrict ?? 'Hardin Public Schools'} district operates schools serving the
        {' '}{townName} community of {fmt(population)} people, the county seat of Big Horn County.
        Hardin High School — home of the Bulldogs — serves approximately 540 students in grades 9
        through 12 and competes in Class A athletics, fielding programs in football, basketball,
        wrestling, track, and cross-country. The Bulldogs are a focal point of community pride, and
        game nights draw crowds from across the county.
      </p>
      <p>
        What distinguishes {townName}'s schools is the student body itself: 88% minority enrollment,
        predominantly American Indian students, makes this one of the most diverse districts in
        Montana. The student-teacher ratio of 17:1 is higher than Montana's statewide average of 12:1,
        and the district serves a large percentage of students eligible for free lunch — reflecting the
        economic realities of the community. The district-wide graduation rate
        of {graduationRate != null ? `${graduationRate}%` : '—'} trails the Montana state average of
        approximately 87%, but the community's investment in its students is genuine. Teachers and staff
        work to bridge cultural and economic gaps, and the district places strong emphasis on both
        athletics and cultural programs that honor students' Crow heritage.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the
          district website at{' '}
          <a href={`https://${schoolWebsite}`} target="_blank" rel="noopener noreferrer">
            {schoolWebsite}
          </a>.
        </p>
      )}

      <h2>Cultural and Place-Based Education</h2>
      <p>
        {townName}'s location creates educational opportunities found almost nowhere else in Montana.
        The Little Bighorn Battlefield National Monument, 14 miles south, preserves the site of the
        1876 battle between the U.S. 7th Cavalry and Lakota, Northern Cheyenne, and Arapaho forces —
        a pivotal event in American history that students can visit and study firsthand. The
        battlefield's National Park Service rangers and interpretive programs provide school groups with
        guided learning experiences that bring American Indian and frontier history to life.
      </p>
      <p>
        Crow culture is not an abstract curriculum topic in {townName} — it is the lived experience of
        most students. The annual Crow Fair, held each August near Crow Agency, is one of the largest
        Native American gatherings in North America, featuring traditional dance, rodeo, horse racing,
        and cultural ceremonies. The Big Horn County Historical Museum in {townName} preserves the
        region's layered history — from the Crow people's centuries of presence to the homesteader era
        and the development of the Bighorn Valley's agricultural economy. For students, this proximity
        to living cultural traditions and nationally significant historic sites creates a depth of
        place-based education that textbooks alone cannot provide.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Little Big Horn College, a two-year tribal college at Crow Agency approximately 14 miles south
        of {townName}, is the nearest post-secondary institution. Chartered by the Crow Tribe, it
        serves the Apsáalooke community and offers associate degrees in fields including education,
        business, human services, and Crow Studies — blending academic rigor with cultural preservation.
        Little Big Horn College is accredited and provides an affordable, culturally grounded pathway
        for students who want to begin their higher education close to home.
      </p>
      <p>
        For four-year programs, MSU Billings is approximately 46 miles west on I-90, offering
        undergraduate and graduate degrees in business, education, health sciences, and liberal arts.
        Rocky Mountain College, also in Billings, provides a private liberal arts option with strong
        pre-professional programs. The Montana Digital Academy provides accredited online courses for
        students seeking coursework not available locally.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        Little Big Horn College at Crow Agency, 14 miles south, is the closest institution — a
        two-year tribal college offering associate degrees and cultural education programs. MSU
        Billings, 46 miles west on I-90, is the nearest four-year university, offering programs in
        business, education, health sciences, and liberal arts. Rocky Mountain College in Billings
        provides a private liberal arts alternative with small class sizes and strong pre-professional
        tracks. Many {townName} graduates begin at Little Big Horn College or MSU Billings before
        transferring to larger institutions or entering the workforce — Billings' proximity gives
        {' '}{townName} students access to higher education options that many rural Montana communities
        lack.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system reflects the community it
        serves — deeply connected to Crow culture, shaped by the economic realities of rural Big Horn
        County, and committed to its students. The{' '}
        {schoolDistrict ?? 'Hardin Public Schools'} district operates a system where community
        involvement is strong and Bulldog athletics unite the town. The district-wide{' '}
        {graduationRate != null ? `${graduationRate}%` : ''} graduation rate is below the state
        average, but the district is working to close that gap through cultural engagement, mentorship,
        and community partnerships.
      </p>
      <p>
        {townName}'s greatest educational advantages are its cultural richness and proximity to
        nationally significant sites: the Little Bighorn Battlefield for American history, Crow Fair
        for living cultural traditions, and Little Big Horn College for accessible higher education
        rooted in Native identity. Big Horn County Memorial Hospital provides local healthcare, and
        Billings — Montana's largest city — is just 46 miles west for additional services. Housing
        costs are low compared to western Montana, and the community's connection to the land and its
        heritage gives students an education that extends far beyond the classroom.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
