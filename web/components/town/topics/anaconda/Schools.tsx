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
        {townName} offers a community-rooted school system serving roughly{' '}
        {fmt(schoolEnrollment)} students across the consolidated city-county of Deer Lodge County.
        The {schoolDistrict ?? 'Anaconda Public Schools'} district delivers solid academics with
        a {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate and{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'competitive'} per-pupil
        spending — above the Montana state average and well ahead of the national figure. With
        Montana Tech just 26 miles east in Butte and the Anaconda-Pintler Wilderness beginning
        11 miles south, students grow up with both higher education access and outdoor experiences
        that few districts can match. For families weighing a move, {townName}'s schools combine
        small-town values, historic community pride, and genuine academic quality at housing costs
        far below Montana's resort towns. For the full town profile, see
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
        The {schoolDistrict ?? 'Anaconda Public Schools'} district operates schools serving a
        consolidated city-county community of {fmt(population)} people. Anaconda High School —
        home of the Copperheads — serves grades 9 through 12 and competes in Class B athletics,
        fielding competitive programs in football, basketball, wrestling, track, and cross-country.
        The Copperheads name is a direct nod to the city's copper smelting heritage, and community
        pride around school athletics runs deep — Friday night football games are a civic event in
        {townName}.
      </p>
      <p>
        The district's {graduationRate != null ? `${graduationRate}%` : 'strong'} graduation rate
        is slightly below the Montana state average of approximately 87% but reflects the economic
        challenges the community has navigated since the smelter closure. Per-pupil spending of{' '}
        {perPupilSpending != null ? `$${fmt(perPupilSpending)}` : 'a competitive figure'} is above
        the Montana average, demonstrating the community's commitment to funding its schools even
        through difficult economic transitions. Class sizes are small — a genuine advantage that
        means teachers know every student by name and can provide individualized attention that
        larger districts cannot match.
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
        {townName}'s location at the foot of the Anaconda Range provides extraordinary outdoor
        education opportunities. The Anaconda-Pintler Wilderness — 158,000 acres of alpine
        backcountry — begins just 11 miles south of town. Georgetown Lake, Lost Creek State Park,
        and the Deerlodge National Forest are all within 15 miles. Science classes can conduct field
        studies in ecosystems ranging from montane forests to alpine meadows, and environmental
        science coursework benefits from the Superfund remediation story that is literally woven
        into the city's landscape.
      </p>
      <p>
        The Old Works Golf Course, built on reclaimed smelter land, serves as a living case study
        in environmental restoration. Students grow up seeing firsthand how contaminated industrial
        land can be transformed into a community asset — a lesson in ecology, engineering, and
        civic resilience that no textbook can replicate.
      </p>

      <h2>Hearst Free Library</h2>
      <p>
        The Hearst Free Library is one of {townName}'s most treasured institutions. Built in 1898
        and funded by Phoebe Apperson Hearst — mother of newspaper magnate William Randolph
        Hearst — the library was a gift to the community in recognition of the workers who built
        the smelter. The Romanesque Revival building is on the National Register of Historic Places
        and continues to serve as {townName}'s public library, offering reading programs, community
        events, digital resources, and a quiet study space for students. For families, it is both a
        historic landmark and a practical educational resource.
      </p>

      <h2>Montana Tech and Higher Education</h2>
      <p>
        Montana Technological University (Montana Tech) in Butte, just 26 miles east, is the
        nearest four-year institution. Montana Tech is nationally recognized for programs in
        mining engineering, petroleum engineering, geoscience, and environmental engineering —
        fields directly connected to {townName}'s smelting and remediation heritage. The
        university also offers degrees in nursing, business, computer science, and liberal arts.
        For {townName} students, Montana Tech provides a four-year university within commuting
        distance, eliminating the need to relocate for higher education.
      </p>
      <p>
        Highlands College, Montana Tech's two-year affiliate, offers associate degrees and
        certificates in trades, nursing, IT, and business — an accessible and affordable pathway
        for students seeking workforce-ready credentials. Dual-enrollment agreements may allow
        Anaconda High School juniors and seniors to begin earning college credits before graduation.
      </p>

      <h2>Nearby Universities</h2>
      <p>
        For programs beyond Montana Tech's offerings, the University of Montana in Missoula is
        approximately 120 miles northwest, and Montana State University in Bozeman is roughly 100
        miles east. Both are the state's flagship institutions, offering a full range of
        undergraduate and graduate programs. Many {townName} graduates attend one of these
        universities or Montana Tech before deciding whether to return to the Deer Lodge Valley
        or pursue careers elsewhere. The Montana Digital Academy provides accredited online courses
        for students seeking coursework not available locally.
      </p>

      <h2>What Families Should Know</h2>
      <p>
        For families considering a move to {townName}, the school system is a solid choice.
        {schoolDistrict ?? 'Anaconda Public Schools'} operates a close-knit district where teachers
        know students by name, parent involvement is high, and the community turns out for
        Copperhead games and school events. The{' '}
        {graduationRate != null ? `${graduationRate}%` : ''} graduation rate, combined with
        above-average per-pupil spending and small class sizes, compares well for a community of
        this size.
      </p>
      <p>
        {townName}'s greatest educational advantages are affordability and access: housing costs
        are a fraction of Montana resort towns, Montana Tech is 26 miles away, and the natural
        landscape provides an outdoor classroom unlike any other. The main trade-off is that the
        district is small — advanced course offerings and extracurricular variety are more limited
        than in Missoula or Bozeman. For families who value community, affordability, and a
        deep connection to Montana's heritage, {townName}'s schools deliver.
      </p>
      <p>
        For details on employment and the local economy, see
        our <Link href={`/montana-towns/${slug}/jobs/`}>{townName} jobs and economy guide</Link>.
      </p>
    </article>
  );
}
