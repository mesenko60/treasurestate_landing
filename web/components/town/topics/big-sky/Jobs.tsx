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
        {townName} is an unincorporated resort community of {fmt(population)} year-round residents
        at the base of Lone Mountain in Gallatin County, 45 miles south of Bozeman via the
        Gallatin Canyon. The local economy is dominated by a single industry{'\u2014'}tourism and
        hospitality{'\u2014'}centered on Big Sky Resort, one of the largest ski areas in North
        America with 5,800 skiable acres and 4,350 feet of vertical drop. The resort and its
        satellite businesses drive virtually every aspect of employment in {townName}, from lift
        operations and ski instruction to restaurants, lodging, property management, and
        construction. With an unemployment rate of {e?.unemploymentRate ?? 2.1}% and a labor force
        participation rate of {e?.laborForceParticipation ?? 78}%, this is a community where
        almost everyone works{'\u2014'}the challenge is not finding a job but affording to live near
        one. For the full community profile, see
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
        {townName}'s employment is overwhelmingly concentrated in tourism and hospitality{'\u2014'}the
        sector accounts for the largest share of local jobs and shapes every other industry in the
        community. Big Sky Resort, its parent company Boyne Resorts, and the resort's constellation
        of restaurants, hotels, retail shops, and recreation services form the economic core.
        Construction is the second-largest sector, driven by the continuous development of resort
        condominiums, luxury homes, and commercial properties across Spanish Peaks, Moonlight Basin,
        and the Town Center. Real estate and property management round out the top employers,
        reflecting the dominant role of second-home sales and vacation rental management in the
        local economy.
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
        Source: U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).
      </p>

      <h2>Big Sky Resort — The Dominant Employer</h2>
      <p>
        Big Sky Resort is the economic engine of the entire community. The resort employs
        roughly 2,000{'\u2013'}3,000 workers at peak season across ski operations, snowmaking, lift
        maintenance, ski school, food and beverage, lodging, retail, and summer recreation
        programs. Winter season (Thanksgiving through mid-April) is the employment peak, but
        the resort has invested heavily in year-round programming{'\u2014'}mountain biking, the Lone
        Peak Tram (offering summit access at 11,166 feet), zipline tours, disc golf, and an
        expanding events calendar have made summer a second high season.
      </p>
      <p>
        The resort provides some employee housing, a critical benefit given {townName}'s extreme
        housing costs. However, the available units fall far short of demand, and many resort
        workers commute from Bozeman (45 miles), Belgrade, or shared housing in the Gallatin
        Canyon. The resort's seasonal hiring cycle means that the workforce expands rapidly in
        November and May, drawing workers from across the country{'\u2014'}many seasonal employees
        are young workers following the resort circuit between ski towns and beach towns.
      </p>

      <h2>The Yellowstone Club & Private Clubs</h2>
      <p>
        The Yellowstone Club{'\u2014'}a private, members-only ski and golf community adjacent to Big
        Sky Resort{'\u2014'}is a significant employer in its own right. The club maintains its own ski
        lifts, golf course, dining facilities, spa, and property management operations, employing
        hundreds of workers year-round. Spanish Peaks Mountain Club and Moonlight Basin add
        further private-club employment in hospitality, grounds maintenance, and member services.
        These employers offer relatively competitive wages for the resort industry, but the
        housing challenge remains the same{'\u2014'}workers earn service-industry wages in a market
        where the median home costs $1.78 million.
      </p>

      <h2>Seasonal Workforce Dynamics</h2>
      <p>
        {townName}'s economy has a pronounced seasonal rhythm. The winter high season (December
        through March) brings peak employment, as ski operations, restaurants, and lodging reach
        full capacity. A brief shoulder season in April and May sees staffing drop before summer
        operations ramp up in June. Summer has become increasingly robust{'\u2014'}mountain biking,
        hiking, fly fishing on the Gallatin River, and Yellowstone National Park tourism (just 50
        miles south) drive a second wave of hospitality employment. October and November form the
        quietest shoulder season before winter returns.
      </p>
      <p>
        The {e?.unemploymentRate ?? 2.1}% unemployment rate reflects a labor market where jobs
        are plentiful but workers are scarce{'\u2014'}a direct consequence of the housing crisis.
        Businesses across {townName} report chronic difficulty hiring and retaining staff, not
        because wages are too low (though they are below what housing costs demand), but because
        there is literally nowhere for workers to live. The labor force participation rate
        of {e?.laborForceParticipation ?? 78}% signals that virtually everyone in the community
        who can work, does work{'\u2014'}often at multiple jobs.
      </p>

      <h2>The Commuter Economy</h2>
      <p>
        A significant share of {townName}'s daily workforce does not live in {townName}. Many
        employees commute from Bozeman (45 miles north on US-191 through the Gallatin Canyon),
        Belgrade (55 miles), or smaller communities along the corridor. The commute takes
        45{'\u2013'}60 minutes in good weather but can become hazardous in winter{'\u2014'}the narrow, winding
        Gallatin Canyon sees avalanche closures, icy conditions, and wildlife crossings that
        make the drive genuinely risky on bad days. Despite the risks, the commute is a
        necessity for workers who cannot afford {townName}'s housing prices.
      </p>
      <p>
        This commuter pattern has implications for the broader Gallatin Valley economy. Bozeman
        and Belgrade provide the workforce housing that {townName} cannot, and in return, {townName}'s
        resort wages flow back into the valley economy. Montana State University in Bozeman
        provides a talent pipeline{'\u2014'}students and recent graduates fill seasonal and entry-level
        resort positions, and some transition into year-round careers in the hospitality industry.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Big Sky Resort is the dominant employer{'\u2014'}winter and summer seasons offer thousands of positions in ski operations, hospitality, food service, retail, and recreation.</li>
        <li>The Yellowstone Club, Spanish Peaks Mountain Club, and Moonlight Basin provide additional hospitality and property-management employment in a private-club setting.</li>
        <li>Construction remains robust, driven by ongoing resort development, luxury home building, and commercial expansion in the Town Center.</li>
        <li>Housing is the primary employment barrier{'\u2014'}secure housing before committing to a position. Ask about employer-provided housing or deed-restricted workforce units through the Big Sky Community Housing Trust.</li>
        <li>Many workers commute from Bozeman (45 min){'\u2014'}factor in winter driving conditions on US-191 through the Gallatin Canyon when evaluating the commute.</li>
        <li>Seasonal positions suit workers comfortable with the resort-town cycle; year-round positions exist but are more competitive and still face the same housing constraints.</li>
        <li>The {e?.unemploymentRate ?? 2.1}% unemployment rate means jobs are readily available{'\u2014'}the question is not whether you can find work but whether you can find a place to live.</li>
      </ul>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>
    </article>
  );
}
