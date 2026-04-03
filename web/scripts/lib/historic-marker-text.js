/**
 * Single source of truth for cleaning Montana historic marker text from source CSV exports.
 * Used by parse-historic-markers.js so all marker copy is normalized consistently.
 *
 * Does not rewrite historical wording — strips site metadata, fixes spacing, and
 * removes errant site-metadata / photo-guide insertions.
 *
 * Odd **line breaks** (CSV hard wraps, title-plaque stacks, split names) are
 * normalized in `normalizeInscriptionParagraphLineBreaks()` — wording is unchanged,
 * only whitespace between tokens. Truly ambiguous copy errors still belong in
 * `historic-marker-inscription-overrides.json` (agent-reviewed). Run
 * `web/scripts/audit-historic-marker-text.js` to spot stragglers. Visual structure
 * (Geo-Facts headings, bullets, “Erected by”) is applied at render time in
 * `web/lib/parseMarkerInscription.ts` and `web/components/MarkerInscription.tsx`.
 *
 * polishMarkerInscription() applies high-confidence typo and punctuation fixes
 * (duplicate words, known CSV glitches). Intentional archaic spellings inside
 * old quotations are largely preserved; only unambiguous mechanical errors are changed.
 */

'use strict';

/** Decode common HTML entities (numeric + a few named). */
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#(\d+);/g, (_, n) => {
      const code = parseInt(n, 10);
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return _;
      return String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return _;
      return String.fromCodePoint(code);
    })
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Strip simple HTML tags (some source exports wrap titles in <i>). */
function stripHtmlTags(text) {
  if (!text) return '';
  return text.replace(/<\/?[a-z][a-z0-9]*(?:\s[^>]*)?>\s*/gi, '');
}

/** Normalize unicode spaces and line endings (shared baseline). */
function normalizeTextBasics(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\ufeff/g, '');
}

/**
 * Display title / subtitle / short labels: entities, strip tags, collapse spaces.
 */
function cleanMarkerTitle(text) {
  if (!text) return '';
  let t = decodeHtmlEntities(text);
  t = stripHtmlTags(t);
  t = t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}

/** Erected-by and similar short CSV fields. */
function cleanMarkerShortField(text) {
  if (!text) return '';
  let t = normalizeTextBasics(text);
  t = stripHtmlTags(decodeHtmlEntities(t));
  t = t.replace(/\s+/g, ' ').trim();
  t = polishShortAttribution(t);
  return t;
}

/** Typos in attribution / sponsor lines (not inscription body). */
function polishShortAttribution(t) {
  if (!t) return '';
  return t
    .replace(/\bGalsgow\b/g, 'Glasgow')
    .replace(/\bArmy\s+Corp\s+of\s+Engineers\b/gi, 'Army Corps of Engineers')
    .replace(/\bCorp\.?\s+of\s+Discovery\b/g, 'Corps of Discovery');
}

/**
 * Drop kiosk / site-metadata lines that are not part of the marker narrative.
 */
