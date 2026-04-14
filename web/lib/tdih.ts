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
  military: 'Military',
  railroad: 'Railroad',
  mining: 'Mining',
  statehood: 'Statehood',
  exploration: 'Exploration',
  natural_disaster: 'Natural Disaster',
  weather: 'Weather',
  wildlife_nature: 'Wildlife & Nature',
  crime_outlaws: 'Crime & Outlaws',
  sports: 'Sports',
  notable_birth: 'Notable Birth',
  notable_death: 'Notable Death',
  arts_culture: 'Arts & Culture',
  agriculture: 'Agriculture',
  labor: 'Labor',
  science_medicine: 'Science & Medicine',
  infrastructure: 'Infrastructure',
};
