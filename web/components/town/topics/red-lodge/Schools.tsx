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
        {townName} is a mountain community of {fmt(population)} people in Carbon County, nestled
        at the base of the Beartooth Mountains at 5,568 feet. {schoolDistrict ?? 'Red Lodge Public Schools'}{' '}
        serves approximately {fmt(schoolEnrollment)} students in a compact, tight-knit district where
        small class sizes and deep community involvement define the educational experience. There is
        no college or university in town{'\u2014'}the nearest four-year institutions are Montana State
        University Billings and Rocky Mountain College, both in Billings 60 miles northeast. For the
        full city profile, see
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
        {schoolDistrict ?? 'Red Lodge Public Schools'} operates a small district that includes
        Red Lodge High School and Red Lodge Elementary/Middle School{'\u2014'}serving a total
        enrollment of approximately {fmt(schoolEnrollment)} students. Red Lodge High School,
        home of the Rams, competes at the Class B level in Montana's classification system for
        smaller schools, which means students have abundant opportunity to participate in athletics,
        arts, and extracurricular activities without the intense competition for roster spots found
        at larger Class AA and A schools in Billings or Bozeman.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}{'\u2014'}well above
        both the Montana state average and the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's commitment to funding its schools through local mill levies and
        bond measures. Small class sizes{'\u2014'}a defining advantage of the district{'\u2014'}mean
        that students receive individualized attention from teachers, and struggling learners are
        far less likely to fall through the cracks than in larger districts.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Red Lodge High School — Mountain-Town Identity</h2>
      <p>
        Red Lodge High School is the heart of the community's youth culture. As a Class B school,
        it fields competitive teams in football, basketball, volleyball, track, wrestling, and
        cross-country{'\u2014'}and the Rams identity runs deep. Friday night football games, the
        homecoming parade down Broadway Avenue, and the annual Home of Champions Rodeo week create
        a rhythm of community life that revolves around the school.
      </p>
      <p>
        Beyond athletics, Red Lodge High offers programs that reflect the town's outdoor character.
        Career and Technical Education (CTE) offerings connect students to practical skills in
        trades, healthcare, and the tourism industry{'\u2014'}directly relevant to the local employment
        landscape at Beartooth Billings Clinic, Red Lodge Mountain, and Carbon County government.
        The ski team benefits from Red Lodge Mountain's proximity (4 miles), giving student athletes
        training access that most Montana schools cannot match. Arts programs{'\u2014'}band, choir,
        visual arts{'\u2014'}operate with the intimate scale that allows every interested student
        meaningful participation.
      </p>

      <h2>Outdoor Education & Beartooth Access</h2>
      <p>
        Few school districts in America can claim {townName}'s backyard. The Absaroka-Beartooth
        Wilderness begins 15 miles south, the Beartooth Highway climbs to nearly 11,000 feet just
        beyond town, and Rock Creek runs through the heart of the community. Yellowstone National
        Park's northeast entrance is 72 miles away via the Beartooth Highway. This geography shapes
        the educational experience in ways that transcend the classroom{'\u2014'}field trips to alpine
        ecosystems, ecology studies along Rock Creek, and conservation projects in Custer Gallatin
        National Forest give students hands-on connections to the natural world.
      </p>
      <p>
        Outdoor recreation is woven into daily life. Skiing at Red Lodge Mountain (4 miles),
        fishing Rock Creek and its tributaries, hiking Beartooth Plateau trails, and camping in
        the surrounding national forest are not extracurricular luxuries{'\u2014'}they are the fabric
        of growing up in {townName}. The school's ski program, in particular, benefits from having a
        ski area essentially in the school's backyard. For families who value outdoor education and
        an active mountain lifestyle, this proximity to wild landscapes is one of the district's
        most compelling selling points.
      </p>

      <h2>Higher Education Access</h2>
      <p>
        {townName} does not have a college or university within its borders, which distinguishes it
        from larger Montana cities. However, Billings{'\u2014'}60 miles northeast on a well-maintained
        highway{'\u2014'}offers Montana State University Billings, Rocky Mountain College, and the
        Billings campus of City College for two-year and vocational programs. The drive is roughly
        one hour, making day commuting feasible for dual-enrollment high school students or adult
        learners seeking degrees while remaining in {townName}.
      </p>
      <p>
        Some Red Lodge High graduates head to MSU in Bozeman (160 miles), the University of Montana
        in Missoula, Montana Tech in Butte, or out-of-state schools. The proximity to the Billings
        college cluster means {townName} families have higher-education access without the costs
        of relocating to a distant city, though the commute commitment is real and winter driving
        conditions on the highway to Billings require planning.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}'s small size means private school options are limited. Families seeking alternatives
        have several paths: homeschooling is well-established in the {townName} area, supported by
        cooperative groups that organize group instruction, field trips, and social activities. The
        Montana Digital Academy provides accredited online courses for students seeking coursework
        beyond what Red Lodge High offers. Billings offers a wider range of private and parochial
        schools for families willing to make the commute.
      </p>

      <h2>Libraries & Community Learning</h2>
      <p>
        The Carbon County Library in {townName} serves the community with physical and digital
        collections, children's programming, summer reading programs, and community meeting space.
        The library is a social hub in a small town where public gathering spaces are valued. The
        Carbon County Historical Society and Museum, also in {townName}, provides educational
        programming on the region's coal-mining heritage, Native American history, and the natural
        history of the Beartooth Mountains{'\u2014'}resources that enrich the school curriculum and
        connect students to their community's past.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers the advantages of a
        small, close-knit district{'\u2014'}a {graduationRate ?? 94}% graduation rate, small class
        sizes, strong community involvement, and the kind of personal attention that larger districts
        struggle to provide. Red Lodge High's Class B status means every student who wants to
        participate in sports, arts, or activities can find a place. The trade-off is scale{'\u2014'}
        {townName} has one high school, limited AP course offerings compared to AA schools, and
        no local college.
      </p>
      <p>
        But the intangibles are powerful: the Beartooth Mountains in the backyard, a ski area 4 miles
        away, Rock Creek through town, a {graduationRate ?? 94}% graduation rate that exceeds
        state and national averages, and a community where the school district is not just a service
        provider but the social fabric of town life. For families who prioritize small-school culture,
        mountain access, and a community with genuine character, {townName}'s schools deliver.
        For housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
