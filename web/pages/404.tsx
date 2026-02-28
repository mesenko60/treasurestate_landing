import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Treasure State</title>
        <meta property="og:title" content="Page Not Found - Treasure State" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />
      <main style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <div style={{ marginTop: '30px' }}>
          <Link href="/" style={{ color: '#0056b3', textDecoration: 'underline', fontSize: '18px' }}>
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
