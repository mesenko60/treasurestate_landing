export type TdihEntry = {
  id: string;
  month: number;
  day: number;
  date_display: string;
  headline: string;
  year: number | null;
  body: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  tags: string[];
  expandable: boolean;
  sources: string[];
  related_article: string | null;
};

export const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const MONTH_LABELS = MONTH_NAMES.map((m) => m[0].toUpperCase() + m.slice(1));

export function monthNumberToSlug(month: number): string {
  return MONTH_NAMES[month - 1] || 'january';
}

export function monthSlugToNumber(monthSlug: string): number {
  const idx = MONTH_NAMES.indexOf(monthSlug.toLowerCase() as (typeof MONTH_NAMES)[number]);
  return idx === -1 ? -1 : idx + 1;
}

export function pad2(num: number): string {
  return String(num).padStart(2, '0');
}

export function toEntryId(month: number, day: number): string {
  return `${pad2(month)}${pad2(day)}`;
}

export function getTdihUrl(entry: Pick<TdihEntry, 'month' | 'day'>): string {
  return `/this-day-in-history/${monthNumberToSlug(entry.month)}/${entry.day}/`;
}

/** Calendar month/day in America/Denver (primary audience timezone). */
export function getMontanaYmd(now = new Date()): { month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const month = Number(parts.find((p) => p.type === 'month')?.value);
  const day = Number(parts.find((p) => p.type === 'day')?.value);
  if (!Number.isFinite(month) || !Number.isFinite(day)) {
    return { month: now.getMonth() + 1, day: now.getDate() };
  }
  return { month, day };
}

/**
 * Path to today’s expanded TDIH page, e.g. /this-day-in-history/april/26/
 * Uses Montana date; Feb 29 maps to the Feb 28 entry (dataset has no leap day).
 */
export function getTodayTdihPath(now = new Date()): string {
  let { month, day } = getMontanaYmd(now);
  if (month === 2 && day === 29) day = 28;
  return `/this-day-in-history/${monthNumberToSlug(month)}/${day}/`;
}

export function findEntryByDate(entries: TdihEntry[], now = new Date()): TdihEntry | null {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const id = toEntryId(month, day);
  const direct = entries.find((entry) => entry.id === id);
  if (direct) return direct;

  // Leap-day fallback (dataset has no 02/29).
  if (month === 2 && day === 29) {
    return entries.find((entry) => entry.id === '0228') || null;
  }
  return null;
}

export function getPrevNext(entries: TdihEntry[], currentId: string) {
  const sorted = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  const idx = sorted.findIndex((entry) => entry.id === currentId);
  if (idx === -1) {
    return { prev: null as TdihEntry | null, next: null as TdihEntry | null };
  }
  const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
  const next = sorted[(idx + 1) % sorted.length];
  return { prev, next };
}

export const CATEGORY_LABELS: Record<string, string> = {
  native_history: 'Native History',
  native_american_history: 'Native American History',
  'native american history': 'Native American History',
  indigenous_history: 'Indigenous History',
  'indigenous history': 'Indigenous History',
  military: 'Military',
  'military history': 'Military History',
  railroad: 'Railroad',
  mining: 'Mining',
  statehood: 'Statehood',
  exploration: 'Exploration',
  natural_disaster: 'Natural Disaster',
  disaster: 'Disaster',
  disasters: 'Disasters',
  weather: 'Weather',
  weather_event: 'Weather Event',
  wildlife_nature: 'Wildlife & Nature',
  crime_outlaws: 'Crime & Outlaws',
  crime: 'Crime',
  sports: 'Sports',
  notable_birth: 'Notable Birth',
  notable_death: 'Notable Death',
  arts_culture: 'Arts & Culture',
  agriculture: 'Agriculture',
  labor: 'Labor',
  labor_history: 'Labor History',
  'labor history': 'Labor History',
  science_medicine: 'Science & Medicine',
  infrastructure: 'Infrastructure',
  community_history: 'Community History',
  conservation: 'Conservation',
  economic: 'Economic',
  education: 'Education',
  environment: 'Environment',
  'frontier history': 'Frontier History',
  frontier_history: 'Frontier History',
  'fur trade': 'Fur Trade',
  history: 'History',
  photography: 'Photography',
  political_history: 'Political History',
  politics: 'Politics',
  'social history': 'Social History',
  technology: 'Technology',
  transportation: 'Transportation',
};

/** Human label for a card category (handles spaces, underscores, and legacy slugs). */
export function formatCategoryLabel(category: string): string {
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
  const words = category
    .trim()
    .split(/[\s_]+/)
    .filter(Boolean);
  if (words.length === 0) return category;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
