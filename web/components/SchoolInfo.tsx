import React from 'react';

type SchoolInfoProps = {
  district: string;
  enrollment: number | null;
  website: string | null;
};

export default function SchoolInfo({ district, enrollment, website }: SchoolInfoProps) {
  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1rem 1.2rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      flexWrap: 'wrap',
    }}>
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
  );
}
