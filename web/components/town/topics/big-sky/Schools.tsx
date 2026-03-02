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
        {townName} is an unincorporated resort community of {fmt(population)} year-round residents
        at the base of Lone Mountain in Gallatin County{'\u2014'}a small mountain community that has
        built a surprisingly strong school system despite its remote location and resort-driven
        economy. {schoolDistrict ?? 'Big Sky School District #72'} serves the community with a
        compact K-12 system anchored by Ophir Elementary School and Lone Peak High School, educating
        approximately {fmt(schoolEnrollment)} students. With a {graduationRate ?? 96}% graduation
        rate{'\u2014'}one of the highest in Montana{'\u2014'}these small schools punch far above their weight.
        Montana State University in Bozeman is 45 miles north, providing families access to higher
        education without leaving the Gallatin County corridor. For the full community profile, see
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
        {schoolDistrict ?? 'Big Sky School District #72'} operates two schools serving the
        {townName} community. <strong>Ophir Elementary School</strong> (K-6) provides the foundation,
        serving the community's youngest students in a small, close-knit setting where class sizes
        are genuinely tiny{'\u2014'}often 10{'\u2013'}15 students per grade. <strong>Lone Peak High
        School</strong> (7-12) is one of the smallest high schools in Montana, competing at the
        Class C level. The school's intimate size means every student has the opportunity to
        participate in athletics, arts, and leadership{'\u2014'}there is no anonymity in a school
        where teachers know every student and family by name.
      </p>
      <p>
        The graduation rate stands at {graduationRate != null ? `${graduationRate}%` : 'an excellent level'},{' '}
        one of the highest in the state and well above the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's investment in education through local mill levies and the financial
        support that comes from {townName}'s robust property tax base{'\u2014'}an ironic benefit of the
        resort real estate market. Small class sizes are the district's defining advantage, providing
        individualized attention that larger districts cannot match. The trade-off is limited course
        offerings compared to larger schools{'\u2014'}AP classes, specialized electives, and competitive
        sports at the AA or A level are not available.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Lone Peak High School — Small School, Big Mountains</h2>
      <p>
        Lone Peak High School is the heart of {townName}'s year-round community. As a Class C
        school{'\u2014'}Montana's classification for the smallest schools{'\u2014'}it fields teams in
        basketball, volleyball, track, cross-country, and other sports where roster sizes allow
        (and sometimes require) every interested student to participate. The BigHorns compete
        against other small mountain and rural communities, and the small-school sports culture
        fosters a family-like atmosphere where the entire community turns out for games.
      </p>
      <p>
        Beyond athletics, the school's location at the base of one of North America's premier
        ski resorts creates unique opportunities. Many Lone Peak students are accomplished skiers
        and snowboarders who benefit from proximity to Big Sky Resort's terrain and coaching
        infrastructure. The Big Sky Ski Education Foundation offers competitive ski racing
        programs for youth, and Lone Peak students have a pathway to ski racing, freestyle, and
        freeride competition that few schools in the country can match. The mountains are not
        just a backdrop{'\u2014'}they are an integral part of the educational experience.
      </p>

      <h2>Outdoor Education & Yellowstone Proximity</h2>
      <p>
        {townName}'s location provides extraordinary outdoor education opportunities.
        Yellowstone National Park is approximately 50 miles south via US-191, and the Lee
        Metcalf Wilderness (Madison Range and Spanish Peaks units) rises directly from the
        valley floor. The Gallatin River{'\u2014'}a blue-ribbon trout stream made famous by
        {' '}<em>A River Runs Through It</em>{'\u2014'}flows through the Gallatin Canyon just
        minutes from school. This landscape shapes the educational experience in ways that go
        well beyond traditional classrooms: ecology field studies in Yellowstone's geothermal
        basins, wildlife biology along the Gallatin corridor, and conservation projects in the
        surrounding Gallatin National Forest give students a hands-on connection to the natural
        world.
      </p>
      <p>
        Skiing is central to the culture. With Big Sky Resort five miles from town, many students
        ski before or after school during the winter season. Cross-country skiing, snowshoeing,
        mountain biking, hiking, and fly fishing round out a lifestyle where outdoor recreation
        is not an extracurricular activity but the fabric of daily life. For families who value
        an active, outdoor-oriented childhood, few school communities in the country offer a
        comparable setting.
      </p>

      <h2>No Local College — But MSU Is 45 Miles North</h2>
      <p>
        {townName} does not have a college or university within its borders{'\u2014'}the nearest
        four-year institution is Montana State University in Bozeman, 45 miles north through
        the Gallatin Canyon. MSU's 16,000-student campus provides access to engineering,
        agriculture, nursing, business, computer science, and graduate programs. The commute
        is manageable for dual-enrollment high school students or recent graduates, though
        winter driving conditions on US-191 through the canyon require respect. Gallatin College
        MSU, the two-year community college in Bozeman, offers technical programs, nursing,
        and transfer pathways.
      </p>
      <p>
        Some Lone Peak graduates continue to live in {townName} while attending MSU, commuting
        to campus for classes. Others relocate to Bozeman for the full university experience and
        return to the {townName} area for seasonal resort employment. The proximity to a major
        research university gives {townName} families access to higher education without leaving
        the Gallatin County corridor{'\u2014'}an advantage over more remote Montana resort communities.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}'s small size means private school options are limited within the community
        itself. The Spanish Peaks Community Foundation and other local organizations support
        educational enrichment programs. Homeschooling is an option for families seeking
        alternatives, supported by Montana's flexible homeschool regulations and the outdoor
        learning opportunities that the mountain environment provides. The Montana Digital
        Academy offers accredited online courses for students seeking AP coursework or
        specialized electives beyond what Lone Peak High School can offer{'\u2014'}a valuable
        supplement for a Class C school where staffing limits course variety.
      </p>

      <h2>Libraries & Community Learning</h2>
      <p>
        The Big Sky Community Library serves the {townName} area with a collection of physical
        and digital resources, children's programming, and community events. For a community
        of 3,591 year-round residents, the library plays an outsized role as a gathering place
        and cultural anchor{'\u2014'}one of the few public spaces in an unincorporated community
        that lacks a traditional downtown. The library hosts author readings, book clubs,
        children's story times, and summer reading programs that connect the year-round
        community across the economic divides that the resort creates.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move to {townName}, the school system offers genuine
        strengths: a {graduationRate ?? 96}% graduation rate, tiny class sizes, dedicated
        teachers, world-class outdoor access, and a community that values its schools as the
        social center of year-round life. The trade-offs are real{'\u2014'}{townName} has one
        elementary school and one tiny high school, limited course diversity, Class C
        athletics, and no local college. The housing crisis adds a practical constraint:
        families must secure affordable housing (deed-restricted units, employer housing,
        or a Gallatin Canyon commute) before enrolling.
      </p>
      <p>
        But for families who can make the housing work, the intangibles are extraordinary:
        children grow up skiing Lone Mountain, fishing the Gallatin River, exploring
        Yellowstone, and attending schools small enough that no student is overlooked.
        The 96% graduation rate speaks to a community that, despite its resort-town
        complexities, takes education seriously and supports its young people. For
        housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
