import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StaysCTA from '../components/StaysCTA';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    title: 'Travel Planners',
    description: 'Interactive guides to help you plan the perfect Montana trip.',
    links: [
      { href: '/planners/montana-backroads', label: 'Montana Backroads', desc: 'Scenic routes off the beaten path' },
      { href: '/planners/hot-springs-guide', label: 'Hot Springs Guide', desc: '20+ natural hot springs with ratings & maps' },
      { href: '/planners/campgrounds-guide', label: 'Campgrounds & RV Parks', desc: '100+ campgrounds across the state' },
      { href: '/planners/hiking-guide', label: 'Hiking Trails & Trailheads', desc: '60+ trails with ratings & directions' },
    ],
  },
  {
    title: 'Town Guides',
    description: 'Deep dives into Montana\'s cities and towns — housing, schools, outdoor recreation, and more.',
    links: [
      { href: '/montana-towns', label: 'Browse All Towns', desc: '130+ Montana communities' },
      { href: '/compare', label: 'Compare Towns', desc: 'Side-by-side town comparisons' },
      { href: '/best-of', label: 'Best-Of Rankings', desc: 'Top towns by category' },
    ],
  },
  {
    title: 'Relocation Guides',
    description: 'Everything you need to know before moving to Montana.',
    links: [
      { href: '/guides', label: 'Browse Guides', desc: 'Cost of living, housing, jobs & more' },
    ],
  },
  {
    title: 'Montana History & Facts',
    description: 'Stories and facts that make Montana unique.',
    links: [
      { href: '/Information/montana-facts', label: 'Montana Facts', desc: 'Key facts about the Treasure State' },
      { href: '/Information/why-treasure-state', label: 'Why "Treasure State"?', desc: 'The story behind the name' },
      { href: '/Information/mining-history-of-montana', label: 'Mining History', desc: 'Gold, silver, and copper' },
      { href: '/Information/geology-of-western-montana', label: 'Geology', desc: 'Ancient seas and glacial floods' },
      { href: '/Information/story-of-montana-vigilantes', label: 'Montana Vigilantes', desc: 'Frontier justice in the 1860s' },
    ],
  },
];

export default function ExploreMontana() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/explore-montana/" />
        <title>Explore Montana - Treasure State</title>
        <meta name="description" content="Your complete guide to exploring Montana — travel planners, town guides, relocation resources, and fascinating state history." />
        <meta property="og:title" content="Explore Montana - Treasure State" />
        <meta property="og:description" content="Your complete guide to exploring Montana — travel planners, town guides, relocation resources, and fascinating state history." />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/explore-montana/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
      </Head>
      <Header />
      <Hero
        title="Explore Montana"
        subtitle="Everything you need to plan, compare, and discover"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape - The Treasure State"
        small
      />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 3rem' }}>
        {SECTIONS.map((section) => (
          <section key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#204051', marginBottom: '0.3rem' }}>{section.title}</h2>
            <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '1rem' }}>{section.description}</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.75rem',
            }}>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block', padding: '1rem 1.2rem',
                    background: '#fff', borderRadius: '8px',
                    border: '1px solid #e8ede8', textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b6978'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8ede8'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#204051', marginBottom: '0.25rem' }}>
                    {link.label}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#888' }}>{link.desc}</div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <StaysCTA />
      </main>
      <Footer />
    </>
  );
}
