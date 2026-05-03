import React from 'react';
import Link from 'next/link';

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
        Montana land ownership at a glance
      </h2>
      <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#444', marginBottom: '1rem' }}>{stats.subtitle}</p>
      <div className="guide-disclaimer">
        <h3>⚠️ {stats.disclaimerShort}</h3>
        <p>
          Always confirm access with landowners, DNRC leased-block maps, hunting regulations, signage, and the{' '}
          <a href="https://svc.mt.gov/msl/cadastral/" target="_blank" rel="noopener noreferrer">
            Montana Cadastral
          </a>{' '}
          application before relying on boundaries you see online.
        </p>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '1.25rem 0 2rem' }}>
        {stats.highlights.map((h) => (
          <li
            key={h.label}
            style={{
              marginBottom: '1rem',
              padding: '0.95rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid #e4eaf0',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 700, color: '#204051', marginBottom: '0.35rem', fontFamily: 'var(--font-primary, sans-serif)' }}>{h.label}</div>
            <div style={{ fontSize: '1.08rem', color: '#3b6978', fontWeight: 700, marginBottom: '0.35rem' }}>{h.valueText}</div>
            <p style={{ margin: '0', fontSize: '0.86rem', color: '#56666e', lineHeight: 1.55 }}>{h.note}</p>
            <a href={h.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b6978', marginTop: '0.45rem', display: 'inline-block' }}>
              Source documentation →
            </a>
          </li>
        ))}
      </ul>

      <h2 className="guide-section-title" id="hunters-anglers">
        How hunters and anglers should use cadastral data
      </h2>
      <div className="guide-content">
        <p>
          Surface ownership from MSDI Cadastral is a starting point only.{' '}
          <Link href="/guides/hunting-guide/" style={{ color: '#3b6978', fontWeight: 600 }}>
            Our hunting guide
          </Link>{' '}
          layers wildlife management areas, national forests, refuges, and BLM jewels with districts and permitting rules. Pair that checklist with Montana&rsquo;s{' '}
          <a href="https://fwp.mt.gov/hunt/access/blockmanagement" target="_blank" rel="noopener noreferrer">
            Block Management
          </a>
          ,
          {' '}
          <a href="https://fwp.mt.gov/hunt/regulations" target="_blank" rel="noopener noreferrer">
            Hunt Planner overlays
          </a>
          , and DNRC guidance anytime you intend to cross from public to private footing.
        </p>
        <p>
          If you anchor or wade Montana rivers, familiarize yourself with the{' '}
          <a href="https://svc.mt.gov/dnrc/navigator/" target="_blank" rel="noopener noreferrer">
            Stream Access Navigator
          </a>{' '}
          and county-specific closures; cadastral layers do not replace those rules.
        </p>
      </div>

      <h2 className="guide-section-title" id="downloads">
        Official GIS downloads &amp; services
      </h2>
      <ul style={{ paddingLeft: '1.25rem', color: '#444', lineHeight: 1.65, fontSize: '0.92rem', marginBottom: '2rem' }}>
        <li style={{ marginBottom: '0.65rem' }}>
          <strong>FTP statewide packages:</strong>{' '}
          <code style={{ fontSize: '0.85rem', background: '#f4f8fa', padding: '2px 6px', borderRadius: '4px' }}>
            ftpgeoinfo.msl.mt.gov/Data/Spatial/MSDI/Cadastral
          </code>{' '}
          &mdash; file geodatabase and shapefiles for parcels, PLSS, public lands, conservation easements, historic snapshots, PLSS downloads, CAMA bundles, plus documentation mirrors.
        </li>
        {stats.dataSourcesWebsite.map((d) => (
          <li key={d.url} style={{ marginBottom: '0.65rem' }}>
            <strong>{d.name}</strong>: {d.role}{' '}
            <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b6978', fontWeight: 600 }}>
              {d.url.replace(/^https:\/\//, '')}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="guide-section-title" id="faqs">
        Frequently asked questions
      </h2>
      <section aria-labelledby="faqs-heading" style={{ marginBottom: '2rem' }}>
        <span id="faqs-heading" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Land ownership FAQs
        </span>
        {faqs.map((f, i) => (
          <article
            key={i}
            style={{
              border: '1px solid #e4eaf0',
              borderRadius: '10px',
              padding: '1rem 1.1rem',
              marginBottom: '0.85rem',
              background: '#fff',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#204051', fontFamily: 'var(--font-primary, sans-serif)' }}>
              {f.question}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
              {f.answer}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
