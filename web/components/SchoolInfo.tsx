import React from 'react';

type SchoolInfoProps = {
  district: string;
  enrollment: number | null;
  website: string | null;
  graduationRate?: number | null;
  perPupilSpending?: number | null;
  schoolsVintage?: string | null;
};

export default function SchoolInfo({ district, enrollment, website, graduationRate, perPupilSpending, schoolsVintage }: SchoolInfoProps) {
  const hasExtras = graduationRate != null || perPupilSpending != null;

  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1rem 1.2rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.5rem' }}>🏫</span>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontWeight: 600, color: '#204051', fontSize: '0.95rem' }}>{district}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            {enrollment ? `~${enrollment.toLocaleString()} students` : 'Enrollment data unavailable'}
            {website && (
              <>
                {' · '}
                <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978' }}>
                  District Website
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {hasExtras && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
          marginTop: '0.75rem', paddingTop: '0.75rem',
          borderTop: '1px solid #e8ede8',
        }}>
          {graduationRate != null && (
            <div style={{
              padding: '0.4rem 0.75rem', background: '#fff', borderRadius: '6px',
              border: '1px solid #e0e0e0', fontSize: '0.82rem', textAlign: 'center',
            }}>
              <div style={{ color: '#888', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grad Rate</div>
              <div style={{
                fontWeight: 700, fontSize: '1rem',
                color: graduationRate >= 90 ? '#2e7d32' : graduationRate >= 80 ? '#204051' : graduationRate >= 70 ? '#e65100' : '#c62828',
              }}>
                {graduationRate}%
              </div>
            </div>
          )}
          {perPupilSpending != null && (
            <div style={{
              padding: '0.4rem 0.75rem', background: '#fff', borderRadius: '6px',
              border: '1px solid #e0e0e0', fontSize: '0.82rem', textAlign: 'center',
            }}>
              <div style={{ color: '#888', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Per Pupil</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#204051' }}>
                ${perPupilSpending.toLocaleString()}
              </div>
            </div>
          )}
          <div style={{ fontSize: '0.72rem', color: '#999', alignSelf: 'center', fontStyle: 'italic' }}>
            {graduationRate != null ? `Graduation rate: ${schoolsVintage || 'Montana OPI / NCES CCD 2022–23'}. ` : ''}
            {perPupilSpending != null ? 'Per-pupil spending: Montana OPI fiscal data. ' : ''}
            {graduationRate != null ? 'MT state avg: ~87%.' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
