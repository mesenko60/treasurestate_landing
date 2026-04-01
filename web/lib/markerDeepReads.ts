export type MarkerDeepRead = {
  href: string;
  title: string;
  description: string;
};

const FIRE_1910_DESCRIPTION =
  'A longer account of the 1910 Northern Rockies fire storm, East Portal, rescue trains, and how communities and the Forest Service recovered—companion reading to these markers.';

function fire1910Read(title: string): MarkerDeepRead {
  return {
    href: '/information/1910_fire/',
    title,
    description: FIRE_1910_DESCRIPTION,
  };
}

/**
 * Marker slug → companion /information/1910_fire/ article.
 * Covers the East Portal (Lolo NF, 2010) fire series and related markers that name the event in inscription text.
 */
export const MARKER_DEEP_READS: Record<string, MarkerDeepRead> = {
  'building-from-the-ashes-45509': fire1910Read('Building From the Ashes — full narrative'),
  'pluck-and-good-fortune-45503': fire1910Read('The 1910 fires — full narrative'),
  'when-the-mountains-roared-45508': fire1910Read('The 1910 fires — full narrative'),
  'a-battle-that-could-not-be-won-45505': fire1910Read('The 1910 fires — full narrative'),
  'an-unlikely-safe-haven-45511': fire1910Read('The 1910 fires — full narrative'),
  'douse-the-flames-and-climb-aboard-45510': fire1910Read('The 1910 fires — full narrative'),
  'sliderock-lookout-tower-123285': fire1910Read('The 1910 fires — full narrative'),
};
