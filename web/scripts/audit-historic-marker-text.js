#!/usr/bin/env node
/**
 * List historic markers whose inscriptions still look like they need agent review
 * (orphan words, leftover metadata cruft, kiosk heading typos). Output is JSON for triage — do not
 * auto-apply fixes. After review, add entries to historic-marker-inscription-overrides.json
 * and re-run parse-historic-markers.js.
 *
 * Usage: node web/scripts/audit-historic-marker-text.js
 *        node web/scripts/audit-historic-marker-text.js --min-issues 1
 *        node web/scripts/audit-historic-marker-text.js --layout-artifacts
 *
 * --layout-artifacts writes web/data/historic-marker-layout-audit.json and
 * historic-marker-layout-ids-to-fix.json
 * listing marker IDs whose inscriptions match high-confidence kiosk/layout tokens — for
 * agent review only; do not auto-apply from this file.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/historic-markers.json');
const CURATED_PATH = path.join(__dirname, '../data/historic-markers-curated.json');
const LAYOUT_AUDIT_OUT = path.join(__dirname, '../data/historic-marker-layout-audit.json');
const IDS_TO_FIX_OUT = path.join(__dirname, '../data/historic-marker-layout-ids-to-fix.json');

/** High-confidence layout / HMdb kiosk phrasing — audit flags only (not auto-stripped). */
const LAYOUT_ARTIFACT_CHECKS = [
  { code: 'paren_side_bar', test: (s) => /\([^)]*side[\s-]*bar/i.test(s) },
  { code: 'bracket_sidebar', test: (s) => /\[[^\]]*sidebar[^\]]*\]/i.test(s) },
  { code: 'three_panels_marker', test: (s) => /three\s+panels\s+make\s+up\s+this\s+marker/i.test(s) },
  { code: 'across_the_bottom', test: (s) => /\bacross\s+the\s+bottom\b/i.test(s) },
  { code: 'illustrated_map', test: (s) => /\billustrated\s+map\b/i.test(s) },
  { code: 'arrow_pointing_to', test: (s) => /\(\s*arrow\s+pointing\s+to\s*:/i.test(s) },
  { code: 'paren_panel_kiosk', test: (s) => /\([^)]*\b(?:three\s+)?panels?\s+make\s+up\b[^)]*\)/i.test(s) },
  { code: 'compass_clockwise', test: (s) => /\bcompass\s+points\s+clockwise\b/i.test(s) },
  {
    code: 'paren_inset',
    test: (s) =>
      s.split('\n').some((ln) => /^\([^)]*\binset\b[^)]*\)\s*$/i.test(ln.trim())),
  },
  { code: 'photo_caption_paren', test: (s) => /\(\s*Photo\s+caption\s*:?\s*\)/i.test(s) },
];

function auditLayoutArtifacts(text) {
  const issues = [];
  if (!text || !text.trim()) return issues;
  for (const { code, test } of LAYOUT_ARTIFACT_CHECKS) {
    if (test(text)) issues.push(code);
  }
  const lines = text.split('\n');
  if (lines.some((ln) => /^\(?\s*sidebar\s*:?\s*\)?\s*$/i.test(ln.trim()))) {
    issues.push('sidebar_standalone_line');
  }
  if (lines.some((ln) => /^sidebar\s*:?\s*$/i.test(ln.trim()))) {
    issues.push('sidebar_word_line');
  }
  return [...new Set(issues)];
}

function excerptInscription(text, maxLen = 220) {
  const one = (text || '').replace(/\s+/g, ' ').trim();
  if (one.length <= maxLen) return one;
  return `${one.slice(0, maxLen)}…`;
}

function looksLikeBinomialLine(line) {
  const t = line.trim();
  const parts = t.split(/\s+/);
  if (parts.length !== 2) return false;
  if (!/^[A-Z][a-z]+$/.test(parts[0])) return false;
  if (!/^[a-z][a-z.]+$/.test(parts[1])) return false;
  return true;
}

