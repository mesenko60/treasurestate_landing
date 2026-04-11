import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { POI_CATEGORIES } from '../lib/supabase';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking } from '../lib/backgroundTasks';
import { setupNotifications } from '../lib/notifications';
import { useOTAUpdate } from '../hooks/useOTAUpdate';
import { trackSettingChange, trackAppUpdate } from '../lib/analytics';

export default function SettingsScreen() {
  const { requestBackgroundPermission } = useLocation();
  const { status: updateStatus, error: updateError, checkForUpdate, applyUpdate } = useOTAUpdate();
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [notifyRadius, setNotifyRadius] = useState(1609);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set(Object.keys(POI_CATEGORIES)));

  useEffect(() => {
    setupNotifications();
  }, []);

  const toggleBackground = useCallback(async (value: boolean) => {
    if (value) {
      const notifOk = await setupNotifications();
      if (!notifOk) {
        Alert.alert('Notifications Required', 'Please enable notifications to receive POI alerts.');
        return;
      }
      const started = await startBackgroundLocationTracking();
      if (!started) {
        Alert.alert(
          'Permission Required',
          'Background location is needed to notify you of nearby points of interest while the app is closed.',
        );
        return;
      }
    } else {
      await stopBackgroundLocationTracking();
    }
    setBackgroundEnabled(value);
    trackSettingChange('background_alerts', value);
  }, []);

  const toggleCategory = (cat: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Background Alerts</Text>
          <Text style={styles.rowDesc}>Get notified when near a POI, even when the app is closed</Text>
        </View>
        <Switch value={backgroundEnabled} onValueChange={toggleBackground} trackColor={{ true: '#3b6978' }} />
      </View>

      <Text style={styles.sectionTitle}>Alert Radius</Text>
      <View style={styles.radiusRow}>
        {[
          { label: '¼ mi', value: 402 },
          { label: '½ mi', value: 805 },
          { label: '1 mi', value: 1609 },
          { label: '2 mi', value: 3219 },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.radiusBtn, notifyRadius === opt.value && styles.radiusBtnActive]}
            onPress={() => { setNotifyRadius(opt.value); trackSettingChange('notify_radius', opt.value); }}
          >
            <Text style={[styles.radiusBtnText, notifyRadius === opt.value && styles.radiusBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Categories to Track</Text>
      {Object.entries(POI_CATEGORIES).map(([key, info]) => (
        <TouchableOpacity key={key} style={styles.categoryRow} onPress={() => { toggleCategory(key); trackSettingChange(`category:${key}`, !enabledCategories.has(key)); }}>
          <Text style={styles.categoryIcon}>{info.icon}</Text>
          <Text style={styles.categoryLabel}>{info.label}</Text>
          <View style={[styles.checkbox, enabledCategories.has(key) && styles.checkboxActive]}>
            {enabledCategories.has(key) && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>App Updates</Text>
      <View style={styles.updateCard}>
        {updateStatus === 'checking' || updateStatus === 'downloading' ? (
          <View style={styles.updateRow}>
            <ActivityIndicator size="small" color="#3b6978" />
            <Text style={styles.updateText}>
              {updateStatus === 'checking' ? 'Checking for updates…' : 'Downloading update…'}
            </Text>
          </View>
        ) : updateStatus === 'ready' ? (
          <View style={styles.updateRow}>
            <Text style={styles.updateTextBold}>A new version is ready!</Text>
            <TouchableOpacity style={styles.updateBtn} onPress={() => { trackAppUpdate('applied'); applyUpdate(); }}>
              <Text style={styles.updateBtnText}>Restart Now</Text>
            </TouchableOpacity>
          </View>
        ) : updateStatus === 'upToDate' || updateStatus === 'idle' ? (
          <View style={styles.updateRow}>
            <Text style={styles.updateText}>You're on the latest version.</Text>
            <TouchableOpacity style={styles.updateBtnSecondary} onPress={checkForUpdate}>
              <Text style={styles.updateBtnSecondaryText}>Check Again</Text>
            </TouchableOpacity>
          </View>
        ) : updateStatus === 'error' ? (
          <View style={styles.updateRow}>
            <Text style={styles.updateTextError}>Update check failed{updateError ? `: ${updateError}` : ''}</Text>
            <TouchableOpacity style={styles.updateBtnSecondary} onPress={checkForUpdate}>
              <Text style={styles.updateBtnSecondaryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <Text style={styles.footer}>Your location data stays on your device and is never stored on our servers.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 100 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 8 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: '#204051' },
  rowDesc: { fontSize: 13, color: '#888', marginTop: 2 },
  radiusRow: { flexDirection: 'row', gap: 8 },
  radiusBtn: { flex: 1, backgroundColor: 'white', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  radiusBtnActive: { backgroundColor: '#3b6978', borderColor: '#3b6978' },
  radiusBtnText: { fontSize: 14, color: '#555', fontWeight: '500' },
  radiusBtnTextActive: { color: 'white' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 10, marginBottom: 4 },
  categoryIcon: { fontSize: 20, marginRight: 12, width: 28, textAlign: 'center' },
  categoryLabel: { flex: 1, fontSize: 15, color: '#333' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#3b6978', borderColor: '#3b6978' },
  checkmark: { color: 'white', fontSize: 14, fontWeight: '700' },
  updateCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 8 },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  updateText: { flex: 1, fontSize: 14, color: '#555' },
  updateTextBold: { flex: 1, fontSize: 15, fontWeight: '600', color: '#204051' },
  updateTextError: { flex: 1, fontSize: 14, color: '#c0392b' },
  updateBtn: { backgroundColor: '#3b6978', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  updateBtnText: { color: 'white', fontWeight: '600', fontSize: 14 },
  updateBtnSecondary: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#3b6978' },
  updateBtnSecondaryText: { color: '#3b6978', fontWeight: '600', fontSize: 14 },
  footer: { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 32, lineHeight: 18 },
});
