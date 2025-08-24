type Props = {
  title: string;
  subtitle?: string;
  image: string;
  alt: string;
  small?: boolean;
};

export default function Hero({ title, subtitle, image, alt, small }: Props) {
  return (
    <header className={`hero-section ${small ? 'hero-section--small' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className={`hero-image ${small ? 'hero-image--small' : ''}`}
        width={1920}
        height={800}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (!target.dataset.fallback) {
            target.src = '/images/towns/default-town.jpg';
            target.dataset.fallback = '1';
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
