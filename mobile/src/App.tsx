import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Linking } from 'react-native';
import NearbyScreen from './screens/NearbyScreen';
import MapScreen from './screens/MapScreen';
import SavedScreen from './screens/SavedScreen';
import SettingsScreen from './screens/SettingsScreen';
import { setupNotifications, addNotificationResponseListener } from './lib/notifications';
import { trackScreenView } from './lib/analytics';
import './lib/backgroundTasks';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Nearby: '📍',
  Map: '🗺️',
  Saved: '🔖',
  Settings: '⚙️',
};

export default function App() {
  const responseListenerRef = useRef<ReturnType<typeof addNotificationResponseListener>>();

  useEffect(() => {
    setupNotifications();

    responseListenerRef.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.contentUrl) {
        Linking.openURL(`https://treasurestate.com${data.contentUrl}`);
      }
    });

    return () => {
      responseListenerRef.current?.remove();
    };
  }, []);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          const route = state.routes[state.index];
          if (route) trackScreenView(route.name);
        }
      }}
    >
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>{TAB_ICONS[route.name] || '📍'}</Text>
          ),
          tabBarActiveTintColor: '#3b6978',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerStyle: { backgroundColor: '#2c3e50' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '700' },
        })}
      >
        <Tab.Screen name="Nearby" component={NearbyScreen} options={{ title: 'Nearby' }} />
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
        <Tab.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
