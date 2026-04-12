import React, { useRef, useCallback } from 'react';
import type { AmazonProductCollection } from '../types/amazon-product';
import AmazonProductCard from './AmazonProductCard';
import { AMAZON_DISCLOSURE } from '../lib/amazon-affiliate';

type Props = {
  collection: AmazonProductCollection;
  maxProducts?: number;
};

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

export default function AmazonProductSlider({
  collection,
  maxProducts = 8,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = collection.products.slice(0, maxProducts);

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  if (products.length === 0) return null;

  const heading = (
    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#204051', fontWeight: 700 }}>
      {collection.title}
    </h3>
  );

  const description = collection.description && (
    <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
      {collection.description}
    </p>
  );

  const shopButton = collection.wishlistUrl && (
    <a
      href={collection.wishlistUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginTop: '0.75rem',
        padding: '0.65rem 1.25rem',
        background: '#ff9900',
        color: '#111',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'background 0.2s',
        letterSpacing: '0.3px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#e88a00'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#ff9900'; }}
    >
      Shop This Kit on Amazon
      <span aria-hidden="true" style={{ fontSize: '0.9em' }}>&rarr;</span>
    </a>
  );

  const disclosure = (
    <p style={{ 
      fontSize: '0.7rem', 
      color: '#999', 
      margin: '0.75rem 0 0', 
      textAlign: 'center' 
    }}>
      {AMAZON_DISCLOSURE}
    </p>
  );

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1.25rem',
        background: '#fffaf0',
        borderRadius: '10px',
        border: '1px solid #ffe4b8',
      }}
    >
      {heading}
      {description}
      <div style={{ position: 'relative' }}>
        {products.length > 2 && (
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
            .amazon-slider div::-webkit-scrollbar { display: none; }
          `}} />
          {products.map((p) => (
            <AmazonProductCard 
              key={p.asin} 
              product={p} 
              wishlistUrl={collection.wishlistUrl}
              variant="slider" 
              showDisclosure={false} 
            />
          ))}
        </div>
      </div>
      {shopButton && <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>{shopButton}</div>}
      {disclosure}
    </div>
  );
}
