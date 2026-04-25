import { useState, useEffect, useRef, useCallback } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  small?: boolean;
  showSearch?: boolean; // defaults to true
  credit?: string;
};

const FALLBACK_IMG = '/images/towns/default-town.jpg';

function webpSrcSet(basePath: string): string | null {
  const ext = basePath.lastIndexOf('.');
  if (ext === -1) return null;
  const base = basePath.slice(0, ext);
  return `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}.webp 1500w`;
}

export default function Hero({ title, subtitle, image, alt, small, showSearch = true, credit }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState(image);
  const [webpOk, setWebpOk] = useState(true);
  const srcSet = webpOk ? webpSrcSet(imgSrc) : null;

  const handleError = useCallback(() => {
    if (webpOk) {
      setWebpOk(false);
    } else if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG);
      setWebpOk(true);
    }
  }, [webpOk, imgSrc]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      handleError();
    }
  }, [handleError]);

  return (
    <header className={`hero-section ${small ? 'hero-section--small' : ''}`}>
      <picture>
        {srcSet && (
          <source
            type="image/webp"
            srcSet={srcSet}
            sizes="100vw"
          />
        )}
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          className={`hero-image ${small ? 'hero-image--small' : ''}`}
          style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', objectPosition: 'center' }}
          decoding="async"
          onError={handleError}
        />
      </picture>
      <div className={`hero-text ${small ? 'hero-text--small' : ''}`}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {showSearch && (
          <button
            className="hero-search-btn"
            onClick={() => window.dispatchEvent(new Event('openSearch'))}
            aria-label="Open search"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '8px',
              padding: '10px 18px', margin: '1.75rem auto 0', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              maxWidth: '340px', width: 'auto',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'none'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{
              flex: 1, textAlign: 'left', color: '#9ca3af',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.95rem', fontWeight: 500,
            }}>
              Search Montana...
            </span>
            <kbd style={{
              fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px',
              border: '1px solid #d1d5db', color: '#9ca3af', background: '#f9fafb',
            }}>⌘K</kbd>
          </button>
        )}
      </div>
      {credit && (
        <div style={{
          position: 'absolute', bottom: '8px', right: '12px',
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {credit}
        </div>
      )}
    </header>
  );
}
