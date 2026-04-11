import Constants from 'expo-constants';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GA_MEASUREMENT_ID = 'G-NQ8F9RC7DE';
const GA_API_SECRET = Constants.expoConfig?.extra?.gaApiSecret || '';
const MP_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

let _clientId: string | null = null;
let _sessionId: string | null = null;
let _sessionStart = 0;

async function getClientId(): Promise<string> {
  if (_clientId) return _clientId;
  const stored = await AsyncStorage.getItem('ga_client_id');
  if (stored) {
    _clientId = stored;
    return stored;
  }
  const id = `${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem('ga_client_id', id);
  _clientId = id;
  return id;
}

function getSessionId(): string {
  const now = Date.now();
  if (!_sessionId || now - _sessionStart > 30 * 60 * 1000) {
    _sessionId = String(now);
    _sessionStart = now;
  }
  return _sessionId;
}

async function sendEvent(name: string, params: Record<string, any> = {}) {
  if (__DEV__ && !GA_API_SECRET) {
    console.log(`[analytics] ${name}`, params);
    return;
  }
  if (!GA_API_SECRET) return;

  try {
    const clientId = await getClientId();
    const body = {
      client_id: clientId,
      events: [{
        name,
        params: {
          session_id: getSessionId(),
          engagement_time_msec: 100,
          platform: 'native_app',
          app_version: Application.nativeApplicationVersion || '1.0.0',
          content_group: 'nearby_app',
          ...params,
        },
      }],
    };

    fetch(MP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {
    // analytics should never crash the app
  }
}

export function trackScreenView(screenName: string) {
  sendEvent('screen_view', { screen_name: screenName });
}

export function trackLocationGranted() {
  sendEvent('nearby_location_granted', { event_category: 'nearby' });
}

export function trackLocationDenied(reason: string) {
  sendEvent('nearby_location_denied', { event_category: 'nearby', event_label: reason });
}

export function trackPOIsLoaded(count: number, radiusMeters: number) {
  sendEvent('nearby_pois_loaded', { event_category: 'nearby', value: count, radius: radiusMeters });
}

export function trackPOIView(poiName: string, category: string, distanceMeters: number) {
  sendEvent('nearby_poi_view', { event_category: 'nearby', event_label: poiName, poi_category: category, poi_distance: Math.round(distanceMeters) });
}

export function trackPOINavigate(poiName: string, category: string) {
  sendEvent('nearby_poi_navigate', { event_category: 'nearby', event_label: poiName, poi_category: category });
}

export function trackRadiusChange(radiusMeters: number) {
  sendEvent('nearby_radius_change', { event_category: 'nearby', value: radiusMeters, event_label: `${Math.round(radiusMeters / 1609)}mi` });
}

export function trackAlertTriggered(poiName: string, category: string, distanceMeters: number) {
  sendEvent('nearby_alert_triggered', { event_category: 'nearby', event_label: poiName, poi_category: category, poi_distance: Math.round(distanceMeters) });
}

export function trackSettingChange(setting: string, value: string | boolean | number) {
  sendEvent('nearby_alert_settings', { event_category: 'nearby', event_label: `${setting}:${value}` });
}

export function trackMapInteraction(action: string) {
  sendEvent('map_interaction', { event_category: 'engagement', event_label: action });
}

export function trackAppUpdate(status: string) {
  sendEvent('app_update', { event_category: 'system', event_label: status });
}

export async function trackFirstOpen() {
  const key = 'ga_first_open_sent';
  const sent = await AsyncStorage.getItem(key);
  if (sent) return;
  sendEvent('first_open', { event_category: 'system', event_label: 'app_installed' });
  await AsyncStorage.setItem(key, '1');
}

export async function trackAppOpen() {
  sendEvent('app_open', { event_category: 'system' });
}
