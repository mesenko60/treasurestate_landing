import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';

const REPO_ROOT = path.resolve(process.cwd(), '..');
const INFO_DIR = path.join(REPO_ROOT, 'articles_information');
const GUIDES_DIR = path.join(REPO_ROOT, 'articles_guides');
const FIELD_NOTES_PATH = path.join(process.cwd(), 'data', 'field-notes.json');

/* ─── Types ──────────────────────────────────────────────── */

export type ArticleType = 'montana-facts' | 'guides';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  type: ArticleType;
  tags: string[];
  featured: boolean;
  excerpt: string;
  hero_image: string;
  hero_alt: string;
  meta_description: string;
  related_towns: string[];
  related_topics: string[];
  shop_cta_label: string;
  shop_cta_url: string;
  date_published: string;
  date_modified: string;
  field_notes: string[];
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  contentHtml: string;
  wordCount: number;
  h2Count: number;
  internalLinkCount: number;
  noindex: boolean;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  type: ArticleType;
  tags: string[];
  featured: boolean;
  excerpt: string;
  hero_image: string;
  hero_alt: string;
  date_published: string;
  date_modified: string;
}

export interface FieldNote {
  id: string;
  content: string;
  status: 'stored' | 'published';
  publish_as_article: boolean;
  tags: string[];
  related_topics: string[];
  featured: boolean;
  social_ready: boolean;
  social_caption: string;
  image: string | null;
  date_created: string;
}

/* ─── Defaults ───────────────────────────────────────────── */

const FRONTMATTER_DEFAULTS: Partial<ArticleFrontmatter> = {
  tags: [],
  featured: false,
  excerpt: '',
  hero_image: '/images/hero-image.jpg',
  hero_alt: 'Montana landscape',
  meta_description: '',
  related_towns: [],
  related_topics: [],
  shop_cta_label: '',
  shop_cta_url: '',
  field_notes: [],
};

/* ─── Helpers ────────────────────────────────────────────── */

function contentDir(type: ArticleType): string {
  return type === 'montana-facts' ? INFO_DIR : GUIDES_DIR;
}

function dirForArticleType(type: ArticleType): string {
  return type === 'montana-facts' ? INFO_DIR : GUIDES_DIR;
}

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md'));
}

function countWords(text: string): number {
  const stripped = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped ? stripped.split(' ').length : 0;
}

function countH2s(html: string): number {
  const matches = html.match(/<h2[\s>]/gi);
  return matches ? matches.length : 0;
}

function countInternalLinks(html: string): number {
  const matches = html.match(/href=["']\/[^"']+["']/gi);
  return matches ? matches.length : 0;
}

function resolveFieldNotes(html: string, notes: Map<string, FieldNote>): string {
  return html.replace(
    /\{\{field_note:([a-z0-9-]+)(?::(\w+))?\}\}/gi,
    (_match, id: string, variant?: string) => {
      const note = notes.get(id);
      if (!note) return '';
      const escaped = note.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (variant === 'pullquote') {
        return `<blockquote class="field-note field-note--pullquote"><p>${escaped}</p></blockquote>`;
      }
      if (variant === 'header') {
        return `<div class="field-note field-note--header"><p>${escaped}</p></div>`;
      }
      return `<blockquote class="field-note"><p>${escaped}</p></blockquote>`;
    },
  );
}

/* ─── Field Notes ────────────────────────────────────────── */

export function getAllFieldNotes(): FieldNote[] {
  if (!fs.existsSync(FIELD_NOTES_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(FIELD_NOTES_PATH, 'utf8'));
  } catch {
    return [];
  }
}

export function getPublishedFieldNotes(): FieldNote[] {
  return getAllFieldNotes().filter(n => n.status === 'published');
}

export function getFeaturedFieldNotes(): FieldNote[] {
  return getPublishedFieldNotes().filter(n => n.featured);
}

export function getFieldNote(id: string): FieldNote | null {
  return getAllFieldNotes().find(n => n.id === id) || null;
}

/* ─── Article Reading ────────────────────────────────────── */

function parseFrontmatter(raw: matter.GrayMatterFile<string>): ArticleFrontmatter {
  const data = raw.data as Record<string, unknown>;
  return {
    title: String(data.title || ''),
    slug: String(data.slug || ''),
    type: (data.type as ArticleType) || 'montana-facts',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : FRONTMATTER_DEFAULTS.tags!,
    featured: Boolean(data.featured ?? FRONTMATTER_DEFAULTS.featured),
    excerpt: String(data.excerpt || FRONTMATTER_DEFAULTS.excerpt),
    hero_image: String(data.hero_image || FRONTMATTER_DEFAULTS.hero_image),
    hero_alt: String(data.hero_alt || FRONTMATTER_DEFAULTS.hero_alt),
    meta_description: String(data.meta_description || data.excerpt || FRONTMATTER_DEFAULTS.meta_description),
    related_towns: Array.isArray(data.related_towns) ? data.related_towns.map(String) : FRONTMATTER_DEFAULTS.related_towns!,
    related_topics: Array.isArray(data.related_topics) ? data.related_topics.map(String) : FRONTMATTER_DEFAULTS.related_topics!,
    shop_cta_label: String(data.shop_cta_label || FRONTMATTER_DEFAULTS.shop_cta_label),
    shop_cta_url: String(data.shop_cta_url || FRONTMATTER_DEFAULTS.shop_cta_url),
    date_published: String(data.date_published || ''),
    date_modified: String(data.date_modified || data.date_published || ''),
    field_notes: Array.isArray(data.field_notes) ? data.field_notes.map(String) : FRONTMATTER_DEFAULTS.field_notes!,
  };
}

