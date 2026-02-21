import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileBottomNav() {
  const router = useRouter();
  
  // Helper to check if a route is active
  const isActive = (href: string) => {
    if (href === '/') return router.asPath === '/';
    return router.asPath.startsWith(href);
  };

  return (
    <nav className="mobile-bottom-nav">
      <Link href="/" className={isActive('/') ? 'active' : ''}>
        <div className="icon">🏠</div>
        <span>Home</span>
      </Link>
      
      <Link href="/Montana-towns" className={isActive('/Montana-towns') || isActive('/montana-towns') ? 'active' : ''}>
        <div className="icon">🗺️</div>
        <span>Towns</span>
      </Link>
      
      <Link href="/planners" className={isActive('/planners') ? 'active' : ''}>
        <div className="icon">📖</div>
        <span>Guides</span>
      </Link>
      
      <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer">
        <div className="icon">🛍️</div>
        <span>Shop</span>
      </a>
    </nav>
  );
}
