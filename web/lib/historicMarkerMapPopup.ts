import type { CSSProperties } from 'react';

/** Scroll region for long MarkerInscription text inside Mapbox GL popups (touch-friendly). */
export const HISTORIC_MARKER_MAP_POPUP_SCROLL: CSSProperties = {
  maxHeight: 'min(68vh, 480px)',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
};
