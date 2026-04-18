import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const router = useRouter();
  const isActive = (href: string) => router.asPath === href;
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const toggleSearch = useCallback(() => setSearchOpen(v => !v), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    const handleOpenEvent = () => openSearch();
    window.addEventListener('keydown', handleKey);
    window.addEventListener('openSearch', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('openSearch', handleOpenEvent);
    };
  }, [toggleSearch, openSearch]);

  return (
    <>
      <nav className="menu-bar">
        <Link href="/">Home</Link>
        <Link href="/montana-towns" className={isActive('/montana-towns') ? 'active' : ''}>Towns</Link>
        <Link href="/compare" className={isActive('/compare') ? 'active' : ''}>Compare</Link>
        <Link href="/best-of" className={router.asPath.startsWith('/best-of') ? 'active' : ''}>Best Of</Link>
        <Link href="/planners/backroads-planner" className={router.asPath.startsWith('/planners') ? 'active' : ''}>Trip Planner</Link>
        <Link href="/ghost-towns/" className={router.asPath.startsWith('/ghost-towns') ? 'active' : ''}>Ghost Towns</Link>
        <Link href="/guides" className={router.asPath.startsWith('/guides') ? 'active' : ''}>Guides</Link>
        <Link href="/lodging" className={router.asPath.startsWith('/lodging') ? 'active' : ''}>Lodging</Link>
        <Link href="/nearby" className={router.asPath.startsWith('/nearby') ? 'active' : ''}>Nearby</Link>
        <Link href="/events" className={router.asPath.startsWith('/events') ? 'active' : ''}>Events</Link>
        <Link href="/information/montana-facts" className={router.asPath.startsWith('/information') ? 'active' : ''}>Montana Facts</Link>
        <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer">Shop</a>
        <button
          onClick={toggleSearch}
          aria-label="Search"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.5em 0.6em',
            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px',
            color: '#204051', fontSize: '0.85rem', fontFamily: "'Montserrat', sans-serif",
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f0f7fa')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>⌘K</span>
        </button>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
