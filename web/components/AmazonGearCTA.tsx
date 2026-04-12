import { amazonSearchUrl, AMAZON_DISCLOSURE } from '../lib/amazon-affiliate';

type Props = {
  title?: string;
  description?: string;
  searchKeywords: string;
  buttonText?: string;
};

export default function AmazonGearCTA({
  title = 'Gear Up for Your Adventure',
  description,
  searchKeywords,
  buttonText = 'Shop Gear on Amazon',
}: Props) {
  const url = amazonSearchUrl(searchKeywords);

  return (
    <section style={{
      background: 'linear-gradient(135deg, #ff9900 0%, #e88a00 100%)',
      borderRadius: '12px',
      padding: '2rem 1.5rem',
      marginBottom: '2rem',
      color: '#111',
      boxShadow: '0 4px 20px rgba(255,153,0,0.25)',
      textAlign: 'center',
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        margin: '0 0 0.35rem',
        color: '#111',
        borderBottom: 'none',
        padding: 0,
        fontWeight: 700,
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: '0.9rem',
          margin: '0 0 1.25rem',
          opacity: 0.85,
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#111',
          color: '#fff',
          padding: '0.85rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        }}
      >
        {buttonText}
        <span aria-hidden="true">→</span>
      </a>
      <p style={{
        fontSize: '0.7rem',
        margin: '1rem 0 0',
        opacity: 0.6,
      }}>
        {AMAZON_DISCLOSURE}
      </p>
    </section>
  );
}
