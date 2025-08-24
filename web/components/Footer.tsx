export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; <span>{year}</span> treasurestate.com - All Rights Reserved.</p>
      <p>Your Gateway to Montana's Treasures</p>
    </footer>
  );
}
