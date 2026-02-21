import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface AEOData {
  keyFacts: Record<string, string>;
  faqs: { question: string; answer: string }[];
}

export interface TownData {
  contentHtml: string;
  excerpt: string;
  aeoData: AEOData;
}

export async function markdownToHtml(md: string): Promise<string> {
  const sanitizedMd = md
    .split(/\r?\n/)
    .filter(line => !/^\s{0,3}##\s+.*data collection\s*$/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return await marked.parse(sanitizedMd) as unknown as string;
}

export function extractAEOData(md: string, townName: string): AEOData {
  const aeoData: AEOData = {
    keyFacts: {},
    faqs: []
  };

  const tokens = marked.lexer(md);
  
  let currentSection = '';
  let currentSectionText = '';

  for (const token of tokens) {
    if (token.type === 'heading') {
      if (currentSection && currentSectionText.trim()) {
        if (!currentSection.toLowerCase().includes('quick facts') && !currentSection.toLowerCase().includes('data collection')) {
           aeoData.faqs.push({
             question: generateQuestion(currentSection, townName),
             answer: stripMarkdownAndSources(currentSectionText)
           });
        }
      }
      currentSection = token.text;
      currentSectionText = '';
    } else if (token.type === 'list' && currentSection.toLowerCase().includes('quick facts')) {
      for (const item of token.items) {
        const text = item.text;
        const match = text.match(/\*\*(.*?):\*\*\s*(.*)/);
        if (match) {
          aeoData.keyFacts[match[1].trim()] = match[2].trim().replace(/\(Source:.*?\)/gi, '').trim();
        }
      }
    } else if (currentSection && !currentSection.toLowerCase().includes('quick facts')) {
      // Keep plain text for answers
      if (token.type === 'paragraph' || token.type === 'list') {
         currentSectionText += token.raw + '\n';
      }
    }
  }

  if (currentSection && currentSectionText.trim() && !currentSection.toLowerCase().includes('quick facts') && !currentSection.toLowerCase().includes('data collection')) {
     aeoData.faqs.push({
       question: generateQuestion(currentSection, townName),
       answer: stripMarkdownAndSources(currentSectionText)
     });
  }

  return aeoData;
}

function generateQuestion(sectionTitle: string, townName: string): string {
  const lower = sectionTitle.toLowerCase();
  if (lower.includes('things to do') || lower.includes('activities')) {
    return `What are the top things to do in ${townName}?`;
  }
  if (lower.includes('history')) {
    return `What is the history of ${townName}?`;
  }
  if (lower.includes('where to stay') || lower.includes('lodging')) {
    return `Where are the best places to stay in ${townName}?`;
  }
  if (lower.includes('getting there') || lower.includes('destinations')) {
    return `How do I get to ${townName} and what is nearby?`;
  }
  if (lower.includes('people')) {
    return `Who are some notable people from ${townName}?`;
  }
  return `Tell me about ${sectionTitle.toLowerCase()} in ${townName}.`;
}

function stripMarkdownAndSources(text: string): string {
  // Very basic markdown stripping for schema.org text
  return text
    .replace(/\(Source:.*?\)/gi, '') // Remove sources
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/^[-*]\s+/gm, '') // Remove list bullets
    .replace(/\n+/g, ' ') // Collapse newlines
    .trim();
}

export async function readTownMarkdownByTownName(townName: string): Promise<TownData | null> {
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
  const aeoData = extractAEOData(parsed.content, townName);

  return { contentHtml: html, excerpt, aeoData };
}
