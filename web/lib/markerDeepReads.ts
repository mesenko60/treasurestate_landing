import type { MarkerDeepRead } from './markerDeepReadsTypes';
import { MARKER_DEEP_READS_AUTO } from './markerDeepReads.generated';

export type { MarkerDeepRead };

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
 * Markers that share the 1910 fire umbrella article (no dedicated companion .md).
 * Markers with their own file under articles_information/markers/ stay on the auto map.
 */
const MARKER_DEEP_READS_FIRE: Record<string, MarkerDeepRead> = {
  'building-from-the-ashes': fire1910Read('Building From the Ashes — full narrative'),
  'pluck-and-good-fortune': fire1910Read('The 1910 fires — full narrative'),
  'sliderock-lookout-tower': fire1910Read('The 1910 fires — full narrative'),
};

/**
 * Marker slug → companion /information/ article.
 * Auto-generated links come from curated markers + articles_information/markers;
 * fire cluster overrides when both exist so all 1910 markers point at 1910_fire.
 */
export const MARKER_DEEP_READS: Record<string, MarkerDeepRead> = {
  ...MARKER_DEEP_READS_AUTO,
  ...MARKER_DEEP_READS_FIRE,
};
