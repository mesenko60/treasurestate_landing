/**
 * Lodging pages: read markdown from lodging_pages/, parse metadata, render content.
 */
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { markdownToHtml } from './markdown';

const LODGING_DIR = path.resolve(process.cwd(), '..', 'lodging_pages');

export interface LodgingPage {
  slug: string;
  townName: string;
  title: string;
  contentHtml: string;
  excerpt: string;
}

export interface LodgingIndex {
  title: string;
  contentHtml: string;
}

/** Get all lodging slugs from .md files (excludes index and instructions) */
export function getLodgingSlugs(): string[] {
  if (!fs.existsSync(LODGING_DIR)) return [];
  return fs
    .readdirSync(LODGING_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''));
}

/** Extract town name from h1 "Where to Stay in Bozeman, Montana" -> "Bozeman" */
function extractTownNameFromH1(h1: string): string {
  const match = h1.match(/^#\s+Where to Stay in (.+?), Montana\s*$/);
  return match ? match[1].trim() : '';
}

/** Strip metadata blockquote and first --- from lodging markdown */
function stripLodgingMetadata(md: string): { content: string; title: string; townName: string } {
  const lines = md.split('\n');
  let i = 0;
  let title = '';
  let townName = '';

  // First non-empty line is usually the h1
  while (i < lines.length && !lines[i].trim()) i++;
  if (lines[i]?.startsWith('# ')) {
    title = lines[i].replace(/^#\s+/, '').trim();
    townName = extractTownNameFromH1(lines[i]);
    i++;
  }
  while (i < lines.length && !lines[i].trim()) i++;
  // Skip blockquote lines
  while (i < lines.length && lines[i].trim().startsWith('>')) i++;
  while (i < lines.length && !lines[i].trim()) i++;
  if (lines[i]?.trim() === '---') i++;
  while (i < lines.length && !lines[i].trim()) i++;

  return { content: lines.slice(i).join('\n').trim(), title, townName };
}

/** Extract first paragraph as excerpt (plain text, ~160 chars) */
function extractExcerpt(content: string): string {
  const para = content.split(/\n\n+/)[0] || '';
  const plain = para.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim();
  return plain.length > 160 ? plain.slice(0, 157) + '...' : plain;
}

/** Read and parse a town lodging page */
export async function readLodgingPage(slug: string): Promise<LodgingPage | null> {
  const filePath = path.join(LODGING_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, title, townName } = stripLodgingMetadata(raw);
  const contentHtml = await markdownToHtml(content, townName || undefined);
  const excerpt = extractExcerpt(content);

  return {
    slug,
    townName: townName || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    title,
    contentHtml,
    excerpt,
  };
}

/** Read and parse the lodging index page */
export async function readLodgingIndex(): Promise<LodgingIndex | null> {
  const filePath = path.join(LODGING_DIR, 'index.md');
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, title } = stripLodgingMetadata(raw);
  const contentHtml = await markdownToHtml(content);

  return {
    title: title || 'Where to Stay in Montana — Lodging Guide by Town',
    contentHtml,
  };
}
