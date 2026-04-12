import fs from 'fs';
import path from 'path';
import { markdownToHtml } from './markdown';

const REPO_ROOT = path.resolve(process.cwd(), '..');
const RAILROAD_ARTICLES_DIR = path.join(REPO_ROOT, 'docs', 'montana_railroad_articles_FINAL');
const RAILROAD_DATA_PATH = path.join(process.cwd(), 'data', 'railroad-history.json');

export interface RailroadArticleMeta {
  slug: string;
  title: string;
  voice: string;
  color: string;
  region: string;
  year: string;
  excerpt: string;
}

export interface RailroadPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtype: string;
  articleSlug: string;
  description: string;
  year: string;
  county: string;
  color: string;
}

export interface RailroadRoute {
  id: string;
  name: string;
  articleSlug: string;
  subtype: string;
  railroad: string;
  status: string;
  color: string;
  description: string;
  coordinates: [number, number][];
}

export interface RailroadHistoryData {
  name: string;
  description: string;
  articleCount: number;
  featureCount: number;
  articles: RailroadArticleMeta[];
  points: RailroadPoint[];
  routes: RailroadRoute[];
  subtypeLabels: Record<string, string>;
  statusLabels: Record<string, string>;
}

export interface RailroadArticle extends RailroadArticleMeta {
  contentHtml: string;
  wordCount: number;
  points: RailroadPoint[];
  routes: RailroadRoute[];
}

let cachedData: RailroadHistoryData | null = null;

export function getRailroadHistoryData(): RailroadHistoryData {
  if (cachedData) return cachedData;
  const raw = fs.readFileSync(RAILROAD_DATA_PATH, 'utf8');
  cachedData = JSON.parse(raw);
  return cachedData!;
}

export function getAllRailroadArticleSlugs(): string[] {
  const data = getRailroadHistoryData();
  return data.articles.map(a => a.slug);
}

export function getAllRailroadArticles(): RailroadArticleMeta[] {
  const data = getRailroadHistoryData();
  return data.articles;
}

export function getRailroadArticleMeta(slug: string): RailroadArticleMeta | null {
  const data = getRailroadHistoryData();
  return data.articles.find(a => a.slug === slug) || null;
}

export function getPointsForArticle(slug: string): RailroadPoint[] {
  const data = getRailroadHistoryData();
  return data.points.filter(p => p.articleSlug === slug);
}

export function getRoutesForArticle(slug: string): RailroadRoute[] {
  const data = getRailroadHistoryData();
  return data.routes.filter(r => r.articleSlug === slug);
}

export function getAllRailroadPoints(): RailroadPoint[] {
  const data = getRailroadHistoryData();
  return data.points;
}

export function getAllRailroadRoutes(): RailroadRoute[] {
  const data = getRailroadHistoryData();
  return data.routes;
}

function countWords(text: string): number {
  const stripped = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped ? stripped.split(' ').length : 0;
}

export async function getRailroadArticle(slug: string): Promise<RailroadArticle | null> {
  const meta = getRailroadArticleMeta(slug);
  if (!meta) return null;

  const filePath = path.join(RAILROAD_ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const rawContent = fs.readFileSync(filePath, 'utf8');
  const contentHtml = await markdownToHtml(rawContent);
  const wordCount = countWords(contentHtml);

  const points = getPointsForArticle(slug);
  const routes = getRoutesForArticle(slug);

  return {
    ...meta,
    contentHtml,
    wordCount,
    points,
    routes,
  };
}

export function getRelatedRailroadArticles(slug: string, limit = 3): RailroadArticleMeta[] {
  const data = getRailroadHistoryData();
  const current = data.articles.find(a => a.slug === slug);
  if (!current) return data.articles.slice(0, limit);

  const scored = data.articles
    .filter(a => a.slug !== slug)
    .map(a => {
      let score = 0;
      if (a.region === current.region) score += 2;
      if (a.color === current.color) score += 1;
      return { article: a, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.article);
}

export function getSubtypeLabel(subtype: string): string {
  const data = getRailroadHistoryData();
  return data.subtypeLabels[subtype] || subtype;
}

export function getStatusLabel(status: string): string {
  const data = getRailroadHistoryData();
  return data.statusLabels[status] || status;
}
