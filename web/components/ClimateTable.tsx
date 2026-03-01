import React from 'react';

type MonthData = {
  month: string;
  avgHigh: number;
  avgLow: number;
  precipIn: number;
  snowIn?: number;
};

type ClimateTableProps = {
  townName: string;
  months: MonthData[];
};

export default function ClimateTable({ townName, months }: ClimateTableProps) {
  if (!months || months.length === 0) return null;

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  };

  const thStyle: React.CSSProperties = {
    padding: '0.5rem 0.4rem',
    textAlign: 'center',
    borderBottom: '2px solid #204051',
    color: '#204051',
    fontWeight: 600,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.4rem 0.3rem',
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    fontSize: '0.85rem',
  };

  return (
    <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
      <h3 style={{ fontSize: '1.2rem', color: '#204051', marginBottom: '0.75rem' }}>
        Average Monthly Climate: {townName}
      </h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Month</th>
            <th style={{ ...thStyle, color: '#c0392b' }}>Avg High</th>
            <th style={{ ...thStyle, color: '#2980b9' }}>Avg Low</th>
            <th style={thStyle}>Precip</th>
            <th style={thStyle}>Snow</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{m.month}</td>
              <td style={{ ...tdStyle, color: '#c0392b' }}>{m.avgHigh}°F</td>
              <td style={{ ...tdStyle, color: '#2980b9' }}>{m.avgLow}°F</td>
              <td style={tdStyle}>{m.precipIn}"</td>
              <td style={tdStyle}>{m.snowIn != null ? `${m.snowIn}"` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
