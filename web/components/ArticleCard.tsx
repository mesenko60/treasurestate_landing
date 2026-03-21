import Link from 'next/link';

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  type: 'montana-facts' | 'guides';
  heroImage?: string;
  heroAlt?: string;
  datePublished?: string;
};

function urlForArticle(slug: string, type: 'montana-facts' | 'guides'): string {
  return type === 'montana-facts'
    ? `/information/${slug}/`
    : `/guides/${slug}/`;
}

const TYPE_LABELS: Record<string, string> = {
  'montana-facts': 'Montana Facts',
  guides: 'Guide',
};

export default function ArticleCard({ slug, title, excerpt, type, heroImage, heroAlt, datePublished }: Props) {
  const href = urlForArticle(slug, type);
  const img = heroImage || '/images/hero-image.jpg';
  const alt = heroAlt || title;
  const badge = TYPE_LABELS[type] || type;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .article-card { background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; text-decoration: none; color: #204051; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
        .article-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
        .article-card__img { position: relative; width: 100%; height: 160px; overflow: hidden; background: #e8ede8; }
        .article-card__img img { width: 100%; height: 100%; object-fit: cover; }
        .article-card__badge { position: absolute; top: 8px; left: 8px; background: rgba(32,64,81,0.85); color: #fff; font-size: 0.68rem; font-weight: 600; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; }
        .article-card__body { padding: 1rem 1.15rem; flex: 1; display: flex; flex-direction: column; }
        .article-card__title { font-family: var(--font-primary, 'Montserrat', sans-serif); font-weight: 700; font-size: 1rem; margin-bottom: 0.35rem; line-height: 1.3; }
        .article-card__excerpt { font-size: 0.85rem; color: #555; line-height: 1.55; flex: 1; }
        .article-card__date { font-size: 0.72rem; color: #aaa; margin-top: 0.5rem; }
      `}} />
      <Link href={href} className="article-card" data-track-article={slug}>
        <div className="article-card__img">
          <img src={img} alt={alt} loading="lazy" />
          <span className="article-card__badge">{badge}</span>
        </div>
        <div className="article-card__body">
          <div className="article-card__title">{title}</div>
          <div className="article-card__excerpt">{excerpt}</div>
          {datePublished && (
            <div className="article-card__date">
              {new Date(datePublished + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </Link>
    </>
  );
}
