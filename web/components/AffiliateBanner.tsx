export default function AffiliateBanner() {
  return (
    <section
      id="affiliate-banner"
      className="banner-section"
      style={{
        minHeight: '100px',
        margin: '20px 0',
        textAlign: 'center',
        background: '#f8f9fa',
        padding: '15px 0 10px 0',
        width: '100%',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <a
          href="https://www.expedia.com/?pwaLob=HRS&camref=1011l52GG6"
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-block',
            padding: '12px 16px',
            background: '#0a5cff',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 600,
          }}
          aria-label="Find hotels on Expedia"
        >
          Find hotels on Expedia
        </a>
      </div>
    </section>
  );
}
