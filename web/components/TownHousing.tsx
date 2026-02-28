type Props = {
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
  zillowHomeValue: number | null;
  zillowHomeValueDate: string | null;
  zillowRent: number | null;
  zillowRentDate: string | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function TownHousing({
  medianHomeValue, medianRent, medianHouseholdIncome,
  zillowHomeValue, zillowHomeValueDate, zillowRent, zillowRentDate,
}: Props) {
  if (!medianHomeValue && !medianRent && !medianHouseholdIncome && !zillowHomeValue) return null;

  const displayHomeValue = zillowHomeValue || medianHomeValue;
  const displayRent = zillowRent || medianRent;

  const affordabilityRatio =
    displayHomeValue && medianHouseholdIncome
      ? (displayHomeValue / medianHouseholdIncome).toFixed(1)
      : null;

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
        {/* Home Value */}
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

        {/* Rent */}
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

        {/* Income */}
        {medianHouseholdIncome && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${medianHouseholdIncome.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>Median Household Income</div>
          </div>
        )}
      </div>

      {(affordabilityRatio || rentBurden) && (
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
          {affordabilityRatio && (
            <div style={{ fontSize: '0.85rem', color: '#555', textAlign: 'center' }}>
              <strong>Price-to-Income Ratio:</strong> {affordabilityRatio}x
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                {parseFloat(affordabilityRatio) <= 3 ? 'Affordable' : parseFloat(affordabilityRatio) <= 5 ? 'Moderate' : 'Less Affordable'}
              </div>
            </div>
          )}
          {rentBurden && (
            <div style={{ fontSize: '0.85rem', color: '#555', textAlign: 'center' }}>
              <strong>Rent-to-Income:</strong> {rentBurden}%
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                {parseInt(rentBurden) <= 30 ? 'Within guidelines' : 'Above 30% guideline'}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#aaa', textAlign: 'center', lineHeight: 1.6 }}>
        {zillowHomeValue && (
          <>Home value data from <a href="https://www.zillow.com/research/data/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>Zillow Home Value Index</a> ({formatDate(zillowHomeValueDate)}). </>
        )}
        {medianHouseholdIncome && (
          <>Income{!zillowHomeValue && medianHomeValue ? ' and home value' : ''} from U.S. Census Bureau, ACS 5-Year Estimates (2019–2023).</>
        )}
      </div>
    </section>
  );
}
