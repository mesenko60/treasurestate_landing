import type { AmazonProduct } from '../types/amazon-product';
import { amazonProductUrl, AMAZON_LINK_DISCLOSURE } from '../lib/amazon-affiliate';

type Props = {
  product: AmazonProduct;
  variant?: 'sidebar' | 'slider' | 'grid';
  showDisclosure?: boolean;
};

export default function AmazonProductCard({ 
  product, 
  variant = 'grid',
  showDisclosure = true,
}: Props) {
  const url = amazonProductUrl(product.asin);
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: '#204051',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #e2ebe2',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        ...(variant === 'slider' && { 
          minWidth: '180px', 
          maxWidth: '220px', 
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
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          style={{ 
            width: '100%', 
            aspectRatio: '1', 
            objectFit: 'cover', 
            display: 'block',
            background: '#f8f8f8',
          }}
        />
      )}
      {!product.imageUrl && (
        <div style={{
          width: '100%',
          aspectRatio: '1',
          background: 'linear-gradient(135deg, #f0f4f0 0%, #e8ece8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.8rem',
        }}>
          View on Amazon
        </div>
      )}
      <div style={{ padding: '0.6rem 0.75rem' }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: variant === 'sidebar' ? '0.85rem' : '0.88rem',
            lineHeight: 1.3,
            marginBottom: '0.25rem',
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
            fontSize: '0.78rem', 
            color: '#666', 
            lineHeight: 1.4,
            marginBottom: '0.35rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.description}
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '0.35rem',
        }}>
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#ff9900', 
            fontWeight: 600,
          }}>
            View on Amazon →
          </span>
          {showDisclosure && (
            <span style={{ 
              fontSize: '0.65rem', 
              color: '#999',
            }}>
              {AMAZON_LINK_DISCLOSURE}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
