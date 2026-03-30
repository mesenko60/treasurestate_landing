#!/usr/bin/env node
/**
 * List historic markers whose inscriptions still look like they need agent review
 * (orphan words, HMDB cruft, kiosk heading typos). Output is JSON for triage — do not
 * auto-apply fixes. After review, add entries to historic-marker-inscription-overrides.json
 * and re-run parse-historic-markers.js.
 *
 * Usage: node web/scripts/audit-historic-marker-text.js
 *        node web/scripts/audit-historic-marker-text.js --min-issues 1
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/historic-markers.json');

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

function main() {
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
