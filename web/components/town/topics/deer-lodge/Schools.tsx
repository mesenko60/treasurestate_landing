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
        {townName} offers a small, community-rooted school system serving roughly{' '}
        {fmt(schoolEnrollment)} students in the Deer Lodge Valley of Powell County.
        The {schoolDistrict ?? 'Deer Lodge Public Schools'} district provides an intimate learning
        environment with a {graduationRate != null ? `${graduationRate}%` : 'solid'} graduation rate
        and {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'committed'} per-pupil
        spending. With Montana Tech just 37 miles east in Butte, the University of Montana 80 miles
        west in Missoula, and Grant-Kohrs Ranch National Historic Site providing place-based
        education right in town, students grow up with both higher education access and hands-on
        learning in Montana history and ecology. For families weighing a move, {townName}'s schools
        combine small-town values, genuine community engagement, and the kind of personalized
        attention that only a small district can deliver. For the full town profile, see
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
        The {schoolDistrict ?? 'Deer Lodge Public Schools'} district operates schools serving the
        {townName} community of {fmt(population)} people. Deer Lodge High School — home of the
        Wardens — serves grades 9 through 12 and competes in Class B athletics, fielding programs
        in football, basketball, wrestling, track, and volleyball. The Wardens mascot reflects the
        town's deep connection to its correctional and frontier heritage, and community pride around
        school athletics is strong — games are a gathering point for the whole valley.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'solid'} graduation rate is
        slightly below the Montana state average of approximately 87%, reflecting the economic
        realities of a small, working-class community. With only {fmt(schoolEnrollment)} students
        across the entire district, class sizes are genuinely small — teachers know every student by
        name and can provide the kind of individualized attention that larger districts cannot match.
        Phil Jackson, the legendary NBA coach who led the Chicago Bulls and Los Angeles Lakers to 11
        championships, attended Deer Lodge High School and has spoken about how the small-town
        environment shaped his formative years.
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

      <h2>Outdoor and Place-Based Education</h2>
      <p>
        {townName}'s location in the broad Deer Lodge Valley provides extraordinary outdoor education
        opportunities. Grant-Kohrs Ranch National Historic Site, a working cattle ranch preserved by
        the National Park Service, offers ranger-led educational programs that bring Montana's ranching
        history to life for students. NPS interpretive staff regularly work with local schools on
        place-based learning — students can study ecology, history, and agricultural science on a
        ranch that has operated continuously since the 1860s.
      </p>
      <p>
        The surrounding landscape adds to the outdoor classroom: the Flint Creek Range to the west,
        the Clark Fork River running through the valley, and access to the Deerlodge National Forest
        provide settings for field biology, environmental science, and recreation education. Hunting,
        fishing, hiking, and cross-country skiing are part of the culture here — and for many
        students, these activities are woven into both formal and informal learning.
      </p>

      <h2>Grant-Kohrs Ranch as a Learning Resource</h2>
      <p>
        Few small towns in Montana have a National Historic Site within their city limits. Grant-Kohrs
        Ranch preserves the story of the open-range cattle industry that shaped the American West, and
        the National Park Service operates year-round educational programs on site. School field trips,
        junior ranger programs, and summer internships give {townName} students direct access to
        professional historians, ecologists, and land managers. This is place-based education at its
        best — students learn about their own community's history from the people who study and
        preserve it.
      </p>

      <h2>Montana Tech and Higher Education</h2>
      <p>
        Montana Technological University (Montana Tech) in Butte, 37 miles east via Interstate 90, is
        the nearest four-year institution. Montana Tech is nationally recognized for programs in
        mining engineering, petroleum engineering, geoscience, and environmental engineering — fields
        directly connected to the region's mining and natural resource heritage. The university also
        offers degrees in nursing, business, computer science, and liberal arts. For {townName}
        students, Montana Tech provides a four-year university within commuting distance, eliminating
        the need to relocate for higher education.
      </p>
      <p>
        Highlands College, Montana Tech's two-year affiliate, offers associate degrees and
        certificates in trades, nursing, IT, and business — an accessible and affordable pathway
        for students seeking workforce-ready credentials. Dual-enrollment agreements may allow
        Deer Lodge High School juniors and seniors to begin earning college credits before graduation.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        The University of Montana in Missoula, approximately 80 miles northwest on I-90, is the
        state's premier liberal arts and research university, offering a full range of undergraduate
        and graduate programs. Montana State University in Bozeman is roughly 120 miles east. Many
        {townName} graduates attend one of these universities or Montana Tech before deciding whether
        to return to the Deer Lodge Valley or pursue careers elsewhere. The Montana Digital Academy
        provides accredited online courses for students seeking coursework not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a genuine small-town
        asset. {schoolDistrict ?? 'Deer Lodge Public Schools'} operates a close-knit district where
        teachers know students by name, parent involvement is high, and the community turns out for
        Warden games and school events. The{' '}
        {graduationRate != null ? `${graduationRate}%` : ''} graduation rate and small class sizes
        mean students receive personalized attention that larger districts struggle to provide.
      </p>
      <p>
        {townName}'s greatest educational advantages are access and environment: Grant-Kohrs Ranch
        brings National Park Service education programs into the community, Montana Tech is within
        commuting distance, and the valley provides an outdoor classroom that few places can match.
        The main trade-off is that the district is very small — advanced course offerings and
        extracurricular variety are more limited than in Missoula or Bozeman. For families who value
        community, individualized attention, and a deep connection to Montana's ranching and frontier
        heritage, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
