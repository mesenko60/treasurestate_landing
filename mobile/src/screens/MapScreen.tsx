import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { fetchNearbyPOIs, getCategoryInfo } from '../lib/supabase';
import type { NearbyPOI } from '../lib/supabase';

export default function MapScreen() {
  const { location, status, requestPermission } = useLocation();
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const radius = 16093;

  useEffect(() => {
    if (status === 'idle') requestPermission();
  }, [status, requestPermission]);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    fetchNearbyPOIs(location.lat, location.lng, radius, null, 150)
      .then(setPois)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  const centerOnUser = useCallback(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    }
  }, [location]);

  if (status !== 'granted' || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b6978" />
        <Text style={styles.statusText}>Waiting for location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Circle
          center={{ latitude: location.lat, longitude: location.lng }}
          radius={radius}
          strokeColor="rgba(59,105,120,0.3)"
          fillColor="rgba(59,105,120,0.05)"
          strokeWidth={2}
        />
        {pois.map((poi) => {
          const info = getCategoryInfo(poi.category);
          return (
            <Marker
              key={poi.id}
              coordinate={{ latitude: poi.lat, longitude: poi.lng }}
              title={poi.name}
              description={`${info.label} — ${Math.round(poi.distance_meters / 1609.344 * 10) / 10} mi`}
              pinColor={info.color}
            />
          );
        })}
      </MapView>

      <TouchableOpacity style={styles.centerBtn} onPress={centerOnUser}>
        <Text style={styles.centerBtnText}>📍</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#3b6978" />
          <Text style={styles.loadingText}>Loading POIs...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { fontSize: 16, color: '#666', marginTop: 12 },
  centerBtn: {
    position: 'absolute', bottom: 100, right: 16,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  centerBtnText: { fontSize: 22 },
  loadingOverlay: {
    position: 'absolute', top: 60, alignSelf: 'center',
    backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  loadingText: { fontSize: 13, color: '#666' },
});
