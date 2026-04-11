import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number | null;
  timestamp: number;
}

export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied';

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    setStatus('requesting');

    const { status: foreground } = await Location.requestForegroundPermissionsAsync();
    if (foreground !== 'granted') {
      setStatus('denied');
      setErrorMsg('Foreground location permission was denied.');
      return false;
    }

    setStatus('granted');
    return true;
  }, []);

  const requestBackgroundPermission = useCallback(async () => {
    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    return bg === 'granted';
  }, []);

  useEffect(() => {
    if (status !== 'granted') return;

    let sub: Location.LocationSubscription | null = null;

    (async () => {
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 50,
        },
        (loc) => {
          setLocation({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            timestamp: loc.timestamp,
          });
        },
      );
    })();

    return () => {
      sub?.remove();
    };
  }, [status]);

  return {
    location,
    status,
    errorMsg,
    requestPermission,
    requestBackgroundPermission,
  };
}
