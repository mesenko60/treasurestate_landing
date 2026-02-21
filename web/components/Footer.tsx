export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div style={{ marginBottom: '1rem' }}>
        <a href="https://shop.treasurestate.com" target="_blank" rel="noopener noreferrer" style={{ color: '#d8973c', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Visit the Treasure State Shop</a>
      </div>
      <p>&copy; <span>{year}</span> treasurestate.com - All Rights Reserved.</p>
      <p>Your Gateway to Montana's Treasures</p>
    </footer>
  );
}
