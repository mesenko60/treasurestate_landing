import Link from 'next/link';

type Industry = { name: string; pct: number };

type Props = {
  townName: string;
  slug: string;
  economy: {
    unemploymentRate: number | null;
    laborForceParticipation: number | null;
    employed: number | null;
    laborForce: number | null;
    mainIndustry: string | null;
    topIndustries: Industry[] | null;
    jobScore: number | null;
  } | null;
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

export default function Jobs({ townName, slug, economy, population }: Props) {
  const e = economy;
  const industries = e?.topIndustries ?? [];

  return (
    <article className="content-section">
      <p>
        {townName} is the commercial hub of southeastern Montana{'\u2014'}a town of {fmt(population)} people
        in Custer County that serves as the economic center for a vast region of cattle ranches,
        prairie farms, and small communities stretching from the Yellowstone River to the Dakota
        border. The economy is anchored by healthcare, education, agriculture, and government
        rather than tourism or tech, giving {townName} a stability that boom-and-bust resort
        towns lack. With a {e?.unemploymentRate ?? 3.2}% unemployment rate and a labor force
        participation rate of {e?.laborForceParticipation ?? 66.9}%, the job market is tight
        in the way that small regional hubs tend to be{'\u2014'}not many openings, but not many
        job seekers either. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Employment at a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Unemployment Rate</div><div style={cardValue}>{e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Labor Force</div><div style={cardValue}>{fmt(e?.laborForce ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Employed</div><div style={cardValue}>{fmt(e?.employed ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Participation Rate</div><div style={cardValue}>{e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '\u2014'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Top Industry</div><div style={{ ...cardValue, fontSize: '0.95rem' }}>{e?.mainIndustry ?? '\u2014'}</div></div>
        {e?.jobScore != null && <div style={cardStyle}><div style={cardLabel}>Job Score</div><div style={cardValue}>{e.jobScore}/10</div></div>}
      </div>

      <h2>Industry Breakdown</h2>
      <p>
        {townName}{'\u2019'}s employment spans {industries.length > 0 ? industries.length : 'several'} major
        sectors. The largest is {e?.mainIndustry ?? 'Education & Healthcare'}, accounting for{' '}
        {industries[0]?.pct ?? 28}% of all jobs{'\u2014'}driven by Holy Rosary Healthcare (an
        Intermountain Health facility), Miles Community College, and the Custer County school
        district. Agriculture and ranching, while not always captured as the top category in
        census data, define the economic identity of {townName} and Custer County. The cattle
        industry generates billions in economic activity across eastern Montana, and {townName}
        serves as the supply, service, and auction hub for ranches spanning hundreds of miles
        in every direction.
      </p>
      {industries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Industry</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Share</th>
              <th style={{ padding: '0.5rem', width: '40%' }}></th>
            </tr>
          </thead>
          <tbody>
            {industries.map(ind => (
              <tr key={ind.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{ind.name}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{ind.pct}%</td>
                <td style={{ padding: '0.5rem' }}>
                  <div style={{ background: '#e2ebe2', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ background: '#3b6978', height: '100%', width: `${Math.min(ind.pct * 3, 100)}%`, borderRadius: '4px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ fontSize: '0.85rem', color: '#555555', fontStyle: 'italic' }}>
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019{'\u2013'}2023).
      </p>

      <h2>Holy Rosary Healthcare{'\u2014'}The Largest Employer</h2>
      <p>
        Holy Rosary Healthcare is {townName}{'\u2019'}s largest institutional employer and the primary
        medical facility for a service area covering much of southeastern Montana. The hospital
        operates as part of the Intermountain Health system (formerly SCL Health), providing
        emergency services, inpatient care, surgical services, and a network of outpatient clinics
        that serve Custer County and surrounding rural communities. For a region where the next
        major hospital is in Billings (145 miles west), Holy Rosary is a critical lifeline.
      </p>
      <p>
        Healthcare employment spans physicians, nurses, therapists, lab technicians, imaging
        specialists, and a large administrative staff. Rural healthcare faces persistent
        workforce shortages across Montana, and Holy Rosary consistently recruits for clinical
        and nursing positions{'\u2014'}these are among the best-paying and most stable jobs in {townName},
        with benefits that the agricultural and retail sectors cannot match. Miles Community
        College{'\u2019'}s nursing program feeds directly into Holy Rosary{'\u2019'}s pipeline.
      </p>

      <h2>Miles Community College</h2>
      <p>
        Miles Community College (MCC) is a two-year institution that serves both as an educational
        pathway and a significant employer. MCC offers associate degrees, workforce training
        certificates, and transfer programs that feed into four-year universities across Montana.
        The college is nationally known for its NIRA rodeo team{'\u2014'}one of the top collegiate rodeo
        programs in the country{'\u2014'}which draws student athletes from across the West and reinforces
        {townName}{'\u2019'}s identity as a rodeo and ranching town.
      </p>
      <p>
        Beyond academics, MCC provides workforce development programs aligned with the region{'\u2019'}s
        needs: nursing, agricultural technology, welding, diesel mechanics, and business
        administration. Faculty, staff, and administrative positions at the college represent
        stable, year-round employment with state benefits{'\u2014'}a valuable anchor in a small-town
        economy where many jobs are seasonal or tied to commodity prices.
      </p>

      <h2>Agriculture & Ranching</h2>
      <p>
        {townName} earned its {'\u201C'}Cow Capital{'\u201D'} moniker honestly. Custer County and the surrounding
        region support one of the densest cattle operations in Montana, and {townName} is where
        ranchers come to sell livestock, buy supplies, service equipment, and conduct business.
        The livestock auction yards, feed stores, veterinary clinics, farm implement dealers, and
        agricultural lenders that line the highway corridors exist because of the ranching economy.
      </p>
      <p>
        The Bucking Horse Sale{'\u2014'}held each May{'\u2014'}is the signature event of {townName}{'\u2019'}s
        agricultural calendar. Part rodeo stock sale, part community celebration, it draws
        thousands of visitors and showcases the town{'\u2019'}s deep roots in the livestock industry.
        Agricultural employment is inherently seasonal and subject to commodity price swings,
        drought cycles, and federal land-use policy{'\u2014'}but it remains the cultural and economic
        foundation upon which everything else in {townName} is built.
      </p>

      <h2>Government & Public Sector</h2>
      <p>
        As the Custer County seat and the regional hub of southeastern Montana, {townName} hosts
        a concentration of government employment. Custer County offices, the Bureau of Land
        Management (which manages vast tracts of federal land in the region), the USDA service
        center, and state agencies all maintain offices here. These public-sector positions
        provide stable, benefited employment that helps anchor the local economy through
        agricultural downturns and commodity price cycles.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}{'\u2019'}s labor force of {fmt(e?.laborForce ?? null)} reflects a community where
        most working-age adults are employed, though not always in high-wage positions. The
        {' '}{e?.laborForceParticipation ?? 66.9}% participation rate is solid for a town of this
        size, and the {e?.unemploymentRate ?? 3.2}% unemployment rate signals a tight market
        where employers{'\u2014'}particularly in healthcare and skilled trades{'\u2014'}compete for workers.
      </p>
      <p>
        The 87% high school graduation rate reflects a community that values education, and
        Miles Community College provides local access to post-secondary training without
        requiring a move to Billings, Bozeman, or Missoula. For workers considering a move,
        {townName}{'\u2019'}s low cost of living (affordability ratio 3.8) means that moderate wages
        go further here than comparable salaries in western Montana{'\u2019'}s expensive markets.
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Holy Rosary Healthcare is the largest employer{'\u2014'}clinical, nursing, and administrative roles are consistently available at this Intermountain Health facility serving all of southeastern Montana.</li>
        <li>Miles Community College provides both employment (faculty, staff) and workforce training in nursing, agricultural technology, welding, and diesel mechanics.</li>
        <li>Agriculture and ranching define the economic identity of Custer County{'\u2014'}livestock auctions, farm supply, veterinary services, and equipment dealers all depend on the cattle industry.</li>
        <li>Government employment (county, BLM, USDA, state agencies) provides stable, benefited positions that weather agricultural downturns.</li>
        <li>The {e?.unemploymentRate ?? 3.2}% unemployment rate reflects a tight market{'\u2014'}employers in healthcare and skilled trades actively recruit.</li>
        <li>Low cost of living (affordability ratio 3.8) means moderate wages stretch further than similar salaries in Bozeman, Missoula, or Whitefish.</li>
        <li>Remoteness is the trade-off{'\u2014'}Billings (145 mi) is the nearest major city, and career advancement in specialized fields may eventually require relocation.</li>
      </ul>
    </article>
  );
}
