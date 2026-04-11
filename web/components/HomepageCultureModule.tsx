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
    <section className="hp-section hp-culture" style={{ paddingTop: 0 }}>
      <h2 className="hp-section-title">Montana Culture</h2>
      <p className="hp-section-sub">Local knowledge and identity from Big Sky Country</p>

      {showArticles && (
        <div className="hp-culture-articles">
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
        <div className="hp-culture-notes">
          {displayNotes.map(note => (
            <FieldNoteQuote key={note.id} content={note.content} variant="pullquote" />
          ))}
        </div>
      )}

      <style jsx>{`
        .hp-culture-articles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: ${showNotes ? '1.5rem' : '0'};
        }
        .hp-culture-notes {
          display: grid;
          grid-template-columns: repeat(${Math.min(displayNotes.length, 3)}, 1fr);
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .hp-culture-articles {
            grid-template-columns: 1fr;
          }
          .hp-culture-notes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
