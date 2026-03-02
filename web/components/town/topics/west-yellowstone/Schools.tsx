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
        {townName} sits at 6,667 feet on the western boundary of Yellowstone National Park{'\u2014'}a
        tiny gateway community of {fmt(population)} year-round residents in Gallatin County.
        {' '}{schoolDistrict ?? 'West Yellowstone School District'} serves a small student body of
        approximately {fmt(schoolEnrollment)} students in one of Montana's most unique educational
        settings: a remote, tourism-driven community surrounded by national forest and national
        park land, where the nearest city of any size (Bozeman) is 90 miles away. The district's
        small scale means every student is known, class sizes are tiny, and the community's
        connection to its school is deep and personal. For the full city profile, see
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
        {schoolDistrict ?? 'West Yellowstone School District'} operates a compact K-12 campus
        that serves the entire community. The district is one of the smallest in Montana, with
        enrollment figures that reflect {townName}'s tiny year-round population. The high school
        competes at Montana's smallest classification level, which means students have
        extraordinary access to participation{'\u2014'}virtually every student who wants to play
        sports, join clubs, or take on leadership roles can do so without the competition for
        roster spots found at larger schools.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}{'\u2014'}a strong
        figure that reflects the tight-knit community's investment in its students. Per-pupil
        spending of {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        benefits from Montana's funding formula, which often allocates more per student to smaller,
        remote districts. Class sizes are exceptionally small{'\u2014'}often in single digits for
        individual courses{'\u2014'}providing a level of individual attention that larger districts
        simply cannot match.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Gateway-Town Education{'\u2014'}Unique Challenges</h2>
      <p>
        Educating children in a gateway community presents challenges that most school districts
        never face. {townName}'s extreme seasonality means the community's population and economic
        activity fluctuate dramatically throughout the year. Many families work in tourism and
        hospitality, with irregular schedules during peak season and reduced income during the
        off-season. Teacher recruitment is complicated by the same housing crisis that affects all
        workers in {townName}{'\u2014'}with a 46.2% vacancy rate (seasonal/vacation units) and
        virtually no long-term rental market, finding affordable year-round housing for educators
        is a genuine obstacle.
      </p>
      <p>
        The district's remote location{'\u2014'}90 miles from Bozeman, 110 miles from Idaho
        Falls{'\u2014'}means that specialized services, advanced coursework, and extracurricular
        opportunities available in larger towns require creative solutions. The Montana Digital
        Academy provides accredited online courses that supplement the limited course catalog a
        school this small can offer in-person. Dual-enrollment options with Montana State University
        and other institutions give motivated students access to college-level work, though the
        distance to any campus makes in-person participation impractical during the school year.
      </p>

      <h2>Outdoor Education & Yellowstone Proximity</h2>
      <p>
        No school district in America can match {townName}'s backyard classroom. Yellowstone
        National Park{'\u2014'}the world's first national park{'\u2014'}begins one mile from the school
        campus, providing an outdoor laboratory for ecology, geology, wildlife biology, and
        environmental science that most districts can only dream of. The park's geothermal features
        (geysers, hot springs, mud pots), its megafauna (grizzly bears, wolves, bison, elk), and
        its geological history offer hands-on learning opportunities that no textbook can replicate.
      </p>
      <p>
        Beyond Yellowstone, the surrounding Gallatin National Forest provides immediate access to
        wilderness areas, the Madison River, and Hebgen Lake. Cross-country skiing at the
        Rendezvous Ski Trails{'\u2014'}a world-class Nordic facility right in town{'\u2014'}gives students
        winter recreation access that is exceptional even by Montana standards. The Rendezvous
        trails have hosted national-level cross-country ski competitions, and the school's ski
        program benefits from having Olympic-caliber trails within walking distance. For families
        who value outdoor education and an active lifestyle, {townName}'s natural setting is
        unparalleled.
      </p>

      <h2>No Local College{'\u2014'}A 90-Mile Drive to MSU</h2>
      <p>
        {townName} does not have a college or university, and the nearest four-year institution
        {'\u2014'}Montana State University in Bozeman{'\u2014'}is 90 miles north. This distance makes
        daily commuting impractical and means that students pursuing higher education must relocate.
        MSU's strong programs in engineering, agriculture, nursing, and business are accessible, but
        the transition from {townName}'s tiny school to a campus of 16,000+ students is a
        significant leap.
      </p>
      <p>
        Some graduates choose trade careers in the guiding, hospitality, or outdoor recreation
        industries that define {townName}'s economy, entering the workforce directly after high
        school. Others attend the University of Montana in Missoula, Montana Tech in Butte, or
        out-of-state schools. The school district works to prepare students for both paths,
        offering career and technical education alongside college-prep coursework within the
        constraints of a very small school.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}'s small size and remote location mean private school options are essentially
        nonexistent locally. Families seeking alternatives rely primarily on homeschooling, which
        is well-supported in Montana through cooperative groups and the Montana Digital Academy's
        online course catalog. Some families in the broader Hebgen Basin area participate in
        informal homeschool cooperatives that organize group instruction and field trips, taking
        advantage of {townName}'s extraordinary natural surroundings as an educational resource.
      </p>

      <h2>Libraries & Lifelong Learning</h2>
      <p>
        The West Yellowstone Public Library serves the community with a collection that punches
        above its size, including regional history, natural science, and Yellowstone-specific
        resources. Summer reading programs, children's programming, and community events anchor
        the library's calendar. The library also functions as a critical community gathering
        space in a town where winter isolation can be intense{'\u2014'}at 6,667 feet with January
        lows averaging 8°F, the library's warmth and connectivity serve a social function
        as much as an educational one.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers the advantages of
        an extraordinarily small district{'\u2014'}a {graduationRate ?? 92}% graduation rate, the
        smallest class sizes in the state, deep community investment, and a setting that makes
        Yellowstone National Park an everyday resource rather than a once-in-a-lifetime field
        trip. The trade-offs are real: limited course offerings, no local college, challenging
        teacher recruitment due to housing scarcity, and the isolation that comes with being 90
        miles from the nearest city.
      </p>
      <p>
        But for families who prioritize outdoor access, tight-knit community, and a school where
        every child is known and supported, {townName} delivers an experience unlike any other
        district in Montana. The Rendezvous Ski Trails, the Madison River, and the world's first
        national park are not field-trip destinations here{'\u2014'}they are the neighborhood. For
        housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
