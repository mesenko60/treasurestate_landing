import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const isActive = (href: string) => router.asPath === href;

  return (
    <nav className="menu-bar">
      <Link href="/">Home</Link>
      <Link href="/Montana-towns" className={isActive('/Montana-towns') ? 'active' : ''}>Cities and Towns</Link>
      <Link href="/Information/Montana-Facts.html" className={isActive('/Information/Montana-Facts.html') ? 'active' : ''}>Montana Facts</Link>
      <Link href="/explore-montana.html" className={isActive('/explore-montana.html') ? 'active' : ''}>Explore Montana</Link>
      <a href="#">Gallery</a>
      <a href="#">Contact</a>
    </nav>
  );
}
