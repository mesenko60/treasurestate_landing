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
        {townName} sits at the West Entrance to Yellowstone National Park{'\u2014'}just one mile
        from the gate{'\u2014'}making it the busiest gateway corridor to America's first national
        park. With a year-round population of {fmt(population)}, the local economy is almost
        entirely defined by Yellowstone tourism and the extreme seasonality that comes with it.
        Summer brings millions of visitors through town; winter brings snowmobilers and snowcoach
        riders; and the shoulder seasons see the town quiet to a fraction of its peak activity.
        The unemployment rate of {e?.unemploymentRate ?? 0.9}%{'\u2014'}one of the lowest in
        Montana{'\u2014'}reflects not a booming diversified economy but a tiny labor pool where
        virtually everyone who lives here year-round is working, often at multiple jobs. For the
        full city profile, see our <Link href={`/montana-towns/${slug}/`}>{townName} guide</Link>.
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
        {townName}'s employment is dominated by {e?.mainIndustry ?? 'Tourism & Hospitality'}.
        Hotels, motels, restaurants, gift shops, outfitter services, snowmobile rental companies,
        and park concessioners collectively form the backbone of the local economy. The town
        exists because Yellowstone exists{'\u2014'}there is no other economic driver of comparable
        scale. During peak summer months (June{'\u2013'}August), the town's effective workforce
        swells dramatically as seasonal employees arrive from across the country and
        internationally to staff the surge in visitor services.
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

      <h2>The Yellowstone Economy{'\u2014'}Seasonal by Nature</h2>
      <p>
        {townName}'s economic rhythm is dictated by Yellowstone National Park's visitation
        patterns. The West Entrance typically opens to vehicle traffic in mid-April and sees
        peak volumes from mid-June through early September, when the town's population can swell
        from 1,202 year-round residents to an effective daytime population of 10,000 or more.
        Hotels fill, restaurants run double shifts, raft and fishing outfitters operate dawn to dusk,
        and the main drag of Canyon Street hums with visitors heading to and from the park gate.
      </p>
      <p>
        The shoulder seasons (April{'\u2013'}May and September{'\u2013'}October) bring a dramatic
        drop-off. Many businesses reduce hours, lay off seasonal staff, or close entirely. By
        November, {townName} transitions to its winter economy{'\u2014'}a smaller but meaningful
        tourism season built around snowmobiling (the town is known as the "Snowmobile Capital of
        the World"), cross-country skiing at the Rendezvous Ski Trails, and guided snowcoach tours
        into Yellowstone's snow-covered interior. Winter employment is thinner than summer but
        provides a second revenue peak that distinguishes {townName} from pure summer gateway towns.
      </p>

      <h2>Major Employers</h2>
      <p>
        There is no single large institutional employer in {townName} comparable to a hospital
        or university in a larger Montana town. Instead, employment is distributed across dozens of
        small and medium tourism businesses. Yellowstone National Park concessioners{'\u2014'}companies
        contracted by the National Park Service to operate lodges, restaurants, and services inside
        the park{'\u2014'}are among the largest seasonal employers, recruiting workers nationally
        and providing seasonal housing. In town, the largest employers include hotels (the Holiday
        Inn, Explorer Cabins, and numerous independent lodges), restaurants, snowmobile rental
        and tour companies, fishing and rafting outfitters, and retail gift shops.
      </p>
      <p>
        The Town of West Yellowstone itself, the West Yellowstone School District, and Hebgen
        Basin Fire District provide the most stable year-round public-sector employment. The U.S.
        Forest Service's Hebgen Lake Ranger District office, located in town, offers federal
        employment in recreation management, fire, and natural resources. These public-sector
        positions are coveted for their year-round stability and benefits in a market otherwise
        defined by seasonal fluctuation.
      </p>

      <h2>Workforce Characteristics</h2>
      <p>
        {townName}'s labor force of {fmt(e?.laborForce ?? null)} is one of the smallest of any
        town we profile, yet the {e?.laborForceParticipation ?? 75.1}% participation rate is
        remarkably high{'\u2014'}evidence that nearly every working-age resident is employed. The
        {' '}{e?.unemploymentRate ?? 0.9}% unemployment rate is among the lowest in Montana, but
        this figure masks the reality of seasonal employment cycles and the challenge of finding
        work during the quieter months.
      </p>
      <p>
        Seasonal workers are the lifeblood of {townName}'s economy. Each summer, hundreds of
        workers arrive{'\u2014'}college students, international J-1 visa holders, retirees seeking
        adventure, and career hospitality workers following the seasonal circuit. Housing these
        workers is a persistent challenge; many employers provide dormitory-style or shared housing,
        and some workers live in RVs or camp in the surrounding national forest. The seasonal
        workforce turns over almost entirely each year, creating constant recruiting and training
        demands for local businesses.
      </p>
      <p>
        For a detailed look at how wages align with expenses, see
        our <Link href={`/montana-towns/${slug}/cost-of-living/`}>{townName} cost of living guide</Link>.
      </p>

      <h2>Key Takeaways for Job Seekers</h2>
      <ul>
        <li>Tourism & Hospitality dominates employment{'\u2014'}hotels, restaurants, outfitters, gift shops, and park concessioners provide the vast majority of jobs, nearly all seasonal.</li>
        <li>The 0.9% unemployment rate reflects a tiny labor pool, not economic diversity{'\u2014'}virtually everyone in {townName} who wants work has it, often holding multiple positions.</li>
        <li>Summer (June{'\u2013'}September) is peak hiring season, with the town's workforce swelling dramatically to serve millions of Yellowstone visitors passing through the West Entrance.</li>
        <li>Winter brings a second tourism season centered on snowmobiling and snowcoach tours{'\u2014'}less intense than summer but enough to sustain a core workforce through the cold months.</li>
        <li>Year-round positions are scarce and highly sought after{'\u2014'}the Town government, school district, Forest Service, and fire district are the most stable employers.</li>
        <li>Housing is the single biggest barrier for workers{'\u2014'}with a 46.2% vacancy rate (seasonal/vacation units) and virtually no long-term rentals, many seasonal employees rely on employer-provided housing.</li>
        <li>Fishing and rafting guide work on the Madison River and Yellowstone Park waters offers well-paying seasonal employment for experienced outdoor professionals.</li>
      </ul>
    </article>
  );
}
