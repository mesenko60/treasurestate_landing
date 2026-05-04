import { useSyncExternalStore } from 'react';

/**
 * SSR-safe matchMedia subscription (React useSyncExternalStore).
 * Server snapshot defaults to `serverFallback` so markup matches first paint patterns.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
