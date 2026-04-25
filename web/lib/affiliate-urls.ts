const VRBO_CAMREF = '1011l52GGp';
const VRBO_CREATIVEREF = '1101l63118';
const EXPEDIA_CAMREF = '1011l52GG6';

export function lodgingPageSlug(townSlug: string): string {
  return townSlug === 'anaconda' ? 'anaconda-montana' : townSlug;
}

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
<div class="stays-inline-cta" aria-label="Find lodging">
  <div class="stays-inline-cta__buttons">
    <a class="stays-inline-cta__button stays-inline-cta__button--vrbo" href="${vrbo}" target="_blank" rel="noopener noreferrer sponsored">
      <span class="stays-inline-cta__label">Vacation Rentals</span>
      <span class="stays-inline-cta__source">via VRBO</span>
    </a>
    <a class="stays-inline-cta__button stays-inline-cta__button--expedia" href="${expedia}" target="_blank" rel="noopener noreferrer sponsored">
      <span class="stays-inline-cta__label">Hotels</span>
      <span class="stays-inline-cta__source">via Expedia</span>
    </a>
  </div>
  <p class="stays-inline-cta__disclosure">Affiliate links help support this site at no extra cost to you.</p>
</div>`;

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
