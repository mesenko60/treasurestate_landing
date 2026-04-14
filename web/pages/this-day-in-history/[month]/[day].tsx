import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { CATEGORY_LABELS, TdihEntry, getPrevNext, getTdihUrl, monthNumberToSlug, monthSlugToNumber, toEntryId } from '../../../lib/tdih';

type Props = {
  entry: TdihEntry;
  prev: TdihEntry;
  next: TdihEntry;
};

function readTdihEntries(): TdihEntry[] {
  const repoRoot = path.resolve(process.cwd(), '..');
  const datasetPath = path.join(repoRoot, 'docs', 'TDIH', 'montana_tdih_dataset', 'montana_tdih.json');
  const raw = fs.readFileSync(datasetPath, 'utf8');
  return (JSON.parse(raw) as TdihEntry[]).sort((a, b) => a.id.localeCompare(b.id));
}

export default function TdihDayPage({ entry, prev, next }: Props) {
  const pageUrl = `https://treasurestate.com${getTdihUrl(entry)}`;
  const title = `${entry.date_display} in Montana History: ${entry.headline}`;
  const desc = `${entry.date_display} (${entry.year ?? 'Historic era'}): ${entry.headline}. ${entry.body.slice(0, 140)}...`;
  const categoryLabel = CATEGORY_LABELS[entry.category] || entry.category.replace(/_/g, ' ');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'This Day in History', url: '/this-day-in-history/' },
    { name: entry.date_display, url: pageUrl },
  ];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.headline,
    description: desc,
    datePublished: entry.year ? `${entry.year}-01-01` : undefined,
    dateModified: '2026-04-14',
    author: {
      '@type': 'Organization',
      name: 'Treasure State',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Treasure State',
    },
    mainEntityOfPage: pageUrl,
    keywords: entry.tags.join(', '),
  };

  return (
    <>
      <Head>
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      </Head>

      <Header />
      <Hero
        title={entry.headline}
        subtitle={`${entry.date_display}${entry.year ? ` • ${entry.year}` : ''}`}
        image="/images/hero-image.jpg"
        alt={entry.headline}
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '1.2rem 1rem 2.5rem' }}>
        <article style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
          <div style={{ marginBottom: '0.9rem', display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#1f3f51',
                background: '#e8f2f7',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
              }}
            >
              {categoryLabel}
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.92rem' }}>{entry.date_display}</span>
          </div>

          <h1 style={{ margin: '0 0 0.6rem', fontFamily: 'var(--font-primary)' }}>{entry.headline}</h1>
          <p style={{ margin: '0 0 1rem', color: '#4b5563' }}>
            <strong>Location:</strong> {entry.location}
          </p>
          <p style={{ margin: 0, color: '#222', lineHeight: 1.75 }}>{entry.body}</p>

          {entry.tags.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    background: '#f3f4f6',
                    color: '#334155',
                    borderRadius: '999px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.75rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {entry.sources.length > 0 && (
            <section style={{ marginTop: '1.1rem' }}>
              <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem' }}>Sources</h2>
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {entry.sources.map((source) => (
                  <li key={source} style={{ marginBottom: '0.35rem' }}>
                    <a href={source.startsWith('http') ? source : `https://${source}`} target="_blank" rel="noopener noreferrer">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <nav
          aria-label="Previous and next dates"
          style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1rem' }}
        >
          <Link href={getTdihUrl(prev)} style={{ textDecoration: 'none', color: '#0a5cff', fontWeight: 600 }}>
            ← {prev.date_display}
          </Link>
          <Link href={getTdihUrl(next)} style={{ textDecoration: 'none', color: '#0a5cff', fontWeight: 600 }}>
            {next.date_display} →
          </Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = readTdihEntries();
  return {
    paths: entries.map((entry) => ({
      params: { month: monthNumberToSlug(entry.month), day: String(entry.day) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const monthSlug = String(params?.month || '');
  const dayValue = Number(params?.day || 0);
  const monthNum = monthSlugToNumber(monthSlug);

  if (monthNum < 1 || monthNum > 12 || !Number.isInteger(dayValue) || dayValue < 1 || dayValue > 31) {
    return { notFound: true };
  }

  const id = toEntryId(monthNum, dayValue);
  const entries = readTdihEntries();
  const entry = entries.find((candidate) => candidate.id === id);
  if (!entry) return { notFound: true };

  const { prev, next } = getPrevNext(entries, entry.id);
  if (!prev || !next) return { notFound: true };

  return {
    props: {
      entry,
      prev,
      next,
    },
  };
};
