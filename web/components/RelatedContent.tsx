import type { ArticleSummary } from '../lib/articles';
import ArticleCard from './ArticleCard';

type Props = {
  articles: ArticleSummary[];
  title?: string;
};

export default function RelatedContent({ articles, title = 'Related Reading' }: Props) {
  if (!articles || articles.length === 0) return null;

  const display = articles.slice(0, 3);

  return (
    <section style={{ margin: '2.5rem 0 1rem' }}>
      <h2 style={{
        fontSize: '1.15rem',
        color: '#204051',
        marginBottom: '1rem',
        fontFamily: "var(--font-primary, 'Montserrat', sans-serif)",
      }}>
        {title}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: display.length === 1
          ? '1fr'
          : 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {display.map(a => (
          <ArticleCard
            key={a.slug}
            slug={a.slug}
            title={a.title}
            excerpt={a.excerpt}
            type={a.type}
            heroImage={a.hero_image}
            heroAlt={a.hero_alt}
            datePublished={a.date_published}
          />
        ))}
      </div>
    </section>
  );
}
