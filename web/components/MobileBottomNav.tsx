import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import SearchOverlay from './SearchOverlay';

export default function MobileBottomNav() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSearch = useCallback(() => setSearchOpen(v => !v), []);

  const isActive = (href: string) => {
    if (href === '/') return router.asPath === '/';
    return router.asPath.startsWith(href);
  };

  return (
    <>
      <nav className="mobile-bottom-nav">
        <Link href="/" className={isActive('/') ? 'active' : ''}>
          <div className="icon">🏠</div>
          <span>Home</span>
        </Link>
        
        <Link href="/montana-towns" className={isActive('/montana-towns') ? 'active' : ''}>
          <div className="icon">🗺️</div>
          <span>Towns</span>
        </Link>

        <button
          onClick={toggleSearch}
          aria-label="Search"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', color: '#6b7280', width: '25%', height: '100%',
            fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 500,
          }}
        >
          <div className="icon">🔍</div>
          <span>Search</span>
        </button>

        <Link href="/best-of" className={isActive('/best-of') ? 'active' : ''}>
          <div className="icon">🏆</div>
          <span>Best Of</span>
        </Link>

        <Link href="/planners" className={isActive('/planners') ? 'active' : ''}>
          <div className="icon">🧭</div>
          <span>Planners</span>
        </Link>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
