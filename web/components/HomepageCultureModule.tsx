import type { ArticleSummary, FieldNote } from '../lib/articles';
import ArticleCard from './ArticleCard';
import FieldNoteQuote from './FieldNoteQuote';

type Props = {
  articles: ArticleSummary[];
  fieldNotes: FieldNote[];
};

export default function HomepageCultureModule({ articles, fieldNotes }: Props) {
  const showArticles = articles.length >= 2;
  const showNotes = fieldNotes.length >= 2;

  if (!showArticles && !showNotes) return null;

  const displayArticles = articles.slice(0, 3);
  const displayNotes = fieldNotes.slice(0, 3);

  return (
    <section className="hp-section" style={{ paddingTop: 0 }}>
      <h2 className="hp-section-title">Montana Culture</h2>
      <p className="hp-section-sub">Local knowledge and identity from Big Sky Country</p>

      {showArticles && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: showNotes ? '1.5rem' : 0,
        }}>
          {displayArticles.map(a => (
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
      )}

      {showNotes && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: displayNotes.length === 1 ? '1fr' : `repeat(${Math.min(displayNotes.length, 3)}, 1fr)`,
          gap: '1rem',
        }}>
          {displayNotes.map(note => (
            <FieldNoteQuote key={note.id} content={note.content} variant="pullquote" />
          ))}
        </div>
      )}
    </section>
  );
}
