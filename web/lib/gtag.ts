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
  if (/^\/Information\//.test(path)) return 'legacy';
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
