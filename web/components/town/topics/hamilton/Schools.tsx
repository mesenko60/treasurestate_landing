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
  if (n == null) return '\u2014';
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
        {townName} is the heart of the Bitterroot Valley{'\u2014'}a town of {fmt(population)} in
        Ravalli County where the Bitterroot River flows north between two mountain ranges. {' '}
        {schoolDistrict ?? 'Hamilton School District'} serves approximately {fmt(schoolEnrollment)}{' '}
        students in a compact district where small class sizes, outdoor access, and community
        involvement define the educational experience. While there is no four-year college in town,
        the University of Montana in Missoula is just 47 miles north on US-93{'\u2014'}close enough for
        dual enrollment, campus visits, and a manageable commute. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '\u2014'}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'Hamilton School District'} operates a small district anchored by
        Hamilton High School, Hamilton Middle School, and Daly Elementary School{'\u2014'}serving a
        total enrollment of approximately {fmt(schoolEnrollment)} students. Hamilton High School,
        home of the Broncs, competes at the Class A level in Montana{'\u2019'}s athletics
        classification{'\u2014'}a step above the smallest Class B schools but still small enough that
        students have genuine opportunities to participate in multiple sports, theater, music,
        and student organizations without the fierce roster competition found at AA schools in
        Missoula, Billings, or Great Falls.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, which tracks
        near the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community{'\u2019'}s commitment to public education through local mill levies.
        Small class sizes{'\u2014'}a defining advantage of the district{'\u2014'}mean teachers know students
        individually, and struggling learners are less likely to be overlooked. The district
        benefits from a community that values education alongside its outdoor lifestyle, with
        families often drawn to {townName} specifically for the small-school experience.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district{'\u2019'}s
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Hamilton High School — The Broncs</h2>
      <p>
        Hamilton High School is the social and athletic anchor of the Bitterroot Valley{'\u2019'}s youth
        community. As a Class A school, it fields competitive teams in football, basketball,
        volleyball, track, wrestling, cross-country, and soccer{'\u2014'}and the Bronc identity runs
        deep through generations of {townName} families. The school{'\u2019'}s location in the Bitterroot
        Valley gives its athletic programs a natural advantage in cross-country and track, with
        training terrain that includes river trails, mountain roads, and forest paths at the
        doorstep.
      </p>
      <p>
        Beyond athletics, Hamilton High offers Career and Technical Education (CTE) programs
        that connect directly to the local economy{'\u2014'}healthcare pathways aligned with Marcus
        Daly Memorial Hospital, trades programs reflecting the valley{'\u2019'}s construction and
        maintenance needs, and science electives that benefit from the proximity of Rocky Mountain
        Laboratories (NIH), which has historically engaged with local schools through outreach
        and mentorship. Fine arts programs in band, choir, drama, and visual arts provide creative
        outlets in a community that, despite its small size, values cultural expression.
      </p>

      <h2>Outdoor Education & Bitterroot Valley Access</h2>
      <p>
        Few school districts in Montana can match {townName}{'\u2019'}s outdoor classroom. The Bitterroot
        National Forest surrounds the town, the Selway-Bitterroot Wilderness begins just 10
        miles west, and 47 trailheads lie within 30 miles. The Bitterroot River{'\u2014'}a renowned
        trout stream{'\u2014'}flows through the valley floor within reach of every school in the
        district. This geography shapes the educational experience in ways that extend far beyond
        textbooks: ecology field trips along the river corridor, conservation studies in the
        surrounding national forests, and wildlife observation opportunities that most districts
        cannot replicate.
      </p>
      <p>
        Outdoor recreation is woven into family life in {townName}. Skiing at Lost Trail Powder
        Mountain (62 miles south) and Discovery Ski Area (59 miles east), fishing the Bitterroot
        and its forks, hiking in the Selway-Bitterroot Wilderness, and soaking at Sleeping Child
        Hot Springs (8 miles) are not weekend luxuries{'\u2014'}they are the rhythm of growing up in
        the Bitterroot Valley. For families who value outdoor education and active living, this
        immersion in wild landscapes is one of the district{'\u2019'}s most compelling advantages.
      </p>

      <h2>No Local College — But UM Is Next Door</h2>
      <p>
        {townName} does not have a four-year college or university within its borders, which
        distinguishes it from Missoula, Bozeman, and Helena. However, the University of Montana
        in Missoula is just 47 miles north on US-93{'\u2014'}close enough for dual-enrollment programs,
        campus visits, and a commute that many Bitterroot Valley residents make daily. UM{'\u2019'}s
        programs in forestry, wildlife biology, environmental science, and the liberal arts align
        naturally with the interests and career paths of Bitterroot Valley students who have
        grown up surrounded by wild landscapes.
      </p>
      <p>
        This arrangement gives families an appealing combination: the small-town school experience
        of {townName} through the K-12 years, with a major research university accessible for
        college without uprooting from the valley. Some Hamilton High graduates attend UM while
        continuing to live in the Bitterroot, saving on Missoula{'\u2019'}s higher housing costs. Others
        head to Montana State in Bozeman, Montana Tech in Butte, or out-of-state schools{'\u2014'}but
        the proximity to UM ensures that {townName} families are never far from higher education
        opportunities.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}{'\u2019'}s small size limits private school options compared to larger Montana cities,
        but alternatives exist. Homeschooling is well-established in the Bitterroot Valley,
        supported by cooperative groups that organize instruction, field trips, and social
        activities. The Montana Digital Academy provides accredited online courses for students
        seeking coursework beyond Hamilton High{'\u2019'}s offerings. The valley{'\u2019'}s community of
        scientists (from Rocky Mountain Laboratories), outdoor professionals, and remote workers
        creates informal mentorship and learning opportunities that supplement the formal
        curriculum.
      </p>

      <h2>Libraries & Lifelong Learning</h2>
      <p>
        The Bitterroot Public Library serves {townName} and the surrounding community with
        physical and digital collections, children{'\u2019'}s programming, summer reading programs,
        and community meeting space. The Ravalli County Museum, housed in the historic 1900
        courthouse, provides educational programming on Bitterroot Valley history, Native American
        heritage, and the region{'\u2019'}s natural history{'\u2014'}a resource that enriches the educational
        landscape beyond what the school district alone provides.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}{'\u2019'}s education system offers the advantages of
        a small, community-invested district{'\u2014'}a {graduationRate ?? 85}% graduation rate, small
        class sizes, strong athletic programs at the Class A level, and the kind of personal
        attention that large districts cannot match. Hamilton High{'\u2019'}s Bronc identity gives students
        a sense of belonging, and the Bitterroot Valley{'\u2019'}s outdoor landscape provides a childhood
        experience rooted in nature, rivers, and mountains.
      </p>
      <p>
        The trade-off is scale{'\u2014'}{townName} has one high school, limited AP course offerings
        compared to AA schools, and no local college. But the intangibles are powerful: the
        Bitterroot River outside the classroom window, the Selway-Bitterroot Wilderness for
        weekend exploration, Rocky Mountain Laboratories as a model for science careers, and the
        University of Montana just 47 miles north. For housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
