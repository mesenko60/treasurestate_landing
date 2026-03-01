import { useState } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  small?: boolean;
};

function webpSrcSet(basePath: string): string | null {
  const ext = basePath.lastIndexOf('.');
  if (ext === -1) return null;
  const base = basePath.slice(0, ext);
  return `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}.webp 1500w`;
}

export default function Hero({ title, subtitle, image, alt, small }: Props) {
  const [imgSrc, setImgSrc] = useState(image);
  const srcSet = webpSrcSet(imgSrc);

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
          src={imgSrc}
          alt={alt}
          className={`hero-image ${small ? 'hero-image--small' : ''}`}
          style={{ position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover', objectPosition: 'center' }}
          fetchPriority="high"
          decoding="async"
          onError={() => {
            if (imgSrc !== '/images/towns/default-town.jpg') {
              setImgSrc('/images/towns/default-town.jpg');
            }
          }}
        />
      </picture>
      <div className={`hero-text ${small ? 'hero-text--small' : ''}`}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
