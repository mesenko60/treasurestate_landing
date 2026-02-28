type Props = {
  medianHomeValue: number | null;
  medianRent: number | null;
  medianHouseholdIncome: number | null;
};

export default function TownHousing({ medianHomeValue, medianRent, medianHouseholdIncome }: Props) {
  if (!medianHomeValue && !medianRent && !medianHouseholdIncome) return null;

  const affordabilityRatio =
    medianHomeValue && medianHouseholdIncome
      ? (medianHomeValue / medianHouseholdIncome).toFixed(1)
      : null;

  const rentBurden =
    medianRent && medianHouseholdIncome
      ? ((medianRent * 12) / medianHouseholdIncome * 100).toFixed(0)
      : null;

  return (
    <section style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #e8e8e8' }}>
      <h3 style={{ margin: '0 0 1rem', color: '#204051', fontSize: '1.15rem' }}>
        Housing &amp; Cost of Living
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {medianHomeValue && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${medianHomeValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>Median Home Value</div>
          </div>
        )}
        {medianRent && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b6978' }}>
              ${medianRent.toLocaleString()}<span style={{ fontSize: '0.9rem', fontWeight: 400 }}>/mo</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>Median Rent</div>
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

      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#aaa', textAlign: 'center' }}>
        Source: US Census ACS 2023 (5-year estimates)
      </div>
    </section>
  );
}
