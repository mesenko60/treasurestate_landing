import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { getTownList } from './towns';

export interface AEOData {
  keyFacts: Record<string, string>;
  faqs: { question: string; answer: string }[];
}

export interface TownData {
  contentHtml: string;
  excerpt: string;
  aeoData: AEOData;
  nearbyDestinations: string[]; // List of town names
}

export async function markdownToHtml(md: string, currentTownName?: string): Promise<string> {
  const sanitizedMd = md
    .split(/\r?\n/)
    .filter(line => !/^\s{0,3}##\s+.*data collection\s*$/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  
  const allTowns = getTownList();
  
  // Parse markdown to HTML
  const rawHtml = await marked.parse(sanitizedMd) as unknown as string;

  // Post-process HTML to auto-link all valid town mentions
  // We split by HTML tags to safely isolate text nodes
  const tokens = rawHtml.split(/(<[^>]*>)/g);
  let inAnchor = false;
  let inHeading = false;

  // Build a regex that matches any town name, sorted by length descending
  const sortedTowns = [...allTowns]
    .filter(t => !currentTownName || t.name.toLowerCase() !== currentTownName.toLowerCase())
    .sort((a, b) => b.name.length - a.name.length);
    
  if (sortedTowns.length === 0) return rawHtml;

  const escapedTowns = sortedTowns.map(t => t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Match town name, optionally followed by ", Montana"
  // Using case-sensitive 'g' instead of 'gi' to avoid linking generic lowercase words like "plains" or "circle"
  const regex = new RegExp(`\\b(${escapedTowns.join('|')})(?:, Montana)?\\b`, 'g');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.match(/^<a[\s>]/i)) {
      inAnchor = true;
    } else if (token.match(/^<\/a>/i)) {
      inAnchor = false;
    } else if (token.match(/^<h[1-6]/i)) {
      inHeading = true;
    } else if (token.match(/^<\/h[1-6]/i)) {
      inHeading = false;
    } else if (!token.startsWith('<') && !inAnchor && !inHeading) {
       tokens[i] = token.replace(regex, (match, townNameMatch) => {
         const matchTown = allTowns.find(t => t.name === townNameMatch);
         if (matchTown) {
           return `<a href="/montana-towns/${matchTown.slug}/">${match}</a>`;
         }
         return match;
       });
    }
  }
  
  let html = tokens.join('');
  
  // Add rel="sponsored noopener" and target="_blank" to affiliate links (Expedia, VRBO)
  html = html.replace(
    /<a href="(https:\/\/www\.expedia\.com[^"]*)">/g,
    '<a href="$1" rel="sponsored noopener" target="_blank">'
  );
  html = html.replace(
    /<a href="(https:\/\/vrbo\.com[^"]*)">/g,
    '<a href="$1" rel="sponsored noopener" target="_blank">'
  );
  html = html.replace(
    /<a href="(https:\/\/www\.vrbo\.com[^"]*)">/g,
    '<a href="$1" rel="sponsored noopener" target="_blank">'
  );
  
  return html;
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

function extractNearbyDestinations(md: string): string[] {
  const nearbyTowns: string[] = [];
  const tokens = marked.lexer(md);
  let inNearbySection = false;
  
  const allValidTowns = getTownList().map(t => t.name.toLowerCase());

  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = token.text.toLowerCase();
      if (text.includes('nearby') || text.includes('getting there')) {
        inNearbySection = true;
      } else {
        inNearbySection = false;
      }
    } else if (inNearbySection && token.type === 'list') {
      // Deep search for bold text in list items (which usually represent the nearby towns)
      const extractBold = (text: string) => {
        const matches = Array.from(text.matchAll(/\*\*(.*?)\*\*/g));
        for (const match of matches) {
          const possibleTown = match[1].replace(/, Montana/i, '').trim();
          // Verify it's a valid town in our directory
          if (allValidTowns.includes(possibleTown.toLowerCase())) {
            if (!nearbyTowns.includes(possibleTown)) {
              nearbyTowns.push(possibleTown);
            }
          }
        }
      };
      
      // Look at top level items
      for (const item of token.items) {
        extractBold(item.text);
        // Look at nested sublists (e.g. "Nearby Destinations: \n - **Glendive**")
        if (item.tokens) {
          for (const subToken of item.tokens) {
             if (subToken.type === 'list') {
               for (const subItem of subToken.items) {
                 extractBold(subItem.text);
               }
             }
          }
        }
      }
    }
  }
  
  return nearbyTowns;
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

/** Remove first ATX H1 line so the page hero can remain the only visible H1 (compare intros, etc.). */
export function stripLeadingMarkdownH1(md: string): string {
  return md.replace(/^\s*#\s[^\n]+\r?\n?/, '');
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
  
  const html = await markdownToHtml(parsed.content, townName);
  const excerpt = parsed.data?.description || parsed.excerpt || '';
  const aeoData = extractAEOData(parsed.content, townName);
  const nearbyDestinations = extractNearbyDestinations(parsed.content);

  return { contentHtml: html, excerpt, aeoData, nearbyDestinations };
}
