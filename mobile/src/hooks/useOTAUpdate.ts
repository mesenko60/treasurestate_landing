import { useEffect, useState, useCallback } from 'react';
import * as Updates from 'expo-updates';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'upToDate'
  | 'error';

export function useOTAUpdate() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = useCallback(async () => {
    if (__DEV__) {
      setStatus('upToDate');
      return;
    }

    try {
      setStatus('checking');
      setError(null);

      const update = await Updates.checkForUpdateAsync();
      if (!update.isAvailable) {
        setStatus('upToDate');
        return;
      }

      setStatus('downloading');
      await Updates.fetchUpdateAsync();
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Update check failed');
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (__DEV__) return;
    try {
      await Updates.reloadAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Restart failed');
    }
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return { status, error, checkForUpdate, applyUpdate };
}
