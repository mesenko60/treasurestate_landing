import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function markdownToHtml(md: string): Promise<string> {
  // marked.parse may return string | Promise<string>; await normalizes to string
  return await marked.parse(md) as unknown as string;
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
