type Props = {
  label: string;
  url: string;
  articleSlug?: string;
};

export default function ShopCTA({ label, url, articleSlug }: Props) {
  if (!label || !url) return null;

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, #f8f4ee 0%, #fdf9f3 100%)',
        borderRadius: '10px',
        border: '1px solid #e8dcc8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontSize: '0.92rem', color: '#5a4a36', fontWeight: 500 }}>
        {label}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-track-shop-cta={articleSlug || ''}
        style={{
          display: 'inline-block',
          padding: '0.55rem 1.25rem',
          background: '#925f14',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          fontFamily: "var(--font-primary, 'Montserrat', sans-serif)",
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 2px 8px rgba(146,95,20,0.25)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(146,95,20,0.35)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'none';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(146,95,20,0.25)';
        }}
      >
        Visit Shop &rarr;
      </a>
    </div>
  );
}
