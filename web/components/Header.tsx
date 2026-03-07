import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const isActive = (href: string) => router.asPath === href;

  return (
    <nav className="menu-bar">
      <Link href="/">Home</Link>
      <Link href="/montana-towns" className={isActive('/montana-towns') ? 'active' : ''}>Towns</Link>
      <Link href="/compare" className={isActive('/compare') ? 'active' : ''}>Compare</Link>
      <Link href="/best-of" className={router.asPath.startsWith('/best-of') ? 'active' : ''}>Best Of</Link>
      <Link href="/planners" className={router.asPath.startsWith('/planners') ? 'active' : ''}>Planners</Link>
      <Link href="/guides" className={router.asPath.startsWith('/guides') ? 'active' : ''}>Guides</Link>
      <Link href="/Information/montana-facts" className={router.asPath.startsWith('/Information') ? 'active' : ''}>Montana Facts</Link>
      <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer">Shop</a>
    </nav>
  );
}
