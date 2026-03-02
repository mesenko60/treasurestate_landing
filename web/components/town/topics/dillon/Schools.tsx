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
        {townName} is a college town of {fmt(population)} in the Beaverhead Valley of
        southwestern Montana{'\u2014'}the county seat of Beaverhead County and home to both a
        solid K-12 public school system and the University of Montana Western, one of
        the most distinctive small public universities in the country. {schoolDistrict ?? 'Dillon Public Schools'} serves
        approximately {fmt(schoolEnrollment)} K-12 students in a district where class sizes
        are small, teachers know every family, and school events are community events. What
        truly sets {townName} apart is UM Western{'\u2019'}s Experience One block scheduling{'\u2014'}a
        nationally recognized approach where students take a single course at a time in
        intensive 18-day blocks. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>School Score</div><div style={cardValue}>9/10</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'Dillon Public Schools'} operates a compact, well-regarded system
        that includes Dillon Elementary School, Parkview School, and Beaverhead County High
        School{'\u2014'}serving a total enrollment of approximately {fmt(schoolEnrollment)} students.
        Beaverhead County High School (home of the Beavers) competes at the Class B level
        in Montana{'\u2019'}s athletic classifications, giving students ample opportunity to
        participate in football, basketball, volleyball, wrestling, track, and rodeo without
        being overshadowed by the large rosters at Class AA schools in Billings or Great Falls.
      </p>
      <p>
        The graduation rate stands at {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}{'\u2014'}above
        the Montana state average of approximately 87%. Per-pupil spending
        of {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'} is
        solid for Montana and reflects the community{'\u2019'}s commitment to funding its schools
        through local mill levies and state support. Small class sizes are the defining
        advantage{'\u2014'}teachers provide individualized attention, students who struggle are
        identified early, and the close-knit environment means that no child is anonymous
        in the hallway.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district{'\u2019'}s
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Beaverhead County High School</h2>
      <p>
        Beaverhead County High School is the center of {townName}{'\u2019'}s youth culture and
        community identity. As a Class B school, the Beavers field competitive teams across
        multiple sports, and Friday night football games and basketball season are woven
        into the rhythm of small-town life. Rodeo is especially significant in Beaverhead
        County{'\u2014'}the ranching heritage runs deep, and many students compete in Montana High
        School Rodeo Association events.
      </p>
      <p>
        The school offers Career and Technical Education (CTE) programs aligned with the
        local economy{'\u2014'}agriculture, vocational trades, and health occupations prepare
        students for immediate employment or for continuing at UM Western just across town.
        Agricultural education (FFA) has strong participation, reflecting the county{'\u2019'}s
        identity as one of Montana{'\u2019'}s historic ranching centers. The proximity of UM
        Western also creates unique opportunities: dual-enrollment programs allow ambitious
        high school students to begin earning college credits before graduation.
      </p>

      <h2>University of Montana Western{'\u2014'}Experience One</h2>
      <p>
        The University of Montana Western is what makes {townName}{'\u2019'}s education landscape
        genuinely distinctive. With approximately 1,600 students, UM Western is a small
        public university with a national reputation built on a single innovation: Experience
        One block scheduling. Instead of juggling four or five courses simultaneously,
        students take one course at a time in intensive 18-day blocks. Each block is an
        immersive deep dive{'\u2014'}field research trips, studio projects, and extended lab work
        replace the fragmented attention of a traditional semester schedule.
      </p>
      <p>
        This model attracts students from across the country who thrive in hands-on,
        focused learning environments. UM Western{'\u2019'}s signature programs leverage {townName}{'\u2019'}s
        setting: education (the university has historically trained many of Montana{'\u2019'}s rural
        teachers), equestrian studies and natural horsemanship, environmental science, and
        outdoor recreation. The equestrian program uses the surrounding ranch country as a
        living classroom, and environmental science students have the Beaverhead-Deerlodge
        National Forest, the Beaverhead River, and the Pioneer Mountains at their doorstep.
      </p>
      <p>
        For families, UM Western means that a student can attend a four-year public university
        without leaving {townName}{'\u2014'}an uncommon advantage for a town of {fmt(population)}.
        Tuition is among the most affordable in the Montana University System, and the
        block-schedule format produces graduation rates that outperform what the university{'\u2019'}s
        size and selectivity might predict.
      </p>

      <h2>Nearby Higher Education</h2>
      <p>
        Beyond UM Western, {townName} residents have reasonable access to Montana{'\u2019'}s broader
        university system. Montana Tech in Butte is 65 miles north on Interstate 15{'\u2014'}about
        an hour{'\u2019'}s drive{'\u2014'}and offers engineering, mining, and STEM programs with strong
        job placement. Montana State University in Bozeman is approximately 110 miles away,
        and the University of Montana in Missoula is about 190 miles. While commuting to
        these campuses daily is not practical, the relatively short distances mean that
        students who outgrow UM Western{'\u2019'}s offerings can transfer to larger institutions
        without moving across the state.
      </p>

      <h2>Vocational & Agricultural Education</h2>
      <p>
        {townName}{'\u2019'}s educational tradition is deeply rooted in vocational and agricultural
        learning. Beaverhead County{'\u2019'}s ranching economy{'\u2014'}cattle, sheep (historically
        Montana{'\u2019'}s largest wool exporter), hay, and irrigated agriculture{'\u2014'}means that
        agricultural education is not an abstract elective but a practical pathway to
        employment. FFA and 4-H programs are deeply embedded in the school culture, with
        students raising livestock, managing land, and learning agricultural business skills
        that translate directly to the working ranches surrounding {townName}.
      </p>
      <p>
        UM Western extends this tradition with its equestrian studies and natural
        horsemanship programs, which bridge the gap between traditional ranching skills and
        modern equine science. For students who do not pursue a four-year degree, the
        combination of high school CTE programs and UM Western{'\u2019'}s certificate and associate
        offerings provides workforce-ready training in trades, agriculture, and healthcare
        support{'\u2014'}all without leaving the Beaverhead Valley.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move, {townName}{'\u2019'}s education system offers a distinctive
        combination: a {graduationRate ?? 90}% graduation rate that exceeds the state average,
        small class sizes with genuine individualized attention, per-pupil spending
        of {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'} that
        reflects community investment, and{'\u2014'}most importantly{'\u2014'}a four-year public university
        in town. The Experience One block schedule at UM Western is unlike anything else in
        Montana and attracts students who want immersive, hands-on learning in an intimate
        campus setting. Equestrian studies, environmental science, and education programs
        are nationally recognized strengths.
      </p>
      <p>
        The trade-off is scale. {townName} has one high school, limited AP course diversity
        compared to Bozeman or Missoula, and the nearest large university is Montana Tech
        in Butte (65 miles). But for families who value small-school culture, agricultural
        roots, the unique advantage of a university in town, and a community where the
        school is the social center, {townName}{'\u2019'}s schools deliver. For employment
        opportunities in town, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs & economy guide</Link>.
      </p>
    </article>
  );
}
