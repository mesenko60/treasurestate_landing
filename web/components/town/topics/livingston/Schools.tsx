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
        {townName} sits where the Yellowstone River bends north out of Paradise Valley — a small
        railroad town of {fmt(population)} that punches above its weight in character, culture,
        and community identity. {schoolDistrict ?? 'Livingston Public Schools'} serves
        approximately {fmt(schoolEnrollment)} students in a compact, tight-knit district where
        teachers know students by name and families are deeply invested in school life. There is
        no four-year college in town, but Montana State University in Bozeman is just 25 miles
        west over Bozeman Pass, giving families access to higher education without leaving Park
        County behind. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>At a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>School District</div><div style={{ ...cardValue, fontSize: '0.9rem' }}>{schoolDistrict ?? '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>K-12 Enrollment</div><div style={cardValue}>{fmt(schoolEnrollment)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Graduation Rate</div><div style={cardValue}>{graduationRate != null ? `${graduationRate}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Per-Pupil Spending</div><div style={cardValue}>{perPupilSpending != null ? `$${fmt(perPupilSpending)}` : '—'}</div></div>
      </div>

      <h2>K-12 Public Schools</h2>
      <p>
        {schoolDistrict ?? 'Livingston Public Schools'} operates a small district that includes
        Park High School, Livingston Middle School, Sleeping Giant Middle School, and Winans
        Primary School — serving a total enrollment of approximately {fmt(schoolEnrollment)}{' '}
        students. Park High School, home of the Rangers, competes at the Class B level —
        Montana's classification for smaller schools — which means students have ample opportunity
        to participate in athletics, theater, music, and student government without being crowded
        out by the sheer numbers found at Class AA schools in Billings, Missoula, or Great Falls.
      </p>
      <p>
        The graduation rate stands at{' '}
        {graduationRate != null ? `${graduationRate}%` : 'a competitive level'}, a strong showing
        for a small school and above the national average. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'}{' '}
        reflects the community's commitment to funding its schools through local mill levies and
        bond measures. Small class sizes — a defining advantage of the district — mean that
        students receive more individualized attention from teachers, and struggling learners are
        less likely to fall through the cracks.
      </p>
      {schoolWebsite && (
        <p>
          For enrollment information, school boundaries, and calendar details, visit the district's
          website at <a href={schoolWebsite} target="_blank" rel="noopener noreferrer">{schoolWebsite.replace(/^https?:\/\/(www\.)?/, '')}</a>.
        </p>
      )}

      <h2>Park High School — The Heart of the Community</h2>
      <p>
        Park High School is the center of {townName}'s youth culture and community identity.
        As a Class B school, it fields competitive teams in football, basketball, volleyball,
        track, wrestling, and cross-country — and the Ranger identity runs deep. Friday night
        football games, the homecoming parade down Park Street, and the spring track season
        along the Yellowstone are woven into the rhythm of life here.
      </p>
      <p>
        Beyond athletics, Park High offers fine arts programs that reflect {townName}'s broader
        creative culture — band, choir, drama, and visual arts all benefit from a community where
        professional writers, artists, and filmmakers are neighbors and mentors. Career and
        Technical Education (CTE) offerings prepare students for trades and healthcare careers,
        connecting directly to the local employment landscape at Livingston HealthCare, Park
        County, and the tourism sector.
      </p>

      <h2>Outdoor Education & Yellowstone Proximity</h2>
      <p>
        Few school districts in America can claim {townName}'s backyard. Yellowstone National Park
        is 52 miles south, the Absaroka-Beartooth Wilderness rises to the east, and the
        Yellowstone River runs through the heart of town. This geography shapes the educational
        experience in ways that go beyond the classroom — field trips to Yellowstone's geothermal
        features, ecology studies along the river, and conservation projects in the surrounding
        national forests give students a hands-on connection to the natural world that most
        districts can only simulate.
      </p>
      <p>
        Outdoor recreation is part of the curriculum, formally and informally. Skiing at Bridger
        Bowl (45 minutes west), fishing the Yellowstone and its spring creeks, hiking in the
        Crazy Mountains, and camping in the Gallatin National Forest are not extravagances in
        {' '}{townName} — they are the fabric of growing up here. For families who value outdoor
        education and an active lifestyle, this proximity to wild landscapes is one of the
        district's most compelling selling points.
      </p>

      <h2>No Local College — But MSU Is Next Door</h2>
      <p>
        {townName} does not have a four-year college or university within its borders, which
        distinguishes it from larger Montana cities like Missoula, Bozeman, and Helena. However,
        Montana State University in Bozeman is just 25 miles west over Bozeman Pass — close
        enough for a daily commute and within easy reach for dual-enrollment programs, campus
        visits, and cultural events. MSU's 16,000-student campus provides access to engineering,
        agriculture, nursing, business, and graduate programs that would otherwise require
        relocating to a larger city.
      </p>
      <p>
        This arrangement offers families an unusual advantage: the small-town school experience
        of {townName} during the K-12 years, with a major research university a short drive away
        for college. Some Park High graduates enroll at MSU while continuing to live in
        {' '}{townName}, saving on Bozeman's higher housing costs. Others head to the University
        of Montana in Missoula, Montana Tech in Butte, or out-of-state schools — but the
        proximity to MSU means that {townName} is never truly far from higher education
        opportunities.
      </p>

      <h2>Private & Alternative Schools</h2>
      <p>
        {townName}'s small size means private school options are limited compared to Helena or
        Billings, but families seeking alternatives have several paths. Homeschooling is
        well-established in the {townName} area, supported by cooperative groups that organize
        group instruction, field trips, and extracurricular activities. The Montana Digital
        Academy provides accredited online courses for students seeking coursework beyond what
        Park High offers, and some families supplement public schooling with private tutoring
        from the community's resident writers, scientists, and professionals.
      </p>

      <h2>Libraries & Lifelong Learning</h2>
      <p>
        The Livingston-Park County Public Library serves the community with a solid collection
        of physical and digital resources, children's programming, summer reading programs, and
        community meeting space. {townName}'s literary heritage — rooted in the writers who
        have called this town home for decades — gives the library a cultural significance that
        transcends its modest size. Author readings, writing workshops, and arts events are
        regular features of the library's calendar, reflecting a community that values
        intellectual life alongside outdoor recreation.
      </p>

      <h2>Schools & Family Life</h2>
      <p>
        For families considering a move, {townName}'s education system offers the advantages
        of a small, close-knit district — a {graduationRate ?? 88}% graduation rate, small class
        sizes, strong community involvement, and the kind of personal attention that larger
        districts struggle to provide. Park High's Class B status means every student who wants
        to participate in sports, arts, or activities can find a place, rather than competing
        against hundreds of peers for roster spots. The trade-off is scale — {townName} has one
        high school, limited AP course offerings compared to AA schools, and no local college.
      </p>
      <p>
        But the intangibles are powerful: Yellowstone in the backyard, a creative community that
        values education and the arts, MSU just over the pass, and a town where the school
        district is not just a service provider but the social fabric of the community. For
        families who prioritize small-school culture, outdoor access, and a town with genuine
        character, {townName}'s schools deliver. For housing near the schools, see
        our <Link href={`/montana-towns/${slug}/housing/`}>{townName} housing market guide</Link>.
        For the overall cost picture, see
        the <Link href={`/montana-towns/${slug}/cost-of-living/`}>cost of living guide</Link>.
      </p>
    </article>
  );
}
