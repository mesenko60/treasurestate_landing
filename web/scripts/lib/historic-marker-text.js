/**
 * Single source of truth for cleaning Montana historic marker text from HMDB exports.
 * Used by parse-historic-markers.js so all marker copy is normalized consistently.
 *
 * Does not rewrite historical wording — strips site metadata, fixes spacing, and
 * removes errant HMDB / photo-guide insertions.
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
  return t;
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
  t = t.replace(/\nThe marker is on the (left|right)\.?\s*\n?/gi, '\n');

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

  return t;
}

module.exports = {
  decodeHtmlEntities,
  stripHtmlTags,
  cleanMarkerTitle,
  cleanMarkerShortField,
  cleanMarkerInscription,
};
