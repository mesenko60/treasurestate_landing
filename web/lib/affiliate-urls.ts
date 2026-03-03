const VRBO_CAMREF = '1011l52GGp';
const VRBO_CREATIVEREF = '1101l63118';
const EXPEDIA_CAMREF = '1011l52GG6';

export function vrboUrl(townName: string, slug: string): string {
  const destination = `${townName}, Montana, United States of America`;
  const searchUrl = `https://www.vrbo.com/search?destination=${encodeURIComponent(destination)}&sort=RECOMMENDED`;
  const params = new URLSearchParams({
    landingPage: searchUrl,
    camref: VRBO_CAMREF,
    creativeref: VRBO_CREATIVEREF,
    adref: slug,
  });
  return `https://vrbo.com/affiliate?${params.toString()}`;
}

export function expediaUrl(townName: string, slug: string): string {
  const destination = `${townName}, Montana, United States of America`;
  return `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&sort=RECOMMENDED&pwaLob=HRS&camref=${EXPEDIA_CAMREF}`;
}

/**
 * Injects affiliate booking buttons into HTML content after the "Where to Stay"
 * section. If no such section exists, returns null so the caller can render
 * a standalone fallback component instead.
 */
export function injectStaysCTA(html: string, townName: string, slug: string): { html: string; injected: boolean } {
  const vrbo = vrboUrl(townName, slug);
  const expedia = expediaUrl(townName, slug);

  const ctaBlock = `
<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin:1.25rem 0 0.5rem;justify-content:center;text-align:center">
  <a href="${vrbo}" target="_blank" rel="noopener noreferrer sponsored"
     style="display:inline-flex;flex-direction:column;background:#3b6978;color:#fff;padding:0.7rem 1.3rem;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px rgba(59,105,120,0.25);line-height:1.3">
    <span style="font-weight:600;font-size:0.9rem">Find Vacation Rentals near ${townName}</span>
    <span style="font-size:0.72rem;opacity:0.7">via VRBO</span>
  </a>
  <a href="${expedia}" target="_blank" rel="noopener noreferrer sponsored"
     style="display:inline-flex;flex-direction:column;background:#204051;color:#fff;padding:0.7rem 1.3rem;border-radius:8px;text-decoration:none;box-shadow:0 2px 6px rgba(0,0,0,0.12);line-height:1.3">
    <span style="font-weight:600;font-size:0.9rem">Find Hotels near ${townName}</span>
    <span style="font-size:0.72rem;opacity:0.7">via Expedia</span>
  </a>
</div>
<p style="font-size:0.7rem;color:#999;margin:0 0 1rem;text-align:center">Affiliate links help support this site at no extra cost to you.</p>`;

  const headingPattern = /<h[23][^>]*>(?:[^<]*)?Where to Stay[^<]*<\/h[23]>/i;
  const match = html.match(headingPattern);
  if (!match || match.index === undefined) {
    return { html, injected: false };
  }

  const afterHeading = match.index + match[0].length;
  const rest = html.slice(afterHeading);

  const nextSectionMatch = rest.match(/<h[1-3][^>]*>/i);
  const insertPos = nextSectionMatch?.index !== undefined
    ? afterHeading + nextSectionMatch.index
    : html.length;

  const modified = html.slice(0, insertPos) + ctaBlock + html.slice(insertPos);
  return { html: modified, injected: true };
}
