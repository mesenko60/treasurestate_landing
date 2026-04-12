import type { AmazonProduct } from '../types/amazon-product';

type Props = {
  product: AmazonProduct;
  wishlistUrl?: string;
  variant?: 'sidebar' | 'slider' | 'grid';
  showDisclosure?: boolean;
};

export default function AmazonProductCard({ 
  product, 
  wishlistUrl,
  variant = 'grid',
  showDisclosure = true,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: '#204051',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #e2ebe2',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        ...(variant === 'slider' && { 
          minWidth: '200px', 
          maxWidth: '240px', 
          flexShrink: 0, 
          scrollSnapAlign: 'start' as const 
        }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {product.imageUrl && (
        <div style={{ 
          width: '100%', 
          aspectRatio: '1', 
          background: '#f8f8f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem',
        }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain', 
              display: 'block',
            }}
          />
        </div>
      )}
      <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: variant === 'sidebar' ? '0.85rem' : '0.9rem',
            lineHeight: 1.3,
            marginBottom: '0.35rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.title}
        </div>
        {product.description && (
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}>
            {product.description}
          </div>
        )}
        {showDisclosure && (
          <p style={{ 
            fontSize: '0.65rem', 
            color: '#999',
            margin: '0 0 0.5rem',
          }}>
            (affiliate link)
          </p>
        )}
      </div>
    </div>
  );
}
