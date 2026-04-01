/**
 * Parse plain-text historic marker inscriptions into blocks for semantic HTML.
 * Content stays as authored (CSV + agent overrides); this only shapes presentation.
 */

export type InscriptionBlock =
  | { type: 'heading'; label: string }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'attribution'; text: string };

/** Geo-Facts / Geo-Activity kiosk labels (with common variants). */
const GEO_HEADING =
  /^(Geo[\s-]?(?:Facts|Activity|Activities))\s*:\s*(.*)$/i;

const LIST_ITEM = /^[•\-\*●]\s*(.+)$/;
const ERECTED = /^Erected by\b/i;
const PANEL_LINE = /^\([^)]+\)\s*$/;

export function parseMarkerInscription(text: string): InscriptionBlock[] {
  if (!text || !text.trim()) return [];

  const lines = text.split('\n');
  const blocks: InscriptionBlock[] = [];
  let para: string[] = [];
  let list: string[] | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'paragraph', lines: [...para] });
      para = [];
    }
  };

  const flushList = () => {
    if (list?.length) {
      blocks.push({ type: 'list', items: [...list] });
    }
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();

    if (!t) {
      flushList();
      flushPara();
      continue;
    }

    if (ERECTED.test(t)) {
      flushList();
      flushPara();
      const parts = [t];
      while (i + 1 < lines.length && lines[i + 1].trim()) {
        i++;
        parts.push(lines[i].trim());
      }
      blocks.push({ type: 'attribution', text: parts.join(' ') });
      continue;
    }

    const geo = t.match(GEO_HEADING);
    if (geo) {
      flushList();
      flushPara();
      const labelRaw = geo[1].trim();
      const label = labelRaw.endsWith(':') ? labelRaw : `${labelRaw}:`;
      blocks.push({ type: 'heading', label });
      if (geo[2]?.trim()) {
        para.push(geo[2].trim());
      }
      continue;
    }

    if (
      PANEL_LINE.test(t) &&
      t.length < 240 &&
      !/^\(sic\)$/i.test(t) &&
      !/background\s+photograph/i.test(t) &&
      !/^\(\s*Photo\s+caption/i.test(t) &&
      !/\b[Cc]aption[s]?\b/i.test(t)
    ) {
      flushList();
      flushPara();
      blocks.push({ type: 'heading', label: t });
      continue;
    }

    const li = t.match(LIST_ITEM);
    if (li) {
      flushPara();
      if (!list) list = [];
      list.push(li[1].trim());
      continue;
    }

    flushList();
    para.push(t);
  }

  flushList();
  flushPara();
  return blocks;
}
