import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import SearchOverlay from './SearchOverlay';

export default function MobileBottomNav() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const toggleSearch = useCallback(() => setSearchOpen(v => !v), []);

  /** Immersive map uses its own bottom chip bar; fixed nav would cover it (z-index 9999). */
  const hideBottomNav = router.pathname === '/map';

  useEffect(() => {
    const handleOpenEvent = () => openSearch();
    window.addEventListener('openSearch', handleOpenEvent);
    return () => window.removeEventListener('openSearch', handleOpenEvent);
  }, [openSearch]);

  const isActive = (href: string) => {
    if (href === '/') return router.asPath === '/';
    return router.asPath.startsWith(href);
  };

  return (
    <>
      {!hideBottomNav && (
      <nav className="mobile-bottom-nav" aria-hidden="true">
        <Link href="/" className={isActive('/') ? 'active' : ''} tabIndex={-1}>
          <div className="icon">🏠</div>
          <span>Home</span>
        </Link>
        
        <Link href="/montana-towns" className={isActive('/montana-towns') ? 'active' : ''} tabIndex={-1}>
          <div className="icon">🗺️</div>
          <span>Towns</span>
        </Link>

        <button
          onClick={toggleSearch}
          aria-label="Search"
          tabIndex={-1}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', color: '#6b7280',
            fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 500,
            flex: 1, minWidth: 0, padding: 0,
          }}
        >
          <div className="icon">🔍</div>
          <span>Search</span>
        </button>

        <Link href="/nearby" className={isActive('/nearby') ? 'active' : ''} tabIndex={-1}>
          <div className="icon">📍</div>
          <span>Nearby</span>
        </Link>

        <Link href="/best-of" className={isActive('/best-of') ? 'active' : ''} tabIndex={-1}>
          <div className="icon">🏆</div>
          <span>Best Of</span>
        </Link>

        <Link href="/guides" className={isActive('/guides') ? 'active' : ''} tabIndex={-1}>
          <div className="icon">📖</div>
          <span>Guides</span>
        </Link>
      </nav>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
