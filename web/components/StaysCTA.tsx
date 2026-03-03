import { vrboUrl, expediaUrl } from '../lib/affiliate-urls';

type Props = {
  townName?: string;
  slug?: string;
};

export default function StaysCTA({ townName, slug }: Props) {
  const name = townName || 'Montana';
  const s = slug || 'montana';
  const vrbo = vrboUrl(name, s);
  const expedia = expediaUrl(name, s);

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a3544 0%, #0d1f2d 100%)',
      borderRadius: '12px',
      padding: '2rem 1.5rem',
      marginBottom: '2rem',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      textAlign: 'center',
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        margin: '0 0 0.35rem',
        color: '#fff',
        borderBottom: 'none',
        padding: 0,
      }}>
        Where to Stay in {name}
      </h3>
      <p style={{
        fontSize: '0.9rem',
        margin: '0 0 1.25rem',
        opacity: 0.7,
        lineHeight: 1.5,
      }}>
        Find vacation rentals, hotels, and lodging {townName ? `near ${name}, Montana` : 'across Montana'}
      </p>
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <a
          href={vrbo}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            background: '#3b6978',
            color: '#fff',
            padding: '0.7rem 1.3rem',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(59,105,120,0.3)',
            lineHeight: 1.3,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Find Vacation Rentals {townName ? `near ${name}` : 'in Montana'}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>via VRBO</span>
        </a>
        <a
          href={expedia}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            background: '#204051',
            color: '#fff',
            padding: '0.7rem 1.3rem',
            borderRadius: '8px',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            lineHeight: 1.3,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Find Hotels {townName ? `near ${name}` : 'in Montana'}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>via Expedia</span>
        </a>
      </div>
      <p style={{
        fontSize: '0.7rem',
        margin: '1rem 0 0',
        opacity: 0.4,
      }}>
        Affiliate links help support this site at no extra cost to you
      </p>
    </section>
  );
}
