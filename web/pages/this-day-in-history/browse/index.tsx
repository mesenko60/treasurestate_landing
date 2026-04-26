import { GetStaticProps } from 'next';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import { useMemo, useState } from 'react';
import Header from '../../../components/Header';
import Hero from '../../../components/Hero';
import Footer from '../../../components/Footer';
import Breadcrumbs from '../../../components/Breadcrumbs';
import TdihCard from '../../../components/TdihCard';
import { MONTH_LABELS, TdihEntry, formatCategoryLabel } from '../../../lib/tdih';

type Props = {
  entries: TdihEntry[];
  categories: string[];
};

export default function TdihBrowsePage({ entries, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const url = 'https://treasurestate.com/this-day-in-history/browse/';
  const title = 'Browse Montana This Day in History';
  const desc = 'Browse all 365 daily Montana history entries by month and category.';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'This Day in History', url: '/this-day-in-history/' },
    { name: 'Browse', url },
  ];

  const filtered = useMemo(
    () => entries.filter((entry) => activeCategory === 'all' || entry.category === activeCategory),
    [entries, activeCategory],
  );

  const monthBuckets = useMemo(() => {
    const buckets: TdihEntry[][] = Array.from({ length: 12 }, () => []);
    for (const entry of filtered) {
      buckets[entry.month - 1].push(entry);
    }
    for (const bucket of buckets) {
      bucket.sort((a, b) => a.day - b.day);
    }
    return buckets;
  }, [filtered]);

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
      </Head>

      <Header />
      <Hero
        title="Browse Montana History by Date"
        subtitle="All 365 daily entries grouped by month."
        image="/images/hero-image.jpg"
        alt="Historic Montana by calendar date"
        small
      />
      <Breadcrumbs items={breadcrumbs} />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '1.2rem 1rem 2.5rem' }}>
        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem' }}>
          <label htmlFor="tdih-category-filter" style={{ display: 'block', fontWeight: 700, marginBottom: '0.45rem' }}>
            Filter by category
          </label>
          <select
            id="tdih-category-filter"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            style={{ width: '100%', maxWidth: '380px', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategoryLabel(category)}
              </option>
            ))}
          </select>
        </section>

        {monthBuckets.map((entriesForMonth, idx) => (
          <section key={MONTH_LABELS[idx]} style={{ marginTop: '1.2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.3rem', marginBottom: '0.6rem' }}>
              {MONTH_LABELS[idx]} ({entriesForMonth.length})
            </h2>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {entriesForMonth.length === 0 && (
                <p style={{ margin: 0, color: '#6b7280' }}>No entries in this category for {MONTH_LABELS[idx]}.</p>
              )}
              {entriesForMonth.map((entry) => (
                <TdihCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const repoRoot = path.resolve(process.cwd(), '..');
  const datasetPath = path.join(repoRoot, 'docs', 'TDIH', 'montana_tdih_dataset', 'montana_tdih.json');
  const raw = fs.readFileSync(datasetPath, 'utf8');
  const entries = (JSON.parse(raw) as TdihEntry[]).sort((a, b) => a.id.localeCompare(b.id));
  const categories = Array.from(new Set(entries.map((entry) => entry.category))).sort((a, b) => a.localeCompare(b));

  return {
    props: {
      entries,
      categories,
    },
  };
};
