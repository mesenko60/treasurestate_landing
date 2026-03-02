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
        {townName} offers a community-focused school system serving roughly{' '}
        {fmt(schoolEnrollment)} students in Teton County, at the gateway to the Rocky Mountain
        Front. The {schoolDistrict ?? 'Choteau Public Schools'} district delivers strong academics
        with a {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate and{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'competitive'} per-pupil
        spending. With world-class paleontology sites in the backyard, the Bob Marshall Wilderness
        to the west, and Freezout Lake 10 miles south, students grow up with outdoor and
        science-based educational experiences that few districts anywhere can match. For families
        weighing a move, {townName}'s schools combine small-town values, exceptional student-teacher
        ratios, and a natural classroom unlike any other — all at housing costs far below Montana's
        resort towns. For the full town profile, see
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
        The {schoolDistrict ?? 'Choteau Public Schools'} district operates schools serving a
        community of {fmt(population)} people in the heart of Teton County. The K-8 school enrolls
        approximately 240 students with 19.5 FTE teachers, producing an outstanding student-teacher
        ratio of roughly 12:1. Choteau High School — home of the Bulldogs — serves grades 9 through
        12 with approximately 107 students and 10 teachers, yielding an exceptional ratio near 11:1.
        The Bulldogs compete in Class C athletics, fielding programs in football, basketball,
        wrestling, track, cross-country, and volleyball. In a town of under 2,000, school athletics
        are a community gathering point — Friday night games draw much of {townName}.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        is well above the Montana state average of approximately 87%, reflecting the community's
        deep investment in education. With class sizes this small, teachers know every student by
        name and can provide individualized attention that larger districts cannot match. The
        trade-off is that course offerings and elective variety are more limited than in Bozeman or
        Missoula — but what {townName} lacks in breadth, it compensates with depth of mentorship
        and community support.
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

      <h2>Dinosaurs in the Backyard</h2>
      <p>
        Few school districts in the country can claim world-class paleontology sites within field
        trip distance. Egg Mountain, where Jack Horner discovered the first dinosaur eggs in the
        Western Hemisphere and the nesting behavior of Maiasaura, is just outside {townName}. The
        Old Trail Museum in town houses fossil collections and local history exhibits, serving as
        both a community museum and an educational resource for students. The Montana Dinosaur
        Center in Bynum, 13 miles north, offers hands-on dig programs and educational workshops
        that bring paleontology from textbook to trailhead. For science-minded students, growing
        up in {townName} means growing up surrounded by one of the richest dinosaur fossil records
        on Earth.
      </p>

      <h2>Outdoor and Place-Based Education</h2>
      <p>
        {townName}'s location at the edge of the Rocky Mountain Front provides extraordinary outdoor
        education opportunities. The Bob Marshall Wilderness — over 1.5 million acres of protected
        backcountry when combined with adjacent wilderness areas — begins just west of town.
        Freezout Lake Wildlife Management Area, 10 miles south, hosts up to 300,000 snow geese and
        thousands of tundra swans during spring migration, with over 230 documented bird species.
        Students have access to ecosystems ranging from shortgrass prairie to alpine tundra within
        a short drive.
      </p>
      <p>
        Wildlife biology, ecology, and conservation are not abstract concepts here — they are the
        landscape students see every day. Grizzly bears, elk, wolves, and mountain lions inhabit the
        Front Range west of town. This proximity to intact ecosystems creates a natural curriculum
        for environmental science, biology, and outdoor recreation that enriches classroom learning
        in ways that urban and suburban districts cannot replicate.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Great Falls College MSU, a two-year institution 60 miles southeast, is the nearest
        post-secondary option, offering associate degrees, certificates, and workforce training in
        nursing, trades, IT, and business. The University of Providence (formerly University of
        Great Falls), also in Great Falls, provides four-year degrees in a small-college setting.
        For {townName} students, Great Falls offers accessible higher education within commuting
        distance for motivated students willing to make the drive.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        Montana State University in Bozeman, approximately 120 miles south, is a major research
        university with strengths in engineering, agriculture, sciences, and the Honors College.
        The University of Montana in Missoula, roughly 180 miles southwest, offers a full range
        of liberal arts, journalism, forestry, and professional programs. Both are the state's
        flagship institutions. Many {townName} graduates attend one of these universities, Great
        Falls College MSU, or pursue vocational training before deciding whether to return to the
        Rocky Mountain Front or build careers elsewhere. The Montana Digital Academy provides
        accredited online courses for students seeking coursework not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a standout. The{' '}
        {schoolDistrict ?? 'Choteau Public Schools'} district operates a close-knit system where
        teachers know students by name, parent involvement is high, and the community turns out
        for Bulldog games and school events. The{' '}
        {graduationRate != null ? `${graduationRate}%` : ''} graduation rate, combined with
        student-teacher ratios near 12:1 at the elementary level and 11:1 at the high school,
        compares exceptionally well for a community of this size.
      </p>
      <p>
        {townName}'s greatest educational advantages are its natural setting and unique resources:
        dinosaur paleontology sites that serve as outdoor classrooms, the Bob Marshall Wilderness
        as a living laboratory, and Freezout Lake for wildlife studies — all within minutes of the
        school. Housing costs are a fraction of Montana resort towns, and the community's
        commitment to its schools is evident. The main trade-off is that the district is small —
        advanced course offerings, AP classes, and extracurricular variety are more limited than in
        larger Montana cities. For families who value community, individualized attention, and an
        education enriched by one of the most spectacular natural settings in the state,
        {' '}{townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
