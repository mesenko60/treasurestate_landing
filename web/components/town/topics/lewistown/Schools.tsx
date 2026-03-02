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
        {fmt(schoolEnrollment)} students in Fergus County, in the geographic center of Montana at
        the heart of the Judith Basin. The {schoolDistrict ?? 'Lewistown Public Schools'} district
        delivers strong academics with a {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate and {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'} per-pupil spending.
        With Big Spring Creek, the Big Snowy Mountains, and Judith Mountains as outdoor classrooms,
        students grow up with place-based educational experiences rooted in central Montana's
        landscape. For families weighing a move, {townName}'s schools combine small-town values,
        individualized attention, and a natural setting — all at housing costs far below Montana's
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
        The {schoolDistrict ?? 'Lewistown Public Schools'} district operates schools serving a
        community of {fmt(population)} people in the heart of Fergus County. The district enrolls
        approximately {fmt(schoolEnrollment)} students across elementary, middle, and high school
        grades. In a town at the geographic center of Montana, school athletics and outdoor
        programs are central to community life. The district's {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate reflects the community's investment in education. With class sizes this small, teachers
        know students well and can provide individualized attention that larger districts cannot
        match. The trade-off is that course offerings and elective variety are more limited than
        in Bozeman or Billings — but what {townName} lacks in breadth, it compensates with depth
        of mentorship and community support.
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
        {townName}'s location in central Montana provides distinctive outdoor education
        opportunities. Big Spring Creek, a blue-ribbon trout stream fed by one of the largest
        springs in the American West, flows through town — a living laboratory for ecology and
        fisheries studies. The Big Snowy Mountains rise south of town, with the Big Snowy Mountains
        Wilderness Study Area offering hiking, camping, and wilderness recreation. The Judith
        Mountains to the east provide additional backcountry access. The Central Montana Museum
        and Central Montana Historical Society offer place-based history and culture programs.
      </p>
      <p>
        Wildlife biology, ecology, and conservation are not abstract concepts here — they are the
        landscape students see every day. The Judith Basin's agricultural heritage, prairie
        ecosystems, and island-range geology create a natural curriculum for environmental
        science, biology, and outdoor recreation that enriches classroom learning in ways urban
        and suburban districts cannot replicate.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Montana State University Billings, approximately 125 miles southeast, offers a full range
        of undergraduate and graduate programs. Great Falls College (Montana State University),
        roughly 125 miles northwest, provides two-year degrees, certificates, and workforce
        training in nursing, trades, IT, and business. For {townName} students, both are accessible
        for motivated students willing to make the drive or relocate for post-secondary education.
        The Montana Digital Academy provides accredited online courses for students seeking
        coursework not available locally.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        Montana State University Billings, approximately 125 miles southeast, offers four-year
        programs in business, education, health sciences, and liberal arts. Great Falls College,
        roughly 125 miles northwest, offers the nearest two-year option with strong workforce
        and transfer programs. Many {townName} graduates attend one of these institutions or
        pursue vocational training before deciding whether to return to central Montana or build
        careers elsewhere.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a standout. The{' '}
        {schoolDistrict ?? 'Lewistown Public Schools'} district operates a close-knit system where
        teachers know students by name, parent involvement is high, and the community turns out
        for school events. The {graduationRate != null ? `${graduationRate}%` : '—'} graduation rate
        compares well for a community of this size. {townName}'s greatest educational advantages
        are its natural setting and unique resources: Big Spring Creek as a living laboratory,
        the Big Snowy and Judith Mountains for outdoor education, and the Central Montana Museum
        for place-based history — all within reach of the school.
      </p>
      <p>
        Housing costs are a fraction of Montana resort towns, and the community's commitment to its
        schools is evident. The main trade-off is that the district is smaller than Bozeman or
        Billings — advanced course offerings, AP classes, and extracurricular variety are more
        limited. For families who value community, individualized attention, and an education
        enriched by central Montana's landscape, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
