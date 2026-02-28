type Props = {
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
  zillowHomeValue: number | null;
  zillowHomeValueDate: string | null;
  zillowRent: number | null;
  zillowRentDate: string | null;
  homeValuePercentile: number | null;
  rentPercentile: number | null;
  incomePercentile: number | null;
  affordabilityRatio: number | null;
  forSaleInventory: number | null;
  forSaleInventoryDate: string | null;
  inventoryYoY: number | null;
  medianListPrice: number | null;
  newListings: number | null;
  totalHousingUnits: number | null;
  vacancyRate: number | null;
  unemploymentRate?: number | null;
  laborForceParticipation?: number | null;
  employed?: number | null;
  laborForce?: number | null;
  topIndustries?: { name: string; pct: number }[] | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function PercentileBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color }}>{ordinal(value)} percentile</span>
      </div>
      <div style={{ height: '6px', background: '#e8e8e8', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

function getBarColor(pct: number, invert?: boolean): string {
  const effective = invert ? 100 - pct : pct;
  if (effective <= 30) return '#27ae60';
  if (effective <= 60) return '#f39c12';
  return '#c0392b';
}

export default function TownHousing({
  medianHomeValue, medianRent, medianHouseholdIncome,
  zillowHomeValue, zillowHomeValueDate, zillowRent, zillowRentDate,
  homeValuePercentile, rentPercentile, incomePercentile, affordabilityRatio,
  forSaleInventory, forSaleInventoryDate, inventoryYoY, medianListPrice,
  newListings, totalHousingUnits, vacancyRate,
  unemploymentRate, laborForceParticipation, employed, laborForce, topIndustries,
}: Props) {
  if (!medianHomeValue && !medianRent && !medianHouseholdIncome && !zillowHomeValue) return null;

  const displayHomeValue = zillowHomeValue || medianHomeValue;
  const displayRent = zillowRent || medianRent;

  const rentBurden =
    displayRent && medianHouseholdIncome
      ? ((displayRent * 12) / medianHouseholdIncome * 100).toFixed(0)
      : null;

  return (
    <section style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #e8e8e8' }}>
      <h3 style={{ margin: '0 0 1rem', color: '#204051', fontSize: '1.15rem' }}>
        Housing &amp; Cost of Living
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {displayHomeValue && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${displayHomeValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>
              {zillowHomeValue ? 'Typical Home Value' : 'Median Home Value'}
            </div>
            {zillowHomeValue && medianHomeValue && (
              <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '2px' }}>
                Census (2019–23): ${medianHomeValue.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {displayRent && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${displayRent.toLocaleString()}<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/mo</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>
              {zillowRent ? 'Typical Rent' : 'Median Rent'}
            </div>
            {zillowRent && medianRent && (
              <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '2px' }}>
                Census (2019–23): ${medianRent.toLocaleString()}/mo
              </div>
            )}
          </div>
        )}

        {medianHouseholdIncome && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${medianHouseholdIncome.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>Median Household Income</div>
          </div>
        )}
      </div>

      {/* National percentile rankings */}
      {(homeValuePercentile != null || rentPercentile != null || incomePercentile != null) && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#204051', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            National Rankings
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {homeValuePercentile != null && (
              <PercentileBar value={homeValuePercentile} label="Home Value" color={getBarColor(homeValuePercentile, true)} />
            )}
            {rentPercentile != null && (
              <PercentileBar value={rentPercentile} label="Rent" color={getBarColor(rentPercentile, true)} />
            )}
            {incomePercentile != null && (
              <PercentileBar value={incomePercentile} label="Income" color={getBarColor(incomePercentile)} />
            )}
          </div>
          {affordabilityRatio != null && (
            <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.6rem', background: '#f8f9fa', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: '#555' }}>
                <strong>Affordability Ratio</strong> (home price ÷ income)
              </span>
              <span style={{
                fontSize: '0.9rem', fontWeight: 700,
                color: affordabilityRatio <= 3 ? '#27ae60' : affordabilityRatio <= 5 ? '#f39c12' : '#c0392b',
              }}>
                {affordabilityRatio}x
                <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: '4px', color: '#888' }}>
                  {affordabilityRatio <= 3 ? 'Affordable' : affordabilityRatio <= 5 ? 'Moderate' : affordabilityRatio <= 8 ? 'Expensive' : 'Very Expensive'}
                </span>
              </span>
            </div>
          )}
          <div style={{ fontSize: '0.68rem', color: '#bbb', marginTop: '0.4rem' }}>
            Percentile among ~21,000 U.S. cities. Higher = more expensive (home/rent) or higher earning (income).
          </div>
        </div>
      )}

      {/* Housing Market Activity */}
      {(forSaleInventory != null || totalHousingUnits != null) && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#204051', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Housing Availability
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {forSaleInventory != null && (
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#204051' }}>
                  {forSaleInventory.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Homes for Sale</div>
                {inventoryYoY != null && (
                  <div style={{ fontSize: '0.72rem', marginTop: '2px', color: inventoryYoY > 0 ? '#27ae60' : inventoryYoY < 0 ? '#c0392b' : '#888' }}>
                    {inventoryYoY > 0 ? '↑' : inventoryYoY < 0 ? '↓' : '→'} {Math.abs(inventoryYoY)}% vs last year
                  </div>
                )}
              </div>
            )}
            {medianListPrice != null && (
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#204051' }}>
                  ${medianListPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Median List Price</div>
              </div>
            )}
            {newListings != null && (
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#204051' }}>
                  {newListings}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>New Listings/Month</div>
              </div>
            )}
            {totalHousingUnits != null && (
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#204051' }}>
                  {totalHousingUnits.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Total Housing Units</div>
              </div>
            )}
            {vacancyRate != null && (
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: vacancyRate >= 10 ? '#27ae60' : vacancyRate >= 5 ? '#f39c12' : '#c0392b' }}>
                  {vacancyRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Vacancy Rate</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employment & Economy */}
      {(unemploymentRate != null || (topIndustries && topIndustries.length > 0)) && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#204051', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Employment &amp; Economy
          </div>
          {unemploymentRate != null && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                <div style={{
                  fontSize: '1.25rem', fontWeight: 700,
                  color: unemploymentRate <= 3 ? '#27ae60' : unemploymentRate <= 6 ? '#f39c12' : '#c0392b',
                }}>
                  {unemploymentRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Unemployment Rate</div>
                <div style={{ fontSize: '0.68rem', color: '#999', marginTop: '2px' }}>
                  MT avg: ~3.5%
                </div>
              </div>
              {laborForceParticipation != null && (
                <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                  <div style={{
                    fontSize: '1.25rem', fontWeight: 700,
                    color: laborForceParticipation >= 70 ? '#27ae60' : laborForceParticipation >= 60 ? '#f39c12' : '#c0392b',
                  }}>
                    {laborForceParticipation}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Labor Force Participation</div>
                </div>
              )}
              {employed != null && (
                <div style={{ textAlign: 'center', padding: '0.5rem', background: '#f5f8f5', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#204051' }}>
                    {employed.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Employed Residents</div>
                </div>
              )}
            </div>
          )}
          {topIndustries && topIndustries.length > 0 && (
            <div style={{ marginTop: unemploymentRate != null ? '0.75rem' : 0 }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem' }}>Top Industries</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {topIndustries.slice(0, 5).map((ind, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '110px', fontSize: '0.75rem', color: '#555', flexShrink: 0, textAlign: 'right' }}>
                      {ind.name}
                    </div>
                    <div style={{ flex: 1, height: '14px', background: '#eef2ee', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(ind.pct * 2, 100)}%`, height: '100%',
                        background: i === 0 ? '#3b6978' : i === 1 ? '#5a8a99' : '#8cb4c0',
                        borderRadius: '3px',
                      }} />
                    </div>
                    <div style={{ width: '36px', fontSize: '0.72rem', fontWeight: 600, color: '#204051', textAlign: 'right' }}>
                      {ind.pct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#aaa', textAlign: 'center', lineHeight: 1.6 }}>
        {zillowHomeValue && (
          <>Home value data from <a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>Zillow Home Value Index</a> ({formatDate(zillowHomeValueDate)}). </>
        )}
        {forSaleInventory != null && (
          <>Inventory from <a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>Zillow Research</a> ({formatDate(forSaleInventoryDate)}). </>
        )}
        {medianHouseholdIncome && (
          <>Income{!zillowHomeValue && medianHomeValue ? ', home value,' : ''}{totalHousingUnits ? ', vacancy,' : ''}{unemploymentRate != null ? ' and employment' : ''} from U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).</>
        )}
      </div>
    </section>
  );
}
