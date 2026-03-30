/**
 * Single source of truth for cleaning Montana historic marker text from HMDB exports.
 * Used by parse-historic-markers.js so all marker copy is normalized consistently.
 *
 * Does not rewrite historical wording — strips site metadata, fixes spacing, and
 * removes errant HMDB / photo-guide insertions.
 *
 * Narrative problems (orphan line breaks like a lone “Earl”, wrong kiosk headings,
 * ambiguous punctuation inside the marker body) must be judged **per marker** by an
 * agent and stored in `web/data/historic-marker-inscription-overrides.json`, not
 * solved with new bulk regex here. Use `web/scripts/audit-historic-marker-text.js`
 * to list likely candidates. Visual structure (Geo-Facts headings, bullet lists,
 * “Erected by” footer) is applied at render time in `web/lib/parseMarkerInscription.ts`
 * and `web/components/MarkerInscription.tsx`, not in this file.
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

/** Strip simple HTML tags (HMDB sometimes wraps titles in <i>). */
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
 * Drop HMDB / kiosk lines that are not part of the marker narrative.
 */
function filterInscriptionLines(lines) {
  let skippingPictureCaptions = false;
  /** Skip HMDB [photo captions] blocks until a long quoted journal line or Erected by */
  let skippingPhotoCaptionBlock = false;
  const out = [];

  for (const line of lines) {
    const raw = line;
    const t = line.trim();
    if (t === '') {
      out.push(raw);
      continue;
    }

    if (skippingPhotoCaptionBlock) {
      if (/^Erected by\b/i.test(t)) {
        skippingPhotoCaptionBlock = false;
        out.push(raw);
        continue;
      }
      if (/^[\u201c"]/.test(t) && t.length > 55) {
        skippingPhotoCaptionBlock = false;
        out.push(raw);
        continue;
      }
      continue;
    }

    if (/^other picture captions:/i.test(t) || /^picture captions:/i.test(t)) {
      skippingPictureCaptions = true;
      continue;
    }
    if (/^\[[\s]*photo captions[\s]*\]$/i.test(t)) {
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

    if (/^For more information:/i.test(t)) continue;
    if (/^For more information on viewing\b/i.test(t) && /\bcontact:/i.test(t)) continue;
    if (/website:\s*https?:/i.test(t) || /website:\s*http;/i.test(t)) continue;
    if (/^Phone\s+[\d\s\-()]+$/i.test(t)) continue;
    if (/\bChamber of Commerce\b/i.test(t) && /\(\d{3}\)/.test(t)) continue;
    if (/^\d+\s+.+,\s*.+MT\s+\d{5}/i.test(t)) continue;
    if (/^\(\d{3}\)\s*[\d\-]{7,}/.test(t)) continue;

    if (/^The marker is on\b/i.test(t)) continue;

    out.push(raw);
  }

  return out;
}

/**
 * Full inscription cleanup: HMDB tails, mid-insertions, then line filter, then spacing.
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

  let prevJoin;
  do {
    prevJoin = t;
    t = t.replace(/([a-z,;])\s*\n+\s*([a-z])/g, '$1 $2');
  } while (t !== prevJoin);

  t = t.replace(/\n(GeoFacts:|Geo-Activities:)\s*\n/g, '\n\n$1\n\n');

  t = t
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, ''));
  t = filterInscriptionLines(t).join('\n');

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
};
