import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔖</Text>
      <Text style={styles.title}>Saved Places</Text>
      <Text style={styles.subtitle}>
        Your saved points of interest will appear here. Tap the bookmark icon on any POI to save it for later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#f5f5f5' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#204051', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
});
