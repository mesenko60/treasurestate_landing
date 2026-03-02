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
  if (n == null) return '—';
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
        {townName} sits at the doorstep of Yellowstone National Park, where the Yellowstone River
        emerges from Paradise Valley and bends north toward the Great Plains. With a population of{' '}
        {fmt(population)}, the local economy defies easy classification — it blends healthcare,
        tourism, and an unusually large creative and professional-services sector that reflects
        the writers, artists, filmmakers, and remote workers who have made {townName} home since
        the railroad era. The result is a labor force participation rate of{' '}
        {e?.laborForceParticipation ?? 70.6}% — the highest of any hub city we track — signaling
        a deeply entrepreneurial, self-directed workforce. For the full city profile, see
        our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
      </p>

      <h2>Employment at a Glance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
        <div style={cardStyle}><div style={cardLabel}>Unemployment Rate</div><div style={cardValue}>{e?.unemploymentRate != null ? `${e.unemploymentRate}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Labor Force</div><div style={cardValue}>{fmt(e?.laborForce ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Employed</div><div style={cardValue}>{fmt(e?.employed ?? null)}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Participation Rate</div><div style={cardValue}>{e?.laborForceParticipation != null ? `${e.laborForceParticipation}%` : '—'}</div></div>
        <div style={cardStyle}><div style={cardLabel}>Top Industry</div><div style={{ ...cardValue, fontSize: '0.95rem' }}>{e?.mainIndustry ?? '—'}</div></div>
        {e?.jobScore != null && <div style={cardStyle}><div style={cardLabel}>Job Score</div><div style={cardValue}>{e.jobScore}/10</div></div>}
      </div>

      <h2>Industry Breakdown</h2>
      <p>
        {townName}'s employment spans {industries.length} major sectors. The largest is{' '}
        {e?.mainIndustry ?? 'Education & Healthcare'}, accounting for{' '}
        {industries[0]?.pct ?? 18}% of all jobs — anchored by Livingston HealthCare, a critical
        access hospital affiliated with Billings Clinic and the Community Health System, along
        with Livingston Public Schools. What sets {townName} apart is its unusually high
        professional-services share — roughly 17.3% — reflecting the concentration of writers,
        artists, consultants, and remote workers who have been drawn to this railroad town turned
        creative hub. Tourism and hospitality account for approximately 13.2%, driven by
        Yellowstone-bound travelers, fly-fishing outfitters, and the restaurants, lodges, and
        shops that line downtown's historic brick storefronts.
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>The Creative Economy — {townName}'s Defining Edge</h2>
      <p>
        {townName} has long attracted writers, artists, and independent thinkers. The tradition
        stretches back decades — novelist Thomas McGuane, essayist Tim Cahill, and painter Russell
        Chatham helped put the town on the literary map in the 1970s and '80s, and the culture
        they cultivated persists. Today, professional services account for 17.3% of local
        employment, an unusually high share for a town of {fmt(population)}. This category
        encompasses freelance writers, filmmakers, graphic designers, consultants, and a growing
        cohort of remote workers in tech, marketing, and finance who moved to {townName} for the
        quality of life and stayed for the community.
      </p>
      <p>
        The labor force participation rate of {e?.laborForceParticipation ?? 70.6}% — the highest
        among the hub cities we profile — reflects this entrepreneurial character. In {townName},
        people work — they just don't always work for someone else. Self-employment, contract
        work, and small proprietorships are unusually common, giving the local economy a resilience
        that belies its small population. The flip side is that many of these positions lack
        employer-provided benefits, and incomes can be variable, especially for those in the arts.
      </p>

      <h2>Livingston HealthCare — The Medical Anchor</h2>
      <p>
        Livingston HealthCare is {townName}'s largest institutional employer and the primary
        healthcare provider for Park County. Designated as a critical access hospital, it operates
        a 25-bed inpatient facility, an emergency department, a network of outpatient clinics, and
        specialty services that reduce the need for patients to travel to Bozeman or Billings.
        The hospital is affiliated with Billings Clinic and the Community Health System (CHS),
        giving it access to specialist networks and resources that a standalone rural hospital
        could not sustain.
      </p>
      <p>
        Healthcare employment in {townName} spans physicians, nurses, therapists, lab technicians,
        and administrative staff. As Montana's rural healthcare landscape faces persistent
        workforce shortages, Livingston HealthCare represents a stable and growing source of
        year-round employment with benefits — a valuable counterweight to the seasonal patterns
        of the tourism sector.
      </p>

      <h2>Tourism, Fly Fishing & the Yellowstone Economy</h2>
      <p>
        {townName} is the original gateway to Yellowstone National Park — the Northern Pacific
        Railway built the town in 1882 expressly to funnel visitors to the park's north entrance,
        52 miles south via Paradise Valley. Tourism and hospitality account for roughly 13.2% of
        local employment, spanning restaurants, hotels, fishing lodges, outfitter services, and
        retail shops that serve the millions of visitors who pass through Park County each year.
      </p>
      <p>
        Fly fishing is central to {townName}'s identity and economy. Dan Bailey's Fly Shop,
        operating on Park Street since 1938, is one of the most iconic fly shops in the American
        West and anchors a broader ecosystem of fishing guides, outfitters, and gear
        manufacturers. The Yellowstone River, spring creeks like Armstrong and Nelson's, and
        nearby tributaries draw anglers from around the world, supporting a seasonal but
        high-value employment niche. The tourism sector's seasonal nature — peaking from June
        through September — means that winter employment dips, and many workers carry multiple
        jobs or supplement guiding income with off-season contract work.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force of {fmt(e?.laborForce ?? 5102)} is small but remarkably active.
        The {e?.laborForceParticipation ?? 70.6}% participation rate stands well above the Montana
        average, driven by the town's entrepreneurial culture and the prevalence of self-employment.
        The unemployment rate of {e?.unemploymentRate ?? 3.4}% indicates a tight market,
        particularly in healthcare, skilled trades, and hospitality during peak season.
      </p>
      <p>
        {townName} has no four-year college or university. Montana State University in Bozeman is
        25 miles west over Bozeman Pass, and many {townName} residents commute to MSU for
        education or employment. This proximity to a major research university gives {townName}
        indirect access to a workforce pipeline without bearing the housing-cost pressures that
        Bozeman's explosive growth has created. Park County government and Livingston Public
        Schools round out the public-sector employment base, with consistent openings in
        education, public safety, and municipal services.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Livingston HealthCare is the town's largest institutional employer — clinical, nursing, and administrative roles are consistently available at this critical access hospital affiliated with Billings Clinic.</li>
        <li>Professional services and self-employment account for 17.3% of the workforce — an unusually high share reflecting {townName}'s creative culture of writers, artists, filmmakers, consultants, and remote workers.</li>
        <li>Tourism and hospitality peak June through September, with fly-fishing guides, outfitters, restaurants, and lodges hiring seasonally. Dan Bailey's Fly Shop is an iconic anchor of this economy.</li>
        <li>The {e?.laborForceParticipation ?? 70.6}% labor force participation rate — highest of any hub we profile — signals an entrepreneurial, self-directed workforce rather than a traditional employer-driven market.</li>
        <li>Park County government and Livingston Public Schools provide stable public-sector employment with benefits, offering a counterbalance to seasonal and freelance work.</li>
        <li>Montana State University in Bozeman is just 25 miles west, providing education access, commuter employment opportunities, and a broader talent pool without {townName}'s housing costs.</li>
        <li>Seasonal fluctuation is real — winter brings quieter months for tourism-dependent businesses, so workers who can diversify their income streams or shift to remote work fare best.</li>
      </ul>
    </article>
  );
}
