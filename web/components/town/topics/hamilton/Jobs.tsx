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
        {townName} is the economic hub of Montana{'\u2019'}s Bitterroot Valley, a town of {fmt(population)}{' '}
        in Ravalli County where the local economy blends retail commerce, federal research science,
        healthcare, and a growing contingent of remote workers who relocated for the valley{'\u2019'}s
        outdoor lifestyle. The town{'\u2019'}s most distinctive employer is Rocky Mountain Laboratories
        (RML), a National Institutes of Health research facility that conducts BSL-4 biosafety
        research on infectious diseases{'\u2014'}an institution that brings high-skill federal jobs and
        scientific talent to a community that would otherwise be defined by its retail and service
        economy. With an ultra-low unemployment rate of {e?.unemploymentRate ?? 1.9}%, {townName}{'\u2019'}s
        labor market is tight across nearly every sector. For the full city profile, see
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
        {townName}{'\u2019'}s employment spans {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'Retail'}, accounting for {industries[0]?.pct ?? 16}% of all
        jobs{'\u2014'}reflecting {townName}{'\u2019'}s role as the commercial center of the Bitterroot Valley,
        serving communities from Darby to Stevensville and beyond. Retail employment ranges from
        grocery stores and hardware suppliers to outdoor recreation shops that cater to the
        valley{'\u2019'}s active population. Healthcare, anchored by Marcus Daly Memorial Hospital and
        associated clinics, provides the second major employment pillar. Education through
        Hamilton School District rounds out the traditional employment base.
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
      <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019{'\u2013'}2023).
      </p>

      <h2>Rocky Mountain Laboratories — Federal Science in Rural Montana</h2>
      <p>
        Rocky Mountain Laboratories (RML) is {townName}{'\u2019'}s most distinctive employer and one of
        the most significant federal research facilities in the rural West. Operated by the
        National Institute of Allergy and Infectious Diseases (NIAID), a division of the NIH,
        RML conducts research on tick-borne diseases, viral hemorrhagic fevers, and emerging
        infectious diseases in one of only a handful of BSL-4 (Biosafety Level 4) laboratories
        in the United States. The facility gained international attention during the COVID-19
        pandemic for its role in early SARS-CoV-2 research.
      </p>
      <p>
        RML employs scientists, laboratory technicians, support staff, and administrative
        personnel{'\u2014'}providing well-compensated federal jobs with benefits in a community where
        median household income is otherwise modest at roughly $53K. The presence of PhD-level
        researchers and their families adds an intellectual dimension to {townName}{'\u2019'}s community
        that is unusual for a town this size. RML positions are highly competitive and typically
        filled through federal hiring processes (USAJobs.gov).
      </p>

      <h2>Healthcare — Marcus Daly Memorial Hospital</h2>
      <p>
        Marcus Daly Memorial Hospital is {townName}{'\u2019'}s primary healthcare provider and one of
        the largest employers in Ravalli County. The hospital operates emergency, surgical,
        obstetric, and outpatient services, along with associated clinics throughout the
        Bitterroot Valley. Named for the copper king who founded the town in the 1890s, the
        hospital provides critical access healthcare to a valley population that is spread across
        a long, narrow corridor with limited alternatives{'\u2014'}the nearest large hospital is in
        Missoula, 47 miles north.
      </p>
      <p>
        Healthcare employment in {townName} spans physicians, nurses, therapists, technicians,
        and administrative staff. As Montana{'\u2019'}s rural healthcare system faces persistent workforce
        shortages, Marcus Daly Memorial represents a stable source of year-round employment with
        benefits{'\u2014'}particularly valuable in a community where retail and seasonal work offer
        fewer protections.
      </p>

      <h2>The Remote Worker Effect</h2>
      <p>
        The Bitterroot Valley has experienced a significant influx of remote workers since 2020,
        and {townName} sits at the center of this trend. Professionals in tech, finance, marketing,
        and consulting who can work from anywhere have been drawn to the valley{'\u2019'}s combination
        of mountain scenery, outdoor recreation (100 trailheads within 50 miles), mild climate,
        and proximity to Missoula{'\u2019'}s airport and amenities. These workers bring incomes that
        often exceed local medians by a significant margin, contributing to the housing
        affordability challenges documented in
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
      <p>
        The {e?.laborForceParticipation ?? 60.1}% labor force participation rate is lower than
        Montana{'\u2019'}s statewide average, reflecting {townName}{'\u2019'}s significant retiree population{'\u2014'}many
        of whom moved to the Bitterroot Valley specifically for retirement. This demographic
        reality means that while the unemployment rate is ultra-low at {e?.unemploymentRate ?? 1.9}%,
        a substantial portion of the adult population is not in the labor force by choice.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}{'\u2019'}s labor force of {fmt(e?.laborForce ?? null)} is small but fully employed.
        The {e?.unemploymentRate ?? 1.9}% unemployment rate is among the lowest of any hub city
        we profile{'\u2014'}indicating a labor market where employers compete for workers rather than
        the reverse. This tightness is particularly acute in retail, food service, and healthcare
        support roles, where wages struggle to compete with the cost of living in an increasingly
        expensive valley.
      </p>
      <p>
        The University of Montana in Missoula (47 miles north) provides the nearest four-year
        higher education and workforce pipeline. Many {townName} residents commute to Missoula for
        employment, education, or specialized services, and the US-93 corridor functions as a
        de facto economic corridor connecting the Bitterroot Valley to Missoula{'\u2019'}s larger labor
        market. Ravalli County government and Hamilton School District provide stable public-sector
        employment with benefits.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Rocky Mountain Laboratories (NIH/NIAID) is {townName}{'\u2019'}s most distinctive employer{'\u2014'}high-skill federal research positions in infectious disease, hired through USAJobs.gov.</li>
        <li>Marcus Daly Memorial Hospital anchors healthcare employment in the Bitterroot Valley, with clinical, nursing, and administrative roles consistently available.</li>
        <li>Retail is the largest employment sector, reflecting {townName}{'\u2019'}s role as the commercial center serving the entire Bitterroot Valley from Darby to Stevensville.</li>
        <li>The {e?.unemploymentRate ?? 1.9}% unemployment rate signals an extremely tight labor market{'\u2014'}employers are actively competing for workers, particularly in service and healthcare support roles.</li>
        <li>Remote workers in tech, finance, and consulting have reshaped the community{'\u2014'}bringing higher incomes but also driving up housing costs documented in our cost of living guide.</li>
        <li>The University of Montana in Missoula (47 mi) provides the nearest higher education and a broader labor market accessible via the US-93 commuter corridor.</li>
        <li>The {e?.laborForceParticipation ?? 60.1}% participation rate reflects a large retiree population{'\u2014'}not economic weakness but lifestyle choice in one of Montana{'\u2019'}s most popular retirement destinations.</li>
      </ul>
    </article>
  );
}