function filterInscriptionLines(lines) {
  let skippingPictureCaptions = false;
  /** Skip [photo captions] blocks until a long quoted journal line or Erected by */
  let skippingPhotoCaptionBlock = false;
  const out = [];

  for (const line of lines) {
    const raw = line;
    let t = line.trim();
    if (t === '') {
      out.push(raw);
      continue;
    }

    t = t.replace(/^\[\s*caption\s*\d*\s*\]\s*/i, '').trim();
    t = t.replace(/^\[\s*background\s+image\s+caption\s*\]\s*/i, '').trim();
    if (t === '') continue;

    if (skippingPhotoCaptionBlock) {
      if (/^Erected by\b/i.test(t)) {
        skippingPhotoCaptionBlock = false;
        out.push(t);
        continue;
      }
      if (/^[\u201c"]/.test(t) && t.length > 55) {
        skippingPhotoCaptionBlock = false;
        out.push(t);
        continue;
      }
      continue;
    }

    if (/^other picture captions:/i.test(t) || /^picture captions:/i.test(t)) {
      skippingPictureCaptions = true;
      continue;
    }
    if (
      /^\[[\s]*photo captions[\s]*\]$/i.test(t) ||
      /^\(\s*Photo\s+caption\s*:?\s*\)\s*$/i.test(t)
    ) {
      skippingPhotoCaptionBlock = true;
      continue;
    }
    if (skippingPictureCaptions) {
      if (/^[•\-\*●]\s?/.test(t)) continue;
      skippingPictureCaptions = false;
    }

    if (/^\d+\.\s/.test(t) && (/\bpanel\b/i.test(t) || /\bpane\b/i.test(t))) continue;

    if (/^(Captions?|\[Captions:\])\s*:?/i.test(t)) continue;
    if (/^\[[\s]*Captions?:[\s]*\]$/i.test(t)) continue;
    if (/^marker background picture caption:/i.test(t)) continue;
    if (/^Marker photo caption:/i.test(t)) continue;
    if (/^\[Photo caption:\]/i.test(t)) continue;

    if (/^\(\s*Background\s+photograph\s*:?\s*\)\s*$/i.test(t)) continue;
    if (/^\[\s*Background\s+photograph\s*:?\s*\]\s*$/i.test(t)) continue;
    if (/^Background\s+photograph\s*:?\s*$/i.test(t)) continue;
    if (/^Background\s+photo\s+caption\b/i.test(t)) continue;
    if (/^Inset\s+photo\s+caption\b/i.test(t)) continue;

    if (
      /^\([^)]*\b[Cc]aption[s]?\b[^)]*\)\s*$/i.test(t) &&
      t.length <= 240
    ) {
      continue;
    }

    if (
      /^\(\s*photo\s+on\s+(the\s+)?(left|right|center|centre|top|bottom)\s*\)\s*$/i.test(
        t,
      )
    ) {
      continue;
    }

    if (/^photo captions\b/i.test(t)) continue;
    if (/^Photo Captions\b/i.test(t)) continue;

    if (/^For more information:/i.test(t)) continue;
    if (/^For more information on viewing\b/i.test(t) && /\bcontact:/i.test(t)) continue;
    if (/website:\s*https?:/i.test(t) || /website:\s*http;/i.test(t)) continue;
    if (/^Phone\s+[\d\s\-()]+$/i.test(t)) continue;
    if (/\bChamber of Commerce\b/i.test(t) && /\(\d{3}\)/.test(t)) continue;
    if (/^\d+\s+.+,\s*.+MT\s+\d{5}/i.test(t)) continue;
    if (/^\(\d{3}\)\s*[\d\-]{7,}/.test(t)) continue;

    if (/^The marker is on\b/i.test(t)) continue;

    out.push(t);
  }

  return out;
}

const TITLE_SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'to', 'with',
  'the', 'from', 'into', 'upon',
]);

/**
 * Latin-style binomial (e.g. "Amelanchier alnifolia") — do not merge a lone
 * common-name line into this line (keeps plant labels readable).
 */
function looksLikeBinomialLine(line) {
  const t = line.trim();
  const parts = t.split(/\s+/);
  if (parts.length !== 2) return false;
  if (!/^[A-Z][a-z]+$/.test(parts[0])) return false;
  if (!/^[a-z][a-z.]+$/.test(parts[1])) return false;
  return true;
}

const PLAQUE_MID_WORDS = /^(Historical|National|Natural|Federal|Cooperation|Register)$/i;
const PLAQUE_TAIL_WORDS = /^(Society|Interior|District|Places|States|Terminus|Foundation)$/i;

/** One-word lines before a name or unit (casualty rolls, etc.). */
const ROLE_OR_UNIT_LINE =
  /^(Musician|Artificer|Corporal|Sergeant|Sergt\.?|Captain|Private|Killed|Dr\.|Lt\.?|Lieut\.?)$/i;

