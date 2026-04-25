import Link from 'next/link';
import { vrboUrl, expediaUrl, lodgingPageSlug } from '../lib/affiliate-urls';

type Variant = 'feature' | 'compact' | 'inline';

type Props = {
  townName?: string;
  slug?: string;
  variant?: Variant;
  showDescription?: boolean;
  showLodgingGuideLink?: boolean;
  marginBottom?: string;
};

export default function StaysCTA({
  townName,
  slug,
  variant = 'feature',
  showDescription,
  showLodgingGuideLink,
  marginBottom,
}: Props) {
  const name = townName || 'Montana';
  const s = slug || 'montana';
  const vrbo = vrboUrl(name, s);
  const expedia = expediaUrl(name, s);
  const lodgingSlug = lodgingPageSlug(s);
  const isFeature = variant === 'feature';
  const isInline = variant === 'inline';
  const descriptionVisible = showDescription ?? isFeature;
  const guideLinkVisible = showLodgingGuideLink ?? Boolean(townName && !isInline);
  const textColor = isFeature ? '#fff' : '#204051';
  const mutedTextColor = isFeature ? 'rgba(255,255,255,0.72)' : '#5f6f78';
  const disclosureColor = isFeature ? 'rgba(255,255,255,0.45)' : '#8a979e';
  const linkColor = isFeature ? '#f5c97a' : '#3b6978';
  const buttonPadding = isInline ? '0.48rem 0.6rem' : isFeature ? '0.7rem 0.75rem' : '0.58rem 0.7rem';
  const buttonLabelSize = isInline ? '0.78rem' : isFeature ? '0.88rem' : '0.84rem';
  const sectionMargin = marginBottom ?? (isFeature ? '2rem' : isInline ? '0.75rem' : '1.25rem');

  return (
    <section style={{
      background: isFeature ? 'linear-gradient(135deg, #1a3544 0%, #0d1f2d 100%)' : isInline ? 'transparent' : '#f8fbfd',
      border: isFeature || isInline ? 'none' : '1px solid #dce6ed',
      borderRadius: isInline ? '0' : '12px',
      padding: isFeature ? '2rem 1.5rem' : isInline ? '0.25rem 0' : '1rem',
      marginBottom: sectionMargin,
      color: textColor,
      boxShadow: isFeature ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
      textAlign: 'center',
    }}>
      <h3 style={{
        fontSize: isFeature ? '1.25rem' : isInline ? '0.98rem' : '1.05rem',
        margin: descriptionVisible ? '0 0 0.35rem' : '0 0 0.65rem',
        color: textColor,
        borderBottom: 'none',
        padding: 0,
      }}>
        {isInline ? `Find stays in ${name}` : `Where to Stay in ${name}`}
      </h3>
      {descriptionVisible && (
        <p style={{
          fontSize: isFeature ? '0.9rem' : '0.85rem',
          margin: '0 0 1rem',
          color: mutedTextColor,
          lineHeight: 1.5,
        }}>
          Find vacation rentals, hotels, and lodging {townName ? `near ${name}, Montana` : 'across Montana'}
        </p>
      )}
      <div style={{
        display: 'flex',
        gap: isInline ? '0.5rem' : '0.75rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <a
          href={vrbo}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            flex: 1,
            minWidth: isInline ? '135px' : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#3b6978',
            color: '#fff',
            padding: buttonPadding,
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: isFeature ? '0 2px 8px rgba(59,105,120,0.3)' : 'none',
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: buttonLabelSize }}>
            Vacation Rentals
          </span>
          <span style={{ fontSize: '0.7rem', opacity: 0.72 }}>via VRBO</span>
        </a>
        <a
          href={expedia}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            flex: 1,
            minWidth: isInline ? '135px' : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#204051',
            color: '#fff',
            padding: buttonPadding,
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: isFeature ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: buttonLabelSize }}>
            Hotels
          </span>
          <span style={{ fontSize: '0.7rem', opacity: 0.72 }}>via Expedia</span>
        </a>
      </div>
      {guideLinkVisible && (
        <p style={{ fontSize: isFeature ? '0.85rem' : '0.8rem', margin: '0.8rem 0 0', color: mutedTextColor }}>
          See the complete <Link href={`/lodging/${lodgingSlug}/`} style={{ color: linkColor, fontWeight: 600, textDecoration: 'underline' }}>Where to Stay in {name} guide</Link>.
        </p>
      )}
      <p style={{
        fontSize: '0.7rem',
        margin: isInline ? '0.45rem 0 0' : '0.75rem 0 0',
        color: disclosureColor,
      }}>
        Affiliate links help support this site at no extra cost to you
      </p>
    </section>
  );
}