export async function getArticle(slug: string, type?: ArticleType): Promise<Article | null> {
  const dirs = type ? [dirForArticleType(type)] : [INFO_DIR, GUIDES_DIR];

  for (const dir of dirs) {
    const filePath = path.join(dir, `${slug}.md`);
    if (!fs.existsSync(filePath)) continue;

    const raw = matter(fs.readFileSync(filePath, 'utf8'));
    const fm = parseFrontmatter(raw);

    const fieldNoteMap = new Map<string, FieldNote>();
    if (fm.field_notes.length > 0) {
      const allNotes = getAllFieldNotes();
      for (const fnId of fm.field_notes) {
        const note = allNotes.find(n => n.id === fnId);
        if (note) fieldNoteMap.set(fnId, note);
      }
    }

    let contentHtml = await markdownToHtml(raw.content);
    contentHtml = resolveFieldNotes(contentHtml, fieldNoteMap);

    const wordCount = countWords(contentHtml);
    const h2Count = countH2s(contentHtml);
    const internalLinkCount = countInternalLinks(contentHtml);

    const noindex = wordCount < 300 || internalLinkCount < 2;

    return { frontmatter: fm, contentHtml, wordCount, h2Count, internalLinkCount, noindex };
  }

  return null;
}

/* ─── Article Listing ────────────────────────────────────── */

function readSummariesFromDir(dir: string, type: ArticleType): ArticleSummary[] {
  const files = readDir(dir);
  const summaries: ArticleSummary[] = [];

  for (const file of files) {
    const raw = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    const fm = parseFrontmatter(raw);
    summaries.push({
      slug: fm.slug || file.replace(/\.md$/, ''),
      title: fm.title,
      type,
      tags: fm.tags,
      featured: fm.featured,
      excerpt: fm.excerpt,
      hero_image: fm.hero_image,
      hero_alt: fm.hero_alt,
      date_published: fm.date_published,
      date_modified: fm.date_modified,
    });
  }

  return summaries;
}

export function getArticleSlugs(type?: ArticleType): string[] {
  if (type) {
    return readDir(contentDir(type)).map(f => f.replace(/\.md$/, ''));
  }
  return [
    ...readDir(INFO_DIR).map(f => f.replace(/\.md$/, '')),
    ...readDir(GUIDES_DIR).map(f => f.replace(/\.md$/, '')),
  ];
}

export function getArticleSummaries(type?: ArticleType): ArticleSummary[] {
  if (type === 'montana-facts') return readSummariesFromDir(INFO_DIR, 'montana-facts');
  if (type === 'guides') return readSummariesFromDir(GUIDES_DIR, 'guides');
  return [
    ...readSummariesFromDir(INFO_DIR, 'montana-facts'),
    ...readSummariesFromDir(GUIDES_DIR, 'guides'),
  ];
}

export function getFeaturedArticles(): ArticleSummary[] {
  return getArticleSummaries().filter(a => a.featured);
}

export function getArticlesByTag(tag: string): ArticleSummary[] {
  return getArticleSummaries().filter(a => a.tags.includes(tag));
}

export function getArticlesForTown(townSlug: string): ArticleSummary[] {
  const all = getArticleSummaries();
  return all.filter(a => {
    const raw = matter(
      fs.readFileSync(
        path.join(contentDir(a.type), `${a.slug}.md`),
        'utf8',
      ),
    );
    const towns: string[] = Array.isArray(raw.data.related_towns)
      ? raw.data.related_towns
      : [];
    return towns.includes(townSlug);
  });
}

/* ─── Related Content Resolution ─────────────────────────── */

export function getRelatedArticles(
  options: {
    tags?: string[];
    townSlug?: string;
    excludeSlug?: string;
    limit?: number;
  },
): ArticleSummary[] {
  const limit = options.limit || 3;
  const all = getArticleSummaries();
  const exclude = options.excludeSlug || '';

  const scored = all
    .filter(a => a.slug !== exclude)
    .map(a => {
      let score = 0;
      if (options.tags) {
        score += a.tags.filter(t => options.tags!.includes(t)).length * 2;
      }
      if (a.featured) score += 1;
      return { article: a, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= limit) {
    return scored.slice(0, limit).map(s => s.article);
  }

  // Fallback: featured articles
  const featured = all.filter(a => a.featured && a.slug !== exclude);
  const combined = [
    ...scored.map(s => s.article),
    ...featured.filter(f => !scored.some(s => s.article.slug === f.slug)),
  ];

  return combined.slice(0, limit);
}
