import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function markdownToHtml(md: string): Promise<string> {
  // Remove any H2 headings that contain "Data Collection" to prevent secondary heads from rendering.
  // Example to remove: "## Missoula, Montana Data Collection"
  const sanitizedMd = md
    .split(/\r?\n/)
    .filter(line => !/^\s{0,3}##\s+.*data collection\s*$/i.test(line))
    .join('\n')
    // collapse excessive blank lines introduced by removals
    .replace(/\n{3,}/g, '\n\n');
  // marked.parse may return string | Promise<string>; await normalizes to string
  return await marked.parse(sanitizedMd) as unknown as string;
}

export async function readTownMarkdownByTownName(townName: string): Promise<{ contentHtml: string; excerpt?: string } | null> {
  const baseDir = path.resolve(process.cwd(), '..', 'cities_towns_content');
  if (!fs.existsSync(baseDir)) return null;
  const files = fs.readdirSync(baseDir);
  const prefix = `${townName}, Montana`;
  const file = files.find(f => f.toLowerCase().startsWith(prefix.toLowerCase()) && f.toLowerCase().endsWith('.md'));
  if (!file) return null;
  const full = path.join(baseDir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const parsed = matter(raw);
  const html = await markdownToHtml(parsed.content);
  const excerpt = parsed.data?.description || parsed.excerpt || '';
  return { contentHtml: html, excerpt };
}
