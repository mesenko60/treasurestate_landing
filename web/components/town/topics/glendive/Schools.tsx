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
        {fmt(schoolEnrollment)} students in Dawson County, in eastern Montana along the Yellowstone
        River at 2,064 feet elevation. The {schoolDistrict ?? 'Glendive Public Schools'} district
        delivers strong academics with a {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate and {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'} per-pupil spending.
        What sets {townName} apart from most small Montana towns is Dawson Community College — a
        two-year public college right in town, providing associate degrees and workforce training
        without requiring students to relocate. With Makoshika State Park's badlands, dinosaur
        fossils, and the Yellowstone River as outdoor classrooms, students grow up with place-based
        educational experiences rooted in eastern Montana's landscape. For the full town profile, see
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
        The {schoolDistrict ?? 'Glendive Public Schools'} district operates schools serving a
        community of {fmt(population)} people in the heart of Dawson County. The district enrolls
        approximately {fmt(schoolEnrollment)} students across elementary, middle, and high school
        grades. Dawson County High School — home of the Red Devils — is a focal point of community
        life, with athletics, rodeo, and FFA programs reflecting eastern Montana's ranching culture.
        The district's {graduationRate != null ? `${graduationRate}%` : '—'} graduation rate reflects
        the community's investment in education. With class sizes this small, teachers know students
        well and can provide individualized attention that larger districts cannot match. The
        trade-off is that course offerings and elective variety are more limited than in Billings
        or Bozeman — but what {townName} lacks in breadth, it compensates with depth of mentorship
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

      <h2>Dawson Community College</h2>
      <p>
        {townName}'s most distinctive educational asset is Dawson Community College — a two-year
        public college right in town. This is rare for a Montana community of {fmt(population)}
        people. Dawson CC offers associate degrees and certificates in agriculture, business, health
        sciences, trades, and general transfer programs. Students can earn a two-year degree locally
        and transfer to a four-year university, or complete workforce training and enter the job
        market directly. For families, this means high school graduates have a post-secondary option
        without the cost and upheaval of relocating to Billings or Bozeman. Dawson CC also serves
        the broader community through continuing education, workforce development partnerships with
        local employers, and dual-enrollment programs for high school students.
      </p>

      <h2>Outdoor and Place-Based Education</h2>
      <p>
        {townName}'s location in eastern Montana provides distinctive outdoor education
        opportunities unlike anywhere else in the state. Makoshika State Park — Montana's largest
        state park at over 11,500 acres — sits at the edge of town, offering a living laboratory for
        geology, paleontology, and ecology. Dinosaur fossils including Triceratops and T. rex have
        been found in the local Hell Creek Formation, making paleontology a tangible subject rather
        than an abstract one. The Yellowstone River flows through town, supporting studies in river
        ecology, fisheries, and the annual paddlefish migration.
      </p>
      <p>
        The badlands formations at Makoshika reveal millions of years of geologic history in exposed
        strata — earth science lessons written in stone. Wildlife biology, ecology, and conservation
        are not abstract concepts here — they are the landscape students see every day. Eastern
        Montana's prairie ecosystems, ranch heritage, and paleontological significance create a
        natural curriculum for environmental science and biology that enriches classroom learning in
        ways urban and suburban districts cannot replicate.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        Dawson Community College, right in {townName}, is the primary post-secondary option —
        offering associate degrees, certificates, and workforce training in agriculture, business,
        health sciences, and trades. For four-year programs, MSU Billings is approximately 220 miles
        west, offering undergraduate and graduate degrees in business, education, health sciences,
        and liberal arts. Miles Community College in Miles City, 80 miles west, provides another
        two-year option. The Montana Digital Academy provides accredited online courses for students
        seeking coursework not available locally.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        Dawson Community College in {townName} is the nearest option, offering two-year degrees and
        workforce certificates. MSU Billings, approximately 220 miles west on I-94, offers four-year
        programs in business, education, health sciences, and liberal arts. Miles Community College,
        roughly 80 miles west, offers another two-year option with strong vocational and transfer
        programs. Many {townName} graduates start at Dawson CC before transferring to a four-year
        institution or entering the workforce with a credential in hand — an advantage most small
        Montana towns do not have.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a standout. The{' '}
        {schoolDistrict ?? 'Glendive Public Schools'} district operates a close-knit system where
        teachers know students by name, parent involvement is high, and the community turns out for
        Red Devils games and school events. The {graduationRate != null ? `${graduationRate}%` : '—'} graduation
        rate compares well for a community of this size. {townName}'s greatest educational advantages
        are Dawson Community College — providing post-secondary access without relocating — and its
        extraordinary natural setting: Makoshika State Park for geology and paleontology, the
        Yellowstone River for ecology, and dinosaur fossil sites that bring science to life.
      </p>
      <p>
        Housing costs are a fraction of Montana resort towns, and the community's commitment to its
        schools is evident. The main trade-off is that the district is smaller than Billings or
        Bozeman — advanced course offerings, AP classes, and extracurricular variety are more
        limited. For families who value community, individualized attention, and an education
        enriched by eastern Montana's unique landscape, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
