import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import TodayInHistory from '../../components/TodayInHistory';

export default function ThisDayInHistoryHome() {
  const url = 'https://treasurestate.com/this-day-in-history/';
  const title = 'This Day in Montana History';
  const desc = 'A daily Montana history story for every calendar day. Read today’s event, then browse the full 365-entry archive.';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'This Day in History', url },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What happened today in Montana history?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This page highlights one notable Montana event tied to today’s calendar date and links to the full day page with details and sources.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many events are included?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The archive includes 365 daily entries, one for each day in a non-leap-year calendar.',
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <Header />
      <Hero
        title="This Day in Montana History"
        subtitle="One historical story for every day of the year."
        image="/images/hero-image.jpg"
        alt="Montana history landscape"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '1.2rem 1rem 2.5rem' }}>
        <TodayInHistory />

        <section style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.1rem', marginTop: '1rem', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.7 }}>
            Explore the full archive to browse all 365 entries by month and category.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <Link href="/this-day-in-history/browse/" style={{ color: '#0a5cff', textDecoration: 'none', fontWeight: 700 }}>
              Browse all events →
            </Link>
          </div>
        </section>

        <section style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.1rem', marginTop: '1rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 0.6rem', fontSize: '1.15rem' }}>Frequently asked questions</h2>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>What happened today in Montana history?</h3>
          <p style={{ margin: '0 0 0.8rem', color: '#4b5563' }}>
            A daily card highlights one notable event from Montana history tied to today&apos;s date.
          </p>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>How many entries are covered?</h3>
          <p style={{ margin: 0, color: '#4b5563' }}>
            The archive includes 365 entries, one for each day of a non-leap-year calendar.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
