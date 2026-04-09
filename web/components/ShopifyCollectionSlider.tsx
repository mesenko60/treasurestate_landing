import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchCollectionProducts, fetchAllProducts, type ShopifyProduct } from '../lib/shopify';

type Props = {
  collection: string;
  townName: string;
  maxProducts?: number;
};

const SHOP_URL = 'https://shop.treasurestate.com';

function formatPrice(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
}

function ProductCard({ product, variant }: { product: ShopifyProduct; variant: 'sidebar' | 'slider' }) {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: '#204051',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #e2ebe2',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        ...(variant === 'slider' && { minWidth: '180px', maxWidth: '220px', flexShrink: 0, scrollSnapAlign: 'start' as const }),
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
          alt={product.imageAlt || product.title}
          loading="lazy"
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
        />
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
        <div style={{ fontSize: '0.82rem', color: '#925f14', fontWeight: 600 }}>
          {formatPrice(product.priceAmount, product.priceCurrency)}
        </div>
      </div>
    </a>
  );
}

function SidebarSlider({ products }: { products: ShopifyProduct[] }) {
  const [idx, setIdx] = useState(0);
  const count = products.length;

  const prev = useCallback(() => setIdx((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  if (count === 0) return null;

  return (
    <div>
      <ProductCard product={products[idx]} variant="sidebar" />
      {count > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={prev}
            aria-label="Previous product"
            style={{
              width: '30px', height: '30px', borderRadius: '50%',
              border: '1px solid #d8e2d8', background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#3b6978', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f5f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            {'\u2039'}
          </button>
          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500 }}>
            {idx + 1} / {count}
          </span>
          <button
            onClick={next}
            aria-label="Next product"
            style={{
              width: '30px', height: '30px', borderRadius: '50%',
              border: '1px solid #d8e2d8', background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#3b6978', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f5f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            {'\u203A'}
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton({ variant }: { variant: 'sidebar' | 'slider' }) {
  if (variant === 'sidebar') {
    return (
      <div style={{ background: '#f4f4f4', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ width: '100%', aspectRatio: '1', background: '#e8e8e8' }} />
        <div style={{ padding: '0.6rem 0.75rem' }}>
          <div style={{ height: '0.85rem', background: '#e0e0e0', borderRadius: '4px', marginBottom: '0.4rem', width: '80%' }} />
          <div style={{ height: '0.75rem', background: '#e8e8e8', borderRadius: '4px', width: '40%' }} />
        </div>
      </div>
    );
  }
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ minWidth: '180px', maxWidth: '220px', flexShrink: 0, background: '#f4f4f4', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: '100%', aspectRatio: '1', background: '#e8e8e8' }} />
          <div style={{ padding: '0.6rem 0.75rem' }}>
            <div style={{ height: '0.85rem', background: '#e0e0e0', borderRadius: '4px', marginBottom: '0.4rem', width: '80%' }} />
            <div style={{ height: '0.75rem', background: '#e8e8e8', borderRadius: '4px', width: '40%' }} />
          </div>
        </div>
      ))}
    </>
  );
}

function ScrollArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Scroll ${direction}`}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: '-12px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid #d8e2d8',
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        fontSize: '1rem',
        color: '#3b6978',
        zIndex: 2,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f5f0'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
    >
      {direction === 'left' ? '\u2039' : '\u203A'}
    </button>
  );
}

export default function ShopifyCollectionSlider({
  collection,
  townName,
  maxProducts = 8,
}: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      let items = await fetchCollectionProducts(collection, maxProducts);
      if (items.length === 0) {
        items = await fetchAllProducts(maxProducts);
      }
      if (!cancelled) {
        setProducts(items);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [collection, maxProducts]);

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  if (!loading && products.length === 0) return null;

  const heading = (
    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem', color: '#204051', fontWeight: 700 }}>
      Shop {townName} Gear
    </h3>
  );

  const storeCta = (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginTop: '0.75rem',
        padding: '0.55rem 1rem',
        background: '#925f14',
        color: '#fff',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '0.85rem',
        textDecoration: 'none',
        transition: 'background 0.2s',
        letterSpacing: '0.3px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#7a4f10'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#925f14'; }}
    >
      Visit the Full Store
      <span aria-hidden="true" style={{ fontSize: '0.9em' }}>&rarr;</span>
    </a>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .shopify-sidebar-widget { display: none; }
        .shopify-inline-widget { display: block; }
        @media (min-width: 1024px) {
          .shopify-sidebar-widget { display: block; }
          .shopify-inline-widget { display: none; }
        }
      `}} />

      {/* Desktop sidebar: single-product slider with prev/next */}
      <div
        className="shopify-sidebar-widget"
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8faf8',
          borderRadius: '8px',
          border: '1px solid #e2ebe2',
        }}
      >
        {heading}
        {loading ? (
          <LoadingSkeleton variant="sidebar" />
        ) : (
          <SidebarSlider products={products} />
        )}
        <div style={{ textAlign: 'center' }}>{storeCta}</div>
      </div>

      {/* Mobile inline: horizontal scroll slider */}
      <div
        className="shopify-inline-widget"
        style={{
          margin: '2rem 0',
          padding: '1.25rem',
          background: '#f8faf8',
          borderRadius: '10px',
          border: '1px solid #e2ebe2',
        }}
      >
        {heading}
        <div style={{ position: 'relative' }}>
          {!loading && products.length > 2 && (
            <>
              <ScrollArrow direction="left" onClick={() => scroll('left')} />
              <ScrollArrow direction="right" onClick={() => scroll('right')} />
            </>
          )}
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '4px 2px',
            }}
          >
            <style dangerouslySetInnerHTML={{ __html: `
              .shopify-inline-widget div::-webkit-scrollbar { display: none; }
            `}} />
            {loading ? (
              <LoadingSkeleton variant="slider" />
            ) : (
              products.map((p) => <ProductCard key={p.id} product={p} variant="slider" />)
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>{storeCta}</div>
      </div>
    </>
  );
}
