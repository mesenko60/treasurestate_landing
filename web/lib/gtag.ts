export const GA_TRACKING_ID = 'G-NQ8F9RC7DE';

type GtagFn = (...args: any[]) => void;

function gtag(): GtagFn | null {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    return (window as any).gtag;
  }
  return null;
}

/* ─── Pageview ────────────────────────────────────────────── */

export const pageview = (url: string) => {
  gtag()?.('config', GA_TRACKING_ID, {
    page_path: url,
    content_group: getContentGroup(url),
  });
};

/* ─── Generic event ───────────────────────────────────────── */

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  gtag()?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

/* ─── Content Groups ──────────────────────────────────────── */

export function getContentGroup(path: string): string {
  if (path === '/') return 'home';
  if (path === '/montana-towns' || path === '/montana-towns/') return 'directory';
  if (/^\/montana-towns\/[^/]+\/[^/]+/.test(path)) return 'topic';
  if (/^\/montana-towns\/[^/]+/.test(path)) return 'hub';
  if (/^\/guides\//.test(path)) return 'guide';
  if (path === '/best-of' || path === '/best-of/') return 'rankings_index';
  if (/^\/best-of\//.test(path)) return 'ranking';
  if (path === '/compare' || path === '/compare/') return 'compare_tool';
  if (/^\/compare\//.test(path)) return 'comparison';
  if (/^\/information\//.test(path)) return 'montana_facts';
  if (path === '/nearby' || path === '/nearby/') return 'nearby_app';
  return 'other';
}

/* ─── Scroll Depth ────────────────────────────────────────── */

const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;

let scrollState = {
  reached: new Set<number>(),
  rafId: 0,
  listening: false,
};

function getScrollPercent(): number {
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const viewportHeight = window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (docHeight <= viewportHeight) return 100;
  return Math.min(100, Math.round(((scrollTop + viewportHeight) / docHeight) * 100));
}

function checkScrollMilestones() {
  const pct = getScrollPercent();
  for (const milestone of SCROLL_MILESTONES) {
    if (pct >= milestone && !scrollState.reached.has(milestone)) {
      scrollState.reached.add(milestone);
      gtag()?.('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: `${milestone}%`,
        value: milestone,
        content_group: getContentGroup(window.location.pathname),
        page_path: window.location.pathname,
      });
    }
  }
}

function onScroll() {
  if (scrollState.rafId) return;
  scrollState.rafId = requestAnimationFrame(() => {
    scrollState.rafId = 0;
    checkScrollMilestones();
  });
}

export function initScrollTracking() {
  if (typeof window === 'undefined') return;
  scrollState.reached = new Set();
  if (scrollState.rafId) {
    cancelAnimationFrame(scrollState.rafId);
    scrollState.rafId = 0;
  }
  if (!scrollState.listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollState.listening = true;
  }
  setTimeout(checkScrollMilestones, 500);
}

export function resetScrollTracking() {
  scrollState.reached = new Set();
}

/* ─── Read Completion (time-based) ────────────────────────── */

let readTimers: ReturnType<typeof setTimeout>[] = [];

export function initReadTracking() {
  if (typeof window === 'undefined') return;
  clearReadTracking();
  const thresholds = [30, 60, 120, 300];
  for (const secs of thresholds) {
    readTimers.push(
      setTimeout(() => {
        gtag()?.('event', 'read_time', {
          event_category: 'engagement',
          event_label: `${secs}s`,
          value: secs,
          content_group: getContentGroup(window.location.pathname),
          page_path: window.location.pathname,
        });
      }, secs * 1000),
    );
  }
}

export function clearReadTracking() {
  readTimers.forEach(clearTimeout);
  readTimers = [];
}

/* ─── Outbound Link Tracking ──────────────────────────────── */

let outboundListenerAttached = false;

export function initOutboundTracking() {
  if (typeof window === 'undefined' || outboundListenerAttached) return;
  outboundListenerAttached = true;

  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.href;
    if (!href || !href.startsWith('http')) return;
    try {
      const url = new URL(href);
      if (url.hostname === window.location.hostname) return;
      gtag()?.('event', 'outbound_click', {
        event_category: 'engagement',
        event_label: url.hostname,
        outbound_url: href,
        page_path: window.location.pathname,
      });
    } catch { /* invalid URL, skip */ }
  });
}

/* ─── Named Interaction Events ────────────────────────────── */

export function trackTocClick(sectionId: string, sectionText: string) {
  gtag()?.('event', 'toc_click', {
    event_category: 'navigation',
    event_label: sectionText,
    section_id: sectionId,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackSearch(query: string, resultCount: number) {
  gtag()?.('event', 'search', {
    search_term: query,
    event_category: 'engagement',
    event_label: `${resultCount} results`,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackSearchResultClick(query: string, resultTitle: string, resultUrl: string, resultType: string) {
  gtag()?.('event', 'search_result_click', {
    search_term: query,
    event_category: 'engagement',
    event_label: resultTitle,
    result_url: resultUrl,
    result_type: resultType,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackCompare(townA: string, townB: string) {
  gtag()?.('event', 'compare_towns', {
    event_category: 'engagement',
    event_label: `${townA} vs ${townB}`,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackDirectoryExpand(component: string, townName?: string) {
  gtag()?.('event', 'directory_expand', {
    event_category: 'engagement',
    event_label: townName ? `${component} – ${townName}` : component,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackHubCityClick(cityName: string) {
  gtag()?.('event', 'hub_city_click', {
    event_category: 'navigation',
    event_label: cityName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackRankingClick(rankingSlug: string) {
  gtag()?.('event', 'ranking_click', {
    event_category: 'navigation',
    event_label: rankingSlug,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackMapInteraction(action: string) {
  gtag()?.('event', 'map_interaction', {
    event_category: 'engagement',
    event_label: action,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackArticleView(slug: string, type: string) {
  gtag()?.('event', 'article_view', {
    event_category: 'content',
    event_label: slug,
    article_type: type,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackShopCTAClick(articleSlug: string, ctaUrl: string) {
  gtag()?.('event', 'shop_cta_click', {
    event_category: 'conversion',
    event_label: articleSlug,
    outbound_url: ctaUrl,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackArticleTownClick(articleSlug: string, townSlug: string) {
  gtag()?.('event', 'article_town_click', {
    event_category: 'navigation',
    event_label: `${articleSlug} → ${townSlug}`,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

/* ─── Nearby / PWA Events ────────────────────────────────── */

function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true;
}

function nearbyParams(extra?: Record<string, any>) {
  return {
    content_group: 'nearby_app',
    platform: isPWA() ? 'pwa' : 'web',
    page_path: '/nearby/',
    ...extra,
  };
}

export function trackNearbyLocationGranted() {
  gtag()?.('event', 'nearby_location_granted', {
    event_category: 'nearby',
    event_label: 'permission_granted',
    ...nearbyParams(),
  });
}

export function trackNearbyLocationDenied(reason: string) {
  gtag()?.('event', 'nearby_location_denied', {
    event_category: 'nearby',
    event_label: reason,
    ...nearbyParams(),
  });
}

export function trackNearbyRadiusChange(radiusMeters: number) {
  gtag()?.('event', 'nearby_radius_change', {
    event_category: 'nearby',
    event_label: `${Math.round(radiusMeters / 1609)}mi`,
    value: radiusMeters,
    ...nearbyParams(),
  });
}

export function trackNearbyViewToggle(mode: 'map' | 'list') {
  gtag()?.('event', 'nearby_view_toggle', {
    event_category: 'nearby',
    event_label: mode,
    ...nearbyParams(),
  });
}

export function trackNearbyCategoryFilter(category: string, enabled: boolean) {
  gtag()?.('event', 'nearby_category_filter', {
    event_category: 'nearby',
    event_label: `${category}:${enabled ? 'on' : 'off'}`,
    ...nearbyParams(),
  });
}

export function trackNearbyPOIView(poiName: string, category: string, distanceMeters: number) {
  gtag()?.('event', 'nearby_poi_view', {
    event_category: 'nearby',
    event_label: poiName,
    ...nearbyParams({ poi_category: category, poi_distance: Math.round(distanceMeters) }),
  });
}

export function trackNearbyPOINavigate(poiName: string, category: string) {
  gtag()?.('event', 'nearby_poi_navigate', {
    event_category: 'nearby',
    event_label: poiName,
    ...nearbyParams({ poi_category: category }),
  });
}

export function trackNearbyAlertTriggered(poiName: string, category: string, distanceMeters: number) {
  gtag()?.('event', 'nearby_alert_triggered', {
    event_category: 'nearby',
    event_label: poiName,
    ...nearbyParams({ poi_category: category, poi_distance: Math.round(distanceMeters) }),
  });
}

export function trackNearbyAlertSettingsChange(setting: string, value: string | boolean | number) {
  gtag()?.('event', 'nearby_alert_settings', {
    event_category: 'nearby',
    event_label: `${setting}:${value}`,
    ...nearbyParams(),
  });
}

export function trackNearbyPOIsLoaded(count: number, radiusMeters: number) {
  gtag()?.('event', 'nearby_pois_loaded', {
    event_category: 'nearby',
    event_label: `${count} POIs`,
    value: count,
    ...nearbyParams({ radius: radiusMeters }),
  });
}

/* ─── PWA Install Tracking ───────────────────────────────── */

function pwaInstallParams(extra?: Record<string, any>) {
  const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';
  return {
    event_category: 'pwa',
    page_path: pagePath,
    content_group: pagePath ? getContentGroup(pagePath) : 'other',
    platform: isPWA() ? 'pwa' : 'web',
    ...extra,
  };
}

export function trackPWAInstallPromptShown() {
  gtag()?.('event', 'pwa_install_prompt_shown', {
    ...pwaInstallParams(),
    event_label: 'banner_displayed',
  });
}

export function trackPWAInstallAccepted() {
  gtag()?.('event', 'pwa_install_accepted', {
    ...pwaInstallParams(),
    event_label: 'user_accepted',
  });
}

export function trackPWAInstallDismissed() {
  gtag()?.('event', 'pwa_install_dismissed', {
    ...pwaInstallParams(),
    event_label: 'user_dismissed',
  });
}

export function trackPWAInstalled() {
  gtag()?.('event', 'pwa_installed', {
    ...pwaInstallParams(),
    event_label: 'app_installed',
  });
}

export function trackPWAInstallInstructionsShown() {
  gtag()?.('event', 'pwa_install_instructions_shown', {
    ...pwaInstallParams(),
    event_label: 'manual_install_instructions',
  });
}

export function trackPWAQRInstallModalOpen() {
  gtag()?.('event', 'pwa_qr_install_modal_opened', {
    ...pwaInstallParams(),
    event_label: 'desktop_qr_modal',
  });
}

let pwaInstallListenerAttached = false;

export function initPWAInstallTracking() {
  if (typeof window === 'undefined' || pwaInstallListenerAttached) return;
  pwaInstallListenerAttached = true;
  window.addEventListener('appinstalled', () => {
    trackPWAInstalled();
  });
}
