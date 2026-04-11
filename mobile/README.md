# Treasure State Mobile App

GPS-powered companion app for [treasurestate.com](https://treasurestate.com) that notifies users of nearby historic markers, hot springs, trails, and other Montana points of interest.

## Setup

```bash
cd mobile
npm install
npx expo start
```

## Features

- **Nearby List**: GPS-sorted list of points of interest with distance, category, and detail links
- **Map View**: Interactive map with user location and POI markers
- **Background Geofencing**: Get notified when approaching a POI, even with the app closed
- **Push Notifications**: Local notifications triggered by geofence entry
- **Deep Links**: Tap notifications to open full POI details on treasurestate.com

## Architecture

- **Expo / React Native** with TypeScript
- **Supabase** (PostGIS) for spatial queries via the `nearby_pois` database function
- **expo-location** for foreground and background location tracking
- **expo-task-manager** for background geofence monitoring
- **expo-notifications** for local push notifications
- **react-native-maps** for the interactive map

## Asset Requirements

Before building, add the following images to `assets/`:
- `icon.png` (1024x1024) — app icon
- `splash.png` (1284x2778) — splash screen
- `adaptive-icon.png` (1024x1024) — Android adaptive icon
- `notification-icon.png` (96x96, white on transparent) — Android notification icon

## Building

```bash
npx eas build --platform ios
npx eas build --platform android
```
