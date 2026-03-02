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

function fmtDollar(n: number | null): string {
  if (n == null) return '—';
  return `$${n.toLocaleString('en-US')}`;
}

function fmtPct(n: number | null): string {
  if (n == null) return '—';
  return `${n}%`;
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
        {townName} sits on the southern shore of Flathead Lake within the Flathead Indian
        Reservation, and its school system reflects that unique setting. {schoolDistrict ?? 'Polson Public Schools'}{' '}
        serves approximately {fmt(schoolEnrollment)} students in a community of {fmt(population)}{' '}
        where Native American heritage, tribal education programs, and access to Salish Kootenai
        College shape an educational landscape unlike anywhere else in western Montana. The district
        has a significant Native American student population, and the Confederated Salish and
        Kootenai Tribes (CSKT) play an active role in supporting education across the reservation.
        For the full town profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{fmtPct(graduationRate)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{fmtDollar(perPupilSpending)}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'Polson Public Schools'} operates a district that includes Polson High
        School (home of the Pirates), Polson Middle School, and elementary schools serving the
        southern Flathead Lake area. The district enrolls approximately {fmt(schoolEnrollment)}{' '}
        students and competes at the Class A level in Montana athletics — large enough to field
        competitive teams across sports, small enough that student participation rates remain high.
        Polson High has a proud tradition in basketball, track, and cross-country, and the school's
        location on Flathead Lake gives its outdoor and environmental programs a natural advantage.
      </p>
      <p>
        The graduation rate of {fmtPct(graduationRate)} is slightly below Montana's state average
        of roughly 87%, reflecting challenges common to reservation communities including poverty
        and cultural transitions. Per-pupil spending of {fmtDollar(perPupilSpending)} is moderate
        for Montana, supplemented by federal Impact Aid funding that flows to districts serving
        students on tribal lands. The district has focused on culturally responsive teaching and
        student support services to improve outcomes, with CSKT tribal programs providing
        additional resources including mentoring, tutoring, and after-school activities.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at{' '}
          <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">
            {schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}
          </a>.
        </p>
      )}

      <h2>Tribal Education & Language Revitalization</h2>
      <p>
        What sets {townName}'s educational landscape apart is the role of the Confederated Salish
        and Kootenai Tribes in supporting learning at every level. CSKT tribal programs contribute
        to education across the reservation through language revitalization efforts, cultural
        curriculum development, and direct student support. The Salish and Kootenai language
        programs — among the most significant tribal language preservation efforts in the
        Northwest — work to ensure that the Salish (Séliš) and Kootenai (Ksanka) languages are
        passed to new generations. These programs operate through both tribal education departments
        and the local schools.
      </p>
      <p>
        The Three Chiefs Culture Center in nearby St. Ignatius provides cultural education resources
        including traditional arts, history, and storytelling that enrich the broader educational
        experience for families in the {townName} area. For Native American students particularly,
        this network of tribal education support creates a learning environment grounded in cultural
        identity alongside academic achievement — a combination that many families value deeply.
      </p>

      <h2>Higher Education — Salish Kootenai College</h2>
      <p>
        {townName}'s most distinctive educational asset is Salish Kootenai College (SKC), a fully
        accredited four-year tribal college located in Pablo, approximately 5 miles north. SKC
        offers bachelor's and associate degrees across programs including nursing, forestry, wildlife
        management, information technology, social work, and Native American studies. As one of the
        premier tribal colleges in the nation, SKC provides affordable higher education with a
        culturally grounded mission — a resource available to all students, not only tribal members.
      </p>
      <p>
        SKC's nursing program is particularly impactful, producing graduates who serve the tribal
        health system and regional healthcare facilities. The forestry and wildlife management
        programs draw on the reservation's extensive natural resources, connecting coursework to
        real-world land management and conservation. For students seeking to stay close to home
        while earning a four-year degree, SKC is a genuine option that most small Montana towns
        cannot offer.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        Beyond SKC, families in {townName} have access to regional higher education within
        reasonable driving distances. Flathead Valley Community College (FVCC) in Kalispell is
        roughly 55 miles north and offers associate degrees and certificates in nursing, trades,
        business, and liberal arts. The University of Montana in Missoula is approximately 70 miles
        south on US-93, providing bachelor's and graduate programs across a full range of academic
        disciplines — its forestry, wildlife biology, and environmental science programs align
        naturally with the interests of students from the Flathead reservation area.
      </p>
      <p>
        This combination of a local tribal college, a community college within an hour's drive,
        and a major research university 70 miles south gives {townName} families more higher
        education access than most Montana communities of similar size. Many students begin at
        SKC or FVCC and transfer to the University of Montana for bachelor's or graduate work,
        creating an efficient and affordable pathway to advanced degrees.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the education system carries both unique
        strengths and honest challenges. The strengths are distinctive: a tribal college in the
        backyard, culturally rich programming that connects students to the history and languages
        of the Salish and Kootenai people, strong community investment in youth through CSKT
        programs, and a Class A school district where students get personal attention. Flathead
        Lake — the largest natural freshwater lake west of the Mississippi — is the backdrop for
        daily life and outdoor education.
      </p>
      <p>
        The challenges are real: the {fmtPct(graduationRate)} graduation rate reflects ongoing
        work to close achievement gaps, and the district operates with moderate funding in a
        community where median incomes run below the state average. Families moving to {townName}{' '}
        should engage with the schools early and explore the full spectrum of resources available,
        including CSKT tribal education programs and SKC's community offerings.
        For employment opportunities, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs guide</Link>.
        For details on housing, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
