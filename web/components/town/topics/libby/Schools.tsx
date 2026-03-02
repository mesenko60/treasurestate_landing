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
        {fmt(schoolEnrollment)} students in Lincoln County, in Montana's rugged northwest corner at
        the confluence of Libby Creek and the Kootenai River. The {schoolDistrict ?? 'Libby Public Schools'} district
        delivers strong academics with a {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate and {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'} per-pupil spending.
        With the Cabinet Mountains, Kootenai River, and Lake Koocanusa as outdoor classrooms,
        students grow up with wilderness-based educational experiences that few districts anywhere
        can match. For families weighing a move, {townName}'s schools combine small-town values,
        individualized attention, and a natural setting unlike any other — all at housing costs far
        below Montana's resort towns. For the full town profile, see
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
        The {schoolDistrict ?? 'Libby Public Schools'} district operates schools serving a
        community of {fmt(population)} people in the heart of Lincoln County. The district enrolls
        approximately {fmt(schoolEnrollment)} students across elementary, middle, and high school
        grades. In a town surrounded by over 2 million acres of wilderness, school athletics and
        outdoor programs are central to community life. The district's {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate reflects the community's investment in education. With class sizes this small, teachers
        know every student by name and can provide individualized attention that larger districts
        cannot match. The trade-off is that course offerings and elective variety are more limited
        than in Bozeman or Missoula — but what {townName} lacks in breadth, it compensates with
        depth of mentorship and community support.
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
        {townName}'s location in Montana's northwest corner provides extraordinary outdoor
        education opportunities. The Cabinet Mountains Wilderness — 94,360 acres of pristine
        backcountry — offers hiking, backpacking, and mountaineering. The Kootenai River, which
        runs through town, is world-class trout water and a living laboratory for ecology and
        fisheries studies. Lake Koocanusa, the 90-mile reservoir created by Libby Dam, provides
        water-based education and recreation. Ross Creek Cedars Scenic Area features ancient
        western red cedars over 1,000 years old.
      </p>
      <p>
        Wildlife biology, ecology, and conservation are not abstract concepts here — they are the
        landscape students see every day. Grizzly bears, elk, mountain goats, and other wildlife
        inhabit the Cabinet Mountains east of town. This proximity to intact ecosystems creates a
        natural curriculum for environmental science, biology, and outdoor recreation that
        enriches classroom learning in ways that urban and suburban districts cannot replicate.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Flathead Valley Community College in Kalispell, approximately 90 miles southeast, is the
        nearest two-year institution, offering associate degrees, certificates, and workforce
        training in nursing, trades, IT, and business. The University of Montana in Missoula,
        roughly 150 miles south, offers a full range of liberal arts, journalism, forestry, and
        professional programs. For {townName} students, both are accessible for motivated students
        willing to make the drive or relocate for post-secondary education. The Montana Digital
        Academy provides accredited online courses for students seeking coursework not available
        locally.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        The University of Montana in Missoula, approximately 150 miles south, is the state's
        flagship liberal arts university with strengths in journalism, forestry, and environmental
        studies. Montana State University in Bozeman, roughly 330 miles southeast, is a major
        research university with strengths in engineering, agriculture, and sciences. Flathead
        Valley Community College in Kalispell (90 miles) offers the nearest accessible two-year
        option. Many {townName} graduates attend one of these institutions or pursue vocational
        training before deciding whether to return to the Kootenai River valley or build careers
        elsewhere.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a standout. The{' '}
        {schoolDistrict ?? 'Libby Public Schools'} district operates a close-knit system where
        teachers know students by name, parent involvement is high, and the community turns out
        for school events. The {graduationRate != null ? `${graduationRate}%` : '—'} graduation rate
        compares well for a community of this size. {townName}'s greatest educational advantages
        are its natural setting and unique resources: the Cabinet Mountains as a living laboratory,
        the Kootenai River for ecology and fisheries studies, and Lake Koocanusa for water-based
        education — all within minutes of the school.
      </p>
      <p>
        Housing costs are a fraction of Montana resort towns, and the community's commitment to its
        schools is evident. The main trade-off is that the district is small — advanced course
        offerings, AP classes, and extracurricular variety are more limited than in larger Montana
        cities. For families who value community, individualized attention, and an education
        enriched by one of the most spectacular wilderness settings in the state,
        {' '}{townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
