/**
 * Lodging pages: read markdown from lodging_pages/, parse metadata, render content.
 */
import fs from 'fs';
import path from 'path';
import { markdownToHtml } from './markdown';
import type { LodgingAccommodation } from './lodging-schema';

const LODGING_DIR = path.resolve(process.cwd(), '..', 'lodging_pages');

export interface LodgingPage {
  slug: string;
  townName: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  accommodations: LodgingAccommodation[];
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

/** Extract accommodations from lodging markdown (Quick Comparison table + **Name** sections) */
function extractAccommodations(content: string): LodgingAccommodation[] {
  const acc: LodgingAccommodation[] = [];
  const seen = new Set<string>();

  // Parse table rows: | [Name](url) | Type | Location | Best For | Price |
  const tableStart = content.indexOf('| Property ');
  if (tableStart >= 0) {
    const tableBlock = content.slice(tableStart);
    const rows = tableBlock.split('\n').filter((r) => r.trim().startsWith('|'));
    let skip = 0;
    for (const row of rows) {
      const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length < 5) continue;
      if (cells[0].toLowerCase() === 'property' || /^[-:|\s]+$/.test(cells[0])) {
        skip++;
        continue;
      }
      const propCell = cells[0];
      const linkMatch = propCell.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
      const name = linkMatch ? linkMatch[1] : propCell.replace(/\*\*/g, '').trim();
      const url = linkMatch ? linkMatch[2] : null;
      const type = cells[1] || '';
      const location = cells[2] || '';
      const priceRange = cells[4] || '';
      const key = name.toLowerCase().replace(/\s+/g, '-');
      if (name && !seen.has(key)) {
        seen.add(key);
        acc.push({ name, type, location, priceRange, url });
      }
    }
  }

  // Parse **Name** is located/situated in... (B&Bs, etc.)
  const boldRegex = /\*\*([^*]+)\*\*\s+is\s+(?:located in|situated in)\s+([^.]+)/gi;
  let m;
  while ((m = boldRegex.exec(content)) !== null) {
    const name = m[1].trim();
    const location = m[2].trim();
    const key = name.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(key)) {
      seen.add(key);
      acc.push({ name, type: 'BedAndBreakfast', location, priceRange: '', url: null });
    }
  }

  return acc;
}

/** Read and parse a town lodging page */
export async function readLodgingPage(slug: string): Promise<LodgingPage | null> {
  const filePath = path.join(LODGING_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, title, townName } = stripLodgingMetadata(raw);
  const contentHtml = await markdownToHtml(content, townName || undefined);
  const excerpt = extractExcerpt(content);
  const accommodations = extractAccommodations(content);

  return {
    slug,
    townName: townName || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    title,
    contentHtml,
    excerpt,
    accommodations,
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
