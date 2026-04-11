import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { fetchNearbyPOIs, formatDistance, getCategoryInfo, POI_CATEGORIES } from '../lib/supabase';
import type { NearbyPOI } from '../lib/supabase';

const RADIUS_OPTIONS = [
  { label: '1 mi', value: 1609 },
  { label: '5 mi', value: 8047 },
  { label: '10 mi', value: 16093 },
  { label: '25 mi', value: 40234 },
  { label: '50 mi', value: 80467 },
];

export default function NearbyScreen() {
  const { location, status, errorMsg, requestPermission } = useLocation();
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(8047);
  const [selectedPoi, setSelectedPoi] = useState<NearbyPOI | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPOIs = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const data = await fetchNearbyPOIs(location.lat, location.lng, radius, null, 200);
      setPois(data);
    } catch (err) {
      console.error('Failed to fetch POIs:', err);
    } finally {
      setLoading(false);
    }
  }, [location, radius]);

  useEffect(() => {
    if (status === 'idle') {
      requestPermission();
    }
  }, [status, requestPermission]);

  useEffect(() => {
    loadPOIs();
  }, [loadPOIs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPOIs();
    setRefreshing(false);
  }, [loadPOIs]);

  const openDirections = (poi: NearbyPOI) => {
    const url = `https://maps.google.com/maps?daddr=${poi.lat},${poi.lng}`;
    Linking.openURL(url);
  };

  const openWebPage = (poi: NearbyPOI) => {
    if (poi.content_url) {
      Linking.openURL(`https://treasurestate.com${poi.content_url}`);
    }
  };

  if (status === 'idle' || status === 'requesting') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b6978" />
        <Text style={styles.statusText}>Requesting location access...</Text>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={styles.centered}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.statusText}>{errorMsg || 'Location access denied.'}</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPOI = ({ item }: { item: NearbyPOI }) => {
    const info = getCategoryInfo(item.category);
    const isSelected = selectedPoi?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedPoi(isSelected ? null : item)}
        activeOpacity={0.7}
      >
        <View style={[styles.cardIcon, { backgroundColor: info.color }]}>
          <Text style={styles.cardIconText}>{info.icon}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardCategory}>{info.label}</Text>
            <Text style={styles.cardDistance}>{formatDistance(item.distance_meters)}</Text>
            {item.rating ? <Text style={styles.cardRating}>★ {item.rating}</Text> : null}
          </View>
          {isSelected && (
            <View style={styles.cardActions}>
              {item.description ? (
                <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
              ) : null}
              <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.navButton} onPress={() => openDirections(item)}>
                  <Text style={styles.navButtonText}>Navigate</Text>
                </TouchableOpacity>
                {item.content_url ? (
                  <TouchableOpacity style={styles.detailButton} onPress={() => openWebPage(item)}>
                    <Text style={styles.detailButtonText}>Details</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.radiusRow}>
          {RADIUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.radiusBtn, radius === opt.value && styles.radiusBtnActive]}
              onPress={() => setRadius(opt.value)}
            >
              <Text style={[styles.radiusBtnText, radius === opt.value && styles.radiusBtnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.statusBar}>
          {loading ? 'Searching...' : `${pois.length} places nearby`}
        </Text>
      </View>
      <FlatList
        data={pois}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPOI}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b6978" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No points of interest found. Try increasing the radius.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  icon: { fontSize: 48, marginBottom: 16 },
  statusText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 12 },
  button: { backgroundColor: '#3b6978', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  controls: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  radiusRow: { flexDirection: 'row', gap: 6 },
  radiusBtn: { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
  radiusBtnActive: { backgroundColor: '#3b6978', borderColor: '#3b6978' },
  radiusBtnText: { fontSize: 13, color: '#555', fontWeight: '500' },
  radiusBtnTextActive: { color: 'white' },
  statusBar: { fontSize: 12, color: '#888', marginTop: 6 },
  list: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 100 },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  cardSelected: { borderColor: '#3b6978' },
  cardIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardIconText: { fontSize: 20 },
  cardBody: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#204051' },
  cardMeta: { flexDirection: 'row', gap: 8, marginTop: 2, flexWrap: 'wrap' },
  cardCategory: { fontSize: 12, color: '#888' },
  cardDistance: { fontSize: 12, color: '#3b6978', fontWeight: '600' },
  cardRating: { fontSize: 12, color: '#e67e22' },
  cardActions: { marginTop: 8 },
  cardDesc: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 8 },
  cardButtons: { flexDirection: 'row', gap: 8 },
  navButton: { flex: 1, backgroundColor: '#3b6978', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  navButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  detailButton: { flex: 1, backgroundColor: '#f0f0f0', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  detailButtonText: { color: '#204051', fontWeight: '600', fontSize: 14 },
  emptyText: { fontSize: 15, color: '#999', textAlign: 'center' },
});