function auditInscription(text) {
  const issues = [];
  if (!text || !text.trim()) return issues;

  if (/Geo-Actiivity|Actiivity/i.test(text)) issues.push('typo_Geo-Activity_heading');
  if (/\(\s*Background\s+photograph\s*:?\s*\)/i.test(text)) {
    issues.push('background_photograph_label');
  }
  if (/(^|\n)Background\s+photo\s+caption\b/i.test(text)) {
    issues.push('background_photo_caption_line');
  }
  if (/(^|\n)Inset\s+photo\s+caption\b/i.test(text)) {
    issues.push('inset_photo_caption_line');
  }
  if (/\(\s*Photo\s+caption\s*:?\s*\)/i.test(text)) {
    issues.push('photo_caption_block');
  }
  if (/\n\([^)]*\b[Cc]aption[s]?\b[^)]*\)\s*\n/.test(text)) {
    issues.push('caption_parenthetical_line');
  }
  if (/\[\s*caption\s*\d*\s*\]/i.test(text)) {
    issues.push('bracket_caption_prefix');
  }
  if (/\(\s*photo\s+on\s+(the\s+)?(left|right)\s*\)/i.test(text)) {
    issues.push('photo_on_left_right');
  }
  if (/\nPhotographed by\b/i.test(text)) issues.push('photographed_by_line');
  if (/Topics and series/i.test(text)) issues.push('topics_and_series_tail');
  if (/\n\d+\.\s+.+\bMarker on\b/i.test(text)) issues.push('numbered_marker_photo_caption');

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    const words = t.split(/\s+/);
    if (words.length !== 1) continue;
    if (!/^[A-Z][a-z]{1,14}$/.test(t)) continue;
    const prev = (lines[i - 1] || '').trim();
    const next = (lines[i + 1] || '').trim();
    if (!next || !/^[A-Z]/.test(next)) continue;
    if (looksLikeBinomialLine(next)) continue;
    if (/:$/.test(prev)) continue;
    if (/^(Geo|Topics|Erected)/i.test(next)) continue;
    issues.push(`possible_orphan_line:${t}`);
  }

  return issues;
}

function runLayoutArtifactsAudit() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const markers = JSON.parse(raw);

  let curatedSlugs = new Set();
  if (fs.existsSync(CURATED_PATH)) {
    const curated = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
    curatedSlugs = new Set(
      (Array.isArray(curated) ? curated : []).map((m) => m.slug).filter(Boolean),
    );
  }

  const detail = [];
  for (const m of markers) {
    const issues = auditLayoutArtifacts(m.inscription || '');
    if (issues.length === 0) continue;
    const curated = curatedSlugs.has(m.slug);
    detail.push({
      id: m.id,
      slug: m.slug,
      title: m.title,
      curated,
      issues,
      excerpt: excerptInscription(m.inscription || ''),
    });
  }

  detail.sort((a, b) => Number(b.curated) - Number(a.curated) || b.issues.length - a.issues.length);

  const ids = detail.map((d) => d.id);
  const idsCurated = detail.filter((d) => d.curated).map((d) => d.id);

  const payload = {
    generatedAt: new Date().toISOString(),
    description:
      'Markers whose inscription matches layout/kiosk token patterns. For agent/human triage only.',
    patternCodes: LAYOUT_ARTIFACT_CHECKS.map((c) => c.code).concat([
      'sidebar_standalone_line',
      'sidebar_word_line',
    ]),
    count: detail.length,
    countCurated: idsCurated.length,
    ids,
    idsCurated,
    markers: detail,
  };

  fs.writeFileSync(LAYOUT_AUDIT_OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    IDS_TO_FIX_OUT,
    `${JSON.stringify({ generatedAt: payload.generatedAt, ids, idsCurated }, null, 2)}\n`,
    'utf8',
  );

  console.error(
    `Wrote ${LAYOUT_AUDIT_OUT} and ${IDS_TO_FIX_OUT} (${detail.length} markers, ${idsCurated.length} curated).`,
  );
}

function main() {
  if (process.argv.includes('--layout-artifacts')) {
    runLayoutArtifactsAudit();
    return;
  }

  const minIssues = process.argv.includes('--min-issues')
    ? Math.max(1, parseInt(process.argv[process.argv.indexOf('--min-issues') + 1], 10) || 1)
    : 1;

  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const markers = JSON.parse(raw);
  const report = [];

  for (const m of markers) {
    const issues = auditInscription(m.inscription || '');
    if (issues.length >= minIssues) {
      report.push({
        id: m.id,
        slug: m.slug,
        title: m.title,
        issueCount: issues.length,
        issues,
      });
    }
  }

  report.sort((a, b) => b.issueCount - a.issueCount || a.title.localeCompare(b.title));
  console.log(JSON.stringify(report, null, 2));
  console.error(`Found ${report.length} marker(s) with >= ${minIssues} audit flag(s).`);
}

main();
