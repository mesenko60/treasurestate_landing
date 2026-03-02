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
        {townName} offers a tight-knit, community-driven school system serving roughly{' '}
        {fmt(schoolEnrollment)} students across four campuses. The{' '}
        {schoolDistrict ?? 'Columbia Falls School District #6'} delivers solid academics with
        a {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate and{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'competitive'} per-pupil
        spending — competitive within Montana and well above the national average. With Glacier
        National Park just minutes away, students have access to outdoor education opportunities
        that few districts anywhere can match. For families weighing a move, {townName}'s schools
        combine small-town values with genuine academic quality at housing costs below neighboring
        Whitefish and Kalispell. For the full town profile, see
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
        The {schoolDistrict ?? 'Columbia Falls School District #6'} operates four schools serving
        a community of {fmt(population)} people. Glacier Gateway Elementary and Ruder Elementary
        handle the primary grades, feeding into Columbia Falls Junior High for the middle-school
        years. Columbia Falls High School — home of the Wildcats — serves grades 9 through 12 and
        competes in Class A athletics, a mid-sized classification that matches the town's scale
        while fielding competitive programs in football, basketball, wrestling, track, and cross-country.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        is on par with the Montana state average of approximately 87%. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'} reflects
        a community that consistently supports school levies despite the economic transitions the
        town has experienced. Class sizes remain manageable — smaller than Kalispell's larger
        schools but large enough to sustain a full range of coursework and extracurricular programs.
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

      <h2>Glacier and Outdoor Education</h2>
      <p>
        {townName}'s proximity to Glacier National Park — roughly 15 minutes from the school
        campus to the park's west entrance — creates outdoor education opportunities that most
        districts can only dream of. Science classes conduct field studies along the Middle Fork of
        the Flathead River and in the park's diverse ecosystems, from low-elevation cedar-hemlock
        forests to alpine meadows. Environmental science coursework draws on the surrounding
        Flathead National Forest and the Hungry Horse Reservoir watershed.
      </p>
      <p>
        The Wildcats' athletics program reflects the outdoor culture. Cross-country running and
        skiing benefit from extensive trail networks, and the school's location gives students easy
        access to hiking, mountain biking, and river sports year-round. The district has integrated
        place-based learning into its curriculum, using the local landscape as a teaching tool
        across subjects including biology, geology, history, and art.
      </p>

      <h2>Vocational and Career Programs</h2>
      <p>
        Columbia Falls High School maintains strong vocational and Career & Technical Education
        (CTE) programs. Shop classes in woodworking, metalworking, and welding connect students
        to the Flathead Valley's active construction and trades economy. Given that construction
        accounts for over 13% of local employment, these programs feed directly into workforce
        demand. Agricultural education and FFA (Future Farmers of America) also have a presence,
        reflecting the broader valley's ranching and farming heritage.
      </p>

      <h2>Flathead Valley Community College</h2>
      <p>
        Flathead Valley Community College (FVCC) in Kalispell, 15 miles south, is the nearest
        post-secondary institution. FVCC offers associate degrees and certificates in liberal arts,
        nursing, skilled trades, business, IT, and hospitality management. Its nursing program is
        a direct pipeline to Kalispell Regional Healthcare, the valley's largest employer. Dual-enrollment
        agreements allow Columbia Falls High School juniors and seniors to begin earning college
        credits before graduation, reducing both the cost and time to complete a degree.
      </p>
      <p>
        FVCC's workforce-training programs are particularly relevant for {townName} students.
        Construction technology, welding, and diesel technology programs align with the valley's
        top employment sectors. The college's affordability — community college tuition is a
        fraction of four-year university costs — makes it an accessible option for families at
        all income levels.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        For four-year and graduate degrees, students leave the Flathead Valley. The University of
        Montana in Missoula is approximately 190 miles south, and Montana State University in
        Bozeman is roughly 250 miles southeast. Both are the state's flagship institutions,
        offering a full range of undergraduate and graduate programs. Many {townName} graduates
        attend one of these universities before deciding whether to return to the Flathead Valley
        or pursue careers elsewhere. The Montana Digital Academy provides accredited online courses
        for students seeking coursework not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a genuine strength.
        The four-school structure keeps things close-knit — teachers know students by name, parent
        involvement is high, and the community turns out for Wildcat games and school events. The
        {graduationRate != null ? ` ${graduationRate}%` : ''} graduation rate and outdoor-education
        advantages compare well with much larger and more expensive districts in the valley.
      </p>
      <p>
        The district has been growing as the Flathead Valley's population influx brings new families
        to {townName}, attracted by lower housing costs relative to Whitefish (16 miles west) and
        Kalispell. This growth has put pressure on facilities but has also brought new energy and
        resources to the schools. The main trade-off is that {townName} lacks the private school
        alternatives and the university presence found in Bozeman or Missoula — for families who
        want those options, the Flathead Valley depends on FVCC and the broader Montana university
        system.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
