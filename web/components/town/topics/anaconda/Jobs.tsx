import Link from 'next/link';

type Industry = { name: string; fullName: string; pct: number };

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
        {townName} is a historic smelter city of {fmt(population)} people in Deer Lodge County,
        26 miles west of Butte at 5,335 feet elevation. For nearly a century, the Anaconda Copper
        Mining Company — founded by Copper King Marcus Daly in 1883 — defined the local economy,
        operating the world's largest non-ferrous smelting plant and employing thousands. When
        Atlantic Richfield Company closed the smelter in 1980, {townName} lost its economic anchor
        almost overnight. What followed was one of Montana's most remarkable recoveries: massive
        Superfund environmental cleanup, the transformation of toxic smelter land into the Jack
        Nicklaus-designed Old Works Golf Course, and a pivot toward tourism, healthcare, and trades.
        Today {townName}'s economy is more diversified than at any point in its history. This guide
        covers industry composition, employment statistics, and what job seekers should know about
        working in a town that has reinvented itself from company town to recreation gateway. For
        the full town profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}'s employment spans {industries.length} major sectors. Education & Healthcare
        leads at {industries[0]?.pct ?? 25.8}%, anchored by the local hospital, clinic system, and
        Anaconda Public Schools — a natural top employer in a consolidated city-county of under
        10,000 people. Tourism & Hospitality follows at {industries[1]?.pct ?? 11.3}%, driven by
        Georgetown Lake, Discovery Ski Area, Fairmont Hot Springs, and the Old Works Golf Course.
        Construction ranks third at {industries[2]?.pct ?? 10.7}%, fueled by ongoing Superfund
        remediation work, infrastructure improvements, and new residential development as {townName}
        attracts buyers seeking affordable southwest Montana living.
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
                <td style={{ padding: '0.5rem' }}>{ind.fullName || ind.name}</td>
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>The Smelter Legacy</h2>
      <p>
        The Anaconda Copper Mining Company operated the Washoe Reduction Works from the 1880s until
        1980, at its peak employing thousands of workers and processing copper ore shipped by rail
        from Butte's underground mines. The 585-foot Washoe Smelter Stack — once the tallest
        freestanding masonry structure in the world — still dominates the skyline as a monument to
        that era. {townName} was the quintessential company town: Daly built the smelter, the
        railroad, the hotel, and much of the housing. When Atlantic Richfield closed the smelter,
        the economic fallout was devastating — job losses cascaded through every sector, businesses
        shuttered, and the population declined sharply through the 1980s.
      </p>
      <p>
        The recovery came through an unlikely source: environmental cleanup. The Anaconda smelter
        site was designated a Superfund priority, and the EPA-led remediation brought federal
        dollars, construction jobs, and a long-term economic anchor. The most visible result is the
        Old Works Golf Course, a Jack Nicklaus Signature Design course built directly on reclaimed
        smelter land, complete with distinctive black slag sand bunkers. The course opened in 1997
        and has been a tourism driver ever since. Remediation work continues to this day, sustaining
        construction and environmental services employment.
      </p>

      <h2>Tourism and Recreation Economy</h2>
      <p>
        Tourism & Hospitality accounts for {industries.find(i => i.name === 'Tourism')?.pct ?? 11.3}%
        of {townName}'s employment — a sector that barely existed during the smelter era. Georgetown
        Lake, a 2,800-acre reservoir 15 miles west, draws anglers, boaters, and ice fishermen
        year-round. Discovery Ski Area, 20 miles west on the Pintler Scenic Route, provides winter
        recreation employment. Fairmont Hot Springs Resort, just 8 miles east, is a major regional
        destination. The Anaconda-Pintler Wilderness, Lost Creek State Park, and hundreds of miles
        of trails in the Deerlodge National Forest add to the outdoor recreation economy.
      </p>
      <p>
        Unlike Glacier- or Yellowstone-gateway towns, {townName}'s tourism is not dominated by a
        single national park. This produces a more moderate seasonal swing — Georgetown Lake and
        Discovery Ski keep winter activity higher than in summer-only resort towns, and the golf
        course draws visitors from May through October. The trade-off is that total tourism volume
        is lower, meaning hospitality wages and tip income tend to be more modest.
      </p>

      <h2>Construction and Remediation</h2>
      <p>
        At {industries.find(i => i.name === 'Construction')?.pct ?? 10.7}% of employment,
        construction is well above the Montana average. Ongoing Superfund remediation and
        infrastructure work provide a steady baseline of jobs unique to {townName}. Beyond cleanup,
        new residential construction and renovation of {townName}'s historic housing stock keep
        builders, electricians, and plumbers employed. The city's affordable home prices relative to
        Butte and the broader southwest Montana market have attracted buyers, supporting continued
        building activity.
      </p>

      <h2>Commuting to Butte</h2>
      <p>
        {townName} sits just 26 miles — roughly 30 minutes — west of Butte via Montana Highway 1
        or Interstate 90. This proximity is a significant economic advantage: many {townName}
        residents commute to Butte for employment at Montana Tech, St. James Healthcare, NorthWestern
        Energy, or the various mining and reclamation operations in the Butte-Silver Bow area.
        Conversely, some Butte workers commute to {townName} for positions in healthcare,
        education, or recreation. This interconnected labor market effectively gives {townName}
        residents access to Butte's 34,000-person economy while enjoying lower housing costs and a
        quieter, recreation-oriented lifestyle.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s 54.7% labor force participation rate is notably low compared to Montana's
        statewide average near 63%. This reflects the city's demographic profile: a significant
        share of the population is retired or semi-retired, drawn by affordable housing, hot springs,
        and outdoor recreation. The 4.9% unemployment rate is manageable and consistent with
        Montana's broader labor market. With a labor force of {fmt(e?.laborForce ?? null)} and{' '}
        {fmt(e?.employed ?? null)} employed, the market is small but stable — seasonal fluctuations
        in tourism and construction are buffered by the year-round healthcare and education sectors.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Education & Healthcare is the largest sector at 25.8% — the local hospital, clinics, and school district provide stable, non-seasonal employment.</li>
        <li>Tourism & Hospitality at 11.3% offers seasonal work tied to Georgetown Lake, Discovery Ski Area, Fairmont Hot Springs, and Old Works Golf Course.</li>
        <li>Construction and environmental remediation at 10.7% provide above-average opportunities for skilled tradespeople, partly driven by ongoing Superfund work.</li>
        <li>Butte is 26 miles east, giving commuters access to Montana Tech, St. James Healthcare, mining operations, and the broader Butte-Silver Bow job market.</li>
        <li>Agriculture & Mining still accounts for {industries.find(i => i.name === 'Agriculture')?.pct ?? 4.9}% of jobs, a legacy of the region's copper and ranching heritage.</li>
        <li>{townName}'s low labor force participation (54.7%) reflects a large retired population — competition for entry-level and service jobs is moderate.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
