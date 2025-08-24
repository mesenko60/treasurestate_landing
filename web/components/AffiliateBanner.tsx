import { useEffect, useState } from 'react';

export default function AffiliateBanner() {
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // If the iframe doesn't load within 1.5s (e.g., blocked by CSP on localhost), show a fallback link
    const t = setTimeout(() => {
      if (!loaded) setShowFallback(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [loaded]);

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
        {!showFallback && (
          <iframe
            className="eg-affiliate-banners-frame"
            src="https://affiliates.expediagroup.com/products/banners?program=us-expedia&layout=leaderboard&image=mountains&message=hotel-treehouse-find-perfect-place-stay&link=stays&network=pz&camref=1011l52GG6"
            style={{ width: 728, height: 90, margin: '0 auto', border: 'none', display: 'block' }}
            title="Expedia Hotel Deals"
            onLoad={() => setLoaded(true)}
          />
        )}

        {showFallback && (
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
        )}
      </div>
    </section>
  );
}
