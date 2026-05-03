import React from 'react';

export type LandOwnershipStatsPayload = {
  subtitle: string;
  highlights: { label: string; valueText: string; note: string; sourceUrl: string }[];
  dataSourcesWebsite: { name: string; url: string; role: string }[];
  disclaimerShort: string;
};

export type LandFaq = { question: string; answer: string };

type Props = { stats: LandOwnershipStatsPayload; faqs: LandFaq[] };

export default function LandOwnershipInfo({ stats, faqs }: Props) {
  return (
    <>
      <h2 className="guide-section-title" id="ownership-context">
        Land ownership data disclaimer &amp; official sources
      </h2>
      <div className="guide-disclaimer">
        <h3>⚠️ {stats.disclaimerShort}</h3>
        <p style={{ margin: '0.5rem 0 0' }}>
          Confirm boundaries and access with landowners, agencies,{' '}
          <a href="https://svc.mt.gov/msl/cadastral/" target="_blank" rel="noopener noreferrer">
            Montana Cadastral GIS
          </a>
          , and current regulations.
        </p>
      </div>

      <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#444', margin: '1rem 0 0' }}>
        <strong style={{ color: '#204051' }}>Authoritative GIS & maps:</strong>
      </p>
      <ul style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: 1.6, fontSize: '0.9rem', margin: '0.35rem 0 1.25rem' }}>
        {stats.dataSourcesWebsite.map((d) => (
          <li key={d.url} style={{ marginBottom: '0.45rem' }}>
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
              {d.name}
            </a>
            {' — '}
            <span>{d.role}</span>
          </li>
        ))}
      </ul>

      <details style={{ border: '1px solid #e4eaf0', borderRadius: '10px', padding: '0.75rem 1rem', background: '#fff' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#204051', fontFamily: 'var(--font-primary, sans-serif)', fontSize: '0.95rem' }}>
          Common questions about Montana land GIS
        </summary>
        <div style={{ marginTop: '0.75rem' }}>
          {faqs.map((f, i) => (
            <article
              key={i}
              style={{
                borderTop: i === 0 ? undefined : '1px solid #eef2f5',
                paddingTop: i === 0 ? 0 : '0.75rem',
                marginTop: i === 0 ? 0 : '0.75rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '0.92rem', color: '#204051', fontFamily: 'var(--font-primary, sans-serif)' }}>
                {f.question}
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#555', lineHeight: 1.55 }}>
                {f.answer}
              </p>
            </article>
          ))}
        </div>
      </details>
    </>
  );
}
