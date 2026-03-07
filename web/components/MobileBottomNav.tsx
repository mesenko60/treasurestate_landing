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
      
      <Link href="/montana-towns" className={isActive('/montana-towns') ? 'active' : ''}>
        <div className="icon">🗺️</div>
        <span>Towns</span>
      </Link>
      
      <Link href="/compare" className={isActive('/compare') ? 'active' : ''}>
        <div className="icon">⚖️</div>
        <span>Compare</span>
      </Link>

      <Link href="/best-of" className={isActive('/best-of') ? 'active' : ''}>
        <div className="icon">🏆</div>
        <span>Best Of</span>
      </Link>

      <Link href="/planners" className={isActive('/planners') ? 'active' : ''}>
        <div className="icon">🧭</div>
        <span>Planners</span>
      </Link>
    </nav>
  );
}
