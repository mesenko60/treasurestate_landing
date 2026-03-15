import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
        <Link href="/information/why-treasure-state/" style={{ color: '#ddd', textDecoration: 'none' }}>Why &ldquo;Treasure State&rdquo;?</Link>
        <Link href="/information/mining-history-of-montana/" style={{ color: '#ddd', textDecoration: 'none' }}>Mining History</Link>
        <Link href="/information/geology-of-western-montana/" style={{ color: '#ddd', textDecoration: 'none' }}>Geology of Montana</Link>
        <Link href="/guides/summer-road-trips/" style={{ color: '#ddd', textDecoration: 'none' }}>Summer Road Trips</Link>
        <Link href="/guides/winter-driving-guide/" style={{ color: '#ddd', textDecoration: 'none' }}>Winter Driving Guide</Link>
        <Link href="/explore-montana/" style={{ color: '#ddd', textDecoration: 'none' }}>Explore Montana</Link>
      </nav>
      <div style={{ marginBottom: '1rem' }}>
        <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer" style={{ color: '#f5c97a', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Visit the Treasure State Shop</a>
      </div>
      <p>&copy; <span>{year}</span> treasurestate.com - All Rights Reserved.</p>
      <p>Your Gateway to Montana&rsquo;s Treasures</p>
    </footer>
  );
}
