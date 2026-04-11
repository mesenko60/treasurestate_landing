import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { fetchNearbyPOIs, getCategoryInfo, formatDistance } from './supabase';
import type { NearbyPOI } from './supabase';

export const BACKGROUND_LOCATION_TASK = 'treasurestate-background-location';
export const GEOFENCING_TASK = 'treasurestate-geofencing';

const GEOFENCE_RADIUS = 500; // meters
const MAX_GEOFENCES_IOS = 20;
const NOTIFY_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between notifications for same POI

const notifiedRecently = new Map<number, number>();

function shouldNotify(poiId: number): boolean {
  const last = notifiedRecently.get(poiId);
  if (last && Date.now() - last < NOTIFY_COOLDOWN_MS) return false;
  notifiedRecently.set(poiId, Date.now());
  return true;
}

async function sendPOINotification(poi: NearbyPOI) {
  const info = getCategoryInfo(poi.category);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${info.icon} ${poi.name}`,
      body: `${info.label} — ${formatDistance(poi.distance_meters)} away${poi.description ? '. ' + poi.description.substring(0, 100) : ''}`,
      data: {
        poiId: poi.id,
        lat: poi.lat,
        lng: poi.lng,
        contentUrl: poi.content_url,
        category: poi.category,
      },
      sound: 'default',
    },
    trigger: null,
  });
}

// Background location: fires when device moves significantly (~500m).
// Fetches nearby POIs and registers geofences around the closest ones.
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error.message);
    return;
  }

  const locations = (data as any)?.locations as Location.LocationObject[] | undefined;
  if (!locations?.length) return;

  const { latitude, longitude } = locations[0].coords;

  try {
    const pois = await fetchNearbyPOIs(latitude, longitude, 5000, null, MAX_GEOFENCES_IOS);

    // Register geofences around nearby POIs
    const regions: Location.LocationRegion[] = pois.map((poi) => ({
      identifier: String(poi.id),
      latitude: poi.lat,
      longitude: poi.lng,
      radius: GEOFENCE_RADIUS,
      notifyOnEnter: true,
      notifyOnExit: false,
    }));

    if (regions.length > 0) {
      await Location.startGeofencingAsync(GEOFENCING_TASK, regions);
    }
  } catch (err) {
    console.error('Background POI fetch error:', err);
  }
});

// Geofencing: fires when user enters a registered region
TaskManager.defineTask(GEOFENCING_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Geofencing error:', error.message);
    return;
  }

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  if (eventType !== Location.GeofencingEventType.Enter) return;

  const poiId = parseInt(region.identifier, 10);
  if (isNaN(poiId) || !shouldNotify(poiId)) return;

  try {
    const pois = await fetchNearbyPOIs(
      region.latitude,
      region.longitude,
      GEOFENCE_RADIUS * 2,
      null,
      5,
    );

    const poi = pois.find((p) => p.id === poiId);
    if (poi) {
      await sendPOINotification(poi);
    }
  } catch (err) {
    console.error('Geofencing notification error:', err);
  }
});

export async function startBackgroundLocationTracking(): Promise<boolean> {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== 'granted') return false;

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (bg !== 'granted') return false;

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (hasStarted) return true;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60000,
    distanceInterval: 500,
    deferredUpdatesInterval: 60000,
    deferredUpdatesDistance: 500,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'Treasure State',
      notificationBody: 'Finding nearby points of interest...',
      notificationColor: '#3b6978',
    },
  });

  return true;
}

export async function stopBackgroundLocationTracking(): Promise<void> {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }

  const hasGeofencing = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK);
  if (hasGeofencing) {
    await Location.stopGeofencingAsync(GEOFENCING_TASK);
  }
}
