import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Breadcrumbs from '../components/Breadcrumbs';
import Footer from '../components/Footer';
import AmazonProductCard from '../components/AmazonProductCard';
import { getAllCollections } from '../lib/amazon-products';
import { AMAZON_DISCLOSURE } from '../lib/amazon-affiliate';
import type { AmazonProductCollection } from '../types/amazon-product';

const url = 'https://treasurestate.com/gear/';
const title = 'Montana Travel Gear & Essentials';
const desc = 'Curated gear recommendations for exploring Montana. From emergency road trip kits to fly fishing essentials, find everything you need for Big Sky Country adventures.';

function CollectionSection({ collection }: { collection: AmazonProductCollection }) {
  if (collection.products.length === 0) return null;
  
  const sectionId = collection.id;
  
  return (
    <section id={sectionId} style={{ marginBottom: '3rem' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        color: '#204051', 
        marginBottom: '0.5rem',
        borderBottom: '2px solid #ff9900',
        paddingBottom: '0.5rem',
      }}>
        {collection.title}
      </h2>
      {collection.description && (
        <p style={{ 
          color: '#666', 
          marginBottom: '1.25rem', 
          fontSize: '1rem',
          lineHeight: 1.6,
        }}>
          {collection.description}
        </p>
      )}
      
      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {collection.products.map((product) => (
          <AmazonProductCard 
            key={product.asin} 
            product={product} 
            wishlistUrl={collection.wishlistUrl}
            variant="grid"
            showDisclosure={false}
          />
        ))}
      </div>

      {/* Shop This Kit Button */}
      {collection.wishlistUrl && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a
            href={collection.wishlistUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: '#ff9900',
              color: '#111',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(255,153,0,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,153,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,153,0,0.3)';
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Shop This Kit on Amazon
          </a>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#888', 
            marginTop: '0.75rem',
          }}>
            View all {collection.products.length} items and add to your cart
          </p>
        </div>
      )}
    </section>
  );
}

export default function GearPage() {
  const collections = getAllCollections();
  const collectionsWithProducts = collections.filter(c => c.products.length > 0);
  
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Gear', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: desc,
    url,
    publisher: { 
      '@type': 'Organization', 
      name: 'Treasure State', 
      url: 'https://treasurestate.com' 
    },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana travel gear, Montana road trip essentials, bear spray Montana, emergency kit Montana, Montana hiking gear, Montana camping gear" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero 
        title="Montana Travel Gear" 
        subtitle="Essentials for Big Sky Adventures" 
        image="/images/hero-image.jpg" 
        alt="Montana outdoor adventure gear" 
        small 
      />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        
        {/* Intro */}
        <section style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#333', marginBottom: '1rem' }}>
            Montana's vast wilderness, remote highways, and unpredictable weather demand proper preparation. 
            Whether you're road-tripping the Going-to-the-Sun Road, fishing the Madison River, or hiking in 
            Glacier National Park, having the right gear can make the difference between a great adventure 
            and a dangerous situation.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#555' }}>
            We've curated these gear collections based on what actually matters for Montana travel — 
            from bear spray (essential in grizzly country) to emergency supplies for those long stretches 
            between towns.
          </p>
        </section>

        {/* Table of Contents */}
        {collectionsWithProducts.length > 1 && (
          <nav style={{ 
            background: '#f8f9fa', 
            padding: '1.25rem 1.5rem', 
            borderRadius: '8px',
            marginBottom: '2.5rem',
          }}>
            <h2 style={{ fontSize: '1rem', color: '#204051', margin: '0 0 0.75rem', fontWeight: 600 }}>
              Gear Collections
            </h2>
            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem 1.5rem',
            }}>
              {collectionsWithProducts.map((collection) => (
                <li key={collection.id}>
                  <a 
                    href={`#${collection.id}`} 
                    style={{ 
                      color: '#3b6978', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                    }}
                  >
                    {collection.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Collections */}
        {collectionsWithProducts.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))}

        {/* Disclosure */}
        <aside style={{
          background: '#fffaf0',
          border: '1px solid #ffe4b8',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          marginTop: '2rem',
        }}>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#666', 
            margin: 0,
            lineHeight: 1.6,
          }}>
            <strong>Affiliate Disclosure:</strong> {AMAZON_DISCLOSURE} Product links on this page 
            are affiliate links — if you purchase through them, we may earn a small commission at 
            no extra cost to you. This helps support Treasure State and allows us to continue 
            providing free Montana travel guides.
          </p>
        </aside>

        {/* Related Links */}
        <section style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#204051', marginBottom: '1rem' }}>
            Plan Your Montana Adventure
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            <Link 
              href="/guides/winter-driving-guide/" 
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                background: '#3b6978',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Winter Driving Guide
            </Link>
            <Link 
              href="/guides/fly-fishing-guide/" 
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                background: '#3b6978',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Fly Fishing Guide
            </Link>
            <Link 
              href="/guides/hiking-guide/" 
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                background: '#3b6978',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Hiking Guide
            </Link>
            <Link 
              href="/planners/" 
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                background: '#f5f5f5',
                color: '#204051',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid #ddd',
              }}
            >
              All Trip Planners
            </Link>
          </div>
        </section>

        {/* Shop Link */}
        <section style={{ 
          marginTop: '2.5rem', 
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #1a3544 0%, #0d1f2d 100%)',
          borderRadius: '12px',
          color: '#fff',
        }}>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem', color: '#fff' }}>
            Shop Treasure State Merchandise
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.25rem' }}>
            Montana-inspired apparel and goods from our own shop
          </p>
          <a 
            href="https://shop.treasurestate.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#f5c97a',
              color: '#1a3544',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Visit the Treasure State Shop →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
