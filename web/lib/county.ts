/**
 * Normalize county strings from town-data.json, which use full names like "Meagher County".
 * Use this when building prose like "in Meagher County" or "Located in …".
 */
export function formatCountyLabel(raw: string | null | undefined): string {
  if (!raw) return '';
  const s = String(raw).trim();
  if (!s) return '';
  if (/\sCounty$/i.test(s)) return s;
  return `${s} County`;
}
