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
        {townName} offers a small, community-centered school system serving roughly{' '}
        {fmt(schoolEnrollment)} students in the Flathead Valley. The{' '}
        {schoolDistrict ?? 'Bigfork Public Schools'} district delivers strong academics with
        a {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate — among the
        highest in Montana — and a school score of 9.3 out of 10. Situated on the northeast shore
        of Flathead Lake with the Swan Range rising to the east and Jewel Basin Hiking Area just
        minutes away, {townName}'s students grow up with outdoor education opportunities that most
        districts can only dream of. The community's deep arts culture — more than 20 galleries, the
        Bigfork Summer Playhouse, and working studios on Electric Avenue — extends into the schools,
        enriching curriculum and extracurricular life. For families weighing a move to the Flathead
        Valley, {townName}'s schools combine intimate class sizes, excellent outcomes, and a setting
        that makes learning inseparable from the Montana landscape. For the full town profile, see
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
        The {schoolDistrict ?? 'Bigfork Public Schools'} district operates schools serving a
        close-knit community of {fmt(population)} people at the foot of the Swan Range. Bigfork
        High School — home of the Vikings — serves grades 9 through 12 and competes in Class B
        athletics, fielding particularly strong programs in alpine and Nordic skiing, cross-country
        running, and soccer, leveraging the valley's outdoor terrain. The Vikings identity reflects
        {townName}'s Scandinavian heritage and the community's connection to lake and mountain life.
        School pride runs deep — games and meets are well-attended community events.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        is well above the Montana state average of approximately 87%, reflecting both the community's
        commitment to education and the advantages of a small district where teachers know every
        student by name. With roughly {fmt(schoolEnrollment)} students across all grade levels, class
        sizes are genuinely small — allowing for individualized attention and mentoring that larger
        districts cannot replicate. The intimate scale means students have access to teachers before
        and after school, and no child falls through the cracks.
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

      <h2>Arts Integration</h2>
      <p>
        {townName}'s identity as one of the "100 Best Small Art Towns in America" extends directly
        into its schools. The community's vibrant arts scene — anchored by the Bigfork Summer
        Playhouse, more than 20 galleries, and a tradition of working artists — creates an
        environment where arts education is valued and supported at every level. Students benefit from
        theater programs that draw on the Playhouse's legacy, visual arts instruction enriched by
        proximity to professional artists, and a community that shows up for school concerts,
        exhibitions, and performances. This arts-immersive environment is a genuine differentiator
        for families who value creative development alongside traditional academics.
      </p>

      <h2>Outdoor and Place-Based Education</h2>
      <p>
        {townName}'s location provides extraordinary outdoor education opportunities that few
        districts in the country can match. Flathead Lake — the largest natural freshwater lake west
        of the Mississippi — is steps from town. The Jewel Basin Hiking Area, a 15,349-acre
        designated hiking area with 35 miles of trails and 27 alpine lakes, lies just east of town.
        The Swan River runs through the community, providing riparian habitat for ecological study.
        Science classes can conduct field work ranging from lake water-quality testing to alpine
        ecology, and physical education takes on new meaning when cross-country skiing, hiking, and
        paddling are accessible from campus.
      </p>
      <p>
        The surrounding landscape also supports environmental science and conservation curriculum:
        students can study Flathead Lake's ecology, the Cherry orchards that dot the east shore,
        wildfire management in the Swan Range, and the complex relationship between tourism,
        development, and natural resource preservation — all within their own backyard.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Flathead Valley Community College (FVCC) in Kalispell, just 17 miles northwest, is the
        nearest institution of higher education. FVCC offers two-year associate degrees, workforce
        certificates, and transfer pathways to four-year universities — an accessible and affordable
        option for {townName} graduates who want to begin college while remaining in the valley.
        Programs in nursing, business, trades, and information technology align with Flathead Valley
        employment needs.
      </p>
      <p>
        The University of Montana in Missoula, approximately 115 miles south, is the nearest
        comprehensive four-year university, offering the full range of undergraduate and graduate
        programs. Montana State University in Bozeman is roughly 230 miles southeast. Many{' '}
        {townName} graduates attend one of these flagship institutions before deciding whether to
        return to the Flathead Valley or pursue careers elsewhere. The Montana Digital Academy
        provides accredited online courses for students seeking advanced or specialized coursework
        not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a compelling draw.{' '}
        {schoolDistrict ?? 'Bigfork Public Schools'} operates a district where teachers know students
        by name, parent involvement is high, and the community rallies behind Viking athletics and
        school events. The {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        and 9.3 school score place {townName} among the top-performing small districts in Montana.
      </p>
      <p>
        {townName}'s greatest educational advantages are quality and setting: a high-performing small
        district in one of the most beautiful locations in the American West, with Flathead Lake,
        Jewel Basin, and the Swan Range as an extended classroom. The arts culture enriches student
        life in ways that larger, more conventional districts cannot match. The main trade-off is
        scale — advanced course offerings and extracurricular variety are more limited than in
        Kalispell or Missoula. For families who value small classes, strong outcomes, arts
        integration, and an unmatched outdoor setting, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
