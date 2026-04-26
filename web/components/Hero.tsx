import { useState, useEffect, useRef, useCallback } from 'react';
import SiteSearchWithHistory from './SiteSearchWithHistory';

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
        {showSearch && <SiteSearchWithHistory layout="hero" />}
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