function isTitleCasePlaqueLine(line) {
  const t = line.trim();
  if (t.length === 0) return false;
  const maxLen = /\s/.test(t) ? 240 : 52;
  if (t.length > maxLen) return false;
  if (/[,']/.test(t) || /[.!?]$/.test(t)) return false;
  if (/^Geo[\s-]?(Facts|Activity|Activities)\s*:/i.test(t)) return false;
  if (/^Erected by\b/i.test(t) || /^[•\-\*●]/.test(t)) return false;
  const words = t.split(/\s+/);
  return words.every((w) => {
    const lw = w.toLowerCase();
    if (TITLE_SMALL_WORDS.has(lw)) return true;
    if (/^\d+(st|nd|rd|th)?$/i.test(w)) return true;
    return /^[A-Z][a-zA-Z'-]*$/.test(w) || /^[A-Z]{2,3}$/.test(w);
  });
}

function isSingleTitleCaseWord(line) {
  const s = line.trim();
  return /^[A-Z][a-z]{2,}$/.test(s) && !/\s/.test(s);
}

/**
 * Join spurious hard line breaks inside paragraph blocks (between blank lines).
 * Preserves every word and punctuation character; only inserts spaces where lines
 * were incorrectly split in the source export.
 */
function normalizeInscriptionParagraphLineBreaks(t) {
  if (!t || !t.trim()) return t;

  const blocks = t.split(/\n\n+/);
  const merged = blocks.map((block) => {
    const raw = block.split('\n').map((l) =>
      l.replace(/^[ \t]+/g, '').replace(/[ \t]+$/g, ''),
    );
    const lines = [];
    for (const line of raw) {
      if (line === '' && lines.length && lines[lines.length - 1] !== '') {
        continue;
      }
      if (line === '') continue;
      lines.push(line);
    }

    const out = [];
    let i = 0;
    while (i < lines.length) {
      let acc = lines[i];
      i += 1;
      while (i < lines.length && shouldJoinInscriptionLines(acc, lines[i])) {
        acc = `${acc} ${lines[i]}`;
        i += 1;
      }
      out.push(acc);
    }
    return out.join('\n\n');
  });

  return merged.join('\n\n');
}

function shouldJoinInscriptionLines(prev, next) {
  if (!next || !prev) return false;
  if (/^[•\-\*●]/.test(next)) return false;
  if (/^Erected by\b/i.test(next)) return false;

  const pt = prev.trim();
  const nt = next.trim();

  if (/^Geo[\s-]?(Facts|Activity|Activities)\s*:/i.test(nt)) return false;
  if (/^Geo[\s-]?(Facts|Activity|Activities)\s*:/i.test(pt)) return false;
  if (/:$/.test(pt)) return false;
  if (/^\([^)]+\)$/.test(pt) && pt.length < 140) return false;

  if (/-$/.test(pt) && /^[a-z]/i.test(nt)) return true;

  if (/[,;]\s*$/.test(pt) && /^[a-z0-9('"(\u201c]/.test(nt)) return true;

  if (!/[.!?]\s*$/.test(pt) && /^[a-z0-9('"(\u201c]/.test(nt)) return true;

  if (!/[.!?]\s*$/.test(pt) && /^(Who|Which|Where|When|As)\s+/i.test(nt)) return true;

  if (!/[.!?]\s*$/.test(pt) && /^And\s+[A-Z][a-z]+/.test(nt)) return true;

  if (!/[.!?]\s*$/.test(pt) && /^In(\s+[a-z]|\s+\d)/i.test(nt)) return true;

  if (
    !/[.!?]\s*$/.test(pt) &&
    /\b(at|near|from|in)\s*$/i.test(pt) &&
    /^[A-Z][a-z]{1,22}(\s+[A-Z][a-z]{1,22})?$/.test(nt) &&
    nt.length < 44
  ) {
    return true;
  }

  if (/^(To|And|But|In|Of|By|On|At)$/i.test(pt) && /^[A-Z\d]/.test(nt)) return true;

  if (
    ROLE_OR_UNIT_LINE.test(pt) &&
    (/^\d/.test(nt) || /^[A-Z][a-z]{2,}\s+[A-Z]/.test(nt))
  ) {
    return true;
  }

  if (
    /^[A-Z][a-z]{1,4}$/.test(pt) &&
    pt.length <= 5 &&
    !looksLikeBinomialLine(nt) &&
    !/^(And|Or|But)\s+/i.test(nt) &&
    (/^[A-Z][a-z]+\s+\S/.test(nt) || /^\d/.test(nt))
  ) {
    return true;
  }

  if (isTitleCasePlaqueLine(pt) && isTitleCasePlaqueLine(nt)) {
    if (
      isSingleTitleCaseWord(pt) &&
      isSingleTitleCaseWord(nt) &&
      pt.trim().length >= 5 &&
      nt.trim().length >= 5
    ) {
      const ns = nt.trim();
      const ps = pt.trim();
      if (
        PLAQUE_MID_WORDS.test(ns) ||
        PLAQUE_TAIL_WORDS.test(ns) ||
        /^(The|A|An)$/i.test(ps)
      ) {
        return true;
      }
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Full inscription cleanup: metadata tails, mid-insertions, then line filter, then spacing.
 */
function cleanMarkerInscription(text) {
  if (!text) return '';

  let t = normalizeTextBasics(text);

  t = t.replace(/\n?\s*Paid Advertisement\s*\n?/gi, '\n');
  t = t.replace(/\nPhotographed by[^\n]+/gi, '');
  t = t.replace(/\n\d+\.\s*[^\n]*\bMarker\b[^\n]*/gi, '');

  t = t.replace(/\s*Topics and series\.?[\s\S]*$/im, '');

  t = t.replace(/\s*This historical marker is listed in these topic\s*\n*\s*lists?:[\s\S]*$/im, '');
  t = t.replace(/\s*This historical marker is listed in this topic\s*\n*\s*list:[\s\S]*$/im, '');
  t = t.replace(/\s*Location\.[\s\S]*$/im, '');
  t = t.replace(/\s*Touch for map\.[\s\S]*$/im, '');
  t = t.replace(/\s*Other nearby markers\.[\s\S]*$/im, '');
  t = t.replace(/\s*More about this marker\.[\s\S]*$/im, '');
  t = t.replace(/\s*Additional keywords\.[\s\S]*$/im, '');

  t = t.replace(/Paid Advertisement/gi, '');

  t = t.replace(/\nMarker at the [^\n]*\s*/gi, '\n');
  t = t.replace(/\nThe marker is on the [^\n]+\n?/gi, '\n');

  t = t.replace(/Topics\.\s*$/gm, '');
  t = t.replace(/^\s*Topics and series\.?\s*$/gim, '');
  t = t.replace(/This historical marker is listed in these topic lists:.*$/gm, '');
  t = t.replace(/This historical marker is listed in this topic list:.*$/gm, '');
  t = t.replace(/Location\.\s*Marker (is|was) located.*$/gm, '');
  t = t.replace(/Touch for map\..*$/gm, '');

  t = stripHtmlTags(decodeHtmlEntities(t));

  t = t.replace(/\n\(\s*Background\s+photograph\s*:?\s*\)\s*\n/gi, '\n');
  t = t.replace(/\(\s*Caption[^)]*\)\s*/gi, '');

  let prevJoin;
  do {
    prevJoin = t;
    t = t.replace(/([a-z,;])\s*\n+\s*([a-z])/g, '$1 $2');
  } while (t !== prevJoin);

  t = t.replace(
    /\n(GeoFacts:|Geo-Facts:|Geo-Activity:|Geo-Activities:)\s*\n/gi,
    '\n\n$1\n\n',
  );

  t = t
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''));
  t = filterInscriptionLines(t).join('\n');

  t = normalizeInscriptionParagraphLineBreaks(t);

  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();

  t = polishMarkerInscription(t);

  return t;
}

/**
 * High-confidence spelling/punctuation fixes after structural cleaning.
 * Order: specific phrases first, then duplicate-word collapse.
 */
function polishMarkerInscription(t) {
  if (!t) return '';

  let s = t;

  const pairs = [
    [/incorrect;\s*u\s+been/gi, 'incorrectly been'],
    [/\bcoal\s+coal\b/gi, 'coal'],
    [/\ban\s+some\b/gi, 'and some'],
    [/\bwent\s+went\b/gi, 'went'],
    [/\bfirst\s+sed\s+the\b/gi, 'first used the'],
    [/\bcompass\s+brings\b/gi, 'compass bearings'],
    [/\bfo\s+form\b/gi, 'to form'],
    [/\bA\s+a\s+result\b/g, 'As a result'],
    [/\bto\s+to\s+Chief\b/g, 'to Chief'],
    [/\bin\s+in\s+the\b/gi, 'in the'],
    [/\bhttp;\/\//g, 'http://'],
    [/\bCorp\.?\s+of\s+Discovery\b/g, 'Corps of Discovery'],
    [/\bArmy\s+Corp\s+of\s+Engineers\b/gi, 'Army Corps of Engineers'],
    [/\bGalsgow\b/g, 'Glasgow'],
    [/\b(\d[\d,]*)\s+mils\b/gi, '$1 miles'],
    [/This stream,{2,}\s+/g, 'This stream... '],
    [/\bhas it origins\b/gi, 'has its origins'],
  ];

  for (const [re, rep] of pairs) {
    s = s.replace(re, rep);
  }

  s = s.replace(/\bthat\s+that\b(?! (nation|might)\b)/gi, 'that');
  s = s.replace(/\b(the|of|to|and)\s+\1\b/gi, '$1');

  s = s
    .split('\n')
    .map((line) => line.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+$/g, ''))
    .join('\n');

  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

module.exports = {
  decodeHtmlEntities,
  stripHtmlTags,
  cleanMarkerTitle,
  cleanMarkerShortField,
  cleanMarkerInscription,
  polishMarkerInscription,
  normalizeInscriptionParagraphLineBreaks,
  shouldJoinInscriptionLines,
};
