import Link from 'next/link';
import { TdihEntry, formatCategoryLabel, getTdihUrl } from '../lib/tdih';

type Props = {
  entry: TdihEntry;
  defaultOpen?: boolean;
  showViewFullLink?: boolean;
};

export default function TdihCard({ entry, defaultOpen = false, showViewFullLink = true }: Props) {
  const categoryLabel = formatCategoryLabel(entry.category);
  const url = getTdihUrl(entry);

  return (
    <details open={defaultOpen} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
      <summary
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          padding: '1rem 1rem 0.85rem',
          display: 'grid',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#1f3f51',
              background: '#e8f2f7',
              borderRadius: '999px',
              padding: '0.2rem 0.55rem',
            }}
          >
            {categoryLabel}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{entry.date_display}</span>
        </div>
        <div style={{ color: '#162b36', fontWeight: 700, lineHeight: 1.4 }}>{entry.headline}</div>
        <div style={{ fontSize: '0.82rem', color: '#0a5cff', fontWeight: 600 }}>Read more</div>
      </summary>

      <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid #f0f2f4' }}>
        <p style={{ margin: '0.8rem 0 0', color: '#333', lineHeight: 1.7 }}>{entry.body}</p>

        <div style={{ marginTop: '0.8rem', color: '#4b5563', fontSize: '0.9rem' }}>
          <strong>Location:</strong> {entry.location}
        </div>

        {entry.tags.length > 0 && (
          <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {entry.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  background: '#f3f4f6',
                  color: '#334155',
                  borderRadius: '999px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.75rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {showViewFullLink && (
          <div style={{ marginTop: '0.9rem' }}>
            <Link href={url} style={{ color: '#0a5cff', fontWeight: 600, textDecoration: 'none' }}>
              View full page →
            </Link>
          </div>
        )}
      </div>
    </details>
  );
}
