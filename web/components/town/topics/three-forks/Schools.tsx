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
        {townName} offers a small, community-focused school system serving roughly{' '}
        {fmt(schoolEnrollment)} students in the heart of Gallatin County.
        The {schoolDistrict ?? 'Three Forks Public Schools'} district delivers strong academics with
        a {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate — among the
        highest in Montana — and{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'competitive'} per-pupil
        spending. With Montana State University just 31 miles east in Bozeman and the Missouri
        Headwaters at the town's doorstep, students grow up with both world-class higher education
        access and outdoor experiences rooted in one of the most historically significant landscapes
        in the American West. For families weighing a move, {townName}'s schools combine small-town
        values, genuine academic quality, and the affordability that Bozeman can no longer offer. For
        the full town profile, see
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
        The {schoolDistrict ?? 'Three Forks Public Schools'} district operates schools serving a
        tight-knit community of {fmt(population)} people at the confluence of three rivers. Three
        Forks High School — home of the Wolves — serves grades 9 through 12 and competes in Class
        B athletics, fielding competitive programs in football, basketball, wrestling, track, and
        cross-country. The Wolves identity reflects the rugged Montana landscape surrounding the
        town, and community pride around school athletics runs deep — games and school events draw
        the whole town.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        places it well above the Montana state average of approximately 87%, reflecting strong
        community investment in education and the advantages of a small, focused district. With
        roughly {fmt(schoolEnrollment)} students, class sizes are genuinely small — teachers know
        every student by name, and individualized attention is the norm rather than the exception.
        This is the defining advantage of schooling in a town of {fmt(population)}: students don't
        fall through the cracks.
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
        {townName}'s location at the headwaters of the Missouri River provides extraordinary outdoor
        education opportunities found nowhere else in Montana. Missouri Headwaters State Park — where
        the Jefferson, Madison, and Gallatin rivers converge — is a living classroom for geography,
        ecology, and American history. Lewis and Clark camped at this exact spot in July 1805, and
        Sacagawea recognized the landscape from her childhood among the Shoshone. This history is
        woven into the local curriculum, giving students a tangible connection to the Lewis and Clark
        expedition and the broader story of westward expansion.
      </p>
      <p>
        Lewis & Clark Caverns State Park, Montana's first state park, is 15 miles west and offers
        geology field trips through its limestone cavern system. The Madison, Jefferson, and Gallatin
        rivers provide hands-on learning in aquatic biology, fly fishing, and river ecology. The
        surrounding Gallatin and Madison valleys offer habitat studies, wildlife observation, and
        agricultural education. Few school districts in the country can match {townName}'s access to
        nationally significant natural and historical sites within a short drive of the schoolhouse.
      </p>

      <h2>Montana State University and Higher Education</h2>
      <p>
        Montana State University in Bozeman, just 31 miles east on Interstate 90, is the nearest
        four-year institution and one of Montana's flagship universities. MSU is nationally
        recognized for programs in engineering, agriculture, film, architecture, and the sciences —
        and its research output and campus resources rival universities many times its size. For
        {townName} students, MSU provides a major research university within commuting distance,
        making higher education accessible without the cost of relocating.
      </p>
      <p>
        Gallatin College MSU, the university's two-year affiliate, offers associate degrees and
        certificates in trades, healthcare, IT, and business — an accessible and affordable pathway
        for students seeking workforce-ready credentials. Dual-enrollment agreements may allow
        Three Forks High School juniors and seniors to begin earning college credits before
        graduation, getting a head start on higher education while still in their home community.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        For programs beyond Montana State's offerings, the University of Montana in Missoula is
        approximately 200 miles northwest, and Montana Tech in Butte is roughly 60 miles west. Montana
        Tech is particularly relevant for students interested in engineering, mining, environmental
        science, and the trades — fields that connect directly to {townName}'s industrial employers
        like CRH Cement and Imerys Talc. Many {townName} graduates attend MSU, Montana Tech, or UM
        before deciding whether to return to the Missouri Headwaters area or pursue careers elsewhere.
        The Montana Digital Academy provides accredited online courses for students seeking coursework
        not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is an outstanding choice.
        {schoolDistrict ?? ' Three Forks Public Schools'} operates a close-knit district where
        teachers know students by name, parent involvement is high, and the community turns out for
        Wolves games and school events. The{' '}
        {graduationRate != null ? `${graduationRate}%` : ''} graduation rate, combined with small
        class sizes and a school score of 9.4 out of 10, places {townName} among the top-performing
        small districts in the state.
      </p>
      <p>
        {townName}'s greatest educational advantages are location and access: Montana State University
        is 31 miles away, the Missouri Headwaters provide an outdoor classroom of national
        significance, and housing costs remain far below Bozeman's. The main trade-off is that the
        district is small — advanced course offerings and extracurricular variety are more limited
        than in Bozeman or Missoula. For families who value community, affordability, and a deep
        connection to Montana's landscape and history, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
