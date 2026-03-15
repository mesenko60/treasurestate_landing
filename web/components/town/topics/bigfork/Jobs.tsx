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
        {townName} is an arts colony and resort village of {fmt(population)} people on the northeast
        shore of Flathead Lake in Flathead County, at 2,940 feet elevation. Known as the "Village by
        the Bay," {townName} has been recognized as one of "100 Best Small Art Towns in America" —
        a distinction earned through more than 20 galleries, the Bigfork Summer Playhouse ("Broadway
        in the Rockies" since 1960), and a walkable downtown packed with boutiques, restaurants, and
        studios. Sitting 17 miles southeast of Kalispell and 35 miles south of Whitefish, {townName}
        occupies a sweet spot in the Flathead Valley: close enough to regional employment centers,
        far enough to preserve its village character. The local economy runs on tourism, arts, and
        outdoor recreation, with a growing contingent of remote professionals drawn by the lifestyle.
        This guide covers industry composition, employment statistics, and what job seekers should
        know about working in one of Montana's most desirable small towns. For the full town profile,
        see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        leads at {industries[0]?.pct ?? 17.4}%, reflecting the school district, medical clinics, and
        assisted-living facilities serving the valley's aging population. Tourism & Hospitality follows
        closely at {industries[1]?.pct ?? 15.8}%, driven by Flathead Lake recreation, the Bigfork
        Summer Playhouse, lodging, restaurants, and outfitting operations. Professional Services ranks
        third at {industries[2]?.pct ?? 14.2}% — an unusually high share for a town this size,
        reflecting the growing population of remote workers, consultants, and creative professionals
        who chose {townName} for its lifestyle and work from home.
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

      <h2>Tourism and the Arts Economy</h2>
      <p>
        Tourism & Hospitality at {industries.find(i => i.name === 'Tourism')?.pct ?? 15.8}% is the
        heartbeat of {townName}'s economy and the reason the village exists in its current form.
        Flathead Lake — the largest natural freshwater lake west of the Mississippi — draws boaters,
        anglers, paddleboarders, and sightseers from across the region. The Bigfork Summer Playhouse,
        operating continuously since 1960, stages Broadway-caliber musicals every summer, filling
        restaurants and lodging throughout the season. More than 20 galleries and studios line Electric
        Avenue and the surrounding streets, supporting working artists, framers, and retail staff.
        Restaurants, brewpubs, and specialty food shops round out a walkable downtown that functions
        as a tourist destination in its own right.
      </p>
      <p>
        The seasonal employment cycle is pronounced: summer is peak season, with the playhouse,
        lake tours, cherry orchards, and restaurants operating at full capacity from June through
        September. Winter is quieter, though Whitefish Mountain Resort (35 miles north) provides
        some crossover tourism traffic. Job seekers in hospitality should expect strong summer demand
        and reduced hours or layoffs through the winter months.
      </p>

      <h2>Construction and Real Estate</h2>
      <p>
        Construction accounts for {industries.find(i => i.name === 'Construction')?.pct ?? 11.6}%
        of employment — driven primarily by high-end home building and resort development. With a
        median list price near $993,000, {townName}'s real estate market caters to affluent buyers
        building custom lakefront and hillside homes. Finance & Real Estate at{' '}
        {industries.find(i => i.name === 'Finance')?.pct ?? 7.9}% reflects the active real estate
        brokerage, property management, and mortgage lending industry that accompanies this market.
        Together these sectors employ nearly one in five workers in {townName} and offer opportunities
        for builders, skilled tradespeople, real estate agents, and property managers.
      </p>

      <h2>Remote Work and Professional Services</h2>
      <p>
        Professional Services at {industries.find(i => i.name === 'Professional')?.pct ?? 14.2}%
        is one of {townName}'s most notable economic features. The share is unusually high for a
        village of {fmt(population)} people and reflects a trend that has accelerated since 2020:
        remote-capable professionals — consultants, designers, writers, tech workers, and financial
        advisors — relocating to {townName} for the Flathead Lake lifestyle while maintaining clients
        and employers elsewhere. This cohort contributes above-average household incomes, supports
        local businesses year-round, and is less subject to seasonal employment swings. For job
        seekers with portable skills, {townName} offers the rare combination of a resort-quality
        setting with reliable broadband and proximity to Glacier Park International Airport in
        Kalispell.
      </p>

      <h2>Regional Employment — Kalispell and Beyond</h2>
      <p>
        {townName} sits 17 miles southeast of Kalispell, the Flathead Valley's commercial hub with
        a population over 28,000. Kalispell provides regional employment at Kalispell Regional
        Healthcare, Flathead County government offices, CHS (a major agricultural cooperative),
        retail centers, and a growing light-industrial sector. Many {townName} residents commute to
        Kalispell — a 20-minute drive on Montana Highway 35 and US-93 — for employment while
        enjoying {townName}'s quieter, arts-oriented village life. Whitefish (35 miles north) and
        Columbia Falls (25 miles north) add further employment options, particularly in tourism,
        manufacturing, and forest products.
      </p>

      <h2>Labor Force Dynamics</h2>
      <p>
        {townName}'s 48% labor force participation rate is notably low — well below Montana's
        statewide average near 63%. This is not a sign of economic distress. Rather, it reveals
        {townName}'s demographic reality: a large share of residents are retired or semi-retired,
        drawn to the Flathead Lake lifestyle, mild (by Montana standards) winters, and a vibrant
        arts and recreation scene. The 2.9% unemployment rate is remarkably low — effectively full
        employment — meaning that those who want to work can find it. With a labor force of{' '}
        {fmt(e?.laborForce ?? null)} and {fmt(e?.employed ?? null)} employed, the market is small
        but exceptionally tight. Employers in hospitality and retail frequently report difficulty
        filling seasonal positions, creating opportunity for workers willing to take on summer
        employment.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Tourism & Hospitality at 15.8% is the defining sector — the Bigfork Summer Playhouse, Flathead Lake recreation, galleries, and restaurants drive strong seasonal demand from June through September.</li>
        <li>Professional Services at 14.2% is unusually high, reflecting a growing remote-work population that supports year-round economic activity.</li>
        <li>Construction at 11.6% is fueled by high-end home building — skilled tradespeople are in demand given the $993K median list price.</li>
        <li>2.9% unemployment means effectively full employment — employers are actively competing for workers, especially in summer.</li>
        <li>48% labor force participation reflects retirees, not economic weakness — competition for jobs is moderate.</li>
        <li>Kalispell (17 miles) provides regional employment at the hospital, county offices, and retail — a quick commute from {townName}.</li>
        <li>Job score of 9.3/10 places {townName} among the highest-rated employment markets of all Montana hubs.</li>
        <li>For state job openings, check the <a href="https://mtstatejobs.taleo.net" target="_blank" rel="noopener noreferrer">Montana state jobs portal</a>. For federal positions, see <a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJobs.gov</a>.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
