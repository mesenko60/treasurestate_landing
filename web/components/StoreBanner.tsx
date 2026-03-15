import React from 'react';

export default function StoreBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #3b6978 0%, #204051 100%)',
      borderRadius: '8px',
      padding: '2rem',
      marginBottom: '2rem',
      color: '#fff',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #1a3544'
    }}>
      <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#fff', borderBottom: 'none', padding: 0 }}>Bring Montana Home</h3>
      <p style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', maxWidth: '600px', opacity: 0.9 }}>
        Discover authentic, locally-inspired apparel, gifts, and souvenirs at the official Treasure State Trading Post.
      </p>
      <a 
        href="https://shop.treasurestate.com" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: '#925f14',
          color: '#fff',
          padding: '0.8rem 2rem',
          borderRadius: '4px',
          fontWeight: 'bold',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'background 0.2s',
          boxShadow: '0 2px 5px rgba(146, 95, 20, 0.4)'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#7a4f10'}
        onMouseOut={(e) => e.currentTarget.style.background = '#925f14'}
      >
        Shop Now
      </a>
    </div>
  );
}
