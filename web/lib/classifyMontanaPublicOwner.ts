/** Visual tier for Treasure State categorical fills (distinct from MSDI raster colors). */

export type PublicLandTier =
  | 'federal'
  | 'state_trust'
  | 'state_fwp'
  | 'state_agency'
  | 'local_public'
  | 'tribal_public'
  | 'other_public';

/** Fill + outline pairing for MSDI-derived public overlays */
export const PUBLIC_LAND_SEMANTICS: Record<
  PublicLandTier,
  { label: string; fill: string; outline: string }
> = {
  federal: {
    label: 'Federal administered (BLM, USFS, parks, refuge, USDA, Corps, reclamation, DoD)',
    fill: '#2f5235',
    outline: '#1b3325',
  },
  state_trust: {
    label: 'Montana DNRC state trust lands & stewardship blocks',
    fill: '#0b6fa4',
    outline: '#044267',
  },
  state_fwp: {
    label: 'Montana Fish, Wildlife & Parks land',
    fill: '#d84315',
    outline: '#8c2d05',
  },
  state_agency: {
    label: 'Other Montana departments (transportation, corrections, university, general state parcels)',
    fill: '#4527a0',
    outline: '#2f1b71',
  },
  local_public: {
    label: 'City / county / local-government holdings',
    fill: '#7d5c44',
    outline: '#4e3625',
  },
  tribal_public: {
    label: 'Tribal-administered or BIA-listed lands (fallback text match)',
    fill: '#5d1a78',
    outline: '#3a0f49',
  },
  other_public: {
    label: 'Other noted public classifications',
    fill: '#546e7a',
    outline: '#37474f',
  },
};

/** Matches Mapbox categorical fill stacking + legend sequencing */
export const PUBLIC_LAND_TIER_DISPLAY_ORDER: readonly PublicLandTier[] = [
  'federal',
  'state_trust',
  'state_fwp',
  'state_agency',
  'local_public',
  'tribal_public',
  'other_public',
];

/** Exact OWNER strings published in MSDI Public Lands as of site testing (plus Local Government typo guard). */

const KNOWN_OWNERS_TO_TIER: Record<string, PublicLandTier> = {
  'US Bureau of Land Management': 'federal',
  'US Forest Service': 'federal',
  'US Fish and Wildlife Service': 'federal',
  'National Park Service': 'federal',
  'US Army Corps of Engineers': 'federal',
  'US Bureau of Reclamation': 'federal',
  'US Department of Agriculture': 'federal',
  'US Department of Defense': 'federal',
  'US Government': 'federal',

  'Montana State Trust Lands': 'state_trust',
  'Montana Department of Natural Resources and Conservation': 'state_trust',

  'Montana Fish, Wildlife, and Parks': 'state_fwp',

  'Montana Department of Corrections': 'state_agency',
  'Montana Department of Transportation': 'state_agency',
  'Montana University System': 'state_agency',
  'State of Montana': 'state_agency',

  'City Government': 'local_public',
  'County Government': 'local_public',
  'Local Government': 'local_public',
};

/** Classify MSDI Public Lands polygons for Mapbox categorical fills. */
export function classifyPublicLandOwner(ownerRaw?: string | null): PublicLandTier {
  const o = ownerRaw?.trim();
  if (!o) return 'other_public';

  const direct = KNOWN_OWNERS_TO_TIER[o];
  if (direct) return direct;

  const normalized = o.toUpperCase();

  if (
    /\bTRIBE\b|TRIBAL|T\. C\.|\bNATION\b|BLACKFEET|CROW\b|CHIPPEWA|NORTHERN CHEYENNE|FLATHEAD|SALISH|KOOENAI|FORT PECK|SIOUX|LITTLE|SHELL|SIX REZ|^BIA\b|B\.I\.A/.test(normalized)
  ) {
    return 'tribal_public';
  }
  if (/BUREAU OF LAND MANAGEMENT|\bBLM\b|FOREST SERVICE|NATIONAL PARK|USFWS|\bCORPS\b|OF ENGINEERS|RECLAMATION|\bDEFENSE\b|\bARMY\b|\bUSDA\b|MILITARY|AIR FORCE|MARINES|MISSILE/.test(normalized)) {
    return 'federal';
  }
  if (/STATE TRUST|\bDNRC\b/.test(normalized)) {
    return 'state_trust';
  }
  if (/\bFWP\b|FISH,?\s*WILDLIFE/.test(normalized)) {
    return 'state_fwp';
  }
  if (/COUNTY|SCHOOL|SHERIFF|MUNICI|BOROUGH|\bTOWN\b|^CITY OF/.test(normalized)) {
    return 'local_public';
  }
  if (/STATE OF MONTANA|MONTANA DEPARTMENT|MONTANA UNIVERS|MONTANA DEPT/.test(normalized)) {
    return 'state_agency';
  }

  return 'other_public';
}
