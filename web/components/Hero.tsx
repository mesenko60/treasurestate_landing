import Image from 'next/image';
import { useState } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  small?: boolean;
};

export default function Hero({ title, subtitle, image, alt, small }: Props) {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <header className={`hero-section ${small ? 'hero-section--small' : ''}`}>
      <Image
        src={imgSrc}
        alt={alt}
        className={`hero-image ${small ? 'hero-image--small' : ''}`}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority // Ensures LCP optimization
        onError={() => {
          if (imgSrc !== '/images/towns/default-town.jpg') {
            setImgSrc('/images/towns/default-town.jpg');
          }
        }}
      />
      <div className={`hero-text ${small ? 'hero-text--small' : ''}`}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
